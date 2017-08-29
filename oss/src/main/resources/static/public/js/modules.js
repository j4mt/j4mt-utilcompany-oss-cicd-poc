// /**
//  * Initialise Application
//  */
//
(function(window, document, $, undefined) {
  'use strict';

  function Application(settings) {
    var self = this;
    self.settings = settings;

    var isOldIE = $('html').hasClass('ie8') || $('html').hasClass('ie9');


    if (settings.logging === false ) {

      window.console = function() {
        // nothing to see here, carry on
      };

      window.console.log = function(msg) {
        // nothing to see here, carry on
      };

      window.console.groupCollapsed = function(msg) {
        // nothing to see here, carry on
      };

      window.console.group = function(msg) {
        // nothing to see here, carry on
      };

      window.console.groupEnd = function(msg) {
        // nothing to see here, carry on
      };

      window.console.info = function(msg) {
        // nothing to see here, carry on
      };

      window.console.error = function(msg) {
        // nothing to see here, carry on
      };

    }
    // if logging is turend on but we're using old IE
    else if(isOldIE) {
      window.console.groupCollapsed = function(msg) {
        console.log(msg);
      };

      window.console.group = function(msg) {
        console.log(msg);
      };

      window.console.groupEnd = function(msg) {
        console.log(msg);
      };

      window.console.info = function(msg) {
        console.log(msg);
      };

      window.console.error = function(msg) {
        console.log(msg);
      };
    }


    self.ui = {
        components: {},
        modules: {},
        validation: {},
    };

    self.device = {
        detection: {}
    };
  }



  window.app = new Application({
    debug: true,
    logging: true
  });

})(this.window, this.document, jQuery);

;
/**
 *  SSE Airtricity OSU - Responsive 2015/2016
 *  Author: Each&Other
 *  Module: Detect IE. Basic at the moment. Expand if necessary.
 */
(function(window, document) {

  'use strict';

  var Device = window.Device || function() {};

  var IEDetection = Device.IEDetection = function(el) {
    this.init();
  }

  IEDetection.prototype.init = function() {

    this.isOldIE = $('html').hasClass('ie8');
    this.isIE8 = $('html').hasClass('ie8');
    this.isIE9 = $('html').hasClass('ie9');
  };


  $(document).ready(function() {
    window.Device = Device;
  })


})(this.window, this.document);

;
(function(window, document, $, undefined) {
    'use strict';

    $(document).ready(function() {

        /**
         * Toggle the "removing budget plan" warning pane
         * Only init this if the account has EPP enabled
         */
        $('.acc-info-module.-epp').each(function() {
            initTogglePanes($(this));
        })

        /**
         * Init the toggle
         */
        function initTogglePanes($accInfoModule) {
            var $radioButtons = $accInfoModule.find('input[type=radio]');
            var $togglePanes = $accInfoModule.find('.toggle-pane');
            attachEventListeners($radioButtons, $togglePanes);
        }

        /**
         * Attach the change event listenr to the radio buttons
         */
        function attachEventListeners($radioButtons, $togglePanes) {

            $radioButtons.change(function() {
                var $currentRadioButton = $(this);
                // hide all the toggle panes
                $togglePanes.stop().slideUp().removeClass('panel-is-open');
                // if this is the "post only" or "both" radio button
                // we show the corresponding warning pane
                var showWarning = $currentRadioButton.val() === 'postOnly' || $currentRadioButton.val() === 'postAndEmail';
                if (showWarning) {
                    var $togglePane = $currentRadioButton.parent().find('.toggle-pane');
                    $togglePane.stop().slideDown().addClass('panel-is-open');
                }

            })
        }

        /**
        // End toggle warning pane
        */

        /**
         * Toggle the
         */
        function toggleGuide(panel, element, status) {
            var statusStr = (status.length > 0) ? status : '';
            $(panel + ' .strength-guide ' + element).removeClass('valid error').addClass(statusStr);
        }

        /**
         * Reset any existing forms which are open
         */
        function resetAllPanels() {
            $('.form-details').slideUp();
            $('.display-details').slideDown();
            $('.panel-link .-change').show();
            $('.panel-link .-cancel').hide();
        }

        /**
         * Reset all form field values back to data-value-preset
         */
        function resetForm(form) {
            form.find('input').each(function() {
                if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
                    if ($(this).data('value-preset') == 'checked') {

                        $(this).prop('checked', 'checked');

                        var showWarning = $(this).val() === 'postOnly' || $(this).val() === 'both';
                        var hasEPP = $('.acc-info-module.-epp').length;

                        if (hasEPP && showWarning) {
                            var $togglePane = $(this).parent().find('.toggle-pane');
                            $togglePane.stop().slideDown();
                        } else {
                            var $togglePanes = $('.acc-info-module.-epp .toggle-pane');
                            $togglePanes.slideUp();
                        }
                    } else {
                        $(this).prop('checked', '');
                    }
                } else {
                    if ($(this).attr('type') != 'hidden') {
                        $(this).val($(this).data('value-preset'));
                    }
                }
            });

            form.find('select').each(function() {
                $(this).parents('.c-input-select').removeClass('valid invalid error');
                $(this).val('');
                $(this).siblings('.cs-placeholder').text('-Select-');

                // The below code would work if the data-value-preset wasn't being stripped
                // and a comparison to what's currently in production didn't make it
                // redundant anyway

                // var $selected = $(this).find(":selected").val();
                // if ($(this).data('value-preset') == '' || $selected.length ==) {
                //   $(this).siblings('.cs-placeholder').text('-Select-');
                // } else {
                //   $(this).val($(this).data('value-preset'));
                //   $(this).siblings('.cs-placeholder').text($(this).data('value-preset'));
                // }
            });
        }

        function isAnyUppercase(value) {
            var i, len;
            var regex = new RegExp('[A-Z]');

            for (i = 0, len = value.length; i < len; i++) {
                if (regex.test(value[i])) {
                    return true;
                }
            }
            return false;
        }

        function validPhoneNumber(value) {
            var i, len;
            // var regex = new RegExp(/[0-9+-\s]/);
            var regex = new RegExp(/[0-9+-]/);

            for (i = 0, len = value.length; i < len; i++) {
                if (regex.test(value[i]) == false) {
                    return false;
                }
            }
            return true;
        }

        function setupRegion(countryOption) {
            // cache some selectors
            var $county = $('select#county');
            var $countyNI = $('select#countyNI');
            var $postCode = $('input#postcode');
            var $postCodeGlobal = $('input#postcodeGlobal');
            var $country = $('select#country');

            // set the value of the country select based on the region

            if (countryOption === 'roi') {
                $country.val('Republic_of_Ireland');
                $county.prop("disabled", false);
                $county.removeAttr('tabindex');
                $countyNI.prop("disabled", true);
                $countyNI.removeAttr('tabindex', -1);
                $postCode.prop("disabled", true);
                $postCode.attr('tabindex', -1);
                $postCodeGlobal.prop("disabled", true);
                $postCodeGlobal.attr('tabindex', -1);

                $county.prop('name', 'personalDetailsVO.customerAddress.county');
                $countyNI.prop('name', 'niCounty');
            } else if (countryOption === 'ni') {
                $country.val('Northern_Ireland');
                $countyNI.prop("disabled", false);
                $countyNI.removeAttr('tabindex');
                $county.prop("disabled", true);
                $county.attr('tabindex', -1);
                $postCode.prop("disabled", false);
                $postCode.removeAttr('tabindex');
                $postCodeGlobal.prop("disabled", true);
                $postCodeGlobal.attr('tabindex', -1);

                $county.prop('name', 'roiCounty');
                $countyNI.prop('name', 'personalDetailsVO.customerAddress.county');
            } else {
                // this will re-init the select component
                $country.val('').trigger('data-refresh');
                $postCodeGlobal.prop("disabled", false);
                $postCodeGlobal.removeAttr('tabindex');
                $postCode.prop("disabled", true);
                $postCode.attr('tabindex', -1);
                $county.prop("disabled", true);
                $county.removeAttr('tabindex', -1);
                $countyNI.prop("disabled", true);
                $countyNI.removeAttr('tabindex', -1);
                // hide the required message for postcode
                $('.-global input#postcodeGlobal').next('.hint').hide();
            }
            
        }

        function switchRegions(e, $el) {
            e.preventDefault();
            var countryOption = $el.data('country-option');
            $el.closest('.address-country').find('.country-option').removeClass('-is-active');
            if ($el.is('select')) {
                countryOption = $el.find('option[value=' + $el.val() + ']').data('country-option');
            }
            $el.closest('.address-country').find('.country-option.-' + countryOption).addClass('-is-active');
            setupRegion(countryOption);
        }

        if ($('.mod-acc-info').length > 0) {

            // CAPS LOCK NOTICE - visibility
            if ($('.case-sensitive-input').length > 0) {
                $(window).capslockstate();

                $(window).bind("capsOn", function(e) {
                    var $focused = $(':focus');
                    if ($focused.hasClass('case-sensitive-input')) {
                        $(".caps-lock").show();
                    }
                });

                $(window).bind("capsOff", function(e) {
                    var $focused = $(':focus');
                    if ($focused.hasClass('case-sensitive-input')) {
                        $(".caps-lock").hide().parents('.msg.-tip.is-active').removeClass('is-active');
                    }
                });
                $(window).bind("capsUnknown", function(e) {
                    var $focused = $(':focus');
                    if ($focused.hasClass('case-sensitive-input')) {
                        $(".caps-lock").hide().parents('.msg.-tip.is-active').removeClass('is-active');
                    }
                });

                $('.case-sensitive-input').bind("focusout", function(e) {
                    $(".caps-lock").hide();
                });
            }
            // Suppress IE11 Caps Lock Notice
            document.msCapsLockWarningOff = true;


            // CASE SENSITIVE NOTICE - visibility
            if ($('.case-sensitive-notice').length > 0) {
                $('.case-sensitive-notice').on("focusin change keyup paste mouseup", function(e) {
                    if (isAnyUppercase($(this).val())) {
                        $(".case-notice").show();
                    } else {
                        $(".case-notice").hide();
                    }
                });
            }


            // Change Username: prepopulate Username/Email checkbox
            if ($('#username-form #emailAsUsername').length > 0) {
                var emailUsername = $('#emailAsUsername').val();

                if (emailUsername.length > 0) {

                    // initialise
                    if ($('#username').val() === emailUsername) {
                        $('#username').parents('.form-field').addClass('-has-related-input');
                        $('#use_email').prop("checked", true);
                    }

                    // field change
                    $('#username').keyup(function() {
                        var username = $(this).val();
                        if (username === emailUsername) {
                            $('#use_email').prop("checked", true);
                        } else {
                            $('#use_email').prop("checked", false);
                        }
                    });

                    // checkbox change
                    $('#use_email').click(function() {
                        if ($(this).prop('checked') == true) {
                            $('#username').val($('#emailAsUsername').val());
                        } else {
                            $('#username').val('');
                            $('#username').parents('.form-field').removeClass('valid error');
                        }
                    });
                } else {
                    // if not emailAsUsername value available
                    $('#username').parents('.form-field').removeClass('-has-related-input');
                    $('#use_email').parents('.form-field').addClass('-is-hidden');
                }
            }


            // Change Username: Show/Hide the Username Tips panel
            $('#username-form #username').focusin(function() {
                $('.msg.username-tips').addClass('is-active');
                var username = $(this).val();
                var password = $('#username-form #confirmPassword').val();
                if (password.length > 0) {
                    guideStatus = (username == password) ? 'error' : 'valid';
                    toggleGuide('.username-tips', '.same', guideStatus);
                }
            });
            $('#username-form #username').focusout(function() {
                $('.msg.username-tips').removeClass('is-active');
            });
            $('#username-form #confirmPassword').focusin(function() {
                if ($(window).capslockstate('state') == true) {
                    $(".msg.password-tips .caps-lock").show().parents('.password-tips').addClass('confirm-password is-active');
                }
            });
            $('#username-form #confirmPassword').focusout(function() {
                $('.msg.password-tips').removeClass('new-password confirm-password is-active');
            });


            // Change Password: Show/Hide the Password Tips panel
            $('form.-password-form #password').on("focusin change keyup paste mouseup", function(e) {
                $(this).closest('form').find('.msg.password-tips').addClass('current-password');
                if ($(window).capslockstate('state') == true) {
                    $(this).parents('form').find('.password-tips').addClass('current-password is-active');
                }
            });
            $('form.-password-form #password').focusout(function() {
                $('.msg.password-tips').removeClass('new-password current-password is-active');
            });
            $('form.-password-form #newPassword').on("focusin", function(e) {
                $(this).closest('form').find('.msg.password-tips').addClass('new-password');
                if ($(window).capslockstate('state') == true) {
                    $(".caps-lock").show().closest('.password-tips').addClass('is-active');
                }
            });
            $('form.-password-form #newPassword').focusout(function() {
                $('.msg.password-tips').removeClass('new-password confirm-password is-active');
            });
            $('form.-password-form #newPasswordConfirmation').on("focusin change keyup paste mouseup", function(e) {
                $(this).closest('form').find('.msg.password-tips').addClass('confirm-password');
                if ($(window).capslockstate('state') == true) {
                    $(".caps-lock").show().parents('form').find('.password-tips').addClass('confirm-password is-active');
                }
            });
            $('form.-password-form #newPasswordConfirmation').focusout(function() {
                $('.msg.password-tips').removeClass('new-password confirm-password is-active');
            });


            // Change Ebilling: handle various options
            $('#eBillingPanel form input[name="electronicBillingDetailsVO.notificationOption"]').on("change", function(e) {
                if ($(this).val() == 'postOnly') {
                    $('#eBillingPanel .email-field').removeClass('-is-active');
                    $('#eBillingEmail').val('');
                } else {
                    $('#eBillingPanel .email-field').addClass('-is-active');
                    if ($('#eBillingEmail').val() == '') {
                        $('#eBillingEmail').val($('#eBillingEmail').data('value-preset'));
                    }
                }
            });


            // Change Contact Details: handle Meter Reading options
            if ($('#contactForm #meterSMSYes').length > 0) {
                var $mobileField = $('input#mobileNumber');
                var $mobileFieldValue = $mobileField.val();
                var $smsCheckbox = $('input#meterSMSYes');
                var $smsFlag = $('#meterReadingReminderSmsSubscribed');

                if ($smsFlag.val() !== 'true') {
                    $smsCheckbox.parent().hide();
                    $smsCheckbox.prop('checked', false);
                } else if ($smsFlag.val() === 'true' && $mobileFieldValue.length > 0) {
                    $smsCheckbox.parent().show();
                } else {
                    $smsCheckbox.parent().hide();
                    $smsCheckbox.prop('checked', false);
                }

                $mobileField.on("change keyup paste", function(e) {
                    $mobileFieldValue = $mobileField.val();
                    if ($mobileFieldValue.length > 0 && validPhoneNumber($mobileFieldValue) && $smsFlag.val() === 'true') {
                        $smsCheckbox.parent().show();
                    } else {
                        $smsCheckbox.parent().hide();
                        $smsCheckbox.prop('checked', false);
                    }
                });
            }


            // Msg Tips vertical position
            if ($('.msg.-tip').length && $('.msg.-tip').hasClass('-floating-panel')) {
                $('.form-inputs input').bind("focusin", function(e) {
                    var fieldPos = $(this).position();
                    $('.msg.-tip').css('top', fieldPos.top);
                });
            }


            // Username guide rules
            var guideStatus;
            $('#username-form #username').on("focusin change keyup paste mouseup", function(e) {
                var username = $('#username-form #username').val();
                var password = $('#username-form #confirmPassword').val();

                guideStatus = ((username.length >= 6 && username.length <= 60)) ? 'valid' : 'error';
                toggleGuide('.username-tips', '.length', guideStatus);

                guideStatus = (username.match(/\s/g)) ? 'error' : 'valid';
                toggleGuide('.username-tips', '.space', guideStatus);

                if (password.length > 0) {
                    guideStatus = (username == password) ? 'error' : 'valid';
                    toggleGuide('.username-tips', '.same', guideStatus);
                }
            });


            // Password strength guide rules
            $('#newPassword').on("focusin change keyup paste mouseup", function(e) {
                var passwordStrength = 0;
                var password = $('#newPassword').val();

                if (password.length < 8) passwordStrength = 0;
                if (password.length >= 8 && password.length <= 32) {
                    passwordStrength++;
                    toggleGuide('.password-tips', '.length', 'valid');
                } else {
                    toggleGuide('.password-tips', '.length', 'error');
                }

                if (password.match(/[A-Z]/)) passwordStrength++;

                if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) {
                    passwordStrength++;
                    toggleGuide('.password-tips', '.case', 'valid');
                } else {
                    toggleGuide('.password-tips', '.case', 'error');
                }
                if (password.match(/[0-9]/)) {
                    passwordStrength++;
                    toggleGuide('.password-tips', '.number', 'valid');
                } else {
                    toggleGuide('.password-tips', '.number', 'error');
                }

                if (password.match(/\s/g)) {
                    passwordStrength = 0;
                    toggleGuide('.password-tips', '.space', 'error');
                } else {
                    toggleGuide('.password-tips', '.space', 'valid');
                }


                if (
                    $('.password-tips .strength-guide .length').hasClass('valid') &&
                    $('.password-tips .strength-guide .case').hasClass('valid') &&
                    $('.password-tips .strength-guide .number').hasClass('valid') &&
                    $('.password-tips .strength-guide .space').hasClass('valid')
                ) {
                    if (password.length > 12) passwordStrength++;
                    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) passwordStrength++;
                }


                $('#pwdMeter').removeClass();
                $('#pwdMeter').addClass('neutral');

                switch (passwordStrength) {
                    case 1:
                        $('#pwdMeter').addClass('veryweak');
                        break;
                    case 2:
                        $('#pwdMeter').addClass('weak');
                        break;
                    case 3:
                        $('#pwdMeter').addClass('medium');
                        break;
                    case 4:
                        $('#pwdMeter').addClass('strong');
                        break;
                    case 5:
                        $('#pwdMeter').addClass('verystrong');
                        break;
                    case 6:
                        $('#pwdMeter').addClass('verystrong');
                        break;
                    default:
                        $('#pwdMeter').addClass('neutral');
                }
            });


            // Change / Cancel buttons
            if ($('.mod-acc-info').length) {


                // Was trying to get heights to animate the panel, but it's tricky...
                var getPanelMinHeights = function($p) {
                    var form = $p.find('.form-details').outerHeight(true);
                    var disp = $p.find('.display-details').outerHeight(true);
                    return {
                        formHeight: form || false,
                        dispHeight: disp || false
                    }
                }


                /**
                 * Exactly what it says on the tin
                 */
                var showForm = function($panel) {
                    hideAllOtherForms($panel); //Important to do this first.
                    $panel.addClass('-is-form');
                    $panel.removeClass('-is-display');
                    addTemporaryTransitionClass($panel);
                }
                var hideForm = function($panel) {
                    $panel.addClass('-is-display');
                    $panel.removeClass('-is-form');
                    addTemporaryTransitionClass($panel);
                    resetFormValidation($panel);
                }

                /**
                 * This is to help with CSS animations.
                 */
                var addTemporaryTransitionClass = function($panel) {
                    $panel.addClass('-is-transitioning');
                    setTimeout(function() {
                        $panel.removeClass('-is-transitioning');
                    }, 50);
                }

                /**
                 * Clear any errors and reset default values
                 */
                var resetFormValidation = function($panel) {
                    var $form = $panel.find('.form-details');
                    resetForm($form);
                    $panel.find('form .form-field').each(function() {
                        $(this).removeClass('valid error');
                        $(this).find('.inline-error').hide();
                    });
                }

                /**
                 * As per requirements. Close other open forms if one is opening.
                 */
                var hideAllOtherForms = function() {
                    var accInfoModules = $('.acc-info-module.-is-form');
                    accInfoModules.each(function() {
                        hideForm($(this));
                    })
                }

                var doTransition = function($panel) {
                    //We dont want these to animate when page loads first, so add this class after
                    //it receives its first click.
                    $panel.addClass('can-animate');

                    if ($panel.hasClass('-is-display')) {
                        showForm($panel);
                    } else {
                        hideForm($panel);
                    }
                }

                $('.panel-link').on('click', function(e) {
                    if ($(this).attr('href') === '#') {
                        e.preventDefault();

                        var $panel = $(this).closest('.acc-info-module') || false;

                        if (!$panel) {
                            return false;
                        }

                        doTransition($panel);

                    }
                });

                // the add your details links on the contact details panel
                $('.-contact-details .-change').on('click', function(e) {

                    if ($(this).attr('href') === '#') {
                        
                        e.preventDefault();
                        
                        var $panel = $(this).closest('.acc-info-module') || false;

                        if (!$panel) {
                            return false;
                        }

                        doTransition($panel);

                    }
                })


                $('.cancel-link').on('click', function(e) {
                    if ($(this).attr('href') === '#') {
                        e.preventDefault();
                        resetForm($(this).parents('.form-details'));

                        var $panel = $(this).parents('.acc-info-module');
                        $panel.find('form .form-field').each(function() {
                            $(this).removeClass('valid error');
                            $(this).find('.inline-error').hide();
                        });
                        $panel.toggleClass('-is-display -is-form');

                        var target = $(this).parents('.acc-info-module').offset().top;
                        $("html,body").scrollTop(target);
                    }
                });

              
                $('.-display-multiple-address').on('click', function(e) {
                    e.preventDefault();

                    var label = $(this).text();
                    var newLabel = $(this).data('label-toggle');
                    $(this).parents('.multiple-address').toggleClass('-is-active');
                    $(this).text(newLabel).data('label-toggle', label);
                });


                // setup Region fields onLoad, in the event of a server validation error
                var $countryOptionEl = $('.country-option.-is-active');
                var $countySelect = $('select#country');
                var countryOption = '';

                if ($countryOptionEl.hasClass('-roi')) {
                    countryOption = 'roi';
                } else if ($countryOptionEl.hasClass('-ni')) {
                    countryOption = 'ni';
                }

                setupRegion(countryOption);


                // coutry switch listener
                $('.-switch-country').on('click', function(e) {
                    switchRegions(e, $(this));
                });

                // show the required message for postcode if is UK
                $('select#country').change(function(e) {
                    var value = $(this).val();

                    if (value === 'United_Kingdom') {
                        $('.-global input#postcodeGlobal').next('.hint').show();
                    } else if (value === 'Republic_of_Ireland' || value === 'Northern_Ireland') {
                        switchRegions(e, $(this));
                    } else {
                        // hide the required message for postcode
                        $('.-global input#postcodeGlobal').next('.hint').hide();
                    }
                });


            }


            if ($('.mod-acc-info').length > 0) {

                // Hide all success info messages after
                // $('.msg.-info').not('.-no-box').delay(4000).slideUp('slow');
                $('.msg.-info').not('.-no-box').delay(4000).fadeTo(500, 0.00, function() { //fade
                    $(this).slideUp(500, function() {
                        $(this).remove();
                    });

                    // var tHeight = $(this).outerHeight(true);
                    // $(this).wrap("<div class='smooth-slide-up'></div>");
                    // $(this).closest('.smooth-slide-up').css('height',tHeight);
                    // $(this).hide();

                    // $('.smooth-slide-up').animate(
                    //   { height: 0 },
                    //   {
                    //     duration: 'slow',
                    //     easing: 'swing',
                    //     complete: function() {
                    //       $(this).remove();
                    //     }
                    //   }
                    // );

                    // $(this).css('height',$(this).outerHeight(true)).addClass('animate-ready');
                    // $(this).delay(4000).animate(
                    //   { height: 0 },
                    //   {
                    //     duration: 'slow',
                    //     easing: 'swing',
                    //     complete: function() {
                    //       $(this).remove();
                    //     }
                    //   }
                    // );
                });


                // Scroll to any Backend Errors
                if ($('.msg.-error').length > 0) {
                    var $parent = $('.msg.-error:first').closest('.acc-info-module')
                    var target = $parent.offset().top;
                    //$parent.toggleClass('-is-display -is-form');
                    $("html,body").animate({
                        scrollTop: target
                    }, "slow");
                }
                // Scroll to Change Password Step2 when presented
                else if ($('#passwordPanel').hasClass('-is-form')) {
                    if ($('#password-form-step2').length > 0) {
                        var target = $('#password-form-step2').closest('.acc-info-module').offset().top;
                        $("html,body").scrollTop(target);
                    }
                }
            }
        }
    });


})(window, document, jQuery);
;
/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/*
/* 
 * FAQ Accordion
 *
 * 1. Must use dl, dd, dt
 * 2. Add class="accordion" to the dl
 * 3. add accordion-trigger element to the a
 *
 * EG
 <dl class="accordion">
    <a href="#" accordion-trigger>
      <dt>
        Panel 1
      </dt>
    </a>
    <dd>
      <p>Content</p>
    </dd>
    <a href="#" accordion-trigger>
      <dt>
        Panel 2
      </dt>
    </a>
    <dd>
      <p>Content</p>
    </dd>
</dl>
 *
 * ------------------------------------------------------------------------- */



