var workspaceApp = angular.module('workspaceApp', []);

function workspaceAppController($scope, $http) {

    $scope.automaticallyUpdate = true;
    $scope.newWorkspaceName = "";

    //
    $scope.workspacesMetadata = {
        'currentWorkspaceName': "",
        'workspaces': {
        }
    };

    $scope.getAllWorkspace = function () {
        return $scope.workspacesMetadata;
    };

    // Check the number of saved workspaces
    $scope.hasWorkspaces = function () {
        return Object.keys($scope.workspacesMetadata.workspaces).length != 0;
    };

    // Create new workspace ==> create a new empty window
    $scope.createNewWorkspace = function (name) {
        $scope.workspacesMetadata.currentWorkspaceName = name;
        var newWorkspace = {
            "windows": []
        };
        $scope.workspacesMetadata.workspaces[name] = newWorkspace;

        chrome.windows.getAll({"populate": true}, function (windows) {
            windows.forEach(function (window) {
                chrome.windows.remove(window.id);
            });
            chrome.windows.create()
        });
    }

    // Save new workspace from the current windows
    $scope.saveWorkspace = function (name) {
        var newWorkspace = {
            'windows': []
        };

        chrome.windows.getAll({'populate': true}, function (windows) {
            windows.forEach(function (window) {
                var windowTabs = [];
                window.tabs.forEach(function (tab) {
                    windowTabs.push(tab.url);
                });
                newWorkspace.windows.push(windowTabs)
            })
        });

        $scope.workspacesMetadata.workspaces[name] = newWorkspace;
        $scope.workspacesMetadata.currentWorkspaceName = name;
    }

    $scope.switchWorkspace = function (name) {
        newWorkspace = $scope.workspacesMetadata.workspaces[name];
        $scope.workspacesMetadata.currentWorkspaceName = name;

        newWorkspace.windows.forEach(function (tabs) {
            chrome.windows.create({
                                      'url': tabs
                                  })
        })
    }

    $scope.delete = function (name) {
        delete $scope.workspacesMetadata.workspaces[name];
    }

    //automatically save workspacesMetadata
    $scope.$watch('workspacesMetadata', function (newCol, oldCol, scope) {
        chrome.storage.sync.set({'workspacesMetadata': newCol}, function () {
        });
    }, true);

    //automatically load workspacesMetadata
    chrome.storage.sync.get('workspacesMetadata', function (workspacesMetadata) {
        if (angular.equals(workspacesMetadata, {})) {
            return;
        }
        $scope.workspacesMetadata = workspacesMetadata.workspacesMetadata;
        $scope.$apply();
    })
}

workspaceAppController.$inject = ['$scope', '$http'];

