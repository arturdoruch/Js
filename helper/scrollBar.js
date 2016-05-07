/**
 * Browser scroll bars helpers
 *
 * @author Artur Doruch <arturdoruch@interia.pl>
 */
define(['../util/browserUtils'], function(BrowserUtils) {

    var tempBodyMarginLeft = 0;

    /**
     * Gets scroll bar width
     * @return {int}
     */
    function getWidth() {
        return BrowserUtils.getScrollBarWidth();
    }

    /**
     * Loads and unloads browser scroll bars.
     *
     * @param {string} state One of: "load", "unload"
     * @param {bool}   [freezeBody]
     */
    function _load(state, freezeBody) {
        if (document.documentElement) {
            document.documentElement.style.overflow = state === 'load' ? 'auto' : 'hidden'; // Firefox, Chrome
        } else {
            document.body.scroll = state === 'load' ? 'yes' : 'no'; // old IE
        }

        _setBodyMargin(state === 'load', freezeBody);
    }

    /**
     * @param {bool} isLoaded If scroll bar is loaded
     * @param {bool} freezeBody
     */
    function _setBodyMargin(isLoaded, freezeBody) {
        if (isLoaded === false && freezeBody === true) {
            tempBodyMarginLeft = document.body.style.marginLeft.replace('px', '') || 0;
            document.body.style.marginLeft = (tempBodyMarginLeft - getWidth()) + 'px';
        } else if (isLoaded === true) {
            document.body.style.marginLeft = tempBodyMarginLeft === 0 ? '' : tempBodyMarginLeft + 'px';
        }
    }

    return {
        /**
         * Unload browser vertical scroll bar.
         * @param {bool} [freezeBody = false] If true prevent to move body in horizontal position, while scroll bar is removed.
         */
        unload: function(freezeBody) {
            _load('unload', freezeBody);
        },

        /**
         * Load previously unloaded browser vertical scroll bar.
         */
        load: function() {
            _load('load');
        },

        /**
         * Gets scroll bar width.
         * @return {int}
         */
        getWidth: getWidth
    }
});
