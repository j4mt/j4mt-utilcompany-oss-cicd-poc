
/*!
 *
 *  Author: Each & Other [www.eachandother.com]
 *  JS.version: ###
 *
 *  This is used to make similar module instances match each others heights
 *  when they may have titles or content of different lengths that wrap and
 *  cause things to mis-align.
 *
 *  To trigger this on items you need to set data-js-module='eqHeight' on a
 *  parent element of them all and then ensure that there is a suitable
 *  collection of selectors in the subjects object.
 *
 */

(function(window, document, $, undefined) {
  'use strict';

    var
    $modules,
    childEls,
    subjects = {};
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    /**
     * Document ready
     */
    $(document).ready(function($) {

      $modules = $('[data-js-module=eqHeight]');

      //Subjects is an object containing references to anywhere we need to update
      //the heights of elements. Should make it easy to add new ones as needed...
      subjects = {
        //Meter readings
        '.info-container': ['.info-panel'],
      };

      setup();
    });
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~




    /**
     * For every section that we want to match heights,
     * We need to get the group of them into an object.
     *
     * Each selector in the array relates to a group that
     * should be equal height to one another. This way we
     * can match different elements in the same containers.
     */
    function setup() {



      var $targetedEls;

      //For each area that we've hooked this module to,
      //update it independently from the others.
      $modules.each(function(index, el) {

        //Loop through our object that contains all the selectors
        //we need to check for. If it finds any, compare their heights
        //and set them all to be equal to the tallest.
        for (var subject in subjects) {

          if (subjects.hasOwnProperty(subject) && $(subject).length) {

            //Gets the array of selectors we want to play with
            childEls = subjects[subject];

            //For each selector in the array
            //(each group of things that should have matching heights)
            //Gets tallest of the group and sets the rest to that height
            for (var i = childEls.length - 1; i >= 0; i--) {

              $targetedEls = $(this).find(subject + ' ' + childEls[i]);

              //Only do this bit if the selector is found
              if ($targetedEls.length) {
                //Set all to auto first so we can start fresh (window resize etc)
                $targetedEls.height('auto');
              }

              setNewHeight($targetedEls, getTallestHeight($targetedEls));

            }
          }
        }
      });
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~






    /**
     * Loop through the collection of elements and return the highest.
     *
     * @param  {jQuery object}    $targetedEls  The group of elements we're working on
     * @return {number}           ceiling       The height of the tallest element
     */
    function getTallestHeight($targetedEls) {

      var ceiling = 0;

      $targetedEls.each(function() {
        ceiling = $(this).height() > ceiling ? $(this).height() : ceiling;
      });

      return ceiling;
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~







    /**
     * Pass in the selector we want to work with and then set them all
     * to be the same height as the tallest one we found previously
     *
     * @param {jQuery object} $targetedEls      The group of elements we're working on
     * @param {number}        newHeight         New height to set everything to
     */
    function setNewHeight($targetedEls, newHeight) {
      return $targetedEls.height(newHeight);
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~







})(this.window, this.document, jQuery);
