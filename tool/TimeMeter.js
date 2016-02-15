/**
 * Created by Artur on 2016-02-09.
 */

define(function () {

    /**
     * Counts script execution time.
     */
    return function () {
        var startTime = new Date().getTime();

        /**
         * Gets time (in milliseconds) which elapsed, after instantiated this class.
         * @returns {number}
         */
        this.getTime = function() {
            return new Date().getTime() - startTime;
        }
    };

});