var tutorialWantedSpeedDirection = 1;
var tutorialTweens = [];
var inTutorialPhase = false;
var level3TutorialEnemyShip = null;
var SceneTutorial = function ()
{
	SceneTutorial.instance = this;
	this.create();
};
SceneTutorial.instance = null;

SceneTutorial.prototype = {

	create: function ()
	{
		grpSceneTutorial = game.add.group();
		grpSceneTutorial.visible = false;
		grpSceneTutorial.name = "grpSceneTutorial";

		this.buttonDownDuration = 0;

		// AVOID text above enemy
		txtTutorialAvoid = createText(0, 0, STR("Avoid"), [40, 30], 'font_red');
		grpSceneTutorial.add(txtTutorialAvoid);
		txtTutorialAvoid.anchor.set(getCorrectAnchorX(txtTutorialAvoid, 0.5), getCorrectAnchorY(txtTutorialAvoid, 0.5));
		txtTutorialAvoid.alpha = 0;

		imgTutorialOverlay = createFullscreenOverlay('blank_black');
		grpSceneTutorial.add(imgTutorialOverlay);
		imgTutorialOverlay.visible = false;

		imgTutorialWindow = grpSceneTutorial.add(CreateBoardSpr(0, 0, 400, 300, 'pak1', 'okno_01', 0.5, 0.5));
		imgTutorialWindow.visible = false;
		// TUTORIAL title
		txtTutorialText = createText(0, 0, "{tut instructions}", 30, 'font_yellow');
		txtTutorialText.wordWrap = true;
		txtTutorialText.maxWidth = txtTutorialText.wordWrapWidth = 380;

		txtTutorialText.align = 'center';
		imgTutorialWindow.addChild(txtTutorialText);
		txtTutorialText.anchor.set(getCorrectAnchorX(txtTutorialText, 0.5), getCorrectAnchorY(txtTutorialText, 0.5));

		btnTutorialOK = CreateBoardSpr(0, 220, 200, 100, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		imgTutorialWindow.addChild(btnTutorialOK);
		AddButtonEvents(btnTutorialOK, this.OnPressedOK, ButtonOnInputOver, ButtonOnInputOut);
		AddTextToObject(btnTutorialOK, 'OK', 50, 'font_yellow');


		txtTutorialHint = createText(0, 0, STR('TUTORIAL_1_1'), [30, 22], 'font_blue');
		grpSceneTutorial.add(txtTutorialHint);
		txtTutorialHint.align = 'right';
		txtTutorialHint.anchor.set(getCorrectAnchorX(txtTutorialHint, 1), getCorrectAnchorY(txtTutorialHint, 0.5));
		//txtTutorialHint.alpha = 0;
		txtTutorialHint.alpha = 0;


		this.firstEnemy = null;

		var pressOkFunction = function ()
		{
			if (imgTutorialWindow.visible && ScenesTransitions.transitionActive == false)
			{
				SceneTutorial.instance.OnPressedOK();
			}
		};
		spaceKey.onDown.add(pressOkFunction);

		this.onResolutionChange();
	},
	onResolutionChange: function ()
	{
		imgTutorialOverlay.position.set(game.world.centerX, game.world.centerY);
		imgTutorialOverlay.width = game.width * 5;
		imgTutorialOverlay.height = game.height * 5;

		imgTutorialWindow.position.set(game.world.centerX, game.world.centerY);

		if (level3TutorialEnemyShip != null && currentLevel == 2)
		{
			level3TutorialEnemyShip.vall = (GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE ? -Math.PI / 2 : 0);

			player.vall = (GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE ? -Math.PI / 2 : 0);

		}
	},
	OnPressedOK: function ()
	{
		soundManager.playSound('click');
		game.time.gameResumed();
		game.physics.p2.resume();

		gameRunning = true;

		ScenesTransitions.hideSceneAlpha(imgTutorialOverlay, 0, 200);
		ScenesTransitions.hideSceneAlpha(imgTutorialWindow, 0, 200);
		if (currentLevel == 0)
		{
			sceneTutorial.firstEnemy = enemySpawner.spawnEnemy();

			sceneTutorial.showAndHideAvoidText();
		}
		if (currentLevel == 1)
		{
			objectiveManager.setNewObjective(currentLevel);
		}
		SceneGame.instance.OnReleasedDown(true);
		SceneGame.instance.OnReleasedUp(true);
	},
	showPopup: function (text)
	{
		SceneGame.instance.OnReleasedDown(true);
		SceneGame.instance.OnReleasedUp(true);

		txtTutorialText.text = text;
		game.time.gamePaused();
		game.physics.p2.pause();

		gameRunning = false;

		ScenesTransitions.showSceneAlpha(imgTutorialOverlay, 0, 200, function ()
		{
		}, 0.8);
		ScenesTransitions.showSceneAlpha(imgTutorialWindow, 0, 200);
	},
	EndTutorialPhase: function ()
	{
		game.physics.p2.resume();

		game.time.gameResumed();

		backgroundSpeedMultiplier = 1;

		inTutorialPhase = false;
		if (currentLevel >= 2)
		{
			btnGameShoot.alpha = 1;
			SceneGame.instance.toggleShootButton(true);
		}

		ScenesTransitions.showSceneAlpha(txtGameObjectiveValue, 0, 200);
		ScenesTransitions.showSceneAlpha(txtGameObjectiveName, 0, 200);

		canSpawnCoin = true;
	},
	StopTweens: function ()
	{

		tutorialTweens.forEach(function (tween)
		{
			tween.stop();
		});
		tutorialTweens = [];

		btnGameShoot.alpha = 1;

	},
	OnGameStarted: function ()
	{
		hasShotFirstTutorialShot = false;
		grpSceneTutorial.visible = true;
		txtTutorialAvoid.alpha = 0;
		txtTutorialHint.alpha = 0;
		inTutorialPhase = true;

		imgTutorialOverlay.visible = false;
		imgTutorialWindow.visible = false;

		if (currentLevel == 0)
		{
			tutorialWantedSpeedDirection = 1;
			SceneTutorial.instance.OnLevel1Started();
		}
		if (currentLevel == 1)
		{
			SceneTutorial.instance.OnLevel2Started();
		}
		if (currentLevel == 2)
		{
			SceneTutorial.instance.OnLevel3Started();
		}
	},
	OnLevel1Started: function ()
	{
		SceneGame.instance.toggleShootButton(false);
		btnGameShoot.inputEnabled = false;

		btnGameDown.visible = false;
		btnGameDown.inputEnabled = false;

		btnGameUp.visible = false;

		ScenesTransitions.hideSceneAlpha(txtGameObjectiveValue, 0, 200);
		ScenesTransitions.hideSceneAlpha(txtGameObjectiveName, 0, 200);

		game.time.events.add(Phaser.Timer.SECOND, function ()
		{
			ScenesTransitions.showSceneAlpha(btnGameUp, 0, 200);
			ScenesTransitions.showSceneAlpha(txtTutorialHint, 0, 200);

			btnGameUp.inputEnabled = true;
			// "Hold to speed up" hint text
			txtTutorialHint.text = STR('TUTORIAL_1_1');
			txtTutorialHint.align = 'right';
			txtTutorialHint.position.set(btnGameUp.x - 80, btnGameUp.y);
		});
	},

	OnLevel2Started: function ()
	{
		SceneGame.instance.toggleShootButton(false);

		ScenesTransitions.hideSceneAlpha(txtGameObjectiveValue, 0, 200);
		ScenesTransitions.hideSceneAlpha(txtGameObjectiveName, 0, 200);

		game.time.events.add(Phaser.Timer.SECOND * 2, function ()
		{
			if (grpSceneMenu.visible)
			{
				return;
			}
			enemySpawner.spawnPowerUpShield();
			game.time.events.add(Phaser.Timer.SECOND, function ()
			{
				if (grpSceneMenu.visible)
				{
					return;
				}

				sceneTutorial.showPopup(STR('TUTORIAL_2_1'));//"A SHIELD on the enemy orbit.\nCATCH IT - protect yourself");
			});
		});
	},
	OnLevel3Started: function ()
	{

		ScenesTransitions.hideSceneAlpha(txtGameObjectiveValue, 0, 200);
		ScenesTransitions.hideSceneAlpha(txtGameObjectiveName, 0, 200);

		btnGameDown.inputEnabled = true;
		btnGameUp.inputEnabled = true;


		SceneGame.instance.toggleShootButton(true);
		btnGameShoot.inputEnabled = false;

		level3TutorialEnemyShip = null;
		game.time.events.add(Phaser.Timer.SECOND * 2, function ()
		{
			enemySpawner.spawnPowerUpAmmo();
			game.time.events.add(Phaser.Timer.SECOND, function ()
			{
				sceneTutorial.showPopup(STR('TUTORIAL_3_1'));//"A SHOT on the enemy orbit.\nCATCH IT and use it against your enemies");
			});
		});
	},
	OnLevel2ShieldCaught: function ()
	{
		objectiveManager.setNewObjective(currentLevel);
		objectiveManager.UpdateTexts();

		sceneTutorial.EndTutorialPhase();

		var timer1 = game.time.create(false);

		allDelayedSpawnTimers.push(timer1);

		timer1.add(Phaser.Timer.SECOND * 2, function ()
		{
			enemySpawner.spawnEnemy();
		});
		timer1.add(Phaser.Timer.SECOND * 3, function ()
		{
			enemySpawner.spawnPowerUpShield();
		});
		timer1.add(Phaser.Timer.SECOND * 5, function ()
		{
			enemySpawner.spawnEnemy();
		});
		timer1.add(Phaser.Timer.SECOND * 6, function ()
		{
			enemySpawner.spawnEnemy();
		});

		timer1.start();
	},
	OnLevel3PickedUpAmmo: function ()
	{
		SceneGame.instance.toggleShootButton(true);

		game.time.events.add(100, function ()
		{

			level3TutorialEnemyShip = enemySpawner.spawnEnemy((GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE ? -Math.PI / 2 : 0));

			level3TutorialEnemyShip.speedMultiplier = 0;
		});
	},
	OnLevel3PressedFirstShoot: function ()
	{
		hasShotFirstTutorialShot = true;
		player.setSpeed(1);

		btnGameUp.inputEnabled = true;
		btnGameDown.inputEnabled = true;

		sceneTutorial.StopTweens();
		LOG("TUT END");
		//- move this to, on shot object enemy, if enemy is first shot too.

		enemySpawner.startSpawning();

		sceneTutorial.EndTutorialPhase();
	},
	update: function ()
	{
		if (currentLevel == 0)
		{
			if (((player.speedMultiplier > 1 && tutorialWantedSpeedDirection == 1) || (player.speedMultiplier < 1 && tutorialWantedSpeedDirection == -1)) && txtTutorialHint.alpha == 1)
			{
				sceneTutorial.buttonDownDuration++;
			}
			else
			{
				sceneTutorial.buttonDownDuration = 0;
			}

			if (sceneTutorial.buttonDownDuration > game.time.fps)
			{
				sceneTutorial.buttonDownDuration = 0;

				tutorialWantedSpeedDirection = -1;

				if (!btnGameDown.visible)
				{
					SceneGame.instance.OnReleasedUp(true);
					btnGameUp.inputEnabled = false;
					ScenesTransitions.showSceneAlpha(btnGameDown, 0, 200);
					btnGameDown.inputEnabled = true;

					txtTutorialHint.text = STR('TUTORIAL_1_2');
					txtTutorialHint.align = 'right';
					txtTutorialHint.position.set(btnGameDown.x - 80, btnGameDown.y);
				}
				else if (!btnGameUp.inputEnabled)
				{
					txtTutorialHint.alpha = 0;

					btnGameUp.inputEnabled = true;
					btnGameDown.inputEnabled = true;

					SceneGame.instance.OnReleasedDown(true);
					objectiveManager.setNewObjective(currentLevel);

					sceneTutorial.showPopup(STR('AVOID_ENEMIES'));
				}
			}

			if (sceneTutorial.firstEnemy != null && sceneTutorial.firstEnemy.active)
			{
				txtTutorialAvoid.position.setTo(sceneTutorial.firstEnemy.sprite.x, sceneTutorial.firstEnemy.sprite.y - 60);
			}
			else
			{
				txtTutorialAvoid.position.setTo(-100, -100);
			}
		}
		if (currentLevel == 2)
		{
			var wrap = wrapRadians(player.vall);

			if (((GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE && wrap >= 4.7 && wrap <= 5) || (GAME_CURRENT_ORIENTATION == ORIENTATION_PORTRAIT && wrap <= 0.5)) &&
				!hasShotFirstTutorialShot &&
				level3TutorialEnemyShip != null &&
				level3TutorialEnemyShip.active)
			{
				player.setSpeed(0, true);
				player.vall = (GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE ? -Math.PI / 2 : 0);

				if (btnGameShoot.inputEnabled == false)
				{
					backgroundSpeedMultiplier = 0;
					btnGameShoot.inputEnabled = true;


					btnGameShoot.alpha = 1;
					tutorialTweens.push(game.add.tween(btnGameShoot).to({
						alpha: 0
					}, 400, Phaser.Easing.Cubic.InOut, true, 0, -1, true));

					btnGameUp.inputEnabled = false;
					btnGameDown.inputEnabled = false;
				}
			}
		}
	},
	showAndHideAvoidText: function ()
	{
		txtTutorialAvoid.alpha = 0;
		game.add.tween(txtTutorialAvoid).to({
			alpha: 1
		}, 400, Phaser.Easing.Cubic.InOut, true, 0);
		var fadeoutTween = game.add.tween(txtTutorialAvoid).to({
			alpha: 0
		}, 600, Phaser.Easing.Cubic.InOut, true, 6000);
	},
	ShowAnimated: function ()
	{
		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
		ScenesTransitions.showSceneAlpha(grpSceneTutorial, 0, ScenesTransitions.TRANSITION_LENGTH + 10, ScenesTransitions.transitionFinished);
	},
	HideAnimated: function ()
	{
		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
		ScenesTransitions.hideSceneAlpha(grpSceneTutorial, 0, ScenesTransitions.TRANSITION_LENGTH + 10, ScenesTransitions.transitionFinished);
	},
}
