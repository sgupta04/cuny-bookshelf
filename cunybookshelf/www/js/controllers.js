angular.module('cunybookshelf.controllers', [])

.controller('BooksearchCtrl', function($scope,$http,factorysearchresults,$state,$ionicLoading) {
  $scope.searchby = {
    searchterm: null,
    model: null,
    availableOptions: [
      {id:"q" , name:"Keyword anywhere"},
      {id:"title" , name:"Title"},
      {id:"author" , name:"Author"},
      {id:"isbn", name:"ISBN"}
    ]};
  $scope.search = function(path){
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

.controller('BookresultsCtrl', function($scope, $stateParams, factorysearchresults) {
  $scope.searchresults = factorysearchresults.getsearchresults();
  for (i = 0; i < $scope.searchresults.docs.length; i++){
    console.log(i);
  }
})

.controller('AmazonresultsCtrl', function($scope, $stateParams) {
});
