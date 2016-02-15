/**
 * Created by Artur on 2015-01-04.
 */

define([
    'browserUtils',
    'dateUtils',
    'htmlUtils',
    'objectUtils',
    'screenUtils',
    'stringUtils'
], function(browserUtils, dateUtils, htmlUtils, objectUtils, screenUtils, stringUtils) {

    return {
        browser: browserUtils,
        date: dateUtils,
        html: htmlUtils,
        object: objectUtils,
        screen: screenUtils,
        string: stringUtils
    }
});