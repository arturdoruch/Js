/**
 * Created by Artur on 2015-01-08.
 */

define(['./DomElement'], function(DomElement) {

    function DomElementCollection() {
        this._collection = {};
    }

    DomElementCollection.prototype = {
        /**
         * Adds new DomElement into collection.
         * @param {string}     name
         * @param {DomElement|string|HTMLElement|jQuery} element DomElement instance, tag name, HTMLElement or jQuery element.
         * @param {object} [attr]     HTML element attributes.
         * @param {object} [css]      HTML element css styles.
         * @returns {DomElementCollection}
         */
        add: function(name, element, attr, css) {
            if (!(element instanceof DomElement)) {
                element = new DomElement(element, attr, css);
            }

            this._collection[name] = element;

            return this;
        },

        /**
         * Gets all collection object, which contain DomElement objects.
         * @returns {object}
         */
        all: function() {
            return this._collection;
        },

        /**
         * @param {string} name
         * @returns {DomElement|null}
         */
        get: function(name) {
            return this.has(name) ? this._collection[name] : null;
        },

        /**
         * @param {string} name
         * @returns {boolean}
         */
        has: function(name) {
            return this._collection.hasOwnProperty(name);
        },

        /**
         * Removes DomElement form collection.
         * @param {string} name
         * @returns {DomElementCollection}
         */
        remove: function(name) {
            if (this.has(name)) {
                this._collection[name] = null;
                delete this._collection[name];
            }

            return this;
        }
    };

    return DomElementCollection;
});