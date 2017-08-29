'use strict';

/* JSHint: */
/* globals $: false */

/* LIBERATED BELOW FROM SCRIPTS.JS */
/*
============================================================================
	Start of New jQuery statements
============================================================================
*/
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
/*
	Change buttons
*/
if ($('.change').length) {
    $('.change').click(function() {
        // Reset any existing forms which are open
        $('.form-details').slideUp();
        $('.display-details').slideDown();
        $('.change').show();
        $('.cancel-change').hide();
        // hide this forms display details and show our form and the appropriate actions
        $(this).siblings('.display-details').slideUp();
        $(this).siblings('.form-details').slideDown();
        $(this).hide();
        $(this).siblings('.cancel-change').show();
        $('.module').removeClass('open');
        $(this).parents('.module').addClass('open');
        return false;
    });
    $('.cancel a').click(function() {
        $(this).parents('.form-details').slideUp();
        $(this).parents().siblings('.display-details').slideDown();
        $(this).parents().siblings('.change').show();
        $(this).parents().siblings('.cancel-change').hide();
        $(this).parents('.module').removeClass('open');
        return false;
    });
    $('.cancel-change').click(function() {
        $(this).siblings('.form-details').slideUp();
        $(this).siblings('.display-details').slideDown();
        $(this).hide();
        $(this).siblings('.change').show();
        $(this).parents('.module').removeClass('open');
        return false;
    });
    if ($('.open').length) {
        $('.open').children('.module-content').children('.display-details').hide();
        $('.open').children('.module-content').children('.form-details').show();
    }
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
    /* A bit of cheeky styling via js, this will remove the need to add classes to each radio button*/
    //$(':radio').addClass('radio-input'); ie8 is not liking this.
    $('#password-form').validate({
        rules: {
            userName: {
                required: true,
                minlength: 2
            },
            newPassword: {
                required: true,
                minlength: 4
            },
            retypenewPassword: {
                required: true,
                minlength: 4,
                equalTo: '#newPassword'
            },
            detailsEmailAddres: {
                required: true,
                email: true
            }
        },
        messages: {
            username: {
                required: 'Please enter a username',
                minlength: 'Your username must consist of at least 2 characters'
            },
            newPassword: {
                required: 'Please provide a password',
                minlength: 'Your password must be at least 4 characters long'
            },
            retypenewPassword: {
                required: 'Please provide a password',
                minlength: 'Your confirmation password must be at least 4 characters long',
                equalTo: 'Your passwords don\'t match. Remember that passwords are case sensitive.'
            },
            detailsEmailAddres: {
                required: 'Please enter a valid email address',
                email: 'Please enter a valid email address'
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent('.row').prev('.error-row-description-inline'));
            $(element).parents('.row').prev('.error-row-description-inline').show();
        },
        highlight: function(element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element).parents('.row').addClass('error-row');
            $(element).parents('.row').prev('.error-row-description-inline').addClass('row');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element).parents('.row').prev('.error-row-description-inline').removeClass('row');
            $(element).parents('.row').removeClass('error-row');
        },
        showErrors: function(errorMap, errorList) {
            if (this.numberOfInvalids() === 0) {
                $('.error-row-description-inline').hide();
            }
            this.defaultShowErrors();
        }
    });
    // End of .change.length
}
