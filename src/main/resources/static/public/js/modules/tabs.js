/*!
 *  Author: Each & Other [www.eachandother.com]
 */

/* JSHint: */
/* globals $: false */

 /*
 * Tabbed content (utilises jQuery datatools)
 *
 * 1. Add ul.tabs list to contain the tabs and links
 * 2. Add div.panes to contain the different tab panes of content
 * 3. Inside div.panes separate each tab into it's own child div. The order is important
 *
 * EG
 *	<ul class='tabs'>
 *		<li><a href='javascript:void(0);'>Tab 1 Link</a></li>
 *		<li><a href='javascript:void(0);'>Tab 1 Link</a></li>
 *	</ul>
 *	<div class='panes'>
 *		<div>Tab 1 content</div>
 *		<div>Tab 2 content</div>
 *	</div>
 *
 * ------------------------------------------------------------------------- */

(function(window, document, $, undefined) {
  'use strict';

  $(document).ready(function() {
  	if ($('.main .container ul.tabs').length > 0) {
  		$('.main .container ul.tabs').tabs('div.panes > div');
  	}
  });

})(this, this.document, $);
