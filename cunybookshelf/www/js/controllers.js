angular.module('cunybookshelf.controllers', [])

.controller('BooksearchCtrl', function($scope,$http,factorysearchresults,$state,$ionicLoading,$cordovaBarcodeScanner) {
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
    $scope.show();
    $http({
      method: 'GET',
      url: 'http://openlibrary.org/search.json?'+$scope.searchby.model+"="+$scope.searchby.searchterm
    }).then(function successCallback(response) {
        factorysearchresults.updatesearchresults(response.data);
        $state.go('app.bookresults');
        $scope.hide();
      }, function errorCallback(response) {
        $scope.hide();
        alert("error: "+response.data);
      });
  }

  //BarCode Scanner
  $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            this.searchby.model = 'isbn';
            this.searchby.searchterm = imageData.text;
            $http({
              method: 'GET',
              url: 'http://openlibrary.org/search.json?'+this.searchby.model+"="+this.searchby.searchterm
            }).then(function successCallback(response) {
                factorysearchresults.updatesearchresults(response.data);
                $state.go('app.bookresults');
              }, function errorCallback(response) {
                alert("error: "+response.data);
              });
        }.bind(this), function(error) {
            console.log("An error happened -> " + error);
        });
    };

  //Loading function
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
})

.controller('BookresultsCtrl', function($scope, $state, $http, $stateParams, factorysearchresults, cunysearchresults) {
  $scope.searchresults = factorysearchresults.getsearchresults();
  for (i = 0; i < $scope.searchresults.docs.length; i++){
    console.log(i);
  }
  $scope.showresult = false;
  $scope.showGroup = function(showresult){
    if(showresult){
      $scope.showresult = false;
    }else{
      $scope.showresult = true;
    }
  }

  $scope.cunySearch = function(isbn){
    // $scope.show();
    $http({
      method: 'GET',
      url: 'http://openlibrary.org/search.json?isbn='+isbn
    }).then(function successCallback(response) {
        cunysearchresults.updatesearchresults(response.data);
        $state.go('app.cunyresults');
        // $scope.hide();
      }, function errorCallback(response) {
        // $scope.hide();
        alert("error: "+response.data);
      });
    };

      $scope.openInExternalBrowser = function(path)
      {
        // $scope.timestamp = new Date;
       // Open in external browser
       window.open(path,'_system','location=yes');
     };
})

.controller('CunyResultsCtrl', function($scope, $stateParams, cunysearchresults) {
  $scope.cunyresults = cunysearchresults.getsearchresults().docs[0];
});