(function(window, document, $, undefined) {

  'use strict';

  if (!window.console) console = {
    log: function() {}
  };


  var Accordion = function() {
    this.$panels;
    this.$arrows;
    this.init();
  };

  Accordion.prototype.init = function() {
    this.$panels = $('.accordion dd').hide();
    $('.accordion dt').prepend($('<span class="icon plus"></span>'));
    $('.accordion dt').append($('<span class="arrow bottom"></span>'));
    this.events();
  };

  Accordion.prototype.events = function() {
    var me = this;
    $('.accordion a[accordion-trigger]').click(function() {
      var $active = $(this);

      me.$panels.stop().slideUp();
      $('.accordion dt span.arrow').removeClass('top').removeClass('bottom');
      $('.accordion dt span.icon').removeClass('plus').removeClass('minus');

      if($active.hasClass('active')) {
        $active.removeClass('active');
        $('.accordion dt span.arrow').addClass('bottom').removeClass('top');
        $('.accordion dt span.icon').addClass('plus').removeClass('minus');
      }
      else {
        $active.next().stop().slideDown();
        $('.accordion a').removeClass('active');
        $active.addClass('active');  
        $('.accordion dt span.arrow').addClass('bottom');
        $active.find('span.arrow').addClass('top').removeClass('bottom');

        $('.accordion dt span.icon').addClass('plus');
        $active.find('span.icon').addClass('minus').removeClass('plus');
      }
      return false;
    });
  }

  // initialise when ready
  $(function() {
    var a = new Accordion();
  });

})(this, this.document, $);
;
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

;
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

;
/*!
 * Author: Each & Other [www.eachandother.com] - Conor
 *
 * Additional contacts section on Account-Info page.
 *
 */
;(function(window, document, $, undefined) {
    'use strict';


    /**
     * isInFormSection
     *
     * Check if the button is in a form area or
     * in the details area. If it's in the latter
     * it just needs to show the form on click,
     * but if it's in a form it needs to clone
     * a new contact form section and add it to
     * the form.
     *
     * @param  {[type]}  $el The button that gets clicked
     * @return {Boolean}     True if it's in a form section
     */
    var isInFormSection = function( $el ) {
      return $el.closest('.form-details').length;
    };


    /**
     * clickChangeButton
     *
     * Traverse up the tree from the clicked link
     * and then find the change button for that
     * section and click it.
     *
     * @param  {[type]} $el The button that gets clicked
     * @return {[type]}     Not used for anything.
     */
    var clickChangeButton = function( $el ) {
      return $el.closest('.named-contacts').find('.change').first().click();
    };


    /**
     * clearValues
     *
     * Check if it's a  textbox or checkbox or hidden,
     * and then reset it to be clear or unchecked.
     *
     * @param  {[type]} $el input element
     * @return {[type]}     [description]
     */
    var clearValues = function( $el ) {

      if ($el[0].type === 'hidden' || $el[0].type === 'text') {
        $el.val('');
      }

      //Should be checked by default - wireframes
      if ($el[0].type === 'checkbox') {
        $el.attr('checked', true);
      }

      return $el[0].type;

    };


    /**
     * updateNamesAndIds
     *
     * We need to update the attributes of each element
     * so that they have a unique ID and name, and still
     * link to their labels via the for attribute.
     *
     * @param  {[type]} $el input element
     * @param  {[type]} idx index of the form
     * @return {[type]}     [description]
     */
    var updateNamesAndIds = function( $el, idx ) {

      var
      attrName = $el.attr('name'),
      attrId = $el.attr('id'),
      attrFor = $el.attr('for'),
      attrPlace = $el.attr('placeholder');

      //Only do this if it already has 'name' attribute.
      if (attrName) {
        attrName = attrName.substr(0, attrName.length - 1) + idx;
        $el.attr('name', attrName);
      }

      //Only do this if it already has 'id' attribute.
      if (attrId) {
        attrId = attrId.substring(0, attrId.length - 1) + idx;
        $el.attr('id', attrId);
      }

      //Only do this if it already has 'for' attribute.
      if (attrFor) {
        attrFor = attrFor.substring(0, attrFor.length - 1) + idx;
        $el.attr('for', attrFor);
      }

      //Only do this if it already has 'placeholder' attribute.
      if (attrPlace) {
        $el.attr('placeholder', '');
      }

    };


    /**
     * cloneNewContactForm
     *
     * @param  {[type]} $el [description]
     * @return {[type]}     [description]
     */
    var cloneNewContactForm = function ( $el ) {

      var
      $forms = $el.closest('.form-details').find('.additional-contact-form'),
      $formClone = $forms.first().clone(),
      idx = $forms.length;

      //For each input element, set values to empty or unchecked
      $formClone.find('input').each(function(){
        clearValues($(this));
      });

      //Add a class that we can use for transitioning it in
      $formClone.addClass('incoming');

      //Remove any error class
      $formClone.find('.-error').removeClass('-error');

      //Reset the checkbox label in case of error state
      $formClone.find('.chk-auth + label').html('I authorise this person to contact SSE Airtricity on my behalf.');

      //Check the checkbox
      $formClone.find('.chk-auth').prop('checked', true);

      //For each input element, give them attributes with indexes.
      $formClone.find('input, label').each(function(){
        updateNamesAndIds($(this), idx);
      });

      //Error labels are used by IE8 and 9. You don't want to clone them.
      $formClone.find('label.error').remove();

      //Stick the form into the page.
      $el.before( $formClone );

      setTimeout(function() {
        $formClone.removeClass('incoming');
      }, 10);

      //Add validation rules - Name is no longer forced because
      //it was stopping people submitting deleted contacts
      // $formClone.find('[name="contactFirstName' + idx + '"]').rules("add", {
      //   required: true,
      //   messages: {
      //     required: "Please enter a name for your additional contact.",
      //   }
      // });

      //Add validation rules
      $formClone.find('[name="contactChkAuth' + idx + '"]').rules("add", {
        requiredIfNameNotEmpty: true,
        messages: {
          requiredIfNameNotEmpty: "Please check the box to authorise this person to contact our customer service agents on your behalf.",
        }
      });

    };


    /**
     * initNewContactBtns
     *
     * Set up the listeners for the Additional Contact buttons
     *
     * @return {[type]} [description]
     */
    var initNewContactBtns = function() {

      var $btns = $('.add-new-contact');

      $btns.each(function() {
        $(this).on('click', function(e) {
          e.preventDefault();
          var $btn = $(this);

          //Button needs to behave differently depending on
          //where it exists.
          if (isInFormSection($btn))
            cloneNewContactForm($btn);
          else
            clickChangeButton($btn);


        });

      });

    };



    /**
     * markForDeletion
     *
     * We need to be able to mark additional contacts for deletion
     * so that it can be posted to the server and updated.
     * Providing a hidden field beside each contact and this will
     * let you set it to 'true' if this contact should be removed.
     */
    var initMarkForDeletion = function(){
      $('.contacts-list .delete-contact').on('click', function(e) {
        e.preventDefault();
        //Add a class to this contact and update hidden element to
        //show that it should be deleted.
        $(this).closest('.row')
          .addClass('delete-me')
            .find('input')
              .val('true');
      });
    };


    //////////////////////////////
    //////////////////////////////
    //////////////////////////////


    $(document).ready(function() {
      initNewContactBtns();
      initMarkForDeletion();
    });


})(this.window, this.document, jQuery);

;


