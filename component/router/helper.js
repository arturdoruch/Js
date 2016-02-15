/**
 * Created by Artur on 2014-11-17.
 */

define(['./config'], function(config) {

    var clearRouteRegexp,
        host = location.protocol + '//' + location.hostname;

    function getCurrentRoute(withoutPage) {
        var route = cleanRoute(location.href);

        if (withoutPage === true) {
            route = route.replace(/\/\d+$/, '');
        }

        return route;
    }

    function getCurrentUrl(withoutPage) {
        return config.BASE_URL + getCurrentRoute(withoutPage);
    }

    function cleanRoute(requestUrl) {
        return requestUrl.replace(clearRouteRegexp, '$2');
    }

    function setClearRouteRegexp() {
        clearRouteRegexp = new RegExp('^(' + host + config.BASE_URL + ')?(.*)$', 'i');
    }

    setClearRouteRegexp();

    return {
        getCurrentRoute: getCurrentRoute,
        getCurrentUrl: getCurrentUrl,
        cleanRoute: cleanRoute
    }

});