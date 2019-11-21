var OrbitingObjectSpawner = function ()
{
	OrbitingObjectSpawner.instance = this;

	this.create();
};
var DEFAULT_ENEMY_POOL_SIZE = 7;
var DEFAULT_POWER_UP_SHIELD_POOL_SIZE = 4;
var DEFAULT_POWER_UP_AMMO_POOL_SIZE = 4;
var DEFAULT_EXPLOSION_POOL_SIZE = 3;
OrbitingObjectSpawner.instance = null;

OrbitingObjectSpawner.prototype = {
	create: function ()
	{
		this.bullets = [];

		this.asteroid = game.add.sprite(0, 0, 'pak1', 'nepriatel_05');
		this.asteroid.scale.set(1.5);
		this.asteroid.rotation = Math.random() * Math.PI;
		grpGameLayer3.add(this.asteroid);
		this.asteroid.anchor.set(0.5);
		this.asteroid.visible = false;
		game.physics.p2.enable(this.asteroid);

		this.asteroid.body.clearShapes();
		this.asteroid.body.addCircle(this.asteroid.width * 0.4);

		this.asteroid.body.data.shapes[0].sensor = true;
		this.asteroid.body.setCollisionGroup(bulletsCollisionGroup);

		this.asteroid.body.collides([playerCollisionGroup]);

		this.asteroid.body.onBeginContact.add(function (other)
		{
			if (!playerAlive || player.invincible || this.visible === false)
			{
				return;
			}
			if (other === player.sprite.body)
			{
				SceneGame.instance.onObjectShot(player);
			}
		}, this.asteroid);


		this.boss = new OrbitingObject(enemyTrack, 'boss_01', ORBITING_OBJECT_TYPES.BOSS);
		this.boss.baseSpeed = 0.005;
		this.boss.setActive(false);


		this.used_enemy = [];
		this.pool_enemy = [];
		this.fillEnemyPool(DEFAULT_ENEMY_POOL_SIZE);

		this.used_powerUpShield = [];
		this.pool_powerUpShield = [];

		this.used_powerUpAmmo = [];
		this.pool_powerUpAmmo = [];
		this.fillPowerUpShieldPool(DEFAULT_POWER_UP_SHIELD_POOL_SIZE);
		this.fillPowerUpAmmoPool(DEFAULT_POWER_UP_AMMO_POOL_SIZE);


		this.used_explosion = [];
		this.pool_explosion = [];
		this.fillExplosionPool(DEFAULT_EXPLOSION_POOL_SIZE);

		bossShootTimer = game.time.create(false);
		spawnTimer = game.time.create(false);
		asteroidTimer = game.time.create(false);
		bossSpawnTimer = game.time.create(false);


	},
	fillExplosionPool: function (quantity)
	{
		for (var i = 0; i < quantity; i++)
		{
			var explosionAnimation = game.add.sprite(300, 300, 'vybuch_01');
			explosionAnimation.anchor.set(0.5);
			explosionAnimation.alpha = 0;
			explosionAnimation.animations.add('explosion');
			explosionAnimation.animations.getAnimation('explosion').onComplete.add(function ()
			{
				this.explosionAnimation.alpha = 0;

				enemySpawner.despawnExplosion(this.explosionAnimation);
			}, {explosionAnimation: explosionAnimation});

			this.pool_explosion.push(explosionAnimation);
			grpGameLayer3.add(explosionAnimation);
		}
	},
	spawnExplosion: function (orbitingObject)
	{

		if (this.pool_explosion.length === 0)
		{
			this.fillExplosionPool(1);
		}


		this.used_explosion.push(this.pool_explosion.pop());
		var explosionAnim = this.used_explosion[this.used_explosion.length - 1];


		soundManager.playSound('crash');
		game.camera.shake(0.02 + game.rnd.rnd() * 0.01, 150 + game.rnd.rnd() * 80);

		if (orbitingObject.type == ORBITING_OBJECT_TYPES.PLAYER)
		{

			if (orbitingObject.shield.visible && explosionAnim.key != 'vybuch_02')
			{
				explosionAnim.loadTexture('vybuch_02');
			}
			if (orbitingObject.shield.visible == false && explosionAnim.key != 'vybuch_01')
			{
				explosionAnim.loadTexture('vybuch_01');

			}
		}
		var nextObjectPos = orbitingObject.getFuturePosition(8);
		explosionAnim.x = nextObjectPos.x;
		explosionAnim.y = nextObjectPos.y;

		explosionAnim.scale.set((1.1 - game.rnd.rnd() / 2) * (orbitingObject.type === ORBITING_OBJECT_TYPES.BOSS ? 2 : 1));
		explosionAnim.rotation = Math.PI * 2 * game.rnd.rnd();
		explosionAnim.alpha = 1 - game.rnd.rnd() / 4;
		explosionAnim.animations.play('explosion', 70 + game.rnd.rnd() * 30, false);
	},
	fillEnemyPool: function (quantity)
	{
		for (var i = 0; i < quantity; i++)
		{
			var enemy;
			if (i < 6)
			{
				enemy = new OrbitingObject(enemyTrack, 'nepriatel_04', ORBITING_OBJECT_TYPES.ENEMY);
				enemy.depth = 0;

			}
			else if (i < 13)
			{
				enemy = new OrbitingObject(enemyTrack, 'nepriatel_03', ORBITING_OBJECT_TYPES.ENEMY);
				enemy.depth = 1;

			}
			else if (i < 23)
			{
				enemy = new OrbitingObject(enemyTrack, 'nepriatel_02', ORBITING_OBJECT_TYPES.ENEMY);
				enemy.depth = 2;

			}
			else
			{
				enemy = new OrbitingObject(enemyTrack, 'nepriatel_01', ORBITING_OBJECT_TYPES.ENEMY);
				enemy.depth = 3;
			}


			grpGameLayer2.sort('depth', Phaser.Group.SORT_DESCENDING);
			enemy.baseSpeed += (Math.random() * 0.022) - 0.012;

			enemy.setActive(false);
			this.pool_enemy.push(enemy);
		}
		shuffleArray(this.pool_enemy);

	}
	,
	fillPowerUpShieldPool: function (quantity)
	{
		for (var i = 0; i < quantity; i++)
		{
			var powerUp = new OrbitingObject(enemyTrack, 'bonus_01', ORBITING_OBJECT_TYPES.POWER_UP_SHIELD);
			powerUp.baseSpeed += (Math.random() * 0.0045) - 0.0013;

			powerUp.setActive(false);
			this.pool_powerUpShield.push(powerUp);
		}
		shuffleArray(this.pool_powerUpShield);
	}
	,
	fillPowerUpAmmoPool: function (quantity)
	{
		for (var i = 0; i < quantity; i++)
		{
			var powerUp = new OrbitingObject(enemyTrack, 'bonus_02', ORBITING_OBJECT_TYPES.POWER_UP_AMMO);
			powerUp.baseSpeed += (Math.random() * 0.0045) - 0.0013;

			powerUp.setActive(false);
			this.pool_powerUpAmmo.push(powerUp);
		}
		shuffleArray(this.pool_powerUpAmmo);
	}
	,
	spawnAsteroid: function ()
	{
		asteroidsSpawned++;
		this.asteroid.visible = true;
		this.asteroid.body.angularVelocity = 3 - Math.random() * 6;

		var center = new Phaser.Point();
		if (GAME_CURRENT_ORIENTATION == ORIENTATION_LANDSCAPE)
		{
			this.asteroid.body.x = game.width + 100;
			this.asteroid.body.y = 100 + (Math.random() * (game.height - 200));

			center.y = 80 + (Math.random() * (game.height - 160));
			center.x = game.world.centerX;

		}
		else
		{

			this.asteroid.body.x = 100 + (Math.random() * (game.width - 200));
			this.asteroid.body.y = game.height + 100;

			center.x = 80 + (Math.random() * (game.width - 160));
			center.y = game.world.centerY;
		}

		var velX = center.x - this.asteroid.body.x;
		var velY = center.y - this.asteroid.body.y;

		this.asteroid.body.velocity.x = velX * 0.7;
		this.asteroid.body.velocity.y = velY * 0.7;
	}
	,
	spawnBoss: function ()
	{
		bossesSpawned++;
		this.boss.setActive(true, enemySpawner.getInitialVall());

		bossShootTimer.removeAll();
		bossShootTimer.destroy();

		bossShootTimer = game.time.create(false);


		bossShootTimer.loop(levelsData[currentLevel].bossReloadTime * 1000, function ()
		{
			if (enemySpawner.boss.active && playerAlive && gameRunning)
			{
				enemySpawner.boss.bossShoot();
			}
			if (!enemySpawner.boss.active || !playerAlive)
			{
				bossShootTimer.pause();
			}
		});

		bossShootTimer.start();

		return this.boss;
	}
	,
	despawnBoss: function ()
	{
		this.boss.setActive(false);
		bossShootTimer.pause();
	}
	,
	spawnEnemy: function (vall)
	{
		if (this.pool_enemy.length === 0)
		{
			this.fillEnemyPool(1);
		}

		// [0] bcuz .pop returns array with our object
		this.used_enemy.push(this.pool_enemy.pop());
		var en = this.used_enemy[this.used_enemy.length - 1];
		en.sprite.position.setTo(-300, -300);


		en.vall = (vall == null ? (enemySpawner.getInitialVall() + Math.random() * 0.5 - 0.5) : vall);

		en.orbitingRadiusOffset = 150;
		game.add.tween(en).to({orbitingRadiusOffset: 0}, 1500, Phaser.Easing.Cubic.InOut, true);

		en.setActive(true, en.vall);
		return en;
	}
	,
	despawnEnemy: function (obj)
	{
		for (var i = 0; i < this.used_enemy.length; i++)
		{
			if (this.used_enemy[i] === obj)
			{
				this.pool_enemy.push(splc1(this.used_enemy, i));
				obj.setActive(false);
				return;
			}
		}
	}
	,
	spawnPowerUpAmmo: function ()
	{
		if (this.pool_powerUpAmmo.length === 0)
		{
			this.fillPowerUpAmmoPool(2);
		}


		this.used_powerUpAmmo.push(this.pool_powerUpAmmo.pop());
		var en = this.used_powerUpAmmo[this.used_powerUpAmmo.length - 1];
		en.setActive(true, enemySpawner.getInitialVall());
		return en;
	}
	,
	spawnPowerUpShield: function ()
	{
		if (this.pool_powerUpShield.length === 0)
		{
			this.fillPowerUpShieldPool(2);
		}


		this.used_powerUpShield.push(this.pool_powerUpShield.pop());
		var en = this.used_powerUpShield[this.used_powerUpShield.length - 1];
		en.setActive(true, enemySpawner.getInitialVall());
		return en;
	}
	,
	despawnExplosion: function (obj)
	{
		for (var i = 0; i < this.used_explosion.length; i++)
		{
			if (this.used_explosion[i] === obj)
			{
				this.pool_explosion.push(splc1(this.used_explosion, i));
				return;
			}
		}
	}
	,
	despawnPowerUp: function (obj)
	{
		for (var i = 0; i < this.used_powerUpAmmo.length; i++)
		{
			if (this.used_powerUpAmmo[i] === obj)
			{
				this.pool_powerUpAmmo.push(splc1(this.used_powerUpAmmo, i));
				obj.setActive(false);
				return;
			}
		}
		for (var i = 0; i < this.used_powerUpShield.length; i++)
		{
			if (this.used_powerUpShield[i] === obj)
			{
				this.pool_powerUpShield.push(splc1(this.used_powerUpShield, i));
				obj.setActive(false);
				return;
			}
		}
	}
	,
	getInitialVall: function ()
	{
		if (GAME_CURRENT_ORIENTATION == ORIENTATION_PORTRAIT)
		{
			return Math.PI / 2;
		}
		else
		{
			return 0;
		}
	}
	,
	stopSpawning: function ()
	{
		if (spawnTimer.running)
		{
			spawnTimer.pause();
		}
		if (asteroidTimer.running)
		{
			asteroidTimer.pause();
		}
		if (bossSpawnTimer.running)
		{
			bossSpawnTimer.pause();
		}
		if (bossShootTimer.running)
		{
			bossShootTimer.pause();
		}
		spawnTimer.removeAll();
		asteroidTimer.removeAll();
		bossSpawnTimer.removeAll();
		bossShootTimer.removeAll();

		shuffleArray(this.pool_enemy);
	}
	,
	startSpawning: function ()
	{
		enemySpawner.stopSpawning();

		bossShootTimer.destroy();
		spawnTimer.destroy();
		asteroidTimer.destroy();
		bossSpawnTimer.destroy();

		bossShootTimer = game.time.create(false);
		spawnTimer = game.time.create(false);
		asteroidTimer = game.time.create(false);
		bossSpawnTimer = game.time.create(false);

		// asteroid
		if (levelsData[currentLevel].asteroid)
		{
			game.time.events.add(levelsData[currentLevel].asteroidStartDelay * 500, function ()
			{
				asteroidTimer.loop(levelsData[currentLevel].asteroidAddDelay * 1000, function ()
				{
					if (gameRunning === false && (playerAlive === false || player.active === false) || asteroidsSpawned > levelsData[currentLevel].asteroidCount)// todo remove +1000
					{
						asteroidTimer.pause();
						return;
					}
					if (gameRunning)
					{
						// spawn asteroid
						enemySpawner.spawnAsteroid();
					}
				});
			});

		}


		for (var i = 0; i < levelsData[currentLevel].startEnemies; i++)
		{
			var en = enemySpawner.spawnEnemy();
			en.vall = -0.2 + (0.02 * i);
		}

		spawnTimer.loop(levelsData[currentLevel].generatingInc * 1000, function ()
		{
			//LOG("SPAWN TIMER TICK");
			if (enemySpawner.used_enemy.length + enemySpawner.used_powerUpShield.length + enemySpawner.used_powerUpAmmo.length < 8)
			{
				enemySpawner.spawnRandomObject();
			}
		});
		if (levelsData[currentLevel].boss)
		{
			bossSpawnTimer.loop(500 + levelsData[currentLevel].bossAddDelay * 1000, function ()
			{
				//LOG("BOSS SPAWN TIMER TICK");
				if (levelsData[currentLevel].boss && bossesSpawned < levelsData[currentLevel].bossCount && enemySpawner.getCountOfObjectType(ORBITING_OBJECT_TYPES.BOSS) == 0)
				{

					enemySpawner.spawnBoss();


				}
			});
		}

		if (spawnTimer.paused)
		{
			spawnTimer.resume();
		}
		else
		{
			spawnTimer.start();
		}

		if (bossSpawnTimer.paused)
		{
			bossSpawnTimer.resume();
		}
		else
		{
			bossSpawnTimer.start();
		}

		if (asteroidTimer.paused)
		{
			asteroidTimer.resume();
		}
		else
		{
			asteroidTimer.start();
		}

	}
	,
	spawnRandomObject: function ()
	{
		var powerUpShieldChance = 0.1;
		var powerUpAmmoChance = 0.1;

		if (objectiveManager.currentObjectiveType === OBJECTIVE_TYPES.ELIMINATE)
		{
			powerUpAmmoChance = 0.5;
		}
		if (playerAlive && gameRunning)
		{
			enemySpawner.spawnEnemy();
			var rnd = Math.random();

			var spawnChance_AnyPowerUp = 0.25;
			if (enemySpawner.getCountOfObjectType(ORBITING_OBJECT_TYPES.POWER_UP_AMMO) < 2 || enemySpawner.getCountOfObjectType(ORBITING_OBJECT_TYPES.POWER_UP_SHIELD) < 2)
			{
				spawnChance_AnyPowerUp += 0.75;
			}
			if (rnd < spawnChance_AnyPowerUp)
			{
				game.time.events.add(400 + Math.random() * 1000, function ()
				{

					var spawnChance_PowerUpAmmo = 0.65;
					var spawnChance_PowerUpShield = 0.35;

					if (enemySpawner.getCountOfObjectType(ORBITING_OBJECT_TYPES.POWER_UP_AMMO) === 0 || objectiveManager.currentObjectiveType === OBJECTIVE_TYPES.ELIMINATE)
					{
						spawnChance_PowerUpAmmo = 1;
					}
					if (enemySpawner.getCountOfObjectType(ORBITING_OBJECT_TYPES.POWER_UP_AMMO) > enemySpawner.getCountOfObjectType(ORBITING_OBJECT_TYPES.POWER_UP_SHIELD))
					{
						spawnChance_PowerUpAmmo = 0.5;
					}
					spawnChance_PowerUpShield = 1 - spawnChance_PowerUpAmmo;

					rnd = Math.random();
					if (rnd < spawnChance_PowerUpAmmo)
					{
						enemySpawner.spawnPowerUpAmmo();
					}
					else if (rnd < 1)
					{
						enemySpawner.spawnPowerUpShield();
					}
				});
			}
		}

	}
	,
	despawnEverything: function ()
	{
		bossesSpawned = 0;
		asteroidsSpawned = 0;
		while (this.used_enemy.length !== 0)
		{
			this.despawnEnemy(enemySpawner.used_enemy[0]);

		}
		while (this.used_powerUpAmmo.length !== 0)
		{
			this.despawnPowerUp(enemySpawner.used_powerUpAmmo[0]);
		}
		while (this.used_powerUpShield.length !== 0)
		{
			this.despawnPowerUp(enemySpawner.used_powerUpShield[0]);
		}
		while (this.used_explosion.length !== 0)
		{
			this.despawnExplosion(enemySpawner.used_explosion[0]);
		}
		// clear any extra spawned objects
		while (this.pool_enemy.length > DEFAULT_ENEMY_POOL_SIZE)
		{
			enemyTrack.removeOrbitingObject(this.pool_enemy[0]);
			this.pool_enemy.splice(0, 1);
		}
		while (this.pool_powerUpAmmo.length > DEFAULT_POWER_UP_AMMO_POOL_SIZE)
		{
			enemyTrack.removeOrbitingObject(this.pool_powerUpAmmo[0]);
			this.pool_powerUpAmmo.splice(0, 1);
		}
		while (this.pool_powerUpShield.length > DEFAULT_POWER_UP_SHIELD_POOL_SIZE)
		{
			enemyTrack.removeOrbitingObject(this.pool_powerUpShield[0]);
			this.pool_powerUpShield.splice(0, 1);
		}
		while (this.pool_explosion.length > DEFAULT_EXPLOSION_POOL_SIZE)
		{
			this.pool_explosion.last().destroy();
			this.pool_explosion.splice(0, 1);
		}
		this.despawnBoss();
		this.asteroid.body.x = -5000;
		this.asteroid.body.y = -5000;
		// todo - reduce size of arrays? pool sa moze zvacsit ak uz nestaci


		while (enemySpawner.bullets.length != 0)
		{
			enemySpawner.bullets.last().destroy();
			enemySpawner.bullets.pop();
		}
	}
	,

	getCountOfObjectType: function (type)
	{
		var num = 0;
		for (var i = 0; i < enemyTrack.orbitingObjects.length; i++)
		{
			if (enemyTrack.orbitingObjects[i].active && enemyTrack.orbitingObjects[i].type === type)
			{
				num++;
			}
		}
		return num;
	}
}
;