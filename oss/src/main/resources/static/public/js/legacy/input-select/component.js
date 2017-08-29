/**
 *  SSE Airtricity OSS - 2016
 *  Author: Each&Other
 *  Component: Select Input
 *  /js/vendor/selectFx.js
 */
;
(function(window, document, $, undefined) {
    'use strict';

    var Component = window.Component || function() {};

    var inputSelect = Component.inputSelect = function( el ) {
      this.$el = $(el);
      this.init(el);
    };

    inputSelect.prototype.init = function(el) {
      var $selectEl = $(el).find('select');

      var customSelect = new SelectFx($selectEl[0], {
          onChange: function(val) {
              // trigger change event on the underlying select
              // so validation will work on change
              $selectEl.trigger('change');
          }
      });
      $selectEl.on('data-refresh', function() {
          customSelect._refresh();
      });

      //attachKeyboardEvents(customSelect, $(this));
    };

    /*
    // Get the options associated with this select
    // and stick them into an array
    */
    inputSelect.prototype.getOptionsArray = function(customSelect) {
        var options = customSelect.el.options;
        var optionsArray = [];

        for (var i = 0; i < options.length; i++) {
            var opt = options[i];
            // if the current option is default selected and disabled
            // we assume it's the placeholder and don't add to the array
            if (!(opt.defaultSelected && opt.disabled)) {
                var obj = {
                    key: opt.textContent,
                    value: opt
                };
                optionsArray.push(obj);
            }
        }
        return optionsArray;
    };

    /*
    // Attach an event listener to the keydown event
    // and change the select option based on keyboard input
    */
    inputSelect.prototype.attachKeyboardEvents = function(customSelect, $this) {

        var optionsArray = getOptionsArray(customSelect);

        // extra keyboard navigation events
        customSelect.selEl.addEventListener('keydown', function(ev) {
            var keyCode = ev.keyCode || ev.which;
            var selectedOptionIndex = -1;
            switch (keyCode) {
                // a
                case 65:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('a', optionsArray);
                    break;
                // b
                case 66:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('b', optionsArray);
                    break;
                // c
                case 67:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('c', optionsArray);
                    break;
                // d
                case 68:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('d', optionsArray);
                    break;
                // e
                case 69:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('e', optionsArray);
                    break;
                // f
                case 70:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('f', optionsArray);
                    break;
                // g
                case 71:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('g', optionsArray);
                    break;
                // h
                case 72:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('h', optionsArray);
                    break;
                // i
                case 73:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('i', optionsArray);
                    break;
                // j
                case 74:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('j', optionsArray);
                    break;
                // k
                case 75:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('k', optionsArray);
                    break;
                // l
                case 76:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('l', optionsArray);
                    break;
                // m
                case 77:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('m', optionsArray);
                    break;
                // n
                case 78:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('n', optionsArray);
                    break;
                // o
                case 79:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('o', optionsArray);
                    break;
                // p
                case 80:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('p', optionsArray);
                    break;
                // q
                case 81:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('q', optionsArray);
                    break;
                // r
                case 82:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('r', optionsArray);
                    break;
                // s
                case 83:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('s', optionsArray);
                    break;
                // t
                case 84:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('t', optionsArray);
                    break;
                // u
                case 85:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('u', optionsArray);
                    break;
                // v
                case 86:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('v', optionsArray);
                    break;
                // w
                case 87:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('w', optionsArray);
                    break;
                // x
                case 88:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('x', optionsArray);
                    break;
                // y
                case 89:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('y', optionsArray);
                    break;
                // z
                case 90:
                    ev.preventDefault();
                    selectedOptionIndex = getFirstOptionByCharacter('z', optionsArray);
                    break;
            }

            if(selectedOptionIndex > -1) {
                customSelect._removeFocus();
                customSelect.preSelCurrent = selectedOptionIndex

                classie.add(customSelect.selOpts[customSelect.preSelCurrent], 'cs-focus' );

                var $target = $this.find('.cs-options ul li:nth-child('+ parseInt(customSelect.preSelCurrent + 1) +')');
                var targetTop = $target.position().top;
                console.log(targetTop);
                if(targetTop !== 50) {
                    $this.find('.cs-options').animate({
                        scrollTop: targetTop - 50
                    }, 'fast');
                }

            }

            return false;
        });
    };

    /*
    // Loop through the options array and get the first option
    // that's first  character matches the char param
    */
    inputSelect.prototype.getFirstOptionByCharacter = function(char, optionsArray) {
        var selectedOptionIndex = -1;
        for(var i = 0; i<optionsArray.length; i++) {
            var opt = optionsArray[i];
            if(opt.key.charAt(0).toLowerCase() === char) {
                selectedOptionIndex = i;
                break;
            }
        }
        return selectedOptionIndex;
    };

    window.Component = Component;

    $(document).ready(function() {
      var componentName = 'inputSelect';
      var el = $('[data-js-component=inputSelect]');

      var components = new window.Component();
      var modalOverlayComponent = new Component[componentName](el);
    })

})(this.window, this.document, jQuery);
