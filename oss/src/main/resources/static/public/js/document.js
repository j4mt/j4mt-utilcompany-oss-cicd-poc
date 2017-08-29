$(document).ready(function(){

	$('#navigation .btn.menu').click(function() {
		if ($(this).hasClass('active')) {
			$('#menu ul').fadeOut('400', function() {
				$('#menu').slideUp('400', function() {
					$('#navigation .btn.menu').removeClass('active').text('Menu');;
				});
			});
		} else {
			$('#menu').slideDown('400', function() {
				$('#menu ul').fadeIn('400', function() {
					$('#navigation .btn.menu').addClass('active').text('Close');
				});
			});
		}
	});

	$('#menu ul li.parent').hover(function(){
		 $(this).children('a').addClass('active');
		 $(this).children('div').show();
	},function(){
		$(this).children('a').removeClass('active');
		$(this).children('div').hide();
	});
	$('#menu ul li.parent').focus(function(){
		 $(this).children('a').addClass('active');
		 $(this).children('div').show();
	},function(){
		$(this).children('a').removeClass('active');
		$(this).children('div').hide();
	});

	$('.view a').click(function(){
		$('.tariffs').show();
	});

		//
		// Nick's code
		//
		optOut = false;
		$("#eBilling").submit(function(e) {
			if (optOut == false) { // if the form has been submitted from outside the opt out button, check our ebilling = no
				if ($('#eBillingNo').is(":checked")) {
			        //stop the form from submitting
			        e.preventDefault(); // this will prevent the default action of form submit
			        $.colorbox({
						href: "#confirm_cancel",
						inline: true,
						width : "556px"
					});
					$('#opt-out-anyway-button').click(function() {
						optOut = true;
						$.colorbox.close(); // close colorbox
						$('#eBilling').submit();
						return false;
					})
					$('#remain-signed-up-button').click(function() {
						$('#eBillingYes').attr('checked', true); // check the yes radio button
						$.colorbox.close(); // close colorbox
						$('#eBilling .form-details').slideUp();
						$('#eBilling .display-details').slideDown();
						$('#eBilling .cancel-change').hide();
						$('#eBilling .change').show();
						$('#eBilling .module').removeClass('open');


						return false;
					})
			    }

			}
			optOut = false;
		    return true; // this will submit the form is the radio button is not selected
		});



		if (typeof($.colorbox) != "undefined") {
			$(".delete-card").colorbox({
				inline: true,
				href: "#delete-card-notice",
				width : "470px",
				height : "270px"
			});
			$("#delete-card-notice .close-notice").click(function(){
				$.colorbox.close();
			});
		}




		$("#eBillingChange").submit(function(e) {

			if (($('#eBillingNo').is(":checked")) && (optOut === false)){
				e.preventDefault(); // this will prevent the default action of form submit

		        $.colorbox({ inline: true, href: "#ebillingCancel", width : "550px", height : "320px" });

				$('#opt-out-anyway-button').click(function() {
					optOut = true;
					$.colorbox.close(); // close colorbox
					$('#eBillingChange').submit();
					return false;
				})

				$('#remain-signed-up-button').click(function() {
					$('#eBillingYes').attr('checked', true); // check the yes radio button
					$.colorbox.close(); // close colorbox
					$('#eBillingChange .form-details').slideUp();
					$('#eBillingChange .display-details').slideDown();
					$('#eBillingChange .cancel-change').hide();
					$('#eBillingChange .change').show();
					$('#eBillingChange .module').removeClass('open');

					return false;

				})

			}
			optOut = false;
			return true; // this will submit the form is the radio button is not selected
		});
});















