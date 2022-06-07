//Will draw the UI elements (not including those of which require a level switch) to the canvas

//get the canvas and initialise the variables
var hud_canvas = document.getElementById('myCanvas');
var graphics = hud_canvas.getContext('2d');
var hearts = 3;
var selected = 0;
var inventory = [];
var spriteDeath = null;
var sceneHUD = null;
var hitSound = null;


//Simple functions to help with creation of the scene
    function drawLine(x0,y0,x1,y1,colour){
    graphics.save();
    graphics.lineWidth = 0.4;
    graphics.strokeStyle=colour;
    graphics.beginPath();
    graphics.moveTo(x0,y0);
    graphics.lineTo(x1,y1);
    graphics.stroke();
    graphics.restore();
    }

    function drawTriangle(colour){
    graphics.save();
    graphics.lineWidth = 0.5;
    graphics.fillStyle=colour;
    graphics.beginPath();
		graphics.moveTo(-6,0);
		graphics.lineTo(6,0);
		graphics.lineTo(0,12);
		graphics.closePath();
		graphics.fill();
    graphics.restore();
    }

    function drawShovelBase(colour){
    graphics.save();
    graphics.lineWidth = 0.4;
    graphics.fillStyle=colour;
    graphics.beginPath();
    graphics.arc(6, 6, 3, -Math.PI/3,Math.PI/3);
    graphics.moveTo(8,8);
    graphics.lineTo(6,10);
    graphics.lineTo(6,2);
    graphics.lineTo(8.5,4)
    graphics.fill();
    graphics.restore();
    }

    function drawBlock(startx,starty,width,height){
    graphics.save();
    // graphics.fillStyle="rgb(0,0,0,0.01)";
    graphics.strokeRect(startx,starty,width,height);
    // graphics.fillRect(startx,starty,width,height);
    graphics.restore();
    }

    function halfHeart(closePath){
    graphics.save();
    graphics.beginPath();

    graphics.moveTo(0,0);
    graphics.bezierCurveTo(-5,-7.5,-10,-5,-10,0);
    graphics.bezierCurveTo(-10,5,-7.5,7.5,0.1,15);
    if(closePath){
      graphics.lineTo(0,0); //uses this to determine whether we are drawing a full or half heart to the UI
    }
    graphics.save();
    graphics.lineWidth=1;
    graphics.stroke();
    graphics.restore();
    graphics.fill();
    graphics.restore();
    }

//Draws the icons that will be used to create the HUD
    //Draws the half heart for the health bar (when a character has half a heart)
    function drawHalfHeart(){
    graphics.save();
    graphics.scale(0.75,0.75);
    graphics.strokeStyle="white";
    graphics.fillStyle="red";
    graphics.lineWidth=2;
    halfHeart(true);
    graphics.restore();
    }

  //Draws the half heart for the health bar
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

  //Draw key icon
  function drawKey(translate_x,translate_y,width,colour){
    graphics.save();
    graphics.translate(translate_x,translate_y);
    graphics.lineWidth=0.5;
    graphics.strokeStyle=colour;
    graphics.beginPath();
    graphics.arc(width-3,3,1.5,0,2*Math.PI)
    graphics.moveTo(8.5,4)
    graphics.lineTo(3,9);
    graphics.lineTo(5.5,11);
    graphics.moveTo(5,7);
    graphics.lineTo(7,8.75);
    graphics.stroke();
    graphics.closePath();
    graphics.restore();
  }

  //Draws the screw driver icon
  function drawScrewdriver(translate_x,translate_y,colour){
    //Draw the rectangle
    graphics.save();
    graphics.translate(translate_x,translate_y);
    graphics.lineWidth=0.5;
    graphics.fillStyle=colour;
    graphics.translate(9,1);
    graphics.rotate(Math.PI/5)
    graphics.fillRect(0,0,2,6);
    graphics.restore();

    //Draws the line and triangle
    graphics.save();
    graphics.translate(translate_x,translate_y);
    drawLine(3,11,6.4,6.4,'#464646');
    graphics.translate(4.1,9.5);
    graphics.rotate(Math.PI/5)
    graphics.scale(0.1,0.2);
    drawTriangle('#464646')
    graphics.restore();
  }

  //Draws the shovel icon
  function drawShovel(translate_x,translate_y,colour){
    //Draw the rectangle
    graphics.save();
    graphics.translate(translate_x,translate_y);
    graphics.lineWidth=0.5;
    graphics.fillStyle=colour;
    graphics.translate(7,1);
    graphics.rotate(Math.PI/4.75)
    graphics.fillRect(0,0,6,1.25);
    graphics.restore();

    //Draws the line and shovel base
    graphics.save();
    graphics.translate(translate_x,translate_y);
    drawLine(3,11,8.7,3.7,'#464646');
    graphics.translate(13,5);
    graphics.rotate(-1.3*Math.PI);
    graphics.scale(1.2,0.8);
    drawShovelBase(colour);
    graphics.restore();
  }

  //Draws the secret book icon
  function drawSecretBook(translate_x,translate_y,colour){
    graphics.save();
    graphics.translate(translate_x,translate_y);
    
    //Draw the book
    graphics.fillStyle=colour;
    graphics.fillRect(2.75,1.75,7.5,7.75);
    graphics.fillStyle="white";
    graphics.fillRect(2.875,2,7.1,8);
    graphics.fillStyle=colour;
    graphics.fillRect(2.5,2.25,7,8.25);

    //Draw the book decoration
    graphics.strokeStyle="rgb(241,196,15)";
    graphics.lineWidth=0.5;
    graphics.moveTo(6,6.25);
    graphics.arc(6,6.25,2,0,2*Math.PI)
    graphics.stroke();
    graphics.restore();
  }

  //Draws the icon based off the inventory number passed through -  used to help with design
  function drawIcon(item_num,translate_x,translate_y,width){
    //Icon is the bathroom key
    if(item_num==1){
      drawKey(translate_x,translate_y,width,"rgb(0,216,255)");
      return ["Bathroom Key","rgb(0,216,255)"];
    }
    //Icon is the closet key
    else if(item_num==2){
      drawKey(translate_x,translate_y,width,"rgb(75,122,71)");
      return ["Closet Key","rgb(75,122,71)"];
    }
    //Icon is the screw driver
    else if(item_num==3){
      drawScrewdriver(translate_x,translate_y,"red");
      return ["Screw driver","red"];
    }
    //Icon is the shovel
    else if(item_num==4){
      drawShovel(translate_x,translate_y,"blue");
      return ["Shovel","blue"];
    }
    //Icon is the goal key
    else if(item_num==5){
      drawKey(translate_x,translate_y,width,"#A32CC4");
      return ["Goal key","#A32CC4"];
    }
    //Icon is the library key
    else if(item_num==6){
      drawKey(translate_x,translate_y,width,"rgb(39,174,96)");
      return ["Library Key","rgb(39,174,96)"];
    }
    //Icon is the secret book
    else if(item_num==7){
      drawSecretBook(translate_x,translate_y,"rgb(26,188,156)");
      return ["Secret Book","rgb(26,188,156)"];
    }
  }

  //Writes the name of the item that they have currently selected so that they know what it is for
  function writeItem(word,colour){
    graphics.save();
    graphics.clearRect(-100,39,200,10) //used to clear the prior text that was placed upon the canvas
    
    graphics.fillStyle=colour
    graphics.textAlign="centre";
    graphics.font = "7.5px Calibri";
    graphics.translate(-1.25*word.length,0);
    graphics.fillText(word, 0, 45);
    
    
    graphics.restore();

  }

