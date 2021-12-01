const IPFSStored = artifacts("./contracts/StoredMusic.sol")

contract("IPFSStored test", accounts => {
  //declatre the test
  it("emit event when you send a ipfs address", async () => {
    await console.log(accounts)
    //1. Call and wait for the contract
    //2. Set the variable to false and get event listener
    //3. Call the contract function which sends ipfs address
  })
})