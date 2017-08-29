$(document).ready(function() {
  'use strict';



  /**
   * setUpInputEvents
   * Add listeners to the elements that need to show passwords when they change
   */
  (function setUpInputEvents() {

    var $inputs = $('.js-change-requires-pw');

    $inputs.each(function(index, el) {
      $(this).on('keydown', function() {
        $(this).parent().next('.password').show();
      });
    });

    return $inputs.length;

  }());





  /**
   * focusNextOnEnterKey
   *
   * Requirement to shift focus to next form item on enter
   */
  (function focusNextOnEnterKey() {

    var
    $inputs = $('.form-details input[type=text], .form-details .SumoSelect p'),
    $nextEl;

    $inputs.each(function(i, el) {

      $(this).on('keydown', function(e) {

        if((e.keyCode ? e.keyCode : e.which) === 13) { //Enter keycode

          //If there's another text input in this row, select that
          if ($(this).nextAll('[type=text]').length) {
            $(this).nextAll('[type=text]').select();
            return false;
          }

          $nextEl = $(this).closest('.row').next().find('input[type=text], .SumoSelect p').first();

          if ($nextEl.hasClass('SlectBox')) {
            $nextEl.click().focus();
          } else {
            $nextEl.select();
          }

          return false;
        }

      });

    });

  }());






  /**
   * billingAddressUi
   *
   * Needs to hide county unless country is NI or ROI
   * Needs to hide Eircode until it's available, but
   * code it up to show for ROI when we need it to
   */
  (function billingAddressUi() {

    //Config option - setting this to true enables Eircode for testing
    var useEircode = false;

    var $form = $('#saveBillingAddressDetails .form-details');

    //County input and row
    var $countyInp = $form.find('#county');
    var $countyRow = $countyInp.closest('.row');

    // Country input and row
    var $countryInp = $form.find('#country');
    var $countryRow = $countryInp.closest('.row');

    // Postcode input and row
    var $postcodeInp = $form.find('#postcode');
    var $postcodeRow = $postcodeInp.closest('.row');

    // Hide county by default if it doesn't have show class
    if (!$countyRow.hasClass('js-show')) {
      $countyRow.hide();
    }

    // Hide postcode by default if it doesn't have show class
    if (!$postcodeRow.hasClass('js-show')) {
      $postcodeRow.hide();
    }

    // Can't use :visible because it's all hidden on page load.
    // [style can detect which ones have been hidden by JS inline styles]
    reStripe($form.find('.row:not(.submit):not([style])'));

    // Set up triggers for showing and hiding things
    showHideRows($countryInp, $countyRow, ['Republic_of_Ireland','Northern_Ireland']);

    if (useEircode) {
      showHideRows($countryInp, $postcodeRow, ['United_Kingdom','Northern_Ireland','Republic_of_Ireland']);
    } else {
      showHideRows($countryInp, $postcodeRow, ['United_Kingdom','Northern_Ireland']);
    }

    // Way overcomplicated way to change label depending on value of select
    replaceLabel($countryInp, $postcodeRow.find('label'), ['Republic_of_Ireland'], 'Eircode:', 'Postcode:');

    // We need to show 26/6 counties depending on ROI/NI
    filterCounties($countryInp, ['Republic_of_Ireland']);

    /**
     * showHideRows
     *
     * Pass in the element that should trigger a show/hide, the element it should
     * show/hide, and the values of what should make it show. Otherwise it will hide.
     *
     * @param  {jQuery Element} trigger        The element that will trigger change (eg <select>)
     * @param  {jQuery Element} rowToShowHide  The row to show if trigger has a value in triggerVal
     * @param  {Array}          triggerVal     The values that trigger has to match to show row
     */
    function showHideRows($trigger, $rowToShowHide, triggerVal) {

      $trigger.on('change', function() {

        var val = $(this).val() || '';

        if ( triggerVal.indexOf(val) > -1 ) {
          $rowToShowHide.show();
          // Can use :visible now because form is visible.
          reStripe($form.find('.row:not(.submit):visible'));
        } else {
          $rowToShowHide.hide();
          // Can use :visible now because form is visible.
          reStripe($form.find('.row:not(.submit):visible'));
        }

      });
    }

    /**
     * Used to swap between Postcode and Eircode on the postcode label, as Eircode will
     * just be using postcode in the background and just use a different label.
     * This was the requirement from SSE, but may need to be revised is Eircode has
     * special validation later on...
     *
     * @param  {jQuery} trigger        The element that will trigger change (eg <select>)
     * @param  {jQuery} $label         The label that we want to change content of
     * @param  {Array}  triggerVal     The values that trigger has to match
     * @param  {string} onTxt          If the dropdown's selected value is in this triggerVal, then set label to this
     * @param  {string} offTxt         ...else set label to this
     */
    function replaceLabel($trigger, $label, triggerVal, onTxt, offTxt){

      $trigger.on('change', function() {

        var val = $(this).val() || '';

        if ( triggerVal.indexOf(val) > -1 ) {
          $label.html(onTxt);
        } else {
          $label.html(offTxt);
        }

      });
    }

    /**
     * Show the correct counties for NI/ROI, because they use the same <select>
     *
     * @param  {[type]} $trigger   [description]
     * @param  {[type]} triggerVal [description]
     * @return {[type]}            [description]
     */
    function filterCounties($trigger, triggerVal){

      var NI = ['ANTRIM','ARMAGH','DERRY','DOWN','FERMANAGH','TYRONE'];

      $trigger.on('change', function() {
        var val = $(this).val() || '';

        //If Republic of Ireland
        if ( triggerVal.indexOf(val) > -1 ) {

          //If county is in NI, hide it and show others (always show first option)
          $('#county').find('option').each(function() {
            if (NI.indexOf(this.value) !== -1 && this.index > 0) {
              $(this).parent()[0].sumo.disableItem(this.index);
            } else {
              $(this).parent()[0].sumo.enableItem(this.index);
            }

          });

        } else {//If NOT Republic of Ireland

          //If county is in NI, show it and hide others
          $('#county').find('option').each(function() {
            if (NI.indexOf(this.value) === -1 && this.index > 0) {
              $(this).parent()[0].sumo.disableItem(this.index);
            } else {
              $(this).parent()[0].sumo.enableItem(this.index);
            }
          });

        }

      });
    }


    /**
     * reStripe
     * How the zebra got his stripes...
     *
     * @param  {jQuery collection} $rows - the rows that need to get striped.
     */
    function reStripe($rows) {
      $rows.removeClass('odd-row');
      $rows.each(function(i, e) {
        if ((i + 1) % 2) {
          $(e).addClass('odd-row');
        }
      });
    }

  }());












  /**
   * handleFormErrors
   *
   */
  (function handleFormErrors() {

    var ErrorMsgHandler = function() {};

    window.formErrors = new ErrorMsgHandler();

    var form = {

      username: {
        name: {
          row: $('#username-form .row.username'),
          err: $('#username-form .row.username .msg-error')
        },
        password: {
          row: $('#username-form .row.password'),
          err: $('#username-form .row.password .msg-error')
        }
      },

      email: {
        name: {
          row: $('#email-form .row.email'),
          err: $('#email-form .row.email .msg-error')
        },
        password: {
          row: $('#email-form .row.password'),
          err: $('#email-form .row.password .msg-error')
        }
      },

      password: {
        current: {
          row: $('#currentPasswordRow'),
          err: $('#currentPasswordRow  .msg-error')
        },
        updated: {
          rows: $('#newPasswordRow, #newConfirmPasswordRow'),
          err: $('#newConfirmPasswordRow  .msg-error')
        }
      }

    };


    function makeItShow( $row ) {
      if ( ! $row.is(':visible')){ $row.show(); }
      if ( ! $row.closest('.module').hasClass('open') ) { $row.closest('.module').find('a.change').click(); }
    }



  /**
   *
   * Showing
   *
   * These functions are exposed as formErrors.showUsernameError etc,
   * where you can call formErrors.showUsernameError('Yurt') to highlight
   * the username section as an error and set Yurt as the error message
   */

    // Username
    // Edit username section of account info page

    ErrorMsgHandler.prototype.showUsernameError = function (errorMsg) {
      form.username.name.row.addClass('-error');
      form.username.name.err.html(errorMsg);

      var $row = form.username.name.row;

      makeItShow( $row );
    };

    ErrorMsgHandler.prototype.showUsernamePasswordError = function (errorMsg) {
      form.username.password.row.addClass('-error');
      form.username.password.err.html(errorMsg);

      var $row = form.username.password.row;

      makeItShow( $row );
    };

    // Email //

    ErrorMsgHandler.prototype.showEmailError = function (errorMsg) {
      form.email.name.row.addClass('-error');
      form.email.name.err.html(errorMsg);

      var $row = form.email.name.row;

      makeItShow( $row ); //Sean Connery Star Trek voice...
    };

    ErrorMsgHandler.prototype.showEmailPasswordError = function (errorMsg) {
      form.email.password.row.addClass('-error');
      form.email.password.err.html(errorMsg);

      var $row = form.email.password.row;

      makeItShow( $row ); //Sean Connery Star Trek voice...
    };

    // Password //

    ErrorMsgHandler.prototype.showCurrentPasswordError = function (errorMsg) {
      form.password.current.row.addClass('-error');
      form.password.current.err.html(errorMsg);
    };

    ErrorMsgHandler.prototype.showUpdatedPasswordError = function (errorMsg) {
      form.password.updated.rows.addClass('-error');
      form.password.updated.err.html(errorMsg);
    };


  /**
   *
   * Hiding
   *
   * These functions are exposed as formErrors.showUsernameError etc,
   * where you can call formErrors.showUsernameError('Yurt') to highlight
   * the username section as an error and set Yurt as the error message
   */

    ErrorMsgHandler.prototype.hideAllErrors = function () {
      return $('.row.-error').removeClass('-error');
    };


    ErrorMsgHandler.prototype.hideUsernameError = function () {
      form.username.name.row.removeClass('-error');
      form.username.name.err.html('');
    };

    ErrorMsgHandler.prototype.hideUsernamePasswordError = function () {
      form.username.password.row.removeClass('-error');
      form.username.password.err.html('');
    };

    // Email //

    ErrorMsgHandler.prototype.hideEmailError = function () {
      form.email.name.row.removeClass('-error');
      form.email.name.err.html('');
    };

    ErrorMsgHandler.prototype.hideEmailPasswordError = function () {
      form.email.password.row.removeClass('-error');
      form.email.password.err.html('');
    };

    // Password //

    ErrorMsgHandler.prototype.hideCurrentPasswordError = function () {
      form.password.current.row.removeClass('-error');
      form.password.current.err.html('');
    };

    ErrorMsgHandler.prototype.hideUpdatedPasswordError = function () {
      form.password.updated.rows.removeClass('-error');
      form.password.updated.err.html('');
    };

  }());

});
