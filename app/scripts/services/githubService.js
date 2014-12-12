(function () {

    'use strict';

    var GithubServiceFactory = function ($http, $q) {

        var GithubService = {};

        GithubService.getRepos = function () {
            return $http.get('https://api.github.com/repositories?since=1000');
//            return $http.get('https://api.github.com/repositories?since=1000&access_token=1e6562603e601dff9f861e424acefb9b16abed90');
        };

        GithubService.getFollowers = function (owner) {
            return $http.get('https://api.github.com/users/' + owner + '/followers');
//            return $http.get('https://api.github.com/users/' + owner + '/followers?access_token=1e6562603e601dff9f861e424acefb9b16abed90');
        };

        GithubService.populateOwners = function () {
            var deferred = $q.defer();

            GithubService.getRepos().success(function (data) {
                var ownersList = [];

                deferred.resolve(ownersList);

                angular.forEach(data, function (repo) {
                    var isInList = false,
                        i,
                        owner;

                    // Check if the current owner is already in the owners list
                    for (i = 0; i < ownersList.length; i++) {
                        if (repo.owner.login === ownersList[i].login) {
                            isInList = true;
                            break;
                        }
                    }

                    // If the owner is not in the list, add owner, after getting followers
                    if (!isInList) {
                        owner = {
                            login: repo.owner.login,
                            avatarUrl: repo.owner.avatar_url,
                            followers: []
                        };
                        ownersList.push(owner);

                        // Get the followers, then loop through ownersList to find owner
                        // Once owner is found, assign followersList to its followers
                        GithubService.getFollowers(repo.owner.login).success(function (data) {
                            var followersList = [];
                            angular.forEach(data, function (follower) {
                                followersList.push(follower.login);
                            });
                            for (i = 0; i < ownersList.length; i++) {
                                if (repo.owner.login === ownersList[i].login) {
                                    ownersList[i].followers = followersList;
                                    break;
                                }
                            }
                        }).error(function (data, status) {
                            console.log('Could not get followers from github, status code = ' + status);
                        });
                    }
                });
            }).error(function (data, status) {
                deferred.reject('Could not get repos from github, status code = ' + status);
            });

            return deferred.promise;
        };

        return GithubService;
    };

    angular.module('GitHubOwnerImageApp.services', []).
        factory('GithubService', GithubServiceFactory);

})();
