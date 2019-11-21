/**
 * Created by echovanec on 10. 12. 2014.
 */

/** @constructor */
var Preloader = function (game)
{
}
var loaderPosY;
var preloadState;

Preloader.prototype = {

	preload: function ()
	{
		sceneLanguages = null;
		startTime = Date.now();
        
		this.game.stage.backgroundColor = 0xffffff;// 0x000000;
		preloadState = this;

		loaderPosY = this.game.world.height / 5 * 4.5;
		imgSplashBackground = game.add.tileSprite(0, 0, game.width, game.height,'pozadie_blur');
        



		imgBtn = this.game.add.sprite(game.width / 2, game.height / 2, 'void');
		imgBtn.anchor.set(0.5);
		imgBtn.scale.x = (game.width / 100) + 0.2;
		imgBtn.scale.y = (game.height / 100) + 0.2;

		imgBackgroundPreload = game.add.tileSprite(0, 0, game.width, game.height, 'pozadie_blur');
		imgBackgroundPreload.anchor.set(0.5);

		new Languages();
		imgSplash = this.game.add.sprite(game.width / 2, game.height / 2, "logo");
		imgSplash.anchor.x = 0.5;
		imgSplash.anchor.y = 0.5;


		percentageText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 150, "0 %", {
			font: '55px ' + GAME_FONT,
			fill: '#000000'
		});
		percentageText.anchor.set(0.5);

		this.game.load.onFileComplete.add(this.fileComplete, this);

		loadImages(this.game);

		RUNNING_ON_WP = (navigator.userAgent).indexOf("Windows Phone") > -1;
		if (!RUNNING_ON_WP)
		{
			loadSounds(this.game);
		}
		this.loadLanguageSettings();

		//this._create();

		window.addEventListener("resize", onScaleChange);

		function onScaleChange()
		{
			//PPS_USE-INLOGICleaderboard
			/*
			var leftX = (window.innerWidth - (resolutionX/ resolutionY) * window.innerHeight) >> 1;
			if (leftX < 0){
			leftX = 0;
			}
			INLOGIC_LEADERBOARD.setLeaderboardBtnPosition(leftX);
			//PPS_USE-INLOGICleaderboard
			*/

		}

		onScaleChange();
		preloadState.onResolutionChange();
	},

	fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles)
	{
		//LOG(progress + ' %');
		percentageText.text = progress + " %";
		if (progress >= 100)
		{
			this._create();
		}
	},

	_create: function ()
	{
		//game.add.tween(this.loadingBar).to( { alpha : 0 }, 500, ANIMATION_CUBIC_IO, true, 0, 0, false);
		//this.startGame();

		imgBtn.inputEnabled = true;
		imgBtn.events.onInputDown.add(this.inputListener, this);

		//this.continueText = this.game.add.text(this.game.world.centerX, loaderPosY + 2, START_TEXT[language], { font: '25px Arial', fill:'#FFFFFF'});
		//this.continueText.anchor.set(getCorrectAnchorX(this.continueText, 0.5));

		game.add.tween(percentageText).to({alpha: 0}, ScenesTransitions.TRANSITION_LENGTH * 1.4, "Linear", true, ScenesTransitions.TRANSITION_LENGTH * 3, -1, true);

		var timeDelta = Date.now() - startTime;

		if (timeDelta < 2000)
		{
			game.time.events.add(2000 - timeDelta, function ()
			{
				this.startGame();
			}, this);
		}
		else
		{
			this.startGame();
		}

		//this.startGame();

		//PPS_USE-INLOGICleaderboard
		/*
		INLOGIC_LEADERBOARD.logToSocialNet();
		INLOGIC_LEADERBOARD.getMyHighScore(function(score){topScore = score;}, this);
		//PPS_USE-INLOGICleaderboard
		*/
	},

	createMenuText: function (x, y, text)
	{
		var txtObj = new Phaser.Text(game, x, y, text, {fill: '#FED87F'});
		txtObj.anchor.x = getCorrectAnchorX(txtObj, 0.5);
		txtObj.anchor.y = getCorrectAnchorY(txtObj, 0.5);
		txtObj.shadowOffsetX = 3;
		txtObj.shadowOffsetY = 3;
		txtObj.shadowColor = '#660000';

		return txtObj;
	},

	loadLanguageSettings: function ()
	{
		/*
		try {
			storedData = localStorage.getItem('plck-lang');
			if (storedData != null) {
				parsedData = JSON.parse(storedData);

				if (parsedData != null) {
					parsedData = parseInt(parsedData);
					if (parsedData >= 0 && parsedData < LANGUAGES_COUNT) {
						language = parsedData;
						languageLoaded = true;
					} else {
						language = LANGUAGE_EN;
					}
				}
			}
		}catch (err) {
			language = LANGUAGE_EN;
		}
		*/

		Languages.instance.language = "en";

		var systemLanguage = navigator.userLanguage || navigator.language;

		if (systemLanguage == "fr")
		{
			Languages.instance.language = "fr";
		}
		if (systemLanguage == "it")
		{
			Languages.instance.language = "it";
		}
		if (systemLanguage == "de")
		{
			Languages.instance.language = "de";
		}
		if (systemLanguage == "es")
		{
			Languages.instance.language = "es";
		}
		if (systemLanguage == "pt")
		{
			Languages.instance.language = "pt";
		}
	},

	//update: function () {
	//    this.fpsText.text = this.game.time.fps;
	//},

	inputListener: function ()
	{
		this.startGame();
	},

	startGame: function ()
	{
		if (sceneLanguages != null)
		{
			return;
		}

		imgBtn.inputEnabled = false;
		imgBtn.events.onInputDown.dispose();
		this.game.world.remove(imgSplash);
		this.game.world.remove(imgBtn);

		ScenesTransitions.hideSceneAlpha(percentageText);
		ScenesTransitions.hideSceneAlpha(imgSplashBackground);
/*
		Languages.instance.language = 'en';
		game.state.start('GameState');
*/
		sceneLanguages = new SceneLanguages();
		sceneLanguages.ShowAnimated();
	},

	onResolutionChange: function ()
	{

		imgBackgroundPreload.position.setTo(game.width>>1,game.height>>1);


		imgBackgroundPreload.width = game.width;
		imgBackgroundPreload.height = game.height;


		loaderPosY = this.game.world.height / 5 * 4.5;

		imgSplash.reset(game.width / 2, game.height / 2);

		imgBtn.position.setTo(game.width / 2, game.height / 2);
		imgBtn.scale.x = (game.width / 100) + 0.2;
		imgBtn.scale.y = (game.height / 100) + 0.2;

		percentageText.position.setTo(this.game.world.centerX, this.game.height - 50);

		if (sceneLanguages !== undefined)
		{
			if (sceneLanguages != null)
			{
				sceneLanguages.onResolutionChange();
			}
		}
	}
}