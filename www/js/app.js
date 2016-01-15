// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('setting', ['ionic','setting.controllers', 'setting.services', 'ionic.contrib.ui.tinderCards'])
.run(function($ionicPlatform) {
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
      .state('app', {
        url: '/app',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
      })
      .state('discovery', {
        url: '/discovery',
        templateUrl: 'templates/discovery.html',
      })
      .state('application', {
        url: '/application',
        templateUrl: 'templates/application.html',
      })
      .state('chat', {
        url: '/chat',
        templateUrl: 'templates/chat.html',
      }).state('user', {
        url: '/user',
        templateUrl: 'templates/user.html',
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app');

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
