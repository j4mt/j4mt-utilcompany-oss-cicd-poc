
//polyfill for index of for arrays
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}



/**
 * Bind polyfill.
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

;
/**
 *  SSE Airtricity OSS
 *  Author: Each&Other
 *  Component: Nps
 */
;
(function(window, document, undefined) {
  'use strict';

  var Component = window.Component || function() {};

  var nps = Component.nps = function(el, widgetEl) {

    this.$el = $(el);

    /*
     * The nps component and the nps widget need a link to each other
     * unfortunately since the nps component is shared across legacy pages
     * and new pages it needs to be initted from oss-enhancements.js, otherwise
     * we end up with multiple inits and therefore multiple submissions of the form (grrrrr).
     * In oss-enhancements.js we pass in the $widget selector. In here we check it's
     * length and init the widget if it's on the page
     */

    this.$widgetEl = $(widgetEl);

    this.settings = {
      sliderDefault: -1,
      feedbackVisible: false,
      postUrl: 'feedback.htm'
    }
    this.init(el);
  }

  nps.prototype.init = function(el) {
    this.bindUiActions();
    this.clearSliders($('.feedback-form').find('.slider-container'));

    if (this.$widgetEl.length) {
      this.initWidget()
    }

  }

  nps.prototype.initWidget = function() {
    this.widget = new Component['npsWidget'](this.$widgetEl, this);
  }

  nps.prototype.bindUiActions = function() {
    var me = this;
    $('#show-feedback').click(function() {
      if (me.settings.feedbackVisible) {
        me.hideFeedback();
      } else {
        me.showFeedback();
      }
    });
    $('.submit-success .close').click(function() {
      me.hideFeedback();
    });
    $('.slider li a').click(function() {
      me.updateSlider($(this));
    });
    $('#submit-feedback').click(function(e) {
      e.preventDefault();
      me.submitFeedback();
    });
  }

  nps.prototype.submitFeedback = function() {
    var me = this;
    var formData = {
      recommendationRating: $("#recommend").val(),
      satisfactionRating: $("#satisfied").val(),
      feedback: $("#comments").val(),
      sourceURL: window.location.href
    };

    if (me.validate(formData)) {
      $.ajax({
        url: me.settings.postUrl,
        type: 'POST',
        async: true,
        dataType: 'json',
        data: formData
      });
      me.showConfirmation();
    }
  }

  nps.prototype.showConfirmation = function() {

    var me = this;

    $('#feedback-container ul.tabs').slideUp('slow');

    $('.feedback-form').slideUp('slow', function() {
      $('.submit-success').slideDown('slow');
      // hide the nps widget if there's one on the page
      if (me.widget) {
        me.widget.hide();
      }
    });
  }

  nps.prototype.updateSlider = function(sliderItem) {
    var sl = sliderItem.closest('.slider');
    var slCtnr = sl.closest('.slider-container');
    //Move the active class to new selection
    sl.children('li').removeClass('active');
    sliderItem.closest('li').addClass('active');
    //Set the value to the selected value
    slCtnr.next('input').val(sliderItem.text());
    sl.find('li a, li').removeClass('redraw');
    slCtnr.removeClass('has-no-selection');
    this.hideError(slCtnr.closest('.panel'));
  }

  nps.prototype.showFeedback = function() {
    this.settings.feedbackVisible = true;
    $('#feedback-container .feedback').slideDown('slow');
    $('#show-feedback').addClass('minus');
  }

  nps.prototype.hideFeedback = function() {
    this.settings.feedbackVisible = false;
    $('#feedback-container .feedback').slideUp('slow');
    $('#show-feedback').removeClass('minus');
  }

  nps.prototype.clearSliders = function(sliders) {
    //Remove values from hidden fields
    sliders.each(function() {
      $(this).next('input').val('');
      $(this).find('.active').removeClass('active');
      $(this).addClass('has-no-selection');
    });
  }

  nps.prototype.validate = function(form) {
    var $slidepanel = {
      recommend: $('#recommend').closest('.panel'),
      satisfied: $('#satisfied').closest('.panel')
    };

    //Just ensure the two sliders have a selected value;
    if (form.recommendationRating && form.satisfactionRating) {
      return true;
    }

    //Validation message for recommendationRating
    $slidepanel.recommend.find('.slider-warning').remove();
    if (form.recommendationRating) {
      this.hideError($slidepanel.recommend);
    } else {
      this.showError($slidepanel.recommend);
    }

    //Validation message for satisfactionRating
    $slidepanel.satisfied.find('.slider-warning').remove();
    if (form.satisfactionRating) {
      this.hideError($slidepanel.satisfied);
    } else {
      this.showError($slidepanel.satisfied);
    }

  }

  nps.prototype.showError = function($panel) {
    var warnMsg = '<p class=\'slider-warning\'>Please select a rating below</p>';
    $panel.addClass('selection-warn');
    $panel.find('h4').after(warnMsg);
  }

  nps.prototype.hideError = function($panel) {
    $panel.removeClass('selection-warn');
    $panel.find('.slider-warning').remove();
  }

  window.Component = Component;


})(this.window, this.document);

