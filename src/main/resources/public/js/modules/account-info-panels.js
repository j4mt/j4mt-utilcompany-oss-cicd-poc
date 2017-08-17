/*

CHANGELOG
+ICH 25112015 - OSS09CR8: Checkbox for Customers with mobile meter reading reminders turned on (SVN:1079)

*/

(function(window, document, $, undefined) {
    'use strict';

  $(document).ready(function() {

    /**
     * setRowClasses
     * Set odd-row classes on odd rows.
     * Self executing function that just dies straight away if it's not needed.
     */
    (function( required ){

        if ( !required ) {
          return false;
        }

        if ($('.form-details').length) {
            if (!$('#moving-out').length) {
                $('.form-details div.row:even').addClass('odd-row');
            }
        }
        if ($('.form-stripe').length) {
            $('.form-stripe div.row:odd').addClass('odd-row');
        }
        if ($('table.stripe').length) {
            $('.module table.stripe tr:even td').addClass('odd-row');
        }
        if ($('table.stripe-only').length) {
            $('.module table.stripe-only tr:even td').addClass('odd-row');
        }

    }( $('#account-information').length > 0 ));


    /**
     * resetPanels
     * Reset any existing forms which are open
     */
    function resetAllPanels() {
        $('.form-details').slideUp();
        $('.display-details').slideDown();
        $('.change').show();
        $('.cancel-change').hide();
    }



    /**
     * revertToShortContactList
     */
    function revertToShortContactLists() {

      $('[data-grow-list]').each(function(){

        var
        $btn = $(this).find('.btn'),
        $kids = $(this).children('.row[style]');

        $kids.hide();
        $btn.css({'opacity': 1, 'cursor': 'pointer'});

      });

    }


    /**
     * doCancelFlashMsg
     * Show the cancel message for 5 seconds.
     */
    function doCancelFlashMsg() {
      ///
      var
      showDuration = 5 * 1000,
      $msgBox = $('.msg-flash.-cancelled');
      ///
      if ( $msgBox.length ) {
        $msgBox.addClass('-showing');
        setTimeout(function() {
          $msgBox.removeClass('-showing');
        }, showDuration);
      }
    }


    function hideAnyFlashMsgs() {
      $('.msg-flash').removeClass('-showing');
    }




    /**
     * Change buttons
     */
    if ( $('.change').length ) {

      $('.change').on('click', function() {
          var
          $btn = $(this),
          titleTop = 0,
          offsetBefore,
          offsetAfter;

          resetAllPanels();
          hideAnyFlashMsgs();
          revertToShortContactLists();

          // hide this forms display details and show our form and the appropriate actions
          if (!$(this).siblings('.display-details').hasClass('-no-hide')) {
            $(this).siblings('.display-details').slideUp(300);
          }
          $(this).siblings('.form-details').slideDown(300);
          $(this).hide().siblings('.cancel-change').show();
          $('.module').removeClass('open');
          $(this).parents('.module').addClass('open');

          titleTop = function() {
            return $btn.nextAll('h2').offset().top - 30;
          };

          offsetBefore = $btn.nextAll('h2').offset().top;

          window.setTimeout(function() {

            offsetAfter = $btn.nextAll('h2').offset().top;

            if (offsetBefore - offsetAfter > 400) {
              $('html, body').animate({
                scrollTop: titleTop()
              }, 300);
            }

          }, 400);

          return false;
      });

      $('.cancel a').on('click', function() {
          $(this).parents('.form-details').slideUp();
          $(this).parents().siblings('.display-details').slideDown();
          $(this).parents().siblings('.change').show();
          $(this).parents().siblings('.cancel-change').hide();
          $(this).parents('.module').removeClass('open');

          doCancelFlashMsg();

          return false;
      });

      $('.cancel-change').on('click', function() {
          $(this).siblings('.form-details').slideUp();
          $(this).siblings('.display-details').slideDown();
          $(this).hide();
          $(this).siblings('.change').show();
          $(this).parents('.module').removeClass('open');

          doCancelFlashMsg();

          return false;
      });

      if ($('.open').length) {
          $('.open').children('.module-content').children('.display-details').hide();
          $('.open').children('.module-content').children('.form-details').show();
      }

      // +ICH 25112015 - OSS09CR8: Checkbox for Customers with mobile meter reading reminders turned on
      // $('#personalSave .change').click(function() {
      if($('input#meterSMSYes:checked', 'form[name=meterReadReminder]').val() == 'true') {
          $('.mobileSmsAlertNumber_container').show();
      }
      // });

      $('#change-my-details .change').click(function() {
          $('#security-warning').show();
      });
      $('#change-my-details .cancel-change').click(function() {
          $('#security-warning').hide();
      });
      $('#change-my-details .cancel a').click(function() {
          $('#security-warning').hide();
      });


      $('#billing-notification .change').click(function() {
          $('#billing-text').hide();
      });
      $('#billing-notification .cancel-change').click(function() {
          $('#billing-text').show();
      });
      $('#billing-notification .cancel a').click(function() {
          $('#billing-text').show();
      });


      if ($('#BillingNotNo').is(':checked')) {
          $('#billNotEmailRow').hide();
      }
      $('#BillingNotNo').click(function() {
          $('#billNotEmailRow').slideUp();
      });
      $('#BillingNotYes').click(function() {
          $('#billNotEmailRow').slideDown();
      });


      if ($('#eBillingNo').is(':checked')) {
          $('#eBillingEmailRow').hide();
      }
      $('#eBillingNo').click(function() {
          $('#eBillingEmailRow').slideUp();
      });
      $('#eBillingYes').click(function() {
          $('#eBillingEmailRow').slideDown();
      });


      if ($('#meterSMSNo').is(':checked')) {
          $('#meterSMSRow').hide();
      }
      $('#meterSMSNo').click(function() {
          $('#meterSMSRow').slideUp();
      });
      $('#meterSMSYes').click(function() {
          $('#meterSMSRow').slideDown();
      });


      if ($('#meterEmailNo').is(':checked')) {
          $('#meterEmailRow').hide();
      }
      $('#meterEmailNo').click(function() {
          $('#meterEmailRow').slideUp();
      });
      $('#meterEmailYes').click(function() {
          $('#meterEmailRow').slideDown();
      });


      if ($('#marketingNo').is(':checked')) {
          $('#marketing-contact').hide();
      }
      $('#marketingNo').click(function() {
          $('#marketing-contact').slideUp();
      });
      $('#marketingYes').click(function() {
          $('#marketing-contact').slideDown();
      });


      if ($('#marketingByPost').is(':checked')) {
          $('#marketingEmailRow').hide();
      }
      $('#marketingByPost').click(function() {
          $('#marketingEmailRow').slideUp();
      });
      $('#marketingByEmail').click(function() {
          $('#marketingEmailRow').slideDown();
      });

    }


 });


})(window, document, jQuery);
