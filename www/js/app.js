// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('setting', ['ionic','setting.controllers', 'setting.services', 'ionic.contrib.ui.tinderCards', 'ngCookies'])
.run(function($ionicPlatform, $rootScope, $state, $window) {
  CB.CloudApp.init('cb_tinder', 'LH0tChsbTm9RQlCwDNiAAg==');
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('home', {
        url: '/app',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('discovery', {
        url: '/discovery',
        templateUrl: 'templates/discovery.html',
        controller: 'DiscoveryCtrl'
      })
      .state('application', {
        url: '/application',
        templateUrl: 'templates/application.html',
        controller: 'ApplicationCtrl'
      })
      .state('match', {
        url: '/match',
        templateUrl: 'templates/match.html',
        controller: 'MatchCtrl'
      })
      .state('chat', {
        url: '/chat',
        params:{'userId': null, 'name':null},
        templateUrl: 'templates/chat.html',
      })
      .state('user', {
        url: '/user',
        templateUrl: 'templates/user.html',
      })
      .state('logout', {
        url: "/logout",
        templateUrl: "templates/login.html",
        controller: "LogoutCtrl"
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

})
.directive('noScroll', function($document) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  };
});
window.fbAsyncInit = function() {
    FB.init({
        appId      : '1681736478751356',
        xfbml      : true,
        version    : 'v2.3'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
    console.log('FB init');
}(document, 'script', 'facebook-jssdk'))
