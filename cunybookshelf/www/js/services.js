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
