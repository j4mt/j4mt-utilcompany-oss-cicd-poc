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
