var Adoption = artifacts.require("Adoption") //Even if we dont specify the path truffle will find Adoption contract just by its name
module.exports = function(deployer) {
  // Use deployer to state migration tasks.
  deployer.deploy(Adoption)
};
