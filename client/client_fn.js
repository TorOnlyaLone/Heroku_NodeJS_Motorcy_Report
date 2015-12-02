/* global location,NProgress */

var url_nodejs_localhost = "https://motorcy-report.herokuapp.com";

NProgress.configure({minimum: 0.08, template: '<div class="bar" role="bar"></div>'});

function word_sement(str_input, callback) {
    $.post(url_nodejs_localhost + "/test_word_segmentation", {str_test: str_input}, function (str_out) {
        callback(str_out);
    });
}

var str = "||mรุ่นหนึ่งมีไฟแนนซ์มากมาย|ก็ไม่รู้ไฟแนนซ์||mรุ่นสามจะว่ายังไงกับการกระทำที่||mรุ่น4มองว่า||mรุ่นห้าไฟแนนซ์หนักมาก||";
var temp_removal = ["ไฟแนนซ์", "ภาษี"];
console.log(str);
for (var i = 0; i < temp_removal.length; i++) {
    var regex = "\\|\\|m(?:(?!\\|).)*" + temp_removal[i];
    var re = new RegExp(regex, "gi");
    str = str.replace(re,"|"+temp_removal[i]);
    
    var regex2 = temp_removal[i]+".*?\\|";
    var re2 = new RegExp(regex2, "gi");
    str = str.replace(re2,"|");

    //var re = new RegExp(temp_removal[i],'gi');
    
}
console.log(str);
/*
var str_ask = "abcbbabbabcd";
console.log(str_ask);
var re = new RegExp("a(?:(?!a).)*c","gi");
str_ask = str_ask.replace(re,"");
console.log(str_ask);
*/
function alert_long_time(time_str, because) {
    alert("ระบบอาจค้าง หยุดการทำงาน หรือไม่ตอบสนอง โปรดรอสักครู่ \r\nประมาณ " + time_str +
            "\r\nเนื่องจาก " + because + "\r\n\r\nถ้าแถบโหลดสีแดงด้านบนยังไม่หายแสดงว่าระบบค้างอยู่\r\n\r\n" +
            "ถ้า เบราเซอร์ถามว่า ต้องการให้สคิร์ป 'ทำงานต่อ' หรือไม่ ให้ตอบ 'ตกลง' หรือ 'รอ' จนกว่าสคิร์ปจะทำงาน");
}

function alert_develop() {
    alert('กำลังพัฒนา : ยังไม่เสร็จครับ');
}

function replace_all(str, replaceWhat, replaceTo) {
    replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    //    var re = new RegExp(replaceWhat, 'g'); /*case sensitive*/
    var re = new RegExp(replaceWhat, 'gi'); /*case insensitive*/
    str = str.replace(re, replaceTo);
    return str;
}

function remove_url_from_string(str) {
    var new_str = str.replace(/(?:https?|ftp):\/\/\S+/g, "");
    new_str = new_str.replace(/\bwww[.]\S+/g, "");
    return new_str;
}

function insertArrayWordToDict(arr_obj) {
    $.post(url_nodejs_localhost + "/insert_dict", {array_object: JSON.stringify(arr_obj)}, function () {
        alert("Insert To Dictionary Success");
        location.reload();
    });
    //$.post send array or object with JSON.stringify server receive with JSON.parse
}

function queryArrayWordFromDict(callback) {
    $.post(url_nodejs_localhost + "/query_dict", {}, function (result) {
        callback(result);
    });
}

function change_date_format(date_str) { //change 13 - 01 - 2015 to 2015-01-13
    var arr_date = date_str.split(" - ");
    return arr_date[2] + "-" + arr_date[1] + "-" + arr_date[0];
}

function change_date_format2(date_str) { //change 2015-01-13 to 13-01-2015
    var arr_date = date_str.split("-");
    return arr_date[2] + "-" + arr_date[1] + "-" + arr_date[0];
}

function cast_str_array_to_read(arr) {
    var str_arr = JSON.stringify(arr);
    str_arr = replace_all(str_arr, "[", "");
    str_arr = replace_all(str_arr, "]", "");
    str_arr = replace_all(str_arr, '"', "");
    str_arr = replace_all(str_arr, ',', " , ");
    return str_arr;
}

function check_date_undefined(st_date, en_date) {
    if (typeof (st_date) === "undefined" || typeof (en_date) === "undefined") {
        alert("กรุณาเลือกวันให้ครบ");
        return false;
    }
    else {
        return true;
    }
}

function gen_pdf() {
    alert("ติดต่อผู้พัฒนา");
}

function graph_senti_head(title, obj_result) {
    CanvasJS.addColorSet("SentimentShades",
            ["red", "green", "orange"]);
    var chart = new CanvasJS.Chart("chart_senti_head",
            {
                colorSet: "SentimentShades",
                title: {
                    text: title
                },
                data: [
                    {
                        type: "stackedBar100",
                        dataPoints: [
                            {y: obj_result.yamaha_cal[0], label: "Yamaha"},
                            {y: obj_result.honda_cal[0], label: "Honda"}

                        ]
                    },
                    {
                        type: "stackedBar100",
                        dataPoints: [
                            {y: obj_result.yamaha_cal[1], label: "Yamaha"},
                            {y: obj_result.honda_cal[1], label: "Honda"}
                        ]
                    },
                    {
                        type: "stackedBar100",
                        dataPoints: [
                            {y: obj_result.yamaha_cal[2], label: "Yamaha"},
                            {y: obj_result.honda_cal[2], label: "Honda"}
                        ]
                    }
                ]
            });
    chart.render();
}

function graph_senti_model(id_graph, obj_result) {
    var arr_obj_negative = [];
    var arr_obj_positive = [];
    var arr_obj_question = [];

    for (var key in obj_result) {
        if (obj_result.hasOwnProperty(key)) {
            arr_obj_negative.push({y: obj_result[key][0], label: obj_result[key][3]});
            arr_obj_positive.push({y: obj_result[key][1], label: obj_result[key][3]});
            arr_obj_question.push({y: obj_result[key][2], label: obj_result[key][3]});
        }
    }

    CanvasJS.addColorSet("SentimentModelShades", ["red", "green", "orange"]);
    var chart = new CanvasJS.Chart(id_graph,
            {
                colorSet: "SentimentModelShades",
                title: {text: "รายงานวิเคราะห์ตามรุ่น"},
                data: [
                    {type: "stackedColumn", dataPoints: arr_obj_negative},
                    {type: "stackedColumn", dataPoints: arr_obj_positive},
                    {type: "stackedColumn", dataPoints: arr_obj_question}
                ]
            });
    chart.render();
}

function graph_senti_v2(graph_type, title, graph_id, arr_negative, arr_positive, arr_question) {
    CanvasJS.addColorSet("SentimentShades", ["red", "green", "orange"]);
    var chart = new CanvasJS.Chart(graph_id,
            {colorSet: "SentimentShades",
                title: {text: title},
                data: [
                    {type: graph_type, dataPoints: arr_negative},
                    {type: graph_type, dataPoints: arr_positive},
                    {type: graph_type, dataPoints: arr_question}
                ]
            });
    chart.render();
}

function graph_counting_model(graph_type, title_brand, graph_id, arr_model_counting) {
    CanvasJS.addColorSet("CountingShade", ["blue"]);
    var chart = new CanvasJS.Chart(graph_id,
            {colorSet: "CountingShade",
                title: {text: title_brand},
                data: [
                    {type: graph_type, dataPoints: arr_model_counting}
                ]
            });
    chart.render();
}