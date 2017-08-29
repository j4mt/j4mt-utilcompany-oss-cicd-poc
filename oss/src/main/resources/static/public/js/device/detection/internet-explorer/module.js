/**
 *  SSE Airtricity OSU - Responsive 2015/2016
 *  Author: Each&Other
 *  Module: Detect IE. Basic at the moment. Expand if necessary.
 */
(function(window, document) {

  'use strict';

  var Device = window.Device || function() {};

  var IEDetection = Device.IEDetection = function(el) {
    this.init();
  }

  IEDetection.prototype.init = function() {

    this.isOldIE = $('html').hasClass('ie8');
    this.isIE8 = $('html').hasClass('ie8');
    this.isIE9 = $('html').hasClass('ie9');
  };


  $(document).ready(function() {
    window.Device = Device;
  })


})(this.window, this.document);
