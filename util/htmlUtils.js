/**
 * Created by Artur on 2015-01-26.
 */

define({

    /**
     * @param {string} tagName
     * @returns {boolean}
     */
    isTagSelfClosing: function (tagName) {
        var tags = {
            area: '', base: '', br: '', col: '', command: '', embed: '', hr: '', img: '', input: '',
            keygen: '', link: '', meta: '', param: '', source: '', track: '', wbr: ''
        };

        return tags.hasOwnProperty(tagName.toLowerCase());
    },

    /**
     * Checks if object is a HTMLElement instance.
     * @param {{}} obj
     * @returns {boolean}
     */
    isHTMLElement: function (obj) {
        return (typeof HTMLElement === "object"
            ? obj instanceof HTMLElement
            : obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string"
        );
    },

    /**
     * Checks if object is a Node instance.
     * @param {{}} obj
     * @return {boolean}
     */
    isNode: function (obj) {
        return (typeof Node === "object"
            ? obj instanceof Node
            : obj && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string"
        );
    },

    /**
     * @param {HTMLElement} element HTML element
     * @return {{}} The collection of element attributes with pairs "name: value"
     */
    getElementAttributes: function (element) {
        var attributes = element.attributes,
            attr,
            output = {};

        for (var i = 0; i < attributes.length; i++) {
            attr = attributes[i];
            output[attr.nodeName] = attr.nodeValue.trim();
        }

        return output;
    },

    /**
     * @param {string} styles Css styles to parse.
     * @param {boolean} [jsFormat = true] Formats css property name to js format.
     * @returns {{}} The collection of css properties with pairs "property: value"
     */
    parseCssStyles: function (styles, jsFormat) {
        var output = {},
            property,
            style;

        styles = styles.split(';');

        for (var i = 0; i < styles.length; i++) {
            style = styles[i].split(':');
            property = style[0].trim();

            if (!style[1]) {
                continue;
            }

            if (jsFormat !== false) {
                property = property.replace(/-([a-z])/g, function (match) {
                    return match[1].toUpperCase();
                });
            }

            output[property] = style[1].trim();
        }

        return output;
    }

});
