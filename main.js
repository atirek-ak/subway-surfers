var cubeRotation = 0.0;

var c = [],fence1 = [];
const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const texture = loadTexture(gl, 'track.png');
  const texture2 = loadTexture(gl, 'fence.jpg');
  const texturetrafficlight = loadTexture(gl, 'trafficlight.png');
  const texturetrafficlightstand = loadTexture(gl, 'black.png');
  const textureobstacle1 = loadTexture(gl, 'shaggy.jpg');
  const textureobstacle2 = loadTexture(gl, 'peel.jpg');
  const texturecoins = loadTexture(gl, 'pizza.jpg');
  const texturejetpack = loadTexture(gl, 'nimbus.jpeg');
  const texturespeedpower = loadTexture(gl, 'speed.jpg');
  const textureboots = loadTexture(gl, 'boots.jpg');

  //player
  const texturehead = loadTexture(gl, 'black.png');
  const texturejeans = loadTexture(gl, 'blue.jpg');
  const texturehands = loadTexture(gl, 'hands.jpg');
  const texturebody = loadTexture(gl, 'red.jpg');

  //chaser
  const textureiiit = loadTexture(gl, 'iiit.png');
  const texturedog = loadTexture(gl, 'brown.jpg');
 var cameralookat = [0, 0, 0], cameraz = 9, cameray=2.5, gray=0, flash=0.5, tomove=0, speed=0.12, policetime=8,time=0, score=0, jetpacktime=0, jetpackflag=0, bootstime=0, speedpowertime=0; 
main();

//
// Start here
//

//var c1;

