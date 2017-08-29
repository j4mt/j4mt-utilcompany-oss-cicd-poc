
/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 *  Validation elements for the Login, Username/Password reset sections on multi-account.
 */

/* JSHint: */
/* globals jQuery: false */

;(function(window, document, $, undefined) {
  'use strict';

  $(document).ready(function() {

    // Field validation rules
    $('.mod-auth-reset-multi form').validate({

      rules: {
        accountNumber: {
          required: function(element) { //Only required if other item empty...
            return $("#mprnGprn").val().length === 0;
          },
          number: true,
          rangelength: [6,7],
          onlyOneHasValue: [$('#mprnGprn'),$('#accountNumber')] //...but can't have both either.
        },
        mprnGprn: {
          required: function(element) { //Only required if other item empty...
            return $("#accountNumber").val().length === 0;
          },
          // number: true, //
          // rangelength: [6,7],
          onlyOneHasValue: [$('#mprnGprn'), $('#accountNumber')] //...but can't have both either.
        }
      },

      messages: {
        accountNumber: {
          required: 'Please enter either an account number or an MPRN/GPRN.',
          number: 'Please enter a number between 6 and 7 digits long.',
          rangelength: 'Please enter a number between 6 and 7 digits long.',
          onlyOneHasValue: 'Please enter only an account number or an MPRN/GPRN'
        },
        mprnGprn: {
          required: 'Please enter either an account number or an MPRN/GPRN.',
          // number: 'Please enter a number.',
          // rangelength: 'Please enter a number between 6 and 7 digits long.',
          onlyOneHasValue: 'Please enter only an account number or an MPRN/GPRN'
        }
      },

      ////////////////////////////////////////////////////////////////////////////

      errorElement: 'p',
      errorClass: 'inline-error',
      validClass: 'valid',

      onkeyup: function(element) {
        var element_id = $(element).attr('name');
        if (typeof(this.settings.rules[element_id].onKeyUpCheck) != "undefined") {
          if (this.settings.rules[element_id].onKeyUpCheck !== false) {
            $.validator.defaults.onkeyup.apply(this, arguments);
          }
        }
      },
      onfocusout: function(element) {
        // var value = $(element).val();
        // if(value.length > 0) {
          $('.mod-auth-reset-multi form').valid();
        // }
      },
      onsubmit: true,

      ////////////////////////////////////////////////////////////////////////////

      errorPlacement: function(error, element) {
        $(element).after(error);
      },

      highlight: function(element, errorClass, validClass) {
        $(element).parents('.form-field').addClass('error').removeClass(validClass);
      },

      unhighlight: function(element, errorClass, validClass) {
        $(element).parents('.form-field').removeClass('error').addClass(validClass);
      }
    });


    // Focus on first field form onLoad
    if($('.mod-auth-reset').length > 0){
      // put focus on the first text/email/password field
      var focusField = $('.mod-auth-reset form').find('input[type=text],input[type=email],input[type=password]').filter(':visible:first');
      focusField.focus().setCursorToTextEnd();

      // validate field contents if prepopulated
      var initValue = focusField.val();
      if(initValue.length) {
        focusField.trigger('keyup');
      }
    }
  });

})(this.window, this.document, jQuery);
