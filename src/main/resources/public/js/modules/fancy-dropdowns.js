/*!
 *  Author: Each & Other [www.eachandother.com]
 */

(function(window, document, $, undefined) {

  'use strict';

  if (!window.console) console = {
    log: function() {}
  };


  var FancyDropdowns = function() {
    this.init();
  };

  FancyDropdowns.prototype.init = function() {
    $('select.SlectBox.basic').SumoSelect();
    $('select.SlectBox.multi').SumoSelect({ csvDispCount: 2 });
    $('select.SlectBox.multi-select-all').SumoSelect({ csvDispCount: 2, selectAll:true });

    // change the defualt text for the Select all label
    $('.SumoSelect p.select-all label').text('View all');
  };

  // initialise when ready
  $(function() {
      new FancyDropdowns();
  });

})(this, this.document, $);
