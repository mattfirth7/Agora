const Agorae = artifacts.require("Agorae");

module.exports = function (deployer) {
  deployer.deploy(Agorae, 10000000);
};
