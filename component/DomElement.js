/**
 * Created by Artur on 2015-01-07.
 */

define([
    '../util/objectUtils',
    '../util/htmlUtils'
], function(ObjectUtils, HtmlUtils) {

    /**
     * @param {string|HTMLElement|jQuery} element Tag name, HTMLElement or jQuery element.
     * @param {object} attr     HTML element attributes.
     * @param {object} css      HTML element css styles.
     * @constructor
     */
    function DomElement(element, attr, css) {
        this.element = prepareElement(element);
        this._$el = $(this.element);

        this._css = {};
        this._attr = HtmlUtils.getElementAttributes(this.element);

        if (this._attr.style) {
            this._css = HtmlUtils.parseCssStyles(this._attr.style);
            delete this._attr.style;
        }

        this.setAttr(attr);
        this.setCss(css);
    }

    DomElement.prototype = {
        /**
         * Gets HTML Element.
         * @returns {HTMLElement}
         */
        el: function() {
            return this.element;
        },

        /**
         * Gets jQuery object.
         * @returns {jQuery}
         */
        $el: function() {
            return this._$el;
        },

        /**
         * Sets HTML element attributes.
         *
         * @param {string|object} name      The attribute name or object with pairs "name: value".
         * @param {string|}       [value]   The attribute value. Is uses only when given "name" is a string.
         * @param {bool}          [overwrite = true] Overrides existing attribute value with the new value.
         *
         * @returns {DomElement}
         */
        setAttr: function(name, value, overwrite) {
            extend(this._attr, name, value, overwrite);
            setAttr(this.element, this._attr);

            return this;
        },

        /**
         * Sets css styles.
         * @param {string|object} property  The css property or object with pairs "property: value".
         * @param {string|}       [value]   The css property value. Is uses only when given "property" is a string.
         * @param {bool}          [overwrite = true] Overrides existing property value with the new value.
         * @returns {DomElement}
         */
        setCss: function(property, value, overwrite) {
            extend(this._css, property, value, overwrite);
            setCss(this.element, this._css);

            return this;
        },

        /**
         * Appends this element to "parent" element.
         * @param {DomElement|HTMLElement|jQuery} [parent = document.body]
         */
        appendTo: function(parent) {
            if (!parent) {
                document.body.appendChild(this.el());
            } else if (parent instanceof DomElement) {
                parent.el().appendChild(this.el());
            } else if (parent instanceof jQuery || parent instanceof HTMLElement) {
                parent.appendChild(this.el());
            }

            return this;
        },

        /**
         * Appends this element to "parent" only if element is not yet appended to DOM document.
         * @param {DomElement|HTMLElement|jQuery} [parent = document.body]
         */
        appendToIfNot: function(parent) {
            if (!document.body.contains(this.el())) {
                this.appendTo(parent);
            }

            return this;
        },

        /**
         * Removes element from DOM object.
         */
        remove: function() {
            this.$el().remove();
        },

        empty: function() {
            this.$el().empty();
        },

        hide: function() {
            this.el().style.display = 'none';

            return this;
        },

        /**
         * Sets css "display" property to different then "none".
         * If in css configuration is set property "display" then will be used.
         * Otherwise will be used empty value.
         * @returns {DomElement}
         */
        show: function() {
            var display = this._css.display;
            this.el().style.display = display && display != 'none' ? display : '';

            return this;
        }
    };

    /**
     * @param {*} element
     * @returns {HTMLElement}
     */
    function prepareElement(element) {
        if (ObjectUtils.is('String', element) && element.length > 0) {
            return document.createElement(element);
        } else if (element instanceof jQuery) {
            return element[0];
        } else if (element instanceof HTMLElement) {
            return element;
        }

        throw new TypeError('The "DomElement" constructor argument "element" must be' +
            ' tag name, "HTMLElement" or "jQuery" object. ' + element + ' given.'
        );
    }

    /**
     * @param {HTMLElement} element
     * @param {object}      attributes
     */
    function setAttr(element, attributes) {
        for (var attr in attributes) {
            element.setAttribute(attr, attributes[attr].trim());
        }
    }

    /**
     *
     * @param {HTMLElement} element
     * @param {object}      css
     */
    function setCss(element, css) {
        var property;

        for (var prop in css) {
            property = prop.replace(/-([a-z])/g, function(match) {
                return match[1].toUpperCase();
            });

            element.style[property] = css[prop];
        }
    }

    /**
     * Extends attr and css objects configuration.
     * @param {object}        object Object for extends.
     * @param {string|object} name
     * @param {string}        [value]
     * @param {bool}          [override = true] If true adds new attribute only if not set yet.
     *                                        If false always adds new attribute or override them if already exists.
     */
    function extend(object, name, value, override) {
        if (ObjectUtils.is('Object', name)) {
            if (override === false) {
                for (var attr in name) {
                    if (!object.hasOwnProperty(attr)) {
                        object[attr] = name[attr];
                    }
                }
            } else {
                $.extend(object, name);
            }
        } else if (ObjectUtils.is('String', name)) {
            if (override === false) {
                if (!object.hasOwnProperty(name)) {
                    object[name] = value;
                }
            } else {
                object[name] = value;
            }
        }
    }

    return DomElement;
});