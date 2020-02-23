//user.js
const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/users', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})

router.get('/users/filter', auth, async(req, res) => {
    // View logged in user profile
    var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URL;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
  //Find all documents in the customers collection:
  var text = "";
  var filterList = [];

  db.db().collection("users").find({}).toArray(function(err, result) {
    if (err) throw err;
    for (var i=0; i < result.length; i++) {
      text += result[i].name + "<br>";
      console.log(text);
      var age = result[i].age;
      if(age!=null&&age>100){
        filterList.push({name: result[i].name, age: age});
      }
      if(i==result.length-1){
        res.send(JSON.stringify(filterList));
      }
    }
    db.close();
  });

});
})

module.exports = router
