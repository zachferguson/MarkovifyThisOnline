let express = require('express');
let app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.send('this is the home page');
});

app.get('/contact', function(req, res){
  res.send('this is the contact page');
});

app.get('/profile/:name', function(req, res){
  res.render('profile');
});
