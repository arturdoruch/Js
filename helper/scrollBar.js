/**
 * Created by Artur on 2014-11-19.
 */

define(['../util/browserUtils'], function(BrowserUtils) {

    var bodyMarginLeftTmp = 0,
        loadState = true,
        correctPositionState = false;

    /**
     * Loads and unloads browser scroll bars.
     *
     * @param state string
     * @param moveBody bool
     * @private
     */
    function _load(state, moveBody) {
        if (document.documentElement) {
            document.documentElement.style.overflow = (state == 'load') ? 'auto' : 'hidden'; // firefox, chrome
        } else {
            document.body.scroll = (state == 'load') ? 'yes' : 'no'; // old ie only
        }

        loadState = (state == 'load');

        if (moveBody == true) {
            correctBodyPosition();
        }
    }

    function correctBodyPosition() {
        if (loadState == false && correctPositionState == false) {
            bodyMarginLeftTmp = document.body.style.marginLeft.replace('px', '') || 0;
            document.body.style.marginLeft = (bodyMarginLeftTmp - getWidth()) + 'px';
            correctPositionState = true;
        } else if (loadState == true) {
            document.body.style.marginLeft = (bodyMarginLeftTmp == 0) ? '' : bodyMarginLeftTmp + 'px';
            correctPositionState = false;
        }
    }

    return {
        load: function(moveBody) {
            _load('load', moveBody);
        },
        unload: function(moveBody) {
            _load('unload', moveBody);
        },
        getWidth: function () {
            return BrowserUtils.getScrollBarWidth();
        }
    }
});
