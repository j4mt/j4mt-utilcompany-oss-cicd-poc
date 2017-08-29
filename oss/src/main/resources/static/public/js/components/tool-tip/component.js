/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Tool tip
 */

/* globals $ */

;(function(window, document, undefined){
    'use strict';

    var Component = window.Component || function() {};

    var toolTip = Component.toolTip = function( el ) {
      this.$el = $(el);
      this.init(el);
    };

    toolTip.prototype.init = function(el) {
      $(el).prev('.js-tooltip-trigger').on('click', this.toggleTip.bind(el));
      $(el).on('click', this.toggleTip.bind(el));
    };

    toolTip.prototype.toggleTip = function (evt) {
      evt.preventDefault();

      var targEl = evt.target;
      var isTipContent = $(targEl).closest('.tooltip-content').length && $(targEl).context.tagName.toLowerCase() !== 'i';

      //Don't act when content was the target
      if ( isTipContent ) {
        return false;
      }

      if ($(this).hasClass('is-visible')) {
        $(this).removeClass('is-visible');
        return;
      }

      //Close any other tips.
      $('.c-tool-tip.is-visible').removeClass('is-visible');
      $('.c-meter-reading-box.has-active-tool-tip').removeClass('has-active-tool-tip');

      //Show this one.
      $(this).addClass('is-visible');

      //if it's in a meter reading box we have z index issues... add a class.
      if ( $(this).closest('.c-meter-reading-box').length ) {
        $(this).closest('.c-meter-reading-box').addClass('has-active-tool-tip');
      }

    };

    window.Component = Component;

})(this.window, this.document);
