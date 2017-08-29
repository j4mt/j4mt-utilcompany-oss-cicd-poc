/*!
 * Author: Each & Other [www.eachandother.com] - Conor
 *
 * Additional contacts section on Account-Info page.
 *
 */
;(function(window, document, $, undefined) {
    'use strict';


    /**
     * isInFormSection
     *
     * Check if the button is in a form area or
     * in the details area. If it's in the latter
     * it just needs to show the form on click,
     * but if it's in a form it needs to clone
     * a new contact form section and add it to
     * the form.
     *
     * @param  {[type]}  $el The button that gets clicked
     * @return {Boolean}     True if it's in a form section
     */
    var isInFormSection = function( $el ) {
      return $el.closest('.form-details').length;
    };


    /**
     * clickChangeButton
     *
     * Traverse up the tree from the clicked link
     * and then find the change button for that
     * section and click it.
     *
     * @param  {[type]} $el The button that gets clicked
     * @return {[type]}     Not used for anything.
     */
    var clickChangeButton = function( $el ) {
      return $el.closest('.named-contacts').find('.change').first().click();
    };


    /**
     * clearValues
     *
     * Check if it's a  textbox or checkbox or hidden,
     * and then reset it to be clear or unchecked.
     *
     * @param  {[type]} $el input element
     * @return {[type]}     [description]
     */
    var clearValues = function( $el ) {

      if ($el[0].type === 'hidden' || $el[0].type === 'text') {
        $el.val('');
      }

      //Should be checked by default - wireframes
      if ($el[0].type === 'checkbox') {
        $el.attr('checked', true);
      }

      return $el[0].type;

    };


    /**
     * updateNamesAndIds
     *
     * We need to update the attributes of each element
     * so that they have a unique ID and name, and still
     * link to their labels via the for attribute.
     *
     * @param  {[type]} $el input element
     * @param  {[type]} idx index of the form
     * @return {[type]}     [description]
     */
    var updateNamesAndIds = function( $el, idx ) {

      var
      attrName = $el.attr('name'),
      attrId = $el.attr('id'),
      attrFor = $el.attr('for'),
      attrPlace = $el.attr('placeholder');

      //Only do this if it already has 'name' attribute.
      if (attrName) {
        attrName = attrName.substr(0, attrName.length - 1) + idx;
        $el.attr('name', attrName);
      }

      //Only do this if it already has 'id' attribute.
      if (attrId) {
        attrId = attrId.substring(0, attrId.length - 1) + idx;
        $el.attr('id', attrId);
      }

      //Only do this if it already has 'for' attribute.
      if (attrFor) {
        attrFor = attrFor.substring(0, attrFor.length - 1) + idx;
        $el.attr('for', attrFor);
      }

      //Only do this if it already has 'placeholder' attribute.
      if (attrPlace) {
        $el.attr('placeholder', '');
      }

    };


    /**
     * cloneNewContactForm
     *
     * @param  {[type]} $el [description]
     * @return {[type]}     [description]
     */
    var cloneNewContactForm = function ( $el ) {

      var
      $forms = $el.closest('.form-details').find('.additional-contact-form'),
      $formClone = $forms.first().clone(),
      idx = $forms.length;

      //For each input element, set values to empty or unchecked
      $formClone.find('input').each(function(){
        clearValues($(this));
      });

      //Add a class that we can use for transitioning it in
      $formClone.addClass('incoming');

      //Remove any error class
      $formClone.find('.-error').removeClass('-error');

      //Reset the checkbox label in case of error state
      $formClone.find('.chk-auth + label').html('I authorise this person to contact SSE Airtricity on my behalf.');

      //Check the checkbox
      $formClone.find('.chk-auth').prop('checked', true);

      //For each input element, give them attributes with indexes.
      $formClone.find('input, label').each(function(){
        updateNamesAndIds($(this), idx);
      });

      //Error labels are used by IE8 and 9. You don't want to clone them.
      $formClone.find('label.error').remove();

      //Stick the form into the page.
      $el.before( $formClone );

      setTimeout(function() {
        $formClone.removeClass('incoming');
      }, 10);

      //Add validation rules - Name is no longer forced because
      //it was stopping people submitting deleted contacts
      // $formClone.find('[name="contactFirstName' + idx + '"]').rules("add", {
      //   required: true,
      //   messages: {
      //     required: "Please enter a name for your additional contact.",
      //   }
      // });

      //Add validation rules
      $formClone.find('[name="contactChkAuth' + idx + '"]').rules("add", {
        requiredIfNameNotEmpty: true,
        messages: {
          requiredIfNameNotEmpty: "Please check the box to authorise this person to contact our customer service agents on your behalf.",
        }
      });

    };


    /**
     * initNewContactBtns
     *
     * Set up the listeners for the Additional Contact buttons
     *
     * @return {[type]} [description]
     */
    var initNewContactBtns = function() {

      var $btns = $('.add-new-contact');

      $btns.each(function() {
        $(this).on('click', function(e) {
          e.preventDefault();
          var $btn = $(this);

          //Button needs to behave differently depending on
          //where it exists.
          if (isInFormSection($btn))
            cloneNewContactForm($btn);
          else
            clickChangeButton($btn);


        });

      });

    };



    /**
     * markForDeletion
     *
     * We need to be able to mark additional contacts for deletion
     * so that it can be posted to the server and updated.
     * Providing a hidden field beside each contact and this will
     * let you set it to 'true' if this contact should be removed.
     */
    var initMarkForDeletion = function(){
      $('.contacts-list .delete-contact').on('click', function(e) {
        e.preventDefault();
        //Add a class to this contact and update hidden element to
        //show that it should be deleted.
        $(this).closest('.row')
          .addClass('delete-me')
            .find('input')
              .val('true');
      });
    };


    //////////////////////////////
    //////////////////////////////
    //////////////////////////////


    $(document).ready(function() {
      initNewContactBtns();
      initMarkForDeletion();
    });


})(this.window, this.document, jQuery);
