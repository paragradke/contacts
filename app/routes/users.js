var randomstring = require("randomstring");
var csv = require("csv");
var multer = require("multer");
const { check, validationResult } = require('express-validator/check');

//var Busboy = require('busboy');
var upload = multer({ inMemory: true}).single('csvfile');
let sessionUser = null;

module.exports = function(app, db) {

    var tokenValidetor = function(req, res, next) {
        // Put the preprocessing here.
        var sessionToken = req.headers['token'];
        const token = {token: sessionToken};  
        db.collection('tokens').findOne(token, (err, item) => {
            if (err) {
              res.send({'error' : 'Your session is expired or not a valid user'});
            } else {
                if (item) {
                    sessionUser = item.user;
                    next();
                } else {
                    res.send({'error' : 'Your session is expired or not a valid user'});
                }
            } 
          });
    };

    app.post('/signup', [
        check('email').isEmail().withMessage('must be an email'), 
        check('password', 'passwords must be at least 5 chars long and contain one number').isLength({ min: 5 }).matches(/\d/)
        ], (req, res) => {
        const errors = req.validationErrors();//validationResult(req);
        console.log(errors);
        if (errors) {
            // There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`
            res.send(errors);
            return;
        }
        // You'll create your note here.
        console.log(req.body);
        const user = { email: req.body.email };
        db.collection('users').findOne(user, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
              } else {
                  if (item) {
                    res.send({'error':'User with this email already exist'});
                  } else {
                    const createUser = { email: req.body.email, password: req.body.password, contacts : [] };
                    db.collection('users').insert(createUser, (err, result) => {
                        if (err) { 
                          res.send({ 'error': 'An error has occurred while creating user.' }); 
                        } else {
                          res.send(result.ops[0]);
                        }
                      });
                  }
              }
        });
      });

    app.post('/login', [
            check('email').isEmail().withMessage('must be an email'), 
            check('password', 'passwords must be at least 5 chars long and contain one number').isLength({ min: 5 }).matches(/\d/)
            ], (req, res) => {
        // You'll create your note here.
        const errors = req.validationErrors();//validationResult(req);
        console.log(errors);
        if (errors) {
            // There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`
            res.send(errors);
            return;
        }
        const user = { email: req.body.email, password: req.body.password };
        db.collection('users').findOne(user, (err, item) => {
            if (err) {
              res.send({'error':'An error has occurred'});
            } else {
              //const details = { '_id': item._id };
              const token = { token : randomstring.generate(12), item };
              db.collection('tokens').insert(token, (err, result) => {
                if (err) { 
                  res.send({ 'error': 'An error has occurred while creating user.' }); 
                } else {
                  res.send(result.ops[0]);
                }
              });
            } 
          });
      });

    
    app.post('/upload', [
        check('contacts').exists().withMessage('contacts field is mandetory')
        ], tokenValidetor, (req, res) => {
        // You'll create your note here. 
        const errors = req.validationErrors();//validationResult(req);
        console.log(errors);
        if (errors) {
            // There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`
            res.send(errors);
            return;
        }
        console.log(req.body);
        console.log(req.files);
        
        csv().from.path(req.files.contacts.file, {
            delimiter: ",",
            escape: '"'
        })
        .on("record", function(row, index) {
            var firstName, lastName, email, phone;
            // skip the header row
            if (index === 0) {
                return;
            }
            // read in the data from the row
            firstName = row[0].trim();
            lastName = row[1].trim();
            email = row[2].trim();
            phone = row[3].trim();
            const contact = { firstName : firstName, lastName: lastName, email : email, phone : phone };
            console.log(contact);
            db.collection("users").update(
                sessionUser,
                { "$addToSet" : { "contacts" :  contact } }
            );
        })
        .on("end", function() {
            // redirect back to the root
            res.send({"success" : "File upload was successful"});
        })
        // if any errors occur
        .on("error", function(error) {
            console.log(error.message);
            res.send({"error" : error.message});
        });
      });
      

      app.get('/contacts', tokenValidetor, (req, res) => {
        // You'll create your note here.
        console.log(sessionUser);
        db.collection("users").findOne(
            sessionUser,
            (err, result) => {
                if (err) { 
                  res.send({ 'error': 'An error has occurred while creating user.' }); 
                } else {
                  res.send(result.contacts);
                }
            }
        );
      });


      app.post('/search', [
            check('firstName').exists().withMessage('contacts field is mandetory'),
            check('lastName').exists().withMessage('contacts field is mandetory')
        ], 
        tokenValidetor, (req, res) => {
            
        const errors = req.validationErrors();//validationResult(req);
        console.log(errors);
        if (errors) {
            // There are errors. Render form again with sanitized values/errors messages.
            // Error messages can be returned in an array using `errors.array()`
            res.send(errors);
            return;
        }
        // You'll create your note here.
        console.log(sessionUser);
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const contacts = [];
        //const query  = { { _id : sessionUser._id} , { "contacts": {$elemMatch: {firstName:firstName, lastName: lastName}}};
        db.collection("users").findOne(
           // {sessionUser,  "contacts": {$elemMatch: {firstName:firstName, lastName: lastName}}},
           sessionUser,
            (err, result) => {
                if (err) { 
                  res.send({ 'error': 'An error has occurred while searching for a contact.' }); 
                } else {
                  result.contacts.forEach(function (item) {
                     if (item.firstName == firstName && item.lastName == lastName) {
                        contacts.push(item);
                     }
                  });
                  res.send(contacts);
                }
            }
        );
      });
};