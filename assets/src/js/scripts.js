(function ( $ ) {

	'use strict';

	jQuery(document).ready(function() {
		setFooterHeight();
		show_leave_checkout_modal();
		// disableAppointmentBookingBtn(); // commented to use later  
	});

	var is_show_cross_sell = jQuery('body.single-product').find('#mfb-cross-sell-modal');  

	if(is_show_cross_sell.length) {
		
		jQuery('.single_add_to_cart_button').click(function(e){
			e.preventDefault();
			jQuery('#mfb-cross-sell-modal').addClass('show');
		});
	
		jQuery(".mfb-cross-sell-products").slick({
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 3,
			prevArrow: '<button type="button" class="slick-prev"></button>',
			nextArrow: '<button type="button" class="slick-next"></button>',
			responsive: [
				{
				  breakpoint: 768,
				  settings: {
					arrows: true,
					centerMode: false,
					slidesToShow: 2,
					slidesToScroll: 2,
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					arrows: true,
					centerMode: false,
					slidesToShow: 1,
					slidesToScroll: 1,
				  }
				}
			  ]
		  });
	}

	jQuery('.mfb-increment').click(function(e) {

		e.preventDefault();
		
		var valueElement = jQuery(this).siblings('span');
		

        if(jQuery(this).hasClass('mfb-plus')) 
        {
           valueElement.html(Math.max(parseInt(valueElement.html()) + 1));
        } 
        else if (parseInt(valueElement.html()) > 0) // Stops the value going into negatives
        {
           valueElement.html(Math.max(parseInt(valueElement.html()) - 1));
		}
		
		setCrossSellProducts();
	});

	function setCrossSellProducts(){
		var qtyElements = jQuery('#mfb-cross-sell-modal .mfb-qty');
		var submitButton = jQuery('#mfb-cross-sell-modal .mfb-submit');
		var total = 0;

		jQuery( ".mfb_cross_sell_product" ).remove();

		qtyElements.each(function(index){
			var qty = parseInt(jQuery(this).html());
			var productId = jQuery(this).attr('data-product-id');

			if(qty > 0) {
				jQuery('<input>').attr({
					type: 'hidden',
					name: 'mfb_cross_sell_product['+ productId +']',
					value: qty,
					class: 'mfb_cross_sell_product'
				}).appendTo('form.cart');
			}

			total += qty;
		});

		if(total > 0) {
			submitButton.html(mfbjs.locale_add_products_to_order.replace('#', total));
		} else {
			submitButton.html(mfbjs.locale_no_thanks);
		}
	}

	jQuery('body').on('click', '.mfb-popup .close', function() {
		jQuery(this).parents('.mfb-popup').removeClass('show');
	});

	jQuery('body').on('click', '.mfb-popup.overlay', function(e) {
		if(e.target !== e.currentTarget) return;
		jQuery(this).removeClass('show');
	});

	jQuery(".mfb-slider").lightSlider({
		item: 1,
		auto: true,
		pauseOnHover: true,
		loop: true
	});

	jQuery('.mfb-staff-card').click(function(e){
		var products = jQuery('.mfb_products_card, .mfb-category-heading');
		var staff = jQuery('.mfb-staff-card');
		var staff_id = jQuery(this).data('staff-id');
		var staff_id_class = 'staff_id_' + staff_id;
		var is_active = jQuery(this).hasClass('mfb-staff-active');

		//Adding the active class
		staff.removeClass('mfb-staff-active');

		if(!is_active) {
			jQuery(this).addClass('mfb-staff-active');
		}

		products.each(function(index, value) {
			if(jQuery(this).hasClass(staff_id_class) || is_active) {
				jQuery(this).show(500);
			} else {
				jQuery(this).hide(500);
			}
		});
	});

	var map_element = jQuery('.mfb-map-container');

	if(map_element && map_element.length) {

		var mfb_lat = parseFloat(mfbjs.business_map_lat);
		var mfb_lng = parseFloat(mfbjs.business_map_lng);
		var mfb_zoom = parseInt(mfbjs.business_map_zoom);

		var map = new google.maps.Map(map_element.get(0), {
			center: {lat:mfb_lat, lng: mfb_lng},
			zoom: mfb_zoom,
			disableDefaultUI: true,
			zoomControl: true
		});

		var position = {lat: mfb_lat, lng: mfb_lng};
		var marker = new google.maps.Marker({position: position, map: map});
	}

	function setFooterHeight() {
		var window_height = jQuery(window).height();
        var body_height = jQuery("body").height();

		if(window_height > body_height) {
			if(jQuery(".site-footer").length > 0) {
				var site_footer = jQuery(".site-footer");
				var add_footer_height = window_height - body_height;
                var new_footer_height = site_footer.height() + add_footer_height;
				jQuery(site_footer).height(new_footer_height);
			}
		}
	}

	function show_leave_checkout_modal() {
		var is_show_leave_checkout = jQuery('body.woocommerce-checkout');
		var is_order_recieved = jQuery('body.woocommerce-order-received');
		
		if(is_show_leave_checkout.length && !is_order_recieved.length) {
			jQuery('a').click(function(e){
				e.preventDefault();
				var href = jQuery(this).attr('href');
				jQuery('#mfb-leave-checkout-modal').addClass('show');

				leaveCheckoutYes(href);

				leaveCheckoutNo();
			});
		}
		
	}

	function leaveCheckoutYes(href) {
		$("#leave-checkout-yes").click(function() { 
			jQuery.ajax({
				type : "post",
				dataType : "json",
				url : mfbajax.ajaxurl,
				data : {action: "empty_cart_fully"},
				beforeSend: function() {
					$('#mfb-leave-checkout-modal .popup .content').html('<h3>Please wait !!</h3>');
				},
				success: function(response) {
					console.log(response);
				   if(response.type == "success") {
					$('#mfb-leave-checkout-modal').removeClass('show');
					 window.location.replace(href);
				   }
				   else {
					  alert("Error navigating, please try again")
				   }
				}
			 });
		});
	}


	function leaveCheckoutNo() {
		jQuery("#leave-checkout-no").click(function() { 
			jQuery('#mfb-leave-checkout-modal').removeClass('show');
		});
	}

	/* Start - commented to use later */
	// function disableAppointmentBookingBtn() {
	// 	if($(".mfb-hide-calendar").length > 0) {
	// 		$(".wc-appointments-appointment-form-button.single_add_to_cart_button").prop('disabled', true);
	// 	}
	// }
	/* End - commented to use later */

})( jQuery );
