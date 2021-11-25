const shortid = require('shortid')
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
  
  //Upload Endpoint

  //Access endpoint, for specific music id

  //Access endpoint, for entire library
}