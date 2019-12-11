
(function ($, window, undefined) {
    /**
     * Serializes form object
     */
    (function () {
        /**
         * @param {bool} [skipEmptyValues = false]
         * @return {{}}
         */
        $.fn.serializeObject = function(skipEmptyValues) {

            var self = this,
                json = {},
                pushCounters = {},
                patterns = {
                    "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                    "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                    "push":     /^$/,
                    "fixed":    /^\d+$/,
                    "named":    /^[a-zA-Z0-9_]+$/
                };

            this.build = function(base, key, value) {
                base[key] = value;

                return base;
            };

            this.pushCounter = function(key) {
                if (pushCounters[key] === undefined) {
                    pushCounters[key] = 0;
                }

                return pushCounters[key]++;
            };

            $.each($(this).serializeArray(), function() {
                // Skip elements with invalid name or empty value.
                if (!patterns.validate.test(this.name) || skipEmptyValues === true && !this.value) {
                    return;
                }

                var k,
                    keys = this.name.match(patterns.key),
                    merge = this.value,
                    reverseKey = this.name;

                while ((k = keys.pop()) !== undefined) {
                    // Adjust reverse key
                    reverseKey = reverseKey.replace(new RegExp("\\[" + k + "\\]$"), '');

                    if (k.match(patterns.push)) {
                        merge = self.build([], self.pushCounter(reverseKey), merge);
                    } else if (k.match(patterns.fixed)) {
                        merge = self.build([], k, merge);
                    } else if (k.match(patterns.named)) {
                        merge = self.build({}, k, merge);
                    }
                }

                json = $.extend(true, json, merge);
            });

            return json;
        };
    })();

    /**
     * Adds support onprogress event for browsers not support this event.
     */
    (function () {
        if (!("onprogress" in $.ajaxSettings.xhr())) {
            return;
        }

        // Patch ajax settings to call a progress callback
        var currentXhr = $.ajaxSettings.xhr;
        $.ajaxSettings.xhr = function () {
            var xhr = currentXhr();
            if (xhr instanceof window.XMLHttpRequest) {
                xhr.addEventListener('progress', this.progress, false);
            }
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', this.progress, false);
            }
            return xhr;
        };
    })();

})(jQuery, window);