(function(window, document, $, undefined) {
  'use strict';


  function toggleGuide(panel, element, status) {
    var statusStr = (status.length > 0) ? status : '';
    $(panel + ' .strength-guide ' + element).removeClass('valid error').addClass(statusStr);
  }

  function isAnyUppercase(value) {//Moved this up here because it fails Strict mode validness and breaks IE10 if it's nested in a block (it was inside an IF)
    var i, len;
    var regex = new RegExp('[A-Z]');

    for (i=0, len=value.length; i<len; i++){
      if (regex.test(value[i])) {
        return true;
      }
    }
    return false;
  }

  $(document).ready(function() {

    if($('.mod-auth-reset').length > 0) {

      // Password Reset: Show/Hide the Password Tips panel
      $('#forgotUsernamePasswordForm #password').focusin(function(){
        $('.msg.password-tips').addClass('new-password');
        if($(window).capslockstate('state') == true) {
          $(".caps-lock").show().parents('.password-tips').addClass('is-active');
        }
      });
        $('#forgotUsernamePasswordForm #password').focusout(function(){
          $('.msg.password-tips').removeClass('new-password confirm-password is-active');
        });
        $('#forgotUsernamePasswordForm #confirmPassword').focusin(function(){
          $('.msg.password-tips').addClass('confirm-password');
          if($(window).capslockstate('state') == true) {
            $(".caps-lock").show().parents('.password-tips').addClass('is-active');
          }
        });
        $('#forgotUsernamePasswordForm #confirmPassword').focusout(function(){
          $('.msg.password-tips').removeClass('new-password confirm-password is-active');
        });


      // Registration Page: Show/Hide the Username/Password Tips panel
      $('#usernamePasswordForm #username').focusin(function(){
        $('.msg.username-tips').addClass('is-active');
      });
        $('#usernamePasswordForm #username').focusout(function(){
          $('.msg.username-tips').removeClass('new-password confirm-password is-active');
        });
        $('#usernamePasswordForm #password').focusin(function(){
          $('.msg.password-tips').addClass('new-password');
          if($(window).capslockstate('state') == true) {
            $(".caps-lock").show().parents('.password-tips').addClass('is-active');
          }
        });
        $('#usernamePasswordForm #password').focusout(function(){
          $('.msg.password-tips').removeClass('new-password confirm-password is-active');
        });
        $('#usernamePasswordForm #confirmPassword').focusin(function(){
          $('.msg.password-tips').addClass('confirm-password');
          if($(window).capslockstate('state') == true) {
            $(".caps-lock").show().parents('.password-tips').addClass('is-active');
          }
        });
        $('#usernamePasswordForm #confirmPassword').focusout(function(){
          $('.msg.password-tips').removeClass('new-password confirm-password is-active');
        });


      // Registration: prepopulate
      if($('#emailAsUsername').length){
        var emailUsername = $('#emailAsUsername').val();

        if(emailUsername.length > 0) {
          $('#username').val(emailUsername);
          $('#username').parents('.form-field').addClass('-has-related-input');
          $('#use_email').prop("checked", true);

          $('#username').keyup(function(){
            var username = $(this).val();
            if(username === emailUsername){
              $('#use_email').prop("checked", true);
            } else {
              $('#use_email').prop("checked", false);
            }
          });

          $('#use_email').click(function(){
            if($(this).prop('checked') == true){
              $('#username').val($('#emailAsUsername').val());
            } else {
              $('#username').val('');
              $('#username').parents('.form-field').removeClass('valid error');
            }
          });
        } else {
          $('#username').parents('.form-field').removeClass('-has-related-input');
          $('#use_email').parents('.form-field').addClass('-is-hidden');
        }
      }


      // Username guide rules
      var guideStatus;
      $('#username').keyup(function() {
        var username = $('#username').val();
        var password = $('#password').val();

        guideStatus = ((username.length >= 6 && username.length <= 60)) ? 'valid' : 'error';
        toggleGuide('.username-tips', '.length', guideStatus);

        guideStatus = (username.match(/\s/g)) ? 'error' : 'valid';
        toggleGuide('.username-tips', '.space', guideStatus);

        guideStatus = (username == password) ? 'error' : 'valid';
        toggleGuide('.username-tips', '.same', guideStatus);
      });


      // Password strength guide rules
      $('#password').keyup(function() {
        var passwordStrength = 0;
        var password = $('#password').val();

        if (password.length < 8) passwordStrength=0;
        if (password.length >= 8 && password.length <= 32) {
          passwordStrength++;
          toggleGuide('.password-tips', '.length', 'valid');
        } else {
          toggleGuide('.password-tips', '.length', 'error');
        }

        if (password.match(/[A-Z]/)) passwordStrength++;

        if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/)) ) {
          passwordStrength++;
          toggleGuide('.password-tips', '.case', 'valid');
        } else {
          toggleGuide('.password-tips', '.case', 'error');
        }
        if (password.match(/[0-9]/)) {
          passwordStrength++;
          toggleGuide('.password-tips', '.number', 'valid');
        } else {
          toggleGuide('.password-tips', '.number', 'error');
        }

        if (password.match(/\s/g)) {
          passwordStrength=0;
          toggleGuide('.password-tips', '.space', 'error');
        } else {
          toggleGuide('.password-tips', '.space', 'valid');
        }


        if(
          $('.password-tips .strength-guide .length').hasClass('valid') &&
          $('.password-tips .strength-guide .case').hasClass('valid') &&
          $('.password-tips .strength-guide .number').hasClass('valid') &&
          $('.password-tips .strength-guide .space').hasClass('valid')
        ){
          if (password.length > 12) passwordStrength++;
          if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) passwordStrength++;
        }


        $('#pwdMeter').removeClass();
        $('#pwdMeter').addClass('neutral');

        switch(passwordStrength){
          case 1:
            $('#pwdMeter').addClass('veryweak');
            break;
          case 2:
            $('#pwdMeter').addClass('weak');
            break;
          case 3:
            $('#pwdMeter').addClass('medium');
            break;
          case 4:
            $('#pwdMeter').addClass('strong');
            break;
          case 5:
            $('#pwdMeter').addClass('verystrong');
            break;
          case 6:
            $('#pwdMeter').addClass('verystrong');
            break;
          default:
            $('#pwdMeter').addClass('neutral');
        }
      });


      // Msg tips vertical position
      if( $('.msg.-tip').length && ! $('.msg.-tip').hasClass('-floating-panel')){
        $('.form-inputs input').bind("focusin", function(e) {
          var fieldPos = $(this).position();
          $('.msg.-tip').css('top',fieldPos.top);
        });
      }


      // CAPS LOCK NOTICE - visibility
      if($('.case-sensitive-input').length > 0) {
        $(window).capslockstate();

        $(window).bind("capsOn", function(e) {
          var $focused = $(':focus');
          if($focused.hasClass('case-sensitive-input')){
            $(".caps-lock").show().parents('.msg.-tip.is-active').addClass('is-active');
            $(".caps-lock").show().parents('.msg.-tip.confirm-password').addClass('is-active');
          }
        });
        $(window).bind("capsOff", function(e) {
          var $focused = $(':focus');
          if($focused.hasClass('case-sensitive-input')){
            $(".caps-lock").hide().parents('.msg.-tip.is-active').removeClass('is-active');
          }
        });
        $(window).bind("capsUnknown", function(e) {
          var $focused = $(':focus');
          if($focused.hasClass('case-sensitive-input')){
            $(".caps-lock").hide().parents('.msg.-tip.is-active').removeClass('is-active');
          }
        });

        $('.case-sensitive-input').bind("focusout", function(e) {
          $(".caps-lock").hide();
        });
      }
      // Suppress IE11 Caps Lock Notice
      document.msCapsLockWarningOff = true;

      // CASE SENSITIVE NOTICE - visibility
      if($('.case-sensitive-notice').length > 0) {
        $('.case-sensitive-notice').on("focusin change keyup paste mouseup", function(e) {
          if(isAnyUppercase( $(this).val() )) {
            $(".case-notice").show();
          } else {
            $(".case-notice").hide();
          }
        });
      }
    }
 });


})(window, document, jQuery);

;

/*!
 *
 *  Author: Each & Other [www.eachandother.com]
 *  JS.version: ###
 *
 *  This is used to make similar module instances match each others heights
 *  when they may have titles or content of different lengths that wrap and
 *  cause things to mis-align.
 *
 *  To trigger this on items you need to set data-js-module='eqHeight' on a
 *  parent element of them all and then ensure that there is a suitable
 *  collection of selectors in the subjects object.
 *
 */

