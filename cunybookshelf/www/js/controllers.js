angular.module('cunybookshelf.controllers', [])

.controller('BooksearchCtrl', function($scope,$http,factorysearchresults,$state,loading,$cordovaBarcodeScanner,$ionicPopup) {
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
        else {
          loading.hide();
          $ionicPopup.alert({
           title: 'Book not found!'
         });
        }
      }, function errorCallback(response) {
        loading.hide();
        $ionicPopup.alert({
         title: 'Error',
         template: response.data
       });
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

.controller('BookresultsCtrl', function($scope, $stateParams,cunysearchresults, factorysearchresults, $http, $state, loading, $ionicPopup, factorysavedresults, filter, $ionicModal) {
  $scope.searchresults = factorysearchresults.getsearchresults();
  $scope.openInExternalBrowser = function(path, isbn)
  {
    // $scope.timestamp = new Date;
   // Open in external browser
   if(path == "CUNY"){
     if(isbn[1]){
       $scope.cunySearch(isbn[1],'isbn', $scope.result);
     }
     else $scope.cunySearch(isbn[0],'isbn', $scope.result);
   }
   else
   {
     if(isbn[1]){
       window.open(path+isbn[1],'_system','location=yes');
     }
     else window.open(path+isbn[0],'_system','location=yes');
   }
  };

  $scope.savedata = function(newdata){
    factorysavedresults.savedata(newdata);
    $ionicPopup.alert({
     title: 'Saved!',
     template: 'The result can be found on Saved Searches'
   });
  }

  $scope.filterisbn = function(result, path){
     $scope.editions = filter.isbn(result);
     $scope.path = path;
     $scope.result = result;
     $scope.openModal();
     //$scope.openInExternalBrowser(path+filterisbn);
  }

  $ionicModal.fromTemplateUrl('templates/edition.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

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
             title: 'That particular book not found!',
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
                      $ionicPopup.alert({
                       title: 'Book not available in CUNY'
                     });
                    }
               }, function errorCallback(response) {
                 loading.hide();
                 $ionicPopup.alert({
                  title: 'Error',
                  template: response.data
                });
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
         $ionicPopup.alert({
          title: 'Error',
          template: response.data
        });
       });
     };
})

.controller('SavedresultsCtrl', function($scope, $stateParams, $http, $state, loading, $ionicPopup, $localStorage, cunysearchresults, factorysavedresults, filter, $ionicModal) {
  $scope.results = factorysavedresults.getdata();
  $scope.filterisbn = function(result, path){
     $scope.editions = filter.isbn(result);
     $scope.path = path;
     $scope.result = result;
     $scope.openModal();
     //$scope.openInExternalBrowser(path+filterisbn);
  }

  $ionicModal.fromTemplateUrl('templates/edition.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });


  $scope.deletedata = function(index){
    var data = factorysavedresults.getdata();
    data.splice(index, 1);
    factorysavedresults.updatedata(data);
    alert(index);
  }

  $scope.openInExternalBrowser = function(path, isbn, result)
  {
    // $scope.timestamp = new Date;
   // Open in external browser
   if(path == "CUNY"){
     if(isbn[1]){
       $scope.cunySearch(isbn[1],'isbn', result);
     }
     else $scope.cunySearch(isbn[0],'isbn', result);
   }
   else
   {
     if(isbn[1]){
       window.open(path+isbn[1],'_system','location=yes');
     }
     else window.open(path+isbn[0],'_system','location=yes');
   }
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
             title: 'That particular book not found!',
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
                      $ionicPopup.alert({
                       title: 'Book not available in CUNY'
                     });

                    }
               }, function errorCallback(response) {
                 loading.hide();
                 $ionicPopup.alert({
                  title: 'Book not available in CUNY'
                });
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
         $ionicPopup.alert({
          title: 'Error',
          template: response.data
        });
       });
     };
})


.controller('CunyResultsCtrl', function($scope, $stateParams, cunysearchresults, factorysavedresults, $ionicPopup) {
  $scope.cunyresults = cunysearchresults.getsearchresults();

  $scope.savedata = function(newdata){
    factorysavedresults.savedata(newdata);
    $ionicPopup.alert({
     title: 'Saved!',
     template: 'The result can be found on Saved Searches'
   });
  }

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
