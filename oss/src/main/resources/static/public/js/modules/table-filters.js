/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/* JSHint: */
/* globals $: false */

this.sseDataTables = {};

(function(window, document, $, undefined) {
  'use strict';

  if (!window.console) {
    console = {log: function() {}};
  }

  var storeBotGap = 0;

  var getDateFromString = function(dateString) {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        parts = dateString.split(' '),
        month = monthNames.indexOf(parts[1]);

    return new Date(parts[2], month, parts[0]);
  };

  var getBottomGap = function(){
    return $(document).height() - ($(window).height() + $(window).scrollTop());
  };

  /**
   * Constructor
   * @param {jQuery Obj} $dataTableContainer
  **/
  var TableFilters = function($dataTableContainer) {
    // num rows to show per page is based on commercial v domestic account
    if ($('body').hasClass('commercial')) {
      this.numRows = 50;
    } else {
      this.numRows = 24;
    }
    this.$dataTableContainer = $dataTableContainer;
    // this.appliedFilters;
    // this.dataTable;
    // this.$targetTable;
    // // datepicker stuff
    // this.$datePickerFrom;
    // this.$datePickerTo;
    // this.$dateFilterButton;
    // this.$calendarCloseButton;
    // this.$calendarContainer;
    // this.$dateRangeField;
    // this.$dateClearButton;
    // this.startDate;
    // this.endDate;
    // init
    this.init();
  };
  /**
   * initialise some stuff
  **/
  TableFilters.prototype.init = function() {
    var me = this;

    this.$targetTable = this.$dataTableContainer.find('.data-table');
    this.dataTable = this.$targetTable.DataTable(this.settings());
    this.$datePickerFrom = this.$dataTableContainer.find('#date-from div');
    this.$datePickerTo = this.$dataTableContainer.find('#date-to div');
    this.$dateFilterButton = this.$dataTableContainer.find('.btn-date-filter');
    this.$calendarCloseButton = this.$dataTableContainer.find('.calendar-container a.close');
    this.$calendarContainer = this.$dataTableContainer.find('.calendar-container');
    this.$dateRangeField = this.$dataTableContainer.find('input.date-range');
    this.$dateClearButton = this.$dataTableContainer.find('.btn-date-clear');
    this.$paginationButtons = this.$dataTableContainer.find('.paginate_button');

    // is there a better way to retain search functionality without showing the default search input??
    $('.dataTables_filter').hide();

    // add data-date attributes for filter by date range
    this.$targetTable.find('tr').each(function() {
      var dateString = $(this).children('td').first().text();
      $(this).attr('data-date', me.getDateFromString(dateString));
    });

    this.initDatePickers();

    this.events();
  };
  /**
   * initialise the datepickers
  **/
  TableFilters.prototype.initDatePickers = function() {
    var me = this;

    this.$datePickerFrom.datepicker({
      dateFormat: 'dd/mm/yy',
      showOtherMonths: false,
      maxDate: 0,
      defaultDate: '-1m',
      hideIfNoPrevNext: true,
      onSelect: function(selectedDate) {
        me.$datePickerTo.datepicker('option', 'minDate', selectedDate);
      }
    });
    this.$datePickerTo.datepicker({
      dateFormat: 'dd/mm/yy',
      maxDate: 0,
      minDate: '-1m',
      defaultDate: 0,
      showOtherMonths: false,
      hideIfNoPrevNext: true,
      onSelect: function(selectedDate) {
        me.$datePickerFrom.datepicker('option', 'maxDate', selectedDate);
      }
    });
  };
  /**
   * Hook up some UI events
  **/
  TableFilters.prototype.events = function() {
    var me = this;


    // hook up select filters
    me.$dataTableContainer.find('select.js-table-filter').on('change', function(e) {
      me.filterTable($(this));
    });


    // hook up multi select filters
    me.$dataTableContainer.find('select.js-table-filter-multi').on('change', function(e) {
      me.dataTable.draw();
    });


    // hook up text search
    me.$dataTableContainer.find('input.js-table-search').on('keyup', function() {
      var value = $(this).val(),
          $clearButton = me.$dataTableContainer.find('.js-clear-search');
      me.searchTable(value);
      me.showOrHideClearButton($(this), value.length, $clearButton);
    });


    me.$dataTableContainer.find('.js-clear-search').on('click', function() {
      me.clearSearchFilter($(this));
    });


    // hook up to a reset button
    me.$dataTableContainer.find('.reset-table-filters').on('click', function() {
      me.resetFilters();
    });


    // Draw table
    me.dataTable.on('draw', function() {
      me.countFilters();
      me.updateFilterIndicator();
    });


    //Paging
    me.dataTable.on( 'page.dt', function () {
      setTimeout(function() {
        //Keep same distance from bottom of screen
        $('html, body').scrollTop($(document).height() - ($(window).height() + storeBotGap));
      }, 10);
    });


    // hook up events for the date pickers
    me.$dateRangeField.focus(function() {
      me.$calendarContainer.fadeIn();
      me.$calendarContainer.find('.ui-datepicker').show();
    });


    //Close calendar
    me.$calendarCloseButton.click(function() {
      me.$calendarContainer.fadeOut();
    });


    // Apply date filter
    me.$dateFilterButton.click(function() {
      me.startDate = me.$datePickerFrom.datepicker('getDate');
      me.endDate = me.$datePickerTo.datepicker('getDate');
      me.$dateRangeField.val(me.getStringFromDate());
      me.$calendarContainer.fadeOut();

      me.dataTable.draw();
    });


    // Clear date filter
    me.$dateClearButton.click(function() {
      var lastMonth = new Date();

      me.$dateRangeField.val('');
      me.startDate = null;
      me.endDate = null;
      me.$calendarContainer.fadeOut();

      //Reset the date pickers to now and now - 1 month.
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      me.$datePickerFrom.datepicker( 'setDate', lastMonth );
      me.$datePickerTo.datepicker( 'setDate', new Date() );

      me.dataTable.draw();
    });

  };
  /**
   * Helper to get a Date obj from a String
   * @param {String} dateString
   * @return {Date}
  **/
  TableFilters.prototype.getDateFromString = function(dateString) {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        parts = dateString.split(' '),
        month = monthNames.indexOf(parts[1]);

    return new Date(parts[2], month, parts[0]);
  };
  /**
   * Helper to get a formatted date string from a Date obj
   * @return {String}
  **/
  TableFilters.prototype.getStringFromDate = function() {
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        date = this.startDate.getDate() + ' ' + monthNames[parseInt(this.startDate.getMonth())] + ' ' + this.startDate.getFullYear().toString() + ' - ' + this.endDate.getDate() + ' ' + monthNames[parseInt(this.endDate.getMonth())] + ' ' + this.endDate.getFullYear().toString();
    return date;
  };
  /**
   * Resets the table filters to default state
  **/
  TableFilters.prototype.resetFilters = function() {
    var me = this;
    var lastMonth = new Date();

    // reset text search
    me.$dataTableContainer.find('input[name=search-string]').val('');

    // reset date filter
    me.$dateRangeField.val('');
    me.startDate = null;
    me.endDate = null;

    this.$dataTableContainer.find('select.SlectBox').each(function() {
      $(this)[0].sumo.selectItem(0);
    });

    //Reset the date pickers to now and now - 1 month.
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    me.$datePickerFrom.datepicker( 'setDate', lastMonth );
    me.$datePickerTo.datepicker( 'setDate', new Date() );

    // Redraw table without filters
    me.dataTable.search('').column().search('').draw();

  };

  TableFilters.prototype.showOrHideClearButton = function($searchBox, length, $clearButton) {

   if(length > 0) {
    $clearButton.show();
   }
   else {
    $clearButton.hide();
   }
  };

  TableFilters.prototype.clearSearchFilter = function($clearButton) {
     // reset text search
    this.$dataTableContainer.find('input[name=search-string]').val('');
    this.searchTable('');
    $clearButton.hide();
  };


  TableFilters.prototype.filterTable = function($filterColumn) {
    var index = $filterColumn.attr('data-filter');
    this.dataTable.column(index).search($filterColumn.val()).draw();
  };
  TableFilters.prototype.searchTable = function(value) {
    this.dataTable.search(value).draw();
  };
  TableFilters.prototype.countFilters = function() {
    var me = this;
    me.appliedFilters = 0;

    // Check the selected dropdowns, and count if not the first option
    me.$dataTableContainer.find('select.js-table-filter').each(function() {
      if ($(this).children(':selected').index() > 0) {
        me.appliedFilters++;
      }
    });

    // Check the multi selected dropdowns, and count all that are selected
    me.$dataTableContainer.find('select.js-table-filter-multi').each(function() {
      var values = $(this).val();
      if (values) {
        for (var i = 0; i < values.length; i++) {
          me.appliedFilters++;
        }
      }
    });

    // Check if there is a text string
    me.$dataTableContainer.find('input[name=search-string]').each(function() {
      if ($(this).val().length > 0) {
        me.appliedFilters++;
      }
    });

    // Check if there is a date string
    me.$dataTableContainer.find('input[name=date-range]').each(function() {
      if ($(this).val().length > 0) {
        me.appliedFilters++;
      }
    });

  };
  /**
   * Updates the filter indicator panel with number of filters selected
  **/
  TableFilters.prototype.updateFilterIndicator = function() {
    var me = this;
    if (me.$dataTableContainer.find('.filters-indicator').length === 0) {
      return;
    }
    // if no filters applied hide the reset link
    if (me.appliedFilters === 0) {
      me.$dataTableContainer.find('.filters-indicator .reset-table-filters').hide();
      me.$dataTableContainer.find('.filters-indicator span').text('No filters selected');
      me.$dataTableContainer.find('.filters-indicator').removeClass('active-filters');
    }
    // if one filter applied
    if (me.appliedFilters === 1) {
      me.$dataTableContainer.find('.filters-indicator .reset-table-filters').text('Remove filter').show();
      me.$dataTableContainer.find('.filters-indicator span').text('1 filter selected');
      me.$dataTableContainer.find('.filters-indicator').addClass('active-filters');
    }
    // if more than one filters applied
    if (me.appliedFilters > 1) {
      me.$dataTableContainer.find('.filters-indicator .reset-table-filters').text('Remove filters').show();
      me.$dataTableContainer.find('.filters-indicator span').text(me.appliedFilters + ' filters selected');
      me.$dataTableContainer.find('.filters-indicator').addClass('active-filters');
    }
  };
  /**
   * Returns the settings for the data table
   * @return {Obj}
  **/
  TableFilters.prototype.settings = function() {
    var settings = {
      ordering: false,
      info: false,
      lengthChange: false,
      searching: true,
      displayLength: this.numRows
    };
    // if we need to change settings based on table type we can specify them in here
    // eg: if(this.$targetTable.is($('table#meter-reading-history-table'))
    // for the moment just return the default
    return settings;
  };



  // add a custom search function for datepickers
  $.fn.dataTable.ext.search.push(function (settings, data, dataIndex){

    var dateString = data[0];
    var date = getDateFromString(dateString);

    //We needed to be able to get the stored start and end date,
    //so I updated this to store a global object with all of our
    //table instances, and then we need to find the instance from
    //the settings property here so that we can fetch the stored
    //date. If you have a better solution I'm all ears! :) - CL
    var $wrap = $(settings.nTable).closest('.data-table-container');
    var thisInstance = settings.sInstance.slice('DataTables_Table_'.length) || false;
    var min = window.sseDataTables[thisInstance] ? window.sseDataTables[thisInstance].startDate : null; //$wrap.find('#date-from div').datepicker('getDate');
    var max = window.sseDataTables[thisInstance] ? window.sseDataTables[thisInstance].endDate : null; //$wrap.find('#date-to div').datepicker('getDate');

    if ((min === null && max === null) ||
        (isNaN(min) && isNaN(max)) ||
        (isNaN(min) && date <= max) ||
        (!min && !max) ||
        (typeof min === 'undefined' && typeof max === 'undefined') ||
        (min <= date && isNaN(max)) ||
        (min <= date && date <= max)) {
      return true;
    }
    return false;
  });


  // initialise when ready
  $(function() {
    var sseDataTables = [];

    // add a custom search function for the multi select filters
    $('select.js-table-filter-multi').each(function() {
      var $me = $(this);
      $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
        var $multiSelectBox = $me,
          values = $multiSelectBox.val(),
          column = $multiSelectBox.attr('data-filter'),
          meterType = data[column];
        if (values) {
          for (var i = 0; i < values.length; i++) {
            if (values[i].toLowerCase().indexOf(meterType.toLowerCase()) > -1) {
              return true;
            }
          }
        }
      });
    });

    // find every instance of a data table and initialise
    $('.data-table-container').each(function(i) {
       sseDataTables[i] = new TableFilters($(this));
    });

    // Using this to stop the jump when moving from a half length
    // page to a full length page.
    $('.paginate_button').on('mouseenter', function(e) {
      storeBotGap = getBottomGap();
    });

    window.sseDataTables = sseDataTables;
  });

})(this, this.document, $);
