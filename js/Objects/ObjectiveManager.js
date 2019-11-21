var ObjectiveManager = function ()
{
	this.create();
};
ObjectiveManager.prototype = {
	create: function ()
	{
		this.secondsCounter = -1;
	},
	onLoop: function ()
	{
		loopsCompletedThisGame++;
		if (this.currentObjectiveType === OBJECTIVE_TYPES.LOOPS)
		{
			this.loopsRemaining--;
			if (this.loopsRemaining <= 0)
			{
				this.OnObjectiveCompleted();
			}
		}


		if (currentLevel == 0 && inTutorialPhase)
		{
			if (!btnGameDown.inputEnabled || !btnGameUp.inputEnabled)
			{
				this.loopsRemaining++;
				return;
			}
			if (player.vall > 10)
			{
				sceneTutorial.showPopup(STR("TUTORIAL_1_3"));
				sceneTutorial.EndTutorialPhase();

				this.setNewObjective(currentLevel);

				enemySpawner.spawnEnemy();

				txtGameObjectiveValue.visible = true;
				txtGameObjectiveName.visible = true;
			}
		}
		if (currentLevel == 0 && inTutorialPhase)
		{
			this.loopsRemaining++;
		}
		if (this.currentObjectiveType === OBJECTIVE_TYPES.ENDLESS && loopsCompletedThisGame > bestScore)
		{
			bestScore = loopsCompletedThisGame;
			beatBestScoreThisGame = true;
		}
		this.UpdateTexts();

	},
	onTick: function ()
	{
		if (this.currentObjectiveType === OBJECTIVE_TYPES.TIME)
		{
			this.timeRemaining--;
			if (this.timeRemaining <= 0)
			{
				this.OnObjectiveCompleted();
			}
		}

		this.UpdateTexts();

	},
	onElimination: function ()
	{
		if (this.currentObjectiveType === OBJECTIVE_TYPES.ELIMINATE)
		{
			this.eliminationsRemaining--;
			if (this.eliminationsRemaining <= 0)
			{
				this.OnObjectiveCompleted();
			}
		}
		this.UpdateTexts();

	},
	getCurrentObjectiveName: function ()
	{
		if (this.currentObjectiveType === OBJECTIVE_TYPES.LOOPS)
		{
			return STR('Loops');
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.ELIMINATE)
		{
			return STR('Eliminate');
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.TIME)
		{
			return levelsData[currentLevel].levelDuration > 1 ? STR('Seconds' ): STR('Second');
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.ENDLESS)
		{
			return STR('Endless');
		}
	},
	getCurrentObjectiveValue: function ()
	{
		if (this.currentObjectiveType === OBJECTIVE_TYPES.LOOPS)
		{
			return this.loopsRemaining;
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.ELIMINATE)
		{
			return this.eliminationsRemaining;
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.TIME)
		{
			return this.timeRemaining;
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.ENDLESS)
		{
			return loopsCompletedThisGame;
		}
	},
	getCurrentObjectiveGoalValue: function ()
	{
		if (this.currentObjectiveType === OBJECTIVE_TYPES.LOOPS)
		{
			return levelsData[currentLevel].targetLoops;
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.ELIMINATE)
		{
			return levelsData[currentLevel].eliminateEnemies;
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.TIME)
		{
			return levelsData[currentLevel].levelDuration;
		}
		else if (this.currentObjectiveType === OBJECTIVE_TYPES.ENDLESS)
		{
			return '';
		}
	},
	UpdateTexts: function ()
	{
		txtGameObjectiveValue.text = objectiveManager.getCurrentObjectiveValue();
		if (this.currentObjectiveType === OBJECTIVE_TYPES.ENDLESS)
		{
			txtGameObjectiveName.text = STR('Best')+':' + bestScore;

		}
		else
		{
			txtGameObjectiveName.text = objectiveManager.getCurrentObjectiveName();
		}
	},

	OnObjectiveCompleted: function ()
	{
		ScenesTransitions.transitionStarted();
		player.invincible = true;

		clearInterval(objectiveManager.secondsCounter);
		game.time.events.add(500, function ()
		{
			SceneGame.instance.endGame(true);

		});

	},
	setNewObjective: function (index)
	{
		loopsCompletedThisGame = 0;
		objectiveManager.loopsRemaining = levelsData[index].targetLoops;
		objectiveManager.timeRemaining = levelsData[index].levelDuration;
		objectiveManager.eliminationsRemaining = levelsData[index].eliminateEnemies;

		if (objectiveManager.secondsCounter !== -1)
		{
			clearInterval(objectiveManager.secondsCounter);
		}
		objectiveManager.secondsCounter = setInterval(function ()
		{
			if (gameRunning === false || playerAlive === false)
			{
				return;
			}
			objectiveManager.onTick();
		}, 1000);

		objectiveManager.currentObjectiveType = levelsData[index].levelGoal;

	}
};