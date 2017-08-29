

(function(window, document, $, undefined) {
  'use strict';


  function toggleGuide(panel, element, status) {
    var statusStr = (status.length > 0) ? status : '';
    $(panel + ' .strength-guide ' + element).removeClass('valid error').addClass(statusStr);
  }

  function isAnyUppercase(value) {//Moved this up here because it fails Strict mode validness and breaks IE10 if it's nested in a block (it was inside an IF)
    var i, len;
    var regex = new RegExp('[A-Z]');

    for (i=0, len=value.length; i<len; i++){
      if (regex.test(value[i])) {
        return true;
      }
    }
    return false;
  }

  $(document).ready(function() {

    if($('.mod-auth-reset').length > 0) {

      // Password Reset: Show/Hide the Password Tips panel
      $('#forgotUsernamePasswordForm #password').focusin(function(){
        $('.msg.password-tips').addClass('new-password');
        if($(window).capslockstate('state') == true) {
          $(".caps-lock").show().parents('.password-tips').addClass('is-active');
        }
      });
        $('#forgotUsernamePasswordForm #password').focusout(function(){
          $('.msg.password-tips').removeClass('new-password confirm-password is-active');
        });
        $('#forgotUsernamePasswordForm #confirmPassword').focusin(function(){
          $('.msg.password-tips').addClass('confirm-password');
          if($(window).capslockstate('state') == true) {
            $(".caps-lock").show().parents('.password-tips').addClass('is-active');
          }
        });
        $('#forgotUsernamePasswordForm #confirmPassword').focusout(function(){
          $('.msg.password-tips').removeClass('new-password confirm-password is-active');
        });


      // Registration Page: Show/Hide the Username/Password Tips panel
      $('#usernamePasswordForm #username').focusin(function(){
        $('.msg.username-tips').addClass('is-active');
      });
        $('#usernamePasswordForm #username').focusout(function(){
          $('.msg.username-tips').removeClass('new-password confirm-password is-active');
        });
        $('#usernamePasswordForm #password').focusin(function(){
          $('.msg.password-tips').addClass('new-password');
          if($(window).capslockstate('state') == true) {
            $(".caps-lock").show().parents('.password-tips').addClass('is-active');
          }
        });
        $('#usernamePasswordForm #password').focusout(function(){
          $('.msg.password-tips').removeClass('new-password confirm-password is-active');
        });
        $('#usernamePasswordForm #confirmPassword').focusin(function(){
          $('.msg.password-tips').addClass('confirm-password');
          if($(window).capslockstate('state') == true) {
            $(".caps-lock").show().parents('.password-tips').addClass('is-active');
          }
        });
        $('#usernamePasswordForm #confirmPassword').focusout(function(){
          $('.msg.password-tips').removeClass('new-password confirm-password is-active');
        });


      // Registration: prepopulate
      if($('#emailAsUsername').length){
        var emailUsername = $('#emailAsUsername').val();

        if(emailUsername.length > 0) {
          $('#username').val(emailUsername);
          $('#username').parents('.form-field').addClass('-has-related-input');
          $('#use_email').prop("checked", true);

          $('#username').keyup(function(){
            var username = $(this).val();
            if(username === emailUsername){
              $('#use_email').prop("checked", true);
            } else {
              $('#use_email').prop("checked", false);
            }
          });

          $('#use_email').click(function(){
            if($(this).prop('checked') == true){
              $('#username').val($('#emailAsUsername').val());
            } else {
              $('#username').val('');
              $('#username').parents('.form-field').removeClass('valid error');
            }
          });
        } else {
          $('#username').parents('.form-field').removeClass('-has-related-input');
          $('#use_email').parents('.form-field').addClass('-is-hidden');
        }
      }


      // Username guide rules
      var guideStatus;
      $('#username').keyup(function() {
        var username = $('#username').val();
        var password = $('#password').val();

        guideStatus = ((username.length >= 6 && username.length <= 60)) ? 'valid' : 'error';
        toggleGuide('.username-tips', '.length', guideStatus);

        guideStatus = (username.match(/\s/g)) ? 'error' : 'valid';
        toggleGuide('.username-tips', '.space', guideStatus);

        guideStatus = (username == password) ? 'error' : 'valid';
        toggleGuide('.username-tips', '.same', guideStatus);
      });


      // Password strength guide rules
      $('#password').keyup(function() {
        var passwordStrength = 0;
        var password = $('#password').val();

        if (password.length < 8) passwordStrength=0;
        if (password.length >= 8 && password.length <= 32) {
          passwordStrength++;
          toggleGuide('.password-tips', '.length', 'valid');
        } else {
          toggleGuide('.password-tips', '.length', 'error');
        }

        if (password.match(/[A-Z]/)) passwordStrength++;

        if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/)) ) {
          passwordStrength++;
          toggleGuide('.password-tips', '.case', 'valid');
        } else {
          toggleGuide('.password-tips', '.case', 'error');
        }
        if (password.match(/[0-9]/)) {
          passwordStrength++;
          toggleGuide('.password-tips', '.number', 'valid');
        } else {
          toggleGuide('.password-tips', '.number', 'error');
        }

        if (password.match(/\s/g)) {
          passwordStrength=0;
          toggleGuide('.password-tips', '.space', 'error');
        } else {
          toggleGuide('.password-tips', '.space', 'valid');
        }


        if(
          $('.password-tips .strength-guide .length').hasClass('valid') &&
          $('.password-tips .strength-guide .case').hasClass('valid') &&
          $('.password-tips .strength-guide .number').hasClass('valid') &&
          $('.password-tips .strength-guide .space').hasClass('valid')
        ){
          if (password.length > 12) passwordStrength++;
          if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) passwordStrength++;
        }


        $('#pwdMeter').removeClass();
        $('#pwdMeter').addClass('neutral');

        switch(passwordStrength){
          case 1:
            $('#pwdMeter').addClass('veryweak');
            break;
          case 2:
            $('#pwdMeter').addClass('weak');
            break;
          case 3:
            $('#pwdMeter').addClass('medium');
            break;
          case 4:
            $('#pwdMeter').addClass('strong');
            break;
          case 5:
            $('#pwdMeter').addClass('verystrong');
            break;
          case 6:
            $('#pwdMeter').addClass('verystrong');
            break;
          default:
            $('#pwdMeter').addClass('neutral');
        }
      });


      // Msg tips vertical position
      if( $('.msg.-tip').length && ! $('.msg.-tip').hasClass('-floating-panel')){
        $('.form-inputs input').bind("focusin", function(e) {
          var fieldPos = $(this).position();
          $('.msg.-tip').css('top',fieldPos.top);
        });
      }


      // CAPS LOCK NOTICE - visibility
      if($('.case-sensitive-input').length > 0) {
        $(window).capslockstate();

        $(window).bind("capsOn", function(e) {
          var $focused = $(':focus');
          if($focused.hasClass('case-sensitive-input')){
            $(".caps-lock").show().parents('.msg.-tip.is-active').addClass('is-active');
            $(".caps-lock").show().parents('.msg.-tip.confirm-password').addClass('is-active');
          }
        });
        $(window).bind("capsOff", function(e) {
          var $focused = $(':focus');
          if($focused.hasClass('case-sensitive-input')){
            $(".caps-lock").hide().parents('.msg.-tip.is-active').removeClass('is-active');
          }
        });
        $(window).bind("capsUnknown", function(e) {
          var $focused = $(':focus');
          if($focused.hasClass('case-sensitive-input')){
            $(".caps-lock").hide().parents('.msg.-tip.is-active').removeClass('is-active');
          }
        });

        $('.case-sensitive-input').bind("focusout", function(e) {
          $(".caps-lock").hide();
        });
      }
      // Suppress IE11 Caps Lock Notice
      document.msCapsLockWarningOff = true;

      // CASE SENSITIVE NOTICE - visibility
      if($('.case-sensitive-notice').length > 0) {
        $('.case-sensitive-notice').on("focusin change keyup paste mouseup", function(e) {
          if(isAnyUppercase( $(this).val() )) {
            $(".case-notice").show();
          } else {
            $(".case-notice").hide();
          }
        });
      }
    }
 });


})(window, document, jQuery);
