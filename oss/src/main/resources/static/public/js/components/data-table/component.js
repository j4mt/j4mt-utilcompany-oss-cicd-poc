/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Data table
 */
/* globals $, SelectFx */

;(function(window, document, undefined){
    'use strict';

    var Component = window.Component || function() {};
    var dataTable = Component.dataTable = function( el ) {
      this.$el = $(el);
      this.init();
    };
    var hasDateFilter = false;

    dataTable.prototype.init = function() {
      var $table = this.$el.find('table').first();//There should only be one per component anyway...

      this.$filterWrapper = this.$el.find('.filter-area .filter-wrap');
      this.$filterToggle = this.$el.find('.filter-area .toggle');
      this.$selects = this.$el.find('.filter-area select');

      var me = this;

      if ( $table ) {
        this.$dataTable = $table.DataTable({
          'pageLength': 12,
          'info': false,
          'lengthChange': false,
          'searching': true,
          'ordering': false, //can't use if we have a note row.
          'dateCol': 0
        });
      }

      // Filter show/hide

      if ( this.$filterWrapper && this.$filterToggle ) {
        this.$filterToggle.on('click', function(e) {
          if ( me.$filterWrapper.hasClass('is-visible') ) {
            me.hideFilters(me.$filterWrapper, me.$filterToggle);
          } else {
            me.showFilters(me.$filterWrapper, me.$filterToggle);
          }
        });
      }

      // Filter init

      this.$selects.each(function () {
        var targetCol = $(this).data('target-column');
        var exactMatch = $(this).data('exact');
        var rgx;

        //we replace these in the val so we can still use regex.
        //Feel free to add more to the list as required, but test thoroughly
        var charsToEsc = ['(',')','+',',','-'];

        new SelectFx(this, {
          onChange: function(val) {
            if (exactMatch && val) {
              for (var i = 0; i < charsToEsc.length; i++) {
                val = val.replace(charsToEsc[i], '\\' + charsToEsc[i] );
              }
              rgx = '^(' + val + ')$';//Regex for exact match - case sensitive though...
              me.$dataTable.column( targetCol ).search(rgx , true, false ).draw();
            } else {
              me.$dataTable.column( targetCol ).search(val).draw();
            }
          }});
      });
    };

    dataTable.prototype.showFilters = function($wrap, $switch) {
      $wrap.removeClass('is-hidden');
      $wrap.addClass('is-visible');
      $switch.html( $switch.data('hide-text') );
    };

    dataTable.prototype.hideFilters = function($wrap, $switch) {
      $wrap.addClass('is-hidden');
      $wrap.removeClass('is-visible');
      $switch.html( $switch.data('show-text') );
    };


    /**
     * dateFiltr
     *
     * This is separate to the component and gets pushed to the array of filters
     * that the dataTable uses, We use it for date ranges, but the pattern can be
     * reused for any other data filtering that needs to happen...
     *
     * @param  {[type]} dtSettings  [description]
     * @param  {[type]} rowData     [description]
     * @param  {[type]} tableIdx    [description]
     */
    function dateFiltr(dtSettings, rowData, tableIdx) {
      var $dateRangeCpt = $(dtSettings.nTable).closest('.c-data-table').find('.c-date-getter');

      if ($dateRangeCpt.data('dates') && $dateRangeCpt.data('dates').from && $dateRangeCpt.data('dates').to) {
        var dateRange = $dateRangeCpt.data('dates');
        var rowDate = new Date( rowData[dtSettings.oInit.dateCol] );
        return rowDate >= dateRange.from && rowDate <= dateRange.to;
      }

      return true;
    }


    /**
     * Ensure filter is only pushed to datatables wuntime.
     */
    for (var i = 0; i < $.fn.dataTableExt.afnFiltering.length; i++) {
      if ($.fn.dataTableExt.afnFiltering[i].name === 'dateFiltr') {
        hasDateFilter = true;
      }
    }

    if (!hasDateFilter) {
      $.fn.dataTableExt.afnFiltering.push(dateFiltr);
    }

    window.Component = Component;

})(this.window, this.document);
