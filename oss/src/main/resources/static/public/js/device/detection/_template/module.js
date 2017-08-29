/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Module: [detection-friendly-name]
 */
;(function(window, document, undefined){
    'use strict';

    var Detection = window.Detection || function() {};

    Detection.prototype.[detection-name] = function() {

        function init(options) {
            var elements = document.querySelectorAll('[data-js-detection=[detection-name]]');
            console.log('[detection-friendly-name] detection anseo');
        }

        init();
    };

    window.Detection = Detection;

})(this.window, this.document);
