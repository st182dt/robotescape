var SceneSettings = function ()
{
	SceneSettings.instance = this;

	this.create();
};

SceneSettings.instance = null;

SceneSettings.prototype = {

	create: function ()
	{
		grpSceneSettings = game.add.group();
		grpSceneSettings.visible = false;

		// Background
		imgSettingsBG = grpSceneSettings.add(CreateBoardSpr(0, 0, 390, 250, 'pak1', 'okno_01', 0.5, 0.5));

		// Music text
		txtSettingsMusic = createText(0, 0, STR('Music'), [55,45], 'font_yellow', 1);
		grpSceneSettings.add(txtSettingsMusic);

		// Music button
		btnSettingsMusic = grpSceneSettings.create(0, 0, 'pak1', 'tlacidlo_13');
		grpSceneSettings.add(btnSettingsMusic);
		AddButtonEvents(btnSettingsMusic, this.OnPressedMusic, ButtonOnInputOver, ButtonOnInputOut);
		btnSettingsMusic.setScaleMinMax(1, 1);
		btnSettingsMusic.anchor.set(0.5, 0.5);

		// Sound text
		txtSettingsSound = createText(0, 0, STR('Sounds'), [55,45], 'font_yellow', 1);
		grpSceneSettings.add(txtSettingsSound);

		// Sound button
		btnSettingsSound = grpSceneSettings.create(0, 0, 'pak1', 'tlacidlo_13');
		grpSceneSettings.add(btnSettingsSound);
		AddButtonEvents(btnSettingsSound, this.OnPressedSound, ButtonOnInputOver, ButtonOnInputOut);
		btnSettingsSound.setScaleMinMax(1, 1);
		btnSettingsSound.anchor.set(0.5, 0.5);

		// Close button
		btnSettingsClose = grpSceneSettings.create(0, 0, 'pak1', 'tlacidlo_07');
		btnSettingsClose.anchor.set(0.5);
		AddButtonEvents(btnSettingsClose, this.OnPressedSettingsClose, ButtonOnInputOver, ButtonOnInputOut);


		// Load last music/sound state
		if (soundCached != soundManager.soundPlaying)
		{
			SceneSettings.instance.OnPressedSound();
		}
		if (musicCached != soundManager.musicPlaying)
		{
			SceneSettings.instance.OnPressedMusic();
		}
		this.onResolutionChange();
	},

	onResolutionChange: function ()
	{
		if (GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE)
		{
		}
		else
		{

		}


		imgSettingsBG.reset(game.width >> 1, game.height >> 1);

		//btnSettingsInstructions.reset(game.width >> 1, (game.height >> 1) - 100);

		btnSettingsClose.reset(game.width - PADDING, game.height - PADDING);

		txtSettingsMusic.reset(game.world.centerX + 30, game.world.centerY - 45);
		txtSettingsSound.reset(game.world.centerX + 30, game.world.centerY + 45);

		btnSettingsMusic.reset(game.world.centerX + 100, game.world.centerY - 45);
		btnSettingsSound.reset(game.world.centerX + 100, game.world.centerY + 45);


	},

	// <---- BUTTON CALLBACKS
	OnPressedSettingsClose: function ()
	{
		soundManager.playSound('click');
		ScenesTransitions.hideSceneAlpha(grpSceneSettings);

		SceneToReturnFromSettings.ShowAnimated();
	},
	/*OnPressedSettingsInstructions: function () {
		soundManager.playSound('click');
		ScenesTransitions.hideSceneAlpha(grpSceneSettings);

		SceneInstructions.instance.ShowAnimated();
	},*/
	OnPressedMusic: function ()
	{
		soundManager.playSound('click');

		soundManager.toggleMusic('game_music');
		btnSettingsMusic.loadTexture('pak1', soundManager.musicPlaying ? "tlacidlo_14" : "tlacidlo_13");

		GameData.Save();
	},
	OnPressedSound: function ()
	{
		soundManager.playSound('click');
		soundManager.toggleSounds();

		btnSettingsSound.loadTexture('pak1', soundManager.soundPlaying ? "tlacidlo_14" : "tlacidlo_13");

		GameData.Save();
	},
	// BUTTON CALLBACKS ---->

	ShowAnimated: function ()
	{
		SceneSettings.instance.onResolutionChange();
		gameRunning = false;

		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
		ScenesTransitions.showSceneAlpha(grpSceneSettings, 300, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);


		ScenesTransitions.showSceneScale(btnSettingsClose, 400, 200);

		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
	},

	HideAnimated: function ()
	{
		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
		ScenesTransitions.hideSceneAlpha(grpSceneSettings, ScenesTransitions.TRANSITION_LENGTH * 0.5, ScenesTransitions.TRANSITION_LENGTH + 10, ScenesTransitions.transitionFinished);

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
	}
}