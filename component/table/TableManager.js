/**
 * Created by Artur on 2014-11-15.
 */

define([
    '../eventManager',
    '../ajax'
], function(em, Ajax) {

    var $table,
        _pagination,
        _sorting,
        _filter,
        updateTableCallback = function() {},
        _updateTableConfig = {
            processMessage: 'Getting table items',
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
        $.extend(_updateTableConfig, config);

        this.setSorting(sorting);
        this.setPagination(pagination);
        this.setFilter(filter);

        subscriptions();

        if (_filter) {
            _filter.filter();
        } else {
            $table.show();
        }
    };

    function reInitFunctionality() {
        if (_pagination) {
            _pagination.init(loadTable);
        }
        if (_sorting) {
            _sorting.init($table);
        }
    }

    function subscriptions() {
        em.addListener('table.updateTable', function(event, params, url) {
            addQueryParams(params);
            loadTable(url);
        });
    }

    function addQueryParams(params) {
        $.extend(queryParams, params);
    }

    function loadTable(url, pushState) {
        getTableList(url)
            .success(function(html) {
                if (pushState !== false) {
                    historyManager.pushState(html, url);
                }
                updateTable(html, url);
            });
    }

    function getTableList(url) {
        return Ajax.send({
            url: url,
            data: queryParams
        }, _updateTableConfig.processMessage, _updateTableConfig.showLoader)
    }

    function updateTable(html, url) {
        $table.html(html).show();
        reInitFunctionality();
        updateTableCallback.call(null, url);
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
         * @param {object} params
         */
        addQueryParams: function(params) {
            addQueryParams(params);
        },

        /**
         * Registers callback function that will be called, when table will be updated.
         *
         * @param {function} callback
         */
        setUpdateTabelCallback: function(callback) {
            updateTableCallback = callback;
        }
    };

    return TableManager;
});