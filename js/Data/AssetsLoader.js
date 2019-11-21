/**
 * Created by echovanec on 24. 11. 2014.
 */

var IMAGE_FOLDER = 'img_480/';

function loadSplash(game)
{
	game.load.image('logo', 'assets/' + IMAGE_FOLDER + 'logo.png');
	game.load.image('void', 'assets/' + IMAGE_FOLDER + 'void.png');
	game.load.image('pozadie_01', 'assets/' + IMAGE_FOLDER + 'pozadie_01.png');
    game.load.image('pozadie_blur', 'assets/' + IMAGE_FOLDER + 'pozadie_blur.png');
	game.load.text('lang_strings', 'assets/dat/langs.xml');
};

function loadImages(game)
{
	// levels data
	game.load.text('data', 'assets/dat/data.json');
    game.load.image('english_flag', 'assets/' + IMAGE_FOLDER + 'english_flag.png');
    game.load.image('outline', 'assets/' + IMAGE_FOLDER + 'outline.png');

	game.load.atlas('pak1', 'assets/' + IMAGE_FOLDER + '/pak1.png', 'assets/' + IMAGE_FOLDER + '/pak1.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
	game.load.image('bullet', 'assets/' + IMAGE_FOLDER + 'bullet.png');
    game.load.image('shadow', 'assets/' + IMAGE_FOLDER + 'shadow.png');
    game.load.image('game_field', 'assets/' + IMAGE_FOLDER + 'game_field.png');
    game.load.image('robot_green', 'assets/' + IMAGE_FOLDER + 'robot_green.png');
    game.load.image('player', 'assets/' + IMAGE_FOLDER + 'player.png');
    game.load.image('tutorial', 'assets/' + IMAGE_FOLDER + 'tutorial.png');
    game.load.image('qmark', 'assets/' + IMAGE_FOLDER + 'question_mark.png');
    game.load.image('coin', 'assets/' + IMAGE_FOLDER + 'coin.png');
    game.load.image('header', 'assets/' + IMAGE_FOLDER + 'header.png');
    game.load.bitmapFont("popup_font", "assets/fnt/popup_font.png", "assets/fnt/popup_font.fnt", "xml", 0, 0);
    

	game.load.spritesheet('vybuch_01', 'assets/' + IMAGE_FOLDER + 'vybuch_01.png', 1229 / 8, 922 / 6, 48);
	game.load.spritesheet('vybuch_02', 'assets/' + IMAGE_FOLDER + 'vybuch_02.png', 1229 / 8, 922 / 6, 48);
    
   
}
;

function loadSounds(game)
{
	//game.load.bitmapFont('font1', 'assets/fnt/font.png', 'assets/fnt/font.fnt');

	game.load.bitmapFont("font", "assets/fnt/font_0.png", "assets/fnt/font.fnt", "xml", 0, 0);
	game.load.bitmapFont("font2", "assets/fnt/font2_0.png", "assets/fnt/font2.fnt", "xml", 0, 0);
	game.load.bitmapFont("font_blue", "assets/fnt/font_blue.png", "assets/fnt/font_blue.fnt", "xml", 0, 0);
	game.load.bitmapFont("font_blue_2", "assets/fnt/font_blue_2.png", "assets/fnt/font_blue_2.fnt", "xml", 0, 0);
	game.load.bitmapFont("font_red", "assets/fnt/font_red.png", "assets/fnt/font_red.fnt", "xml", 0, 0);
	game.load.bitmapFont("font_yellow", "assets/fnt/font_yellow.png", "assets/fnt/font_yellow.fnt", "xml", 0, 0);
	game.load.bitmapFont("font_2_yellow", "assets/fnt/font_2_yellow.png", "assets/fnt/font_2_yellow.fnt", "xml", 0, 0);
    


	game.load.audio('click', ['assets/audio/click.ogg', 'assets/audio/click.mp3']);
	game.load.audio('minca-spawn', ['assets/audio/minca-spawn.wav']);
	game.load.audio('minca', ['assets/audio/minca.wav']);
	game.load.audio('laser_shot', ['assets/audio/laser_shot.wav']);
	game.load.audio('crash', ['assets/audio/crash.wav']);

	game.load.audio('loop_idle', ['assets/audio/StarDrives_Idle_loop_slow_distinct.wav']);
	game.load.audio('loop_slow', ['assets/audio/StarDrives_brake_loop_slow.wav']);
	game.load.audio('loop_fast', ['assets/audio/StarDrives_accellerated_loop_slow.wav']);

	game.load.audio('accellerate', ['assets/audio/Accellerate.wav']);
	game.load.audio('brake', ['assets/audio/Brake.wav']);
	game.load.audio('bonus', ['assets/audio/take bonus.mp3']);
	game.load.audio('shipAcquired', ['assets/audio/shipAcquired.wav']);
	game.load.audio('No_money', ['assets/audio/Liam/No_money.wav']);
	game.load.audio('kaching', ['assets/audio/Liam/kaching.wav']);

	game.load.audio('new_record', ['assets/audio/Liam/New_Record.wav']);

	game.load.audio('game_music', ['assets/audio/Music/StarDrives123.ogg']);


};

function getPakFrames(prefix, frames)
{
	output = [];
	for (var i = 0; i < frames.length; i++)
		output[i] = prefix + frames[i] + '.png';

	return output;
};



