var MattCoin = artifacts.require("MattCoin");

contract('MattCoin', function(accounts) {

	it('initializes the contract with the correct values', function() {
		return MattCoin.deployed().then(function(instance) {
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name) {
			assert.equal(name, 'MattCoin', 'has correct name');
			return tokenInstance.symbol();
		}).then(function(symbol) {
			assert.equal(symbol, 'MCN', 'has correct symbol');
			return tokenInstance.standard();
		}).then(function(standard) {
			assert.equal(standard, 'MattCoin v1.0', 'has correct standard');
		});
	});

	it('allocates the total supply upon deployment', function() {
		return MattCoin.deployed().then(function(instance) {
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
		return MattCoin.deployed().then(function(instance) {
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
		return MattCoin.deployed().then(function(instance) {
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
			assert.equal(receipt.logs[0].args._value, 2500000, 'logs the transfer amount');			
		})
	});
});