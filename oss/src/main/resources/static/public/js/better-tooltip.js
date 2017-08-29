

/*
============================================================================
  Tooltips
============================================================================
*/
$(document).ready(function() {
  "use strict";

  function betterTooltip(tooltipClass) {

    var tip = $('.tooltip');
    /* Mouse over and out functions*/
    $(tooltipClass).click(function() {
      var offset = $(this).position();
      var tLeft = offset.left;
      var tTop = offset.top;
      var linkWidth = ($(this).width()) / 2;

      tTop = (tTop + 20) + 'px';
      tLeft = (tLeft - 170 + linkWidth) + "px";

      if ($(this).next('.tooltip').is(':visible')) {
        $('.tooltip').fadeOut();
      } else {
        $('.tooltip').hide();
        var thisHref = $(this).attr('href');
        var startTooltip = '<span class="tooltip"><span class="tooltip-top"></span><span class="tooltip-content"><a href="#" class="tooltip-close"><span>close</span></a>';
        var endTooltip = '</span></span>';
        var ourTooltip = startTooltip + $(thisHref).html() + endTooltip;
        $(this).after(ourTooltip);
        $(this).next('.tooltip').css({
          'top': tTop,
          'left': tLeft
        });
        $('.tooltip-close').click(function() {
          $('.tooltip').fadeOut();
          return false;
        });
        $(ourTooltip).show();
      }
      return false;
    });
  }

  if ($('.toolTip').length) {
    $('.tooltip').hide();
    //$('.toolTip').betterTooltipTwo({speed: 150, delay: 300});
    betterTooltip('.toolTip');
  }

});
