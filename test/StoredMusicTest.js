const IPFSStored = artifacts("./contracts/StoredMusic.sol")

contract("IPFSStored test", accounts => {
  //declatre the test
  it("emit event when you send a ipfs address", async () => {
    //1. Call and wait for the contract
    const ipfsStored = await IPFSStored.deployed()

    //2. Set the variable to false and get event listener
    eventEmitted = false
    await ipfsStored.ipfsSent((err, res) => {
      eventEmitted=true
    })
    //3. Call the contract function which sends ipfs address
  })
})