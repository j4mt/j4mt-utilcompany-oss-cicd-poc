/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Module: Meter reading 2017
 *
 *  This module covers everything that needs to happen inside the metering
 *  tables. Tabs, filters, show/hide etc
 */

;(function(window, document, undefined){/* globals $ */

    'use strict';

    var Modules = window.Modules || function() {};

    var meterReading = Modules.meterReading = function( el ) {
      this.$el = $(el);
      this.init();
    }

    meterReading.prototype.init = function() {
        this.$tabs = this.$el.find('.meter-reading_tabs li');
        //Only need tab functionality if there are more than one.
        if (this.$tabs.length > 0) {
          this.initTabs();
        }
    }

    meterReading.prototype.initTabs = function() {
      var me = this;

      var $tabContent = this.$el.find('.meter-reading_tab-content');

      //Back-end has the option to add is-active classes to the HTML.
      //If it doesn't then we set the first tab as active.
      if (this.getActives().length === 0) {
        this.$tabs.eq(0).addClass('is-active');
        $tabContent.eq(0).addClass('is-active');
      }

      //Set up a listener for clicks on tabs
      this.$tabs.each(function (idx, tabEl) {
        $(tabEl).on('click', function () {
          // Already active, ignore click
          if ($(this).hasClass('is-active')) {
            return false;
          }

          // index of content = index of tab. No need for linking attributes.
          var $contentToShow = $tabContent.eq(idx);

          // clear other is-active classes and add new ones.
          me.removeActiveStates();
          $(this).addClass('is-active');
          $contentToShow.addClass('is-active');
        });
      });

    }

    meterReading.prototype.getActives = function() {
      return this.$el.find('.meter-reading_tabs li.is-active, .meter-reading_tab-content.is-active');
    }

    meterReading.prototype.removeActiveStates = function() {
      var $actives = this.getActives();
      $actives.removeClass('is-active');
    }

    window.Modules = Modules;
})(this.window, this.document);
