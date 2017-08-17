/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Nps
 */
;
(function(window, document, undefined) {
  'use strict';

  var Component = window.Component || function() {};

  var nps = Component.nps = function(el, widgetEl) {

    this.$el = $(el);

    /*
     * The nps component and the nps widget need a link to each other
     * unfortunately since the nps component is shared across legacy pages
     * and new pages it needs to be initted from oss-enhancements.js, otherwise
     * we end up with multiple inits and therefore multiple submissions of the form (grrrrr).
     * In oss-enhancements.js we pass in the $widget selector. In here we check it's
     * length and init the widget if it's on the page
     */

    this.$widgetEl = $(widgetEl);

    this.settings = {
      sliderDefault: -1,
      feedbackVisible: false,
      postUrl: 'feedback.htm'
    }
    this.init(el);
  }

  nps.prototype.init = function(el) {
    this.bindUiActions();
    this.clearSliders($('.feedback-form').find('.slider-container'));

    if (this.$widgetEl.length) {
      this.initWidget()
    }

  }

  nps.prototype.initWidget = function() {
    this.widget = new Component['npsWidget'](this.$widgetEl, this);
  }

  nps.prototype.bindUiActions = function() {
    var me = this;
    $('#show-feedback').click(function() {
      if (me.settings.feedbackVisible) {
        me.hideFeedback();
      } else {
        me.showFeedback();
      }
    });
    $('.submit-success .close').click(function() {
      me.hideFeedback();
    });
    $('.slider li a').click(function() {
      me.updateSlider($(this));
    });
    $('#submit-feedback').click(function(e) {
      e.preventDefault();
      me.submitFeedback();
    });
  }

  nps.prototype.submitFeedback = function() {
    var me = this;
    var formData = {
      recommendationRating: $("#recommend").val(),
      satisfactionRating: $("#satisfied").val(),
      feedback: $("#comments").val(),
      sourceURL: window.location.href
    };

    if (me.validate(formData)) {
      $.ajax({
        url: me.settings.postUrl,
        type: 'POST',
        async: true,
        dataType: 'json',
        data: formData
      });
      me.showConfirmation();
    }
  }

  nps.prototype.showConfirmation = function() {

    var me = this;

    $('#feedback-container ul.tabs').slideUp('slow');

    $('.feedback-form').slideUp('slow', function() {
      $('.submit-success').slideDown('slow');
      // hide the nps widget if there's one on the page
      if (me.widget) {
        me.widget.hide();
      }
    });
  }

  nps.prototype.updateSlider = function(sliderItem) {
    var sl = sliderItem.closest('.slider');
    var slCtnr = sl.closest('.slider-container');
    //Move the active class to new selection
    sl.children('li').removeClass('active');
    sliderItem.closest('li').addClass('active');
    //Set the value to the selected value
    slCtnr.next('input').val(sliderItem.text());
    sl.find('li a, li').removeClass('redraw');
    slCtnr.removeClass('has-no-selection');
    this.hideError(slCtnr.closest('.panel'));
  }

  nps.prototype.showFeedback = function() {
    this.settings.feedbackVisible = true;
    $('#feedback-container .feedback').slideDown('slow');
    $('#show-feedback').addClass('minus');
  }

  nps.prototype.hideFeedback = function() {
    this.settings.feedbackVisible = false;
    $('#feedback-container .feedback').slideUp('slow');
    $('#show-feedback').removeClass('minus');
  }

  nps.prototype.clearSliders = function(sliders) {
    //Remove values from hidden fields
    sliders.each(function() {
      $(this).next('input').val('');
      $(this).find('.active').removeClass('active');
      $(this).addClass('has-no-selection');
    });
  }

  nps.prototype.validate = function(form) {
    var $slidepanel = {
      recommend: $('#recommend').closest('.panel'),
      satisfied: $('#satisfied').closest('.panel')
    };

    //Just ensure the two sliders have a selected value;
    if (form.recommendationRating && form.satisfactionRating) {
      return true;
    }

    //Validation message for recommendationRating
    $slidepanel.recommend.find('.slider-warning').remove();
    if (form.recommendationRating) {
      this.hideError($slidepanel.recommend);
    } else {
      this.showError($slidepanel.recommend);
    }

    //Validation message for satisfactionRating
    $slidepanel.satisfied.find('.slider-warning').remove();
    if (form.satisfactionRating) {
      this.hideError($slidepanel.satisfied);
    } else {
      this.showError($slidepanel.satisfied);
    }

  }

  nps.prototype.showError = function($panel) {
    var warnMsg = '<p class=\'slider-warning\'>Please select a rating below</p>';
    $panel.addClass('selection-warn');
    $panel.find('h4').after(warnMsg);
  }

  nps.prototype.hideError = function($panel) {
    $panel.removeClass('selection-warn');
    $panel.find('.slider-warning').remove();
  }

  window.Component = Component;


})(this.window, this.document);
