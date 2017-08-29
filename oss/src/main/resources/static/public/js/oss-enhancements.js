/*
 * ============================================
 *  Commercial OSS Enhancements
 *  By: Adrian Heaney
 *  Date: February 2015
 *
 * ============================================
 */
(function($) {
    "use strict";

    var tableManageSegmentsFilter = typeof(tableManageSegmentsFilter) === 'undefined' ? {} : tableManageSegmentsFilter;
    var tableFilter = typeof(tableFilter) === 'undefined' ? {} : tableFilter;
    var feedback = typeof(feedback) === 'undefined' ? {} : feedback;
    var accountAdmin = typeof(accountAdmin) === 'undefined' ? {} : accountAdmin;

    tableFilter = {
        pagingRows: 30,
        startDate: new Date('01 Jan 2000'),
        endDate: new Date(),
        DataTable: function() {
            if (typeof($.fn.DataTable) !== 'undefined') {
                /* set up custom filtering for the data we need */
                $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
                    var min = tableFilter.startDate;
                    var max = tableFilter.endDate;
                    var typeSelected = new RegExp($('#trans-type').val(), "i");
                    var date = new Date(data[0]) || 0;
                    var type = data[4];
                    if (((isNaN(min) && isNaN(max)) || (isNaN(min) && date <= max) || (min <= date && isNaN(max)) || (min <= date && date <= max)) && (('all'.match(typeSelected)) || (type.match(typeSelected)))) {
                        return true;
                    }
                    return false;
                });
                /* initialise datatable */
                var accHistTable = $('table#acc-history').DataTable({
                    lengthChange: false,
                    displayLength: tableFilter.pagingRows,
                    info: false,
                    sort: false,
                    searching: true,
                    dom: '<"top-paging"p>t<"bottom-paging"p>',
                    drawCallback: tableFilter.reStyleRows
                });
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                $('.btn-date-filter').click(function() {
                    $('input.date-range').val(tableFilter.startDate.getDate() + ' ' + monthNames[tableFilter.startDate.getMonth()] + ' ' + tableFilter.startDate.getFullYear() + ' - ' + tableFilter.endDate.getDate() + ' ' + monthNames[tableFilter.endDate.getMonth()] + ' ' + tableFilter.endDate.getFullYear());
                    $('.calendar-container').fadeOut();
                    accHistTable.draw();
                });
                $('#trans-type').change(function() {
                    $('#trans-type-bottom').val($(this).val());
                    accHistTable.draw();
                });
                $('#trans-type-bottom').change(function() {
                    $('#trans-type').val($(this).val());
                    accHistTable.draw();
                });
            }
        },
        DateRange: function() {
            /* Date range filter */
            $('#date-from div').datepicker({
                dateFormat: "dd/mm/yy",
                showOtherMonths: false,
                maxDate: 0,
                defaultDate: "-1m",
                hideIfNoPrevNext: true,
                onSelect: function() {
                    tableFilter.startDate = $('#date-from div').datepicker('getDate');
                    $('#date-to > div').datepicker("option", "minDate", tableFilter.startDate);
                }
            });
            $('#date-to div').datepicker({
                dateFormat: "dd/mm/yy",
                maxDate: 0,
                defaultDate: 0,
                showOtherMonths: false,
                hideIfNoPrevNext: true,
                onSelect: function() {
                    tableFilter.endDate = $('#date-to div').datepicker('getDate');
                    $('#date-from > div').datepicker("option", "maxDate", tableFilter.endDate);
                }
            });
            /* setup data attributes */
            $('table.stripe tbody tr').each(function() {
                $(this).attr('data-date', new Date($(this).children('td').first().text()));
            });
            /* bind UI actions */
            $('.date-range').focus(function() {
                if ($(this).closest('.table-filters').hasClass('after-table')) {
                    var hgt = $('#acc-history_wrapper').height() + $('.table-filters').first().height() - $('.calendar-container').height();
                    $('.calendar-container').addClass("over").css('top', hgt).fadeIn();
                } else {
                    $('.calendar-container').removeClass("over").css('top', '100%').fadeIn();
                }
            });
            $('.calendar-container a.close').click(function() {
                $('.calendar-container').fadeOut();
            });
            $('#trans-type-bottom, #trans-type').click(function() {
                $('.calendar-container').fadeOut();
            });
        },
        reStyleRows: function() {
            /* add the row stripes */
            $('table.stripe tbody tr:visible:even').children('td').addClass('even-row').removeClass('odd-row');
            $('table.stripe tbody tr:visible:odd').children('td').addClass('odd-row').removeClass('even-row');
            /* don't show any paging if there is only one page of results */
            if ($('.paginate_button.previous').first().hasClass('disabled') && $('.paginate_button.next').first().hasClass('disabled')) {
                $('.dataTables_paginate span').hide();
            } else {
                $('.dataTables_paginate span').show();
            }
        }
    };


    tableManageSegmentsFilter = {
        pagingRows: 30,
        DataTable: function() {
            if (typeof($.fn.DataTable) !== 'undefined') {
                /* set up custom filtering for the data we need */
                $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
                    var typeSelected = $('#trans-type').val();
                    var type = data[3];
                    var fuelSelected = $('#fuel').val();
                    var fuel = data[0];
                    if ((typeSelected === 'All') || (type === typeSelected)) {
                        if ((fuelSelected === 'All') || (fuel === fuelSelected)) {
                            return true;
                        }
                    }
                    return false;
                });
                /* initialise datatable */
                var accHistTable = $('table#acc-manage-segments').DataTable({
                    lengthChange: false,
                    displayLength: tableFilter.pagingRows,
                    info: false,
                    sort: false,
                    searching: true,
                    dom: '<"top-paging"p>t<"bottom-paging"p>',
                    drawCallback: tableFilter.reStyleRows
                });
                $('#trans-type').change(function() {
                    accHistTable.draw();
                });
                $('#fuel').change(function() {
                    accHistTable.draw();
                });
                $('#filter').keyup(function(event) {
                    if ($(this).val().length > 1) {
                        accHistTable.search($(this).val()).draw();
                    }
                });
            }
        }
    };

    $(document).ready(function() {
        if ($('table#acc-history').length) {
            tableFilter.DataTable();
            tableFilter.DateRange();
        }
        var $componentEl = $('#feedback-container');
        if($componentEl) {
          var $widget = $('.c-nps-widget') || null;
          var component = new Component['nps']($componentEl, $widget);
        }
    });

})(jQuery);
