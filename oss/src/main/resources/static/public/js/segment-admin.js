/*
 ** Segment Admin
 ** Let's add in some proper comments
 */
(function(window, document, $, undefined) {
  'use strict';
  /*
   * constructor
   */
  var SegmentAdmin = function() {
    this.settings = {
      toBeRemoved: 0,
      toBeAdded: 0,
      linkClicked: false,
      GrpDelTxt: 'Remove group',
      SegDelTxt: 'Remove segment',
      addAccTxt: 'Add to group',
      remAccTxt: 'Remove from group',
      remPremTxt: 'Remove from segment',
      addPremTxt: 'Add to segment',
      undoHtml: '<p class="added">Added<a href="#" class="add-to-group undo">Undo</a></p>',
      undoSegHtml: '<p class="added">Added<a href="#" class="add-to-segment undo">Undo</a></p>',
      undoGrpSegHtml: '<p class="added">Added <span class="accounts-added"></span> matching accounts<a href="#" class="add-all-matches undo">Undo</a></p>',
      removeInfoHtml: '<span class="bold">This account has been removed from this group:</span><br />',
      removeSegInfoHtml: '<span class="bold">This premises has been removed from this segment:</span><br />',
      isGroup: true,
      segmentsWsUrl: '',
      segmentsWsUrlLocal: "http://0.0.0.0:8091/api/premises",
      segmentsWsUrlRemote: "apiSegments.htm",
      premisesReturnLimit: 10,
      activeQuery: false,
      needToSave: false,
      devMode: false,
      apiFailText: "We're sorry, something went wrong",
      apiErrorText: "We're sorry, the service is currently experiencing a problem, please try again later.",
      unsavedUpdatesText: 'You have not saved your segment updates',
      numRowDisplay: 10
    };
    this.selectors = {
      // lets put any CACHABLE jquery selectors in here
      groupsAndAccountView: $('#groups-and-accounts-view'),
      allPremisesView: $('#viewall-premises'),
      apiErrorState: $('div.api-error-state'),
      groupAccountsView: $('#groups-and-accounts-view'),
      groupAccountsDivs: $('#groups-and-accounts-view > div[class!="api-error-state"]'),
      premisesView: $('#viewall-premises'),
      ieButtons: $('.lt-ie9 .btn')
    };
    // calling init here, self initialising
    this.init();
  };
  /*
   * init function
   */
  SegmentAdmin.prototype.init = function() {
    this.setSegmentsURL();
    this.premisesCache = new PremisesCache();
    this.changedPremisesCache = new ChangedPremisesCache();
    this.accountsCache = new AccountsCache();
    this.events();
  };

  /*
   * Events - hook up any events here, clicks etc.
   */
  SegmentAdmin.prototype.events = function() {
    var me = this;

    $('a[href!=#]').not('a[href*=javascript]').click(function() {
      //this.navigateAwayCheck();
    });
    // this is triggered if browser navigation is used
    window.onbeforeunload = function(e) {
      me.settings.toBeRemoved = $('input.existing[data-included=false]').length;
      me.settings.toBeAdded = $('input[data-included=true]').not('.existing').length;

      // let's figure out if any changes have been made
      if ((me.settings.toBeAdded > 0 || me.settings.toBeRemoved > 0) && me.settings.linkClicked === false) {
        e = e || window.event;
        var message = me.settings.unsavedUpdatesText;
        if (e) {
          e.returnValue = message;
        }
        return message;
      } else {
        return;
      }
    };
    $('a.view-more').click(function(e) {
      me.addPremisesRows($('#acc-manage-segments'), 'viewAll');
      e.preventDefault();
    });
    // search and filter
    //var searchTimeout;
    //$('#premises-type').change(accountAdmin.filterSearch);
    $('#view-by').change(function() {
      me.changeTab($(this).val());
    });
    // $('#fuel-type').change(accountAdmin.filterSearch);
    // $('#text-premises-filter').keyup(function(e) {
    //  e.preventDefault();
    //  if (searchTimeout != undefined) clearTimeout(searchTimeout);
    //  searchTimeout = setTimeout(accountAdmin.filterSearch, 500);
    // });
    // $('#text-premises-filter').keydown(function(e) {
    //  if (e.keyCode === 13) {
    //    e.preventDefault();
    //  }
    // });
    /*
     * When the DOM is ready get the accounts and populate under groups
     */
    $(document).ready(function() {
      me.addAccountsGroupAccounts();
    });
  };
  /*
   * Switch between premises view and gropus & accounts view
   */
  SegmentAdmin.prototype.changeTab = function(target) {
    if (target === "groups-and-accounts") {
      this.selectors.groupAccountsView.show();
      this.selectors.premisesView.hide();
    } else {
      this.selectors.groupAccountsView.hide();
      this.selectors.premisesView.show();
      if(this.premisesCache.getNumRowsCurrentlyDisplayed('viewAll') == 0) {
        this.getAllPremises('viewAll');
      }
    }
  };

  /*
   * logging function
   */
  SegmentAdmin.prototype.log = function() {
    var args;
    if (window.console && window.console.log && window.console.log.apply && this.settings.devMode) {
      args = Array.prototype.slice.call(arguments);
      window.console.log.apply(window.console, args);
    }
  };
  /*
   * Set the URL of the web service based on devMode
   */
  SegmentAdmin.prototype.setSegmentsURL = function() {
    if (this.settings.devMode) {
      this.settings.segmentsWsUrl = this.settings.segmentsWsUrlLocal;
    } else {
      this.settings.segmentsWsUrl = this.settings.segmentsWsUrlRemote;
    }
    this.log('Web service URL: ', this.settings.segmentsWsUrl);
  };
  /*
   * Get all the premises and cache them
   * If there is an API error show the relevant error state
   * If there are no results show the releveant messaging
   */
  SegmentAdmin.prototype.getAllPremises = function(accountId) {

    var me = this,
      requestData = this.buildRequestObject(accountId);

    this.getPremises(requestData, function(premisesList) {
      switch (premisesList) {
        case me.settings.apiFailText:
          me.showFailureState(me.settings.apiFailText);
          break;
        case me.settings.apiErrorText:
          me.showFailureState(me.settings.apiErrorText);
          break;
        default:
          // cache the premises
          me.premisesCache.setPremisesCache(accountId, premisesList);

          // append the jquery objects
          me.addPremisesRows($('#acc-manage-segments'), accountId);
      }
      // remove the loading anim
    });
  };
  /*
   * Append the premises rows to the DOM
   */
  SegmentAdmin.prototype.addPremisesRows = function($selector, accountId) {
    // get the premises
    var premisesJson = this.premisesCache.getPremisesCache(accountId),
      // convert json to array of jquery objects
      premisesArray = this.premisesTemplate(premisesJson),
      startIndex = this.premisesCache.getNumRowsCurrentlyDisplayed(accountId),
      endIndex = startIndex + this.settings.numRowDisplay;

    this.log(startIndex, endIndex, premisesArray.length);

    for(var i = startIndex; i<endIndex; i++) {
      $selector.append(premisesArray[i]);
    }
    // update num rows displayed for this account
    this.premisesCache.setNumRowsCurrentlyDisplayed(accountId, endIndex);

    if(endIndex >= premisesArray.length) {
      $('a.view-more').hide();
    }
  };
  /*
   * If an API call fails hide the accordians and show an error message
   */
  SegmentAdmin.prototype.showFailureState = function(message) {
    this.log(message);
    this.selectors.groupsAndAccountView.find('div').hide();
    this.selectors.allPremisesView.find('div').hide();
    this.selectors.apiErrorState.find('p').text(message);
    this.selectors.apiErrorState.show();
  };
  /*
   * Reset the error message display everytime we make a new call to the API
   */
  SegmentAdmin.prototype.resetFailureState = function() {
    this.selectors.groupsAndAccountView.find('div').show();
    this.selectors.allPremisesView.find('div').show();
    this.selectors.apiErrorState.hide();
  };

  /*
   * Build up a request object based on user selections
   */
  SegmentAdmin.prototype.buildRequestObject = function(accountId) {

    var type = $('#premises-type').val() === "all" ? null : $('#premises-type').val();
    var fuel = $('#fuel-type').val() === "all" ? null : $('#fuel-type').val();
    var search = $('#text-premises-filter').val();
    var requestData = {
      "return_type": "premises"
        // "resultset_start": startIndex,
        // "resultset_end": endIndex,
    };
    if (accountId != "viewall" && accountId != "viewAll") {
      requestData.account_id = accountId;
    }
    if (type) {
      requestData.meter_type = type
    }
    if (fuel) {
      requestData.fuel_type = fuel
    }
    if (search) {
      requestData.search_text = search
    }
    return requestData;
  }

  /*
   * Call the API with request data and get the premises
   */
  SegmentAdmin.prototype.getPremises = function(requestData, cb) {

    this.resetFailureState();

    var me = this;

    $.ajax({
      url: me.settings.segmentsWsUrl,
      type: 'GET',
      dataType: 'json',
      data: requestData
    }).done(function(data) {
      if (data.status === "ok") {
        cb(data.premises);
      }
      if (data.status === "fail") {
        cb(me.settings.apiFailText);
      }
      if (data.status === "error") {
        cb(me.settings.apiErrorText);
      }
    }).fail(function() {
      cb(me.settings.apiErrorText);
    });
  };


  /*
   * Create jquery object for the raw json we get back from the API
   */
  SegmentAdmin.prototype.premisesTemplate = function(newPremisesData) {
    var premisesArray = [];
    //newPremisesData = newPremisesData[0];
    if (typeof newPremisesData == 'undefined') {
      return;
    }
    for (var j = 0; j < newPremisesData.length; j++) {
      // This populates the newPremisesData into html provided, premises
      var premises = $('<tr class="pa-dt-mprn-level" data-premises-id="">' + '<td class="meter-type"></td>' + '<td class="meter-number"></td>' + '<td class="address"></td>' + '<td class="interval"></td>' + '<td class="premises-admin align-right">' + '<a href="#" class="btn btn-medium add-to-segment">Add to segment</a>' + '<a href="#" class="btn btn-medium btn-danger remove-from-segment">Remove from segment</a>' + '</td>' + '</tr>');
      /*  couple of cases that can exist for premises
          1. Premises has 1 type of fuel - utility array length 1
          2. Premises has 2 types of fuel - utility array length 2
          Address will be common for both other details are combined.
      */
      var utils = newPremisesData[j].utilities.length;
      var meterType = [];
      var meterNumber = [];
      var interval = [];
      var $premInput = $("input#" + newPremisesData[j].premises_id);
      for (var i = 0; i < utils; i++) {
        meterType.push(newPremisesData[j].utilities[i].type);
        meterNumber.push(newPremisesData[j].utilities[i].extSdpCode);
        interval.push(newPremisesData[j].utilities[i].interval);
      }
      // populate the data
      $(premises).attr("data-premises-id", newPremisesData[j].premises_id);
      $(premises).find('.meter-type').html(meterType.join('<br/>'));
      $(premises).find('.meter-number').html(meterNumber.join('<br/>'));
      $(premises).find('.address').html(newPremisesData[j].address);
      $(premises).find('.interval').html(interval.join('<br/>'));

      var premisesStatus = this.getPremisesStatus($premInput);

      if (premisesStatus === 'existing-included') {
        $(premises).find('a.add-to-segment').addClass('hide');
      } else if (premisesStatus === 'existing') {
        var $removal = $('.existing-segment-accounts tr[data-premises-id="' + newPremisesData[j].premises_id + '"]').next('tr.account-removed').clone();
        $(premises).hide().find('a.add-to-segment').addClass('hide');

        premises = $(premises).after($removal);
      } else if (premisesStatus === 'newly-added') {
        $(premises).addClass('account-added');
        $(premises).find('a.add-to-segment.btn').addClass('hide');
        $(premises).find('a.remove-from-segment.btn').addClass('hide');
        $(premises).find('td:last-child').each(function() {
          if ($(this).children('p.added').length == 0) {
            $(this).prepend(accountAdmin.variables.undoSegHtml);
          }
        });
      } else {
        $(premises).find('a.remove-from-segment').addClass('hide');
      }

      premisesArray.push(premises);
    }
    return premisesArray;
  };
  /*
   * Figure out what state specific css classes we should add to the row
   */
  SegmentAdmin.prototype.getPremisesStatus = function($premInput) {
    if ($premInput.hasClass('existing') && $premInput.attr('data-included') == "true") {
      return 'existing-included';
    } else if ($premInput.hasClass('existing')) {
      return 'existing';
    } else if ($premInput.length && !$premInput.hasClass('existing')) {
      'newly-added'
    } else {
      return 'not on acc';
    }
  };

  /*
   * Build up a request object for getting CustomAccountGroup accounts
   */
  SegmentAdmin.prototype.buildAccountRequestObject = function(groupId) {
    var AccountRequestData = {
      "return_type": "accounts"
    };
    if (groupId) {
      AccountRequestData.group_id = groupId;
    }
    return AccountRequestData;
  };

  /*
   * Call the API with request data and get the accounts
   */
  SegmentAdmin.prototype.getAccounts = function(AccountRequestData, cb) {

    this.resetFailureState();

    var me = this;

    $.ajax({
      url: me.settings.segmentsWsUrl,
      type: 'GET',
      dataType: 'json',
      data: AccountRequestData
    }).done(function(data) {
      if (data.status === "ok") {
        cb(data.accounts);
      }
      if (data.status === "fail") {
        cb(me.settings.apiFailText);
      }
      if (data.status === "error") {
        cb(me.settings.apiErrorText);
      }
    }).fail(function() {
      cb(me.settings.apiErrorText);
    });
  };

  /*
   * Create jquery object for the raw json we get back from the API for accounts
   */
  SegmentAdmin.prototype.accountsTemplate = function(accountData, groupId) {
    var $account = $('<div class="pa-mprn-summary-container pa-row-closed hide" data-owner="' + groupId + '" data-account-level="account"><table><colgroup><col class="col-8"><col class="col-4"></colgroup><tbody><tr class="pa-dt-group-account-level"><td class="pa-dt-account-details"><a class="pa-dt-toggle ajax" href="#">Toggle</a><h4 class="account-name"></h4><p class="account-meta"><span class="elec-count">0</span> electric, <span class="gas-count">0</span> Gas - Account <span class="account-id"></p></td><td class="pa-admin-action-col last"><a class="btn btn-medium add-all-matches" href="#">Add all matches to segment</a></td></tr></tbody></table></div>');
    var divId = groupId + '-' + accountData.account_id;
    // populate the data
    $account.attr('id', divId).attr('account-id', accountData.account_id).attr('data-owner', groupId);
    $account.find('.account-name').html(accountData.account_name);
    $account.find('.account-meta .elec-count').text(accountData.electricity_premises);
    $account.find('.account-meta .gas-count').text(accountData.gas_premises);
    $account.find('.account-meta .account-id').text(accountData.account_id);

    return $account;
  };

  /*
   * Append the accounts rows to the DOM
   */
  SegmentAdmin.prototype.addAccountsRows = function($selector, groupId) {
    // get the accounts
    var accountsJson = this.accountsCache.getAccountsCache(groupId),
      // convert json to array of jquery objects
      accountsArray = this.accountsTemplate(accountsJson, groupId),
      startIndex = 0,
      endIndex = accountsArray.length;

    this.log(startIndex, endIndex);

    for(var i = startIndex; i<endIndex; i++) {
      $selector.append(accountsArray[i]);
    }
  };

  /*
   * Setup the initial account groups with their accounts
   */
  SegmentAdmin.prototype.addAccountsGroupAccounts = function() {
    var me = this;
    me.selectors.groupAccountsDivs.each(function() {
      // get the accounts for any Custom Account Groups on the page
      var groupId = $(this).attr('id'),
        requsetData = me.buildAccountRequestObject(groupId);

        //TODO
    });
  };


  /*
   * The changed premises cache
   */
  var ChangedPremisesCache = function() {
    this.addedPremises = [];
    this.removedPremises = [];
  };
  ChangedPremisesCache.prototype.addAddedPremises = function(id) {
    var index = this.addedPremises.indexOf(id);
    if (index == -1) {
      this.addedPremises.push(id);
    }
  };
  ChangedPremisesCache.prototype.removeAddedPremises = function(id) {
    var index = this.addedPremises.indexOf(id);
    if (index > -1) {
        this.addedPremises.splice(index, 1);
    }
  };
  ChangedPremisesCache.prototype.addRemovedPremises = function(id) {
    var index = this.removedPremises.indexOf(id);
    if (index == -1) {
      this.removedPremises.push(id);
    }
  };
  ChangedPremisesCache.prototype.removeRemovedPremises = function(id) {
    var index = this.removedPremises.indexOf(id);
    if (index > -1) {
        this.removedPremises.splice(index, 1);
    }
  };
  ChangedPremisesCache.prototype.getAddedPremises = function() {
    return this.addedPremises;
  };
  ChangedPremisesCache.prototype.getRemovedPremises = function() {
    return this.removedPremises;
  };
  /*
   * The premises cache
   * functions for getting/setting premises
   */
  var PremisesCache = function() {
    this.cachedPremises = {};
    this.numRowsCurrentlyDisplayed = {
      viewAll: 0
    };
  };
  /*
   * Set premises cache - based on accountId
   * accountId can be "viewAll" or a specific segment ID (12345)
   */
  PremisesCache.prototype.setPremisesCache = function(accountId, premises) {
    this.cachedPremises[accountId] = premises;
    //this.setNumRowsCurrentlyDisplayed(accountId, 0);
  };
  /*
   * Get premises cache - based on accountId
   * accountId can be "viewAll" or a specific segment ID (12345)
   */
  PremisesCache.prototype.getPremisesCache = function(accountId) {
    return this.cachedPremises[accountId];
  };
  /*
   * Get the number of table rows we are currently displaying - based on accountId
   * accountId can be "viewAll" or a specific segment ID (12345)
   */
  PremisesCache.prototype.getNumRowsCurrentlyDisplayed = function(accountId) {
    return this.numRowsCurrentlyDisplayed[accountId];
  };
  /*
   * Set the number of table rows we are currently displaying - based on accountId
   * accountId can be "viewAll" or a specific segment ID (12345)
   */
  PremisesCache.prototype.setNumRowsCurrentlyDisplayed = function(accountId, num) {
    return this.numRowsCurrentlyDisplayed[accountId] = num;
  };

  /*
   * The accounts cache
   * functions for getting/setting accounts
   */
  var AccountsCache = function() {
    this.cachedAccounts = {};
  };
  /*
   * Set accounts cache - based on groupId
   * groupId will be selector ID taken from DOM for the group (12345)
   */
  AccountsCache.prototype.setAccountsCache = function(groupId, accounts) {
    this.cachedAccounts[groupId] = accounts;
  };
  /*
   * Get accounts cache - based on groupId
   * groupId will be selector ID taken from DOM for the group (12345)
   */
  AccountsCache.prototype.getAccountsCache = function(groupId) {
    return this.cachedAccounts[groupId];
  };

  // SegmentAdmin.prototype.navigateAwayCheck = function() {
  //  // this is used if the user clicks a link
  //  this.settings.linkClicked = true;
  //  // let's figure out if any changes have been made
  //  this.settings.toBeRemoved = $('input.existing[data-included=false]').length;
  //  this.settings.toBeAdded = $('input[data-included=true]').not('.existing').length;
  //  if (this.settings.toBeAdded > 0 || this.settings.toBeRemoved > 0) {
  //    var url = $(this).attr('href');
  //    $(this).colorbox({
  //      inline: true,
  //      transition: 'none',
  //      href: function() {
  //        return '#navigate-away-modal';
  //      },
  //      width: function() {
  //        var widthOption = $(this).attr('data-modal-width');
  //        return widthOption ? widthOption + 'px' : '890px';
  //      },
  //      initialWidth: function() {
  //        var widthOption = $(this).attr('data-modal-width');
  //        return widthOption ? widthOption + 'px' : '890px';
  //      },
  //      scrolling: false,
  //      onComplete: function() {
  //        $.colorbox.resize();
  //      }
  //    });
  //    $('a.exit').click(function() {
  //      window.location.href = url;
  //    })
  //    $('a.close').click(function() {
  //      $.colorbox.close();
  //    })
  //  } else {
  //    $.colorbox.remove();
  //  }
  // };
  /*
   * initialise when ready
   */
  $(function() {
    var v = new SegmentAdmin();
  });
})(this, this.document, $);
