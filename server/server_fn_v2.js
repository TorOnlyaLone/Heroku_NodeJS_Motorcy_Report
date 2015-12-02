/* global require */

var mongodb = require('mongodb');var MongoClient = require('mongodb').MongoClient;
var async = require('async');

function test_connection(url_mongodb, db_name, collection_name) {
    MongoClient.connect(url_mongodb + db_name, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        }
        else {
            console.log("Connect correctly server"); //console.log(db.listCollections());
            var collection = db.collection(collection_name);
            console.log("Connect correctly COLLECTION");
            db.close();
        }
    });
}
function find_document(url_mongodb, db_name, collection_name, query, projection, callback2) {
    var findDocuments = function (db, callback) {
        var collection_con = db.collection(collection_name);
        collection_con.find(query, projection).toArray(function (err, docs) {
            console.log("Query Document");
            callback(docs);
        });
    };
    MongoClient.connect(url_mongodb + db_name, function (err, db) {
        findDocuments(db, function (docs) {
            var arr_docs = docs;
            db.close();
            console.log("_________________________");
            console.log("");
            callback2(arr_docs);
        });
    });
}
function find_document_sort(url_mongodb, db_name, collection_name, query, projection, sort, callback2) {
    var findDocuments = function (db, callback) {
        var collection_con = db.collection(collection_name);
        collection_con.find(query, projection).sort(sort).toArray(function (err, docs) {
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
function update_obj(url_mongodb, db_name, collection_name, query, update, optional, callback2) {
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
function insert_arr_object(url_mongodb, db_name, collection_name, arr_object, optional, callback2) {
    var insertDocuments = function (db, callback) {
        var collection_con = db.collection(collection_name);
        collection_con.insert(arr_object, optional, function (err, result) {
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
function delete_object(url_mongodb, db_name, collection_name, query, optional, callback2) {
    var removeDocument = function (db, callback) {
        var collection = db.collection(collection_name);
        collection.remove(query, optional, function (err, result) {
            console.log("Removed the document");
            callback(result);
        });
    };
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
function cast_arr_obj_word_to_arr(arr_store_word, arr_obj_word) {
    for (var i = 0; i < arr_obj_word.length; i++) {
        arr_store_word.push(arr_obj_word[i].word);
    }
}

function word_segmentation(input_string, arr_store_word, callback) {
    var array_object_stat = [];
    var index_word = 1;

    var input_string = input_string;

    /*Clean String before word segment*/
    input_string = input_string.replace(/\?/g, " " + "?" + " "); //cut question
    input_string = input_string.replace(/à¹€à¹€/g, "à¹?"); //replace à¸ªà¸£à¸°à¹€à¸­ 2 à¸•à¸±à¸§
    input_string = input_string.replace(/(?:https?|ftp|http):\/\/\S+/g, ""); //à¹€à¸­à¸²à¸¥à¸´à¹?à¸?à¸­à¸­à¸?à¸?à¸²à¸?à¸?à¹?à¸­à¸¡à¸¹à¸¥
    input_string = input_string.replace(/\bwww[.]\S+/g, ""); //à¹€à¸­à¸²à¸¥à¸´à¹?à¸?à¸­à¸­à¸?à¸?à¸²à¸?à¸?à¹?à¸­à¸¡à¸¹à¸¥

    function segment_by_array(array_length) {
        for (var j = 0; j < array_length.length; j++) {
            var find = array_length[j];
            find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            if (input_string.search(new RegExp(find, "i")) !== -1) {
                input_string = replace_all(input_string, find, "{{" + index_word + "}}");
                array_object_stat.push({"index_w": index_word, "word": find});
                ++index_word;
            }
        }
    }
    segment_by_array(arr_store_word);

    for (var j = 0; j < array_object_stat.length; j++) {
        var find = "{{" + array_object_stat[j].index_w + "}}";
        input_string = replace_all(input_string, find, array_object_stat[j].word + " ");
    }

    callback(input_string);
}
function segment_str(input_string, url_localdict, url_thaidict, callback) {
    var arr_store_word = [];
    find_document(url_localdict, "motorcycle", "local_dict", {length: 14}, {_id: 0, length: 0}, function (arr_word) {
        cast_arr_obj_word_to_arr(arr_store_word, arr_word);
        find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 14}, {_id: 0, length: 0}, function (arr_word) {
            cast_arr_obj_word_to_arr(arr_store_word, arr_word);
            find_document(url_localdict, "motorcycle", "local_dict", {length: 13}, {_id: 0, length: 0}, function (arr_word) {
                cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 13}, {_id: 0, length: 0}, function (arr_word) {
                    cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                    find_document(url_localdict, "motorcycle", "local_dict", {length: 12}, {_id: 0, length: 0}, function (arr_word) {
                        cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                        find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 12}, {_id: 0, length: 0}, function (arr_word) {
                            cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                            find_document(url_localdict, "motorcycle", "local_dict", {length: 11}, {_id: 0, length: 0}, function (arr_word) {
                                cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 11}, {_id: 0, length: 0}, function (arr_word) {
                                    cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                    find_document(url_localdict, "motorcycle", "local_dict", {length: 10}, {_id: 0, length: 0}, function (arr_word) {
                                        cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                        find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 10}, {_id: 0, length: 0}, function (arr_word) {
                                            cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                            find_document(url_localdict, "motorcycle", "local_dict", {length: 9}, {_id: 0, length: 0}, function (arr_word) {
                                                cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 9}, {_id: 0, length: 0}, function (arr_word) {
                                                    cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                    find_document(url_localdict, "motorcycle", "local_dict", {length: 8}, {_id: 0, length: 0}, function (arr_word) {
                                                        cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                        find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 8}, {_id: 0, length: 0}, function (arr_word) {
                                                            cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                            find_document(url_localdict, "motorcycle", "local_dict", {length: 7}, {_id: 0, length: 0}, function (arr_word) {
                                                                cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 7}, {_id: 0, length: 0}, function (arr_word) {
                                                                    cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                    find_document(url_localdict, "motorcycle", "local_dict", {length: 6}, {_id: 0, length: 0}, function (arr_word) {
                                                                        cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                        find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 6}, {_id: 0, length: 0}, function (arr_word) {
                                                                            cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                            find_document(url_localdict, "motorcycle", "local_dict", {length: 5}, {_id: 0, length: 0}, function (arr_word) {
                                                                                cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 5}, {_id: 0, length: 0}, function (arr_word) {
                                                                                    cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                    find_document(url_localdict, "motorcycle", "local_dict", {length: 4}, {_id: 0, length: 0}, function (arr_word) {
                                                                                        cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                        find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 4}, {_id: 0, length: 0}, function (arr_word) {
                                                                                            cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                            find_document(url_localdict, "motorcycle", "local_dict", {length: 3}, {_id: 0, length: 0}, function (arr_word) {
                                                                                                cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                                find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 3}, {_id: 0, length: 0}, function (arr_word) {
                                                                                                    cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                                    find_document(url_localdict, "motorcycle", "local_dict", {length: 2}, {_id: 0, length: 0}, function (arr_word) {
                                                                                                        cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                                        find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 2}, {_id: 0, length: 0}, function (arr_word) {
                                                                                                            cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                                            find_document(url_localdict, "motorcycle", "local_dict", {length: 1}, {_id: 0, length: 0}, function (arr_word) {
                                                                                                                cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                                                find_document(url_thaidict, "textanalysis", "thai_dictionary", {length: 1}, {_id: 0, length: 0}, function (arr_word) {
                                                                                                                    cast_arr_obj_word_to_arr(arr_store_word, arr_word);
                                                                                                                    word_segmentation(input_string, arr_store_word, function (str) {
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
    var output = unicode_str.replace(/&#x[0-9A-Fa-f]+;/g, function (htmlCode) {
        var codePoint = parseInt(htmlCode.slice(3, -1), 16);
        return String.fromCharCode(codePoint);
    });
    return output;
}

function query_model_bybrand(url_mongodb_motorcycle, brand, callback) {
    var model = [];
    find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: brand}, {"_id": 0}, function (arr_model) {
        for (var i = 0; i < arr_model.length; i++) {
            var arr_syn = arr_model[i].syn_word;
            for (var j = 0; j < arr_syn.length; j++) {
                model.push(arr_syn[j]);
            }
        }
        callback(model);
    });
}

function query_mocy_data_by_time(start_time, end_time, url_mongodb_motorcycle, query, projection, sort, callback) {
    find_document_sort(url_mongodb_motorcycle, "motorcycle", "pantip_data", query, projection, sort, function (arr_docs) {
        callback(arr_docs);
    });
}

function query_polar_question(url_mongo, db_name, collection_name, query, projection, sort, callback) {
    find_document_sort(url_mongo, db_name, collection_name, query, projection, sort, function (arr_polar) {
        callback(arr_polar);
    });
}

function combine_str_counting(arr_docs, type_data, callback) {
    var obj_stat = {};
    obj_stat.big_str = "";
    obj_stat.topic_count = 0;
    obj_stat.topic_count = arr_docs.length;
    obj_stat.comment_count = 0;

    if (type_data === "only_head") {
        var i = 0;
        function loop_only_head() {
            obj_stat.big_str += arr_docs[i].title + "|" + arr_docs[i].story + "|"; //for big string and segment 1 time
            ++i;
            if (i < arr_docs.length) {
                loop_only_head();
            } else {
                callback(obj_stat);
            }
        }
        loop_only_head();

    } else if (type_data === "head_comment") {
        var i = 0;
        function loop_head_comment() {
            obj_stat.big_str += arr_docs[i].title + "|" + arr_docs[i].story + "|";
            var arr_comment = arr_docs[i].comment;
            if (arr_comment.length !== 0) {
                var j = 0;
                function loop_comment() {
                    obj_stat.big_str += arr_comment[j] + "|";
                    ++obj_stat.comment_count;
                    ++j;
                    if (j < arr_comment.length) {
                        loop_comment();
                    }
                }
                loop_comment();
            }
            ++i;
            if (i < arr_docs.length) {
                loop_head_comment();
            } else {
                callback(obj_stat);
            }
        }
        loop_head_comment();
    }
    else if (type_data === "only_comment") {
        var i = 0;
        function loop_only_comment() {
            var arr_comment = arr_docs[i].comment;
            if (arr_comment.length !== 0) {
                var j = 0;
                function loop_comment() {
                    obj_stat.big_str += arr_comment[j] + "|";
                    ++obj_stat.comment_count;
                    ++j;
                    if (j < arr_comment.length) {
                        loop_comment();
                    }
                }
                loop_comment();
            }
            ++i;
            if (i < arr_docs.length) {
                loop_only_comment();
            } else {
                callback(obj_stat);
            }
        }
        loop_only_comment();
    }
}

function query_model_ln_and_deli_str(url_mongodb_motorcycle, url_mongodb_thaitext, big_str, callback) {
    segment_str(big_str, url_mongodb_motorcycle, url_mongodb_thaitext, function (str_out_cut) { //SEGMENTATION
        var str_out = str_out_cut;
        find_document_sort(url_mongodb_motorcycle, "motorcycle", "local_dict", {type: "à¸£à¸¸à¹?à¸?à¸?à¸­à¸?à¸£à¸–"}, {"word": 1, "_id": 0}, {length: -1}, function (arr_local_word) {
            var j = 0;
            function loop_replace_model() {
                str_out = replace_all(str_out, arr_local_word[j].word, "||m" + arr_local_word[j].word);
                ++j;
                if (j < arr_local_word.length) {
                    loop_replace_model();
                } else {
                    callback(str_out);
                }
            }
            loop_replace_model();
        });
    });
}

function split_str_by_model(big_str, callback) {
    var matches_arr = big_str.match(/\|m(.*?)\|/g).map(function (val) {
        val = val.replace(/\|m/g, '');
        return val.replace(/\|/g, '');
    });
    callback(matches_arr);
}

function chk_str_represent_brand(matches_arr, honda_model, yamaha_model, suzuki_model, kawasaki_model, other_model, callback) {
    var arr_model_for_match_arr = [];
    var l = 0;

    function loop_arr_mes_model() {
        var brand_name = "";
        var msg = matches_arr[l];
        var txt_split = msg.split(" ");

        var stopper = 0;
        for (var p = 0; p < honda_model.length; p++) {
            if (honda_model[p] === txt_split[0]) {
                brand_name = "Honda";
                stopper = 1;
                break;
            }
        }
        if (stopper === 0) {
            for (var p = 0; p < yamaha_model.length; p++) {
                if (yamaha_model[p] === txt_split[0]) {
                    brand_name = "Yamaha";
                    stopper = 1;
                    break;
                }
            }
        }
        if (stopper === 0) {
            for (var p = 0; p < suzuki_model.length; p++) {
                if (suzuki_model[p] === txt_split[0]) {
                    brand_name = "Suzuki";
                    stopper = 1;
                    break;
                }
            }
        }
        if (stopper === 0) {
            for (var p = 0; p < kawasaki_model.length; p++) {
                if (kawasaki_model[p] === txt_split[0]) {
                    brand_name = "Kawasaki";
                    stopper = 1;
                    break;
                }
            }
        }
        if (stopper === 0) {
            for (var p = 0; p < other_model.length; p++) {
                if (other_model[p] === txt_split[0]) {
                    brand_name = "Other";
                    stopper = 1;
                    break;
                }
            }
        }
        if (stopper === 0) {
            brand_name = "undefined_brand";
        }
        arr_model_for_match_arr.push(brand_name);
        ++l;
        if (l < matches_arr.length) {
            loop_arr_mes_model();
        } else {
            callback(arr_model_for_match_arr);
        }
    }

    loop_arr_mes_model();
}

function sentiment_represent_brand(matches_arr, arr_model_for_match_arr, negative_word, positive_word, question_word, callback) {
    var honda_cal = [0, 0, 0];
    var yamaha_cal = [0, 0, 0];
    var suzuki_cal = [0, 0, 0];
    var kawasaki_cal = [0, 0, 0];
    var other_cal = [0, 0, 0];
    var str_for_show = [];
    var negative_word = negative_word;
    var positive_word = positive_word;
    var question_word = question_word;

    var cb = 0;
    function loop_chk_brand() {
        var str_main = matches_arr[cb];
        if (arr_model_for_match_arr[cb] !== "undefined_brand") {
            var nega_in = 0;
            var posi_in = 0;
            var ques_in = 0;

            var ne = 0;
            function loop_negative() {
                var negative_problem = negative_word[ne].word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var reg_ne = new RegExp(" " + negative_problem + " ", "i");
                while (str_main.search(reg_ne) !== -1) {
                    str_main = str_main.replace(reg_ne, " <b style='color:red;'>" + negative_word[ne].word + "</b> ");
                    ++nega_in;
                }
                ++ne;
                if (ne < negative_word.length) {
                    loop_negative();
                }
            }
            loop_negative();

            var po = 0;
            function loop_positive() {
                var positive_problem = positive_word[po].word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var reg_po = new RegExp(" " + positive_problem + " ", "i");
                while (str_main.search(reg_po) !== -1) {
                    str_main = str_main.replace(reg_po, " <b style='color:green;'>" + positive_word[po].word + "</b> ");
                    ++posi_in;
                }
                ++po;
                if (po < positive_word.length) {
                    loop_positive();
                }
            }
            loop_positive();

            var qu = 0;
            function loop_question() {
                var question_problem = question_word[qu].word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var reg_qu = new RegExp(" " + question_problem + " ", "i");
                while (str_main.search(reg_qu) !== -1) {
                    str_main = str_main.replace(reg_qu, " <b style='color:orange;'>" + question_word[qu].word + "</b> ");
                    ++ques_in;
                }
                ++qu;
                if (qu < question_word.length) {
                    loop_question();
                }
            }
            loop_question();

            if (arr_model_for_match_arr[cb] === "Honda") {
                honda_cal[0] += nega_in;
                honda_cal[1] += posi_in;
                honda_cal[2] += ques_in;
            }
            else if (arr_model_for_match_arr[cb] === "Yamaha") {
                yamaha_cal[0] += nega_in;
                yamaha_cal[1] += posi_in;
                yamaha_cal[2] += ques_in;
            }
            else if (arr_model_for_match_arr[cb] === "Suzuki") {
                suzuki_cal[0] += nega_in;
                suzuki_cal[1] += posi_in;
                suzuki_cal[2] += ques_in;
            }
            else if (arr_model_for_match_arr[cb] === "Kawasaki") {
                kawasaki_cal[0] += nega_in;
                kawasaki_cal[1] += posi_in;
                kawasaki_cal[2] += ques_in;
            }
            else if (arr_model_for_match_arr[cb] === "Other") {
                other_cal[0] += nega_in;
                other_cal[1] += posi_in;
                other_cal[2] += ques_in;
            }
        }
        str_for_show.push(str_main);
        ++cb;
        if (cb < arr_model_for_match_arr.length) {
            loop_chk_brand();
        }
        else {
            callback({
                honda_cal: honda_cal, yamaha_cal: yamaha_cal, suzuki_cal: suzuki_cal, kawasaki_cal: kawasaki_cal, other_cal: other_cal, str_for_show: str_for_show
            });
        }
    }
    loop_chk_brand();
}
/*
 function find_model_return_real_word(model_word,url_mongodb_motorcycle,callback){
 
 }
 */
function sentiment_represent_model(matches_arr, arr_model_for_match_arr, negative_word, positive_word, question_word, callback) {
    var honda_cal = {};
    var yamaha_cal = {};
    var suzuki_cal = {};
    var kawasaki_cal = {};
    var other_cal = {};
    var str_for_show = [];
    var negative_word = negative_word;
    var positive_word = positive_word;
    var question_word = question_word;

    var cb = 0;
    function loop_chk_brand() {
        var str_main = matches_arr[cb];
        if (arr_model_for_match_arr[cb] !== "undefined_brand") {
            var msg = str_main;
            var txt_split = msg.split(" ");
            var model = txt_split[0];


            //find model by real main_word

            var nega_in = 0;
            var posi_in = 0;
            var ques_in = 0;

            var ne = 0;
            function loop_negative() {
                var negative_problem = negative_word[ne].word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var reg_ne = new RegExp(" " + negative_problem + " ", "i");
                while (str_main.search(reg_ne) !== -1) {
                    str_main = str_main.replace(reg_ne, " <b style='color:red;'>" + negative_word[ne].word + "</b> ");
                    ++nega_in;
                }
                ++ne;
                if (ne < negative_word.length) {
                    loop_negative();
                }
            }
            loop_negative();

            var po = 0;
            function loop_positive() {
                var positive_problem = positive_word[po].word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var reg_po = new RegExp(" " + positive_problem + " ", "i");
                while (str_main.search(reg_po) !== -1) {
                    str_main = str_main.replace(reg_po, " <b style='color:green;'>" + positive_word[po].word + "</b> ");
                    ++posi_in;
                }
                ++po;
                if (po < positive_word.length) {
                    loop_positive();
                }
            }
            loop_positive();

            var qu = 0;
            function loop_question() {
                var question_problem = question_word[qu].word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var reg_qu = new RegExp(" " + question_problem + " ", "i");
                while (str_main.search(reg_qu) !== -1) {
                    str_main = str_main.replace(reg_qu, " <b style='color:orange;'>" + question_word[qu].word + "</b> ");
                    ++ques_in;
                }
                ++qu;
                if (qu < question_word.length) {
                    loop_question();
                }
            }
            loop_question();

            if (arr_model_for_match_arr[cb] === "Honda") {
                if (typeof honda_cal[model] === "undefined") {
                    honda_cal[model] = [];
                    honda_cal[model].push(0);
                    honda_cal[model].push(0);
                    honda_cal[model].push(0);
                    honda_cal[model].push(model);
                }
                honda_cal[model][0] += nega_in;
                honda_cal[model][1] += posi_in;
                honda_cal[model][2] += ques_in;
            }
            else if (arr_model_for_match_arr[cb] === "Yamaha") {
                if (typeof yamaha_cal[model] === "undefined") {
                    yamaha_cal[model] = [];
                    yamaha_cal[model].push(0);
                    yamaha_cal[model].push(0);
                    yamaha_cal[model].push(0);
                    yamaha_cal[model].push(model);
                }
                yamaha_cal[model][0] += nega_in;
                yamaha_cal[model][1] += posi_in;
                yamaha_cal[model][2] += ques_in;
            }
            else if (arr_model_for_match_arr[cb] === "Suzuki") {
                if (typeof suzuki_cal[model] === "undefined") {
                    suzuki_cal[model] = [];
                    suzuki_cal[model].push(0);
                    suzuki_cal[model].push(0);
                    suzuki_cal[model].push(0);
                    suzuki_cal[model].push(model);
                }
                suzuki_cal[model][0] += nega_in;
                suzuki_cal[model][1] += posi_in;
                suzuki_cal[model][2] += ques_in;
            }
            else if (arr_model_for_match_arr[cb] === "Kawasaki") {
                if (typeof kawasaki_cal[model] === "undefined") {
                    kawasaki_cal[model] = [];
                    kawasaki_cal[model].push(0);
                    kawasaki_cal[model].push(0);
                    kawasaki_cal[model].push(0);
                    kawasaki_cal[model].push(model);
                }
                kawasaki_cal[model][0] += nega_in;
                kawasaki_cal[model][1] += posi_in;
                kawasaki_cal[model][2] += ques_in;
            }
            else if (arr_model_for_match_arr[cb] === "Other") {
                if (typeof other_cal[model] === "undefined") {
                    other_cal[model] = [];
                    other_cal[model].push(0);
                    other_cal[model].push(0);
                    other_cal[model].push(0);
                    other_cal[model].push(model);
                }
                other_cal[model][0] += nega_in;
                other_cal[model][1] += posi_in;
                other_cal[model][2] += ques_in;
            }
        }


        str_for_show.push(str_main);
        ++cb;
        if (cb < arr_model_for_match_arr.length) {
            loop_chk_brand();
        }
        else {
            callback({
                honda_cal: honda_cal, yamaha_cal: yamaha_cal, suzuki_cal: suzuki_cal, kawasaki_cal: kawasaki_cal, other_cal: other_cal, str_for_show: str_for_show
            });
        }
    }
    loop_chk_brand();
}

function query_all_model(url_mongodb_motorcycle, callback) {
    find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {}, {"_id": 0}, function (arr_model_word) {
        callback(arr_model_word);
    });
}

function loop_counting_model(model_arr, big_str, callback) {
    ///////////stat/////////////////////
    var arr_honda_count = [];
    var arr_yamaha_count = [];
    var arr_suzuki_count = [];
    var arr_kawasaki_count = [];
    var arr_other_count = [];

    var i = 0;
    function loop_model() {
        var main_word = model_arr[i].main_word;
        var brand = model_arr[i].brand;
        var syn_word_arr = model_arr[i].syn_word;
        var sum = 0;

        var j = 0;
        function loop_syn_word() {
            var word = syn_word_arr[j];
            var reg_syn = new RegExp(" " + word + " ", "gi");
            var count_syn = (big_str.match(reg_syn) || []).length;
            big_str = big_str.replace(reg_syn, " ||m<b style='color:blue;'>" + word + "</b> ");
            sum += count_syn;
            ++j;
            if (j < syn_word_arr.length) {
                loop_syn_word();
            }
        }
        loop_syn_word();

        if (brand === "Honda") {
            arr_honda_count.push({main_word: main_word, frequency: sum});
        }
        else if (brand === "Yamaha") {
            arr_yamaha_count.push({main_word: main_word, frequency: sum});
        }
        else if (brand === "Suzuki") {
            arr_suzuki_count.push({main_word: main_word, frequency: sum});
        }
        else if (brand === "Kawasaki") {
            arr_kawasaki_count.push({main_word: main_word, frequency: sum});
        }
        else {
            arr_other_count.push({main_word: main_word, frequency: sum});
        }

        ++i;
        if (i < model_arr.length) {
            loop_model();
        } else {
            callback({
                big_str: big_str,
                arr_honda_count: arr_honda_count,
                arr_yamaha_count: arr_yamaha_count,
                arr_suzuki_count: arr_suzuki_count,
                arr_kawasaki_count: arr_kawasaki_count,
                arr_other_count: arr_other_count
            });
        }
    }
    loop_model();
}

function counting_model(start_time, end_time, type_data, url_mongodb_motorcycle, url_mongodb_thaitext, callback) {
    var big_str = "";
    var projection = {};
    var arr_docs = [];
    var obj_stat = {};
    var model = [];
    var obj_count = {};

    if (type_data === "only_head") {
        projection = {"title": 1, "story": 1, "_id": 0};
    } else {
        projection = {"title": 1, "story": 1, "comment": 1, "_id": 0};
    }

    query_mocy_data_by_time(start_time, end_time, url_mongodb_motorcycle,
            {datetime: {$gte: new Date(start_time), $lte: new Date(end_time)}},
    projection, //sentiment_head not query comment
            {datetime: -1},
    function (arr_documents) {
        arr_docs = arr_documents;
        //callback({arr_docs : arr_docs});
        query_all_model(url_mongodb_motorcycle, function (arr_model_word) {
            model = arr_model_word; //model
            combine_str_counting(arr_docs, type_data, function (object_stat) {
                obj_stat = object_stat;  //obj_stat.big_str //stat head and comment
                segment_str(obj_stat.big_str, url_mongodb_motorcycle, url_mongodb_thaitext, function (str_out_cut) { //SEGMENTATION
                    big_str = str_out_cut;
                    loop_counting_model(model, big_str, function (array_counting) { //count_complete_with_color_string
                        //callback(array_counting);
                        obj_count = array_counting; //stat model frequency
                        split_str_by_model(obj_count.big_str, function (match_arr) {
                            obj_count.match_arr = match_arr;
                            callback(obj_count);
                        });
                    });
                });




                /*callback({
                 model_arr : model,
                 obj_stat : obj_stat
                 });*/
            });
        });
    });
}

function sentiment_head_v2(start_time, end_time, url_mongodb_motorcycle, url_mongodb_thaitext, callback) {
    var obj_stat = {}; // big_str , topic_count , comment_count
    var big_str = "";
    var arr_docs = [];
    var honda_model = [];
    var yamaha_model = [];
    var suzuki_model = [];
    var kawasaki_model = [];
    var other_model = [];
    var negative_word = [];
    var positive_word = [];
    var question_word = [];
    var matches_arr = [];
    var arr_model_for_match_arr = [];

    query_mocy_data_by_time(start_time, end_time, url_mongodb_motorcycle,
            {datetime: {$gte: new Date(start_time), $lte: new Date(end_time)}},
    {"title": 1, "story": 1, "_id": 0}, //sentiment_head not query comment
    {datetime: -1},
    function (arr_documents) {
        arr_docs = arr_documents;
        query_model_bybrand(url_mongodb_motorcycle, "Honda", function (arr_honda_model) {
            honda_model = arr_honda_model;
            query_model_bybrand(url_mongodb_motorcycle, "Yamaha", function (arr_yamaha_model) {
                yamaha_model = arr_yamaha_model;
                query_model_bybrand(url_mongodb_motorcycle, "Suzuki", function (arr_suzuki_model) {
                    suzuki_model = arr_suzuki_model;
                    query_model_bybrand(url_mongodb_motorcycle, "Kawasaki", function (arr_kawasaki_model) {
                        kawasaki_model = arr_kawasaki_model;
                        query_model_bybrand(url_mongodb_motorcycle, "Other", function (arr_other_model) {
                            other_model = arr_other_model;
                            query_polar_question(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "negative"}, {"_id": 0}, {length: -1}, function (arr_negative) {
                                negative_word = arr_negative;
                                query_polar_question(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "positive"}, {"_id": 0}, {length: -1}, function (arr_positive) {
                                    positive_word = arr_positive;
                                    query_polar_question(url_mongodb_thaitext, "textanalysis", "question_word", {}, {"_id": 0}, {length: -1}, function (arr_question) {
                                        question_word = arr_question;
                                        combine_str_counting(arr_docs, "only_head", function (object_stat) {
                                            obj_stat = object_stat;
                                            //callback({obj_stat : obj_stat});
                                            query_model_ln_and_deli_str(url_mongodb_motorcycle, url_mongodb_thaitext, obj_stat.big_str, function (deli_big_str) {
                                                big_str = deli_big_str;
                                                //callback({big_str : big_str});
                                                split_str_by_model(big_str, function (match_arr) {
                                                    matches_arr = match_arr;
                                                    //callback({matches_arr : matches_arr});
                                                    chk_str_represent_brand(matches_arr, honda_model, yamaha_model, suzuki_model, kawasaki_model, other_model, function (arr_model_for_match) {
                                                        arr_model_for_match_arr = arr_model_for_match;
                                                        //callback({ matches_arr : matches_arr , arr_model_for_match_arr : arr_model_for_match_arr });
                                                        sentiment_represent_brand(matches_arr, arr_model_for_match_arr, negative_word, positive_word, question_word, function (obj_sentiment) {
                                                            callback({
                                                                model_txt: matches_arr,
                                                                brand_txt: arr_model_for_match_arr,
                                                                honda_cal: obj_sentiment.honda_cal,
                                                                yamaha_cal: obj_sentiment.yamaha_cal,
                                                                suzuki_cal: obj_sentiment.suzuki_cal,
                                                                kawasaki_cal: obj_sentiment.kawasaki_cal,
                                                                other_cal: obj_sentiment.other_cal,
                                                                str_for_show: obj_sentiment.str_for_show,
                                                                topic_head_count: obj_stat.topic_count,
                                                                comment_count: obj_stat.comment_count
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

function sentiment_comment_v2(start_time, end_time, type_data, url_mongodb_motorcycle, url_mongodb_thaitext, callback) {
    var obj_stat = {}; // big_str , topic_count , comment_count
    var big_str = "";
    var arr_docs = [];
    var honda_model = [];
    var yamaha_model = [];
    var suzuki_model = [];
    var kawasaki_model = [];
    var other_model = [];
    var negative_word = [];
    var positive_word = [];
    var question_word = [];
    var matches_arr = [];
    var arr_model_for_match_arr = [];

    query_mocy_data_by_time(start_time, end_time, url_mongodb_motorcycle,
            {datetime: {$gte: new Date(start_time), $lte: new Date(end_time)}},
    {"title": 1, "story": 1, "comment": 1, "_id": 0}, //sentiment_head not query comment
    {datetime: -1},
    function (arr_documents) {
        arr_docs = arr_documents;
        query_model_bybrand(url_mongodb_motorcycle, "Honda", function (arr_honda_model) {
            honda_model = arr_honda_model;
            query_model_bybrand(url_mongodb_motorcycle, "Yamaha", function (arr_yamaha_model) {
                yamaha_model = arr_yamaha_model;
                query_model_bybrand(url_mongodb_motorcycle, "Suzuki", function (arr_suzuki_model) {
                    suzuki_model = arr_suzuki_model;
                    query_model_bybrand(url_mongodb_motorcycle, "Kawasaki", function (arr_kawasaki_model) {
                        kawasaki_model = arr_kawasaki_model;
                        query_model_bybrand(url_mongodb_motorcycle, "Other", function (arr_other_model) {
                            other_model = arr_other_model;
                            query_polar_question(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "negative"}, {"_id": 0}, {length: -1}, function (arr_negative) {
                                negative_word = arr_negative;
                                query_polar_question(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "positive"}, {"_id": 0}, {length: -1}, function (arr_positive) {
                                    positive_word = arr_positive;
                                    query_polar_question(url_mongodb_thaitext, "textanalysis", "question_word", {}, {"_id": 0}, {length: -1}, function (arr_question) {
                                        question_word = arr_question;
                                        combine_str_counting(arr_docs, type_data, function (object_stat) {
                                            obj_stat = object_stat;
                                            //callback({obj_stat : obj_stat});
                                            query_model_ln_and_deli_str(url_mongodb_motorcycle, url_mongodb_thaitext, obj_stat.big_str, function (deli_big_str) {
                                                big_str = deli_big_str;
                                                //callback({big_str : big_str});
                                                split_str_by_model(big_str, function (match_arr) {
                                                    matches_arr = match_arr;
                                                    //callback({matches_arr : matches_arr});
                                                    chk_str_represent_brand(matches_arr, honda_model, yamaha_model, suzuki_model, kawasaki_model, other_model, function (arr_model_for_match) {
                                                        arr_model_for_match_arr = arr_model_for_match;
                                                        //callback({ matches_arr : matches_arr , arr_model_for_match_arr : arr_model_for_match_arr });
                                                        sentiment_represent_brand(matches_arr, arr_model_for_match_arr, negative_word, positive_word, question_word, function (obj_sentiment) {
                                                            callback({
                                                                model_txt: matches_arr,
                                                                brand_txt: arr_model_for_match_arr,
                                                                honda_cal: obj_sentiment.honda_cal,
                                                                yamaha_cal: obj_sentiment.yamaha_cal,
                                                                suzuki_cal: obj_sentiment.suzuki_cal,
                                                                kawasaki_cal: obj_sentiment.kawasaki_cal,
                                                                other_cal: obj_sentiment.other_cal,
                                                                str_for_show: obj_sentiment.str_for_show,
                                                                topic_head_count: obj_stat.topic_count,
                                                                comment_count: obj_stat.comment_count
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

function sentiment_model(start_time, end_time, type_data, url_mongodb_motorcycle, url_mongodb_thaitext, callback) {
    var obj_stat = {}; // big_str , topic_count , comment_count
    var big_str = "";
    var arr_docs = [];
    var honda_model = [];
    var yamaha_model = [];
    var suzuki_model = [];
    var kawasaki_model = [];
    var other_model = [];
    var negative_word = [];
    var positive_word = [];
    var question_word = [];
    var matches_arr = [];
    var arr_model_for_match_arr = [];
    var projection = {};
    if (type_data === "only_head") {
        projection = {"title": 1, "story": 1, "_id": 0};
    } else {
        projection = {"title": 1, "story": 1, "comment": 1, "_id": 0};
    }

    query_mocy_data_by_time(start_time, end_time, url_mongodb_motorcycle,
            {datetime: {$gte: new Date(start_time), $lte: new Date(end_time)}},
    projection,
            {datetime: -1},
    function (arr_documents) {
        arr_docs = arr_documents;
        query_model_bybrand(url_mongodb_motorcycle, "Honda", function (arr_honda_model) {
            honda_model = arr_honda_model;
            query_model_bybrand(url_mongodb_motorcycle, "Yamaha", function (arr_yamaha_model) {
                yamaha_model = arr_yamaha_model;
                query_model_bybrand(url_mongodb_motorcycle, "Suzuki", function (arr_suzuki_model) {
                    suzuki_model = arr_suzuki_model;
                    query_model_bybrand(url_mongodb_motorcycle, "Kawasaki", function (arr_kawasaki_model) {
                        kawasaki_model = arr_kawasaki_model;
                        query_model_bybrand(url_mongodb_motorcycle, "Other", function (arr_other_model) {
                            other_model = arr_other_model;
                            query_polar_question(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "negative"}, {"_id": 0}, {length: -1}, function (arr_negative) {
                                negative_word = arr_negative;
                                query_polar_question(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "positive"}, {"_id": 0}, {length: -1}, function (arr_positive) {
                                    positive_word = arr_positive;
                                    query_polar_question(url_mongodb_thaitext, "textanalysis", "question_word", {}, {"_id": 0}, {length: -1}, function (arr_question) {
                                        question_word = arr_question;

                                        combine_str_counting(arr_docs, type_data, function (object_stat) {
                                            obj_stat = object_stat;
                                            //callback({obj_stat : obj_stat});
                                            query_model_ln_and_deli_str(url_mongodb_motorcycle, url_mongodb_thaitext, obj_stat.big_str, function (deli_big_str) {
                                                big_str = deli_big_str;
                                                //callback({big_str : big_str});
                                                split_str_by_model(big_str, function (match_arr) {
                                                    matches_arr = match_arr;
                                                    //callback({matches_arr : matches_arr});
                                                    chk_str_represent_brand(matches_arr, honda_model, yamaha_model, suzuki_model, kawasaki_model, other_model, function (arr_model_for_match) {
                                                        arr_model_for_match_arr = arr_model_for_match;
                                                        //callback({ matches_arr : matches_arr , arr_model_for_match_arr : arr_model_for_match_arr });
                                                        sentiment_represent_model(matches_arr, arr_model_for_match_arr, negative_word, positive_word, question_word, function (obj_sentiment) {
                                                            callback({
                                                                model_txt: matches_arr,
                                                                brand_txt: arr_model_for_match_arr,
                                                                honda_cal: obj_sentiment.honda_cal,
                                                                yamaha_cal: obj_sentiment.yamaha_cal,
                                                                suzuki_cal: obj_sentiment.suzuki_cal,
                                                                kawasaki_cal: obj_sentiment.kawasaki_cal,
                                                                other_cal: obj_sentiment.other_cal,
                                                                str_for_show: obj_sentiment.str_for_show,
                                                                topic_head_count: obj_stat.topic_count,
                                                                comment_count: obj_stat.comment_count
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

function sentiment_head(start_time, end_time, url_mongodb_motorcycle, url_mongodb_thaitext, callback) {
    find_document_sort(url_mongodb_motorcycle, "motorcycle", "pantip_data",
            {datetime: {$gte: new Date(start_time), $lte: new Date(end_time)}}, {"title": 1, "story": 1, "_id": 0}, {datetime: -1},
    function (arr_docs) {
        var topic_head_count = arr_docs.length;
        var big_str_head = "";
        var i = 0;
        var honda_model = [];
        var yamaha_model = [];
        var suzuki_model = [];
        var kawasaki_model = [];
        var other_model = [];

        var negative_word = [];
        var positive_word = [];
        var question_word = [];

        function loop() {
            big_str_head += arr_docs[i].title + " " + arr_docs[i].story + "|"; //segment 1 time
            ++i;
            if (i < arr_docs.length) {
                loop();
            } else {
                segment_str(big_str_head, url_mongodb_motorcycle, url_mongodb_thaitext, function (str_out) {
                    find_document_sort(url_mongodb_motorcycle, "motorcycle", "local_dict", {type: "à¸£à¸¸à¹?à¸?à¸?à¸­à¸?à¸£à¸–"}, {"word": 1, "_id": 0}, {length: -1}, function (arr_local_word) {

                        var j = 0;
                        function loop_replace_model() {
                            str_out = replace_all(str_out, arr_local_word[j].word, "||m" + arr_local_word[j].word);
                            ++j;
                            if (j < arr_local_word.length) {
                                loop_replace_model();
                            }
                            else {
                                var matches_arr = str_out.match(/\|m(.*?)\|/g).map(function (val) {
                                    val = val.replace(/\|m/g, '');
                                    return val.replace(/\|/g, '');
                                });

                                var honda_cal = [0, 0, 0];
                                var yamaha_cal = [0, 0, 0];
                                var suzuki_cal = [0, 0, 0];
                                var kawasaki_cal = [0, 0, 0];
                                var other_cal = [0, 0, 0];

                                var arr_model_prebrand = [];
                                var l = 0;
                                var msg = "";

                                function loop_arr_mes_model() {
                                    var brand_name = "";
                                    msg = matches_arr[l];
                                    var txt_split = msg.split(" ");

                                    var stopper = 0;
                                    for (var p = 0; p < honda_model.length; p++) {
                                        if (honda_model[p] === txt_split[0]) {
                                            brand_name = "Honda";
                                            stopper = 1;
                                            break;
                                        }
                                    }
                                    if (stopper === 0) {
                                        for (var p = 0; p < yamaha_model.length; p++) {
                                            if (yamaha_model[p] === txt_split[0]) {
                                                brand_name = "Yamaha";
                                                stopper = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (stopper === 0) {
                                        for (var p = 0; p < suzuki_model.length; p++) {
                                            if (suzuki_model[p] === txt_split[0]) {
                                                brand_name = "Suzuki";
                                                stopper = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (stopper === 0) {
                                        for (var p = 0; p < kawasaki_model.length; p++) {
                                            if (kawasaki_model[p] === txt_split[0]) {
                                                brand_name = "Kawasaki";
                                                stopper = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (stopper === 0) {
                                        for (var p = 0; p < other_model.length; p++) {
                                            if (other_model[p] === txt_split[0]) {
                                                brand_name = "Other";
                                                stopper = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (stopper === 0) {
                                        brand_name = "undefined_brand";
                                    }
                                    arr_model_prebrand.push(brand_name);

                                    ++l;
                                    if (l < matches_arr.length) {
                                        loop_arr_mes_model();
                                    } else {
                                        /* res.send({ model_txt : matches_arr , brand_txt : arr_model_prebrand ,
                                         negative_word : negative_word , positive_word : positive_word , question_word : question_word });*/

                                        var str_for_show = [];

                                        var cb = 0;
                                        function loop_chk_brand() {
                                            var str_main = matches_arr[cb];

                                            if (arr_model_prebrand[cb] !== "undefined_brand") {
                                                //  console.log(str_main);
                                                var nega_in = 0;
                                                var posi_in = 0;
                                                var ques_in = 0;

                                                var ne = 0;
                                                function loop_negative() {

                                                    var reg_ne = new RegExp(" " + negative_word[ne] + " ", "i");
                                                    while (str_main.search(reg_ne) !== -1) {
                                                        str_main = str_main.replace(reg_ne, " <b style='color:red;'>" + negative_word[ne] + "</b> ");
                                                        //console.log(str_main);
                                                        ++nega_in;
                                                    }

                                                    ++ne;
                                                    if (ne < negative_word.length) {
                                                        loop_negative()
                                                    }
                                                }
                                                loop_negative();

                                                var po = 0;
                                                function loop_positive() {
                                                    var positive_problem = positive_word[po].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

                                                    var reg_po = new RegExp(" " + positive_problem + " ", "i");
                                                    while (str_main.search(reg_po) !== -1) {
                                                        str_main = str_main.replace(reg_po, " <b style='color:green;'>" + positive_word[po] + "</b> ");
                                                        //  console.log(str_main);
                                                        ++posi_in;
                                                    }

                                                    ++po;
                                                    if (po < positive_word.length) {
                                                        loop_positive()
                                                    }
                                                }
                                                loop_positive();

                                                var qu = 0;
                                                function loop_question() {
                                                    var question_problem = question_word[qu].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                                                    console.log(">>" + question_problem + "<<");
                                                    var reg_qu = new RegExp(" " + question_problem + " ", "i");
                                                    while (str_main.search(reg_qu) !== -1) {
                                                        str_main = str_main.replace(reg_qu, " <b style='color:orange;'>" + question_word[qu] + "</b> ");
                                                        //  console.log(str_main);
                                                        ++ques_in;
                                                    }

                                                    ++qu;
                                                    if (qu < question_word.length) {
                                                        loop_question()
                                                    }
                                                }
                                                loop_question();


                                                if (arr_model_prebrand[cb] === "Honda") {
                                                    honda_cal[0] += nega_in;
                                                    honda_cal[1] += posi_in;
                                                    honda_cal[2] += ques_in;
                                                }
                                                else if (arr_model_prebrand[cb] === "Yamaha") {
                                                    yamaha_cal[0] += nega_in;
                                                    yamaha_cal[1] += posi_in;
                                                    yamaha_cal[2] += ques_in;
                                                }
                                                else if (arr_model_prebrand[cb] === "Suzuki") {
                                                    suzuki_cal[0] += nega_in;
                                                    suzuki_cal[1] += posi_in;
                                                    suzuki_cal[2] += ques_in;
                                                }
                                                else if (arr_model_prebrand[cb] === "Kawasaki") {
                                                    kawasaki_cal[0] += nega_in;
                                                    kawasaki_cal[1] += posi_in;
                                                    kawasaki_cal[2] += ques_in;
                                                }
                                                else if (arr_model_prebrand[cb] === "Other") {
                                                    other_cal[0] += nega_in;
                                                    other_cal[1] += posi_in;
                                                    other_cal[2] += ques_in;
                                                }
                                            }
                                            str_for_show.push(str_main);

                                            ++cb;
                                            if (cb < arr_model_prebrand.length) {
                                                loop_chk_brand();
                                            } else {
                                                callback({
                                                    model_txt: matches_arr,
                                                    brand_txt: arr_model_prebrand,
                                                    honda_cal: honda_cal,
                                                    yamaha_cal: yamaha_cal,
                                                    suzuki_cal: suzuki_cal,
                                                    kawasaki_cal: kawasaki_cal,
                                                    other_cal: other_cal,
                                                    str_for_show: str_for_show,
                                                    topic_head_count: topic_head_count
                                                });
                                            }
                                        }
                                        loop_chk_brand();
                                    } //close else
                                }
                                loop_arr_mes_model();
                            }
                        }
                        loop_replace_model();
                    });
                });
            }
        }

        find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Honda"}, {"_id": 0}, function (arr_model) {
            for (var i = 0; i < arr_model.length; i++) {
                var arr_syn = arr_model[i].syn_word;
                for (var j = 0; j < arr_syn.length; j++) {
                    honda_model.push(arr_syn[j]);
                }
            }
            find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Yamaha"}, {"_id": 0}, function (arr_model) {
                for (var k = 0; k < arr_model.length; k++) {
                    var arr_syn = arr_model[k].syn_word;
                    for (var l = 0; l < arr_syn.length; l++) {
                        yamaha_model.push(arr_syn[l]);
                    }
                }
                find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Suzuki"}, {"_id": 0}, function (arr_model) {
                    for (var m = 0; m < arr_model.length; m++) {
                        var arr_syn = arr_model[m].syn_word;
                        for (var n = 0; n < arr_syn.length; n++) {
                            suzuki_model.push(arr_syn[n]);
                        }
                    }
                    find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Kawasaki"}, {"_id": 0}, function (arr_model) {
                        for (var o = 0; o < arr_model.length; o++) {
                            var arr_syn = arr_model[o].syn_word;
                            for (var p = 0; p < arr_syn.length; p++) {
                                kawasaki_model.push(arr_syn[p]);
                            }
                        }
                        find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Other"}, {"_id": 0}, function (arr_model) {
                            for (var q = 0; q < arr_model.length; q++) {
                                var arr_syn = arr_model[q].syn_word;
                                for (var r = 0; r < arr_syn.length; r++) {
                                    other_model.push(arr_syn[r]);
                                }
                            }
                            //res.send(yamaha_model);
                            //loop();
                            find_document_sort(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "negative"}, {"_id": 0}, {length: -1}, function (arr_docs) {
                                for (var q = 0; q < arr_docs.length; q++) {
                                    negative_word.push(arr_docs[q].word);
                                }
                                find_document_sort(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "positive"}, {"_id": 0}, {length: -1}, function (arr_docs) {
                                    for (var r = 0; r < arr_docs.length; r++) {
                                        positive_word.push(arr_docs[r].word);
                                    }
                                    find_document_sort(url_mongodb_thaitext, "textanalysis", "question_word", {}, {"_id": 0}, {length: -1}, function (arr_docs) {
                                        for (var s = 0; s < arr_docs.length; s++) {
                                            question_word.push(arr_docs[s].word);
                                        }
                                        loop();
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

function sentiment_comment(start_time, end_time, type_data, url_mongodb_motorcycle, url_mongodb_thaitext, callback) {
    var type_data_temp = type_data;
    console.log(type_data_temp);
    find_document_sort(url_mongodb_motorcycle, "motorcycle", "pantip_data",
            {datetime: {$gte: new Date(start_time), $lte: new Date(end_time)}}, {"title": 1, "story": 1, "comment": 1, "_id": 0}, {datetime: -1},
    function (arr_docs) {
        var topic_head_count = arr_docs.length;
        var big_str = "";
        var i = 0;
        var honda_model = [];
        var yamaha_model = [];
        var suzuki_model = [];
        var kawasaki_model = [];
        var other_model = [];

        var negative_word = [];
        var positive_word = [];
        var question_word = [];

        function loop() {
            if (type_data_temp === "head_comment") {
                big_str += arr_docs[i].title + " " + arr_docs[i].story + "|" + arr_docs[i].comment + "|"; //segment 1 time
            } else if (type_data_temp === "only_comment") {
                big_str += arr_docs[i].comment + "|"; //segment 1 time
            }
            ++i;
            if (i < arr_docs.length) {
                loop();
            } else {
                segment_str(big_str, url_mongodb_motorcycle, url_mongodb_thaitext, function (str_out) {
                    find_document_sort(url_mongodb_motorcycle, "motorcycle", "local_dict", {type: "à¸£à¸¸à¹?à¸?à¸?à¸­à¸?à¸£à¸–"}, {"word": 1, "_id": 0}, {length: -1}, function (arr_local_word) {

                        var j = 0;
                        function loop_replace_model() {
                            str_out = replace_all(str_out, arr_local_word[j].word, "||m" + arr_local_word[j].word);
                            ++j;
                            if (j < arr_local_word.length) {
                                loop_replace_model();
                            }
                            else {
                                var matches_arr = str_out.match(/\|m(.*?)\|/g).map(function (val) {
                                    val = val.replace(/\|m/g, '');
                                    return val.replace(/\|/g, '');
                                });

                                var honda_cal = [0, 0, 0];
                                var yamaha_cal = [0, 0, 0];
                                var suzuki_cal = [0, 0, 0];
                                var kawasaki_cal = [0, 0, 0];
                                var other_cal = [0, 0, 0];

                                var arr_model_prebrand = [];
                                var l = 0;
                                var msg = "";

                                function loop_arr_mes_model() {
                                    var brand_name = "";
                                    msg = matches_arr[l];
                                    var txt_split = msg.split(" ");

                                    var stopper = 0;
                                    for (var p = 0; p < honda_model.length; p++) {
                                        if (honda_model[p] === txt_split[0]) {
                                            brand_name = "Honda";
                                            stopper = 1;
                                            break;
                                        }
                                    }
                                    if (stopper === 0) {
                                        for (var p = 0; p < yamaha_model.length; p++) {
                                            if (yamaha_model[p] === txt_split[0]) {
                                                brand_name = "Yamaha";
                                                stopper = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (stopper === 0) {
                                        for (var p = 0; p < suzuki_model.length; p++) {
                                            if (suzuki_model[p] === txt_split[0]) {
                                                brand_name = "Suzuki";
                                                stopper = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (stopper === 0) {
                                        for (var p = 0; p < kawasaki_model.length; p++) {
                                            if (kawasaki_model[p] === txt_split[0]) {
                                                brand_name = "Kawasaki";
                                                stopper = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (stopper === 0) {
                                        for (var p = 0; p < other_model.length; p++) {
                                            if (other_model[p] === txt_split[0]) {
                                                brand_name = "Other";
                                                stopper = 1;
                                                break;
                                            }
                                        }
                                    }
                                    if (stopper === 0) {
                                        brand_name = "undefined_brand";
                                    }
                                    arr_model_prebrand.push(brand_name);

                                    ++l;
                                    if (l < matches_arr.length) {
                                        loop_arr_mes_model();
                                    } else {
                                        /* res.send({ model_txt : matches_arr , brand_txt : arr_model_prebrand ,
                                         negative_word : negative_word , positive_word : positive_word , question_word : question_word });*/

                                        var str_for_show = [];

                                        var cb = 0;
                                        function loop_chk_brand() {
                                            var str_main = matches_arr[cb];

                                            if (arr_model_prebrand[cb] !== "undefined_brand") {
                                                //  console.log(str_main);
                                                var nega_in = 0;
                                                var posi_in = 0;
                                                var ques_in = 0;

                                                var ne = 0;
                                                function loop_negative() {

                                                    var reg_ne = new RegExp(" " + negative_word[ne] + " ", "i");
                                                    if (str_main.search(reg_ne) !== -1) {
                                                        str_main = str_main.replace(reg_ne, "<b style='color:red;'> " + negative_word[ne] + " " + "</b>");
                                                        //console.log(str_main);
                                                        ++nega_in;
                                                    }

                                                    ++ne;
                                                    if (ne < negative_word.length) {
                                                        loop_negative()
                                                    }
                                                }
                                                loop_negative();

                                                var po = 0;
                                                function loop_positive() {
                                                    var positive_problem = positive_word[po].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

                                                    var reg_po = new RegExp(" " + positive_problem + " ", "i");
                                                    if (str_main.search(reg_po) !== -1) {
                                                        str_main = str_main.replace(reg_po, "<b style='color:green;'> " + positive_word[po] + " " + "</b>");
                                                        //  console.log(str_main);
                                                        ++posi_in;
                                                    }

                                                    ++po;
                                                    if (po < positive_word.length) {
                                                        loop_positive()
                                                    }
                                                }
                                                loop_positive();

                                                var qu = 0;
                                                function loop_question() {
                                                    var question_problem = question_word[qu].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

                                                    var reg_qu = new RegExp(" " + question_problem + " ", "i");
                                                    if (str_main.search(reg_qu) !== -1) {
                                                        str_main = str_main.replace(reg_qu, "<b style='color:orange;'> " + question_word[qu] + " " + "</b>");
                                                        //  console.log(str_main);
                                                        ++ques_in;
                                                    }

                                                    ++qu;
                                                    if (qu < question_word.length) {
                                                        loop_question()
                                                    }
                                                }
                                                loop_question();

                                                str_for_show.push(str_main);
                                                if (arr_model_prebrand[cb] === "Honda") {
                                                    honda_cal[0] += nega_in;
                                                    honda_cal[1] += posi_in;
                                                    honda_cal[2] += ques_in;
                                                }
                                                else if (arr_model_prebrand[cb] === "Yamaha") {
                                                    yamaha_cal[0] += nega_in;
                                                    yamaha_cal[1] += posi_in;
                                                    yamaha_cal[2] += ques_in;
                                                }
                                                else if (arr_model_prebrand[cb] === "Suzuki") {
                                                    suzuki_cal[0] += nega_in;
                                                    suzuki_cal[1] += posi_in;
                                                    suzuki_cal[2] += ques_in;
                                                }
                                                else if (arr_model_prebrand[cb] === "Kawasaki") {
                                                    kawasaki_cal[0] += nega_in;
                                                    kawasaki_cal[1] += posi_in;
                                                    kawasaki_cal[2] += ques_in;
                                                }
                                                else if (arr_model_prebrand[cb] === "Other") {
                                                    other_cal[0] += nega_in;
                                                    other_cal[1] += posi_in;
                                                    other_cal[2] += ques_in;
                                                }
                                            }

                                            ++cb;
                                            if (cb < arr_model_prebrand.length) {
                                                loop_chk_brand();
                                            } else {
                                                callback({
                                                    model_txt: matches_arr,
                                                    brand_txt: arr_model_prebrand,
                                                    honda_cal: honda_cal,
                                                    yamaha_cal: yamaha_cal,
                                                    suzuki_cal: suzuki_cal,
                                                    kawasaki_cal: kawasaki_cal,
                                                    other_cal: other_cal,
                                                    str_for_show: str_for_show,
                                                    topic_head_count: topic_head_count
                                                });
                                            }
                                        }
                                        loop_chk_brand();
                                    } //close else
                                }
                                loop_arr_mes_model();
                            }
                        }
                        loop_replace_model();
                    });
                });
            }
        }

        find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Honda"}, {"_id": 0}, function (arr_model) {
            for (var i = 0; i < arr_model.length; i++) {
                var arr_syn = arr_model[i].syn_word;
                for (var j = 0; j < arr_syn.length; j++) {
                    honda_model.push(arr_syn[j]);
                }
            }
            find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Yamaha"}, {"_id": 0}, function (arr_model) {
                for (var k = 0; k < arr_model.length; k++) {
                    var arr_syn = arr_model[k].syn_word;
                    for (var l = 0; l < arr_syn.length; l++) {
                        yamaha_model.push(arr_syn[l]);
                    }
                }
                find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Suzuki"}, {"_id": 0}, function (arr_model) {
                    for (var m = 0; m < arr_model.length; m++) {
                        var arr_syn = arr_model[m].syn_word;
                        for (var n = 0; n < arr_syn.length; n++) {
                            suzuki_model.push(arr_syn[n]);
                        }
                    }
                    find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Kawasaki"}, {"_id": 0}, function (arr_model) {
                        for (var o = 0; o < arr_model.length; o++) {
                            var arr_syn = arr_model[o].syn_word;
                            for (var p = 0; p < arr_syn.length; p++) {
                                kawasaki_model.push(arr_syn[p]);
                            }
                        }
                        find_document(url_mongodb_motorcycle, "motorcycle", "model_word", {brand: "Other"}, {"_id": 0}, function (arr_model) {
                            for (var q = 0; q < arr_model.length; q++) {
                                var arr_syn = arr_model[q].syn_word;
                                for (var r = 0; r < arr_syn.length; r++) {
                                    other_model.push(arr_syn[r]);
                                }
                            }
                            //res.send(yamaha_model);
                            //loop();
                            find_document_sort(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "negative"}, {"_id": 0}, {length: -1}, function (arr_docs) {
                                for (var q = 0; q < arr_docs.length; q++) {
                                    negative_word.push(arr_docs[q].word);
                                }
                                find_document_sort(url_mongodb_motorcycle, "motorcycle", "polar_word", {type: "positive"}, {"_id": 0}, {length: -1}, function (arr_docs) {
                                    for (var r = 0; r < arr_docs.length; r++) {
                                        positive_word.push(arr_docs[r].word);
                                    }
                                    find_document_sort(url_mongodb_thaitext, "textanalysis", "question_word", {}, {"_id": 0}, {length: -1}, function (arr_docs) {
                                        for (var s = 0; s < arr_docs.length; s++) {
                                            question_word.push(arr_docs[s].word);
                                        }
                                        loop();
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

module.exports = {
    test_connection: test_connection,
    insert_arr_object: insert_arr_object,
    find_document: find_document,
    delete_object: delete_object,
    update_obj: update_obj,
    find_document_sort: find_document_sort,
    segment_str: segment_str,
    replace_all: replace_all,
    sentiment_head: sentiment_head,
    sentiment_comment: sentiment_comment,
    sentiment_head_v2: sentiment_head_v2,
    sentiment_comment_v2: sentiment_comment_v2,
    sentiment_model: sentiment_model,
    counting_model: counting_model
};