;
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

;
'use strict';

/* JSHint: */
/* globals $: false */

/* LIBERATED BELOW FROM SCRIPTS.JS */
/*
============================================================================
	Start of New jQuery statements
============================================================================
*/
if ($('.form-details').length) {
    if (!$('#moving-out').length) {
        $('.form-details div.row:even').addClass('odd-row');
    }
}
if ($('.form-stripe').length) {
    $('.form-stripe div.row:odd').addClass('odd-row');
}
if ($('table.stripe').length) {
    $('.module table.stripe tr:even td').addClass('odd-row');
}
if ($('table.stripe-only').length) {
    $('.module table.stripe-only tr:even td').addClass('odd-row');
}
/*
	Change buttons
*/
if ($('.change').length) {
    $('.change').click(function() {
        // Reset any existing forms which are open
        $('.form-details').slideUp();
        $('.display-details').slideDown();
        $('.change').show();
        $('.cancel-change').hide();
        // hide this forms display details and show our form and the appropriate actions
        $(this).siblings('.display-details').slideUp();
        $(this).siblings('.form-details').slideDown();
        $(this).hide();
        $(this).siblings('.cancel-change').show();
        $('.module').removeClass('open');
        $(this).parents('.module').addClass('open');
        return false;
    });
    $('.cancel a').click(function() {
        $(this).parents('.form-details').slideUp();
        $(this).parents().siblings('.display-details').slideDown();
        $(this).parents().siblings('.change').show();
        $(this).parents().siblings('.cancel-change').hide();
        $(this).parents('.module').removeClass('open');
        return false;
    });
    $('.cancel-change').click(function() {
        $(this).siblings('.form-details').slideUp();
        $(this).siblings('.display-details').slideDown();
        $(this).hide();
        $(this).siblings('.change').show();
        $(this).parents('.module').removeClass('open');
        return false;
    });
    if ($('.open').length) {
        $('.open').children('.module-content').children('.display-details').hide();
        $('.open').children('.module-content').children('.form-details').show();
    }
    $('#change-my-details .change').click(function() {
        $('#security-warning').show();
    });
    $('#change-my-details .cancel-change').click(function() {
        $('#security-warning').hide();
    });
    $('#change-my-details .cancel a').click(function() {
        $('#security-warning').hide();
    });
    $('#billing-notification .change').click(function() {
        $('#billing-text').hide();
    });
    $('#billing-notification .cancel-change').click(function() {
        $('#billing-text').show();
    });
    $('#billing-notification .cancel a').click(function() {
        $('#billing-text').show();
    });
    if ($('#BillingNotNo').is(':checked')) {
        $('#billNotEmailRow').hide();
    }
    $('#BillingNotNo').click(function() {
        $('#billNotEmailRow').slideUp();
    });
    $('#BillingNotYes').click(function() {
        $('#billNotEmailRow').slideDown();
    });
    if ($('#eBillingNo').is(':checked')) {
        $('#eBillingEmailRow').hide();
    }
    $('#eBillingNo').click(function() {
        $('#eBillingEmailRow').slideUp();
    });
    $('#eBillingYes').click(function() {
        $('#eBillingEmailRow').slideDown();
    });
    if ($('#meterSMSNo').is(':checked')) {
        $('#meterSMSRow').hide();
    }
    $('#meterSMSNo').click(function() {
        $('#meterSMSRow').slideUp();
    });
    $('#meterSMSYes').click(function() {
        $('#meterSMSRow').slideDown();
    });
    if ($('#meterEmailNo').is(':checked')) {
        $('#meterEmailRow').hide();
    }
    $('#meterEmailNo').click(function() {
        $('#meterEmailRow').slideUp();
    });
    $('#meterEmailYes').click(function() {
        $('#meterEmailRow').slideDown();
    });
    if ($('#marketingNo').is(':checked')) {
        $('#marketing-contact').hide();
    }
    $('#marketingNo').click(function() {
        $('#marketing-contact').slideUp();
    });
    $('#marketingYes').click(function() {
        $('#marketing-contact').slideDown();
    });
    if ($('#marketingByPost').is(':checked')) {
        $('#marketingEmailRow').hide();
    }
    $('#marketingByPost').click(function() {
        $('#marketingEmailRow').slideUp();
    });
    $('#marketingByEmail').click(function() {
        $('#marketingEmailRow').slideDown();
    });
    /* A bit of cheeky styling via js, this will remove the need to add classes to each radio button*/
    //$(':radio').addClass('radio-input'); ie8 is not liking this.
    $('#password-form').validate({
        rules: {
            userName: {
                required: true,
                minlength: 2
            },
            newPassword: {
                required: true,
                minlength: 4
            },
            retypenewPassword: {
                required: true,
                minlength: 4,
                equalTo: '#newPassword'
            },
            detailsEmailAddres: {
                required: true,
                email: true
            }
        },
        messages: {
            username: {
                required: 'Please enter a username',
                minlength: 'Your username must consist of at least 2 characters'
            },
            newPassword: {
                required: 'Please provide a password',
                minlength: 'Your password must be at least 4 characters long'
            },
            retypenewPassword: {
                required: 'Please provide a password',
                minlength: 'Your confirmation password must be at least 4 characters long',
                equalTo: 'Your passwords don\'t match. Remember that passwords are case sensitive.'
            },
            detailsEmailAddres: {
                required: 'Please enter a valid email address',
                email: 'Please enter a valid email address'
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.parent('.row').prev('.error-row-description-inline'));
            $(element).parents('.row').prev('.error-row-description-inline').show();
        },
        highlight: function(element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element).parents('.row').addClass('error-row');
            $(element).parents('.row').prev('.error-row-description-inline').addClass('row');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element).parents('.row').prev('.error-row-description-inline').removeClass('row');
            $(element).parents('.row').removeClass('error-row');
        },
        showErrors: function(errorMap, errorList) {
            if (this.numberOfInvalids() === 0) {
                $('.error-row-description-inline').hide();
            }
            this.defaultShowErrors();
        }
    });
    // End of .change.length
}

