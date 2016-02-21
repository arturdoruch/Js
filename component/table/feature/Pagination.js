/**
 * Created by Artur on 2014-11-15.
 */

define(['../../eventManager'], function(em) {

    /**
     * @param {string} containerSelector Pagination container element css selector.
     * @constructor
     */
    return function(containerSelector) {
        if (typeof containerSelector === 'undefined') {
            throw new Error('Missing "containerSelector" argument.');
        }

        var _containerSelector = containerSelector,
            _callback,
            _callbackArgs;

        /**
         * @param {function} callback
         * @param {[]} [callbackArgs]
         */
        this.init = function (callback, callbackArgs) {
            _callback = callback;
            _callbackArgs = callbackArgs || [];

            setEvents();
        };

        var setEvents = function () {
            em.on('click', getPagerAnchors(), paginate);
        };

        var paginate = function (event) {
            var url = event.target.getAttribute('href');

            _callbackArgs.unshift(url);
            _callback.apply(null, _callbackArgs);
        };

        var getPagerAnchors = function () {
            var container = document.querySelector(_containerSelector);

            return container ? container.getElementsByTagName('a') : null;
        }
    };
});