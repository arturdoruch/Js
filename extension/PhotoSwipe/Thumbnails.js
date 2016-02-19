/*! Thumbnails extension for PhotoSwipe - v4.1 - 2016-02-07
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
        root.ArdoExtensions.PhotoSwipeThumbnails = factory();
    }
})(this, function () {

    var elementsClass = {
            container: '.pswp__thumbs-container',
            wrapper: '.pswp__thumbs-wrapper',
            list: '.pswp__thumbs-list',
            navigation: '.pswp__thumbs-list-nav',
            thumbsButton: '.pswp__button--thumbs'
        };

    /**
     * @param {[]} items
     */
    function prepareItems(items) {
        return items.map(function (item, index) {
            item.index = index;
            return item;
        });
    }

    /**
     * Gets screen viewport width
     * @returns {Number}
     */
    function getViewportWidth() {
        return window.innerWidth != null ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;
    }

    /**
     * Sets gallery thumbnails navigation.
     *
     * @param {PhotoSwipe} photoSwipe
     * @param {{}}   [options]
     * @param {bool} [options.showButton = true]
     * @param {bool} [options.showOnStart = false]
     */
    return function (photoSwipe, options) {

        var pswp = photoSwipe,
            _options = {
                showButton: true,
                showOnStart: false
            },
            items = prepareItems(pswp.items),
            totalPages,
            totalItems,
            _prevPage = 0,
            _page,     // Current page
            perPage,   // Number of thumbs per page
            pageWidth,
            thumbWidth;

        function init() {
            setThumbPanelVisibility(pswp);

            setProperties(pswp);

            thumbs.init();
            thumbs.setActive(pswp.getCurrentIndex());

            navigation.init();
            navigation.setActiveButton();

            setListeners();
        }

        function setListeners() {
            pswp.listen('beforeChange', function () {
                setPage(null, pswp.getCurrentIndex());
                thumbs.setActive(pswp.getCurrentIndex());
            });

            pswp.listen('destroy', function () {
                setPage(1);
                thumbs.removeEvents();
            });
        }

        /**
         *
         * @type {{$wrapper: null, $lists: null, $thumbs: null, init: Function, _setThumbs: Function,
         * getWidth: Function, addThumbs: Function, addThumb: Function, setListPosition: Function,
         * setActive: Function, removeEvents: Function}}
         */
        var thumbs = {
            $wrapper: null,
            $lists: null,
            $thumbs: null,

            init: function () {
                // Set thumbs list container width
                $(elementsClass.container).css('width', pageWidth);

                this.$wrapper = $(pswp.template).find(elementsClass.wrapper)
                    .css({
                        width: (pageWidth * 2) + (pageWidth * totalPages),
                        left: pageWidth * -1
                    });

                this.$lists = $(elementsClass.list).empty();

                $(this.$lists[0]).css('width', pageWidth);
                $(this.$lists[1]).css('width', pageWidth * totalPages);
                $(this.$lists[2]).css('width', pageWidth);

                this._setThumbs();
            },

            _setThumbs: function () {
                this.addThumbs(this.$lists[1], items);

                if (totalPages > 1) {
                    this.addThumbs(this.$lists[0], items.slice((totalPages - 1) * perPage));
                    this.addThumbs(this.$lists[2], items.slice(0, perPage));
                }

                this.$thumbs = this.$lists.find('li');
            },

            /**
             * @return {int}
             */
            getWidth: function () {
                var $list = $(elementsClass.list).first();

                this.addThumb($list, items[0]);

                var width = $list.find('li').first().outerWidth(true);
                $list.find('li').off('click');
                $list.empty();

                return width;
            },

            /**
             * Adds thumb (li element) to given list (ul element).
             * @param $list ul element
             * @param {{}}  items Image items
             */
            addThumbs: function ($list, items) {
                $list = $($list);

                for (var i in items) {
                    this.addThumb($list, items[i]);
                }
            },

            addThumb: function ($list, item) {
                $list.append(
                    $('<li>')
                        .attr('data-thumb-index', item.index)
                        .on('click', function () {
                            pswp.goTo(parseInt(this.dataset.thumbIndex));
                        })
                        .append(
                        $('<img>').attr({"src": item.src})
                    )
                );
            },

            /**
             * @param {int} [imageIndex]
             */
            setListPosition: function (imageIndex) {
                var left = _page * pageWidth * -1,
                    $wrapper = this.$wrapper;

                $wrapper.stop();
                if ((imageIndex === 0 || imageIndex === totalItems - 1) || totalPages > 2) {
                    if (_prevPage === totalPages && _page === 1) {
                        $wrapper.animate({'left': (totalPages + 1) * pageWidth * -1}, 500, function () {
                            $wrapper.css('left', left);
                        });
                        return;
                    } else if (_prevPage === 1 && _page === totalPages) {
                        $wrapper.animate({'left': 0}, 500, function () {
                            $wrapper.css('left', totalPages * pageWidth * -1);
                        });
                        return;
                    }
                }

                $wrapper.animate({'left': left}, 500);
            },

            setActive: function (imageIndex) {
                if (this.$thumbs) {
                    this.$thumbs.removeClass('active');
                    this.$lists.find('li[data-thumb-index="' + imageIndex + '"]').addClass('active');
                }
            },

            removeEvents: function () {
                this.$thumbs.off('click');
            }
        };

        /**
         * Thumbnails navigation (pagination).
         * @type {{$navButtons: null, init: Function, setActiveButton: Function}}
         */
        var navigation = {
            $navButtons: null,

            init: function () {
                var $navigation = $(elementsClass.navigation);
                $navigation.find('li').off('click');
                $navigation.empty();

                if (totalPages > 1) {
                    for (var page = 1; page <= totalPages; page++) {
                        $navigation.append(
                            $('<li>').attr('data-page', page).on('click', function () {
                                setPage(parseInt(this.dataset.page));
                            })
                        );
                    }
                }

                this.$navButtons = $navigation.find('li');
            },

            setActiveButton: function () {
                if (this.$navButtons) {
                    this.$navButtons.removeClass('active');
                    this.$navButtons.eq(_page - 1).addClass('active');
                }
            }
        };

        /**
         * Toggle thumbnails visibility.
         */
        function setThumbPanelVisibility() {
            var $template = $(pswp.template),
                button = $(elementsClass.thumbsButton);

            $template.toggleClass('pswp--thumbs', _options.showOnStart);
            pswp.updateSize();

            if (_options.showButton === false) {
                button.addClass('pswp__element--disabled');
            } else {
                button.off('click');
                button.on('click', function () {
                    $template.toggleClass('pswp--thumbs');
                    pswp.updateSize();
                });
            }
        }

        function setProperties() {
            thumbWidth = thumbs.getWidth();
            perPage = Math.floor(getViewportWidth() / thumbWidth);
            totalItems = items.length;
            totalPages = Math.ceil(totalItems / perPage);
            pageWidth = perPage * thumbWidth;

            setPage(null, pswp.getCurrentIndex());
        }

        /**
         * @param {int|null} page
         * @param {int}      [imageIndex]
         */
        function setPage(page, imageIndex) {
            if (imageIndex % 1 === 0) {
                page = Math.ceil((imageIndex + 1) / perPage);
            } else {
                if (page < 1) {
                    page = totalPages
                } else if (page > totalPages) {
                    page = 1;
                }
            }

            _prevPage = _page;
            _page = page;

            if (_prevPage && _prevPage !== _page) {
                navigation.setActiveButton();
                thumbs.setListPosition(imageIndex);
            }
        }

        pswp.framework.extend(_options, options);
        init();
    };

});