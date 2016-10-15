// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('cunybookshelf', ['ionic', 'cunybookshelf.controllers', 'cunybookshelf.services', 'ngCordova', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: ''
  })

    .state('app.booksearch', {
      url: '/booksearch',
      views: {
        'menuContent': {
          templateUrl: 'templates/booksearch.html',
          controller: 'BooksearchCtrl'
        }
      }
    })

  .state('app.bookresults', {
    url: '/bookresults',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookresults.html',
        controller: 'BookresultsCtrl'
      }
    }
  })

  .state('app.sell', {
    url: '/sell',
    views: {
      'menuContent': {
        templateUrl: 'templates/sell.html',
        controller: 'SellCtrl'
      }
    }
  })

  .state('app.buy', {
    url: '/buy',
    views: {
      'menuContent': {
        templateUrl: 'templates/buy.html',
        controller: 'BuyCtrl'
      }
    }
  })

  .state('app.cunyresults', {
    url: '/cunyresults',
    views: {
      'menuContent': {
        templateUrl: 'templates/cunyresults.html',
        controller: 'CunyResultsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/booksearch');
});
