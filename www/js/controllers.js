angular.module('setting.controllers', [])

.controller('HomeCtrl', function($scope, TDCardDelegate) {
  var cardTypes = [{
    'name': 'Plus',
    'age':22,
    image: 'img/plus.png'
  }, {
    'name': 'Heart',
    'age': 24,
    image: 'img/heart.png'
  }, {
    'name': 'Ranjeet',
    'age':25,
    image: 'img/profile.jpg'
  }, {
    'name': 'Question Mark',
    'age':27,
    image: 'img/question.png'
  }, {
    'name': 'Fire',
    'age': 26,
    image: 'img/fire.png'
  }];
  $scope.cards = Array.prototype.slice.call(cardTypes, 0);
  //$scope.cards = cardTypes;
  console.log("length: "+ $scope.cards.length);
  $scope.cardSwiped = function(index) {
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  };
})
.controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
});
