var OrbitingObject = function (track, spriteName, type)
{
	this.create(track, spriteName, type);
};

OrbitingObject.prototype = {
	create: function (track, spriteName, type)
	{
		this.active = true;

		this.sprite = game.make.sprite(-300, -300, 'pak1', spriteName);
		this.sprite.anchor.set(0.5);
		this.sprite.rotation = Math.PI / 4;

		game.physics.p2.enable(this.sprite);
		this.sprite.body.data.shapes[0].sensor = true;

		this.type = type;
		this.track = track;

		this.invincible = false;

		this.baseSpeed = 0.017;
		this.speedMultiplier = 1;
		this.vall = 0;
		this.speedTween = null;

		this.orbitingRadiusOffset = 0;

		// second sprite-shadow
		this.sprite2 = null;
		if (game.cache.getFrameByName('pak1', this.sprite.frameName + '_02') != null)
		{
			this.sprite2 = game.make.sprite(0, 0, 'pak1', this.sprite.frameName + '_02');
			this.sprite2.anchor.set(0.5);
			this.sprite.addChild(this.sprite2);

		}
		else
		{
			this.sprite2 = game.make.sprite(0, 0, 'pak1', this.sprite.frameName);
			this.sprite2.scale.x = -1;
			this.sprite2.anchor.set(0.5);
			this.sprite.addChild(this.sprite2);
		}


		this.cannon = null;

		switch (type)
		{
			case ORBITING_OBJECT_TYPES.ENEMY:

				this.sprite.body.clearShapes();
				this.sprite.body.addRectangle(this.sprite.width * 0.8, this.sprite.height * 0.75);
				this.sprite.body.addRectangle(this.sprite.width * 0.8, this.sprite.height * 0.75);

				this.sprite.body.data.shapes[0].sensor = true;
				this.sprite.body.data.shapes[1].sensor = true;

				this.sprite.body.setCollisionGroup(enemyCollisionGroup);
				this.sprite.body.collides([playerCollisionGroup, bulletsCollisionGroup]);

				this.sprite.body.onBeginContact.add(function (other)
				{
					if (!playerAlive || player.invincible || this.active === false)
					{
						return;
					}

					enemySpawner.spawnExplosion(this);

					if (other === player.sprite.body)
					{
						SceneGame.instance.onObjectShot(player);
					}

					OrbitingObjectSpawner.instance.despawnEnemy(this);
					SceneGame.instance.onObjectShot(this);

					if (other.sprite.name == "bullet")
					{
						other.sprite.destroy();
					}
				}, this);

				break;
			case ORBITING_OBJECT_TYPES.BOSS:

				this.cannon = game.add.sprite(0, 25, 'pak1', 'boss_delo_01');
				this.cannon.anchor.set(0.65, 0.5);
				this.cannon.rotation = Math.PI / 2;
				this.sprite.addChild(this.cannon);

				this.cannonGlow = game.add.sprite(-20, 0, 'pak1', 'gradient_red');
				this.cannonGlow.anchor.set(0.65, 0.5);
				this.cannonGlow.alpha = 0;
				this.cannon.addChild(this.cannonGlow);


				this.sprite.body.clearShapes();
				this.sprite.body.addRectangle(this.sprite.width * 0.5, this.sprite.height * 0.85, 0, 7);
				this.sprite.body.addRectangle(this.sprite.width * 0.9, this.sprite.height * 0.3, 0, 35);

				this.sprite.body.data.shapes[0].sensor = true;
				this.sprite.body.data.shapes[1].sensor = true;

				this.sprite.body.setCollisionGroup(enemyCollisionGroup);
				this.sprite.body.collides([playerCollisionGroup, bulletsCollisionGroup]);

				this.sprite.body.onBeginContact.add(function (other)
				{
					if (!playerAlive || player.invincible || this.active === false)
					{
						return;
					}
					enemySpawner.spawnExplosion(this);


					if (other === player.sprite.body)
					{
						SceneGame.instance.onObjectShot(player);

					}


					OrbitingObjectSpawner.instance.despawnBoss();
					SceneGame.instance.onObjectShot(this);

				}, this);

				break;
			case ORBITING_OBJECT_TYPES.PLAYER:
				this.sprite.body.setCollisionGroup(playerCollisionGroup);
				this.sprite.body.collides([enemyCollisionGroup, powerUpCollisionGroup, bulletsCollisionGroup]);


				this.shield = game.make.sprite(0, 0, 'pak1', 'stit_01');
				this.shield.anchor.set(0.5);
				grpGameLayer2.add(this.shield);
				this.shield.visible = false;
				break;
			case ORBITING_OBJECT_TYPES.POWER_UP_SHIELD:
			case ORBITING_OBJECT_TYPES.POWER_UP_AMMO:

				var glow = game.add.sprite(0, 0, 'pak1', (type == ORBITING_OBJECT_TYPES.POWER_UP_SHIELD) ? 'gradient_blue' : 'gradient_red');
				glow.scale.set(0.8);
				glow.alpha = 0.8;
				glow.anchor.set(0.5, 0.7);
				this.sprite.addChild(glow);

				game.add.tween(glow).to({alpha: 0.2}, 1000, Phaser.Easing.Cubic.InOut, true, 0, -1, true);

				this.sprite.body.setCollisionGroup(powerUpCollisionGroup);
				this.sprite.body.collides(playerCollisionGroup);

				this.sprite.body.onBeginContact.add(function (powerUpBody, playerBody)
				{
					if (!playerAlive || player.invincible ||
						this.active === false || (player.shield.visible && this.type === ORBITING_OBJECT_TYPES.POWER_UP_SHIELD) ||
						(bullets > 2 && this.type === ORBITING_OBJECT_TYPES.POWER_UP_AMMO)
					)
					{
						return;
					}

					soundManager.playSound('bonus');

					var scaleDownTween = game.add.tween(this.sprite.scale).to({
						x: 0,
						y: 0
					}, 100, Phaser.Easing.Cubic.In, true);
					scaleDownTween.onComplete.add(function ()
					{
						OrbitingObjectSpawner.instance.despawnPowerUp(this);
					}, this);

					if (this.type === ORBITING_OBJECT_TYPES.POWER_UP_SHIELD)
					{
						player.pickedUpShield();
					}
					else if (this.type === ORBITING_OBJECT_TYPES.POWER_UP_AMMO)
					{
						SceneGame.instance.addBullet();
					}
					//bullet.destroy();


				}, this);
				break;
			case ORBITING_OBJECT_TYPES.MENU:
				this.sprite.body.clearShapes();

		}

		if (type === ORBITING_OBJECT_TYPES.PLAYER || type === ORBITING_OBJECT_TYPES.MENU)
		{
			this.direction = 1;
		}
		else
		{
			this.direction = Math.random() < 0.4 ? -1 : 1;
		}


		// add to groups
		if (type === ORBITING_OBJECT_TYPES.MENU)
		{
			grpSceneMenu.add(this.sprite);
		}
		else
		{
			grpGameLayer2.add(this.sprite);
		}


		track.addNewOrbitingObject(this);
	},
	setTexture: function (spriteName)
	{

		this.sprite.loadTexture('pak1', spriteName);

		if (game.cache.getFrameByName('pak1', spriteName + '_02') != null)
		{

			this.sprite2.scale.x = 1;
			this.sprite2.loadTexture('pak1', spriteName + '_02');
		}
		else
		{
			this.sprite2.scale.x = -1;

			this.sprite2.loadTexture('pak1', spriteName);
		}


	},
	OnGameStarted: function ()
	{
		if (this.type === ORBITING_OBJECT_TYPES.PLAYER)
		{

			//this.particles.flow(300, 45, 1, -1);
		}
	},
	destroy: function ()
	{

		this.sprite.destroy();
		if ((typeof this.sprite2) !== 'undefined')
		{
			this.sprite2.destroy();
		}
	},
	pickedUpShield: function ()
	{

		var targetScale = (getBigger([this.sprite.width, this.sprite.height]) + 60) / 200;

		this.shield.visible = true;
		this.shield.alpha = 0;
		this.shield.scale.set(0);
		game.add.tween(this.shield).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
		game.add.tween(this.shield.scale).to({x: targetScale, y: targetScale}, 200, Phaser.Easing.Back.Out, true);

// TUTORIAL
		if (currentLevel == 1 && pickedUpPowerUpThisGame == false)
		{
			sceneTutorial.OnLevel2ShieldCaught();

		}


		pickedUpPowerUpThisGame = true;


		SceneFlash.instance.Flash(function ()
		{
		}, 200, 0, 0.2, 'blank_lightblue');

	},

	setSpeed: function (val, fast)
	{
		fast = fast || false;
		if (fast)
		{
			this.speedMultiplier = val;

		}
		else
		{
			if (this.speedTween != null)
			{
				this.speedTween.stop();
				this.speedTween = null;
			}

			this.speedTween = game.add.tween(this).to({
				speedMultiplier: val
			}, 100, Phaser.Easing.Linear.None, true);

			var destScale = val <= 1 ? 1 : 0.9;
			this.scale = game.add.tween(this.sprite.scale).to({
				x: destScale, y: destScale
			}, 100, Phaser.Easing.Linear.None, true);

			if (this.type == ORBITING_OBJECT_TYPES.PLAYER)
			{
				var soundIndex = 0;
				if (val == 1)
				{
					soundIndex = 0;
				}
				else if (val < 1)
				{
					soundIndex = 1;
				}
				else if (val > 1)
				{
					soundIndex = 2;
				}
				soundManager.setLoopSound(soundIndex);
			}
		}
	}
	,
	setInvincible: function (time)
	{
		this.invincible = true;

		// flash alpha
		this.sprite.alpha = 1;
		this.sprite.visible = true;

		var flash = game.add.tween(this.sprite).to({alpha: 0.1}, time / 6, Phaser.Easing.Cubic.In, true, 0, 6, true);
		flash.onComplete.add(function ()
		{
			// reset to original state
			this.sprite.alpha = 1;
			this.invincible = false;
		}, this);
	},
	update: function ()
	{
		if (this.active === false)
		{
			return;
		}
		if (this.type === ORBITING_OBJECT_TYPES.PLAYER || this.type === ORBITING_OBJECT_TYPES.MENU)
		{
			/*this.particles.forEachAlive(function (p)
			{
				p.alpha = (p.lifespan / this.particles.lifespan > 0.6) ? 1 : p.lifespan / this.particles.lifespan;
				p.scale.set(p.lifespan / this.particles.lifespan * 5);
			}, this);
			this.particles.x = this.sprite.x;
			this.particles.y = this.sprite.y;*/
			//this.particles.position = new Phaser.Point(this.particles.x, this.particles.y);

			//this.particles.angle = this.sprite.body.rotation;
		}
		if (this.type === ORBITING_OBJECT_TYPES.BOSS)
		{
			// get future pos dependant on distance between ships
			var playersFuturePosition = player.getFuturePosition(Math.hypot(player.sprite.x - this.sprite.x, player.sprite.y - this.sprite.y) / 20);
			var rotation = Math.atan2(this.sprite.y - playersFuturePosition.y, this.sprite.x - playersFuturePosition.x);
			this.cannon.rotation = rotation - this.sprite.rotation;


		}
		//this.sprite.body.setZeroVelocity();
		if (this.sprite2 != null)
		{
			this.sprite2.alpha = Math.abs(Math.sin(this.vall / 2 + Math.PI / 2));
		}
		if (this.type === ORBITING_OBJECT_TYPES.PLAYER)
		{
			var futurePos = this.getFuturePosition(1);
			this.shield.position.set(futurePos.x, futurePos.y);


		}

	}
	,
	getFuturePosition: function (ticks)
	{
		var vall = (this.vall) + (this.baseSpeed * this.speedMultiplier) * ticks * this.direction;

		return new Phaser.Point(this.track.planet.x + (Math.cos(vall) * this.track.radius), this.track.planet.y + (Math.sin(vall) * this.track.radius));
	},
	setActive: function (tgl, vall)
	{
		//this.sprite.position.setTo(-10000, -10000);
		this.active = tgl;

		this.sprite.visible = tgl;
		//this.explosionAnimation.visible = tgl;
		this.speedMultiplier = 1;

		this.sprite.scale.setTo(1);

		this.vall = (vall == null) ? 0 : vall;

		if (tgl == false)
		{
			this.orbitingRadiusOffset = 0;
		}

		if (tgl && this.type != ORBITING_OBJECT_TYPES.PLAYER && this.type != ORBITING_OBJECT_TYPES.ENEMY)
		{
			this.sprite.scale.set(0, 0);
			var spawnTween = game.add.tween(this.sprite.scale).to({
				x: 1,
				y: 1
			}, 500, Phaser.Easing.Back.Out, true);
		}
	}
	,

	bossShoot: function ()
	{
		var cannonGlowAlphaTween = game.add.tween(this.cannonGlow).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
		cannonGlowAlphaTween.onComplete.addOnce(function ()
		{
			this.cannonGlow.alpha = 0;
			if (this.active == false)
			{
				return;
			}
			game.camera.shake(0.01, 100);
			var playersFuturePosition = player.getFuturePosition(Math.hypot(player.sprite.x - this.sprite.x, player.sprite.y - this.sprite.y) / 20);
			var rotation = Math.atan2(this.sprite.y - playersFuturePosition.y, this.sprite.x - playersFuturePosition.x);

			//this.sprite.alpha = 0.2;
			//this.cannon.alpha = 0.5;


			this.shoot(rotation, new Phaser.Point(this.cannon.worldPosition.x, this.cannon.worldPosition.y));
		}, this);
	}
	,
	shoot: function (rotation, origin)
	{

		if (rotation == null)
		{
			rotation = this.sprite.body.rotation + Math.PI / 2;
		}
		if (origin == null)
		{
			origin = new Phaser.Point(this.sprite.x, this.sprite.y);
		}
		soundManager.playSound('laser_shot');

		direction = new Phaser.Point(-Math.cos(rotation), -Math.sin(rotation));

		var bullet = game.add.sprite(origin.x, origin.y, 'bullet');
		enemySpawner.bullets.push(bullet);
		bullet.name = "bullet";

		if (this.type === ORBITING_OBJECT_TYPES.BOSS)
		{
			grpGameLayer3.add(bullet);
		}
		else
		{
			grpGameLayer1.add(bullet);
		}

		game.time.events.add(Phaser.Timer.SECOND * 2, function ()
		{
			this.bullet.destroy()
		}, {bullet: bullet});

		bullet.anchor.set(0.5);
		bullet.scale.set(0.3);

		game.physics.p2.enable(bullet);

		bullet.body.clearShapes();
		if (this.type == ORBITING_OBJECT_TYPES.PLAYER)
		{
			bullet.body.addRectangle(bullet.width * 1.4, bullet.height * 1.4);// bigger bullets for player so its easier to hit enemies
		}
		else
		{
			bullet.body.addRectangle(bullet.width * 1, bullet.height * 1);// boss will have original sized bullets

		}

		bullet.body.data.shapes[0].sensor = true;
		bullet.body.setCollisionGroup(bulletsCollisionGroup);

		if (this.type == ORBITING_OBJECT_TYPES.BOSS)
		{
			bullet.body.collides([playerCollisionGroup]);
		}
		else if (this.type == ORBITING_OBJECT_TYPES.PLAYER)
		{
			bullet.body.collides([enemyCollisionGroup]);
		}
		bullet.targetTypes = [(this.type === ORBITING_OBJECT_TYPES.PLAYER) ? ORBITING_OBJECT_TYPES.ENEMY : ORBITING_OBJECT_TYPES.PLAYER];

		bullet.body.onBeginContact.add(function (other)
		{
			if (!playerAlive || player.invincible || this.object.active === false)
			{
				return;
			}

			if (other === player.sprite.body)
			{
				SceneGame.instance.onObjectShot(player);
			}

			if (other === enemySpawner.boss.sprite.body)
			{
				SceneGame.instance.onObjectShot(enemySpawner.boss);
			}
		}, {object: this, bullet: bullet});

		bullet.body.rotation = rotation;

		var bulletSpeed = this.type === ORBITING_OBJECT_TYPES.BOSS ? 1200 : 2200;
		bullet.body.velocity.x = direction.x * bulletSpeed;
		bullet.body.velocity.y = direction.y * bulletSpeed;

	}
}
;