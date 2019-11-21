var SceneMenu = function ()
{
	SceneMenu.instance = this;

	this.create();
};

SceneMenu.instance = null;

SceneMenu.prototype = {

	create: function ()
	{
		grpSceneMenu = game.add.group();
		grpSceneMenu.visible = false;

		grpSceneMenu.name = 'grpSceneMenu';

		/*imgMenuLogo = grpSceneMenu.add(game.add.sprite(0, 0, 'pak1', 'nadpis_01'));
		imgMenuLogo.anchor.set(0.5);
		imgMenuLogo.scale.set(0.85);

		imgMenuLogoScaleTween = game.add.tween(imgMenuLogo.scale).to({
			x: 0.9,
			y: 0.9
		}, 4000, Phaser.Easing.Cubic.InOut, true, 0, -1, true);*/

		// menu track
		menuTrack = new Track(PLANETS[0].sprite, grpSceneMenu);
		menuTrack.radius = 140;
		menuTrack.planet.visible = false;

		grpMenuPlanets = game.add.group();
		grpSceneMenu.add(grpMenuPlanets);
		grpMenuPlanets.position.set(0, game.world.centerY);

		menuShip = new OrbitingObject(menuTrack, SHIPS[selectedShipIndex].sprite, ORBITING_OBJECT_TYPES.MENU);
		menuShip.sprite.scale.set(0.8);
		menuShip.OnGameStarted();

		for (var i = 0; i < 3; i++)
		{
			var imgMenuPlanet = CreatePlanetWithText(i + 1 + '. ' + PLANETS[i].name, PLANETS[i].sprite);
			imgMenuPlanet.position.set(i * SPACE_BETWEEN_MENU_PLANETS, (Math.random() * 160) - 100);
			imgMenuPlanet.anchor.y = 0.45;

			game.add.tween(imgMenuPlanet.anchor).to({
				y: 0.53 + Math.random() / 10
			}, 2000 + Math.random() * 1000, Phaser.Easing.Cubic.InOut, true, 0, -1, true);
			/*menuPlanetTweens[i] = game.add.tween(imgMenuPlanet.anchor).to({
				y: 0.53 + Math.random() / 10
			}, 2000 + Math.random() * 1000, Phaser.Easing.Cubic.InOut, true, 0, -1, true);*/


			grpMenuPlanets.add(imgMenuPlanet);
		}


		menuTrack.planet.position = new Phaser.Point(0, grpMenuPlanets.getAt(0).y + grpMenuPlanets.y);


		// Play button
		//btnMenuPlay= game.add.sprite(game.width >> 1, game.height - 50,'pak1', 'button_on_0');
		btnMenuPlay = CreateBoardSpr(0, 0, 300, 120, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpSceneMenu.add(btnMenuPlay);
		AddButtonEvents(btnMenuPlay, this.OnPressedPlay, ButtonOnInputOver, ButtonOnInputOut);
		// Play button text
		AddTextToObject(btnMenuPlay, STR("PLAY"), 75, 'font_yellow');
		btnMenuPlay.text.fill = "#fcd20c";

		// Hangar button
		btnMenuHangar = CreateBoardSpr(0, 0, 200, 90, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpSceneMenu.add(btnMenuHangar);
		AddButtonEvents(btnMenuHangar, this.OnPressedHangar, ButtonOnInputOver, ButtonOnInputOut);

		imgMenuHangar = game.add.sprite(106, 0, 'pak1', 'raketa_pod_tlacidlo_01');
		imgMenuHangar.anchor.set(1, 0.5);
		imgMenuHangar.setScaleMinMax(1, 1, 1, 1);
		btnMenuHangar.addChild(imgMenuHangar);

		imgMenuHangarExclamationMark = game.add.sprite(-105, -45, 'pak1', 'vykricnik_01');
		imgMenuHangarExclamationMark.anchor.set(0.5);
		imgMenuHangarExclamationMark.setScaleMinMax(0.8, 0.8, 0.8, 0.8);
		btnMenuHangar.addChild(imgMenuHangarExclamationMark);
		// Hangar button text
		AddTextToObject(btnMenuHangar, STR('HANGAR'), 40, 'font_yellow');
		btnMenuHangar.text.fill = "#fcd20c";

		// PlayEndless button
		btnMenuPlayEndless = CreateBoardSpr(0, 0, 200, 90, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpSceneMenu.add(btnMenuPlayEndless);
		AddButtonEvents(btnMenuPlayEndless, this.OnPressedPlayEndless, ButtonOnInputOver, ButtonOnInputOut);
		btnMenuPlayEndless.inputEnabled = false;
		btnMenuPlayEndless.alpha = 0.5;
		// Play button text

		AddTextToObject(btnMenuPlayEndless, STR('ENDLESS'), language=='es'?32:[40,25], 'font_yellow');
		btnMenuPlayEndless.text.fill = "#fcd20c";
		SceneMenu.instance.updateEndlessButton();


		// Settings button
		btnMenuSettings = game.add.sprite(0, 0, 'pak1', 'tlacidlo_21');
		btnMenuSettings.anchor.set(0.5);
		grpSceneMenu.add(btnMenuSettings);
		AddButtonEvents(btnMenuSettings, this.OnPressedSettings, ButtonOnInputOver, ButtonOnInputOut);


		// Instructions button
		btnMenuInstructions = game.add.sprite(0, 0, 'pak1', 'tlacidlo_24');
		btnMenuInstructions.anchor.set(0.5);
		grpSceneMenu.add(btnMenuInstructions);
		AddButtonEvents(btnMenuInstructions, this.OnPressedInstructions, ButtonOnInputOver, ButtonOnInputOut);


// objective window
		imgMenuObjectiveWindow = CreateBoardSpr(0, 0, 300, 80, 'pak1', 'okno_01_small', 0.5, 0.5);
		grpSceneMenu.add(imgMenuObjectiveWindow);

		AddTextToObject(imgMenuObjectiveWindow, STR('OBJECTIVE'), 35, 'font_blue');
		imgMenuObjectiveWindow.text.y = -imgMenuObjectiveWindow.height / 2 - 17;

		// objective text
		txtMenuObjectiveText = createText(-15, 0, STR('Eliminate')+':', [40,28], 'font_red');
		imgMenuObjectiveWindow.addChild(txtMenuObjectiveText);
		txtMenuObjectiveText.anchor.set(getCorrectAnchorX(txtMenuObjectiveText, 0.5), getCorrectAnchorY(txtMenuObjectiveText, 0.4));

		// objective value
		txtMenuObjectiveTextValue = createText(txtMenuObjectiveText.width / 2, 0, '4', [40,28], 'font_blue');
		imgMenuObjectiveWindow.addChild(txtMenuObjectiveTextValue);
		txtMenuObjectiveTextValue.anchor.set(getCorrectAnchorX(txtMenuObjectiveTextValue, 0.5), getCorrectAnchorY(txtMenuObjectiveTextValue, 0.4));


		// Fullscreen button
		if (document.fullscreenEnabled)
		{

			btnMenuFullscreen = grpSceneMenu.create(game.width - PADDING, PADDING, 'pak1', 'tlacidlo_27');
			btnMenuFullscreen.anchor.set(0.5);
			AddButtonEvents(btnMenuFullscreen, this.OnPressedMaximize, ButtonOnInputOver, ButtonOnInputOut);
		}
		objectiveManager.setNewObjective(currentLevel);
		this.updateObjectiveText();
		this.updateEndlessButton();

		this.onResolutionChange();


// move to current level planet
		grpMenuPlanets.position.x = game.world.centerX;
		var savedCurrentLevel = currentLevel;
		currentLevel = 0;

		for (var i = 0; i < savedCurrentLevel; i++)
		{
			SceneMenu.instance.moveToNextPlanetInstant();
		}



		spaceKey.onDown.add(function ()
		{
			if (grpSceneMenu.visible && gameRunning==false && ScenesTransitions.transitionActive==false)
			{
				SceneMenu.instance.OnPressedPlay();
			}
		});


	},
	update: function ()
	{
		if (!grpSceneMenu.visible)
		{
			return;
		}

		menuTrack.update();
	},
	onResolutionChange: function ()
	{
		if (movingToNewPlanet)
		{
			return;
		}

		if (GAME_CURRENT_ORIENTATION === ORIENTATION_PORTRAIT)
		{
			btnMenuPlay.position.setTo(game.width >> 1, game.height - 300);

			btnMenuPlayEndless.position.setTo(game.world.centerX, game.height - 170);
			btnMenuHangar.position.setTo(game.world.centerX, game.height - 70);

			grpMenuPlanets.position.set(grpMenuPlanets.x, game.world.centerY - 50);

			imgMenuObjectiveWindow.reset((game.width >> 1), PADDING + 120);
		}
		else
		{
			btnMenuPlay.position.setTo(game.width >> 1, game.height - PADDING);

			btnMenuHangar.position.setTo(150, game.height - 80);
			btnMenuPlayEndless.position.setTo(game.width - 150, game.height - 80);

			grpMenuPlanets.position.set(grpMenuPlanets.x, game.world.centerY);

			imgMenuObjectiveWindow.reset((game.width >> 1), PADDING);
		}
		btnMenuSettings.position.setTo(game.width - PADDING - 80, PADDING);
		btnMenuInstructions.position.setTo(game.width - PADDING, PADDING);
		if (document.fullscreenEnabled)
		{
			btnMenuFullscreen.position.setTo(game.width - PADDING - 160, PADDING);
		}


		menuTrack.planet.position = new Phaser.Point(game.world.centerX, grpMenuPlanets.getAt(currentLevel == 0 ? 0 : (currentLevel == PLANETS.length - 1 ? 2 : 1)).y + grpMenuPlanets.y);

		grpMenuPlanets.position.setTo(-SPACE_BETWEEN_MENU_PLANETS * currentLevel + game.world.centerX, grpMenuPlanets.y);
		/*for (var i = 0; i < grpMenuPlanets.length; i++)
		{
			grpMenuPlanets.getAt(i).position.setTo(game.world.centerX + + currentLevel * i * SPACE_BETWEEN_MENU_PLANETS, grpMenuPlanets.getAt(i).y);
		}*/

	},
	updateEndlessButton: function ()
	{
		var endless = currentLevel == PLANETS.length - 1;

		btnMenuPlayEndless.inputEnabled = endless;
		btnMenuPlayEndless.alpha = endless ? 1 : 0.5;

		btnMenuPlay.inputEnabled = !endless;
		btnMenuPlay.alpha = endless ? 0.5 : 1;
	},

	OnPressedMaximize: function ()
	{
		scoresRepositioned = false;

		btnMenuFullscreen.loadTexture('pak1', game.scale.isFullScreen ? 'tlacidlo_27' : 'tlacidlo_28');
		if (game.scale.isFullScreen)
		{
			game.scale.stopFullScreen();
		}
		else
		{
			game.scale.startFullScreen();
		}
		//SceneBackground.onResolutionChange();
	},
	updateHangarExclamationMark: function ()
	{
		imgMenuHangarExclamationMark.visible = false;
		for (var i = 0; i < SHIPS.length; i++)
		{
			if (SHIPS[i].price !== 0 && SHIPS[i].price <= balance)
			{
				imgMenuHangarExclamationMark.visible = true;
				break;
			}
		}
	},
	moveToNextPlanetInstant: function ()
	{
		if (currentLevel + 1 >= PLANETS.length)
		{
			return;
		}

		currentLevel++;

		var index = currentLevel;


		grpMenuPlanets.position.x = -SPACE_BETWEEN_MENU_PLANETS * index + game.world.centerX;

		if (index !== 1 && index < PLANETS.length - 1)
		{
			var planet0 = grpMenuPlanets.removeChildAt(0);//grpMenuPlanets.children.splice(1, 1)[0];
			planet0 = grpMenuPlanets.add(planet0);

			planet0.loadTexture('pak1', PLANETS[index + 1].sprite);
			planet0.text.text = currentLevel + 2 + ". " + PLANETS[index + 1].name;
			planet0.text.y = -planet0.height / 1.4;

			//planet0.check.visible=false;

			planet0.position.x = planet0.position.x + SPACE_BETWEEN_MENU_PLANETS * 3;
		}

		//grpMenuPlanets.getAt(0).check.visible=true;
		//grpMenuPlanets.getAt(2).check.visible=false;

		var trackPlanetIndex = 0;
		if (currentLevel >= PLANETS.length - 1)
		{
			trackPlanetIndex = 2;
		}
		else if (currentLevel == 0)
		{
			trackPlanetIndex = 0;
		}
		else
		{
			trackPlanetIndex = 1;
		}
		menuTrack.planet.position = new Phaser.Point(game.world.centerX, grpMenuPlanets.getAt(currentLevel == 0 ? 0 : (currentLevel == PLANETS.length - 1 ? 2 : 1)).y + grpMenuPlanets.y);

		objectiveManager.setNewObjective(currentLevel);
		movingToNewPlanet = false;
		SceneMenu.instance.onResolutionChange();
		ScenesTransitions.transitionFinished();


		SceneMenu.instance.updateEndlessButton();
		SceneMenu.instance.updateObjectiveText();

		GameData.Save();
	},
	moveToNextPlanet: function ()
	{
		if (currentLevel + 1 >= PLANETS.length)
		{
			return;
		}

		currentLevel++;
		var index = currentLevel;

		ScenesTransitions.transitionStarted();
		movingToNewPlanet = true;

		GameData.Save();

		//grpMenuPlanets.getAt(1).check.visible=true;
		// scale up and speed up ship for better effect idk
		menuShip.sprite.scale.setTo(0.8);
		game.add.tween(menuShip.sprite.scale).to({
			x: 1.4,
			y: 1.4
		}, 600, Phaser.Easing.Cubic.InOut, true, 0, 0, true);
		menuShip.baseSpeed = 0.017;
		game.add.tween(menuShip).to({
			baseSpeed: 0.1
		}, 800, Phaser.Easing.Cubic.InOut, true, 0, 0, true);

		// enlarge radius so it doesnt hit planets
		menuTrack.radius = 140;
		game.add.tween(menuTrack).to({
			radius: 220
		}, 600, Phaser.Easing.Cubic.InOut, true, 0, 0, true);


		var planetPositionTween = game.add.tween(menuTrack.planet.position).to({y: grpMenuPlanets.getAt(currentLevel == 1 ? 1 : 2).y + grpMenuPlanets.y}, 1000, Phaser.Easing.Cubic.InOut, true);


		// moveToNextPlanet-v 50% movementu(ked 0 nieje viditelna)- switchnut properties planety '0' a posunut ju na koniec arrayky+poziciu
		// pri kazdom posune sa meni iba 1 planeta- '0'
		if (index !== 1 && index < PLANETS.length - 1)
		{
			var groupMoveTween = game.add.tween(grpMenuPlanets.position).to({x: -SPACE_BETWEEN_MENU_PLANETS * index + game.world.centerX}, 800, Phaser.Easing.Cubic.InOut, true);
			groupMoveTween.onComplete.add(function ()
			{
				var planet0 = grpMenuPlanets.removeChildAt(0);//grpMenuPlanets.children.splice(1, 1)[0];
				planet0 = grpMenuPlanets.add(planet0);
				//planet0.check.visible=false;


			}, {index: index});

			game.time.events.add(500, function ()
			{
				var planetFadeOutTween = game.add.tween(this.planet0).to({alpha: 0}, 100, Phaser.Easing.Linear.None, true, 0, 0, true);

				planetFadeOutTween.onRepeat.add(function ()
				{

					this.planet0.loadTexture('pak1', PLANETS[this.index + 1].sprite);
					this.planet0.text.text = currentLevel + 2 + ". " + PLANETS[this.index + 1].name;
					// zmenit rnd pos y
					this.planet0.text.y = -this.planet0.height / 1.4;

					this.planet0.position.x = this.planet0.position.x + SPACE_BETWEEN_MENU_PLANETS * 3;

				}, {planet0: this.planet0, index: this.index});
			}, {planet0: grpMenuPlanets.getAt(0), index: index});

		}
		else
		{
			game.add.tween(grpMenuPlanets.position).to({x: -SPACE_BETWEEN_MENU_PLANETS * index + game.world.centerX}, 1000, Phaser.Easing.Cubic.InOut, true);
		}
		planetPositionTween.onComplete.add(function ()
		{
			objectiveManager.setNewObjective(currentLevel);
			movingToNewPlanet = false;
			//SceneMenu.instance.onResolutionChange();
			ScenesTransitions.transitionFinished();


			SceneMenu.instance.updateEndlessButton();
			SceneMenu.instance.updateObjectiveText();

		});
		GameData.Save();
	}

	,
	updateObjectiveText: function ()
	{
		if (objectiveManager.currentObjectiveType === OBJECTIVE_TYPES.ENDLESS)
		{
			txtMenuObjectiveText.text = '    ' + objectiveManager.getCurrentObjectiveName();

		}
		else
		{

			txtMenuObjectiveText.text = objectiveManager.getCurrentObjectiveName() + ': ';
		}
		txtMenuObjectiveTextValue.text = objectiveManager.getCurrentObjectiveGoalValue();
		txtMenuObjectiveTextValue.x = txtMenuObjectiveText.width / 2;

	}
	,
	OnPressedHangar: function ()
	{
		SceneMenu.instance.HideAnimated();
		SceneHangar.instance.ShowAnimated();
	}
	,
	OnPressedPlayEndless: function ()
	{
		SceneMenu.instance.OnPressedPlay();
	}
	,
	OnPressedPlay: function ()
	{
		soundManager.playSound('click');

		// Hide scene
		SceneMenu.instance.HideAnimated();

		// Show game
		SceneGame.instance.ShowAnimated();
		SceneGame.instance.startGame();

	}
	,
	OnPressedSettings: function ()
	{
		soundManager.playSound('click');

		SceneMenu.instance.HideAnimated();

		SceneToReturnFromSettings = SceneMenu.instance;

		SceneSettings.instance.ShowAnimated();
		//SceneInstructions.instance.ShowAnimated();
	}
	,
	OnPressedInstructions: function ()
	{
		soundManager.playSound('click');

		//SceneMenu.instance.HideAnimated();

		SceneInstructions.instance.ShowAnimated();
	}
	,
	ShowAnimated: function (delay)
	{
		if (delay === undefined)
		{
			delay = 0;
		}
		document.body.style.backgroundColor = "rgb(5,8,29)";

		soundManager.playSound('click');

		SceneMenu.instance.updateHangarExclamationMark();
		ScenesTransitions.transitionStarted();

		ScenesTransitions.showSceneAlpha(grpSceneMenu, delay + 100, ScenesTransitions.TRANSITION_LENGTH);

		var animSpeed = 200;
		// anims
		ScenesTransitions.showSceneScale(menuShip.sprite, 200, animSpeed);

		ScenesTransitions.showSceneAlpha(btnMenuPlay, 300, animSpeed, function ()
		{
		}, btnMenuPlay.alpha);
		ScenesTransitions.showSceneAlpha(btnMenuPlayEndless, 500, animSpeed, function ()
		{
		}, btnMenuPlayEndless.alpha);
		ScenesTransitions.showSceneAlpha(btnMenuHangar, 700, animSpeed);

		ScenesTransitions.showSceneAlpha(grpMenuPlanets.getAt(0), 300, animSpeed);
		ScenesTransitions.showSceneAlpha(grpMenuPlanets.getAt(1), 500, animSpeed);
		ScenesTransitions.showSceneAlpha(grpMenuPlanets.getAt(2), 700, animSpeed);

		ScenesTransitions.showSceneAlpha(imgMenuObjectiveWindow, 1200, animSpeed,ScenesTransitions.transitionFinished);

		if (document.fullscreenEnabled)
		{
			ScenesTransitions.showSceneAlpha(btnMenuFullscreen, 1300, animSpeed);
		}
		ScenesTransitions.showSceneAlpha(btnMenuSettings, 1300, animSpeed);
		ScenesTransitions.showSceneAlpha(btnMenuInstructions, 1300, animSpeed);
	}
	,

	HideAnimated: function ()
	{
		ScenesTransitions.transitionStarted();

		ScenesTransitions.hideSceneAlpha(grpSceneMenu, 100, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
	}

}