var charspeed = 1,
		maxspeed = 4,
		drag = 0.9;

var charpos = new Point( window.innerWidth/2, window.innerHeight/2),
    movevector = new Point(0,0),
		speedvector = new Point(0, 0),
		lastAngle = 0,
    charAngle = 0,
    stepbool = true; //true is left foot

var explosionArray = [],
    maxArraylength = 40,
    leftPos = new Point(charpos.x-20,charpos.y),
    rightPos = new Point(charpos.x+20,charpos.y),
		leftFoot = new Path.Circle(new Point(charpos.x-20,charpos.y), 5),
    rightFoot = new Path.Circle(new Point(charpos.x+20,charpos.y), 5);

// controller vars
var upPressed = 0,
    downPressed = 0,
    leftPressed = 0,
    rightPressed = 0;

document.onkeydown = keydown;
document.onkeyup = keyup;

function keyup(e){
  e = e || window.event;
  checkKey(e,0);
}

function keydown(e){
  e = e || window.event;
  checkKey(e,1);
}

function setMovevector(){
  movevector.length = 0;
  movevector.y += -1 * upPressed;
  movevector.y += 1 * downPressed;
  movevector.x += -1 * leftPressed;
  movevector.x += 1 * rightPressed;
}

function checkKey(e,keydown){
  if (e.keyCode == '38') {
    upPressed = keydown;
    // up arrow
  }
  if (e.keyCode == '40') {
    downPressed = keydown;
    // down arrow
  }
  if (e.keyCode == '37') {
    leftPressed = keydown;
   // left arrow
  }
  if (e.keyCode == '39') {
    rightPressed = keydown;
   // right arrow
  }
  setMovevector();
}

function speedqualizervector(){
	_movevector = new Point(movevector.x, movevector.y);
	_movevector.normalize();
	speedvector += (_movevector*charspeed);
	//checks if the player moves faster than the maximum speed
	if( speedvector.length > maxspeed){
		speedvector.length = maxspeed;
	}
	//if the player is not moving, the character should stop
	if(!speedvector.isZero()){
		if(movevector.x==0) speedvector.x *= drag;
		if(movevector.y==0) speedvector.y *= drag;
	}
    charAngle = speedvector.angle - 90;
}

function init(){
  path = new Path();
  path.add(charpos);
  path.strokeColor = 'black';
	leftFoot.fillColor = 'black';
	rightFoot.fillColor = 'black';
}

function fireWorked(){ //functie die arrows naar het midden van het scherm gaat knallen vanaf de rand
	var arrowsize = new Size(4,5);
	var arrowpoint
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function particleBurst(){
	var explosionPoint = new Point(getRandomInt(0, window.innerWidth), getRandomInt(0, window.innerHeight));
	var particleN = 80; //Number of particles per explosion (test this part)
	var particles = [];
	var directions = [];
	for(var i = 0; i<particleN;  i++){
		particles.push(new Shape.Circle(explosionPoint, 5));
		var speed = getRandomInt(500,1000);
		var angle = Math.random()*Math.PI*2;
		directions[i] = new Point (Math.cos(angle)*speed , Math.sin(angle)* speed)
	}
	var BoomShakalaka = new Group(particles);
	BoomShakalaka.strokeColor = 'black';
	BoomShakalaka.data.origin = explosionPoint;
	BoomShakalaka.data.directions = directions;
	BoomShakalaka.data.lifespan = 100;
	explosionArray.push(BoomShakalaka);
}

function particleBois(){
	for(var i = 0; i<explosionArray.length;  i++){
		var curExplosion = explosionArray[i];
		var originPoint = curExplosion.data.origin;
		for(var j = 0; j<curExplosion.children.length; j++){
			var curParticle = curExplosion.children[j];
			var vector = curExplosion.data.directions[j];
			curParticle.position += (vector * curExplosion.data.lifespan) / 10000;
			//curParticle.position.x = curParticle.position.x + curExplosion.data.lifespan;
		}
		curExplosion.data.lifespan--;
		if(curExplosion.data.lifespan < 10){
			explosionArray.shift().remove();
		}
	}
}

function legReworked(){
  _charAngle = charAngle - lastAngle;
  leftPos = leftPos + speedvector;
  rightPos = rightPos + speedvector;
  leftPos = leftPos.rotate(_charAngle,charpos);
  rightPos = rightPos.rotate(_charAngle,charpos);

  legspeed = 0.95;
  if(stepbool){
    leftFoot.position = leftFoot.position * legspeed + leftPos * (1 - legspeed);
  } else {
    rightFoot.position = rightFoot.position * legspeed + rightPos * (1 - legspeed);
  }
}

function optimization(){
  if(path.segments.length%maxArraylength==0){
    path.simplify(0.1);
  }
}

function onFrame(event){
  if (event.count % 25 == 0){
    stepbool = !stepbool;
		particleBurst();
	}
  speedqualizervector();
  charpos += speedvector;
  legReworked();
  optimization();
	particleBois();
	lastAngle = charAngle;
}

init();
