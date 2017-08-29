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
