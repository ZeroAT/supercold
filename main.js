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
var nodeArray = [];
var nodeNeighbors = [];
var	node2node = [];
var node2nodePositions = [];
var nodeBounds = [];
var playerPath;
var playerX;
var playerY;
var nodeArrayLength;
var currentLevel = [[],[],[],[]];
var numberOfLevels = 5;
var showNodePath = false;
var showNodes = false;
var showEnemyPath = false;
var campaignMode = false;
var followPath = [];
var winningEdge = [];
var survivalMode = [[225,200],[],[],[20,20]];
var level1 = [[5,5],[550,20,100,375],[50,50,100,100,200,50,100,100,350,50,100,100,50,200,100,100,200,200,100,100,350,200,100,100],[550,370]];
var level2 = [[5,5],[300,300,50,250],[420,200,100,100,100,100,25,25,400,350,25,25,400,60,50,50,125,175,25,25,150,225,25,25],[550,350]];
var level3 = [[5,5],[50,300,550,375],[470,275,100,100,470,150,100,100,330,150,100,100,330,275,100,100,60,150,209,50,60,150,209,50,425,50,50,50,100,60,50,50,60,160,100,100 ],[550,375]];
var level4 = [[300,350],[80,50,120,50,160,50, 200,50, 240,50,280,50,320,50,360,50,410,50,450,50,490,50], [50,200,500,20],[300,20]];
var level5 = [[275,375],[175,45,175,95,175,135,175,175,175,225,175,265,175,305,175,345,375,45,375,95,375,135,375,175,375,225,375,265,375,305,375,345],[],[275,5]]
//for testing levels
//survivalMode = level6;
//survivalMode = [[5,5],[550,345],[250,150,100,100],[500,200]];


