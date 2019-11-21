/**
 * Created by echovanec on 10. 12. 2014.
 */

/** @constructor */
var Splash = function (game)
{
};

function enterIncorrectOrientation()
{
	LOG("enterIncorrectOrientation()");
	//document.getElementById("wrongRotationText").innerHTML = ROTATE_TEXT[language];
	showDiv("wrongRotation");
	if (gameState != null)
	{
		gameState.onGamePause();
	}
}

function leaveIncorrectOrientation()
{
	LOG("leaveIncorrectOrientation()");
	hideDiv("wrongRotation");
	if (gameState != null)
	{
		gameState.onGameResume();
	}
}

Splash.prototype = {
	preload: function ()
	{

		this.game.stage.backgroundColor = 0xffffff;
		game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.refresh();

		window.addEventListener("resize", function ()
		{
			onGameResize();
		});
		onGameResize();

		loadSplash(this.game);
	},

	create: function ()
	{
		this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, null);
		this.logo.visible = false;
		this.logo.anchor.set(0.5);
		this.loadContinue();
	},

	loadContinue: function ()
	{
		this.logo.inputEnabled = true;
		this.logo.events.onInputDown.add(this.startPreload, this);
		this.startPreload();
	},

	hideLogo: function ()
	{
		game.add.tween(this.logo).to({alpha: 0}, ScenesTransitions.TRANSITION_LENGTH * 3, ANIMATION_CUBIC_IO, true, 0, 0, false);
	},

	startPreload: function ()
	{
		analyticsOnGameStartEvent();
		this.game.state.start("PreloadState");
	}

};

var savedClientWidth = 0;
var savedClientHeight = 0;

function onGameResize()
{
	LOG('onGameResize()')

	//PPS_USE-ACTIPLAY
	/*
	return;
	//PPS_USE-ACTIPLAY
	*/

	if (game === null)
	{
		return;
	}

	// var w = window,
	//     d = document,
	//     e = d.documentElement,
	//     g = d.getElementsByTagName('body')[0],
	//     x = w.innerWidth || e.clientWidth || g.clientWidth,
	//     y = w.innerHeight|| e.clientHeight|| g.clientHeight;

	// fixme cekovat to len pre IOS cez window.innerHeight, window.innerWidth???

	var docWidth = document.documentElement.clientWidth;
	var docHeight = document.documentElement.clientHeight;

	if (isIOS)
	{
		//len pre landscape
		if (docWidth > docHeight)
		{
			docWidth = window.innerWidth;
			docHeight = window.innerHeight;
		}
	}
	if (docHeight > docWidth)
	{
		GAME_CURRENT_ORIENTATION = ORIENTATION_PORTRAIT;

		resolutionX = game_resolutions[GAME_CURRENT_ORIENTATION].x;
		var aspect = docHeight / docWidth;
		resolutionY = resolutionX * aspect;

		if (resolutionY < game_resolutions[GAME_CURRENT_ORIENTATION].yMin)
		{
			resolutionY = game_resolutions[GAME_CURRENT_ORIENTATION].yMin;
		}
		if (resolutionY > game_resolutions[GAME_CURRENT_ORIENTATION].yMax)
		{
			resolutionY = game_resolutions[GAME_CURRENT_ORIENTATION].yMax;
		}

	}
	else
	{
		GAME_CURRENT_ORIENTATION = ORIENTATION_LANDSCAPE;

		resolutionY = game_resolutions[GAME_CURRENT_ORIENTATION].y;
		var aspect = docWidth / docHeight;
		resolutionX = resolutionY * aspect;

		if (resolutionX < game_resolutions[GAME_CURRENT_ORIENTATION].xMin)
		{
			resolutionX = game_resolutions[GAME_CURRENT_ORIENTATION].xMin;
		}
		if (resolutionX > game_resolutions[GAME_CURRENT_ORIENTATION].xMax)
		{
			resolutionX = game_resolutions[GAME_CURRENT_ORIENTATION].xMax;
		}
	}


	/*if (((savedClientWidth == document.documentElement.clientWidth) && (savedClientHeight == document.documentElement.clientHeight)))
	{
		return;
	}*/

	savedClientWidth = docWidth;
	savedClientHeight = docHeight;



	game.canvas.id = 'gameCanvas';
	var gameCanvas = document.getElementById('gameCanvas');
	gameCanvas.style.position = 'fixed';


	game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.scale.refresh();
	game.scale.setGameSize(resolutionX, resolutionY);

	if (gameState != null)
	{
		gameState.onResolutionChange();
	}

	if (preloadState != null)
	{
		preloadState.onResolutionChange();
	}
	//PPS_USE-GAMEPIX
	/*
	if (gamepixTopSprite != null) {
		gamepixTopSprite.width = resolutionX;
		gamepixTopSprite.height = resolutionY;
	}
	//PPS_USE-GAMEPIX
	*/
	// fixme dorobit nieco co sa zavola raz pri zmene orientacie ?
}
