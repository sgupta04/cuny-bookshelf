angular.module('cunybookshelf.services', [])

.factory("factorysearchresults", function() {
    var searchresults = "";
    return {
        getsearchresults: function() {
            return searchresults;
        },
        updatesearchresults: function(updated) {
          searchresults = updated;
        }
    };
})

.factory("loading", function($ionicLoading){
  return {
    //Loading function
    show: function() {
      $ionicLoading.show({
        template: 'Loading...'
      }).then(function(){
         console.log("The loading indicator is now displayed");
      });
    },
    hide: function(){
      $ionicLoading.hide().then(function(){
         console.log("The loading indicator is now hidden");
      });
    }
  };
})

.factory("factorysavedresults", function($localStorage){
  return {
    savedata: function(newdata) {
        var olddata = $localStorage.message || [];
        olddata.push(newdata);
        $localStorage.message = olddata;
    },
    getdata: function() {
      var data = $localStorage.message;
      return data;
    },
    updatedata: function(newdata) {
      $localStorage.message = newdata
    }
  };
})

.factory("filter", function($http, $ionicPopup){
  return {
    isbn: function(result) {
      var temp = [];
      function tempf(edition_key) {
        $http({
          method: 'GET',
          url: 'https://openlibrary.org/books/'+edition_key+".json"
        }).then(function successCallback(response) {
          temp.push(response.data)
          }, function errorCallback(response) {
            $ionicPopup.alert({
             title: 'Error',
             template: response.data
           });
          });
      }
      if(result["edition_key"].length>1){
        for(i=0;i<result["edition_key"].length-1; i++)
        {
          tempf(result["edition_key"][i])
        }
      }
      else {
        tempf(result["edition_key"]);
      }
      console.log(temp);
      return temp;
    }
  };
})

.factory("cunysearchresults", function(){
  var cunyresults = [];
  return {
    getsearchresults: function() {
        return cunyresults;
    },
    updatesearchresults: function(updated) {
      cunyresults = updated;
    }
  };
});
