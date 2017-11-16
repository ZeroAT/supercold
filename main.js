/**************************************
 TITLE: main.js							
 AUTHOR: Jason Meno (JAM)			
 CREATE DATE: 20 October 2017
 PURPOSE: Provide jquery and javascript functionality to HTML5 SUPERCOLD Mobile Game
***************************************/

$(document).ready(function(){
	
	//initial conditions
	rectX = 5;
	rectY = 5;
	circX = rectX;
	circY = rectY;
	timescale = 1;
	timescaleRate = 0;
	clockTime = 0;
	dX = 0;
	dY = 0;
	xVal = 0;
	yVal = 0;
	maxAccel = 15;
	var bulletLoc = [];
	var bulletSlope = [];
	var Enemy = [];
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
	newCoin();
	
	var drawing = document.getElementById("background");
	displayrate = document.getElementById("rate");
	
	//set refresh rate
	displayrate.onclick = function(){ 
		offsetDY = accel.getAY();
        offsetDX = accel.getAX();
        start = setInterval(draw, 33);
		var clock = setInterval(clock, 100);
      };

	
	//assign keydown & keydown event handlers to page
	document.onkeydown = checkKeyDown;
	document.onkeyup = checkKeyUp;
	
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
		
		drawing.width+=0;
		var con = drawing.getContext("2d");
 		
 		newDX = accel.getAX();
        newDY = accel.getAY();
        
        //update position change with accelerometer data
		dY += (newDX-offsetDX);
		dX += (newDY-offsetDY);
        
        //depending on intensity of movement, time rate increases
        if(oldDX != newDX){
        	//timescaleRate += Math.abs(oldDX-newDX)*1.5;
        	timescaleRate += Math.abs(dY)/15;
        }
        
        if(oldDY != newDY){
        	//timescaleRate += Math.abs(oldDX-newDX)*1.5;
        	timescaleRate += Math.abs(dX)/15;
        }
        
        oldDX = newDX;
 		oldDY = newDY;
        
        output = "Score: " + score + "   //   Highscore: " + window.top.name;
		
		//output html text at the top of page
		displayrate.innerHTML = output;
		
		//check for max velocity
		if(dX > maxAccel){
			dX = maxAccel;
		}
		
		if(dY > maxAccel){
			dY = maxAccel;
		}
		
		//set change of position of player
		rectX += dX;
		rectY += dY;
		
		checkWall();
		
		//check for gold coin collision
		if(checkCoinCollision(rectX, rectY)){
			newCoin();
			score++;
			newEnemy();
		}
		
		updateBullet();
		
		checkBulletCollision();

		
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
		
		con.fillStyle = "black";
		con.fillRect(rectX,rectY,18,18);
		
		con.fillStyle = "gold"
		con.fillRect(coinX,coinY,10,10);
		con.fillStyle = "yellow";
		con.fillRect(coinX+2,coinY+2,6,6);
		
		
		for(i = 0; i <= Enemy.length-1; i+=2){
			
			con.fillStyle = "blue";
			con.fillRect(bulletLoc[i],bulletLoc[i+1],5,5);
			
			con.fillStyle = "red";
			con.fillRect(Enemy[i],Enemy[i+1],18,18);
			
		}
			
		if(checkEnemyCollision(rectX,rectY) || checkBulletHit(rectX,rectY)){
			if(score > window.top.name){
				window.top.name = score;
			}
			alert("Game over!");
			quit();
		}
			
	} // end draw    
	  
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
	  	
	  	//check for collisions
	  	if(checkCoinCollision(rectX,rectY)){
	  		newCoin()
	  	}

	  }//end newCoin()
	  
	  function newEnemy(){
	  	enemyX = Math.random() * (575);
	  	enemyY = Math.random() * (375);
	  	
	  	//check for collisions
	  	if(checkCoinCollision(enemyX, enemyY) || checkEnemyCollision(enemyX,enemyY)){
	  		newEnemy();
	  	}
	  	else{
	  	
	  		Enemy.push(enemyX,enemyY);
	  		newBullet(enemyX,enemyY,Enemy.length);
	  	}

	  }//end newEnemy()
	  
	  function newBullet(X,Y,loc){
	  
	  	bulletLoc.splice(loc,2,X,Y);
	  	bulletSlope.splice(loc,2,(rectX-X),(rectY-Y));
	  	
	  }//end newBullet()
	  
	  function checkCoinCollision(X,Y){
	  	
	  	if((coinX >= X && coinX <= X + 18) || (coinX +10 >= X && coinX + 10 <= X + 18)){
	  		if((coinY >= Y && coinY <= Y + 18) || (coinY +10 >= Y && coinY + 10 <= Y + 18)){
		  		return true;
		  	}
	  	}
	  	else {
	  		return false;
	  	}
	  	
	  }//end checkCoinCollision()
	  
	  function checkEnemyCollision(X,Y){
	  
	  	for (i = 0; i < Enemy.length; i+=2){
	  		console.log("Checking enemy: " + i);
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
	  		console.log("checking bullet: " + i);
		  	if((bulletLoc[i] >= X && bulletLoc[i] <= X + 18) || (bulletLoc[i] +3 >= X && bulletLoc[i] + 3 <= X + 18)){
		  		if((bulletLoc[i+1] >= Y && bulletLoc[i+1] <= Y + 18) || (bulletLoc[i+1] + 3 >= Y && bulletLoc[i+1] + 3 <= Y + 18)){
			  		return true;
			  	}
		  	}
	  	}
	  	
	  	return false;
	  }//end checkBulletHit()
	  
	  function checkWall(){
	  	
	  	if(rectX+18 >= 600){
	  		rectX = 582;
	  	}
	  	if(rectX <= 0){
	  		rectX = 1;
	  	}
	  	if(rectY+18 >= 400){
	  		rectY = 382;
	  	}
	  	if(rectY <= 0){
	  		rectY = 1;
	  	}
	  }//end checkWall()
	  	
	  function checkBulletCollision(){
	  	
	  	//if bullet hits wall, delete bullet and make new one
	  	for(i = 0; i <= bulletLoc.length-1; i+=2){
			
		  	if(bulletLoc[i] >= 600 || bulletLoc[i] <= 0 || bulletLoc[i+1] >= 600 || bulletLoc[i+1] <= 0){
		  		newBullet(Enemy[i],Enemy[i+1],i);
		  	}//end if
		  	
		 }//end for
	  	
	  }//end checkBulletCollision()
	  
	  function clock(){
	  	
	  	clockTime += timescaleRate;	  
	  	clockTime = clockTime % 361;
	  
	  }
	  
	  function updateBullet(){
	  	//use timescale to determine next location of bullets on slope of bullet trace rays
	  	for(i = 0; i <= bulletLoc.length-1; i+=2){
	  	
		  	bulletLoc[i] += (bulletSlope[i]/300)*timescaleRate;
	  		bulletLoc[i+1] += (bulletSlope[i+1]/300)*timescaleRate;
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
	
	function quit(){
		
		clearInterval(start);
		window.location.reload(false);
			
	}
			  	
	
}); // end of $(document).ready()
