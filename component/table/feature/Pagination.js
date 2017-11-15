/**
 * Created by Artur on 2014-11-15.
 */

define(['../../eventManager'], function(em) {
    /**
     * @param {string} containerSelector Pagination container element or elements css selector.
     * @constructor
     */
    return function(containerSelector) {
        if (typeof containerSelector === 'undefined') {
            throw new Error('Missing "containerSelector" argument.');
        }

        var containerSelectors = containerSelector,
            _callback,
            _callbackArgs;

        /**
         * @param {function} callback
         * @param {[]} [callbackArgs]
         */
        this.init = function (callback, callbackArgs) {
            _callback = callback;
            _callbackArgs = callbackArgs || [];
            // Add pager events
            em.on('click', getPagerAnchors(), paginate);
        };

        function paginate(event) {
            var url = event.target.getAttribute('href');

            _callbackArgs.unshift(url);
            _callback.apply(null, _callbackArgs);
        }

        function getPagerAnchors() {
            return document.querySelectorAll(containerSelectors + ' a');
        }
    };
});