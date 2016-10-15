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
});
