// cool colors: #1B4965, #00A7E1, e84855, #FDC835, adf6b1

let video;
let poseNet;
let currPose;
let noseX = 0;
let noseY = 0;
let disegno;
let d;
let colors = ['255, 255, 255', '#B29DD9', '#FDFD98', '#FE6B64', '#77DD77', '#779ECB', '#000000'];
let start;

let button;
let button2;
let buttons = [];

let drawing = true;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#00A7E1");
  disegno = createGraphics(windowWidth + 100, windowHeight);
  disegno.clear();

  video = createCapture(VIDEO);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.flipHorizontal = 1;
  poseNet.on('pose', gotPoses);

  textAlign(CENTER);
  rectMode(CENTER);
  fill("white");
  textSize(30);
  text("Disegna con il tuo naso!!" , width/2, height/5, 300, 100);
  button = createButton('Clicca per iniziare a disegnare');
	button.style('font-size', '20px');
	button.style('font-weight', 'bold');
	button.style('font-family', 'Pacifico');
  button.style('background-color', '#e84855');
  button.style('color', '#fafbfc');
  button.style('border-radius', '300px');
  button.style('border', 'none');
	button.size(200, 100);
  button.position(width/2 - 100, height/2 - 70);
  button.mousePressed(change);


}

function modelReady() {
  console.log('model ready');
}

function gotPoses(poses) {
  if (poses.length > 0) {
    currPose = poses[0].pose;
  }
}


function draw() {
if (start == true) {
  if (drawing == true) {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0);
    pop();
  
    if (currPose) {
      noseX = lerp(noseX, currPose.nose.x, 0.7);
      noseY = lerp(noseY, currPose.nose.y, 0.7);
  
      d = dist(currPose.leftEye.x, currPose.leftEye.y, currPose.rightEye.x, currPose.rightEye.y);
    }
    image(disegno, -100, 0);
    disegno.noStroke();
    disegno.ellipse(noseX, noseY, d * .1);
  
    if (touches.length > 1) {
      disegno.clear();
    }
    noStroke();
    textAlign(LEFT);

  push();
  fill("blue");
  rect(0, 0, width*2, 100);
  pop();
  textSize(10);
  text("Avvicinati e allontanati per ingrandire il pennello", 50, 40);
  text("Premi con 2 dita per cancellare", 50, 30);

  //fill the circle of the colors
  for (i = 0; i < 7; i++) {
    buttons[i] = createButton("  ");
    buttons[i].style('background-color', colors[i]);
    buttons[i].style('border-radius', '40px');
    buttons[i].style('border', 'none');
    buttons[i].size(40, 40);
    buttons[i].position((55 * i) + 10, height - 200);
  }
  buttons[0].mousePressed(function() { changeColor(0);});
  buttons[1].mousePressed(function() { changeColor(1);});
  buttons[2].mousePressed(function() { changeColor(2);});
  buttons[3].mousePressed(function() { changeColor(3);});
  buttons[4].mousePressed(function() { changeColor(4);});
  buttons[5].mousePressed(function() { changeColor(5);});
  buttons[6].mousePressed(function() { changeColor(6);});

  button3 = createButton("gioca con il tuo disegno");
  button3.size(100, 50);
  button3.position(width/2, height - 100);
  button3.mousePressed(play);
  } 
  //start the game
  else {
    video.hide();
    button3.remove();
    background("red");
    text("Muovi il telefono per spostare il disegno!", width/2, height - 200, 300, 50);
    animate();

  }
}  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function change() {
  button.remove();
  start = true;
}

function changeColor(c) {
    disegno.fill(colors[c]);
  console.log("changed");
}

function play() {
  drawing = false;
}

function animate() {
  let x = random(-10, 10);
  let y = random(-20, 30);
  image(disegno, -100 + x, 0 + y);
  console.log(x, y);
}

