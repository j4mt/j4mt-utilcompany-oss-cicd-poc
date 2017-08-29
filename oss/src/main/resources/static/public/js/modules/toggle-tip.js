
/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/* JSHint: */
/* globals jQuery: false */


;(function(window, document, $, undefined) {

  'use strict';

  $(document).ready(function() {


        var
        $toggleTips = $('.toggle-tip'),
        $trigger,
        $tip,
        $content,
        naturalHeight;


        $toggleTips.each(function () {

          $tip = $(this);
          $trigger = $tip.children('a');
          $content = $trigger.next();
          naturalHeight = $content.children().height() + 15;

          $trigger.on('click', function(e) {
            e.preventDefault();
            /* Act on the event */

            if ($trigger.parent().hasClass('js-expanded')) {

              hide( $tip, $content );

            } else {

              show( $tip, $content, naturalHeight );

            }

          });

        });


        function hide( $tip, $ct ){
          $tip.removeClass('js-expanded');
          $ct.css('height', 0);
        }


        function show( $tip, $ct, nh ){
          $tip.addClass('js-expanded');
          $ct.css('height', nh);
        }

  });

})(this.window, this.document, jQuery);

