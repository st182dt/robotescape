var ANIMATION_CUBIC_IO = Phaser.Easing.Cubic.InOut;

var tmp_sprites = [];

function getRandomUInt(num)
{
	return Math.floor(Math.random() * num);
}

function getRandomInt(num)
{
	return Math.floor(Math.random() * num) * ((getRandomUInt(100) > 50) ? -1 : 1);
}

function getRandomUIntInRange(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntInRange(min, max)
{
	return getRandomUIntInRange(min, max) * (getRandomUInt(100) > 50) ? -1 : 1;
}

String.prototype.replaceAll = function (search, replacement)
{
	var target = this;
	return target.split(search).join(replacement);
};

function clamp(num, min, max)
{
	return num <= min ? min : num >= max ? max : num;
}

function cloneObject(obj)
{
	if (null == obj || "object" != typeof obj)
	{
		return obj;
	}
	var copy = obj.constructor();
	for (var attr in obj)
	{
		if (obj.hasOwnProperty(attr))
		{
			copy[attr] = obj[attr];
		}
	}
	return copy;
}

function getBigger(arr)
{
	var biggest = arr[0];
	for (var i = 0; i < arr.length; i++)
	{
		if (arr[i] > biggest)
		{
			biggest = arr[i];
		}
	}
	return biggest;
}

function isUpperCase(myString)
{
	return (myString == myString.toUpperCase());
}

function isLowerCase(myString)
{
	return (myString == myString.toLowerCase());
}

function LOG(msg)
{
	//PPS_DELETE-BUILD
	console.log(msg);
	//PPS_DELETE-BUILD
}

Array.prototype.contains = function (obj)
{
	var i = this.length;
	while (i--)
	{
		if (this[i] === obj)
		{
			return true;
		}
	}
	return false;
};
Array.prototype.last = function (offset)
{
	offset = offset || 0;
	return this[this.length - 1 - offset];
};

function splc1(a, i)
{
	var ob = a[i];
	var l = a.length;
	if (l)
	{
		while (i < l)
		{
			a[i++] = a[i];
		}
		--a.length;
	}
	return ob;
}

function tweenResultTextToValue(text, destinationValue, prependText, callback)
{
	var value = {val: 0};
	var resultTextTween = game.add.tween(value).to({val: destinationValue}, destinationValue === 0 ? 1 : 1000, Phaser.Easing.Linear.None, false);
	var formatText = function ()
	{
		text.text = prependText + Math.floor(value.val);
	}
	resultTextTween.onStart.add(formatText);
	resultTextTween.onUpdateCallback(formatText);
	if (callback != null)
	{
		resultTextTween.onComplete.add(function ()
		{
			formatText();
			callback();
		});
	}
	resultTextTween.start();
	return resultTextTween;
}

function createRandomNumbersArray(length, min, max)
{
	if ((max - min) < length)
	{
		return;// can't create array with unique values if range is smaller than length
	}
	var array = [];
	var generatedNumbers = [];
	for (var i = 0; i < length; i++)
	{
		var column = i % 5;

		var number = game.rnd.integerInRange(column * 15, (column + 1) * 15);
		while (generatedNumbers.contains(number))
		{
			number = game.rnd.integerInRange(column * 15, (column + 1) * 15);
		}
		generatedNumbers.push(number);
		array[i] = number;
	}
	return array;
}

function shuffleArray(array)
{
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex)
	{

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function getCorrectAnchorX(obj, anchX)
{
	return Math.round(obj.width * anchX) / obj.width;
}

function getCorrectAnchorY(obj, anchY)
{
	return Math.round(obj.height * anchY) / obj.height;
}

function getAndroidVersion(ua)
{
	ua = (ua || navigator.userAgent).toLowerCase();
	var match = ua.match(/android\s([0-9\.]*)/);
	return match ? match[1] : false;
}

function updateTextToHeight(textObj, fontSize, fontName, maxHeight)
{
	textObj.style.font = fontSize + 'px "' + fontName + '"';
	while (textObj.height > maxHeight)
	{
		fontSize--;

		var style = textObj.style;
		style.font = fontSize + 'px gameFont';
		textObj.setStyle(style);
	}
}

function updateTextToWidth(textObj, fontSize, fontName, maxWidth)
{
	textObj.style.font = fontSize + 'px "' + fontName + '"';
	while (textObj.width > maxWidth)
	{
		fontSize--;

		var style = textObj.style;
		style.font = fontSize + 'px "' + fontName + '"';
		textObj.setStyle(style);
	}
}

function CreateBoardSpr(posX, posY, width, height, pak, spr, anchorX, anchorY, scaledW, scaledH)
{
	if (anchorX === undefined)
	{
		anchorX = 0;
	}
	if (anchorY === undefined)
	{
		anchorY = 0;
	}
	if (scaledW === undefined)
	{
		scaledW = width;
	}
	if (scaledH === undefined)
	{
		scaledH = height;
	}

	if (!tmp_sprites.contains(pak))
	{
		tmp_sprites[pak] = game.make.sprite(-10000, -10000, pak);
	}

	_width = width;
	_height = height;

	var tileW;
	var tileH;

	tileW = getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0).width;
	tileH = getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0).height;

	width = Math.floor((width / tileW) + 0.5) * tileW;
	height = Math.floor((height / tileH) + 0.5) * tileH;

	var bmpData = game.make.bitmapData(width, height);
	bmpData.smoothed = false;

	//posX -= (_width - width) / 2;
	//posY += (_width - width) / 2;

	var tile1WC = (width / tileW) - 2;
	var tile1HC = (height / tileH) - 2;

	var posLeft = 0;
	var posRight = posLeft + width;
	var posTop = 0;

	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0), posLeft, posTop);
	for (var i = 0; i < tile1WC; i++)
		bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 1), posLeft + tileW * (i + 1), posTop);
	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 2), posRight - tileW, posTop);

	for (var j = 0; j < tile1HC; j++)
	{
		bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 3), posLeft, posTop + tileH * (j + 1));
		bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 5), posRight - tileW, posTop + tileH * (j + 1));
		for (var i = 0; i < tile1WC; i++)
			bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 4), posLeft + tileW * (i + 1), posTop + tileH * (j + 1));
	}

	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 6), posLeft, posTop + height - tileH);
	for (var i = 0; i < tile1WC; i++)
		bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 7), posLeft + tileW * (i + 1), posTop + height - tileH);
	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 8), posRight - tileW, posTop + height - tileH);

	var spr = makeSprite(0, 0, 'void');
	var tid = game.rnd.uuid();
	var texture = bmpData.generateTexture(tid, function (texture)
	{
		LOG('bmpData.generateTexture');
		this.sprite.loadTexture(texture);
		this.sprite.scale.set(1);
		this.sprite.width = this.scaledW;
		this.sprite.height = this.scaledH;
		this.sprite.anchor.setTo(this.anchorX, this.anchorY);
	}, {sprite: spr, anchorX: anchorX, anchorY: anchorY, scaledW: scaledW, scaledH: scaledH});

	spr.x = posX;
	spr.y = posY;

	spr.width = width;
	spr.height = height;

	spr._bounds = new Phaser.Rectangle(posX, posY, width, height);


	bmpData.destroy();
	bmpData = null;

	return spr;
}

