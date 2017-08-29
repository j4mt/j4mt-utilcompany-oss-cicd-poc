/*
 * ============================================
 * Rebecca Richards March 2015
 * Centralized colorbox init function. To use it without any extra javascript:
 * 1. Add "colorbox-trigger" class to the modal trigger html element (usually <a> tag or a <button>)
 * 2. Add data-modal-target="#target-id" to the same tag, (where target-id
 * is an id of the div that will become a modal content).
 * ============================================
 */
$(document).ready(function () {
  "use strict";

  (function () {
    if ($.colorbox) {
      $(".colorbox-trigger").colorbox({
        inline: true,
        href: function () {
          return $(this).attr('data-modal-target');
        },
        width: function () {
          var widthOption = $(this).attr('data-modal-width');
          return widthOption ? widthOption + 'px' : '890px';
        },
        initialWidth: function () {
          var widthOption = $(this).attr('data-modal-width');
          return widthOption ? widthOption + 'px' : '890px';
        },
        scrolling: false,
        onComplete: function () {
          $.colorbox.resize();
        }
      });
      $('.colorbox-trigger').click(function (e) {
        e.preventDefault();
      });
    }

  })();

});
