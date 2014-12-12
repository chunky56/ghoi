describe('Controller: ownersController', function () {

  // First, we load the app's module
  beforeEach(module('GitHubOwnerImageApp'));

  // Then we create some variables we're going to use
  var ownersController, scope;

  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    // Here, we create a mock scope variable, to replace the actual $scope variable
    // the controller would take as parameter
    scope = $rootScope.$new();

    // Then we create an $httpBackend instance. I'll talk about it below.
    httpMock = $httpBackend;

    // Here, we set the httpBackend standard reponse to the URL the controller is
    // supposed to retrieve from the API
    httpMock.expectGET(
      'https://api.github.com/repositories?since=1000').respond(
      [
        { 
          "owner": {
            "login": "andykent",
            "avatar_url": "https://avatars.githubusercontent.com/u/614?v=3",
            "followers_url": "https://api.github.com/users/andykent/followers"
          }
        },
        {
          "owner": {
            "login": "piclez",
            "avatar_url": "https://avatars.githubusercontent.com/u/781?v=3",
            "followers_url": "https://api.github.com/users/piclez/followers"
          }
        },
        {
          "owner": {
            "login": "AndrewO",
            "avatar_url": "https://avatars.githubusercontent.com/u/550?v=3",
            "followers_url": "https://api.github.com/users/AndrewO/followers"
          }
        },
        {
          "owner": {
            "login": "alexeysudachen",
            "avatar_url": "https://avatars.githubusercontent.com/u/1428?v=3",
            "followers_url": "https://api.github.com/users/alexeysudachen/followers"
          }
        }
      ]
    );

    httpMock.expectGET(
      'https://api.github.com/users/andykent/followers').respond(
      [{"login": "sr"},{"login": "matthewford"}]
    );

    httpMock.expectGET(
      'https://api.github.com/users/piclez/followers').respond(
      [{"login": "myabc"},{"login": "avh4"}]
    );

    httpMock.expectGET(
      'https://api.github.com/users/AndrewO/followers').respond(
      [{"login": "mtodd"},{"login": "pius"}]
    );

    httpMock.expectGET(
      'https://api.github.com/users/alexeysudachen/followers').respond(
      []
    );

    // Here, we actually initialize our controller, passing our new mock scope as parameter
    ownersController = $controller('ownersController', {
      $scope: scope
    });

    // Then we flush the httpBackend to resolve the fake http call
    httpMock.flush();

  }));


  // Now, for the actual test, let's check if the ownersList is actually retrieving
  //  the mock driver array
  it('should return a list with four owners', function () {
    expect(scope.ownersList.length).toBe(4);
  });

  // Let's also make a second test checking if the drivers attributes match against
  // the expected values
  it('should retrieve the names of the owners', function () {
    expect(scope.ownersList[0].login).toBe("andykent");
    expect(scope.ownersList[1].login).toBe("piclez");
    expect(scope.ownersList[2].login).toBe("AndrewO");
    expect(scope.ownersList[3].login).toBe("alexeysudachen");
  });

});