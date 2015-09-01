/* global app , url_nodejs_localhost, app,NProgress,Location,crossid_jquery_toangular */

app.controller('HomeCtrl', function ($scope, $rootScope) {

});

app.controller('ReportDataCtrl', function ($scope, $rootScope, $http, $sce) {
    $scope.type_choose = "head_only";

    $scope.hide_on_table = true;
    $scope.hide_table_head = true;
    $scope.hide_table_comment = true;

    $scope.data_to_table = function (arr_data) {
        if ($scope.type_choose === "head_only") {
            $scope.all_count = arr_data.length;
            $scope.head_count = arr_data.length;

            var html_arr_obj = [];
            for (var i = 0; i < arr_data.length; i++) {
                var obj = {};
                obj.pantip_id = arr_data[i].pantip_id;
                var arr_date_time = (arr_data[i].datetime).split('T');
                obj.date = change_date_format2(arr_date_time[0]);
                obj.time = arr_date_time[1].replace(".000Z", "");
                obj.title = arr_data[i].title;
                obj.story = arr_data[i].story;
                obj.type = arr_data[i].type;

                obj.tag = cast_str_array_to_read(arr_data[i].tag);
                html_arr_obj.push(obj);
            }

            $scope.arr_data = html_arr_obj;
        } else if ($scope.type_choose === "head_comment") {
            $scope.head_count = arr_data.length;

            var html_arr_obj = [];
            for (var i = 0; i < arr_data.length; i++) {
                var obj = {};

                obj.pantip_id = arr_data[i].pantip_id;
                var arr_date_time = (arr_data[i].datetime).split('T');
                obj.date = change_date_format2(arr_date_time[0]);
                obj.time = arr_date_time[1].replace(".000Z", "");
                obj.title = arr_data[i].title;
                obj.story = arr_data[i].story;
                obj.type = arr_data[i].type;
                obj.tag = cast_str_array_to_read(arr_data[i].tag);

                obj.comment_counting = arr_data[i].index_comment.length;
                $scope.comment_count += obj.comment_counting;

                if (obj.comment_counting !== 0) {
                    var arr_comment = arr_data[i].comment;
                    var str_comment = "";
                    for (var j = 0; j < arr_comment.length; j++) {
                        str_comment += "<b>ความคิดเห็นที่ " + arr_data[i].index_comment[j] + " : </b>"
                                + arr_comment[j] + "<br/>";
                    }

                    obj.comment_text = $sce.trustAsHtml(str_comment + "<br/>");
                }

                html_arr_obj.push(obj);
            }
            $scope.all_count = $scope.head_count + $scope.comment_count;
            $scope.arr_data_comment = html_arr_obj;
        }
    };

    $scope.query_data = function (st_date, en_date) {
        $scope.all_count = 0;
        $scope.head_count = 0;
        $scope.comment_count = 0;
        NProgress.start();
        if (check_date_undefined(st_date, en_date)) {
            var start_time = change_date_format(st_date) + "T00:00:00.000Z";
            var end_time = change_date_format(en_date) + "T23:59:59.000Z";
            if ($scope.type_choose === "head_only") {
                $http.post(url_nodejs_localhost + "/query_pantip_without_comment", {start_time: start_time, end_time: end_time}).success(function (result) {
                    $scope.data_to_table(result);
                    $scope.hide_on_table = false;
                    $scope.hide_table_head = false;
                    $scope.hide_table_comment = true;
                    NProgress.done();
                });
            } else if ($scope.type_choose === "head_comment") {
                $http.post(url_nodejs_localhost + "/query_pantip_with_comment", {start_time: start_time, end_time: end_time}).success(function (result) {
                    $scope.data_to_table(result);
                    $scope.hide_on_table = false;
                    $scope.hide_table_head = true;
                    $scope.hide_table_comment = false;
                    NProgress.done();
                });
            }
        }
    };
});

app.controller('ReportHeadCtrl', function ($scope, $rootScope) {


});
app.controller('ReportCommentCtrl', function ($scope, $rootScope) {


});
app.controller('ReportModelCtrl', function ($scope, $rootScope) {


});

app.controller('QuestionManageCtrl', function ($scope, $rootScope, $http) {
    $scope.reload_table = function () {
        $scope.question_word = "";
        $http.post(url_nodejs_localhost + "/query_question", {}).success(function (arr_question) {
            $scope.arr_question = arr_question;
        });
    };
    $scope.reload_table();

    $scope.add_question = function (question_word) {
        $http.post(url_nodejs_localhost + "/insert_question", {question_word: question_word}).success(function () {
            $scope.reload_table();
        });
    };

    $scope.delete_question = function (delete_question) {
        var con_check = confirm("ต้องการลบ '" + delete_question + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            $http.post(url_nodejs_localhost + "/delete_question", {delete_question: delete_question}).success(function () {
                $scope.reload_table();
            });
        }
    };
});