;
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

;
 /*
  * The Accounts cache
  * functions for getting/setting Accounts
  */
 var AccountsCache = function() {
 	this.cachedAccounts = {};
  this.cachedFullAccounts = {};
 	this.notAlreadyAddedAccounts = {};
 	this.toBeAddedAccounts = [];
 };

 /*
  * Set accounts cache - based on group id
  */
 AccountsCache.prototype.setAccountsCache = function(groupId, accounts) {
 	this.cachedFullAccounts[groupId] = accounts;
  var accountIdArr = [];
  for (var i=0;i<accounts.length;i++) {
    accountIdArr.push(accounts[i].account_id);
  }
  this.cachedAccounts[groupId] = accountIdArr;
 };
 /*
  * Get accounts cache (full item) - based on group id
  */
 AccountsCache.prototype.getFullAccountsCache = function(groupId) {
 		return this.cachedFullAccounts[groupId] || this.cachedFullAccounts[parseInt(groupId)] || [];
 };

  /*
  * Get accounts cache (just the ids) - based on group id
  */
 AccountsCache.prototype.getAccountsCache = function(groupId) {
    return this.cachedAccounts[groupId] || this.cachedAccounts[parseInt(groupId)] || [];
 };

 /*
  * Get valid accounts cache (just the ids) - based on group id.
  * Valid accounts are based on there being more than 0 premises
  */
 AccountsCache.prototype.getValidAccountsCache = function(groupId, premisesCache) {
    var accounts = this.cachedAccounts[groupId];
    var validAccounts = [];
    for (var i=0;i<accounts.length; i++) {
      var account =  accounts[i];
      var premises = premisesCache.getPremisesCache(account);
      if (premises.length > 0) {
        validAccounts.push(accounts);
      }
    }
    return validAccounts;
 };


