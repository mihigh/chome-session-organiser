var workspaceApp = angular.module('workspaceApp', []);

function workspaceAppController($q, $scope, $http) {

    $scope.automaticallyUpdate = true;

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

        $scope.closeAllWindows();
        chrome.windows.create()

    }

    // Save new workspace from the current windows
    $scope.saveWorkspace = function (name) {
        var deferred = $q.defer();
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

            $scope.workspacesMetadata.workspaces[name] = newWorkspace;
            $scope.workspacesMetadata.currentWorkspaceName = name;

            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.switchWorkspace = function (name) {
        var promises = [];
        if ($scope.automaticallyUpdate == true) {
            promises.push($scope.saveWorkspace($scope.workspacesMetadata.currentWorkspaceName));
        }

        $q.all(promises).then(function () {
            $scope.closeAllWindows()

            newWorkspace = $scope.workspacesMetadata.workspaces[name];
            $scope.workspacesMetadata.currentWorkspaceName = name;

            newWorkspace.windows.forEach(function (tabs) {
                chrome.windows.create({
                                          'url': tabs
                                      })
            })
        })
    }

    $scope.closeAllWindows = function () {
        var deferred = $q.defer();

        chrome.windows.getAll({"populate": true}, function (windows) {
            windows.forEach(function (window) {
                chrome.windows.remove(window.id);
            })

            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.delete = function (name) {
        delete $scope.workspacesMetadata.workspaces[name];
    }

    $scope.editName = function (newName) {
        var oldName = $scope.workspacesMetadata.currentWorkspaceName;
        $scope.workspacesMetadata.workspaces[newName] = $scope.workspacesMetadata.workspaces[oldName];
        $scope.workspacesMetadata.currentWorkspaceName = newName;
        delete $scope.workspacesMetadata.workspaces[oldName];

    }

    /* workspacesMetadata */
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
    });

    /* automaticallyUpdate */
    //automatically save workspacesMetadata
    $scope.$watch('automaticallyUpdate', function (newCol, oldCol, scope) {
        chrome.storage.sync.set({'automaticallyUpdate': newCol}, function () {
        });
    }, true);

    //automatically load automaticallyUpdate
    chrome.storage.sync.get('automaticallyUpdate', function (result) {
        $scope.automaticallyUpdate = result.automaticallyUpdate;
        $scope.$apply();
    })
}

workspaceAppController.$inject = ['$q', '$scope', '$http'];

