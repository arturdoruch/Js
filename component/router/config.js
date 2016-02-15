/**
 * Created by Artur on 2015-01-03.
 */

define(function() {

    var $base = document.getElementsByTagName('base')[0],
        BASE_URL = $base ? $base.getAttribute('href') : (location.protocol + '//' + location.hostname).replace(/\/$/, '');

    return {
        BASE_URL: BASE_URL
    }
});