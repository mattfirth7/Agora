var MattCoin = artifacts.require("MattCoin");

contract('MattCoin', function(accounts) {

	it('sets the total supply upon deployment', function() {
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
});