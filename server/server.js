/* global process */

var server_fn = require("./server_fn");
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static("client"));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

var url_mongodb_thaitext = "mongodb://admin:1234@ds039073.mongolab.com:39073/";
var url_mongodb_motorcycle = "mongodb://admin:1234@ds041663.mongolab.com:41663/";
app.post("/counting_model",function(req,res){
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var type_data = req.body.type_data;

  server_fn.counting_model(start_time,end_time,type_data,url_mongodb_motorcycle,url_mongodb_thaitext,function(obj_result){
    res.send(obj_result);
  });

});

app.post("/sentiment_model",function(req,res){
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var type_data = req.body.type_data;
  server_fn.sentiment_model(start_time,end_time,type_data,url_mongodb_motorcycle,url_mongodb_thaitext,
    function(obj_result){
      res.send(obj_result);
    });
  });
  app.post("/sentiment_comment",function(req,res){
    var start_time = req.body.start_time;
    var end_time = req.body.end_time;
    var type_data = req.body.type_data;
    server_fn.sentiment_comment_v2(start_time,end_time,type_data,url_mongodb_motorcycle,url_mongodb_thaitext,
      function(obj_result){
        res.send(obj_result);
      });
      //  res.send(" ");
    });

    app.post("/sentiment_head",function(req,res){
      var start_time = req.body.start_time;
      var end_time = req.body.end_time;
      server_fn.sentiment_head_v2(start_time,end_time,url_mongodb_motorcycle,url_mongodb_thaitext,
        function(obj_result){
          res.send(obj_result);
        });
      });

      app.post("/teaching_query",function(req,res){
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;
        server_fn.find_document_sort(url_mongodb_motorcycle,"motorcycle","pantip_data",
        {datetime : {  $gte: new Date(start_time),  $lte: new Date(end_time)}},{ "title" : 1,"story" : 1,"comment" : 1,"_id" : 0},{ datetime : -1 },
        function(arr_docs){
          var big_str_head = "";
          var i = 0;
          function loop(){
            var arr_comment = arr_docs[i].comment;
            var comment_str = "";
            var k =0;
            function loop_comment(){
              if(arr_comment.length !== 0){
                comment_str += arr_comment[k];
                ++k;
                if(k< arr_comment.length){
                  loop_comment();
                }
              }
            }
            loop_comment();
            big_str_head += arr_docs[i].title +" "+ arr_docs[i].story+" "+comment_str+" ";
            ++i;
            if(i< arr_docs.length){
              loop();
            }else{
              server_fn.segment_str(big_str_head,url_mongodb_motorcycle,url_mongodb_thaitext,function(str_out){
                res.send(str_out);
              });
            }
          }
          loop();
        });
      });

      app.post("/test_word_segmentation",function(req,res){
        var str = req.body.str_test;
        server_fn.segment_str(str,url_mongodb_motorcycle,url_mongodb_thaitext,function(str_out){
          res.send(str_out);
        });
      });

      app.post("/query_pantip_with_comment",function(req,res){
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;
        server_fn.find_document_sort(url_mongodb_motorcycle,"motorcycle","pantip_data",
        {datetime : {  $gte: new Date(start_time),  $lte: new Date(end_time)}},{ "_id" : 0 },{ datetime : -1 },
        function(arr_docs){
          res.send(arr_docs);
        });
      });

      app.post("/query_pantip_without_comment",function(req,res){
        var start_time = req.body.start_time;
        var end_time = req.body.end_time;
        server_fn.find_document_sort(url_mongodb_motorcycle,"motorcycle","pantip_data",
        {datetime : {  $gte: new Date(start_time),  $lte: new Date(end_time)}},{ "_id" : 0 ,"comment" : 0 },
        { datetime : -1 }, function(arr_docs){
          res.send(arr_docs);
        });
      });

      app.post("/delete_motorcycle_dict",function(req,res){
        var local_word = req.body.local_word;
        server_fn.delete_object(url_mongodb_motorcycle,"motorcycle","local_dict",{ word : local_word },{ justOne : true },function(){
          res.send(" ");
        });
      });

      app.post("/insert_motorcycle_dict",function(req,res){
        var arr_obj = JSON.parse(req.body.arr_obj);
        server_fn.insert_arr_object(url_mongodb_motorcycle,"motorcycle","local_dict",arr_obj, { ordered : false }, function(){
          res.send(" ");
        });
      });

      app.post("/query_motorcycle_dict",function(req,res){
        server_fn.find_document(url_mongodb_motorcycle,"motorcycle","local_dict",{ },{ "_id": 0 },function(arr_local_word){
          res.send(arr_local_word);
        });
      });

      app.post("/delete_question",function(req,res){
        var delete_word = req.body.delete_question;
        server_fn.delete_object(url_mongodb_thaitext,"textanalysis","question_word",{ word : delete_word },{ justOne : true },function(){
          res.send(" ");
        });
      });

      app.post("/insert_question",function(req,res){
        var question_word = req.body.question_word;
        var obj = { word : question_word , length : question_word.length };
        server_fn.insert_arr_object(url_mongodb_thaitext,"textanalysis","question_word",obj, {}, function(){
          res.send(" ");
        });
      });

      app.post("/query_question",function (req,res){
        server_fn.find_document(url_mongodb_thaitext,"textanalysis","question_word",{ },{ "_id": 0 },function(arr_question){
          res.send(arr_question);
        });
      });

      app.post("/delete_model",function (req,res){
        var main_word = req.body.main_word;
        server_fn.delete_object(url_mongodb_motorcycle,"motorcycle","model_word",{ main_word : main_word },{ justOne : true },function(){
          res.send(" ");
        });
      });

      app.post("/insert_model",function(req,res){
        var obj = JSON.parse(req.body.doc);
        server_fn.insert_arr_object(url_mongodb_motorcycle,"motorcycle","model_word",obj, {}, function(){
          res.send(" ");
        });
      });

      app.post("/update_model",function(req,res){
        var main_word = req.body.main_word;
        var syn_word = JSON.parse(req.body.syn_word);
        server_fn.update_obj(url_mongodb_motorcycle,"motorcycle","model_word",{main_word : main_word},{ $set : { syn_word : syn_word } },{},function(){
          res.send(" ");
        });
      });

      app.post("/query_model",function(req,res){
        server_fn.find_document(url_mongodb_motorcycle,"motorcycle","model_word",{ },{ "_id": 0 },function(arr_model){
          res.send(arr_model);
        });
      });

      app.post("/delete_polar",function (req,res){
        var word = req.body.word;
        server_fn.delete_object(url_mongodb_motorcycle,"motorcycle","polar_word",{ word : word },{ justOne : true },function(){
          res.send(" ");
        });
      });

      app.post("/feature_polar",function (req,res){
        var feature = req.body.feature;
        var polar = req.body.polar;
        console.log(feature);
        console.log(polar);
        server_fn.update_obj(url_mongodb_motorcycle,"motorcycle","polar_word", {word : polar},{ $set:{feature_main : feature}}, {}, function(){
          res.send(" ");
        });
      });

      app.post("/insert_polar",function (req,res){
        var arr_obj = JSON.parse(req.body.arr_obj);
        server_fn.insert_arr_object(url_mongodb_motorcycle,"motorcycle","polar_word",arr_obj, { ordered : false }, function(){
          res.send(" ");
        });
      });

      app.post("/query_polar",function (req,res){
        var type = req.body.type_polar;
        server_fn.find_document(url_mongodb_motorcycle,"motorcycle","polar_word",{ type : type },{ "_id": 0 },function(arr_docs){
          res.send(arr_docs);
        });
      });

      app.post("/delete_dict",function (req,res){
        var word = req.body.word;
        server_fn.delete_object(url_mongodb_thaitext,"textanalysis","thai_dictionary",{ word : word },{ justOne : true },function(){
          res.send(" ");
        });
      });

      app.post("/query_dict",function (req,res){
        server_fn.find_document(url_mongodb_thaitext,"textanalysis","thai_dictionary",{ },{ "_id": 0 },function(arr_docs){
          res.send(arr_docs);
        });
      });

      app.post("/insert_dict",function (req,res){
        var arr_obj = JSON.parse(req.body.array_object);
        server_fn.insert_arr_object(url_mongodb_thaitext,"textanalysis","thai_dictionary",arr_obj, { ordered : false }, function(){
          res.send(" ");
        });
      });

      app.listen(app.get('port'), function () {
        console.log('App Running on localhost:', app.get('port'));
        console.log("Motorcycle Report Start");
        console.log("_____________________");
        console.log("");
      });

      /*
      app.post("/abc", function (req, res) {
      var obj_data = req.body;
      server_fn.test_connection(url_mongodb_thaitext,"textanalysis","thai_dictionary",function(){
      res.send("OK");
    })
  });
  */