/*
  * Get accounts cache (full item) - based on group id and an account Id
  */
 AccountsCache.prototype.getAccount = function(groupId, accountId) {
    var accounts = this.getFullAccountsCache(groupId);
    for (var i=0;i<accounts.length;i++) {
      if (parseInt(accounts[i].account_id) === parseInt(accountId)) {
        return accounts[i];
      }
    }
 };

 /*
  *
  */
 AccountsCache.prototype.addToBeAddedAccounts = function(account) {
 	var index = this.toBeAddedAccounts.indexOf(account);
 	if (index === -1) {
 		this.toBeAddedAccounts.push(account);
 	}

 };
 /*
  *
  */
 AccountsCache.prototype.removeToBeAddedAccounts = function(account) {
 	var index = this.toBeAddedAccounts.indexOf(account);
 	if (index > -1) {
 		this.toBeAddedAccounts.splice(index, 1);
 	}

 };
 /*
  *
  */
 AccountsCache.prototype.getToBeAddedAccounts = function() {
 	return this.toBeAddedAccounts;
 };

 /*
  * Set notAlreadyAddedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 AccountsCache.prototype.setNotAlreadyAddedAccounts = function(groupId) {
 	groupId = parseInt(groupId);
 	this.notAlreadyAddedAccounts[groupId] = this.isNotExistingInGroup(groupId);
 };
 /*
  * Get notAlreadyAddedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 AccountsCache.prototype.getNotAlreadyAddedAccounts = function(groupId) {
 	return this.notAlreadyAddedAccounts[groupId];
 };

 AccountsCache.prototype.isNotAddedInGroup = function(groupId) {
 	var allToBeAdded = this.getToBeAddedAccountsGroup(groupId),
 		allAccountsInGroup = this.getAccountsCache(groupId),
 		bigArray,
 		smallArray,
 		resultsArray = [];


 	if (allAccountsInGroup.length >= allToBeAdded) {
 		bigArray = allAccountsInGroup;
 		smallArray = allToBeAdded;
 	} else {
 		smallArray = allAccountsInGroup;
 		bigArray = allToBeAdded;
 	}

 	if(smallArray.length == 0) {
 		for (var i = bigArray.length - 1; i >= 0; i--) {
	 		var key = bigArray[i];
	 		if (-1 === smallArray.indexOf(key)) {
	 			resultsArray.push(key);
	 		}
	 	}
 	}
 	else {
 		for (var i = 0; i < bigArray.length; i++) {
	 		if(bigArray.indexOf(smallArray[i]) == -1) {
	 			if(smallArray[i]) {
		 			resultsArray.push(smallArray[i]);
		 		}
	 		}
	 	}
 	}
 	return resultsArray;
 };

 /*
  *
  */
 AccountsCache.prototype.getToBeAddedAccountsGroup = function(groupId) {

  var allToBeAdded = this.getToBeAddedAccounts(),
 		allAccountsInGroup = this.getAccountsCache(groupId),
 		bigArray,
 		smallArray,
 		resultsArray = [];

 	if (allAccountsInGroup.length >= allToBeAdded) {
 		bigArray = allAccountsInGroup;
 		smallArray = allToBeAdded;
 	} else {
 		smallArray = allAccountsInGroup;
 		bigArray = allToBeAdded;
 	}
 	for (var i = 0; i < bigArray.length; i++) {
 		for (var j = 0; j < smallArray.length; j++) {
 			if (bigArray[i] == smallArray[j]) {
 				resultsArray.push(bigArray[i]);
 			}
 		}
 	}
 	return resultsArray;
 };


  AccountsCache.prototype.clearCache = function() {
    this.cachedAccounts = {};
    this.cachedFullAccounts = {};
  }


;


