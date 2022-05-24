//get the canvas
var hud_canvas = document.getElementById('myCanvas');
var graphics = hud_canvas.getContext('2d');
var hearts = 3;
var selected = 0;
var inventory = []

//Simple functions to help with creation of the scene
  function drawLine(x0,y0,x1,y1,colour){
    graphics.lineWidth = 0.5;
    graphics.strokeStyle=colour;
    graphics.beginPath();
    graphics.moveTo(x0,y0);
    graphics.lineTo(x1,y1);
    graphics.stroke();
  }

  function drawBlock(startx,starty,width,height){
    graphics.strokeRect(startx,starty,width,height);
  }

  function halfHeart(closePath){
    graphics.save();
    graphics.beginPath();

    graphics.moveTo(0,0);
    graphics.bezierCurveTo(-5,-7.5,-10,-5,-10,0);
    graphics.bezierCurveTo(-10,5,-7.5,7.5,0.1,15);
    // graphics.bezierCurveTo(-2.5,-3.75,-5,-2.5,-5,0);
    // graphics.bezierCurveTo(-5,2.5,-3.75,3.75,0.05,7.5);
    if(closePath){
      graphics.lineTo(0,0);
    }
    graphics.save();
    graphics.lineWidth=1;
    graphics.stroke();
    graphics.restore();
    graphics.fill();
    graphics.restore();
  }

  function drawHalfHeart(){
    graphics.save();
    graphics.scale(0.75,0.75);
    graphics.strokeStyle="white";
    graphics.fillStyle="red";
    graphics.lineWidth=2;
    halfHeart(true);
    graphics.restore();
  }

  function drawHeart(){
    graphics.save();
    graphics.scale(0.75,0.75)
    graphics.strokeStyle="white";
    graphics.fillStyle="red";
    graphics.lineWidth=2;
    halfHeart(false);
    graphics.scale(-1,1);
    halfHeart(false);
    graphics.restore();
  }

  //draw key
  function drawKey(translate_x,translate_y,width){
    graphics.save();
    graphics.translate(translate_x,translate_y)
    graphics.lineWidth=0.5;
    graphics.strokeStyle="rgb(0,216,255)"
    graphics.beginPath();
    //graphics.moveTo(width,0);
    graphics.arc(width-3,3,1.5,0,2*Math.PI)
    graphics.moveTo(8.5,4)
    graphics.lineTo(3,9);
    graphics.lineTo(5.5,11);
    graphics.moveTo(5,7);
    graphics.lineTo(7,8.75);
    graphics.stroke();
    graphics.restore();
  }

  function drawIcon(item_num,translate_x,translate_y,width){
    if(item_num==1){
      drawKey(translate_x,translate_y,width)
    }
  }
 //Draws the inventory bar 
function drawInventoryBar(startx,starty,width,height,num_blocks,colour){
  graphics.strokeStyle=colour;
 
  for(var i=0;i<num_blocks;i++){
    if(i==selected){
      graphics.strokeStyle="white";
    }
    if(inventory[i]!=-1){
      drawIcon(inventory[i],startx,starty,width)
    }
    
     drawBlock(startx,starty,width,height);
     graphics.strokeStyle=colour;
    startx+=width+graphics.lineWidth+0.5;
  }
}

//Draws the health bar
function drawHealthBar(translate_x,translate_y){
  graphics.save();
  graphics.translate(translate_x,translate_y)
  for(var i=1;i<Math.floor(hearts+1);i++){ //gets the number of full hearts to be drawn
    drawHeart(); 
    graphics.translate(17.5,0);
  }
  if(Math.floor(hearts)!=hearts){ //then they they have a half heart
    drawHalfHeart();
  }
  graphics.restore();
}

function healthIndicator(){
  graphics.save();
  graphics.translate(-150,-75)
  // graphics.strokeStyle='rgba(255,0,0,'+ (-1/2 * (hearts-3))+")";
  // graphics.fillStyle='rgba(255,0,0,'+ (-1/2 * (hearts-3))+")";

  //Create a mask to cut out
  var maskCanvas = document.createElement('canvas');
  // Ensure same dimensions
  maskCanvas.width = hud_canvas.width;
  maskCanvas.height = hud_canvas.height;
  var maskCtx = maskCanvas.getContext('2d');

  maskCtx.fillStyle = 'rgba(255,0,0,'+ (-1/2 * (Math.trunc(hearts)-3))+")";
  maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
  maskCtx.globalCompositeOperation = 'xor';
  if(Math.trunc(hearts)==2){
    graphics.clearRect(0, 0, hud_canvas.width, hud_canvas.height);
    maskCtx.fillStyle = "rgba(0,0,0,1)"; 
    // graphics.strokeStyle='rgba(255,0,0,'+ 1-(-1/2 * (hearts-3))+")";
    // graphics.fillStyle='rgba(255,0,0,'+ 1-(-1/2 * (hearts))+")";
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
function HUD(inventory_slots,_inventory){
  graphics.save();
  graphics.translate(hud_canvas.width/2, hud_canvas.height/2);
  graphics.scale(hud_canvas.width/300,  hud_canvas.height/150);
  graphics.clearRect(0, 0, hud_canvas.width, hud_canvas.height);
  
  inventory=_inventory
  var begin=-1/2*(12.5*+graphics.lineWidth+0.5)*inventory_slots;
  healthIndicator(); 
  drawHealthBar(-140,-65);
  drawInventoryBar(begin,50,12.5,12.5,inventory_slots,"rgba(255,100,50,1)");
  graphics.restore();
}

//Decreases the amount of hearts to draw on the screen
function tookDamage(damageTaken){
  hearts-=damageTaken;
  if(hearts<1){
    console.log("You have died");
  }
  graphics.save();
  graphics.setTransform(1, 0, 0, 1, 0, 0);
  graphics.clearRect(0, 0, hud_canvas.width, hud_canvas.height);
  graphics.restore();
}

function changeInventorySelected(_change){
  selected=_change
}

export{HUD,tookDamage,changeInventorySelected}
