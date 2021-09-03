var Common = {};
(function(root){
	if(('sessionStorage' in root) && ('localStorage' in root)){
		// hasValue
		var hasStorage = sessionStorage.getItem('loading');
		var loadClass = hasStorage ? 'loaded' : '';
		
		root.sessionStorage.setItem('loading', new Date());

		// addClass
		var html = document.getElementsByTagName('html')[0],
		val =	html.getAttribute('class');
		if(val){
			loadClass = val + ' ' + loadClass;
		}
		html.setAttribute('class', loadClass);

		// export
		Common = {
			loaded: hasStorage ? true : false
		};
	}

}(window));

// scroll 制御 ******************************************************************************

	// scroll
	var scrollFlag		= false;

	function noScroll() {
		if (!scrollFlag) {
			$(window).on('touchmove.noScroll', function(e) {
				e.preventDefault();
			});
			scrollFlag = true;
		} else {
			$(window).off('.noScroll');
			scrollFlag = false;
		}
	}
	
// *****************************************************************************************

function menuToggle() {
	$('#navigation #btn_menu').toggleClass('selected');
	$('#nav_open').toggleClass('open');
	$('#navigation_overlay').toggleClass('open');
	$('#navigation .hide').toggleClass('open');
	noScroll();
}


(function(){

	$(function(){


		$('#navigation_overlay').click(function(e) {
			e.preventDefault();
			menuToggle();
		});
		
//		if( $('body').hasClass('top') ) {
//			$('#nav_open a').click(function(e) {
//				e.preventDefault();
//				menuToggle();
//			});
//		}

		if ( $('#faq').length ) {
			$('#faq .unit1 h2').click(function(e) {
				$(this).toggleClass('open');
				$(this).next('.accordion').slideToggle(200);
			});
		}


	});		

})();

