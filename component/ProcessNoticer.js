
define([
    './DomElementCollection'
], function(DomElementCollection) {

    /**
     * @param {string}  message
     * @param {boolean} loader
     * @constructor
     */
    var Notice = function(message, loader) {
        this.id = Math.floor(Math.random() * 999999999);
        this.message = message;
        this.loader = loader;
    };

    /**
     * @param {{}}     [config]
     * @param {string} [config.containerClassName]
     * @param {string} [config.loaderClassName]
     * @param {string} [config.itemTag = span]
     */
    return function(config) {
        var notices = [],
            _config = {
                containerClassName: '',
                loaderClassName: '',
                itemTag: 'span'
            },
            elements;

        $.extend(_config, config);

        var collection = new DomElementCollection()
            .add('container', 'div', {class: 'ardo-process-notice__container ' + _config.containerClassName})
            .add('loader',    'div', {class: 'ardo-process-notice__loader ' + _config.loaderClassName})
            .add('item',      _config.itemTag, {class: 'item'});

        elements = collection.all();
        elements.container.hide().appendToIfNot();
        elements.loader.hide().appendToIfNot();

        /**
         * Adds process notice.
         *
         * @param {string|null} message              The process notice message
         * @param {bool}        [showLoader = false] Shows image loader
         *
         * @return {Notice|null} The notice instance or null if notice with given message already exists.
         */
        this.add = function (message, showLoader) {
            if (!message && !showLoader) {
                throw new Error('Must be set at least one of arguments: "message" or "showLoader".');
            }

            /*if (isNoticeExist(message)) {
                return null;
            }*/

            var notice = new Notice(message, showLoader);
            notices.push(notice);

            return notice;
        };

        /**
         * Removes notice
         * @param {Notice} notice
         */
        this.remove = function (notice) {
            if (!notice) {
                return;
            }

            if (!(notice instanceof Notice)) {
                throw new Error('This error was throw during call method "ProcessNoticer.remove". ' +
                'Argument "notice" must be instance of "Notice".');
            }
            // Remove item form array
            notices = notices.filter(function(item) {
                return item.id !== notice.id;
            });

            this.display();
        };

        /**
         * Displays added notices.
         */
        this.display = function () {
            var hasNotices = notices.length > 0,
                showLoader = false;

            elements.container.empty();

            if (hasNotices) {
                var notice;

                for (var i in notices) {
                    notice = notices[i];

                    if (notice.message) {
                        elements.item.$el()
                            .clone()
                            .html( notice.message )
                            .appendTo( elements.container.$el() );
                    }

                    if (notice.loader === true) {
                        showLoader = true;
                    }
                }
            }

            toggleElement('loader', showLoader);
            toggleElement('container', hasNotices);
        };

        var isNoticeExist = function (message) {
            return (notices.filter(function(item) {
                return item.message === message;
            }).length > 0);
        };

        /**
         * Shows or hides HTML element.
         * @param {string} elementName The element name, one of: notice, noticeLoader, noticeItem.
         * @param {bool}   state
         */
        var toggleElement = function (elementName, state) {
            state === true ? elements[elementName].show() : elements[elementName].hide();
        };
    };

});
