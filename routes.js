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

  //Access endpoint, for specific music id

  //Access endpoint, for entire library
}