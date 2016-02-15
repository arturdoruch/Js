
define(['./helper', '../../helper/history', './config'], function(RouterHelper, HistoryManager, config) {

    var onLoad = true,
        _routing;

    function init(routing) {
        _routing = routing;

        window.historyManager = HistoryManager;
        // Popstate is called when user click on browser prev, next buttons
        // or if call history.back, history.forward or history.go methods.
        window.onpopstate = function(e) {
            handleRoute(window.location.href, e.state, false);
        };

        //handleRoute(location.href);
        onLoad = false;
    }

    function handleRoute(requestUrl, data, pushState) {
        var requestRoute = RouterHelper.cleanRoute(requestUrl),
            routeObj = getRouteObject(requestRoute),
            url = config.BASE_URL + requestRoute;

        if (routeObj !== false) {
            if (pushState) {
                HistoryManager.pushState(data, url);
            }
            routeObj(url, data);
        }
    }

    function getRouteObject(requestRoute) {
        if (requestRoute === '') {
            requestRoute = '/';
        }

        for (var route in _routing) {
            if ( new RegExp('^'+ route +'$', 'i').test( requestRoute ) ) {
                return _routing[route];
            }
        }

        throw new Error('Route "' + requestRoute + '" was not found.');
    }

    return {
        init: init,
        handleRoute: handleRoute
    }
});