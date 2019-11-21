var SceneHangar = function ()
{
	SceneHangar.instance = this;

	this.create();
};

SceneHangar.instance = null;
var lastMousePos = {x: 0, y: 0};
var slideSpeed = 10;
var slideTween = null;
var highlightedShipIndex = 0;
var slideFromPointerDrag = false;
var pointerDurationsFromLastFrame = [];
var selectedShipIndex = 0;
var lastHighlightedShipIndex = 0;
SceneHangar.prototype = {

	create: function ()
	{
		grpSceneHangar = game.add.group();
		grpSceneHangar.name = 'grpSceneHangar';
		grpSceneHangar.visible = false;


		grpHangarCards = game.add.group();
		grpSceneHangar.add(grpHangarCards);
		// data a UI separatne, index v grupe bude index v arrayke dat lodí
		for (var i = 0; i < SHIPS.length; i++)
		{
			// card
			var card = CreateBoardSpr(i * 280, 50, 235, 360, 'pak1', 'okno_01', 0.5, 0.5);
			grpHangarCards.add(card);

			// ship
			card.imgShip = game.add.sprite(0, -20, 'pak1', SHIPS[i].sprite);
			card.addChild(card.imgShip);

			card.imgShip.anchor.set(0.5);
			card.imgShip.setScaleMinMax(0.8, 0.8, 1, 1);
			card.inputEnabled = true;
			// click functionality, doesnt work for now
			card.events.onInputDown.add(function ()
			{
				grpHangarCards.getAt(this.index).pointerStartX = game.input.x;
			}, {index: i});

			card.events.onInputUp.add(function ()
			{
				if ((slideTween != null && slideTween.isRunning))
				{
					slideTween.stop();
				}

				if (Math.abs(grpHangarCards.getAt(this.index).pointerStartX - game.input.x) > 10 || highlightedShipIndex == this.index)
				{
					return;
				}
				highlightedShipIndex = this.index;
				var destX = game.world.centerX - grpHangarCards.getAt(highlightedShipIndex).x;
				slideTween = game.add.tween(grpHangarCards).to({x: destX}, 200, Phaser.Easing.Quadratic.InOut, true);
			}, {index: i});


			var txtShipName = createText(0, 50, SHIPS[i].name, 28, 'font_blue');
			txtShipName.anchor.set(getCorrectAnchorX(txtShipName, 0.5), getCorrectAnchorY(txtShipName, 0.4));
			card.addChild(txtShipName);

			// selected mark/btn
			card.button = game.add.sprite(0, 130, 'pak1', 'tlacidlo_12');
			card.button.anchor.set(0.5);
			card.button.inputEnabled = i === 0;
			card.button.events.onInputDown.add(function ()
			{

				selectedShipIndex = this.index;
				SceneHangar.instance.OnShipSelected();
				SceneHangar.instance.OnShipIndexChanged();
				SceneHangar.instance.updateCardButtons();
			}, {index: i});
			card.addChild(card.button);


			// locked layer
			card.grpLockedLayer = game.add.group();
			card.addChild(card.grpLockedLayer);


			if (i == SHIPS.length - 1) // goldenium extra text
			{
				var goldeniumText = createText(0, -90, "2 " + STR("Shots"), 27, 'font_red');
				card.goldeniumText = goldeniumText;
				if (SHIPS[i].price == 0)
				{
					goldeniumText.y = -120;
				}
				else
				{
					goldeniumText.alpha = 0.5;
				}
				card.grpLockedLayer.addChild(goldeniumText);
				goldeniumText.anchor.set(getCorrectAnchorX(goldeniumText, 0.5), getCorrectAnchorY(goldeniumText, 0.4));
				card.addChild(goldeniumText);

				game.add.tween(goldeniumText.scale).to({
					x: 1.05,
					y: 1.05
				}, 500, Phaser.Easing.Back.Out, true, 0, -1, true);

				goldeniumText.rotation = -0.1;
				game.add.tween(goldeniumText).to({
					rotation: 0.1
				}, 1000, Phaser.Easing.Cubic.InOut, true, 500, -1, true);
			}

			// price
			var txtShipPrice = createText(-15, -130, SHIPS[i].price, 45, 'font_yellow');
			txtShipPrice.anchor.set(getCorrectAnchorX(txtShipName, 0.5), getCorrectAnchorY(txtShipName, 0.47));

			card.grpLockedLayer.add(txtShipPrice);

			// coin
			var imgShipPriceCoin = game.add.sprite(txtShipPrice.width / 2 + 30, 0, 'pak1', 'minca');
			imgShipPriceCoin.anchor.set(0.5);

			txtShipPrice.addChild(imgShipPriceCoin);

			// img questionmark
			var txtShipQuestionMark = createText(0, card.imgShip.y, "?", 55);


			txtShipQuestionMark.alpha = 0.8;
			txtShipQuestionMark.anchor.set(getCorrectAnchorX(txtShipQuestionMark, 0.5), getCorrectAnchorY(txtShipQuestionMark, 0.5));


			card.grpLockedLayer.add(txtShipQuestionMark);

			if (i === 0 || SHIPS[i].price === 0)
			{
				card.grpLockedLayer.visible = false;
			}

		}


		grpHangarCards.x = game.world.centerX;


		// Back button
		btnHangarBack = game.add.sprite(0, 0, 'pak1', 'tlacidlo_07');
		btnHangarBack.anchor.set(0.5);
		grpSceneHangar.add(btnHangarBack);
		AddButtonEvents(btnHangarBack, this.OnPressedBack, ButtonOnInputOver, ButtonOnInputOut);

		var shipPropertiesTextSize = [28, 20];

		// ship properties window
		imgHangarShipPropertiesWindow = CreateBoardSpr(0, 0, 550, 60, 'pak1', 'okno_01_small', 0.5, 0.5);
		grpSceneHangar.add(imgHangarShipPropertiesWindow);


		// ship speed label
		txtHangarShipSpeedLabel = createText(-185, 2, STR('Speed'), shipPropertiesTextSize, 'font_blue', 0.5, 0.5);
		imgHangarShipPropertiesWindow.addChild(txtHangarShipSpeedLabel);
		// ship speed value
		txtHangarShipSpeedValue = createText(-110 + (['br', 'es', 'it'].contains(language) ? 25 : 0), 2, '150', shipPropertiesTextSize, null, 0.5, 0.5);
		imgHangarShipPropertiesWindow.addChild(txtHangarShipSpeedValue);


		// ship brake label
		txtHangarShipBrakeLabel = createText(5, 2, STR('Brake'), shipPropertiesTextSize, 'font_blue', 0.5, 0.5);
		imgHangarShipPropertiesWindow.addChild(txtHangarShipBrakeLabel);
		// ship brake value
		txtHangarShipBrakeValue = createText(80, 2, '150', shipPropertiesTextSize, null, 0.5, 0.5);
		imgHangarShipPropertiesWindow.addChild(txtHangarShipBrakeValue);


		// ship lives label
		txtHangarShipLivesLabel = createText(170, 2, STR('Lives'), shipPropertiesTextSize, 'font_blue', 0.5, 0.5);
		imgHangarShipPropertiesWindow.addChild(txtHangarShipLivesLabel);
		// ship lives value
		txtHangarShipLivesValue = createText(230, 2, '150', shipPropertiesTextSize, null, 0.5, 0.5);
		imgHangarShipPropertiesWindow.addChild(txtHangarShipLivesValue);


		// select button
		btnHangarSelect = CreateBoardSpr(0, 0, 220, 90, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpSceneHangar.add(btnHangarSelect);
		AddButtonEvents(btnHangarSelect, this.OnPressedSelectButton, ButtonOnInputOver, ButtonOnInputOut);
		// Play button text
		AddTextToObject(btnHangarSelect, STR('BUY'), [['fr', 'de', 'es'].contains(language) ? 33 : 45, 40], 'font_yellow');


		SceneHangar.instance.OnShipIndexChanged();
		SceneHangar.instance.updateCardButtons();


		// NO MONEY POP UP WINDOW
		grpHangarMoneyWindow = game.add.group();
		grpHangarMoneyWindow.visible = false;

		grpSceneHangar.add(grpHangarMoneyWindow);
		// overlay
		imgHangarOverlay = createFullscreenOverlay('blank_black');
		grpHangarMoneyWindow.add(imgHangarOverlay);

		// Back button
		btnHangarWindowBack = game.add.sprite(0, 0, 'pak1', 'tlacidlo_07');
		btnHangarWindowBack.anchor.set(0.5);
		grpHangarMoneyWindow.add(btnHangarWindowBack);
		AddButtonEvents(btnHangarWindowBack, this.OnPressedBack, ButtonOnInputOver, ButtonOnInputOut);

		// Hangar window text
		txtHangarWindowText = createText(0, 0, STR("NO_MONEY"), [30, 20], 'font_yellow');
		txtHangarWindowText.maxWidth = 380;
		grpHangarMoneyWindow.align = 'center';
		grpHangarMoneyWindow.addChild(txtHangarWindowText);


		imgHangarWindow = grpHangarMoneyWindow.add(CreateBoardSpr(0, 0, 400, 230, 'pak1', 'okno_01', 0.5, 0.5));


		game.input.onDown.add(function (p, e)
		{
			SceneHangar.instance.onInputDown(e);
		});

		this.onResolutionChange();

	},

	onResolutionChange: function ()
	{
		if (GAME_CURRENT_ORIENTATION === ORIENTATION_PORTRAIT)
		{
			imgHangarShipPropertiesWindow.reset(game.world.centerX, 140)
		}
		else
		{
			imgHangarShipPropertiesWindow.reset(game.world.centerX, PADDING)
		}
		grpHangarCards.y = game.world.centerY - 40;

		btnHangarSelect.position.set(game.world.centerX, game.height - PADDING);

		btnHangarBack.reset(game.width - PADDING, game.height - PADDING);


		btnHangarWindowBack.reset(game.width - PADDING, game.height - PADDING);
		imgHangarWindow.position.set(game.world.centerX, game.world.centerY);

		imgHangarOverlay.width = game.width * 3;
		imgHangarOverlay.height = game.height * 3;
		imgHangarOverlay.position.set(game.world.centerX, game.world.centerY);

		txtHangarWindowText.position.setTo(game.world.centerX, game.world.centerY);
	},
	onInputDown: function ()
	{
		lastMousePos = {x: game.input.activePointer.clientX, y: game.input.activePointer.clientY};

	},
	update: function ()
	{
		if (!grpSceneHangar.visible || grpHangarMoneyWindow.visible)
		{
			return;
		}
		if (lastHighlightedShipIndex !== highlightedShipIndex)
		{
			SceneHangar.instance.OnShipIndexChanged();
		}
		lastHighlightedShipIndex = highlightedShipIndex;


		if (slideTween != null && slideTween.isRunning)
		{
			return;
		}
		if (leftKey.justPressed())
		{
			highlightedShipIndex--;
			if (highlightedShipIndex < 0)
			{
				highlightedShipIndex = SHIPS.length - 1;
			}
		}
		else if (rightKey.justPressed())
		{
			highlightedShipIndex++;
			if (highlightedShipIndex >= SHIPS.length)
			{
				highlightedShipIndex = 0;
			}
		}
		if (game.input.activePointer.isDown)
		{

			if (slideTween != null && slideTween.isRunning)
			{
				slideTween.stop();
			}
			dir = (game.input.activePointer.clientX - lastMousePos.x) > 0 ? 1 : -1;

			if ((grpHangarCards.x < game.width / 2 && dir === 1) || (grpHangarCards.x > -1650 && dir === -1))
			{
				grpHangarCards.x += (game.input.activePointer.clientX - lastMousePos.x) * 2;

			}
			for (var i = 0; i < grpHangarCards.length; i++)
			{
				if (Math.abs(grpHangarCards.x + grpHangarCards.getAt(i).x - game.world.centerX) < Math.abs(grpHangarCards.x + grpHangarCards.getAt(highlightedShipIndex).x - game.world.centerX))
				{
					highlightedShipIndex = i;
				}
			}

		}
		lastMousePos = {x: game.input.activePointer.clientX, y: game.input.activePointer.clientY};


		for (var i = 0; i < grpHangarCards.length; i++)
		{
			if (highlightedShipIndex === i)
			{

				//grpHangarCards.getAt(i).alpha = 1;
				//grpHangarCards.getAt(i).scale.set(1);
				game.add.tween(grpHangarCards.getAt(i)).to({alpha: 1}, 50, Phaser.Easing.Linear.None, true);
				game.add.tween(grpHangarCards.getAt(i).scale).to({x: 1, y: 1}, 50, Phaser.Easing.Linear.None, true);

			}
			else
			{
				game.add.tween(grpHangarCards.getAt(i)).to({alpha: 0.3}, 50, Phaser.Easing.Linear.None, true);
				game.add.tween(grpHangarCards.getAt(i).scale).to({
					x: 0.85,
					y: 0.85
				}, 50, Phaser.Easing.Linear.None, true);

			}
		}
		if (game.input.activePointer.justReleased() && (slideTween === null || (slideTween.isRunning === false)))
		{
			var destX = game.world.centerX - grpHangarCards.getAt(highlightedShipIndex).x;
			slideTween = game.add.tween(grpHangarCards).to({x: destX}, 200, Phaser.Easing.Quadratic.InOut, true);

			/*interactive = false;
			setTimeout(function ()
			{
				interactive = true;
			}, 200);
*/
		}
		else if (rightKey.justReleased() || leftKey.justReleased())
		{
			if (slideTween != null && slideTween.isRunning)
			{
				slideTween.stop();
			}
			var destX = game.world.centerX - grpHangarCards.getAt(highlightedShipIndex).x;
			slideTween = game.add.tween(grpHangarCards).to({x: destX}, 200, Phaser.Easing.Quadratic.InOut, true);

			/*interactive = false;
			setTimeout(function ()
			{
				interactive = true;
			}, 200);*/
		}
		// on new ship highlighted

	},
	OnShipSelected: function ()
	{
		menuShip.setTexture(SHIPS[selectedShipIndex].sprite);
		menuShip.OnGameStarted();

		player.setTexture(SHIPS[selectedShipIndex].sprite);


		player.sprite.body.setRectangle(player.sprite.width * 0.8, player.sprite.height * 0.8);
		//player.sprite.body.setRectangleFromSprite(player.sprite);
		player.sprite.body.setCollisionGroup(playerCollisionGroup);


	},
	OnShipIndexChanged: function ()
	{
		SceneHangar.instance.updateTexts();
		for (var i = 0; i < grpHangarCards.length; i++)
		{
			grpHangarCards.getAt(i).button.inputEnabled = highlightedShipIndex === i && SHIPS[i].price === 0;
			grpHangarCards.getAt(i).imgShip.alpha = SHIPS[i].price === 0 ? 1 : 0.3;
		}
		btnHangarSelect.visible = selectedShipIndex !== highlightedShipIndex;


		btnHangarSelect.text.text = SHIPS[highlightedShipIndex].price === 0 ? STR("SELECT") : STR("BUY");

		soundManager.playSound('click');
	},
	OnPressedSelectButton: function ()
	{

		if (SHIPS[highlightedShipIndex].price === 0)
		{
			selectedShipIndex = highlightedShipIndex;

		}
		else // buy
		{
			if (balance >= SHIPS[highlightedShipIndex].price)
			{
				selectedShipIndex = highlightedShipIndex;

				soundManager.playSound('kaching');
				game.time.events.add(Phaser.Timer.SECOND / 2, function ()
				{
					soundManager.playSound('shipAcquired');
				});

				balance -= SHIPS[highlightedShipIndex].price;
				SceneBalance.instance.updateText();

				SHIPS[highlightedShipIndex].price = 0;

				if (highlightedShipIndex == SHIPS.length - 1)
				{
					//goldenium
					grpHangarCards.getAt(highlightedShipIndex).goldeniumText.alpha = 1;
					grpHangarCards.getAt(highlightedShipIndex).goldeniumText.y = -120;
				}

			}
			else
			{
				soundManager.playSound('No_money');
				ScenesTransitions.transitionStarted();
				ScenesTransitions.showSceneAlpha(grpHangarMoneyWindow, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
			}
		}

		SceneHangar.instance.OnShipSelected();
		SceneHangar.instance.OnShipIndexChanged();
		SceneHangar.instance.updateCardButtons();

		grpHangarCards.getAt(selectedShipIndex).grpLockedLayer.visible = false;

		GameData.Save();

	},

	updateCardButtons: function ()
	{
		for (var i = 0; i < grpHangarCards.length; i++)
		{
			var card = grpHangarCards.getAt(i);
			if (i === selectedShipIndex)
			{
				card.button.loadTexture('pak1', 'tlacidlo_11');
				continue;
			}
			card.button.loadTexture('pak1', SHIPS[i].price === 0 ? 'tlacidlo_12' : 'tlacidlo_10');
		}
	}

	,
	updateTexts: function ()
	{
		txtHangarShipSpeedValue.text = SHIPS[highlightedShipIndex].displayedSpeed;
		txtHangarShipBrakeValue.text = SHIPS[highlightedShipIndex].displayedBrake;
		txtHangarShipLivesValue.text = SHIPS[highlightedShipIndex].lives;
	}
	,
	OnPressedBack: function ()
	{
		soundManager.playSound("click");

		if (grpHangarMoneyWindow.alpha > 0.3 && grpHangarMoneyWindow.visible)
		{
			ScenesTransitions.transitionStarted();
			ScenesTransitions.hideSceneAlpha(grpHangarMoneyWindow, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
		}
		else
		{
			SceneMenu.instance.ShowAnimated();
			SceneHangar.instance.HideAnimated();
		}
	}
	,
	ShowAnimated: function ()
	{

		grpHangarCards.x = game.world.centerX - grpHangarCards.getAt(selectedShipIndex).x;


		ScenesTransitions.transitionStarted();
		ScenesTransitions.showSceneAlpha(grpSceneHangar, 300, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
	}
	,

	HideAnimated: function ()
	{
		ScenesTransitions.hideSceneAlpha(grpSceneHangar, ScenesTransitions.TRANSITION_LENGTH * 0.5, ScenesTransitions.TRANSITION_LENGTH + 10);
	}
	,
}