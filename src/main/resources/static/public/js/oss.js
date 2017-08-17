"use strict";

$(document).ready(function () {

  // // Change Region drop-down menu
  // if ($('.change-user-region').length > 0) {
  //   $('.change-user-region a.region-current').click(function(e){
  //     e.preventDefault();
  //     $(this).parents('.change-user-region').toggleClass('is-active');
  //   });
  // }

  $('button[onclick^="doSubmitWithValidation"]').click(function(event){
    event.preventDefault();
  });

  // // Password strength indicator
  // if ($('#password').length) {
  //   $('#password').pwdMeter({
  //     minLength: 8
  //   });
  // }

  // if ($('#newPassword').length) {
  //   $('#newPassword').pwdMeter({
  //     minLength: 8
  //   });
  // }

  // +ICH 30122015 Check eGain Chat availability
  // function checkChatAvailable() {
  // var eGainEndPoint = "http://redoakegainwsa.airtricity.com/Context_Root_Name/egain/chat/entrypoint/agentAvailability/1002";
  // var jqxhr = $.get( eGainEndPoint, function(xml) {
  //     xmlDoc = $.parseXML( xml ),
  //     $xml = $( xmlDoc ),
  //     $availability = $xml.find( "agentAvailability" ).attr('available');
  //     if( $availability ) {
  //       $('.egain-chat-box').animate({right: 400}); 
  //     } else {
  //       $('.egain-chat-box').css("right", "-500px"); 
  //     }
  //   })
  //   .fail(function() {
  //     $('.egain-chat-box').css("right", "-500px"); 
  //   });
  // }

  if ($('.chat-box').length > 0) {
    var d = new Date();
    var day = d.getDay();
    var hours = d.getHours();
    if( 0 < day < 6
      && hours >= 9 
      && (hours < 17 || hours === 17 && mins <= 30)){
      // var intervalID = window.setInterval(checkChatAvailable(), 7000);
      $('.chat-box').addClass('chat-available');
    }
  }

  $('.triggerEgainChatClient').click(function(e) {
    e.preventDefault();

    try{
      if( eglvchathandle != null && eglvchathandle.closed == false ){
        eglvchathandle.focus();
        return;
      }
    }
    catch(err){}
    
    var refererName = "";
    refererName = encodeURIComponent(refererName);
    var refererurl = encodeURIComponent(document.location.href);
    var hashIndex = refererurl.lastIndexOf('#');
    if(hashIndex != -1){
      refererurl = refererurl.substring(0,hashIndex);
    }
    var eglvcaseid = (/eglvcaseid=[0-9]*/gi).exec(window.location.search);
    var vhtIds = '';
    if(typeof EGAINCLOUD != "undefined" && EGAINCLOUD.Account.getAllIds){
      var ids = EGAINCLOUD.Account.getAllIds();
      vhtIds = '&aId=' + ids.a + '&sId=' + ids.s +'&uId=' + ids.u;
    }
    var EG_CALL_Q = window.EG_CALL_Q || [];
    EG_CALL_Q.push( ["enableTracker", true] );

    var channel = $(this).data('egain-channel');
    var channelId = $(this).data('egain-channel-id');
    var userName = $(this).data('user-name');
    var userEmail = $(this).data('user-email');
    var userNumber = $(this).data('user-number');
    var eGainDomain = $(this).data('egain-server'); // http://redoakegainwsa.airtricity.com/

    var eGainChatUrl = eGainDomain + 'system/templates/chat/'+ channel +'/chat.html?subActivity=Chat&entryPointId='+ channelId +'&templateName='+ channel +'&languageCode=en&countryCode=US&ver=v11&eglvrefname='+refererName+'&'+eglvcaseid+'&fieldname_1='+userName+'&fieldname_2='+userEmail+'&fieldname_3='+userNumber+vhtIds;

    if( (eGainChatUrl + refererurl).length <= 2000)
      eGainChatUrl += '&referer='+refererurl;

    var params = "height=680,width=420,resizable=no,scrollbars=no,toolbar=no";
    eglvchathandle = window.open( eGainChatUrl,'',params);
  });


  // make the parent DIV a red box in case its child input has
  // validation error
  if ($(".invalidInput").parent().attr('class') == 'input-row') {
    $(".invalidInput").parent().parent().addClass('error-row');
  } else {
    $(".invalidInput").parent().addClass('error-row');
    $(".invalidRadio").parent().parent().addClass('error-row'); // use
  }

  // change the colour of surrounding blue frame in case of errors
  // inside
  $(".invalidInput,.invalidRadio,.error-row").parents(".module")
    .addClass('open');

  if ($('#transfer-your-account-but').length) {
    $('#transfer-your-account-but').click(function (event) {
      event.preventDefault();
      $('#transfer-your-account-form').submit();
    });
  }

  //Store IE version
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");
  window.sseIEVersion = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));

});

