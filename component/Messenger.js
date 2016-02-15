/**
 * Created by Artur on 2015-01-05.
 */

/**
 * @todo Slide box from outside viewPort
 */

define([
    './../util/objectUtils',
    './../util/screenUtils'
], function(ObjectUtils, ScreenUtils) {

    var getDefaultConfig = function () {
            return {
                removeAfter: 5,
                removeOnClick: true,
                containerClassName: null,
                updateContainerPos: true,
                screen: 'top-center',
                // Internal config
                positionVertical: 'top',
                positionHorizontal: 'center'
            };
        };

    function Message(type, message) {
        this.type = type;
        this.message = message;
    }

    /**
     * @param {object}      config
     * @param {Number|bool} [config.removeAfter] Time in seconds, after message container should be removed.
     *                                           If false container will not be removed until will be clicked.
     * @param {bool}        [config.removeOnClick = true] If false disables removing message item by click.
     * @param {string}      [config.position="top-center"] Position on the screen in format "vertical-horizontal",
     *                                           where message container should appear.
     * @param {string}      [config.containerClassName] Adds custom class name for message container element.
     */
    return function (config) {
        var messages = [],
            $container;

        config = prepareConfig(config);

        /**
         * Adds message.
         * @param {string} type Message type like: error, success, notice, whatever.
         * @param {string} message
         */
        this.add = function (type, message) {
            if (!$container) {
                setContainer();
            }

            if (ObjectUtils.is('String', type) && ObjectUtils.is('String', message)) {
                messages.push(new Message(type, message));
            }
        };

        /**
         * Displays added messages on the screen.
         *
         * @param {string} type        The message type.
         * @param {Number} removeAfter Time in seconds, after displayed message will be removed from DOM document.
         *                             Overrides config "removeAfter" property only for this messages set.
         */
        this.display = function (type, removeAfter) {
            if (messages.length === 0) {
                return;
            }

            appendMessageItems(type);
            setContainerPosition();

            $container.fadeIn(200, function() {
                addRemoveEvent(removeAfter);
            });
        };

        /**
         * Removes message item form container.
         * @param {jQuery} $item
         */
        function removeItem($item) {
            $item.fadeOut(200, function() {
                var itemsLength = $container[0].children.length;
                /*itemHeight = $item.outerHeight(true),
                top = parseInt( $container.css('top').replace('px', '') );*/

                $item.remove();

                if (itemsLength <= 1) {
                    $container.hide();
                } else if (config.updateContainerPos === true) {
                    //setContainerPosition();
                }
            });
        }

        function appendMessageItems(type) {
            var $item,
                message;

            for (var i in messages) {
                message = messages[i];

                if (!type || message.type === type) {
                    $item = $('<div>')
                        .addClass('message-item')
                        .addClass(message.type)
                        .html(message.message);

                    $container.append($item);

                    delete messages[i];
                }
            }
        }

        /**
         * @param {Number} removeAfter
         */
        function addRemoveEvent(removeAfter) {
            var intervals = [],
                $items = $container.find('div');

            removeAfter = (removeAfter !== undefined) ? removeAfter : config.removeAfter;

            $items.each(function (index) {
                var $item = $(this);

                if (config.removeOnClick === true) {
                    $item.one('click', function () {
                        clearTimeout(intervals[index]);
                        removeItem($item);
                    });
                }

                if (removeAfter !== false) {
                    intervals[index] = setTimeout(function () {
                        clearTimeout(intervals[index]);
                        removeItem($item);
                    }, removeAfter * 1000);
                }
            });
        }

        function setContainerPosition() {
            ScreenUtils.setElementPosition($container, config.positionVertical, config.positionHorizontal);
        }

        function setContainer() {
            $container = $('<div>').attr('class', 'ardo-message__container').css('display', 'none');

            if (typeof config.containerClassName === 'string') {
                $container.addClass(config.containerClassName);
            }

            $('body').append($container);
        }

        function prepareConfig() {
            config = $.extend(getDefaultConfig(), config);

            var directions = config.screen.split('-');
            config.positionVertical = directions[0];
            config.positionHorizontal = directions[1];

            return config;
        }
    };

});