/*
============================================================================
  Tooltips
============================================================================
*/
$(document).ready(function() {
  "use strict";

  function betterTooltip(tooltipClass) {

    var tip = $('.tooltip');
    /* Mouse over and out functions*/
    $(tooltipClass).click(function() {
      var offset = $(this).position();
      var tLeft = offset.left;
      var tTop = offset.top;
      var linkWidth = ($(this).width()) / 2;

      tTop = (tTop + 20) + 'px';
      tLeft = (tLeft - 170 + linkWidth) + "px";

      if ($(this).next('.tooltip').is(':visible')) {
        $('.tooltip').fadeOut();
      } else {
        $('.tooltip').hide();
        var thisHref = $(this).attr('href');
        var startTooltip = '<span class="tooltip"><span class="tooltip-top"></span><span class="tooltip-content"><a href="#" class="tooltip-close"><span>close</span></a>';
        var endTooltip = '</span></span>';
        var ourTooltip = startTooltip + $(thisHref).html() + endTooltip;
        $(this).after(ourTooltip);
        $(this).next('.tooltip').css({
          'top': tTop,
          'left': tLeft
        });
        $('.tooltip-close').click(function() {
          $('.tooltip').fadeOut();
          return false;
        });
        $(ourTooltip).show();
      }
      return false;
    });
  }

  if ($('.toolTip').length) {
    $('.tooltip').hide();
    //$('.toolTip').betterTooltipTwo({speed: 150, delay: 300});
    betterTooltip('.toolTip');
  }

});

;


/*
 * ============================================
 *  Commercial - Update src of input controls to show blue button if page is commercial
 *  By: Conor Luddy - iQContent
 *  Date: 05 March 2013
 * ============================================
 */
$(document).ready(function() {
  "use strict";

  //If this is a commercial page we need to update the src of image-input elements (buttons) to show the blue buttons
  if (($('body.commercial').length) && ($("input[type='image']").length)) {
    var imagesCurrentSrc,
      imagesCurrentExtension,
      imagesNewSrc,
      stringChange = '-blue';
    $("input[type='image']").each(function() {
      var _this = $(this);
      imagesCurrentSrc = $(this).attr('src');
      imagesCurrentExtension = imagesCurrentSrc.substr(-4); //Assumes all extensions are in the format of '.ABC'
      imagesNewSrc = imagesCurrentSrc.replace(imagesCurrentExtension, stringChange + imagesCurrentExtension);
      //Only update this if the image actually exists (needs localhost to run AJAX)
      $.get(imagesNewSrc, function() {
        _this.attr('src', imagesNewSrc);
      });
    });
  }
});

;
/*
 * ============================================
 * Rebecca Richards March 2015
 * Centralized colorbox init function. To use it without any extra javascript:
 * 1. Add "colorbox-trigger" class to the modal trigger html element (usually <a> tag or a <button>)
 * 2. Add data-modal-target="#target-id" to the same tag, (where target-id
 * is an id of the div that will become a modal content).
 * ============================================
 */
$(document).ready(function () {
  "use strict";

  (function () {
    if ($.colorbox) {
      $(".colorbox-trigger").colorbox({
        inline: true,
        href: function () {
          return $(this).attr('data-modal-target');
        },
        width: function () {
          var widthOption = $(this).attr('data-modal-width');
          return widthOption ? widthOption + 'px' : '890px';
        },
        initialWidth: function () {
          var widthOption = $(this).attr('data-modal-width');
          return widthOption ? widthOption + 'px' : '890px';
        },
        scrolling: false,
        onComplete: function () {
          $.colorbox.resize();
        }
      });
      $('.colorbox-trigger').click(function (e) {
        e.preventDefault();
      });
    }

  })();

});

;

/*
jQuery Url Plugin
  * Version 1.0
  * 2009-03-22 19:30:05
  * URL: http://ajaxcssblog.com/jquery/url-read-get-variables/
  * Description: jQuery Url Plugin gives the ability to read GET parameters from the actual URL
  * Author: Matthias Jäggli
  * Copyright: Copyright (c) 2009 Matthias Jäggli
  * Licence: dual, MIT/GPLv2
*/
(function($) {
  $.url = {};
  $.extend($.url, {
    _params: {},
    init: function() {
      var paramsRaw = "";
      try {
        paramsRaw = (document.location.href.split("?", 2)[1] || "").split("#")[0].split("&") || [];
        for (var i = 0; i < paramsRaw.length; i++) {
          var single = paramsRaw[i].split("=");
          if (single[0]) this._params[single[0]] = unescape(single[1]);
        }
      } catch (e) {
        alert(e);
      }
    },
    param: function(name) {
      return this._params[name] || "";
    },
    paramAll: function() {
      return this._params;
    }
  });
  $.url.init();
})(jQuery);

;


/**
 * OSS Release 3 - IE warning
 */
