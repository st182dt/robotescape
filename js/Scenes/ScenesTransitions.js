var ScenesTransitions = function ()
{
};

ScenesTransitions.TRANSITION_LENGTH = 200;
ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;

ScenesTransitions.transitionActive = false;

ScenesTransitions.transitionStarted = function ()
{
	//console.log("transition active");
	ScenesTransitions.transitionActive = true;
};

ScenesTransitions.transitionFinished = function ()
{
	ScenesTransitions.transitionActive = false;
};

ScenesTransitions.shakeScene = function (scene, shakeAmount, delay, shakeLength, callbackOnComplete, callbackOnUpdate)
{
	if (shakeAmount === undefined)
	{
		shakeAmount = 3;
	}
	if (delay === undefined)
	{
		delay = 0;
	}
	if (shakeLength === undefined)
	{
		shakeLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callbackOnComplete === undefined)
	{
		callbackOnComplete = null;
	}
	if (callbackOnUpdate === undefined)
	{
		callbackOnUpdate = null;
	}

	game.tweens.removeFrom(scene, true);

	var tween = game.add.tween(scene.position);
	//properties, duration, ease, autoStart, delay, repeat, yoyo
	scene.position.orgX = scene.position.x;
	scene.position.orgY = scene.position.y;
	scene.position.shakeAmount = shakeAmount;

	//properties, duration, ease, autoStart, delay, repeat, yoyo
	tween.to({x: scene.position.x, y: scene.position.y}, shakeLength, Phaser.Easing.Cubic.InOut, true, delay);
	tween.onUpdateCallback(function (twn, percent, twnData)
	{
		//xpos, ypos, colour, particlesCount, blendMode
		twn.target.x = twn.target.orgX + getRandomInt(twn.target.shakeAmount);
		twn.target.y = twn.target.orgY + getRandomInt(twn.target.shakeAmount);
		if (this.callbackOnUpdate != null)
		{
			this.callbackOnUpdate(percent);
		}

	}, {callbackOnUpdate: callbackOnUpdate});
	tween.onComplete.add(function ()
	{
		this.scene.position.x = this.scene.position.orgX;
		this.scene.position.y = this.scene.position.orgY;
		if (this.callbackOnComplete != null)
		{
			this.callbackOnComplete();
		}
	}, {scene: scene, callbackOnComplete: callbackOnComplete});

	return tween;
};

ScenesTransitions.showSceneAlpha = function (scene, delay, transitionLength, callback, toAlpha)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH / 2;
	}
	if (callback === undefined)
	{
		callback = null;
	}
	if (toAlpha === undefined)
	{
		toAlpha = 1;
	}

	//game.tweens.removeFrom(scene, false); //true

	scene.visible = true;
	scene.alpha = 0;
	var showTween = game.add.tween(scene).to({alpha: toAlpha}, transitionLength, ScenesTransitions.TRANSITION_EFFECT_IN, false, delay);
	showTween.onComplete.add(ScenesTransitions.onSceneShown, {shownScene: scene, callback: callback});
	showTween.start();

	scene.showTween = showTween;
};

ScenesTransitions.showSceneH = function (scene, left, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	game.tweens.removeFrom(scene, true);

	scene.visible = true;
	scene.x = game.width * (left ? -2 : 2);
	scene.y = 0;
	showTween = game.add.tween(scene).to({x: 0}, transitionLength, ScenesTransitions.TRANSITION_EFFECT_IN, false);
	showTween.onComplete.add(ScenesTransitions.onSceneShown, {shownScene: scene, callback: callback});
	showTween.start();

	scene.showTween = showTween;
};

ScenesTransitions.showSceneFromLeft = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	return ScenesTransitions.showSceneH(scene, true, delay, transitionLength, callback);
};

ScenesTransitions.showSceneV = function (scene, top, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	game.tweens.removeFrom(scene, true);

	scene.visible = true;
	scene.x = 0;
	scene.y = game.height * (top ? -2 : 2);

	showTween = game.add.tween(scene).to({y: 0}, transitionLength, ScenesTransitions.TRANSITION_EFFECT_IN, false, delay);
	showTween.onComplete.add(ScenesTransitions.onSceneShown, {shownScene: scene, callback: callback});
	showTween.start();

	scene.showTween = showTween;

};

ScenesTransitions.showSceneFromTop = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	ScenesTransitions.showSceneV(scene, true, delay, transitionLength, callback);
};

ScenesTransitions.showSceneFromBottom = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	return ScenesTransitions.showSceneV(scene, false, delay, transitionLength, callback);
};

