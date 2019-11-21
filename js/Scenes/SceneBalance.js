var SceneBalance = function ()
{
	SceneBalance.instance = this;

	this.create();
};

SceneBalance.instance = null;
SceneBalance.prototype = {

	create: function ()
	{
		grpSceneBalance = game.add.group();
		grpSceneBalance.visible = false;

		imgBalanceCoin = grpSceneBalance.add(game.add.sprite(0, 0, 'pak1', 'minca'));
		imgBalanceCoin.anchor.set(0.5);
		txtBalance = grpSceneBalance.add(createText(0, 0, balance, 45,'font_yellow'));
		txtBalance.anchor.set(1,0.47);

		this.updateText();
		this.onResolutionChange();
	},

	onResolutionChange: function ()
	{
		imgBalanceCoin.reset(160, PADDING);

		txtBalance.reset(130, imgBalanceCoin.y);
	},
	updateText: function ()
	{
		txtBalance.text = balance;
	},
	// <---- BUTTON CALLBACKS

	// BUTTON CALLBACKS ---->

	ShowAnimated: function ()
	{
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Quadratic.Out;
		ScenesTransitions.showSceneAlpha(grpSceneBalance, 300, ScenesTransitions.TRANSITION_LENGTH);

		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
	},

	HideAnimated: function ()
	{
		ScenesTransitions.transitionStarted();
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
		ScenesTransitions.hideSceneAlpha(grpSceneBalance, ScenesTransitions.TRANSITION_LENGTH * 0.5, ScenesTransitions.TRANSITION_LENGTH + 10, ScenesTransitions.transitionFinished);

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
	}
}