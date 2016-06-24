
define(function() {

    var _baseUrl = (location.protocol + '//' + location.host).replace(/\/$/, ''),
        _pathPrefix = '',
        isInitialized = false;
    //pathRegexp = new RegExp('^(' + baseUrl + ')?(.*)$', 'i');

    return {
        /**
         * @param {string} baseUrl
         * @param {string} [pathPrefix]
         */
        init: function (baseUrl, pathPrefix) {
            if (isInitialized === false) {
                if (baseUrl) {
                    _baseUrl = /^https?:\/\//.test(baseUrl) ? baseUrl : location.protocol + '//' + baseUrl;
                }
                _pathPrefix = pathPrefix || '';
            }

            isInitialized = true;
        },

        /**
         * @returns {string}
         */
        getPathPrefix: function () {
            return _pathPrefix;
        },

        /**
         * @returns {string} The application base url
         */
        getBaseUrl: function () {
            return _baseUrl;
        },

        /**
         * @returns {string}
         */
        getCurrentUrl: function() {
            return _baseUrl + this.getCurrentPath();
        },

        /**
         * @returns {string}
         */
        getCurrentPath: function() {
            return this.getPath(location.href);
        },

        /**
         * Checks if given path is equal to current url path
         * @param {string} path
         * @returns {boolean}
         */
        isCurrentPath: function (path) {
            return this.getCurrentPath() === this.getPath(path);
        },

        /**
         * Gets path for given url.
         * @param {string} url
         * @returns {string}
         */
        getPath: function(url) {
            var path = url;

            if (path.indexOf(_baseUrl) === 0) {
                path = path.substr(_baseUrl.length);
            } else if (path.indexOf(_pathPrefix) !== 0) {
                path = _pathPrefix + path;
            }

            return path === '' ? '/' : path;
        },

        /**
         * Builds the proper url with given path.
         *
         * @param {string} path
         * @returns {string}
         */
        buildUrl: function(path) {
            return _baseUrl + this.getPath(path);
        }
    };
});