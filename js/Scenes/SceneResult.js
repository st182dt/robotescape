var SceneResult = function ()
{
	SceneResult.instance = this;

	this.create();
};

SceneResult.instance = null;
SceneResult.prototype = {

	create: function ()
	{
		grpSceneResult = game.add.group();
		grpSceneResult.name = 'grpSceneResult';
		grpSceneResult.visible = false;

		// regular result group
		grpSceneResultRegular = game.add.group();
		grpSceneResultRegular.visible = false;
		grpSceneResult.add(grpSceneResultRegular);

		// endless result group
		grpSceneResultEndless = game.add.group();
		grpSceneResultEndless.visible = false;
		grpSceneResult.add(grpSceneResultEndless);

		txtResultCongratulations = createText(0, 0, STR('FAILED'), 50);
		grpSceneResultRegular.add(txtResultCongratulations);

		// coin
		imgResultCoin = game.add.sprite(50, 150, 'pak1', 'minca');
		imgResultCoin.scale.set(1.5);
		imgResultCoin.anchor.set(0.5);
		grpSceneResult.add(imgResultCoin);

		// coins collected value text
		txtResultCoinsCollectedValue = createText(0, 0, '4', 80, 'font_yellow');
		grpSceneResult.addChild(txtResultCoinsCollectedValue);
		txtResultCoinsCollectedValue.anchor.set(getCorrectAnchorX(txtResultCoinsCollectedValue, 1), getCorrectAnchorY(txtResultCoinsCollectedValue, 0.5));


		// Collect button
		btnResultCollect = CreateBoardSpr(0, 0, 270, 100, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpSceneResult.add(btnResultCollect);
		AddButtonEvents(btnResultCollect, this.OnPressedContinue, ButtonOnInputOver, ButtonOnInputOut);
		AddTextToObject(btnResultCollect, STR('CONTINUE'), [50, 40], 'font_yellow');
		btnResultCollect.text.fill = '#ffd40c';

		// planet
		imgResultPlanet = CreatePlanetWithText('Earth', 'planeta_01');
		grpSceneResultRegular.add(imgResultPlanet);

		// objective window
		imgResultObjectiveWindow = CreateBoardSpr(0, 0, 300, 70, 'pak1', 'okno_01_small', 0.5, 0.5);
		grpSceneResultRegular.add(imgResultObjectiveWindow);

		AddTextToObject(imgResultObjectiveWindow, STR('OBJECTIVE'), 30, 'font_blue');
		imgResultObjectiveWindow.text.y = -imgResultObjectiveWindow.height / 2 - 20;

		// objective text
		txtResultObjectiveText = createText(-imgResultObjectiveWindow.width / 2 + 20, 0, 'Eliminate:', [40, 30], 'font_red');
		imgResultObjectiveWindow.addChild(txtResultObjectiveText);
		txtResultObjectiveText.anchor.set(getCorrectAnchorX(txtResultObjectiveText, 0), getCorrectAnchorY(txtResultObjectiveText, 0.4));

		// objective value
		txtResultObjectiveTextValue = createText(0, 0, '4', [40, 30], 'font_blue_2');
		imgResultObjectiveWindow.addChild(txtResultObjectiveTextValue);
		txtResultObjectiveTextValue.anchor.set(getCorrectAnchorX(txtResultObjectiveTextValue, 0), getCorrectAnchorY(txtResultObjectiveTextValue, 0.4));

		// objective status
		imgResultObjectiveStatus = game.add.sprite(imgResultObjectiveWindow.width / 2 - 40, 0, 'pak1', 'krizik_02');
		imgResultObjectiveWindow.addChild(imgResultObjectiveStatus);
		imgResultObjectiveStatus.setScaleMinMax(1, 1, 1, 1);
		imgResultObjectiveStatus.anchor.set(0.5, 0.4);

		//-------------------------------------------------------------------
		// ENDLESS


		// BIG score text
		txtResultEndlessScoreValue = createText(game.width / 3.5, game.height / 3 + 75, '20', 250, 'font2');
		grpSceneResultEndless.add(txtResultEndlessScoreValue);

		// your score
		txtResultEndlessScoreLabel = createText(0, -125, STR('YOUR_SCORE'), 40, 'font_red');
		txtResultEndlessScoreValue.addChild(txtResultEndlessScoreLabel);

		// best score text
		txtResultEndlessBestScore = createText(0, 115, STR('BEST') + ': 0', 30, 'font_red');
		txtResultEndlessScoreValue.addChild(txtResultEndlessBestScore);

		// group pre rank side
		grpSceneResultEndlessRankWindowGroup = game.add.group();
		grpSceneResultEndless.add(grpSceneResultEndlessRankWindowGroup);

		// title - Your Rank:
		txtResultEndlessRankWindowLabel = createText(0, -210, STR('YOUR_RANK'), 40, 'font_blue');
		grpSceneResultEndlessRankWindowGroup.add(txtResultEndlessRankWindowLabel);

		// Rank window
		imgResultEndlessRankWindow = CreateBoardSpr(0, 0, 500, 340, 'pak1', 'okno_01', 0.5, 0.5);
		grpSceneResultEndlessRankWindowGroup.add(imgResultEndlessRankWindow);


		grpSceneResultEndlessRankWindowGroup.position.setTo(game.width / 1.4, game.height / 3 + 60);
		// Rank window entries
		for (var i = 0; i < RANKS.length; i++)
		{
			var rowY = 125 - (i * 50);
			var loopsText = createText(-210, rowY, RANKS[i].loops, 35, null, 0);
			grpSceneResultEndlessRankWindowGroup.add(loopsText);

			var titleText = createText(-20, rowY, RANKS[i].title, 35);
			grpSceneResultEndlessRankWindowGroup.add(titleText);

			var rewardText = createText(180, rowY, RANKS[i].reward, 35, null, 1);
			grpSceneResultEndlessRankWindowGroup.add(rewardText);

			var rewardTextCoin = game.add.sprite(30, 0, 'pak1', 'minca_2');
			rewardTextCoin.anchor.set(0.5);
			rewardText.addChild(rewardTextCoin);

			var rewardCheck = game.add.sprite(rewardText.x, rowY, 'pak1', 'fajka_01');
			rewardCheck.visible = false;
			rewardCheck.anchor.set(0.5);
			grpSceneResultEndlessRankWindowGroup.add(rewardCheck);

			rankRows[i] = {
				loopsText: loopsText,
				titleText: titleText,
				rewardText: rewardText,
				rewardCheck: rewardCheck
			};
		}

		imgResultEndlessAsteroid = game.add.sprite(140, game.height - 200, 'pak1', 'planet_score_01');
		imgResultEndlessAsteroid.visible = false;
		imgResultEndlessAsteroid.anchor.set(0.5);
		grpSceneResultEndless.add(imgResultEndlessAsteroid);
		AddTextToObject(imgResultEndlessAsteroid, STR('NEW_RECORD').replace(' ', '\n'), [35,23]);
		imgResultEndlessAsteroid.text.align = 'center';


		spaceKey.onDown.add(function ()
		{
			if (grpSceneResult.visible && ScenesTransitions.transitionActive == false)
			{
				SceneResult.instance.OnPressedContinue();
			}
		});

		this.onResolutionChange();
	},
	setRank: function (rankIndex)
	{
		for (var i = 0; i < rankRows.length; i++)
		{
			var font = 'font_blue';
			var reached = false;
			if (i <= rankIndex)
			{
				font = i >= 5 ? 'font_yellow' : 'font_red';
				reached = true;
			}
			rankRows[i].rewardText.visible = !reached;
			rankRows[i].rewardCheck.visible = reached;

			rankRows[i].loopsText.font = font;
			rankRows[i].titleText.font = font;
			rankRows[i].rewardText.font = font;


		}
		rankRows[5].rewardCheck.loadTexture('pak1', rankIndex >= 5 ? 'fajka_yellow' : 'fajka_01');
	},
	onResolutionChange: function ()
	{
		if (ScenesTransitions.transitionActive)
		{
			game.time.events.add(levelsData[currentLevel].asteroidStartDelay * 500, function ()
			{
				SceneResult.instance.onResolutionChange();
			}, 100);
			return;
		}
		if (GAME_CURRENT_ORIENTATION === ORIENTATION_PORTRAIT)
		{
			txtResultCongratulations.reset(game.width >> 1, (game.height >> 1) - 300);

			imgResultPlanet.reset((game.width >> 1), (game.height >> 1) - 100);
			imgResultObjectiveWindow.reset((game.width >> 1), (game.height >> 1) + 160);

			txtResultEndlessScoreValue.reset(game.world.centerX, game.height / 4);
			grpSceneResultEndlessRankWindowGroup.position.setTo(game.world.centerX, game.height / 1.6);

			imgResultEndlessAsteroid.position.setTo(180, txtResultEndlessScoreValue.y + 100);
		}
		else
		{
			txtResultCongratulations.reset(game.width >> 1, (game.height >> 1) - 160);

			imgResultPlanet.reset((game.width >> 1) - 250, (game.height >> 1) + 20);
			imgResultObjectiveWindow.reset((game.width >> 1) + 250, (game.height >> 1) + 20);

			txtResultEndlessScoreValue.reset(game.width / 4, game.height / 3 + 75);
			grpSceneResultEndlessRankWindowGroup.position.setTo(game.width / 1.5, game.height / 3 + 50);

			imgResultEndlessAsteroid.position.setTo(140, game.height - 200);
		}


		btnResultCollect.position.setTo(game.width >> 1, game.height - PADDING);


		txtResultCoinsCollectedValue.reset(game.world.centerX, game.height - 160);
		imgResultCoin.position.setTo(game.world.centerX + imgResultCoin.width / 1.5, game.height - 160);
	},
	getRankIndexFromScore: function (score)
	{
		for (var i = RANKS.length - 1; i >= 0; i--)
		{
			if (score >= RANKS[i].loops)
			{
				return i;
			}
		}
	},
	OnPressedContinue: function ()
	{
		SceneResult.instance.HideAnimated();
		if (successfullyCompletedLevel)
		{
			if (currentLevel > PLANETS.length - 2)
			{
				SceneMenu.instance.updateEndlessButton();
				GameData.Save();
			}
			else
			{
				ScenesTransitions.transitionStarted();
				game.time.events.add(300, function ()
				{
					SceneMenu.instance.moveToNextPlanet();
				});
			}
		}
		SceneMenu.instance.ShowAnimated();
	},
	ShowAnimated: function ()
	{
		addedCoins = false;

		if (objectiveManager.currentObjectiveType == OBJECTIVE_TYPES.ENDLESS)
		{
			grpSceneResultRegular.visible = false;
			grpSceneResultEndless.visible = true;

			txtResultEndlessScoreValue.text = 0;
			txtResultEndlessBestScore.text = STR("Best") + ": " + bestScore;


			ScenesTransitions.showSceneAlpha(txtResultEndlessScoreLabel, 400, ScenesTransitions.TRANSITION_LENGTH);
			ScenesTransitions.showSceneAlpha(txtResultEndlessScoreValue, 400, ScenesTransitions.TRANSITION_LENGTH);
			ScenesTransitions.showSceneAlpha(txtResultEndlessBestScore, 400, ScenesTransitions.TRANSITION_LENGTH);

			ScenesTransitions.showSceneAlpha(txtResultEndlessRankWindowLabel, 600, ScenesTransitions.TRANSITION_LENGTH);
			ScenesTransitions.showSceneAlpha(grpSceneResultEndlessRankWindowGroup, 600, ScenesTransitions.TRANSITION_LENGTH);

			ScenesTransitions.showSceneAlpha(imgResultCoin, 1000, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
			ScenesTransitions.showSceneAlpha(txtResultCoinsCollectedValue, 1000, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

			ScenesTransitions.showSceneAlpha(btnResultCollect, 1100, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

			// count up tween for BIG Score TEXT
			currentScoreTweenValue = {value: 0};
			scoreCointTween = game.add.tween(currentScoreTweenValue).to({value: loopsCompletedThisGame}, loopsCompletedThisGame * 80, Phaser.Easing.Linear.None, false, 500);
			var endlessScoreTween = function ()
			{
				txtResultEndlessScoreValue.text = Math.floor(currentScoreTweenValue.value);
			};
			scoreCointTween.onUpdateCallback(endlessScoreTween);
			scoreCointTween.onComplete.addOnce(endlessScoreTween);
			scoreCointTween.start();

			// count up tween for collected coins text
			currentCoinsTweenValue = {value: 0};
			scoreCointTween = game.add.tween(currentCoinsTweenValue).to({value: coinsCollectedThisGame}, coinsCollectedThisGame * 80, Phaser.Easing.Linear.None, false, 1000);
			var scoreCoinTweenCallback = function ()
			{
				txtResultCoinsCollectedValue.text = Math.floor(currentCoinsTweenValue.value);
			};
			scoreCointTween.onUpdateCallback(scoreCoinTweenCallback);
			scoreCointTween.onComplete.addOnce(scoreCoinTweenCallback);
			scoreCointTween.start();

			txtResultEndlessBestScore.x=beatBestScoreThisGame?30:0;
			if (beatBestScoreThisGame)
			{

				imgResultEndlessAsteroid.visible = true;
				imgResultEndlessAsteroid.alpha = 0;
				imgResultEndlessAsteroid.scale.set(20, 20);
				imgResultEndlessAsteroid.rotation = -4 + Math.random() * 4;

				game.add.tween(imgResultEndlessAsteroid).to(
					{
						alpha: 1
					},
					1500, Phaser.Easing.Cubic.In, true);

				game.add.tween(imgResultEndlessAsteroid).to(
					{
						rotation: -0.2 - Math.random() * 0.5
					},
					1000, Phaser.Easing.Cubic.In, true);

				var asteroidScaleTween = game.add.tween(imgResultEndlessAsteroid.scale).to(
					{
						x: 1,
						y: 1
					},
					1000, Phaser.Easing.Cubic.In, true);
				asteroidScaleTween.onComplete.add(function ()
				{
					soundManager.playSound("new_record");

					game.camera.shake(0.03 + game.rnd.rnd() * 0.01, 150 + game.rnd.rnd() * 80);
				});


			}
			else
			{
				imgResultEndlessAsteroid.visible = false;
			}
			var newRank = SceneResult.instance.getRankIndexFromScore(loopsCompletedThisGame);


			if (newRank > rank)
			{
				LOG("RANK IS " + rank);
				for (var i = rank + 1; i <= newRank; i++)
				{
					if (i == -1)
					{
						continue;
					}
					balance += RANKS[i].reward;
				}
				SceneBalance.instance.updateText();

				rank = newRank;
				GameData.Save();
			}
			SceneResult.instance.setRank(rank);
		}
		else // not endless
		{
			grpSceneResultRegular.visible = true;
			grpSceneResultEndless.visible = false;


			ScenesTransitions.showSceneAlpha(txtResultCongratulations, 200, ScenesTransitions.TRANSITION_LENGTH);

			ScenesTransitions.showSceneAlpha(imgResultPlanet, 300, ScenesTransitions.TRANSITION_LENGTH);
			ScenesTransitions.showSceneAlpha(imgResultObjectiveWindow, 400, ScenesTransitions.TRANSITION_LENGTH);
			ScenesTransitions.showSceneAlpha(imgResultObjectiveWindow, 400, ScenesTransitions.TRANSITION_LENGTH);

			ScenesTransitions.showSceneAlpha(imgResultCoin, 500, ScenesTransitions.TRANSITION_LENGTH);
			ScenesTransitions.showSceneAlpha(txtResultCoinsCollectedValue, 500, ScenesTransitions.TRANSITION_LENGTH);

			ScenesTransitions.showSceneAlpha(btnResultCollect, 600, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
		}
		txtResultCoinsCollectedValue.text = coinsCollectedThisGame;

		imgResultPlanet.loadTexture('pak1', PLANETS[currentLevel].sprite);
		imgResultPlanet.text.text = PLANETS[currentLevel].name;
		imgResultPlanet.text.y = -imgResultPlanet.height / 1.5;

		txtResultObjectiveTextValue.x = txtResultObjectiveText.x + txtResultObjectiveText.width;

// endless


		SceneResult.instance.onResolutionChange();


		ScenesTransitions.transitionStarted();

		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
		ScenesTransitions.showSceneAlpha(grpSceneResult, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
	},
	HideAnimated: function ()
	{
		ScenesTransitions.transitionStarted();

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

		ScenesTransitions.hideSceneAlpha(grpSceneResult, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
	}
}