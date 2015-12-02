/* global app , url_nodejs_localhost, app,NProgress,Location,crossid_jquery_toangular */

app.controller('HomeCtrl', function ($scope, $rootScope) {
    NProgress.start();
    NProgress.done();
});

app.controller('FeaturePolarCtrl', function ($scope, $rootScope, $http) {
    NProgress.start();
    NProgress.done();

    $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "negative"}).success(function (arr_docs) {
        $scope.polar_list = arr_docs;
        console.log(arr_docs);
    });
});

app.controller('ReportModelCtrl', function ($scope, $rootScope, $http, $sce) {
    //Report Counting Model

    NProgress.start();
    NProgress.done();
    $scope.type_choose = "head_comment"; //Default Value Choose Head Comment
    $scope.graph_choose = "graph_data"; //Default Value Choose Data with Graph

    $scope.graph_honda = true; //Default Graph Display
    $scope.graph_yamaha = true;
    $scope.graph_suzuki = true;
    $scope.graph_kawasaki = true;
    $scope.graph_other = true;

    $scope.counting_model = function (start_time, end_time) {
        start_time_2 = change_date_format(start_time) + "T00:00:00.000Z";
        end_time_2 = change_date_format(end_time) + "T23:59:59.000Z";

        console.log(start_time + " " + end_time + " " + $scope.type_choose);
        $http.post(url_nodejs_localhost + "/counting_model", {start_time: start_time_2, end_time: end_time_2,
            type_data: $scope.type_choose}).success(function (result) {
            console.log(result);
            if ($scope.graph_honda) {
                var arr_honda_counting = [];
                var arr_honda_count = result.arr_honda_count;
                for (var i = 0; i < arr_honda_count.length; i++) {
                    if (arr_honda_count[i].frequency === 0) {
                        continue;
                    }
                    else {
                        arr_honda_counting.push({
                            y: arr_honda_count[i].frequency, label: arr_honda_count[i].main_word,
                            indexLabel: arr_honda_count[i].frequency + "", indexLabelPlacement: "outside"
                        });
                    }
                }
                graph_counting_model("stackedColumn", "กราฟนับรุ่น ฮอนด้า ระหว่างวันที่ " + start_time + " ถึง " + end_time,
                        "chart_count_model_honda", arr_honda_counting);
            }
            if ($scope.graph_yamaha) {
                var arr_yamaha_counting = [];
                var arr_yamaha_count = result.arr_yamaha_count;
                for (var i = 0; i < arr_yamaha_count.length; i++) {
                    if (arr_yamaha_count[i].frequency === 0) {
                        continue;
                    }
                    else {
                        arr_yamaha_counting.push({y: arr_yamaha_count[i].frequency, label: arr_yamaha_count[i].main_word, indexLabel: arr_yamaha_count[i].frequency + "", indexLabelPlacement: "outside"});
                    }
                }
                graph_counting_model("stackedColumn", "กราฟนับรุ่น ยามาฮ่า ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_count_model_yamaha",
                        arr_yamaha_counting);
            }
            if ($scope.graph_suzuki) {
                var arr_suzuki_counting = [];
                var arr_suzuki_count = result.arr_suzuki_count;
                for (var i = 0; i < arr_suzuki_count.length; i++) {
                    if (arr_suzuki_count[i].frequency === 0) {
                        continue;
                    }
                    else {
                        arr_suzuki_counting.push({y: arr_suzuki_count[i].frequency, label: arr_suzuki_count[i].main_word, indexLabel: arr_suzuki_count[i].frequency + "", indexLabelPlacement: "outside"});
                    }
                }
                graph_counting_model("stackedColumn", "กราฟนับรุ่น ซูซูกิ ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_count_model_suzuki",
                        arr_suzuki_counting);
            }
            if ($scope.graph_kawasaki) {
                var arr_kawasaki_counting = [];
                var arr_kawasaki_count = result.arr_kawasaki_count;
                for (var i = 0; i < arr_kawasaki_count.length; i++) {
                    if (arr_kawasaki_count[i].frequency === 0) {
                        continue;
                    }
                    else {
                        arr_kawasaki_counting.push({y: arr_kawasaki_count[i].frequency, label: arr_kawasaki_count[i].main_word, indexLabel: arr_kawasaki_count[i].frequency + "", indexLabelPlacement: "outside"});
                    }
                }
                graph_counting_model("stackedColumn", "กราฟนับรุ่น คาวาซากิ ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_count_model_kawasaki",
                        arr_kawasaki_counting);
            }
            if ($scope.graph_other) {
                var arr_other_counting = [];
                var arr_other_count = result.arr_other_count;
                for (var i = 0; i < arr_other_count.length; i++) {
                    if (arr_other_count[i].frequency === 0) {
                        continue;
                    }
                    else {
                        arr_other_counting.push({y: arr_other_count[i].frequency, label: arr_other_count[i].main_word, indexLabel: arr_other_count[i].frequency + "", indexLabelPlacement: "outside"});
                    }
                }
                graph_counting_model("stackedColumn", "กราฟนับรุ่น อื่นๆ ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_count_model_other",
                        arr_other_counting);
            }
            $scope.message_count = [];
            var match_arr = result.match_arr;
            for (var i = 0; i < match_arr.length; i++) {
                $scope.message_count.push({message: $sce.trustAsHtml(match_arr[i])});
            }
        });
    };
});

