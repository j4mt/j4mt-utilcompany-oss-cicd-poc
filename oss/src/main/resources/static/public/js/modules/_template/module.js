/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Module: [module-friendly-name]
 */
;(function(window, document, undefined){
    'use strict';

    var Modules = window.Modules || function() {};

    Modules.prototype.[module-name] = function() {

        function init(modElement) {
          console.info('[module-friendly-name] module', modElement);
        }

        init();
    };

    window.Modules = Modules;

})(this.window, this.document);