(function(window, document, $, undefined) {
  'use strict';

    var
    $modules,
    childEls,
    subjects = {};
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    /**
     * Document ready
     */
    $(document).ready(function($) {

      $modules = $('[data-js-module=eqHeight]');

      //Subjects is an object containing references to anywhere we need to update
      //the heights of elements. Should make it easy to add new ones as needed...
      subjects = {
        //Meter readings
        '.info-container': ['.info-panel'],
      };

      setup();
    });
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




    /**
     * For every section that we want to match heights,
     * We need to get the group of them into an object.
     *
     * Each selector in the array relates to a group that
     * should be equal height to one another. This way we
     * can match different elements in the same containers.
     */
    function setup() {



      var $targetedEls;

      //For each area that we've hooked this module to,
      //update it independently from the others.
      $modules.each(function(index, el) {

        //Loop through our object that contains all the selectors
        //we need to check for. If it finds any, compare their heights
        //and set them all to be equal to the tallest.
        for (var subject in subjects) {

          if (subjects.hasOwnProperty(subject) && $(subject).length) {

            //Gets the array of selectors we want to play with
            childEls = subjects[subject];

            //For each selector in the array
            //(each group of things that should have matching heights)
            //Gets tallest of the group and sets the rest to that height
            for (var i = childEls.length - 1; i >= 0; i--) {

              $targetedEls = $(this).find(subject + ' ' + childEls[i]);

              //Only do this bit if the selector is found
              if ($targetedEls.length) {
                //Set all to auto first so we can start fresh (window resize etc)
                $targetedEls.height('auto');
              }

              setNewHeight($targetedEls, getTallestHeight($targetedEls));

            }
          }
        }
      });
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~






    /**
     * Loop through the collection of elements and return the highest.
     *
     * @param  {jQuery object}    $targetedEls  The group of elements we're working on
     * @return {number}           ceiling       The height of the tallest element
     */
    function getTallestHeight($targetedEls) {

      var ceiling = 0;

      $targetedEls.each(function() {
        ceiling = $(this).height() > ceiling ? $(this).height() : ceiling;
      });

      return ceiling;
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~







    /**
     * Pass in the selector we want to work with and then set them all
     * to be the same height as the tallest one we found previously
     *
     * @param {jQuery object} $targetedEls      The group of elements we're working on
     * @param {number}        newHeight         New height to set everything to
     */
    function setNewHeight($targetedEls, newHeight) {
      return $targetedEls.height(newHeight);
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~







})(this.window, this.document, jQuery);

;
/*!
 *  Author: Each & Other [www.eachandother.com]
 */

(function(window, document, $, undefined) {

  'use strict';

  if (!window.console) console = {
    log: function() {}
  };


  var FancyDropdowns = function() {
    this.init();
  };

  FancyDropdowns.prototype.init = function() {
    $('select.SlectBox.basic').SumoSelect();
    $('select.SlectBox.multi').SumoSelect({ csvDispCount: 2 });
    $('select.SlectBox.multi-select-all').SumoSelect({ csvDispCount: 2, selectAll:true });

    // change the defualt text for the Select all label
    $('.SumoSelect p.select-all label').text('View all');
  };

  // initialise when ready
  $(function() {
      new FancyDropdowns();
  });

})(this, this.document, $);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *
 *  This instantiates and initialises modules, if they're on the page.
 */
;(function(window, document){/* globals $ */
    'use strict';

    $(document).ready(function() {
      if (!window.Modules) {
        return false;
      }

      var modules = new window.Modules();
      var modulesOnPage = $('[data-js-module]');
      var module;

      /**
       *  Loop through all modules on the page and pass their element through
       *  to their respective JS module. Note that this will run once for each
       *  instance of each module. If there's 10 tab-modules on the page, it's
       *  gonna run the tab-module JS module 10 times.
       */
      console.groupCollapsed('Module initialisation');
      for (var i = 0; i < modulesOnPage.length; i++) {
        module = $(modulesOnPage[i]).data('js-module');
        var m = null;
        try {
          m = new Modules[module](modulesOnPage[i]);
        }
        catch(e) {
          console.error(e);
          console.info(module, 'is not a valid module, moving on...');
        }
        if(m) {
          console.groupCollapsed(module + ' module');
          console.info(modulesOnPage[i]);
          console.groupEnd(module + ' module');
        }
      }
      console.groupEnd('Module initialisation');
    });


})(this.window, this.document);

;

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


;
/*!
 *  Author: Each & Other [www.eachandother.com]
 */

 /*
 * Region Menu
 * ------------------------------------------------------------------------- */

(function(window, document, $, undefined) {
    'use strict';

    $(document).ready(function() {
        if ($('.change-user-region').length > 0) {
            $('.change-user-region a.region-current').click(function(e){
                e.preventDefault();
                $(this).parents('.change-user-region').toggleClass('is-active');
            });
        }
    });

})(this, this.document, $);

;
/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/*
 * Responsive Tooltips
 *
 * 1. Add data-tooltip attribute to the trigger element
 * 2. Add data-tooltip-content attribute to the element containing the content for the tooltip
 * 3. Settings (optional) - the default display of the tooltip is above the trigger element, to force it to display below the element
 *    add data-tooltip-settings="bottom" to the trigger element
 * 4. Set the max-width of the tooltip (optional)
 *
 * EG
 * <a data-tooltip="test">Tooltip</a>
 * <div data-tooltip-content="test" data-width="200px">
 *   <h3>Test content</h3>
 * </div>
 *
 * ------------------------------------------------------------------------- */
(function(window, document, $, undefined) {

  'use strict';

  if (!window.console) console = {
    log: function() {}
  };


  var ResponsiveTooltip = function() {
    this.init();
  };

  ResponsiveTooltip.prototype.init = function() {
    this.events($('[data-tooltip]'));
  };

  ResponsiveTooltip.prototype.events = function($targets) {

    var me = this;

    $targets.on('click', function(e) {
      me.addOrRemoveTooltip($(this), $targets);
      e.preventDefault();
    });

    $(window).resize(function() {
      $targets.removeClass('show');
      me.removeTooltip();
    });

  };

  ResponsiveTooltip.prototype.addTooltip = function($target, $targets) {

    var $contentElement = $('[data-tooltip-content=' + $target.attr("data-tooltip") + ']'),
      tip = $contentElement.html(),
      $tooltip = $('<div id="responsive-tooltip"></div>'),
      $closeButton = $('<a href="#" class="close"></a>'),
      me = this;

    if (!tip || tip === '') {
      return false;
    }

    $tooltip.css('opacity', 0).html(tip).appendTo('body');

    $closeButton.on('click', function(e) {
      e.preventDefault();
      $targets.removeClass('show');
      $tooltip.remove();
    });

    //Once it has set up, make it so clicking on anything else closes it.
    //...but it might have a link, so there's that too...
    setTimeout(function() {
      //This took messing to figure out. Clicking anything but the tooltip should close it.
      $('body').one('click', ':not(#responsive-tooltip, #responsive-tooltip *)', function(e) {
        //This leaves a 'show' class but it's the only way to make it play nice.
        $tooltip.remove();
      });
    }, 100);


    $closeButton.appendTo($tooltip);

    if ($(window).width() < $tooltip.outerWidth(false) * 1.5) {
      if (typeof $contentElement.attr("data-width") != 'undefined') {
        $tooltip.css('max-width', $contentElement.attr("data-width"));
      } else {
        $tooltip.css('max-width', $(window).width() / 2);
      }
    } else {
      $tooltip.css('max-width', $contentElement.attr("data-width"));
    }


    var pos_left = $target.offset().left + ($target.outerWidth(false) / 2) - ($tooltip.outerWidth(false) / 2);
    var pos_top = $target.offset().top - $tooltip.outerHeight(false) - 20;

    if (pos_left < 0) {
      pos_left = $target.offset().left + $target.outerWidth(false) / 2 - 20;
      $tooltip.addClass('left');
    } else {
      $tooltip.removeClass('left');
    }

    if (pos_left + $tooltip.outerWidth(false) > $(window).width()) {
      pos_left = $target.offset().left - $tooltip.outerWidth(false) + $target.outerWidth(false) / 2 + 20;
      $tooltip.addClass('right');
    } else {
      $tooltip.removeClass('right');
    }

    if (pos_top < 0) {
      pos_top = $target.offset().top + $target.outerHeight(false);
      $tooltip.addClass('top');
    } else {
      $tooltip.removeClass('top');
    }

    // apply custom settings
    if ($target.is('[data-tooltip-settings]')) {
      var settings = $target.attr('data-tooltip-settings').replace(/ /g, '').split(',');
      if (settings.indexOf('bottom') > -1) {
        $tooltip.addClass('bottom');
        pos_top += $tooltip.outerHeight(false) + 33;
      }
    }

    if ($target.is('[data-tooltip-class]')) {
      var classes = $target.attr('data-tooltip-class');
      if (classes.length > 0) {
        $tooltip.addClass(classes);
      }
    }


    $tooltip.css({
      left: pos_left,
      top: pos_top
    }).animate({
      top: '+=10',
      opacity: 1
    }, 50);


  };
  /*
   *
   */
  ResponsiveTooltip.prototype.removeTooltip = function() {

    $('#responsive-tooltip').remove();

    //Removed this because the delay was causing issues when we want to hide
    //the tooltip and switch between tabs.
    // var $tooltip = $('#responsive-tooltip');
    // $tooltip.animate({ top: '-=10',opacity: 0 }, 50, function() { $tooltip.remove(); });

  };
  /*
   *
   */
  ResponsiveTooltip.prototype.addOrRemoveTooltip = function($target, $targets) {
    this.removeTooltip();
    //this.addTooltip($target);
    if ($target.hasClass('show')) {
      $target.removeClass('show');
    } else {
      $targets.removeClass('show');
      $target.addClass('show');
      this.addTooltip($target, $targets);
    }
  };



  // initialise when ready
  $(function() {
    setTimeout(function() {var r = new ResponsiveTooltip();}, 500);
  });

})(this, this.document, $);

;

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


;
/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/* JSHint: */
/* globals $: false */

this.sseDataTables = {};

(function(window, document, $, undefined) {
  'use strict';

  if (!window.console) {
    console = {log: function() {}};
  }

  var storeBotGap = 0;

  var getDateFromString = function(dateString) {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        parts = dateString.split(' '),
        month = monthNames.indexOf(parts[1]);

    return new Date(parts[2], month, parts[0]);
  };

  var getBottomGap = function(){
    return $(document).height() - ($(window).height() + $(window).scrollTop());
  };

  /**
   * Constructor
   * @param {jQuery Obj} $dataTableContainer
  **/
  var TableFilters = function($dataTableContainer) {
    // num rows to show per page is based on commercial v domestic account
    if ($('body').hasClass('commercial')) {
      this.numRows = 50;
    } else {
      this.numRows = 24;
    }
    this.$dataTableContainer = $dataTableContainer;
    // this.appliedFilters;
    // this.dataTable;
    // this.$targetTable;
    // // datepicker stuff
    // this.$datePickerFrom;
    // this.$datePickerTo;
    // this.$dateFilterButton;
    // this.$calendarCloseButton;
    // this.$calendarContainer;
    // this.$dateRangeField;
    // this.$dateClearButton;
    // this.startDate;
    // this.endDate;
    // init
    this.init();
  };
  /**
   * initialise some stuff
  **/
  TableFilters.prototype.init = function() {
    var me = this;

    this.$targetTable = this.$dataTableContainer.find('.data-table');
    this.dataTable = this.$targetTable.DataTable(this.settings());
    this.$datePickerFrom = this.$dataTableContainer.find('#date-from div');
    this.$datePickerTo = this.$dataTableContainer.find('#date-to div');
    this.$dateFilterButton = this.$dataTableContainer.find('.btn-date-filter');
    this.$calendarCloseButton = this.$dataTableContainer.find('.calendar-container a.close');
    this.$calendarContainer = this.$dataTableContainer.find('.calendar-container');
    this.$dateRangeField = this.$dataTableContainer.find('input.date-range');
    this.$dateClearButton = this.$dataTableContainer.find('.btn-date-clear');
    this.$paginationButtons = this.$dataTableContainer.find('.paginate_button');

    // is there a better way to retain search functionality without showing the default search input??
    $('.dataTables_filter').hide();

    // add data-date attributes for filter by date range
    this.$targetTable.find('tr').each(function() {
      var dateString = $(this).children('td').first().text();
      $(this).attr('data-date', me.getDateFromString(dateString));
    });

    this.initDatePickers();

    this.events();
  };
  /**
   * initialise the datepickers
  **/
  TableFilters.prototype.initDatePickers = function() {
    var me = this;

    this.$datePickerFrom.datepicker({
      dateFormat: 'dd/mm/yy',
      showOtherMonths: false,
      maxDate: 0,
      defaultDate: '-1m',
      hideIfNoPrevNext: true,
      onSelect: function(selectedDate) {
        me.$datePickerTo.datepicker('option', 'minDate', selectedDate);
      }
    });
    this.$datePickerTo.datepicker({
      dateFormat: 'dd/mm/yy',
      maxDate: 0,
      minDate: '-1m',
      defaultDate: 0,
      showOtherMonths: false,
      hideIfNoPrevNext: true,
      onSelect: function(selectedDate) {
        me.$datePickerFrom.datepicker('option', 'maxDate', selectedDate);
      }
    });
  };
  /**
   * Hook up some UI events
  **/
  TableFilters.prototype.events = function() {
    var me = this;


    // hook up select filters
    me.$dataTableContainer.find('select.js-table-filter').on('change', function(e) {
      me.filterTable($(this));
    });


    // hook up multi select filters
    me.$dataTableContainer.find('select.js-table-filter-multi').on('change', function(e) {
      me.dataTable.draw();
    });


    // hook up text search
    me.$dataTableContainer.find('input.js-table-search').on('keyup', function() {
      var value = $(this).val(),
          $clearButton = me.$dataTableContainer.find('.js-clear-search');
      me.searchTable(value);
      me.showOrHideClearButton($(this), value.length, $clearButton);
    });


    me.$dataTableContainer.find('.js-clear-search').on('click', function() {
      me.clearSearchFilter($(this));
    });


    // hook up to a reset button
    me.$dataTableContainer.find('.reset-table-filters').on('click', function() {
      me.resetFilters();
    });


    // Draw table
    me.dataTable.on('draw', function() {
      me.countFilters();
      me.updateFilterIndicator();
    });


    //Paging
    me.dataTable.on( 'page.dt', function () {
      setTimeout(function() {
        //Keep same distance from bottom of screen
        $('html, body').scrollTop($(document).height() - ($(window).height() + storeBotGap));
      }, 10);
    });


    // hook up events for the date pickers
    me.$dateRangeField.focus(function() {
      me.$calendarContainer.fadeIn();
      me.$calendarContainer.find('.ui-datepicker').show();
    });


    //Close calendar
    me.$calendarCloseButton.click(function() {
      me.$calendarContainer.fadeOut();
    });


    // Apply date filter
    me.$dateFilterButton.click(function() {
      me.startDate = me.$datePickerFrom.datepicker('getDate');
      me.endDate = me.$datePickerTo.datepicker('getDate');
      me.$dateRangeField.val(me.getStringFromDate());
      me.$calendarContainer.fadeOut();

      me.dataTable.draw();
    });


    // Clear date filter
    me.$dateClearButton.click(function() {
      var lastMonth = new Date();

      me.$dateRangeField.val('');
      me.startDate = null;
      me.endDate = null;
      me.$calendarContainer.fadeOut();

      //Reset the date pickers to now and now - 1 month.
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      me.$datePickerFrom.datepicker( 'setDate', lastMonth );
      me.$datePickerTo.datepicker( 'setDate', new Date() );

      me.dataTable.draw();
    });

  };
  /**
   * Helper to get a Date obj from a String
   * @param {String} dateString
   * @return {Date}
  **/
  TableFilters.prototype.getDateFromString = function(dateString) {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        parts = dateString.split(' '),
        month = monthNames.indexOf(parts[1]);

    return new Date(parts[2], month, parts[0]);
  };
  /**
   * Helper to get a formatted date string from a Date obj
   * @return {String}
  **/
  TableFilters.prototype.getStringFromDate = function() {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        date = this.startDate.getDate() + ' ' + monthNames[parseInt(this.startDate.getMonth())] + ' ' + this.startDate.getFullYear().toString() + ' - ' + this.endDate.getDate() + ' ' + monthNames[parseInt(this.endDate.getMonth())] + ' ' + this.endDate.getFullYear().toString();
    return date;
  };
  /**
   * Resets the table filters to default state
  **/
  TableFilters.prototype.resetFilters = function() {
    var me = this;
    var lastMonth = new Date();

    // reset text search
    me.$dataTableContainer.find('input[name=search-string]').val('');

    // reset date filter
    me.$dateRangeField.val('');
    me.startDate = null;
    me.endDate = null;

    this.$dataTableContainer.find('select.SlectBox').each(function() {
      $(this)[0].sumo.selectItem(0);
    });

    //Reset the date pickers to now and now - 1 month.
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    me.$datePickerFrom.datepicker( 'setDate', lastMonth );
    me.$datePickerTo.datepicker( 'setDate', new Date() );

    // Redraw table without filters
    me.dataTable.search('').column().search('').draw();

  };

  TableFilters.prototype.showOrHideClearButton = function($searchBox, length, $clearButton) {

   if(length > 0) {
    $clearButton.show();
   }
   else {
    $clearButton.hide();
   }
  };

  TableFilters.prototype.clearSearchFilter = function($clearButton) {
     // reset text search
    this.$dataTableContainer.find('input[name=search-string]').val('');
    this.searchTable('');
    $clearButton.hide();
  };


  TableFilters.prototype.filterTable = function($filterColumn) {
    var index = $filterColumn.attr('data-filter');
    this.dataTable.column(index).search($filterColumn.val()).draw();
  };
  TableFilters.prototype.searchTable = function(value) {
    this.dataTable.search(value).draw();
  };
  TableFilters.prototype.countFilters = function() {
    var me = this;
    me.appliedFilters = 0;

    // Check the selected dropdowns, and count if not the first option
    me.$dataTableContainer.find('select.js-table-filter').each(function() {
      if ($(this).children(':selected').index() > 0) {
        me.appliedFilters++;
      }
    });

    // Check the multi selected dropdowns, and count all that are selected
    me.$dataTableContainer.find('select.js-table-filter-multi').each(function() {
      var values = $(this).val();
      if (values) {
        for (var i = 0; i < values.length; i++) {
          me.appliedFilters++;
        }
      }
    });

    // Check if there is a text string
    me.$dataTableContainer.find('input[name=search-string]').each(function() {
      if ($(this).val().length > 0) {
        me.appliedFilters++;
      }
    });

    // Check if there is a date string
    me.$dataTableContainer.find('input[name=date-range]').each(function() {
      if ($(this).val().length > 0) {
        me.appliedFilters++;
      }
    });

  };
  /**
   * Updates the filter indicator panel with number of filters selected
  **/
  TableFilters.prototype.updateFilterIndicator = function() {
    var me = this;
    if (me.$dataTableContainer.find('.filters-indicator').length === 0) {
      return;
    }
    // if no filters applied hide the reset link
    if (me.appliedFilters === 0) {
      me.$dataTableContainer.find('.filters-indicator .reset-table-filters').hide();
      me.$dataTableContainer.find('.filters-indicator span').text('No filters selected');
      me.$dataTableContainer.find('.filters-indicator').removeClass('active-filters');
    }
    // if one filter applied
    if (me.appliedFilters === 1) {
      me.$dataTableContainer.find('.filters-indicator .reset-table-filters').text('Remove filter').show();
      me.$dataTableContainer.find('.filters-indicator span').text('1 filter selected');
      me.$dataTableContainer.find('.filters-indicator').addClass('active-filters');
    }
    // if more than one filters applied
    if (me.appliedFilters > 1) {
      me.$dataTableContainer.find('.filters-indicator .reset-table-filters').text('Remove filters').show();
      me.$dataTableContainer.find('.filters-indicator span').text(me.appliedFilters + ' filters selected');
      me.$dataTableContainer.find('.filters-indicator').addClass('active-filters');
    }
  };
  /**
   * Returns the settings for the data table
   * @return {Obj}
  **/
  TableFilters.prototype.settings = function() {
    var settings = {
      ordering: false,
      info: false,
      lengthChange: false,
      searching: true,
      displayLength: this.numRows
    };
    // if we need to change settings based on table type we can specify them in here
    // eg: if(this.$targetTable.is($('table#meter-reading-history-table'))
    // for the moment just return the default
    return settings;
  };



  // add a custom search function for datepickers
  $.fn.dataTable.ext.search.push(function (settings, data, dataIndex){

    var dateString = data[0];
    var date = getDateFromString(dateString);

    //We needed to be able to get the stored start and end date,
    //so I updated this to store a global object with all of our
    //table instances, and then we need to find the instance from
    //the settings property here so that we can fetch the stored
    //date. If you have a better solution I'm all ears! :) - CL
    var $wrap = $(settings.nTable).closest('.data-table-container');
    var thisInstance = settings.sInstance.slice('DataTables_Table_'.length) || false;
    var min = window.sseDataTables[thisInstance] ? window.sseDataTables[thisInstance].startDate : null; //$wrap.find('#date-from div').datepicker('getDate');
    var max = window.sseDataTables[thisInstance] ? window.sseDataTables[thisInstance].endDate : null; //$wrap.find('#date-to div').datepicker('getDate');

    if ((min === null && max === null) ||
        (isNaN(min) && isNaN(max)) ||
        (isNaN(min) && date <= max) ||
        (!min && !max) ||
        (typeof min === 'undefined' && typeof max === 'undefined') ||
        (min <= date && isNaN(max)) ||
        (min <= date && date <= max)) {
      return true;
    }
    return false;
  });


  // initialise when ready
  $(function() {
    var sseDataTables = [];

    // add a custom search function for the multi select filters
    $('select.js-table-filter-multi').each(function() {
      var $me = $(this);
      $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
        var $multiSelectBox = $me,
          values = $multiSelectBox.val(),
          column = $multiSelectBox.attr('data-filter'),
          meterType = data[column];
        if (values) {
          for (var i = 0; i < values.length; i++) {
            if (values[i].toLowerCase().indexOf(meterType.toLowerCase()) > -1) {
              return true;
            }
          }
        }
      });
    });

    // find every instance of a data table and initialise
    $('.data-table-container').each(function(i) {
       sseDataTables[i] = new TableFilters($(this));
    });

    // Using this to stop the jump when moving from a half length
    // page to a full length page.
    $('.paginate_button').on('mouseenter', function(e) {
      storeBotGap = getBottomGap();
    });

    window.sseDataTables = sseDataTables;
  });

})(this, this.document, $);

;
/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/* JSHint: */
/* globals $: false */

 /*
 * Tabbed content (utilises jQuery datatools)
 *
 * 1. Add ul.tabs list to contain the tabs and links
 * 2. Add div.panes to contain the different tab panes of content
 * 3. Inside div.panes separate each tab into it's own child div. The order is important
 *
 * EG
 *	<ul class='tabs'>
 *		<li><a href='javascript:void(0);'>Tab 1 Link</a></li>
 *		<li><a href='javascript:void(0);'>Tab 1 Link</a></li>
 *	</ul>
 *	<div class='panes'>
 *		<div>Tab 1 content</div>
 *		<div>Tab 2 content</div>
 *	</div>
 *
 * ------------------------------------------------------------------------- */

(function(window, document, $, undefined) {
  'use strict';

  $(document).ready(function() {
  	if ($('.main .container ul.tabs').length > 0) {
  		$('.main .container ul.tabs').tabs('div.panes > div');
  	}
  });

})(this, this.document, $);

;

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


;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Module: D3 usage graph
 */
;(function(window, document, undefined){
    'use strict';

    var Modules = window.Modules || function() {};

    Modules.prototype.d3UsageGraph = function() {

        function init(modElement) {
          console.info('D3 usage graph module', modElement);
        }

        init();
    };

    window.Modules = Modules;

})(this.window, this.document);

;
/**
 *  Author: Each&Other
 *  Module: Header
 */
;(function(window, document, undefined){
    'use strict';

    var Modules = window.Modules || function() {};

    var header2017 = Modules.header2017 = function( el ) {
      this.$el = $(el);
      this.init();
    }

    header2017.prototype.init = function(options) {
        var $regionSelector = $('[data-js-module=header2017] .change-user-region select');
        var initialRegion = $regionSelector.val();
        var $subMenuTriggers = this.$el.find('.sub-menu-trigger');
        this._regionChangeListener($regionSelector, initialRegion);
        this._armSubMenuTriggers($subMenuTriggers);
    }

    header2017.prototype._regionChangeListener = function($selector, initialRegion) {
      var me = this;
        $selector.on('change', function() {
            var selectedRegion = $(this).val();

            if (initialRegion == selectedRegion) {
                return false;
            } else {
                me._changeRegion(selectedRegion);
            }
        });
    }

    header2017.prototype._changeRegion = function(newRegion) {
        window.location = newRegion;
    }

    header2017.prototype._armSubMenuTriggers = function($subMenuTriggers) {
      var me = this;
        $subMenuTriggers.click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).hasClass('sub-menu-visible')) {
                me._hideSubMenu($(this));
            } else {
                me._showSubMenu($(this));
            }
        });
    }

    header2017.prototype._showSubMenu = function($trigger) {
        this.$el.find('.sub-menu-visible').removeClass('sub-menu-visible');
        $trigger.addClass('sub-menu-visible');
        $trigger.next('ul').addClass('sub-menu-visible');
        this._armPageDismiss($trigger);
    }

    header2017.prototype._hideSubMenu = function($trigger) {
        $trigger.removeClass('sub-menu-visible');
        $trigger.next('ul').removeClass('sub-menu-visible');
        this._disarmPageDismiss();
    }

    header2017.prototype._armPageDismiss = function($trigger) {
      var me = this;
        $(':not(.nav-with-sub-menu *)').on('click.submenu', function (e) {
            me._hideSubMenu($trigger);
        });
    }

    header2017.prototype._disarmPageDismiss = function() {
        $(':not(.nav-with-sub-menu *)').off('click.submenu');
    }

    window.Modules = Modules;

})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Module: Meter reading 2017
 *
 *  This module covers everything that needs to happen inside the metering
 *  tables. Tabs, filters, show/hide etc
 */

;(function(window, document, undefined){/* globals $ */

    'use strict';

    var Modules = window.Modules || function() {};

    var meterReading = Modules.meterReading = function( el ) {
      this.$el = $(el);
      this.init();
    }

    meterReading.prototype.init = function() {
        this.$tabs = this.$el.find('.meter-reading_tabs li');
        //Only need tab functionality if there are more than one.
        if (this.$tabs.length > 0) {
          this.initTabs();
        }
    }

    meterReading.prototype.initTabs = function() {
      var me = this;

      var $tabContent = this.$el.find('.meter-reading_tab-content');

      //Back-end has the option to add is-active classes to the HTML.
      //If it doesn't then we set the first tab as active.
      if (this.getActives().length === 0) {
        this.$tabs.eq(0).addClass('is-active');
        $tabContent.eq(0).addClass('is-active');
      }

      //Set up a listener for clicks on tabs
      this.$tabs.each(function (idx, tabEl) {
        $(tabEl).on('click', function () {
          // Already active, ignore click
          if ($(this).hasClass('is-active')) {
            return false;
          }

          // index of content = index of tab. No need for linking attributes.
          var $contentToShow = $tabContent.eq(idx);

          // clear other is-active classes and add new ones.
          me.removeActiveStates();
          $(this).addClass('is-active');
          $contentToShow.addClass('is-active');
        });
      });

    }

    meterReading.prototype.getActives = function() {
      return this.$el.find('.meter-reading_tabs li.is-active, .meter-reading_tab-content.is-active');
    }

    meterReading.prototype.removeActiveStates = function() {
      var $actives = this.getActives();
      $actives.removeClass('is-active');
    }

    window.Modules = Modules;
})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *
 *  This instantiates and initialises components, if they're on the page.
 */
;
(function(window, document) { /* globals $ */
  'use strict';

  $(document).ready(function() {
    if (!window.Component) {
      return false;
    }

    var components = new window.Component();
    var componentsOnPage = $('[data-js-component]');
    var component;

    /**
     *  Loop through all components on the page and pass their element through
     *  to their respective JS component. Note that this will run once for each
     *  instance of each component. If there's 10 tab-components on the page, it's
     *  gonna run the tab-component JS component 10 times.
     */
    console.groupCollapsed('Component initialisation');
    for (var i = 0; i < componentsOnPage.length; i++) {
      component = $(componentsOnPage[i]).data('js-component');

      var c = null;
      try {
        c = new Component[component](componentsOnPage[i]);
      } catch (e) {
        console.info(component, 'is not a valid component, moving on...');
        console.error(e);
      }
      if (c) {
        console.groupCollapsed(component + ' component');
        console.info(componentsOnPage[i]);
        console.groupEnd(component + ' component');
      }

    }
    console.groupEnd('Component initialisation');
  });

})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Date getter
 */

/* globals $ */

