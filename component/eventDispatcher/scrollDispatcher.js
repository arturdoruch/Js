/*!
 * (c) 2016 Artur Doruch <arturdoruch@interia.pl>
 */

define([
    '../../util/screenUtils',
    '../../util/objectUtils'
], function(screenUtils, objectUtils) {

    var loaded = {},
        listeners = [],
        listenersLength = 0,
        screenHeight = 0,
        interval;

    /**
     * @param {HTMLElement|jQuery} element or elements
     * @param {function}     loadHandler
     * @param {function|int} unloadHandler
     * @param {int}          [loadPosition=12]
     * @param {int}          [unloadPosition=10]
     */
    var Listener = function (element, loadHandler, unloadHandler, loadPosition, unloadPosition) {
        this.element = $(element);
        this.loadHandler = loadHandler;
        this.unloadHandler = unloadHandler;

        if (objectUtils.is('Number', unloadHandler)) {
            this.unloadHandler = null;
            loadPosition = unloadHandler;
        }

        this.loadPosition = (100 - (loadPosition || 12)) / 100;
        this.unloadPosition = (100 - (unloadPosition || 10)) / 100;

        if (!objectUtils.is('Function', this.loadHandler)) {
            throw new Error('The "loadHandler" must be a function, ' + typeof this.loadHandler + ' given.');
        }

        if (this.unloadHandler && !objectUtils.is('Function', this.unloadHandler)) {
            throw new Error('The "unloadHandler" must be a function, ' + typeof this.unloadHandler + ' given.');
        }
    };

    /**
     * @param {HTMLElement|jQuery} element  Html element or elements.
     * @param {function}     loadHandler    The listener called when page is scrolled down and loadPosition
     *                                      point is succeeded.
     * @param {function|int} unloadHandler  The listener called when page is scrolled up and unloadPosition
     *                                      point is succeeded.
     *                                      If integer given, then will be considered as loadPosition.
     * @param {int} [loadPosition=12]       Percentage value between 0 - 100. Determines position on the screen,
     *                                      when loadHandler should be called, while page is scrolled down.
     * @param {int} [unloadPosition=10]     Percentage value between 0 - 100. Determines position on the screen,
     *                                      when unloadHandler should be called, while page is scrolled up.
     */
    function addListener(element, loadHandler, unloadHandler, loadPosition, unloadPosition) {
        listeners.push(new Listener(element, loadHandler, unloadHandler, loadPosition, unloadPosition));
        listenersLength = listeners.length;
    }

    /**
     * @param {HTMLElement|jQuery} element  Html element or elements.
     * @param {function} [loadHandler]      If set removes listener only for this handler, otherwise
     *                                      removes all listeners attached to this element.
     * @param {string} [elementState]       Sets element state: "load" or "unload".
     */
    function removeListener(element, loadHandler, elementState) {
        element = $(element);

        listeners = listeners.filter(function (listener) {
            if (listener.element[0] === element[0] && (!loadHandler || loadHandler === listener.loadHandler)) {
                if (listener[elementState + 'Handler']) {
                    listener[elementState + 'Handler'](element, elementState);
                }
                return false;
            }
            return true;
        });

        listenersLength = listeners.length;
    }

    function dispatchAll() {
        var i = 0;

        for (; i < listenersLength; i++) {
            dispatch(listeners[i], i);
        }
    }

    /**
     * @param {Listener} listener
     * @param {int}      listenerIndex
     */
    function dispatch(listener, listenerIndex) {
        var index,
            i = 0,
            elements = listener.element,
            element;

        for (; i < elements.length; i++) {
            index = i + listenerIndex.toString();
            element = elements[i];

            if (!loaded[index] || loaded[index] === false) {
                // Load content
                if (window.pageYOffset > $(element).offset().top - (screenHeight * listener.loadPosition)) {
                    //setTimeout( function() {
                    listener.loadHandler(element, 'load');
                    //}, 30);
                    loaded[index] = true;
                }
            } else if (listener.unloadHandler) {
                // Unload content
                if (window.pageYOffset < $(element).offset().top - (screenHeight * listener.unloadPosition)) {
                    //setTimeout( function() {
                    listener.unloadHandler(element, 'unload');
                    //}, 30);
                    loaded[index] = false;
                }
            }
        }
    }

    function setViewPortHeight() {
        screenHeight = screenUtils.getHeight()
    }

    setViewPortHeight();

    $(window).scroll(function() {
        clearTimeout(interval);
        interval = setTimeout(function() {
            dispatchAll();
        }, 20);
    });

    $(window).resize(function() {
        setViewPortHeight();
    });

    return {
        addListener: addListener,
        removeListener: removeListener
    };
});