/** Reset all input fields where class="markerCssClass"
    or where class contains markerCssClass among other classes.
    You might want to do this when hiding form fields. Usage:
    1) add "myMarkerClass" to each input field to be cleared
    2) set onclick="clearRelated('myMarkerClass')" to the radio that hides the section
*/
function clearRelated(markerCssClass) {
  $("input[class~=" + markerCssClass + "]:radio").removeAttr('checked');
  $("input[class~=" + markerCssClass + "]:checkbox").removeAttr('checked');
  $("input[class~=" + markerCssClass + "][type=text]").val('');
  $("input[class~=" + markerCssClass + "][type=textarea]").val('');
  $("select[class~=" + markerCssClass + "]").attr('selectedIndex', '0')
    .children("option:selected").removeAttr("selected");
}

function changeGraphPremise(graphUnit, graphPeriod) {
  var premiseId = document.getElementById("selectPremiseId").value;
  document.location.href = "billing-overview.htm?premiseId=" + premiseId + "&graphUnit=" + graphUnit + "&graphPeriod=" + graphPeriod + "#graph";
}

function setClassOnAllBillRows(tableName, className) {
  var table = document.getElementById(tableName);
  var tbody = table.getElementsByTagName("tbody")[0];
  var rows = tbody.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
    var tds = rows[i].getElementsByTagName("td")[1];
    var aTag = tds.getElementsByTagName("a")[0];
    if (aTag !== null && 'Bill' == aTag.text) {
      rows[i].className = className;
    }
  }
}

function updateCountyOptions(country) {
  var county = document.getElementById('county');
  if ('N-I' == country.value) {
    county.disabled = false;
    removeOption('DERRY', county);
    maybeAddOption('LONDONDERRY', county);
  } else if ('ROI' == country.value) {
    county.disabled = false;
    removeOption('LONDONDERRY', county);
    maybeAddOption('DERRY', county);
  } else {
    county.value = "";
    county.disabled = true;
  }
}

function removeOption(valueOfOptionToRemove, selectBox) {
  var i;
  for (i = 0; i < selectBox.length; i++) {
    if (selectBox.options[i].value == valueOfOptionToRemove) {
      selectBox.remove(i);
    }
  }
}

function maybeAddOption(optionToAdd, selectBox) {
  var newOption = document.createElement('option');
  var optionToInsertBefore;
  var indexForDerry = 7;
  var indexForLondonderry = 40;

  if (optionExists(optionToAdd, selectBox)) {
    return;
  }

  newOption.text = optionToAdd;
  newOption.value = optionToAdd;

  if ('LONDONDERRY' == optionToAdd) {
    try {
      optionToInsertBefore = selectBox.options[indexForLondonderry];
      selectBox.add(newOption, optionToInsertBefore);
    } catch (ex) {
      selectBox.add(newOption, indexForLondonderry);
    }
  } else if ('DERRY' == optionToAdd) {
    try {
      optionToInsertBefore = selectBox.options[indexForDerry];
      selectBox.add(newOption, optionToInsertBefore);
    } catch (ex) {
      selectBox.add(newOption, indexForDerry);
    }
  }

}

function optionExists(optionToAdd, selectBox) {
  for (i = 0; i < selectBox.length; i++) {
    if (selectBox.options[i].value == optionToAdd) {
      return true;
    }
  }
  return false;
}

