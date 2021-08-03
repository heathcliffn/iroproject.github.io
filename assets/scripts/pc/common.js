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


// tablet判定 ******************************************************************************

	var tablethone = false;
	if ( ( navigator.userAgent.indexOf('iPad') != -1 ) )
	{
		tablethone = true;
	}

// twiiter *********************************************************************************

	window.twttr = (function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0],
		t = window.twttr || {};
	  if (d.getElementById(id)) return t;
	  js = d.createElement(s);
	  js.id = id;
	  js.src = "https://platform.twitter.com/widgets.js";
	  fjs.parentNode.insertBefore(js, fjs);
	 
	  t._e = [];
	  t.ready = function(f) {
		t._e.push(f);
	  };
	 
	  return t;
	}(document, "script", "twitter-wjs"));

// *****************************************************************************************


(function(){
	$(function(){
		
		if ( $('#faq').length ) {
			$('#faq .unit1 h2').click(function(e) {
				$(this).toggleClass('open');
				$(this).next('.accordion').slideToggle(200);
			});
		}

	});		
})();

