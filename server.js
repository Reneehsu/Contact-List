const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const Contact = require('./models/contact');

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.json())

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/all',function(req,res){
  Contact.find(function(err,contacts){
    if(err){
      res.send(err);
    } else {
      res.json(contacts);
    }
  })
})

app.post('/add',function(req,res){
  const newContact = new Contact({
    name: req.body.name,
    phone: req.body.phone,
    birthday: req.body.birth
  });
  newContact.save(function(err,savedContact){
    if(err){
      res.send(err);
    } else {
      res.json(savedContact);
    }
  })
})

app.post('/delete',function(req,res){
  Contact.findOneAndRemove({'_id':req.body.id},function(err){
    if (err){
      res.send(err);
    } else {
      res.json({success: true});
    }
  })
})

app.post('/edit',function(req,res){
  Contact.findOneAndUpdate({'_id':req.body.id},{name:req.body.name, phone:req.body.phone, birthday:req.body.birth},function(err){
    if(err){
      res.send(err);
    } else {
      res.json({success:true});
    }
  })
})

// DO NOT REMOVE THIS LINE :)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 1337);
