var GameData = function ()
{
};

GameData.BuildTitle = 'Star Drives 2';
GameData.BuildString = '31.7.2019 14:21';
GameData.BuildDebug = false;

GameData.CreditsStaff = 'Inlogic Software\n2019';

GameData.ProfileName = 'inl-stardrives2';


GameData.Reset = function ()
{
	var profile = {};
	// load old bests and only update current one

	profile['bestScore'] = 0;
	profile['currentLevel'] = 0;
	profile['selectedShipIndex'] = 0;
	profile['balance'] = 6900;
	profile['level1Price'] = 300;
	profile['level2Price'] = 800;
	profile['level3Price'] = 2000;
	profile['soundOn'] = false;
	profile['musicOn'] = false;
	profile['ships'] = ORIGINAL_SHIPS;
	profile['rank'] = -1;
	profile['lastDayPlayed'] = -1;

	try
	{
		localStorage.setItem(GameData.ProfileName, JSON.stringify(profile));
	} catch (e)
	{
	}
};

GameData.Load = function ()
{
	var profile = null;

	try
	{
		profile = JSON.parse(localStorage.getItem(GameData.ProfileName));

		if (profile['bestScore'] == undefined)
		{
			profile['bestScore'] = 0;

		}
		if (profile['currentLevel'] == undefined)
		{
			profile['currentLevel'] = 0;

		}
		if (profile['selectedShipIndex'] == undefined)
		{
			profile['selectedShipIndex'] = 0;

		}
		if (profile['balance'] == undefined)
		{
			profile['balance'] = 5000;

		}
		if (profile['ships'] != undefined)
		{
			SHIPS = profile['ships'];

		}
		if (profile['soundOn'] == undefined)
		{
			profile['soundOn'] = true;
		}
		if (profile['musicOn'] == undefined)
		{
			profile['musicOn'] = true;
		}
		if (profile['rank'] == undefined)
		{
			profile['rank'] = -1;
		}
		if (profile['lastDayPlayed'] == undefined)
		{
			profile['lastDayPlayed'] = new Date().getDay();
		}
		balance = profile['balance'];
		musicCached = profile['musicOn'];
		selectedShipIndex = profile['selectedShipIndex'];
		soundCached = profile['soundOn'];
		bestScore = profile['bestScore'];
		rank = profile['rank'];
		currentLevel = clamp(profile['currentLevel'], 0, PLANETS.length - 1);
		lastDayPlayed = profile['lastDayPlayed'];
		//currentLevel = 0;
	} catch (e)
	{
	}
};

GameData.Save = function ()
{
	try
	{
		var profile = {};

		//profile['tutorialDone'] = (typeof tutorialDone) === 'undefined' ? false : tutorialDone;
		profile['ships'] = SHIPS;
		profile['balance'] = balance;
		profile['musicOn'] = soundManager.musicPlaying;
		profile['soundOn'] = soundManager.soundPlaying;
		profile['selectedShipIndex'] = selectedShipIndex;
		profile['currentLevel'] = currentLevel;
		profile['bestScore'] = bestScore;
		profile['rank'] = rank;
		profile['lastDayPlayed'] = lastDayPlayed;
		localStorage.setItem(GameData.ProfileName, JSON.stringify(profile));

	} catch (e)
	{
	}
};

GameData.ProfileResetVars = function ()
{

};

GameData.ProfileSetVars = function ()
{

};

GameData.ProfileGetVars = function (profile)
{

};
/**
 * @return {number}
 */
//----------------------------------------------------------------------------------------------------------------------
var ORBITING_OBJECT_TYPES = {PLAYER: 0, ENEMY: 1, POWER_UP_SHIELD: 2, POWER_UP_AMMO: 3, BOSS: 4, MENU: 5};
var RANKS = [
	{loops: 5, title: 'Rookie', reward: 30},
	{loops: 10, title: 'Trooper', reward: 60},
	{loops: 20, title: 'Hunter', reward: 90},
	{loops: 40, title: 'Knight', reward: 160},
	{loops: 70, title: 'Lord', reward: 240},
	{loops: 100, title: 'Grand Master', reward: 380}

];
var ORIGINAL_SHIPS = [
	{
		name: 'Alpha Wing',
		price: 0,
		realSpeed: 1.4,
		realBrake: 0.55,
		displayedSpeed: 100,
		displayedBrake: 65,
		lives: 1,
		sprite: 'raketa_01'
	},
	{
		name: 'Cross Wing',
		price: 100,
		realSpeed: 1.35,
		realBrake: 0.45,
		displayedSpeed: 150,
		displayedBrake: 75,
		lives: 1,
		sprite: 'raketa_02'
	},
	{
		name: 'No Wings',
		price: 200,
		realSpeed: 1.5,
		realBrake: 0.55,
		displayedSpeed: 300,
		displayedBrake: 65,
		lives: 1,
		sprite: 'raketa_03'
	},
	{
		name: 'Hammer',
		price: 250,
		realSpeed: 1.6,
		realBrake: 0.5,
		displayedSpeed: 400,
		displayedBrake: 70,
		lives: 2,
		sprite: 'raketa_04'
	},
	{
		name: 'Seashape',
		price: 350,
		realSpeed: 1.8,
		realBrake: 0.4,
		displayedSpeed: 600,
		displayedBrake: 80,
		lives: 2,
		sprite: 'raketa_05'
	},
	{
		name: 'Marauder',
		price: 700,
		realSpeed: 2,
		realBrake: 0.4,
		displayedSpeed: 800,
		displayedBrake: 80,
		lives: 2,
		sprite: 'raketa_06'
	},
	{
		name: 'Millenium',
		price: 1500,
		realSpeed: 2.5,
		realBrake: 0.3,
		displayedSpeed: 1500,
		displayedBrake: 90,
		lives: 3,
		sprite: 'raketa_07'
	},
	{
		name: 'Goldenium',
		price: 3000,
		realSpeed: 2.5,
		realBrake: 0.3,
		displayedSpeed: 1500,
		displayedBrake: 90,
		lives: 3,
		sprite: 'raketa_08'
	}];
