

/*
 * ============================================
 *  Commercial - Update src of input controls to show blue button if page is commercial
 *  By: Conor Luddy - iQContent
 *  Date: 05 March 2013
 * ============================================
 */
$(document).ready(function() {
  "use strict";

  //If this is a commercial page we need to update the src of image-input elements (buttons) to show the blue buttons
  if (($('body.commercial').length) && ($("input[type='image']").length)) {
    var imagesCurrentSrc,
      imagesCurrentExtension,
      imagesNewSrc,
      stringChange = '-blue';
    $("input[type='image']").each(function() {
      var _this = $(this);
      imagesCurrentSrc = $(this).attr('src');
      imagesCurrentExtension = imagesCurrentSrc.substr(-4); //Assumes all extensions are in the format of '.ABC'
      imagesNewSrc = imagesCurrentSrc.replace(imagesCurrentExtension, stringChange + imagesCurrentExtension);
      //Only update this if the image actually exists (needs localhost to run AJAX)
      $.get(imagesNewSrc, function() {
        _this.attr('src', imagesNewSrc);
      });
    });
  }
});