$(document).ready(function() {
  "use strict";

  //Die if there's no cookies...
  if (typeof $.cookie === 'undefined') {
    return false;
  }
  /*
  ============================================================================
      Reset the cookie hidden "session" when user logs in Sifter #21715
  ============================================================================
  */
  $('#loginForm button#submitLogin').click(function() {
    if($.cookie('vIeBanner')){
      $.cookie('vIeBanner', null, {path: '/'});
    }
  });

  /*
  ============================================================================
      Out-of-date Browser check > Trigger banner
  ============================================================================
  */
  function isIE () {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
  }

  if (!$.cookie('vIeBanner')) {
      var vIE = isIE();
      if (vIE !== false) {
          if (vIE < 9) {
              $('.browser-support-container').show();
              $('#information-banner').hide();
          }
      }
  }

  /*
  ============================================================================
      Dismiss banner & remember action for session
  ============================================================================
  */
  $('.dismiss-banner').click(function(e){
      e.preventDefault();

      var dismissDiv = $(this).attr('href');
      var cookieName = $(this).data('banner-cookie');

      $('.' + dismissDiv).slideUp();

      $.cookie(cookieName, vIE, {path: '/'});

      $.ajax({
        url: '/hideOutOfDateBrowserMessage',
        type: 'POST',
        dataType: 'json',
        data: {hidden: true}
      });

  });

});

;
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

;
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




;
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

;
 /*
  * The premises cache
  * functions for getting/setting premises
  */
 var PremisesCache = function() {
 	this.cachedPremises = {};
  this.cachedFullPremises = {};
  this.cachedUnfilteredPremises = [];
 	this.toBeAddedPremises = [];
 	this.toBeRemovedPremises = {};
 	this.alreadyAddedPremises = {};
 	this.notAlreadyAddedPremises = {};
 	this.exisitingPremisesArray = [];
 };
 /*
  * Set premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.setPremisesCache = function(accountId, premises) {
  accountId = parseInt(accountId);
  this.cachedPremises[accountId] = premises;
 };
 /*
  * Set full premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.setFullPremisesCache = function(accountId, fullPremises) {
  accountId = parseInt(accountId);
  this.cachedFullPremises[accountId] = fullPremises;
 };
  /*
  * Set unfiltered premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.setUnfilteredPremisesCache = function(fullPremises) {
  this.cachedUnfilteredPremises = fullPremises;
  console.log(this.cachedUnfilteredPremises);
 };
 /*
  * Get premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.getPremisesCache = function(accountId) {
  return this.cachedPremises[accountId] || this.cachedPremises[parseInt(accountId)] || [];
 };

 /*
  * Get full premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.getFullPremisesCache = function(accountId) {
  return this.cachedFullPremises[accountId] || this.cachedFullPremises[parseInt(accountId)] || [];;
 };

 /*
  * Set exisitingPremisesArray cache
  */
 PremisesCache.prototype.setExisitingPremises = function(premisesIds) {
  for (var i = 0; i < premisesIds.length; i++) {
 		this.exisitingPremisesArray.push(parseInt(premisesIds[i]));
 	}
 };
 /*
  * Get exisitingPremisesArray premises cache
  */
 PremisesCache.prototype.getExisitingPremisesArray = function() {
 	return this.exisitingPremisesArray;
 };

/*
  * Get premises by ID
  */
