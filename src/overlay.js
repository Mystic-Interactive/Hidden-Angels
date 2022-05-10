//get the canvas
var hud_canvas = document.getElementById('myCanvas');
var graphics = hud_canvas.getContext('2d');
var hearts = 3;

//Viewport transformation
graphics.translate(150,75);

//Simple functions to help with creation of the scene
  function drawLine(x0,y0,x1,y1,colour){
    graphics.lineWidth = 0.5;
    graphics.strokeStyle=colour;
    graphics.beginPath();
    graphics.moveTo(x0,y0);
    graphics.lineTo(x1,y1);
    graphics.stroke();
  }

  function drawBlock(startx,starty,width,height,fill){
    graphics.strokeRect(startx,starty,width,height);
    if(fill==true){
      graphics.fillRect(startx,starty,width,height);
    } 
  }

  function halfHeart(){
    graphics.save();
    graphics.beginPath();
    graphics.moveTo(0,0);
    graphics.bezierCurveTo(-2.5,-3.75,-5,-2.5,-5,0);
    graphics.bezierCurveTo(-5,2.5,-3.75,3.75,0.05,7.5);
    graphics.stroke();
    graphics.fill();
    graphics.restore();
  }

  function drawHeart(){
    graphics.save();
    graphics.strokeStyle="white";
    graphics.fillStyle="red";
    graphics.lineWidth=2;
    halfHeart();
    graphics.scale(-1,1);
    halfHeart();
    graphics.restore();
  }

 //Draws the inventory bar 
function drawInventoryBar(startx,starty,width,height,num_blocks,colour){
  graphics.strokeStyle=colour;
 
  for(var i=0;i<num_blocks;i++){
     drawBlock(startx,starty,width,height);
    startx+=width+graphics.lineWidth+0.5;
  }
}

//Draws the health bar
function drawHealthBar(translate_x,translate_y){
  graphics.save();
  graphics.translate(translate_x,translate_y)
  drawHeart()
  for(var i=1;i<hearts;i++){
    graphics.translate(15,0);
    drawHeart();

  }
  graphics.restore();
}

function healthIndicator(){
  graphics.save();
  var x = 1;
  graphics.strokeStyle='rgba(255,0,0,'+ (-1/2 * (hearts-3))+")";
  graphics.strokeRect(-150,-75,300,150);
  graphics.restore();
}

//Draws the HUD on the screen
function HUD(inventory_slots){
  graphics.clearRect(0, 0, hud_canvas.width, hud_canvas.height);
  var begin=-1/2*(12.5*+graphics.lineWidth+0.5)*inventory_slots;
  drawInventoryBar(begin,50,12.5,12.5,inventory_slots,"rgba(255,100,50,1)");
  drawHealthBar(-140,-65);
  healthIndicator();
}

//Decreases the amount of hearts to draw on the screen
function tookDamage(){
  hearts-=1;
  if(hearts<1){
    console.log("You have died");
  }
  graphics.save();
  graphics.setTransform(1, 0, 0, 1, 0, 0);
  graphics.clearRect(0, 0, hud_canvas.width, hud_canvas.height);
  graphics.restore();
}

export{HUD,tookDamage}