function resetPersonalDetails() {
  copyElementValueToAnotherElement('workPhoneNumber', 'workPhoneNumberOrig');
  copyElementValueToAnotherElement('homePhoneNumber', 'homePhoneNumberOrig');
  copyElementValueToAnotherElement('mobileNumber', 'mobileNumberOrig');
  clearErrors('workPhoneNumber');
  clearErrors('homePhoneNumber');
  clearErrors('mobileNumber');

  clearBlankContactForms();
  clearContactFormErrors();
  unmarkContactsForDeletion();
}

function resetBillingAddressDetails() {
  var country;

  clearBillingAddressFormErrors();

  copyElementValueToAnotherElement('streetAddress', 'streetAddressOrig');
  copyElementValueToAnotherElement('townCity', 'townCityOrig');
  copyElementValueToAnotherElement('postcode', 'postcodeOrig');
  copyElementValueToSelectElement('country', 'countryOrig');
  copyElementValueToSelectElement('county', 'countyOrig');

  country = copyElementValueToSelectElement('country', 'countryOrig').toLowerCase();

  $('#county').closest('.row').hide();
  $('#postcode').closest('.row').hide();

  if (country === 'northern_ireland' || country === 'republic_of_ireland') {
    $('#county').closest('.row').show();
  }
  if (country === 'northern_ireland' || country === 'united_kingdom') {
    $('#postcode').closest('.row').show();
  }
}

function resetMyAirtricityDetails() {
  copyElementValueToAnotherElement('username', 'usernameOrig');
  copyElementValueToAnotherElement('customerEmailAddress', 'customerEmailAddressOrig');
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('newPasswordConfirmation').value = '';
  clearErrors('username');
  clearErrors('currentPassword');
  clearErrors('newPassword');
  clearErrors('newPasswordConfirmation');
  clearErrors('customerEmailAddress');
}

function resetEBilling() {
  copyElementValueToAnotherElement('eBillingEmail', 'eBillingEmailOrig');
  resetYesNoRadioButtons('eBillingYes', 'eBillingNo', 'eBillingSubscribedOrig', '#eBillingEmailRow');
  clearErrors('eBillingEmail');
}

function resetBillingNotification() {
  copyElementValueToAnotherElement('BillingNotEmail', 'BillingNotEmailOrig');
  resetYesNoRadioButtons('BillingNotYes', 'BillingNotNo', 'billingNotificationSubscribedOrig', '#billNotEmailRow');
  clearErrors('BillingNotEmail');
}

function resetMeterReadingReminders() {
  copyElementValueToAnotherElement('meterSMSMobile', 'meterSMSMobileOrig');
  copyElementValueToAnotherElement('meterEmailAddress', 'meterEmailAddressOrig');
  resetYesNoRadioButtons('meterSMSYes', 'meterSMSNo', 'meterReadingReminderSmsSubscribedOrig', '#meterSMSRow');
  resetYesNoRadioButtons('meterEmailYes', 'meterEmailNo', 'meterReadingReminderEmailSubscribedOrig', '#meterEmailRow');
  clearErrors('meterSMSMobile');
  clearErrors('meterEmailAddress');
}

function resetMarketingDetails() {
  resetYesNoRadioButtons('marketingYes', 'marketingNo', 'marketingInformationSubscribedOrig', null);
}

function resetYesNoRadioButtons(yesButton, noButton, orignalValue, rowToShowHide) {
  yesButton = document.getElementById(yesButton);
  noButton = document.getElementById(noButton);
  origValue = document.getElementById(orignalValue).value;
  if ('true' == origValue) {
    yesButton.checked = true;
    if (rowToShowHide !== null) {
      $(rowToShowHide).show();
    }
  } else {
    noButton.checked = true;
    if (rowToShowHide !== null) {
      $(rowToShowHide).hide();
    }
  }
}

function copyElementValueToAnotherElement(elementIdToCopyTo, elementIdToCopy) {
  document.getElementById(elementIdToCopyTo).value = document.getElementById(elementIdToCopy).value;
}

function copyElementValueToSelectElement(elementIdToCopyTo, elementIdToCopy) {
  var sumo = $('#' + elementIdToCopyTo)[0].sumo;
  var value = document.getElementById(elementIdToCopy).value;
  var idx = $('#' + elementIdToCopyTo).find('[value="'+ value +'"]')[0];

  if (typeof idx !== 'undefined'){
    idx = idx.index || 0;
  } else {
    idx = 0;
  }

  sumo.selectItem(idx);

  return $('#' + elementIdToCopyTo).val();
}

