
/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 *  This is to help show users that a download is being generated
 *  in the case that a large XLS or something needs to be created.
 *
 *  Once a download link has been triggered it should show a loader
 *  or message of some sort, then this should poll every 500ms or
 *  so to check if a cookie has arrived from the downloadable file.
 *
 *  When cookie is found, remove the load state and assume it's downloading.
 */

;(function(window, document, $, undefined) {

  'use strict';

  $(document).ready(function() {

    var $downloadLinks = $('[data-has-wait-state]');
    var interval;
    var cookieHunter;
    var cookieName;
    var bttnTxt;
    var waitTxt;


    /**
     * For each download button that exists in the document:
     * Save the text from the button, listen for clicks.
     * On click, check if it's already in a wait state,
     * if it is then do nothing, otherwise add a class
     * and update the text, and start a loop that will keep
     * looking for a cookie until it arrives with the DL file.
     *
     * @param  {[type]} ){ bttnTxt    [description]
     * @param  {[type]} ){ cookieName [description]
     * @param  {[type]} 250);}); }    [description]
     * @return {[type]}               [description]
     */
    $downloadLinks.each(function(){
      bttnTxt = $(this).html();
      waitTxt = $(this).data('has-wait-state').length ? $(this).data('has-wait-state') : 'Please wait';
      cookieName = $(this).data('cookie-id');

      $(this).on('click', function(e) {
        if ($(this).hasClass('js-please-wait')) {
          return false;
        }

        $(this)
          .addClass('js-please-wait')
            .html(waitTxt + '<i></i>');

        interval = setInterval(cookieHunter.bind(window, {elmnt: this, txt: bttnTxt, cookieName: cookieName}), 250);

      });

    });

    /**
     * cookieHunter
     *
     * Checks for the download cookie every Xms and resets the button once
     * it has been detected. Removes the cookie afterwards and stops the
     * interval ticker.
     *
     * @param  {[type]} button - object with button details from where
     * download was called.
     */
    cookieHunter = function(button) {

      if($.cookie(button.cookieName)){

        //Reset the button back to how it was before.
        $(button.elmnt)
          .removeClass('js-please-wait')
            .html(button.txt);

        //Remove Cookie.
        $.cookie(button.cookieName, null);

        //Stop looping.
        clearInterval(interval);

      }

    };

  });

})(this.window, this.document, jQuery);

