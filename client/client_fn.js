/* global location,NProgress */

var url_nodejs_localhost = "https://motorcy-report.herokuapp.com";

NProgress.configure({
    minimum: 0.08,
    template: '<div class="bar" role="bar"></div>'
});

function alert_long_time(time_str, because) {
    alert("ระบบอาจค้าง หยุดการทำงาน หรือไม่ตอบสนอง โปรดรอสักครู่ \r\nประมาณ " + time_str +
            "\r\nเนื่องจาก " + because + "\r\n\r\nถ้าแถบโหลดสีแดงด้านบนยังไม่หายแสดงว่าระบบค้างอยู่\r\n\r\n" +
            "ถ้า เบราเซอร์ถามว่า ต้องการให้สคิร์ป 'ทำงานต่อ' หรือไม่ ให้ตอบ 'ตกลง' หรือ 'รอ' จนกว่าสคิร์ปจะทำงาน");
}

function alert_develop(){
    alert('กำลังพัฒนา : ยังไม่เสร็จครับ');
}

//function crossid_js_to_angular(id_value){
//    return document.getElementById(id_value).value;
//}

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

function gen_pdf(){
    alert("ติดต่อผู้พัฒนา");
}