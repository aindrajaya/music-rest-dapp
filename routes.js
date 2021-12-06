const shortid = require('shortid')
const IPFS = require('ipfs-api') //call the ipfs api function

//Configure the ipfs instance
const ipfs = IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

//Adding the contract intances and ipfs nodes
function routes(app, dbe, lms, accounts){
  //configure the database collection
  let db = dbe.collection('music-users') //for storing the users collection
  let music = dbe.collection('music-store') //for storing the music collection

  //Register Endpoint
  app.post('/register', (req, res) => {
    let email = req.body.email
    let idd = shortid.generate()
    if(email){
      db.findOne({email}, (err, doc) => {
        if(doc){
          res.status(400).json({
            "status": "Failed",
            "reason": "Already registered"
          })
        } else {
          db.insertOne({email})
          res.json({
            "status": "success",
            "id": idd
          })
        }
      })
    } else {
      res.status(400).json({
        "status": "Failed",
        "reason": "wrong input"
      })
    }
  })

  //Login Endpoint
  app.post('/login', (req, res) => {
    let email = req.body.email
    if(email){
      db.findOne({email}, (err, doc) => {
        if(doc){
          res.json({
            "status":"success",
            "id": doc.id
          })
        } else {
          res.satus(400).json({
            "status": "Failed",
            "reason": "Not recognised"
          })
        }
      })
    } else {
      res.status(400).json({
        "status": "Failed",
        "reason":"wrong input"
      })
    }
  })
  
  //Upload Endpoint
  app.post('/upload', async (req, res) => {
    let buffer = req.body.buffer
    let name = req.body.name
    let title = req.body.title
    let id = shortid.generate() + shortid.generate() //add the id generator
    if(buffer && title){
      //the integration process with web3
      let ipfsHash = await ipfs.add(buffer)
      let hash = ipfsHash[0].hash
      //calling the sendIPFS method
      lms.sendIPFS(id, hash, {
        from: accounts[0]
      }).then((_hash, _address) => {
        //Process to insert music with has to the ipfs store data
        music.insertOne({
          id, 
          hash, 
          title, 
          name
        })
        res.json({
          "status": "success",
          id
        })
      })
      //Error handling when uploading
      .catch(err => {
        res.status(500).json({
          "status": "Failed",
          "reason": "Upload error occured"
        })
      })
    } else {
      res.status(400).json({
        "status": "Failed",
        "reason": "wrong input"
      })
    }
  })

  //Access endpoint, for specific email
  app.get('/access/:email', (req,res) => {
    //Process, add some logic and conditional
    if(req.params.email){
      //Find the same email
     
    } else {
      //When error occured
    
    }
  })

  //Access endpoint, for specific music id
  app.get('/access/email/:id', (req,res) => {
    if(req.params.id && req.params.email){
      //do something
    } else {
      res.status(400).json({
        "status": "Failed",
        "reason": "wrong input"
      })
    }
  })

  //Access endpoint, for entire library
}

module.exports = routes