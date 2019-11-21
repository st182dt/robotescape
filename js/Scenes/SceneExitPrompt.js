var SceneExitPrompt = function ()
{
	SceneExitPrompt.instance = this;
	this.create();
};
SceneExitPrompt.instance = null;

var tutorialKeys = [];

var canSkipTutorial = false;

SceneExitPrompt.prototype = {

	create: function ()
	{
		grpSceneExitPrompt = game.add.group();
		grpSceneExitPrompt.name = 'grpSceneExitPrompt';

		// Alert text
		txtPromptRestart = createText(game.width>>1,game.height>>1,STR("EXIT_PROMPT"),40,"font_yellow");
		txtPromptRestart.align="center";
		grpSceneExitPrompt.add(txtPromptRestart);


		btnPromptRestartConfirm = grpSceneExitPrompt.create(35, game.height - 35, 'pak1', 'tlacidlo_14');
		btnPromptRestartConfirm.anchor.set(0.5);
		AddButtonEvents(btnPromptRestartConfirm, this.OnPressedConfirm, ButtonOnInputOver, ButtonOnInputOut);

		btnPromptRestartCancel = grpSceneExitPrompt.create(game.width - 35, game.height - 35, 'pak1', 'tlacidlo_13');
		btnPromptRestartCancel.anchor.set(0.5);
		AddButtonEvents(btnPromptRestartCancel, this.OnPressedCancel, ButtonOnInputOver, ButtonOnInputOut);

		grpSceneExitPrompt.visible = false;
		this.onResolutionChange();
	},
	onResolutionChange: function ()
	{
		txtPromptRestart.reset(game.width>>1,game.height>>1);
		btnPromptRestartConfirm.reset(PADDING, game.height - PADDING);
		btnPromptRestartCancel.reset(game.width - PADDING, game.height - PADDING);
	},
	OnPressedConfirm: function ()
	{
		soundManager.playSound("click");

		SceneGame.instance.DoCleanup();
		SceneMenu.instance.ShowAnimated();

		SceneExitPrompt.instance.HideAnimated();


	},
	OnPressedCancel: function ()
	{
		soundManager.playSound("click");

		ScenePause.instance.ShowAnimated();

		SceneExitPrompt.instance.HideAnimated();

	},
	ShowAnimated: function ()
	{
		gameRunning = false;


		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.None;
		ScenesTransitions.showSceneAlpha(grpSceneExitPrompt, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
	}
	,

	HideAnimated: function ()
	{


		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
		ScenesTransitions.hideSceneAlpha(grpSceneExitPrompt, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
	}
}