// create the module and name it ultimateRecipes
	// also include ngRoute for all our routing needs
var ultimateRecipes = angular.module('ultimateRecipes', ['ngRoute', 'firebase']).constant('FIREBASE_URL', 'https://recappy.firebaseIO.com/');

ultimateRecipes.run(['$rootScope', '$location'
    , function ($rootScope, $location) {
        $rootScope.$on('$routeChangeError'
            , function (event, next, previous, error) {
                if (error == 'AUTH_REQUIRED') {
                    $rootScope.message = 'Sorry, you must log in to access that page';
                    $location.path('/login');
                } // AUTH REQUIRED
            }); //event info
  }]); //run

// configure our routes
ultimateRecipes.config(['$routeProvider',function($routeProvider) {
	$routeProvider
        .when('/login', {
        templateUrl: 'pages/login.html'
        , controller: 'RegistrationController'
         })
        .when('/register', {
        templateUrl: 'pages/register.html'
        , controller: 'RegistrationController'
        })
		// route for the home page
		.when('/home', {
			templateUrl : 'pages/home.html',
			controller  : 'mainController'
		})

		// route for the about page
		.when('/about', {
			templateUrl : 'pages/about.html',
			controller  : 'aboutController'
		})

		// route for the contact page
		.when('/contact', {
			templateUrl : 'pages/contact.html',
			controller  : 'contactController'
		}).
    when('/saved', {
        templateUrl: 'pages/saved.html'
        , controller: 'recipiesController'
        , resolve: {
            currentAuth: function (Authentication) {
                    return Authentication.requireAuth();
                } //current Auth
        } //resolve
    })
}]);

// create the controller and inject Angular's $scope
ultimateRecipes.controller('mainController', function($scope, $sce, $http) {
	$scope.ingredients = [
		{name: "butter", weight: 100},
		{name: "flour", weight: 99},
		{name: "mayonnaise", weight: 98},
		{name: "rice", weight: 97},
		{name: "eggs", weight: 90},
		{name: "tomatoes", weight: 2},
		{name: "sugar", weight: 99},
		{name: "coffee", weight: 1},
		{name: "bread", weight: 2},
		{name: "milk", weight: 97}
	]
	$scope.page = 1;
	$scope.clicked = []
	$scope.saveWithEnter = function($event, ingredient){
		var keyCode = $event.which || $event.keyCode;
		var alreadyClicked = false;
		if (keyCode === 13) {
			for(i = 0; i < $scope.clicked.length; i++){
				if($scope.clicked[i].name == ingredient){
					alreadyClicked = true;
				}
			}
			if(!alreadyClicked){
				$scope.saveIngredient(ingredient);
			}
			$scope.writtenIngredients = null;
		}
	}
	$scope.saveIngredient = function(ingredient){
		angular.element( document.querySelector( "#ingredient-" + ingredient ) ).addClass("clicked");
		$scope.clicked.push({'name': ingredient});
		$scope.getRecipes();
	}
	$scope.deleteIngredient = function(ingredient){
		for(var i = 0; i < $scope.clicked.length; i++){
			if($scope.clicked[i].name == ingredient){
				$scope.clicked.splice(i, 1);
			}
		}
		angular.element( document.querySelector( "#ingredient-" + ingredient ) ).removeClass("clicked");
		if($scope.clicked.length != 0){
			$scope.getRecipes();
		}
	}
	$scope.clearAllIngredient = function(){
		for(var i = 0; i < $scope.clicked.length; i++){
			angular.element( document.querySelector( "#ingredient-" + $scope.clicked[i].name ) ).removeClass("clicked");
		}
		$scope.clicked = [];
	}
	$scope.getMoreResults = function(){
		$scope.page += 1;
		$scope.getRecipes();
	}
	$scope.getRecipes = function(){
		$scope.loading = true;
		if($scope.page == 1){
			$scope.list = null;
			var parameters = "";
			for(var i = 0; i < $scope.clicked.length; i++){
				if(i == 0){
					$scope.parameters = $scope.clicked[0].name;
				}
				else{
					$scope.parameters += "," + $scope.clicked[i].name;
				}
			}
			var params = {
				key: '1a6f83a39c92b86b8a75816c4047480e',
				q: $scope.parameters
			}
			var mashape_key = "PHtm3e9G0tmshhkawBWLbVhUP1TLp1LP8e7jsnwrpQfuxPYTiU";
			$.ajax({
				url: "https://community-food2fork.p.mashape.com/search",
				headers: { 
				  "X-Mashape-Key": mashape_key,
				  "Accept": 'application/json'
				},
				type: 'GET',
				dataType: 'json',
				contentType: 'application/json',
				data: params,
				success: function (data) {
				  console.log();
				  $scope.list = data.recipes;
				 
				},
				error: function(error){
					console.log(error);
				}
			});
		}
		else{
			var params = {
				key: '1a6f83a39c92b86b8a75816c4047480e',
				q: $scope.parameters + "&page=" + $scope.page
			}
			var mashape_key = "PHtm3e9G0tmshhkawBWLbVhUP1TLp1LP8e7jsnwrpQfuxPYTiU";
			$.ajax({
				url: "https://community-food2fork.p.mashape.com/search",
				headers: { 
				  "X-Mashape-Key": mashape_key,
				  "Accept": 'application/json'
				},
				type: 'GET',
				dataType: 'json',
				contentType: 'application/json',
				data: params,
				success: function (data) {
				  console.log();
				  $scope.list.concat(data.recipes);
				 
				},
				error: function(error){
					console.log(error);
				}
			});
		}
		setInterval(function() {
			$scope.loading = false;
			$scope.$apply();
		}, 2000); 
	}
	$scope.recipes = new Array();
	$scope.getIngredient = function(recipe_id){
		var params = {
			key: '1a6f83a39c92b86b8a75816c4047480e',
			rId: recipe_id
		}
		var mashape_key = "PHtm3e9G0tmshhkawBWLbVhUP1TLp1LP8e7jsnwrpQfuxPYTiU";
		$.ajax({
			url: "https://community-food2fork.p.mashape.com/get",
			headers: { 
			  "X-Mashape-Key": mashape_key,
			  "Accept": 'application/json'
			},
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			data: params,
			success: function (data) {
			  console.log();
			  $scope.recipes["" + recipe_id + ""] = data.recipe;
			 
			},
			error: function(error){
				console.log(error);
			}
		});
		var a = "a";
	}
});

ultimateRecipes.controller('aboutController', function($scope) {
	$scope.message = 'Recappy is an app that gives you the recipes you crave from the ingredients you have in your fridge.';
});

ultimateRecipes.controller('contactController', function($scope) {
	$scope.message = 'Contact us! JK. This is just a demo.';
});