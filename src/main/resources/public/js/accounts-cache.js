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

