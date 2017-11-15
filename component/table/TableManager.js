/**
 * Created by Artur on 2014-11-15.
 */

define([
    '../eventManager',
    '../ajax',
    '../router',
    '../../helper/locationHelper'
], function(em, ajax, router, locationHelper) {

    var $table,
        _pagination,
        _sorting,
        _filter,
        // Update table listeners.
        updateListeners = [],
        updateConfig = {
            processMessage: 'Getting items',
            showLoader: true
        },
        queryParams = {},
        _events = [];

    /**
     * @param {object} table Table container
     * @param {object} config Update table config
     * @param {string} [config.processMessage = 'Getting table items'] Message showing while table is updated.
     * @param {bool}   [config.showLoader = true] Whether the image loader should be displayed while table is updated.
     * @param filter
     * @param pagination
     * @param sorting
     */
    var TableManager = function(table, config, sorting, pagination, filter) {
        $table = $(table);
        $.extend(updateConfig, config);

        this.setSorting(sorting);
        this.setPagination(pagination);
        this.setFilter(filter);

        setListeners();
        initFunctionality();

        if (_filter) {
            _filter.filter();
        } else {
            $table.show();
        }
    };

    function initFunctionality() {
        if (_pagination) {
            _pagination.init(loadTable);
        }
        if (_sorting) {
            _sorting.init($table);
        }
    }

    function setListeners() {
        em.addListener('ad_table.filter', function(event, params, url) {
            queryParams = params;
            loadTable(url);
        });

        em.addListener('ad_table.sort', function(event, orderField, orderDir, url) {
            queryParams['orderField'] = orderField;
            queryParams['orderDir'] = orderDir;
            loadTable(url);
        });
    }

    function loadTable(url, pushState) {
        getTableList(url)
            .success(function(html) {
                if (pushState !== false) {
                    router.setLocation(url, html);
                }
                updateTable(html, url);
            });
    }

    function getTableList(url) {
        return ajax.send({
            url: url,
            data: queryParams
        }, updateConfig.processMessage, updateConfig.showLoader)
    }

    function updateTable(html, url) {
        $table.html(html).show();
        initFunctionality();
        // Dispatch update table event
        for (var l in updateListeners) {
            updateListeners[l].call(null, url);
        }
    }

    TableManager.prototype = {
        /**
         * @param {Filter} filter The filter instance (module located in table/feature/Filter)
         * @return TableManager
         */
        setFilter: function (filter) {
            _filter = filter;
            return TableManager;
        },

        /**
         * @param {Pagination} pagination The pagination instance (module located in table/feature/Pagination)
         * @return TableManager
         */
        setPagination: function (pagination) {
            _pagination = pagination;
            return TableManager;
        },

        /**
         * @param {Sorting} sorting The pagination instance (module located in table/feature/Sorting)
         * @return TableManager
         */
        setSorting: function (sorting) {
            _sorting = sorting;
            return TableManager;
        },

        /**
         * Loads table content. Makes ajax request and update table with returned data.
         *
         * @param {string} url Url to table content resource, is uses for ajax request.
         * @param {bool}   [pushState]
         */
        loadTable: function(url, pushState) {
            loadTable(url);
        },

        /**
         * Updates, fills table with given html.
         *
         * @param {string} html
         * @param {string} url Url to current route.
         */
        updateTable: function(html, url) {
            updateTable(html, url);
        },

        getTableRows: function() {
            return $table.find('tbody').find('tr');
        },

        /**
         * @todo It's rather useless.
         *
         * @param {object} params
         */
        addQueryParams: function(params) {
            $.extend(queryParams, params);
        },

        /**
         * @deprecated Use addUpdateTableListener() method instead.
         * Registers callback function that will be called, when table will be updated.
         *
         * @param {function} callback
         */
        setUpdateTabelCallback: function(callback) {
            this.addUpdateTableListener(callback)
        },

        /**
         * Registers listener, which will be called after update table list.
         *
         * @param {function} listener The listener function. Function received one argument: url.
         */
        addUpdateTableListener: function (listener) {
            if (typeof listener !== 'function') {
                throw new Error('The given value is not a function.');
            }

            updateListeners.push(listener);
        }
    };

    return TableManager;
});