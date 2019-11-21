var Track = function (planetSpriteName, group)
{
	this.create(planetSpriteName, group);
};
Track.prototype = {
	create: function (planetSpriteName, group)
	{
		this.radius = 265;

		this.orbitingObjects = [];
		//this.orbitingObjects.enableBody=true;

		this.planet = game.add.sprite(0, 0, 'pak1', planetSpriteName);
		this.planet.anchor.set(0.5);
		group.add(this.planet);


		game.add.tween(this.planet.anchor).to({
			y: 0.48 + Math.random() / 7
		}, 1000 + Math.random() * 1000, Phaser.Easing.Cubic.InOut, true, Math.random() * 1000, -1, true);


		this.ellipse = game.add.sprite(0, 0, 'pak1', 'elipsa_01');


		this.ellipse.anchor.set(0.5);
		this.ellipse.width = this.ellipse.height = this.radius * 2;
		this.ellipse.setScaleMinMax(this.ellipse.scale.x, this.ellipse.scale.y);
		this.planet.addChild(this.ellipse);


	},
	addNewOrbitingObject: function (obj)
	{
		this.orbitingObjects.push(obj);
	},
	removeOrbitingObject: function (obj)
	{
		for (var i = 0; i < this.orbitingObjects.length; i++)
		{
			if (this.orbitingObjects[i] === obj)
			{
				var obj = splc1(this.orbitingObjects, i);
				obj.destroy();
				//this.orbitingObjects.splice(i,1);
			}
		}
	},
	update: function ()
	{
		for (var i = 0; i < this.orbitingObjects.length; i++)
		{
			var orbitingObject = this.orbitingObjects[i];
			if (orbitingObject.active == false)
			{
				continue;
			}
			orbitingObject.vall += orbitingObject.baseSpeed * orbitingObject.speedMultiplier * orbitingObject.direction * (gameRunning ? clamp((60 / FPS), 0, 7) : 1);// ak dropnu fpska uplne tak nepojdu lode rychlo, clamp

			orbitingObject.sprite.body.x = this.planet.x + (Math.cos(orbitingObject.vall) * (this.radius + orbitingObject.orbitingRadiusOffset));
			orbitingObject.sprite.body.y = this.planet.y + (Math.sin(orbitingObject.vall) * (this.radius + orbitingObject.orbitingRadiusOffset));

			orbitingObject.sprite.body.rotation = orbitingObject.vall - Math.PI + (orbitingObject.direction == -1 ? Math.PI : 0) +
				(orbitingObject.direction == -1 ? -orbitingObject.orbitingRadiusOffset / 180 : orbitingObject.orbitingRadiusOffset / 180);

			orbitingObject.update();
		}
	},

}