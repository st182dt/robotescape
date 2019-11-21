var SceneBackground = function ()
{
	SceneBackground.instance = this;

	this.create();
};

SceneBackground.instance = null;

SceneBackground.prototype = {

	create: function ()
	{

		grpSceneBackgroundTop = game.add.group();
		game.stage.backgroundColor = '#05081d';
		imgBackground = game.add.tileSprite(0, 0, game.width, game.height, 'pozadie_01');
		imgBackground.anchor.set(0.5);


		//grpSceneBackgroundTop.visible = false;

	},
	onResolutionChange: function ()
	{

		if (GAME_CURRENT_ORIENTATION === ORIENTATION_LANDSCAPE)
		{

		}
		else
		{

		}
		imgBackground.position.setTo(game.world.centerX, game.world.centerY);

		imgBackground.width = game.width;
		imgBackground.height = game.height;
	},
	update: function ()
	{
	},
	render: function ()
	{
		//game.debug.text('FPS: ' + game.time.fps || 'FPS: --', 40, 40, "#00ff00", "30px Arial");

	},

	ShowAnimated: function ()
	{
		soundManager.playSound('click');

		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
		grpSceneBackgroundTop.alpha = 0;
		ScenesTransitions.showSceneAlpha(grpSceneBackgroundTop, 0, ScenesTransitions.TRANSITION_LENGTH * 4);
		//ScenesTransitions.showSceneFromTop(grpSceneBackgroundTop, 0, LEN);
	}
};