//Draws the inventory bar 
function drawInventoryBar(startx,starty,width,height,colour){
  graphics.strokeStyle=colour;
  graphics.clearRect(startx,starty,startx+13*width,height) //Helps with clearing the inventory when changing levels (just for the icons)
  var selected_item = "";
  var word_colour = [];
  
  for(var i = 0;i<8;i++){ //8 is the number of inventory slots
    try {
      if(inventory[i]!=null){ //Draws the icon for every icon in the inventory bar
        word_colour = drawIcon(inventory[i],startx,starty,width)
        if(selected==i){
          selected_item = word_colour[0];
        }
      }
    }
    catch(err) { //if the current length of the inventory doesnt encompass 8 unique items
     console.log(err)
    }
    
    if(i==selected){
      graphics.strokeStyle="white"; //Indication of icon selected
      writeItem(selected_item,word_colour[1]) //writes the name of the current selected icon
    }

    drawBlock(startx,starty,width,height); //raws block icon for the inventory bar
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

  //Drawing half hearts after all of the full hearts have been drawn
  if(Math.floor(hearts)!=hearts){ 
    drawHalfHeart();
  }
  graphics.restore();
}

//Draws border on the corner of the canvas as a indicator of low health
function healthIndicator(){
  graphics.save();
  graphics.translate(-150,-75)
  graphics.clearRect(0,0,300,150); //Clears it so that when resetting health, this is reset

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

//Adds item to the inventory
function addToInventory(item_num){
  inventory.push(item_num)
  inventory = [...new Set(inventory)]; //Event handler calls the icon multiple times, thus we make the list of unique elements only
}

//Gets the icon selected so that we can see if the correct object is selected for object interaction
function getItemSelected(){
  try{
    return inventory[selected]
  }
  catch(error){
    return -1
  }
  
}

//Setting the death screen for when the player dies
function setDeathScreen(spriteDeath_, HUD_, hitSound_){
  spriteDeath = spriteDeath_
  sceneHUD = HUD_
  hitSound = hitSound_
}

//Draws the HUD on the screen
function HUD(){
  graphics.save();
  graphics.translate(hud_canvas.width/2, hud_canvas.height/2);
  graphics.scale(hud_canvas.width/300,  hud_canvas.height/150);
  graphics.clearRect(0, 0, hud_canvas.width, hud_canvas.height);
  
  var begin=-1/2*(12.5*+graphics.lineWidth+0.5)*8;
  //Draws all items onto the HUD
  healthIndicator(); 
  drawHealthBar(-140,-65);
  drawInventoryBar(begin,50,12.5,12.5,"rgba(255,100,50,1)");
  graphics.restore();
}

//Decreases the amount of hearts to draw on the screen
function tookDamage(damageTaken){
  graphics.save();
  hearts-=damageTaken;
  if(hearts<1){
    sceneHUD.add(spriteDeath)
  }
  graphics.save();
  graphics.setTransform(1, 0, 0, 1, 0, 0);
  graphics.clearRect(0, 0, hud_canvas.width, hud_canvas.height);
  graphics.restore();

  //take damage sound
  hitSound.play()
}

//Changes the item selected - to be used in conjunction with an event listener to the numbers and numpad
function changeInventorySelected(_change){
  selected=_change-1
}

//Removes item from the users inventory and shifts all their selected items 
function clearItem(){
  inventory.splice(selected,1)
}

//changes their health back to 3
function resetHealth(){
  hearts = 3;
}

export{HUD,tookDamage,changeInventorySelected,addToInventory,getItemSelected,clearItem, setDeathScreen, resetHealth}
