/**
 * Created by Artur on 2014-11-17.
 */

define([
    '../../eventManager',
    '../../../helper/locationHelper',
    '../../../helper/localStorage'
], function(em, locationHelper, localStorage) {

    /**
     * @param {HTMLElement|jQuery} form           The filter form element
     * @param {HTMLElement|jQuery} [filterButton]
     * @param {HTMLElement|jQuery} [resetButton]
     * @param {[]}                 [noResetElements = [ filter_table[limit], filter_table[_token] ]]
     *                             The names of form elements which values should not be reset,
     *                             when $resetButton is clicked.
     */
    return function (form, filterButton, resetButton, noResetElements) {
        if (typeof form === 'undefined') {
            throw new Error('Missing "form" argument.');
        }

        var $form = $(form),
            _filterButton = $('#filter_table_filter') || filterButton,
            _resetButton = $('#filter_table_reset') || resetButton,
            _noResetElements = $.extend(
                ['filter_table[limit]', 'filter_table[_token]'],
                noResetElements
            );

        function setEvents() {
            em.on('change', $form.find('select'), filter);
            em.on('change', $form.find('input[type="radio"]'), filter);
            em.on('change', $form.find('input[type="checkbox"]'), filter);
            em.on('click', _filterButton, filter);
            em.on('click', _resetButton, reset);

            $form.on('keypress', function(e) {
                if (e.keyCode == '13') {
                    e.preventDefault();
                    filter(this);
                }
            });
        }

        function filter() {
            var formData = $form.serializeArray(),
                name,
                value,
                queryParams = {},
                params = {},
                url = locationHelper.getCurrentUrl().replace(/\/(\d+)$/, '');

            formData.map(function(i) {
                name = i.name.replace(/[^\[]*\[(.+)\].*/, '$1');
                value = i.value.trim();

                queryParams[name] = value;
                if (name.indexOf('_', 0) == -1) {
                    params[i.name] = value;
                }
            });

            localStorage.set(getParamsKey(), params);
            em.dispatch('table.updateTable', [queryParams, url]);
        }

        function reset() {
            var formElements = $form[0].elements,
                elem;

            for (var i=0; i < formElements.length; i++) {
                elem = formElements[i];

                if (_noResetElements.indexOf(elem.name) === -1) {
                    elem.value = '';
                    if (elem.nodeName == 'SELECT') {
                        elem.selectedIndex = 0;
                    }
                }
            }

            filter();
        }

        /**
         * Injects parameters from localStorage into filter form elements.
         */
        function loadParameters() {
            var params = localStorage.get(getParamsKey()),
                formElements = $form[0].elements,
                elem;

            if (!params) {
                return;
            }

            for (var i = 0; i < formElements.length; i++) {
                elem = formElements[i];
                if (params[elem.name]) {
                    elem.value = params[elem.name];
                }
            }
        }

        function getParamsKey() {
            return 'filterTable' + $form.attr('name') + locationHelper.getCurrentPath().replace(/[^\w]/, '');
        }

        this.filter = filter;

        loadParameters();
        setEvents();
    };

});