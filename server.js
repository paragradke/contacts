const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const db             = require('./config/db');
var busboy = require('connect-busboy');
var bb = require('express-busboy');
var validator = require('express-validator');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(validator());
bb.extend(app, {
    upload: true,
    path: './upload',
    allowedPath: /./
});









const port = 3000;

MongoClient.connect(db.url, (err, client) => {
    if (err) return console.log(err)

    var db = client.db('assignment');
    db.collection("tokens").createIndex( { "lastModifiedDate": 1 }, { expireAfterSeconds: 3600 } );
    require('./app/routes')(app, db);
    app.listen(port, () => {
        console.log('Server is running on port : ' + port);
      });              
  })
