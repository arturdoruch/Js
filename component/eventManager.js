
(function(window, $, undefined) {
    'use strict';

    var _events = {},
        jQueryObject = $({});

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
         * @param {function} [listener] Removes given listener (if exists) or all listener if not given.
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
         * Attach an event listener function for one or more events to the elements.
         *
         * @param {string}   events The event or events name separated by coma.
         * @param {jQuery|HTMLElement|string} element
         * @param {function} listener The event handler
         * @param {[]}       [listenerArgs = []]
         * @param {object}   [listenerContext = window]
         * @param {bool}     [preventDefault = true]
         *
         * @return {string|null} The event Id
         */
        on: function (events, element, listener, listenerArgs, listenerContext, preventDefault) {
            var event = prepareEvent(events, element, listener, listenerArgs, listenerContext, preventDefault);

            if (!event) {
                return null;
            }

            event.$element.on(event.name, event.listener);

            var id = '#' + Object.keys(_events).length;
            _events[id] = event;

            return id;
        },

        /**
         * Attach a listener to an event for the elements. The listener is executed at most once per element per event type.
         *
         * @param {string}   events The event or events name separated by coma.
         * @param {jQuery|HTMLElement|string} element
         * @param {function} listener The event handler
         * @param {[]}       [listenerArgs = []]
         * @param {object}   [listenerContext = window]
         * @param {bool}     [preventDefault = true]
         */
        one: function (events, element, listener, listenerArgs, listenerContext, preventDefault) {
            var event = prepareEvent(events, element, listener, listenerArgs, listenerContext, preventDefault);

            if (!event) {
                return;
            }

            event.$element.one(event.name, event.listener);
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
                event.$element.off(event.name, event.listener);
            }
        },

        /**
         * @param {string} eventId The event id
         */
        trigger: function (eventId) {
            var event = getEvent(eventId);
            if (event) {
                event.$element.trigger(event.name);
            }
        },

        /**
         * @returns {{}}
         */
        getEvents: function () {
            return _events;
        }
    };

    /**
     * Prepares event object.
     *
     * @param {string}   events The event or events name separated by coma.
     * @param {jQuery|HTMLElement|string} element
     * @param {function} listener The event handler
     * @param {[]}       [listenerArgs = []]
     * @param {object}   [listenerContext = window]
     * @param {bool}     [preventDefault = true]
     *
     * @return {_Event|null}
     */
    function prepareEvent(events, element, listener, listenerArgs, listenerContext, preventDefault) {
        if (typeof listener !== 'function') {
            throw new Error('The event listener must be a function.');
        }

        var event = new _Event(events, element, listener, listenerArgs, listenerContext),
            id = '#' + Object.keys(_events).length,
            _listener = function (e) {
                if (preventDefault !== false) {
                    e.preventDefault();
                }

                listener.apply(event.listenerContext, [e].concat(event.listenerArgs));
            };

        if (event.$element.length === 0) {
            return null;
        }
        // Set real event listener.
        event.listener = _listener;
        event.$element.off(event.name, event.listener);

        return event;
    }

    function getEvent(id) {
        return _events[id] ? _events[id] : null;
    }

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
        this.$element = $(element);
        this.listener = listener;
        this.listenerArgs = listenerArgs || [];
        this.listenerContext = listenerContext || window;
    }


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