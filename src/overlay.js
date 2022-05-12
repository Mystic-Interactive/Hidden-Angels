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
  graphics.translate(-150,-75)
  var x = 1;
  graphics.strokeStyle='rgba(255,0,0,'+ (-1/2 * (hearts-3))+")";
  graphics.fillStyle='rgba(255,0,0,'+ (-1/2 * (hearts-3))+")";
  var xoff=-150
  var yoff=-75
  var divider = 2.1

  //Create a mask to cut out
  var maskCanvas = document.createElement('canvas');
  // Ensure same dimensions
  maskCanvas.width = hud_canvas.width;
  maskCanvas.height = hud_canvas.height;
  var maskCtx = maskCanvas.getContext('2d');

  maskCtx.fillStyle = 'rgba(255,0,0,'+ (-1/2 * (hearts-3))+")";
  maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskCtx.globalCompositeOperation = 'xor';
  if(hearts==2){
    maskCtx.fillStyle = "rgba(0,0,0,1)";
  }
  
  
  maskCtx.beginPath();
  maskCtx.moveTo(0,0);
  //top bar
  maskCtx.lineTo(100,10);
  maskCtx.bezierCurveTo(50,-5,250,2,200,10);
  maskCtx.bezierCurveTo(100,-1,250,20,300,0);
  //right bar
  maskCtx.bezierCurveTo(275,10,310,50,290,50);
  maskCtx.lineTo(295,125)
  maskCtx.bezierCurveTo(150,25,275,50,300,150);
  //bottom bar
  maskCtx.lineTo(200,145);
  maskCtx.bezierCurveTo(100,140,100,140,100,150);
  maskCtx.bezierCurveTo(10,140,100,140,0,150);
  //left bar
  maskCtx.bezierCurveTo(5,15,100,250,3,100);
  maskCtx.lineTo(0,0);

  maskCtx.fill();

  graphics.drawImage(maskCanvas, 0, 0);
  graphics.restore();
}

//Draws the HUD on the screen
function HUD(inventory_slots){
  graphics.clearRect(0, 0, hud_canvas.width, hud_canvas.height);
  var begin=-1/2*(12.5*+graphics.lineWidth+0.5)*inventory_slots;
  healthIndicator();
  drawInventoryBar(begin,50,12.5,12.5,inventory_slots,"rgba(255,100,50,1)");
  drawHealthBar(-140,-65);
  
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
