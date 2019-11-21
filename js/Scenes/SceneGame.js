var gameRunning = false;
var gamePaused = false;
var SceneGame = function ()
{
	SceneGame.instance = this;

	this.create();
};

SceneGame.instance = null;

SceneGame.prototype = {
	create: function ()
	{
		grpSceneGame = game.add.group();
		grpSceneGame.visible = false;

		// layer for planet,track,bullets....
		grpGameLayer1 = game.add.group();
		grpSceneGame.add(grpGameLayer1);
		// layer for orbiting objects....
		grpGameLayer2 = game.add.group();
		grpSceneGame.add(grpGameLayer2);
		// layer for asteroids,explosions,effects....
		grpGameLayer3 = game.add.group();
		grpSceneGame.add(grpGameLayer3);

		// Pause button
		btnGamePause = grpSceneGame.create(0, 0, 'pak1', 'tlacidlo_05');
		btnGamePause.anchor.set(0.5);
		AddButtonEvents(btnGamePause, this.OnPressedFromGameToPause, ButtonOnInputOver, ButtonOnInputOut);


		playerCollisionGroup = game.physics.p2.createCollisionGroup();
		bulletsCollisionGroup = game.physics.p2.createCollisionGroup();
		enemyCollisionGroup = game.physics.p2.createCollisionGroup();
		powerUpCollisionGroup = game.physics.p2.createCollisionGroup();

		// Player track
		playerTrack = new Track(PLANETS[5].sprite, grpGameLayer1);
		playerTrack.planet.position = new Phaser.Point(0, 0);
		// Enemy track
		enemyTrack = new Track(PLANETS[1 + 5].sprite, grpGameLayer1);
		enemyTrack.planet.position = new Phaser.Point(0, 0);


		// enemy spawner
		enemySpawner = new OrbitingObjectSpawner();

		// player
		player = new OrbitingObject(playerTrack, SHIPS[selectedShipIndex].sprite, ORBITING_OBJECT_TYPES.PLAYER);

		// Slow down button
		btnGameUp = game.add.sprite(0, 0, 'pak1', 'tlacidlo_03');
		btnGameUp.anchor.set(0.5);
		grpSceneGame.add(btnGameUp);
		AddButtonEvents(btnGameUp, this.OnPressedUp, ButtonOnInputOver, ButtonOnInputOut, this.OnReleasedUp);

		// Fast button
		btnGameDown = game.add.sprite(0, 0, 'pak1', 'tlacidlo_04');
		btnGameDown.anchor.set(0.5);
		grpSceneGame.add(btnGameDown);
		AddButtonEvents(btnGameDown, this.OnPressedDown, ButtonOnInputOver, ButtonOnInputOut, this.OnReleasedDown);

		// SHOOT Button/Text
		grpGameShoot = game.add.group();
		grpSceneGame.add(grpGameShoot);

		imgGameAmmo = game.add.sprite(-40, -60, 'pak1', 'kruh_strela_02');
		imgGameAmmo.anchor.set(0.5);
		grpGameShoot.add(imgGameAmmo);

		txtGameAmmo = AddTextToObject(imgGameAmmo, '0', 40);
		txtGameAmmo.anchor.set(getCorrectAnchorX(txtGameAmmo, 0.5), getCorrectAnchorY(txtGameAmmo, 0.4));


		btnGameShoot = game.add.sprite(0, 0, 'pak1', 'tlacidlo_20');
		btnGameShoot.anchor.set(0.5);
		grpGameShoot.add(btnGameShoot);
		AddButtonEvents(btnGameShoot, this.OnPressedShoot, ButtonOnInputOver, ButtonOnInputOut);

		// Gate Line
		imgGateLine = game.add.tileSprite(0, 0, 133, 2, 'pak1', 'brana_ciara_01');
		grpGameLayer1.add(imgGateLine);
		//imgGateLine = grpGameLayer1.create(0, 0, 'brana_ciara_01');
		imgGateLine.anchor.set(0.5);

		// Gate Left
		imgGateLeft = grpGameLayer1.create(0, 0, 'pak1', 'brana_satelit_01');
		imgGateLeft.anchor.set(1, 0.5);
		// Gate Right
		imgGateRight = grpGameLayer1.create(0, 0, 'pak1', 'brana_satelit_01');
		imgGateRight.anchor.set(1, 0.5);

		var easing = Phaser.Easing.Linear.None;
		gateLeftTween = game.add.tween(imgGateLeft.anchor).to({x: 1.2}, 2000, easing, true, 0, -1, true);
		gateRightTween = game.add.tween(imgGateRight.anchor).to({x: 1.2}, 2000, easing, true, 0, -1, true);

		var maxWidth = imgGateLine.width * 1.2;
		gateLineTween = game.add.tween(imgGateLine).to({width: maxWidth}, 2000, easing, true, 0, -1, true);

		imgAfterCoin = grpGameLayer1.create(0, 0, null);
		imgAfterCoin.visible = false;
		imgAfterCoin.anchor.set(0.5);

		game.physics.p2.enable(imgAfterCoin);
		imgAfterCoin.body.setCollisionGroup(enemyCollisionGroup);
		imgAfterCoin.body.collides(playerCollisionGroup);
		imgAfterCoin.body.data.shapes[0].sensor = true;

		imgAfterCoin.body.onEndContact.add(function ()
		{
			if (!playerAlive)
			{
				return;
			}

			if (imgCoin.visible === false && canSpawnCoin)
			{
				SceneGame.instance.activateCoin();
			}


		}, {imgAfterCoin: imgAfterCoin});

		txtGamePlusOneCoin = createText(0, 0, '+1', 40, 'font_yellow');
		txtGamePlusOneCoin.alpha = 0;
		grpGameLayer3.add(txtGamePlusOneCoin);

		imgCoin = grpGameLayer1.create(0, 0, 'pak1', 'minca');
		imgCoin.visible = false;
		imgCoin.anchor.set(0.5);

		game.physics.p2.enable(imgCoin);
		imgCoin.body.setCollisionGroup(enemyCollisionGroup);
		imgCoin.body.collides(playerCollisionGroup);
		imgCoin.body.data.shapes[0].sensor = true;

		imgCoin.body.onBeginContact.add(function ()
		{

			if (!playerAlive)
			{
				return;
			}
			objectiveManager.onLoop();

			if (!this.coin.visible)
			{
				return;
			}

			soundManager.playSound('minca');

			this.coin.body.static = true;
			this.coin.visible = false;
			coinsCollectedThisGame++;

			var balanceToAdd = Math.floor(loopsCompletedThisGame / 10) + 1;
			if (loopsCompletedThisGame > 40)
			{
				balanceToAdd = 5;
			}
			balance += balanceToAdd;

			SceneGame.instance.spawnPlusOneText(this.coin.x, this.coin.y, '+' + balanceToAdd);

			SceneBalance.instance.updateText();


		}, {coin: imgCoin});


		/*bmd = game.make.bitmapData(imgGateLine.width, imgGateLine.height);
		var a = game.add.sprite(300, 300, bmd);
		a.anchor.set(0.5);*/

		// Gate Line Mask
		/*imgGateLineMask = game.make.sprite(100, 0, 'gradient_01');
		imgGateLineMask.anchor.set(0.5);
		imgGateLineMask.scale.set(2);*/
		//imgGateLine.mask = imgGateLineMask;

		// lives window
		imgGameLivesWindow = grpSceneGame.add(CreateBoardSpr(0, 0, 190, 60, 'pak1', 'okno_01_small', 0.5, 0.5));
		AddTextToObject(imgGameLivesWindow, STR("Lives"), [30,25], 'font_blue');
		imgGameLivesWindow.text.x = -15;
		imgGameLivesWindow.text.fill = '#2c68a4';
		txtLivesValue = AddTextToObject(imgGameLivesWindow, "1", 30);
		txtLivesValue.x = 45;


		txtGameObjectiveValue = createText(0, 390, '4', 70, 'font_red');
		grpGameLayer1.add(txtGameObjectiveValue);
		txtGameObjectiveValue.anchor.set(getCorrectAnchorX(txtGameObjectiveValue, 0.5), getCorrectAnchorY(txtGameObjectiveValue, 1));

		txtGameObjectiveName = createText(0, 385, STR('Eliminate'), 30, 'font_red');
		grpGameLayer1.add(txtGameObjectiveName);

		txtGameObjectiveName.anchor.set(getCorrectAnchorX(txtGameObjectiveName, 0.5), getCorrectAnchorY(txtGameObjectiveName, 0));

		// INPUT
		document.addEventListener("keydown", function (e)
		{
			SceneGame.instance.OnKeyDown(e);
		});
		document.addEventListener("keyup", function (e)
		{
			SceneGame.instance.OnKeyUp(e);
		});


		this.onResolutionChange();
	},

	/*checkVeg: function (body1, body2)
	{
		LOG(body1.sprite.name+"x");


			return false;

	},*/

	update: function ()
	{
		if (gameRunning === false || !grpSceneGame.visible)
		{
			return;
		}

		imgGateLine.tilePosition.x += 0.3;
		/*bmd.clear();
		imgGateLine.rotation=1.5;
		bmd.draw(imgGateLine, bmd.width/2,0,imgGateLine.width,imgGateLine.width);
		bmd.alphaMask(imgGateLine, imgGateLineMask);*/
		if (gameRunning === false)
		{
			return;
		}

		/*if (imgCoin.visible === false && (player.vall == 0 || (player.vall % Math.PI * 2 > 2.5 && player.vall % Math.PI * 2 < 4)) && canSpawnCoin)
		{
			SceneGame.instance.activateCoin();
		}*/

		playerTrack.update();
		enemyTrack.update();
		/*tileEmitter.forEachAlive(function (p)
		{
			p.alpha = (p.lifespan / tileEmitter.lifespan > 0.4) ? 1 : p.lifespan / tileEmitter.lifespan;
		});*/

	},
	spawnPlusOneText: function (x, y, text)
	{
		txtGamePlusOneCoin.position.setTo(x, y);

		txtGamePlusOneCoin.text = text;
		txtGamePlusOneCoin.visible = true;

		txtGamePlusOneCoin.alpha = 1;

		var newY = y - 100;
		game.add.tween(txtGamePlusOneCoin).to({alpha: 0}, 600, Phaser.Easing.Cubic.In, true, 0);
		game.add.tween(txtGamePlusOneCoin).to({y: newY}, 600, Phaser.Easing.Linear.None, true, 0);
		//Phaser.Easing.Cubic.In
		//game.add.tween(txtGamePlusOneCoin).to({y: newY}, 600, Phaser.Easing.Linear.None, true, 0);

	},
	activateCoin: function ()
	{
		soundManager.playSound('minca-spawn');
		imgCoin.body.static = false;
		imgCoin.visible = true
	},
	onObjectShot: function (hitObject)
	{
		if (playerAlive === false)
		{
			return;
		}
		switch (hitObject.type)
		{
			case ORBITING_OBJECT_TYPES.PLAYER:

				enemySpawner.spawnExplosion(player);
				if (player.shield.visible)
				{
					player.shield.visible = false;
				}
				else
				{
					lives--;
					txtLivesValue.text = lives;
					if (lives <= 0)
					{
						playerAlive = false;
						player.sprite.visible = false;
						ScenesTransitions.transitionStarted();
						game.time.events.add(Phaser.Timer.SECOND * 0.6, function ()
						{

							if (balance >= 30)
							{
								playerAlive = false;
								gameRunning = false;

								SceneGame.instance.OnReleasedDown(true);
								SceneGame.instance.OnReleasedUp(true);

								SceneRevive.instance.ShowAnimated();
							}
							else
							{
								SceneGame.instance.endGame(false);
							}
						}, this);
					}
					else
					{
						player.setInvincible(600);
					}
				}
				break;
			case ORBITING_OBJECT_TYPES.ENEMY:
				balance += 3;
				SceneGame.instance.spawnPlusOneText(hitObject.sprite.x, hitObject.sprite.y, '+3');

				if (lives > 0)
				{
					objectiveManager.onElimination();
				}
				SceneBalance.instance.updateText();
				break;
			case ORBITING_OBJECT_TYPES.BOSS:
				balance += 5;
				SceneGame.instance.spawnPlusOneText(hitObject.sprite.x, hitObject.sprite.y, '+5');

				if (lives > 0)
				{
					objectiveManager.onElimination();
				}
				SceneBalance.instance.updateText();
				break;
		}
	},
	onResolutionChange: function ()
	{
		if (ScenesTransitions.transitionActive)
		{
			game.time.events.add(50, function ()
			{
				SceneGame.instance.onResolutionChange();
			});
			return;
		}
		if (GAME_CURRENT_ORIENTATION === ORIENTATION_LANDSCAPE)
		{
			playerTrack.planet.position.setTo((game.width >> 1) - 190, game.height >> 1);
			enemyTrack.planet.position.setTo((game.width >> 1) + 190, game.height >> 1);
		}
		else
		{
			playerTrack.planet.position.setTo(game.width >> 1, (game.height >> 1) - 150);
			enemyTrack.planet.position.setTo(game.width >> 1, (game.height >> 1) + 230);
		}
		var objectiveOffsetY = playerTrack.planet.height < 40 ? 150 : playerTrack.planet.height;

		txtGameObjectiveValue.x = playerTrack.planet.x;
		txtGameObjectiveName.x = playerTrack.planet.x;

		game.add.tween(txtGameObjectiveValue).to({y: playerTrack.planet.y - objectiveOffsetY}, 800, Phaser.Easing.Linear.None, true);
		game.add.tween(txtGameObjectiveName).to({y: playerTrack.planet.y - objectiveOffsetY}, 800, Phaser.Easing.Linear.None, true);
		/*txtGameObjectiveValue.position.setTo(playerTrack.planet.x, playerTrack.planet.y - objectiveOffsetY);
		txtGameObjectiveName.position.setTo(playerTrack.planet.x, playerTrack.planet.y - objectiveOffsetY);*/

		btnGameUp.position.setTo(game.width - PADDING, game.height - 215);
		btnGameDown.position.setTo(game.width - PADDING, game.height - 75);
		btnGamePause.position.setTo(game.width - PADDING, PADDING);
		grpGameShoot.position.setTo(PADDING, game.height - 75);


		imgGateLeft.position.setTo(playerTrack.planet.x - playerTrack.ellipse.width / 2 * Math.cos(Math.PI / 5) * 1.25, playerTrack.planet.y - playerTrack.ellipse.height / 2 * Math.sin(Math.PI / 5) * 1.25);
		imgGateRight.position.setTo(playerTrack.planet.x - playerTrack.ellipse.width / 2 * Math.cos(Math.PI / 5) * 0.75, playerTrack.planet.y - playerTrack.ellipse.height / 2 * Math.sin(Math.PI / 5) * 0.75);

		imgGateLine.position.setTo(playerTrack.planet.x - playerTrack.ellipse.width / 2 * Math.cos(Math.PI / 5), playerTrack.planet.y - playerTrack.ellipse.height / 2 * Math.sin(Math.PI / 5));

		imgAfterCoin.body.x = playerTrack.planet.x - playerTrack.ellipse.width / 2 * Math.cos(Math.PI / 4 + 0.4);
		imgAfterCoin.body.y = playerTrack.planet.y - playerTrack.ellipse.height / 2 * Math.sin(Math.PI / 4 + 0.4);

		imgCoin.body.x = imgGateLine.x;
		imgCoin.body.y = imgGateLine.y;

		imgGateLine.rotation = Math.PI / 5;
		imgGateLeft.rotation = Math.PI / 5;
		imgGateRight.rotation = Math.PI * 1.2;

		imgGameLivesWindow.reset(game.world.centerX, PADDING);


		//imgGateLineMask.position.set(imgGateLine.x, imgGateLine.y);
		//imgGateRight;

	},
	addBullet: function ()
	{
		SceneFlash.instance.Flash(function ()
		{
			bullets++;
			txtGameAmmo.text = bullets;
			imgGameAmmo.loadTexture('pak1', 'kruh_strela_01');

			// TUTORIAL
			if (currentLevel == 2 && !pickedUpPowerUpThisGame)
			{
				SceneTutorial.instance.OnLevel3PickedUpAmmo();

			}
			pickedUpPowerUpThisGame = true;

		}, 200, 0, 0.2, 'blank_red');
	},
	startGame: function ()
	{

		playerTrack.planet.loadTexture('pak1', PLANETS[currentLevel].sprite);
		enemyTrack.planet.loadTexture('pak1', PLANETS[(currentLevel + 1 >= PLANETS.length) ? game.rnd.integerInRange(0, PLANETS.length - 2) : currentLevel + 1].sprite);

		player.sprite.alpha = 1;
		player.invincible = false;
		player.vall = (GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE ? 0 : -Math.PI / 2);
		player.sprite.visible = true;
		player.OnGameStarted();
		playerAlive = true;
		player.setSpeed(1);


		pickedUpPowerUpThisGame = false;
		coinsCollectedThisGame = 0;
		hasShotFirstTutorialShot = false;
		beatBestScoreThisGame = false;


		gameRunning = true;

		lives = SHIPS[selectedShipIndex].lives;

		txtLivesValue.text = lives;

		objectiveManager.setNewObjective(currentLevel);
		objectiveManager.UpdateTexts();

		canSpawnCoin = currentLevel > 2;


		soundManager.setLoopSound(0);


		// clear tutorial tweens
		sceneTutorial.StopTweens();


		if (currentLevel < 3)
		{
			sceneTutorial.OnGameStarted();
		}
		else
		{
			enemySpawner.startSpawning();
		}
		SceneGame.instance.onResolutionChange();

	},
	endGame: function (success)
	{

		if (success == null)
		{
			success = false;
		}
		if (!success)
		{
			hasShotFirstTutorialShot = false; // tutorial not completed if player died
		}
		success = success || objectiveManager.currentObjectiveType == OBJECTIVE_TYPES.ENDLESS;
		successfullyCompletedLevel = success;

		txtResultCongratulations.text = success ? STR("Completed") : STR("Failed");
		txtResultCongratulations.font = success ? "font_blue" : "font_red";
		imgResultObjectiveStatus.loadTexture('pak1', success ? 'fajka_02' : 'krizik_01');

		txtResultObjectiveText.text = objectiveManager.getCurrentObjectiveName() + (objectiveManager.currentObjectiveType == OBJECTIVE_TYPES.ENDLESS ? '' : ': ');
		txtResultObjectiveTextValue.text = ' ' + objectiveManager.getCurrentObjectiveGoalValue();

		SceneGame.instance.DoCleanup();

		GameData.Save();

		SceneGame.instance.HideAnimated();


		//imgResultCoinsBG.text.text = 20;

		//SceneBalance.instance.ShowAnimated();
		SceneResult.instance.ShowAnimated();
	}
	,
	DoCleanup: function ()
	{
		while (allDelayedSpawnTimers.length != 0)
		{
			allDelayedSpawnTimers[0].stop();
			allDelayedSpawnTimers[0].destroy();
			allDelayedSpawnTimers.splice(0, 1);
		}
		playerAlive = false;
		gameRunning = false;
		player.shield.visible = false;


		enemySpawner.despawnEverything();
		enemySpawner.stopSpawning();


		SceneGame.instance.OnReleasedDown(true);
		SceneGame.instance.OnReleasedUp(true);

		game.time.removeAll();
		txtGameAmmo.text = 0;
		imgGameAmmo.loadTexture('pak1', 'kruh_strela_02');

		soundManager.setLoopSound(-1);

		bullets = 0;
	}
	,
	toggleShootButton: function (tgl)
	{
		imgGameAmmo.visible = tgl;
		btnGameShoot.visible = tgl;
		txtGameAmmo.text = bullets;
	},
// **** BUTTON CALLBACks ****
	OnPressedUp: function ()
	{
		if (!btnGameUp.inputEnabled)
		{
			return;
		}
		if (upKeyReady == false)
		{
			return;
		}
		upKeyReady = false;

		game.add.tween(btnGameUp.scale).to({x: 0.8, y: 0.8}, 300, Phaser.Easing.Back.Out, true, 0);

		player.setSpeed(SHIPS[selectedShipIndex].realSpeed);

		soundManager.setLoopSound(2);

		soundManager.playOneSound('accellerate');

	},
	OnReleasedUp: function (force)
	{
		force = force || false;

		if (!btnGameUp.inputEnabled && !force)
		{
			return;
		}
		upKeyReady = true;

		if (btnGameUp.scale.x != 1)
		{
			game.add.tween(btnGameUp.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Back.Out, true, 0);
		}
		player.setSpeed(1);
		if (downKey.isDown)
		{
			downKeyReady = true;
			SceneGame.instance.OnPressedDown();
		}

	},
	OnPressedDown: function ()
	{
		if (!btnGameDown.inputEnabled)
		{
			return;
		}
		if (downKeyReady == false)
		{
			return;
		}
		downKeyReady = false;

		game.add.tween(btnGameDown.scale).to({x: 0.8, y: 0.8}, 300, Phaser.Easing.Back.Out, true, 0);

		player.setSpeed(1 - (SHIPS[selectedShipIndex].realBrake));

		soundManager.playOneSound('brake');


	},
	OnReleasedDown: function (force)
	{
		force = force || false;
		if (!btnGameDown.inputEnabled && !force)
		{
			return;
		}
		downKeyReady = true;

		if (btnGameDown.scale.x != 1)
		{
			game.add.tween(btnGameDown.scale).to({x: 1, y: 1}, 300, Phaser.Easing.Back.Out, true, 0);
		}
		player.setSpeed(1);
		if (upKey.isDown)
		{
			upKeyReady = true;

			SceneGame.instance.OnPressedUp(false);
		}
	},
	OnPressedShoot: function ()
	{
		if (!btnGameShoot.inputEnabled)
		{
			return;
		}

		if (playerAlive === false || gameRunning === false || player.invincible || bullets <= 0)
		{
			return;
		}

		bullets--;
		txtGameAmmo.text = bullets;

		imgGameAmmo.loadTexture('pak1', bullets === 0 ? 'kruh_strela_02' : 'kruh_strela_01');


		player.shoot();

		if (selectedShipIndex === 7) // double shoot - goldenium
		{
			if (playerAlive && gameRunning)
			{
				game.time.events.add(150, function ()
				{
					player.shoot();
				});
			}
		}

		if (currentLevel == 2 && !hasShotFirstTutorialShot)
		{
			sceneTutorial.OnLevel3PressedFirstShoot();
		}
	},
// **** INPUT HANDLING ****
	OnKeyDown: function (e)
	{
		if (gameRunning === false)
		{
			return;
		}
		switch (e.keyCode)
		{
			case Phaser.Keyboard.UP:
				SceneGame.instance.OnPressedUp();
				break;
			case Phaser.Keyboard.DOWN:
				SceneGame.instance.OnPressedDown();
				break;
		}
		if (keyDown === false)
		{
			if ((e.keyCode === Phaser.Keyboard.SPACEBAR && spaceKey.isDown === false) || (e.keyCode === Phaser.Keyboard.RIGHT && rightKey.isDown === false))
			{
				SceneGame.instance.OnPressedShoot();
			}
		}
	},
	OnKeyUp: function (e)
	{
		if (gameRunning === false)
		{
			return;
		}
		switch (e.keyCode)
		{
			case Phaser.Keyboard.UP:
				SceneGame.instance.OnReleasedUp();
				break;
			case Phaser.Keyboard.DOWN:
				SceneGame.instance.OnReleasedDown();
				break;
			case Phaser.Keyboard.LEFT:
				break;
			case Phaser.Keyboard.RIGHT:
				break;
		}
	},

	onPause: function ()
	{
		if (grpSceneGame.visible && !grpScenePause.visible && !grpSceneResult.visible && !grpSceneRevive.visible)
		{
			if (gameRunning)
			{
				SceneGame.instance.OnPressedFromGameToPause();
			}
		}

		gameRunning = false;
		gamePaused = true;


	}
	,
	ResumeGame: function ()
	{
		gameRunning = true;
		gamePaused = false;


		/*game.physics.p2.resume();
		game.time.gameResumed();*/
	}
	,

	OnPressedFromGameToPause: function ()
	{
		if (gameRunning)
		{
			SceneGame.instance.HideAnimated();

			ScenePause.instance.ShowAnimated();
		}
		gameRunning = false;
		gamePaused = true;
	}
	,
	ShowAnimated: function (fast)
	{
		if (fast == null)
		{
			fast = false;
		}
		soundManager.music["game_music"].volume = 0.06;

		if (currentLevel > 2)
		{
			SceneGame.instance.OnReleasedDown(true);
			SceneGame.instance.OnReleasedUp(true);
		}
		//player.setSpeed(1);

		game.physics.p2.resume();

		if (currentLevel < 3)
		{
			SceneTutorial.instance.ShowAnimated();
		}
		SceneGame.instance.onResolutionChange();


		ScenesTransitions.transitionStarted();

		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Back.Out;
		var transitionSpeedMultiplier = fast ? 2 : 1;

		if (currentLevel > 2)
		{
			ScenesTransitions.showSceneScale(btnGameShoot, 100 / transitionSpeedMultiplier, ScenesTransitions.TRANSITION_LENGTH / transitionSpeedMultiplier);

			ScenesTransitions.showSceneScale(playerTrack.planet, 300 / transitionSpeedMultiplier, ScenesTransitions.TRANSITION_LENGTH / transitionSpeedMultiplier);
			ScenesTransitions.showSceneScale(txtGameObjectiveValue, 300 / transitionSpeedMultiplier, ScenesTransitions.TRANSITION_LENGTH / transitionSpeedMultiplier);
			ScenesTransitions.showSceneScale(txtGameObjectiveName, 300 / transitionSpeedMultiplier, ScenesTransitions.TRANSITION_LENGTH / transitionSpeedMultiplier);

			ScenesTransitions.showSceneScale(enemyTrack.planet, 500 / transitionSpeedMultiplier, ScenesTransitions.TRANSITION_LENGTH / transitionSpeedMultiplier);

			ScenesTransitions.showSceneScale(btnGameUp, 700 / transitionSpeedMultiplier, ScenesTransitions.TRANSITION_LENGTH / transitionSpeedMultiplier);
			ScenesTransitions.showSceneScale(btnGameDown, 800 / transitionSpeedMultiplier, ScenesTransitions.TRANSITION_LENGTH / transitionSpeedMultiplier);
		}
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;

		ScenesTransitions.showSceneAlpha(grpSceneGame, 0, ScenesTransitions.TRANSITION_LENGTH + 10, ScenesTransitions.transitionFinished);

	}
	,

	HideAnimated: function ()
	{
		soundManager.music["game_music"].volume = 0.2;

		if (currentLevel > 2)
		{
			SceneGame.instance.OnReleasedDown(true);
			SceneGame.instance.OnReleasedUp(true);
		}
		soundManager.setLoopSound(-1);

		gameRunning = false;

		game.physics.p2.pause();

		if (currentLevel < 3)
		{
			SceneTutorial.instance.HideAnimated();
		}

		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
		ScenesTransitions.hideSceneAlpha(grpSceneGame, 0, ScenesTransitions.TRANSITION_LENGTH + 10);
	},
}
;