//(function ($) {
//    /**
//     * Adds event observer subscriber
//     *
//     * @param $ jQuery object
//     */
//    var o = $({});
//
//    $.each({
//        trigger: 'dispatch',
//        on: 'addListener',
//        off: 'removeListener'
//    }, function (key, val) {
//        jQuery[val] = function() {
//            o[key].apply(o, arguments);
//        }
//    });
//
//})(jQuery);

(function ($, window, undefined) {
    // Check if browser support onprogress event.
    var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

    if (!hasOnProgress) {
        return;
    }

    // Patch ajax settings to call a progress callback
    var currentXHR = $.ajaxSettings.xhr;
    $.ajaxSettings.xhr = function () {
        var xhr = currentXHR();
        if (xhr instanceof window.XMLHttpRequest) {
            xhr.addEventListener('progress', this.progress, false);
        }
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', this.progress, false);
        }
        return xhr;
    };
})(jQuery, window);
