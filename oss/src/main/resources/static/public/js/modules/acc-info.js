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