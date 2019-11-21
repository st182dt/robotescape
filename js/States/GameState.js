var GameState = function (game)
{
};

var gameState = null;
GameState.prototype = {

	preload: function ()
	{

	},

	create: function ()
	{
        
		//game.add.plugin(Phaser.Plugin.Debug);

		game.stage.backgroundColor = "#ffffff";
		game.time.advancedTiming = true;
		game.time.desiredFps = 60;
		//game.renderer.renderSession.roundPixels = true;
		//this.game.plugins.add(Phaser.Plugin.Debug);
		//game.time.slowMotion = 5;
		gameState = this;

		game.physics.startSystem(Phaser.Physics.P2JS);
		//game.physics.p2.setBoundsToWorld(false, false, false, false);


		// input
		upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		upKeyReady = true;
		downKeyReady = true;
		///

		levelsData = JSON.parse(game.cache.getText('data'));
		soundManager = new SoundManager(game);
		objectiveManager = new ObjectiveManager();
		objectiveManager.setNewObjective(0);

		soundManager.create();

		scenes = [];
		GameData.Load();
        scenes.push(new SceneBackground());
        scenes.push(new SceneHra());
        popup = new ScenePopup();
        scenes.push(popup);


		//soundManager.playMusic("game_music");


		if (lastDayPlayed != new Date().getDay()) // todo remove 'true'
		{

			//SceneDailyReward.instance.ShowAnimated();
		}
		lastDayPlayed = new Date().getDay();

        SceneHra.instance.ShowAnimated();
        
		//SceneMenu.instance.ShowAnimated();
		//SceneBalance.instance.ShowAnimated();


		game.onPause.add(this.onGamePause, this);
		game.onResume.add(this.onGameResume, this);

		analyticsOnMainMenuLoadEvent();

		resizeCounter = 0;
		updateFunctions = [];

		scenes.forEach(function (scene)
		{
			if (typeof scene.update === 'function')
			{
				updateFunctions.push(scene.update);
			}
		});
		gameState.onResolutionChange();
		game.time.events.add(1000, function ()
		{
			gameState.onResolutionChange();
		});

		//------------------------------------------------
	},

	update: function ()
	{

		if (!gamePaused)
		{
			FPS = game.time.fps;
			if(FPS<6){
				FPS=60;
			}
		}
		else
		{
			FPS = 60;// iba ak je paused
		}

		/*if(FPS<=30){
			LOG("fps:"+FPS);
		}*/


		resizeCounter++;
		if (resizeCounter % 20 == 0)
		{
			SceneHra.instance.onResolutionChange();
			//gameState.onResolutionChange();
		}
		updateFunctions.forEach(function (updateFunction)
		{
			updateFunction();
		});

	},

	updateTexts: function ()
	{
		scenes.forEach(function (scene)
		{
			if (typeof scene.updateTexts === 'function')
			{
				scene.updateTexts();
			}
		});
	},

	onResolutionChange: function ()
	{
		LOG("RESOLUTION CHANGE");

		scenes.forEach(function (scene)
		{
			if (typeof scene.onResolutionChange === 'function')
			{
				scene.onResolutionChange();
			}
		});
	},

	onGamePause: function ()
	{
		//game.tweens.pauseAll();
		if (Phaser.Device.desktop)
		{
			this.game.input.mspointer.stop();
		}
		//LOG('onGamePause');

		scenes.forEach(function (scene)
		{
			if (typeof scene.onPause === 'function')
			{
				scene.onPause();
			}
		});

		paused = true;
		//game.physics.p2.pause();

	},

	onGameResume: function ()
	{
		//game.tweens.resumeAll();
		if (Phaser.Device.desktop)
		{
			this.game.input.mspointer.stop();
		}		//LOG('onGameResume');

		paused = false;

		scenes.forEach(function (scene)
		{
			if (typeof scene.onResume === 'function')
			{
				scene.onResume();
			}
		});

	},

	render: function ()
	{
		scenes.forEach(function (scene)
		{
			if (typeof scene.render === 'function')
			{
				scene.render();
			}
		});
	},

	showFullscreeAd: function ()
	{
		//LOG("showFullscreeAd()");
		showDiv("adFullScreen");
	}
}

