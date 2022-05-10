//get the canvas
var hud_canvas = document.getElementById('myCanvas');
var graphics = hud_canvas.getContext('2d');

//Viewport transformation
graphics.translate(150,75);

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

function drawInventoryBar(startx,starty,width,height,num_blocks,colour){
  graphics.strokeStyle=colour;
 
  for(var i=0;i<num_blocks;i++){
     drawBlock(startx,starty,width,height);
    startx+=width+graphics.lineWidth+0.5;
  }
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
function drawHealthBar(translate_x,translate_y,num_hearts){
  graphics.save();
  graphics.translate(translate_x,translate_y)
  drawHeart()
  for(var i=1;i<num_hearts;i++){
    graphics.translate(15,0);
    drawHeart();

  }
  graphics.restore();
}

function HUD(inventory_slots){
  var begin=-1/2*(12.5*+graphics.lineWidth+0.5)*inventory_slots;
  drawInventoryBar(begin,50,12.5,12.5,inventory_slots,"rgba(255,100,50,1)");
  drawHealthBar(-140,-65,3);
}

export{HUD}