app.controller('ReportSentiModelCtrl', function ($scope, $rootScope, $http, $sce) {
    NProgress.start();
    NProgress.done();
    $scope.type_choose = "only_comment";
    $scope.graph_choose = "graph_data";
    $scope.graph_honda = true;
    $scope.graph_yamaha = true;
    $scope.graph_suzuki = true;
    $scope.graph_kawasaki = true;
    $scope.graph_other = true;

    $scope.sentiment_model = function (start_time, end_time) {
        start_time_2 = change_date_format(start_time) + "T00:00:00.000Z";
        end_time_2 = change_date_format(end_time) + "T23:59:59.000Z";
        NProgress.start();
        $http.post(url_nodejs_localhost + "/sentiment_model", {start_time: start_time_2, end_time: end_time_2,
            type_data: $scope.type_choose}).success(function (result) {
            NProgress.done(); //console.log(result.honda_cal); //graph_senti_model("chart_senti_model_honda", result.honda_cal);
            $scope.count_polar = [];

            if ($scope.graph_other) {
                var negative_ar = [];
                var positive_ar = [];
                var question_ar = [];

                for (var key in result.other_cal) {
                    if (result.other_cal.hasOwnProperty(key)) {
                        $scope.count_polar.push({
                            model: result.other_cal[key][3], nega: result.other_cal[key][0], posi: result.other_cal[key][1], ques: result.other_cal[key][2], brand: "Other"
                        });
                        if (result.other_cal[key][0] === 0 && result.other_cal[key][1] === 0 && result.other_cal[key][2] === 0) {
                            continue;
                        }
                        negative_ar.push({y: result.other_cal[key][0], label: result.other_cal[key][3]});
                        positive_ar.push({y: result.other_cal[key][1], label: result.other_cal[key][3]});
                        question_ar.push({y: result.other_cal[key][2], label: result.other_cal[key][3]});

                    }
                }
                graph_senti_v2("stackedColumn", "ข้อมูลวิเคราะห์รุ่น ยี่ห้ออื่นๆ ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_senti_model_other",
                        negative_ar, positive_ar, question_ar);
            }

            if ($scope.graph_kawasaki) {
                var negative_ar = [];
                var positive_ar = [];
                var question_ar = [];
                for (var key in result.kawasaki_cal) {
                    if (result.kawasaki_cal.hasOwnProperty(key)) {
                        $scope.count_polar.push({
                            model: result.kawasaki_cal[key][3], nega: result.kawasaki_cal[key][0], posi: result.kawasaki_cal[key][1], ques: result.kawasaki_cal[key][2], brand: "Kawasaki"
                        });
                        if ((result.kawasaki_cal[key][0] === 0 && result.kawasaki_cal[key][1] === 0 && result.kawasaki_cal[key][2] === 0) || result.kawasaki_cal[key][3] === "Kawasaki") {
                            continue;
                        }
                        negative_ar.push({y: result.kawasaki_cal[key][0], label: result.kawasaki_cal[key][3]});
                        positive_ar.push({y: result.kawasaki_cal[key][1], label: result.kawasaki_cal[key][3]});
                        question_ar.push({y: result.kawasaki_cal[key][2], label: result.kawasaki_cal[key][3]});

                    }
                }
                graph_senti_v2("stackedColumn", "ข้อมูลวิเคราะห์รุ่น คาวาซากิ ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_senti_model_kawasaki",
                        negative_ar, positive_ar, question_ar);
            }
            if ($scope.graph_suzuki) {
                var negative_ar = [];
                var positive_ar = [];
                var question_ar = [];
                for (var key in result.suzuki_cal) {
                    if (result.suzuki_cal.hasOwnProperty(key)) {
                        $scope.count_polar.push({
                            model: result.suzuki_cal[key][3], nega: result.suzuki_cal[key][0], posi: result.suzuki_cal[key][1], ques: result.suzuki_cal[key][2], brand: "Suzuki"
                        });
                        if ((result.suzuki_cal[key][0] === 0 && result.suzuki_cal[key][1] === 0 && result.suzuki_cal[key][2] === 0) || result.suzuki_cal[key][3] === "Suzuki") {
                            continue;
                        }
                        negative_ar.push({y: result.suzuki_cal[key][0], label: result.suzuki_cal[key][3]});
                        positive_ar.push({y: result.suzuki_cal[key][1], label: result.suzuki_cal[key][3]});
                        question_ar.push({y: result.suzuki_cal[key][2], label: result.suzuki_cal[key][3]});

                    }
                }
                graph_senti_v2("stackedColumn", "ข้อมูลวิเคราะห์รุ่น ซูซูกิ ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_senti_model_suzuki",
                        negative_ar, positive_ar, question_ar);
            }
            if ($scope.graph_yamaha) {
                var negative_ar = [];
                var positive_ar = [];
                var question_ar = [];
                for (var key in result.yamaha_cal) {
                    if (result.yamaha_cal.hasOwnProperty(key)) {
                        $scope.count_polar.push({
                            model: result.yamaha_cal[key][3], nega: result.yamaha_cal[key][0], posi: result.yamaha_cal[key][1], ques: result.yamaha_cal[key][2], brand: "Yamaha"
                        });
                        if ((result.yamaha_cal[key][0] === 0 && result.yamaha_cal[key][1] === 0 && result.yamaha_cal[key][2] === 0) || result.yamaha_cal[key][3] === "Yamaha") {
                            continue;
                        }
                        negative_ar.push({y: result.yamaha_cal[key][0], label: result.yamaha_cal[key][3]});
                        positive_ar.push({y: result.yamaha_cal[key][1], label: result.yamaha_cal[key][3]});
                        question_ar.push({y: result.yamaha_cal[key][2], label: result.yamaha_cal[key][3]});

                    }
                }
                graph_senti_v2("stackedColumn", "ข้อมูลวิเคราะห์รุ่น ยามาฮ่า ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_senti_model_yamaha",
                        negative_ar, positive_ar, question_ar);
            }
            if ($scope.graph_honda) {
                var negative_ar = [];
                var positive_ar = [];
                var question_ar = [];
                for (var key in result.honda_cal) {
                    if (result.honda_cal.hasOwnProperty(key)) {
                        $scope.count_polar.push({
                            model: result.honda_cal[key][3], nega: result.honda_cal[key][0], posi: result.honda_cal[key][1], ques: result.honda_cal[key][2], brand: "Honda"
                        });
                        if ((result.honda_cal[key][0] === 0 && result.honda_cal[key][1] === 0 && result.honda_cal[key][2] === 0) || result.honda_cal[key][3] === "Honda") {
                            continue;
                        }
                        negative_ar.push({y: result.honda_cal[key][0], label: result.honda_cal[key][3]});
                        positive_ar.push({y: result.honda_cal[key][1], label: result.honda_cal[key][3]});
                        question_ar.push({y: result.honda_cal[key][2], label: result.honda_cal[key][3]});

                    }
                }
                graph_senti_v2("stackedColumn", "ข้อมูลวิเคราะห์รุ่น ฮอนด้า ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_senti_model_honda",
                        negative_ar, positive_ar, question_ar);
            }

            $scope.count_polar.reverse();
            $scope.topic_head_count = result.topic_head_count;
            $scope.comment_count = result.comment_count;

            $scope.message_count = 0;
            $scope.message_by_brand = [];

            for (var i = 0; i < result.brand_txt.length; i++) {
                if (result.brand_txt[i] === undefined) {
                    continue;
                }
                if (result.brand_txt[i] === "Honda") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Honda", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Yamaha") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Yamaha", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Suzuki") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Suzuki", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Kawasaki") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Kawasaki", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Other") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Other", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                }
            }
        });
    };
});

