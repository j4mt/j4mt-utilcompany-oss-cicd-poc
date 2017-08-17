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