;
(function(window, document, undefined) {
  'use strict';

  var Component = window.Component || function() {};

  var dateGetter = Component.dateGetter = function(el) {
    this.$el = $(el);
    this.init(el);
    this.fromDate = null;
    this.toDate = null;
    this.fromDateStr = null;
    this.toDateStr = null;
    this.prevDate = -1;
    this.currDate = -1;
  };

  /**
   * DateGetter 'Yo
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  dateGetter.prototype.init = function(options) {
    var dis = this;

    this.$trigger = this.$el.find('.trigger');
    this.initialTriggerText = this.$trigger.text();
    this.$fromBox = this.$el.find('.from-box');
    this.$fromBoxPrefix = this.$fromBox.html();
    this.$toBox = this.$el.find('.to-box');
    this.$toBoxPrefix = this.$toBox.html();
    this.$calPopup = this.$el.find('.cal-popup');
    this.$calContain = this.$calPopup.find('.cal-contain');
    this.$calApply = this.$el.find('.cal-apply');
    this.$calClear = this.$el.find('.cal-clear');
    this.$calContain.datepicker({
      onSelect: this.daySelect.bind(this),
      beforeShowDay: this.highlightDayIfInRange.bind(this)
    });

    // this.$calInstance =

    this.$calApply.on('click', this.applyRange.bind(this));

    this.$calClear.on('click', this.clearRange.bind(this));

    this.$trigger.on('click', function() {

      var isActive = $(this).hasClass('is-active');

      if (isActive) {
        $(this).removeClass('is-active');
        dis.$calPopup.removeClass('is-active');
      } else {
        $(this).addClass('is-active');
        dis.$calPopup.addClass('is-active');
      }

    });

  };







  /**
   * [applyRange description]
   * @return {[type]} [description]
   */
  dateGetter.prototype.applyRange = function() {
    var $dtComponent = this.$el.closest('.c-data-table');
    var $table = $dtComponent.find('.dataTable');
    var dt = $table.DataTable();

    this.$trigger.html(this.fromDateStr + ' - ' + this.toDateStr);
    this.$trigger.removeClass('is-active');
    this.$calPopup.removeClass('is-active');

    this.$el.data('dates', {
      from: this.fromDate,
      to: this.toDate
    });

    dt.draw();
  };





  /**
   * clearRange
   * @return {[type]} [description]
   */
  dateGetter.prototype.clearRange = function() {
    var $dtComponent = this.$el.closest('.c-data-table');
    var $table = $dtComponent.find('.dataTable');
    var dt = $table.DataTable();

    this.$trigger.html(this.initialTriggerText);
    //  this.$trigger.html( this.initialTriggerText ).removeClass('is-active');

    this.$calPopup.addClass('is-in-date-from-mode')
      .removeClass('is-in-date-to-mode')
      .removeClass('has-valid-date-range')
      .removeClass('has-from-date')
      .removeClass('has-to-date')
      .removeClass('forced');
    //  .removeClass('is-active')


    this.$el.data('dates', null);
    this.prevDate = this.currDate = -1;
    this.fromDate = this.toDate = null;

    this.$fromBox.html(this.$fromBoxPrefix).data('selected-date', null);
    this.$toBox.html(this.$toBoxPrefix).data('selected-date', null);

    // turn off the click events, they'll be added later
    this.$fromBox.off('click.fromClick');
    this.$toBox.off('click.toClick');

    //Wipe marked days
    //  this.$calContain.datepicker( 'refresh' );
    this.$calContain.datepicker('setDate', new Date());

    //Update the table filtering
    dt.draw();
  };

  /**
   * [highlightDayIfInRange description]
   * @param  {[type]} date [description]
   * @return {[type]}      [description]
   */
  dateGetter.prototype.highlightDayIfInRange = function(date) {
    var hasRange = this.fromDate !== null && this.toDate !== null;
    var classNames = '';
    var lastDay = new Date(date.getTime());
    var lastDayMonth = lastDay.getMonth();

    lastDay.setDate(lastDay.getDate() + 1);

    if (this.fromDate && this.toDate) {
      classNames += date.getTime() >= this.fromDate.getTime() && date.getTime() <= this.toDate.getTime() ? 'is-in-range' : '';
    }

    //Mark the first day of the month so we can give it border radius
    if (date && date.getDate() === 1) {
      classNames += ' is-first-of-month ';
    }

    //Mark the last day of the month so we can give it border radius
    if (lastDay.getMonth() !== lastDayMonth) {
      classNames += ' is-last-of-month ';
    }

    // Mark the start day of the selected date range
    if (date && this.fromDate) {
      if (date.getTime() === this.fromDate.getTime()) {
        classNames += ' ui-datepicker-current-day from-date ';
      }
    }

    if (date && this.toDate) {
      if (date.getTime() === this.toDate.getTime()) {
        classNames += ' ui-datepicker-current-day to-date ';
      }
    }

    return [true, classNames, ''];
  };








  /**
   * [daySelect description]
   * @param  {[type]} dateText [description]
   * @param  {[type]} obj      [description]
   * @return {[type]}          [description]
   */
  dateGetter.prototype.daySelect = function(dateText, obj) {
    var $dayCells = $(this).find('td a');
    var dis = this;

    //set prev to current before updating current
    this.prevDate = this.currDate;

    //Current date is the one you just clicked - convert to time for comparison w/ min/max
    this.currDate = (new Date(obj.selectedYear, obj.selectedMonth, obj.selectedDay)).getTime();




    //Previous is unset, so we're picking a from date //|| this.prevDate == this.currDate
    if (this.prevDate === -1) {

      this.prevDate = this.fromDate = new Date(this.currDate);

      this.$calPopup
        .removeClass('is-in-date-from-mode')
        .addClass('is-in-date-to-mode');

    } else if (this.fromDate && !this.toDate && !this.$calPopup.hasClass('forced')) { //From date already selected, to date not.

      //Date 1 is the minimum of the selected dates
      this.fromDate = new Date(Math.min(this.prevDate, this.currDate));

      //Date 2 is the maximun of the selected dates
      this.toDate = new Date(Math.max(this.prevDate, this.currDate));

      //Enable toggling of from/to
      this.$fromBox.on('click.fromClick', function() {
        if (dis.fromDate && dis.toDate) {
          dis.$calPopup
            .removeClass('is-in-date-to-mode')
            .addClass('forced')
            .addClass('is-in-date-from-mode');
        } else {
          dis.$calPopup.removeClass('is-in-date-to-mode').addClass('is-in-date-from-mode');
        }
      });
      this.$toBox.on('click.toClick', function() {
        if (dis.fromDate) {
          dis.$calPopup
            .removeClass('is-in-date-from-mode')
            .removeClass('forced')
            .addClass('is-in-date-to-mode');
        }
      });


    } else {
      //Already has full range, do logical update.
      //If mode has been manually set back to from mode, then
      if (this.$calPopup.hasClass('is-in-date-from-mode') && this.$calPopup.hasClass('forced')) {
        // set the to date to null, it's dead to us
        this.toDate = null;
        this.$toBox.html(this.$toBoxPrefix).data('selected-date', null);

        // Update the from date to be the currently chosen date
        this.prevDate = this.fromDate = new Date(this.currDate);

        // Sort out the styling
        this.$calPopup
          .removeClass('is-in-date-from-mode')
          .removeClass('forced')
          .removeClass('has-valid-date-range')
          .removeClass('has-to-date')
          .addClass('is-in-date-to-mode');

        // turn off the click listeners
        this.$fromBox.off('click.fromClick');
        this.$toBox.off('click.toClick');
      } else {

        // as per requirements:
        // if selected date is greater than the from-date then we only update the to-date
        // if selected date is less than the from date then we only update the from-date
        if (this.currDate >= this.fromDate.getTime()) {

          this.toDate = new Date(this.currDate);

          this.$calPopup
            .removeClass('is-in-date-from-mode')
            .addClass('is-in-date-to-mode');

        } else {

          this.fromDate = new Date(this.currDate);

          this.$calPopup
            .removeClass('is-in-date-to-mode')
            .addClass('is-in-date-from-mode');

        }

      }
    }


    //These also get set on the collapsed datepicker element:

    this.fromDateStr = $.datepicker.formatDate('dd/mm/y', this.fromDate, {});
    this.toDateStr = $.datepicker.formatDate('dd/mm/y', this.toDate, {});

    if (this.fromDate) {
      this.$fromBox.html(this.$fromBoxPrefix + ' ' + this.fromDateStr).data('selected-date', this.fromDate);
    }

    if (this.toDate) {
      this.$toBox.html(this.$toBoxPrefix + ' ' + this.toDateStr).data('selected-date', this.toDate);
    }

    /**
     * Sets classes that we use for additional styling on the calendar
     */

    if (this.fromDate && this.toDate) {
      this.$calPopup.addClass('has-valid-date-range');
    } else {
      this.$calPopup.removeClass('has-valid-date-range');
    }

    ////////////////

    if (this.fromDate) {
      this.$calPopup.addClass('has-from-date');
    } else {
      this.$calPopup.removeClass('has-from-date');
    }

    ////////////////

    if (this.toDate) {
      this.$calPopup.addClass('has-to-date');
    } else {
      this.$calPopup.removeClass('has-to-date');
    }

  };


  window.Component = Component;

})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Data table
 */
/* globals $, SelectFx */

;(function(window, document, undefined){
    'use strict';

    var Component = window.Component || function() {};
    var dataTable = Component.dataTable = function( el ) {
      this.$el = $(el);
      this.init();
    };
    var hasDateFilter = false;

    dataTable.prototype.init = function() {
      var $table = this.$el.find('table').first();//There should only be one per component anyway...

      this.$filterWrapper = this.$el.find('.filter-area .filter-wrap');
      this.$filterToggle = this.$el.find('.filter-area .toggle');
      this.$selects = this.$el.find('.filter-area select');

      var me = this;

      if ( $table ) {
        this.$dataTable = $table.DataTable({
          'pageLength': 12,
          'info': false,
          'lengthChange': false,
          'searching': true,
          'ordering': false, //can't use if we have a note row.
          'dateCol': 0
        });
      }

      // Filter show/hide

      if ( this.$filterWrapper && this.$filterToggle ) {
        this.$filterToggle.on('click', function(e) {
          if ( me.$filterWrapper.hasClass('is-visible') ) {
            me.hideFilters(me.$filterWrapper, me.$filterToggle);
          } else {
            me.showFilters(me.$filterWrapper, me.$filterToggle);
          }
        });
      }

      // Filter init

      this.$selects.each(function () {
        var targetCol = $(this).data('target-column');
        var exactMatch = $(this).data('exact');
        var rgx;

        //we replace these in the val so we can still use regex.
        //Feel free to add more to the list as required, but test thoroughly
        var charsToEsc = ['(',')','+',',','-'];

        new SelectFx(this, {
          onChange: function(val) {
            if (exactMatch && val) {
              for (var i = 0; i < charsToEsc.length; i++) {
                val = val.replace(charsToEsc[i], '\\' + charsToEsc[i] );
              }
              rgx = '^(' + val + ')$';//Regex for exact match - case sensitive though...
              me.$dataTable.column( targetCol ).search(rgx , true, false ).draw();
            } else {
              me.$dataTable.column( targetCol ).search(val).draw();
            }
          }});
      });
    };

    dataTable.prototype.showFilters = function($wrap, $switch) {
      $wrap.removeClass('is-hidden');
      $wrap.addClass('is-visible');
      $switch.html( $switch.data('hide-text') );
    };

    dataTable.prototype.hideFilters = function($wrap, $switch) {
      $wrap.addClass('is-hidden');
      $wrap.removeClass('is-visible');
      $switch.html( $switch.data('show-text') );
    };


    /**
     * dateFiltr
     *
     * This is separate to the component and gets pushed to the array of filters
     * that the dataTable uses, We use it for date ranges, but the pattern can be
     * reused for any other data filtering that needs to happen...
     *
     * @param  {[type]} dtSettings  [description]
     * @param  {[type]} rowData     [description]
     * @param  {[type]} tableIdx    [description]
     */
    function dateFiltr(dtSettings, rowData, tableIdx) {
      var $dateRangeCpt = $(dtSettings.nTable).closest('.c-data-table').find('.c-date-getter');

      if ($dateRangeCpt.data('dates') && $dateRangeCpt.data('dates').from && $dateRangeCpt.data('dates').to) {
        var dateRange = $dateRangeCpt.data('dates');
        var rowDate = new Date( rowData[dtSettings.oInit.dateCol] );
        return rowDate >= dateRange.from && rowDate <= dateRange.to;
      }

      return true;
    }


    /**
     * Ensure filter is only pushed to datatables wuntime.
     */
    for (var i = 0; i < $.fn.dataTableExt.afnFiltering.length; i++) {
      if ($.fn.dataTableExt.afnFiltering[i].name === 'dateFiltr') {
        hasDateFilter = true;
      }
    }

    if (!hasDateFilter) {
      $.fn.dataTableExt.afnFiltering.push(dateFiltr);
    }

    window.Component = Component;

})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Modal overlay
 */
(function(window, document) {

  'use strict';

  var Component = window.Component || function() {};



  var modalOverlay = Component.modalOverlay = function( el ) {
    this.$el = $(el);
    this.init();
  }

  /**
   * Get some
   */
  modalOverlay.prototype.init = function(options) {
    var $triggers = $('[data-modal-target]');
    var $killers = $('.js-close-modal');

    var ieDetection = new window.Device.IEDetection();

    this.$allOverlays = $('[data-js-component=modalOverlay]');
    this.ypos = 0;
    this.hijackBackBtn = !ieDetection.isIE8 && !ieDetection.isIE9;
    this.activeOverlay = false;
    this.preventAnimation = false;
    this.disableKeyboardDismiss = false;
    this._armTriggers($triggers);
    this._armKillers($killers);
  }

  /**
   * _activeOverlayTarget - if an active-target is specified this
   * will 'checked' that checkbox target
   */
  modalOverlay.prototype._activeOverlayTarget = function($overlayBtn) {
    var target = $overlayBtn.data('js-active-target');
    if (typeof target !== 'undefined') {
      var activateTarget = $('body').find('#' + target + '-1');
      activateTarget.prop('checked', true);
    }
  }

  /**
   * _showOverlay - does exactly what it says on the tin
   */
  modalOverlay.prototype._showOverlay = function($overlay) {

    var me = this;
    var href = window.location.href;
    // dismiss any modals that are active already.
    if (this.activeOverlay) {
      this.preventAnimation = true;
      history.back();
    } else {
      //Save window position.
      // if(this.ypos === null) {
        this.ypos = $(window).scrollTop();
      // }
    }

    //Umbrella class so we can animate things.
    $('body').addClass('has-overlay');

    //Timeout to hold off on showing the modal until the
    //page content is invisible - else we get an ugly jump
    //to the top when a modal opens.
    //tldr; The timing is sensitive. Don't break it.
    setTimeout(function() {
      //Specifically set the page wrap height so we can prevent over-scrolling.
      //...because VH won't work everywhere.
      $('.page-wrap').height($(window).height() + 'px');

      //make sure other overlays get pushed to the bottom
      me.$allOverlays.removeClass('is-top-most');
      //Show the overlay
      $overlay.addClass('is-visible');
      $overlay.addClass('is-top-most');
      $overlay.removeClass('is-hidden');
      //Use the browser Back button to exit a modal.
      if (me.hijackBackBtn) {

        if(href.indexOf('#modal') === -1) {
          history.pushState(null, '', href + '#modal');
        }

        $(window).one('popstate', function(event) {
          me._hideOverlay($overlay);
        });

      }
      //Oneliners:
      $overlay.find('.js-close-modal').first().focus();
      $(window).scrollTop(0);
      // reset the activeOverlay
      this.activeOverlay = $overlay;

    }, 100); //To match grid-classes.scss for page-wrap transition duration.
  }

  /**
   * _hideOverlay - also does exactly what it says on the tin
   */
  modalOverlay.prototype._hideOverlay = function($overlay) {
    var me = this;
    if (this.preventAnimation) {
      $overlay.removeClass('is-visible');
      this.activeOverlay = false;
      this.preventAnimation = false;
      this.disableKeyboardDismiss = false;
      this._resetForm($overlay);
      return;
    }

    $overlay.addClass('is-hiding');
    $('body').removeClass('has-overlay');
    $('.page-wrap').attr('style', null);
    //Scroll to the position we were at previously
    $(window).scrollTop(this.ypos, 300);

    //This can fire after open and close animations,
    //so it goes here and only fires after the closing animation
    if (Modernizr.cssanimations) {
      $overlay.one('transitionend animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
        if ($overlay.hasClass('is-hiding')) {
          $overlay.removeClass('is-visible');
          $overlay.removeClass('is-top-most');
          $overlay.removeClass('is-hiding');
          me.activeOverlay = false;
          me.disableKeyboardDismiss = false;
          this._resetForm($overlay);
        }
      });
    } else {
      $overlay.removeClass('is-visible');
      $overlay.removeClass('is-top-most');
      $overlay.removeClass('is-hiding');
      me.activeOverlay = false;
      me.disableKeyboardDismiss = false;
      this._resetForm($overlay);
    }

  }

  /**
   * _armTriggers
   *
   * Triggers are elements anywhere on the page that can open an overlay.
   * They need a data attribute that tells them what overlay to open.
   */
  modalOverlay.prototype._armTriggers = function($triggers) {
    var $targetEl;
    var targetName;
    var me = this;

    $triggers.each(function(i, el) {
      $(this).on('click', function(e) {
        e.preventDefault();
        var triggerData = $(this).data('trigger-options');
        targetName = $(this).data('modal-target');
        $targetEl = $('[data-overlay-name="' + targetName + '"]').first();
        if ($targetEl.length) {
          me._showOverlay($targetEl);
          $('[data-overlay-name="' + targetName + '"]').trigger("modalOpen", {
            triggerData: triggerData
          });
        }
      });
    });
  }

  /**
   * _armKillers
   *
   * Modals should always cover the whole window, so we'll assume that
   * you can only click an element inside them to close them.
   */
  modalOverlay.prototype._armKillers = function($killers) {
    var me = this;

    $killers.each(function(i, el) {
      $(this).on('click', function(e) {
        e.preventDefault();
        var modalId = $(this).closest('.c-modal-overlay').data('overlay-name');
        if (me.hijackBackBtn) {
          history.back();
        } else {
          me._hideOverlay($(this).closest('.c-modal-overlay'));
          me._activeOverlayTarget($(this));
        }

        $(window).trigger('modalClose', {
          id: modalId
        });
      });
    });

    //Let users hit Escape to close modals too
    $(document).on('keyup', function(e) {
      if (e.keyCode == 27 && !me.disableKeyboardDismiss) {
        me.disableKeyboardDismiss = true;
        var $openModal = $('.c-modal-overlay.is-visible');
        if ($openModal.length) {
          if (me.hijackBackBtn) {
            history.back();
          } else {
            me._hideOverlay($openModal);
          }
        }
      }
    });
  }

  /*
   * Reset the form in the modal, if it has one.
   */
  modalOverlay.prototype._resetForm = function($overlay) {
    // first reset the form content
    $overlay.find('input').blur();
    if ($overlay.find('form')[0]) {
      $overlay.find('form')[0].reset();
    }
    $overlay.find('.form-response-success, .form-response-fail, .form-dismiss').addClass('is-hidden');
    $overlay.find('.form-wrap, input[type="submit"]').show();
  }



  window.Component = Component;


})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Nps
 */
