/**
 * Created by Artur on 2014-11-28.
 */

define(['./helper'], function(RouterHelper) {

    function init(initializing) {
        load(initializing);
    }

    function load(initializing) {
        var requestRoute = RouterHelper.cleanRoute(location.href);

        if (requestRoute === '') {
            requestRoute = '/';
        }

        for (var path in initializing) {
            if ( new RegExp('^'+path+'$', 'i').test( requestRoute ) ) {
                initializing[path]();
                break;
            }
        }
    }

    return {
        init: init
    }
});