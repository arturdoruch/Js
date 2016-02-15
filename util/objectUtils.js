/**
 * Created by Artur on 2015-01-04.
 */

define({

    /**
     * Checks if object is of expected type.
     *
     * @param {string} type
     * @param {*}      object
     * @returns {boolean}
     */
    is: function(type, object) {
        var cls = Object.prototype.toString.call(object).slice(8, -1);
        return object !== undefined && object !== null && cls === type;
    },

    /**
     * Checks if given object is of object type.
     *
     * @param {object} object
     * @returns {boolean}
     */
    isObject: function(object) {
        return this.is('Object', object);
    },

    /**
     * Checks if given object is of array type.
     *
     * @param {object} object
     * @returns {boolean}
     */
    isArray: function(object) {
        return this.is('Array', object);
    },

    /**
     * Checks if given string is a "String" type.
     * @param string
     * @returns {boolean}
     */
    isString: function(string) {
        return (typeof string === 'string' || string instanceof String);
    },

    /**
     * Executes function from nested object.
     *
     * @param {string} functionName         Full path to nested object function.
     *                                      Example: "object.subObj.subSubObj", "object.subObj.subSubObj(string, true)"
     *                                      If you want to set arguments with type like: true, false or number, as string
     *                                      put this argument into double quotes "".
     * @param {object} context
     * @param {array}  [args]               Calling function arguments.
     * @param {string} [execMethod="apply"] Name of method that calls function. [call, apply]
     *
     * @returns {*}
     */
    execFunctionByName: function (functionName, context, args, execMethod) {
        var that = this;
        if (functionName instanceof Object) {
            return functionName.call();
        }

        functionName.replace(/^ *([\w\.]+)\((.*)\) *$/g, function(match, _func, _args) {
            functionName = _func;
            _args = _args.split(',').map(function(arg) {
                arg = arg.trim();
                if (arg === 'true') {
                    return true;
                } else if (arg === 'false') {
                    return false;
                } else if (!isNaN(arg)) {
                    return parseInt(arg);
                } else if (arg = /^"(.*)"$/.exec(arg)) {
                    return arg[1];
                }
                return arg;
            });
            args = that.extend(args || [], _args);
        });

        //var args = Array.prototype.slice.call(arguments, 2),
        var namespaces = functionName.split("."),
            func = namespaces.pop();

        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
            if (!context) {
                return false;
            }
        }

        return context[func][execMethod || 'apply'](context, args);
    },

    extend: function(destination, source) {
        var array;

        for (var i in source) {
            array = destination[i];
            if (array && typeof(array) == 'object' && array.toString() == '[object Object]' && array) {
                this.extend(destination[i], source[i])
            } else {
                destination[i] = source[i];
            }
        }
        return destination;
    },

    /**
     * Filters object with matches key regexp.
     * @param {object} object
     * @param {RegExp} regexp Searching key as regexp.
     */
    filterByKey: function(object, regexp) {
        for (var key in object) {
            if (!regexp.test(key)) {
                delete object[key];
            }
        }
    },

    /**
     * Searches object for key that matches with given regexp.
     * @param {object} object
     * @param {RegExp} regexp Searching key as regexp.
     * @returns {boolean}
     */
    isExistsKey: function(object, regexp) {
        for (var key in object) {
            if (regexp.test(key)) {
                return true;
            }
        }
        return false;
    },

    destroy: function(obj) {
        obj = null;
        for (var i in obj) {
            delete obj[i];
        }
        return obj;
    },

    // Array
    removeItemFromArray: function(array, value) {
        var index = array.indexOf(value);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    },

    arraySortCompare: function(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function(a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;

            return result * sortOrder;
        }
    }

    /*
     * @param {array} array     Array with indexes to remove from array.
     *                          Indexes array must be sorted ascending.
     * @param {array} indexes
     *//*
     function removeItemsFromArray(array, indexes) {
         if (indexes.length == 0) {
            return array;
         }

         indexes.reverse();
         for (var i in indexes) {
             if (typeof array[indexes[i]] !== 'undefined') {
                array.splice(indexes[i], 1);
             }
         }
         return array;
     }*/

});