app.controller('ReportCommentCtrl', function ($scope, $rootScope, $http, $sce) {
    NProgress.start();
    NProgress.done();
    $scope.graph_choose = "graph_data";
    $scope.type_choose = "head_comment";

    $scope.graph_honda = true;
    $scope.graph_yamaha = true;
    $scope.graph_suzuki = true;
    $scope.graph_kawasaki = true;
    $scope.graph_other = true;

    $scope.sentiment_comment = function (start_time, end_time) {
        start_time_2 = change_date_format(start_time) + "T00:00:00.000Z";
        end_time_2 = change_date_format(end_time) + "T23:59:59.000Z";
        NProgress.start();
        $http.post(url_nodejs_localhost + "/sentiment_comment", {start_time: start_time_2, end_time: end_time_2, type_data: $scope.type_choose}).success(function (result) {
            NProgress.done();
            $scope.count_polar = [];
            $scope.negative_graph = [];
            $scope.positive_graph = [];
            $scope.question_graph = [];

            $scope.message_count = 0;
            $scope.message_by_brand = [];

            if ($scope.graph_other === true && (result.other_cal[0] !== 0 || result.other_cal[1] !== 0 || result.other_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.other_cal[0], label: "Other"});
                $scope.positive_graph.push({y: result.other_cal[1], label: "Other"});
                $scope.question_graph.push({y: result.other_cal[2], label: "Other"});

                $scope.count_polar.push({
                    brand: "Other", nega: result.other_cal[0], posi: result.other_cal[1], ques: result.other_cal[2]
                });
            }
            if ($scope.graph_kawasaki === true && (result.kawasaki_cal[0] !== 0 || result.kawasaki_cal[1] !== 0 || result.kawasaki_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.kawasaki_cal[0], label: "Kawasaki"});
                $scope.positive_graph.push({y: result.kawasaki_cal[1], label: "Kawasaki"});
                $scope.question_graph.push({y: result.kawasaki_cal[2], label: "Kawasaki"});

                $scope.count_polar.push({
                    brand: "Kawasaki", nega: result.kawasaki_cal[0], posi: result.kawasaki_cal[1], ques: result.kawasaki_cal[2]
                });
            }
            if ($scope.graph_suzuki === true && (result.suzuki_cal[0] !== 0 || result.suzuki_cal[1] !== 0 || result.suzuki_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.suzuki_cal[0], label: "Suzuki"});
                $scope.positive_graph.push({y: result.suzuki_cal[1], label: "Suzuki"});
                $scope.question_graph.push({y: result.suzuki_cal[2], label: "Suzuki"});

                $scope.count_polar.push({
                    brand: "Suzuki", nega: result.suzuki_cal[0], posi: result.suzuki_cal[1], ques: result.suzuki_cal[2]
                });
            }
            if ($scope.graph_yamaha === true && (result.yamaha_cal[0] !== 0 || result.yamaha_cal[1] !== 0 || result.yamaha_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.yamaha_cal[0], label: "Yamaha"});
                $scope.positive_graph.push({y: result.yamaha_cal[1], label: "Yamaha"});
                $scope.question_graph.push({y: result.yamaha_cal[2], label: "Yamaha"});

                $scope.count_polar.push({
                    brand: "Yamaha", nega: result.yamaha_cal[0], posi: result.yamaha_cal[1], ques: result.yamaha_cal[2]
                });
            }
            if ($scope.graph_honda === true && (result.honda_cal[0] !== 0 || result.honda_cal[1] !== 0 || result.honda_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.honda_cal[0], label: "Honda"});
                $scope.positive_graph.push({y: result.honda_cal[1], label: "Honda"});
                $scope.question_graph.push({y: result.honda_cal[2], label: "Honda"});

                $scope.count_polar.push({
                    brand: "Honda", nega: result.honda_cal[0], posi: result.honda_cal[1], ques: result.honda_cal[2]
                });
            }

            $scope.count_polar.reverse();
            $scope.topic_head_count = result.topic_head_count;
            $scope.comment_count = result.comment_count;

            graph_senti_v2("stackedBar100", "ข้อมูลวิเคราะห์ความคิดเห็น ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_senti_comment",
                    $scope.negative_graph, $scope.positive_graph, $scope.question_graph);

            for (var i = 0; i < result.brand_txt.length; i++) {
                if (result.brand_txt[i] === undefined) {
                    continue;
                }
                if (result.brand_txt[i] === "Honda") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Honda", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Yamaha") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Yamaha", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Suzuki") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Suzuki", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Kawasaki") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Kawasaki", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Other") {
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Other", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                }
            }
            if ($scope.graph_choose === "graph_data") {
                $scope.hide_data = false;
            } else {
                $scope.hide_data = true;
            }
        });

    };
});

