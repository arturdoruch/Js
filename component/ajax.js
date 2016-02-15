
define(['./router/config', '../tool/TimeMeter'], function(config, TimeMeter) {

    var _processNoticer;

    /**
     * @param {object} options jQuery ajax request options
     * @param {string} [noticeMessage]
     * @param {bool}   [noticeShowLoader]
     */
    function send(options, noticeMessage, noticeShowLoader) {
        if (_processNoticer && noticeMessage) {
            var notice = _processNoticer.add(noticeMessage, noticeShowLoader);
            _processNoticer.display();
        }

        options = prepareOptions(options);

        return $.ajax(options)
            .done(function(response) {
                //console.log( response );
            })
            .always(function() {
                if (notice) {
                    _processNoticer.remove(notice);
                }
            });
    }

    /**
     * Gets html template, fills with data and appends to parent element.
     *
     * @param {HTMLElement|jQuery} parentElement
     * @param {string}  url
     * @param {{}|string}      [data]
     *
     * @returns {{}}
     */
    function appendView(parentElement, url, data) {
        var options = prepareOptions({
            url: url,
            data: data
        });
        //options.headers['Load-View'] = 1;

        return $.ajax(options)
            .done(function(response) {
                if (parentElement) {
                    $(parentElement).show().html(response);
                }
            });
    }

    /**
     * @param {{}} options
     * @returns {{}}
     */
    function prepareOptions(options) {
        var _options = {
            url: null,
            data: null
        };

        options = $.extend(_options, options);
        options.url = prepareUrl(options.url);

        if (options.data) {
            if (!options.type) {
                options.type = 'POST';
            }

            if (isFormMethod(options.type) && typeof options.data !== 'string') {
                if (!options.contentType) {
                    options.contentType = 'application/json; charset=UFT-8';
                }

                if (/^application\/json/.test(options.contentType)) {
                    options.data = JSON.stringify(options.data);
                }
            }
        }

        return options;
    }

    /**
     * @param {string} url
     * @returns {string}
     */
    function prepareUrl(url) {
        if (!url) {
            throw new Error('The xhr request url is empty.');
        }

        return config.BASE_URL + url.replace(config.BASE_URL, '');
    }

    /**
     * @param {string} method Http request method
     * @returns {boolean}
     */
    function isFormMethod(method) {
        return ['POST', 'PUT', 'PATCH'].indexOf(method.toUpperCase()) !== -1;
    }

    return {
        send: send,
        appendView: appendView,
        setProcessNoticer: function (processNoticer) {
            _processNoticer = processNoticer
        }
    }
});
