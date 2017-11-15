/**
 * @todo Change name to Sortable.
 *
 * Created by Artur on 2014-11-17.
 */
define([
    '../../eventManager',
    '../../../helper/locationHelper'
], function(em, locationHelper) {

    return function () {
        var sortedData = {},
            lastSortField;

        /**
         * @param {{}} $tableContainer
         */
        this.init = function ($tableContainer) {
            var $sortingItems = $($tableContainer).find('table th .sort-table');

            updateSortingTabs($sortingItems);
            em.on('click', $sortingItems, sort);
        };

        function sort(event) {
            var data = event.target.dataset;

            if (data.orderDir && data.orderField) {
                var orderDir = (sortedData[data.orderField]) ? sortedData[data.orderField] : data.orderDir;

                sortedData[data.orderField] = (orderDir == 'asc') ? 'desc' : 'asc';
                lastSortField = data.orderField;

                em.dispatch('ad_table.sort', [data.orderField, orderDir, locationHelper.getCurrentUrl()]);
            }
        }

        function updateSortingTabs($sortingItems) {
            $sortingItems.each(function() {
                if (lastSortField == this.dataset.orderField) {
                    this.dataset.orderDir = sortedData[this.dataset.orderField];
                    $(this).addClass('is-clicked');
                }
            });
        }
    };
});