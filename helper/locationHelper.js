/**
 * Created by Artur on 2016-02-15.
 */
define(function() {

    var _baseUrl = (location.protocol + '//' + location.hostname).replace(/\/$/, ''),
        isInitialized = false;
        //pathRegexp = new RegExp('^(' + baseUrl + ')?(.*)$', 'i');

    return {
        /**
         * @param baseUrl
         */
        init: function (baseUrl) {
            if (isInitialized === false && baseUrl) {
                _baseUrl += baseUrl.replace(_baseUrl, '');
            }

            isInitialized = true;
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
         * Gets path for given url.
         * @param {string} url
         * @returns {string}
         */
        getPath: function(url) {
            var path = url;

            if (path.indexOf(_baseUrl) === 0) {
                path = path.substr(_baseUrl.length);
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