


	var intervalTime	= 400;

	// BGM
	var bgm				= new Audio();
		bgm.src			= 'C:/Users/AincradHero/Desktop/IROproject/assets/bgm/sound1.mp3';
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
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/nav/nav_bg.png',
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/nav/navfix_bg.png',
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/nav/nav_scroll.png',
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/top/bg_main.png',
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/top/text_sound1.png',
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/top/text_sound2.png',
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/top/main_visual.jpg',
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/top/btn_movie_on.png',
							'C:/Users/AincradHero/Desktop/IROproject/assets/images/outline_bg1.png'
						  ];
	var imgOnReadyFlg	= false;
	
	// loading
	var onloadTimer		= null; // setinterval

	// ローディングアニメーション
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
	
	// youtube 準備
	function onYouTubeIframeAPIReady() {
		ytPlayer = new YT.Player(
			'youtube', // 埋め込む場所の指定
			{
				width		: 925,
				height		: 520,
				videoId		: 'FTo7xMiDQ8A',
				playerVars	: {
					//modestbranding:1,
					rel		: 0,
					showinfo: 0
				},
				events		: {
					'onReady': function(){
						ytOnReadyFlg = true;

						// 画像を読み込む
						imgPreload();

						//console.log('youtube読み込み完了');
					},
					'onStateChange': function onPlayerStateChange(event) {
						var ytStatus = event.data;
						
						// 再生開始したら
						if( ytStatus == YT.PlayerState.PLAYING && ytIsOpening == true ) {
							youtubeGetStatus();
						}
						// 停止されたら
						if( ytStatus ==  YT.PlayerState.PAUSED && ytIsOpening == true ) {
							clearInterval(ytGetStatus);
						}
						// 再生終了したとき
						if ( ytStatus == YT.PlayerState.ENDED ) {
							youtubePlayEnd();
						}
					}
				}
			}
		);
	}
	
	// youtube 再生時間を取得
	function youtubeGetStatus() {
		
		ytGetStatus = setInterval(function(){
			//console.log(ytPlayer.getCurrentTime());
			if( ytPlayer.getCurrentTime() >= 191.5 ) {
				clearInterval(ytGetStatus);
				setTimeout(function(){
					youtubePlayEnd();
					//console.log('動画閉じる');
				},1);
				//console.log('動画ストップ');
			}
		},100);
	}
	
	// youtube 再生完了時
	function youtubePlayEnd() {
		
		if ( ytIsOpening == true ) {
			ytIsOpening	= false;
			ytPlayer.pauseVideo();
			if( $.cookie('sound_switch_flg') == undefined ) {
				$('#movie').fadeOut(intervalTime,function(){
					$('#sound_select').fadeIn(intervalTime);
				});
			} else {
				showTop($('#movie'));
			}
		}
	
	}
	
// scroll 制御 ******************************************************************************

	//スクロール禁止用
	function noScroll(){
		var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).on(scroll_event,function(e){e.preventDefault();});
	}
	
	//スクロール復活用
	function returnScroll(){
		var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$(document).off(scroll_event);
	}

// BGM 制御 *********************************************************************************

	// 読み込み開始→読み込み完了かどうか
	function soundBGMload() {
		bgm.load();
		bgmOnReady = setInterval(function(){
			if( bgm.readyState == 4 ) {
				bgmOnReadyFlg = true;
				clearInterval(bgmOnReady);
				//console.log('bgm読み込み完了');
			}
		},1);
	}
	
	// 再生
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
	
	// 停止
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
	
// 画像のプリロード 制御 ******************************************************************************

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
	
					// BGMを読み込む
					soundBGMload();

					//console.log('画像読み込み完了');
				}
			});
		}
	}

// soundボタン & cookie 制御 **************************************************************************
	
	// bgm on off 切り替えcookie保存
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
		//console.log('音量選択変更：無効');
	}
	
	// bgmを再生切り替える
	function soundBGMChange() {

		if( $.cookie('sound_switch_flg') != undefined ) {
			if( $.cookie('sound_switch_flg') == 'on' ) {

				//console.log('BGM再生');

				$('.navigation .sound li').removeClass('active');
				$('.navigation .sound li.on').addClass('active');
				
				clearInterval(bgmVolume);
				soundBGMplay();
				
				return;


			} else if( $.cookie('sound_switch_flg') == 'off' ) {

				$('.navigation .sound li').removeClass('active');
				$('.navigation .sound li.off').addClass('active');

				//console.log('BGM停止');
				clearInterval(bgmVolume);
				soundBGMstop();
				
				return;

			}
			//console.log('sound_switch_flg：error');
			return;
		}
		//console.log('cookie値なし');
		
	}

