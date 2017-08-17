/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Modal overlay
 */
(function(window, document) {

  'use strict';

  var Component = window.Component || function() {};



  var modalOverlay = Component.modalOverlay = function( el ) {
    this.$el = $(el);
    this.init();
  }

  /**
   * Get some
   */
  modalOverlay.prototype.init = function(options) {
    var $triggers = $('[data-modal-target]');
    var $killers = $('.js-close-modal');

    var ieDetection = new window.Device.IEDetection();

    this.$allOverlays = $('[data-js-component=modalOverlay]');
    this.ypos = 0;
    this.hijackBackBtn = !ieDetection.isIE8 && !ieDetection.isIE9;
    this.activeOverlay = false;
    this.preventAnimation = false;
    this.disableKeyboardDismiss = false;
    this._armTriggers($triggers);
    this._armKillers($killers);
  }

  /**
   * _activeOverlayTarget - if an active-target is specified this
   * will 'checked' that checkbox target
   */
  modalOverlay.prototype._activeOverlayTarget = function($overlayBtn) {
    var target = $overlayBtn.data('js-active-target');
    if (typeof target !== 'undefined') {
      var activateTarget = $('body').find('#' + target + '-1');
      activateTarget.prop('checked', true);
    }
  }

  /**
   * _showOverlay - does exactly what it says on the tin
   */
  modalOverlay.prototype._showOverlay = function($overlay) {

    var me = this;
    var href = window.location.href;
    // dismiss any modals that are active already.
    if (this.activeOverlay) {
      this.preventAnimation = true;
      history.back();
    } else {
      //Save window position.
      // if(this.ypos === null) {
        this.ypos = $(window).scrollTop();
      // }
    }

    //Umbrella class so we can animate things.
    $('body').addClass('has-overlay');

    //Timeout to hold off on showing the modal until the
    //page content is invisible - else we get an ugly jump
    //to the top when a modal opens.
    //tldr; The timing is sensitive. Don't break it.
    setTimeout(function() {
      //Specifically set the page wrap height so we can prevent over-scrolling.
      //...because VH won't work everywhere.
      $('.page-wrap').height($(window).height() + 'px');

      //make sure other overlays get pushed to the bottom
      me.$allOverlays.removeClass('is-top-most');
      //Show the overlay
      $overlay.addClass('is-visible');
      $overlay.addClass('is-top-most');
      $overlay.removeClass('is-hidden');
      //Use the browser Back button to exit a modal.
      if (me.hijackBackBtn) {

        if(href.indexOf('#modal') === -1) {
          history.pushState(null, '', href + '#modal');
        }

        $(window).one('popstate', function(event) {
          me._hideOverlay($overlay);
        });

      }
      //Oneliners:
      $overlay.find('.js-close-modal').first().focus();
      $(window).scrollTop(0);
      // reset the activeOverlay
      this.activeOverlay = $overlay;

    }, 100); //To match grid-classes.scss for page-wrap transition duration.
  }

  /**
   * _hideOverlay - also does exactly what it says on the tin
   */
  modalOverlay.prototype._hideOverlay = function($overlay) {
    var me = this;
    if (this.preventAnimation) {
      $overlay.removeClass('is-visible');
      this.activeOverlay = false;
      this.preventAnimation = false;
      this.disableKeyboardDismiss = false;
      this._resetForm($overlay);
      return;
    }

    $overlay.addClass('is-hiding');
    $('body').removeClass('has-overlay');
    $('.page-wrap').attr('style', null);
    //Scroll to the position we were at previously
    $(window).scrollTop(this.ypos, 300);

    //This can fire after open and close animations,
    //so it goes here and only fires after the closing animation
    if (Modernizr.cssanimations) {
      $overlay.one('transitionend animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function() {
        if ($overlay.hasClass('is-hiding')) {
          $overlay.removeClass('is-visible');
          $overlay.removeClass('is-top-most');
          $overlay.removeClass('is-hiding');
          me.activeOverlay = false;
          me.disableKeyboardDismiss = false;
          this._resetForm($overlay);
        }
      });
    } else {
      $overlay.removeClass('is-visible');
      $overlay.removeClass('is-top-most');
      $overlay.removeClass('is-hiding');
      me.activeOverlay = false;
      me.disableKeyboardDismiss = false;
      this._resetForm($overlay);
    }

  }

  /**
   * _armTriggers
   *
   * Triggers are elements anywhere on the page that can open an overlay.
   * They need a data attribute that tells them what overlay to open.
   */
  modalOverlay.prototype._armTriggers = function($triggers) {
    var $targetEl;
    var targetName;
    var me = this;

    $triggers.each(function(i, el) {
      $(this).on('click', function(e) {
        e.preventDefault();
        var triggerData = $(this).data('trigger-options');
        targetName = $(this).data('modal-target');
        $targetEl = $('[data-overlay-name="' + targetName + '"]').first();
        if ($targetEl.length) {
          me._showOverlay($targetEl);
          $('[data-overlay-name="' + targetName + '"]').trigger("modalOpen", {
            triggerData: triggerData
          });
        }
      });
    });
  }

  /**
   * _armKillers
   *
   * Modals should always cover the whole window, so we'll assume that
   * you can only click an element inside them to close them.
   */
  modalOverlay.prototype._armKillers = function($killers) {
    var me = this;

    $killers.each(function(i, el) {
      $(this).on('click', function(e) {
        e.preventDefault();
        var modalId = $(this).closest('.c-modal-overlay').data('overlay-name');
        if (me.hijackBackBtn) {
          history.back();
        } else {
          me._hideOverlay($(this).closest('.c-modal-overlay'));
          me._activeOverlayTarget($(this));
        }

        $(window).trigger('modalClose', {
          id: modalId
        });
      });
    });

    //Let users hit Escape to close modals too
    $(document).on('keyup', function(e) {
      if (e.keyCode == 27 && !me.disableKeyboardDismiss) {
        me.disableKeyboardDismiss = true;
        var $openModal = $('.c-modal-overlay.is-visible');
        if ($openModal.length) {
          if (me.hijackBackBtn) {
            history.back();
          } else {
            me._hideOverlay($openModal);
          }
        }
      }
    });
  }

  /*
   * Reset the form in the modal, if it has one.
   */
  modalOverlay.prototype._resetForm = function($overlay) {
    // first reset the form content
    $overlay.find('input').blur();
    if ($overlay.find('form')[0]) {
      $overlay.find('form')[0].reset();
    }
    $overlay.find('.form-response-success, .form-response-fail, .form-dismiss').addClass('is-hidden');
    $overlay.find('.form-wrap, input[type="submit"]').show();
  }



  window.Component = Component;

  $(document).ready(function() {
    var componentName = 'modalOverlay';
    var el = $('[data-js-module=modalOverlay]');

    var components = new window.Component();
    var modalOverlayComponent = new Component[componentName](el);
  })


})(this.window, this.document);
