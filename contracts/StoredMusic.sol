// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Stored {
 //Structure
 mapping(string => string) public ipfsStored;

 //Events
 event ipfsSent(string _ipfsHash, string _address);
 event storedResponse(string response);
  
 //Modifiers
 modifier notFull(string memory _string){
   bytes memory stringTest = bytes(_string);
   require(stringTest.length == 0);
   _;
 }

 //An emty Constructor
 constructor() {}

 //Function 1 - sendIPFS
 function sendIPFS(string memory _address, string memory _ipfsHash) 
 notFull(ipfsStored[_address]) public {
   ipfsStored[_address] = _ipfsHash;
   emit ipfsSent(_ipfsHash, _address);
 }
}
