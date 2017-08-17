/*
/*!
 * jQuery Set Cursor To Text End
 * http://stackoverflow.com/questions/4609405/set-focus-after-last-character-in-text-box?noredirect=1&lq=1
 *
 * Date: Sun Nov 15 2016
 */

(function($){
    $.fn.setCursorToTextEnd = function() {
        var $initialVal = this.val();
        this.val($initialVal);
    };
})(jQuery);