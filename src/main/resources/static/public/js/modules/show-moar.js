
/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 * Expanding list.
 *
 * Initially required for 'additional contacts' section.
 *
 * If there are more than 5 items in the list then we
 * need to show the next 5 each time the button is
 * clicked.
 *
 * If all are visible then the button should hide.
 *
 */

;(function(window, document, $, undefined) {
  'use strict';

  $(document).ready(function() {

    $('[data-grow-list]').each(function(){

      var
      $btn = $(this).find('.btn'),
      $kids = $(this).children('.row'),
      amount = typeof $(this).data('grow-list') === 'number' ? $(this).data('grow-list') : 5,
      cnt,
      $invisibleKids,
      intrvl,
      i,
      intrvlDelay = 25,
      ieDelay = (window.sseIEVersion === 8 || window.sseIEVersion === 9) ? 500 : 0;


      $btn.on('click', function(e) {
        e.preventDefault();

        $invisibleKids = $kids.filter(":not(:visible)");

        //If there's less than 5 left then just loop that amount of times.
        cnt = $invisibleKids.length >= amount ? amount : $invisibleKids.length;
        i = 0;

        /**
         * Purely for visual effect. Fade each new item
         * in one at a time instead of having them all
         * appear at once.
         */
        intrvl = setInterval(function(){
          $invisibleKids.eq(i).fadeIn(500);

          if (i++ === cnt - 1) {
            clearInterval(intrvl);
          }

        }, intrvlDelay);


        /**
         * After the last of the items have been shown,
         * wait until they're fully visible and then
         * fade the button opacity down. Don't hide it
         * because then it causes an ugly jump when it
         * leaves the flow.
         */
        setTimeout(function() {
          if ($kids.filter(":not(:visible)").length === 0) {
            $btn.css({'opacity': '0', 'cursor': 'default'});

            //IE
            if( window.sseIEVersion === 8 ){
              $btn.css({'-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)', 'cursor': 'default'});
            }
          }
        }, intrvlDelay * cnt + intrvlDelay + ieDelay);//Rhythm 'n ting

      });

    });

  });

})(this.window, this.document, jQuery);

