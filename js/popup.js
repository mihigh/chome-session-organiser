var workspaceApp = angular.module('workspaceApp', []);

function workspaceAppController($scope, $http) {

    $scope.automaticallyUpdate = true;
    $scope.newWorkspaceName = "";

    //
    $scope.workspaces = [];
    $scope.currentWorkspacesIndex = -1;

    $scope.getAllWorkspace = function () {
        return $scope.workspaces;
    };

    $scope.docs = $scope.getAllWorkspace();

    // Check the number of saved workspaces
    $scope.hasWorkspaces = function () {
        var allWorkspace = $scope.getAllWorkspace();
        return angular.isDefined(allWorkspace) && allWorkspace.length != 0;
    };

    // Create new workspace ==> create a new empty window
    $scope.createNewWorkspace = function (name) {
        $scope.workspaces.push({"name": name});
    }

    // Save new workspace from the current windows
    $scope.saveWorkspace = function (name) {
        var newWorkspace = {
            "name": name,
            "windows": []
        };

        chrome.windows.getAll({"populate": true}, function (windows) {
            windows.forEach(function (window) {
                var windowTabs = [];
                window.tabs.forEach(function (tab) {
                    windowTabs.push(tab.url);
                });
                newWorkspace.windows.push(windowTabs)
            })
        });

        $scope.workspaces.push(newWorkspace);
        $scope.currentWorkspacesIndex = 0;
    }

}

workspaceAppController.$inject = ['$scope', '$http'];