function main() {


  document.getElementById('music').play();

  var i;
  for(i=0;i<20;i++){
	  c[i] = new cube(gl, [0, 0.0, -2*i + 6.0]);
	  fence1[i] = new fence(gl, [0, 0.0, -2*i + 6.0]);
  }

  	//trafficlights	
  	trafficlight[0] = new trafficlight(gl, [1.0, 0.0, -3.0]);
  	trafficlightstand[0] = new trafficlightstand(gl, [1.0, 0.0, -3.0]);
  	trafficlight[1] = new trafficlight(gl, [-1.0, 0.0, -20.0]);
  	trafficlightstand[1] = new trafficlightstand(gl, [-1.0, 0.0, -20.0]);

  	//coins
  	coins[0] = new coins(gl, [-2, 0, -30.0]);
  	coins[1] = new coins(gl, [-2, 0, -36.0]);
  	coins[2] = new coins(gl, [-2, 0, -42.0]);
  	coins[3] = new coins(gl, [-2, 0, -48.0]);
  	coins[4] = new coins(gl, [2, 0, -10.0]);
  	coins[5] = new coins(gl, [2, 0, -16.0]);
  	coins[6] = new coins(gl, [2, 0, -22.0]);
  	coins[7] = new coins(gl, [2, 0, -28.0]);
  	coins[8] = new coins(gl, [0, 5, -30.0]);
  	coins[9] = new coins(gl, [0, 5, -36.0]);
  	coins[10] = new coins(gl, [0, 5, -42.0]);
  	coins[11] = new coins(gl, [0, 5, -48.0]);


  	jetpack = new jetpack(gl, [0, 0, -24.0]);
  	speedpower = new speedpower(gl, [2, 0, -44.0]);
  	boots = new boots(gl, [-2,0,-40]);

  	obstacle1[0] = new obstacle1(gl, [2.0, 0.0, -50.0]);
  	obstacle2[0] = new obstacle2(gl, [-2.0, 0.0, -105.0]);
  	obstacle1[1] = new obstacle1(gl, [-2.0, 0.0, -70.0]);
  	obstacle2[1] = new obstacle2(gl, [0.0, 0.0, -35.0]);
  	obstacle1[2] = new obstacle1(gl, [2.0, 0.0, -130.0]);
  	obstacle2[2] = new obstacle2(gl, [-2.0, 0.0, -135.0]);

  //player
  hands = new hands(gl, [0, 0.0, 3.0]);
  head = new head(gl, [0, 0.0, 3.0]);
  body = new body(gl, [0, 0.0, 3.0]);
  jeans = new jeans(gl, [0, 0.0, 3.0]);

  //chaser
  handschaser = new handschaser(gl, [0, 0.0, 4.9]);
  headchaser = new headchaser(gl, [0.0, 0.0, 4.9]);
  bodychaser = new bodychaser(gl, [0.0, 0.0, 4.9]);
  jeanschaser = new jeanschaser(gl, [0.0, 0.0, 4.9]);

  //dog
  doglegs = new doglegs(gl, [0, 0.0, 4.9]);
  doghead = new doghead(gl, [0.0, 0.0, 4.9]);
  dogbody = new dogbody(gl, [0.0, 0.0, 4.9]);
  //c1 = new cube(gl, [1.5, 0.0, -6.0]);
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;
  
  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform highp float uFlash;
  uniform int uLevel;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
    // Apply lighting effect
    highp vec3 ambientLight = vec3(0.3 + uFlash, 0.3 + uFlash, 0.3 + uFlash);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0, -1, 1));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    if(uLevel==1 || uLevel==3)
      vLighting = ambientLight + (directionalLightColor * directional);
    else
      vLighting = vec3(1.0 + uFlash, 1.0 + uFlash, 1.0 + uFlash);
  }
  `;

  // Fragment shader program

  const fsSource = `
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;
  uniform bool uGray;
  uniform highp float uFlash;

  void main(void) {
    if(uGray)
    {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord).rgba;
      highp float grayScale = dot(texelColor.rgb, vec3(0.199, 0.587, 0.114));
      highp vec3 grayImage = vec3(grayScale+uFlash, grayScale+uFlash, grayScale+uFlash);
      gl_FragColor = vec4(grayImage * vLighting, texelColor.a);
    }
    else
    {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord).rgba;
      highp vec3 Image = vec3(texelColor.r + uFlash, texelColor.g + uFlash, texelColor.b + uFlash);
      gl_FragColor = vec4(Image * vLighting, texelColor.a);
    }

  }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    if(Math.floor(now)%2 === 0)
    {
    	flash=0.05;
    }

    drawScene(gl, programInfo, deltaTime);

    var GrayBuffer = gl.getUniformLocation(programInfo.program,"uGray");
    gl.uniform1i(GrayBuffer,gray);

	var FlashBuffer = gl.getUniformLocation(programInfo.program,"uFlash");
    gl.uniform1f(FlashBuffer,flash);
    if(flash>0)
    {
    	flash -= 0.01;
    }
    else
    {
    	flash=0;
    }

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, deltaTime) {
  gl.clearColor(0.0, 191.0, 255.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0, cameray, cameraz]);
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    var up = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, cameralookat, up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

    var i;
 	for(i=0;i<20;i++)
 	{
  		c[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime, texture);
  		fence1[i].drawFence(gl, viewProjectionMatrix, programInfo, deltaTime, texture2);
 	}
 	obstacle1[0].drawobstacle1(gl, viewProjectionMatrix, programInfo, deltaTime, textureobstacle1);
 	obstacle1[1].drawobstacle1(gl, viewProjectionMatrix, programInfo, deltaTime, textureobstacle1);
 	obstacle1[2].drawobstacle1(gl, viewProjectionMatrix, programInfo, deltaTime, textureobstacle1);
 	obstacle2[0].drawobstacle2(gl, viewProjectionMatrix, programInfo, deltaTime, textureobstacle2);
 	obstacle2[1].drawobstacle2(gl, viewProjectionMatrix, programInfo, deltaTime, textureobstacle2);
 	obstacle2[2].drawobstacle2(gl, viewProjectionMatrix, programInfo, deltaTime, textureobstacle2);
 	trafficlight[0].drawtrafficlight(gl, viewProjectionMatrix, programInfo, deltaTime, texturetrafficlight);
 	trafficlight[1].drawtrafficlight(gl, viewProjectionMatrix, programInfo, deltaTime, texturetrafficlight);
 	trafficlightstand[0].drawtrafficlightstand(gl, viewProjectionMatrix, programInfo, deltaTime, texturetrafficlightstand);
 	trafficlightstand[1].drawtrafficlightstand(gl, viewProjectionMatrix, programInfo, deltaTime, texturetrafficlightstand);
 	
 	//coins
 	coins[0].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[1].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[2].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[3].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[4].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[5].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[6].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[7].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[8].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[9].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[10].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);
 	coins[11].drawcoins(gl, viewProjectionMatrix, programInfo, deltaTime, texturecoins);

 	jetpack.drawjetpack(gl, viewProjectionMatrix, programInfo, deltaTime, texturejetpack);
 	speedpower.drawspeedpower(gl, viewProjectionMatrix, programInfo, deltaTime, texturespeedpower);
 	boots.drawboots(gl, viewProjectionMatrix, programInfo, deltaTime, textureboots);


 	//player
 	hands.drawHands(gl, viewProjectionMatrix, programInfo, deltaTime, texturehands);
 	head.drawhead(gl, viewProjectionMatrix, programInfo, deltaTime, texturehead);
 	body.drawbody(gl, viewProjectionMatrix, programInfo, deltaTime, texturebody);
 	jeans.drawjeans(gl, viewProjectionMatrix, programInfo, deltaTime, texturejeans);

 	//chaser
 	handschaser.drawHandschaser(gl, viewProjectionMatrix, programInfo, deltaTime, textureiiit);
 	headchaser.drawheadchaser(gl, viewProjectionMatrix, programInfo, deltaTime, textureiiit);
 	bodychaser.drawbodychaser(gl, viewProjectionMatrix, programInfo, deltaTime, textureiiit);
 	jeanschaser.drawjeanschaser(gl, viewProjectionMatrix, programInfo, deltaTime, textureiiit);

 	//dog
 	doghead.drawdoghead(gl, viewProjectionMatrix, programInfo, deltaTime, texturedog);
 	doglegs.drawdoglegs(gl, viewProjectionMatrix, programInfo, deltaTime, texturedog);
 	dogbody.drawdogbody(gl, viewProjectionMatrix, programInfo, deltaTime, texturedog);
  //c1.drawCube(gl, projectionMatrix, programInfo, deltaTime);

  	updatecamera();
  	checkkeypress();
  	time++;
  	bootstime -= 0.03;
  	speedpowertime -= 0.03;
  	gravity();
  	checkcollision();

}

