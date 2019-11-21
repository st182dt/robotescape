var ScenePopup = function ()
{
	ScenePopup.instance = this;

	this.create();
};

ScenePopup.instance = null;

ScenePopup.prototype = {

	create: function ()
	{
		grpScenePopup = game.add.group();
		grpScenePopup.position.set(game.width >> 1, game.height >> 1);
        
        popupi = grpScenePopup.create(0,0, 'tutorial');
		popupi.anchor.set(0.5);
        popupi.scale.set(1.2);
        popupi.alpha = 1;
        
        qmark = grpScenePopup.create(250,-95, 'qmark');
		qmark.anchor.set(0.5);
        qmark.scale.set(0.55);
        qmark.alpha = 0;
        
        info = 0;
        canDismiss = false;
        
        
        txtInfo = grpScenePopup.add(createText(0, 0, "A", 45,'popup_font'));
		txtInfo.anchor.set(0.5);
        txtInfo.alpha = 0;
        
        
        
        
        /*game.add.tween(field.scale).to({x:btnScale*1.05,y:btnScale*1.025}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){ game.add.tween(field.scale).to({x:btnScale,y:btnScale}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){ game.add.tween(char).to({alpha:1}, 100, Phaser.Easing.Linear.Out, true);
                                    game.add.tween(char.scale).to({x:btnScale * 1.1,y:btnScale*1.1}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){ game.add.tween(char.scale).to({x:btnScale,y:btnScale}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){this.animateRobots(1)},this); },this); },this); },this);*/
        
		
		grpScenePopup.visible = false;

		this.onResolutionChange();
        this.showText(0);
	},
    
    update: function(delta)
    {
        if(canDismiss){
            let inputDown = game.input.pointer1.isDown;
            if(inputDown || spaceKey.isDown){
                canDismiss = false;
                ScenePopup.instance.HideAnimated();
            }
        }
    },
    
    showText: function (n)
	{
        if(n != 0){
            game.add.tween(txtInfo).to({alpha:1}, 100, Phaser.Easing.Linear.Out, true);
            game.add.tween(txtInfo.scale).to({x:1*1.05,y:1*1.025}, 100, Phaser.Easing.Linear.Out, true)
            .onComplete.add(function(){ game.add.tween(txtInfo.scale).to({x:1,y:1}, 100, Phaser.Easing.Linear.Out, true)
            .onComplete.add(function(){canDismiss = true;},this); },this);
            switch(n){
                case 1:
                    txtInfo.text = "Swipe left or right.";
                    break;
                case 2:
                    txtInfo.text = "Try swiping left or right\nto avoid the robot.";
                    break;
                case 3:
                    txtInfo.text = "Green robots always move\none tile down.";
                    break;
                case 4:
                    txtInfo.text = "You collided with the robot!";
                    break;
                case 5:
                    txtInfo.text = "Collect all coins before the\nlevel is finished.";
                    break;
                case 6:
                    txtInfo.text = "You need to collect all coins!";
                    break;
                case 7:
                    txtInfo.text = "You did it!";
                    break;
            }
        }

	},
    
	onResolutionChange: function ()
	{
		grpScenePopup.position.set(game.width >> 1, game.height >> 1);

	},

	ShowAnimated: function (n)
	{
        info = n;
        canDismiss = false;
        hidden = false;
        qmark.alpha = 0;
        txtInfo.alpha = 0;
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.Out;
		ScenesTransitions.showSceneAlpha(grpScenePopup, 0, ScenesTransitions.TRANSITION_LENGTH);
        game.add.tween(popupi.scale).to({x:1.2*1.05,y:1.2*1.025}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){ game.add.tween(popupi.scale).to({x:1.2,y:1.2}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){
            ScenePopup.instance.showText(info);
            game.add.tween(qmark).to({alpha:1}, 100, Phaser.Easing.Linear.Out, true);
            game.add.tween(qmark.scale).to({x:0.55*1.2,y:0.55*1.2}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){ game.add.tween(qmark.scale).to({x:0.55,y:0.55}, 100, Phaser.Easing.Linear.Out, true)}
        , this); },this); },this);
        
        
        
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
	},

	HideAnimated: function ()
	{
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
		ScenesTransitions.hideSceneAlpha(grpScenePopup, ScenesTransitions.TRANSITION_LENGTH);
        setTimeout(function(){ if(tutorial != 2) tutorial++;
            if(info == 7) { level++; SceneHra.instance.newLevel(level); }
            else if(info == 4 || info == 6){
                SceneHra.instance.newLevel(level);
            }
            hidden = true;
        },500);
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
	}

}


