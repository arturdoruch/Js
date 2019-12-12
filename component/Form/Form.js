/*!
 * (c) 2019 Artur Doruch <arturdoruch@interia.pl>
 */

define([
    '../eventManager'
], function (em) {

    /**
     * @param {HTMLFormElement|jQuery|string} form The form HTML o jQuery object or css selector
     * @constructor
     */
    var Class = function (form) {
        var $form = $(form);

        if ($form.length === 0) {
            throw new Error('Form not found.');
        }

        this.$form = $form;
        this._form = $form[0];
        this._elements = this._form.elements;
    };

    Class.prototype = {

        submit: function () {
            this._form.submit();
        },

        /**
         * Removes element from the DOM document.
         *
         * @param {string} name The element name.
         */
        removeElement: function (name) {
            var element = this._elements.namedItem(name);

            if (element) {
                this._form.removeChild(element);
            }
        },

        /**
         * @param {string} name The element name.
         *
         * @return {Node|null}
         */
        getElement: function (name) {
            return this._elements.namedItem(name);
        },

        /**
         * Adds listener to the form element.
         *
         * @param {string} event The event name.
         * @param {string} name The form element name or CSS selector.
         * @param {function} listener
         * @param {{}}      [options]
         * @param {[]}      [options.arguments] The listener arguments.
         * @param {{}}      [options.context = window] The listener context.
         * @param {boolean} [options.preventDefault = true]
         *
         * @return Class
         */
        addElementListener: function (event, name, listener, options) {
            em.on(event, this.getElement(name) || name, listener,
                options.arguments || [],
                options.context || window,
                options.preventDefault || true
            );

            return this;
        },

        /**
         * Adds listener to the form submit event.
         * The listener is called when button[type="submit"] is clicked or pressed enter on the input element.
         *
         * @param {function} listener
         * @param {{}}      [options]
         * @param {[]}      [options.arguments] The listener arguments.
         * @param {{}}      [options.context = window] The listener context.
         * @param {boolean} [options.preventDefault = true]
         *
         * @return Class
         */
        addSubmitListener: function (listener, options) {
            em.on('submit', this._form, listener,
                options.arguments || [],
                options.context || window,
                options.preventDefault || true
            );

            return this;
        },

        /**
         * @param {boolean} [skipEmptyValue = false]
         * @param {{}} [extraQueryParameters]
         * @return {string}
         */
        createRequestUrl: function (skipEmptyValue, extraQueryParameters) {
            var data = $.extend(this.getData(skipEmptyValue), extraQueryParameters || {}),
                queryString = $.param(data),
                url = this.getAction();

            if (queryString) {
                url += (/\?/.test(url) ? '&' : '?') + queryString;
            }

            return url;
        },

        /**
         * Gets form data.
         *
         * @param {boolean} [skipEmptyValues = false]
         * @return {{}}
         */
        getData: function(skipEmptyValues) {
            var elements = this.$form.serializeArray(),
                element, name, value,
                data = {},
                pushCounters = {},
                patterns = {
                    "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                    "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
                    "push": /^$/,
                    "fixed": /^\d+$/,
                    "named": /^[a-zA-Z0-9_]+$/
                };

            var build = function (base, key, value) {
                base[key] = value;

                return base;
            };

            var pushCounter = function (key) {
                if (pushCounters[key] === undefined) {
                    pushCounters[key] = 0;
                }

                return pushCounters[key]++;
            };

            for (var i = 0; i < elements.length; i++) {
                element = elements[i];
                name = element.name;
                value = element.value;

                // Skip elements with invalid name or empty value.
                if (!patterns.validate.test(name) || skipEmptyValues === true && !value) {
                    continue;
                }

                var k,
                    keys = name.match(patterns.key),
                    merge = value,
                    reverseKey = name;

                while ((k = keys.pop()) !== undefined) {
                    // Adjust reverse key
                    reverseKey = reverseKey.replace(new RegExp("\\[" + k + "\\]$"), '');

                    if (k.match(patterns.push)) {
                        merge = build([], pushCounter(reverseKey), merge);
                    } else if (k.match(patterns.fixed)) {
                        merge = build([], k, merge);
                    } else if (k.match(patterns.named)) {
                        merge = build({}, k, merge);
                    }
                }

                data = $.extend(true, data, merge);
            }

            return data;
        },

        /**
         * Resets form field values.
         *
         * @param {[]} [preserveFields] The list of field names to not reset.
         * @param {boolean} [resetHiddenFields = true] Whether to reset hidden input fields.
         */
        resetData: function(preserveFields, resetHiddenFields) {
            var element,
                type,
                _preserveFields = preserveFields || [];

            for (var i = 0; i < this._elements.length; i++) {
                element = this._elements[i];
                type = element.type;

                if (_preserveFields.indexOf(element.name) !== -1) {
                    continue;
                }

                if (element.nodeName === 'SELECT') {
                    for (var o in element.options) {
                        element.options[o].selected = false;
                    }
                } else if (element.nodeName !== 'BUTTON') {
                    if (type === 'radio' || type === 'checkbox') {
                        element.checked = false;
                    } else if (type === 'hidden' && resetHiddenFields === false) {
                    } else {
                        element.value = '';
                    }
                }
            }
        },

        /**
         * Sets form field values.
         *
         * @param {{}} data The form data, as "field name: value" pairs.
         */
        setData: function(data) {
            var element,
                value,
                option;

            for (var i = 0; i < this._elements.length; i++) {
                element = this._elements[i];
                value = data[element.name];

                if (value === undefined) {
                    continue;
                }

                switch (element.type) {
                    case 'submit':
                    case 'reset':
                    case 'button':
                        break;

                    case 'select-one':
                    case 'select-multiple':
                        if (typeof value === 'string' || value instanceof String) {
                            value = [value];
                        }

                        element.selectedIndex = -1;

                        for (var j in element.options) {
                            option = element.options[j];

                            for (var k in value) {
                                if (value[k] == option.value) {
                                    option.selected = j;
                                }
                            }
                        }

                        break;
                    case 'radio':
                    case 'checkbox':
                        element.checked = false;

                        if (typeof value === 'string' || value instanceof String) {
                            value = [value];
                        }

                        for (var l in value) {
                            if (value[l] == element.value) {
                                element.checked = true;
                            }
                        }

                        break;
                    default:
                        element.value = value;
                }
            }
        },

        getName: function () {
            return this._form.name;
        },

        getAction: function () {
            return this._form.action;
        },

        getMethod: function () {
            return this._form.method;
        }
    };

    return Class;
});