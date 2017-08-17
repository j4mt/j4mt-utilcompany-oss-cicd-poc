"use strict";

(function($) {
    $(document).ready(function() {

        if ($('.pa-admin-area').length) {
            accountAdmin.init();
        }
        if ($('#segment-modification').length) {
            segmentAdmin.init();
        }
    });
})(jQuery);

var segmentAdmin = typeof(segmentAdmin) === 'undefined' ? {} : segmentAdmin;

segmentAdmin = {
    toBeRemoved: 0,
    toBeAdded: 0,
    linkClicked: false,
    formSubmitted: false,
    init: function() {
        this.navigateAwayCheck();
    },
    navigateAwayCheck: function() {
        var that = this;
        // this is used if the user clicks a link
        $('a[href!=#]').not('a[href*=javascript], .btn.btn-save').on('click', function() {
            segmentAdmin.linkClicked = true;
            // let's figure out if any changes have been made
            segmentAdmin.toBeRemoved = $('input.existing[data-included=false]').length;
            segmentAdmin.toBeAdded = $('input[data-included=true]').not('.existing').length;
            if (segmentAdmin.toBeAdded > 0 || segmentAdmin.toBeRemoved > 0) {

                var url = $(this).attr('href');

                $(this).colorbox({
                    inline: true,
                    transition: 'none',
                    href: function() {
                        return '#navigate-away-modal';
                    },
                    width: function() {
                        var widthOption = $(this).attr('data-modal-width');
                        return widthOption ? widthOption + 'px' : '890px';
                    },
                    initialWidth: function() {
                        var widthOption = $(this).attr('data-modal-width');
                        return widthOption ? widthOption + 'px' : '890px';
                    },
                    scrolling: false,
                    onComplete: function() {
                        $.colorbox.resize();
                    }
                });

                $('a.exit').on('click', function() {
                    window.location.href = url;
                });

                $('a.close').on('click', function() {
                    $.colorbox.close();
                });

            } else {
                $.colorbox.remove();
            }
        });

        // this is triggered if browser navigation is used
        window.onbeforeunload = function(e) {
            var target;
            e = e || window.event;
            // find the target of the page change, different for some browsers
            if (typeof(e.explicitOriginalTarget) != 'undefined') {
                // Firefix
                target = e.explicitOriginalTarget.nodeName.toLowerCase();
            } else if (typeof(e.target) != 'undefined') {
                // chrome
                target = e.target.activeElement.nodeName.toLowerCase();
            } else if (typeof(document.activeElement) != 'undefined') {
                // ie
                target = document.activeElement.nodeName.toLowerCase();
            }

            if (target == 'button') {
                segmentAdmin.linkClicked = true;
            }

            segmentAdmin.toBeRemoved = $('input.existing[data-included=false]').length;
            segmentAdmin.toBeAdded = $('input[data-included=true]').not('.existing').length;

            // let's figure out if any changes have been made

            if ((segmentAdmin.toBeAdded > 0 || segmentAdmin.toBeRemoved > 0) && !segmentAdmin.linkClicked) {
                var message = 'You have not saved your segment updates';
                if (e) {
                    e.returnValue = message;
                }
                return message;
            } else {
                return;
            }
        };

    }
};


var accountAdmin = typeof(accountAdmin) === 'undefined' ? {} : accountAdmin;

