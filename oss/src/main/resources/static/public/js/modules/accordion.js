/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/*
/* 
 * FAQ Accordion
 *
 * 1. Must use dl, dd, dt
 * 2. Add class="accordion" to the dl
 * 3. add accordion-trigger element to the a
 *
 * EG
 <dl class="accordion">
    <a href="#" accordion-trigger>
      <dt>
        Panel 1
      </dt>
    </a>
    <dd>
      <p>Content</p>
    </dd>
    <a href="#" accordion-trigger>
      <dt>
        Panel 2
      </dt>
    </a>
    <dd>
      <p>Content</p>
    </dd>
</dl>
 *
 * ------------------------------------------------------------------------- */



(function(window, document, $, undefined) {

  'use strict';

  if (!window.console) console = {
    log: function() {}
  };


  var Accordion = function() {
    this.$panels;
    this.$arrows;
    this.init();
  };

  Accordion.prototype.init = function() {
    this.$panels = $('.accordion dd').hide();
    $('.accordion dt').prepend($('<span class="icon plus"></span>'));
    $('.accordion dt').append($('<span class="arrow bottom"></span>'));
    this.events();
  };

  Accordion.prototype.events = function() {
    var me = this;
    $('.accordion a[accordion-trigger]').click(function() {
      var $active = $(this);

      me.$panels.stop().slideUp();
      $('.accordion dt span.arrow').removeClass('top').removeClass('bottom');
      $('.accordion dt span.icon').removeClass('plus').removeClass('minus');

      if($active.hasClass('active')) {
        $active.removeClass('active');
        $('.accordion dt span.arrow').addClass('bottom').removeClass('top');
        $('.accordion dt span.icon').addClass('plus').removeClass('minus');
      }
      else {
        $active.next().stop().slideDown();
        $('.accordion a').removeClass('active');
        $active.addClass('active');  
        $('.accordion dt span.arrow').addClass('bottom');
        $active.find('span.arrow').addClass('top').removeClass('bottom');

        $('.accordion dt span.icon').addClass('plus');
        $active.find('span.icon').addClass('minus').removeClass('plus');
      }
      return false;
    });
  }

  // initialise when ready
  $(function() {
    var a = new Accordion();
  });

})(this, this.document, $);