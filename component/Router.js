
define([
    '../helper/locationHelper',
    '../util/objectUtils'
], function(locationHelper, objectUtils) {

    var
        /**
         * @type {Route[]}
         */
        routes = [],
        Route = function (pathRegexp, initHandler, changeHandler) {
            this.pathRegexp = pathRegexp;
            this.initHandler = initHandler || function () {};
            this.changeHandler = changeHandler || function () {};

            if (!objectUtils.is('Function', this.initHandler)) {
                throw new Error('The "initHandler" must be function, ' + initHandler + ' given.');
            }

            if (!objectUtils.is('Function', this.changeHandler)) {
                throw new Error('The "changeHandler" must be function, ' + changeHandler + ' given.');
            }
        };

    var router = {
        /**
         * Sets application base URL. Calls init handler for current route (path).
         *
         * @param {string} [basePath] The root URL path of the application. The protocol
         * and host name parts are not necessary. For example if the base url is
         * "http://domain.com/project/name" then basePath will be "/project/name".
         */
        init: function (basePath) {
            locationHelper.init(basePath);

            var path = locationHelper.getCurrentPath(),
                route = findRoute(path);

            if (route) {
                route.initHandler(path);
            }
        },

        /**
         * Adds route handlers
         *
         * @param {string}   pathRegexp
         * @param {function} [initHandler]   The handler called only once, when router.init() method is called.
         * @param {function} [changeHandler] The handler called every time, when:
         *                                   user click on browser "prev", "next" buttons or one of methods:
         *                                   history.back, history.forward or history.go was called.
         */
        addRoute: function (pathRegexp, initHandler, changeHandler) {
            routes.push(new Route(pathRegexp, initHandler, changeHandler));

            return this;
        },

        /**
         * Sets history state.
         *
         * @param {string} path The path or full url.
         * @param {*}      [data]
         */
        setLocation: function (path, data) {
            history.pushState(removeWhitespace(data), '', locationHelper.buildUrl(path));
        },

        /**
         * Set app location to given path. Calls changeHandler function if exist.
         *
         * @param {string}  path   The url path
         * @param {*}       [data]
         * @param {boolean} [setLocation = true] Adds history state
         */
        changeLocation: function (path, data, setLocation) {
            path = locationHelper.getPath(path);

            var route = findRoute(path);
            if (route) {
                route.changeHandler(path, data);
            }

            if (setLocation !== false) {
                this.setLocation(path, data);
            }
        }
    };

    /**
     * @param {string} path
     * @returns {null|Route}
     */
    function findRoute(path) {
        for (var i in routes) {
            if (new RegExp('^' + routes[i].pathRegexp + '$', 'i').test(path)) {
                return routes[i];
            }
        }

        return null;
    }


    function removeWhitespace(data) {
        if (typeof data == 'string') {
            data = data.replace(/(\r\n)/g, '').replace(/\s{2,}/g, ' ');
        }
        return data;
    }

    // The "onpopstate" event is called when user click on browser "prev", "next" buttons
    // or one of methods: history.back, history.forward or history.go was called.
    window.onpopstate = function(e) {
        router.changeLocation(window.location.href, e.state, false);
    };

    return router;

});