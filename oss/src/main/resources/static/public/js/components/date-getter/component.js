/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Date getter
 */

/* globals $ */

;
(function(window, document, undefined) {
  'use strict';

  var Component = window.Component || function() {};

  var dateGetter = Component.dateGetter = function(el) {
    this.$el = $(el);
    this.init(el);
    this.fromDate = null;
    this.toDate = null;
    this.fromDateStr = null;
    this.toDateStr = null;
    this.prevDate = -1;
    this.currDate = -1;
  };

  /**
   * DateGetter 'Yo
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  dateGetter.prototype.init = function(options) {
    var dis = this;

    this.$trigger = this.$el.find('.trigger');
    this.initialTriggerText = this.$trigger.text();
    this.$fromBox = this.$el.find('.from-box');
    this.$fromBoxPrefix = this.$fromBox.html();
    this.$toBox = this.$el.find('.to-box');
    this.$toBoxPrefix = this.$toBox.html();
    this.$calPopup = this.$el.find('.cal-popup');
    this.$calContain = this.$calPopup.find('.cal-contain');
    this.$calApply = this.$el.find('.cal-apply');
    this.$calClear = this.$el.find('.cal-clear');
    this.$calContain.datepicker({
      onSelect: this.daySelect.bind(this),
      beforeShowDay: this.highlightDayIfInRange.bind(this)
    });

    // this.$calInstance =

    this.$calApply.on('click', this.applyRange.bind(this));

    this.$calClear.on('click', this.clearRange.bind(this));

    this.$trigger.on('click', function() {

      var isActive = $(this).hasClass('is-active');

      if (isActive) {
        $(this).removeClass('is-active');
        dis.$calPopup.removeClass('is-active');
      } else {
        $(this).addClass('is-active');
        dis.$calPopup.addClass('is-active');
      }

    });

  };







  /**
   * [applyRange description]
   * @return {[type]} [description]
   */
  dateGetter.prototype.applyRange = function() {
    var $dtComponent = this.$el.closest('.c-data-table');
    var $table = $dtComponent.find('.dataTable');
    var dt = $table.DataTable();

    this.$trigger.html(this.fromDateStr + ' - ' + this.toDateStr);
    this.$trigger.removeClass('is-active');
    this.$calPopup.removeClass('is-active');

    this.$el.data('dates', {
      from: this.fromDate,
      to: this.toDate
    });

    dt.draw();
  };





  /**
   * clearRange
   * @return {[type]} [description]
   */
  dateGetter.prototype.clearRange = function() {
    var $dtComponent = this.$el.closest('.c-data-table');
    var $table = $dtComponent.find('.dataTable');
    var dt = $table.DataTable();

    this.$trigger.html(this.initialTriggerText);
    //  this.$trigger.html( this.initialTriggerText ).removeClass('is-active');

    this.$calPopup.addClass('is-in-date-from-mode')
      .removeClass('is-in-date-to-mode')
      .removeClass('has-valid-date-range')
      .removeClass('has-from-date')
      .removeClass('has-to-date')
      .removeClass('forced');
    //  .removeClass('is-active')


    this.$el.data('dates', null);
    this.prevDate = this.currDate = -1;
    this.fromDate = this.toDate = null;

    this.$fromBox.html(this.$fromBoxPrefix).data('selected-date', null);
    this.$toBox.html(this.$toBoxPrefix).data('selected-date', null);

    // turn off the click events, they'll be added later
    this.$fromBox.off('click.fromClick');
    this.$toBox.off('click.toClick');

    //Wipe marked days
    //  this.$calContain.datepicker( 'refresh' );
    this.$calContain.datepicker('setDate', new Date());

    //Update the table filtering
    dt.draw();
  };

  /**
   * [highlightDayIfInRange description]
   * @param  {[type]} date [description]
   * @return {[type]}      [description]
   */
  dateGetter.prototype.highlightDayIfInRange = function(date) {
    var hasRange = this.fromDate !== null && this.toDate !== null;
    var classNames = '';
    var lastDay = new Date(date.getTime());
    var lastDayMonth = lastDay.getMonth();

    lastDay.setDate(lastDay.getDate() + 1);

    if (this.fromDate && this.toDate) {
      classNames += date.getTime() >= this.fromDate.getTime() && date.getTime() <= this.toDate.getTime() ? 'is-in-range' : '';
    }

    //Mark the first day of the month so we can give it border radius
    if (date && date.getDate() === 1) {
      classNames += ' is-first-of-month ';
    }

    //Mark the last day of the month so we can give it border radius
    if (lastDay.getMonth() !== lastDayMonth) {
      classNames += ' is-last-of-month ';
    }

    // Mark the start day of the selected date range
    if (date && this.fromDate) {
      if (date.getTime() === this.fromDate.getTime()) {
        classNames += ' ui-datepicker-current-day from-date ';
      }
    }

    if (date && this.toDate) {
      if (date.getTime() === this.toDate.getTime()) {
        classNames += ' ui-datepicker-current-day to-date ';
      }
    }

    return [true, classNames, ''];
  };








  /**
   * [daySelect description]
   * @param  {[type]} dateText [description]
   * @param  {[type]} obj      [description]
   * @return {[type]}          [description]
   */
  dateGetter.prototype.daySelect = function(dateText, obj) {
    var $dayCells = $(this).find('td a');
    var dis = this;

    //set prev to current before updating current
    this.prevDate = this.currDate;

    //Current date is the one you just clicked - convert to time for comparison w/ min/max
    this.currDate = (new Date(obj.selectedYear, obj.selectedMonth, obj.selectedDay)).getTime();




    //Previous is unset, so we're picking a from date //|| this.prevDate == this.currDate
    if (this.prevDate === -1) {

      this.prevDate = this.fromDate = new Date(this.currDate);

      this.$calPopup
        .removeClass('is-in-date-from-mode')
        .addClass('is-in-date-to-mode');

    } else if (this.fromDate && !this.toDate && !this.$calPopup.hasClass('forced')) { //From date already selected, to date not.

      //Date 1 is the minimum of the selected dates
      this.fromDate = new Date(Math.min(this.prevDate, this.currDate));

      //Date 2 is the maximun of the selected dates
      this.toDate = new Date(Math.max(this.prevDate, this.currDate));

      //Enable toggling of from/to
      this.$fromBox.on('click.fromClick', function() {
        if (dis.fromDate && dis.toDate) {
          dis.$calPopup
            .removeClass('is-in-date-to-mode')
            .addClass('forced')
            .addClass('is-in-date-from-mode');
        } else {
          dis.$calPopup.removeClass('is-in-date-to-mode').addClass('is-in-date-from-mode');
        }
      });
      this.$toBox.on('click.toClick', function() {
        if (dis.fromDate) {
          dis.$calPopup
            .removeClass('is-in-date-from-mode')
            .removeClass('forced')
            .addClass('is-in-date-to-mode');
        }
      });


    } else {
      //Already has full range, do logical update.
      //If mode has been manually set back to from mode, then
      if (this.$calPopup.hasClass('is-in-date-from-mode') && this.$calPopup.hasClass('forced')) {
        // set the to date to null, it's dead to us
        this.toDate = null;
        this.$toBox.html(this.$toBoxPrefix).data('selected-date', null);

        // Update the from date to be the currently chosen date
        this.prevDate = this.fromDate = new Date(this.currDate);

        // Sort out the styling
        this.$calPopup
          .removeClass('is-in-date-from-mode')
          .removeClass('forced')
          .removeClass('has-valid-date-range')
          .removeClass('has-to-date')
          .addClass('is-in-date-to-mode');

        // turn off the click listeners
        this.$fromBox.off('click.fromClick');
        this.$toBox.off('click.toClick');
      } else {

        // as per requirements:
        // if selected date is greater than the from-date then we only update the to-date
        // if selected date is less than the from date then we only update the from-date
        if (this.currDate >= this.fromDate.getTime()) {

          this.toDate = new Date(this.currDate);

          this.$calPopup
            .removeClass('is-in-date-from-mode')
            .addClass('is-in-date-to-mode');

        } else {

          this.fromDate = new Date(this.currDate);

          this.$calPopup
            .removeClass('is-in-date-to-mode')
            .addClass('is-in-date-from-mode');

        }

      }
    }


    //These also get set on the collapsed datepicker element:

    this.fromDateStr = $.datepicker.formatDate('dd/mm/y', this.fromDate, {});
    this.toDateStr = $.datepicker.formatDate('dd/mm/y', this.toDate, {});

    if (this.fromDate) {
      this.$fromBox.html(this.$fromBoxPrefix + ' ' + this.fromDateStr).data('selected-date', this.fromDate);
    }

    if (this.toDate) {
      this.$toBox.html(this.$toBoxPrefix + ' ' + this.toDateStr).data('selected-date', this.toDate);
    }

    /**
     * Sets classes that we use for additional styling on the calendar
     */

    if (this.fromDate && this.toDate) {
      this.$calPopup.addClass('has-valid-date-range');
    } else {
      this.$calPopup.removeClass('has-valid-date-range');
    }

    ////////////////

    if (this.fromDate) {
      this.$calPopup.addClass('has-from-date');
    } else {
      this.$calPopup.removeClass('has-from-date');
    }

    ////////////////

    if (this.toDate) {
      this.$calPopup.addClass('has-to-date');
    } else {
      this.$calPopup.removeClass('has-to-date');
    }

  };


  window.Component = Component;

})(this.window, this.document);
