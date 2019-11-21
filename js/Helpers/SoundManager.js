SoundManager = function (game)
{
	this.game = game;


	this.musicPlaying = false;
	this.soundPlaying = false;


	this.music = [];
	this.sounds = [];
	this.actualMusic = null;

	this.crashPlaying = false;

	this.loopSoundPlaying = -1;
}
var arrayFunctions = ['contains', 'last'];
SoundManager.prototype = {
	constructor: SoundManager,

	create: function ()
	{
		this.addMusic('game_music', 0.2, true);

		this.addSound('click', 0.1);
		this.addSound('minca-spawn', 0.1);
		this.addSound('minca', 0.1);
		this.addSound('laser_shot', 0.2);
		this.addSound('crash', 0.2);

		this.addSound('loop_idle', 0.3, true);
		this.addSound('loop_slow', 0.3, true);
		this.addSound('loop_fast', 0.2, true);

		this.addSound('shipAcquired', 0.4);

		this.addSound('accellerate', 0.1);
		this.addSound('brake', 0.1);

		this.addSound('bonus', 0.5);
		this.addSound('No_money', 0.5);
		this.addSound('kaching', 0.2);

		this.addSound('new_record', 0.5);

	},
	/**
	 * -1  None
	 *  0  Idle
	 *  1  Slow
	 *  2  Fast
	 * @param num
	 */
	setLoopSound: function (num)
	{
		if (num == this.loopSoundPlaying)
		{
			return;
		}
		this.loopSoundPlaying = num;
		var soundsArray = ['loop_idle', 'loop_slow', 'loop_fast'];
		for (var i = 0; i < soundsArray.length; i++)
		{
			if (i == num)
			{

				this.playSound(soundsArray[num]);

			}
			else
			{
				this.sounds[soundsArray[i]].stop();
			}
		}
	},
	addMusic: function (audioFile, volume, loop)
	{
		if (loop === undefined)
		{
			loop = false;
		}
		this.music[audioFile] = game.add.audio(audioFile, volume, loop);
	},

	addSound: function (audioFile, volume, loop)
	{
		if (loop === undefined)
		{
			loop = false;
		}

		this.sounds[audioFile] = game.add.audio(audioFile, volume, loop);
	},

	playMusic: function (musicToPlay, reset)
	{
		if (!this.musicPlaying)
		{
			return
		}
		if (reset === undefined)
		{
			reset = false;
		}


		if (musicToPlay != this.actualMusic || reset)
		{
			this.actualMusic = musicToPlay;
		}

		for (var key in this.music)
		{
			if (arrayFunctions.contains(key))
			{
				continue;
			}
			if (key == this.actualMusic)
			{
				this.music[key].play();
			}
			else
			{
				this.music[key].stop();
			}
		}
	},

	playSound: function (soundToPlay)
	{
		if (!this.soundPlaying)
		{
			return;
		}

		try
		{
			if ((soundToPlay == 'crash' && this.crashPlaying == false) || soundToPlay != 'crash')
			{
				this.sounds[soundToPlay].play();

				if (soundToPlay == 'crash')
				{
					game.time.events.add(soundManager.sounds['click'].durationMS / 2, function ()
					{
						soundManager.crashPlaying = false;
					});
				}
			}
		} catch (e)
		{
			LOG('Failed to play sound : ' + soundToPlay);
		}
	},
	playOneSound: function (soundToPlay)
	{
		if (!this.soundPlaying)
		{
			return;
		}

		try
		{
			if (this.sounds[soundToPlay].isPlaying == false)
			{
				this.sounds[soundToPlay].play();
			}

		} catch (e)
		{
			LOG('Failed to play sound : ' + soundToPlay);
		}
	},
	pauseMusic:

		function ()
		{
			if (!this.musicPlaying)
			{
				return;
			}

			for (var key in this.music)
			{
				if (arrayFunctions.contains(key))
				{
					continue;
				}
				if (key == this.actualMusic)
				{
					this.music[key].pause();
					break;
				}
			}
		}

	,

	resumeMusic: function ()
	{
		if (!this.musicPlaying)
		{
			return;
		}

		for (var key in this.music)
		{
			if (arrayFunctions.contains(key))
			{
				continue;
			}
			if (key == this.actualMusic)
			{
				this.music[key].resume();
				break;
			}
		}
	}
	,

	stopMusic: function ()
	{
		for (var key in this.music)
		{
			if (arrayFunctions.contains(key))
			{
				continue;
			}

			this.music[key].stop();
		}
		this.musicPlaying = false;
	}
	,

	toggleMusic: function (musicToPlay)
	{
		if (!this.musicPlaying)
		{
			this.musicPlaying = true;
			this.playMusic(musicToPlay);
		}
		else
		{
			this.musicPlaying = false;
			this.stopMusic();
		}
		try
		{
			localStorage.setItem("stardrives-music", this.musicPlaying);
		} catch (e)
		{

		}
	}
	,

	toggleMusicPlaying: function ()
	{
		if (!this.musicPlaying)
		{
			this.musicPlaying = true;
			this.resumeMusic();
		}
		else
		{
			this.musicPlaying = false;
			this.pauseMusic();
		}
		try
		{
			localStorage.setItem("stardrives-music", this.musicPlaying);
		} catch (e)
		{

		}
	}
	,
	toggleSounds: function ()
	{
		if (!this.soundPlaying)
		{
			this.soundPlaying = true;
		}
		else
		{
			this.soundPlaying = false;

			for (var key in this.sounds)
			{
				if (arrayFunctions.contains(key))
				{
					continue;
				}

				this.sounds[key].stop();
			}
		}
		try
		{
			localStorage.setItem("stardrives-sounds", this.soundPlaying);
		} catch (e)
		{

		}
	}


}