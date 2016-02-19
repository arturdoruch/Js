/*! AutoPlay extension for PhotoSwipe - v4.1 - 2016-02-07
 * Copyright (c) 2016 Artur Doruch
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        if (!root.ArdoExtensions) {
            root.ArdoExtensions = {};
        }
        root.ArdoExtensions.PhotoSwipeAutoPlay = factory();
    }
})(this, function () {
    'use strict';

    /**
     * @param {PhotoSwipe} photoSwipe
     * @param {{}}         [options]
     * @param {int}        [options.delay = 5000]
     * @constructor
     */
    return function (photoSwipe, options) {

        var pswp = photoSwipe,
            template = pswp.template,
            framework = pswp.framework,
            intervalId,
            elementsClass = {
                template: 'pswp--auto-played',
                button: 'pswp__button--auto-play'
            },
            _options = {
                delay: 6000
            },

            setListeners = function () {
                var button = template.getElementsByClassName('pswp__button ' + elementsClass.button)[0],
                    listener = function () {
                        if (!isPlayed()) {
                            publicMethods.play();
                        } else {
                            publicMethods.stop();
                        }
                    };

                framework.removeClass(button, 'pswp__element--disabled');
                framework.bind(button, 'click touch', listener);

                pswp.listen('destroy', function() {
                    framework.unbind(button, 'click touch', listener);
                    publicMethods.stop();
                });
            },

            isPlayed = function () {
                return framework.hasClass(template, elementsClass.template);
            };

        var publicMethods = {
            play: function () {
                this.stop();

                intervalId = setInterval(function () {
                    pswp.next();
                }, _options.delay);

                framework.addClass(template, elementsClass.template);
            },

            stop: function () {
                clearInterval(intervalId);
                framework.removeClass(template, elementsClass.template);
            }
        };

        framework.extend(_options, options);
        framework.extend(this, publicMethods);
        setListeners();
    };

});
