/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/*
 * Responsive Tooltips
 *
 * 1. Add data-tooltip attribute to the trigger element
 * 2. Add data-tooltip-content attribute to the element containing the content for the tooltip
 * 3. Settings (optional) - the default display of the tooltip is above the trigger element, to force it to display below the element
 *    add data-tooltip-settings="bottom" to the trigger element
 * 4. Set the max-width of the tooltip (optional)
 *
 * EG
 * <a data-tooltip="test">Tooltip</a>
 * <div data-tooltip-content="test" data-width="200px">
 *   <h3>Test content</h3>
 * </div>
 *
 * ------------------------------------------------------------------------- */
(function(window, document, $, undefined) {

  'use strict';

  if (!window.console) console = {
    log: function() {}
  };


  var ResponsiveTooltip = function() {
    this.init();
  };

  ResponsiveTooltip.prototype.init = function() {
    this.events($('[data-tooltip]'));
  };

  ResponsiveTooltip.prototype.events = function($targets) {

    var me = this;

    $targets.on('click', function(e) {
      me.addOrRemoveTooltip($(this), $targets);
      e.preventDefault();
    });

    $(window).resize(function() {
      $targets.removeClass('show');
      me.removeTooltip();
    });

  };

  ResponsiveTooltip.prototype.addTooltip = function($target, $targets) {

    var $contentElement = $('[data-tooltip-content=' + $target.attr("data-tooltip") + ']'),
      tip = $contentElement.html(),
      $tooltip = $('<div id="responsive-tooltip"></div>'),
      $closeButton = $('<a href="#" class="close"></a>'),
      me = this;

    if (!tip || tip === '') {
      return false;
    }

    $tooltip.css('opacity', 0).html(tip).appendTo('body');

    $closeButton.on('click', function(e) {
      e.preventDefault();
      $targets.removeClass('show');
      $tooltip.remove();
    });

    //Once it has set up, make it so clicking on anything else closes it.
    //...but it might have a link, so there's that too...
    setTimeout(function() {
      //This took messing to figure out. Clicking anything but the tooltip should close it.
      $('body').one('click', ':not(#responsive-tooltip, #responsive-tooltip *)', function(e) {
        //This leaves a 'show' class but it's the only way to make it play nice.
        $tooltip.remove();
      });
    }, 100);


    $closeButton.appendTo($tooltip);

    if ($(window).width() < $tooltip.outerWidth(false) * 1.5) {
      if (typeof $contentElement.attr("data-width") != 'undefined') {
        $tooltip.css('max-width', $contentElement.attr("data-width"));
      } else {
        $tooltip.css('max-width', $(window).width() / 2);
      }
    } else {
      $tooltip.css('max-width', $contentElement.attr("data-width"));
    }


    var pos_left = $target.offset().left + ($target.outerWidth(false) / 2) - ($tooltip.outerWidth(false) / 2);
    var pos_top = $target.offset().top - $tooltip.outerHeight(false) - 20;

    if (pos_left < 0) {
      pos_left = $target.offset().left + $target.outerWidth(false) / 2 - 20;
      $tooltip.addClass('left');
    } else {
      $tooltip.removeClass('left');
    }

    if (pos_left + $tooltip.outerWidth(false) > $(window).width()) {
      pos_left = $target.offset().left - $tooltip.outerWidth(false) + $target.outerWidth(false) / 2 + 20;
      $tooltip.addClass('right');
    } else {
      $tooltip.removeClass('right');
    }

    if (pos_top < 0) {
      pos_top = $target.offset().top + $target.outerHeight(false);
      $tooltip.addClass('top');
    } else {
      $tooltip.removeClass('top');
    }

    // apply custom settings
    if ($target.is('[data-tooltip-settings]')) {
      var settings = $target.attr('data-tooltip-settings').replace(/ /g, '').split(',');
      if (settings.indexOf('bottom') > -1) {
        $tooltip.addClass('bottom');
        pos_top += $tooltip.outerHeight(false) + 33;
      }
    }

    if ($target.is('[data-tooltip-class]')) {
      var classes = $target.attr('data-tooltip-class');
      if (classes.length > 0) {
        $tooltip.addClass(classes);
      }
    }


    $tooltip.css({
      left: pos_left,
      top: pos_top
    }).animate({
      top: '+=10',
      opacity: 1
    }, 50);


  };
  /*
   *
   */
  ResponsiveTooltip.prototype.removeTooltip = function() {

    $('#responsive-tooltip').remove();

    //Removed this because the delay was causing issues when we want to hide
    //the tooltip and switch between tabs.
    // var $tooltip = $('#responsive-tooltip');
    // $tooltip.animate({ top: '-=10',opacity: 0 }, 50, function() { $tooltip.remove(); });

  };
  /*
   *
   */
  ResponsiveTooltip.prototype.addOrRemoveTooltip = function($target, $targets) {
    this.removeTooltip();
    //this.addTooltip($target);
    if ($target.hasClass('show')) {
      $target.removeClass('show');
    } else {
      $targets.removeClass('show');
      $target.addClass('show');
      this.addTooltip($target, $targets);
    }
  };



  // initialise when ready
  $(function() {
    setTimeout(function() {var r = new ResponsiveTooltip();}, 500);
  });

})(this, this.document, $);
