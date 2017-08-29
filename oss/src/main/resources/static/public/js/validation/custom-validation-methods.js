
/*!
 *  Author: Each & Other [www.eachandother.com]
 *
 *  Validation methods for the Login, Username/Password reset sections.
 */

/* JSHint: */
/* globals jQuery: false */

;(function(window, document, $, undefined) {
  'use strict';

    /**
     * matchThisField
     *
     * Simple validation method to check if the value in here matches the
     * value in the element that you're sent a selector through for.
     *
     * E.g // matchThisField: '#newPasswordConfirm'
     *
     * @param  {[type]} val                    Value of element being tested
     * @param  {[type]} el                     The element being tested
     * @param  {[type]} selector)              Selector of another form element to check against
     * @return {[type]}
     */
    $.validator.addMethod('matchThisField', function(value, el, selector) {
      return $(selector).length ? value === $(selector).val() : true;
    }, $.validator.format(''));


    /**
     * Inert placeholder function to facilitate configurable form
     * testing on onKeyUp event
     */
    $.validator.addMethod('onKeyUpCheck', function(value, element, selector) {
      return true;
    }, $.validator.format(''));


    /**
     * notEqualTo
     */
    $.validator.addMethod('notEqualTo', function(value, element, selector) {
      if($(selector).length){
        if(value === $(selector).val()){
          return false;
        }
      }
      return true;
    }, $.validator.format(''));


    $.validator.addMethod("containsAtLeastOneDigit", function (value) {
      return /[0-9]/.test(value);
    }, "Must have at least one number");


    $.validator.addMethod("containsBothUpperLower", function (value) {
      return /([A-Z].*[a-z]|[a-z].*[A-Z])/.test(value);
    }, "Must contain both upper & lower case letters");


    $.validator.addMethod("containsNoSpaces", function (value) {
      return value.indexOf(" ") < 0 && value != "";
    }, "No space please and don't leave it empty");


    /**
     * validPhoneNumber: accepts numbers + -
     */
    $.validator.addMethod("validPhoneNumber", function(value, element) {
      var i, len;
      // var regex = new RegExp(/[0-9+-\s]/);
      var regex = new RegExp(/[0-9+-]/);

      for (i=0, len=value.length; i<len; i++){
        if (regex.test(value[i]) == false) {
          return false;
        }
      }
      return true;
    }, "Please enter a valid phone number");


    $.validator.addMethod("containsOnlyWhiteListCharacters", function(value, element) {
      return (/^[a-zA-Z0-9@_.,/-]*$/gi).test(value);
    }, "Only these special characters are allowed: @ . , - _ /");


    //DSV-555 - Whitelist doesn't have accented characters, but they should be
    //   allowed to reach the back end, where they then get converted to their
    //   equivalent non-accented brethren. You don't need to loop through each
    //   character with Regex, it's very dynamic and powerful.
    //   ^ = start of string
    //   $ = end of string
    //   [###] = match everything in here
    //   * = string of any length (length gets checked by other validation method)
    //   g = global
    //   i = case insensitive
    //
    //   ...This isn't in use. Refer to Jira. Leaving it in in case it's ever
    //   needed as it matches the full set of characters that can be successfully
    //   submitted to the back end.
    $.validator.addMethod("containsOnlyWhiteListCharactersAndAccents", function(value, element) {
      return (/^[A-Z0-9áéíóúÁÉÍÓÚÕÄÖÜõäöü@_.,/-]*$/gi).test(value);
    }, "Only these special characters are allowed: @ . , - _ /");






    // $.validator.addMethod("containsAtLeast", function (value) {
    //   return /^[a-z]+[0-9]/i.test(value);
    // }, function(params, element) {
    //   console.log(params);
    //   console.log(element);
    //   return 'The field cannot be less than than ' + $(element).data('min') + ' length.'
    // });


    /**
     * Format validation
     *
     * This currently uses the same regex that V1 use in the back end for Postcode,
     * but if Ireland is selected as a country then it will just pass through.
     * It should be easy to update this to validate Eircode when the time comes,
     * but for the moment the priority is to get Postcode over the line.
     */
    $.validator.addMethod('postcodeFormat', function(value, element, param) {

      var country = $(element).closest('.form-details').find('#country').val();

      //Eircode validation may need to be revised. Took spec from:
      //https://www.eircode.ie/docs/default-source/Common/prepareyourbusinessforeircode-edition3published.pdf?sfvrsn=2
      if (country.toLowerCase() === 'republic_of_ireland') {
          return (/^([A,C,D,E,F,H,K,N,P,R,T,V,W,X,Y]{1}[0-9]{1}[0-9,W]{1}[\ \-]?[0-9,A,C,D,E,F,H,K,N,P,R,T,V,W,X,Y]{4})$/gi).test(value);
      //Postcode validation as per V1 back end Java
      } else {
          return (/(GIR 0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))|[0-9][A-HJKS-UW])( )?[0-9][ABD-HJLNP-UW-Z]{2})/gi).test(value);
      }

      return false;

    }, $.validator.format(''));


    /**
     * Only validate checkbox if a name is entered
     */
    $.validator.addMethod('requiredIfNameNotEmpty', function (value, element) {

      var $nameInput = $(element).closest('.additional-contact-form').find('[id^=contactFirstName][type=text]');
      var needsCheckbox = $nameInput.val().length;
      var isChecked = $(element).prop('checked');

      // If it needs checkbox, then return check status, else just return true and let it pass.
      return needsCheckbox ? isChecked : true;

    }, $.validator.format(''));


    /**
     * Ask for mobile number if no work or home number entered
     */
    $.validator.addMethod('requiredIfNoOtherPhoneNumbers', function (value, element) {

      var $form = $(element).closest('.form-details');
      var numLength = 0;

      var mobileLength = $form.find('#mobileNumber').val().length;
      if(! mobileLength){
        numLength += $form.find('#workPhoneNumber').val().length;
        numLength += $form.find('#homePhoneNumber').val().length;

        return numLength !== 0;
      }

      return true;

    }, $.validator.format(''));

    /**
     * Ask for mobile number if no work or home number entered
     */
    $.validator.addMethod('requiredIfSMSAlertChecked', function (value, element) {

      var $form = $(element).closest('.form-details');
      var numLength = 0;

      if ($form.find('#meterSMSYes').is(":checked")) {
        return $form.find('#mobileNumber').val().length > 0 ? true : false;
      }

      return true;

    }, $.validator.format(''));



    /**
     * Valid if only one of the passed-in inputs has a value.
     */
    $.validator.addMethod('onlyOneHasValue', function (v, e, params) {
      var count = 0;
      for (var i = 0; i < params.length; i++) {
        if (params[i].val().length){
          count++;
        }
      }
      return count === 1;
    }, $.validator.format(''));


})(this.window, this.document, jQuery);
