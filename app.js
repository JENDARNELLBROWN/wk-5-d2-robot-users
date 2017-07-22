
const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");
app.use(express.static('public'));
//var data = require('./data');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url= "mongodb://localhost:27017/robot";

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server.");
//   db.close();
// });

// var insertDocument = function (db, callback) {
//   db.collection('robots').insertMany(
//     data.users
//     , function (err, result) {
//       assert.equal(err, null);
//       console.log("Inserted a document into the robots collection.");
//       callback();
//     });
// };


// MongoClient.connect(url, function (err, db) {
//   assert.equal(null, err);
//   insertDocument(db, function () {
//     db.close();
//   });
// });


// var removeDocuments = function (db, callback) {
//   db.collection('robots').deleteMany(
//     { },
//     function (err, results) {
//       console.log(results);
//       callback();
//     }
//   );
// };

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);

//   removeDocuments(db, function() {
//       db.close();
//   });
// });

var findDocuments = function (db, callback) {
  var cursor = db.collection('robots').find();
  var docs = [];
  cursor.each(function (err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      docs.push(doc);
    } else {
      callback(docs);
    }
  });
};

app.get("/", function (req, res) {

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    findDocuments(db, function (data) {
      db.close();
      res.render("index", { users: data });
    });
  });
});

app.get("/employed", function (req, res) {

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    findDocuments(db, function (data) {
      db.close();
      res.render("index", { users: data });
    }, {"job": {$ne: null}});
  });
});

  app.get("/unemployed", function (req, res) {

  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    findDocuments(db, function (data) {
      db.close();
      res.render("index", { users: data });
    }, {"job": null});
  });
});

app.get("/:id", function (req, res) {
  var id = + req.params.id;
  if (id > 0) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);

      findDocumentByID(db, function (retdoc) {
        db.close();
        res.render("directory", { users: retdoc });
      }, id);
    });
  }
});

var findDocumentByID = function (db, callback, id) {
  var cursor = db.collection('robots').find({ "id": id });
  cursor.each(function (err, doc) {
    assert.equal(err, null);
    if (doc != null)
      callback(doc);
  });
};

var findDocuments = function (db, callback, searchinfo) {
  var cursor = db.collection('robots').find(searchinfo);
  var docs = [];
  cursor.each(function (err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      docs.push(doc);
    } else {
      callback(docs);
    }
  });
};

app.listen(3000, function () {
  console.log("App running on local host:3000");
});