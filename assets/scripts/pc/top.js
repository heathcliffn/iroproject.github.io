


	var intervalTime	= 400;

	// BGM
	var bgm				= new Audio();
		bgm.src			= 'assets/bgm/sound1.mp3';
		bgm.volume		= 0;
		bgm.loop		= true;
	var bgmVolume		= null; // setinterval
	var bgmVolumeNum	= 0;
	var bgmOnReady		= null; // setinterval
	var bgmOnReadyFlg	= false;
	// youtube
	var ytOnReadyFlg	= false;
	var ytSkipFlag		= false;
	var ytGetStatus		= null; // setinterval
	var ytIsOpening		= true; // setinterval
	
	// img preload
	var imgArray		= [
							'/assets/images/nav/nav_bg.png',
							'/assets/images/nav/navfix_bg.png',
							'/assets/images/nav/nav_scroll.png',
							'/assets/images/top/bg_main.png',
							'/assets/images/top/text_sound1.png',
							'/assets/images/top/text_sound2.png',
							'/assets/images/top/main_visual.jpg',
							'/assets/images/top/btn_movie_on.png',
							'/assets/images/outline_bg1.png'
						  ];
	var imgOnReadyFlg	= false;
	
	// loading
	var onloadTimer		= null; // setinterval


	var loadingCogu		= null;
	var loadingCoguW	= 120;
	var loadingCoguH	= 120;
	var coguFrame		= 0;
	var coguMaxframe	= 24;
	var loadingCoguAnime = null;


