var SceneRevive = function ()
{
	SceneRevive.instance = this;

	this.create();
};

SceneRevive.instance = null;

SceneRevive.prototype = {

	create: function ()
	{
		grpSceneRevive = game.add.group();
		grpSceneRevive.name = 'grpSceneRevive';
		grpSceneRevive.visible = false;


		imgReviveOverlay = createFullscreenOverlay('blank_black');
		grpSceneRevive.add(imgReviveOverlay);


		imgReviveBG = grpSceneRevive.add(CreateBoardSpr(0, 0, 400, 300, 'pak1', 'okno_01', 0.5, 0.5));

		// REVIVE title
		txtReviveRevive = createText(0, 0, STR("Revive"), 60, 'font_red');
		grpSceneRevive.add(txtReviveRevive);
		txtReviveRevive.anchor.set(getCorrectAnchorX(txtReviveRevive, 0.5), getCorrectAnchorY(txtReviveRevive, 0.5));

		// LIVES: +1
		txtReviveLives = createText(0, 0, STR("Lives")+": +1", 45, 'font_blue_2');
		grpSceneRevive.add(txtReviveLives);
		txtReviveLives.anchor.set(getCorrectAnchorX(txtReviveLives, 0.5), getCorrectAnchorY(txtReviveLives, 0.5));


		// Resume btn
		btnReviveRevive = CreateBoardSpr(0, 0, imgReviveBG.width * 0.7, 100, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpSceneRevive.add(btnReviveRevive);
		AddButtonEvents(btnReviveRevive, this.OnPressedRevive, ButtonOnInputOver, ButtonOnInputOut);

		txtRevivePrice = AddTextToObject(btnReviveRevive, '30', 70, 'font_yellow');
		txtRevivePrice.x = -25;

		imgReviveCoin = game.add.sprite(65, 0, 'pak1', 'minca');
		btnReviveRevive.addChild(imgReviveCoin);
		imgReviveCoin.anchor.set(0.5);
		imgReviveCoin.setScaleMinMax(1.7, 1.7, 1.7, 1.7);
		// Settings btn
		/*btnPauseSettings = CreateBoardSpr(0, 0, imgPauseBG.width * 0.7, 70, 'pak1', 'tlacidlo_01', 0.5, 0.5);
		grpScenePause.add(btnPauseSettings);
		AddButtonEvents(btnPauseSettings, this.OnPressedSettings, ButtonOnInputOver, ButtonOnInputOut);
		AddTextToObject(btnPauseSettings, STR("SETTINGS"));*/

		// Menu btn
		btnReviveExit = grpSceneRevive.create(0, 0, 'pak1', 'tlacidlo_13');
		btnReviveExit.anchor.set(0.5);
		grpSceneRevive.add(btnReviveExit);
		AddButtonEvents(btnReviveExit, this.OnPressedExit, ButtonOnInputOver, ButtonOnInputOut);

		spaceKey.onDown.add(function ()
		{
			if (grpSceneRevive.visible && ScenesTransitions.transitionActive==false)
			{
				SceneRevive.instance.OnPressedRevive();
			}
		});

		this.onResolutionChange();
	},

	onResolutionChange: function ()
	{
		imgReviveBG.reset(game.world.centerX, game.world.centerY);

		btnReviveRevive.reset(game.world.centerX, imgReviveBG.y + 80);

		btnReviveExit.reset(imgReviveBG.x + imgReviveBG.width / 2 - 10, imgReviveBG.y - imgReviveBG.height / 2 + 10);

		imgReviveOverlay.position.setTo(game.world.centerX, game.world.centerY);
		imgReviveOverlay.width = game.width * 3;
		imgReviveOverlay.height = game.height * 3;

		txtReviveRevive.reset(imgReviveBG.x, imgReviveBG.y - 80);
		txtReviveLives.reset(imgReviveBG.x, imgReviveBG.y - 15);
	},


	OnPressedExit: function ()
	{
		game.time.gameResumed();

		soundManager.playSound("click");

		SceneRevive.instance.HideAnimated();
		SceneGame.instance.endGame(false);

		/*SceneGame.instance.DoCleanup();
		SceneMenu.instance.ShowAnimated();*/
	},
	OnPressedRevive: function ()
	{
		soundManager.playSound('click');
		if (balance >= 30)
		{
			SceneFlash.instance.Flash(function ()
			{
				balance -= 30;
				SceneBalance.instance.updateText();
				playerAlive = true;
				gameRunning = true;
				game.time.gameResumed();

				lives++;
				txtLivesValue.text = lives;


				player.setSpeed(1);

				player.setInvincible(600);
				SceneRevive.instance.HideAnimated();
			}, 300,0,0.6,'blank_blue');

		}

	},
	ShowAnimated: function ()
	{
		this.onResolutionChange();
		game.time.gamePaused();
		game.physics.p2.pause();

		ScenesTransitions.transitionStarted();
		ScenesTransitions.showSceneAlpha(grpSceneRevive, 0, ScenesTransitions.TRANSITION_LENGTH * 1.8, ScenesTransitions.transitionFinished);
	},

	HideAnimated: function ()
	{
		ScenesTransitions.transitionStarted();
		game.time.gameResumed();
		game.physics.p2.resume();

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

		ScenesTransitions.hideSceneAlpha(grpSceneRevive, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

	}

}