/* global angular */

var app = angular.module('Motorcycle', [
    "ngRoute",
    "mobile-angular-ui"
]);

app.config(['$routeProvider', /* '$locationProvider',*/
    function ($routeProvider/*, $locationProvider*/) {
        $routeProvider.when('/', {
            templateUrl: '../pages/00_home.html',
            controller: 'HomeCtrl'
        }).when('/home', {
            templateUrl: '../pages/00_home.html',
            controller: 'HomeCtrl'
        }).when('/dict_manage', {
            templateUrl: '../pages/backend/00_dict_manage.html',
            controller: 'DictManageCtrl'
        }).when('/polar_manage', {
            templateUrl: '../pages/backend/01_polar_manage.html',
            controller: 'PolarManageCtrl'
        }).when('/model_manage', {
            templateUrl: '../pages/backend/02_model_manage.html',
            controller: 'ModelManageCtrl'
        }).when('/question_manage', {
            templateUrl: '../pages/backend/03_question_manage.html',
            controller: 'QuestionManageCtrl'
        }).when('/motorcy_dict', {
            templateUrl: '../pages/backend/04_motorcy_dict.html',
            controller: 'MotorcyDictCtrl'
        }).when('/report_head', {
            templateUrl: '../pages/frontend/00_Report_Head.html',
            controller: 'ReportHeadCtrl'
        }).when('/report_comment', {
            templateUrl: '../pages/frontend/01_Report_Comment.html',
            controller: 'ReportCommentCtrl'
        }).when('/report_model', {
            templateUrl: '../pages/frontend/02_Report_Model.html',
            controller: 'ReportModelCtrl'
        }).when('/report_data', {
            templateUrl: '../pages/frontend/03_Report_Data.html',
            controller: 'ReportDataCtrl'
        });
        // $locationProvider.html5Mode(true);
    }]);

//app.filter('html', ['$sce', function ($sce) {
//        return function (text) {
//            return $sce.trustAsHtml(text);
//        };
//    }]);

//function initCtrl($rootScope, $location, $timeout, $http) {
//    
//}
//app.run(initCtrl);

