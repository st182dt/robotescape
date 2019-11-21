var SceneFlash = function ()
{
	SceneFlash.instance = this;
	this.create();
};
SceneFlash.instance = null;

SceneFlash.prototype = {

	create: function ()
	{
		imgFlash = game.add.sprite(game.width >> 1, game.height >> 1, 'pak1', 'blank_white');
		imgFlash.width = game.width * 2;
		imgFlash.height = game.height * 2;
		imgFlash.anchor.set(0.5);
		imgFlash.alpha = 0;

		flashTween = null;
		this.onResolutionChange();
	},
	onResolutionChange: function ()
	{
		imgFlash.position.set(game.width >> 1, game.height >> 1);
		imgFlash.width = game.width * 2;
		imgFlash.height = game.height * 2;
	},
	Flash: function (highestPointCallback, duration, delay, toAlpha, texture)
	{
		if (texture != null)
		{
			imgFlash.loadTexture('pak1', texture);
		}
		if (flashTween != null && flashTween.isRunning)
		{
			flashTween.stop();
		}
		imgFlash.alpha = 0;
		flashTween = game.add.tween(imgFlash).to({alpha: toAlpha == null ? 1 : toAlpha}, duration == null ? 150 : duration, Phaser.Easing.Cubic.In, true, delay == null ? 0 : delay, 0, true);
		if (typeof highestPointCallback != 'undefined')
		{
			flashTween.onRepeat.add(highestPointCallback);
		}
	}
}