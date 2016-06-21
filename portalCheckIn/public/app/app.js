var appLogin = angular.module('loginUser', ['ui.router','ui.bootstrap', 'ngResource', 'ngStorage']); //ngResource

appLogin.factory('updateNameService', function() {
    var userName = {};
    function set(data) {
        userName = data;
    }
    function get() {
        return userName;
    }

    return {
        set: set,
        get: get
    }

});

appLogin.service('CheckInService', function($localStorage){//created service to allow tokens to read and used in multiple controllers
    this.saveToken = function(token){
        console.log(token);
        $localStorage.token = token;
    };
    this.getToken = function(){
        return $localStorage.token;
    };

    this.removeToken = function() {
        console.log("before: " +$localStorage.token);
        delete $localStorage.token;
        console.log("after: " +$localStorage.token);
    }
});

appLogin.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/views/partial-index.html'
        })
        .state('adminView', {
            url: '/adminView',
            templateUrl: 'views/adminViewPage.html',
             controller: 'adminController'
        })
        .state('adminLogin', {
            url: '/login',
            templateUrl: 'views/admin.html',
            controller : 'loginController'
        })
        .state('CheckIn',{
            url: '/CheckIn',
            templateUrl: 'views/checkin_login.html',
            controller : 'loginController'
        })
        .state('CheckOut', {
            url: '/CheckOut',
            templateUrl:'views/checkout_login.html',
            controller : 'loginController',
        })
        .state('CheckOutConfirmation', {
            url: '/CheckInConfirmation',
            templateUrl : '/views/checkout_confirmation.html'
        })
        .state('CheckInConfirmation', {
            url: '/CheckOutConfirmation',
            templateUrl : '/views/checkin_confirmation.html'
        })
});