app.controller('ModelManageCtrl', function ($scope, $rootScope, $http) {
    $scope.brand_choose = "Honda";
    $scope.orderField1 = 'main_word';
    $scope.isASC = false;

    $scope.refresh_model = function () {
        $http.post(url_nodejs_localhost + "/query_model", {}).success(function (arr_model) {
            var new_arr_word = [];
            for (var i = 0; i < arr_model.length; i++) {
                var obj = {};

                obj.syn_word = cast_str_array_to_read(arr_model[i].syn_word);
                obj.main_word = arr_model[i].main_word;
                obj.brand = arr_model[i].brand;
                new_arr_word.push(obj);
            }
            $scope.arr_model = new_arr_word;
            $scope.new_model = "";

        });
    };

    $scope.refresh_model();

    $scope.add_model = function (new_model, brand_choose) {
        var obj = {};
        obj.main_word = new_model;
        obj.brand = brand_choose;
        obj.syn_word = document.getElementById("syn_list").value.split("\n");

        $http.post(url_nodejs_localhost + "/insert_model", {doc: JSON.stringify(obj)}).success(function (result) {
//            $scope.refresh_model();
            location.reload();
        });
    };

    $scope.edit_model = function (main_word, syn_word) {
        var edit_syn = prompt("Edit Syn - Syn1,Syn2,Syn3 | Syn1 , Syn2  ", syn_word);
        if (edit_syn !== syn_word && edit_syn !== null) {
            var arr_syn = edit_syn.split(" , ");
            console.log(arr_syn);
            $http.post(url_nodejs_localhost + "/update_model", {main_word: main_word, syn_word: JSON.stringify(arr_syn)}).success(function () {
                $scope.refresh_model();
            });
        }
    };

    $scope.delete_model = function (main_word) {
        var con_check = confirm("ต้องการลบ '" + main_word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            $http.post(url_nodejs_localhost + "/delete_model", {main_word: main_word}).success(function () {
                $scope.refresh_model();
            });
        }
    };
});

app.controller('PolarManageCtrl', function ($scope, $rootScope, $http) {
    $scope.type_choose = "negative";

    $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "negative"}).success(function (arr_docs) {
        $scope.arr_negative = arr_docs;
    });
    $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "positive"}).success(function (arr_docs) {
        $scope.arr_positive = arr_docs;
    });

    $scope.add_polar = function (polar_word) {
        var obj = {};
        obj.word = polar_word;
        obj.type = $scope.type_choose;
        obj.length = polar_word.length;
        $scope.new_polar_word = "";

        $http.post(url_nodejs_localhost + "/insert_polar", {arr_obj: JSON.stringify(obj)}).success(function () {
            $http.post(url_nodejs_localhost + "/query_polar", {type_polar: $scope.type_choose}).success(function (arr_docs) {
                if ($scope.type_choose === "negative") {
                    $scope.arr_negative = arr_docs;
                } else {
                    $scope.arr_positive = arr_docs;
                }
            });
        });
    };
    
    $scope.add_polar_list = function(polar_list) {
        var arr_obj = [];
        
        var arr_polar_list = polar_list.split("\n");
        for(var i = 0;i<arr_polar_list.length;i++){
            var obj = {};
            obj.word = arr_polar_list[i];
            obj.type = $scope.type_choose;
            obj.length = obj.word.length;
            arr_obj.push(obj);
        }
        $http.post(url_nodejs_localhost + "/insert_polar", {arr_obj: JSON.stringify(arr_obj)}).success(function () {
            $http.post(url_nodejs_localhost + "/query_polar", {type_polar: $scope.type_choose}).success(function (arr_docs) {
                if ($scope.type_choose === "negative") {
                    $scope.arr_negative = arr_docs;
                } else {
                    $scope.arr_positive = arr_docs;
                }
            });
        });
    };

    $scope.delete_negative = function (word) {
        var con_check = confirm("ต้องการลบ '" + word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            $http.post(url_nodejs_localhost + "/delete_polar", {word: word}).success(function () {
                $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "negative"}).success(function (arr_docs) {
                    $scope.arr_negative = arr_docs;
                });
            });
        }
    };

    $scope.delete_positive = function (word) {
        var con_check = confirm("ต้องการลบ '" + word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            $http.post(url_nodejs_localhost + "/delete_polar", {word: word}).success(function () {
                $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "positive"}).success(function (arr_docs) {
                    $scope.arr_positive = arr_docs;
                });
            });
        }
    };
});

app.controller('DictManageCtrl', function ($scope, $http, $timeout, $window) {
    $scope.arr_obj = [];
    $scope.orderField1 = 'length';
    $scope.orderField2 = 'word';
    $scope.isASC1 = false;

    $scope.show_word = function () {
        NProgress.start();
        $http.post(url_nodejs_localhost + "/query_dict", {}).success(function (arr_docs) {
            $scope.count_word = "กำลังโหลดคำ...";
            alert_long_time("15 - 30 วินาที", "กำลังโหลดคำศัพท์จากพจนานุกรมจำนวน "+arr_docs.length+" คำ มาแสดงลงตาราง");
            $timeout(function () {

                $scope.arr_obj = arr_docs;
                $scope.count_word = "จำนวนคำ " + arr_docs.length;
                NProgress.done();
            }, 5500);
        });
    };

    $scope.del_word = function (word) {
        var con_check = confirm("ต้องการลบ '" + word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            $http.post(url_nodejs_localhost + "/delete_dict", {word: word}).success(function () {
                alert("ลบ '" + word + "' เรียบร้อยแล้ว");
                $window.location.reload();
            });
        }
    };
});