$(document).ready(function(){

	$(".SurvivalButton").click(function () {
		$(".MainMenu").hide();
    $(".DeathScreen").hide();
		$(".CreditScreen").hide();
		$(".HighScoresScreen").hide();
    $("#canvas").show();
		campaignMode = false;
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
			if (winCount == 1){
				currentLevel = level1;
				currentLevelCheck = 1;
			}
			else if(winCount == 2){
				currentLevel = level2;
				currentLevelCheck = 2;

			}
			else if(winCount == 3){
				currentLevel = level3;
				currentLevelCheck = 3;
			}
			else if(winCount ==4){
				currentLevel = level4;
				currentLevelCheck = 4;
			}
			else if(winCount ==5){
				currentLevel = level5;
				currentLevelCheck = 5;
			}

			else{
				currentLevel = level1
				winCount = 1;
				currentLevelCheck = 1;
			}
			campaignMode = true;
			reset();
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
				if(localStorage.getItem("score") === null){
					$(".HighScoresScreen").show();
				}else{
					var highscores = localStorage.getItem("score");
					highscores = highscores.replace(/[[\]]/g,'')
					console.log(highscores);
					$("#score6").text(highscores.split(/,/)[0]);
					$("#score7").text(highscores.split(/,/)[1]);
					$("#score8").text(highscores.split(/,/)[2]);
					$("#score9").text(highscores.split(/,/)[3]);
					$("#score10").text(highscores.split(/,/)[4]);
					$(".HighScoresScreen").show();

				}




	});
	$(".CreditButton").click(function () {
		$(".MainMenu").hide();
        $(".DeathScreen").hide();
        $("#canvas").hide();
				$(".HighScoresScreen").hide();
		$(".CreditScreen").show();

	});

	$(".ReturnButton").click(function () {
		$(".CampaignButton").show();
		$(".SurvivalButton").show();
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
	accelDY = 0;
	accelDX = 0;
	//xVal = 0;
	//yVal = 0;
	maxAccel = 15;
	firstPathCheck = true;
	updateCounter = -1;




	//currentLevel uses the following variables
	//[[playerStartX, playerStartY],[enemy1X,enemy1Y....enemyNX,enemyNY], [bounds1StartX, bounds1StartY, bounds1Width, bounds1Height,....boundsN][coinStartX, coinStartY]]
	//currentLevel = [[5,5],[],[50,50,100,100,200,50,100,100,50,200,100,100,200,200,100,100],[25,25]];
	//currentLevel = [[5,5],[],[],[400,50]];


	//bounds = createBoundaries(220-18,200-18,100+18,100+18);


	var coinX, coinY, enemyX, enemyY;
	var changeDY, changeDX;
	var offsetDX, offsetDY;
	var mouseDownBool;
	//var movement = setInterval(setMovement,100);
	var accel = new Accel();
	var oldDY = 0;
	var oldDX = 0;
	var start;
	var score = 0;
	var mouseX, mouseY;
	var bulletAngle = [];
	//var enemyAngle = [];
	var winCount = 1;
  var currentLevelCheck = 1;
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
		    //changeDY = setInterval(setYRate(-1),33);
				accelDY = -0.5;
		    //timescaleRate += 1;
		}
		else if (e.keyCode == '40') {
		    //changeDY = setInterval(setYRate(1),33);
				accelDY = 0.5;
		    //timescaleRate += 1;
		}
		else if (e.keyCode == '37') {
		    //changeDX = setInterval(setXRate(-1),33);
				accelDX = -0.5;
		    //timescaleRate += 1;
		}
		else if (e.keyCode == '39') {
		   //changeDX = setInterval(setXRate(1),33);
				accelDX = 0.5;
		    //timescaleRate += 1;
		}
		else if(e.keyCode == '78'){
			showNodePath = !showNodePath;
		}
		else if(e.keyCode == '77'){
			showNodes = !showNodes;
		}
		else if(e.keyCode == '80'){
			showEnemyPath = !showEnemyPath;
		}

	}

	function checkKeyUp(e) {

		//pre IE9 window condition check
		e = e || window.event;

		if (e.keyCode == '38') {
		    //clearInterval(changeDY);
				accelDY = 0;
		    //timescaleRate += 1;
		}
		else if (e.keyCode == '40') {
		    //clearInterval(changeDY);
				accelDY = 0;
		    //timescaleRate += 1;
		}
		else if (e.keyCode == '37') {
		    //clearInterval(changeDX);
				accelDX = 0;
		    //timescaleRate += 1;
		}
		else if (e.keyCode == '39') {
		    //clearInterval(changeDX);
				accelDX = 0;
		    //timescaleRate += 1;
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

/*
		//check for max velocity
		if(dX > maxAccel){
			dX = maxAccel;
		}

		if(dY > maxAccel){
			dY = maxAccel;
		}
*/
		if(accelDX != 0){
			dX += accelDX;
			timescaleRate+=0.75;
		}

		if(accelDY != 0){
			dY += accelDY;
			timescaleRate+=0.75;
		}

		//console.log("dX: " +dX);
		//console.log("dY: " +dY);

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
				winCount += 1
				score++;
				endGame();
			}
			score++;
			newEnemy();
		}
		if(playerBulletLoc.length > 0){
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

		if(showNodePath){

			con.strokeStyle = "rgba(0,0,255,0.25)";
			con.lineWidth = 3;
			//console.log("Displaying Node Path");

			//console.log()

			for(f=0; f<nodeArrayLength; f+=1){
				for(g=0;g<nodeArrayLength; g+=1){
					if(nodeNeighbors[(f*nodeArrayLength+g)] != 999 ){
						con.beginPath();
						con.moveTo(nodeArray[f][0], nodeArray[f][1]);
						//console.log("Move from: " + nodeArray[f] + " to " + node2nodePositions[(f+1)*g+f] + "(node2nodePositions[" + ((f+1)*g+f) + "])");
						con.lineTo(nodeArray[g][0],nodeArray[g][1]);
						con.stroke();

					}

				}
			}
		}

		if(showNodes){
			for(f=0; f<nodeArrayLength; f+=1){
				con.fillStyle = "blue";
				con.fillRect(nodeArray[f][0],nodeArray[f][1],5,5);
			}
		}

		con.strokeStyle = "rgba(255,0,0,0.75)";
		con.lineWidth = 3;
		if(showEnemyPath){

			for(f = 0; f <= Enemy.length-1; f+=2){
				con.beginPath();
				con.moveTo(Enemy[f],Enemy[f+1]);

				if(followPath.length>0){

					for(g=0; g<followPath[f].length; g+=1){
						//console.log("On Path Element: " + g);
						//console.log("Move from: " + nodeArray[f] + " to " + node2nodePositions[(f+1)*g+f] + "(node2nodePositions[" + ((f+1)*g+f) + "])");
						//console.log("Drawing Line to: X: " + nodeArray[followPath[f][g]][0] + " Y: " + nodeArray[followPath[f][g]][1]);
						con.lineTo(nodeArray[followPath[f][g]][0],nodeArray[followPath[f][g]][1]);
					}
				}

				con.lineTo(playerX,playerY);
				con.stroke();
			}
		}

		//con.fillStyle = "red";
		//con.fillRect(Bounds[collisionPoint],Bounds[collisionPoint+1],5,5);

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

	 // function setMovement() {

	  	//dX += xVal;
	  	//dY += yVal;
	  //}

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

			//check enemy collision with boundaries
		for(b=0; b<=currentLevel[2].length; b+=4){
			for(c=0; c<=Enemy.length; c+=2){
				if(Enemy[c]+18 >= currentLevel[2][b] && Enemy[c] <= currentLevel[2][b]+currentLevel[2][b+2] && Enemy[c+1]+18 >= currentLevel[2][b+1] && Enemy[c+1] <= currentLevel[2][b+1]+currentLevel[2][b+3]){
					//console.log("ENEMY " + i + " HITTING BOUNDARY");
					if(Enemy[c]-3 < currentLevel[2][b] && Enemy[c+1]+15 >= currentLevel[2][b+1] && Enemy[c+1]+3 < currentLevel[2][b+1]+currentLevel[2][b+3]){
						Enemy[c] = currentLevel[2][b]-18;
					}
					if(Enemy[c]+15 > currentLevel[2][b]+currentLevel[2][b+2] && Enemy[c+1]+15 > currentLevel[2][b+1] && Enemy[c+1]+3 < currentLevel[2][b+1]+currentLevel[2][b+3]){
						Enemy[c] = currentLevel[2][b]+currentLevel[2][b+2];
					}
					if(Enemy[c+1]-3 < currentLevel[2][b+1] && Enemy[c]+15 > currentLevel[2][b] && Enemy[c]+3 < currentLevel[2][b]+currentLevel[2][b+2]){
						Enemy[c+1] = currentLevel[2][b+1]-18;
					}
					if(Enemy[c+1]+15 > currentLevel[2][b+1]+currentLevel[2][b+3] && Enemy[c]+15 > currentLevel[2][b] && Enemy[c]+3 < currentLevel[2][b]+currentLevel[2][b+2]){
						Enemy[c+1] = currentLevel[2][b+1]+currentLevel[2][b+3];
					}
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


							path = enemyPath(Enemy[i]+9, Enemy[i+1]+9, playerX, playerY);
							plength = path.length;
							boundsLength = Bounds.length;
							collisionPoint = pathObsticalCollisionCheck(path,plength);
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

			updateCounter += 1;

			//use timescale to determine next location of enemies on slope of enemy trace rays
			for(i = 0; i <= Enemy.length-1; i+=2){
				//console.log("Time: " + updateCounter);
				//check enemy's path every interval
				//if(updateCounter%33 == 0){

					path = enemyPath(Enemy[i]+9, Enemy[i+1]+9, playerX, playerY);
					plength = path.length;
					boundsLength = Bounds.length;
					collisionPoint = pathObsticalCollisionCheck(path, plength);
					//updateCounter = 1;

				//}
					if(playerX<Enemy[i]){
						enemyAngle.splice(i,2,Math.atan((playerY-Enemy[i+1])/(playerX-Enemy[i]))+Math.PI,0);
					}
					else{
						enemyAngle.splice(i,2,Math.atan((playerY-Enemy[i+1])/(playerX-Enemy[i])),0);
					}

					if(collisionPoint){

						//if(updateCounter%33 == 0){
							//updateCounter = 1;

							playerPath = sightPath(playerX, playerY, Enemy[i], Enemy[i+1]);
							plength = playerPath.length;
							boundsLength = Bounds.length;
							playerCollision = pathObsticalCollisionCheck(playerPath, plength);

							enemyNode = findNode(collisionPoint, Enemy[i],Enemy[i+1]);
							playerNode = findNode(playerCollision, playerX, playerY);

							//console.log("Enemy Node: " + enemyNode);
							//console.log("Player Node: " + playerNode);
							//console.log("Enemy CollisionPoint: " + Bounds[collisionPoint] + " " + Bounds[collisionPoint+1]);
							//console.log("Player CollisionPoint: " + Bounds[playerCollision] + " " + Bounds[playerCollision+1]);
							followPath.splice(i,2,shortestPath(enemyNode,playerNode),0);
							//console.log("shortestPath Result: " + followPath);



							//winningEdge = nearestEdge(collisionPoint, playerX, playerY, true);
							winningEdge = nodeArray[enemyNode];

							//winningEdge = nodeArray[followPath[i][0]];
						//}
						//if(Math.abs(winningEdge[0] - Math.round(Enemy[i]))<5 && Math.abs(winningEdge[1] - Math.round(Enemy[i+1]))<5){
						//	winningEdge = nodeArray[followPath[1]];
							//console.log("Node reached!");
						//}

						if(winningEdge[0]<Enemy[i]){
							enemyAngle.splice(i,2,Math.atan((winningEdge[1]-Enemy[i+1])/(winningEdge[0]-Enemy[i]))+Math.PI,0);
						}
						else{
							enemyAngle.splice(i,2,Math.atan((winningEdge[1]-Enemy[i+1])/(winningEdge[0]-Enemy[i])),0);
						}


						//collisionPoint = false;

					}
					else{
						collisionPoint = false;
						followPath[i] = [];
					}
				//}// timed if statement

				//console.log("Enemy Angle: " + enemyAngle[0]*180/Math.PI);
				//console.log("Update Enemy[" + i + "]");
					Enemy[i] += (Math.cos(enemyAngle[i]))*timescaleRate/4;
					Enemy[i+1] += (Math.sin(enemyAngle[i]))*timescaleRate/4;

			}//end for loop

		} //end update Enemy

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

			boundsLength = Bounds.length;

			startX = startX -19;
			startY = startY -19;
			width = width +20;
			height = height+20;

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

			startX = startX -20;
			startY = startY -20;
			width = width+40;
			height = height+40;

			nodeBounds = [];

			//create Enemy Bounds
			nodeBounds.push(999,999);
			for(i=0; i<=width; i+=1){
				nodeBounds.push(startX+i,startY);
			}
			nodeBounds.push(999,999);
			for(i=0; i<=width; i+=1){
				nodeBounds.push(startX+i,startY+height);
			}
			nodeBounds.push(999,999);
			for(i=0; i<=height; i+=1){
				nodeBounds.push(startX+width,startY+i);
			}
			nodeBounds.push(999,999);
			for(i=0; i<=height; i+=1){
				nodeBounds.push(startX,startY+i);
			}
			nodeBounds.push(999,999);
			//return node Boundaries;
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

		function pathObsticalCollisionCheck(pathArray, plength){

		  //console.log("*Bounds Array Length: " + boundsArray.length);
		  //console.log("*Path Array Length: " + pathArray.length);

		  for(r=0; r<=plength;r+=2){
		    for(s=0; s<=boundsLength;s+=2){

		      if(Math.round(pathArray[r]) == Bounds[s] && Math.round(pathArray[r+1]) == Bounds[s+1]){

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
		nodeArray = [];
		nodeNeighbors = [];
		node2node = [];
		node2nodePositions = [];
		nodeBounds = [];

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

		createNodes();
		populateNodeNeighbors();

	}

//returns direct vector array from one X,Y position to another
function sightPath(startX, startY, endX, endY){
		length = Math.sqrt(Math.pow(startX-endX,2) + Math.pow(startY-endY,2));

	if(endX<startX){
			pathAngle = Math.atan((endY-startY)/(endX-startX))+Math.PI;
	}
	else{
		pathAngle = Math.atan((endY-startY)/(endX-startX));
	}
  pathArray = [startX,startY];

  for(j=0; j<=Math.floor(length)*2; j+=2){
    pathArray.push(pathArray[j]+Math.cos(pathAngle), pathArray[j+1] +Math.sin(pathAngle));
  }

	//enemyPathArray.splice(0,10);

  return pathArray;
}

function pathBoundsCollisionCheck(pathArray,boundsArray, plength, blength){

			  //console.log("*Bounds Array Length: " + boundsArray.length);
			  //console.log("*Path Array Length: " + pathArray.length);

		for(r=0; r<=plength;r+=2){
			for(s=0; s<=blength;s+=2){

			    if(Math.round(pathArray[r]) == boundsArray[s] && Math.round(pathArray[r+1]) == boundsArray[s+1]){

			        return s;

			     }

			   }

			}

			return false;

}

function createNodes(){
	console.log("Current Level: " + currentLevel);
	nodeArray = [];
	nodeNeighbors = [];

	  for(i=0;i<currentLevel[2].length;i+=4){

			nodeX = currentLevel[2][i]-19;
			nodeY = currentLevel[2][i+1]-19;

			//do not added nodes to array if nodes are off of canvas (600x400 currently)
			if(nodeX < 600 && nodeX > 0 && nodeY < 400 && nodeY > 0){
				nodeArray.push([nodeX,nodeY]);
			}

			nodeX = currentLevel[2][i]+currentLevel[2][i+2]+1;
			nodeY = currentLevel[2][i+1]-19;

			if(nodeX < 600 && nodeX > 0 && nodeY < 400 && nodeY > 0){
				nodeArray.push([nodeX,nodeY]);
			}

			nodeX = currentLevel[2][i]-19;
			nodeY = currentLevel[2][i+1]+currentLevel[2][i+3]+1;

			if(nodeX < 600 && nodeX > 0 && nodeY < 400 && nodeY > 0){
				nodeArray.push([nodeX,nodeY]);
			}

			nodeX = currentLevel[2][i]+currentLevel[2][i+2]+1;
			nodeY = currentLevel[2][i+1]+currentLevel[2][i+3]+1;

			if(nodeX < 600 && nodeX > 0 && nodeY < 400 && nodeY > 0){
				nodeArray.push([nodeX,nodeY]);
			}

	  }

		nodeArrayLength = nodeArray.length;

	  for(m=0; m<nodeArrayLength; m+=1){
	    for(n=0; n<nodeArrayLength; n+=1){
	      path = sightPath(nodeArray[m][0],nodeArray[m][1],nodeArray[n][0],nodeArray[n][1]);
				plength = path.length;
	      collisionPoint = pathBoundsCollisionCheck(path,Bounds,plength,boundsLength);

	      if(collisionPoint){
	        nodeNeighbors.push(999);
	      }
	      else{
	        length = Math.sqrt(Math.pow(nodeArray[m][0]-nodeArray[n][0],2) + Math.pow(nodeArray[m][1]-nodeArray[n][1],2));

	        //do not count node as neighbor to itself (length == 0)
	        if(length > 0){
	          nodeNeighbors.push(length);
	          console.log("Node " + m + " is neighbors with Node " + n);
	        }
	        else{
	          nodeNeighbors.push(999);
	        }
	      }
	    }
	  }
	}

//find nearest node FROM ENEMY TO PLAYER

function findNode(index, enemyX, enemyY){

	node1 = -1;
	node2 = -1
	node1Position = -1;
	node2Position = -1;
	node1length = 999;
	node2length = 999;

	//find 2 nodes closest to Boundary collisionPoint
	for(p=0; p<nodeArrayLength; p+=1){
		length = Math.sqrt(Math.pow(nodeArray[p][0]-Bounds[index],2) + Math.pow(nodeArray[p][1]-Bounds[index+1],2));

		//console.log("Length to Node " + p + ": " + length);

		if(length<=node1length && length>10){
			//console.log("Distance to node " + p + " : " + length);
			//move data forward
			node2 = node1;
			node2Position = node1Position;
			node2length = node1length;

			node1 = nodeArray[p];
			node1Position = p;
			node1length = length;
		}
		else if(length<=node2length && length > 10){
			node2 = nodeArray[p]
			node2Position = p;
			node2length = length;
		}

	}

	//choose node closest to goal
	node1Distance = Math.sqrt(Math.pow(node1[0]-playerX,2) + Math.pow(node1[1]-playerY,2));
	node1Distance += Math.sqrt(Math.pow(node1[0]-enemyX,2) + Math.pow(node1[1]-enemyY,2));
	//console.log("Edge1 Length: " + edge1Length);
	 node2Distance = Math.sqrt(Math.pow(node2[0]-playerX,2) + Math.pow(node2[1]-playerY,2));
	 node2Distance += Math.sqrt(Math.pow(node2[0]-enemyX,2) + Math.pow(node2[1]-enemyY,2));
	//console.log("Edge2 Length: " + edge2Length);
	//console.log("Compare Node: " + node1Position + " with length " + node1Distance);
	//console.log("Compare Node: " + node2Position + " with length " + node2Distance);
	if(node1Distance<=node2Distance){
		 //console.log("node1 wins: " + node1Distance)
		 return node1Position;
	}
	else{
		//console.log("node2 wins: " + node2Distance)
		return node2Position;
	}

}

//finds nearest node BETWEEN NODES
function nearestNode(index,startNode,endNode){

  minDistance = 999;
  node1 = -1;
  node2 = -1
  node1Position = -1;
  node2Position = -1;
	node1length = 999;
	node2length = 999;

  //find 2 nodes closest to Boundary collisionPoint
  for(p=0; p<nodeArrayLength; p+=1){
    length = Math.sqrt(Math.pow(nodeArray[p][0]-Bounds[index],2) + Math.pow(nodeArray[p][1]-Bounds[index+1],2));

			if(length<node1length && p != startNode){
				//console.log("Distance to node " + p + " : " + length);
				//move data forward
				node2 = node1;
				node2Position = node1Position;
				node2length = node1length;

				node1 = nodeArray[p];
				node1Position = p;
				node1length = length;

				//console.log("CHECKPOINT: Node1: " + node1Position + " / " + node1length)
				//console.log("CHECKPOINT: Node2: " + node2Position + " / " + node2length)
			}
			else if(length<node2length && p != startNode){
				node2 = nodeArray[p]
				node2Position = p;
				node2length = length;
				//console.log("CHECKPOINT2: Node1: " + node1Position + " / " + node1length)
				//console.log("CHECKPOINT2: Node2: " + node2Position + " / " + node2length)

			}
		}

  //choose node closest to goal
  node1Distance = Math.sqrt(Math.pow(node1[0]-nodeArray[endNode][0],2) + Math.pow(node1[1]-nodeArray[endNode][1],2));
	//console.log("Edge1 Length: " + edge1Length);
	node2Distance = Math.sqrt(Math.pow(node2[0]-nodeArray[endNode][0],2) + Math.pow(node2[1]-nodeArray[endNode][1],2));
	//console.log("Edge2 Length: " + edge2Length);

	//console.log("Compare Node: " + node1Position + " with length " + node1Distance);
	//console.log("Compare Node: " + node2Position + " with length " + node2Distance);
	if(node1Distance<=node2Distance){
	   //console.log("node1 wins: " + node1Distance)
	   return node1Position;
	}
	else{
	  //console.log("node2 wins: " + node2Distance)
    return node2Position;
	}

}

function shortestPath(startNode, endNode){

  path = [];
  findNextNode = true;

  path.push(startNode);

  while(findNextNode){
    if(node2node[(startNode)*(nodeArrayLength)+endNode] == 0){

      path.push(endNode);
      findNextNode = false;
    }
    else{
      path.push(node2node[(startNode)*(nodeArrayLength)+endNode]);
      startNode = node2node[(startNode)*(nodeArrayLength)+endNode];
	  //console.log("Getting Next Node From: " + node2node[(startNode+1)*endNode+startNode]);
    }
  }

  return path;

}

function populateNodeNeighbors(){
	node2node = [];
  for(x=0; x<nodeArrayLength; x+=1){
    for(y=0; y<nodeArrayLength; y+=1){
      startNode = x;
      finalNode = y;

      path = sightPath(nodeArray[startNode][0],nodeArray[startNode][1],nodeArray[finalNode][0],nodeArray[finalNode][1]);
			plength = path.length;
			collisionPoint = pathBoundsCollisionCheck(path,Bounds,plength,boundsLength);
      if(collisionPoint){
        //collisionPoint = pathBoundsCollisionCheck(path,nodeBounds);
        winningNode = nearestNode(collisionPoint,startNode,finalNode);
        node2node.push(winningNode);
				//node2nodePositions.push(nodeArray[winningNode]);
        //console.log("Node " + startNode + " to Node " + finalNode + " : " + winningNode);
      }
      else{
        node2node.push(0);
				//node2nodePositions.push(0);
        //console.log("Node " + startNode + " to Node " + finalNode + " : No collision");
      }
    }
  }
}


	function endGame() {


		if(campaignMode){

			console.log("CAMPAIGN MODE");
			if(currentLevelCheck == winCount){
				$("#header").text("You have lost...");

			}else if((currentLevelCheck != winCount) && (currentLevelCheck == numberOfLevels)){
				$("#header").text("VICTORY! You have completed all " + numberOfLevels +  " levels of the campaign mode.");
			}else{
				$("#header").text("You have completed Level " + currentLevelCheck);

			}
			$(".SurvivalButton").hide();
			$('.CampaignButton').show();
			$(".ReturnButton").show();
		}else{
			$(".SurvivalButton").show();
			$('.CampaignButton').hide()
			console.log("Survival Mode");
			$("#header").text("Game Over");
			$("#score").text("Your score was: " + score);
			$("#highscores").text("High Scores:");
			var scores = JSON.parse(localStorage.getItem('score')) || [];
			scores.push(score);
			scores.sort(function(a, b){return b-a});

			localStorage.setItem("score", JSON.stringify(scores));
			var highscores = localStorage.getItem("score");
			highscores = highscores.replace(/[[\]]/g,'');

			for(var z = 0; z <= 5; z++){
				var addZ = z + 1;
				if(highscores.split(/,/)[z] == null){
					if(z==0){
						$("#score" + z).text("1) " + "N/A");
					}else if(z != 0){
						$("#score" + z).text(addZ + ") " + "N/A");
					}
				}else{
					if(z==0){
						$("#score" + z).text("1) " + highscores.split(/,/)[z]);
					}else if(z != 0){
						//console.log("z!=0");
						$("#score" + z).text( addZ + ") " + highscores.split(/,/)[z]);
						}
					}
				}
		}


    $("#canvas").hide();

		var con = drawing.getContext("2d");
		con.clearRect(0, 0, drawing.width, drawing.height);
		bulletLoc.length = [];
		Enemy.length = [];
		bulletAngle = [];
		enemyAngle = [];
		playerBulletLoc = [];
		score = 0;
		Enemy = [];
		nodeArray = [];
		nodeNeighbors = [];
		node2node = [];
		node2nodePositions = [];
		nodeBounds = [];



    $(".DeathScreen").show();
			clearInterval(start);
    }

	function quit(){

		clearInterval(start);
		window.location.reload(false);

	}

	function reset(){
		//reset all game variables
		 bulletLoc = [];
		 playerBullet = [];
		 playerBulletLoc = [];
		 Enemy = [];
		 bulletAngle = [];
		 enemyAngle = [];
		 playerBulletAngle = [];
		 playerAngle= [];
		 Bounds = [];
		 EnemyBounds = [];
		 enemyBulletTrace = [];
		 enemiesFiring = [];
		 followPath = [];
		 winningEdge = [];
		 nodeArray = [];
		 nodeNeighbors = [];
		 node2node = [];
		 playerPath = [];
		 node2nodePositions = [];
		 nodeBounds = [];
		 showNodePath = false;
		 showNodes = false;
		 showEnemyPath = false;
		 dX = 0;
	 	 dY = 0;
	 	 accelDY = 0;
	 	 accelDX = 0;

	}


}); // end of $(document).ready()
