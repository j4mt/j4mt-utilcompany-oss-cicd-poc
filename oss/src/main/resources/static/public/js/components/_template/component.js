/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: [component-friendly-name]
 */
;(function(window, document, undefined){
    'use strict';

    var Component = window.Component || function() {};

    var [component-name] = Component.[component-name] = function( el ) {
      this.$el = $(el);
      this.init(el);
    }

    [component-name].prototype.init = function(el) {
      console.info('[component-name] component', el);
    }

    window.Component = Component;

})(this.window, this.document);
