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
