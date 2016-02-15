/*! imagePreLoader - 1.0.0 - 2016-02-07
 * Copyright (c) 2016 Artur Doruch;
 * Available via the MIT license
 */
(function(window, $, undefined) {
    'use strict';

    var _options = {
        message: 'Loading images',
        hideOnLoaded: false
    };

    /**
     * Pre loads images
     *
     * @param {[]} images The collection of images urls or paths.
     * @param {{}}      [options]
     * @param {string}  [options.message = 'Loading images'] Pre loader message.
     * @param {boolean} [options.hideOnLoaded = false] Hide pre loader after images are loaded.
     *
     * @returns {{done: Function}}
     */
    function loadImages(images, options) {
        setOptions(options);
        template.init();

        var imagesLength = images.length,
            image,
            loadedImages = [],
            loaded = 0,
            done = function () {};

        function postLoaded() {
            loaded++;
            progressBar.update(loaded, imagesLength);

            if (loaded == imagesLength) {
                if (_options.hideOnLoaded === true) {
                    hidePreLoader();
                }
                done(loadedImages);
            }
        }

        for (var i in images) {
            image = new Image();
            image.src = images[i];
            loadedImages.push(image);

            image.onload = function() {
                postLoaded();
            };
            image.onerror = function(){
                postLoaded();
            };
        }

        return {
            /**
             * @param {function} callback
             */
            done: function (callback) {
                done = callback || done;
            }
        }
    }

    /**
     * Hides pre loader visibility.
     */
    function hidePreLoader() {
        template.setLoadedStatus(false);
        progressBar.reset();
    }

    /**
     * Removes pre loader from DOM document.
     */
    function removePreLoader() {
        template.remove();
    }

    /**
     * @param {{}}      options
     * @param {string}  [options.message = 'Loading images'] Pre loader message.
     * @param {boolean} [options.hideOnLoaded = false] Hide pre loader after images are loaded.
     */
    function setOptions(options) {
        $.extend(_options, options);
    }

    var template = {
        cssPrefix: 'ardo-image-preloader',
        $template: null,
        $overlay: null,
        $message: null,
        $progressBar: null,

        init: function () {
            if ($('#' + this.cssPrefix).length === 0) {
                this._set();
            }

            template.setLoadedStatus(true);
            progressBar.reset();

            this.$message.text(_options.message);
        },

        /**
         * Removes pre loader markup from DOM document.
         */
        remove: function () {
            if (this.$template) {
                this.$template.empty();
            }
        },

        setLoadedStatus: function (state) {
            if (this.$template) {
                this.$template.toggleClass('load', state);
            }
        },

        _set: function () {
            var $overlay = $('<div>').attr('class', this.cssPrefix + '__overlay');
            this.$message = $('<p>');
            this.$progressBar = $('<div>').attr({
                class: "progress-bar",
                role: "progressbar",
                "aria-valuenow": 0,
                "aria-valuemin": 0,
                "aria-valuemax": 100
            });

            this.$template = $('<div>').attr('id', this.cssPrefix)
                .append($overlay)
                .append($('<div>').attr('class', this.cssPrefix + '__container')
                    .append(this.$message)
                    .append($('<div>').attr('class', 'progress')
                        .append(this.$progressBar)
                )
            );

            $('body').append(this.$template);

            setTimeout(function () {
                $overlay.on('click', function () {
                    hidePreLoader();
                });
            }, 1000);
        }
    };

    var progressBar = {
        /**
         * @param {int} total
         * @param {int} loaded
         */
        update: function(loaded, total) {
            var percent = parseInt((loaded / total) * 100);
            template.$progressBar.html(percent + '%').attr('aria-valuenow', percent).css('width', percent + '%');
        },

        reset: function () {
            this.update(0, 1);
        }
    };

    var _public = {
        loadImages: loadImages,
        setOptions: setOptions,
        hide: hidePreLoader,
        remove: removePreLoader
    };

    if (typeof define === 'function' && define.amd) {
        define(function() {
            return _public;
        });
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = _public;
    } else {
        if (!window.ArturDoruchTools) {
            window.ArturDoruchTools = {};
        }
        window.ArturDoruchTools.imagePreLoader = _public;
    }

})(window, $);