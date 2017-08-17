

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
