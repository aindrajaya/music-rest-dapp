var IPFSStored = artifacts.require("Stored.sol")
module.exports = function(deployer){
  deployer.deploy(IPFSStored)
}