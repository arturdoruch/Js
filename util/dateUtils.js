/**
 * Created by Artur on 2015-01-04.
 */

define(function() {

    /**
     * @returns {string} Date in database format "YYYY-MM-DD".
     */
    Date.prototype.toDate = function() {
        return this.getFullYear() + '-' + date.padZero(this.getMonth()+1) + '-' +  date.padZero(this.getDate());
    };

    /**
     * @returns {string} UTC date in database format "YYYY-MM-DD".
     */
    Date.prototype.toUTCDate = function() {
        return this.getUTCFullYear() + '-' + date.padZero(this.getUTCMonth()+1) + '-' + date.padZero(this.getUTCDate());
    };

    /**
     * @returns {string} Datetime in database format "YYYY-MM-DD HH:MI:SS"
     */
    Date.prototype.toDateTime = function() {
        var hour = date.padZero(this.getHours()),
            min = date.padZero(this.getMinutes()),
            sec = date.padZero(this.getSeconds());

        return this.toDate() + ' '+ hour + ':' + min + ':' + sec;
    };

    /**
     * @returns {string} UTC Datetime in database format "YYYY-MM-DD HH:MI:SS"
     */
    Date.prototype.toUTCDateTime = function() {
        var hour = date.padZero(this.getUTCHours()),
            min = date.padZero(this.getUTCMinutes()),
            sec = date.padZero(this.getUTCSeconds());

        return this.toUTCDate() + ' '+ hour + ':' + min + ':' + sec;
    };

    /**
     * @returns {string} Returns a local date as a string value in ISO format.
     */
    Date.prototype.toIso = function() {
        return this.toDate()
        + 'T' + date.padZero(this.getHours())
        + ':' + date.padZero(this.getMinutes())
        + ':' + date.padZero(this.getSeconds())
        + '.' + this.getMilliseconds();
    };

    /**
     * Increases or decreases Date object date on a specified amount days.
     * @param {number} days
     * @returns {Date}
     */
    Date.prototype.moveDays = function(days) {
        this.setDate(this.getDate() + days);
        return this;
    };

    var monthFormat = {
        number: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        short:  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        long:   ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    var date = {
        /** Gets the difference in minutes between the time on the local computer and Universal Coordinated Time (UTC). */
        getTimezoneOffset: function() {
            return new Date().getTimezoneOffset();
        },

        /** Gets server timezone. */
        getLocalTimezone: function() {
            return (this.getTimezoneOffset() / 60) * -1;
        },

        /*
         * @param {number} timestamp
         * @param {number} zone Time zone from range -12 to +13.
         * @returns {number} GMT timezone
         */
        /*setTimezone: function(timestamp, zone) {
         return timestamp - zone*60*60;
         },*/

        /**
         * Pads zero "0" before number smaller then 10.
         *
         * @param {Number} number
         * @returns {string}
         */
        padZero: function(number) {
            // ("0" + number.toString()).slice(-2)
            return number < 10 ? "0" + number.toString() : number;
        },

        /**
         * Gets formatted current date.
         * @param {string} format Date format. Possible values: date, dateTime, UTCDate, UTCDateTime
         * @param {number} [moveDays=0]
         * @returns {string}
         */
        getCurrentDate: function(format, moveDays) {
            var date = new Date().moveDays(moveDays || 0);

            switch (format) {
                case "date":		return date.toDate();
                case "dateTime":	return date.toDateTime();
                case "UTCDate":		return date.toUTCDate();
                case "UTCDateTime":	return date.toUTCDateTime();
                default:            return date.toDateTime();
            }
        },

        timestampToDate: function(timestamp) {
            return new Date(timestamp*1000).toDate();
        },

        timestampToUTCDate: function(timestamp) {
            return new Date(timestamp*1000).toUTCDate();
        },

        timestampToDatetime: function(timestamp) {
            return new Date(timestamp*1000).toDateTime();
        },

        timestampToUTCDatetime: function(timestamp) {
            return new Date(timestamp*1000).toUTCDateTime();
        },

        /**
         * Gets unix timestamp date without time.
         * @param {number} timestamp Unix time in seconds.
         * @returns {number}
         */
        getTime: function(timestamp) {
            var time = new Date(timestamp * 1000),
                date = time.getFullYear()+', '+(time.getMonth()+1)+', '+time.getDate();

            return new Date(date).getTime() / 1000;
        },

        /**
         * Gets unix timestamp date without time in Coordinated Universal Time standard.
         * @param {number} timestamp Unix time in seconds.
         * @returns {number}
         */
        getUTCTime: function(timestamp) {
            var time = new Date(timestamp * 1000),
                date = time.getUTCFullYear()+', '+(time.getUTCMonth()+1)+', '+time.getUTCDate();

            return new Date(date).getTime() / 1000;
        },

        /**
         * Converts datetime to timestamp in milliseconds.
         * @param {string} time              Datetime in sql format "YYYY-MM-DD HH:MI:SS"
         * @param {bool} [milliSecond=false] Describes returned timestamp precision. If true timestamp will be
         *                                   in milliseconds, otherwise in seconds.
         * @returns {number}                 Timestamp
         */
        sqlToTimestamp: function(time, milliSecond) {
            if (!time) {
                throw new Error('Missing "time" parameter value.');
            }
            var date = Date.parse( time.replace(/(-)/g, ',') );

            return milliSecond === true ? date : date / 1000;
        },

        /**
         * Converts sql dateTime format into Date object
         * @param {string} dateTime SQL date time like '2015-01-20 01:01:03'
         * @returns {Date}
         */
        sqlToDate: function(dateTime) {
            dateTime = dateTime.trim().replace(/(-)/g, ',');
            return new Date(dateTime);
        },

        /**
         * Converts string month into number representation.
         * @param {string} month Proper month value in short "Jan" or long "January" format.
         * @returns {number}
         */
        monthStringToNumber: function(month) {
            var i, length = monthFormat.short.length;

            for (i = 0; length; i++) {
                if (month.indexOf(monthFormat.short[i]) === 0) {
                    return monthFormat.number[i];
                }
            }

            throw new Error('Invalid "month" value');
        },

        /**
         * Converts number month into string representation.
         * @param {Number} month Proper month value in number representation.
         * @param {bool} [fullName = false] If output value should be a full month name.
         * @returns {string}
         */
        monthNumberToString: function(month, fullName) {
            var i, length = monthFormat.number.length;

            month = this.padZero(month);
            for (i = 0; length; i++) {
                if (month == monthFormat.number[i]) {
                    return (fullName === true) ? monthFormat.long[i] : monthFormat.short[i];
                }
            }

            throw new Error('Invalid "month" value');
        },

        /**
         * Gets Date objects collection from given range time.
         * @param {number|Date} startTime      Start range time in milliseconds timestamp or Date object.
         * @param {number|Date} endTime        End range time in milliseconds timestamp or Date object.
         * @param {string} [direction="asc"]   Direction sorting of returning array. Allowed values [asc, desc].
         * @param {string|number} [step="day"] Dates collection steps. Possible values:
         *                                     "[digit] day[s]", "[digit] hour[s]" or number of minutes.
         *
         * @returns {Date[]}                   Date objects array collection.
         */
        getTimeRange: function(startTime, endTime, direction, step) {
            var dates = [],
                parseStep = function(step) {
                    var number = null;

                    if (step && !isNaN(step)) {
                        return 60 * step;
                    }
                    if (number = /^([\d]*) ?hours?$/.exec(step)) {
                        return 60 * 60 * parseInt(number[1]);
                    }
                    if (number = /^([\d]*) ?days?$/.exec(step)) {
                        return 60 * 60 * 24 * parseInt(number[1]);
                    }

                    return 60 * 60 * 24;
                };

            step = parseStep(step) * 1000;

            if (startTime instanceof Date) {
                startTime = startTime.getTime();
            }
            if (endTime instanceof Date) {
                endTime = endTime.getTime();
            }

            while (startTime <= endTime) {
                dates.push(new Date(startTime));
                startTime += step;
            }

            if (direction === 'desc') {
                dates.reverse();
            }

            return dates;
        }
    };

    return date;
});
