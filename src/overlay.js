//get the canvas
var hud_canvas = document.getElementById('myCanvas');
var graphics = hud_canvas.getContext('2d');

//Viewport transformation
graphics.translate(150,75);

function drawLine(graphics,x0,y0,x1,y1,colour){
  graphics.lineWidth = 0.5;
  graphics.strokeStyle=colour;
  graphics.beginPath();
  graphics.moveTo(x0,y0);
  graphics.lineTo(x1,y1);
  graphics.stroke();
}

function drawBlock(graphics,startx,starty,width,height){
  //height=height/1.5;
  drawLine(graphics,startx,starty,startx+width,starty);
  drawLine(graphics,startx+width,starty,startx+width,starty+height);
  drawLine(graphics,startx,starty,startx,starty+height);
  drawLine(graphics,startx,starty+height,startx+width,starty+height);
}

function drawInventoryBar(graphics,startx,starty,width,height,num_blocks,colour){
  for(var i=0;i<num_blocks;i++){
    drawBlock(graphics,startx,starty,width,height,colour);
    startx+=width+graphics.lineWidth+0.5;
  }
}

function drawHealthBar(startx,starty,width,height,colour){
  

}

function HUD(inventory_slots){
  var begin=-1/2*(15*+graphics.lineWidth+0.5)*inventory_slots;
  drawInventoryBar(graphics,begin,50,15,15,inventory_slots,"rgba(255,0,0,1)");
}

export{HUD}
