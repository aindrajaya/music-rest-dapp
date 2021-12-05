const shortid = require('shortid')
const IPFS = require('ipfs-api') //call the ipfs api function

//Configure the ipfs instance
const ipfs = IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

function routes(app, db){
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
  app.post('/upload', (req, res) => {
    let buffer = req.body.buffer
    let name = req.body.name
    let title = req.body.title
    if(buffer && title){
      //do something
    } else {
      res.status(400).json({
        "status": "Failed",
        "reason": "wrong input"
      })
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