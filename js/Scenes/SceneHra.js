var SceneHra = function ()
{
	SceneHra.instance = this;

	this.create();
};

SceneHra.instance = null;

SceneHra.prototype = {

	create: function ()
	{
		grpSceneHra = game.add.group();
		grpSceneHra.position.set(game.width >> 1, game.height >> 1);
        
        btnScale = 1;
		btnH = 100 * btnScale;
		btnW = 100 * btnScale;
        isMouseDown = false;
        canSwipe = true;
        startPos = {x:0,y:0};
        last_direction = 0;
        coin_to_destroy = false;
        
        money = 0;
        max_money = 1;
        
        tutorial = 1;
        hidden = false;
        level = 1;

        field = grpSceneHra.create(0, 0, 'game_field');
		field.anchor.set(0.5);
		field.scale.set(btnScale);
        field.alpha = 1;
        
        head = grpSceneHra.create(0, 0, 'header');
        head.anchor.set(0.5);
        head.reset();
        
        txtLevel = grpSceneHra.add(createText(0, 0, "Level: "+level, 45,'popup_font'));
		txtLevel.anchor.set(0.5);
        txtLevel.alpha = 1;
        
        if (GAME_CURRENT_ORIENTATION === ORIENTATION_PORTRAIT){
            head.x = 0; head.y = -game.height/2 + 40;
            txtLevel.x = 0; txtLevel.y = -game.height/2+38;
            head.scale.set(1);
            txtLevel.scale.set(1);
        }else{
            head.x = game.width / 4; head.y = -game.height/2 + 35;
            txtLevel.x = game.width / 4; txtLevel.y = -game.height/2+30;
            head.scale.set(0.7);
            txtLevel.scale.set(0.7);
        }
        
        collision = false;
        
        coins = [{x:1,y:0,id:grpSceneHra.create(0,0, 'coin')}];
        for(let i = 0; i < coins.length; i++){
            let coin = coins[i].id;
            coin.x = -180 + 180 * coins[i].x;
            coin.y = -180 + 180 * coins[i].y;
            coin.anchor.set(0.5);
            coin.scale.set(0.6);
            coin.alpha = 0;
        }
        
        robots = [{x:1,y:0,type:0,id:grpSceneHra.create(0,0, 'robot_green')}];
        for(let i = 0; i < robots.length; i++){
            let robot = robots[i].id;
            robot.x = -180 + 180 * robots[i].x;
            robot.y = -180 + 180 * robots[i].y;
            robot.anchor.set(0.5);
            robot.scale.set(0.75);
            robot.alpha = 0;
        }
        
        x = 1;
        y = 1;
        char = grpSceneHra.create(-180 + 180 * x, -180 + 180*y, 'player');
		char.anchor.set(0.5);
        char.alpha = 0;
        field.scale.set(1);
        
        
        game.add.tween(field.scale).to({x:btnScale*1.05,y:btnScale*1.025}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){ game.add.tween(field.scale).to({x:btnScale,y:btnScale}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){ game.add.tween(char).to({alpha:1}, 100, Phaser.Easing.Linear.Out, true);
                                    game.add.tween(char.scale).to({x:btnScale * 1.1,y:btnScale*1.1}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){ game.add.tween(char.scale).to({x:btnScale,y:btnScale}, 100, Phaser.Easing.Linear.Out, true)
        .onComplete.add(function(){this.animateRobots(1);},this); },this); },this); },this);
        
		
        
		grpSceneHra.visible = false;

		this.onResolutionChange();
        this.animateRobots(0);
        this.newLevel(0);
	},
    
    newLevel: function(n){
        if(n != 0){
            money = 0;
            txtLevel.text = "Level: " + level;
            if(n == 1) max_money = 1;
            else if(n == 2) max_money = 2;
            else if(n == 3) max_money = 1;
            else if(n == 4) max_money = 2;
            for(let i = 0; i < robots.length; i++){
                game.add.tween(robots[i].id).to({alpha:0}, 100, Phaser.Easing.Linear.Out, true);
            }
            for(let i = 0; i < coins.length; i++) {
                game.add.tween(coins[i].id).to({alpha:0}, 100, Phaser.Easing.Linear.Out, true);
            }
            game.add.tween(char).to({alpha:0}, 100, Phaser.Easing.Linear.Out, true)
            .onComplete.add(function(){
                for(let i = 0; i < robots.length; i++) robots[i].id.destroy();
                robots = [];
                for(let i = 0; i < coins.length; i++) coins[i].id.destroy();
                coins = [];
                setTimeout(function(){
                    if(n == 1){x=1;y=1;}
                    else if(n == 2){x=1;y=2;}
                    else if(n == 3){x=1;y=2;}
                    else if(n == 4){x=2;y=2;}
                    char.x = -180 + 180 * x; char.y = -180 + 180 * y;
                    game.add.tween(char).to({alpha:1}, 100, Phaser.Easing.Linear.Out, true);
                    game.add.tween(char.scale).to({x:btnScale * 1.1,y:btnScale*1.1}, 100, Phaser.Easing.Linear.Out, true)
                    .onComplete.add(function(){ game.add.tween(char.scale).to({x:btnScale,y:btnScale}, 100, Phaser.Easing.Linear.Out, true)
                    .onComplete.add(function(){
                        switch(n){
                            case 1:
                                robots = [{x:1,y:0,type:0,id:grpSceneHra.create(0,0, 'robot_green')}];
                                coins = [{x:1,y:0,id:grpSceneHra.create(0,0, 'coin')}];
                                tutorial = 1;
                                break;
                            case 2:
                                robots = [{x:0,y:0,type:0,id:grpSceneHra.create(0,0, 'robot_green')},
                                         {x:2,y:0,type:0,id:grpSceneHra.create(0,0, 'robot_green')}];
                                
                                coins = [{x:1,y:1,id:grpSceneHra.create(0,0, 'coin')},
                                        {x:2,y:2,id:grpSceneHra.create(0,0, 'coin')}];
                                break;
                            case 3:
                                robots = [{x:0,y:0,type:1,id:grpSceneHra.create(0,0, 'robot_blue')}];
                                
                                coins = [{x:1,y:1,id:grpSceneHra.create(0,0, 'coin')}];
                                break;
                            case 4:
                                robots = [{x:1,y:0,type:0,id:grpSceneHra.create(0,0, 'robot_green')}];
                                
                                coins = [{x:2,y:1,id:grpSceneHra.create(0,0, 'coin')},
                                        {x:1,y:2,id:grpSceneHra.create(0,0, 'coin')}];
                                break;
                        }
                        for(let i = 0; i < robots.length; i++){
                            let robot = robots[i].id;
                            robot.x = -180 + 180 * robots[i].x;
                            robot.y = -180 + 180 * robots[i].y;
                            robot.anchor.set(0.5);
                            robot.scale.set(0.75);
                            robot.alpha = 0;
                        }
                        for(let i = 0; i < coins.length; i++){
                            let coin = coins[i].id;
                            coin.x = -180 + 180 * coins[i].x;
                            coin.y = -180 + 180 * coins[i].y;
                            coin.anchor.set(0.5);
                            coin.scale.set(0.6);
                            coin.alpha = 0;
                        }
                        if(n != 1) SceneHra.instance.animateRobots(3);
                        else SceneHra.instance.animateRobots(1);
                    },this); },this);
                },500);
                
            },this);
        }
    },
    
    animateRobots: function (animation)
    {
        if(animation == 1){
            for(let i = 0; i < robots.length; i++){
                let robot = robots[i].id;
                game.add.tween(robot).to({alpha:1}, 100, Phaser.Easing.Linear.Out, true);
                game.add.tween(robot.scale).to({x:0.75 * 1.1,y:0.75 *1.1}, 100, Phaser.Easing.Linear.Out, true)
                .onComplete.add(function(){ game.add.tween(robot.scale).to({x:0.75,y:0.75}, 100, Phaser.Easing.Linear.Out, true)
                .onComplete.add(function(){ scenes[2].ShowAnimated(1); collision = false; }); },this);
                
            }
        }else if(animation == 2){
            if(!collision){
            for(let i = 0; i < robots.length; i++){
                let robot = robots[i].id;
                if(robots[i].type == 0){
                    robots[i].y += 1;
                }else{
                    switch(last_direction){
                        case 0: robots[i].x += 1; break;
                        case 1: robots[i].x -= 1; break;
                        case 2: robots[i].y += 1; break;
                        case 3: robots[i].y -= 1; break;
                    }
                }
                
                if(robots[i].y == 3){
                    game.add.tween(robot).to({alpha:0}, 250, Phaser.Easing.Linear.Out, true);
                    game.add.tween(robot).to({y:180+45}, 500, Phaser.Easing.Linear.Out, true);
                }
                else if(robots[i].x == -1){
                    game.add.tween(robot).to({alpha:0}, 250, Phaser.Easing.Linear.Out, true);
                    game.add.tween(robot).to({x:-180-45}, 500, Phaser.Easing.Linear.Out, true);
                    //zmaz robota z arrayu
                }
                else
                game.add.tween(robot).to({x:-180 + 180 * robots[i].x,y:-180 + 180 * robots[i].y}, 500, Phaser.Easing.Quadratic.Out, true);
            }
            }
            if(tutorial == 3) { tutorial++; setTimeout(function(){ scenes[2].ShowAnimated(3); },700); }
        }if(animation == 3){
            for(let i = 0; i < robots.length; i++){
                let robot = robots[i].id;
                game.add.tween(robot).to({alpha:1}, 100, Phaser.Easing.Linear.Out, true);
                game.add.tween(robot.scale).to({x:0.75 * 1.1,y:0.75 *1.1}, 100, Phaser.Easing.Linear.Out, true)
                .onComplete.add(function(){ game.add.tween(robot.scale).to({x:0.75,y:0.75}, 100, Phaser.Easing.Linear.Out, true)
                .onComplete.add(function(){ if(level == 3) scenes[2].ShowAnimated(8); collision = false; },this); },this);
            }
            for(let i = 0; i < coins.length; i++){
                let coin = coins[i].id;
                game.add.tween(coin).to({alpha:1}, 150, Phaser.Easing.Linear.Out, true);
                game.add.tween(coin.scale).to({x:0.6 * 1.1,y:0.6 *1.1}, 100, Phaser.Easing.Linear.Out, true)
                .onComplete.add(function(){ game.add.tween(coin.scale).to({x:0.6,y:0.6}, 100, Phaser.Easing.Linear.Out, true); }, this);
            }
        }
    },
    
    update: function(delta){
        if(!collision){
            let level_is_finished = true;
            for(let i = 0; i < robots.length; i++){
                if(robots[i].x == x && robots[i].y == y){
                    collision = true;
                    setTimeout(function(){ scenes[2].ShowAnimated(4); },250);
                    break;
                }
                if(robots[i].type == 0 && robots[i].y < 3) level_is_finished = false;
                else if(robots[i].type == 1 && robots[i].x >= 0 && robots[i].x <= 2 && robots[i].y >= 0 && robots[i].y <= 2)
                    level_is_finished = false;
            }
            if(level_is_finished && !collision){
                collision = true;
                if(money >= max_money) { scenes[2].ShowAnimated(7); }
                else scenes[2].ShowAnimated(6);
            }
        }
        
        if(tutorial > 5 && !coin_to_destroy){
            for(let i = 0; i < coins.length; i++){
                if(coins[i].x == x && coins[i].y == y){
                    coin_to_destroy = true;
                    game.add.tween(coins[i].id).to({alpha:0}, 50, Phaser.Easing.Quadratic.Out, true);
                    game.add.tween(coins[i].id.scale).to({x:0,y:0}, 50, Phaser.Easing.Quadratic.Out, true)
                    .onComplete.add(function(){ coins.splice(i,1); money++; coin_to_destroy = false; },this);
                    break;
                }
            }
        }
        
        if(tutorial == 5 && hidden && !collision) {
            tutorial++;
            for(let i = 0; i < coins.length; i++){
                let coin = coins[i].id;
                game.add.tween(coin).to({alpha:1}, 150, Phaser.Easing.Linear.Out, true);
                game.add.tween(coin.scale).to({x:0.6 * 1.3,y:0.6 *1.3}, 150, Phaser.Easing.Linear.Out, true)
                .onComplete.add(function(){ game.add.tween(coin.scale).to({x:0.6,y:0.6}, 150, Phaser.Easing.Linear.Out, true)
                .onComplete.add(function(){ scenes[2].ShowAnimated(5); }); },this);

            }
        }
        
        let inputDown = game.input.pointer1.isDown;
        if(inputDown || rightKey.isDown || leftKey.isDown || upKey.isDown || downKey.isDown){
            let mouse = {x:game.input.pointer1.x,y:game.input.pointer1.y};
            if(!isMouseDown){ isMouseDown = true; startPos = mouse; }
            let dist = Phaser.Math.distance(mouse.x,mouse.y,startPos.x,startPos.y);
            
            if(rightKey.isDown || leftKey.isDown || upKey.isDown || downKey.isDown) dist = 100;
            
            if(dist >= 100 && canSwipe && hidden && !collision){
                canSwipe = false;
                let left = Phaser.Math.distance(mouse.x,mouse.y,startPos.x-1,startPos.y);
                let right = Phaser.Math.distance(mouse.x,mouse.y,startPos.x+1,startPos.y);
                let up = Phaser.Math.distance(mouse.x,mouse.y,startPos.x,startPos.y-1);
                let down = Phaser.Math.distance(mouse.x,mouse.y,startPos.x,startPos.y+1);
                
                if(rightKey.isDown){ left = up = down = 1; right = 0; }
                else if(leftKey.isDown){ right = up = down = 1; left = 0; }
                else if(upKey.isDown){ left = right = down = 1; up = 0; }
                else if(downKey.isDown){ left = up = right = 1; down = 0; }
                
                switch(Phaser.Math.min(left,right,up,down)){
                    case left: LOG("left");
                        if(tutorial == 1) tutorial += 2;
                        else if(tutorial == 2) tutorial++;
                        if(tutorial != 4 && tutorial != 6 && x != 0){
                        x -= 1; last_direction = 0;
                        game.add.tween(char).to({x:-180 + 180 * x}, 250, Phaser.Easing.Quadratic.Out, true)
                        .onComplete.add(function(){SceneHra.instance.animateRobots(2)},this);
                        }
                        break;
                    case right: LOG("right");
                        if(tutorial == 1) tutorial += 2;
                        else if(tutorial == 2) tutorial++;
                        if(tutorial != 4 && tutorial != 6 && x != 2){
                        x += 1; last_direction = 1;
                        game.add.tween(char).to({x:-180 + 180 * x}, 250, Phaser.Easing.Quadratic.Out, true)
                        .onComplete.add(function(){SceneHra.instance.animateRobots(2)},this);
                        }
                        break;
                    case up: LOG("up");
                        if(tutorial == 1){
                            //
                        }
                        else if(tutorial == 2){
                            scenes[2].ShowAnimated(2);
                        }else if(tutorial != 4 && tutorial != 6 && y != 0){
                        y -= 1; last_direction = 2;
                        game.add.tween(char).to({y:-180 + 180 * y}, 250, Phaser.Easing.Quadratic.Out, true)
                        .onComplete.add(function(){SceneHra.instance.animateRobots(2)},this);
                        }
                        break;
                    case down: LOG("down");
                        if(tutorial == 1){
                            //
                        }
                        else if(tutorial == 2 && tutorial != 6){
                            scenes[2].ShowAnimated(2);
                        }else if(tutorial != 4 && y != 2){
                            y += 1; last_direction = 3;
                            game.add.tween(char).to({y:-180 + 180 * y}, 250, Phaser.Easing.Quadratic.Out, true)
                            .onComplete.add(function(){SceneHra.instance.animateRobots(2);},this);
                        }
                        break;
                }
            }
        }else{
            isMouseDown = false;
            canSwipe = true;
        }
        //LOG(game.input.mousePointer.x);
    },
    
	onResolutionChange: function ()
	{
		grpSceneHra.position.set(game.width >> 1, game.height >> 1);
        
        if (GAME_CURRENT_ORIENTATION === ORIENTATION_PORTRAIT){
            head.x = 0; head.y = -game.height/2 + 40;
            txtLevel.x = 0; txtLevel.y = -game.height/2+38;
            head.scale.set(1);
            txtLevel.scale.set(1);
        }else{
            head.x = game.width / 4; head.y = -game.height/2 + 35;
            txtLevel.x = game.width / 4; txtLevel.y = -game.height/2+30;
            head.scale.set(0.7);
            txtLevel.scale.set(0.7);
        }
        
        /*field.y = field.getBounds().topLeft.y + game.width/2 ;
        field.x = field.getBounds().topLeft.x;*/
        //field.x = 
        //LOG("field.scale.x / 2");
        //field.x = game.width / 2 - field.scale.x / 2;
        //field.y = game.height / 2 - field.scale.y / 2;
        //field.position.setTo(game.width / 2, game.height / 2);

	},

	ShowAnimated: function ()
	{
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.Out;
		ScenesTransitions.showSceneAlpha(grpSceneHra, 0, ScenesTransitions.TRANSITION_LENGTH);
		ScenesTransitions.TRANSITION_EFFECT_IN = Phaser.Easing.Linear.In;
	},

	HideAnimated: function ()
	{
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
		ScenesTransitions.hideSceneAlpha(grpSceneHra, ScenesTransitions.TRANSITION_LENGTH);
		ScenesTransitions.TRANSITION_EFFECT_OUT = Phaser.Easing.Linear.Out;
	}

}


