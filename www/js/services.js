angular.module('setting.services', [])
  .factory('Account', function($http){
    return{
      getUser: function(facebookId){
        var defer = $q.defer();
        var query = new CB.CloudQuery('User');
        query.equalTo('facebook', facebookId);
        query.find({
          success: function(object){
            defer.resolve(object);
          },
          error: function(err){
            defer.reject(err);
          }
        });
        return defer.promise;
      }
    };
  })
  .factory('Match', function($http){
    return{
      getAllMatch: function(userId, column){
        var defer = $q.defer;
        var user1;
        var user2;
        if(column === "1"){
          user1 = "user1";
          user2 = "user2";
        }else{
          user1 = "user2";
          user2 = "user1";
        }
        var cbQuery = new CB.CloudQuery('match');
        cbQuery.equalTo(user1, $scope.currentUser);
        cbQuery.setLimit(70);
        cbQuery.selectColumn(user2);
        cbQuery.find(user2,{
          success: function(chatHistory){
            defer.resolve(chatHistory);
          },
          error: function(err){
            defer.reject(err);
          }
        });
        return defer.promise;
      }
    };
  })
  .factory('authFact', ['$cookieStore', function ($cookieStore) {
      var authFact = {};

      this.authToken = null;

      authFact.setAccessToken = function(authToken) {
          $cookieStore.put('accessToken', authToken);
      };

      authFact.getAccessToken = function() {
          authFact.authToken = $cookieStore.get('accessToken');
          return authFact.authToken;
      };

      authFact.getuserObj = function () {
          var userObj = $cookieStore.get('userObj');

          if (userObj)
              return userObj;
          else
              console.log('User object not found');
      };

      return authFact;
  }])
  .factory('settings', function ($cookieStore, $q) {
    return{
      setDiscoverySetting: function(data){
        var defer = $q.defer();
        var object = new CB.CloudObject('discovery_settings', data.id);
        object.set('discovery', data.discovery);
        object.set('location', data.location);
        object.set('men', data.men);
        object.set('women', data.men);
        object.set('distance', data.distance);
        object.set('ageRange', data.ageRange);
        object.save({
          success: function(settings){
            defer.resolve(settings);
          },
          error: function(err){
            defer.reject(err);
          }
        });
        return defer.promise;
      },
      getDiscoverySetting: function(user){
        var defer = $q.defer();
        var query = new CB.CloudQuery('discovery_settings');
        var obj = new CB.CloudObject("User", user);
        query.equalTo('user', obj);
        query.find({
          success: function(settings){
            defer.resolve(settings[0]);
          },
          error: function(err){
            defer.reject(err);
          }
        });
        return defer.promise;
      },
      defaultDiscoverySettings: function(userId, location) {
        var defer = $q.defer;
        var query = new CB.CloudQuery('discovery_settings');
        query.get(userId, {
          success: function(object){
            if(!object){
              var ageRange = {};
              ageRange.min = 18;
              ageRange.max = 30;
              var cbObj = new CB.CloudObject('discovery_settings');
              var user = new CB.CloudObject('User', userId);
              cbObj.set('discovery', true);
              cbObj.set('location', location);
              cbObj.set('men', true);
              cbObj.set('women', true);
              cbObj.set('distance', 50);
              cbObj.set('ageRange', ageRange);
              cbObj.set('user', user);
              cbObj.save({
                success: function(object){
                  defer.resolve(object);
                },
                error: function(err){
                  defer.reject(err);
                }
              });
            }
          },
          error: function(err){
            defer.reject(err);
          }
        });
        return defer.promise;
      },
      defaultAppSettings: function(userId) {
        var defer = $q.defer;
        var query = new CB.CloudQuery('app_settings');
        query.get(userId, {
          success: function(object){
            if(!object){
              var user = new CB.CloudObject('User', userId);
              var cbObj = new CB.CloudObject('app_settings');
              cbObj.set('match', true);
              cbObj.set('message', true);
              cbObj.set('superLikes', true);
              cbObj.set('distance', 'Km');
              cbObj.set('user', user);
              cbObj.save({
                success: function(object){
                  defer.resolve(object);
                },
                error: function(err){
                  defer.reject(err);
                }
              });
            }
          },
          error: function(err){
            defer.reject(err);
          }
        });
        return defer.promise;
      },
      setAppSetting: function(data){
        var defer = $q.defer();
        var object = new CB.CloudObject('app_settings', data.id);
        object.set('match', true);
        object.set('message', true);
        object.set('superLikes', true);
        object.set('distance', 'Km');
        object.save({
          success: function(settings){
            defer.resolve(settings);
          },
          error: function(err){
            defer.reject(err);
          }
        });
        return defer.promise;
      },
      getAppSetting: function(user){
        var defer = $q.defer();
        var query = new CB.CloudQuery('app_settings');
        var obj = new CB.CloudObject("User", user);
        query.equalTo('user', obj);
        query.find({
          success: function(settings){
            defer.resolve(settings[0]);
          },
          error: function(err){
            defer.reject(err);
          }
        });
        return defer.promise;
      }
    };
  })
  .factory('facebookLogin', function ($cookieStore, $q) {
    return {
     userAccount: function(profile){
       var profileId = profile.id;
       var email = profile.email;
       var fisrt_name = profile.first_name;
       var last_name = profile.last_name;
       var picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
       var gender = profile.gender;
       var defer = $q.defer();
       var cbquery = new CB.CloudQuery('User');
       cbquery.equalTo('facebook', profileId);
       cbquery.find({
         success: function(object){
           if(object.length > 0){
              defer.resolve(object[0]);
           }else{
              var cbuser = new CB.CloudObject('User');
              cbuser.set('username', email);
              cbuser.set('email', email);
              cbuser.set('password', '2zBIht@mePh<1Rf'); //dummy password
              cbuser.set('facebook', profileId);
              cbuser.set('picture', picture);
              cbuser.set('gender', gender);
              cbuser.set('first_name', fisrt_name);
              cbuser.set('last_name', last_name);
              cbuser.save({
                success: function(user){
                  var cbObj1 = new CB.CloudObject('app_settings');
                  var notifications = {};
                  notifications.match = true;
                  notifications.message = true;
                  notifications.superLikes = true;
                  cbObj1.set('notifications', notifications);
                  cbObj1.set('distance', 'Km');
                  cbObj1.set('user', user);
                  cbObj1.save({
                    success: function(object){

                    },
                    error: function(err){

                    }
                  });

                  var point;
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position){
                        var ageRange = {};
                        ageRange.min = 18;
                        ageRange.max = 30;
                        var cbObj = new CB.CloudObject('discovery_settings');
                        cbObj.set('discovery', true);
                        var point = new CB.CloudGeoPoint(position.coords.latitude, position.coords.longitude);
                        cbObj.set('location', point);
                        cbObj.set('men', true);
                        cbObj.set('women', true);
                        cbObj.set('distance', 50);
                        cbObj.set('ageRange', ageRange);
                        cbObj.set('user', user);
                        cbObj.save({
                          success: function(object){

                          },
                          error: function(err){

                          }
                        });

                    });
                    defer.resolve(user);
                  }else{
                    var ageRange = {};
                    ageRange.min = 18;
                    ageRange.max = 30;
                    var cbObj = new CB.CloudObject('discovery_settings');
                    cbObj.set('discovery', true);
                    cbObj.set('men', true);
                    cbObj.set('women', true);
                    cbObj.set('distance', 50);
                    cbObj.set('ageRange', ageRange);
                    cbObj.set('user', user);
                    cbObj.save({
                      success: function(object){

                      },
                      error: function(err){

                      }
                    });
                    defer.resolve(user);
                  }
                },
                error: function(err){
                  defer.reject(err);
                }
              });
           }
         },
         error: function(err){
           defer.reject(err);
         }
       });
       return defer.promise;
     }
   };
 });