function CreateDialogSpr(posX, posY, width, height, pak, spr, anchorX, anchorY, scaledW, scaledH)
{
	var tileW;
	var tileH;

	if (anchorX === undefined)
	{
		anchorX = 0;
	}
	if (anchorY === undefined)
	{
		anchorY = 0;
	}
	if (scaledW === undefined)
	{
		scaledW = width;
	}
	if (scaledH === undefined)
	{
		scaledH = height;
	}

	if (!tmp_sprites.contains(pak))
	{
		tmp_sprites[pak] = game.make.sprite(-10000, -10000, pak);
	}

	tileW = getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0).width;
	tileH = getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0).height;

	var bmpData = game.make.bitmapData(width, height);
	bmpData.smoothed = false;

	var posLeft = 0;
	var posRight = posLeft + width;
	var posTop = 0;

	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0), posLeft, posTop);
	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 1), posLeft, posTop + tileH, tileW, height - 2 * tileH);
	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 2), posLeft, posTop + height - tileH);

	var spr = makeSprite(0, 0, 'pak1', 'void');
	var tid = game.rnd.uuid();
	var texture = bmpData.generateTexture(tid, function (texture)
	{
		LOG('bmpData.generateTexture');
		this.sprite.loadTexture(texture);
		this.sprite.width = this.scaledW;
		this.sprite.height = this.scaledH;
		this.sprite.anchor.setTo(this.anchorX, this.anchorY);
	}, {sprite: spr, anchorX: anchorX, anchorY: anchorY, scaledW: scaledW, scaledH: scaledH});

	spr.x = posX;
	spr.y = posY;
	//spr.width = scaledW;
	//pr.height = scaledH;

	bmpData.destroy();
	bmpData = null;

	return spr;
}