;
(function(window, document, undefined) {
  'use strict';

  var Component = window.Component || function() {};

  var nps = Component.nps = function(el, widgetEl) {

    this.$el = $(el);

    /*
     * The nps component and the nps widget need a link to each other
     * unfortunately since the nps component is shared across legacy pages
     * and new pages it needs to be initted from oss-enhancements.js, otherwise
     * we end up with multiple inits and therefore multiple submissions of the form (grrrrr).
     * In oss-enhancements.js we pass in the $widget selector. In here we check it's
     * length and init the widget if it's on the page
     */

    this.$widgetEl = $(widgetEl);

    this.settings = {
      sliderDefault: -1,
      feedbackVisible: false,
      postUrl: 'feedback.htm'
    }
    this.init(el);
  }

  nps.prototype.init = function(el) {
    this.bindUiActions();
    this.clearSliders($('.feedback-form').find('.slider-container'));

    if (this.$widgetEl.length) {
      this.initWidget()
    }

  }

  nps.prototype.initWidget = function() {
    this.widget = new Component['npsWidget'](this.$widgetEl, this);
  }

  nps.prototype.bindUiActions = function() {
    var me = this;
    $('#show-feedback').click(function() {
      if (me.settings.feedbackVisible) {
        me.hideFeedback();
      } else {
        me.showFeedback();
      }
    });
    $('.submit-success .close').click(function() {
      me.hideFeedback();
    });
    $('.slider li a').click(function() {
      me.updateSlider($(this));
    });
    $('#submit-feedback').click(function(e) {
      e.preventDefault();
      me.submitFeedback();
    });
  }

  nps.prototype.submitFeedback = function() {
    var me = this;
    var formData = {
      recommendationRating: $("#recommend").val(),
      satisfactionRating: $("#satisfied").val(),
      feedback: $("#comments").val(),
      sourceURL: window.location.href
    };

    if (me.validate(formData)) {
      $.ajax({
        url: me.settings.postUrl,
        type: 'POST',
        async: true,
        dataType: 'json',
        data: formData
      });
      me.showConfirmation();
    }
  }

  nps.prototype.showConfirmation = function() {

    var me = this;

    $('#feedback-container ul.tabs').slideUp('slow');

    $('.feedback-form').slideUp('slow', function() {
      $('.submit-success').slideDown('slow');
      // hide the nps widget if there's one on the page
      if (me.widget) {
        me.widget.hide();
      }
    });
  }

  nps.prototype.updateSlider = function(sliderItem) {
    var sl = sliderItem.closest('.slider');
    var slCtnr = sl.closest('.slider-container');
    //Move the active class to new selection
    sl.children('li').removeClass('active');
    sliderItem.closest('li').addClass('active');
    //Set the value to the selected value
    slCtnr.next('input').val(sliderItem.text());
    sl.find('li a, li').removeClass('redraw');
    slCtnr.removeClass('has-no-selection');
    this.hideError(slCtnr.closest('.panel'));
  }

  nps.prototype.showFeedback = function() {
    this.settings.feedbackVisible = true;
    $('#feedback-container .feedback').slideDown('slow');
    $('#show-feedback').addClass('minus');
  }

  nps.prototype.hideFeedback = function() {
    this.settings.feedbackVisible = false;
    $('#feedback-container .feedback').slideUp('slow');
    $('#show-feedback').removeClass('minus');
  }

  nps.prototype.clearSliders = function(sliders) {
    //Remove values from hidden fields
    sliders.each(function() {
      $(this).next('input').val('');
      $(this).find('.active').removeClass('active');
      $(this).addClass('has-no-selection');
    });
  }

  nps.prototype.validate = function(form) {
    var $slidepanel = {
      recommend: $('#recommend').closest('.panel'),
      satisfied: $('#satisfied').closest('.panel')
    };

    //Just ensure the two sliders have a selected value;
    if (form.recommendationRating && form.satisfactionRating) {
      return true;
    }

    //Validation message for recommendationRating
    $slidepanel.recommend.find('.slider-warning').remove();
    if (form.recommendationRating) {
      this.hideError($slidepanel.recommend);
    } else {
      this.showError($slidepanel.recommend);
    }

    //Validation message for satisfactionRating
    $slidepanel.satisfied.find('.slider-warning').remove();
    if (form.satisfactionRating) {
      this.hideError($slidepanel.satisfied);
    } else {
      this.showError($slidepanel.satisfied);
    }

  }

  nps.prototype.showError = function($panel) {
    var warnMsg = '<p class=\'slider-warning\'>Please select a rating below</p>';
    $panel.addClass('selection-warn');
    $panel.find('h4').after(warnMsg);
  }

  nps.prototype.hideError = function($panel) {
    $panel.removeClass('selection-warn');
    $panel.find('.slider-warning').remove();
  }

  window.Component = Component;


})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Nps widget
 */
;(function(window, document, undefined) {
  'use strict';

  /*
  * The nps widget is initted from the nps component
  * See nps component for details
  */

  var Component = window.Component || function() {};

  var npsWidget = Component.npsWidget = function(el, nps) {
    this.$el = $(el);
    this.nps = nps;
    this.hideFor = 4000;
    this.transitionFor = 1500;
    this.init();
  }

  npsWidget.prototype.init = function() {
    var me = this;
    var callback = function() {
      setTimeout(function() {
        me.slideIn();
      }, me.hideFor)

    };
    this.scrollTo(this.$el.parent(), callback);
    this.bindEvents();
  }

  npsWidget.prototype.slideIn = function() {
    var me = this;

    var windowWidth = $(window).width();
    var panelLeftPos = this.$el.parent().offset().left;
    var panelWidth = this.$el.parent().width();

    var widgetXPos = this.calculateInitialXPos(windowWidth, panelLeftPos, panelWidth)
    var widgetFinalXPos = this.calculateFinalXPos(windowWidth, panelLeftPos, panelWidth);

    this.$el.css({right: widgetXPos});
    this.$el.removeClass('-is-hidden').addClass('-is-visible');
    this.$el.velocity({
        translateX: widgetFinalXPos
    }, {
      duration: me.transitionFor,
      easing: [ 250, 15 ]
    });
  }

  npsWidget.prototype.calculateInitialXPos = function(windowWidth, panelLeftPos, panelWidth) {

    var widgetWidth = this.$el.width();
    var panelRightPos = panelLeftPos + panelWidth;
    var widgetXPos = ((windowWidth - panelRightPos) * -1) - widgetWidth;

    return widgetXPos;
  }

  npsWidget.prototype.calculateFinalXPos = function(windowWidth, panelLeftPos, panelWidth) {
    var panelRightPos = panelLeftPos + panelWidth;
    var widgetXPos = (windowWidth - panelRightPos + 15) * -1;
    return widgetXPos;
  }

  npsWidget.prototype.hide = function() {
    this.$el.removeClass('-is-visible').addClass('-is-hidden');
  }

  npsWidget.prototype.bindEvents = function() {
    var me = this;
    this.$el.find('a').on('click', function(e) {
      me.scrollTo(me.nps.$el);
      me.openNPSComponent();
      e.preventDefault();
    })
  }

  npsWidget.prototype.scrollTo = function($el, callback) {
    var ypos = $el.offset().top;
    $('html, body').animate({
      scrollTop: ypos
    }, 'slow', callback);
  }

  npsWidget.prototype.openNPSComponent = function() {
    this.nps.showFeedback();
  }

  window.Component = Component;

})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Tool tip
 */

/* globals $ */

;(function(window, document, undefined){
    'use strict';

    var Component = window.Component || function() {};

    var toolTip = Component.toolTip = function( el ) {
      this.$el = $(el);
      this.init(el);
    };

    toolTip.prototype.init = function(el) {
      $(el).prev('.js-tooltip-trigger').on('click', this.toggleTip.bind(el));
      $(el).on('click', this.toggleTip.bind(el));
    };

    toolTip.prototype.toggleTip = function (evt) {
      evt.preventDefault();

      var targEl = evt.target;
      var isTipContent = $(targEl).closest('.tooltip-content').length && $(targEl).context.tagName.toLowerCase() !== 'i';

      //Don't act when content was the target
      if ( isTipContent ) {
        return false;
      }

      if ($(this).hasClass('is-visible')) {
        $(this).removeClass('is-visible');
        return;
      }

      //Close any other tips.
      $('.c-tool-tip.is-visible').removeClass('is-visible');
      $('.c-meter-reading-box.has-active-tool-tip').removeClass('has-active-tool-tip');

      //Show this one.
      $(this).addClass('is-visible');

      //if it's in a meter reading box we have z index issues... add a class.
      if ( $(this).closest('.c-meter-reading-box').length ) {
        $(this).closest('.c-meter-reading-box').addClass('has-active-tool-tip');
      }

    };

    window.Component = Component;

})(this.window, this.document);

;
/**
 *  SSE Airtricity OSS - 2016
 *  Author: Each&Other
 *  Component: Select Input
 *  /js/vendor/selectFx.js
 */
;
(function(window, document, $, undefined) {
    'use strict';

    var Component = window.Component || function() {};

    var inputSelect = Component.inputSelect = function( el ) {
      this.$el = $(el);
      this.init(el);
    };

    inputSelect.prototype.init = function(el) {
      var $selectEl = $(el).find('select');

      var customSelect = new SelectFx($selectEl[0], {
          onChange: function(val) {
              // trigger change event on the underlying select
              // so validation will work on change
              $selectEl.trigger('change');
          }
      });
      $selectEl.on('data-refresh', function() {
          customSelect._refresh();
      });

      //attachKeyboardEvents(customSelect, $(this));
    };

    /*
    // Get the options associated with this select
    // and stick them into an array
    */
    inputSelect.prototype.getOptionsArray = function(customSelect) {
        var options = customSelect.el.options;
        var optionsArray = [];

        for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            // if the current option is default selected and disabled
            // we assume it's the placeholder and don't add to the array
            if (!(opt.defaultSelected && opt.disabled)) {
                var obj = {
                    key: opt.textContent,
                    value: opt
                };
                optionsArray.push(obj);
            }
        }
        return optionsArray;
    };

    /*
    // Attach an event listener to the keydown event
    // and change the select option based on keyboard input
    */
    inputSelect.prototype.attachKeyboardEvents = function(customSelect, $this) {

        var optionsArray = getOptionsArray(customSelect);

        // extra keyboard navigation events
        customSelect.selEl.addEventListener('keydown', function(ev) {
            var keyCode = ev.keyCode || ev.which;
            var selectedOptionIndex = -1;
            switch (keyCode) {
                // a
                case 65:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('a', optionsArray);
                    break;
                // b
                case 66:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('b', optionsArray);
                    break;
                // c
                case 67:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('c', optionsArray);
                    break;
                // d
                case 68:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('d', optionsArray);
                    break;
                // e
                case 69:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('e', optionsArray);
                    break;
                // f
                case 70:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('f', optionsArray);
                    break;
                // g
                case 71:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('g', optionsArray);
                    break;
                // h
                case 72:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('h', optionsArray);
                    break;
                // i
                case 73:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('i', optionsArray);
                    break;
                // j
                case 74:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('j', optionsArray);
                    break;
                // k
                case 75:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('k', optionsArray);
                    break;
                // l
                case 76:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('l', optionsArray);
                    break;
                // m
                case 77:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('m', optionsArray);
                    break;
                // n
                case 78:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('n', optionsArray);
                    break;
                // o
                case 79:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('o', optionsArray);
                    break;
                // p
                case 80:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('p', optionsArray);
                    break;
                // q
                case 81:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('q', optionsArray);
                    break;
                // r
                case 82:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('r', optionsArray);
                    break;
                // s
                case 83:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('s', optionsArray);
                    break;
                // t
                case 84:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('t', optionsArray);
                    break;
                // u
                case 85:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('u', optionsArray);
                    break;
                // v
                case 86:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('v', optionsArray);
                    break;
                // w
                case 87:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('w', optionsArray);
                    break;
                // x
                case 88:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('x', optionsArray);
                    break;
                // y
                case 89:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('y', optionsArray);
                    break;
                // z
                case 90:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('z', optionsArray);
                    break;
            }

            if(selectedOptionIndex > -1) {
                customSelect._removeFocus();
                customSelect.preSelCurrent = selectedOptionIndex

                classie.add(customSelect.selOpts[customSelect.preSelCurrent], 'cs-focus' );

                var $target = $this.find('.cs-options ul li:nth-child('+ parseInt(customSelect.preSelCurrent + 1) +')');
                var targetTop = $target.position().top;
                console.log(targetTop);
                if(targetTop !== 50) {
                    $this.find('.cs-options').animate({
                        scrollTop: targetTop - 50
                    }, 'fast');
                }

            }

            return false;
        });
    };

    /*
    // Loop through the options array and get the first option
    // that's first  character matches the char param
    */
    inputSelect.prototype.getFirstOptionByCharacter = function(char, optionsArray) {
        var selectedOptionIndex = -1;
        for(var i = 0; i<optionsArray.length; i++) {
            var opt = optionsArray[i];
            if(opt.key.charAt(0).toLowerCase() === char) {
                selectedOptionIndex = i;
                break;
            }
        }
        return selectedOptionIndex;
    };

    window.Component = Component;

})(this.window, this.document, jQuery);

;
/* globals $, d3, anime */

/**
 *  SSE Airtricity OSS
 *  Author: Conor Luddy
 *  Component: D3 usage graph
 *  Requires: D3, AnimeJs
 *
 * ToDo:
 * - Axis labels
 * - Gas lines
 * - Data groups
 * - Background grid
 * - Data
 *
 */

