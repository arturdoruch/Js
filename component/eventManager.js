
(function(window, $, undefined) {
    'use strict';

    var _events = {},
        jQueryObject = $({}),
        getEvent = function (id) {
            return _events[id] ? _events[id] : null;
        };

    /**
     * @param {string}   name The event name
     * @param {jQuery|HTMLElement} element
     * @param {function} listener
     * @param {[]}       [listenerArgs]
     * @param {object}   [listenerContext]
     * @constructor
     */
    function _Event(name, element, listener, listenerArgs, listenerContext) {
        this.name = name;
        this.element = !(element instanceof jQuery) ? $(element) : element;
        this.listener = listener;
        this.listenerArgs = listenerArgs || [];
        this.args = null;
        this.listenerContext = listenerContext || window;
    }

    var eventManager = {
        /**
         * Adds event listener.
         *
         * @param {string} eventName
         * @param {function} listener
         */
        addListener: function (eventName, listener) {
            jQueryObject.on(eventName, listener);
        },

        /**
         * Removes listener or listeners for given event.
         *
         * @param {string} eventName
         * @param {function} [listener] Removes given listener (if exist) or all listener if not given.
         */
        removeListener: function (eventName, listener) {
            jQueryObject.off(eventName, listener);
        },

        /**
         * Dispatches event to registered listeners.
         *
         * @param {string} eventName
         * @param {[]}     args
         */
        dispatch: function (eventName, args) {
            jQueryObject.trigger(eventName, args);
        },

        /**
         * Adds event listener to HTML element.
         *
         * @param {string}   events The event or events name separated by coma.
         * @param {jQuery|HTMLElement} element
         * @param {function} listener The event handler
         * @param {[]}       [listenerArgs = []]
         * @param {object}   [listenerContext = window]
         * @param {bool}     [preventDefault = true]
         *
         * @return {string} The event Id
         */
        on: function (events, element, listener, listenerArgs, listenerContext, preventDefault) {
            if (typeof listener !== 'function') {
                throw 'The event listener must be a function.';
            }

            var event = new _Event(events, element, listener, listenerArgs, listenerContext),
                id = '#' + Object.keys(_events).length,
                _listener = function (e) {
                    if (event.args === null) {
                        event.args = event.listenerArgs;
                        event.args.unshift(this);
                        event.args.push(e);
                    } else {
                        event.args[event.args.length - 1] = e;
                    }

                    if (preventDefault !== false) {
                        e.preventDefault();
                    }

                    listener.apply(event.listenerContext, event.args);
                };

            if (event.element.length === 0) {
                return;
            }

            event.element.off(event.name, _listener);
            event.element.on(event.name, _listener);
            // Set real event listener.
            event.listener = _listener;

            _events[id] = event;

            return id;
        },

        /**
         * Removes event listener by event id.
         *
         * @param {string} eventId The event id
         */
        off: function (eventId) {
            var event = getEvent(eventId);

            if (event) {
                delete _events[eventId];
                event.element.off(event.name, event.listener);
            }
        },

        /**
         * @param {string} eventId The event id
         */
        trigger: function (eventId) {
            var event = getEvent(eventId);
            if (event) {
                event.element.trigger(event.name);
            }
        },

        /**
         * @returns {{}}
         */
        getEvents: function () {
            return _events;
        }
    };

    if (typeof define === 'function' && define.amd) {
        define(function() {
            return eventManager;
        });
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = eventManager;
    }

    if (!window.ArturDoruchComponent) {
        window.ArturDoruchComponent = {};
    }
    window.ArturDoruchComponent.eventManager = eventManager;

})(window, $);