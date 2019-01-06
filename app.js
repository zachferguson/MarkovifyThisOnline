const express = require('express');
const Datastore = require('nedb');
const bodyParser = require('body-parser');

const app = express();

app.use('/assets', express.static('assets'));

let urlencodedParser = bodyParser.urlencoded({ extended: false });

const inspectors = new Datastore({filename: './db/inspectors.db', autoload: true});
const companies = new Datastore({filename: './db/companies.db', autoload: true});

function newCompany(company, addressmain, addresssecondary, city, usstate, zip, phone, username, pw, first, last, email) {
  let uq = company.toLowerCase() + zip;
  let compVar = {unique: uq, company: company, addressMain: addressmain, addressSecondary: addresssecondary, city: city, USstate: usstate, zipCode: zip, phoneNumber: phone, userName: username, pw: pw, adminFirstName: first, adminLastName: last, level: '', inspectors: [], expiration: {}, verified: false, email: email};

  companies.findOne({unique: uq}, function(err, verify) {
    if (err) {
      console.log(err);
      return;
    }
    if (verify != null) {
      if (uq == verify.unique) {
        console.log('company already exists');
        return;
      }
    }
    else {
      companies.insert(compVar, function(err, data) {
        console.log('created: ' + data.company);
        console.log('Administrator: ' + data.adminFirstName + ' ' + data.adminLastName);
        console.log('User Name: ' + data.userName + ', Password: ' + data.pw);
        console.log('Address: ' + data.addressMain);
        console.log('         ' + data.city + ', ' + data.USstate + ' ' + data.zipCode);
        console.log('Phone Number: ' + data.phoneNumber);
        console.log('E-Mail: ' + data.email);
      })
    }
  });
}

function newUser (userName, passWord, firstName, lastName, compan, eMail, typ, iid) {
  let userVar = {username: userName, pw: passWord, firstname: firstName, lastname: lastName, companyID: compan, email: eMail, type: typ, inspectorID: iid};
  inspectors.findOne({username: userName}, function(err, verify) {
    if (err) {
      console.log(err);
      return;
    }
    if (verify != null) {
      if (userName == verify.username) {
        console.log('user already exists');
        return;
      }
    }
    else {
      inspectors.insert(userVar, function(err, data) {
        console.log('created' + data.type + ': ' + data.username + ', ' + data.firstname + ' ' + data.lastname + ', email: ' + data.email + ', password: ' + data.pw);
      });
    }
  });
}

function logInCheck(userName, passWord) {
  users.findOne({username: userName}, function(err, data) {
    if (err) {
      console.log('username incorrect.');
    }
    if (passWord != data.pw) {
      console.log('password incorrect');
    }
    else {
      console.log('welcome, ' + data.username);
    }
  });
}

//newUser('zachferguson', 'pants47', 'Zach', 'Ferguson', 'AETechnologies', 'zach.ferguson@yahoo.com', 'inspector', null);
//newUser('purplePeopleEater', 'password', 'Purple', 'Eater', 'PPE Inc', 'ppe@ppeinc.com', 'inspector', null);
//logInCheck('zachferguson', 'pants47');
newCompany('AETechnologies', '1082 School House Rd.', '', 'Harveys Lake', 'PA', '18618', '5706392344', 'zachferguson', 'adminPassword', 'Zach', 'Ferguson', 'zach.ferguson@yahoo.com');

app.set('view engine', 'ejs');


// PAGE ROUTING
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/contact', function(req, res){
  res.send('this is the contact page');
});


// THIS IS HOW ALL SHOULD BE
app.get('/companysignup', function(req, res){
  res.sendFile(__dirname + '/companysignup.html');
});

app.get('/profile/:name', function(req, res){
  let tempObj = {age: 29, job: 'street fighter', hobbies: ['fighting', 'rivalry with Ken', 'shopping for gis', 'training']};
  res.render('profile', {person: req.params.name, tempObj: tempObj});
});

// POST HANDLING
app.post('/companysignup', urlencodedParser, function (req, res) {

  // assumes the company info is all already used: company, username, email, and phone number
  let existing = {checkCompanyName: true, checkUserName: true, checkEmail: true, checkPhone: true};

  function registrationDecision (inval) {
    // checks whether any of the company information already exists.

    // ******* ADD TO FAILURE PAGE REASON FOR FAILURE *******

    if (Object.values(inval).includes(true)) {
      console.log('something already existed...');
      console.log(inval);
      res.sendFile(__dirname + '/failedaccountcreation.html');
    }
    else {
      newCompany(req.body.companyName,
        req.body.companyAddressPrimary,
        req.body.companyAddressSecondary,
        req.body.companyCity,
        req.body.companyState,
        req.body.companyZip,
        req.body.companyAreaCode + req.body.companyPhone,
        req.body.companyUserName,
        req.body.companyPassword,
        req.body.companyFirstName,
        req.body.companyLastName,
        req.body.companyEmail);
      res.sendFile(__dirname + '/emailconfirmation.html');
    }
  }
  // company name verification promise
  let checkCompanyName = new Promise((resolve, reject) => {
    companies.findOne({company: req.body.companyName}, function(err, verify) {
      if (verify != null && verify.company == req.body.companyName) {
        console.log('');
        console.log('company ' + verify.company + ' already exists.');
      }
      else {
        existing['checkCompanyName'] = false;
      }
      resolve(verify);
    });
  })
  // username verification Promise
  let checkUserName = new Promise((resolve, reject) => {
    companies.findOne({company: req.body.companyUserName}, function(err, verify) {
      if (verify != null && verify.userName == req.body.companyUserName) {
        console.log('');
        console.log('username ' + verify.userName + ' already exists.');
      }
      else {
        existing['checkUserName'] = false;
      }
      resolve(verify);
    });
  })

  // email verification promise
  let checkEmail = new Promise((resolve, reject) => {
    companies.findOne({company: req.body.companyEmail}, function(err, verify) {
      if (verify != null && verify.email == req.body.companyEmail) {
        console.log('');
        console.log('email address ' + verify.email + ' already in use.');
      }
      else {
        existing['checkEmail'] = false;
      }
      resolve(verify);
    });
  })

  //phonenumber verification Promise
  let checkPhoneNumber = new Promise((resolve, reject) => {
    companies.findOne({company: req.body.companyAreaCode + req.body.companyPhone}, function(err, verify) {
      if (verify != null && verify.userName == req.body.companyUserName) {
        console.log('');
        console.log('phone number ' + verify.phoneNumber+ ' already in use.');
      }
      else {
        existing['checkPhone'] = false;
      }
      resolve(verify);
    });
  })

  checkCompanyName.then(
    checkUserName.then(
      checkEmail.then(
        checkPhoneNumber.then( function () {
          registrationDecision(existing);
        }))));

  /*
  newCompany(req.body.companyName, req.body.companyAddressPrimary, req.body.companyAddressSecondary, req.body.companyCity, req.body.companyState, req.body.companyZip, req.body.companyAreaCode + req.body.companyPhone, req.body.companyUserName, req.body.companyPassword, req.body.companyFirstName, req.body.companyLastName);
  console.log('New company ' + req.body.companyName + ' created from website.');
  */
})

app.listen(3000);