// youtube API ******************************************************************

	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	

	function onYouTubeIframeAPIReady() {
		ytPlayer = new YT.Player(
			'youtube', 
			{
				width		: 925,
				height		: 520,
				videoId		: 'FTo7xMiDQ8A',
				playerVars	: {
					modestbranding:1,
					rel		: 0,
					showinfo: 0
				},
				events		: {
					'onReady': function(){
						ytOnReadyFlg = true;

					
						imgPreload();

					},
					'onStateChange': function onPlayerStateChange(event) {
						var ytStatus = event.data;
						
				
						if( ytStatus == YT.PlayerState.PLAYING && ytIsOpening == true ) {
							youtubeGetStatus();
						}
					
						if( ytStatus ==  YT.PlayerState.PAUSED && ytIsOpening == true ) {
							clearInterval(ytGetStatus);
						}
					
						if ( ytStatus == YT.PlayerState.ENDED ) {
							youtubePlayEnd();
						}
					}
				}
			}
		);
	}
	

	function youtubeGetStatus() {
		
		ytGetStatus = setInterval(function(){
			console.log(ytPlayer.getCurrentTime());
			if( ytPlayer.getCurrentTime() >= 191.5 ) {
				clearInterval(ytGetStatus);
				setTimeout(function(){
					youtubePlayEnd();
					console.log('');
				},1);
				console.log('');
			}
		},100);
	}
	

	function youtubePlayEnd() {
		
		if ( ytIsOpening == true ) {
			ytIsOpening	= false;
			ytPlayer.pauseVideo();
			if( $.cookie('sound_switch_flg') == undefined ) {
				$('#taniltsuulga_video').fadeOut(intervalTime,function(){
					$('#sound_select').fadeIn(intervalTime);
				});
			} else {
				showTop($('#taniltsuulga_video'));
			}
		}
	
	}
	

	function noScroll(){
		var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).on(scroll_event,function(e){e.preventDefault();});
	}
	function returnScroll(){
		var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).off(scroll_event);
		}

	function soundBGMload() {
		bgm.load();
		bgmOnReady = setInterval(function(){
			if( bgm.readyState == 4 ) {
				bgmOnReadyFlg = true;
				clearInterval(bgmOnReady);
			}
		},1);
	}
	

	function soundBGMplay() {
		bgm.play();
		bgmVolume = setInterval(function(){
			if( bgm.readyState == 4 ) {
				bgmVolumeNum += 0.01;
				if( bgmVolumeNum > 1 ) {
					clearInterval(bgmVolume);
					bgmVolumeNum = 1;
				}
				bgm.volume = bgmVolumeNum;
			}
		},1000/60);
	}
		function soundBGMup() {
		bgmVolume = setInterval(function(){
			if( bgm.readyState == 4 ) {
				bgmVolumeNum -= 0.01;
				if( bgmVolumeNum < 0.75 ) {
					clearInterval(bgmVolume);
					bgmVolumeNum = 0.75;
					//bgm.currentTime = 0;
					bgm.play();
				}
				bgm.volume = bgmVolumeNum;
			}
		},1000/60);
	}

	function soundBGMdown() {
		bgmVolume = setInterval(function(){
			if( bgm.readyState == 4 ) {
				bgmVolumeNum -= 0.01;
				if( bgmVolumeNum < 0.5 ) {
					clearInterval(bgmVolume);
					bgmVolumeNum = 0.5;
					bgm.currentTime = 0.2
					bgm.play();
				}
				bgm.volume = bgmVolumeNum;
			}
		},1000/120);
	}



	function soundBGMstop() {
		bgmVolume = setInterval(function(){
			if( bgm.readyState == 4 ) {
				bgmVolumeNum -= 0.01;
				if( bgmVolumeNum < 0 ) {
					clearInterval(bgmVolume);
					bgmVolumeNum = 0;
					//bgm.currentTime = 0;
					bgm.pause();
				}
				bgm.volume = bgmVolumeNum;
			}
		},1000/120);
	}



	function imgPreload() {
		var count = 0;
		$('img').each(function(e){
		 	imgArray.push($(this).attr('src'));
		});
		for(var i = 0; i< imgArray.length; i++){
			$('<img>').attr('src', imgArray[i]).load(function(e) {
				count++;
				if( count >= imgArray.length) {
					imgOnReadyFlg = true;
	
					
					soundBGMload();

				
				}
			});
		}
	}

	function soundStatusChange(obj) {
		var switchState = obj.data('switch'); 

		if( switchState == 'on' ) {

			$.cookie('sound_switch_flg', 'on', { expires: 20 });
			soundBGMChange();
			return;

		} else if( switchState == 'off' ) {

			$.cookie('sound_switch_flg', 'off', { expires: 20 });
			soundBGMChange();
			return;

		}

	}
	

	function soundBGMChange() {

		if( $.cookie('sound_switch_flg') != undefined ) {
			if( $.cookie('sound_switch_flg') == 'on' ) {

			

				$('.navigation .sound li').removeClass('active');
				$('.navigation .sound li.on').addClass('active');
				
				clearInterval(bgmVolume);
				soundBGMplay();
				
				return;


			} else if( $.cookie('sound_switch_flg') == 'off' ) {

				$('.navigation .sound li').removeClass('active');
				$('.navigation .sound li.off').addClass('active');

				clearInterval(bgmVolume);
				soundBGMstop();
				
				return;

			}
		
			return;
		}
	
		
	}

	function loadingAnimation() {
		
		loadingCoguAnime = setInterval(function(){
			loadingCogu.css({ top : -loadingCoguH * coguFrame });
			coguFrame++;
			if( coguFrame >= coguMaxframe ){
				coguFrame = 0;
			}
		}, 1000/12 );
	
	}

	
	function int() {
		
		var count	= 0;
		var maxTime	= 4000;
		
		$('#header_top').removeClass('start');	
		
		loadingCogu		= $('#loading .obj img');
		loadingAnimation();
		
		onloadTimer = setInterval(function(){

			count++;

			if( bgmOnReadyFlg == true && ytOnReadyFlg == true && imgOnReadyFlg == true ) {
				
			
				clearInterval(onloadTimer);
			
				_effectApp.root.init(intLoadComplete);
			}
			
			if( count >= maxTime ) {
				intLoadComplete();
		
			}
			
		},100);
		
	}

	
	function intLoadComplete() {

		clearInterval(loadingCoguAnime);
	
		$('#loading').fadeOut(intervalTime, function(){
			ytPlayer.playVideo();
			ytPlayer.getCurrentTime();
		});
	}	
	

	function showTop(beforeTarget) {
		
		$('#header_top .mainvisual .layer1').css({ 'opacity' : 1, 'visibility' : 'visible' });
		beforeTarget.fadeOut(intervalTime,function() {
			returnScroll();
			intLoaded();
		});
		$('#overlay').fadeOut(intervalTime);
		
	}
	
	function intLoaded() {
	
		$('#loading, #taniltsuulga_video, #overlay').hide();
		$('#btn_skip').removeClass('avtive').hide();
		ytIsOpening	= false;
		$('#btn_movie_close').show();
		if( ytOnReadyFlg == true ) {
			ytPlayer.stopVideo();
		}
		$('#header_top').addClass('start');	
		soundBGMChange();
	}

