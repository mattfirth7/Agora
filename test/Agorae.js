var Agorae = artifacts.require("Agorae");

contract('Agorae', function(accounts) {

	it('initializes the contract with the correct values', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name) {
			assert.equal(name, 'Agorae', 'has correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol, 'AGRA', 'has correct symbol');
			return tokenInstance.standard();
		}).then(function(standard) {
			assert.equal(standard, 'Agorae v1.0', 'has correct standard');
		});
	});

	it('allocates the total supply upon deployment', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), 10000000, 'sets the total supply to 1,000,000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance) {
			assert.equal(adminBalance.toNumber(), 10000000, 'it allocates the initial supply to the admin account');
		});
	});

	it('transfers ownership', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			// Test 'require' statement first by transferring something larger than the sender's balance
			return tokenInstance.transfer.call(accounts[1], 999999999999);
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tokenInstance.transfer.call(accounts[1], 2500000, { from: accounts[0] });
		}).then(function(success) {
			assert.equal(success, true, 'it returns true');
			return tokenInstance.transfer(accounts[1], 2500000, { from: accounts[0] });
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', '"Transfer" event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, 2500000, 'logs the transfer amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 2500000, 'adds the amount to receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 7500000, 'deducts the amount from sending account');
		});
	});

	it('approves tokens for delegated transfer', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.approve.call(accounts[1], 100);
		}).then(function(success) {
			assert.equal(success, true, 'returns true');
			return tokenInstance.approve(accounts[1], 100);
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Approval', '"Approval" event');
			assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
			assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
			assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');	
			return tokenInstance.allowance(accounts[0], accounts[1]);		
		}).then(function(allowance) {
			assert.equal(allowance, 100, 'stores the allowance for delegated transfer');
		});
	});

	it('handles delegated token transfers', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			fromAccount = accounts[2];
			toAccount = accounts[3];
			spendingAccount = accounts[4];
			// Transfer some tokens to fromAccount
			return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
		}).then(function(receipt) {
			// Approve spendingAccount to spend 10 tokens from fromAccount
			return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
		}).then(function(receipt) {
			// Try transferring something larger than the sender's balance
			return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
			// Try transferring something larger than the approved amount
			return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
			return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
		}).then(function(success) {
			assert.equal(success, true);
			return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', '"Transfer" event');
			assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
			assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to');
			assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');	
			return tokenInstance.balanceOf(fromAccount);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
			return tokenInstance.balanceOf(toAccount);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 10, 'adds the amount to receiving account');
			return tokenInstance.allowance(fromAccount, spendingAccount);
		}).then(function(allowance) {
			assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
		});
	});

	it('creates stake for posts', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.stake.call(100000000000000, 'test', 1, 1);
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tokenInstance.stake.call(1, 'test', 1, 1, { from: accounts[2] });
		}).then(function(success) {
			assert.equal(success, true, 'returns true');
			return tokenInstance.stake(10, 'test', 1, 0, { from: accounts[2] });
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', '"Transfer" event');
			assert.equal(receipt.logs[0].args._from, accounts[2], 'logs the account the tokens are staked by');
			assert.equal(receipt.logs[0].args._to, accounts[0], 'logs the tokens are sent to the admin account');
			assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
			return tokenInstance.stakes(accounts[2], 'test', 0);
		}).then(function(stake) {
			assert.equal(stake.toNumber(), 10, 'sets the initial stake to the transfer amount');
			return tokenInstance.stakes(accounts[2], 'test', 1);
		}).then(function(upvotes) {
			assert.equal(upvotes.toNumber(), 1, 'sets initial upvote count to 1');
			return tokenInstance.stakes(accounts[2], 'test', 2);
		}).then(function(comments) {
			assert.equal(comments.toNumber(), 0, 'sets initial comment count to 0');
			return tokenInstance.balanceOf(accounts[2]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 80, 'deducts the staked amount from the staking account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance) {
			assert.equal(balance.toNumber(), 7499910, 'adds the staked amount to the admin account');
		});
	});

	it('updates the upvote count', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.upvote.call(accounts[2], 'test');
		}).then(function(success) {
			assert.equal(success, true, 'returns true');
			return tokenInstance.upvote(accounts[2], 'test');
		}).then(function() {
			return tokenInstance.stakes(accounts[2], 'test', 1);
		}).then(function(upvotes) {
			assert.equal(upvotes, 2, 'Increases upvotes');
			return tokenInstance.totalUpvotes();
		}).then(function(upvotes) {
			assert.equal(upvotes, 2, 'Increases total upvotes');
		});
	});

	it('updates the comment count', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.comment.call(accounts[2], 'test');
		}).then(function(success) {
			assert.equal(success, true, 'returns true');
			return tokenInstance.comment(accounts[2], 'test');
		}).then(function() {
			return tokenInstance.stakes(accounts[2], 'test', 2);
		}).then(function(comments) {
			assert.equal(comments, 1, 'Increases comment count');
		});
	});

	it('updates the stake', function() {
		return Agorae.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.updateStake.call(accounts[2], 'test');
		}).then(function(success) {
			assert.equal(success, true, 'returns true');
			return tokenInstance.updateStake(accounts[2], 'test');
		}).then(function() {
			return tokenInstance.stakes(accounts[2], 'test', 0);
		}).then(function(stake) {
			assert.equal(stake, 2, 'Updates stake');
		});
	});

});