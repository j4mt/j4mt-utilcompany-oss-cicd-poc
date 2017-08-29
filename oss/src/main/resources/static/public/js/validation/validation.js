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