// *****************************************************************************************
	
	
(function(){


	
	$(function(){
		
	
			var _window			= $(window);
			
			
			var _windowHeight	= _window.height();
			var _para1			= $('#line1');
			var _para1Obj		= $('#line1 .para_inner');
			var _para1Top		= _para1.offset().top - _windowHeight - 100;
			var _para2			= $('#line2');
			var _para2Obj		= $('#line2 .para_inner');
			var _para2Top		= _para2.offset().top - _windowHeight - 100;
			
			
			var _top_nav		= $('#top_nav');
			var _top_navTop		= _top_nav.offset().top + 73;
			var _fix_nav		= $('#fix_nav');
					
			
			var asunaBg			= $('#zuun img');
			var asunaBgW		= 450;
			var asunaBgH		= 1400;
			var asunaFrame		= 0;
			var asunaFrameW		= 0;
			var asunaFrameH		= 0;
			var asunaMaxframe	= 55;
			var asunaBgAnime	= null; //setInterval
			
		
			var kiritoBg		= $('#baruun img');
			var kiritoBgW		= 450;
			var kiritoBgH		= 1400;
			var kiritoFrame		= 0;
			var kiritoFrameW	= 0;
			var kiritoFrameH	= 0;
			var kiritoMaxframe	= 57;
			var kiritoBgAnime	= null; 
			
			
			var animeStartTop	= kiritoBg.offset().top - _windowHeight + 600;
			var animeStartFlg	= false;
			

		//  *****************************************************************************
			
			if( $('html').hasClass('loaded') ) {
			
				setTimeout(function(){
					_effectApp.root.init(function(){});
				},10)
				intLoaded();
				
			} else {
				
				noScroll();
				int();
			}
			
		
		
			$('#sound_select .sound a').click(function(e) {
				e.preventDefault();
				showTop($('#sound_select'));
			});
			
		
			$('#sound_select .sound a, .navigation .sound a').click(function(e) {
				e.preventDefault();
				soundStatusChange($(this));
			});
			

		
			$('.p_scroll').click(function(e) {
				e.preventDefault();
				var id		= $(this).data('id');
				var target	= $('#'+id).offset().top;
				if( id == 'outline' ) {
					target += 40;
				} else if( id == 'about' ) {
					target += 40;
				}
				$('html, body').animate({ scrollTop : target }, 600, 'easeOutCubic' );
			});	


	
			$('#btn_skip').click(function(e) {
				e.preventDefault();
				if( ytSkipFlag == true ) { return; }
				ytSkipFlag = true;
				
				ytIsOpening	= false;
				clearInterval(ytGetStatus);
				
				ytPlayer.stopVideo();
	
				if( $.cookie('sound_switch_flg') == undefined ) {
					$('#taniltsuulga_video').fadeOut(intervalTime,function(){
						$('#sound_select').fadeIn(intervalTime);
					});
				} else {
					showTop($('#taniltsuulga_video'));
				}
			});
		
			
		
			$('#btn_movie').click(function(e) {
				noScroll();
				clearInterval(bgmVolume);
				soundBGMstop();
				$('#overlay').fadeIn(intervalTime,function(){
					$('#taniltsuulga_video').fadeIn(intervalTime);
				});
			});
			
		
			$('#btn_movie_close').click(function(e) {
				returnScroll();
				clearInterval(bgmVolume);
				if( $.cookie('sound_switch_flg') == 'off' ) {
					soundBGMstop();
				} else if( $.cookie('sound_switch_flg') == 'on' ) {
					soundBGMplay();
				}
				ytPlayer.stopVideo();
				$('#taniltsuulga_video').fadeOut(intervalTime,function(){
					$('#overlay').fadeOut(intervalTime);
				});
			});


	
			$('#prologue .read').click(function(e) {
				e.preventDefault();
				$('#prologue_text').css({ 'visibility' : 'visible' });
				$('#prologue_text').animate({ opacity: 1 }, 200, '', function() {
					$('html,body').css({ 'overflow' : 'hidden' });
					$('#prologue_text #scrollbox').animate({ opacity: 1 }, 400);
				} );
			});
	
		
			$('.close_top, .close_bottom').click(function(e) {
				e.preventDefault();
				$('#prologue_text #scrollbox').animate({ opacity: 0 }, 200, '', function() {
					$('html,body').css({ 'overflow' : '' });
					$('#prologue_text').animate({ opacity: 0 }, 200, '', function() {
						$('#prologue_text').css({ 'visibility' : 'hidden' });
					} );
				});
			});
			
	
			$('#tuhai .read').click(function(e) {
				e.preventDefault();
				$('#tuhai_text').css({ 'visibility' : 'visible' });
				$('#tuhai_text').animate({ opacity: 1 }, 200, '', function() {
					$('html,body').css({ 'overflow' : 'hidden' });
					$('#tuhai_text #scrollbox2').animate({ opacity: 1 }, 400);
				} );
			});
	
		
			$('.close_top, .close_bottom').click(function(e) {
				e.preventDefault();
				$('#tuhai_text #scrollbox2').animate({ opacity: 0 }, 200, '', function() {
					$('html,body').css({ 'overflow' : '' });
					$('#tuhai_text').animate({ opacity: 0 }, 200, '', function() {
						$('#tuhai_text').css({ 'visibility' : 'hidden' });
					} );
				});
			});
			
			
			var $scrollbar = $("#scrollbox,#scrollbox2");
			$scrollbar.tinyscrollbar({ trackSize: 714 });
	
	
		
			function asunaBgAnimationStart() {
				if( tablethone == true ) {
					asunaBg.hide();
					return;
				}
				asunaBgAnime = setInterval(function(){
					asunaBg.css({ top : -asunaBgH * asunaFrameH, left : -asunaBgW * asunaFrameW });
					asunaFrame++;
					asunaFrameH++;
					if( asunaFrameH >= 10 ) {
						asunaFrameH = 0;
						asunaFrameW++;
					}
					if( asunaFrame >= asunaMaxframe ){
						clearInterval(asunaBgAnime);
						//asunaFrame = 0;
						//asunaFrameH = 0;
						//asunaFrameW = 0;
					}
				}, 1000/12 );
			}
			
	
			function kiritoBgAnimationStart() {
				if( tablethone == true ) {
					kiritoBg.hide();
					return;
				}
				kiritoBgAnime = setInterval(function(){
					kiritoBg.css({ top : -kiritoBgH * kiritoFrameH, left : -kiritoBgW * kiritoFrameW });
					kiritoFrame++;
					kiritoFrameH++;
					if( kiritoFrameH >= 10 ) {
						kiritoFrameH = 0;
						kiritoFrameW++;
					}
					if( kiritoFrame >= kiritoMaxframe ){
						clearInterval(kiritoBgAnime);
						//kiritoFrame = 0;
						//kiritoFrameH = 0;
						//kiritoFrameW = 0;
					}
				}, 1000/12 );
			}
			
			
			_window.scroll(function(e) {
				var scrollTop = _window.scrollTop();
				if( _para1Top < scrollTop ) {
					_para1Obj.css({ top : - (scrollTop-_para1Top) / 5 });
				}
				if( _para2Top < scrollTop ) {
					_para2Obj.css({ top : - (scrollTop-_para2Top) / 5 });
				}
				if( animeStartTop < scrollTop ) {
					if( animeStartFlg == true ) { return; }
					animeStartFlg = true;
					kiritoBgAnimationStart();
					asunaBgAnimationStart();
				}
				if( _top_navTop <= scrollTop ) {
					_fix_nav.addClass('open');
				} else {
					_fix_nav.removeClass('open');
				}
			});
			

		// ********************************************************************************************

	});	
	
	
	$( '.swipebox' ).swipebox();

})();

