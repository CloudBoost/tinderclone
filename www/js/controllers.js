angular.module('setting.controllers', [])
.controller('LoginCtrl', function($scope, $rootScope, $location, authFact, $cookieStore, $http, facebookLogin) {
  $scope.facebookLogin = function () {
    FB.login(function (response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
                /*setting the user object*/
                console.log('user', response);
                $cookieStore.put('userObj', response);

                /*get the access token*/
                var FBAccessToken = FB.getAuthResponse().accessToken;
                console.log('access token', FBAccessToken);
                authFact.setAccessToken(FBAccessToken);
                $http.get("https://graph.facebook.com/v2.2/me", { params: { access_token: FBAccessToken, fields: "id, email, first_name, last_name, gender, birthday, location", format: "json" }}).then(function(result) {
                  var profile = result.data;
                  facebookLogin.userAccount(profile).then(function(data) {
                    $rootScope.user = data.document;
                    $location.path('/app');
                    //$scope.$apply();
                  }).catch(function(err) {
                    console.log(err);
                  });
                }).catch(function(err){
                  console.log(err);
                });
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    });
   };
})
.controller('HomeCtrl', function($rootScope, $scope, TDCardDelegate, $ionicSlideBoxDelegate) {
  var cardTypes = [{
    'name': 'John',
    'age':23,
    image: 'img/1.jpg'
  }, {
    'name': 'Kate',
    'age': 24,
    image: 'img/2.jpg'
  }, {
    'name': 'Britney',
    'age':26,
    image: 'img/3.jpg'
  }, {
    'name': 'Khaleesi',
    'age':27,
    image: 'img/4.jpeg'
  }, {
    'name': 'Sansa',
    'age': 26,
    image: 'img/5.png'
  }];
  $scope.cards = Array.prototype.slice.call(cardTypes, 0);

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

  $scope.next = function(){
    $ionicSlideBoxDelegate.slide(1);
  };

  $scope.previous = function(){
    $ionicSlideBoxDelegate.slide(0);
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
})
.controller('ProfileCtrl', function($rootScope, $scope, $location){
  $scope.goBack = function() {
    $location.path('/app');
  };
})
.controller('MatchCtrl', function($rootScope, $scope, $state, $location, $ionicLoading, Match){
    $scope.goBack = function() {
      $location.path('/app');
    };

    if($rootScope.user){
      listMatch();
    }
    function listMatch(){
      $ionicLoading.show({
        template: 'Loading...'
      });
      var members;
      $scope.chatHistory = [];
      Match.getAllMatch($rootScope.user._id, "1").then(function(result1){
        $scope.chatHistory = _.pluck(result1, 'document');
        Match.getAllMatch($rootScope.user._id, "2").then(function(result2){
          var user2 = _.pluck(result2, 'document');
          for(var i=0; i<user2.length; i++){
            $scope.chatHistory.push(user2[i]);
          }
          var chatMembers1 = _.pluck($scope.chatHistory, 'user1');
          var chatMembers2 = _.pluck($scope.chatHistory, 'user2');
          for(i=0; i<chatMembers2.length; i++){
            chatMembers1.push(chatMembers2[i]);
          }
          $scope.chatMembers = _.pluck(chatMembers1, 'document');
          $scope.chatMembers = _.pluck($scope.chatMembers, '_id');
          $scope.chatMembers = _.uniq($scope.chatMembers);
          $scope.chatMembers = _.filter($scope.chatMembers, Boolean);
          $scope.$apply();
          var query = new CB.CloudQuery('User');
          for(i=0; i < $scope.chatMembers.length;i++){
            query.get($scope.chatMembers[i], {
              success: function(obj){
                $scope.chatUserList[obj.get('id')] = {"id":obj.get('id'),"first_name": obj.get('first_name'), "last_name": obj.get('last_name'), "picture": obj.get('picture')};
                $ionicLoading.hide();
                $scope.userList[obj.get('id')] = $scope.chatUserList[obj.get('id')];
                $scope.$apply();
              },error: function(err){
                console.log(err);
              }
            });
          }
        }).catch(function(err){
          console.log(err);
        });
      }).catch(function(err){
        console.log(err);
      });
  }

  $scope.startChatting = function(user, name){
    $state.go('chat', {'userId': user, 'name': name});
  };
})
.controller('ChatCtrl', function($rootScope, $scope, $location, $state, $ionicLoading, $ionicScrollDelegate, $stateParams, settings){
    $scope.user = $stateParams.name;
    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    if($stateParams.userId){
      $scope.chatUser = new CB.CloudObject('User', $stateParams.userId);
      $scope.currentUser = new CB.CloudObject('User', $rootScope.user._id);
      startChat($stateParams.userId);
    }
    function startChat(member){
      $scope.chat = member;
      $ionicLoading.show({
        template: 'Loading...'
      });
      var userQuery = new CB.CloudQuery('User');
      userQuery.get(member, {
        success: function(obj){
          $scope.chatUser = obj;
          var cbChat1 = new CB.CloudQuery('Chat');
          var cbChat2 = new CB.CloudQuery('Chat');
          cbChat1.equalTo('to', $scope.currentUser);
          cbChat1.equalTo('from', $scope.chatUser);
          cbChat2.equalTo('from', $scope.currentUser);
          cbChat2.equalTo('to', $scope.chatUser);
          var cbChat = CB.CloudQuery.or(cbChat1, cbChat2);
          cbChat.setLimit(50);
          cbChat.find({
            success: function(chatList){
              $ionicLoading.hide();
              $scope.chatHistory = chatList;

            },
            error: function(){
              console.log(err);
              $ionicLoading.hide();
            }
          });
          markChatRead();
        }
      });
    }

   $scope.saveChatText = function(){
     var cbChatObject = new CB.CloudObject('Chat');
     cbChatObject.set('to', $scope.chatUser);
     cbChatObject.set('from', $scope.currentUser);
     cbChatObject.set('message', $scope.text);
     cbChatObject.set('read', false);
     cbChatObject.save({
       success: function(obj){
         if(!obj){
           //unable to save message
         }
       },
       error: function(err){
         //unable to save message
       }
     });
     $scope.text = "";
  };

  $scope.timeConversion = function(time){
    return moment(time).unix();
  };

  //--------------------------------Real Time---------------------------------------
  $scope.chatUser = new CB.CloudObject('User', $stateParams.userId);
  CB.CloudObject.on('Chat', 'created', function(obj){
    if((obj.document.to.document._id === $rootScope.user._id || obj.document.from.document._id === $rootScope.user._id) && (obj.document.from.document._id === $scope.chatUser.document._id || obj.document.to.document._id === $scope.chatUser.document._id)){
      $scope.$apply(function () {
        $scope.chatHistory.push(obj);
      });
      viewScroll.scrollBottom(true);
    }
  });

})
.controller('DiscoveryCtrl', function($rootScope, $scope, $location, $state, settings){
    $scope.discovery = true;
    $scope.men = true;
    $scope.women = true;
    $scope.distance = 60;
    $scope.ageRange = {min:"18", max:"25"};
    settings.getDiscoverySetting($rootScope.user._id).then(function(result){
      $scope.discovery = result.document.discovery;
      $scope.men = result.document.men;
      $scope.women = result.document.women;
      $scope.distance = result.document.distance;
      $scope.ageRange = result.document.ageRange;
    }).catch(function(err){
      console.log(err);
    });

    $scope.goBack = function() {
      $location.path('/app');
    };

    $scope.save = function(){
      settings.setDiscoverySetting().then(function() {

      }).catch(function(err) {
        console.log(err);
      });
    };
})
.controller('ApplicationCtrl', function($scope, $rootScope, $location, $state, settings){

    settings.getAppSetting($rootScope.user._id).then(function(result){
        $scope.match = result.document.notifications.match;
        $scope.message = result.document.notifications.message;
        $scope.like = result.document.superLikes;
    }).catch(function(err){
        console.log(err);
    });
    $scope.goBack = function() {
      $location.path('/app');
    };

    if($rootScope.newMatch)
    $scope.save = function(){

    };
});
