
/* JSHint config: */
/* globals $: false */
'use strict';

function updateCagName() {

  var cagName = $('#cagName').val(); // Entered value for segment name
  var cagId = $('#cagId').val(); // Segment ID
  $('#infoMessage').hide().removeClass('red');
  $.ajax({
    url: 'update-cag-name.htm',
    type: 'post',
    async: false,
    data: {
      cagName: cagName,
      cagId: cagId
    },
    success: function(data) {
      if (data.indexOf('successfully') > -1) {
        $('#infoMessage h3').text(data);
        $('#infoMessage').addClass('success-icon').fadeIn().removeClass('hide');
      } else if (data.indexOf('DOCTYPE') > -1) {
        $('#infoMessage h3').text('Sorry, something went wrong. Your session may have timed out. Please try again later.');
        $('#infoMessage').addClass('alert-icon red').fadeIn().removeClass('hide');
      } else {
        $('#infoMessage h3').text(data);
        $('#infoMessage').addClass('alert-icon red').fadeIn().removeClass('hide');
      }
    },
    error: function() {
      $('#infoMessage h3').text('Sorry, something went wrong. Please try again later.');
      $('#infoMessage').addClass('alert-icon red').fadeIn().removeClass('hide');
    }
  });
}

function updateSegName() {
  var segName = $('#segName').val(); // Entered value for segment name
  var segId = $('#segId').val(); // Segment ID
  $('#infoMessage').hide().removeClass('red');
  $.ajax({
    url: 'update-segment-name.htm',
    type: 'post',
    async: false,
    data: {
      segName: segName,
      segId: segId
    },
    success: function(data) {
      if (data.indexOf('successfully') > -1) {
        $('#infoMessage h3').text(data);
        $('#infoMessage').addClass('success-icon').fadeIn().removeClass('hide');
      } else if (data.indexOf('DOCTYPE') > -1) {
        $('#infoMessage h3').text('Sorry, something went wrong. Your session may have timed out. Please try again later.');
        $('#infoMessage').addClass('alert-icon red').fadeIn().removeClass('hide');
      } else {
        $('#infoMessage h3').text(data);
        $('#infoMessage').addClass('alert-icon red').fadeIn().removeClass('hide');
      }
    },
    error: function() {
      $('#infoMessage h3').text('Sorry, something went wrong. Please try again later.');
      $('#infoMessage').addClass('alert-icon red').fadeIn().removeClass('hide');
    }
  });
}