function SetChildScale(object, scale)
{
	object.scale.set(scale / object.parent.scale.x, scale / object.parent.scale.y)
}

function CreatePlanetWithText(text, spriteName)
{
	var planet = game.make.sprite(0, 0, 'pak1', spriteName);
	planet.anchor.set(0.5);

	AddTextToObject(planet, text, 30, 'font_blue');
	planet.text.y = -planet.height / 1.4;

	//planet.check = game.add.sprite(planet.width * 0.55, planet.height / 0.8, 'pak1', 'fajka_02');
	//planet.text.addChild(planet.check);
	//planet.check.visible = false;

	return planet;
}

function CreateButtonSpr(posX, posY, width, pak, spr, anchorX, anchorY, scaleX, scaleY)
{
	if (anchorX === undefined)
	{
		anchorX = 0;
	}
	if (anchorY === undefined)
	{
		anchorY = 0;
	}
	if (scaleX === undefined)
	{
		scaleX = 1;
	}
	if (scaleY === undefined)
	{
		scaleY = 1;
	}

	if (!tmp_sprites.contains(pak))
	{
		tmp_sprites[pak] = game.make.sprite(-10000, -10000, pak);
	}

	_width = width;

	var tileW;
	var tileH;

	tileW = game.cache.getFrameByName(pak, spr + '_0').width;
	tileH = game.cache.getFrameByName(pak, spr + '_0').height;


	//width = Math.floor((width / tileW) + 0.5) * tileW;

	var bmpData = game.make.bitmapData(width, tileH);
	bmpData.smoothed = false;

	//posX -= (_width - width) / 2;
	//posY += (_width - width) / 2;

	var tile1WC = (width / tileW) - 2;

	var posLeft = 0;
	var posRight = posLeft + width;
	var posTop = 0;

	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 0), posLeft, posTop);
	for (var i = 0; i < tile1WC; i++)
		bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 1), posLeft + tileW * (i + 1), posTop);
	//bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 1), posLeft + tileW  , posTop, width - 2 * tileW);
	bmpData.draw(getSpriteFrameWithinAtlas(tmp_sprites[pak], spr, 2), posRight - tileW, posTop);

	var spr = makeSprite(0, 0, 'pak1', 'void');
	var tid = game.rnd.uuid();
	var texture = bmpData.generateTexture(tid, function (texture)
	{
		this.sprite.loadTexture(texture);
		this.sprite.anchor.setTo(this.anchorX, this.anchorY);
		this.sprite.scale.setTo(this.scaleX, this.scaleY);
	}, {sprite: spr, anchorX: anchorX, anchorY: anchorY, scaleX: scaleX, scaleY: scaleY});
	spr.x = posX;
	spr.y = posY;
	spr.width = width * scaleX;
	spr.height = tileH * scaleY;

	bmpData.destroy();
	bmpData = null;

	return spr;
}

function getSpriteFrame(spr, frm)
{
	spr.frame = frm;
	return spr;
}

function getSpriteFrameWithinAtlas(pak, prefix, frm)
{
	pak.frameName = prefix + '_' + frm;
	return pak;
}

function makeSprite(x, y, spr, frm)
{
	frm = frm || 0;
	var spr = game.make.sprite(x, y, spr, frm);
	//killableGraphicsAssets.push(spr);
	return spr;
}

function addSprite(x, y, spr, frm)
{
	frm = frm || 0;
	var spr = game.add.sprite(x, y, spr, frm);
	//killableGraphicsAssets.push(spr);
	return spr;
}

function leadingZero(num, len)
{
	var retVal = '' + num;
	while (retVal.length < len)
		retVal = '0' + retVal;

	return retVal;
}

