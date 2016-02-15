/**
 * Created by Artur on 2014-11-15.
 */

define(function() {

    function removeWhitespace(data) {
        if (typeof data == 'string') {
            data = data.replace(/(\r\n)/g, '').replace(/\s{2,}/g, ' ');
        }
        return data;
    }

    return {
        pushState: function(data, url) {
            history.pushState(removeWhitespace(data), '', url);
        },

        replaceState: function(data, url) {
            history.replaceState(data, '', url);
        },

        getState: function() {
            return history.state;
        }
    }
});