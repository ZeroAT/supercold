/**************************************
 TITLE: main.js
 AUTHOR: Jason Meno (JAM)
 CREATE DATE: 20 October 2017
 PURPOSE: Provide jquery and javascript functionality to HTML5 SUPERCOLD Mobile Game
***************************************/

var highscores = [];
//initialize arrays outside of document.ready for memory synchronization
var bulletLoc = [];
var playerBullet = [];
var playerBulletLoc = [];
var Enemy = [];
var bulletAngle = [];
var enemyAngle = [];
var playerBulletAngle = [];
var playerAngle= [];
var Bounds = [];
var EnemyBounds = [];
var enemyBulletTrace = [];
var enemiesFiring = [];
var playerX;
var playerY;
var currentLevel = [[],[],[],[]];
var campaignMode = false;
var survivalMode = [[225,200],[],[],[20,20]];
var level1 = [[5,5],[550,20,100,375],[50,50,100,100,200,50,100,100,350,50,100,100,50,200,100,100,200,200,100,100,350,200,100,100],[550,370]];

$(document).ready(function(){

	$(".SurvivalButton").click(function () {
		$(".MainMenu").hide();
    $(".DeathScreen").hide();
		$(".CreditScreen").hide();
		$(".HighScoresScreen").hide();
    $("#canvas").show();
		currentLevel = survivalMode;
		createLevel();
		offsetDY = accel.getAY();
    offsetDX = accel.getAX();
    start = setInterval(draw, 33);
		var clock = setInterval(clock, 100);
    draw();

    });

		$(".CampaignButton").click(function () {
			$(".MainMenu").hide();
			$(".DeathScreen").hide();
			$(".CreditScreen").hide();
			$(".HighScoresScreen").hide();
			$("#canvas").show();
			currentLevel = level1;
			campaignMode = true;
			createLevel();
			offsetDY = accel.getAY();
			offsetDX = accel.getAX();
			start = setInterval(draw, 33);
			var clock = setInterval(clock, 100);
			draw();

			});
	$(".HighScoresButton").click(function () {
				$(".MainMenu").hide();
		        $(".DeathScreen").hide();
		        $("#canvas").hide();
				$(".CreditScreen").hide();
				var highscores = localStorage.getItem("score");
				highscores = highscores.replace(/[[\]]/g,'')
				console.log(highscores);
				$("#score6").text(highscores.split(/,/)[0]);
				$("#score7").text(highscores.split(/,/)[1]);
				$("#score8").text(highscores.split(/,/)[2]);
				$("#score9").text(highscores.split(/,/)[3]);
				$("#score10").text(highscores.split(/,/)[4]);
				$(".HighScoresScreen").show();



	});
	$(".CreditButton").click(function () {
		$(".MainMenu").hide();
        $(".DeathScreen").hide();
        $("#canvas").hide();
				$(".HighScoresScreen").hide();
		$(".CreditScreen").show();

	});

	$(".ReturnButton").click(function () {
		$(".MainMenu").show();
        $(".DeathScreen").hide();
				$(".HighScoresScreen").hide();
        $(".canvas").hide();
		$(".CreditScreen").hide();

	});
	//initial conditions

	playerX = 5;
	playerY = 5;
	timescale = 1;
	timescaleRate = 0;
	clockTime = 0;
	dX = 0;
	dY = 0;
	xVal = 0;
	yVal = 0;
	maxAccel = 5;
	firstPathCheck = true;
	updateCounter = 1;


	//currentLevel uses the following variables
	//[[playerStartX, playerStartY],[enemy1X,enemy1Y....enemyNX,enemyNY], [bounds1StartX, bounds1StartY, bounds1Width, bounds1Height,....boundsN][coinStartX, coinStartY]]
	//currentLevel = [[5,5],[],[50,50,100,100,200,50,100,100,50,200,100,100,200,200,100,100],[25,25]];
	//currentLevel = [[5,5],[],[],[400,50]];


	//bounds = createBoundaries(220-18,200-18,100+18,100+18);


	var coinX, coinY, enemyX, enemyY;
	var changeDY, changeDX;
	var offsetDX, offsetDY;
	var mouseDownBool;
	var movement = setInterval(setMovement,100);
	var accel = new Accel();
	var oldDY = 0;
	var oldDX = 0;
	var start;
	var score = 0;
	var mouseX, mouseY;
	var bulletAngle = [];
	var enemyAngle = [];
	var playerBulletAngle = [];
	var playerAngle= [];
	var highscores = [];
	var coinAudio = document.getElementById("coin");
	var bulletAudio = document.getElementById("bullet");

	createLevel();
	//newCoin();



	var drawing = document.getElementById("canvas");
	document.body.appendChild(drawing);
	con = drawing.getContext('2d');

	//assign keydown & keydown event handlers to page
	document.onkeydown = checkKeyDown;
	document.onkeyup = checkKeyUp;
	drawing.addEventListener('mousedown', onDown, true);

	function onDown(e){
		mouseX = e.offsetX;
 		mouseY = e.offsetY;
		playerBulletFire();

	}
	function checkKeyDown(e) {

		//pre IE9 window condition check
		e = e || window.event;

		if (e.keyCode == '38') {
		    changeDY = setInterval(setYRate(-1),33);
		    timescaleRate += 1;
		}
		else if (e.keyCode == '40') {
		    changeDY = setInterval(setYRate(1),33);
		    timescaleRate += 1;
		}
		else if (e.keyCode == '37') {
		    changeDX = setInterval(setXRate(-1),33);
		    timescaleRate += 1;
		}
		else if (e.keyCode == '39') {
		    changeDX = setInterval(setXRate(1),33);
		    timescaleRate += 1;
		}

	}

	function checkKeyUp(e) {

		//pre IE9 window condition check
		e = e || window.event;

		if (e.keyCode == '38') {
		    clearInterval(changeDY);
		    timescaleRate += 1;
		}
		else if (e.keyCode == '40') {
		    clearInterval(changeDY);
		    timescaleRate += 1;
		}
		else if (e.keyCode == '37') {
		    clearInterval(changeDX);
		    timescaleRate += 1;
		}
		else if (e.keyCode == '39') {
		    clearInterval(changeDX);
		    timescaleRate += 1;
		}

	}


	function draw(){

		var w = $("#canvas").width();
		var h = $("#canvas").height();
 		newDX = accel.getAX();
    newDY = accel.getAY();
        //update position change with accelerometer data
		dY += (newDX-offsetDX);
		dX += (newDY-offsetDY);

        //depending on intensity of movement, time rate increases
        if(oldDX != newDX){
        	//timescaleRate += Math.abs(oldDX-newDX)*1.5;
        	timescaleRate += Math.abs(dX)/15;
        }

        if(oldDY != newDY){
        	//timescaleRate += Math.abs(oldDX-newDX)*1.5;
        	timescaleRate += Math.abs(dY)/15;
        }

    oldDX = newDX;
 		oldDY = newDY;


		//check for max velocity
		if(dX > maxAccel){
			dX = maxAccel;
		}

		if(dY > maxAccel){
			dY = maxAccel;
		}

		//set change of position of player
		playerX += dX;
		playerY += dY;

		checkBoundaries();

		//check for gold coin collision
		if(checkCoinCollision(playerX, playerY)){
			if(!campaignMode){
				score++;
				newCoin();
			}
			else{
				//Go to next level
				score++;
				endGame();
			}
			score++;
			newEnemy();
		}

		if(playerBullet.length > 0){
			updatePlayerBullet();
			checkPlayerBulletHit();
			playerBulletWallCollision();
		}

		updateBullet();
		checkPlayerBulletHit();
		updateEnemy();

		checkBulletWallCollision();
		playerBulletWallCollision();



		//introduce drag in dX and dY
		if(dX > 0.1 || dX < 0){
			dX -= dX/10;
		}

		if(dY > 0.1 || dY < 0){
			dY -= dY/10;
		}

		//reduce timescale rate (time drag)

		if(timescaleRate > 0.1){
			timescaleRate -= timescaleRate/15;
		}


		//Begin drawing all elements
		// Fill with gradient
		con.fillStyle = "#f0f0f0";
		con.fillRect(0,0,600,400);


		con.strokeStyle = "black";
		con.lineWidth = 5;
		con.strokeRect(0, 0, 600, 400);

		//Draw Boundaries
		con.fillStyle = "black";
		con.fillRect(playerX,playerY,18,18);

		for(b=0; b<=currentLevel[2].length;b+=4){
			con.fillRect(currentLevel[2][b],currentLevel[2][b+1],currentLevel[2][b+2],currentLevel[2][b+3]);
		}



		con.fillRect(playerX,playerY,18,18);
		con.fillStyle = "gold"
		con.fillRect(coinX,coinY,10,10);
		con.fillStyle = "yellow";
		con.fillRect(coinX+2,coinY+2,6,6);

		con.fillStyle = "rgba(0, 0, 0, 0.5)";
		con.font = "24px Helvetica";
		con.textAlign = "left";
		con.textBaseline = "top";
		con.fillText("Score: " + score, 486, 10);

		for(i = 0; i <= Enemy.length-1; i+=2){

			if(enemyBulletTrace.length > 0){

				for(j=0; j<enemyBulletTrace[i].length-2; j+=2){
					alpha = 2/j;
					fillString = "rgba(255,0,0,"
					con.fillStyle = fillString.concat(String(alpha),")");
					//con.fillStyle = "rgba(255,0,0,0.7)";
					con.fillRect(enemyBulletTrace[i][j], enemyBulletTrace[i][j+1],5,5);

				}
			}


			con.fillStyle = "blue";
			con.fillRect(bulletLoc[i],bulletLoc[i+1],5,5);

			con.fillStyle = "red";
			con.fillRect(Enemy[i],Enemy[i+1],18,18);

		}
		for (i = 0; i < playerBulletLoc.length; i+=2){

			con.fillStyle = "black";
			con.fillRect(playerBulletLoc[i],playerBulletLoc[i+1],5,5);

		}

		if(checkEnemyCollision(playerX,playerY) || checkBulletHit(playerX,playerY)){
			if(score > window.top.name){
				window.top.name = score;
			}

			clearInterval(start);
			//window.location.reload(false);
			endGame();
			//alert("Game over!");
			//quit();
		}

	} // end draw
		function playerBulletFire(){
			//alert("test");
			//console.log(playerX + "::::" + playerY );
			newPlayerBullet(playerX, playerY);

		}
		function newPlayerBullet(playerX, playerY){

			//playerBulletLoc.push(playerX, playerY);
			//console.log(Enemy.length);

			if (Enemy.length > 0 && playerBulletLoc.length < 2 ){
				playerBulletLoc.splice(2,0,playerX,playerY);
				bulletAudio.play();

				if(playerX<mouseX ){
					playerBulletAngle.splice(0,2,Math.atan((playerY-mouseY)/(playerX-mouseX)),0);
				}
				else{
					playerBulletAngle.splice(0,2,Math.atan((playerY-mouseY)/(playerX-mouseX))+Math.PI,0);
				}
			}
		}

		function updatePlayerBullet(){
	  	//use timescale to determine next location of bullets on slope of bullet trace rays
	  	for(i = 0; i <= playerBulletLoc.length - 1; i+=2){
				playerBulletLoc[i] += (Math.cos(playerBulletAngle[i]))  * timescaleRate/2;
	  		playerBulletLoc[i+1] += (Math.sin(playerBulletAngle[i])) * timescaleRate/2;
	  	}
	  } //end updateBullet

		function playerBulletWallCollision(){
			//if bullet hits wall, delete bullet and make new console.log(playerBulletLoc[i]);
	  	for(i = 0; i <= playerBulletLoc.length - 1; i+=2){
		  	if(playerBulletLoc[i] >= 597 || playerBulletLoc[i] <= 0 || playerBulletLoc[i+1] >= 397 || playerBulletLoc[i+1] <= 0){
		  		playerBulletLoc.splice(i,2);
		  	}//end if

		 }//end for

	 }//end playerBulletWallCollision()


	 function checkPlayerBulletHit(){
		 for (i = 0; i < Enemy.length; i+=2){
			 for (j = 0; j < playerBulletLoc.length; j+=2){
				 if((Enemy[i] >= playerBulletLoc[j] && Enemy[i] <= playerBulletLoc[j] + 18) || (Enemy[i] + 18 >= playerBulletLoc[j] && Enemy[i] + 18 <= playerBulletLoc[j] + 18)){
					if((Enemy[i+1] >= playerBulletLoc[j+1] && Enemy[i+1] <= playerBulletLoc[j+1] + 18) || (Enemy[i+1] + 18 >= playerBulletLoc[j+1] && Enemy[i+1] + 18 <= playerBulletLoc[j+1] + 18)){
						playerBulletLoc.splice(j,2);
						Enemy.splice(i,2);
						bulletLoc.splice(i,2)

				 }
			 }
		 }
	 	}
	 }//end checkEnemyCollision



	  function setYRate(val) {
	  	dY += val;
	  }

	  function setXRate(val) {
	  	dX += val;
	  }

	  function setMovement() {

	  	dX += xVal;
	  	dY += yVal;
	  }

	  function newCoin(){
	  	coinX = Math.random() * (580);
	  	coinY = Math.random() * (380);


		 for (i = 0; i < Enemy.length; i+=2){
			 if((Enemy[i] >= coinX && Enemy[i] <= coinX + 18) || (Enemy[i] +18 >= coinX && Enemy[i] + 18 <= coinX + 18)){
				 if((Enemy[i+1] >= coinY && Enemy[i+1] <= coinY + 18) || (Enemy[i+1] + 18 >= coinY && Enemy[i+1] + 18 <= coinY + 18)){
					 coinX = Math.random() * (580);
					 coinY = Math.random() * (380);
				 }
			 }
		 }

	  	//check for collisions
	  	if(checkCoinCollision(playerX,playerY)){
				coinAudio.play();
	  		newCoin()
	  	}

	  }//end newCoin()

	  function newEnemy(){
	  	enemyX = Math.random() * (575);
	  	enemyY = Math.random() * (375);

	  	//check for collisions
	  	if(checkCoinCollision(enemyX, enemyY) || checkEnemyCollision(enemyX,enemyY) ){
				newEnemy();

	  	}
	  	else{

				if (checkEnemyCollision(enemyX,enemyY)){
					console.log("Enemy Collision Detected. New coordss!")
					enemyX = Math.random() * (575);
					enemyY = Math.random() * (375);
				}
				newBullet(enemyX,enemyY,Enemy.length);
	  		Enemy.push(enemyX,enemyY);

	  	}

	  }//end newEnemy()

	  function newBullet(enemyX,enemyY,bulletArrayLoc){

	  	bulletLoc.splice(bulletArrayLoc,2,enemyX,enemyY);

			if(playerX<enemyX){
				bulletAngle.splice(bulletArrayLoc,2,Math.atan((playerY-enemyY)/(playerX-enemyX))+Math.PI,0);
			}
			else{
				bulletAngle.splice(bulletArrayLoc,2,Math.atan((playerY-enemyY)/(playerX-enemyX)),0);
			}

	  }//end newBullet()

	  function checkCoinCollision(X,Y){

	  	if((coinX >= X && coinX <= X + 18) || (coinX +10 >= X && coinX + 10 <= X + 18)){
	  		if((coinY >= Y && coinY <= Y + 18) || (coinY +10 >= Y && coinY + 10 <= Y + 18)){
					coinAudio.play();
		  		return true;
		  	}
	  	}
	  	else {
	  		return false;
	  	}

	  }//end checkCoinCollision()



	  function checkEnemyCollision(X,Y){

	  	for (i = 0; i < Enemy.length; i+=2){
		  	if((Enemy[i] >= X && Enemy[i] <= X + 18) || (Enemy[i] +18 >= X && Enemy[i] + 18 <= X + 18)){
		  		if((Enemy[i+1] >= Y && Enemy[i+1] <= Y + 18) || (Enemy[i+1] + 18 >= Y && Enemy[i+1] + 18 <= Y + 18)){
			  		return true;
			  	}
		  	}
	  	}

	  	return false;
	  }//end checkEnemyCollision

	  function checkBulletHit(X,Y){
	  	for (i = 0; i < bulletLoc.length; i+=2){
		  	if((bulletLoc[i] >= X && bulletLoc[i] <= X + 18) || (bulletLoc[i] +3 >= X && bulletLoc[i] + 3 <= X + 18)){
		  		if((bulletLoc[i+1] >= Y && bulletLoc[i+1] <= Y + 18) || (bulletLoc[i+1] + 3 >= Y && bulletLoc[i+1] + 3 <= Y + 18)){
			  		return true;
			  	}
		  	}
	  	}

	  	return false;
	  }//end checkBulletHit()

	  function checkBoundaries(){

		//check player collision with canvas limits

	  	if(playerX+18 >= 597){
	  		playerX = 579;
	  	}
	  	if(playerX <= 3){
	  		playerX = 3;
	  	}
	  	if(playerY+18 >= 397){
	  		playerY = 379;
	  	}
	  	if(playerY <= 3){
	  		playerY = 3;
	  	}

			//check player collision with boundaries

			for(b=0; b<=currentLevel[2].length; b+=4){
				if(playerX+18 >= currentLevel[2][b] && playerX <= currentLevel[2][b]+currentLevel[2][b+2] && playerY+18 >= currentLevel[2][b+1] && playerY <= currentLevel[2][b+1]+currentLevel[2][b+3]){

					if(playerX-3 < currentLevel[2][b] && playerY+15 >= currentLevel[2][b+1] && playerY+3 < currentLevel[2][b+1]+currentLevel[2][b+3]){
						playerX = currentLevel[2][b]-18;
					}
					if(playerX+15 > currentLevel[2][b]+currentLevel[2][b+2] && playerY+15 > currentLevel[2][b+1] && playerY+3 < currentLevel[2][b+1]+currentLevel[2][b+3]){
						playerX = currentLevel[2][b]+currentLevel[2][b+2];
					}
					if(playerY-3 < currentLevel[2][b+1] && playerX+15 > currentLevel[2][b] && playerX+3 < currentLevel[2][b]+currentLevel[2][b+2]){
						playerY = currentLevel[2][b+1]-18;
					}
					if(playerY+15 > currentLevel[2][b+1]+currentLevel[2][b+3] && playerX+15 > currentLevel[2][b] && playerX+3 < currentLevel[2][b]+currentLevel[2][b+2]){
						playerY = currentLevel[2][b+1]+currentLevel[2][b+3];
					}
				}
			}

			//check player collision with boundaries

			for(b=0; b<=Enemy.length/2; b+=2){
				if(Enemy[b]+18 >= currentLevel[2][b] && Enemy[b] <= currentLevel[2][b]+currentLevel[2][b+2] && Enemy[b+1]+18 >= currentLevel[2][b+1] && Enemy[b+1] <= currentLevel[2][b+1]+currentLevel[2][b+3]){

					if(Enemy[b]-3 < currentLevel[2][b] && Enemy[b+1]+15 >= currentLevel[2][b+1] && Enemy[b+1]+3 < currentLevel[2][b+1]+currentLevel[2][b+3]){
						Enemy[b] = currentLevel[2][b]-18;
					}
					if(Enemy[b]+15 > currentLevel[2][b]+currentLevel[2][b+2] && Enemy[b+1]+15 > currentLevel[2][b+1] && Enemy[b+1]+3 < currentLevel[2][b+1]+currentLevel[2][b+3]){
						Enemy[b] = currentLevel[2][b]+currentLevel[2][b+2];
					}
					if(Enemy[b+1]-3 < currentLevel[2][b+1] && Enemy[b]+15 > currentLevel[2][b] && Enemy[b]+3 < currentLevel[2][b]+currentLevel[2][b+2]){
						Enemy[b+1] = currentLevel[2][b+1]-18;
					}
					if(Enemy[b+1]+15 > currentLevel[2][b+1]+currentLevel[2][b+3] && Enemy[b]+15 > currentLevel[2][b] && Enemy[b]+3 < currentLevel[2][b]+currentLevel[2][b+2]){
						Enemy[b+1] = currentLevel[2][b+1]+currentLevel[2][b+3];
					}
				}
			}


			//if(playerX )
	  }//end checkBoundaries()


	  function checkBulletWallCollision(){

	  	//if bullet hits wall, delete bullet and make new one
	  	for(i = 0; i <= bulletLoc.length-1; i+=2){

		  	if(bulletLoc[i] >= 597 || bulletLoc[i] <= 0 || bulletLoc[i+1] >= 397 || bulletLoc[i+1] <= 0){
		  		newBullet(Enemy[i],Enemy[i+1],i);
		  	}//end if
				for(b=0; b<=currentLevel[2].length; b+=4){

						if(bulletLoc[i]+5 >= currentLevel[2][b] && bulletLoc[i] <= currentLevel[2][b]+currentLevel[2][b+2] && bulletLoc[i+1]+5 >= currentLevel[2][b+1] && bulletLoc[i+1] <= currentLevel[2][b+1]+currentLevel[2][b+3]){


							path = enemyPath(Enemy[i], Enemy[i+1], playerX, playerY);
							collisionPoint = pathObsticalCollisionCheck(path);
/*
							//don't make a new bullet if player cannot be seen
							if(collisionPoint){
								bulletLoc.splice(i,2);
								//bulletLoc.splice(Enemy[i],Enemy[i+1]);
								bulletAngle.splice(i,2);
								enemyBulletTrace.splice(0,2,0,0);
								enemiesFiring[i] = 0;
								return
							}

							else{
				*/
								newBullet(Enemy[i],Enemy[i+1],i);
							//}

						}// end long if-statement

						if(bulletLoc[i] >= 597 || bulletLoc[i] <= 0 || bulletLoc[i+1] >= 397 || bulletLoc[i+1] <= 0){
							newBullet(Enemy[i],Enemy[i+1],i);
						}//end if

					}//end bounds check

		 	}//end for

	  }//end checkBulletWallCollision()

	  function clock(){

	  	clockTime += timescaleRate;
	  	clockTime = clockTime % 361;

	  }

	  function updateBullet(){
	  	//use timescale to determine next location of bullets on slope of bullet trace rays
	  	for(i = 0; i <= bulletLoc.length-1; i+=2){
		  	bulletLoc[i] += (Math.cos(bulletAngle[i]))*timescaleRate/2;
	  		bulletLoc[i+1] += (Math.sin(bulletAngle[i]))*timescaleRate/2;

				//create trace to follow bullet
				localTrace = [bulletLoc[i],bulletLoc[i+1]];

				for(j = 2; j<20; j+=2){
					localTrace[j] = localTrace[j-2]-(Math.cos(bulletAngle[i])*timescaleRate/1.25);
					localTrace[j+1] = localTrace[j-1]-(Math.sin(bulletAngle[i])*timescaleRate/1.25);
				}

				enemyBulletTrace.splice(i,2,localTrace,0);

			}
	  } //end updateBullet

		function updateEnemy(){
			//use timescale to determine next location of bullets on slope of bullet trace rays
			for(i = 0; i <= Enemy.length-1; i+=2){

				if(playerX<Enemy[i]){
					enemyAngle.splice(i,2,Math.atan((playerY-Enemy[i+1])/(playerX-Enemy[i]))+Math.PI,0);
				}
				else{
					enemyAngle.splice(i,2,Math.atan((playerY-Enemy[i+1])/(playerX-Enemy[i])),0);
				}

				//console.log(enemyAngle[0]*(180/Math.PI));
				//console.log("Calculation: " + Math.atan((playerY-Enemy[i+1])/(playerX-Enemy[i]))*(180/Math.PI));
				//console.log("Enemy X: " + Enemy[i] +" Enemy Y: " + Enemy[i+1]);

					path = enemyPath(Enemy[i], Enemy[i+1], playerX, playerY);
					collisionPoint = pathObsticalCollisionCheck(path);


				//}
				if(collisionPoint){

					winningEdge = nearestEdge(collisionPoint, playerX, playerY, true);

					if(winningEdge[0]<Enemy[i]){
						enemyAngle.splice(i,2,Math.atan((winningEdge[1]-Enemy[i+1])/(winningEdge[0]-Enemy[i]))+Math.PI,0);
					}
					else{
						enemyAngle.splice(i,2,Math.atan((winningEdge[1]-Enemy[i+1])/(winningEdge[0]-Enemy[i])),0);
					}

					collisionPoint = false;


				}

					Enemy[i] += (Math.cos(enemyAngle[i]))*timescaleRate/4;
					Enemy[i+1] += (Math.sin(enemyAngle[i]))*timescaleRate/4;

			}

		} //end updateBullet

		//creates a boundary array for obstacles
		function createBoundaries(startX, startY, width, height){

		  Bounds.push(999,999);

		  for(i=0; i<=width; i+=1){

		    Bounds.push(startX+i,startY);

		  }
		  Bounds.push(999,999);
		  for(i=0; i<=width; i+=1){
		    Bounds.push(startX+i,startY+height);
		  }
		  Bounds.push(999,999);
		  for(i=0; i<=height; i+=1){
		    Bounds.push(startX+width,startY+i);
		  }
		  Bounds.push(999,999);
		  for(i=0; i<=height; i+=1){
		    Bounds.push(startX,startY+i);
		  }

			Bounds.push(999,999);

			startX = startX -20;
			startY = startY -20;
			width = width + 18;
			height = height + 18;

			//create Enemy Bounds
			EnemyBounds.push(999,999);
			for(i=0; i<=width; i+=1){

				EnemyBounds.push(startX+i,startY);

			}
			EnemyBounds.push(999,999);
			for(i=0; i<=width; i+=1){
				EnemyBounds.push(startX+i,startY+height);
			}
			EnemyBounds.push(999,999);
			for(i=0; i<=height; i+=1){
				EnemyBounds.push(startX+width,startY+i);
			}
			EnemyBounds.push(999,999);
			for(i=0; i<=height; i+=1){
				EnemyBounds.push(startX,startY+i);
			}
			EnemyBounds.push(999,999);
		  //return boundary;
		}

		//returns array of enemy line of sight directly to player
		function enemyPath(enemyX, enemyY, playerX, playerY){
		  length = Math.sqrt(Math.pow(enemyX-playerX,2) + Math.pow(enemyY-playerY,2));

		  if(playerX<enemyX){
				pathAngle = Math.atan((playerY-enemyY)/(playerX-enemyX))+Math.PI;
			}
			else{
				pathAngle = Math.atan((playerY-enemyY)/(playerX-enemyX));
			}

		  enemyPathArray = [enemyX,enemyY];

		  for(j=0; j<=Math.floor(length)*2; j+=2){
		    enemyPathArray.push(enemyPathArray[j]+Math.cos(pathAngle), enemyPathArray[j+1] +Math.sin(pathAngle));
		  }

			//enemyPathArray.splice(0,10);

		  return enemyPathArray;
		}

		function pathObsticalCollisionCheck(pathArray){

		  //console.log("*Bounds Array Length: " + boundsArray.length);
		  //console.log("*Path Array Length: " + pathArray.length);

		  for(r=0; r<=pathArray.length;r+=2){
		    for(s=0; s<=EnemyBounds.length;s+=2){

		      if(Math.round(pathArray[r]) == EnemyBounds[s] && Math.round(pathArray[r+1]) == EnemyBounds[s+1]){

		        return s;

		      }

		    }

		  }

		  return false;

		}

		function nearestEdge(index, playerX, playerY, isEnemy){
		  d = index;

			checkArray = Bounds;

			if(isEnemy){
				checkArray = EnemyBounds;
			}

		  while(checkArray[d] != 999){
		    d-=2;
		    edge1 = [checkArray[d+2], checkArray[d+3]];

		  }

		  //console.log(edge1);

		  d = index;

		  while(checkArray[d] != 999){
		    d+=2;
		    edge2 = [checkArray[d-2], checkArray[d-1]];
		  }

		  //console.log(edge2);

		  edge1Length = Math.sqrt(Math.pow(edge1[0]-playerX,2) + Math.pow(edge1[1]-playerY,2));
		  //console.log("Edge1 Length: " + edge1Length);
		  edge2Length = Math.sqrt(Math.pow(edge2[0]-playerX,2) + Math.pow(edge2[1]-playerY,2));
		  //console.log("Edge2 Length: " + edge2Length);

		  if(edge1Length<=edge2Length){
		    //console.log("Edge1 wins: " + edge1)
		    return edge1;
		  }
		  else{
		  //  console.log("Edge2 wins: " + edge2)
		    return edge2;
		  }

		}

	  //aharris simplegame.js library accelerometer snippet

	  function Accel(){
		  //virtual accelerometer

		  //properties
		  var ax;
		  var ay;
		  var az;

		  var rotX;
		  var rotY;
		  var rotZ;

		  if (window.DeviceMotionEvent==undefined){
			  console.log("This program requires an accelerometer");
		  } else {
			window.ondevicemotion = function(event){
			  this.ax = event.accelerationIncludingGravity.x;
			  this.ay = event.accelerationIncludingGravity.y;
			  this.az = event.accelerationIncludingGravity.z;

			  rotation = event.rotationRate;
			  if (rotation != null){
				this.rotX = Math.round(rotation.alpha);
				this.rotY = Math.round(rotation.beta);
				this.rotZ = Math.round(rotation.gamma);
			  } // end if
			} // end event handler
		  } // end if

		  //return values with utility methods

		  this.getAX = function(){
			if (window.ax == null){
			  window.ax = 0;
			}
			return window.ax;
		  } // end getAx

		  this.getAY = function(){
			if (window.ay == null){
			  window.ay = 0;
			}
			return window.ay;
		  } // end getAx

		  this.getAZ = function(){
			if (window.az == null){
			  window.az = 0;
			}
			return window.az;
		  } // end getAx

		  this.getRotX = function(){return rotX;}
		  this.getRotY = function(){return rotY;}
		  this.getRotZ = function(){return rotZ;}

	} // end class def

	function createLevel(){

		playerX = currentLevel[0][0];
		playerY = currentLevel[0][1];

		Enemy = [];

		for(i=0; i<currentLevel[1].length; i+=2){
			newBullet(currentLevel[1][i],currentLevel[1][i+1],Enemy.length);
			Enemy.push(currentLevel[1][i],currentLevel[1][i+1]);
			enemiesFiring.push(1,"placeholder");

		}


		for(b=0; b<currentLevel[2].length; b+=4){
			createBoundaries(currentLevel[2][b],currentLevel[2][b+1],currentLevel[2][b+2],currentLevel[2][b+3]);
		}

		coinX = currentLevel[3][0];
		coinY = currentLevel[3][1];

	}

	function endGame() {




		var scores = JSON.parse(localStorage.getItem('score')) || [];
		scores.push(score);
		scores.sort(function(a, b){return b-a});

		localStorage.setItem("score", JSON.stringify(scores));
		var highscores = localStorage.getItem("score");
		highscores = highscores.replace(/[[\]]/g,'')

		$("#score1").text(highscores.split(/,/)[0]);
		$("#score2").text(highscores.split(/,/)[1]);
		$("#score3").text(highscores.split(/,/)[2]);
		$("#score4").text(highscores.split(/,/)[3]);
		$("#score5").text(highscores.split(/,/)[4]);

    $("#canvas").hide();
    $("#score").text(score);

		var con = drawing.getContext("2d");
		con.clearRect(0, 0, drawing.width, drawing.height);
		bulletLoc.length = [];
		Enemy.length = [];
		bulletAngle = [];
		enemyAngle = [];
		playerBulletLoc = [];
		score = 0;


    $(".DeathScreen").show();

		clearInterval(start);
    }

	function quit(){

		clearInterval(start);
		window.location.reload(false);

	}


}); // end of $(document).ready()
