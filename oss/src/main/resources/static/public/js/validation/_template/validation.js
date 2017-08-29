/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: [component-friendly-name]
 */
;(function(window, document, undefined){
    'use strict';

    var Validation = window.Validation || function() {};

    Validation.prototype.[validation-name] = function() {

        function init(options) {
            console.log('[validation-friendly-name] validation initialised');
        }

        init();
    };

    window.Validation = Validation;

})(this.window, this.document);
