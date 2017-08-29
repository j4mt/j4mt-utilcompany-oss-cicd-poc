
/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 *  Validation elements for the Login, Username/Password reset sections.
 */

/* JSHint: */
/* globals jQuery: false */


;(function(window, document, $, undefined) {
  'use strict';


  $(document).ready(function() {


    // Field validation rules
    $('.mod-auth-reset form').validate({

      rules: {
        j_username: {
          required: true
        },
        j_password: {
          required: true
        },
        emailAddress: {
          required: true,
          email: true
        },
        username: {
          required: true,
          containsNoSpaces: true,
          rangelength: [6,60],
          notEqualTo: '#password',
          containsOnlyWhiteListCharacters: true,
          onKeyUpCheck: false
        },
        password: {
          required: true,
          containsBothUpperLower: true,
          containsAtLeastOneDigit: true,
          containsNoSpaces: true,
          rangelength: [8,32],
          notEqualTo: '#username'
        },
        confirmPassword: {
          matchThisField: '#password',
          required: true,
          onKeyUpCheck: false
        },
        accountNumber: {
          required: true,
          number: true,
          rangelength: [6,7]
        },
        phoneNumber: {
          required: true,
          number: true,
          minlength: 4,
          maxlength: 4
        }
      },

      messages: {
        j_username: {
          required: 'Please enter your My SSE Airtricity username'
        },
        j_password: {
          required: 'Please enter your My SSE Airtricity password'
        },
        emailAddress: {
          required: 'Please enter a valid email address',
          email: 'Please enter a valid email address'
        },
        username: {
          required: 'Please enter a new username',
          containsNoSpaces: 'Must contain no spaces',
          rangelength: 'Must include between 6 & 60 characters',
          notEqualTo: 'Your username and password can\'t be the same',
          containsOnlyWhiteListCharacters: "Only these special characters are allowed: @ . , - _ /"
        },
        password: {
          required: 'Please enter a new password',
          containsBothUpperLower: 'Must contain both upper & lower case letters',
          containsAtLeastOneDigit: 'Must have at least one number',
          containsNoSpaces: 'Must contain no spaces',
          rangelength: 'Must include between 8 & 32 characters',
          notEqualTo: 'Please enter a password different to your username'
        },
        confirmPassword: {
          matchThisField: 'Passwords do not match',
          required: 'Please confirm your new password'
        },
        accountNumber: {
          required: 'Please enter a number between 6 and 7 digits long.',
          number: 'Please enter a number between 6 and 7 digits long.',
          rangelength: 'Please enter a number between 6 and 7 digits long.'
        },
        phoneNumber: {
          required: 'Please use exactly 4 digits. You can use any of the numbers you gave us when signing up to our service.',
          number: 'Please use exactly 4 digits. You can use any of the numbers you gave us when signing up to our service.',
          minlength: 'Please use exactly 4 digits. You can use any of the numbers you gave us when signing up to our service.',
          maxlength: 'Please use exactly 4 digits. You can use any of the numbers you gave us when signing up to our service.'
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
        var value = $(element).val();
        if(value.length > 0) {
          $(element).valid();
        }
      },
      onsubmit: true,
      submitHandler: function(form){
        $('form button.btn').attr('disabled', 'disabled');
        form.submit();
      },

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
