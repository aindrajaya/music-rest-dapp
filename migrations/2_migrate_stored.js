var IPFSStored = artifacts.require("./contracts/StoredMusic.sol")
module.exports = function(deployer){
  deployer.deploy(IPFSStored)
}