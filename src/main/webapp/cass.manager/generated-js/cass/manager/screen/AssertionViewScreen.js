var AssertionViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
AssertionViewScreen = stjs.extend(AssertionViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "assertionView";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return AssertionViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/assertionView.html";
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionViewScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcAssertion.get(id, function(data) {
                            ScreenManager.replaceScreen(new AssertionViewScreen(data), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        }, function(p1) {
                            ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new AssertionSearchScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
