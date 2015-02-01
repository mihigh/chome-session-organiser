var workspaceApp = angular.module('workspaceApp', []);

function workspaceAppController($scope, $http) {

    $scope.automaticallyUpdate = true;

    $scope.getAllworkspace = function () {
        return [
            {"name": "1"},
            {"name": "2"}
        ];
    };

    $scope.docs = $scope.getAllworkspace();

    // Check the number of saved workspaces
    $scope.hasworkspaces = function () {
        var allworkspace = $scope.getAllworkspace();
        return angular.isDefined(allworkspace ) && allworkspace.length != 0;
    };

}

workspaceAppController.$inject = ['$scope', '$http'];

