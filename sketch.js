let diam = 12;
let globalColor;
let paintGlobs = [];
let gridTiles = [];

let video;
let poseNet;
let currPose;
let noseX = 0;
let noseY = 0;

let font1;
let font2;

let button;
let button2;
let start = false;

function preload() {
  font1 = loadFont("assets/Minecraft.ttf");
  font2 = loadFont("assets/04B_30__.TTF");
}

function setup() { 
  createCanvas(windowWidth, windowHeight);
  setShakeThreshold(100);
  rectMode(CENTER);
  textAlign(CENTER);
  video = createCapture(VIDEO);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.flipHorizontal = 1;
  poseNet.on('pose', gotPoses);
  //sharpen edges
  //pixelDensity(1);
  //reduce lag on grid square color changes
  frameRate(120);
  
  globalColor = color(216, 97, 91);
  background("#44CFCB");
  stroke(240);
  strokeWeight(2);
  textFont(font2, 70);
  text("NOSE PIXEL", width/2 + 10, height/4, 300, 200);
  textFont(font1, 30);
  text("Disegna tutto quello che vuoi solo muovendo la testa!", width/2 + 10, height/4*2, 300, 200);
  button = createButton("Clicca per disegnare");
	button.style('font-size', '30px');
	button.style('font-weight', 'bold');
	button.style('font-family', 'Minecraft');
  button.style('background-color', '#e84855');
  button.style('color', '#fafbfc');
  button.style('border-radius', '300px');
  button.style('border', '2px solid white');
	button.size(250, 150);
  button.position(width/2 - 125, height/5*3);
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
    background(250);
    stroke(240);
    
    for(var i = 0; i < 100; i++) {
      for(var j = 0; j < 100; j++){
        var x = i*12;
        var y = j*12;
        gridTiles.push(new GridTile(x, y, diam));
      }
    }
    
    let paintFill = [color(216, 97, 91), color(219, 171, 105), 
                     color(229, 220, 98), color(140, 193, 116),
                     color(116, 190, 193), color(103, 130, 178),
                     color(130, 116, 193), color(187, 116, 193)];
    
    for(var k = 0; k < 8; k++){
      paintGlobs.push(new PaintGlob(30+(45 * k), height - 70, 40, paintFill[k], k));
    } 
    
    start =false;
   } 
  
  //display grid tiles
	for(let i=0; i < gridTiles.length; i++){
		gridTiles[i].display();
	}
  //display paint globs
  for(let j=0; j < paintGlobs.length; j++){
   	paintGlobs[j].display();
    paintGlobs[j].changeColor();
    
  } 

  if (touches.length > 1) {
    //start = true;
      save('drawing.png');
  }
  
}

  function change() {
    start = true;
    button.remove();
  }

  function deviceShaken() {
		//save('draw.png');
    start = true;
	  }


  class PaintGlob {
    constructor(xPos, yPos, diam, myFill, k) {
      this.x = xPos;
     this.y = yPos;
     this.diam = diam;
     this.fill = myFill;
     this.k = k;
     //change global fill color when clicked which affects other mouse press function
   }
   display() {
      fill(this.fill);
      noStroke();
      push();
      if (dist(mouseX, mouseY, this.x, this.y) < this.diam /2) {
        strokeWeight(3);
        stroke("white");
      } else {
        stroke(this.fill);
      }
      ellipse(this.x,this.y,this.diam,this.diam);
      pop();
      push();
      fill("black");
      textStyle(BOLD);
      textFont(font1, 17);
      text("Salva il disegno premendo con 2 dita!", width/2, height-20, 312, 25);
      text("Shakera per cancellare!", width/2, 20, 300, 25);
      pop();
  }
   changeColor() {
     if (dist(mouseX, mouseY, this.x, this.y) < this.diam /2) {
      if(mouseIsPressed) {
        globalColor = this.fill;
      }  
    }
  }
  } 
  
  //constructor function for grid squares ("pixels")
  class GridTile {
    constructor(xPos, yPos, diam) {
      this.xPos = xPos;
      this.yPos = yPos;
      this.diam = diam;
      
    }
    display() {   
      //change color of grid square to current global fill when clicked	
      if (currPose) {
        noseX = lerp(noseX, currPose.nose.x, 0.7);
        noseY = lerp(noseY, currPose.nose.y, 0.7);
      }
//fill the selected color in the nose position
        if(noseX > this.xPos && noseX < this.xPos + this.diam && noseY > this.yPos && noseY < this.yPos + this.diam){
          if(currPose){
            fill(globalColor);
          }	
        
      } else {
        noFill(); 
      }
      if (noseY > height- 100) {
        noFill();
      }
    rect(this.xPos, this.yPos, this.diam);
    }
  }