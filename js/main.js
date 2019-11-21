var ress = getMaxGameResolution();
var resolutionX = ress[0];
var resolutionY = ress[1];


var languageLoaded = false;
var isIOS = false;

var userAgent = navigator.userAgent || navigator.vendor || window.opera;
if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i))
{
	isIOS = true;
}

var aspect = window.innerWidth / window.innerHeight;

//console.log("[" + window.innerWidth + ", " + window.innerHeight + "] " + aspect);
var androidVersionString = getAndroidVersion();
var androidVersionMajor = 4;
if (androidVersionString != false)
{
	androidVersionMajor = parseInt(getAndroidVersion(), 10);
}

var GAME_FONT = 'gameFont';//'gameFont';
if (androidVersionMajor < 4)
{
	GAME_FONT = 'arial';
}

var chromeVersion = null;
var bdBrowser = null;
var selectedRenderer = null;
var defaultBrowser40 = null; // this is true on android 4.3, default browser - renderer is CANVAS, and only mp3 files are loaded

try
{
	chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
} catch (e)
{
}

selectedRenderer = Phaser.WEBGL;
/*
if (!Phaser.Device.desktop && chromeVersion != null && chromeVersion < 35) {
    RUNNING_ON_WP = true;
    selectedRenderer = Phaser.CANVAS;
} else {
    selectedRenderer = Phaser.AUTO;
}*/

try
{
	bdBrowser = window.navigator.appVersion.indexOf("bdbrowser") > -1;
	defaultBrowser40 = window.navigator.appVersion.indexOf("Version/4.0") > -1;
} catch (e)
{
}

selectedRenderer = Phaser.AUTO;

if (!Phaser.Device.desktop && ((bdBrowser != null && bdBrowser == true) || (defaultBrowser40 != null && defaultBrowser40 == true))) // problem s maskami pri renderovani cez webgl v baidubrowser, preto sa zvoli canvas
{
	selectedRenderer = Phaser.CANVAS;
}

if (MaliDetect())
{
	selectedRenderer = Phaser.CANVAS;
}

selectedRenderer = Phaser.CANVAS;

//na iOS to slo zalostne pomaly
//selectedRenderer = Phaser.CANVAS;

var config = {
	width: resolutionX,
	height: resolutionY,
	renderer: selectedRenderer,
	enableDebug: true,
	antialias: true,
	forceSetTimeOut: false
}

window.addEventListener("contextmenu", function (e)
{
	e.preventDefault();
});
//document.addEventListener("touchstart", function(e) { e.preventDefault();});
document.addEventListener("touchstart", function (e)
{
	e.preventDefault();
});
document.addEventListener("touchmove", function (e)
{
	e.preventDefault();
});
document.addEventListener("touchend", function (e)
{
	e.preventDefault();
});

var game = new Phaser.Game(config);
game.clearBeforeRender = false; // because game is fullscreen


//var game = new Phaser.Game(resolutionX, resolutionY, selectedRenderer, '');
//game.preserveDrawingBuffer = true;


game.forceSingleUpdate = true;

game.state.add("SplashState", Splash);
game.state.add("PreloadState", Preloader);
game.state.add("GameState", GameState);

game.state.start("SplashState");


//PPS_USE-INLOGICleaderboard
/*
INLOGIC_LEADERBOARD.init("JustGet10", "gttninl", "http://ke.inlogic.sk:3000/", "1707428959470587", "404332288727-rvckil9tp9thn28c9v9l3mqpocgodkt2.apps.googleusercontent.com");
//PPS_USE-INLOGICleaderboard
*/

function isPortrait()
{

	switch (window.orientation)
	{
		case 0:
		case 180:
			return true;
	}
	return false;
}

function MaliDetect()
{
	var canv = document.createElement('canvas');
	canv.setAttribute("width", "1");
	canv.setAttribute("height", "1");
	document.body.appendChild(canv);

	var canvas = document.getElementsByTagName('canvas');
	var gl = canvas[0].getContext('webgl', {stencil: true});
	canvas[0].parentNode.removeChild(canvas[0]);

	if (!gl)
	{
		return false;
	}

	var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
	var renderer;
	if (dbgRenderInfo != null)
	{
		renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
	}
	else
	{
		return false;
	}

	var n = renderer.search("Mali-400");
	if (n != -1)
	{
		return true;
	}
	else
	{
		return false;
	}
}