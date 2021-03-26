const MattCoin = artifacts.require("MattCoin");

module.exports = function (deployer) {
  deployer.deploy(MattCoin);
};