;
(function(window, document, undefined) {
  'use strict';

  var Component = window.Component || function() {};

  var d3UsageGraph = Component.d3UsageGraph = function(el) {
    this.el = el;
    this.$el = $(el);
    this.incomingDateFormat = '%d %b %Y';
    this.outputDateFormat = d3.timeFormat('%d %b %Y');
    this.dateKey = 'date';
    this.usageKey = 'value';
    this.meterId = 'id';
    this.curveType = d3.curveCatmullRom;
    this.chart = {};
    this.dataSeries = [];

    this.colours = {
      elec: '#7DC242',
      elecFaded: '#D8ECC7',
      elecOpaque: 'rgba(125, 194, 66, 0.2)',
      gas: '#004687',
      gasFaded: '#B3C8DA',
      gasOpaque: 'rgba(0, 70, 135, 0.2)',
      axis: '#ECEAE6'
    };


    this.layout = {

      //The actual dimensions of the part the lines go in. Subsection of D3 container.
      graphWidth: 695,
      graphHeight: 230,

      // The space around the graph, where keys, axis labels, and other randon articles reside.
      padding: {
        T: 80,
        B: 50,
        L: 45,
        R: 0
      },

      width: el.offsetWidth || 745, //offsetWidth returns 0 when element hidden (e.g. Inside tab content)
      height: el.offsetHeight || 350 //offsetWidth returns 0 when element hidden (e.g. Inside tab content)

    };

    ////////////////
    this.init(el);
    ////////////////

  };

  /**
   * init
   * @param  {[type]} el - component DOM element
   * @return {[type]}    [description]
   */
  d3UsageGraph.prototype.init = function(el) {
    var dis = this;

    this.data = this.getData(el); //get JSON from the page
    this.data = this.parseReplaceData(this.data); //convert strings to useful types
    this.data = this.sortData(this.dateKey, this.data); //sort the data by date
    this.dataGrouped = this.groupData('id', this.data); //split gas and elec into groups
    this.gasData = this.getGasData();
    this.elecData = this.getElecData();
    this.elecDataSimplified = this.getElecDataSimplified();
    this.gasDataSimplified = this.getGasDataSimplified();
    this.chart = this.createD3Chart(el); //build a chart
    this.hasElec = this.elecData.length ? true : false;
    this.hasGas = this.gasData.length ? true : false;

    this.createChart();

    this.chartTip = this.drawToolTip(this.chart);
    this.chartTipContents = this.drawToolTipContents(this.chartTip);

    this.renderedLegends = this.drawLegend(this.chart);

    this.layout.width = this.layout.graphWidth + this.layout.padding.L + this.layout.padding.R;
    this.layout.height = this.layout.graphHeight + this.layout.padding.T + this.layout.padding.B;

    // create legend listeners and activate first series
    this.createLegendListeners(this.el);
    this.createSeriesLineListeners(this.el);
    this.activateSeries(this.dataSeries[0].id);

    //Animate all the things
    if (el.querySelectorAll) {
      this.pollTilVisible = window.setInterval(function() {
        dis.visibilityCheck();
      }, 500);
    }
  };



  ////////////////////////////////////////////////////////////////////////////
  // Methonds for data manipulation //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  d3UsageGraph.prototype.createChart = function() {

    var me = this;
    var ledge;
    var x = 85;
    var y = 40;

    if(this.hasElec) {
      // create a scale based on all the elec data (1 or many meters)
      this.scaleElec = this.createLinearScale(this.usageKey, this.elecDataSimplified, [this.layout.padding.T, this.layout.graphHeight]);
      this.dateScaleElec = this.createTimeScale(this.dateKey, this.elecDataSimplified, [this.layout.padding.L, this.layout.graphWidth]); //Params to match whatever the JSON data key is. (not using grouped data here, so we can scale from ALL dates in data)
      this.xAxisElec = this.createXAxis(this.dateScaleElec);
      this.yAxisElec = this.createYAxis(this.scaleElec, 'elec');
      this.xAxisElecSvg = this.drawAxis(this.chart, this.xAxisElec, 'translate(0, ' + this.layout.graphHeight + ')', 'x', 'elec');
      this.yAxisElecSvg = this.drawAxis(this.chart, this.yAxisElec, 'translate(' + this.layout.padding.L + ', 0)', 'y', 'elec');
      this.lineGeneratorElec = this.createLineGenerator(this.dateScaleElec, this.dateKey, this.scaleElec, this.usageKey); //xxyy
    }
    if(this.hasGas) {
      this.scaleGas = this.createLinearScale(this.usageKey, this.gasDataSimplified, [this.layout.padding.T, this.layout.graphHeight]); //Params to match whatever the JSON data key is.
      this.dateScaleGas = this.createTimeScale(this.dateKey, this.gasDataSimplified, [this.layout.padding.L, this.layout.graphWidth]); //Params to match whatever the JSON data key is. (not using grouped data here, so we can scale from ALL dates in data)
      this.xAxisGas = this.createXAxis(this.dateScaleGas);
      this.yAxisGas = this.createYAxis(this.scaleGas, 'gas');
      this.xAxisGasSvg = this.drawAxis(this.chart, this.xAxisGas, 'translate(0, ' + this.layout.graphHeight + ')', 'x', 'gas');
      this.yAxisGasSvg = this.drawAxis(this.chart, this.yAxisGas, 'translate(' + this.layout.padding.L + ', 0)', 'y', 'gas');
      this.lineGeneratorGas = this.createLineGenerator(this.dateScaleGas, this.dateKey, this.scaleGas, this.usageKey); //xxyy
    }
    this.hoverCircle = this.drawHoverCircle(this.chart);

    this.dataGrouped.forEach(function(d) {
      // d id grouped by meter id
      var series = {
        'id': d.key,
        'isSelected': false
      };

      if (d.values[0].type.toLowerCase() === 'gas') {
        series.type = 'gas';
        series.points = me.drawPoints(me.chart, d.values, me.dateScaleGas, me.scaleGas, me.colours.gasFaded, 'chart-dots-gas');
        series.lines = me.drawLine(me.chart, d.values, me.lineGeneratorGas, me.colours.gasFaded, 'chart-line-gas');
        series.legend = {
          'x': x,
          'y': y,
          'id': d.key,
          'title': 'Gas usage, m3/day',
          'colour': me.colours.gasFaded,
          'activeColour': me.colours.gas,
          'type': 'gas'
        };
      }
      else {
        series.type = 'elec';
        series.points = me.drawPoints(me.chart, d.values, me.dateScaleElec, me.scaleElec, me.colours.elecFaded, 'chart-dots-elec');
        series.lines = me.drawLine(me.chart, d.values, me.lineGeneratorElec, me.colours.elecFaded, 'chart-line-elec');
        series.legend = {
          'x': x,
          'y': y,
          'id': d.key,
          'title': 'Electricity ' + d.values[0].type + ' usage, kWh/day',
          'colour': me.colours.elecFaded,
          'activeColour': me.colours.elec,
          'type': 'elec'
        };
      }
      me.dataSeries.push(series);
    });

    if(this.hasElec) {
      //Save the animations to play later instead of autoplay. We'll prob have to escape this for IE
      this.lineAnimationsElec = this.animateLines(this.el.querySelectorAll('.chart-line-elec'));
      this.dotAnimationsElec = this.animateDots(this.el.querySelectorAll('.chart-dots-elec'));
      // remove the unwanted axis labels
      this.removeAxisLabels('elec', 'x');
      this.removeAxisLabels('elec', 'y');
    }
    if(this.hasGas) {
      this.lineAnimationsGas = this.animateLines(this.el.querySelectorAll('.chart-line-gas'));
      this.dotAnimationsGas = this.animateDots(this.el.querySelectorAll('.chart-dots-gas'));
      this.removeAxisLabels('gas', 'x');
      this.removeAxisLabels('gas', 'y');
    }

  }

  /**
   * getData
   * @param  {[type]} el - component DOM element
   * @return {[type]}    [description]
   */
  d3UsageGraph.prototype.getData = function(el) {
    var usageData;
    var usageKey = this.usageKey;
    //Check we have data attribute with data
    if ($(el).find('input')) {
      usageData = $(el).find('input').data('usage');
      //Make sure we have what we need
      if (typeof usageData === 'object' && usageData.data && usageData.data.length) {
        //Filter out items that don't have a kwh (e.g. 'pending' or 'rejected');
        //if data from back-end doesn't include this or units then we can drop this.
        return usageData.data.filter(function(d) {
          return d[usageKey].indexOf('kWh') > -1 || d[usageKey].indexOf('m3') > -1;
        });
      }
    }

    ////////////////
    console.warn('You ain\'t got no data...');
    return;
  };


  /**
   * getElecData
   * @param
   * @return {[type]} array - data
   */
  d3UsageGraph.prototype.getElecData = function() {
    var data = [];
    for (var i = 0; i < this.dataGrouped.length; i++) {
      // an electricity meter is any meter that is not gas
      if (this.dataGrouped[i].values[0].type !== 'Gas') {
        data.push(this.dataGrouped[i]);
      }
    }
    return data;
  }

  /**
   * getGasData
   * @param
   * @return {[type]} array - data
   */
  d3UsageGraph.prototype.getGasData = function() {
    var data = [];
    for (var i = 0; i < this.dataGrouped.length; i++) {
      // an electricity meter is any meter that is not gas
      if (this.dataGrouped[i].values[0].type === 'Gas') {
        data.push(this.dataGrouped[i]);
      }
    }
    return data;
  }

  /**
   * getElecDataSimplified
   * @param
   * @return {[type]} array - data
   */
  d3UsageGraph.prototype.getElecDataSimplified = function() {
    var data;
    var values = []
    var dates = [];
    var objs = [];
    for (var i = 0; i < this.elecData.length; i++) {
      var v = this.elecData[i].values;
      for (var j = 0; j < v.length; j++) {
        values.push(v[j].value);
        dates.push(v[j].date);
        objs.push({
          'value': v[j].value,
          'date': v[j].date,
          'type': v[j].type,
          'reading': v[j].reading,
          'reading-type': v[j]['reading-type'],
          'id': v[j].id
        });
      }
    }
    data = {
      values: values,
      dates: dates,
      objects: objs
    }
    return data;
  }

  /**
   * getGasDataSimplified
   * @param
   * @return {[type]} array - data
   */
  d3UsageGraph.prototype.getGasDataSimplified = function() {
    var data;
    var values = []
    var dates = [];
    var objs = [];
    for (var i = 0; i < this.gasData.length; i++) {
      var v = this.gasData[i].values;
      for (var j = 0; j < v.length; j++) {
        values.push(v[j].value);
        dates.push(v[j].date);
        objs.push({
          'value': v[j].value,
          'date': v[j].date,
          'type': v[j].type,
          'reading': v[j].reading,
          'reading-type': v[j]['reading-type'],
          'id': v[j].id
        });
      }
    }
    data = {
      values: values,
      dates: dates,
      objects: objs
    }
    return data;
  }


  /**
   * parseData
   *
   * We need ints and dates instead of strings and strings.
   *
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.parseReplaceData = function(data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][this.dateKey]) {
        data[i][this.dateKey] = this.parseTime(data[i][this.dateKey]);
      }
      if (data[i][this.usageKey]) {
        data[i][this.usageKey] = parseInt(data[i][this.usageKey]);
      }
    }

    return data;
  };


  /**
   * parseDate
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.parseTime = function(timeStr) {
    var parseTime = d3.timeParse(this.incomingDateFormat);
    return parseTime(timeStr);
  };


  /**
   * groupData
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  d3UsageGraph.prototype.groupData = function(key, data) {
    var sort = d3.nest()
      .key(function(d) {
        return d[key];
      })
      .entries(data);

    return sort;
  };



  /**
   * sortData
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  d3UsageGraph.prototype.sortData = function(key, data) {
    if (typeof data === 'object') {
      return data.sort(function(a, b) {
        return a[key] - b[key];
      });
    }

    console.warn('Data wasn\'t an array');
    return data;
  };






  ////////////////////////////////////////////////////////////////////////////
  // Methonds to create D3 elements //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////




  /**
   * createD3Chart
   * @param  {[type]} el - component DOM element
   * @return {[type]}    [description]
   */
  d3UsageGraph.prototype.createD3Chart = function(el) {
    var chart = d3.select($(el).find('.chart')[0]);

    return chart.append('svg:svg')
      .attr('width', this.layout.width)
      .attr('height', this.layout.height);
  };

  /**
   * createXAxis
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.createXAxis = function(scale) {
    return d3.axisBottom(scale)
      .tickSizeInner(-(this.layout.graphHeight - this.layout.padding.T))
      // .tickArguments([d3.timeMonth.every(3)])
      //.tickArguments([d3.timeMonth])
      .tickFormat(d3.timeFormat('%b\'%y'))
      .tickPadding(10);
  };

  /**
   * createYAxis
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.createYAxis = function(scale, type) {
    //var frmt = type === 'elec' ? d3.format('.1s') : d3.format('.1s');
    return d3.axisLeft(scale)
      .tickSizeInner(-(this.layout.graphWidth))
      .tickArguments([4])
      //.tickFormat(frmt)
      .tickPadding(10);
  };

  /**
   * createLinearScale
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.createLinearScale = function(key, data, range) {

    if (key) {

      var min = d3.min(data.values);
      var max = d3.max(data.values);

      var base;
      var maxTh = max.toString().length; //th as in tenTH, hundredTH, thousandTH
      var minTh = min.toString().length; //th as in tenTH, hundredTH, thousandTH
      var roundedUpMax = max;
      var roundedDownMin = min;
      var i;

      //TODO comments :p

      if (typeof max === 'number') {
        base = 1;
        for (i = 1; i < maxTh; i++) {
          base *= 10;
        }
        roundedUpMax = max + (base - (max % base));
      }

      if (typeof min === 'number') {
        base = 1;
        for (i = 1; i < minTh; i++) {
          base *= 10;
        }

        roundedDownMin = min - (min % base);

        if (min % base === 0) {
          roundedDownMin -= base / 10;
        }
      }

      return d3.scaleLinear().domain([roundedUpMax, roundedDownMin]).range(range);

    }

    return;
  };


  /**
   * createTimeScale
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.createTimeScale = function(key, data, range) {
    var date;
    var min;
    var max;

    if (key) {
      min = new Date(d3.min(data.dates));
      max = new Date(d3.max(data.dates));

      date = d3.scaleTime().domain([min, max]).range(range);

      return date;
    }
    return;
  };

  /**
   * createLineGenerator
   *
   * Make sure you're passing the correct order of params in here.
   *
   * @param  {[type]} xScale [description]
   * @param  {[type]} xKey   [description]
   * @param  {[type]} yScale [description]
   * @param  {[type]} yKey   [description]
   * @return {[type]}        [description]
   */
  d3UsageGraph.prototype.createLineGenerator = function(xScale, xKey, yScale, yKey) {
    return d3.line()
      .x(function(d) {
        return xScale(d[xKey]);
      })
      .y(function(d) {
        return yScale(d[yKey]);
      })
      .curve(this.curveType);
  };








  ////////////////////////////////////////////////////////////////////////////
  // Methods to draw tings     ///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////








  /**
   * drawAxis
   * @param  {[type]} axis [description]
   * @return {[type]}      [description]
   */
  d3UsageGraph.prototype.drawAxis = function(chart, axis, translation, axisType, chartType) {
    return chart.append('svg:g')
      .attr('class', 'axis ' + axisType + ' ' + chartType)
      .attr('transform', translation ? translation : 'transform(0,0)')
      .call(axis);
  };

  /**
   * removeAxisLabels
   * @param {[type]} chart type (elec or gas)
   * @param {[axis]} x or y
   * @return
   */
  d3UsageGraph.prototype.removeAxisLabels = function(type, axis) {

    var typeToRemove = '.' + type;
    var axisToRemove = '.' + axis;
    var removeSelector = ".axis" + typeToRemove + axisToRemove + " .tick text";

    var removeX = function(sel) {
      d3.selectAll(sel)
        .attr('class', function(d, i) {
          if ((i + 1) % 3 !== 0 || i === 0) {
            d3.select(this).remove();
          }
        });
    };

    if (axis === 'x') {
      removeX(removeSelector);
    }

    if (axis === 'y') {

    }


  };






  /**
   * drawLine
   * @param  {[type]} axis [description]
   * @return {[type]}      [description]
   */
  d3UsageGraph.prototype.drawLine = function(chart, data, lineGenerator, colour, className) {
    return chart.append('path')
      .data([data])
      .attr('d', lineGenerator)
      .attr('stroke', colour)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round')
      .attr('class', className);
  };


  /**
   * drawPoints
   * @param  {[type]} axis [description]
   * @return {[type]}      [description]
   */
  d3UsageGraph.prototype.drawPoints = function(chart, data, xScale, yScale, colour, className) {
    var showTooltip = this.showTooltip.bind(this);

    return chart.selectAll('dot')
      .data(data)
      .enter().append('circle')
      .attr('r', 6)
      .attr('fill', colour)
      .attr('cx', function(d) {
        return xScale(d.date);
      })
      .attr('cy', function(d) {
        return yScale(d.value);
      })
      .attr('class', className)
      .on('mouseover', function(d, i) {
        showTooltip(this, d, i);
      });
  };

  /**
   * drawHoverCircle
   * draws Hover Circle
   * @param  {[type]} chart [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.drawHoverCircle = function(chart) {
    return chart.append('g')
      .append('circle')
      .style('opacity', '0')
      .style('stroke-width', '1')
      .attr('class', 'hover-circle')
      .attr('r', 9);
  };

  /**
   * drawToolTip
   * draws ToolTip
   * @param  {[type]} chart [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.drawToolTip = function(chart) {
    var tipWrap = chart.append('g').style('opacity', 0);

    //If we return the appended rect, we can't put text into it :)
    tipWrap.append('rect')
      .style('fill', '#f1f1f1')
      .attr('class', 'chart-tip')
      .attr('width', 200)
      .attr('height', 75);

    return tipWrap;
  };




  /**
   * drawToolTipContents
   * draws ToolTip
   * @param  {[type]} chart [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.drawToolTipContents = function(tooltip) {
    // https://stackoverflow.com/questions/12922350/why-doesnt-the-text-in-svg-show-up
    var lineHeight = 20;
    var fontSize = '12px';
    var fontWeight = 500;

    tooltip.attr('font-size', fontSize);

    //Labels are 'hardcoded'...
    tooltip.append('text').text('Date:').attr('x', 10).attr('y', lineHeight * 1).attr('font-weight', fontWeight);
    tooltip.append('text').text('Average daily usage:').attr('x', 10).attr('y', lineHeight * 2).attr('font-weight', fontWeight);
    tooltip.append('text').text('Meter reading:').attr('x', 10).attr('y', lineHeight * 3).attr('font-weight', fontWeight);

    //...but values are exposed so we can hook into them
    this.tipText = {
      date: tooltip.append('text').text('x').attr('x', 42).attr('y', lineHeight * 1),
      usage: tooltip.append('text').text('x').attr('x', 124).attr('y', lineHeight * 2),
      reading: tooltip.append('text').text('x').attr('x', 92).attr('y', lineHeight * 3)
    };

    return tooltip;
  };




  /**
   * DrawLegend
   * @param  {[type]} chart [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.drawLegend = function(chart) {
    var me = this;
    var lineHeight = 20;
    var fontSize = '14px';
    var fontWeight = 300;
    var container = chart.append('g').style('cursor', 'pointer').attr('class', 'legends').attr('y', 0);
    var spaceFromText = 10;
    var lineWidth = 30;
    var nextOffset = 0;
    var lineCount = 0;
    var xOrigin = this.dataSeries[0].legend.x || 0;
    var x = xOrigin;
    var y = this.dataSeries[0].legend.y || 0;

    var containers = [];

    this.dataSeries.forEach(function(series, i) {
      var legendContainer = container.append('g')
        .attr('class', 'legend')
        .attr('id', 'legend-' + series.id);
      var text = legendContainer.append('text');
      var circle = legendContainer.append('circle');
      var rect = legendContainer.append('rect');

      text.text(series.legend.title)
        .attr('x', x)
        .attr('y', y)
        .attr('font-weight', fontWeight)
        .attr('font-size', fontSize)
        .attr('color', series.legend.colour);

      circle.attr('r', 4)
        .attr('transform', 'translate(' + (x - (spaceFromText + lineWidth / 2)) + ',' + (y - 3.75) + ')')
        .attr('fill', series.legend.colour);

      rect.attr('width', 30)
        .attr('height', 2)
        .attr('transform', 'translate(' + (x - spaceFromText - lineWidth) + ',' + (y - 5) + ')')
        .attr('fill', series.legend.colour);

      var legendEl = document.getElementById('legend-' + series.id);
      var legendRect = legendEl.getBoundingClientRect();

      nextOffset = legendRect.width + 30;

      if ((x + nextOffset - 30) > me.layout.graphWidth && i > 0) {
        x = xOrigin;
        y += lineHeight;
        lineCount ++;

        text.attr('x', x)
          .attr('y', y);
        container.attr('transform', 'translate(0, ' + (lineCount * -10) + ')');
        circle.attr('transform', 'translate(' + (x - (spaceFromText + lineWidth / 2)) + ',' + (y - 3.75) + ')');
        rect.attr('transform', 'translate(' + (x - spaceFromText - lineWidth) + ',' + (y - 5) + ')');

        x += nextOffset;
      } else {
        x += nextOffset;
      }

      series.renderedLegend = {
        'container': legendContainer,
        'circle': circle,
        'rect': rect
      };

      containers.push(container);
    });
    return containers;
  };





  ////////////////////////////////////////////////////////////////////////////
  // Methods to handle events ////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////




  /**
   * createLegendListener
   * @param  {[type]} ledge [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.createLegendListeners = function() {
    var me = this;
    this.dataSeries.forEach(function(series) {
      series.renderedLegend.container.on('click', function() {
        me.activateSeries(series.id);
      });
    });
  };

  /**
   * createSeriesLineListeners
   * @param  {[type]} ledge [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.createSeriesLineListeners = function() {
    var me = this;
    this.dataSeries.forEach(function(series) {
      series.lines.on('click', function() {
        me.activateSeries(series.id);
      });
      series.points.on('click', function() {
        me.activateSeries(series.id);
      });
    });
  };

  d3UsageGraph.prototype.activateSeries = function(id) {
    var me = this;
    this.dataSeries.forEach(function(series) {
      if (series.id == id) {
        // Turn it on
        // Change axis
        if (series.type == 'gas') {
          me.xAxisElecSvg.style('display', 'none');
          me.yAxisElecSvg.style('display', 'none');
          me.xAxisGasSvg.style('display', 'inherit');
          me.yAxisGasSvg.style('display', 'inherit');
          me.hoverCircle.style('fill', me.colours.gasOpaque)
            .style('stroke', me.colours.gas);
        } else {
          me.xAxisGasSvg.style('display', 'none');
          me.yAxisGasSvg.style('display', 'none');
          me.xAxisElecSvg.style('display', 'inherit');
          me.yAxisElecSvg.style('display', 'inherit');
          me.hoverCircle.style('fill', me.colours.elecOpaque)
            .style('stroke', me.colours.elec);
        }

        series.renderedLegend.circle.attr('fill', series.legend.activeColour);
        series.renderedLegend.rect.attr('fill', series.legend.activeColour);
        series.points.attr('fill', series.legend.activeColour);
        series.lines.attr('stroke', series.legend.activeColour);

        series.isSelected = true;
      } else {
        // Turn it off
        series.renderedLegend.circle.attr('fill', series.legend.colour);
        series.renderedLegend.rect.attr('fill', series.legend.colour);
        series.points.attr('fill', series.legend.colour);
        series.lines.attr('stroke', series.legend.colour);

        series.isSelected = false;
      }
    });
  };

  d3UsageGraph.prototype.mouseMoveElec = function(rect) {
    this.mouseMove(rect, 'elec');
  }

  d3UsageGraph.prototype.mouseMoveGas = function(rect) {
    this.mouseMove(rect, 'gas');
  }

  /**
   * showTooltip
   * @param  {[type]} element returned from svg click event
   * @return {[type]}
   */
  d3UsageGraph.prototype.showTooltip = function(el, data, index) {

    // default to elec
    var unit = 'kWh';

    // should only show tooltip if the clicked point is of the active meter
    var gasIsActive = this.activeType === 'gas';
    var isClickable = (gasIsActive && data.type === 'Gas') || (!gasIsActive && data.type !== 'Gas');

    if (gasIsActive) {
      unit = 'm3';
    }

    // if this fule type isn't active, do nothing
    if (!isClickable)
      return;

    // else do all this stuff
    this.chartTip.style('opacity', 'inherit');
    this.hoverCircle.style('opacity', 'inherit');

    var xPos = el.cx.baseVal.value;
    var yPos = el.cy.baseVal.value;

    var diffPointX = parseInt(this.hoverCircle.node().dataset.xpos) !== Math.round(xPos);
    var diffPointY = parseInt(this.hoverCircle.node().dataset.ypos) !== Math.round(yPos);

    var diffPoint = diffPointX && diffPointY;

    //Tooltip coordinates
    var tipX = xPos < 200 ? xPos : xPos - 200;
    var tipY = yPos;

    // //Position our circle.
    this.hoverCircle
      .attr('transform', 'translate(' + xPos + ', ' + yPos + ')');


    //Animation. Should work fine without this if you need to skip it for a broswer etc.
    if (diffPoint) {
      this.hoverCircle.attr('r', 0);

      anime({
        targets: this.hoverCircle.node(),
        r: 9,
        duration: 1000,
        delay: 20,
        loop: false,
        elasticity: 100,
        easing: 'easeOutCirc',
        autoplay: true
      });
    }

    //Position our tooltip (if it's close to the left edge make it sit to the right of the circle)
    this.chartTip.attr('transform', 'translate(' + tipX + ',' + tipY + ')');

    this.tipText.date.text(this.outputDateFormat(data.date));
    this.tipText.usage.text(data.value + ' (' + unit + ')');
    this.tipText.reading.text(data.reading + ' (' + data['reading-type'] + ')');

    if (diffPoint) {
      var tip = this.tipText;
      var aniVals = {
        usage: 0,
        reading: 0
      };
      var JSobjectProp = anime({
        targets: aniVals,
        usage: data.value,
        reading: data.reading,
        easing: 'easeOutExpo',
        duration: 500,
        round: 1,
        update: function() {
          tip.usage.text(aniVals.usage + ' (' + unit + ')');
          tip.reading.text(aniVals.reading + ' (' + data['reading-type'] + ')');
        }
      });
    }

  }


  /**
   * animateDots
   * @param  {[type]} lines [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.animateDots = function(dots) {
    var dotAnim = [];

    for (var i = 0; i < dots.length; i++) {

      dots[i].setAttribute('r', 0);

      //Should be able to just not run this for shit browsers and graph will be static
      dotAnim.push(
        anime({
          targets: dots[i],
          r: 6,
          duration: Math.floor(Math.random() * 2000) + 1,
          delay: Math.floor(Math.random() * 2000) + 1,
          loop: false,
          easing: 'easeInSine',
          autoplay: false
        })
      );

    }

    return dotAnim;
  };




  /**
   * animateLines
   * animates Lines
   * @param  {[type]} lines [description]
   * @return {[type]}       [description]
   */
  d3UsageGraph.prototype.animateLines = function(lines) {
    var lineAnims = [];

    for (var i = 0; i < lines.length; i++) {

      //Should be able to just not run this for shit browsers and graph will be static
      lineAnims.push(
        anime({
          targets: lines[i],
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 3000,
          delay: 500,
          loop: false,
          easing: 'easeInOutSine',
          autoplay: false
        })
      );

    }


    return lineAnims;

  };




  /**
   * visibilityCheck
   * Wait for graph to be visible before animating it.
   * @return {[type]} [description]
   */
  d3UsageGraph.prototype.visibilityCheck = function() {
    if (this.el.offsetHeight && (this.el.getBoundingClientRect().top < window.innerHeight)) {
      var i;
      var ani = [];
      window.clearInterval(this.pollTilVisible);

      if (this.hasGas) {
        ani = ani.concat(this.lineAnimationsGas);
        ani = ani.concat(this.dotAnimationsGas);
      }
      if (this.hasElec) {
        ani = ani.concat(this.lineAnimationsElec);
        ani = ani.concat(this.dotAnimationsElec);
      }

      for (i = 0; i < ani.length; i++) {
        ani[i].play();
      }

    }
  };


  window.Component = Component;

})(this.window, this.document);
/**







                                __,__
                       .--.  .-'     '-.  .--.
                      / .. \/  .-. .-.  \/ .. \
                     | |  '|  /   Y   \  |'  | |
                     | \   \  \ 0 | 0 /  /   / |
                      \ '- ,\.-'`` ``'-./, -' /
                       `'-' /_   ^ ^   _\ '-'`
                       .--'|  \._ _ _./  |'--.
                     /`    \   \.-.  /   /    `\
                    /       '._/  |-' _.'       \
                   /          ;  /--~'   |       \
                  /        .'\|.-\--.     \       \
                 /   .'-. /.-.;\  |\|'~'-.|\       \
                 \       `-./`|_\_/ `     `\'.      \
                  '.      ;     ___)        '.`;    /
                    '-.,_ ;     ___)          \/   /
                     \   ``'------'\       \   `  /
                      '.    \       '.      |   ;/_
               jgs  ___>     '.       \_ _ _/   ,  '--.
                  .'   '.   .-~~~~~-. /     |--'`~~-.  \
                 // / .---'/  .-~~-._/ / / /---..__.'  /
                ((_(_/    /  /      (_(_(_(---.__    .'
                          | |     _              `~~`
                          | |     \'.
                           \ '....' |
                            '.,****/

