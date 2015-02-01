function moveTabs(windows) {
    var numWindows = windows.length;
    alert(numWindows);
}

chrome.windows.getAll({"populate": true}, moveTabs);
