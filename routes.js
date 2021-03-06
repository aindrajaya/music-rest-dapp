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
      db.findOne({
        email: req.body.email
      }, (err,doc) => {
        //Make conditionals that find and get the music
        if(doc){
          let data = music.find().toArray()
          res.json({
            "status": "success", 
            data
          })
        }
      })
    } else {
      //When error occured
      res.status(400).json({
        "status": "Failed",
        "reason": "wrong input"
      })
    }
  })

  //Access endpoint, for specific music id
  app.get('/access/email/:id', (req,res) => {
    let id = req.params.id //declare the id
    if(req.params.id && req.params.email){
      //Find from the database
      db.findOne({
        email: req.body.email
      }, (err, doc) => {
        // Conditional to getHash by id
        if(doc){
          lms.getHash(id, {from: accounts[0]}) //called the getHash function from contract instance
          .then(async(hash) => {
            let data = await ipfs.files.get(hash)
            res.json({
              "status": "success",
              data: data.content
            })
          })
        } else {
          //Error handling
          res.satus(400).json({
            "status": "Failed",
            "reason": "wrong input"
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
}

module.exports = routes