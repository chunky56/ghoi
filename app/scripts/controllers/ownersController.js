(function () {

    'use strict';

    var OwnersControllerClass = function ($scope, GithubService) {

        $scope.ownersList = [];
        $scope.loading = true;
        $scope.errorObj = {error: false, errorMessage: ''};
        
        var ownersPromise = GithubService.populateOwners();
        ownersPromise.then(function (ownersList) {
            $scope.ownersList = ownersList;
            $scope.loading = false;
        }, function (reason) {
            console.log(reason);
            $scope.loading = false;
            $scope.errorObj.error = true;
            $scope.errorObj.errorMessage = reason;
        });

    };

    OwnersControllerClass.prototype.startsWithAIgnoreCase = function (owner) {
        return owner.toLowerCase().indexOf('a') === 0;
    };

    OwnersControllerClass.prototype.hasFollowers = function (owner) {
        return (owner.followers.length ? owner.followers.join(', ') : 'N/A');
    };

    angular.module('GitHubOwnerImageApp.controllers', []).
        controller('ownersController', OwnersControllerClass);

})();
