/** TIMER PARAM
 *
 *  Format of date: MOUNTH DAY, YEAR HOURS:MINUTES:SECONDS 
 *
 */ 
var end = "January 1, 2013 00:00:00"; // Don't forget to change the Date

/** Hide Toolbar on iPhone **/
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('iphone') != -1) {
	window.addEventListener('load', function(){
		setTimeout(scrollTo, 0, 0, 1);
	}, false);
}

var width;
var firefox = ($.browser.mozilla);
var safari = ($.browser.safari&&!$.browser.mozilla&&!$.browser.msie&&!$.browser.opera);

$(function(){
	/** Change the background depending on time of day **/
	var d = new Date().getHours();
	(d>=8 && d<22) ? $('body').addClass('light') : $('body').addClass('dark');

	width = $(window).width();
	$(window).resize(function(){
		width = $(window).width();
		if((firefox || safari) && width>480)
			$('#email input').width(290);
		else $('#email input').width(225);
	});
	
	/** Timer **/
	setTimeout(function(){
		$("#ct").countdown({
			until: new Date(end), 
			compact: true,
			onTick: updateTime
		});
	}, 100);

	/** Fix placeholder **/
	$('input[placeholder]').placeholder();
	
	/** Animation Social Icons **/
	$('#icons div').hover(function(){
		$(this).stop(true, true)
			.animate({opacity:1}, 200);
	}, function() {
		$(this).stop(true, true)
			.animate({opacity:0.7}, 200);
	});
	
	/** Firefox/Safari fix **/
	$('#icons').width($('#icons div').length*56);
	if( (firefox || safari) && width > 480) $('#email input').width(290);
	
	/** Check-up the e-mail **/
	$('input[name=email]').bind('keyup keydown change', function(){
		var reg = /^([\w]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var email = $('input[name=email]').val();
		(!reg.test(email)) ? $(this).addClass('notvalid') : $(this).removeClass('notvalid');
	});
	
	/** Sending email by AJAX **/
	$('#subscribe-form').submit(function(){
		var input = $('input[name=email]');
		if(input.hasClass('notvalid') || input.val().length == 0) {
			err(input);
			return false;
		}
		
		$('#subscribe').prop("disabled", true); // Disable the button;
		
		$.ajax({
			type: 'POST',
			url: $(this).attr('action'),
			data: $(this).serialize(),
			success: function(data) {
				if (data) {
					if(width<=480) {
						var mt = 110;
						$('#email').animate({height:32}, 200);
					} else mt = 60;
					
					$('#subscribe-form').animate({'margin-top':-mt}, 200);
				} else err(input);
			}
		});

		return false;
	});
});

/** Makes timer work **/
function updateTime(time) {
	var ar = [];
	$.each(time, function(k,v) {
		if(k < 3) return true;
		ar.push(v.toString());
	});
	
	var nar = [];
	$.each(ar, function(k,v) {
		switch(k) {
			case 0:
				switch (v.length) {
					case 0: v = '000'; break;								
					case 1: v = '00'+v; break;
					case 2: v = '0'+v; break;
				}
			break;
			default:
				switch (v.length) {
					case 0: v = '00'; break;								
					case 1: v = '0'+v; break;
				}
			break;
		}

		$.each(v, function(key,val) {
			nar.push(val);
		});
	});
	
	// Update time
	$('.num').each(function(k){
		var obj = $(this).find('div');
		
		if(obj.eq(0).text() == nar[k]) return true;
		if(width<=768)
			obj.eq(0).text(nar[k]);
		else {
			/** Animate numbers **/
			obj.eq(1)
				.text(nar[k])
				.show()
				.animate({opacity:1});
			obj.eq(0).animate({'margin-top': -77, opacity:0}, function(){ 
				var parent = $(this).parent();
				$(this).remove();
				$('<div/>').hide().css({opacity:0}).appendTo(parent);
			});
		}
	});
}

function err(input) {
	input.stop(true,true).animate({opacity:0.4}, 200, function(){
		$(this).animate({opacity:1}, 200);
	});
}