/* this is additional to the scripts unchanged above for commercial account admin */
accountAdmin = {
    devMode: false,
    segmentId: '',
    init: function() {

        // init the premises cache
        accountAdmin.premisesCache = new PremisesCache();
        // init the account cache
        accountAdmin.accountsCache = new AccountsCache();

        accountAdmin.segmentId = $('#segId').val();
        if ($('#pa-segments-tab-content').length) {
            accountAdmin.variables.isGroup = false;
            accountAdmin.preloadFirstPremises();
        }
        accountAdmin.bindUiActions();
        accountAdmin.bindAddUndoUIActions();
        accountAdmin.bindFilterUiActions();
        accountAdmin.getPremisesCount({
            "return_type": "premises"
        });

        // set the currently existing premises in the segment
        accountAdmin.setCurrentPremisesInSegment();

        // init an array to keep track of what groups are full
        this.variables.fullGroups = [];
    },
    variables: {
        GrpDelTxt: 'Remove group',
        SegDelTxt: 'Remove segment',
        addAccTxt: 'Add to group',
        remAccTxt: 'Remove from group',
        remPremTxt: 'Remove from segment',
        addPremTxt: 'Add to segment',
        undoHtml: '<p class="added">Added<a href="#" class="add-to-group undo">Undo</a></p>',
        undoSegHtml: '<p class="added">Added<a href="#" class="add-to-segment undo">Undo</a></p>',
        undoGrpSegHtml: '<p class="added"><span class="accounts-added"></span><a href="#" class="add-all-matches undo">Undo</a></p>',
        undoAccSegHtml: '<p class="added">Added <span class="accounts-added"></span> matching premises<a href="#" class="add-all-matches undo">Undo</a></p>',
        removeInfoHtml: '<span class="bold">This account has been removed from this group:</span><br />',
        removeSegInfoHtml: '<span class="bold">This premises has been removed from this segment:</span><br />',
        undoPremFilterHtml: '<p class="added">Added <span class="accounts-added"></span> premises<a href="#" class="add-filtered-results undo">Undo</a></p>',
        undoRemovePremFilterHtml: '<p class="added">Removed <span class="accounts-added"></span> premises<a href="#" class="add-filtered-results undo remove">Undo</a></p>',
        isGroup: true,
        //segmentsWsUrl: "http://localhost:8091/api/premises",
        segmentsWsUrl: "apiSegments.htm",
        premisesReturnLimit: 10,
        activeQuery: false,
        needToSave: false,
        maxPremises: 15,
        addingPremisesText: 'Adding premises, please wait...',
        removingPremisesText: 'Removing premises, please wait...',
        defaultLoadingText: 'Please wait...',
        cachedFilteredPremises: false,
        filteredPremisesToBeAdded: []
    },

    getPremisesCount: function(requestData) {
        $('#matches').hide();
        var me = this;
        $.ajax({
            url: accountAdmin.variables.segmentsWsUrl,
            type: 'GET',
            dataType: 'json',
            data: requestData
        }).done(function(data, textStatus, xhr) {

            if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
                // html response means we've been timed out - redirect
                window.location.replace('/oss_web/login.htm?login_error=timedOut');
            }
            if (data.status === "ok") {
                accountAdmin.updateTotalMatches(data.premises.length);
                if (!me.variables.cachedFilteredPremises) {
                    // cache all the premises in this segemnt
                    me.premisesCache.setUnfilteredPremisesCache(data.premises);
                    me.variables.cachedFilteredPremises = true;
                }

            }
            if (data.status === "fail" || data.status === "error") {
                $('#matches').hide();
            }
        }).fail(function() {
            $('#matches').hide();
        });
    },
    checkFilteredPremisesExisting: function() {

        var showRemoveButton = true,
            premIds = this.premisesCache.getPremisesCache('viewall');

        if (premIds.length > this.premisesCache.exisitingPremisesArray.length) {
            showRemoveButton = false;
        } else {
            for (var i = 0; i < premIds.length; i++) {
                var premises = premIds[i];
                if ((this.premisesCache.exisitingPremisesArray.indexOf(parseInt(premises)) === -1) && (this.premisesCache.exisitingPremisesArray.indexOf(premises) === -1)) {
                    showRemoveButton = false;
                    break;
                }
            }
        }
        return showRemoveButton;

    },
    checkFilteredPremisesToBeAdded: function() {

        var showUndoButton = true,
            premIds = this.premisesCache.getPremisesCache('viewall'),
            existingPlusToBeAdded;

        existingPlusToBeAdded = this.premisesCache.getToBeAddedPremises().concat(this.premisesCache.exisitingPremisesArray);

        if (premIds.length > existingPlusToBeAdded.length) {
            showUndoButton = false;
        } else {
            for (var i = 0; i < premIds.length; i++) {
                if (existingPlusToBeAdded.indexOf(parseInt(premIds[i])) === -1) {
                    showUndoButton = false;
                    break;
                }
            }
        }
        return showUndoButton;
    },

    checkFilteredPremisesToBeRemoved: function() {
        var showUndoButton = true,
            premIds = this.premisesCache.getPremisesCache('viewall'),
            toBeRemoved = [];

        $.each($('input[data-included=false]'), function() {
            toBeRemoved.push($(this).val());
        });

        if (premIds.length > toBeRemoved.length) {
            showUndoButton = false;
        } else {
            for (var i = 0; i < premIds.length; i++) {
                if (toBeRemoved.indexOf(premIds[i]) === -1) {
                    showUndoButton = false;
                    break;
                }
            }
        }
        return showUndoButton;
    },

    getFilteredPremises: function(cb) {
        var requestData = {
            "return_type": "premises"
        };
        var type = $('#premises-type').val() === "all" ? null : $('#premises-type').val();
        var fuel = $('#fuel-type').val() === "all" ? null : $('#fuel-type').val();
        var search = $('#text-premises-filter').val();

        if (type) {
            requestData.meter_type = type;
        }
        if (fuel) {
            requestData.fuel_type = fuel;
        }
        if (search) {
            requestData.search_text = search;
        }

        $.ajax({
            url: accountAdmin.variables.segmentsWsUrl,
            type: 'GET',
            dataType: 'json',
            data: requestData
        }).done(function(data, textStatus, xhr) {

            if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
                // html response means we've been timed out - redirect
                window.location.replace('/oss_web/login.htm?login_error=timedOut');
            }
            if (data.status === "ok") {
                cb(data.premises);
            }
            if (data.status === "fail" || data.status === "error") {
                $('#matches').hide();
                $('button.add-filtered-results').hide();

                $('button.add-filtered-results').next('p.added').remove();
            }
        }).fail(function() {
            $('#matches').hide();
            $('button.add-filtered-results').hide();

            $('button.add-filtered-results').next('p.added').remove();
        });
    },
    addFilteredPremisesSetToSegment: function(premisesSet) {
        var that = this;
        var premisesIds = [];

        for (var i = 0; i < premisesSet.length; i++) {
            var premises = premisesSet[i];
            var premisesId = premises.premises_id;
            premisesIds.push(premisesId);
        }
        var loaderContainer = '#viewall-premises';
        that.startLoading(loaderContainer, accountAdmin.variables.addingPremisesText);
        setTimeout(function() {
            if (typeof premisesSet !== 'undefined' && premisesSet.length > 0) {
                that.addMultiplePremisesToSegment(premisesIds);
                that.checkForFullAccountsAndGroups(function() {
                    that.endLoading(loaderContainer);
                });
            }
        }, 10);
    },

    undoAddFilteredPremisesSetToSegment: function(premisesSet, checkFullGroupsAndAccounts) {
        if (checkFullGroupsAndAccounts === true) {
            var loaderContainer = '#viewall-premises';
            this.startLoading(loaderContainer, accountAdmin.variables.removingPremisesText);
        }

        var that = this;
        var premises = [];
        var i;

        for (i = 0; i < premisesSet.length; i++) {
            var premisesId = premisesSet[i].premises_id;
            premises.push(premisesId);
        }

        for (i = 0; i < premises.length; i++) {
            var premiseId = premises[i];
            premiseId = parseInt(premiseId);
            if (that.premisesCache.exisitingPremisesArray.indexOf(premiseId) === -1) {
                that.undoAddUnaddedPremisesToSegment(premiseId, false);
            }
        }


        if (checkFullGroupsAndAccounts === true) {
            // check if all the premises in an account are full
            that.checkForFullAccountsAndGroups(function() {
                that.endLoading(loaderContainer);

                $('button.add-filtered-results').next('p.added').remove();
                $('button.add-filtered-results').show();
            });

        }

        // Check if we're using a counter row and update it, removing if 0 premises remain to be added, updating otherwise
        var $counterRow = $('.existing-segment-accounts .pa-mprn-summary .premises-counter');
        that.showCounterOrPremisesRows();
    },
    removeFilteredPremisesSetFromSegment: function(premisesSet) {
        for (var i = 0; i < premisesSet.length; i++) {
            var premisesId = premisesSet[i].premises_id;
            this.removePremisesFromSegment(premisesId);
        }
        this.applyPremisesViewAddAllButtonStyle();
    },
    undoRemoveFilteredPremisesSetFromSegment: function(premisesSet) {
        for (var i = 0; i < premisesSet.length; i++) {
            var premisesId = premisesSet[i].premises_id;
            this.undoRemovePremisesFromSegment(premisesId);
        }

        $('button.add-filtered-results').next('p.added').remove();
        $('button.add-filtered-results').show();
        this.applyPremisesViewAddAllButtonStyle();
    },
    applyPremisesViewAddAllButtonStyle: function() {
        if (this.checkFilteredPremisesExisting()) {
            // check if the filtered result are on the to be removed list
            // if they're all on the to be removed list show the undo button
            if (($('#view-by .premises.active').length > 0) && (($('#text-premises-filter').val() !== '') || ($('#premises-type').val() !== 'all') || ($('#fuel-type').val() !== 'all'))) {
                $('button.add-filtered-results').addClass('remove');
                $('button.add-filtered-results span').text('Remove all from segment');
                $('button.add-filtered-results').show();

                $('button.add-filtered-results').next('p.added').remove();
                if (accountAdmin.checkFilteredPremisesToBeRemoved()) {
                    $('button.add-filtered-results').hide();
                    $('button.add-filtered-results').after($(accountAdmin.variables.undoRemovePremFilterHtml));
                    this.updateTotalFilteredAdded('removed');
                } else {
                    $('button.add-filtered-results').show();
                }
            }
        } else {
            // check if the filtered result are on the to be added list
            // if they're all on the to be added list show the undo button
            if (($('#view-by .premises.active').length > 0) && (($('#text-premises-filter').val() !== '') || ($('#premises-type').val() !== 'all') || ($('#fuel-type').val() !== 'all'))) {
                $('button.add-filtered-results span').text('Add all to segment');
                $('button.add-filtered-results').removeClass('remove');
                $('button.add-filtered-results').show();

                $('button.add-filtered-results').next('p.added').remove();
                if (accountAdmin.checkFilteredPremisesToBeAdded()) {
                    $('button.add-filtered-results').hide();
                    $('#infoMessageSegment').hide().removeClass('red');
                    $('button.add-filtered-results').after($(accountAdmin.variables.undoPremFilterHtml));
                    this.updateTotalFilteredAdded('added');
                }
            } else {
                $('button.add-filtered-results').hide();
            }

        }
    },
    updateTotalFilteredAdded: function(addedOrRemoved) {
        var premIds = this.premisesCache.getPremisesCache('viewall'),
            count = 0;

        for (var i = 0; i < premIds.length; i++) {
            var premisesId = premIds[i];

            if (
                (
                    (addedOrRemoved === 'added') &&
                    (this.premisesCache.exisitingPremisesArray.indexOf(parseInt(premisesId)) === -1) &&
                    (this.premisesCache.exisitingPremisesArray.indexOf(premisesId) === -1)
                ) || (
                    (addedOrRemoved === 'removed') &&
                    (
                        (this.premisesCache.exisitingPremisesArray.indexOf(parseInt(premisesId)) > -1) ||
                        (this.premisesCache.exisitingPremisesArray.indexOf(premisesId) > -1)
                    )

                )) {
                count++;
            }
        }
        $('.save-updates .accounts-added').text(count);
    },
    updateTotalMatches: function(value) {
        // update total matches text
        $('#matches span.total-matches').text(value);
        $('#matches').show();
    },


    addAccountToGroup: function(link, undo) {
        if (!undo) {
            link.closest('td').find('input[type="checkbox"]').prop('checked', true);
            link.closest('td').find('a.add-to-group.btn').hide();
            link.closest('tr').addClass('account-added');
            link.closest('td').prepend(accountAdmin.variables.undoHtml);
        } else {
            link.closest('td').find('input[type="checkbox"]').prop('checked', false);
            link.closest('td').find('a.add-to-group.btn').show();
            link.closest('tr').removeClass('account-added');
            link.closest('td').find('p').first().remove();
        }
    },
    removeAccountFromGroup: function(link) {
        if (!link.hasClass('undo')) {
            var location = link.closest('tr').find('td:nth-child(4)').text();
            var undoBtn = '<a class="btn btn-danger remove-from-group undo" href="#"><span>Undo</span></a>';
            link.closest('tr').after('<tr class="account-removed"><td colspan="4">' + accountAdmin.variables.removeInfoHtml + location + '</td><td>' + undoBtn + '</td></tr>');
            link.closest('td').find('input[type="checkbox"]').prop('checked', false);
            link.closest('tr').hide().css('visibility', 'hidden');
            // force button position IE7
            $('.btn-save').removeClass('reflow');

        } else {
            var prevRow = link.closest('tr').prev('tr');
            $(prevRow).find('input[type="checkbox"]').prop('checked', true);
            link.prev('input[type="checkbox"]').prop('checked', true);
            link.removeClass('undo').text(accountAdmin.variables.remAccTxt).closest('tr').removeClass('account-removed');

            link.closest('tr').remove();
            $(prevRow).show().css('visibility', 'visible');
            // force button position IE7
            $('.btn-save').removeClass('reflow');
        }
    },


    bindUiActions: function() {
        $('a.remove-group').click(function() {
            if ($(this).closest('tr').hasClass('danger')) {
                accountAdmin.clearDelete($(this));
            } else {
                accountAdmin.confirmDelete($(this));
            }
        });

        $('.new-segment-accounts').on('click', '.pa-dt-master-account-level a.pa-dt-toggle.ajax', function(e) {

            e.preventDefault();
            var parentId = $(this).parents('div').attr("id");
            // get the parent account level
            var accountType = $(this).parents('div').attr("data-account-level");


            if ($(this).hasClass("pa-dt-toggle-active")) {
                // kill any child scroll events
                $('#' + parentId).find('div[data-account-level="account"]').each(function() {
                    var scrollId = 'scroll.' + $(this).attr('id');
                    $(window).off(scrollId);
                });
                $(this).removeClass('pa-dt-toggle-active');
                $('[data-owner="' + parentId + '"]').slideUp(function() {

                    $(this).remove();
                    $('.lt-ie9 .btn').removeClass('reflow');
                });
                $('div[id="' + parentId + '"]').removeClass('pa-row-open');
            } else {
                accountAdmin.getAccounts($(this).closest('div').attr('id'), function() {
                    $('#' + parentId + ' a.pa-dt-toggle').first().addClass('pa-dt-toggle-active');
                    $('[data-owner="' + parentId + '"]').slideDown(function() {
                        $(this).removeClass('hide');
                        $('.lt-ie9 .btn').removeClass('reflow');
                    });
                    $('div[id="' + parentId + '"]').addClass('pa-row-open');
                });
            }
        });
        $('.new-segment-accounts').on('click', '.pa-dt-group-account-level a.pa-dt-toggle.ajax', function(e) {
            e.preventDefault();
            // handle the toggle icons and behavoiur
            var parentId = $(this).parents('div').attr("id");
            var accountType = $(this).parents('div').attr("data-account-level");


            if ($(this).hasClass("pa-dt-toggle-active")) {
                // hide existing data
                $(this).removeClass('pa-dt-toggle-active');
                $(window).off("scroll." + parentId);
                $('[data-owner="' + parentId + '"]').slideUp(function() {
                    $(this).remove();
                    $('.lt-ie9 .btn').removeClass('reflow');
                });
                $('div[id="' + parentId + '"]').removeClass('pa-row-open');
            } else {
                // toggle not already expanded, so get the data and show
                accountAdmin.getPremises($(this).closest('div').attr('id'), 0, (accountAdmin.variables.premisesReturnLimit - 1), function(accountId, newPremises) {
                    accountAdmin.appendPremises(accountId, newPremises);
                    $('#' + parentId + ' a.pa-dt-toggle').addClass('pa-dt-toggle-active');
                    $('[data-owner="' + parentId + '"]').slideDown(function() {
                        $(this).removeClass('hide');
                        $('.lt-ie9 .btn').removeClass('reflow');
                    });
                    $('div[id="' + parentId + '"]').addClass('pa-row-open');
                    accountAdmin.reStyleRows();
                    accountAdmin.watchScroll('[data-owner="' + parentId + '"] table.stripe tbody tr:last-child', accountId);
                });
            }
        });

        // Rebecca Richards 27/3/15
        $('.new-segment-accounts .btn-save').click(function(e) {
            // submit the form
            accountAdmin.updateSeg();
            e.preventDefault();
        });

        // Requested by Des - 07/09/2015 - Sifter 21548
        $('.add-segment-accounts .btn-save').click(function(e) {
            $("#selectedPremises").val(accountAdmin.addSeg());
        });

        $('#view-by .groups-and-accounts').click(function(e) {
            if ($(this).hasClass('active')) {
                return;
            }

            $('#view-by .active').removeClass('active');
            $(this).addClass('active');

            active = '#groups-and-accounts-view';
            leaving = '#viewall-premises';
            accountAdmin.changeTab(active, leaving);
            // reset the filter values
            accountAdmin.resetFilters();
        });
        $('#view-by .premises').click(function(e) {
            if ($(this).hasClass('active')) {
                return;
            }
            active = '#viewall-premises';
            leaving = '#groups-and-accounts-view';
            accountAdmin.changeTab(active, leaving);
            // reset the filter values
            accountAdmin.resetFilters();
        });
    },
    bindFilterUiActions: function() {
        var searchTimeout;

        $('#premises-type').change(function() {
            accountAdmin.filterSearch(false);
        });

        $('#fuel-type').change(function() {
            accountAdmin.filterSearch(false);
        });

        $('#text-premises-filter').keyup(function(e) {
            e.preventDefault();
            if (searchTimeout !== undefined) {
                clearTimeout(searchTimeout);
            }
            searchTimeout = setTimeout(function() {
                accountAdmin.filterSearch(false);
            }, 500);
        });

        $('#text-premises-filter').keydown(function(e) {
            if (e.keyCode === 13) {
                e.preventDefault();
            }
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
    },
    getAccounts: function(groupId, callback) {
        // start the loader gif
        if (accountAdmin.variables.activeQuery) {
            return;
        }
        accountAdmin.variables.activeQuery = true;
        var loaderContainer = '#' + groupId;
        accountAdmin.startLoading(loaderContainer, this.variables.defaultLoadingText);
        // Get filter values
        var type, fuel, search;
        //type = $('#premises-type').val() === "all" ? null : $('#premises-type').val();
        //fuel = $('#fuel-type').val() === "all" ? null : $('#fuel-type').val();
        //search = $('#text-premises-filter').val();
        var requestData = {
            "group_id": groupId,
            "return_type": "accounts"
        };
        if (accountAdmin.segmentId) {
            requestData.seg_id = accountAdmin.segmentId;
        }
        if (type) {
            requestData.meter_type = type;
        }
        if (fuel) {
            requestData.fuel_type = fuel;
        }
        if (search) {
            requestData.search_text = search;
        }
        $.ajax({
            url: accountAdmin.variables.segmentsWsUrl,
            type: 'GET',
            dataType: 'json',
            data: requestData
        }).done(function(data, textStatus, xhr) {

            if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
                // html response means we've been timed out - redirect
                window.location.replace('/oss_web/login.htm?login_error=timedOut');
            }

            if (data.status === "ok") {

                if (data.accounts.length === 0) {

                    accountAdmin.appendAccounts(groupId, accountAdmin.noAccountsTemplate(groupId, "No accounts match your selected filters"), callback);

                } else {

                    newAccounts = [];
                    accountIds = [];

                    for (var i = 0; i < data.accounts.length; i++) {
                        newAccounts.push(accountAdmin.accountsTemplate(data.accounts[i], groupId));
                        accountIds.push(data.accounts[i].account_id);
                    }

                    accountAdmin.variables.activeQuery = false;
                    accountAdmin.buildAccountsCache(groupId, data.accounts);
                    accountAdmin.appendAccounts(groupId, newAccounts, callback);
                }
            }

            if (data.status === "fail") {
                accountAdmin.appendAccounts(groupId, accountAdmin.noAccountsTemplate(groupId, "We're sorry, something went wrong"), callback);
            }

            if (data.status === "error") {
                accountAdmin.appendAccounts(groupId, accountAdmin.noAccountsTemplate(groupId, "We're sorry, the service is currently experiencing a problem, please try again later."), callback);
            }

        }).fail(function() {

            accountAdmin.appendAccounts(groupId, accountAdmin.noAccountsTemplate(groupId, "We're sorry, the service is currently experiencing a problem, please try again later."), callback);

        }).always(function() {
            // remove the loading anim
            accountAdmin.endLoading(loaderContainer);
            accountAdmin.variables.activeQuery = false;
        });
    },



    getPremisesInProgress: null,



    getPremises: function(accountId, startIndex, endIndex, callback) {

        var divId = accountId;
        var groupId;
        var parts = accountId.split('-');


        if (parts.length > 1) {
            accountId = parts[1];
            groupId = parts[0];
        } else {
            accountId = parts[0];
        }

        //check if there are any premises on the account
        if (typeof(this.accountsCache) !== 'undefined' && typeof(groupId) !== 'undefined') {
            var acc = accountAdmin.accountsCache.getAccount(groupId, accountId);
            if (acc.gas_premises === 0 && acc.electricity_premises === 0) {
                callback(divId, accountAdmin.noPremisesTemplate('There are no active premises associated with this account'));
                return;
            }
        }

        if (this.getPremisesInProgress && this.getPremisesInProgress.readyState != 4) {
            this.getPremisesInProgress.abort();
        }

        // Get filter values
        var type = $('#premises-type').val() === "all" ? null : $('#premises-type').val();
        var fuel = $('#fuel-type').val() === "all" ? null : $('#fuel-type').val();
        var search = $('#text-premises-filter').val();
        var requestData = {
            "return_type": "premises"
        };
        var filtering = false;

        if (accountId != "viewall") {
            requestData.account_id = accountId;
        }

        if (type) {
            requestData.meter_type = type;
            if (type !== 'all') {
                filtering = true;
            }
        }

        if (fuel) {
            requestData.fuel_type = fuel;
            if (fuel !== 'all') {
                filtering = true;
            }
        }

        if (search) {
            requestData.search_text = search;
            filtering = true;
        }

        // check if anything in cache
        var nextCache = [];
        if (typeof this.premisesCache !== 'undefined') {
            var premisesCache = this.premisesCache.getFullPremisesCache(accountId);
            nextCache = premisesCache.slice(startIndex, endIndex);
        }


        if (nextCache.length > 0) {
            var newPremises = [];
            for (var i = 0; i < nextCache.length; i++) {
                newPremises.push(accountAdmin.premisesTemplate(nextCache[i]));
            }
            callback(divId, newPremises);
        } else if (startIndex === 0) {

            accountAdmin.variables.activeQuery = true;
            var loaderContainer = '#' + accountId;

            if ($(loaderContainer).length === 0) {
                loaderContainer = 'div[account-id=' + accountId + ']';
            }

            if ($('#' + accountId + '-premises').length) {
                loaderContainer = '#' + accountId + '-premises';
            }

            accountAdmin.startLoading(loaderContainer, this.variables.defaultLoadingText);

            this.getPremisesInProgress = $.ajax({
                url: accountAdmin.variables.segmentsWsUrl,
                type: 'GET',
                dataType: 'json',
                data: requestData,
                async: true

            }).done(function(data, textStatus, xhr) {

                var newPremises = [],
                    premisesIdArray = [],
                    i;

                if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
                    // html response means we've been timed out - redirect
                    window.location.replace('/oss_web/login.htm?login_error=timedOut');
                }

                if (data.status === "ok") {
                    if (data.premises.length > 0) {

                        if (endIndex > data.premises.length) {
                            endIndex = data.premises.length - 1;
                        }

                        for (i = startIndex; i < endIndex + 1; i++) {
                            var premisesData = data.premises[i];
                            newPremises.push(accountAdmin.premisesTemplate(premisesData));
                        }

                        for (i = 0; i < data.premises.length; i++) {
                            premisesIdArray.push(data.premises[i].premises_id);
                        }

                        // let's start building up the premises cache
                        accountAdmin.buildPremisesCache(accountId, divId, premisesIdArray);
                        accountAdmin.premisesCache.setFullPremisesCache(accountId, data.premises);
                        accountAdmin.variables.activeQuery = false;

                        callback(divId, newPremises);

                    } else {
                        // 0 premises message
                        // no results here, but we still need to rebuild premises cache
                        accountAdmin.buildPremisesCache(accountId, divId, premisesIdArray);
                        accountAdmin.premisesCache.setFullPremisesCache(accountId, data.premises);
                        accountAdmin.variables.activeQuery = false;
                        if (filtering) {
                            messageText = "No premises match your selected filters";
                        } else {
                            messageText = "There are no active premises associated with this account";
                        }
                        callback(divId, accountAdmin.noPremisesTemplate(messageText));
                    }

                } else if (data.status === "fail") {
                    accountAdmin.variables.activeQuery = false;
                    callback(divId, accountAdmin.noPremisesTemplate("We're sorry, the service is currently experiencing a problem, please try again later."));
                } else if (data.status === "error") {
                    if (data.premises.length === 0) {
                        // no results here, but we still need to rebuild premises cache
                        accountAdmin.buildPremisesCache(accountId, divId, premisesIdArray);
                        accountAdmin.premisesCache.setFullPremisesCache(accountId, data.premises);
                        accountAdmin.variables.activeQuery = false;
                        var messageText;
                        if (filtering) {
                            messageText = "No premises match your selected filters";
                        } else {
                            messageText = "We're sorry, the service is currently experiencing a problem, please try again later.";
                        }
                        callback(divId, accountAdmin.noPremisesTemplate(messageText));
                    }
                }
            }).fail(function() {
                accountAdmin.variables.activeQuery = false;
                //callback(divId, accountAdmin.noPremisesTemplate("We're sorry, the service is currently experiencing a problem, please try again later."));
            }).always(function(data, textStatus, errorThrown) {
                // remove the loading anim
                accountAdmin.endLoading(loaderContainer);
            });
        }


    },
    appendAccounts: function(groupId, newAccounts, callback) {
        for (var i = 0; i < newAccounts.length; i++) {
            var $ac = newAccounts[i];
            var $id = $($ac).attr('id');
            if ($('#' + $id).length === 0) {
                $('#' + groupId).append($ac);
            }
        }
        this.checkForFullAccountsAndGroups(function() {
            callback();
        });

    },
    appendPremises: function(accountId, newPremises) {
        $('#' + accountId).append('<div id="' + accountId + '-premises" class="pa-mprn-summary hide" data-owner="' + accountId + '" data-account-level="mprn">' + '<table class="stripe">' + '<colgroup>' + '<col class="premises-col-type" />' + '<col class="premises-col-mprn" />' + '<col class="premises-col-address" />' + '<col class="premises-col-interval" />' + '<col class="premises-col-actions" />' + '</colgroup><tbody></table></div>').find('table.stripe tbody').append(newPremises);

        // check if all the premises in an account are full
        accountAdmin.checkForFullAccountsAndGroups();

    },

    appendMorePremises: function(accountId, newPremises) {
        $('#' + accountId + '-premises table.stripe tbody').append(newPremises);

        // check if all the premises in an account are full
        //accountAdmin.checkForFullAccountsAndGroups();
    },


    /*
     * ============================================
     *  Refactoring add/undo/select all functionality
     *  By: Rebecca Richards
     *  Date: April 2015
     * ============================================
     */
    bindAddUndoUIActions: function() {
        var that = this;
        $('.new-segment-accounts, .existing-segment-accounts').on('click', 'a.add-to-segment', function(e) {
            var undo = $(e.target).hasClass('undo'),
                meterId = $(this).closest('tr').attr('data-premises-id');
            if (undo) {
                that.undoAddUnaddedPremisesToSegment(meterId, true);
            } else {
                that.addUnaddedPremisesToSegment(meterId);
            }
            that.checkForFullAccountsAndGroups();
            e.preventDefault();
        });
        $('.new-segment-accounts, .existing-segment-accounts').on('click', 'a.remove-from-segment', function(e) {
            var undo = $(e.target).hasClass('undo') || $(e.target).parent('a').hasClass('undo'),
                meterId = $(this).closest('tr').attr('data-premises-id');
            if (undo) {
                that.undoRemovePremisesFromSegment(meterId);
            } else {
                that.removePremisesFromSegment(meterId);
            }
            that.checkForFullAccountsAndGroups();
            that.applyPremisesViewAddAllButtonStyle();
            e.preventDefault();
        });


        $('td').on('click', 'a.add-to-group', function(e) {
            e.preventDefault();
            that.addAccountToGroup($(this), $(e.target).hasClass('undo'));
        });
        $('table').on('click', 'a.remove-from-group', function(e) {
            e.preventDefault();
            that.removeAccountFromGroup($(this));
        });


        $('.new-segment-accounts, .existing-segment-accounts').on('click', 'a.add-all-matches', function(e) {
            e.preventDefault();
            if ($(this).hasClass('undo')) {
                accountAdmin.undoAddPremisesSetToSegment($(this));
            } else {
                accountAdmin.addPremisesSetToSegment($(this));
            }
        });


        // add or undo filtered results to segment
        $('.new-segment-accounts, .existing-segment-accounts').on('click', '.add-filtered-results', function(e) {
            e.preventDefault();

            var $button = $(this);
            accountAdmin.getFilteredPremises(function(data) {

                if ($button.hasClass('remove')) {
                    if ($button.hasClass('undo')) {
                        accountAdmin.undoRemoveFilteredPremisesSetFromSegment(data);
                    } else {
                        accountAdmin.removeFilteredPremisesSetFromSegment(data);
                    }
                } else {
                    if ($button.hasClass('undo')) {
                        accountAdmin.undoAddFilteredPremisesSetToSegment(data, true);
                    } else {
                        accountAdmin.addFilteredPremisesSetToSegment(data);

                    }
                }


            });

        });


    },


    /*
     * ============================================
     *  Functions to check the status of the premises
     *  and add appropriate styling
     *  By: Rebecca Richards
     *  Date: April 2015
     * ============================================
     */
    /*
     * Check if the premises is already in the segment
     */
    isInSegment: function($premInput) {
        if ($premInput.hasClass('existing')) {
            return true;
        }
        return false;
    },
    /*
     * Check if the premises should show the removed status
     */
    showRemovedStatus: function($premInput) {
        if ($premInput.attr('data-included') == "true") {
            return true;
        }
        return false;
    },
    /*
     * Check if the premises should show the added status
     */
    showAddedStatus: function($premInput) {
        if ($premInput.length && !$premInput.hasClass('existing')) {
            return true;
        }
        return false;
    },
    /*
     * Check if the premises should show the undo removed status
     */
    showUndoRemovedStatus: function($premInput) {
        if ($premInput.attr('data-included') == "false") {
            return true;
        }
        return false;
    },
    /*
     * Apply the removed status style to the premises
     */
    applyRemovedStatusStyling: function($premises) {
        $premises.find('a.add-to-segment').addClass('hide');

        return $premises;
    },
    /*
     * Apply the can remove status style to the premises
     */
    applyCanRemoveStatusStyling: function($premises) {
        $premises.find('a.remove-from-segment.btn').addClass('hide');

        return $premises;
    },
    /*
     * Apply the added status style to the premises
     */
    applyAddedStatusStyling: function($premises) {
        $premises.addClass('account-added');
        $premises.find('a.add-to-segment.btn').addClass('hide');
        $premises.find('a.remove-from-segment.btn').addClass('hide');
        $premises.find('td:last-child').each(function() {
            if ($(this).children('p.added').length === 0) {
                $(this).prepend(accountAdmin.variables.undoSegHtml);
            }
        });

        return $premises;
    },
    /*
     * Remove the added status style to the premises
     */
    removeAddedStatusStyling: function($premises) {
        $premises.removeClass('account-added');
        $premises.find('a.add-to-segment.btn').removeClass('hide');
        $premises.find('a.remove-from-segment.btn').addClass('hide');
        $premises.find('p.added').remove();
        return $premises;
    },
    /*
     * Apply the can add status style to the premises
     */
    applyCanAddStatusStyling: function($premises) {
        $premises.find('a.remove-from-segment.btn').addClass('hide');
        return $premises;
    },
    applyUndoRemoveStatusStyling: function($premises) {
        var address = $premises.find('td.address').text();
        var meterId = $premises.attr('data-premises-id');
        var undoBtn = '<a class="btn btn-danger remove-from-segment undo" href="#"><span>Undo</span></a>';
        var $newRow = $('<tr class="account-removed" data-premises-id="' + meterId + '"><td colspan="4">' + accountAdmin.variables.removeSegInfoHtml + address + '</td><td>' + undoBtn + '</td></tr>');
        $premises.addClass('removed').addClass('hide');
        $premises.after($newRow);
        $('input#' + meterId).attr('data-included', false);
        return $premises;
    },
    /*
     * Set the status of the premises
     * 1. Can Add
     * 2. Can remove
     * 3. Already Added
     * 4. Marked for removal
     */
    setPremisesStatus: function($premInput, $premises) {

        if (accountAdmin.isInSegment($premInput)) {
            if (accountAdmin.showRemovedStatus($premInput)) {
                return accountAdmin.applyRemovedStatusStyling($premises);
            } else if (accountAdmin.showUndoRemovedStatus($premInput)) {
                return accountAdmin.applyUndoRemoveStatusStyling($premises);
            } else {
                return accountAdmin.applyCanRemoveStatusStyling($premises);
            }
        } else {
            if (accountAdmin.showAddedStatus($premInput)) {
                return accountAdmin.applyAddedStatusStyling($premises);
            } else {
                return accountAdmin.applyCanAddStatusStyling($premises);
            }
        }
    },
    /*
     * ============================================
     *  Functions to add appropriate styling
     *  to add all matches button
     *  By: Rebecca Richards
     *  Date: April 2015
     * ============================================
     */
    /*
     * Add the html and styling for add all matches
     */
    addAllSelectStylingAccount: function(accountId, toBeAdded) {
        $accountDiv = $('#' + accountId);
        if (toBeAdded > 0) {
            var $button = $accountDiv.find('.btn.add-all-matches').hide();
            var $container = $button.parent();
            if ($container.find('p.added').length === 0) {
                $container.append(this.variables.undoAccSegHtml);
                $button.parents('tr').attr('data-set', $accountDiv.attr('id'));
                $button.parents('td').find('.accounts-added').text(toBeAdded);
            }
        }
    },
    /*
     * Remove the html and styling for add all matches
     */
    removeAllSelectStylingAccount: function(accountId) {
        $accountDiv = $('#' + accountId);
        if (accountId !== 'viewall') {
            $button = $accountDiv.find('.btn.add-all-matches').show();
            $container = $button.parents('tr');
            if ($container.find('p.added').length > 0) {
                $container.find('p.added').remove();
            }
        }
    },

    addZeroStylingAccount: function(accountId) {
        $('#' + accountId).find('.add-all-matches').hide();
    },

    /*
     * Add the html and styling for add all matches
     */
    addAllSelectStylingGroup: function(groupId, totalPremisesAdded, callingGroupId, alreadyAdded, currentText) {

        $groupDiv = $('#' + groupId);

        var $button = $groupDiv.find('tr.pa-dt-master-account-level .btn.add-all-matches');

        $button.hide();

        var $container = $button.parent();

        if (($container.find('.accounts-added').length === 0)) {
            $container.append(this.variables.undoGrpSegHtml);
        }

        if ($container.find('.accounts-added').length > 0) {
            // if the newly full group is NOT the calling group (ie. the one that the user didn't click 'Add all matches for')
            // point out that xxx premises CONTAINED were added

            var callingGroupF = function() {
                if (parseInt(groupId) === parseInt(callingGroupId)) {
                    return true;
                }
                return false;
            };

            var
                addedText,
                callingGroup = callingGroupF();

            if (alreadyAdded) {
                addedText = currentText;
            } else {
                if (callingGroup) {
                    addedText = 'Added ' + totalPremisesAdded + ' matching premises';
                } else {
                    addedText = 'Added ' + totalPremisesAdded + ' premises contained';
                }
            }

            $container.find('.accounts-added').text(addedText);
        }
    },

    /*
     * Remove the html and styling for add all matches
     */
    removeAllSelectStylingGroup: function(groupId) {


        $groupDiv = $('#' + groupId);

        $groupDiv.removeClass('already-added');
        if ($groupDiv !== 'viewall') {
            $button = $groupDiv.find('tr.pa-dt-master-account-level .btn.add-all-matches').show();
            $container = $button.parent();
            if ($container.find('p.added').length > 0) {
                $container.find('p.added').remove();

            }
        }
    },

    addZeroStylingGroup: function(groupId) {
        $('#' + groupId).find('.pa-dt-master-account-level .add-all-matches').hide();
    },

    getPremiseAddedCount: function() {
        return this.premisesCache.getToBeAddedPremises().length || 0;
    },

    showOrUpdateCounter: function() {
        var addedPremises = this.premisesCache.getToBeAddedPremises();
        var numPremises = addedPremises.length;

        $('.existing-segment-accounts .pa-mprn-summary .account-added').remove();
        var $counter = $('.existing-segment-accounts .pa-mprn-summary .premises-counter span');
        if ($counter.length === 0) {
            var html = '<tr class="pa-dt-mprn-level premises-counter"><td colspan="5"><p class="added">Added <span> ' + numPremises + ' </span> Premises</p></td></tr>';
            $('.existing-segment-accounts .pa-mprn-summary table tbody').append(html);
        } else {
            $counter.html(numPremises);
        }
    },

    removeCounter: function() {
        var $counterRow = $('.existing-segment-accounts .pa-mprn-summary .premises-counter');

        $counterRow.remove();
    },

    showPremisesRows: function() {
        var addedPremises = this.premisesCache.getToBeAddedPremises();

        $('.existing-segment-accounts .pa-mprn-summary .account-added, .existing-segment-accounts .pa-mprn-summary .premises-counter').remove();
        for (var i = 0; i < addedPremises.length; i++) {
            var meterId = addedPremises[i];
            var newPremisesData = this.premisesCache.getSinglePremises(meterId);
            var addedRow = this.premisesTemplate(newPremisesData);
            $('.existing-segment-accounts .pa-mprn-summary table tbody').append(addedRow);
            $dataPremises = $('[data-premises-id=' + meterId + ']');
            $existingPremises = $('.existing-segment-accounts').find($dataPremises);
            this.applyAddedStatusStyling($existingPremises);
            $('.existing-segment-accounts .pa-mprn-summary table tbody').append(addedRow);
        }
    },


    /*
     * Add an unadded premises to the segment
     */
    addUnaddedPremisesToSegment: function(meterId) {
        this.premisesCache.addToBeAddedPremises(meterId);
        var $dataPremises = $('[data-premises-id=' + meterId + ']');
        var $premises = $('#groups-and-accounts-view , #viewall-premises').find($dataPremises);
        if ($premises) {
            this.applyAddedStatusStyling($premises);
        }

        this.showCounterOrPremisesRows();

        if ($('input[type=hidden]#' + meterId).length === 0) {
            $('.existing-segment-accounts').append('<input type="hidden" data-included="true" id="' + meterId + '" value="' + meterId + '" />');
        }

        this.applyPremisesViewAddAllButtonStyle();
    },
    /*
     * Remove an unadded premises from the segment
     */
    undoAddUnaddedPremisesToSegment: function(meterId, updateCounter) {
        // remove the row from the added table
        if (this.getPremiseAddedCount() < this.variables.maxPremises) {

            $('.existing-segment-accounts table tbody tr[data-premises-id="' + meterId + '"]').remove();
        }

        // remove the hidden input

        $('.existing-segment-accounts input#' + meterId).remove();


        var $dataPremises = $('[data-premises-id=' + meterId + ']');
        var $premises = $('#groups-and-accounts-view , #viewall-premises').find($dataPremises);
        var $groupAccountPremises = $('#groups-and-accounts-view').find($dataPremises);

        accountAdmin.removeAddedStatusStyling($premises);

        // add this premises to the toBeAddedPremises cache
        accountAdmin.premisesCache.removeToBeAddedPremises(meterId);

        if (updateCounter === true) {
            this.showCounterOrPremisesRows();
        }

        this.applyPremisesViewAddAllButtonStyle();

    },

    /*
     * Remove an existing premises from the segment
     */
    removePremisesFromSegment: function(meterId) {
        var premRows = $('tr[data-premises-id="' + meterId + '"]');

        if (premRows.filter('.account-removed').length === 0) {
            var location = premRows.first().find('td:nth-child(3)').text();
            var undoBtn = '<a class="btn btn-danger remove-from-segment undo" href="#"><span>Undo</span></a>';
            premRows.after('<tr class="account-removed" data-premises-id="' + meterId + '"><td colspan="4">' + accountAdmin.variables.removeSegInfoHtml + location + '</td><td>' + undoBtn + '</td></tr>');
            $('input#' + meterId).attr('data-included', false);
            premRows.hide();
            $('.lt-ie9 .btn').removeClass('reflow');
        }
    },
    /*
     * Undo remove an existing premises from the segment
     */
    undoRemovePremisesFromSegment: function(meterId) {
        var premRows = $('tr[data-premises-id="' + meterId + '"].pa-dt-mprn-level');
        premRows.removeClass('account-removed');
        premRows.find('a.add-to-segment').hide();
        premRows.next('tr.account-removed').remove();
        $('input#' + meterId).attr('data-included', true);
        premRows.css('display', 'table-row');
        $('.lt-ie9 .btn').removeClass('reflow');
    },
    getAccountIdFromDivId: function(divId) {
        var accountId;
        if (divId !== 'viewall') {
            accountId = divId.split('-');
            accountId = accountId[1];
        } else {
            accountId = divId;
        }
        return accountId;
    },
    getDivFromAccountId: function(accountId) {
        var divId;
        if (accountId !== 'viewall') {
            divId = $("div[id*='" + accountId + "'].pa-mprn-summary-container");
        } else {
            divId = accountId;
        }
        return divId;
    },
    getGroupIdFromAccountId: function(accountId) {
        var groupId = $("div[id*='-" + accountId + "']").attr('id');
        if (typeof groupId != 'undefined') {
            groupId = groupId.split('-');
            groupId = groupId[0];
        } else {
            groupId = '';
        }
        return groupId;
    },


    fullAccountCheckInProgress: null,
    fullAccountGroupsCache: null,

    checkForFullAccountsAndGroups: function(callback, callingGroupId) {

        if (this.fullAccountCheckInProgress && this.fullAccountCheckInProgress.readyState != 4) {
            this.fullAccountCheckInProgress.abort();
        }

        // Get filter values
        var type, fuel, search;

        var requestData = ['return_type=premhigher', 'seg_id=' + accountAdmin.segmentId];

        var premiseList = accountAdmin.premisesCache.getToBeAddedPremises() || [];


        // build our own request data string because jQuery urlencodes it
        requestData.push('premise_list=' + premiseList.join(','));
        var that = this;

        if (premiseList.length > 0) {
            this.fullAccountCheckInProgress = $.ajax({
                url: that.variables.segmentsWsUrl,
                data: requestData.join('&'),
                type: 'POST', // use type in jQ 1.8.3
                success: function(data, textStatus, xhr) {

                    if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
                        // html response means we've been timed out - redirect
                        window.location.replace('/oss_web/login.htm?login_error=timedOut');
                    }
                    //do something
                    if (data.status === 'ok') {
                        that.fullAccountGroupsCache = data.groups;

                        var processData = function(currentAddedText) {
                            that.resetGroupsAndAccountsDisplay();
                            var groups = data.groups;

                            for (var g = 0; g < groups.length; g++) {

                                var
                                    group = groups[g],
                                    groupId = group.group_id,
                                    groupPremiseAvailable = group.available_premises,
                                    groupPremiseUsed = 0,
                                    accounts = group.accounts;

                                for (var a = 0; a < accounts.length; a++) {
                                    var account = accounts[a];
                                    var accountPremisesAvailable = account.available_premises;
                                    var accountPremisesUsed = account.premises.length || 0;
                                    groupPremiseUsed = groupPremiseUsed + accountPremisesUsed;
                                    var fullAccountId = groupId + '-' + account.account_id;


                                    if ((accountPremisesUsed === accountPremisesAvailable) && (accountPremisesUsed !== 0)) {
                                        // account full
                                        that.addAllSelectStylingAccount(fullAccountId, accountPremisesAvailable);
                                    } else if (accountPremisesAvailable === 0) {
                                        that.addZeroStylingAccount(fullAccountId);
                                    } else {
                                        that.removeAllSelectStylingAccount(fullAccountId);
                                    }
                                }

                                var index = that.variables.fullGroups.indexOf(groupId);

                                if ((groupPremiseAvailable === groupPremiseUsed) && (groupPremiseUsed !== 0)) {

                                    // group full!
                                    var alreadyAdded = false,
                                        currentText = currentAddedText[groupId];

                                    if (currentText !== '') {
                                        alreadyAdded = true;
                                    }
                                    that.addAllSelectStylingGroup(groupId, groupPremiseUsed, callingGroupId, alreadyAdded, currentText);

                                } else {
                                    that.removeAllSelectStylingGroup(groupId);
                                }
                            }
                            if (callback) {
                                callback();
                            }
                        };

                        // build up an object with the current 'added' text applied to the group
                        var currentAddedText = {};
                        $.each($('#groups-and-accounts-view').children('div'), function() {
                            currentAddedText[$(this).attr('id')] = $(this).find('.pa-dt-master-account-level .accounts-added').text();
                        });

                        setTimeout(function() {
                            processData(currentAddedText);
                        }, 10);
                    }
                }
            });
        } else {
            that.resetGroupsAndAccountsDisplay();
            if (callback) {
                callback();
            }
        }
    },

    resetGroupsAndAccountsDisplay: function() {
        //this.variables.fullGroups = [];
        // reset everything!
        var that = this;
        var groups = $('#groups-and-accounts-view>div');
        for (var g = 0; g < groups.length; g++) {
            var group = groups[g];
            var groupId = $(group).attr('id');
            that.removeAllSelectStylingGroup(groupId);
            var accounts = that.accountsCache.getAccountsCache(groupId);
            for (var a = 0; a < accounts.length; a++) {
                var accountId = accounts[a];
                var fullAccountId = groupId + '-' + accountId;
                that.removeAllSelectStylingAccount(fullAccountId);
            }
        }
    },

    setCurrentPremisesInSegment: function() {
        var $current = $('input.existing[data-included=true]'),
            ids = [];
        $.each($current, function() {
            ids.push($(this).val());
        });
        this.premisesCache.setExisitingPremises(ids);
    },
    buildPremisesCache: function(accountId, divId, premises) {
        var accId;
        if (accountId !== 'viewall') {
            accId = divId.split('-');
            accId = accId[1];
        } else {
            accId = accountId;
        }
        this.premisesCache.setPremisesCache(accountId, premises);
        this.premisesCache.setAlreadyAddedPremises(accountId);
        this.premisesCache.setNotAlreadyAddedPremises(accountId);
    },
    buildAccountsCache: function(groupId, accounts) {
        accountAdmin.accountsCache.setAccountsCache(groupId, accounts);
    },


    premisesTemplate: function(newPremisesData) {
        if (typeof newPremisesData == 'undefined') {
            return;
        }

        var utils = newPremisesData.utilities.length;
        var meterType = [];
        var meterNumber = [];
        var interval = [];
        var $premInput = $("input#" + newPremisesData.premises_id);

        for (var i = 0; i < utils; i++) {
            meterType.push(newPremisesData.utilities[i].type);
            meterNumber.push(newPremisesData.utilities[i].extSdpCode);
            interval.push(newPremisesData.utilities[i].interval);
        }


        var premisesHtml = ['<tr class="pa-dt-mprn-level" data-premises-id="' + newPremisesData.premises_id + '">',
            '<td class="meter-type">' + meterType.join('<br/>') + '</td>',
            '<td class="meter-number">' + meterNumber.join('<br/>') + '</td>',
            '<td class="address">' + newPremisesData.address + '</td>',
            '<td class="interval">' + interval.join('<br/>') + '</td>',
            '<td class="premises-admin align-right">',
            '<a href="#" class="btn btn-medium add-to-segment">Add to segment</a>',
            '<a href="#" class="btn btn-medium btn-danger remove-from-segment">Remove from segment</a>',
            '</td>',
            '</tr>'
        ];
        var $premises = $(premisesHtml.join(''));

        // let's figure out what the status of the premises is and add appropriate styling
        $premises = this.setPremisesStatus($premInput, $premises);

        return $premises;
    },
    addedPremisesGroupTemplate: function(addedPremisesCount) {
        return '<tr class="account-added"><td></td><td colspan="4" class="text-right"><p class="added">Added <span id="added-premises-count">' + addedPremisesCount + '</span> premises<a href="#" class="add-to-segment undo all">Undo</a></p></td></tr>';
    },
    updateAddedPremisesGroupTemplate: function(addedPremisesCount) {
        if ($('#added-premises-count').length) {
            $('#added-premises-count').text(addedPremisesCount);
        } else {
            $('.existing-segment-accounts table.stripe').append(this.addedPremisesGroupTemplate(addedPremisesCount));
        }
    },
    noPremisesTemplate: function(message) {
        return '<tr><td colspan="5" class="text-left">' + message + '</td></tr>';
    },
    accountsTemplate: function(newAccountData, parentGroup) {
        var divId = [parentGroup, '-', newAccountData.account_id].join('');
        // This populates the newPremisesData into html provided, premises
        var accountsHtml = ['<div id="', divId, '" ',
            'class="pa-mprn-summary-container pa-row-closed hide available-premises-account-', newAccountData.available_premises, '" ',
            'data-owner="', parentGroup, '" ',
            'data-account-level="account" ',
            'account-id="', newAccountData.account_id, '" ',
            'data-owner="', parentGroup, '" ',
            '>',
            '<table>',
            '<colgroup>',
            '<col class="col-8">',
            '<col class="col-4">',
            '</colgroup>',
            '<tbody>',
            '<tr class="pa-dt-group-account-level">',
            '<td class="pa-dt-account-details">',
            '<a class="pa-dt-toggle ajax" href="#">Toggle</a>',
            '<h4 class="account-name">', newAccountData.account_name, '</h4>',
            '<p class="account-meta">',
            '<span class="elec-count">', newAccountData.electricity_premises, '</span> electric ',
            '<span class="gas-count">', newAccountData.gas_premises, '</span> Gas - Account ',
            '<span class="account-id">', newAccountData.account_id, '</span> ',
            '</p>',
            '</td>',
            '<td class="pa-admin-action-col last">',
            '<a class="btn btn-medium add-all-matches" href="#">Add all matches to segment</a>',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>',
            '</div>'
        ];
        accounts = accountsHtml.join('');

        if ((parseInt(newAccountData.gas_premises) + parseInt(newAccountData.electricity_premises)) === 0) {
            $(accounts).find('.add-all-matches').hide();
        }

        // find out if the account has been added as a group to existing and display accordingly
        if ($('tr[data-set="' + divId + '"]').length) {
            // this one is already added as a group. Update the add all matches button.
            var existHtml = $('tr[data-set="' + divId + '"]').first().find('td.pa-admin-action-col').html();
            $(accounts).find('.pa-admin-action-col').html(existHtml);
            $(accounts).find('tr').attr('data-set', divId).find('.disabled').removeClass('disabled');
        }

        return accounts;
    },
    noAccountsTemplate: function(parentGroup, message) {
        var accounts = $('<div id="" class="pa-mprn-summary-container pa-row-closed hide" data-owner="' + parentGroup + '" data-account-level="account">' + '<table>' + '<colgroup>' + '<col class="col-8">' + '<col class="col-4">' + '</colgroup>' + '<tbody>' + '<tr class="pa-dt-group-account-level">' + '<td class="pa-dt-account-details" colspan="2"><p class="text-left">' + message + '</p></td>' + '</tr>' + '</tbody>' + '</table>' + '</div>');
        return accounts;
    },
    watchScroll: function(lastItem, accountId) {


        $(window).on("scroll." + accountId, function() {
            var wintop = $(window).scrollTop();
            var itemOffest = $(lastItem).offset().top;
            var winheight = $(window).height();
            var scrolltrigger = 0.95;
            if ((wintop / (itemOffest - winheight)) > scrolltrigger) {
                var startIndex = $('#' + accountId + ' table.stripe tr').length;
                if (accountId === 'viewall') {
                    startIndex = $('#' + accountId + '-premises table.stripe tr:visible').length;
                }
                var realAccountIdArr = accountId.split('-');
                var realAccountId = realAccountIdArr[1];
                var numAccounts = accountAdmin.premisesCache.getPremisesCache(realAccountId).length;

                if (startIndex === numAccounts || numAccounts === 0) {
                    // the last result set contained the last of the results, we need to kill the scroll event.
                    $(window).off("scroll." + accountId);
                } else {
                    accountAdmin.getPremises(accountId, startIndex, startIndex + (accountAdmin.variables.premisesReturnLimit - 1), function(accountId, newPremises) {
                        accountAdmin.appendMorePremises(accountId, newPremises);
                        accountAdmin.reStyleRows();
                    });
                }
            }
        });
    },
    addPremiseSelected: function($container) {
        $container.addClass('account-added');
        $container.find('a.add-to-segment.btn').addClass('hide');
        $container.find('a.remove-from-segment.btn').addClass('hide');
        $.each($container.find('td:last-child'), function() {
            if ($(this).children('p.added').length === 0) {
                $(this).prepend(accountAdmin.variables.undoSegHtml);
            }
        });
    },
    removePremiseSelected: function($container) {
        if (typeof($container) == 'undefined') {
            return;
        }
        $container.removeClass('account-added');
        $container.find('a.add-to-segment.btn').removeClass('hide');
        $container.each(function() {
            var input = $('input#' + $(this).attr('data-premises-id'));
            if (input.length > 0) {
                $(this).addClass('account-added');
                $(this).find('a.add-to-segment.btn').addClass('hide');
            } else {
                $(this).find('td:last-child p.added').remove();
            }
        });
    },
    changeTab: function(active, leaving) {

        var afterHide, afterShow;

        $('#view-by .active').removeClass('active');

        if (leaving === "#groups-and-accounts-view") {
            $('.toggle .premises').addClass('active');
            //remove any scroll listeners and close accordion
            afterHide = function() {
                $(leaving).find('div[data-account-level="account"]').each(function() {
                    var scrollId = 'scroll.' + $(this).attr('id');
                    $(window).off(scrollId);
                    $(this).remove();
                });
                $(leaving).find('.pa-dt-toggle-active').removeClass('pa-dt-toggle-active');
            };

        } else {
            $('button.add-filtered-results').hide();
            $('button.add-filtered-results').next('p.added').remove();
            $('.toggle .groups-and-accounts').addClass('active');
            afterHide = function() {
                var scrollId = 'scroll.viewall';
                $(window).off(scrollId);
                $(leaving).find('table.stripe tr').slice((accountAdmin.variables.premisesReturnLimit - 1), -1).remove();
            };
        }

        if (active === "#groups-and-accounts-view") {
            //remove any scroll listeners and close accordion
            afterShow = function() {};
        } else {
            afterShow = function() {
                var lastItem = active + ' table.stripe tbody tr:last-child';
                accountAdmin.watchScroll(lastItem, 'viewall');
            };
        }


        $(leaving).hide(0, function() {
            afterHide();
            $(active).show(0, function() {
                afterShow();
                $('.lt-ie9 .btn').removeClass('reflow');
            });
        });
    },
    preloadFirstPremises: function() {
        accountAdmin.getPremises('viewall', 0, (accountAdmin.variables.premisesReturnLimit - 1), function(accountId, newPremises) {
            accountAdmin.appendMorePremises(accountId, newPremises);
            accountAdmin.reStyleRows();
        });
        accountAdmin.variables.activeQuery = false;
    },
    resetFilters: function() {
        var premisesTypeResetVal = $('#premises-type option:first-child').val(),
            fuelTypeResetVal = $('#fuel-type option:first-child').val();

        $('#premises-type').val(premisesTypeResetVal);
        $('#fuel-type').val(fuelTypeResetVal);
        $('#text-premises-filter').val('').text('');

        accountAdmin.filterSearch(true);
    },
    filterSearch: function(isDefaultSettings) {
        $('button.add-filtered-results').next('p.added').remove();

        var that = this;
        var type = $('#premises-type').val() === "all" ? null : $('#premises-type').val();
        var fuel = $('#fuel-type').val() === "all" ? null : $('#fuel-type').val();
        var search = $('#text-premises-filter').val();

        if (((type !== null) || ((fuel !== null) && ($('#fuel-type option').length > 1)) || (search !== ''))) {
            accountAdmin.changeTab('#viewall-premises', '#groups-and-accounts-view');
            $('#view-by option:first').attr('selected', 'selected');
            $('#view-by').attr('disabled', 'disabled');


        } else {
            $('#view-by').removeAttr('disabled');
            if (accountAdmin.premisesCache) {
                accountAdmin.premisesCache.clearCache();
            }
            if (accountAdmin.accountsCache) {
                accountAdmin.accountsCache.clearCache();
            }
        }
        if (!isDefaultSettings) {
            // only clear the caches if we're not resetting to default
            if (accountAdmin.premisesCache) {
                accountAdmin.premisesCache.clearCache();
            }
            if (accountAdmin.accountsCache) {
                accountAdmin.accountsCache.clearCache();
            }
        }


        // if (type === null && fuel === null && search === '' && $('#viewall-premises').is(':visible')) {
        //   if (accountAdmin.premisesCache) {
        //     accountAdmin.premisesCache.clearCache();
        //   }
        // }


        $('#viewall-premises').each(function() {
            var accountId = "viewall";
            $(window).off('scroll.viewall');

            var cb = function(accountId, newPremises) {

                that.variables.filteredPremisesToBeAdded = newPremises;

                $('#viewall-premises table.stripe tr').fadeOut(function() {
                    $(this).remove();
                    $('.lt-ie9 .btn').removeClass('reflow');
                });

                accountAdmin.appendMorePremises(accountId, newPremises);

                $('#viewall-premises table.stripe tr').not('.removed').fadeIn(function() {
                    $(this).removeClass('hide');
                    $('.lt-ie9 .btn').removeClass('reflow');
                });

                if ($('#viewall-premises').is(':visible')) {
                    var lastItem = '#viewall-premises table.stripe tbody tr:last-child';
                    accountAdmin.watchScroll(lastItem, 'viewall');


                    if (newPremises.indexOf('No premises match your selected filters') === -1) {
                        // check if the filtered results are already existing in the segment
                        $('button.add-filtered-results').show();
                        accountAdmin.applyPremisesViewAddAllButtonStyle();
                    } else {
                        // no results, hide the add all button
                        $('button.add-filtered-results').hide();
                        $('button.add-filtered-results').next('p.added').remove();
                    }

                    accountAdmin.reStyleRows();
                }
            };
            accountAdmin.getPremises(accountId, 0, (accountAdmin.variables.premisesReturnLimit - 1), cb);
        });
        $('.new-segment-accounts .pa-mprn-summary-container').each(function() {
            var accountId = "viewall";
            $(window).off('scroll.viewall');
        });
        var countRequestData = {
            "return_type": "premises"
        };
        if (type) {
            countRequestData.meter_type = type;
        }
        if (fuel) {
            countRequestData.fuel_type = fuel;
        }
        if (search) {
            countRequestData.search_text = search;
        }
        accountAdmin.getPremisesCount(countRequestData);
    },

    adjustCount: function($countHolder, increment) {
        if (typeof($countHolder) == 'undefined' || typeof(increment) == 'undefined') {
            return;
        }
        var currentCount = parseInt($countHolder.text());
        if (typeof(currentCount) == 'int') {
            $countHolder.text(currentCount + increment);
        }
    },

    addPremisesSetToSegment: function(link) {
        if (link.parents('.pa-mprn-summary-container').length > 0) {
            // account
            var accountId = link.closest('.pa-mprn-summary-container').attr('account-id');
            var fullAccountId = link.closest('.pa-mprn-summary-container').attr('id');
            this.addAccountSetToSegment(accountId, fullAccountId);
        } else {
            // account groups
            var groupId = link.closest('div').attr('id');
            this.addAccountGroupSetToSegment(groupId);
        }
    },

    /*
     * opposite method to addPremisesSetToSegment
     */
    undoAddPremisesSetToSegment: function(link) {
        if (link.parents('.pa-mprn-summary-container').length > 0) {
            // account
            var accountId = link.closest('.pa-mprn-summary-container').attr('account-id');
            var fullAccountId = link.closest('.pa-mprn-summary-container').attr('id');
            this.undoAddAccountSetToSegment(accountId, fullAccountId, true);
        } else {
            // account groups
            var groupId = link.closest('div').attr('id');
            this.undoAddAccountGroupSetToSegment(groupId);
        }
    },

    addAccountSetToSegment: function(accountId, fullAccountId) {
        var that = this;
        var accountPremises = that.premisesCache.getPremisesCache(accountId);
        var loaderContainer = '#' + fullAccountId;
        that.startLoading(loaderContainer, accountAdmin.variables.addingPremisesText);
        setTimeout(function() {
            if (typeof accountPremises !== 'undefined' && accountPremises.length > 0) {
                that.addMultiplePremisesToSegment(accountPremises);
                that.checkForFullAccountsAndGroups(function() {
                    that.endLoading(loaderContainer);
                });
            } else {
                accountAdmin.getPremises(fullAccountId, 0, 10, function(fullAccountId, newPremises) {
                    // cache is now updated so lets retieve them  from cache.
                    var accountPremises = that.premisesCache.getPremisesCache(accountId);
                    that.addMultiplePremisesToSegment(accountPremises);
                    that.checkForFullAccountsAndGroups(function() {
                        that.endLoading(loaderContainer);
                    });
                });
            }
        }, 10);
    },

    undoAddAccountSetToSegment: function(accountId, fullAccountId, checkFullGroupsAndAccounts) {
        if (checkFullGroupsAndAccounts === true) {
            var loaderContainer = '#' + fullAccountId;
            this.startLoading(loaderContainer, accountAdmin.variables.removingPremisesText);
        }

        var that = this;
        // get accounts from cache
        var premises = accountAdmin.premisesCache.getPremisesCache(accountId);

        if (premises.length === 0) {
            // check the full account cache
            for (var i; i < that.fullAccountGroupsCache.length; i++) {

                var
                    group = that.fullAccountGroupsCache[i],
                    groupId = group.group_id;

                for (var a = 0; a < accounts.length; a++) {
                    var account = accounts[a];
                    if (parseInt(accountId) === parseInt(account.account_id)) {
                        var accountPremises = account.premises;
                        for (var p = 0; p < accountPremises.length; p++) {
                            var premise = accountPremises[p];
                            premises.push(premise.premise_id);
                        }
                        break;
                    }

                }
            }
        }

        var completeUndo = function(premises) {
            for (var i = 0; i < premises.length; i++) {
                var premiseId = premises[i];
                premiseId = parseInt(premiseId);
                if (that.premisesCache.exisitingPremisesArray.indexOf(premiseId) === -1) {
                    that.undoAddUnaddedPremisesToSegment(premiseId, false);
                }
            }

            if (checkFullGroupsAndAccounts === true) {
                // check if all the premises in an account are full
                that.checkForFullAccountsAndGroups(function() {
                    that.endLoading(loaderContainer);
                });
            }

            // Check if we're using a counter row and update it, removing if 0 premises remain to be added, updating otherwise
            that.showCounterOrPremisesRows();
        };


        if (premises.length === 0) {
            accountAdmin.getPremises(fullAccountId, 0, 10, function(fullAccountId, newPremises) {
                // cache is now updated so lets retieve them  from cache.
                premises = that.premisesCache.getPremisesCache(accountId);
                completeUndo(premises);
            });
        } else {
            completeUndo(premises);
        }


    },


    addMultiplePremisesToSegment: function(accountPremises) {
        if (typeof accountPremises != 'undefined') {
            for (var i = 0; i < accountPremises.length; i++) {
                var premisesId = parseInt(accountPremises[i]);
                if ((this.premisesCache.exisitingPremisesArray.indexOf(premisesId) === -1) && (this.premisesCache.toBeAddedPremises.indexOf(premisesId) === -1)) {
                    this.addUnaddedPremisesToSegment(premisesId);
                }
            }

        }
    },


    addMultiplePremisesToSegmentNoCheck: function(accountPremises, callback) {
        var that = this;
        if (typeof accountPremises != 'undefined') {
            var html = [];
            var inputs = [];
            var inputHtml = [];
            var index = 0;
            var length = accountPremises.length;
            var process = function() {
                for (; index < length; index++) {
                    var premisesId = parseInt(accountPremises[index]);
                    var added = that.premisesCache.addToBeAddedPremises(premisesId);
                    if (added === true) {
                        var $dataPremises = $('[data-premises-id=' + premisesId + ']');
                        var $premises = $('#groups-and-accounts-view , #viewall-premises').find($dataPremises);
                        if ($premises) {
                            that.applyAddedStatusStyling($premises);
                        }
                        inputHtml.push('<input type="hidden" data-included="true" id="' + premisesId + '" value="' + premisesId + '" data-premise-id="' + premisesId + '" />');
                    }

                    if (index + 1 < length && index % 50 === 0) {

                        setTimeout(process, 5);

                    } else if (index + 1 == length) {
                        that.showCounterOrPremisesRows();
                        $('.existing-segment-accounts').append(inputHtml.join(''));
                        callback();
                    }
                }
            };
            process();
        }
    },

    showCounterOrPremisesRows: function() {
        var that = this;
        if (that.getPremiseAddedCount() > that.variables.maxPremises) {
            that.showOrUpdateCounter();
        } else if (that.getPremiseAddedCount() === 0) {
            that.removeCounter();
        } else {
            that.showPremisesRows();
        }
    },

    addAccountGroupSetToSegment: function(groupId) {
        var loaderContainer = '#' + groupId;
        this.startLoading(loaderContainer, accountAdmin.variables.addingPremisesText);

        groupId = parseInt(groupId);
        var that = this;
        $.ajax({
            url: this.variables.segmentsWsUrl,
            type: "GET",
            async: true,
            data: {
                group_id: groupId,
                return_type: 'fullgroup'
            },
            success: function(data, textStatus, xhr) {

                if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
                    // html response means we've been timed out - redirect
                    window.location.replace('/oss_web/login.htm?login_error=timedOut');
                }

                if (data.status === 'ok') {
                    var accounts = data.accounts;

                    that.accountsCache.setAccountsCache(groupId, accounts);
                    var existingArr = that.premisesCache.getExisitingPremisesArray();

                    var premisesIdList = [];
                    for (var i = 0; i < accounts.length; i++) {
                        var account = accounts[i];
                        var accountId = account.account_id;
                        var premises = account.premises || [];
                        var accPremisesIdList = [];

                        for (var p = 0; p < premises.length; p++) {
                            var singlePremises = premises[p];
                            var singlePremisesId = singlePremises.premises_id;
                            if (existingArr.indexOf(parseInt(singlePremisesId)) === -1 && premisesIdList.indexOf(parseInt(singlePremisesId)) === -1) {
                                premisesIdList.push(parseInt(singlePremisesId));
                                accPremisesIdList.push(parseInt(singlePremisesId));
                            } else {}
                        }
                        that.premisesCache.setPremisesCache(accountId, accPremisesIdList);
                    }
                    that.addMultiplePremisesToSegmentNoCheck(premisesIdList, function() {
                        that.checkForFullAccountsAndGroups(function() {
                            that.endLoading(loaderContainer);
                        }, groupId);
                    });

                } else if (data.status === 'fail') {

                    accountAdmin.appendAccounts(groupId, accountAdmin.noAccountsTemplate(groupId, "We're sorry, something went wrong"), callback);
                } else if (data.status === 'error') {
                    accountAdmin.appendAccounts(groupId, accountAdmin.noAccountsTemplate(groupId, "We're sorry, the service is currently experiencing a problem, please try again later."), callback);
                }
            },
            error: function() {}
        });
    },


    undoAddAccountGroupSetToSegment: function(groupId) {
        var that = this;
        var loaderContainer = '#' + groupId;
        var $counterRow = $('.existing-segment-accounts .pa-mprn-summary .premises-counter');
        that.startLoading(loaderContainer, accountAdmin.variables.removingPremisesText);
        groupId = parseInt(groupId);

        var removeAccounts = function(accountsList) {
            setTimeout(function() {
                for (var i = 0; i < accountsList.length; i++) {
                    var accountId = accountsList[i];
                    that.undoAddAccountSetToSegment(accountId, groupId + '-' + accountId, false);
                }
                that.checkForFullAccountsAndGroups(function() {
                    that.endLoading(loaderContainer);
                    that.showCounterOrPremisesRows();

                });
            }, 10);
        };

        // Check if the accounts are already cached here and if not this needs to be done before the undo action
        if (that.accountsCache.cachedAccounts[groupId]) {
            // Get list of accounts
            var accountsList = that.accountsCache.getAccountsCache(groupId);
            removeAccounts(accountsList);
        } else {

            $.ajax({
                url: this.variables.segmentsWsUrl,
                type: "GET",
                async: true,
                data: {
                    group_id: groupId,
                    return_type: 'fullgroup'
                },
                success: function(data, textStatus, xhr) {

                    if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
                        // html response means we've been timed out - redirect
                        window.location.replace('/oss_web/login.htm?login_error=timedOut');
                    }

                    if (data.status === 'ok') {
                        var accounts = data.accounts;

                        that.accountsCache.setAccountsCache(groupId, accounts);
                        var existingArr = that.premisesCache.getExisitingPremisesArray();

                        var premisesIdList = [];
                        var accountIdList = [];
                        for (var i = 0; i < accounts.length; i++) {
                            var account = accounts[i];
                            var accountId = account.account_id;
                            accountIdList.push(accountId);
                            var premises = account.premises || [];
                            var accPremisesIdList = [];

                            for (var p = 0; p < premises.length; p++) {
                                var singlePremises = premises[p];
                                var singlePremisesId = singlePremises.premises_id;
                                if (existingArr.indexOf(parseInt(singlePremisesId)) === -1 && premisesIdList.indexOf(parseInt(singlePremisesId)) === -1) {
                                    premisesIdList.push(parseInt(singlePremisesId));
                                    accPremisesIdList.push(parseInt(singlePremisesId));
                                } else {}
                            }
                            that.premisesCache.setPremisesCache(accountId, accPremisesIdList);
                        }
                        removeAccounts(accountIdList);
                    } else if (data.status === 'fail') {
                        accountAdmin.appendAccounts(groupId, accountAdmin.noAccountsTemplate(groupId, "We're sorry, something went wrong"), callback);
                    } else if (data.status === 'error') {
                        accountAdmin.appendAccounts(groupId, accountAdmin.noAccountsTemplate(groupId, "We're sorry, the service is currently experiencing a problem, please try again later."), callback);
                    }
                },
                error: function() {}

            });

        }
    },

    confirmDelete: function(link) {
        link.text('Cancel').closest('tr').addClass('danger');
    },

    clearDelete: function(link) {
        var btnText = accountAdmin.variables.SegDelTxt;
        if (accountAdmin.variables.isGroup) {
            btnText = accountAdmin.variables.GrpDelTxt;
        }
        link.text(btnText).closest('tr').removeClass('danger');
    },

    startLoading: function(container, msg) {
        if (container === '#viewall-premises') {
            $(container + '>table').before($('<div class="ajax-loading hide">' + msg + '</div>'));
        } else {
            $(container + '>table').after($('<div class="ajax-loading hide">' + msg + '</div>'));
        }

    },

    endLoading: function(container) {
        $(container).find('.ajax-loading').remove();
    },

    premisesInput: function(id, type, value, data_set) {
        return $('<input type="' + type + '" />').attr({
            "id": id,
            "data-included": "true",
            "value": value,
            "data-set": data_set
        });
    },


    /*
     * ============================================
     *  Changes suggested by Des Bohan 27/3/15
     *  By: Rebecca Richards
     *  Date: March 2015
     * ============================================
     */
    /*
     ** Called when Save button is clicked
     ** Gather all data-included=true values and POST
     */
    updateSeg: function() {
        var segId = $("#segId").val(); // Segment ID
        var premisesTrue = $("input[data-included='true']"); // this contains the raw HTML-Elements
        var selectedPremises = premisesTrue.map(function() {
            return $(this).attr('value');
        }); //Create an array of premises
        //Remove duplicates from the array
        var uniqueSelectedPremises = [];
        $.each(selectedPremises, function(i, el) {
            if ($.inArray(el, uniqueSelectedPremises) === -1) uniqueSelectedPremises.push(el);
        });
        var segPremises = uniqueSelectedPremises.toString();
        $('#infoMessageSegment').hide().removeClass('red');
        $.ajax({
            url: 'update-segment-premises.htm',
            type: "post",
            async: true,
            data: {
                segId: segId,
                segPremises: segPremises
            },
            success: function(data, textStatus, xhr) {

                if (xhr.responseText.indexOf('<!DOCTYPE html>') > -1) {
                    // html response means we've been timed out - redirect
                    window.location.replace('/oss_web/login.htm?login_error=timedOut');
                }
                if (data.indexOf("successfully") > -1) {
                    window.onbeforeunload = function(e) {};
                    window.location.href = "admin-segments.htm";
                } else if (data.indexOf("DOCTYPE") > -1) {
                    $('#infoMessage h3').text("Sorry, something went wrong. You're session may have timed out. Please try again later.");
                    $('#infoMessage').addClass('alert-icon red').fadeIn().removeClass('hide');
                } else {
                    $('#infoMessageSegment h3').text(data);
                    $('#infoMessageSegment').addClass('alert-icon red').fadeIn().removeClass('hide');
                }
            },
            error: function() {
                $('#infoMessageSegment h3').text("Sorry, something went wrong. Please try again later.");
                $('#infoMessageSegment').addClass('alert-icon red').fadeIn().removeClass('hide');
            }
        });
    },


    addSeg: function() {
      var premisesTrue;
      var selectedPremises;
      var uniqueSelectedPremises;
      var segPremises;

      premisesTrue = $("input.premisesChecked:checkbox:checked");

      //Create an array of premises
      selectedPremises = premisesTrue.map(function() {
          return $(this).attr('value');
      });

      //Remove duplicates from the array
      uniqueSelectedPremises = [];

      $.each(selectedPremises, function(i, el) {
          if ($.inArray(el, uniqueSelectedPremises) === -1) uniqueSelectedPremises.push(el);
      });

      segPremises = uniqueSelectedPremises.toString();

      return segPremises;
    }

};
