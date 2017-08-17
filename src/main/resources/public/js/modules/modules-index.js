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
