/**
 * Created by Artur on 2015-01-27.
 */

define(['../util/dateUtils'], function(DateUtils) {

    /*
     * 1. Doprowadzić wprowadzoną datę do formatu 2013-01-18T13:11:34 albo 2013-01-18T13:11:34.564
     * 2. Jeśli była ustawiona strefa czasowa "+04:00", "Z" uwzględnić ją.
     *    Jeśli nie ustaw podaną date jako local. Nothing add to the end.
     *
     * 3. Jeśli jest ustawiony parameter "timeZone" uwzględnij go.
     *
     * 4. Dodaj na końcu strefę czasową w formacie +00:00
     *
     *  2013-01-18T13:11:34       - Local time.
     *  2013-01-18T13:11:34Z      - With "Z" time will be set as UTC time.
     *  2013-01-18T13:11:34+00:00 - Time will be set as UTC time.
     *  2013-01-18T13:11:34+09:30 - Time will be considered as local.
     *                              UTC time will be 5 hours greater and will be 18:11:34
     */

    /**
     * Parses date string into Date object.
     *
     * @param {string} dateString Date time to parse. E.g.:
     *                            "February 23rd, 2014 11:32 AM", "2014-11-21 13:16:45"
     * @param {string} [timeZone] Sets (or override if exist) time zone. Possible values are:
     *                            UTC, GMT, range form -12:00 to +12:00.
     *
     * @return Date
     */
    function parse(dateString, timeZone) {
        var resetTimeZone = parseTimezone(timeZone),
            currentIsoZone = '',
            isIsoFormat = false,
            date = new Date(0),
            time,
            match,
            /** @returns {number} */
            setDate = function() {
                if (isIsoFormat) {
                    dateString += resetTimeZone || currentIsoZone;
                }

                time = Date.parse(dateString);
                date.setTime(time);

                if (!isIsoFormat && time > 0 && resetTimeZone) {
                    dateString = date.toIso() + resetTimeZone;

                    time = Date.parse(dateString);
                    date.setTime(time);
                }
                return time;
            };

        dateString = dateString.trim();

        // SQL format
        // 2014-11-21 13:16:45 ==> 2014-11-21T13:16:45
        dateString = dateString.replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/, '$1T$2');
        // February 23rd, 2014 11:32 AM ==> February 23, 2014 11:32 AM
        // February 1st, 2015
        dateString = dateString.replace(/ (\d{1,2})[a-z]{2},/i, ' $1,');

        // Get setting timezone from the end of string: Z, +01:00, -05:30.
        // 2015-01-26T21:18:45.662Z
        // 2014-11-21T13:16:45+01:00
        dateString.replace(/^(.+)(Z|[\+\-]\d{1,2}:\d{2})$/i, function(match, time, zone) {
            currentIsoZone = (zone.length == 1) ? '+00:00' : zone;
            dateString = time;
            isIsoFormat = true;
        });

        if (isIsoFormat === false && resetTimeZone) {
            // Remove current zone
            dateString.replace(/^(.*[^A-Z])(?!AM|PM)([A-Z]{1,5})$/i, function (match, time, zone) {
                dateString = time.trim();
            });
        }

        if (setDate() > 0) {
            return date;
        }

        /*
         * 2014-11-21 1:32 AM EST
         * 20-01-2015, 18:19
         * Yesterday, 18:19
         * Today, 18:19
         * ==> 02 23, 2014 // month day, year
         */
        if (match = /^(?:(\d{1,2}-\d{2}-\d{4})|(\d{4}-\d{2}-\d{2})|([a-z]{5,}))[, ]+(.*)/i.exec(dateString)) {
            var parts;
            if (match[1]) {
                parts = match[1].split('-');
                dateString = parts[1] + ' ' + parts[0] + ', ' + parts[2];
            } else if (match[2]) {
                parts = match[2].split('-');
                dateString = parts[1] + ' ' + parts[2] + ', ' + parts[0];
            } else {
                var tmpDate = new Date();

                dateString = DateUtils.padZero( tmpDate.getMonth() + 1 )
                + ' ' + (tmpDate.getDate() + (match[3].toLowerCase() == 'yesterday' ? -1 : 0))
                + ', ' + tmpDate.getFullYear();
            }

            dateString += ' ' + match[4];
        }

        setDate();

        return date;
    }

    /**
     * @param {string} timezone
     * @returns {null|string}
     */
    function parseTimezone(timezone) {
        if (timezone) {
            timezone = timezone.toUpperCase();
            if (timezone === 'UTC' || timezone === 'GMT') {
                return '+00:00';
            }
            if (/^([\+\-])(\d{2}):(\d{2})$/.test(timezone)) {
                return timezone;
                //minutes: (match[2] * 60 + parseInt(match[3])) * (match[1] == '-' ? -1 : 1)
            }
        }
        return null;
    }

    return {
        parse: parse
    }

});