function clearErrors(fieldId) {
  $('#' + fieldId + 'Error').remove();
  $('#' + fieldId).removeClass('invalidInput');
  $('#' + fieldId).parent().removeClass('error-row');
}


function onClickContactUs() {
  document.contactUs.submit();
}

function disableButtonAndDoSubmit(button, form) {
  button.disabled = true;
  form.submit();
}

function doSubmitWithValidation(button, form) {
  if ($(form).valid()) {
    button.disabled = true;
    form.submit();
  }
}


/**
 * clearBlankContactForms - when form is closed, clean up.
 */
function clearBlankContactForms() {
  var isEmpty;

  $('.additional-contact-form + .additional-contact-form').each(function () {
    isEmpty = true;
    $(this).find('input:text').each(function () {
      if ($(this).val().length > 0) {
        isEmpty = false;
      }
    });
    if (isEmpty) {
      $(this).remove();
    }
  });
}


/**
 * clearBlankContactForms - when form is closed, clean up errors.
 *
 * Doesn't seem to work. Leaving alone for the moment - low priority
 */
function clearContactFormErrors() {
  if($('#saveAdditionalContacts').length > 0) {
    $('#saveAdditionalContacts').validate().resetForm();
  }
}

/**
 * clearBillingAddressFormErrors
 *
 * resetForm() wouldn't work, and we're under pressure.
 */
function clearBillingAddressFormErrors() {
  $("#saveBillingAddressDetails .-error").removeClass('-error');
  $("#saveBillingAddressDetails label.error").remove();
}

/**
 * If form is cancelled we need to forget about deleting contacts
 */
function unmarkContactsForDeletion() {
  $('.contacts-list')
    .find('.delete-me')
    .removeClass('delete-me')
    .find('input')
    .val('false');
}











/**
 * Version1 Javascript taken from production oss.js after
 * it was noticed that it hadn't been kept in sync with ours.
 *
 * Keep this split.
 *
 * https://eachandother.sifterapp.com/issues/21617
 */

var fileDownloadCheckTimer;
var token;

/**
 * cookiesEnabled
 * Copied from production oss as per https://eachandother.sifterapp.com/issues/21617
 */
function cookiesEnabled(){
  var TEST_COOKIE = 'test_cookie';
  jQuery.cookie( TEST_COOKIE, true );
  if (jQuery.cookie(TEST_COOKIE)){
    jQuery.cookie( TEST_COOKIE, null );  // delete the cookie
    return true;
  } else {
    return false;
  }
}

//=========== OSS CO functions reviewed ==============//

function doAdmin(formId, action) {
  $("#" + formId).submit(
    function() {
      $("#" + formId).attr('action', action);
      return true;
    }
  );
}

function doAdminFieldValue(formId, action, field, value) {
  $("#" + field).attr('value', value);
  $("#" + formId).attr('action', action);
  $("#" + formId).submit();
}

function doModificationUser() {
  $("#roleNameSelected").val($("#availableRoles").val());
  $("#ossCoAdminUserModification").attr('action',
      'oss-co-modify-user-seg.htm');
  $("#ossCoAdminUserModification").submit();
}

function doModificationSegment() {
  var premices_id = "";
  $(".selectedPremice").each(function() {
    var id = $(this).attr("id");
    premices_id += id + ",";
  });
  $("#selectedAccounts").val(premices_id);
  $("#ossCoAdminSegmentModification").attr('action',
      'oss-co-modify-segment-segments.htm');
  $("#ossCoAdminSegmentModification").submit();
}

function doModificationSegmentDone() {
  var premices_id = "";
  $(".selectedPremice").each(function() {
    var id = $(this).attr("id");
    premices_id += id + ",";
  });

  $("#ossCoAdminSegmentSegmentsModification").attr('action',
      'oss-co-modify-segment-done.htm');
  $("#ossCoAdminSegmentSegmentsModification").submit();
}

