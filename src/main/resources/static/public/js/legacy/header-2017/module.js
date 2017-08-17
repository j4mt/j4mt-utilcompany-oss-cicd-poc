/**
 *  Author: Each&Other
 *  Module: Header
 */
;(function(window, document, undefined){
    'use strict';

    var Modules = window.Modules || function() {};

    var header2017 = Modules.header2017 = function( el ) {
      this.$el = $(el);
      this.init();
    }

    header2017.prototype.init = function(options) {
        var $regionSelector = $('[data-js-module=header2017] .change-user-region select');
        var initialRegion = $regionSelector.val();
        var $subMenuTriggers = this.$el.find('.sub-menu-trigger');
        this._regionChangeListener($regionSelector, initialRegion);
        this._armSubMenuTriggers($subMenuTriggers);
    }

    header2017.prototype._regionChangeListener = function($selector, initialRegion) {
      var me = this;
        $selector.on('change', function() {
            var selectedRegion = $(this).val();

            if (initialRegion == selectedRegion) {
                return false;
            } else {
                me._changeRegion(selectedRegion);
            }
        });
    }

    header2017.prototype._changeRegion = function(newRegion) {
        window.location = newRegion;
    }

    header2017.prototype._armSubMenuTriggers = function($subMenuTriggers) {
      var me = this;
        $subMenuTriggers.click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).hasClass('sub-menu-visible')) {
                me._hideSubMenu($(this));
            } else {
                me._showSubMenu($(this));
            }
        });
    }

    header2017.prototype._showSubMenu = function($trigger) {
        this.$el.find('.sub-menu-visible').removeClass('sub-menu-visible');
        $trigger.addClass('sub-menu-visible');
        $trigger.next('ul').addClass('sub-menu-visible');
        this._armPageDismiss($trigger);
    }

    header2017.prototype._hideSubMenu = function($trigger) {
        $trigger.removeClass('sub-menu-visible');
        $trigger.next('ul').removeClass('sub-menu-visible');
        this._disarmPageDismiss();
    }

    header2017.prototype._armPageDismiss = function($trigger) {
      var me = this;
        $(':not(.nav-with-sub-menu *)').on('click.submenu', function (e) {
            me._hideSubMenu($trigger);
        });
    }

    header2017.prototype._disarmPageDismiss = function() {
        $(':not(.nav-with-sub-menu *)').off('click.submenu');
    }

    window.Modules = Modules;

    $(document).ready(function() {
      var moduleName = 'header2017';
      var el = $('[data-js-module=header2017]');

      var modules = new window.Modules();
      var m = new Modules[moduleName](el);
    })

})(this.window, this.document);
