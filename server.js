require('dotenv').config()
const express=require('express')
const app = express()
const routes = require('./routes')
const Web3 = require('web3')
const mongodb = require('mongodb').MongoClient
const contract = require('truffle-contract')

/**
 * express.json() is a method to recognize the incoming Request Object as a JSON Object
 */
app.use(express.json())

//database connection
mongodb.connect(process.env.DB, {
  useUnifiedTopology: true
}, (err, client) => {
  const db = client.db('jayakatwang')
  //home dir
  routes(app, db)
  app.listen(process.env.PORT || 8082, () => {
    console.log('listening on port 8082')
  })
})