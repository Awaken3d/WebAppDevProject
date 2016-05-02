ultimateRecipes.controller('recipiesController', ['$scope', '$rootScope', '$location', '$firebaseObject', '$firebaseArray', '$routeParams', 'FIREBASE_URL', function ($scope, $rootScope, $location, $firebaseObject, $firebaseArray, $routeParams, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL + 'users/' +
        $scope.currentUser.regUser + '/recipies');
    var savedRecipies = $firebaseArray(ref);
    console.log(savedRecipies);
    $rootScope.savedrecipies = savedRecipies;
    $scope.showLove = function(listItem){
        var recipiesArray = $firebaseArray(ref);
        var myData = {
            recipe: listItem
        };
        
        recipiesArray.$add(myData);
        
    };
    
}]);