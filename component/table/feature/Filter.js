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
     * @param {HTMLElement|jQuery|string} [filterButton] Filter button CSS selector, HTML, or jQuery element.
     * @param {HTMLElement|jQuery|string} [resetButton] Reset button CSS selector, HTML, or jQuery element.
     * @param {[]}                 [noResetElements = [ filter_table[limit], filter_table[_token] ]]
     *                             The names of form elements which values should not be reset,
     *                             when $resetButton is clicked.
     * @todo Set default field values for pass to field when reset button is clicked.
     */
    return function (form, filterButton, resetButton, noResetElements) {
        if (typeof form === 'undefined') {
            throw new Error('Missing "form" argument.');
        }

        var $form = $(form),
            _filterButton = $(filterButton || '#filter_table_filter'),
            _resetButton = $(resetButton || '#filter_table_reset'),
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
                // Set url "page" query parameter to 1.
                url = locationHelper.getCurrentUrl().replace(/\/\d+$/, '').replace(/([\?&]page=)\d+/i, '$11');

            formData.map(function(element) {
                // todo Leave original form element name.
                name = element.name.replace(/[^\[]*\[(.+)\].*/, '$1');
                value = element.value.trim();

                queryParams[name] = value;
                if (name.indexOf('_', 0) == -1) {
                    params[element.name] = value;
                }
            });

            localStorage.set(getParamsKey(), params);
            em.dispatch('ad_table.filter', [queryParams, url]);
        }

        function reset() {
            var formElements = $form[0].elements,
                element;

            for (var i = 0; i < formElements.length; i++) {
                element = formElements[i];

                if (_noResetElements.indexOf(element.name) === -1) {
                    element.value = '';
                    if (element.nodeName == 'SELECT') {
                        element.selectedIndex = 0;
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
                element;

            if (!params) {
                return;
            }

            for (var i = 0; i < formElements.length; i++) {
                element = formElements[i];

                if (params[element.name]) {
                    // todo Handel radio and select-multiple types.
                    if (element.type === 'checkbox') {
                        element.checked = true;
                    } else {
                        element.value = params[element.name];
                    }
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