var ScenePause = function ()
{
	ScenePause.instance = this;

	this.create();
};

ScenePause.instance = null;
var beforePauseGameRunning = false;
ScenePause.prototype = {

	create: function ()
	{
		grpScenePause = game.add.group();
		grpScenePause.name = 'grpScenePause';
		grpScenePause.visible = false;

		imgPauseBG = grpScenePause.add(CreateBoardSpr(0, 0, 400, 300, 'pak1', 'okno_01', 0.5, 0.5));

		// Resume btn
		btnPauseResume = CreateBoardSpr(0, 0, imgPauseBG.width * 0.7, 100, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpScenePause.add(btnPauseResume);
		AddButtonEvents(btnPauseResume, this.OnPressedResume, ButtonOnInputOver, ButtonOnInputOut);
		AddTextToObject(btnPauseResume, STR("RESUME"),[50,40],'font_yellow');

		// Settings btn
		/*btnPauseSettings = CreateBoardSpr(0, 0, imgPauseBG.width * 0.7, 70, 'pak1', 'tlacidlo_01', 0.5, 0.5);
		grpScenePause.add(btnPauseSettings);
		AddButtonEvents(btnPauseSettings, this.OnPressedSettings, ButtonOnInputOver, ButtonOnInputOut);
		AddTextToObject(btnPauseSettings, STR("SETTINGS"));*/

		// Menu btn
		btnPauseMenu = CreateBoardSpr(0, 0, imgPauseBG.width * 0.7, 100, 'pak1', 'tlacidlo_02', 0.5, 0.5);
		grpScenePause.add(btnPauseMenu);
		AddButtonEvents(btnPauseMenu, this.OnPressedMenu, ButtonOnInputOver, ButtonOnInputOut);
		AddTextToObject(btnPauseMenu, STR("MENU"),50,'font_yellow');


		this.onResolutionChange();
	},

	onResolutionChange: function ()
	{


		/*if (GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE) {

			btnPauseResume.reset((game.width >> 1), (game.height >> 1) - 15);

			btnPauseHome.reset((game.width >> 1), (game.height >> 1) + 15);
		}
		else {
			btnPauseResume.reset((game.width >> 1), (game.height >> 1) - 15);

			btnPauseHome.reset((game.width >> 1), (game.height >> 1) + 15);
		}*/

		imgPauseBG.reset((game.width >> 1), (game.height >> 1));

		btnPauseResume.reset((game.width >> 1), imgPauseBG.y - btnPauseResume.height * 0.7);
		//btnPauseSettings.reset((game.width >> 1), imgPauseBG.y + 10);
		btnPauseMenu.reset((game.width >> 1), imgPauseBG.y + btnPauseResume.height * 0.7);
	},


	OnPressedResume: function ()
	{

		soundManager.playSound('click');
		gameRunning = beforePauseGameRunning;
		ScenePause.instance.HideAnimated();

		// delay pre bug kde sa fps znízi
		game.time.events.add(0, function (){
			SceneGame.instance.ShowAnimated(true);
			SceneGame.instance.ResumeGame();
		});

	},

	OnPressedSettings: function ()
	{
		soundManager.playSound("click");

		SceneToReturnFromSettings = ScenePause.instance;
		ScenePause.instance.HideAnimated();

		SceneSettings.instance.ShowAnimated();
	},
	OnPressedMenu: function ()
	{
		game.time.events.removeAll();

		soundManager.playSound("click");
		ScenePause.instance.HideAnimated();

		SceneExitPrompt.instance.ShowAnimated();
		/*SceneGame.instance.DoCleanup();
		SceneMenu.instance.ShowAnimated();*/
	},

	ShowAnimated: function ()
	{
		this.onResolutionChange();
		game.time.gamePaused();
game.time.events.pause();
		beforePauseGameRunning = gameRunning;
		soundManager.playSound('click');

		ScenesTransitions.transitionStarted();

		//ScenesTransitions.showSceneAlpha(grpSceneOverlay);
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Back.Out;
		ScenesTransitions.showSceneFromBottom(grpScenePause, 0, ScenesTransitions.TRANSITION_LENGTH * 1.8, ScenesTransitions.transitionFinished);
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
	},

	HideAnimated: function ()
	{
		game.time.gameResumed();
		ScenesTransitions.transitionStarted();

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

		ScenesTransitions.hideSceneToBottom(grpScenePause, 0, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.transitionFinished);

		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

	}

}