;

/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 *  Validation methods for the Login, Username/Password reset sections.
 */

/* JSHint: */
/* globals jQuery: false */

;(function(window, document, $, undefined) {
  'use strict';

    /**
     * matchThisField
     *
     * Simple validation method to check if the value in here matches the
     * value in the element that you're sent a selector through for.
     *
     * E.g // matchThisField: '#newPasswordConfirm'
     *
     * @param  {[type]} val                    Value of element being tested
     * @param  {[type]} el                     The element being tested
     * @param  {[type]} selector)              Selector of another form element to check against
     * @return {[type]}
     */
    $.validator.addMethod('matchThisField', function(value, el, selector) {
      return $(selector).length ? value === $(selector).val() : true;
    }, $.validator.format(''));


    /**
     * Inert placeholder function to facilitate configurable form
     * testing on onKeyUp event
     */
    $.validator.addMethod('onKeyUpCheck', function(value, element, selector) {
      return true;
    }, $.validator.format(''));


    /**
     * notEqualTo
     */
    $.validator.addMethod('notEqualTo', function(value, element, selector) {
      if($(selector).length){
        if(value === $(selector).val()){
          return false;
        }
      }
      return true;
    }, $.validator.format(''));


    $.validator.addMethod("containsAtLeastOneDigit", function (value) {
      return /[0-9]/.test(value);
    }, "Must have at least one number");


    $.validator.addMethod("containsBothUpperLower", function (value) {
      return /([A-Z].*[a-z]|[a-z].*[A-Z])/.test(value);
    }, "Must contain both upper & lower case letters");


    $.validator.addMethod("containsNoSpaces", function (value) {
      return value.indexOf(" ") < 0 && value != "";
    }, "No space please and don't leave it empty");


    /**
     * validPhoneNumber: accepts numbers + -
     */
    $.validator.addMethod("validPhoneNumber", function(value, element) {
      var i, len;
      // var regex = new RegExp(/[0-9+-\s]/);
      var regex = new RegExp(/[0-9+-]/);

      for (i=0, len=value.length; i<len; i++){
        if (regex.test(value[i]) == false) {
          return false;
        }
      }
      return true;
    }, "Please enter a valid phone number");


    $.validator.addMethod("containsOnlyWhiteListCharacters", function(value, element) {
      return (/^[a-zA-Z0-9@_.,/-]*$/gi).test(value);
    }, "Only these special characters are allowed: @ . , - _ /");


    //DSV-555 - Whitelist doesn't have accented characters, but they should be
    //   allowed to reach the back end, where they then get converted to their
    //   equivalent non-accented brethren. You don't need to loop through each
    //   character with Regex, it's very dynamic and powerful.
    //   ^ = start of string
    //   $ = end of string
    //   [###] = match everything in here
    //   * = string of any length (length gets checked by other validation method)
    //   g = global
    //   i = case insensitive
    //
    //   ...This isn't in use. Refer to Jira. Leaving it in in case it's ever
    //   needed as it matches the full set of characters that can be successfully
    //   submitted to the back end.
    $.validator.addMethod("containsOnlyWhiteListCharactersAndAccents", function(value, element) {
      return (/^[A-Z0-9áéíóúÁÉÍÓÚÕÄÖÜõäöü@_.,/-]*$/gi).test(value);
    }, "Only these special characters are allowed: @ . , - _ /");






    // $.validator.addMethod("containsAtLeast", function (value) {
    //   return /^[a-z]+[0-9]/i.test(value);
    // }, function(params, element) {
    //   console.log(params);
    //   console.log(element);
    //   return 'The field cannot be less than than ' + $(element).data('min') + ' length.'
    // });


    /**
     * Format validation
     *
     * This currently uses the same regex that V1 use in the back end for Postcode,
     * but if Ireland is selected as a country then it will just pass through.
     * It should be easy to update this to validate Eircode when the time comes,
     * but for the moment the priority is to get Postcode over the line.
     */
    $.validator.addMethod('postcodeFormat', function(value, element, param) {

      var country = $(element).closest('.form-details').find('#country').val();

      //Eircode validation may need to be revised. Took spec from:
      //https://www.eircode.ie/docs/default-source/Common/prepareyourbusinessforeircode-edition3published.pdf?sfvrsn=2
      if (country.toLowerCase() === 'republic_of_ireland') {
          return (/^([A,C,D,E,F,H,K,N,P,R,T,V,W,X,Y]{1}[0-9]{1}[0-9,W]{1}[\ \-]?[0-9,A,C,D,E,F,H,K,N,P,R,T,V,W,X,Y]{4})$/gi).test(value);
      //Postcode validation as per V1 back end Java
      } else {
          return (/(GIR 0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))|[0-9][A-HJKS-UW])( )?[0-9][ABD-HJLNP-UW-Z]{2})/gi).test(value);
      }

      return false;

    }, $.validator.format(''));


    /**
     * Only validate checkbox if a name is entered
     */
    $.validator.addMethod('requiredIfNameNotEmpty', function (value, element) {

      var $nameInput = $(element).closest('.additional-contact-form').find('[id^=contactFirstName][type=text]');
      var needsCheckbox = $nameInput.val().length;
      var isChecked = $(element).prop('checked');

      // If it needs checkbox, then return check status, else just return true and let it pass.
      return needsCheckbox ? isChecked : true;

    }, $.validator.format(''));


    /**
     * Ask for mobile number if no work or home number entered
     */
    $.validator.addMethod('requiredIfNoOtherPhoneNumbers', function (value, element) {

      var $form = $(element).closest('.form-details');
      var numLength = 0;

      var mobileLength = $form.find('#mobileNumber').val().length;
      if(! mobileLength){
        numLength += $form.find('#workPhoneNumber').val().length;
        numLength += $form.find('#homePhoneNumber').val().length;

        return numLength !== 0;
      }

      return true;

    }, $.validator.format(''));

    /**
     * Ask for mobile number if no work or home number entered
     */
    $.validator.addMethod('requiredIfSMSAlertChecked', function (value, element) {

      var $form = $(element).closest('.form-details');
      var numLength = 0;

      if ($form.find('#meterSMSYes').is(":checked")) {
        return $form.find('#mobileNumber').val().length > 0 ? true : false;
      }

      return true;

    }, $.validator.format(''));



    /**
     * Valid if only one of the passed-in inputs has a value.
     */
    $.validator.addMethod('onlyOneHasValue', function (v, e, params) {
      var count = 0;
      for (var i = 0; i < params.length; i++) {
        if (params[i].val().length){
          count++;
        }
      }
      return count === 1;
    }, $.validator.format(''));


})(this.window, this.document, jQuery);

;
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

;
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

;

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

;

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

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *
 *  This instantiates and initialises validations, if they're on the page.
 */
;(function(window, document){/* globals $ */
    'use strict';

    $(document).ready(function() {
      if (!window.Validation) {
        return false;
      }

      var validations = new window.Validation();
      var validationsOnPage = $('[data-js-validation]');
      var validation;

      // First, init the validation defaults
      var defaults = new window.Validation.ValidationDefaults();

      /**
       *  Loop through all validations on the page and pass their element through
       *  to their respective JS validation. Note that this will run once for each
       *  instance of each validation. If there's 10 tab-validations on the page, it's
       *  gonna run the tab-validation JS validation 10 times.
       */
      console.groupCollapsed('Validation initialisation');
      for (var i = 0; i < validationsOnPage.length; i++) {
        validation = $(validationsOnPage[i]).data('js-validation');
        var c = null;
        try {
          c = new Validation[validation](validationsOnPage[i]);
        }
        catch(e) {
          console.log(e);
          console.info(validation, 'is not a valid validation, moving on...');
        }
        if(c) {
          console.groupCollapsed(validation + ' validation');
          console.info(validationsOnPage[i]);
          console.groupEnd(validation + ' validation');
        }
      }
      console.groupEnd('Validation initialisation');
    });

})(this.window, this.document);

;

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


;
/**
 * Validation initialiser
 */
(function(window, document) {

    'use strict';

    var Validation = window.Validation || function() {};

    var ValidationDefaults = Validation.ValidationDefaults = function() {
      this.init();
    }

    ValidationDefaults.prototype.init = function() {
        /**
         * Defaults for validator.
         * Can be overridden in individual instances if necessary
         */
        $.validator.setDefaults({
            errorClass: "-error",
            validClass: "-valid",
            focusCleanup: false,
            focusInvalid: false,
            errorElement: 'span',
            ignore: ':hidden:not(.c-input-select:visible select)',
            // errorPlacement: function(error, element) {
            //     var $component = $(element).closest('[data-js-component]');
            //
            //     if ($(element).is(':radio')) {
            //         error.insertAfter($component.find('label:first-child'));
            //     }
            //     else if ($(element).is(':checkbox')) {
            //         error.insertAfter($component.find('.chk-wrap'));
            //     }
            //     else if($component.find('.hint').length) {
            //         error.insertBefore($component.find('.hint'));
            //     }
            //     else {
            //         error.appendTo($component);
            //     }
            // },
            highlight: function(element, errorClass, validClass) {
                //Closest component parent based on prefix
                $(element).closest('[class^=c-]').addClass(errorClass).removeClass(validClass);

                //Force Reflow for IE8 - not really working too well
                if (window.app.device.detection.isIE8) {
                    var redraw = element.parentElement.offsetHeight;
                }
            },
            unhighlight: function(element, errorClass, validClass) {
                //Closest component parent based on prefix
                $(element).closest('[class^=c-]').addClass(validClass).removeClass(errorClass);

                //Force Reflow for IE8 - not really working too well
                if (window.app.device.detection.isIE8) {
                    var redraw = element.parentElement.offsetHeight;
                }
            },
            submitHandler: function(form){
              $('form button.btn, form button.button').attr('disabled', 'disabled');
              form.submit();
            },
        //     //Scroll up to the first err
        //     invalidHandler: function (form, validator) {
        //         if (validator.numberOfInvalids()) {
        //             //If this is a select we need to find the fancy select instead.
        //             var $target = $(validator.errorList[0].element);
        //
        //             if ($target.hasClass('cs-select')) {
        //                 $target = $target.closest('.c-input-select');
        //             } else {
        //                 $target = $target.closest('[data-js-component]');
        //             }
        //
        //             $('html, body').animate({
        //                 scrollTop: $target.offset().top - 20
        //             }, 500);
        //         }
        //     }
        });
    };

    window.Validation = Validation;


})(this.window, this.document);

;
/**
 *  SSE Airtricity OSs
 *  Author: Each&Other
 *  Component: [component-friendly-name]
 */
(function(window, document) {

  'use strict';

  var Validation = window.Validation || function() {};

  var meterReadingForm = Validation.meterReadingForm = function(el) {
    this.$el = $(el).find('form');
    this.init();
  };

  meterReadingForm.prototype.init = function() {

    console.log('Form meter reading validation initialised');

    var config = {
      onkeyup: function(element) {}
    };

    var meterReadingElecFormValidator = this.$el.validate();

    this.$el.find('input[type=text]').each(function() {
      $(this).rules('add', {
        required: true,
        digits: true,
        messages: {
          required: "You need to submit a reading",
          digits: "Please enter a valid meter reading"
        }
      });
    });

  };

  window.Validation = Validation;

})(this.window, this.document);
