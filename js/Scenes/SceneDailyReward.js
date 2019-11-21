var SceneDailyReward = function ()
{
	SceneDailyReward.instance = this;

	this.create();
};

SceneDailyReward.instance = null;

SceneDailyReward.prototype = {

	create: function ()
	{
		grpSceneDailyReward = game.add.group();
		grpSceneDailyReward.name = 'grpSceneDailyReward';
		grpSceneDailyReward.visible = false;


		imgDailyRewardOverlay = createFullscreenOverlay('blank_black');
		imgDailyRewardOverlay.alpha = 0.9;
		grpSceneDailyReward.add(imgDailyRewardOverlay);

		// reward title
		txtDailyRewardTitle = createText(0, 0, STR("DAILY_REWARD"), [50,45], 'font_red');
		txtDailyRewardTitle.wordWrap=true;
		txtDailyRewardTitle.wordWrapWidth=200;


		grpSceneDailyReward.add(txtDailyRewardTitle);

		txtDailyRewardCoins = createText(0, 0, "65", 200, 'font_2_yellow');
		grpSceneDailyReward.add(txtDailyRewardCoins);

		btnDailyRewardCollect = CreateBoardSpr(0, 0, 360, 120, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpSceneDailyReward.add(btnDailyRewardCollect);
		AddButtonEvents(btnDailyRewardCollect, this.OnPressedCollect, ButtonOnInputOver, ButtonOnInputOut);
		AddTextToObject(btnDailyRewardCollect, STR("COLLECT"), 58, 'font_yellow');

		imgDailyRewardCoin = grpSceneDailyReward.add(game.add.sprite(0, 0, 'pak1', 'minca_big'));
		imgDailyRewardCoin.anchor.set(0.5);
		imgDailyRewardCoin.scale.set(2);

		this.onResolutionChange();
	},

	onResolutionChange: function ()
	{

		imgDailyRewardOverlay.width = game.width * 3;
		imgDailyRewardOverlay.height = game.height * 3;

		imgDailyRewardOverlay.position.set(game.world.centerX, game.world.centerY);


		// revive title
		txtDailyRewardTitle.reset(game.world.centerX, game.world.centerY - 200);

		txtDailyRewardCoins.reset(game.world.centerX - 75, game.world.centerY - 65);
		imgDailyRewardCoin.reset(game.world.centerX + 100, game.world.centerY - 65);

		btnDailyRewardCollect.reset(game.world.centerX, game.world.centerY + 100);
	},

	OnPressedCollect: function ()
	{
		soundManager.playSound('kaching');
		SceneDailyReward.instance.HideAnimated();

		ScenesTransitions.hideSceneAlpha(txtBalance, 0, 300, function ()
		{

			balance += 65;
			SceneBalance.instance.updateText();
			ScenesTransitions.showSceneAlpha(txtBalance, 0, 300);
			GameData.Save();
		});
	},
	ShowAnimated: function ()
	{
		this.onResolutionChange();
		ScenesTransitions.transitionStarted();

		ScenesTransitions.showSceneAlpha(grpSceneDailyReward, 900, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

		//grpSceneDailyReward.visible = true;
	},

	HideAnimated: function ()
	{
		ScenesTransitions.transitionStarted();

		ScenesTransitions.hideSceneAlpha(grpSceneDailyReward, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

	}

}