function SetPoingScaleTween(obj, duration, delay, callbackOnStart)
{
	var negX = obj.scale.x < 0;
	var negY = obj.scale.y < 0;

	if (duration === undefined)
	{
		duration = 150;
	}
	if (delay === undefined)
	{
		delay = 0;
	}
	if (callbackOnStart === undefined)
	{
		callbackOnStart = null;
	}

	var scale = obj.scale.x;

	var tween = game.add.tween(obj.scale).to({
		x: scale * (negX ? -1 : 1),
		y: scale * (negY ? -1 : 1)
	}, duration, Phaser.Easing.Quadratic.Out, true, delay, 0);
	tween.onStart.add(function ()
	{
		if (this.callbackOnStart != null)
		{
			this.callbackOnStart();
		}
		this.obj.scale.setTo(scale * 1.3 * (negX ? -1 : 1), scale * 1.3 * (negY ? -1 : 1));
	}, {obj: obj, callbackOnStart: callbackOnStart})
}

function wiggle(aProgress, aPeriod1, aPeriod2)
{
	var current1 = aProgress * Math.PI * 2 * aPeriod1;
	var current2 = aProgress * (Math.PI * 2 * aPeriod2 + Math.PI / 2);

	return Math.sin(current1) * Math.cos(current2);
}

var tmpLine = new Phaser.Line(0, 0, 0, 0);
var tmpLineNormal1 = new Phaser.Line(0, 0, 0, 0);
var tmpLineNormal2 = new Phaser.Line(0, 0, 0, 0);
var tmpCircle1 = new Phaser.Circle(0, 0, 10);
var tmpCircle2 = new Phaser.Circle(0, 0, 10);

function MoveSpriteBezierSimple(sprite, destX, destY, duration, delay, easing, sign, callbackOnComplete, callbackOnCompleteParams)
{
	tmpLine.start.x = sprite.position.x;
	tmpLine.start.y = sprite.position.y;
	tmpLine.end.x = destX;
	tmpLine.end.y = destY;

	var coords = tmpLine.coordinatesOnLine(Math.floor((tmpLine.length / 5) + 0.5));
	LOG('coords.lenght = ' + coords.length);
	if (coords.length < 5)
	{
		coords[4] = [];
		coords[4][0] = coords[3][0];
		coords[4][1] = coords[3][1];
	}
	var p = coords[0];
	//var sign = (getRandomUInt(1000) <= 500) ? 1 : -1;
	tmpLineNormal1.fromAngle(coords[1][0], coords[1][1], tmpLine.normalAngle, (Math.floor(tmpLine.length / 4) + getRandomInt(10)) * sign);
	tmpLineNormal2.fromAngle(coords[4][0], coords[4][1], tmpLine.normalAngle, (Math.floor(tmpLine.length / 8) + getRandomInt(20)) * sign);

	tmpCircle1.x = tmpLineNormal1.end.x;
	tmpCircle1.y = tmpLineNormal1.end.y;
	tmpCircle2.x = tmpLineNormal2.end.x;
	tmpCircle2.y = tmpLineNormal2.end.y;


	var tmp1 = Math.floor(tmpLine.length / 4);
	var tmp2 = Math.floor(tmpLine.length / 8);

	var pointsArray = [];
	pointsArray[0] = {x: sprite.position.x, y: sprite.position.y};
	pointsArray[1] = {x: tmpLineNormal1.end.x, y: tmpLineNormal1.end.y};
	pointsArray[2] = {x: tmpLineNormal2.end.x, y: tmpLineNormal2.end.y};
	pointsArray[3] = {x: destX, y: destY};

	MoveSpriteBezier(sprite, pointsArray, duration, delay, easing, callbackOnComplete, callbackOnCompleteParams);
};

function MoveSpriteBezier(sprite, pointsArray, duration, delay, easing, callbackOnComplete, callbackOnCompleteParams)
{
	if (callbackOnComplete === undefined)
	{
		callbackOnComplete = function ()
		{
		};
	}

	var tween = null;

	tween = game.add.tween(sprite.position).to({
		x: [pointsArray[0].x, pointsArray[1].x, pointsArray[2].x, pointsArray[3].x],
		y: [pointsArray[0].y, pointsArray[1].y, pointsArray[2].y, pointsArray[3].y]
	}, duration, easing, true, delay, 0).interpolation(function (v, k)
	{
		return Phaser.Math.bezierInterpolation(v, k);
	});

	sprite.twnMove = tween;

	if (callbackOnComplete != null)
	{
		tween.onComplete.add(callbackOnComplete, callbackOnCompleteParams);
	}
};


