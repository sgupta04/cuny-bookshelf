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

.factory("sellresult", function(){
  var cunyresults = "";
  return {
    getsellresult: function() {
        return cunyresults;
    },
    updatesellresult: function(updated) {
      cunyresults = updated;
    }
  };
})

.factory("cunysearchresults", function(){
  var cunyresults = "";
  return {
    getsearchresults: function() {
        return cunyresults;
    },
    updatesearchresults: function(updated) {
      cunyresults = updated;
    }
  };
});
