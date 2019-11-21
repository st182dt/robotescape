var SceneLanguages = function ()
{
	SceneLanguages.instance = this;

	this.create();
};

SceneLanguages.instance = null;

SceneLanguages.prototype = {

	create: function ()
	{
        ScenesTransitions.hideSceneAlpha(imgBackgroundPreload);
        imgBg = game.add.tileSprite(0, 0, game.width, game.height, 'pozadie_01');
        ScenesTransitions.showSceneAlpha(imgBg);
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, game.width, game.height / 6);
        graphics.alpha = 0.25;
        window.graphics = graphics;
        
		grpSceneLanguages = game.add.group();
		grpSceneLanguages.position.set(game.width >> 1, game.height >> 1);

		btnScale = 1;
		btnH = 100 * btnScale;
		btnW = 100 * btnScale;
        
        
        
		btnLangEN = grpSceneLanguages.create(0, 0, 'english_flag');
		btnLangEN.anchor.set(0.5);
		btnLangEN.scale.set(btnScale);
		AddButtonEvents(btnLangEN, this.OnPressedLangEN, this.onOver, this.onOut);
        
        btnOutline = grpSceneLanguages.create(0, 0, 'outline');
		btnOutline.anchor.set(0.5);
		btnOutline.scale.set(btnScale);
        btnOutline.alpha = 0;
        
		grpSceneLanguages.visible = false;

		this.onResolutionChange();
	},
    onOver: function ()
	{
        game.add.tween(btnLangEN).to({angle:8,alpha:0.75}, 50, Phaser.Easing.Quadratic.In, true);
        game.add.tween(btnOutline).to({alpha:1}, 100, Phaser.Easing.Quadratic.In, true);
        
		//btnLangEN.scale.set(btnScale * 1.1);
	},
    onOut: function ()
	{
        game.add.tween(btnLangEN).to({angle:0,alpha:1}, 50, Phaser.Easing.Quadratic.In, true);
        game.add.tween(btnOutline).to({alpha:0}, 100, Phaser.Easing.Quadratic.In, true);
        
	},

	onResolutionChange: function ()
	{
        graphics.clear();
        graphics.drawRect(0, game.height / 2 - btnH * 1.125, game.width, btnH * 2.25);
		grpSceneLanguages.position.set(game.width >> 1, game.height >> 1);
        
		imgBg.width = game.width;
		imgBg.height = game.height;

	},
	OnPressedLangEN: function ()
	{
        language = "en";
        GAME_FONT = 'arial';
        SceneLanguages.instance.HideAnimated();
        game.state.start('GameState');
	},

	ShowAnimated: function ()
	{
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.Out;
		ScenesTransitions.showSceneAlpha(grpSceneLanguages, 0, ScenesTransitions.TRANSITION_LENGTH);
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
	},

	HideAnimated: function ()
	{
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
		ScenesTransitions.hideSceneAlpha(grpSceneLanguages, ScenesTransitions.TRANSITION_LENGTH);
        game.add.tween(graphics).to({alpha:0}, ScenesTransitions.TRANSITION_LENGTH, Phaser.Easing.Linear.Out, true);
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
	}

}