function checkcollision(){
	var i;
	for(i=0;i<3;i++){
		if(jeans.pos[0] == obstacle1[i].pos[0] && Math.abs(jeans.pos[2] - obstacle1[i].pos[2]) <= 0.2 && Math.abs(jeans.pos[1] - obstacle1[i].pos[1]) <= 0.55){
				playerdead();
		}
		if(jeans.pos[0] == obstacle2[i].pos[0] && Math.abs(jeans.pos[2] - 0.5 - obstacle2[i].pos[2]) <= 0.45 && Math.abs(jeans.pos[1] - obstacle2[i].pos[1]) <= 0.1){
			if(obstacle2[i].collision)
				break;
			if(policetime>0){
				playerdead();
			}
			else{
				jeanschaser.pos[2] = jeans.pos[2] + 1.9;
	 			headchaser.pos[2] = head.pos[2] + 1.9;
	 			bodychaser.pos[2] = body.pos[2] + 1.9;
	 			handschaser.pos[2] = hands.pos[2] + 1.9;
	 			doghead.pos[2] = head.pos[2] + 1.9;
	 			doglegs.pos[2] = body.pos[2] + 1.9;
	 			dogbody.pos[2] = hands.pos[2] + 1.9;
				policetime = 8;
				speed = 0.14;
  		document.getElementById('stumble').play();
		}
		obstacle2[i].collision = 1;
	}
}
	//coins
	for(i=0;i<12;i++){
		if(body.pos[0] == coins[i].pos[0] && Math.abs(jeans.pos[1] - coins[i].pos[1]) < 0.2 &&  Math.abs(jeans.pos[2] - coins[i].pos[2]) < 0.1){
			coins[i].pos[2] -= 2 * 50;
	  		document.getElementById('coin').play();
			score += 10;
		}
	}

	//jetpack
	if(body.pos[0] == jetpack.pos[0] && jeans.pos[1] - jetpack.pos[1] <= 0.3 && Math.abs(jeans.pos[2] - jetpack.pos[2]) <= 0.4){
	  		document.getElementById('powerup').play();
		jetpacktime = 7;
		jetpackflag = 1;
		jetpack.pos[2] -= 2*50;
		jeans.pos[1] += 5;
		head.pos[1] += 5;
		body.pos[1] += 5;
		hands.pos[1] += 5;
		cameray +=5;
		cameraz += 5;
	}

	//boots
	if(body.pos[0] == boots.pos[0] && jeans.pos[1] - boots.pos[1] <= 0.3 && Math.abs(jeans.pos[2] - boots.pos[2]) <= 0.4){
	  		document.getElementById('powerup').play();
		boots.pos[2] -= 2*50;
		bootstime=12;
}

	//speedpower
	if(body.pos[0] == speedpower.pos[0] && jeans.pos[1] - speedpower.pos[1] <= 0.3 && Math.abs(jeans.pos[2] - speedpower.pos[2]) <= 0.4){
			document.getElementById('powerup').play();
		speedpower.pos[2] -= 2*50;
		speedpowertime=12;
	}
}

