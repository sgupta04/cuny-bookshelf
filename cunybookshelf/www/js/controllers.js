angular.module('cunybookshelf.controllers', [])

.controller('BooksearchCtrl', function($scope,$http,factorysearchresults,$state,loading,$cordovaBarcodeScanner) {
  $scope.searchby = {
    searchterm: null,
    model: null,
    availableOptions: [
      {id:"q" , name:"Keyword anywhere"},
      {id:"title" , name:"Title"},
      {id:"author" , name:"Author"},
      {id:"isbn", name:"ISBN"}
    ]};
  $scope.search = function(){
    loading.show();
    $http({
      method: 'GET',
      url: 'http://openlibrary.org/search.json?'+$scope.searchby.model+"="+$scope.searchby.searchterm
    }).then(function successCallback(response) {
        if(response.data.docs.length!=0){
          factorysearchresults.updatesearchresults(response.data);
          loading.hide();
          $state.go('app.bookresults');
        }
        else {loading.hide();alert("Book not found");}
      }, function errorCallback(response) {
        loading.hide();
        alert("error: "+response.data);
      });
  }

  //BarCode Scanner
  $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            this.searchby.model = 'isbn';
            this.searchby.searchterm = imageData.text;
            this.search();
        }.bind(this), function(error) {
            console.log("An error happened -> " + error);
        });
    };
})

.controller('BookresultsCtrl', function($scope, $stateParams,cunysearchresults, factorysearchresults, $http, $state, loading, $ionicPopup, $localStorage) {
  $scope.searchresults = factorysearchresults.getsearchresults();
  $scope.openInExternalBrowser = function(path)
  {
    // $scope.timestamp = new Date;
   // Open in external browser
   window.open(path,'_system','location=yes');
  };

  $scope.savedata = function(newdata){
    $localStorage.message = newdata;
    alert("Saved!");
  }

  $scope.cunySearch = function(keyword,key,result){
    loading.show();
     $http({
       method: 'GET',
       url: 'http://lookup.cunylibraries.org/cun01/'+key+'/'+keyword+'?format=json'
     }).then(function successCallback(response) {
         if(response.data.length!=0){
           cunysearchresults.updatesearchresults([response.data,keyword]);
           loading.hide();
           $state.go('app.cunyresults');
         }
         else {
           loading.hide();
           $ionicPopup.confirm({
             title: 'That particular book not found',
             template: 'Do you wish to search the book by Title instead? (Note: Results may not be accurate)',
             scope: $scope
           }).then(function(res) {
             if(res) {
               loading.show();
                $http({
                  method: 'GET',
                  url: 'http://lookup.cunylibraries.org/cun01/title'+'/'+result['title']+'?format=json'
                }).then(function successCallback(response) {
                    if(response.data.length!=0){
                      cunysearchresults.updatesearchresults([response.data,'']);
                      loading.hide();
                      $state.go('app.cunyresults');
                    }
                    else {
                      loading.hide();
                      alert("Book not available in CUNY");
                    }
               }, function errorCallback(response) {
                 loading.hide();
                 alert("error: "+response.data);
               });
             }
             else {
               console.log('You are not sure');
             }
           });
           //alert("Book not available in CUNY");
         }
       }, function errorCallback(response) {
         loading.hide();
         alert("error: "+response.data);
       });
     };
})

.controller('SavedresultsCtrl', function($scope, $stateParams, $http, $state, loading, $ionicPopup, $localStorage, cunysearchresults) {
  $scope.result = $localStorage.message.data;
  $scope.openInExternalBrowser = function(path)
  {
    // $scope.timestamp = new Date;
   // Open in external browser
   window.open(path,'_system','location=yes');
  };

  $scope.cunySearch = function(keyword,key,result){
    loading.show();
     $http({
       method: 'GET',
       url: 'http://lookup.cunylibraries.org/cun01/'+key+'/'+keyword+'?format=json'
     }).then(function successCallback(response) {
         if(response.data.length!=0){
           cunysearchresults.updatesearchresults([response.data,keyword]);
           loading.hide();
           $state.go('app.cunyresults');
         }
         else {
           loading.hide();
           $ionicPopup.confirm({
             title: 'That particular book not found',
             template: 'Do you wish to search the book by Title instead? (Note: Results may not be accurate)',
             scope: $scope
           }).then(function(res) {
             if(res) {
               loading.show();
                $http({
                  method: 'GET',
                  url: 'http://lookup.cunylibraries.org/cun01/title'+'/'+result['title']+'?format=json'
                }).then(function successCallback(response) {
                    if(response.data.length!=0){
                      cunysearchresults.updatesearchresults([response.data,'']);
                      loading.hide();
                      $state.go('app.cunyresults');
                    }
                    else {
                      loading.hide();
                      alert("Book not available in CUNY");
                    }
               }, function errorCallback(response) {
                 loading.hide();
                 alert("error: "+response.data);
               });
             }
             else {
               console.log('You are not sure');
             }
           });
           //alert("Book not available in CUNY");
         }
       }, function errorCallback(response) {
         loading.hide();
         alert("error: "+response.data);
       });
     };
})


.controller('CunyResultsCtrl', function($scope, $stateParams, cunysearchresults) {
  $scope.cunyresults = cunysearchresults.getsearchresults();
  $scope.openInExternalBrowser = function(path)
  {
   // Open in external browser
   var win = cordova.InAppBrowser.open(path, '_system', 'location=yes');
  };
})

.filter('unique', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
})

.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        if (attrs.src != attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  }
});
