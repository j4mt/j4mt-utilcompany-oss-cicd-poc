/*!
 *  Author: Each & Other [www.eachandother.com]
 */

 /*
 * Region Menu
 * ------------------------------------------------------------------------- */

(function(window, document, $, undefined) {
    'use strict';

    $(document).ready(function() {
        if ($('.change-user-region').length > 0) {
            $('.change-user-region a.region-current').click(function(e){
                e.preventDefault();
                $(this).parents('.change-user-region').toggleClass('is-active');
            });
        }
    });

})(this, this.document, $);
