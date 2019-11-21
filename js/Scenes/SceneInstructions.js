var SceneInstructions = function ()
{
	SceneInstructions.instance = this;

	this.create();
};

SceneInstructions.instance = null;

SceneInstructions.prototype = {

	create: function ()
	{
		grpSceneInstructions = game.add.group();
		grpSceneInstructions.visible = false;

		imgInstructionsOverlay = createFullscreenOverlay('blank_black');
		grpSceneInstructions.add(imgInstructionsOverlay);


		/*imgInstructionsLogo = grpSceneInstructions.create(game.width >> 1, (game.height >> 1) * 1.5, 'pak1', 'logo');
		imgInstructionsLogo.anchor.set(0.5);

		txtInstructionsGameVersion = new Phaser.Text(game, game.width >> 1, imgInstructionsLogo.position.y + imgInstructionsLogo.getBounds().bottom + 35, "Version 1.0.0", {
			fill: '#3f3f3f',
			font: '20px ' + GAME_FONT,
			align: 'center'
		});
		txtInstructionsGameVersion.anchor.set(0.5);
		grpSceneInstructions.add(txtInstructionsGameVersion);*/

		imgInstructionsWindowLandscape = CreateBoardSpr(game.world.centerX, game.world.centerY, 800, 550, 'pak1', 'okno_02', 0.5, 0.5);
		grpSceneInstructions.add(imgInstructionsWindowLandscape);

		imgInstructionsWindowPortrait = CreateBoardSpr(game.world.centerX, game.world.centerY, 550, 800, 'pak1', 'okno_02', 0.5, 0.5);
		grpSceneInstructions.add(imgInstructionsWindowPortrait);

		txtInstructionsText = createText(0, 0, STR('INSTRUCTIONS'), [40,35], 'font_yellow');
		txtInstructionsText.align = 'center';
		txtInstructionsText.wordWrap=true;

		imgInstructionsWindowPortrait.addChild(txtInstructionsText);


		btnInstructionsClose = grpSceneInstructions.create(0, 0, 'pak1', 'tlacidlo_07');
		btnInstructionsClose.anchor.set(0.5);
		AddButtonEvents(btnInstructionsClose, this.OnPressedInstructionsClose, ButtonOnInputOver, ButtonOnInputOut);


		this.onResolutionChange();
	},

	onResolutionChange: function ()
	{
		//grpSceneInstructions.position.set((game.width >> 1), (game.height >> 1));
		if (GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE)
		{
			imgInstructionsWindowLandscape.addChild(txtInstructionsText);
			txtInstructionsText.maxWidth = txtInstructionsText.wordWrapWidth =680;
		}
		else
		{
			imgInstructionsWindowPortrait.addChild(txtInstructionsText);
			txtInstructionsText.maxWidth = txtInstructionsText.wordWrapWidth =500;
		}
		btnInstructionsClose.reset(game.width - PADDING, game.height - PADDING);

		/*txtInstructionsGameVersion.reset(imgInstructionsLogo.position.x, imgInstructionsLogo.getBounds().bottom + PADDING);
		txtInstructionsGameVersion.reset(imgInstructionsLogo.position.x, imgInstructionsLogo.getBounds().bottom + PADDING);*/

		imgInstructionsOverlay.position.set(game.world.centerX, game.world.centerY);
		imgInstructionsOverlay.width = game.width*5;
		imgInstructionsOverlay.height = game.height*5;

		imgInstructionsWindowPortrait.visible = GAME_CURRENT_ORIENTATION == ORIENTATION_PORTRAIT;
		imgInstructionsWindowLandscape.visible = GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE;


		imgInstructionsWindowPortrait.position.set(game.world.centerX, game.world.centerY);
		imgInstructionsWindowLandscape.position.set(game.world.centerX, game.world.centerY);
	},
	OnPressedInstructionsClose: function ()
	{
		soundManager.playSound('click');
		SceneInstructions.instance.HideAnimated();

		//SceneMenu.instance.ShowAnimated();
		//SceneSettings.instance.ShowAnimated();
	},

	ShowAnimated: function ()
	{
		//gameRunning = false;

		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
		ScenesTransitions.showSceneAlpha(grpSceneInstructions, 0, ScenesTransitions.TRANSITION_LENGTH);
		ScenesTransitions.showSceneAlpha(txtInstructionsText, 100, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

		//ScenesTransitions.showSceneScale(btnInstructionsClose, 500, 200, null, Phaser.Easing.Back.Out);

		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
	},

	HideAnimated: function ()
	{
		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
		ScenesTransitions.hideSceneAlpha(grpSceneInstructions, ScenesTransitions.TRANSITION_LENGTH * 0.5, ScenesTransitions.TRANSITION_LENGTH + 10, ScenesTransitions.transitionFinished);

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
	},
}