function gravity(){
	if(body.pos[1] < 0)
	{
		body.pos[1] = 0;
		hands.pos[1] = 0;
		jeans.pos[1] = 0;
		head.pos[1] = 0;
		bodychaser.pos[1] = 0;
		handschaser.pos[1] = 0;
		jeanschaser.pos[1] = 0;
		headchaser.pos[1] = 0;
		doglegs.pos[1] = 0;
		doghead.pos[1] = 0;
		dogbody.pos[1] = 0;
		body.speed = 0;
	}
	else if(body.pos[1] == 0 && jetpackflag == 1){
		jetpackflag=0;
		cameraz -= 5;
		cameray -= 5;
	}
	else if(body.pos[1] >= 0 && jetpacktime<=0)
	{
		body.pos[1] += body.speed;
		hands.pos[1] += body.speed;
		jeans.pos[1] += body.speed;
		head.pos[1] += body.speed;
		bodychaser.pos[1] += body.speed;
		handschaser.pos[1] += body.speed;
		jeanschaser.pos[1] += body.speed;
		headchaser.pos[1] += body.speed;
		doglegs.pos[1] += body.speed;
		doghead.pos[1] += body.speed;
		dogbody.pos[1] += body.speed;
		if(body.pos[1]>0){
			body.speed -= 0.01;
		}
	}
	else if(jetpacktime>0)
	{
		jetpacktime -= 0.03;
	}

}

function updatecamera(){
	cameralookat[2] -= speed;
	cameraz -= speed;
	if(c[tomove].pos[2]>cameraz)
	{
		c[tomove].pos[2] -= 2 * 20;
		fence1[tomove].pos[2] -= 2 * 20;
		tomove++;
		if(tomove==20)
			tomove=0;
	}

	//obstacles
	var i;
	for(i=0;i<3;i++)
	{
		if(obstacle1[i].pos[2]>cameraz)
			obstacle1[i].pos[2] -= 2 * 50;	
		if(obstacle2[i].pos[2]>cameraz)
		{
			obstacle2[i].collision = 0;
			obstacle2[i].pos[2] -= 2 * 50;	
		}
	}

	//coins
	for(i=0;i<12;i++)
	{
		if(coins[i].pos[2]>cameraz)
			coins[i].pos[2] -= 2 * 50;
	}

	//player
	hands.pos[2] -= speed;
	head.pos[2] -= speed;
	body.pos[2] -= speed;
	jeans.pos[2] -= speed;

	//chaser
	if(policetime>0)
	{
	handschaser.pos[2] -= speed;
	headchaser.pos[2] -= speed;
	bodychaser.pos[2] -= speed;
	jeanschaser.pos[2] -= speed;
	doghead.pos[2] -= speed;
	doglegs.pos[2] -= speed;
	dogbody.pos[2] -= speed;
	policetime -= 0.03;
	}
	else
	{
		speed = 0.15;
	}

	//jetpack
	if(jetpack.pos[2]>cameraz)
		jetpack.pos[2] -= 2*50;

	//boots
	if(boots.pos[2]>cameraz)
		boots.pos[2] -= 2*50;
}

