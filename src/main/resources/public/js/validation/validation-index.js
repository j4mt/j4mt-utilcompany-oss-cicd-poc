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
