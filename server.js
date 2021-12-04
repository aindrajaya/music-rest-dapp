require('dotenv').config()
const express=require('express')
const app = express()
const routes = require('./routes')
const Web3 = require('web3')
const mongodb = require('mongodb').MongoClient
const contract = require('truffle-contract')

//add the contract instance
const artifacts = require('./build/Stored.json')

/**
 * express.json() is a method to recognize the incoming Request Object as JSON Object
 */
app.use(express.json())

//Make sure to check the web3 interface ready
if(typeof web3 !== 'undefined'){
  var web3 = new Web3(web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('https://localhost:8545'))
}

//save the contracts interface with named LMS variable
const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)

//database connection
mongodb.connect(process.env.DB, {
  useUnifiedTopology: true
}, async (err, client) => {
  const db = client.db('jayakatwang')
  
  //Connect to the contract interfaces
  const accounts = await web3.eth.getAccounts();
  const lms = await LMS.deployed();
  //const lms = LMS.at(contract_address)

  //home dir
  routes(app, db)
  app.listen(process.env.PORT || 8082, () => {
    console.log('listening on port 8082')
  })
})