function doModificationUserNext() {
  $("#ossCoAdminUserModificationNext").attr('action',
      'oss-co-modify-user-done.htm');
  $("#ossCoAdminUserModificationNext").submit();
}

function doGoAsAccount(account, field, form, formAction) {
  $("#" + field).val(account);
  $("#" + form).attr('action', formAction);
  $("#" + form).submit();
}

function doReadingsAsPremice(premNum, utilityType, account, field1, field2, field3, formId, formAction) {
  $("#" + field1).val(premNum);
  $("#" + field2).val(utilityType);
  $("#" + field3).val(account);
  $("#" + formId).attr('action', formAction);
  $("#" + formId).submit();
}

function doGoReportDelay(clazz){
  setTimeout(function(){doGoReport(clazz);}, 150);
}

function doGoReport(clazz) {
  var premices_id = "";
  $('.'+clazz).each(function() {
    if ($(this).attr('checked') == 'checked') {
      var id = $(this).attr('id');
      premices_id += id + ",";
    }
  });
  var reportSelected = "";
  $('.reportType').each(function() {
    if ($(this).attr('checked') == 'checked') {
      reportSelected = $(this).attr('id');
    }
  });

  window.location.href = "go-do-report.htm?reportingPremices=" + premices_id + "&start=" + $("#datepickerStart").val() + "&end=" + $("#datepickerEnd").val() + "&reportTypeSelected="+  reportSelected;
}

function retrieveReportName(){
  var reportCode = "";
  var reportName = "";
  $('.reportType').each(function() {
    if ($(this).attr('checked') == 'checked') {
      reportCode = $(this).attr('id');
    }
    if (reportCode == "DEFAULT"){
      reportName = "Invoice Summary";
    } else if (reportCode == "JOHNLYNN"){
      reportName = "Interval Consumption";
    } else if (reportCode == "CONSUMPTION"){
      reportName = "Consumption";
    } else if (reportCode == "MAXIMUMIMPORTCAPACITY"){
      reportName = "Maximum Import Capacity";
    } else if (reportCode == "TARIFF"){
      reportName = "Cost Breakdown";
    }
  });

  return reportName;
}

function numberOfPrnsSelected(clazz){
  var numPrns = 0;
  $('.'+clazz).each(function() {
    if ($(this).attr('checked') == 'checked') {
      $('.'+ this.id).each(function() {
        numPrns += 1;
      });
    }
  });

  return numPrns;
}

function numberOfPremisesSelected(clazz){
  var numPremises = 0;
  $('.'+clazz).each(function() {
    if ($(this).attr('checked') == 'checked') {
      numPremises += 1;
    }
  });

  return numPremises;
}

function numberOfPremisesSelectedReport(clazz){
  var numPremises = 0;
  $('.'+clazz).each(function() {
    numPremises += 1;
  });

  return numPremises;
}

function prnMonths(numPrns, dateFormats){
  var segPrnMonths;
  var prnMonthsCal = numPrns * monthsRequested(dateFormats);
  return prnMonthsCal;
}

function monthsRequested(dateFormats){
  var partsStart = dateFormats.startDayFormat.split("/");
  var partsEnd = dateFormats.endDayFormat.split("/");

  var d1 = new Date(partsStart[2], partsStart[1] - 1, partsStart[0]);
  var d2 = new Date(partsEnd[2], partsEnd[1] - 1, partsEnd[0]);
  var diff = 0;

  if (d1 && d2) {
        diff = Math.floor((d2.getTime() - d1.getTime()) / 86400000); // ms per day
        diff = Math.round(diff/30);  // average days per month
  }
  return diff;
}

function doGoGetReportDelay(clazz){
  setTimeout(function(){doGoGetReport(clazz);}, 150);
}

