var _effectApp = {root:null};

(function(){

	$(init);

	function init() {
		_effectApp.root = new _effectApp.Index();
	}

	var Index = function() {
		var self = this;
		self.window = $(window);
		self.canvas = document.getElementById("canvasBg");
		self.stage  = new createjs.Stage(self.canvas);
		self.loadCompFc = null;
		self.loadCount  = 0;
		self.loadTotal  = 2;
	}

	Index.prototype.init = function(callback) 
	{
		var self = this;
		self.loadCompFc = callback;
		self.$introduction  = $("#introduction");
		self.$prolog        = $("#prologue");
		self.$readBtn       = self.$prolog.find(".read");
		self.$readBtn.fadeOut(0);
		self.prologPosition = self.$prolog.offset().top - 380;
		self.prologTop = self.$introduction.height();

		self.noizBg       = new NoizBg();
		self.note         = new Note();
		self.introduction = new Introduction();

		self.window.resize(function(){
			self.resize();
		});
		self.canvas.height = 1916;
		self.resize();

		var noizFlg = false;
		self.glitchMoveFlg = false;
		//--- スクロール ---
		self.window.on('scroll', function(e){
			var acScNum = self.window.scrollTop();
			if(acScNum < 50)
			{
				self.glitchMoveFlg = false;
			}else
			{
				self.glitchMoveFlg = true;
				self.introduction.init();
			}

			if(acScNum > self.prologPosition)
			{
				self.glitchMoveFlg = false;
				if(!noizFlg && self.noizBg.setComplete)
				{
					noizFlg = true;
					self.noizBg.setAnimate();
				}
			}
		});
	}

	Index.prototype.imgComplete = function()
	{
		var self = this;
		self.loadCount++;

		if(self.loadCount >= self.loadTotal)
		{
			// console.log(self.loadCount);
			self.loadCompFc();
		}
	} 

	var Introduction = function(){
		var self = this;
		self.initFlg = false;
		self.$body   = _effectApp.root.$introduction;
		self.$h2     = self.$body.find("h2");
		self.$h3     = self.$body.find("h3");
		self.$h3.fadeTo(0,0);
		self.$h2.velocity({scaleY:0,opacity:0},{duration: 0})

		self.$p      = self.$body.find("p");
		self.$p.velocity({opacity:0},{duration: 0,});
	}

	Introduction.prototype.init = function()
	{
		var self = this;
		if(!self.initFlg)
		{
			self.initFlg = true;
			self.$h2.velocity({scaleY:1,opacity:1},{duration: 400,delay: 200, easing: "easeOutQuad"});
			self.$h3.velocity({opacity:1},{duration: 700,delay: 1200, easing: "easeOutQuad"})
			self.$p.velocity({opacity:1},{duration: 400,delay: 2000, easing: "easeOutQuad"})
		}
	}

	var Note = function(){
		//コンテナ
		var self = this;
		self.body    = new createjs.Container();
		self.body.width  = 830;
		self.body.height = 632;
		self.body.y = _effectApp.root.prologTop + 185;
		self.body.x = 0;
		var imgsLoad = [];

		self.ttlXArr    = [325,355,390,428,461];
		self.txtYArr    = [65,117,170,222,275,327,380,432,485];
		self.txtbreaks  = [12,35,58,81,104,120,143,166];
		self.txtSetXArr = [0,36,72,108,144,180,216,252,288,325,361,397,433,469,505,541,577,613,649,685,721,757,793];
		self.txtTotal   = 184;

		imgsLoad.push("bg_note_boder.png");
		imgsLoad.push("prologue_ttl0.png");
		imgsLoad.push("prologue_ttl1.png");
		imgsLoad.push("prologue_ttl2.png");
		imgsLoad.push("prologue_ttl3.png");
		imgsLoad.push("prologue_ttl4.png");
		for (var i = 0; i < self.txtTotal; i++) {
			imgsLoad.push("prologue_txt" + i + ".png");
		};

		self.imgsLoadTotal = imgsLoad.length;
		self.loadImgCount = 0;
		self.loadImgs = [];
		for(var i = 0; i < self.imgsLoadTotal; i++){
			var img = new Image();
			img.parent = this;
			//img.crossOrigin = "anonymous";
			img.onload = this.imgLoad;
			img.src = '/assets/images/canvas_bg/note/' + imgsLoad[i];
			this.loadImgs.push(img);
		}
	};

	Note.prototype.imgLoad = function() {
		var self = this.parent;
		self.loadImgCount++;
		if(self.loadImgCount >= self.imgsLoadTotal)
		{
			self.init();
		}
	}

	Note.prototype.init = function()
	{
		var self = this;
		var bg = new createjs.Bitmap(self.loadImgs[0]);
		bg.y = 64;
		self.body.addChild(bg);

		self.ttlArr = [];
		for (var i = 0; i < 5; i++) {
			var ttl = new createjs.Bitmap(self.loadImgs[i+1]);
			var setX = self.ttlXArr[i];
			ttl.x     = setX;
			ttl.y     = 1;
			ttl.alpha = 0;
			self.ttlArr.push(ttl);
			self.body.addChild(ttl);
		};

		var breakTotal = self.txtbreaks.length;
		self.txtArr = [];
		for (var i = 6; i < self.txtTotal+6; i++) {
			var txt = new createjs.Bitmap(self.loadImgs[i]);
			self.txtArr.push(txt);
			self.body.addChild(txt);
		};
		var txtLineArr = [];
		txtLineArr[0] = [];
		txtLineArr[1] = [];
		txtLineArr[2] = [];
		txtLineArr[3] = [];
		txtLineArr[4] = [];
		txtLineArr[5] = [];
		txtLineArr[6] = [];
		txtLineArr[7] = [];
		txtLineArr[8] = [];
		;
		for (var i = 0; i < self.txtTotal; i++)
		{
			var txt = self.txtArr[i];
			if(self.txtbreaks[0] >= i)txtLineArr[0].push(txt);
			else if(self.txtbreaks[1] >= i)txtLineArr[1].push(txt);
			else if(self.txtbreaks[2] >= i)txtLineArr[2].push(txt);
			else if(self.txtbreaks[3] >= i)txtLineArr[3].push(txt);
			else if(self.txtbreaks[4] >= i)txtLineArr[4].push(txt);
			else if(self.txtbreaks[5] >= i)txtLineArr[5].push(txt);
			else if(self.txtbreaks[6] >= i)txtLineArr[6].push(txt);
			else if(self.txtbreaks[7] >= i)txtLineArr[7].push(txt);
			else txtLineArr[8].push(txt);
		}

		var txtLineTotal = txtLineArr.length;

		var count = 0;
		for (var i = 0; i < txtLineTotal; i++)
		{
			var lineDatas = txtLineArr[i];
			var total2 = lineDatas.length;
			var txtY = self.txtYArr[i];
			for (var q = 0; q < total2; q++)
			{
				var txt   = lineDatas[q];
				txt.y     = txtY;
				txt.x     = self.txtSetXArr[q];
				txt.alpha = 0;
			}
		}

		_effectApp.root.stage.addChild(self.body);
		_effectApp.root.imgComplete();
	}

	Note.prototype.move = function()
	{
		var self = this;
		var ttlToltal = self.ttlArr.length;

		for (var i = 0; i < ttlToltal; i++)
		{
			var ttl = self.ttlArr[i];
			var setX = ttl.x;
			var setY = ttl.y;
			ttl.x = setX + 10;
			ttl.y = setY - 20;

			var tween = createjs.Tween.get(ttl, {loop:false}).wait(i*100).to({x:setX,y:setY,alpha:1}, 800,createjs.Ease.getPowOut(5))
		}

		var txtToltal = self.txtArr.length;
		for (var i = 0; i < txtToltal; i++)
		{
			var txt = self.txtArr[i];
			var setX = txt.x;
			var setY = txt.y;
			txt.x = setX + 5;
			txt.y = setY - 10;

			var tween = createjs.Tween.get(txt, {loop:false}).wait(900 + i*20).to({x:setX,y:setY,alpha:1}, 1000,createjs.Ease.getPowOut(5))
		}

		setTimeout(function(){
			_effectApp.root.$readBtn.fadeIn(300);
			createjs.Ticker.removeEventListener("tick", _effectApp.root.listener);
		},5200)

	}

	Note.prototype.resize = function(wW)
	{
		var self = _effectApp.root.note;
		self.body.x = Math.floor((wW - self.body.width)/2);
	}

	var NoizBg = function(){
		//コンテナ
		this.body        = new createjs.Container();
		this.imgBox      = new createjs.Container();
		this.bgContainer = new createjs.Container();
		this.body.width  = 2000;
		this.body.height = 127 + 722 + 122;
		this.body.y = _effectApp.root.prologTop;
		this.body.x = -10;
		this.setComplete = false;

		this.noizArr = [];

		var imgsLoad = [];
		imgsLoad.push("noiz_top.png");
		imgsLoad.push("noiz_bottom.png");
		imgsLoad.push("txt_prolog.png");
		this.imgsLoadTotal = imgsLoad.length;
		this.loadImgCount = 0;
		this.loadImgs = [];
		for(var i = 0; i < this.imgsLoadTotal; i++){
			var img = new Image();
			img.parent = this;
			//img.crossOrigin = "anonymous";
			img.onload = this.imgLoad;
			img.src = '/assets/images/canvas_bg/' + imgsLoad[i];
			this.loadImgs.push(img);
		}
	};

	NoizBg.prototype.imgLoad = function() {
		var self = this.parent;
		self.loadImgCount++;
		if(self.loadImgCount >= self.imgsLoadTotal)
		{
			self.init();
		}
	}

	NoizBg.prototype.init = function()
	{
		var self = this;

		self.setW = 2000;
		var topH = 127;
		var middleH = 722;
		var bottomH = 122;
		self.setH = topH+middleH+bottomH;
		var sliseX = 70;
		var sliseY = 40;

		var sliceW = Math.floor(self.setW / sliseX);

		var sliceH = Math.floor(self.setH / sliseY);

		self.sliseTltal = sliseX * sliseY;

		var bg = new createjs.Shape();
			bg.graphics.beginFill("#FFF");
			bg.graphics.drawRect(0,0,self.setW,middleH);
			bg.y = topH;

		var bgTop      = new createjs.Bitmap(self.loadImgs[0]);
		var bgBottom   = new createjs.Bitmap(self.loadImgs[1]);
		
			bgBottom.y = topH + middleH;
			self.imgBox.addChild(bgTop);
			self.imgBox.addChild(bg);
			self.imgBox.addChild(bgBottom);

		this.prologTxt = new createjs.Bitmap(self.loadImgs[2]);
		this.prologTxt.x = 21;
		this.prologTxt.y = 147;

		var topImgDom = new Image();
		var topImg = new createjs.Bitmap();
		self.imgBox.cache(0,0,self.setW,self.setH);
		var bmd = new createjs.BitmapData.getBitmapData(self.imgBox);

		self.loadImgCount = 0;

		for (var i = 0; i < self.sliseTltal; i++) {
			self.setBitmaps(i,bmd,sliseX,sliceW,sliceH);
		};

		self.imgBox = null;
		bmd         = null;

		
		self.body.addChild(self.bgContainer);
		self.body.addChild(self.prologTxt);
		_effectApp.root.stage.addChild(self.body);

		self.setComplete = true;
		_effectApp.root.imgComplete();
	}

	NoizBg.prototype.setBitmaps = function(i,bmd,sliseX,sliceW,sliceH)
	{
		var rndm = Math.floor(Math.random()*16);
		var col = Math.floor((i%sliseX) * sliceW) - rndm;
		var row = Math.floor((i/sliseX) * sliceH) - rndm;
		var self = this;

		var bmp = new createjs.Bitmap(bmd.canvas);
		
		bmp.sourceRect = {
			x: col,
			y: row,
			width : sliceW+rndm+1,
			height: sliceH+rndm+1
		}

		var imgC  = new createjs.Container();
		imgC.regX = sliceW/2;
		imgC.regY = sliceH/2;
		// imgC.x = col + 300 - Math.floor(Math.random()*600);
		imgC.x = col + 2 - Math.floor(Math.random()*4);
		imgC.y = row + 200 + Math.floor(Math.random()*300);

		rndm = Math.floor(Math.random()*7);
		if(rndm == 0 || rndm == 1 || rndm == 2 || rndm == 3 || rndm == 4)
		{
			imgC.scaleX  = 0;
			imgC.scaleY  = 0;
		}else if(rndm == 5)
		{
			imgC.scaleX  = Math.random()*0.9;
			imgC.scaleY  = Math.random()*0.7;
		}else if(rndm == 6)
		{
			imgC.scaleX  = 0.5;
			imgC.scaleY  = 1.4;
		}else
		{
			imgC.scaleX  = -0.1;
			imgC.scaleY  = 0.5;
		}
		
		imgC.rotation= 80 - (Math.random()*160);

		imgC.alpha = 0;

		imgC.addChild(bmp);
		self.bgContainer.addChild(imgC);

		var addData = [];
		addData[0] = imgC;
		addData[1] = col;
		addData[2] = row;
		addData[3] = bmp;
		self.noizArr.push(addData);
	}

	NoizBg.prototype.setAnimate = function()
	{
		var self = this;
		var total = self.noizArr.length;
		self.loadImgCount = 0;
		for (var i = 0; i < total; i++) {
			var data = self.noizArr[i];
			var imgC = data[0];
			var setX = data[1];
			var setY = data[2];
			self.setAnimateMove(imgC,setX,setY,i)
		}

		setTimeout(function(){_effectApp.root.note.move()},1800)
		_effectApp.root.listener = createjs.Ticker.addEventListener("tick", function(){_effectApp.root.handleTick()});
	}

	NoizBg.prototype.setAnimateMove = function(c,x,y,i)
	{
		var self = this;
		setTimeout(function(){
			var timeline = new createjs.Timeline([], { start: 0 }, { paused: true });
			timeline.addTween(
				createjs.Tween.get(c, {loop:false}).to({alpha:1}, 300,createjs.Ease.getPowOut(3)),
				createjs.Tween.get(c, {loop:false}).to({x:x,y:y}, 1000,createjs.Ease.getPowInOut(3)),
				createjs.Tween.get(c, {loop:false}).to({scaleX:1,scaleY:1,rotation:0}, 1200,createjs.Ease.getPowOut(2)).call(self.moveComplete)
			)
			timeline.gotoAndPlay();

		},300-Math.floor(Math.random()*600))
	}

	NoizBg.prototype.moveComplete = function() {
		var self = _effectApp.root.noizBg;
		self.loadImgCount++;
		if(self.loadImgCount >= self.sliseTltal)
		{
			self.bgContainer.cache(-20,-20,self.setW+20,self.setH+20);
			var bmd = new createjs.BitmapData.getBitmapData(self.bgContainer);
			var bmp = new createjs.Bitmap(bmd.canvas);

			self.bgContainer.removeAllChildren();
			self.bgContainer.addChild(bmp);

			var total = self.noizArr.length;
			self.loadImgCount = 0;
			for (var i = 0; i < total; i++) {
				var data = self.noizArr[i];
				var imgC = data[0];
				var bmp = data[3];
				bmp = null;
				imgC = null;
			}
			self.noizArr = [];
		}
	}

	NoizBg.prototype.resize = function(wW) {
		var self = _effectApp.root.noizBg;
		self.bgContainer.x = Math.floor((wW - self.body.width)/2);
	}

	Index.prototype.resize = function()
	{
		var self = this;
		var wW = window.innerWidth;
		self.canvas.width = wW;
		self.noizBg.resize(wW);
		self.note.resize(wW);
		_effectApp.root.stage.update();
	}

	/********************************
	          レンダリング処理
	********************************/
	Index.prototype.handleTick = function() 
	{
		_effectApp.root.stage.update();
	}

	Index.prototype.setglitchTimer = function()
	{
		var self = this;
	}
	

	_effectApp.Index=Index;
})();
