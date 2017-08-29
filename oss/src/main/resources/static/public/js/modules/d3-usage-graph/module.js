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
