/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Nps widget
 */
;(function(window, document, undefined) {
  'use strict';

  /*
  * The nps widget is initted from the nps component
  * See nps component for details
  */

  var Component = window.Component || function() {};

  var npsWidget = Component.npsWidget = function(el, nps) {
    this.$el = $(el);
    this.nps = nps;
    this.hideFor = 4000;
    this.transitionFor = 1500;
    this.init();
  }

  npsWidget.prototype.init = function() {
    var me = this;
    var callback = function() {
      setTimeout(function() {
        me.slideIn();
      }, me.hideFor)

    };
    this.scrollTo(this.$el.parent(), callback);
    this.bindEvents();
  }

  npsWidget.prototype.slideIn = function() {
    var me = this;

    var windowWidth = $(window).width();
    var panelLeftPos = this.$el.parent().offset().left;
    var panelWidth = this.$el.parent().width();

    var widgetXPos = this.calculateInitialXPos(windowWidth, panelLeftPos, panelWidth)
    var widgetFinalXPos = this.calculateFinalXPos(windowWidth, panelLeftPos, panelWidth);

    this.$el.css({right: widgetXPos});
    this.$el.removeClass('-is-hidden').addClass('-is-visible');
    this.$el.velocity({
        translateX: widgetFinalXPos
    }, {
      duration: me.transitionFor,
      easing: [ 250, 15 ]
    });
  }

  npsWidget.prototype.calculateInitialXPos = function(windowWidth, panelLeftPos, panelWidth) {

    var widgetWidth = this.$el.width();
    var panelRightPos = panelLeftPos + panelWidth;
    var widgetXPos = ((windowWidth - panelRightPos) * -1) - widgetWidth;

    return widgetXPos;
  }

  npsWidget.prototype.calculateFinalXPos = function(windowWidth, panelLeftPos, panelWidth) {
    var panelRightPos = panelLeftPos + panelWidth;
    var widgetXPos = (windowWidth - panelRightPos + 15) * -1;
    return widgetXPos;
  }

  npsWidget.prototype.hide = function() {
    this.$el.removeClass('-is-visible').addClass('-is-hidden');
  }

  npsWidget.prototype.bindEvents = function() {
    var me = this;
    this.$el.find('a').on('click', function(e) {
      me.scrollTo(me.nps.$el);
      me.openNPSComponent();
      e.preventDefault();
    })
  }

  npsWidget.prototype.scrollTo = function($el, callback) {
    var ypos = $el.offset().top;
    $('html, body').animate({
      scrollTop: ypos
    }, 'slow', callback);
  }

  npsWidget.prototype.openNPSComponent = function() {
    this.nps.showFeedback();
  }

  window.Component = Component;

})(this.window, this.document);