var SHIPS = ORIGINAL_SHIPS;

var PLANETS = [
	{name: "Kanino", sprite: "planeta_01"},
	{name: "Earth", sprite: "planeta_02"},
	{name: "Hodh", sprite: "planeta_03"},
	{name: "Tatuine", sprite: "planeta_04"},
	{name: "Dagoban", sprite: "planeta_05"},
	{name: "Corusan", sprite: "planeta_06"},
	{name: "Death", sprite: "planeta_07"},
	{name: "Nal Hut", sprite: "planeta_08"},
	{name: "Nabu", sprite: "planeta_09"},
	{name: "Tauris", sprite: "planeta_10"},
	{name: "Endora", sprite: "planeta_11"},
	{name: "Tola", sprite: "planeta_12"},
	{name: "Geonozis", sprite: "planeta_13"},
	{name: "Alderam", sprite: "planeta_14"},
	{name: "Feluzia", sprite: "planeta_15"},
	{name: "Mustaraf", sprite: "planeta_16"},
	{name: "Utapu", sprite: "planeta_17"},
	{name: "Tolos", sprite: "planeta_18"},
	{name: "Maridan", sprite: "planeta_19"},
	{name: "Bespyn", sprite: "planeta_20"},
	{name: "Datomyr", sprite: "planeta_21"},
	{name: "Kashyuk", sprite: "planeta_22"},
	{name: "Tyton", sprite: "planeta_23"},
	{name: "Mygeto", sprite: "planeta_24"},
	{name: "Raxuz", sprite: "planeta_25"},
	{name: "Ondernon", sprite: "planeta_26"},
	{name: "Koriba", sprite: "planeta_27"},
	{name: "Sun", sprite: "planeta_28"},
	{name: "Dorin", sprite: "planeta_29"},
	{name: "Jaku", sprite: "planeta_30"},
	{name: "Kanino", sprite: "planeta_01"},
	{name: "Earth", sprite: "planeta_02"},
	{name: "Hodh", sprite: "planeta_03"},
	{name: "Tatuine", sprite: "planeta_04"},
	{name: "Dagoban", sprite: "planeta_05"},
	{name: "Corusan", sprite: "planeta_06"},
	{name: "Death", sprite: "planeta_07"},
	{name: "Nal Hut", sprite: "planeta_08"},
	{name: "Nabu", sprite: "planeta_09"},
	{name: "Tauris", sprite: "planeta_10"},
	{name: "Endora", sprite: "planeta_11"},
	{name: "Tola", sprite: "planeta_12"},
	{name: "Geonozis", sprite: "planeta_13"},
	{name: "Alderam", sprite: "planeta_14"},
	{name: "Feluzia", sprite: "planeta_15"},
	{name: "Mustaraf", sprite: "planeta_16"},
	{name: "Utapu", sprite: "planeta_17"},
	{name: "Tolos", sprite: "planeta_18"},
	{name: "Maridan", sprite: "planeta_19"},
	{name: "Bespyn", sprite: "planeta_20"},
	{name: "Datomyr", sprite: "planeta_21"},
	{name: "Kashyuk", sprite: "planeta_22"},
	{name: "Tyton", sprite: "planeta_23"},
	{name: "Mygeto", sprite: "planeta_24"},
	{name: "Raxuz", sprite: "planeta_25"},
	{name: "Ondernon", sprite: "planeta_26"},
	{name: "Koriba", sprite: "planeta_27"},
	{name: "Sun", sprite: "planeta_28"},
	{name: "Dorin", sprite: "planeta_29"},
	{name: "Jaku", sprite: "planeta_30"},
	{name: "Maridan", sprite: "planeta_21"}];
var OBJECTIVE_TYPES = {
	LOOPS: 1,
	ELIMINATE: 2,
	TIME: 3,
	ENDLESS: 4
};
var rank = -1;
var rankRows = [];
var bestScore = 0;
var backgroundSpeedMultiplier = 1;
var balance = 6900;
var lives = 1;
var PADDING = 75;
var currentLevel = 0;
var playerAlive = false;
var keyDown = false;
var coinsCollectedThisGame = 0;

var soundCached = true;
var musicCached = true;
var movingToNewPlanet = false;
var successfullyCompletedLevel = false;
var bullets = 0;

var TEXT_COLORS={YELLOW:'#ffcc00',
	BLUE:'#44719e',
	RED:'#ff3800',
	BLUE_2:'#00afd3'
};

var loopsCompletedThisGame = 0;

var canSpawnCoin = false;

var beatBestScoreThisGame = false;

var addedCoins = false;

var hasShotFirstTutorialShot = false;
var pickedUpPowerUpThisGame = false;

var allDelayedSpawnTimers = [];
var bossShootTimer = null;
var asteroidTimer = null;

var lastDayPlayed = -1;

var bossesSpawned = 0;
var asteroidsSpawned = 0;

var SPACE_BETWEEN_MENU_PLANETS = 320;

var FPS=60;