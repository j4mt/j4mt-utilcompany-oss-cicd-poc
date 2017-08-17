'use strict';

/* JSHint: */
/* globals $: false */
/* globals document: false */

$(document).ready(function() {

  $('[data-account-level="mprn"]').hide();
  $('[data-account-level="group"]').addClass('pa-row-closed').css('display', 'none');
  $('[data-account-level="account"]').addClass('pa-row-closed').css('display', 'none');
  $('[data-account-level="master"]').addClass('pa-row-open');
  $('.lt-ie9 .btn').removeClass('reflow');

  $('.pa-dynamic-table table.stripe td:last-child').removeClass('align-right');
  $('.pa-segment-table > div:odd').addClass('pa-odd-row');
  $('.pa-segment-table > div:even').addClass('pa-even-row');

  /**** PREMISES EXPANDING TABLES ****/// HIDE THE DETAILS
  $('.pa-plt-details').hide();

  //Reset table to none checked on load -
  //so we don't have conflicting 'select all' links
  $('.pa-dynamic-table').find('[checked]').attr('checked', false);




  $(".pa-dynamic-table a.pa-dt-toggle").click(function() {
    if ($(this).hasClass('ajax')) {
      return;
    }
    // get the parent ID
    var parentId = $(this).parents('div').attr("id");
    // get the parent account level
    var accountType = $(this).parents('div').attr("data-account-level");
    if ($(this).hasClass("pa-dt-toggle-active")) {
      $(this).removeClass('pa-dt-toggle-active');
      $('[data-owner="' + parentId + '"]').slideUp(function() {
        // force a reflow in IE7
        $('.btn').removeClass('reflow');
      });
      $('div[id="' + parentId + '"]').removeClass('pa-row-open');
    } else {
      $(this).addClass('pa-dt-toggle-active');
      $('[data-owner="' + parentId + '"]').slideDown(function() {
        // force a reflow in IE7
        $('.btn').removeClass('reflow');
      });
      $('div[id="' + parentId + '"]').addClass('pa-row-open');
    }
    return false;
  });



  $('.pa-dt-toggle-link').click(function(e) {
    e.preventDefault();

    var parentId = $(this).parents('div').attr("id");
    var accountType = $(this).parents('div').attr("data-account-level");

    if ($(this).hasClass("pa-dt-toggle-active")) {

      $(this).removeClass('pa-dt-toggle-active');
      $(this).html('View all premises');
      $('[data-owner="' + parentId + '"]').slideUp(function() {});
      $('div[id="' + parentId + '"]').removeClass('pa-row-open');

    } else {

      $(this).addClass('pa-dt-toggle-active');
      $(this).html('Hide all premises');
      $('[data-owner="' + parentId + '"]').slideDown(function() {});
      $('div[id="' + parentId + '"]').addClass('pa-row-open');

    }
  });



  /**
   * Variant bringing Create segment page inline w/ Usage Reports segmentation UI
   * E&O - +ICH 31.8.2015
   */
  $(".pa-account-select-table .select-all").click(function(e) {
    var parentId = '#' + $(this).parents('div').attr("id");
    var $premises = $(parentId).find('tr.pa-dt-mprn-level');
    var $group = $(parentId).find('tr.pa-dt-account-level');

    $('tr.pa-dt-mprn-level').removeClass('row-selected');
    $('tr.pa-dt-mprn-level input:checked').parents('tr').addClass('row-selected');

    if ($(this).hasClass('all-selected')) {
      $(parentId).find('.select-all').removeClass('all-selected');
      $premises.each(function() {
        $(this).find(':checkbox').prop('checked', false);
      });
      $group.each(function() {
        $(this).find(':checkbox').prop('checked', false);
      });
    } else {
      $(parentId).find('.select-all').addClass('all-selected');
      $premises.each(function() {
        $(this).find(':checkbox').prop('checked', true);
      });
      $group.each(function() {
        $(this).find(':checkbox').prop('checked', true);
      });
    }

    $(parentId).find('.select-all.master').each( function() {
      if ($(this).hasClass('all-selected')) {
        $(this).text('Unselect all');
      } else {
        $(this).text('Select all');
      }
    });

    $(parentId).find('.select-all.group').each( function() {
      if ($(this).hasClass('all-selected')) {
        $(this).text('Unselect all in this group account');
      } else {
        $(this).text('Select all in this group account');
      }
    });

    $(parentId).find('.select-all.premises').each( function() {
      if ($(this).hasClass('all-selected')) {
        $(this).text('Unselect all premises');
      } else {
        $(this).text('Select all premises');
      }
    });

    e.preventDefault();
  });




  /**
   * Check/Uncheck tree checkboxes depending on what's checked.
   */
  $(".pa-dynamic-table :checkbox").click(function() {
    var parentId = $(this).parents('div').first().attr("id"),
      currentAccountLevel,
      currentBlock,
      safeCount = 0; //Better safe than sorry

    //DESCENDING
    //Checks every child element below the checked box - OK - downward is covered
    $('[data-owner="' + parentId + '"]').find(':checkbox').attr('checked', this.checked);

    //ASCENDING
    currentAccountLevel = $(this).parents('div').first().attr("data-account-level");
    currentBlock = $(this).closest('[data-account-level="' + currentAccountLevel + '"]');

    //Starts at whatever level the user clicks, and recurses upwards until it runs out of parents :p
    while ((currentAccountLevel !== undefined) && (safeCount < 10)) {

      //if everything in this block is checked - find the parent chkbox - check the parent chkbox - else uncheck the parent
      if (currentBlock.parents('div').first().find('div input:checked').length === currentBlock.parents('div').first().find('div input:checkbox').length) {
        currentBlock.siblings('table').find(':checkbox').attr('checked', true);
      } else {
        currentBlock.siblings('table').find(':checkbox').attr('checked', false);
      }

      //Start climbing...
      currentAccountLevel = currentBlock.parents('div').first().attr("data-account-level");
      currentBlock = $(this).closest('[data-account-level="' + currentAccountLevel + '"]');
      safeCount++;
    }
  });





  //3.2.1 - Check all siblings.. Doesn't seem to be working upwards yet though
  $(".pa-dynamic-table :checkbox.check-my-siblings").click(function() {
    $(this).closest('tbody').find(':checkbox').attr('checked', this.checked);
  });






  // Define our button for toggling
  $(".pa-dynamic-table a.pa-plt-toggle").click(function() {
    if ($(this).hasClass("pa-plt-toggle-active")) {
      $(this).removeClass('pa-plt-toggle-active');
      $(this).parents('div.pa-plt-mprn').removeClass('pa-row-open').find('div.pa-plt-details').slideUp();
    } else {
      $(this).addClass('pa-plt-toggle-active');
      $(this).parents('div.pa-plt-mprn').addClass('pa-row-open').find('div.pa-plt-details').slideDown();
    }
    return false;
  });






  var numberPremises = $('div.pa-plt-mprn').length;
  var premisesCountBy = 5;
  var premisesDynamicCount = premisesCountBy;

  $('.pa-plt-total-count').text(numberPremises);
  $('.pa-plt-dynamic-count').text('1-' + numberPremises);

  if (numberPremises > premisesCountBy) {
    $('.pa-plt-dynamic-count').text('1-' + premisesCountBy);
    $('div.pa-plt-mprn').hide();
    $('div.pa-plt-mprn:lt(' + premisesCountBy + ')').show();
    $('.pa-plt-next-link').html('<a class="pa-plt-show-next-n" href="#">show next ' + premisesCountBy + '</a> ');
    $('.pa-plt-all-link').html('<a class="pa-plt-show-all" href="#">show all</a>');

    $('.pa-plt-show-all').click(function() {
      if ($(this).hasClass("pa-plt-show-all-active")) {
        $('.pa-plt-show-all').removeClass('pa-plt-show-all-active').text('Show all');
        $('div.pa-plt-mprn:gt(' + premisesCountBy + ')').slideUp();
        $('.pa-plt-next-link').html('<a class="pa-plt-show-next-n" href="#">show next ' + premisesCountBy + '</a> ');
      } else {
        $('.pa-plt-show-all').addClass('pa-plt-show-all-active').text('Show 10 at a time');
        $('div.pa-plt-mprn').slideDown();
        $('.pa-plt-previous-link, .pa-plt-next-link').empty();
      }
      return false;
    });

    $('.pa-plt-show-next-n').click(function() {
      var lowCount = premisesDynamicCount + 1;
      $('.pa-plt-dynamic-count').text(lowCount + '-' + (premisesDynamicCount + premisesCountBy));
      $('div.pa-plt-mprn').slice(0, premisesDynamicCount).slideUp();
      $('div.pa-plt-mprn').slice(premisesDynamicCount, premisesDynamicCount += premisesCountBy).slideDown();

      if (premisesDynamicCount >= numberPremises) {
        $('.pa-plt-next-link').empty();
      }

      if (premisesDynamicCount > premisesCountBy) {
        $('.pa-plt-previous-link').html('<a class="pa-plt-show-previous-n" href="#">show previous ' + premisesCountBy + '</a> ');
      }

      return false;
    });

    $('.pa-plt-show-previous-n').click(function() {

      var lowCount = premisesDynamicCount - premisesCountBy + 1;

      $('.pa-plt-dynamic-count').text(lowCount + '-' + premisesDynamicCount);
      $('div.pa-plt-mprn').slice(premisesDynamicCount, numberPremises).slideUp();
      $('div.pa-plt-mprn').slice(premisesDynamicCount - premisesCountBy, premisesDynamicCount).slideDown();

      premisesDynamicCount -= premisesCountBy;

      if (premisesDynamicCount < numberPremises) {
        $('.pa-plt-next-link').html('<a class="pa-plt-show-next-n" href="#">show next ' + premisesCountBy + '</a> ');
      }

      if (premisesDynamicCount < premisesCountBy) {
        $('.pa-plt-previous-link').empty();
      }

      return false;
    });
  }

});