function doGoGetReport(clazz) {
  var premices_id = "";

  $('.'+clazz).each(function() {
    if ($(this).attr('checked') == 'checked') {
      var id = $(this).attr('id');
      premices_id += id + ",";
    }
  });

  var extractSelected = "";

  $('.reportType').each(function() {
    if ($(this).attr('checked') == 'checked') {
      extractSelected = $(this).attr('id');
    }
  });

  $("#reportingPremices").val(premices_id);
  $("#progressbarContainer").show('slow');

  if (cookiesEnabled()){
    token = new Date().getTime(); //use the current timestamp as the token value
    $('#dltokenvalueid').val(token);
  }

  $("#goCSVReportForm").attr('action', 'oss-co-do-csv-reports.htm?reportingPremices='+premices_id+'&start='+($("#datepickerStart").val())+'&end='+($("#datepickerEnd").val())+'&dltokenval='+($("#dltokenvalueid").val())+"&extractType="+extractSelected);
    $('#goCSVReportForm').submit();

    if (cookiesEnabled()){
      trackDownload();
    }

}


function trackDownload() {
  progressBarDisplay("");
  fileDownloadCheckTimer = window.setInterval(function () {
    var cookieValue = $.cookie('fileDownloadToken');
    if (cookieValue == token)
     finishDownload();
  }, 1000);
}

function finishDownload() {
   window.clearInterval(fileDownloadCheckTimer);
   $.cookie('fileDownloadToken', null);
   $.unblockUI();
   $("#progressbarContainer").hide('slow');
  }

//======================================================//
//OSS Commercial functions NEED TO BE CLEANED
//Super group functions

function doAddSubmitSuperGroupForm() {
  $("#addedUser").val($("#addedUserLocal").val());
  $("#accountGroupsSelected").val($("#accountGroups").val());
  $("#addSuperGroupForm").submit();
}
function doDelSubmitSuperGroupForm() {
  $("#selectedSuperGroupSGLocalDel").val(
      $("#selectedSuperGroupSGLocalDelLocal").val());
  $("#delSuperGroupForm").submit();
}
function doAddSuperGroupUserForm() {
  $("#addedUserSGUAdd").val($("#addedUserSGULocalAdd").val());
  $("#selectedSuperGroupSGUAdd").val(
      $("#selectedSuperGroupSGULocalAdd").val());
  $("#addSuperGroupUserForm").submit();
}
function doDelSuperGroupUserForm() {
  $("#addedUserSGUDel").val($("#addedUserSGULocalDel").val());
  $("#selectedSuperGroupSGUDel").val(
      $("#selectedSuperGroupSGULocalDel").val());
  $("#delSuperGroupUserForm").submit();
}
function doAddAccountGroupFromSuperGroupForm() {
  $("#selectedSuperGroupAdd").val($("#selectedSuperGroupLocalAdd").val());
  $("#selectedAccountGroupAdd").val($("#selectedAccountGroupLocalAdd").val());
  $("#addAccountGroupToSuperGroupForm").submit();
}
function doDelAccountGroupFromSuperGroupForm() {
  $("#selectedSuperGroupDel").val($("#selectedSuperGroupLocalDel").val());
  $("#selectedAccountGroupDel").val($("#selectedAccountGroupLocalDel").val());
  $("#delAccountGroupFromSuperGroupForm").submit();
}
//Roles and permissions
function doAddPermissionForm() {
  $("#userNameAdd").val($("#userNameAddLocal").val());
  $("#permissionAdd").val($("#permissionAddLocal").val());
  $("#addPermissionForm").submit();
}
function doDelPermissionForm() {
  $("#userNameDel").val($("#userNameDelLocal").val());
  $("#permissionDel").val($("#permissionDelLocal").val());
  $("#delPermissionForm").submit();
}
function doAddUserForm() {
  $("#userNameAddUser").val($("#userNameAddUserLocal").val());
  $("#passwordAddUser").val($("#passwordAddUserLocal").val());
  $("#emailAddUser").val($("#emailAddUserLocal").val());
  $("#roleAddUser").val($("#roleAddUserLocal").val());
  $("#accountGroupIdAddUser").val($("#accountGroupIdAddUserLocal").val());
  $("#addUserForm").submit();
}
function doSetRoleForm() {
  $("#userNameSetRole").val($("#userNameSetRoleLocal").val());
  $("#roleSetRole").val($("#roleSetRoleLocal").val());
  $("#setRoleForm").submit();
}
//Portfolio
function doAddPortfolioForm() {
  $("#namePorAdd").val($("#namePorAddLocal").val());
  $("#accountsPorAdd").val($("#accountsPorAddLocal").val());
  $("#addPortfolioForm").submit();
}
function doDelPortfolioForm() {
  $("#idPorDel").val($("#idPorDelLocal").val());
  $("#delPortfolioForm").submit();
}
function doAddAccountsToPortfolioForm() {
  $("#idPorAddAccnt").val($("#idPorAddAccntLocal").val());
  $("#accountsAddAccnt").val($("#accountsAddAccntLocal").val());
  $("#addAccountsToPortfolioForm").submit();
}
function doDelAccountsFromPortfolioForm() {
  $("#idPorDelAccnt").val($("#idPorDelAccntLocal").val());
  $("#accountsPorDel").val($("#accountsPorDelLocal").val());
  $("#delAccountsToPortfolioForm").submit();
}
function doAddPortfolioUserForm() {
  $("#idPorAddUser").val($("#idPorAddUserLocal").val());
  $("#userNamePorAddUser").val($("#userNamePorAddUserLocal").val());
  $("#addPortfolioUserForm").submit();
}
function doDelPortfolioUserForm() {
  $("#idPorDelUser").val($("#idPorDelUserLocal").val());
  $("#userNamePorDelUser").val($("#userNamePorDelUserLocal").val());
  $("#delPortfolioUserForm").submit();
}
//Go as account
function doGoAsAccountForm(account) {
  $("#selectedAccount").val(account);
  $("#goAsAccountForm").submit();
}
//Go to reports on accounts
function doReportsForAccounts() {
  window.location.href = "charts-and-reports-debtornum-co.htm?accountsSelected=" + $("#accountsSelectedForReport").val();
}