app.controller('ReportHeadCtrl', function ($scope, $rootScope, $http, $sce) {
    NProgress.start();
    NProgress.done();
    $scope.graph_choose = "graph_data";
    $scope.hide_data = true;

    $scope.graph_honda = true;
    $scope.graph_yamaha = true;
    $scope.graph_suzuki = true;
    $scope.graph_kawasaki = true;
    $scope.graph_other = true;

    $scope.sentiment_head = function (start_time, end_time) {
        start_time_2 = change_date_format(start_time) + "T00:00:00.000Z";
        end_time_2 = change_date_format(end_time) + "T23:59:59.000Z";
        NProgress.start();
        $http.post(url_nodejs_localhost + "/sentiment_head", {start_time: start_time_2, end_time: end_time_2}).success(function (result) {
            NProgress.done();
            $scope.count_polar = [];
            $scope.negative_graph = [];
            $scope.positive_graph = [];
            $scope.question_graph = [];

            $scope.message_count = 0;
            $scope.message_by_brand = [];

            if ($scope.graph_other === true && (result.other_cal[0] !== 0 || result.other_cal[1] !== 0 || result.other_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.other_cal[0], label: "Other"});
                $scope.positive_graph.push({y: result.other_cal[1], label: "Other"});
                $scope.question_graph.push({y: result.other_cal[2], label: "Other"});

                $scope.count_polar.push({
                    brand: "Other", nega: result.other_cal[0], posi: result.other_cal[1], ques: result.other_cal[2]
                });
            }
            if ($scope.graph_kawasaki === true && (result.kawasaki_cal[0] !== 0 || result.kawasaki_cal[1] !== 0 || result.kawasaki_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.kawasaki_cal[0], label: "Kawasaki"});
                $scope.positive_graph.push({y: result.kawasaki_cal[1], label: "Kawasaki"});
                $scope.question_graph.push({y: result.kawasaki_cal[2], label: "Kawasaki"});

                $scope.count_polar.push({
                    brand: "Kawasaki", nega: result.kawasaki_cal[0], posi: result.kawasaki_cal[1], ques: result.kawasaki_cal[2]
                });
            }
            if ($scope.graph_suzuki === true && (result.suzuki_cal[0] !== 0 || result.suzuki_cal[1] !== 0 || result.suzuki_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.suzuki_cal[0], label: "Suzuki"});
                $scope.positive_graph.push({y: result.suzuki_cal[1], label: "Suzuki"});
                $scope.question_graph.push({y: result.suzuki_cal[2], label: "Suzuki"});

                $scope.count_polar.push({
                    brand: "Suzuki", nega: result.suzuki_cal[0], posi: result.suzuki_cal[1], ques: result.suzuki_cal[2]
                });
            }
            if ($scope.graph_yamaha === true && (result.yamaha_cal[0] !== 0 || result.yamaha_cal[1] !== 0 || result.yamaha_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.yamaha_cal[0], label: "Yamaha"});
                $scope.positive_graph.push({y: result.yamaha_cal[1], label: "Yamaha"});
                $scope.question_graph.push({y: result.yamaha_cal[2], label: "Yamaha"});

                $scope.count_polar.push({
                    brand: "Yamaha", nega: result.yamaha_cal[0], posi: result.yamaha_cal[1], ques: result.yamaha_cal[2]
                });
            }
            if ($scope.graph_honda === true && (result.honda_cal[0] !== 0 || result.honda_cal[1] !== 0 || result.honda_cal[2] !== 0)) {
                $scope.negative_graph.push({y: result.honda_cal[0], label: "Honda"});
                $scope.positive_graph.push({y: result.honda_cal[1], label: "Honda"});
                $scope.question_graph.push({y: result.honda_cal[2], label: "Honda"});

                $scope.count_polar.push({
                    brand: "Honda", nega: result.honda_cal[0], posi: result.honda_cal[1], ques: result.honda_cal[2]
                });
            }
            $scope.count_polar.reverse();
            $scope.topic_head_count = result.topic_head_count;
            graph_senti_v2("stackedBar100", "ข้อมูลวิเคราะห์หัวกระทู้ ระหว่างวันที่ " + start_time + " ถึง " + end_time, "chart_senti_head",
                    $scope.negative_graph, $scope.positive_graph, $scope.question_graph);

            // var honda_str = ""; //var yamaha_str = ""; //var suzuki_str = "";
            //var kawasaki_str = ""; //var other_str = "";
            for (var i = 0; i < result.brand_txt.length; i++) {
                if (result.brand_txt[i] === undefined) {
                    continue;
                }
                if (result.brand_txt[i] === "Honda") {
                    // honda_str += result.str_for_show[i] + "<br/><br/>";
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Honda", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Yamaha") {
                    //yamaha_str += result.str_for_show[i] + "<br/><br/>";
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Yamaha", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Suzuki") {
                    //suzuki_str += result.str_for_show[i] + "<br/><br/>";
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Suzuki", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Kawasaki") {
                    //kawasaki_str += result.str_for_show[i] + "<br/><br/>";
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Kawasaki", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                } else if (result.brand_txt[i] === "Other") {
                    //other_str += result.str_for_show[i] + "<br/><br/>";
                    $scope.message_by_brand.push({message: $sce.trustAsHtml(result.str_for_show[i]),
                        brand: "Other", star: $sce.trustAsHtml(result.arr_star_str[i])});
                    ++$scope.message_count;
                }

            }
            //$scope.str_honda = $sce.trustAsHtml(honda_str);
            //$scope.str_yamaha = $sce.trustAsHtml(yamaha_str);
            if ($scope.graph_choose === "graph_data") {
                $scope.hide_data = false;
            } else {
                $scope.hide_data = true;
            }
        });
    };

});
app.controller('TeachingWordCtrl', function ($scope, $rootScope, $http) {
    NProgress.start();
    NProgress.done();

    $scope.orderField1 = '';
    $scope.orderField2 = '';
    $scope.isASC = false;

    $scope.reload_table = function () {
        $scope.new_local_word = '';
        $scope.list_local_word = '';
        $scope.type_chk1 = '';
        $scope.type_chk2 = '';
        $scope.type_chk3 = '';
        $scope.type_chk4 = '';
        $scope.type_chk5 = '';
        $scope.type_chk6 = '';
        $scope.type_chk7 = '';
        $scope.other_chk = '';
        $http.post(url_nodejs_localhost + "/query_motorcycle_dict", {}).success(function (result) {
            $scope.arr_local_word = result;
            NProgress.done();
        });
    };
    NProgress.start();
    $scope.reload_table();


    $scope.get_data = function (st_date, en_date) {
        if (check_date_undefined(st_date, en_date)) {
            NProgress.start();
            var start_time = change_date_format(st_date) + "T00:00:00.000Z";
            var end_time = change_date_format(en_date) + "T23:59:59.000Z";
            $http.post(url_nodejs_localhost + "/teaching_query", {start_time: start_time, end_time: end_time}).success(function (result) {
                $scope.txt_for_read = result;
                NProgress.done();
            });
        }
    };

    $scope.add_local_word = function () {
        if ($scope.new_local_word !== '' || $scope.list_local_word !== '') {
            NProgress.start();
            var type_chk = '';
            type_chk += $scope.type_chk1 !== '' ? "," + $scope.type_chk1 : '';
            type_chk += $scope.type_chk2 !== '' ? "," + $scope.type_chk2 : '';
            type_chk += $scope.type_chk3 !== '' ? "," + $scope.type_chk3 : '';
            type_chk += $scope.type_chk4 !== '' ? "," + $scope.type_chk4 : '';
            type_chk += $scope.type_chk5 !== '' ? "," + $scope.type_chk5 : '';
            type_chk += $scope.type_chk6 !== '' ? "," + $scope.type_chk6 : '';
            type_chk += $scope.type_chk7 && $scope.other_chk !== '' ? "," + $scope.other_chk : '';
            type_chk = type_chk.replace(",", '');
            var arr_obj = [];
            if ($scope.list_local_word !== '') {
                var arr_local = $scope.list_local_word.split("\n");
                for (var i = 0; i < arr_local.length; i++) {
                    arr_obj.push({word: arr_local[i], length: arr_local[i].length, type: type_chk});
                }
            }
            $http.post(url_nodejs_localhost + "/insert_motorcycle_dict", {arr_obj: JSON.stringify(arr_obj)}).success(function () {
                $scope.reload_table();
            });
        }
    };

    $scope.delete_local = function (local_word) {
        var con_check = confirm("ต้องการลบ '" + local_word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            NProgress.start();
            $http.post(url_nodejs_localhost + "/delete_motorcycle_dict", {local_word: local_word}).success(function () {
                $scope.reload_table();
            });
        }
    };

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
        if (check_date_undefined(st_date, en_date)) {
            NProgress.start();
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

app.controller('MotorcyDictCtrl', function ($scope, $rootScope, $http) {
    $scope.orderField1 = '';
    $scope.orderField2 = '';
    $scope.isASC = false;

    $scope.reload_table = function () {
        $scope.new_local_word = '';
        $scope.list_local_word = '';
        $scope.type_chk1 = '';
        $scope.type_chk2 = '';
        $scope.type_chk3 = '';
        $scope.type_chk4 = '';
        $scope.type_chk5 = '';
        $scope.type_chk6 = '';
        $scope.other_chk = '';
        $http.post(url_nodejs_localhost + "/query_motorcycle_dict", {}).success(function (result) {
            $scope.arr_local_word = result;
            NProgress.done();
        });
    };
    NProgress.start();
    $scope.reload_table();

    $scope.add_local_word = function () {
        if ($scope.new_local_word !== '' || $scope.list_local_word !== '') {
            NProgress.start();
            var type_chk = '';
            type_chk += $scope.type_chk1 !== '' ? "," + $scope.type_chk1 : '';
            type_chk += $scope.type_chk2 !== '' ? "," + $scope.type_chk2 : '';
            type_chk += $scope.type_chk3 !== '' ? "," + $scope.type_chk3 : '';
            type_chk += $scope.type_chk4 !== '' ? "," + $scope.type_chk4 : '';
            type_chk += $scope.type_chk5 !== '' ? "," + $scope.type_chk5 : '';
            type_chk += $scope.type_chk6 && $scope.other_chk !== '' ? "," + $scope.other_chk : '';
            type_chk = type_chk.replace(",", '');
            var arr_obj = [];
            if ($scope.new_local_word !== '') {
                arr_obj.push({word: $scope.new_local_word, length: $scope.new_local_word.length, type: type_chk});
            }
            if ($scope.list_local_word !== '') {
                var arr_local = $scope.list_local_word.split("\n");
                for (var i = 0; i < arr_local.length; i++) {
                    arr_obj.push({word: arr_local[i], length: arr_local[i].length, type: type_chk});
                }
            }
            $http.post(url_nodejs_localhost + "/insert_motorcycle_dict", {arr_obj: JSON.stringify(arr_obj)}).success(function () {
                $scope.reload_table();
            });
        }
    };

    $scope.delete_local = function (local_word) {
        var con_check = confirm("ต้องการลบ '" + local_word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            NProgress.start();
            $http.post(url_nodejs_localhost + "/delete_motorcycle_dict", {local_word: local_word}).success(function () {
                $scope.reload_table();
            });
        }
    };

});

app.controller('QuestionManageCtrl', function ($scope, $rootScope, $http) {
    NProgress.start();
    $scope.reload_table = function () {
        $scope.question_word = "";
        $http.post(url_nodejs_localhost + "/query_question", {}).success(function (arr_question) {
            $scope.arr_question = arr_question;
            NProgress.done();
        });
    };
    $scope.reload_table();

    $scope.add_question = function (question_word) {
        NProgress.start();
        $http.post(url_nodejs_localhost + "/insert_question", {question_word: question_word}).success(function () {
            $scope.reload_table();
        });
    };

    $scope.delete_question = function (delete_question) {
        var con_check = confirm("ต้องการลบ '" + delete_question + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            NProgress.start();
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
    NProgress.start();
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
            NProgress.done();
        });
    };

    $scope.refresh_model();

    $scope.add_model = function (new_model, brand_choose) {
        NProgress.start();
        var obj = {};
        obj.main_word = new_model;
        obj.brand = brand_choose;
        var arr_syn = document.getElementById("syn_list").value.split("\n");
        obj.syn_word = arr_syn;

        $http.post(url_nodejs_localhost + "/insert_model", {doc: JSON.stringify(obj)}).success(function (result) {
            var arr_obj = [];
            arr_obj.push({word: new_model, length: new_model.length, type: "รุ่นของรถ"});
            for (var i = 0; i < arr_syn.length; i++) {
                arr_obj.push({word: arr_syn[i], length: arr_syn[i].length, type: "รุ่นของรถ"});
            }
            $http.post(url_nodejs_localhost + "/insert_motorcycle_dict", {arr_obj: JSON.stringify(arr_obj)}).success(function (result) {
                location.reload();
            });
        });
    };

    $scope.edit_model = function (main_word, syn_word) {
        var edit_syn = prompt("Edit Syn - Syn1 , Syn2 (อย่าลืมเว้นว่างก่อนหน้าและหลัง ,) ", syn_word);
        if (edit_syn !== syn_word && edit_syn !== null) {
            NProgress.start();
            var arr_syn = edit_syn.split(" , ");
            console.log(arr_syn);
            $http.post(url_nodejs_localhost + "/update_model", {main_word: main_word, syn_word: JSON.stringify(arr_syn)}).success(function () {
                var arr_obj = [];
                for (var i = 0; i < arr_syn.length; i++) {
                    arr_obj.push({word: arr_syn[i], length: arr_syn[i].length, type: "รุ่นของรถ"});
                }
                $http.post(url_nodejs_localhost + "/insert_motorcycle_dict", {arr_obj: JSON.stringify(arr_obj)}).success(function (result) {
                    $scope.refresh_model();
                });
            });
        }
    };

    $scope.delete_model = function (main_word) {
        var con_check = confirm("ต้องการลบ '" + main_word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            NProgress.start();
            $http.post(url_nodejs_localhost + "/delete_model", {main_word: main_word}).success(function () {
                $scope.refresh_model();
            });
        }
    };
});

app.controller('PolarManageCtrl', function ($scope, $rootScope, $http) {
    $scope.type_choose = "negative";
    NProgress.start();

    $scope.load_table = function () {
        $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "negative"}).success(function (arr_docs) {
            $scope.arr_negative = arr_docs;
            $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "positive"}).success(function (arr_docs) {
                $scope.arr_positive = arr_docs;
                NProgress.done();
            });
        });
    };
    $scope.load_table();


    $scope.add_polar = function (polar_word) {

        var obj = {};
        obj.word = polar_word;
        obj.type = $scope.type_choose;
        obj.length = polar_word.length;

        $scope.new_polar_word = "";
        var obj_dict = {};
        obj_dict.word = polar_word;
        obj_dict.type = "ความรู้สึก";
        obj_dict.length = polar_word.length;

        NProgress.start();
        $http.post(url_nodejs_localhost + "/insert_polar", {arr_obj: JSON.stringify(obj)}).success(function () {
            $http.post(url_nodejs_localhost + "/insert_motorcycle_dict", {arr_obj: JSON.stringify(obj_dict)}).success(function () {
                $http.post(url_nodejs_localhost + "/query_polar", {type_polar: $scope.type_choose}).success(function (arr_docs) {
                    if ($scope.type_choose === "negative") {
                        $scope.arr_negative = arr_docs;
                    } else {
                        $scope.arr_positive = arr_docs;
                    }
                    NProgress.done();
                });
            });
        });
    };

    $scope.edit_feature = function (polar_word, feature_word) {
        var polar = polar_word;
        var edit_fea = prompt("Edit Feature to :", feature_word);
        if (edit_fea !== null) {
            NProgress.start();
            $http.post(url_nodejs_localhost + "/feature_polar", {feature: edit_fea, polar: polar}).success(function (str) {
                //console.log(str);
                $scope.load_table();
            });
        }
    };

    $scope.add_polar_list = function (polar_list) {
        var arr_obj = [];
        var arr_obj_dict = [];
        NProgress.start();
        var arr_polar_list = polar_list.split("\n");
        for (var i = 0; i < arr_polar_list.length; i++) {
            var obj = {};
            obj.word = arr_polar_list[i];
            obj.type = $scope.type_choose;
            obj.length = obj.word.length;
            arr_obj.push(obj);
            arr_obj_dict.push({word: arr_polar_list[i], length: arr_polar_list[i].length, type: "ความรู้สึก"});
        }
        $http.post(url_nodejs_localhost + "/insert_polar", {arr_obj: JSON.stringify(arr_obj)}).success(function () {
            $http.post(url_nodejs_localhost + "/insert_motorcycle_dict", {arr_obj: JSON.stringify(arr_obj_dict)}).success(function () {
                $http.post(url_nodejs_localhost + "/query_polar", {type_polar: $scope.type_choose}).success(function (arr_docs) {
                    if ($scope.type_choose === "negative") {
                        $scope.arr_negative = arr_docs;
                    } else {
                        $scope.arr_positive = arr_docs;
                    }
                    NProgress.done();
                });
            });
        });
    };

    $scope.delete_negative = function (word) {
        var con_check = confirm("ต้องการลบ '" + word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            NProgress.start();
            $http.post(url_nodejs_localhost + "/delete_polar", {word: word}).success(function () {
                $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "negative"}).success(function (arr_docs) {
                    $scope.arr_negative = arr_docs;
                    NProgress.done();
                });
            });
        }
    };

    $scope.delete_positive = function (word) {
        var con_check = confirm("ต้องการลบ '" + word + "' ใช่หรือไม่ ?");
        if (con_check === true) {
            NProgress.start();
            $http.post(url_nodejs_localhost + "/delete_polar", {word: word}).success(function () {
                $http.post(url_nodejs_localhost + "/query_polar", {type_polar: "positive"}).success(function (arr_docs) {
                    $scope.arr_positive = arr_docs;
                    NProgress.done();
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
            alert_long_time("15 - 30 วินาที", "กำลังโหลดคำศัพท์จากพจนานุกรมจำนวน " + arr_docs.length + " คำ มาแสดงลงตาราง");
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