/* JSHint: */
/* globals $: false */

$('html').addClass('js-enabled');

$(document).ready(function() {
  "use strict";

  /*
  ============================================================================
    Meter reminders
  ============================================================================
  */
  if ($('#SMSReminderNo').length) {
    if ($('#SMSReminderNo').is(':checked')) {
      $('#meter-mobile-number').hide();
    }
    $("#SMSReminderNo").click(function() {
      $('#meter-mobile-number').slideUp();
    });
    $("#SMSReminderYes").click(function() {
      $('#meter-mobile-number').slideDown();
    });
  }
  if ($('#EmailReminderNo').length) {
    if ($('#EmailReminderNo').is(':checked')) {
      $('#meter-email').hide();
    }
    $("#EmailReminderNo").click(function() {
      $('#meter-email').slideUp();
    });
    $("#EmailReminderYes").click(function() {
      $('#meter-email').slideDown();
    });
  }

  /*
  ============================================================================
    Show / Hide on Gas / Electricity tabs
  ============================================================================
  */
  if ($('#pa-electricity-tab').length || $('#pa-gas-tab').length) {
    $('li#pa-electricity-tab a').click(function() {
      $('#gas-content').hide();
      $('#electricity-content').show();
      $('li#pa-gas-tab').removeClass('current');
      $(this).parents('li').addClass('current');
      return false;
    });
    $('li#pa-gas-tab a').click(function() {
      $('#electricity-content').hide();
      $('#gas-content').show();
      $('li#pa-electricity-tab').removeClass('current');
      $(this).parents('li').addClass('current');
      return false;
    });
    if ($('li#pa-electricity-tab').hasClass('current')) {
      $('#electricity-content').show();
      $('#gas-content').hide();
    }
    if ($('li#pa-gas-tab').hasClass('current')) {
      $('#electricity-content').hide();
      $('#gas-content').show();
    }
    if ($.url.param("type") == "gas") {
      $('#electricity-content').hide();
      $('#gas-content').show();
      $('li#pa-electricity-tab').removeClass('current');
      $('li#pa-gas-tab').addClass('current');
    }
  }


  if ($('.tabs-module').length) {

    // Setup Tabs initial state
    if ($('li#electricity').length) {
      $('li#electricity').addClass('current');
      $('.electricity-content').show();
      $('.gas-content').hide();
      $('.home-content').hide();

      $('#electricity-content').show();
      $('#gas-content').hide();
      $('#home-content').hide();
    }
    else if ($('li#gas').length) {
      $('li#gas').addClass('current');
      $('.electricity-content').hide();
      $('.gas-content').show();
      $('.home-content').hide();

      $('#electricity-content').hide();
      $('#gas-content').show();
      $('#home-content').hide();
    }
    else if ($('li#home').length) {
      $('li#home').addClass('current');
      $('.electricity-content').hide();
      $('.gas-content').hide();
      $('.home-content').show();

      $('#electricity-content').hide();
      $('#gas-content').hide();
      $('#home-content').show();
    }

    // Add event listeners
    $('li#electricity a').click(function() {
      $('.electricity-content').show();
      $('.gas-content').hide();
      $('.home-content').hide();

      $('#electricity-content').show();
      $('#gas-content').hide();
      $('#home-content').hide();

      $('li#gas').removeClass('current');
      $('li#home').removeClass('current');
      $(this).parents('li').addClass('current');
      return false;
    });
    $('li#gas a').click(function() {
      $('.electricity-content').hide();
      $('.gas-content').show();
      $('.home-content').hide();

      $('#electricity-content').hide();
      $('#gas-content').show();
      $('#home-content').hide();

      $('li#electricity').removeClass('current');
      $('li#home').removeClass('current');
      $(this).parents('li').addClass('current');
      return false;
    });
    $('li#home a').click(function() {
      $('.electricity-content').hide();
      $('.gas-content').hide();
      $('.home-content').show();

      $('#electricity-content').hide();
      $('#gas-content').hide();
      $('#home-content').show();

      $('li#electricity').removeClass('current');
      $('li#gas').removeClass('current');
      $(this).parents('li').addClass('current');
      return false;
    });
  }


  /*
  ============================================================================
    Show / Hide on bill breakdown row
  ============================================================================
  */
  if ($('.view-breakdown').length) {
    $('.view-breakdown').click(function() {
      if ($(this).parents('tr').hasClass('breakdown')) {
        $(this).parents('tr').find('.show-breakdown').hide();
        $(this).parents('tr').removeClass('breakdown');
        return false;
      } else {
        $(this).parents('tr').find('.show-breakdown').slideDown();
        $(this).parents('tr').addClass('breakdown');
        return false;
      }
    });
  }
  /*
  ============================================================================
    COT
  ============================================================================
  */
  if ($('#meterReadNo').is(':checked')) {
    $('#show-meter-reading').hide();
  }
  $("#meterReadYes").click(function() {
    $('#show-meter-reading').slideDown();
  });
  $("#meterReadNo").click(function() {
    $('#show-meter-reading').slideUp();
  });
  if ($('#occupantDetailsNo').is(':checked')) {
    $('#occupant-details-show').hide();
  }
  $("#occupantDetailsYes").click(function() {
    $('#occupant-details-show').slideDown();
  });
  $("#occupantDetailsNo").click(function() {
    $('#occupant-details-show').slideUp();
  });
  /*
  ==============================================
    Moving Out
  ==============================================
  */
  if ($('#moving-out').length) {
    if ($('#movingHouseClose').is(':checked')) {
      $('#close-your-account-row').show();
      $('#moving-continue-row').show();
    }
    if ($('#movingHouseTransfer').is(':checked')) {
      $('#transfer-your-account-row').show();
      $('#moving-continue-row').show();
    }
    $("#movingHouseClose").click(function() {
      $('#transfer-your-account-row').hide();
      $('#close-your-account-row').slideDown();
      $('#moving-continue-row').show();
    });
    $("#movingHouseTransfer").click(function() {
      $('#close-your-account-row').hide();
      $('#transfer-your-account-row').slideDown();
      $('#moving-continue-row').show();
    });
  }

  /*
  ==============================================
    Accordion fold
  ==============================================
  */
  if ($("#accordion_content").length > 0) {
    $('#accordion_content .head').click(function() {
      $(this).next().toggle('slow');
      $(this).toggleClass('selected');
      return false;
    }).next().hide();
  }
  /*
  ==============================================
    Rollovers
  ==============================================
  */
  $(".rollover").hover(function() {
    $(this).attr("src", $(this).attr("src").split(".").join("-rollover."));
  }, function() {
    $(this).attr("src", $(this).attr("src").split("-rollover.").join("."));
  });
  /*
  =================================================
    Table rows for bills
    - hover state required
    - anchor link should be referred to on click
  =================================================
  */
  $('tr.bill-row').hover(function() {
    $(this).addClass('highlight');
  }, function() {
    $(this).removeClass('highlight');
  });
  $(this).parents().siblings(".display-details").slideDown();
  $('table.stripe td:last-child').addClass('align-right');
  $('table.stripe th:last-child').addClass('align-right');
  $('table.stripe tr:last-child td').css('border-bottom', '1px solid #d3d3d3');
  //Excuse the hackiness - needed same styling but without the right alignment
  $('table.stripe-only td:last-child').addClass('align-left');
  $('table.stripe-only th:last-child').addClass('align-left');
  $('table.stripe-only tr:last-child td').css('border-bottom', '1px solid #d3d3d3');

  if ($('p#amount, p.bill-display').length) {
    $('p#amount, p.bill-display').each(function() {
      var billAmount = $(this).children('span, strong').text();
      billAmount = billAmount.replace(/^\D+/, '');
      billAmount = billAmount.replace(/\,/g, '');
      if (billAmount > 999.99) {
        $(this).addClass('large-amount');
      }
    });
  }

  var showDiv;
  if ($('a.show-hide').length) {
    $('a.show-hide').click(function() {
      if ($(this).hasClass('show-hide-open')) {
        showDiv = $(this).attr('href');
        $('#' + showDiv).slideUp();
        $(this).removeClass('show-hide-open');
      } else {
        showDiv = $(this).attr('href');
        $('#' + showDiv).slideDown();
        $(this).addClass('show-hide-open');
      }
      return false;
    });
  }
  if ($('a.show-hide-2').length) {
    $('a.show-hide-2').click(function() {
      if ($(this).hasClass('show-hide-2-open')) {
        showDiv = $(this).attr('href');
        $('#' + showDiv).slideUp();
        $(this).removeClass('show-hide-2-open');
      } else {
        showDiv = $(this).attr('href');
        $('#' + showDiv).slideDown();
        $(this).addClass('show-hide-2-open');
      }
      return false;
    });
  }
  /*
  ==============================================
    Fix the height in doormats
  ==============================================
  */
  if ($('.half-module').length) {
    var max_height = 0;
    $(".dashboard .half-module .module-content").each(function(i) {
      if ($(this).height() > max_height) max_height = $(this).height();
    });
    $(".dashboard .half-module .module-content").height(max_height);
  }
  /*
   * ============================================
   *  Online Payments - Card type selection behaviour
   *  By: Ian Huet, ian.huet@iqcontent.com
   *  Date: 25 January 2013
   * ============================================
   */
  function applyCardFee(applyFee) {
    var payForm = $("#payment-card-type").parents('form');
    var debtornum = $('#debtornum').text();
    var cardFeeNotice = $(".card-fee-notice");
    var cardFeeRow = $(".card-fee");
    var card = $('#payment-card-type').val();
    var payEuro = parseFloat($("#euro").val());
    var payCent = parseFloat($("#cent").val());
    if (isNaN(payEuro)) {
      payEuro = 0;
    }
    if (isNaN(payCent)) {
      payCent = 0;
    }
    var paymentAmount = payEuro + '.' + padCent(payCent.toString());
    var totalAmount = $("#payment-form").find('.total .field .total span');
    if (applyFee) {
      payForm.find('.card-fee').addClass('show');
      if ($(".lt-ie8").length) {
        cardFeeNotice.show(400);
        cardFeeRow.show(400);
      } else {
        cardFeeNotice.slideDown(400);
        cardFeeRow.slideDown(400);
      }
      $.ajax({
        url: 'payment-processing.htm',
        async: false,
        data: {
          paymentAmount: paymentAmount,
          debtornum: debtornum,
          card: card
        },
        success: function(data) {
          var payAmount = parseFloat(removeCurrency($("#payment-form").find('.pay-total .pay-amount strong span').text()));
          var totalAmount = $("#payment-form").find('.total .field .total span');
          $('#cardFee').text(data);
          $('#cardFee1').text(data);
          payAmount += parseFloat(data);
          totalAmount.text(payAmount.toFixed(2));
        }
      });
    } else {
      payForm.find('.card-fee').removeClass('show');
      if ($(".lt-ie8").length) {
        cardFeeNotice.hide(400);
        cardFeeRow.hide(400);
      } else {
        cardFeeNotice.slideUp(400);
        cardFeeRow.slideUp(400);
      }
      totalAmount.text(payEuro + '.' + padCent(payCent.toString()));
    }
  }

  function queryCardFee() {
    var cardType = $("#payment-card-type option:selected");
    if (cardType.hasClass('no-charge')) {
      applyCardFee(false);
    } else {
      applyCardFee(true);
    }
  }

  function updateTotals() {
    var payAmount = $("#payment-form").find('.pay-total .pay-amount strong span');
    var totalAmount = $("#payment-form").find('.total .field .total span');
    var payEuro = parseFloat($("#euro").val());
    var payCent = parseFloat($("#cent").val());
    if (isNaN(payEuro)) {
      payEuro = 0;
    }
    if (isNaN(payCent)) {
      payCent = 0;
    }
    payAmount.text(payEuro + '.' + padCent(payCent.toString()));
    totalAmount.text(payEuro + '.' + padCent(payCent.toString()));
    $('#paymentAmount').val(payEuro + '.' + padCent(payCent.toString()));
    queryCardFee();
  }

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  // Run onLoad to ensure all totals are up to date regardless of where the user arrives at the page from. (e.g. Realex back btn)
  if ($("#payment-form .pay-total .pay-amount strong span").length) {
    updateTotals();
  }
  if ($('#euro').length) {
    $('#euro').keyup(function() {
      updateTotals();
    });
    $('#euro').change(function() {
      updateTotals();
    });
  }
  if ($('#cent').length) {
    $('#cent').keyup(function() {
      updateTotals();
    });
    $('#cent').change(function() {
      updateTotals();
    });
  }
  $(".money").focus(function() {
    if ($(this).val() == "00") {
      $(this).val('');
    }
  });
  $(".money").blur(function() {
    if ($(this).val() === '') {
      $(this).val('00');
    }
  });
  $(".account-number").focus(function() {
    if ($(this).val() == "last 10 digits of your card") {
      $(this).val('');
    }
  });
  $(".number-only").keyup(function() {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
  // Fake the EPP A/C no check process
  $(".epp").hide();
  $(".account").blur(function() {
    var debtornum = $('#debtornum').val();
    $.ajax({
      url: 'checkIsEpp.htm',
      async: false,
      data: {
        debtornum: debtornum
      },
      success: function(data) {
        if (data === "1") {
          $(".not-epp").slideUp(400);
          $(".epp").slideDown(400);
        }
      }
    });
  });
  if ($("#payment-card-type").length) {
    var cardFeeNotice = $(".card-fee-notice");
    cardFeeNotice.hide();
    $("#payment-card-type").change(function() {
      queryCardFee();
    });
  }

  // +ICH: 30.9.2015
  // Critical fix replacing attr function with prop inline w/ jQuery upgrade from 1.4.x to 1.11.x
  $(".option").click(function() {
      $(this).parents(".row").find("input.mprn-or-gprn").prop("readonly", true).addClass("disabled").val('');
      $(this).parents(".field").find("input").prop("readonly", false).removeClass("disabled").focus();
  });
  $(".mprn-or-gprn").each(function() {
      var inputValue = $(this).val();
      if (inputValue != null && inputValue != "") {
          $(this).addClass('active');
          $(this).parents(".field").find(".option").prop("checked", true);
      }
  });
  $(".mprn-or-gprn").focus(function() {
      if (!$(this).hasClass('active')) {
          $(".mprn-or-gprn").val("");
      }
      $(".mprn-or-gprn").removeClass("active");
      $(this).addClass("active");
      $("input.mprn-or-gprn").prop("readonly", true).addClass("disabled");
      $(this).prop("readonly", false).removeClass("disabled");
      $(this).parents(".field").find("input.option").prop("checked", true);
  });

  // Payment Screen - BillPay - lightboxes
  if ($(".how-find-account").length || $(".how-find-mprn-or-gprn").length) {
    $(".how-find-account").colorbox({
      inline: true,
      href: "#how-find-account",
      width: "700px",
      height: "500px"
    });
    $(".how-find-mprn-or-gprn").colorbox({
      inline: true,
      href: "#how-find-mprn-or-gprn",
      width: "700px",
      height: "500px"
    });
  }
  // add to bridge gap between implementatino framework and specified design. Framework can't modify the parent class
  if ($("#payment-form").length) {
    $(".error-msg").each(function() {
      $(this).parents("div.row").addClass("error");
    });
  }
  if ($('#submitBillNot').hasClass('disabled')) {
    $('#submitBillNot').attr('src', 'img/continuation-disabled.png');
  }
  // Customer Choice screen behaviour
  $('.choice-country-payg').click(function(e) {
    e.preventDefault();
    $('.choice-country-payg').removeClass('active');
    $(this).addClass('active');
    $('.choice-supply-payg').removeClass('active');
    $('.supply-choice .green-banner').slideUp(400);
    $('.continue-option').slideDown().find('a').addClass('disabled');
    $('.continue-ni-gas-option').slideUp(400);
    if ($(".module.bill-pay").length && $("#choice-roi").hasClass("active")) {
      $('.continue-option').slideDown().find('button').removeClass('disabled').attr('id', 'submitBillNot');
      $('.continue-ni-gas-option').slideUp(400);
      $('.supply-choice').slideUp(400);
    } else {
      $('.continue-option').find('button').addClass('disabled').attr('id', 'submitBillNot');
      $('.continue-ni-gas-option').slideUp(400);
      $('.supply-choice').slideDown(400);
    }
  });
  $('.choice-supply-payg').click(function(e) {
    e.preventDefault();
    $('.choice-supply-payg').removeClass('active');
    $(this).addClass('active');
    if ($('#choice-gas').hasClass('active')) {
      if ($("#choice-ni").hasClass("active")) {
        $('.supply-choice .green-banner.ni').slideDown(400);
        $('.continue-option').slideUp(400).find('button').addClass('disabled').attr('id', 'submitBillNot');
        $('.continue-ni-gas-option').slideDown(400);
      } else {
        $('.supply-choice .green-banner.roi').slideDown(400);
        $('.continue-option').slideUp(400).find('button').addClass('disabled').attr('id', 'submitBillNot');
        $('.continue-ni-gas-option').slideUp(400);
      }
    } else {
      $('.supply-choice .green-banner').slideUp(400);
      $('.continue-option').slideDown(400).find('button').removeClass('disabled').attr('id', 'submitBillNot');
      $('.continue-ni-gas-option').slideUp(400);
    }
  });
  $('#submitBillNot').click(function(e) {
    if ($('#submitBillNot').hasClass('disabled')) {
      e.preventDefault();
    }
  });

  function removeCurrency(text) {
    return text.replace(/[^\d.]/g, '');
  }

  function removeEuro(text) {
    return text.replace(/€|&euro;/g, '');
  }

  function padCent(cent) {
    if (cent.length < 2) {
      cent = '0' + cent;
    }
    return cent;
  }


  /**** SHOW/HIDE BREADCRUMB DETAILS ****/
  $('.pa-breadcrumbs-hidden-details').hide();
  $('a.pa-breadcrumbs-show-details').toggle(function() {
    $(this).text('Hide details');
    $('.pa-breadcrumbs-hidden-details').slideDown();
  }, function() {
    $(this).text('Show details');
    $('.pa-breadcrumbs-hidden-details').slideUp();
  });
  /**** SHOW/HIDE BREADCRUMB DETAILS ELEC****/
  $('.pa-breadcrumbs-hidden-details-elec').hide();
  $('a.pa-breadcrumbs-show-details-elec').toggle(function() {
    $(this).text('Hide details');
    $('.pa-breadcrumbs-hidden-details-elec').show("slow");
    $(this).parent().parent().addClass('total');
  }, function() {
    $(this).text('Show details');
    $('.pa-breadcrumbs-hidden-details-elec').hide("slow");
    $(this).parent().parent().removeClass('total');
  });
  /**** SHOW/HIDE BREADCRUMB DETAILS GAS****/
  $('.pa-breadcrumbs-hidden-details-gas').hide();
  $('a.pa-breadcrumbs-show-details-gas').toggle(function() {
    $(this).text('Hide details');
    $('.pa-breadcrumbs-hidden-details-gas').show("slow");
    $(this).parent().parent().addClass('total');
  }, function() {
    $(this).text('Show details');
    $('.pa-breadcrumbs-hidden-details-gas').hide("slow");
    $(this).parent().parent().removeClass('total');
  });
  /**** USAGE DATE PICKER ****/
  $("#usage #chooseDifferentBill").change(function() {
    if ($(this).val() == "custom-date-range") {
      $(this).parents('body').colorbox({
        inline: true,
        width: "890px",
        height: '430px',
        href: "#pa_custom_date_range_inline"
      });
    }
  });
  if (jQuery.isFunction(jQuery.fn.datepicker)) {
    $('#pa-datepicker-container').datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3
    });
  }
  /*
      $(function() {
        $( "#pa-datepicker-from" ).datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 3,
          onClose: function( selectedDate ) {
            $( "#pa-datepicker-to" ).datepicker( "option", "minDate", selectedDate );
          }
        });
        $( "#pa-datepicker-to" ).datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 3,
          onClose: function( selectedDate ) {
            $( "#pa-datepicker-from" ).datepicker( "option", "maxDate", selectedDate );
          }
        });
      });
  */
  /**** USAGE CONTENT & ACCORDIONS ****/
  $('div.pa-usage-accordion div.pa-usage-accordion-content, div.pa-usage-content').hide();
  $('div.pa-usage-content.pa-init-open').show();
  $('.pa-usage-toggle').toggle(function() {
    $(this).addClass('pa-usage-toggle-active');
    $(this).parent().next('div').slideDown();
    return false;
  }, function() {
    $(this).removeClass('pa-usage-toggle-active');
    $(this).parent().next('div').slideUp();
    return false;
  });
  $('.pa-usage-accordion a.head').toggle(function() {
    $(this).text('Hide consumption details').addClass('pa-usage-accordion-open selected');
    $(this).next('div').slideDown();
    return false;
  }, function() {
    $(this).text('Show consumption details').removeClass('pa-usage-accordion-open selected');
    $(this).next('div').slideUp();
    return false;
  });

  $('.pa-usage-accordion-content table tr:nth-child(2)')
    .addClass('pa-usage-row2');

  /**** INLINE TABS ****/
  $('.pa-inner-tabs a').click(function() {
    var contentsTabId = $(this).attr("href");
    // reset tabs
    $('.pa-inner-tab-content').hide();
    $('.pa-inner-tabs li').removeClass('current');
    $(this).parent().addClass('current');
    $(contentsTabId).show();

    return false;

    //Commented the following out because it's unreachable... CL

    // get the parent ID
    // var parentId = $(this).parents('div').attr("id");
    // get the parent account level
    // var accountType = $(this).parents('div').attr("data-account-level");
    // if ($(this).hasClass("pa-dt-toggle-active")) {
    //   $(this).removeClass('pa-dt-toggle-active');
    //   $('[data-owner="' + parentId + '"]').slideUp();
    // } else {
    //   $(this).addClass('pa-dt-toggle-active');
    //   $('[data-owner="' + parentId + '"]').slideDown();
    // }
    // return false;
  });

  /**** ADMIN AREA **/

  $('.pa-admin-add-user table.stripe tr:last-child td, .pa-usage-accordion-content table.stripe tr:last-child td, table.stripe.dotted-bottom tr:last-child td, .pa-mprn-summary-solo table tr:last-child td').css('border-bottom', '1px dotted #d3d3d3');
  $('.pa-admin-add-user table.stripe tr td:last-child').removeClass('align-right');
  $(".pa-inline-reset, .pa-inline-delete").click(function() {
    // get the username
    var userName = $(this).parents('tr').find('td:nth-child(1)').html();
    var userEmail = $(this).parents('tr').find('td:nth-child(2)').html();
    // Need to decode to display on the screen
    var div = document.createElement('div');
    div.innerHTML = userName;
    var userNameDecoded = div.firstChild.nodeValue;
    $('.pa-user-change-info').text(userNameDecoded + ' (' + userEmail + ')');
  });
  // start change 17 April 13
  var pacard = $(".pa-inline-reset, .pa-inline-delete");
  if (pacard.length > 0) {
    $(".pa-inline-reset, .pa-inline-delete").colorbox({
      inline: true,
      width: "580px"
    });
  }
  // end change 17 April 13
  $('.pa-admin-account-details-edit, .pa-admin-account-save-action').hide();
  $('.pa-admin-account-edit-action a').toggle(function() {
    $(this).parents('tr').find('.pa-admin-account-details-edit').show();
    $(this).parents('tr').find('.pa-admin-account-details').hide();
    $(this).text('Save name');
    return false;
  }, function() {
    var newNameValue = $(this).parents('tr').find('.pa-admin-account-details-edit input').val();
    $(this).parents('tr').find('.pa-admin-account-details-edit').hide();
    $(this).parents('tr').find('.pa-admin-account-details h4').text(newNameValue);
    $(this).parents('tr').find('.pa-admin-account-details').show();
    $(this).text('Edit name');
    return false;
  });

  // +ICH 2.10.2015: Meter Reading Summary module data loading
  // How many meters unread: > 3month, 1-3 months, < 30 days
  if ($(".mod-meter-reading-summary").length) {
    var apiEndpoint = $(".mod-meter-reading-summary").attr('data-api-endpoint');

    $.ajax({
      url: apiEndpoint,
      type: 'GET',
      dataType: 'json'
    }).done(function(data, textStatus, xhr) {
      // html response means we've been timed out - redirect
      if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
        window.location.replace('/oss_web/login.htm?login_error=timedOut');
      }
      var response = data.meter_reading_summary;
      if (response.length) {
        var infoPanel = $(".mod-meter-reading-summary .info-panel");
        var ceiling = 0;
        infoPanel.each(function(i) {
          $(this).find('span').text(response[i]);
          ceiling = $(this).outerHeight() > ceiling ? $(this).outerHeight() : ceiling;
        });
        $(".mod-meter-reading-summary").removeClass('loading');
        infoPanel.outerHeight(ceiling);

      }
      // no fail state specificied...
    }).fail(function() {
      // no fail state specificied...
    });
  }
});



