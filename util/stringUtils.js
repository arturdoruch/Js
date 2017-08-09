/**
 * Created by Artur on 2015-01-04.
 */

define({
    /**
     * Repeats string number of times.
     *
     * @param {string} string
     * @param {int}    multiplier
     * @returns {string}
     */
    strRepeat: function(string, multiplier) {
        var result = '',
            i = 0;

        while (i++ < multiplier) {
            result += string;
        }

        return result;
    },

    /**
     * Translates a string with underscores or dashes into camel case notation.
     * E.g.: foo_bar -> fooBar, foo-bar -> fooBar
     *
     * @param {string}  string
     * @param {boolean} [capitaliseFirstChar = false] Capitalise the first char in string
     * @returns {string}
     */
    camelize: function(string, capitaliseFirstChar) {
        if (capitaliseFirstChar === true) {
            string = string.replace(/^([a-z])/, function (match, char) {
                return char.toUpperCase();
            })
        }

        return string.replace(/[\-_]([a-z])/g, function(match) {
            return match[1].toUpperCase();
        });
    },

    /**
     * Translates a string in camel case style into plain text (camelCase --> Camel case).
     *
     * @param {string} string
     * @returns {string}
     */
    camelCaseToHuman: function(string) {
        if (!string) {
            return null;
        }
        string = string.replace(/([A-Z])/g, function(match) {
            return match[0] = ' ' + match[0].toLowerCase();
        });

        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * Copies given string into system clipboard.
     *
     * @param {string} string
     */
    copyToClipboard: function(string) {
        var input = document.createElement('input');

        input.setAttribute('value', string);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
});