PremisesCache.prototype.getSinglePremises = function(premisesId) {

    for (var i=0;i<this.cachedUnfilteredPremises.length;i++) {
      var premises = this.cachedUnfilteredPremises[i];

      if (parseInt(premises.premises_id) === parseInt(premisesId)) {
        return premises;
        console.log(premises);
      }
    }
 };


 /*
  * Set setToBeAddedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.addToBeAddedPremises = function(premises) {
 	premises = parseInt(premises);
 	var index = this.toBeAddedPremises.indexOf(premises);
 	if (index === -1) {
 		this.toBeAddedPremises.push(premises);
 	}
 };
 PremisesCache.prototype.removeToBeAddedPremises = function(premises) {
 	premises = parseInt(premises);
 	var index = this.toBeAddedPremises.indexOf(premises);
 	if (index > -1) {
 		this.toBeAddedPremises.splice(index, 1);
 	}

 };
 /*
  * Get setToBeAddedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.getToBeAddedPremises = function() {
 	return this.toBeAddedPremises;
 };


 PremisesCache.prototype.getToBeAddedPremisesAccount = function(accountId) {
  if ((accountId+'').indexOf('-') > -1) {
    var tmpArr = accountId.split('-');
    accountId = tmpArr[1];
  }
 	accountId = parseInt(accountId);
 	var allToBeAdded = this.getToBeAddedPremises(),
 		allPremInAccount = this.getPremisesCache(accountId),
 		bigArray,
 		smallArray,
 		resultsArray = [];

 	if (allPremInAccount.length >= allToBeAdded) {
 		bigArray = allPremInAccount;
 		smallArray = allToBeAdded;
 	} else {
 		smallArray = allPremInAccount;
 		bigArray = allToBeAdded;
 	}
 	for (var i = 0; i < bigArray.length; i++) {
 		for (var j = 0; j < smallArray.length; j++) {
 			if (parseInt(bigArray[i]) == parseInt(smallArray[j])) {
 				resultsArray.push(parseInt(bigArray[i]));
 			}
 		}
 	}
 	return resultsArray;
 };

 /*
  * Set toBeRemovedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.setToBeRemovedPremises = function(accountId, premises) {
 	accountId = parseInt(accountId);
 	premises = parseInt(premises);
 	this.toBeRemovedPremises[accountId] = premises;
 };
 /*
  * Get toBeRemovedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.getToBeRemovedPremises = function(accountId) {
 	return this.toBeRemovedPremises[accountId] || [];
 };

 /*
  * Set alreadyAddedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.setAlreadyAddedPremises = function(accountId) {
 	accountId = parseInt(accountId);
 	this.alreadyAddedPremises[accountId] = this.isExistingInAccount(accountId);
 };
 /*
  * Get alreadyAddedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.getAlreadyAddedPremises = function(accountId) {
 	return this.alreadyAddedPremises[accountId] || [];
 };


 /*
  * Set notAlreadyAddedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.setNotAlreadyAddedPremises = function(accountId) {
 	accountId = parseInt(accountId);
 	this.notAlreadyAddedPremises[accountId] = this.isNotExistingInAccount(accountId);
 };
 /*
  * Get notAlreadyAddedPremises premises cache - based on accountId
  * accountId can be "viewAll" or a specific segment ID (12345)
  */
 PremisesCache.prototype.getNotAlreadyAddedPremises = function(accountId) {
 	return this.notAlreadyAddedPremises[accountId];
 };


 PremisesCache.prototype.isExistingInAccount = function(accountId) {
 	accountId = parseInt(accountId);
 	var allExisting = this.getExisitingPremisesArray(),
 		premisesInAccount = this.getPremisesCache(accountId),
 		bigArray,
 		smallArray,
 		resultsArray = [];

 	if (premisesInAccount.length >= allExisting) {
 		bigArray = premisesInAccount;
 		smallArray = allExisting;
 	} else {
 		smallArray = premisesInAccount;
 		bigArray = allExisting;
 	}

 	for (var i = 0; i < bigArray.length; i++) {
 		for (var j = 0; j < smallArray.length; j++) {
 			if (parseInt(bigArray[i]) == parseInt(smallArray[j])) {
 				resultsArray.push(parseInt(bigArray[i]));
 			}
 		}
 	}
 	return resultsArray;
 };

 PremisesCache.prototype.isNotExistingInAccount = function(accountId) {
 	accountId = parseInt(accountId);
 	var allExisting = this.getExisitingPremisesArray(),
 		premisesInAccount = this.getPremisesCache(accountId),
 		bigArray,
 		smallArray,
 		resultsArray = [];

 	if (premisesInAccount.length >= allExisting) {
 		bigArray = premisesInAccount;
 		smallArray = allExisting;
 	} else {
 		smallArray = premisesInAccount;
 		bigArray = allExisting;
 	}

 	if(smallArray.length == 0) {
 		for (var i = bigArray.length - 1; i >= 0; i--) {
	 		var key = bigArray[i];
	 		if (-1 === smallArray.indexOf(key)) {
	 			resultsArray.push(key);
	 		}
	 	}
 	}
 	else {
 		for (var i = 0; i < bigArray.length; i++) {
	 		if(bigArray.indexOf(smallArray[i]) == -1) {
	 			if(smallArray[i]) {
		 			resultsArray.push(smallArray[i]);
		 		}
	 		}
	 	}
 	}

 	return resultsArray;
 };


 PremisesCache.prototype.clearCache = function() {
  this.cachedPremises = {};
  this.cachedFullPremises = {};
  this.notAlreadyAddedPremises = {};
 }

;

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
