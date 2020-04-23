/*!
 * (c) 2020 Artur Doruch <arturdoruch@interia.pl>
 */

define({
    /**
     * Attaches sliding content event.
     * The event trigger element must have defined "data-slide-content" attribute with
     * value as id attribute of the sliding element.
     *
     * Example of HTML code:
     *   <button class="trigger-button" data-slide-content="content-1">Slide</button>
     *   <div id="content-1">
     *       <pre>Long text.
     *       </pre>
     *   </div>
     */
    attachSlideContentEvent: function () {
        var triggers = document.querySelectorAll('*[data-slide-content]'),
            trigger,
            prevContentElementId;

        for (var i = 0; i < triggers.length; i++) {
            trigger = triggers[i];
            // Hide content element by double click.
            document.querySelector('#' + trigger.dataset.slideContent).ondblclick = function () {
                $(this).slideUp();
            };

            trigger.onclick = function() {
                var contentElementId = '#' + this.dataset.slideContent;

                $(contentElementId).slideToggle();

                if (prevContentElementId && prevContentElementId !== contentElementId) {
                    $(prevContentElementId).slideUp();
                }

                prevContentElementId = contentElementId;
            };
        }
    },
});