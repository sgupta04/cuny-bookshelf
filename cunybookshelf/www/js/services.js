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

// .factory("factorysavedresults", function(){
//   return {
//     savedata: function(newdata) {
//         var olddata = window.localStorage.getItem('SavedResults') || [];
//         olddata.push(newdata);
//         alert(olddata[0]['loc']);
//         window.localStorage.setItem('SavedResults', JSON.stringify(olddata));
//     },
//     getdata: function() {
//       var data = window.localStorage.getItem('SavedResults');
//       return data;
//     }
//   };
// })

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
