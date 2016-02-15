/**
 * Created by Artur on 2016-02-15.
 */

define({
    /**
     * Saves data into localStorage.
     *
     * @param {string} key
     * @param {*}      value
     */
    set: function(key, value) {
        localStorage.setItem( key, JSON.stringify(value) );
    },

    /**
     * Gets data from localStorage.
     *
     * @param {string} key
     * @returns {*}
     */
    get: function(key) {
        return JSON.parse( localStorage.getItem(key) );
    },

    /**
     * Removes data from localStorage.
     *
     * @param {string} key
     */
    remove: function(key) {
        localStorage.removeItem(key);
    }
});