function playerdead(){
    document.getElementById('music').pause();
  	document.getElementById('stumble').play();
	alert("Game over!! Score = ".concat(score.toString()));

}

function checkkeypress(){
	window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowLeft":
    case "a":
    case "A":
    if(hands.pos[0] != -2){
    hands.pos[0] -= 2;
	head.pos[0] -= 2;
	body.pos[0] -= 2;
	jeans.pos[0] -= 2;
	jeanschaser.pos[0] = jeans.pos[0];
	headchaser.pos[0] = head.pos[0];
	bodychaser.pos[0] = body.pos[0];
	handschaser.pos[0] = hands.pos[0];
	doglegs.pos[0] = hands.pos[0];
	dogbody.pos[0] = hands.pos[0];
	doghead.pos[0] = hands.pos[0];

	}
	else if(policetime <=0  && hands.pos[1]==0 && speedpowertime<=0)
	{
	 	jeanschaser.pos[2] = jeans.pos[2] + 1.9;
	 	headchaser.pos[2] = head.pos[2] + 1.9;
	 	bodychaser.pos[2] = body.pos[2] + 1.9;
	 	handschaser.pos[2] = hands.pos[2] + 1.9;
	 	doglegs.pos[2] = hands.pos[2] + 1.9;
		dogbody.pos[2] = hands.pos[2] + 1.9;
		doghead.pos[2] = hands.pos[2] + 1.9;
		policetime = 8;
  		document.getElementById('stumble').play();
		speed = 0.14;
	}
	else if(hands.pos[1]==0 && speedpowertime<=0)
	{
		playerdead();
	}
	

      // Do something for "down arrow" key press.
      break;

      case "ArrowRight":
      case "D":
      case "d":
      if(hands.pos[0] != 2)
      {
	    hands.pos[0] += 2;
		head.pos[0] += 2;
		body.pos[0] += 2;
		jeans.pos[0] += 2;
		jeanschaser.pos[0] = jeans.pos[0];
	 	headchaser.pos[0] = head.pos[0];
	 	bodychaser.pos[0] = body.pos[0];
	 	handschaser.pos[0] = hands.pos[0];
	 	doglegs.pos[0] = hands.pos[0];
		dogbody.pos[0] = hands.pos[0];
		doghead.pos[0] = hands.pos[0];
      }
	 else if(policetime <=0 && hands.pos[1]==0 && speedpowertime<=0)
	 {
	 	jeanschaser.pos[2] = jeans.pos[2] + 1.9;
	 	headchaser.pos[2] = head.pos[2] + 1.9;
	 	bodychaser.pos[2] = body.pos[2] + 1.9;
	 	handschaser.pos[2] = hands.pos[2] + 1.9;
	 	doglegs.pos[2] = hands.pos[2] + 1.9;
		dogbody.pos[2] = hands.pos[2] + 1.9;
		doghead.pos[2] = hands.pos[2] + 1.9;
		policetime = 8;
  		document.getElementById('stumble').play();
		speed = 0.14;
	 }
	 else if(hands.pos[1]==0 && speedpowertime<=0)
	 {
		playerdead();
	 }
      // Do something for "down arrow" key press.
      break;
   
      case "ArrowUp":
      if(body.pos[1]==0)
      {
      	if(bootstime <= 0)
	      	body.speed = 0.15;
	      else
	      	body.speed = 0.22; 
      }
   	  break;

   	  case "b":
   	  case "B":
      gray = (gray+1)%2;
   	  break;

    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