// 初期処理 ******************************************************************************

	// ローディングアニメーション
	function loadingAnimation() {
		
		loadingCoguAnime = setInterval(function(){
			loadingCogu.css({ top : -loadingCoguH * coguFrame });
			coguFrame++;
			if( coguFrame >= coguMaxframe ){
				coguFrame = 0;
			}
		}, 1000/12 );
	
	}

	//初回load時
	function int() {
		
		var count	= 0;
		var maxTime	= 4000;
		
		$('#header_top').removeClass('start');	
		
		loadingCogu		= $('#loading .obj img');
		loadingAnimation();
		
		onloadTimer = setInterval(function(){

			count++;

			// 読み込み完了後、loadingを消して動画を表示
			if( bgmOnReadyFlg == true && ytOnReadyFlg == true && imgOnReadyFlg == true ) {
				
				//onloadTimer終了
				clearInterval(onloadTimer);
				//effect読み込み
				_effectApp.root.init(intLoadComplete);
			}
			
			if( count >= maxTime ) {
				intLoadComplete();
				//console.log('uncomplete');
			}
			
		},100);
		
	}

	//effect読み込み完了時の指定したcallback
	function intLoadComplete() {

		//ローディングのアニメーションの終了
		clearInterval(loadingCoguAnime);
		
		//console.log('complete');
		$('#loading').fadeOut(intervalTime, function(){
			ytPlayer.playVideo();
			ytPlayer.getCurrentTime();
		});
	}	
	
	// メインビジュアル表示
	function showTop(beforeTarget) {
		
		$('#header_top .mainvisual .layer1').css({ 'opacity' : 1, 'visibility' : 'visible' });
		beforeTarget.fadeOut(intervalTime,function() {
			returnScroll();
			intLoaded();
		});
		$('#overlay').fadeOut(intervalTime);
		
	}
	
	// load済の場合の表示
	function intLoaded() {
		// 下層読み込み済 ローディングを表示しない
		$('#loading, #movie, #overlay').hide();
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
		
		// 変数 ***************************************************************************************
		
			var _window			= $(window);
			
			// パララックス用
			var _windowHeight	= _window.height();
			var _para1			= $('#line1');
			var _para1Obj		= $('#line1 .para_inner');
			var _para1Top		= _para1.offset().top - _windowHeight - 100;
			var _para2			= $('#line2');
			var _para2Obj		= $('#line2 .para_inner');
			var _para2Top		= _para2.offset().top - _windowHeight - 100;
			
			// fix ナビ
			var _top_nav		= $('#top_nav');
			var _top_navTop		= _top_nav.offset().top + 73;
			var _fix_nav		= $('#fix_nav');
					
			// アスナ背景
			var asunaBg			= $('#bg_asuna img');
			var asunaBgW		= 450;
			var asunaBgH		= 1400;
			var asunaFrame		= 0;
			var asunaFrameW		= 0;
			var asunaFrameH		= 0;
			var asunaMaxframe	= 55;
			var asunaBgAnime	= null; //setInterval
			
			// キリト背景
			var kiritoBg		= $('#bg_kirito img');
			var kiritoBgW		= 450;
			var kiritoBgH		= 1400;
			var kiritoFrame		= 0;
			var kiritoFrameW	= 0;
			var kiritoFrameH	= 0;
			var kiritoMaxframe	= 57;
			var kiritoBgAnime	= null; //setInterval
			
			// キリトアスナ背景アニメーション実行用
			var animeStartTop	= kiritoBg.offset().top - _windowHeight + 600;
			var animeStartFlg	= false;
			

		// 初期表示の処理 *****************************************************************************
			
			if( $('html').hasClass('loaded') ) {
				//effect読み込み
				setTimeout(function(){
					_effectApp.root.init(function(){});
				},10)
				intLoaded();
				
			} else {
				// 初期ロード
				noScroll();
				int();
			}
			
		
		// BGM選択ボタン ******************************************************************************
		
			// loading時BGM選択ボタン
			$('#sound_select .sound a').click(function(e) {
				e.preventDefault();
				showTop($('#sound_select'));
			});
			
			// グロナビ内のBGM選択ボタン
			$('#sound_select .sound a, .navigation .sound a').click(function(e) {
				e.preventDefault();
				soundStatusChange($(this));
			});
			

		// ページ内リンクボタン ***********************************************************************

			// ページ内リンクの移動先調整
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


		// 動画 ***************************************************************************************
		
			// 動画スキップボタン
			$('#btn_skip').click(function(e) {
				e.preventDefault();
				if( ytSkipFlag == true ) { return; }
				ytSkipFlag = true;
				
				ytIsOpening	= false;
				clearInterval(ytGetStatus);
				
				ytPlayer.stopVideo();
	
				if( $.cookie('sound_switch_flg') == undefined ) {
					$('#movie').fadeOut(intervalTime,function(){
						$('#sound_select').fadeIn(intervalTime);
					});
				} else {
					showTop($('#movie'));
				}
			});
			
			// 動画見るボタン
			$('#btn_movie').click(function(e) {
				noScroll();
				clearInterval(bgmVolume);
				soundBGMstop();
				$('#overlay').fadeIn(intervalTime,function(){
					$('#movie').fadeIn(intervalTime);
				});
			});
			
			// 動画閉じるボタン
			$('#btn_movie_close').click(function(e) {
				returnScroll();
				clearInterval(bgmVolume);
				if( $.cookie('sound_switch_flg') == 'off' ) {
					soundBGMstop();
				} else if( $.cookie('sound_switch_flg') == 'on' ) {
					soundBGMplay();
				}
				ytPlayer.stopVideo();
				$('#movie').fadeOut(intervalTime,function(){
					$('#overlay').fadeOut(intervalTime);
				});
			});


		// prologue ***********************************************************************************
		
			// prologue読むボタン
			$('#prologue .read').click(function(e) {
				e.preventDefault();
				$('#prologue_text').css({ 'visibility' : 'visible' });
				$('#prologue_text').animate({ opacity: 1 }, 200, '', function() {
					$('html,body').css({ 'overflow' : 'hidden' });
					$('#prologue_text #scrollbox').animate({ opacity: 1 }, 400);
				} );
			});
	
			// prologue閉じるボタン
			$('.close_top, .close_bottom').click(function(e) {
				e.preventDefault();
				$('#prologue_text #scrollbox').animate({ opacity: 0 }, 200, '', function() {
					$('html,body').css({ 'overflow' : '' });
					$('#prologue_text').animate({ opacity: 0 }, 200, '', function() {
						$('#prologue_text').css({ 'visibility' : 'hidden' });
					} );
				});
			});
			
			// epilogue読むボタン
			$('#epilogue .read').click(function(e) {
				e.preventDefault();
				$('#epilogue_text').css({ 'visibility' : 'visible' });
				$('#epilogue_text').animate({ opacity: 1 }, 200, '', function() {
					$('html,body').css({ 'overflow' : 'hidden' });
					$('#epilogue_text #scrollbox2').animate({ opacity: 1 }, 400);
				} );
			});
	
			// epilogue閉じるボタン
			$('.close_top, .close_bottom').click(function(e) {
				e.preventDefault();
				$('#epilogue_text #scrollbox2').animate({ opacity: 0 }, 200, '', function() {
					$('html,body').css({ 'overflow' : '' });
					$('#epilogue_text').animate({ opacity: 0 }, 200, '', function() {
						$('#epilogue_text').css({ 'visibility' : 'hidden' });
					} );
				});
			});
			
			// カスタムスクロール
			var $scrollbar = $("#scrollbox,#scrollbox2");
			$scrollbar.tinyscrollbar({ trackSize: 714 });
	
	
		// 背景 ***************************************************************************************
			
			// アスナ背景
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
			
			// キリト背景
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
			
			// パララックス キリトアスナ背景開始
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
	
	
	// イベントフォト
	$( '.swipebox' ).swipebox();

})();

