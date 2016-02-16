/**
 * Created by Artur on 2014-11-17.
 */

define([
    '../../eventManager',
    '../../../helper/locationHelper'
], function(em, locationHelper) {

    return function () {
        var sortingData = {},
            lastSortField;

        /**
         * @param {{}} $tableContainer
         */
        this.init = function ($tableContainer) {
            var $sortingItems = $($tableContainer).find('table th .sort-table');

            updateSortingTabs($sortingItems);
            em.on('click', $sortingItems, sorting);
        };

        function sorting(elem) {
            var data = elem.dataset,
                queryParams = {};

            if (data.orderDir && data.orderField) {
                var orderDir = (sortingData[data.orderField]) ? sortingData[data.orderField] : data.orderDir;

                queryParams.orderField = data.orderField;
                queryParams.orderDir = orderDir;

                sortingData[data.orderField] = (orderDir == 'asc') ? 'desc' : 'asc';
                lastSortField = data.orderField;

                em.dispatch('table.updateTable', [queryParams, locationHelper.getCurrentUrl()]);
            }
        }

        function updateSortingTabs($sortingItems) {
            $sortingItems.each(function() {
                if (lastSortField == this.dataset.orderField) {
                    this.dataset.orderDir = sortingData[this.dataset.orderField];
                    $(this).addClass('is-clicked');
                }
            });
        }
    };

});