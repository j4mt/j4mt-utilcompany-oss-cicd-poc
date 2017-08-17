/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 *  Validation elements for Account Information page
 */

/* JSHint: */
/* globals jQuery: false */

;(function(window, document, $, undefined) {
  'use strict';

  //Hidden elements don't get validated unless they have .validate-hidden
  $.validator.setDefaults({
    ignore: ':hidden:not(.validate-hidden)'
  });


  /**
   * Validation for additional contacts
   *
   * There are some dynamic elements in this form that get additional
   * validation elements added to them in 'additional-contacts.js'
   */
  $(document).ready(function() {

    if ($('#saveAdditionalContacts').length) {

      $('#saveAdditionalContacts').validate({
        rules: {
          // 'contactFirstName0': {},
          'contactChkAuth0': {
            requiredIfNameNotEmpty: true
          }
        },
        messages: {
          // 'contactFirstName0': {},
          'contactChkAuth0': {
            requiredIfNameNotEmpty: 'Please check the box to authorise this person to contact our customer service agents on your behalf.'
          }
        },

        ///////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////

        errorPlacement: function(error, element) {
          $(element).after(error);
        },
        highlight: function(element, errorClass, validClass) {
          $(element).closest('.row').addClass('-error');
        },
        unhighlight: function(element, errorClass, validClass) {
          $(element).closest('.row').removeClass('-error');
        }
      });
    }
  });



  /**
   * Validation for billing address details
   */
  $(document).ready(function() {

    if ($('#saveBillingAddressDetails').length) {

      $('#saveBillingAddressDetails').validate({
        rules: {
          'personalDetailsVO.customerAddress.addressLine1': {
            required: true
          },
          'personalDetailsVO.customerAddress.countrySimple': {
            required: true
          },
          'personalDetailsVO.customerAddress.county': {
            //Because SumoSelect. Only validate if row visible (already forcing validation on hidden select)
            required: function(el){
              return ($('#country').val() == "Republic_of_Ireland" || $('#country').val() == "Northern_Ireland")
            }
          },
          'personalDetailsVO.customerAddress.postCodeNew': {
            required: true,
            postcodeFormat: true
          }
        },
        messages: {
          'personalDetailsVO.customerAddress.addressLine1': {
            required: 'Please enter the first line of your address.'
          },
          'personalDetailsVO.customerAddress.countrySimple': {
            required: 'Please select a country'
          },
          'personalDetailsVO.customerAddress.county': {
            required: 'Please select a county.'
          },
          'personalDetailsVO.customerAddress.postCodeNew': {
            required: 'Please select a postcode.',
            postcodeFormat: 'This doesn\'t look right. Please check and try again.'
          }
        },

        ///////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////

        errorPlacement: function(error, element) {

          if (element[0].type === 'text'){
            //Double input row
            if ($(element).parent().hasClass('double-up')) {
              $(element).parent().append(error);
            //Normal input row
            } else {
              $(element).after(error);
            }
          }

          if ($(element).find('option').length) {
            $(element).closest('.row').append(error);
          }

        },
        highlight: function(element, errorClass, validClass) {
          $(element).closest('.row').addClass('-error');
        },
        unhighlight: function(element, errorClass, validClass) {
          $(element).closest('.row').removeClass('-error');
        }
      });
    }
  });



  /**
   * Validation for Phone number section
   */
  $(document).ready(function() {

    if ($('form[name="savePersonalDetails"]').length) {

      $('form[name="savePersonalDetails"]').validate({
        rules: {
          'personalDetailsVO.mobileNumber': {
            // requiredIfNoOtherPhoneNumbers: true,
            requiredIfSMSAlertChecked: true
          }
        },
        messages: {
          'personalDetailsVO.mobileNumber': {
            // requiredIfNoOtherPhoneNumbers: 'Please provide a mobile phone number.',
            requiredIfSMSAlertChecked: 'A mobile phone number is required for SMS reminders.'
          }
        },
        errorPlacement: function(error, element) {
          $(element).after(error);
        },
        highlight: function(element, errorClass, validClass) {
          $(element).closest('.row').addClass('-error');
        },
        unhighlight: function(element, errorClass, validClass) {
          $(element).closest('.row').removeClass('-error');
        }

      });
    }
  });



  /**
   * Validation for Password section
   */
  $(document).ready(function() {

    if ($('#account-information #password-form').length) {
      /* A bit of cheeky styling via js, this will remove the need to add classes to each radio button*/
      //$(':radio').addClass('radio-input'); ie8 is not liking this.
      $('#password-form').validate({
        rules: {
          newPassword: {
            required: true,
            minlength: 4
          },
          newPasswordConfirmation: {
            required: true,
            minlength: 4,
            equalTo: '#newPassword'
          }
        },
        messages: {
          newPassword: {
            required: 'Please provide a password',
            minlength: 'Your password must be at least 4 characters long'
          },
          newPasswordConfirmation: {
            required: 'Please provide a password',
            minlength: 'Your confirmation password must be at least 4 characters long',
            equalTo: 'Your passwords don\'t match. Remember that passwords are case sensitive.'
          }
        },

        ///////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////

        errorPlacement: function(error, element) {
          error.prependTo(element.parent('.row').next('.submit'));
        },
        highlight: function(element, errorClass, validClass) {
          $(element).closest('.form-details').addClass('error');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-details').removeClass('error');
          }
          // ,
          // showErrors: function(errorMap, errorList) {
          // if (this.numberOfInvalids() === 0) {
          //     $('.error-row-description-inline').hide();
          // }
          // this.defaultShowErrors();
          // }
      });
    }
  });

})(this.window, this.document, jQuery);
