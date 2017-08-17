
/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 *  Validation elements for the Login, Username/Password reset sections.
 */

/* JSHint: */
/* globals jQuery: false */


;(function(window, document, $, undefined) {
  'use strict';

  // console.info( 'Validation JS initialising...' );

  $(document).ready(function() {

    $('.mod-login-box form').validate({

      rules: {
        emailAddress: {
          required: true,
          email: true
        },
        newUsername: {
          matchThisField: '#newUsernameConfirm',
          required: true
        },
        newUsernameConfirm: {
          matchThisField: '#newUsername',
          required: true
        },
        newPassword: {
          matchThisField: '#newPasswordConfirm',
          required: true
        },
        newPasswordConfirm: {
          matchThisField: '#newPassword',
          required: true
        }
      },

      messages: {
        emailAddress: {
          required: 'A valid email address is required',
          email: 'A valid email address is required'
        },
        newUsername: {
          matchThisField: 'Sorry, those usernames don\'t match. Remember, your username is Case Sensitive. Please try again.',
          required: 'Sorry, those usernames don\'t match. Remember, your username is Case Sensitive. Please try again.'
        },
        newUsernameConfirm: {
          matchThisField: 'Sorry, those usernames don\'t match. Remember, your username is Case Sensitive. Please try again.',
          required: 'Please enter a new username into both fields'
        },
        newPassword: {
          matchThisField: 'Sorry, those passwords don\'t match. Remember, your password is Case Sensitive. Please try again.',
          required: 'Sorry, those passwords don\'t match. Remember, your password is Case Sensitive. Please try again.'
        },
        newPasswordConfirm: {
          matchThisField: 'Sorry, those passwords don\'t match. Remember, your password is Case Sensitive. Please try again.',
          required: 'Please enter a new password into both fields'
        }

      },

      ////////////////////////////////////////////////////////////////////////////

      errorElement: 'div',
      errorClass: 'msg -error',
      highlight: false,
      unhighlight: false,

      //Only validate these when user clicks submit.

      onfocusout: false,
      onkeyup: false,

      ////////////////////////////////////////////////////////////////////////////

      errorPlacement: function(error, element) {
          $('.msg.-error').remove();
          error.insertBefore($(element).closest('form'));
      }

    });

  });

})(this.window, this.document, jQuery);

