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

function cast_arr_obj_word_to_arr(arr_store_word,arr_obj_word){
  for(var i = 0;i<arr_obj_word.length;i++){
    arr_store_word.push(arr_obj_word[i].word);
  }
};

function word_segmentation(input_string,arr_store_word,callback){
  var array_object_stat = [];
  var index_word = 1;

  var input_string = input_string;

  function segment_by_array(array_length) {
    for (var j = 0; j < array_length.length; j++) {
      var find = array_length[j];
      if (input_string.search(new RegExp(find, "i")) !== -1) {
        input_string = replace_all(input_string, find, "{{" + index_word + "}}");
        array_object_stat.push({"index_w": index_word, "word": find});
        ++index_word;
      }
    }
  }
  segment_by_array(arr_store_word);

  for(var j = 0; j < array_object_stat.length; j++){
    var find = "{{"+array_object_stat[j].index_w+"}}";
    input_string = replace_all(input_string,find,array_object_stat[j].word+" | ");
  }
  callback(input_string);
}

function segment_str(input_string,url_localdict,url_thaidict,callback){
  var arr_store_word = [];
  find_document(url_localdict,"motorcycle","local_dict",{ length : 14 },{ _id:0,length:0 },function(arr_word){
    cast_arr_obj_word_to_arr(arr_store_word,arr_word);
    find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 14 },{ _id:0,length:0 },function(arr_word){
      cast_arr_obj_word_to_arr(arr_store_word,arr_word);
      find_document(url_localdict,"motorcycle","local_dict",{ length : 13 },{ _id:0,length:0 },function(arr_word){
        cast_arr_obj_word_to_arr(arr_store_word,arr_word);
        find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 13 },{ _id:0,length:0 },function(arr_word){
          cast_arr_obj_word_to_arr(arr_store_word,arr_word);
          find_document(url_localdict,"motorcycle","local_dict",{ length : 12 },{ _id:0,length:0 },function(arr_word){
            cast_arr_obj_word_to_arr(arr_store_word,arr_word);
            find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 12 },{ _id:0,length:0 },function(arr_word){
              cast_arr_obj_word_to_arr(arr_store_word,arr_word);
              find_document(url_localdict,"motorcycle","local_dict",{ length : 11 },{ _id:0,length:0 },function(arr_word){
                cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 11 },{ _id:0,length:0 },function(arr_word){
                  cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                  find_document(url_localdict,"motorcycle","local_dict",{ length : 10 },{ _id:0,length:0 },function(arr_word){
                    cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                    find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 10 },{ _id:0,length:0 },function(arr_word){
                      cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                      find_document(url_localdict,"motorcycle","local_dict",{ length : 9 },{ _id:0,length:0 },function(arr_word){
                        cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                        find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 9 },{ _id:0,length:0 },function(arr_word){
                          cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                          find_document(url_localdict,"motorcycle","local_dict",{ length : 8 },{ _id:0,length:0 },function(arr_word){
                            cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                            find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 8 },{ _id:0,length:0 },function(arr_word){
                              cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                              find_document(url_localdict,"motorcycle","local_dict",{ length : 7 },{ _id:0,length:0 },function(arr_word){
                                cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 7 },{ _id:0,length:0 },function(arr_word){
                                  cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                  find_document(url_localdict,"motorcycle","local_dict",{ length : 6 },{ _id:0,length:0 },function(arr_word){
                                    cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                    find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 6 },{ _id:0,length:0 },function(arr_word){
                                      cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                      find_document(url_localdict,"motorcycle","local_dict",{ length : 5},{ _id:0,length:0 },function(arr_word){
                                        cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                        find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 5 },{ _id:0,length:0 },function(arr_word){
                                          cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                          find_document(url_localdict,"motorcycle","local_dict",{ length : 4 },{ _id:0,length:0 },function(arr_word){
                                            cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                            find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 4 },{ _id:0,length:0 },function(arr_word){
                                              cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                              find_document(url_localdict,"motorcycle","local_dict",{ length : 3 },{ _id:0,length:0 },function(arr_word){
                                                cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                                find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 3 },{ _id:0,length:0 },function(arr_word){
                                                  cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                                  find_document(url_localdict,"motorcycle","local_dict",{ length : 2 },{ _id:0,length:0 },function(arr_word){
                                                    cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                                    find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 2 },{ _id:0,length:0 },function(arr_word){
                                                      cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                                      find_document(url_localdict,"motorcycle","local_dict",{ length : 1 },{ _id:0,length:0 },function(arr_word){
                                                        cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                                        find_document(url_thaidict,"textanalysis","thai_dictionary",{ length : 1 },{ _id:0,length:0 },function(arr_word){
                                                          cast_arr_obj_word_to_arr(arr_store_word,arr_word);
                                                          word_segmentation(input_string,arr_store_word,function(str){
                                                            callback(str);
                                                          });
                                                        });
                                                      });
                                                    });
                                                  });
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

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
    find_document_sort : find_document_sort,
    segment_str : segment_str,
    replace_all : replace_all
  };
