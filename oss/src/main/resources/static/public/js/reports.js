(function($) {
     'use strict';
     $(document).ready(function() {
         var devMode = false;
         // if (!devMode || !window.console) {
         //     var console = {
         //         log: function() {}
         //     };
         // }
         var generateReport = {
             rules: {
                 CONSUMPTION: ['selectAllPremises', 'segmentSelection', 'updateSelectionText'],
                 MAXIMUMIMPORTCAPACITY: ['intervalOnly', 'hideTabs'],
                 TARIFF: ['hideTabsConditionally', 'oneTypeOnly', 'updateSelectionText', 'segmentSelection'],
                 JOHNLYNN: ['hideTabsIntervalConditionally', 'intervalOnlyMulti', 'segmentSelection', 'updateSelectionText'],
                 DEFAULT: ['selectAllPremises', 'hideTabs', 'updateSelectionText']
             },
             premisesLimit: 450,
             $errorTemplate: $('<div class="report-error"><h3></h3></div>'),
             $premisesCheckbox: $('#accounts-content tr.pa-dt-mprn-level input'),
             $accountsCheckbox: $('tr.pa-dt-account-level input[name="account-selected"]'),
             $segmentCheckbox: $('#segments-content tr.pa-dt-mprn-level input'),
             $allPremisesCheckbox: $('tr.pa-dt-mprn-level input'),
             $intervalRows: $('tr.interval'),
             $nonIntervalRows: $('tr.non-interval'),
             $allRows: $('tr.pa-dt-mprn-level'),
             $tabs: $('.pa-inner-tabs'),
             $mixedSegments: $('.segment-mixed'),
             $notAllIntervalSegments: $('.segment-not-all-interval'),
             $selectAllPremisesLink: $('.select-all.premises'),
             $selectAllAccountBox: $('.pa-dt-account-details input[name=account-selected]'),
             $selectAllGroupLink: $('.select-all.group'),
             $selectAllMasterLink: $('.select-all.master'),
             $viewAllPremisesLink: $('.pa-dt-toggle-link'),
             $unselectSegmentLink: $('a.unselect-segment'),
             $infoBox: $('div[data-id="#info-box"]'),
             $infoCallout: $('.info-callout'),
             $cbdTableSelects: $('table.cbd-report-selects'),
             log: function() {
                 var args;
                 if (window.console && window.console.log && window.console.log.apply && devMode) {
                     args = Array.prototype.slice.call(arguments);
                     window.console.log.apply(window.console, args);
                 }
             },
             bindUI: function() {
                 $('.btn-report-usage').removeAttr('disabled');
                 $('.btn-report-usage').click(function(e) {
                     // submit the form
                     generateReport.doGoReportPremises("USAGE");
                     generateReport.forceReflow();
                     e.preventDefault();
                 })
                 $('.pa-inner-tabs a').click(function(e) {
                     var reportType = $("[name=reportType]:checked").val();
                     var rules = generateReport.rules[reportType];
                     generateReport.reset();
                     generateReport.applyRules(rules);
                     e.preventDefault();
                 })
                 $('.btn-report-csv').removeAttr('disabled');
                 $('.btn-report-csv').click(function(e) {
                     e.preventDefault();

                     // submit the form
                     generateReport.doGoReportPremises("CSV");
                     generateReport.forceReflow();
                 })
                 $('.report-error-tooltip a.close').click(function(e) {
                     $('.report-error-tooltip').hide();
                     e.preventDefault();
                 })
             },
             forceReflow: function() {
                 var classes = $('body').attr('class');
                 $('body').attr('class', classes);
             },
             setLayout: function(rules, dateParams, $button) {
                 generateReport.reset();
                 generateReport.resetAll();
                 generateReport.applyRules(rules);
                 generateReport.log(dateParams);
                 generateReport.dateRange(dateParams);
                 //generateReport.updateSelectionText();
                 // add the selected class
                 $button.parents('table').find('tr').removeClass('row-selected');
                 $button.parents('tr').addClass('row-selected');
             },
             reset: function() {
                 generateReport.allowAllTypes();
                 generateReport.showNextSections();
                 generateReport.resetAccordion();
                 generateReport.resetRows();
                 generateReport.resetCheckboxes();
                 generateReport.resetSelectAll();
                 generateReport.hideRadioSelects();
                 generateReport.changeSelectionText();
                 generateReport.removeAllErrorMessages();
                 generateReport.checkPremisesLimit();
             },
             resetAll: function() {
                 generateReport.resetTabs();
             },
             applyRules: function(rules) {
                 if (rules) {
                     for (var i = 0; i < rules.length; i++) {
                         generateReport.log(rules[i]);
                         var fn = generateReport[rules[i]];
                         if (typeof fn === 'function') fn();
                     }
                 }
             },
             resetTabs: function() {
                 $('.pa-inner-tab-content').hide();
                 $('.pa-inner-tabs li').removeClass('current');
                 $("a[href='#accounts-content']").parent().addClass('current');
                 $('#accounts-content').show();
                 generateReport.showTabs();
                 generateReport.makeMixedSegmentsAvailable();
                 generateReport.makeNotAllIntervalSegmentsAvailable();
             },
             showTabs: function() {
                 generateReport.$tabs.show();
             },
             hideTabs: function() {
                 generateReport.$tabs.hide();
             },
             makeMixedSegmentsUnavailable: function() {
                 generateReport.$mixedSegments.addClass('unavailable');
             },
             makeMixedSegmentsAvailable: function() {
                 generateReport.$mixedSegments.removeClass('unavailable');
             },
             hideTabsConditionally: function() {
                 if ($('.segment-not-mixed').length === 0) {
                     generateReport.hideTabs();
                 } else if (generateReport.$mixedSegments.length > 0) {
                     generateReport.makeMixedSegmentsUnavailable();
                 }
             },
             makeNotAllIntervalSegmentsUnavailable: function() {
                 generateReport.$notAllIntervalSegments.addClass('unavailable');
             },
             makeNotAllIntervalSegmentsAvailable: function() {
                 generateReport.$notAllIntervalSegments.removeClass('unavailable');
             },
             hideTabsIntervalConditionally: function() {
                 if ($('.segment-all-interval').length === 0) {
                     generateReport.hideTabs();
                 } else if (generateReport.$notAllIntervalSegments.length > 0) {
                     generateReport.makeNotAllIntervalSegmentsUnavailable();
                 }
             },
             resetAccordion: function() {
                 $('[data-account-level="mprn"]').hide();
                 $('[data-account-level="group"]').addClass('pa-row-closed').css('display', 'none');
                 $('[data-account-level="account"]').addClass('pa-row-closed').css('display', 'none');
                 $('[data-account-level="master"]').addClass('pa-row-open');
                 $('.pa-dynamic-table a.pa-dt-toggle').removeClass('pa-dt-toggle-active');
             },
             resetCheckboxes: function() {
                 generateReport.changeRadioGroupToCheckbox(function() {
                     generateReport.$premisesCheckbox.prop('checked', false).removeAttr('disabled');
                     generateReport.$segmentCheckbox.prop('checked', false).removeAttr('disabled');
                 });
             },
             resetRows: function() {
                 generateReport.$allRows.removeClass('dimmed unavailable row-selected');
             },
             resetSelectAll: function() {
                 $('a.select-all').hide();
                 generateReport.$selectAllMasterLink.text('Select all').removeClass('all-selected');
                 generateReport.$selectAllGroupLink.text('Select all in this group account');
                 generateReport.$selectAllPremisesLink.text('Select all premises');
                 generateReport.unselectAllSegments(function() {});
                 $('a.select-all').unbind();
             },
             showRadioSelects: function() {
                 generateReport.$cbdTableSelects.show();
                 generateReport.$cbdTableSelects.find('input[type=radio]').prop('checked', false);
             },
             hideRadioSelects: function() {
                 generateReport.$cbdTableSelects.hide();
             },
             selectByType: function() {
                 generateReport.$cbdTableSelects.find('input[type=radio]').change(function() {
                     var value = $(this).val();
                     if (value == 'interval') {
                         generateReport.makeIntervalAvailable();
                         generateReport.makeNonIntervalUnavailable();
                         generateReport.$intervalRows.addClass('row-selected');
                         generateReport.$nonIntervalRows.removeClass('row-selected');
                         generateReport.$intervalRows.find('input').prop('checked', true);
                         generateReport.$nonIntervalRows.find('input').prop('checked', false);
                     } else if (value == 'non-interval') {
                         generateReport.makeIntervalUnavailable();
                         generateReport.makeNonIntervalAvailable();
                         generateReport.$intervalRows.removeClass('row-selected');
                         generateReport.$nonIntervalRows.addClass('row-selected');
                         generateReport.$intervalRows.find('input').prop('checked', false);
                         generateReport.$nonIntervalRows.find('input').prop('checked', true);
                     } else {
                         generateReport.makeIntervalAvailable();
                         generateReport.makeNonIntervalAvailable();
                         generateReport.$intervalRows.removeClass('row-selected');
                         generateReport.$nonIntervalRows.removeClass('row-selected');
                         generateReport.$intervalRows.find('input').prop('checked', false);
                         generateReport.$nonIntervalRows.find('input').prop('checked', false);
                     }
                 })
             },
             restrictToOneTypeAfterSelection: function() {
                 generateReport.$premisesCheckbox.change(function() {
                     generateReport.syndicateCheckboxChange($(this));
                     var numChecked = $('#accounts-content tr.pa-dt-mprn-level input:checked').length;
                     if ($(this).is(':checked')) {
                         if ($(this).closest('tr').hasClass('non-interval')) {
                             generateReport.makeNonIntervalAvailable();
                             generateReport.makeIntervalUnavailable();
                         } else {
                             generateReport.makeIntervalAvailable();
                             generateReport.makeNonIntervalUnavailable();
                         }
                     } else if (numChecked == 0) {
                         generateReport.makeIntervalAvailable();
                         generateReport.makeNonIntervalAvailable();
                     }
                 })
             },
             showNextSections: function() {
                 $('.step:nth-child(1)').next().show();
                 $('.step:nth-child(2)').next().show();
                 $('.step:nth-child(3)').next().show();
             },
             makeNonIntervalUnavailable: function() {
                 generateReport.$nonIntervalRows.addClass('unavailable');
                 generateReport.$nonIntervalRows.find('input').attr('disabled', 'disabled');
             },
             makeNonIntervalAvailable: function() {
                 generateReport.$nonIntervalRows.removeClass('unavailable');
                 generateReport.$nonIntervalRows.find('input').removeAttr('disabled');
             },
             makeIntervalUnavailable: function() {
                 generateReport.$intervalRows.addClass('unavailable');
                 generateReport.$intervalRows.find('input').attr('disabled', 'disabled');
             },
             makeIntervalAvailable: function() {
                 generateReport.$intervalRows.removeClass('unavailable');
                 generateReport.$intervalRows.find('input').removeAttr('disabled');
             },
             oneTypeOnly: function() {
                 generateReport.showRadioSelects();
                 generateReport.selectByType();
                 generateReport.restrictToOneTypeAfterSelection();
             },
             allowAllTypes: function() {
                 generateReport.$premisesCheckbox.unbind();
             },
             changeCheckboxToRadioGroup: function() {
                 if ($('.lt-ie9').length > 0) {
                     generateReport.$premisesCheckbox.each(function() {
                         var $radio = $('<input type="radio" name="radio-group" />');
                         $radio.val($(this).val());
                         $(this).before($radio);
                         $(this).remove();
                     });
                     generateReport.$premisesCheckbox = $('#accounts-content tr.pa-dt-mprn-level input');
                 } else {
                     generateReport.$premisesCheckbox.prop('type', 'radio');
                     generateReport.$premisesCheckbox.prop('name', 'radio-group');
                 }
             },
             changeRadioGroupToCheckbox: function(cb) {
                 if ($('.lt-ie9').length > 0) {
                     generateReport.$premisesCheckbox.each(function() {
                         var $checkbox = $('<input type="checkbox" />');
                         $checkbox.val($(this).val());
                         $(this).before($checkbox);
                         $(this).remove();
                     });
                     generateReport.$premisesCheckbox = $('#accounts-content tr.pa-dt-mprn-level input');
                 } else {
                     generateReport.$premisesCheckbox.prop('type', 'checkbox');
                     generateReport.$premisesCheckbox.prop('name', '');
                 }
                 generateReport.$nonIntervalRows.find('input').removeAttr('disabled');
                 generateReport.$premisesCheckbox.prop('checked', false);
                 generateReport.$segmentCheckbox.prop('checked', false);
                 cb();
             },
             intervalOnly: function() {
                 generateReport.changeCheckboxToRadioGroup();
                 generateReport.makeNonIntervalUnavailable();
             },
             intervalOnlyMulti: function() {
                 generateReport.makeNonIntervalUnavailable();
             },
             syndicateCheckboxChange: function($checkbox) {
                 var value = $checkbox.val();
                 var isChecked = $checkbox.prop('checked');
                 var equivalentCheckboxes = $('input[type="checkbox"][value="' + value + '"]');
                 equivalentCheckboxes.prop('checked', isChecked);
                 if (isChecked) {
                     equivalentCheckboxes.parents('tr').addClass('row-selected');
                 } else {
                     equivalentCheckboxes.parents('tr').removeClass('row-selected');
                 }
             },
             changeSelectionText: function() {
                 var $premisesChecked = $('tr.pa-dt-mprn-level input:checked');
                 var uniqueSelectedPremises = [];
                 var selectedPremises = [];
                 //Create an array of premises
                 $.each($premisesChecked, function() {
                         selectedPremises.push($(this).val());
                     })
                     //Remove duplicates from the array
                 $.each(selectedPremises, function(i, el) {
                     if ($.inArray(el, uniqueSelectedPremises) === -1) uniqueSelectedPremises.push(el);
                 });
                 var numSelected = uniqueSelectedPremises.length;
                 // var numSelected = $('tr.pa-dt-mprn-level input:checked').length;
                 if (numSelected == 0) {
                     $('.number-selected').hide();
                 } else {
                     $('.number-selected').text(numSelected + ' unique premises selected').show();
                     // remove any error messages if necessary
                     generateReport.removeErrorMessage($('p.pa-inner-tab-intro'));
                 }
             },
             checkPremisesLimit: function() {
                 var selectedPremises = [],
                     uniqueSelectedPremises = [];
                 $('tr.pa-dt-mprn-level input').each(function() {
                     if ($(this).is(':checked')) {
                         selectedPremises.push($(this).val());
                     }
                 });
                 $.each(selectedPremises, function(i, el) {
                     if ($.inArray(el, uniqueSelectedPremises) === -1) uniqueSelectedPremises.push(el);
                 });
                 if (uniqueSelectedPremises.length > generateReport.premisesLimit) {
                     generateReport.showErrorTooltip();
                 } else {
                     generateReport.hideErrorTooltip();
                 }
             },
             updateSelectAllLinks: function() {
                 $('tr.pa-dt-mprn-level').removeClass('row-selected');
                 $('tr.pa-dt-mprn-level input:checked').parents('tr').addClass('row-selected');
                 $.each(generateReport.$selectAllMasterLink, function() {
                     if ($(this).hasClass('all-selected')) {
                         $(this).text('Unselect all');
                     } else {
                         $(this).text('Select all');
                     }
                 })
                 $.each(generateReport.$selectAllGroupLink, function() {
                     if ($(this).hasClass('all-selected')) {
                         $(this).text('Unselect all in this group account');
                     } else {
                         $(this).text('Select all in this group account');
                     }
                 })
                 $.each(generateReport.$selectAllPremisesLink, function() {
                     if ($(this).hasClass('all-selected')) {
                         $(this).text('Unselect all premises');
                     } else {
                         $(this).text('Select all premises');
                     }
                 })
             },
             updateSelectionText: function() {
                 generateReport.$premisesCheckbox.change(function() {
                     generateReport.syndicateCheckboxChange($(this));
                     generateReport.changeSelectionText();
                     generateReport.checkPremisesLimit();
                     if ($(this).is(':checked')) {
                         $(this).parents('tr').addClass('row-selected');
                     } else {
                         $(this).parents('tr').removeClass('row-selected');
                     }
                 });
                 $('input[name=cbd-select]').change(function(e) {
                     generateReport.changeSelectionText();
                     generateReport.checkPremisesLimit();
                 });
             },
             selectAllPremises: function() {
                 var propValue;

                 // $('a.select-all').show();
                 generateReport.$selectAllMasterLink.show();
                 generateReport.$selectAllGroupLink.show();

                 var value = $("[name=reportType]:checked").val();
                 if(value !== 'DEFAULT') {
                     generateReport.$selectAllPremisesLink.show();
                 }

                 generateReport.$selectAllPremisesLink.click(function(e) {
                     var $containerDiv = $(this).closest('table').next();
                     if ($(this).hasClass('all-selected')) {
                         propValue = false;
                     } else {
                         propValue = true;
                     }
                     $(this).toggleClass('all-selected');
                     $containerDiv.find(generateReport.$premisesCheckbox).prop('checked', propValue);
                     generateReport.changeSelectionText();
                     generateReport.checkPremisesLimit();
                     generateReport.updateSelectAllLinks();
                     e.preventDefault();
                 });
                 generateReport.$selectAllAccountBox.click(function(e) {
                     var $containerDiv = $(this).parents('[data-account-level="account"]');
                     if ($(this).hasClass('all-selected')) {
                         propValue = false;
                         $(this).removeClass('all-selected');
                         // remove the class for all accounts in this group
                         $containerDiv.find('a.select-all').removeClass('all-selected');
                     } else {
                         propValue = true;
                         $(this).addClass('all-selected');
                         // add the class for all accounts in this group
                         $containerDiv.find('a.select-all').addClass('all-selected');
                         generateReport.removeAllErrorMessages();
                     }
                     $containerDiv.find(generateReport.$premisesCheckbox).prop('checked', propValue);
                     $containerDiv.find(generateReport.$accountsCheckbox).prop('checked', propValue);

                     generateReport.checkPremisesLimit();
                     generateReport.updateSelectAllLinks();
                     // e.preventDefault();
                 });
                 generateReport.$selectAllGroupLink.click(function(e) {
                     var $containerDiv = $(this).parents('[data-account-level="group"]');
                     if ($(this).hasClass('all-selected')) {
                         propValue = false;
                         $(this).removeClass('all-selected');
                         // remove the class for all accounts in this group
                         $containerDiv.find('a.select-all').removeClass('all-selected');
                     } else {
                         propValue = true;
                         $(this).addClass('all-selected');
                         // add the class for all accounts in this group
                         $containerDiv.find('a.select-all').addClass('all-selected');
                     }
                     $containerDiv.find(generateReport.$premisesCheckbox).prop('checked', propValue);
                     $containerDiv.find(generateReport.$accountsCheckbox).prop('checked', propValue);

                     generateReport.changeSelectionText();
                     generateReport.checkPremisesLimit();
                     generateReport.updateSelectAllLinks();
                     e.preventDefault();
                 });
                 generateReport.$selectAllMasterLink.click(function(e) {
                     if ($(this).hasClass('all-selected')) {
                         propValue = false;
                         // remove the class for all accounts in this group
                         $('a.select-all').removeClass('all-selected');
                         $(this).removeClass('all-selected');
                     } else {
                         propValue = true;
                         // add the class for all accounts in this group
                         $('a.select-all').addClass('all-selected');
                         $(this).addClass('all-selected');
                     }
                     generateReport.$premisesCheckbox.prop('checked', propValue);
                     generateReport.$accountsCheckbox.prop('checked', propValue);
                     generateReport.changeSelectionText();
                     generateReport.checkPremisesLimit();
                     generateReport.updateSelectAllLinks();
                     e.preventDefault();
                 });
             },
             unselectAllSegments: function(cb) {
                 generateReport.$segmentCheckbox.prop('checked', false);
                 $('a.use-segment').removeClass('segment-selected');
                 $('a.use-segment').prev(generateReport.$unselectSegmentLink).hide();
                 $('a.use-segment').find('span').text('Use segment');
                 $('a.use-segment').parents('tr').removeClass('row-selected');
                 cb();
             },
             unselectSegment: function($button, $containerDiv) {
                 $containerDiv.find(generateReport.$segmentCheckbox).prop('checked', false);
                 // this is for the unselect link
                 if ($button.hasClass('unselect-segment')) {
                     $button.text('Unselect').hide();
                     $button.next('a.btn').removeClass('segment-selected');
                     $button.next('a.btn').find('span').text('Use segment');
                 }
                 // this is for the unselect blue button
                 else {
                     $button.removeClass('segment-selected');
                     $button.prev(generateReport.$unselectSegmentLink).hide();
                     $button.find('span').text('Use segment');
                 }
                 $button.parents('tr').removeClass('row-selected');
             },
             selectSegment: function($button, $containerDiv) {
                 $containerDiv.find(generateReport.$segmentCheckbox).prop('checked', true);
                 $button.addClass('segment-selected');
                 $button.prev(generateReport.$unselectSegmentLink).show();
                 $button.find('span').text('Selected');
                 $button.parents('tr').addClass('row-selected');
             },
             segmentSelection: function() {
                 //hide by default
                 generateReport.$unselectSegmentLink.hide();
                 $('a.use-segment').unbind('click').bind('click', function(e) {
                     var $button = $(this);
                     var $containerDiv = $(this).parents('table').next('.pa-mprn-summary');
                     // clicked on  a segment that's already selected
                     generateReport.log($(this));
                     if ($button.hasClass('segment-selected')) {
                         generateReport.unselectSegment($button, $containerDiv);
                         generateReport.log('segment-selected');
                     }
                     // clicked on an unselected segment
                     else {
                         generateReport.unselectAllSegments(function() {
                             // select this segment
                             generateReport.selectSegment($button, $containerDiv);
                         });
                     }
                     e.preventDefault();
                 })
                 generateReport.$unselectSegmentLink.click(function(e) {
                     var $button = $(this);
                     var $containerDiv = $(this).parents('table').next('.pa-mprn-summary');
                     generateReport.unselectSegment($button, $containerDiv);
                     e.preventDefault();
                 })
             },
             steps: function() {
                 $("[name=reportType]").prop('checked', false);
                 $("[name=reportType]").change(function() {
                     var parentId = $(this).parents('div.step').attr('id');
                     var formEmpty = true;
                     if (parentId == 'pa-choose-report-types') {
                         var errorMessage = 'Please select a report type to continue';
                         var value = $("[name=reportType]:checked").val();
                         var selectedReportTypes = '';
                         if (value.length == 0) {
                             selectedReportTypes = '<li>None selected</li>';
                         } else {
                             selectedReportTypes = ('<li>' + $('label[for=' + value + ']').html() + '</li>');
                         }
                         if (selectedReportTypes) {
                             formEmpty = false;
                             // $('.btn-report-account-csv').removeClass('btn-report-account-csv').addClass('btn-report-csv');
                             $('.interval-consumption-ui').show();
                             $('.invoice-summary-ui').hide();

                             if (value == 'CONSUMPTION') {
                                generateReport.setLayout(generateReport.rules.CONSUMPTION, 'MM yy', $(this));
                             } else if (value == 'MAXIMUMIMPORTCAPACITY') {
                                generateReport.setLayout(generateReport.rules.MAXIMUMIMPORTCAPACITY, 'dd/mm/yy', $(this));
                             } else if (value == 'JOHNLYNN') {
                                generateReport.setLayout(generateReport.rules.JOHNLYNN, 'dd/mm/yy', $(this));
                             } else if (value == 'DEFAULT') {
                                // $('.btn-report-csv').removeClass('btn-report-csv').addClass('btn-report-account-csv');
                                $('.interval-consumption-ui').hide();
                                $('.invoice-summary-ui').show();

                                generateReport.setLayout(generateReport.rules.DEFAULT, 'dd/mm/yy', $(this));
                             } else {
                                generateReport.setLayout(generateReport.rules.TARIFF, 'MM yy', $(this));
                             }
                             generateReport.setInformationBox(value);
                         }
                     }
                     if (parentId == 'pa-reporting-period') {
                         var errorMessage = 'Please select a start and end date to continue';
                         $('#' + parentId).find("input[type=text]").each(function() {
                             generateReport.log($(this).val());
                             if ($(this).val() == '') {
                                 formEmpty = false;
                                 return false;
                             }
                         });
                     }
                     if (parentId == 'pa-reporting-accounts-or-segments') {
                         var errorMessage = 'Please select a checkbox to continue';
                         $('#' + parentId + ' .pa-report-selection').find("input[type=checkbox]").each(function() {
                             if ($(this).is(':checked')) {
                                 formEmpty = false;
                                 return false;
                             }
                         });
                     }
                     if (parentId == 'pa-reporting-period') {
                         var errorMessage = 'Please select a reporting period to continue';
                         var selectStartValue = $('#datepickerStart').val();
                         var selectEndValue = $('#datepickerEnd').val();
                         formEmpty = false;
                         $('#pa-reporting-period .pa-report-summary .pa-reports-step-data').addClass('pa-reports-step-data-open').html('<p class="statement-number">' + selectStartValue + ' - ' + selectEndValue + '</p>');
                     }
                     if (formEmpty === true) {
                         alert(errorMessage);
                     } else {
                         return;
                     }
                 })
             },
             triggerErrorMessage: function(msg, $element) {
                 if ($element.next().hasClass('report-error') == false) {
                     generateReport.$errorTemplate.find('h3').text(msg);
                     generateReport.$errorTemplate.insertAfter($element);
                     generateReport.log('trigger error message: ', msg);
                 }
             },
             showErrorTooltip: function() {
                 $('.report-error-tooltip').show();
                 $('.btn-report-usage').attr('disabled', 'disabled');
                 $('.btn-report-csv').attr('disabled', 'disabled');
             },
             hideErrorTooltip: function() {
                 $('.report-error-tooltip').hide();
                 $('.btn-report-usage').removeAttr('disabled');
                 $('.btn-report-csv').removeAttr('disabled');
             },
             removeErrorMessage: function($element) {
                $.each($element, function(){
                    var $el = $(this);
                    if ($el.next().hasClass('report-error')) {
                        $el.next().remove();
                        generateReport.log('remove error message: ', $el);
                    }
                });
             },
             removeAllErrorMessages: function() {
                 $('div.report-error').remove();
                 generateReport.log('remove all error messages');
             },
             dateRange: function(format) {
                 var minDate,
                     dateFromSelectedDate = null,
                     dateToSelectedDate = null;
                 // initialise the datepickers
                 $('#date-from, #date-to').datepicker({
                     changeMonth: true,
                     changeYear: true,
                     hideIfNoPrevNext: true,
                     onSelect: function() {
                         if ($('#date-to').datepicker('getDate') < $('#date-from').datepicker('getDate')) {
                             generateReport.triggerErrorMessage('Please select a valid date range', $('div.date-picker'));
                         } else {
                             generateReport.removeErrorMessage($('div.date-picker'));
                         }
                     }
                 });
                 // update the dateFormat after initialisation
                 $('#date-from, #date-to').datepicker("option", "dateFormat", format);
                 // set the minDate
                 if (format === 'MM yy') {
                     minDate = new Date(2012, 0);
                 } else {
                     minDate = new Date(2012, 0, 1);
                 }
                 $('#date-from, #date-to').datepicker("option", "minDate", minDate);
                 // set maxDate
                 $('#date-from, #date-to').datepicker("option", "maxDate", 0);
                 // update the panel button after initialisation
                 if (format === 'MM yy') {
                     $('#date-from, #date-to').datepicker("option", "showButtonPanel", true);
                 } else {
                     $('#date-from, #date-to').datepicker("option", "showButtonPanel", false);
                 }
                 //update the onClose event after initialisation
                 $('#date-from, #date-to').datepicker("option", "onClose", function(date) {
                     if (format === 'MM yy') {
                         var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                         var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                         var newDate = new Date(year, month, 1);
                         $(this).datepicker('setDate', newDate);
                         var fromParts = $('#date-from').datepicker().val().split(' ');
                         var toParts = $('#date-to').datepicker().val().split(' ');
                         var newMonthFrom = new Date(Date.parse(fromParts[0] + " 1, 2012")).getMonth();
                         var newMonthTo = new Date(Date.parse(toParts[0] + " 1, 2012")).getMonth();
                         var newDateFrom = new Date(fromParts[1], newMonthFrom, 1);
                         var newDateTo = new Date(toParts[1], newMonthTo, 1);
                         if (newDateTo < newDateFrom) {
                             generateReport.triggerErrorMessage('Please select a valid date range', $('div.date-picker'));
                         } else {
                             generateReport.removeErrorMessage($('div.date-picker'));
                         }
                     } else {
                         return;
                     }
                 });
                 // bind event to focus of date input fields so we can show/hide the day picker accordingly
                 $('#date-from, #date-to').focus(function(event) {
                     if (format == 'MM yy') {
                         generateReport.hideCalendar();
                     } else {
                         generateReport.showCalendar();
                     }
                 });
                 // set a default date value
                 var now = new Date(),
                     prettyDateFrom,
                     prettyDateTo,
                     monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                 if (format === 'MM yy') {
                     // set the date to
                     prettyDateTo = monthNames[now.getMonth()] + ' ' + now.getFullYear();
                     // set the date from
                     now.setDate(0);
                     prettyDateFrom = monthNames[now.getMonth()] + ' ' + now.getFullYear();
                     $('#date-from, #date-to').datepicker("option", "beforeShow", function(input, inst) {
                         var d = $.datepicker.parseDate('d MM yy', '1 ' + $(this).val());
                         $(this).datepicker('option', 'defaultDate', d);
                         $(this).datepicker('setDate', d);
                     });
                 } else {
                     $('#date-from, #date-to').datepicker("option", "beforeShow", function(input, inst) {});
                     // set the date to
                     prettyDateTo = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
                     // set the date from
                     now.setMonth(now.getMonth() - 1);
                     prettyDateFrom = now.getDate() + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
                 }
                 $("#date-from").val(prettyDateFrom);
                 $("#date-to").val(prettyDateTo);
             },
             hideCalendar: function() {
                 $('.ui-datepicker-calendar').hide();
             },
             showCalendar: function() {
                 $('.ui-datepicker-calendar').show();
             },
             oldReportsInfo: function() {
                 $('a[href="#old-reports"]').click(function() {
                     $(this).parent().next('div[data-id="#old-reports"]').toggle();
                 })
             },
             setInformationBox: function(reportType) {
                if (reportType == 'CONSUMPTION') {
                    generateReport.$infoBox.hide();
                    generateReport.$infoCallout.find('p').hide();
                    generateReport.$infoCallout.find('h2').text('Choose accounts or segments for reports');
                } else if (reportType == 'DEFAULT') {
                    generateReport.$infoBox.find('h3').text('This report should be run for all the premises under a single account.')
                    generateReport.$infoBox.show();
                    generateReport.$infoCallout.find('p').text('Select the account you wish to use.').show();
                    generateReport.$infoCallout.find('h2').text('Select an account');
                } else if (reportType == 'MAXIMUMIMPORTCAPACITY') {
                    generateReport.$infoBox.find('h3').text('This report can only contain a single Interval premises')
                    generateReport.$infoBox.show();
                    generateReport.$infoCallout.find('p').text('Select the premises you wish to use. The premises are based on your SSE Airtricity account setup.').show();
                    generateReport.$infoCallout.find('h2').text('Select a premises');
                } else if (reportType == 'JOHNLYNN') {
                    generateReport.$infoBox.find('h3').text('This report can only contain Interval premises')
                    generateReport.$infoBox.show();
                    generateReport.$infoCallout.find('p').text('Select the accounts you wish to use. Accounts can be used for Billing, Usage, Reports & Meter reading. They are based on your SSE Airtricity account setup.').show();
                    generateReport.$infoCallout.find('h2').text('Choose accounts or segments for reports');
                } else {
                    generateReport.$infoBox.find('h3').text('This report cannot contain a mix of Interval and Non-Interval premises.')
                    generateReport.$infoBox.show();
                    generateReport.$infoCallout.find('p').text('Select the accounts you wish to use. Accounts can be used for Billing, Usage, Reports & Meter reading. They are based on your SSE Airtricity account setup.').show();
                    generateReport.$infoCallout.find('h2').text('Choose accounts or segments for reports');
                }
             },
             doGoReportPremises: function(reportPage) {
                 generateReport.forceReflow();
                 var reportSelected,
                     numSelected,
                     $premisesChecked,
                     selectedPremises,
                     uniqueSelectedPremises,
                     uniqueSelectedAccounts,
                     premisesList,
                     accountList,
                     segmentId,
                     dateFormats,
                     selectedPremises,
                     selectedAccounts,
                     accountsTab,
                     url;

                 //Get the report name
                 reportSelected = $("[name=reportType]:checked").val();
                 if (reportSelected == "") {
                     generateReport.triggerErrorMessage("Report not selected. Required!!");
                     return;
                 } else {
                     dateFormats = generateReport.getDates(reportSelected);
                 }
                 // if the dates are not correct get the flip out.
                 if (!dateFormats) {
                     return;
                 }
                 generateReport.log(reportSelected);

                 if(reportSelected == 'DEFAULT') {
                     // segment level premises and account level premises both have checkbox fields but they are hidden in segments
                     // whichever tab is selected (segments or accounts), the logic to get all checked checkboxes is the same
                     var accountList = $('tr.pa-dt-account-level input[name=account-selected]:checked');
                     if (accountList.length == 0) {
                         generateReport.triggerErrorMessage('Please select one or more accounts', $('.pa-inner-tab-content p.pa-inner-tab-intro:visible'));
                         return;
                     } else {
                        generateReport.removeErrorMessage($('p.pa-inner-tab-intro'));

                        var accountListUrl = '';
                        $.each( accountList, function( key, value ) {
                            accountListUrl += $(value).val() + ',';
                        });
                        accountListUrl = accountListUrl.substring(0, accountListUrl.length - 1);

                        var aList = [];
                        $.each( accountList, function( key, el ) {
                            aList.push(el);
                        });
                        generateReport.populateDataLayer(aList, reportPage, dateFormats);
                        if (reportPage == "CSV") {
                            generateReport.generateURLandCSVSubmit(accountListUrl, dateFormats, reportSelected, 'invoice-summary');
                        } else {
                            generateReport.generateURLAndRedirect(accountListUrl, dateFormats, reportSelected, 'invoice-summary');
                        }
                     }
                 } else {
                     // segment level premises and account level premises both have checkbox fields but they are hidden in segments
                     // whichever tab is selected (segments or accounts), the logic to get all checked checkboxes is the same
                     $premisesChecked = $('tr.pa-dt-mprn-level input:checked');
                     generateReport.log($premisesChecked);
                     if ($premisesChecked.length == 0) {
                         generateReport.triggerErrorMessage('Please select one or more premises', $('.pa-inner-tab-content p.pa-inner-tab-intro:visible'));
                         return;
                     } else {
                         uniqueSelectedPremises = [];
                         selectedPremises = [];
                         //Create an array of premises
                         $.each($premisesChecked, function() {
                                 selectedPremises.push($(this).val());
                             })
                             //Remove duplicates from the array
                         $.each(selectedPremises, function(i, el) {
                             if ($.inArray(el, uniqueSelectedPremises) === -1) uniqueSelectedPremises.push(el);
                         });
                         premisesList = uniqueSelectedPremises.toString();
                         accountsTab = $('#pa-accounts-tab').attr("class");
                         // If the accounts tab is active
                         if (accountsTab == "current") {
                             segmentId = null;
                         } else {
                             segmentId = $('tr.pa-dt-group-account-level.row-selected').attr('data-segment-id');
                         }
                         generateReport.populateDataLayer(uniqueSelectedPremises, reportPage, dateFormats);
                         if (reportPage == "CSV") {
                             generateReport.generateURLandCSVSubmit(premisesList, dateFormats, reportSelected, segmentId);
                         } else {
                             generateReport.generateURLAndRedirect(premisesList, dateFormats, reportSelected, segmentId);
                         }
                     }
                 }
             },
             getDates: function(reportSelected) {
                 //Convert the from and to dates entered
                 //For Consumption and cost breakdown the report format enterd is Month Year
                 //For MIC the format is DD/MM/YYYY
                 var startDateEntered = $("#date-from").val();
                 var endDateEntered = $("#date-to").val();

                 function pad(s) {
                     return (s < 10) ? '0' + s : s;
                 }
                 if (startDateEntered == "" || endDateEntered == "") {
                     generateReport.triggerErrorMessage("Both start and End Date not entered");
                     return;
                 }
                 var startDateEnteredDate = "";
                 var endDateEnteredDate = "";
                 if (reportSelected == "MAXIMUMIMPORTCAPACITY" || reportSelected == "JOHNLYNN" || reportSelected == "DEFAULT") {
                     var partsStart = startDateEntered.split("/");
                     var partsEnd = endDateEntered.split("/");
                     startDateEnteredDate = new Date(partsStart[2], partsStart[1] - 1, partsStart[0]);
                     endDateEnteredDate = new Date(partsEnd[2], partsEnd[1] - 1, partsEnd[0]);
                 } else {
                     startDateEnteredDate = generateReport.convertMonthYearToDate(startDateEntered, "F");
                     endDateEnteredDate = generateReport.convertMonthYearToDate(endDateEntered, "L");
                 }
                 if (startDateEnteredDate > endDateEnteredDate) {
                     generateReport.log('dates wrong');
                     generateReport.triggerErrorMessage('Please select a valid date range', $('div.date-picker'));
                     return false;
                 } else {
                     var startDayFormat = [pad(startDateEnteredDate.getDate()), pad(startDateEnteredDate.getMonth() + 1), startDateEnteredDate.getFullYear()].join('/');
                     var endDayFormat = [pad(endDateEnteredDate.getDate()), pad(endDateEnteredDate.getMonth() + 1), endDateEnteredDate.getFullYear()].join('/');
                     var dateFormats = {
                         startDayFormat: startDayFormat,
                         endDayFormat: endDayFormat
                     };
                     return dateFormats;
                 }
             },
             convertMonthYearToDate: function(monthYear, firstLast) {
                 var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                 var monthNumber = {};
                 for (var i = 0; i < monthNames.length; ++i) {
                     monthNumber[monthNames[i]] = i;
                 }
                 var parts = monthYear.split(/\s* \s*/);
                 var month = monthNumber[parts[0]];
                 var year = parts[1];
                 if (firstLast == "L") {
                     var lastDay = new Date(year, month + 1, 0);
                     return lastDay;
                 } else {
                     var firstDay = new Date(year, month, 1);
                     return firstDay;
                 }
             },
             populateDataLayer: function(uniqueSelectedPremises, reportPage, dateFormats) {
                 //Populate GTM dataLayer
                 if (typeof dataLayer !== 'undefined') {
                     if (reportPage == "CSV") {
                         dataLayer.push({
                             'Category': 'Commercial Report',
                             'Action': 'Download',
                             'Label': retrieveReportName(),
                             'Value': prnMonths(uniqueSelectedPremises.length, dateFormats),
                             'event': 'Run Report'
                         });
                     } else {
                         dataLayer.push({
                             'Category': 'Commercial Report',
                             'Action': 'View Graph',
                             'Label': retrieveReportName(),
                             'Value': uniqueSelectedPremises.length,
                             'event': 'Run Report'
                         });
                     }
                 }
             },
             generateURLAndRedirect: function(premisesList, dateFormats, reportSelected, segmentId) {
                 //Different URL depending on if report run from segments of accounts
                 var url = "go-do-report.htm?start=" + dateFormats.startDayFormat + "&end=" + dateFormats.endDayFormat + "&reportTypeSelected=" + reportSelected;
                 if (segmentId !== null) {
                     url += "&reportingSegment=" + segmentId;
                 } else {
                     url += "&reportingPremises=" + premisesList;
                 }
                 //generateReport.log(url);
                 window.location.href = url;
             },
             generateURLandCSVSubmit: function(premisesList, dateFormats, reportSelected, segmentId) {
                 $("#progressbarContainer").show('slow');
                 if (cookiesEnabled()) {
                     token = new Date().getTime(); //use the current timestamp as the token value
                     $('#dltokenvalueid').val(token);
                 }

                 if(segmentId === 'invoice-summary') {
                     $("#reportingSegment").val(null);
                     $("#reportingPremices").val(null);
                     $("#reportingDebtors").val(premisesList);
                     $("#goReportForm").attr('action', 'oss-co-do-csv-reports.htm?reportingDebtors=' + premisesList + '&start=' + dateFormats.startDayFormat + '&end=' + dateFormats.endDayFormat + '&dltokenval=' + $("#dltokenvalueid").val()) + "&extractType=" + reportSelected;
                 }
                 else if (segmentId !== null) {
                     $("#reportingSegment").val(segmentId);
                     $("#reportingPremices").val(null);
                     $("#reportingDebtors").val(null);
                     $("#goReportForm").attr('action', 'oss-co-do-csv-reports.htm?reportingSegment=' + segmentId + '&start=' + dateFormats.startDayFormat + '&end=' + dateFormats.endDayFormat + '&dltokenval=' + $("#dltokenvalueid").val()) + "&extractType=" + reportSelected;
                 } else {
                     $("#reportingPremices").val(premisesList);
                     $("#reportingSegment").val(null);
                     $("#reportingDebtors").val(null);
                     $("#goReportForm").attr('action', 'oss-co-do-csv-reports.htm?reportingPremices=' + premisesList + '&start=' + dateFormats.startDayFormat + '&end=' + dateFormats.endDayFormat + '&dltokenval=' + $("#dltokenvalueid").val()) + "&extractType=" + reportSelected;
                 }
                 $('#goReportForm').submit();
                 if (cookiesEnabled()) {
                     trackDownload();
                 }
             }
         }
         var showReport = {
             dateRange: function(format) {
                 // initialise the datepickers
                 $('#date-from, #date-to').datepicker({
                     changeMonth: true,
                     changeYear: true,
                     maxDate: '0',
                     defaultDate: "-1m",
                     hideIfNoPrevNext: true
                 });
                 generateReport.log(format);
                 // update the dateFormat after initialisation
                 $('#date-from, #date-to').datepicker("option", "dateFormat", format);
                 // update the panel button after initialisation
                 if (format === 'MM yy') {
                     $('#date-from, #date-to').datepicker("option", "showButtonPanel", true);
                 } else {
                     $('#date-from, #date-to').datepicker("option", "showButtonPanel", false);
                 }
                 //update the onClose event after initialisation
                 $('#date-from, #date-to').datepicker("option", "onClose", function(date) {
                     if (format === 'MM yy') {
                         var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                         var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                         $(this).datepicker('setDate', new Date(year, month, 1));
                     } else {
                         return;
                     }
                 });
                 // bind event to focus of date input fields so we can show/hide the day picker accordingly
                 $('#date-from, #date-to').focus(function(event) {
                     if (format == 'MM yy') {
                         generateReport.hideCalendar();
                     } else {
                         generateReport.showCalendar();
                     }
                 });
             },
             hideCalendar: function() {
                 $('.ui-datepicker-calendar').hide();
             },
             showCalendar: function() {
                 $('.ui-datepicker-calendar').show();
             }
         }
         if ($('.pa-report-selection').length) {
             $('#goReportForm').append('<input id="reportingDebtors" name="reportingDebtors" type="hidden">');
             generateReport.bindUI();
             generateReport.steps();
             generateReport.oldReportsInfo();
         };
         if ($('form#chartsAndReportsForm').length) {
             var reportType = $('form#chartsAndReportsForm').attr('class');
             var format;
             if (reportType == 'TARIFF' || reportType == 'CONSUMPTION') {
                 format = 'MM yy';
             } else if (reportType == 'MAXIMUMIMPORTCAPACITY') {
                 format = 'dd/mm/yy';
                 //no tabs
                 $('.pa-tabs').hide();
             }
             showReport.dateRange(format);
             generateReport.oldReportsInfo();
         }
     })
 })(jQuery)