ScenesTransitions.showSceneFromRight = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	return ScenesTransitions.showSceneH(scene, false, delay, transitionLength, callback);
};

ScenesTransitions.hideSceneAlpha = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH / 2;
	}
	if (callback === undefined)
	{
		callback = null;
	}
	//game.tweens.removeFrom(scene, true);

	var hideTween = game.add.tween(scene);
	hideTween.to({alpha: 0}, transitionLength, ScenesTransitions.TRANSITION_EFFECT_OUT, false, delay);
	hideTween.onComplete.add(ScenesTransitions.onSceneHidden, {hiddenScene: scene, callback: callback});
	hideTween.start();

	scene.hideTween = hideTween;

	return hideTween;
};

ScenesTransitions.hideSceneH = function (scene, left, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	game.tweens.removeFrom(scene, true);

	var hideTween = game.add.tween(scene);
	hideTween.to({x: game.width * (left ? -2 : 2)}, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.TRANSITION_EFFECT_OUT, delay);
	hideTween.onComplete.add(ScenesTransitions.onSceneHidden, {hiddenScene: scene, callback: callback})
	hideTween.start();

	scene.hideTween = hideTween;

	return hideTween;
};

ScenesTransitions.hideSceneToLeft = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	return ScenesTransitions.hideSceneH(scene, true, delay, transitionLength, callback);
};

ScenesTransitions.hideSceneToRight = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	return ScenesTransitions.hideSceneH(scene, false, delay, transitionLength, callback);
};

ScenesTransitions.hideSceneV = function (scene, top, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	game.tweens.removeFrom(scene, true);

	var hideTween = game.add.tween(scene);
	hideTween.to({y: game.height * (top ? -2 : 2)}, ScenesTransitions.TRANSITION_LENGTH, ScenesTransitions.TRANSITION_EFFECT_OUT);
	hideTween.onComplete.add(ScenesTransitions.onSceneHidden, {hiddenScene: scene, callback: callback});
	hideTween.start();

	scene.hideTween = hideTween;

	return hideTween;
};

ScenesTransitions.hideSceneToTop = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	return ScenesTransitions.hideSceneV(scene, true, delay, transitionLength, callback);
};

ScenesTransitions.hideSceneToBottom = function (scene, delay, transitionLength, callback)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH;
	}
	if (callback === undefined)
	{
		callback = null;
	}

	return ScenesTransitions.hideSceneV(scene, false, delay, transitionLength, callback);
};

ScenesTransitions.onSceneHidden = function ()
{
	LOG("onSceneHidden : " + this.hiddenScene.name);

	this.hiddenScene.visible = false;

	if (this.callback != null)
	{
		this.callback();
	}
};

ScenesTransitions.onSceneShown = function ()
{
	LOG("onSceneShown: " + this.shownScene.name);

	if (this.callback != null)
	{
		this.callback();
	}
};

ScenesTransitions.showSceneScale = function (scene, delay, transitionLength, callback, transitionEffect, scale)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH / 2;
	}
	if (callback === undefined)
	{
		callback = null;
	}
	if (transitionEffect === undefined)
	{
		transitionEffect = ScenesTransitions.TRANSITION_EFFECT_IN;
	}
	if (scale === undefined)
	{
		scale = 1;
	}

	scene.scale.set(0);
	scene.visible = true;
	var showTween = game.add.tween(scene.scale).to({
		x: scale,
		y: scale
	}, transitionLength, transitionEffect, false, delay);
	showTween.onComplete.add(ScenesTransitions.onSceneShown, {shownScene: scene, callback: callback});
	showTween.start();

	scene.showTween = showTween;
};

ScenesTransitions.hideSceneScale = function (scene, delay, transitionLength, callback, transitionEffect)
{
	if (delay === undefined)
	{
		delay = 0;
	}
	if (transitionLength === undefined)
	{
		transitionLength = ScenesTransitions.TRANSITION_LENGTH / 2;
	}
	if (callback === undefined)
	{
		callback = null;
	}
	if (transitionEffect === undefined)
	{
		transitionEffect = ScenesTransitions.TRANSITION_EFFECT_IN;
	}

	scene.visible = true;
	var hideTween = game.add.tween(scene.scale).to({x: 0, y: 0}, transitionLength, transitionEffect, false, delay);
	hideTween.onComplete.add(ScenesTransitions.onSceneHidden, {hiddenScene: scene, callback: callback});
	hideTween.start();

	scene.hideTween = hideTween;
};
