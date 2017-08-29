/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 *  Validation elements for the Login, Username/Password reset sections.
 */
/* JSHint: */
/* globals jQuery: false */
;
(function(window, document, $, undefined) {
    'use strict';


    /**
     * CHANGE CONTACT DETAILS - Field validation rules
     */
    $(document).ready(function() {

      if ($('.mod-acc-info form#contactForm').length) {

        $('.mod-acc-info form#contactForm').each(function() {

          var $form = $(this);
          $form.validate({

            rules: {
              'personalDetailsVO.mobileNumber': {
                required: {
                  depends: function(element) {
                    var $mobile = $("input[name='personalDetailsVO.mobileNumber']").val();
                    var $work = $("input[name='personalDetailsVO.workPhoneNumber']").val();
                    var $home = $("input[name='personalDetailsVO.homePhoneNumber']").val();

                    if($mobile.length==0 && $work.length==0 && $home.length==0) {
                      return true;
                    }

                    return false;
                  }
                },
                validPhoneNumber: true,
                onKeyUpCheck: false
              },
              'myAirtricityDetailsVO.customerEmailAddress': {
                required: true,
                email: true
              },
              'personalDetailsVO.workPhoneNumber': {
                validPhoneNumber: true,
                onKeyUpCheck: false
              },
              'personalDetailsVO.homePhoneNumber': {
                validPhoneNumber: true,
                onKeyUpCheck: false
              }
            },

            messages: {
              'personalDetailsVO.mobileNumber': {
                required: 'At least one phone number must be supplied',
                validPhoneNumber: 'Please enter a valid phone number'
              },
              'myAirtricityDetailsVO.customerEmailAddress': {
                email: 'Please enter a valid email address',
              },
              'personalDetailsVO.workPhoneNumber': {
                validPhoneNumber: 'Please enter a valid phone number'
              },
              'personalDetailsVO.homePhoneNumber': {
                validPhoneNumber: 'Please enter a valid phone number'
              }
            },

            ////////////////////////////////////////////////////////////////////////////

            errorElement: 'p',
            errorClass: 'inline-error',
            validClass: 'valid',

            onkeyup: function(element) {
              var element_id = $(element).attr('name');
              if (typeof(this.settings.rules[element_id].onKeyUpCheck) != "undefined") {
                if (this.settings.rules[element_id].onkeyup !== false) {
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
        })

      }
    });


    /**
     * CHANGE EBILLING - Field validation rules
     */
    $(document).ready(function() {

      if ($('.mod-acc-info #eBillingPanel form').length) {

        $('.mod-acc-info #eBillingPanel form').validate({

          rules: {
            'electronicBillingDetailsVO.electronicBillingEmailAddress': {
              required: function(element) {
                return $('#eBillingPanel form input[name="electronicBillingDetailsVO.notificationOption"]:checked').val() !== 'postOnly';
              },
              email: true
            }
          },

          messages: {
            'electronicBillingDetailsVO.electronicBillingEmailAddress': {
              required: 'Please enter a valid email address',
              email: 'Please enter a valid email address'
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
      }
    });


    /**
     * CHANGE MARKETING - Field validation rules
     */
    $(document).ready(function() {

      if ($('.mod-acc-info #marketingDetails form').length) {

        $('.mod-acc-info #marketingDetails form').validate({

          rules: {
            'marketingInformationVO.marketingInformationSubscribed': {
              required: true
            }
          },

          messages: {
            'marketingInformationVO.marketingInformationSubscribed': {
              required: 'Please select an option'
            }
          },

          ////////////////////////////////////////////////////////////////////////////

          errorElement: 'p',
          errorClass: 'inline-error',
          validClass: 'valid',

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
      }
    });


    /**
     * CHANGE USERNAME - Field validation rules
     */
    $(document).ready(function() {

      if ($('.mod-acc-info form#username-form').length) {

        $('.mod-acc-info form#username-form').validate({

          rules: {
            'myAirtricityDetailsVO.username': {
              required: true,
              containsNoSpaces: true,
              rangelength: [6,60],
              notEqualTo: '#username-form #confirmPassword',
              containsOnlyWhiteListCharacters: true,
              onKeyUpCheck: false
            },
            'myAirtricityDetailsVO.usernamePassword': {
              required: true
            }
          },

          messages: {
            'myAirtricityDetailsVO.username': {
              required: 'Please enter a new username',
              containsNoSpaces: 'Must contain no spaces',
              rangelength: 'Must include between 6 & 60 characters',
              notEqualTo: 'Your username and password can\'t be the same',
              containsOnlyWhiteListCharacters: "Only these special characters are allowed: @ . , - _ /"
            },
            'myAirtricityDetailsVO.usernamePassword': {
              required: 'Please confirm your password'
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
      }
    });


    /**
     * CHANGE PASSWORD - Field validation rules
     */
    $(document).ready(function() {

      if ($('.mod-acc-info #passwordPanel form').length) {

        $('.mod-acc-info #passwordPanel form').each(function() {

          $(this).validate({
            rules: {
              'myAirtricityDetailsVO.currentPassword': {
                required: true,
                onKeyUpCheck: true
              },
              'myAirtricityDetailsVO.newPassword': {
                required: true,
                containsBothUpperLower: true,
                containsAtLeastOneDigit: true,
                containsNoSpaces: true,
                rangelength: [8,32],
                notEqualTo: '#passwordUsername',
                onKeyUpCheck: true
              },
              'myAirtricityDetailsVO.newPasswordConfirmation': {
                required: true,
                equalTo: '#newPassword',
                onKeyUpCheck: true
              }
            },

            messages: {
              'myAirtricityDetailsVO.currentPassword': {
                required: 'Please confirm your password'
              },
              'myAirtricityDetailsVO.newPassword': {
                required: 'Please enter a new password',
                containsBothUpperLower: 'Must contain both upper & lower case letters',
                containsAtLeastOneDigit: 'Must have at least one number',
                containsNoSpaces: 'Must contain no spaces',
                rangelength: 'Must include between 8 & 32 characters',
                notEqualTo: 'Please enter a password different to your username'
              },
              'myAirtricityDetailsVO.newPasswordConfirmation': {
                required: 'Please provide a password',
                equalTo: 'Your passwords don\'t match. Remember that passwords are case sensitive.'
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
        });
      }
    });


    /**
     * CHANGE BILLING ADDRESS - Field validation rules
     */
    $(document).ready(function() {

        var $validator;
        var requiredMessage = 'This is a required field';

        if ($('.mod-acc-info #billingPanel form').length) {

            // on change validation for any selects
            $('.mod-acc-info #billingPanel form select').change(function(e) {
              $validator.element($(this));
            })

            $('.mod-acc-info #billingPanel form').each(function() {

                // need to set the validator to not ignore hidden select fields
                $.validator.setDefaults({
                  ignore: ':hidden:not(.c-input-select:visible select)'
                });

                $validator = $($(this)).validate({

                    rules: {
                        'personalDetailsVO.customerAddress.addressLine1': {
                            required: true,
                            maxlength: 60
                        },
                        'personalDetailsVO.customerAddress.addressLine2': {
                            maxlength: 60
                        },
                        'personalDetailsVO.customerAddress.county': {
                            required: true
                        },
                        'personalDetailsVO.customerAddress.postCodeNew': {
                            required: {
                              depends: function(el) {
                                return $('.country-option.-ni').hasClass('-is-active') || $('#country').val() == "United_Kingdom"
                              }
                            },
                            postcodeFormat: {
                              depends: function(el) {
                                return $('.country-option.-ni').hasClass('-is-active') || $('#country').val() == "United_Kingdom"
                              }
                            },
                            maxlength: {
                              param: 10,
                              depends: function(el) {
                                return $('.country-option.-global').hasClass('-is-active')
                              }
                            }
                        },
                        'personalDetailsVO.customerAddress.countrySimple': {
                            required: true
                        }
                    },

                    messages: {
                        'personalDetailsVO.customerAddress.addressLine1': {
                            required: requiredMessage,
                            maxlength: 'Must be less than 60 characters'
                        },
                        'personalDetailsVO.customerAddress.addressLine2': {
                            maxlength: 'Must be less than 60 characters'
                        },
                        'personalDetailsVO.customerAddress.county': {
                            required: requiredMessage
                        },
                        'personalDetailsVO.customerAddress.postCodeNew': {
                            required: requiredMessage,
                            postcodeFormat: 'Please enter a valid postcode',
                            maxlength: 'Must be less than 10 characters'
                        },
                        'personalDetailsVO.customerAddress.countrySimple': {
                            required: requiredMessage
                        }
                    },

                    ////////////////////////////////////////////////////////////////////////////

                    errorElement: 'p',
                    errorClass: 'inline-error',
                    validClass: 'valid',

                    // onkeyup: function(element) {
                    //   var element_id = $(element).attr('name');
                    //   if (typeof(this.settings.rules[element_id].onKeyUpCheck) != "undefined") {
                    //     if (this.settings.rules[element_id].onKeyUpCheck !== false) {
                    //       $.validator.defaults.onkeyup.apply(this, arguments);
                    //     }
                    //   }
                    // },
                    onfocusout: function(element) {
                      $(element).valid();
                    },
                    submitHandler: function(form) {
                      $('form button.btn').attr('disabled', 'disabled');
                      form.submit();                                       
                    },

                    ////////////////////////////////////////////////////////////////////////////

                    errorPlacement: function(error, element) {
                        $(element).after(error);
                    },
                    highlight: function(element, errorClass, validClass) {
                        if ($(element).is('select')) {
                            $(element).parents('.c-input-select').addClass('error').removeClass(validClass);
                        } else {
                            $(element).parents('.form-field').addClass('error').removeClass(validClass);
                        }

                    },
                    unhighlight: function(element, errorClass, validClass) {
                        if ($(element).is('select')) {
                            $(element).parents('.c-input-select').removeClass('error').addClass(validClass);
                        } else {
                            $(element).parents('.form-field').removeClass('error').addClass(validClass);
                        }

                    }
                });


            });


        }
    });



})(this.window, this.document, jQuery);
