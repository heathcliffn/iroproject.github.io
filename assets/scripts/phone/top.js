
// 変数初期値 *******************************************************************
	
	var intervalTime	= 400;
	
	// youtube
	var ytOnReadyFlg	= false;
	var ytSkipFlag		= false;
	
	// img preload
	var imgArray		= [
								'/vrmmo-project/assets/images/sp/bg1.jpg',
								'/vrmmo-project/assets/images/sp/bg2.jpg',
								'/vrmmo-project/assets/images/sp/footer_bg.png',
								'/vrmmo-project/assets/images/sp/nav/nav_scroll.png',
								'/vrmmo-project/assets/images/sp/nav/nav_bg2.png',
								'/vrmmo-project/assets/images/sp/top/main_visual.jpg',
								'/vrmmo-project/assets/images/sp/top/prologue_bg3.png',
								'/vrmmo-project/assets/images/sp/top/prologue_bg1.png',
								'/vrmmo-project/assets/images/sp/top/prologue_bg2.png',
								'/vrmmo-project/assets/images/sp/top/outline_img1.png',
								'/vrmmo-project/assets/images/sp/top/outline_img2.png'
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
				width		: 580,
				height		: 326,
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
					},
					'onStateChange': function onPlayerStateChange(event) {
						var ytStatus = event.data;
						// 再生終了したとき
						if (ytStatus == YT.PlayerState.ENDED) {
							youtubePlayEnd();
						}
					}
				}
			}
		);
	}
	// youtube 再生完了時
	function youtubePlayEnd() {
		if ( $('#btn_skip').hasClass('avtive') ) {
			
			$('#btn_skip').removeClass('avtive').hide();
			$('#btn_movie_close').show();
			
			ytPlayer.stopVideo();
			$('#header_top .mainvisual .layer1').css({ 'opacity' : 1, 'visibility' : 'visible' });
			$('#movie').fadeOut(intervalTime,function(){
				noScroll();
				$('#header_top').addClass('start');	
			});
			$('#overlay').fadeOut(intervalTime);
		}
		
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
				}
			});
		}
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
			if( ytOnReadyFlg == true && imgOnReadyFlg == true ) {
				
				//onloadTimer終了
				clearInterval(onloadTimer);
				
				//ローディングのアニメーションの終了
				clearInterval(loadingCoguAnime);
				
				$('#loading').fadeOut(intervalTime, function(){
					ytPlayer.playVideo();
					ytPlayer.getCurrentTime();
				});

			}
			
			if( count >= maxTime ) {
				clearInterval(onloadTimer);
			}
			
		},1);
		
	}
	
	// メインビジュアル表示
	function showTop(beforeTarget) {
		
		$('#header_top .mainvisual .layer1').css({ 'opacity' : 1, 'visibility' : 'visible' });
		beforeTarget.fadeOut(intervalTime,function() {

			noScroll();
			intLoaded();
		});
		$('#overlay').fadeOut(intervalTime);
		
	}
	
	// load済の場合の表示
	function intLoaded() {
		
		$('#btn_skip').removeClass('avtive').hide();
		$('#btn_movie_close').show();
		if( ytOnReadyFlg == true ) {
			ytPlayer.stopVideo();
		}
		
		$('#header_top').addClass('start');	
		
	}

// *****************************************************************************************
	

(function(){


	
	$(function(){
		
		// 初期表示の処理 *****************************************************************************
			
			if( $('html').hasClass('loaded') ) {
				// 下層読み込み済
				$('#loading, #movie, #overlay').hide();
				intLoaded();
			} else {
				// 初期ロード
				noScroll();
				int();
			}
	
		// ページ内リンクボタン ***********************************************************************

			// ページ内リンクの移動先調整
			$('.p_scroll').click(function(e) {
				e.preventDefault();
				var id		= $(this).data('id');
				var target	= $('#'+id).offset().top;
				$('html, body').animate({ scrollTop : target }, 600, 'easeOutCubic' );
			});	
		
		// 動画 ***************************************************************************************

			$('#btn_skip').click(function(e) {
				e.preventDefault();
				ytPlayer.stopVideo();
				showTop($('#movie'));
			});
		
			$('#btn_movie').click(function(e) {
				noScroll();
				$('#overlay').fadeIn(intervalTime,function(){
					$('#movie').fadeIn(intervalTime);
				});
			});
			
			$('#btn_movie_close').click(function(e) {
				noScroll();
				ytPlayer.stopVideo();
				$('#movie').fadeOut(intervalTime,function(){
					$('#overlay').fadeOut(intervalTime);
				});
			});
		

		// prologue ***********************************************************************************
		
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
			
			$('#epilogue .read').click(function(e) {
				e.preventDefault();
				$('#epilogue_text').css({ 'visibility' : 'visible' });
				$('#epilogue_text').animate({ opacity: 1 }, 200, '', function() {
					$('html,body').css({ 'overflow' : 'hidden' });
					$('#epilogue_text #scrollbox2').animate({ opacity: 1 }, 400);
				} );
			});
			$('.close_top, .close_bottom').click(function(e) {
				e.preventDefault();
				$('#epilogue_text #scrollbox2').animate({ opacity: 0 }, 200, '', function() {
					$('html,body').css({ 'overflow' : '' });
					$('#epilogue_text').animate({ opacity: 0 }, 200, '', function() {
						$('#epilogue_text').css({ 'visibility' : 'hidden' });
					} );
				});
			});

		// ********************************************************************************************

	});	
	
	
	// イベントフォト
	$( '.swipebox' ).swipebox();
})();