function createButtonWithIcon(group, x, y, iconIdx, callback)
{
	var btnObj = group.create(x, y, 'pak1', 'button_0');
	btnObj.anchor.set(0.5);
	btnObj.inputEnabled = true;
	AddButtonEvents(btnObj, callback, ButtonOnInputOver, ButtonOnInputOut);

	var btnIcon = new Phaser.Sprite(game, 0, -3, 'pak1', 'icons_' + iconIdx);
	btnIcon.anchor.set(0.5);
	btnObj.addChild(btnIcon);

	return btnObj;
}

function AddTextToObject(button, text, size, font)
{

	var txt = createText(0, 0, text, size, font);

	button.addChild(txt);
	button.text = txt;
	//var txt = game.add.text(0, 0, text, style);

	return txt;
}

function createText(x, y, text, size, font, anchorX, anchorY)
{
	anchorX = anchorX == null ? 0.5 : anchorX;
	anchorY = anchorY == null ? 0.5 : anchorY;
	font = font || 'font';
	if (size[1] != undefined && language == 'ru')
	{
		size = size[1];
	}
	else if (size[0] != undefined)
	{
		size = size[0];
	}


	var txt = null;
	if (language == 'ru')
	{
		var color = TEXT_COLORS.YELLOW;
		switch (font)
		{
			case 'font_yellow':
				color = TEXT_COLORS.YELLOW;
				break;
			case 'font_blue':
				color = TEXT_COLORS.BLUE;
				break;
			case 'font_red':
				color = TEXT_COLORS.RED;
				break;
			case 'font_blue_2':
				color = TEXT_COLORS.BLUE_2;
				break;
			case 'font2':
				color = TEXT_COLORS.RED;

				break;
		}
		txt = game.add.text(x, y, text,
			{
				font: size + 'px ' + GAME_FONT,
				fill: color
			});
	}

	else
	{
		txt = game.add.bitmapText(x, y, font, text, size);

	}
	txt.anchor.set(getCorrectAnchorX(txt, anchorX), getCorrectAnchorY(txt, anchorY));
	txt.align = "center";
	return txt;
}

function safeTimeout(callback, delay)
{

}

function safeInterval(interval)
{

	setInterval(function ()
	{
		if (gameRunning)
		{

		}
	}, 100)
}

function wrapRadians(radians)
{
	while ((radians - Math.PI * 2) >= 0)
	{
		radians -= Math.PI * 2;
	}
	return radians;
}

function createFullscreenOverlay(spriteName)
{
	var overlay = game.add.sprite(game.width, game.height, 'pak1', spriteName);
	//overlay.smoothed = false;
	overlay.anchor.set(0.5);
	overlay.alpha = 0.8;
	overlay.inputEnabled = true;

	return overlay;
}

function tweenTint(obj, startColor, endColor, time, repeat)
{
	if (typeof repeat == 'undefined')
	{
		repeat = false;
	}
	// create an object to tween with our step value at 0
	var colorBlend = {step: 0};
	// create the tween on this object and tween its step property to 100
	var colorTween = game.add.tween(colorBlend).to({step: 100}, time, null, null, null, repeat, repeat);
	// run the interpolateColor function every time the tween updates, feeding it the
	// updated value of our tween each time, and set the result as our tint
	colorTween.onUpdateCallback(function ()
	{
		obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
	});
	// set the object to the start color straight away
	obj.tint = startColor;
	// start the tween
	colorTween.start();
}

function tweenBackgroundColor(obj, startColor, ecR, ecG, ecB, time)
{
	// create an object to tween with our step value at 0
	var colorBlend = {step: 0};
	// create the tween on this object and tween its step property to 100
	var colorTween = game.add.tween(colorBlend).to({step: 10}, time);
	// run the interpolateColor function every time the tween updates, feeding it the
	// updated value of our tween each time, and set the result as our tint
	colorTween.onUpdateCallback(function ()
	{
		obj.backgroundColor = Phaser.Color.interpolateColorWithRGB(startColor, ecR, ecG, ecB, 10, colorBlend.step);
	});
	// set the object to the start color straight away
	obj.backgroundColor = startColor;
	// start the tween
	colorTween.start();
}