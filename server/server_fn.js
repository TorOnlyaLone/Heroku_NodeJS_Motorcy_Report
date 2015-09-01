/* global module, require */

var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;

function test_connection(url_mongodb,db_name,collection_name,callback){
  MongoClient.connect(url_mongodb + db_name, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log("Connect correctly server");
      //console.log(db.listCollections());
      var collection = db.collection(collection_name);
      console.log("Connect correctly COLLECTION");
      db.close();
    }
    callback();
  });
}

function find_document(url_mongodb,db_name,collection_name,query,projection,callback2){
  var findDocuments = function (db, callback) {
    var collection_con = db.collection(collection_name);
    collection_con.find(query,projection).toArray(function (err, docs) {
        console.log("Query Document");
        callback(docs);
    });
  };

  MongoClient.connect(url_mongodb + db_name, function (err, db) {
    findDocuments(db, function (docs) {
      var arr_docs = docs;
//      console.log("Result : " + arr_docs);
      db.close();
      console.log("_________________________");
      console.log("");
      callback2(arr_docs);
    });
  });
}

function find_document_sort(url_mongodb,db_name,collection_name,query,projection,sort,callback2){
  var findDocuments = function (db, callback) {
    var collection_con = db.collection(collection_name);
    collection_con.find(query,projection).sort(sort).toArray(function (err, docs) {
        console.log("Query Document");
        callback(docs);
    });
  };

  MongoClient.connect(url_mongodb + db_name, function (err, db) {
    findDocuments(db, function (docs) {
      var arr_docs = docs;
//      console.log("Result : " + arr_docs);
      db.close();
      console.log("_________________________");
      console.log("");
      callback2(arr_docs);
    });
  });
}

function update_obj(url_mongodb,db_name, collection_name, query, update, optional,callback2) {
  var updateDocuments = function (db, callback) {
    var collection_con = db.collection(collection_name);
    collection_con.update(query, update, optional, function (err, result) {
      console.log("Upsert 1 document");
      callback(result);
    });
  };
  MongoClient.connect(url_mongodb + db_name, function (err, db) {
    updateDocuments(db, function (result) {
      console.log("Result : " + result);
      db.close();
      console.log("_________________________");
      console.log("");
      callback2();
    });
  });
}

function insert_arr_object(url_mongodb,db_name,collection_name,arr_object,optional,callback2){
  var insertDocuments = function (db, callback) {
    var collection_con = db.collection(collection_name);
    collection_con.insert(arr_object,optional, function (err, result) {
      console.log("Insert Array document");
      callback(result);
    });
  };

  MongoClient.connect(url_mongodb + db_name, function (err, db) {
    insertDocuments(db, function (result) {
      console.log("Result : " + JSON.stringify(result));
      db.close();
      console.log("_________________________");
      console.log("");
      callback2();
    });
  });
}

function delete_object(url_mongodb,db_name,collection_name,query,optional,callback2){
  var removeDocument = function(db, callback) {
    var collection = db.collection(collection_name);
    collection.remove(query,optional, function(err, result) {
      console.log("Removed the document");
      callback(result);
    });
  }

  MongoClient.connect(url_mongodb + db_name, function (err, db) {
    removeDocument(db, function (result) {
      console.log("Result : " + JSON.stringify(result));
      db.close();
      console.log("_________________________");
      console.log("");
      callback2();
    });
  });
}

function replace_all(str, replaceWhat, replaceTo) {
  replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  //    var re = new RegExp(replaceWhat, 'g'); /*case sensitive*/
  var re = new RegExp(replaceWhat, 'gi'); /*case insensitive*/
  str = str.replace(re, replaceTo);
  return str;
}

function cast_unicode_html_notation(unicode_str) {
  var output = unicode_str.replace(/&#x[0-9A-Fa-f]+;/g,
    function (htmlCode) {
      var codePoint = parseInt(htmlCode.slice(3, -1), 16);
      return String.fromCharCode(codePoint);
    });
    return output;
  }

  module.exports = {
    test_connection : test_connection,
    insert_arr_object : insert_arr_object,
    find_document : find_document,
    delete_object : delete_object,
    update_obj : update_obj,
    find_document_sort : find_document_sort
  };