//Go to reports on premises
function doReportsConsForPremises() {
  window.location.href = "reports-premise-cons.htm?premicesSelected=" + $("#premisesSelectedForReport").val();
}

//Go to reports on premises
function doReportsCostForPremises() {
  window.location.href = "reports-premise-cost.htm?premicesSelected=" + $("#premisesSelectedForCostReport").val();
}









var timeOut = 0;
var timeOutCONS_MULTISERIES_CONSENONINTERVAL = 0;
var timeOutCONS_MULTISERIES_COSTENONINTERVAL = 0;
var timeOutCONS_MULTISERIES_CONSEINTERVAL = 0;
var timeOutCONS_MULTISERIES_COSTEINTERVAL = 0;
var timeOutCONS_MULTISERIES_CONSGNONINTERVAL = 0;
var timeOutCONS_MULTISERIES_COSTGNONINTERVAL = 0;
var timeOutENONINTERVAL = 0;
var timeOutEINTERVAL = 0;
var timeOutGNONINTERVAL = 0;

function progressBarDisplay(requestGraphType){
    var progressbar = $( "#progressbar" + requestGraphType ),
      progressLabel = $( ".progress-label" );

    var countUpTimer;
    var timedelay = 1000;
    var countUp_number = -10;

    if(requestGraphType == "CONS_MULTISERIES_CONSENONINTERVAL"){
     clearTimeout(timeOutCONS_MULTISERIES_CONSENONINTERVAL);
    } else if (requestGraphType == "CONS_MULTISERIES_COSTENONINTERVAL") {
      clearTimeout(timeOutCONS_MULTISERIES_COSTENONINTERVAL);
    } else if (requestGraphType == "CONS_MULTISERIES_CONSEINTERVAL") {
      clearTimeout(timeOutCONS_MULTISERIES_CONSEINTERVAL);
    } else if (requestGraphType == "CONS_MULTISERIES_COSTEINTERVAL") {
      clearTimeout(timeOutCONS_MULTISERIES_COSTEINTERVAL);
    } else if (requestGraphType == "CONS_MULTISERIES_CONSGNONINTERVAL") {
      clearTimeout(timeOutCONS_MULTISERIES_CONSGNONINTERVAL);
    } else if (requestGraphType == "CONS_MULTISERIES_COSTGNONINTERVAL") {
      clearTimeout(timeOutCONS_MULTISERIES_COSTGNONINTERVAL);
    } else if (requestGraphType == "ENONINTERVAL"){
      clearTimeout(timeOutENONINTERVAL);
    } else if (requestGraphType == "EINTERVAL") {
      clearTimeout(timeOutEINTERVAL);
    } else if (requestGraphType == "GNONINTERVAL") {
      clearTimeout(timeOutGNONINTERVAL);
    } else {
      clearTimeout(timeOut);
    }

    progressbar.progressbar({
      value: false,
      change: function() {
        progressbar.progressbar( "value" );
      },
      complete: function() {
       // progressLabel.text( "Complete!" );
      }
    });

    function progress() {
      var val = progressbar.progressbar( "value" ) || 0;

      progressbar.progressbar( "value", val + 1 );

      if ( val < 100 ) {
        if (val >= 75) {
          timedelay += 1700;
        }

        if(requestGraphType == "CONS_MULTISERIES_CONSENONINTERVAL"){
          timeOutCONS_MULTISERIES_CONSENONINTERVAL = setTimeout( progress, timedelay );
        } else if (requestGraphType == "CONS_MULTISERIES_COSTENONINTERVAL") {
          timeOutCONS_MULTISERIES_COSTENONINTERVAL = setTimeout( progress, timedelay );
        } else if (requestGraphType == "CONS_MULTISERIES_CONSEINTERVAL") {
          timeOutCONS_MULTISERIES_CONSEINTERVAL = setTimeout( progress, timedelay );
        } else if (requestGraphType == "CONS_MULTISERIES_COSTEINTERVAL") {
          timeOutCONS_MULTISERIES_COSTEINTERVAL = setTimeout( progress, timedelay );
        } else if (requestGraphType == "CONS_MULTISERIES_CONSGNONINTERVAL") {
          timeOutCONS_MULTISERIES_CONSGNONINTERVAL = setTimeout( progress, timedelay );
        } else if (requestGraphType == "CONS_MULTISERIES_COSTGNONINTERVAL") {
          timeOutCONS_MULTISERIES_COSTGNONINTERVAL = setTimeout( progress, timedelay );
        } else if (requestGraphType == "ENONINTERVAL"){
          timeOutENONINTERVAL = setTimeout( progress, timedelay );
        } else if (requestGraphType == "EINTERVAL") {
          timeOutEINTERVAL = setTimeout( progress, timedelay );
        } else if (requestGraphType == "GNONINTERVAL") {
          timeOutGNONINTERVAL = setTimeout( progress, timedelay );
        } else {
          timeOut = setTimeout( progress, timedelay );
        }
      }

    }

    if(requestGraphType == "CONS_MULTISERIES_CONSENONINTERVAL"){
      timeOutCONS_MULTISERIES_CONSENONINTERVAL = setTimeout( progress, timedelay );
    } else if (requestGraphType == "CONS_MULTISERIES_COSTENONINTERVAL") {
      timeOutCONS_MULTISERIES_COSTENONINTERVAL = setTimeout( progress, timedelay );
    } else if (requestGraphType == "CONS_MULTISERIES_CONSEINTERVAL") {
      timeOutCONS_MULTISERIES_CONSEINTERVAL = setTimeout( progress, timedelay );
    } else if (requestGraphType == "CONS_MULTISERIES_COSTEINTERVAL") {
      timeOutCONS_MULTISERIES_COSTEINTERVAL = setTimeout( progress, timedelay );
    } else if (requestGraphType == "CONS_MULTISERIES_CONSGNONINTERVAL") {
      timeOutCONS_MULTISERIES_CONSGNONINTERVAL = setTimeout( progress, timedelay );
    } else if (requestGraphType == "CONS_MULTISERIES_COSTGNONINTERVAL") {
      timeOutCONS_MULTISERIES_COSTGNONINTERVAL = setTimeout( progress, timedelay );
    } else if (requestGraphType == "ENONINTERVAL"){
      timeOutENONINTERVAL = setTimeout( progress, timedelay );
    } else if (requestGraphType == "EINTERVAL") {
      timeOutEINTERVAL = setTimeout( progress, timedelay );
    } else if (requestGraphType == "GNONINTERVAL") {
      timeOutGNONINTERVAL = setTimeout( progress, timedelay );
    } else {
      timeOut = setTimeout( progress, timedelay );
    }
}
