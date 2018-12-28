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
  let tempObj = {age: 29, job: 'street fighter', hobbies: ['fighting', 'rivalry with Ken', 'shoppign for gis', 'training']};
  res.render('profile', {person: req.params.name, tempObj: tempObj});
});

app.listen(3000);
