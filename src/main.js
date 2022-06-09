import { sky } from './sky.js';
import { Ground } from './ground.js';
import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import { pointLightCreator, moonCreator, addSphereMoon,torch } from './lights.js';
import {PointerLockControls} from './PointerLockControls.js'
import {HUD, tookDamage,changeInventorySelected,clearInventory,setDeathScreen, resetHealth} from './overlay.js'
import {makeFirstFloor,makeSecondFloor,makeBasement,makeFourthFloor,removeFloor, getLoader} from './house_collision.js'
import { Reflector } from '../lib/Reflector.js'
import SmallMonster from './small_monster.js';
import {detectObject,UI, removeAllDynamics, initialiseDynamics} from './house_dynamic.js'
import LargeMonster from './large_monster.js';
import NormalMonster from './normal_monster.js';

// variables to set up scene with camera
var camera;
var scene;
var renderer;
var world;
var gltfLoader;

// control variables to time actions correctly
const timestep = 1/60
var delta = 0
var time = new Date().getTime()
var speed = 0
var t = 43000;
var selected = 0;

// HUD control variables
var paused = false;
var curr_lvl = null;
var lvl = null;
var lvl1_uuid = "";
var lvl2_uuid = "";
var lvl3_uuid = "";
var lvl4_uuid = "";
var next_uuid = "";
var finish_uuid = "";
var death_uuid = "";
var goToNext = false;
var restart = false;
var sceneHUD;
var cameraHUD;
var mousePos;
var sprite, sprite2, sprite3, sprite4, spriteDeath, spriteNext,spriteFinish;

// items added to scene
var player;
var monsters = []
var ground;
var moonLight;
var moonSphere;
var torchLight;
var skybox;


//sounds that will be added to the scene
var listener;
var audioLoader;
var backgroundsound;
var hitSound;
var pickupSound ;


// Initialization of game (world, level, HUD, etc.)
var init = function(){
  let world_canvas = document.getElementById('MainWorld');
  var hud_canvas = document.getElementById('myCanvas');
  const progressBarContainer = document.querySelector('.progress-bar-container');
  world_canvas.width = 0.98*window.innerWidth;
  world_canvas.height = 0.98*window.innerHeight;
  hud_canvas.width = 0.98*window.innerWidth;
  hud_canvas.height = 0.98*window.innerHeight;
  progressBarContainer.style.display = 'none'; //hide loading screen


  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -98.1, 0)
  })

  scene = new THREE.Scene();
	
  camera = new THREE.PerspectiveCamera(
    95, // field of view (fov)
    (0.98*window.innerWidth)/(0.98*window.innerHeight), // browser aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );

  listener = new THREE.AudioListener();
  camera.add(listener);
  
  renderer = new THREE.WebGLRenderer({
    maxLights: 8,
    canvas: world_canvas,
  });

  renderer.setSize(0.98*window.innerWidth, 0.98*window.innerHeight,);
  renderer.shadowMap.enabled = true;
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  mousePos = new THREE.Vector2();

  //Create and add ground mesh to scene
  ground = new Ground(scene, world)
  
  //Create the loading screen
  loadingScene();
  getLoader(gltfLoader);
  //Setting up the moon. The moon contains a point light, a mesh and a texture
  moonLight = moonCreator(0xFFFFFF,0.8,10000,1,-0.0045);
  scene.add(moonLight);
  moonSphere = addSphereMoon(2);
  scene.add(moonSphere);
  
  //Creates and adds skybox to scene
  skybox = sky();
  scene.add(skybox);

  const initial_position = new CANNON.Vec3(0, 1, 0); //Initial player position for opening sandbox exploration

  var path = [
    new THREE.Vector3(2, 0, 2), 
    new THREE.Vector3(2, 0, -2),
    new THREE.Vector3(-2, 0, -2),
    new THREE.Vector3(-2, 0, 2)
  ]
  
  //const monster = new Monster(scene, world,new THREE.Vector3(1, 0, 10), player)

  player = new Player(scene, world, camera, gltfLoader, initial_position, monsters); //Create and add player to scene and physics world

  //var monster_v2 = new monster_ai(scene,player);

  // create and add ambient light to scene
  const light = new THREE.AmbientLight();
  light.intensity = 0.2; //dim light for atmosphere
  scene.add(light)


  //const smol_boi = new SmallMonster(scene, world,new THREE.Vector3(-2, 0, -2), path, player, true);
 // monsters.push(smol_boi)
  const normal_monster = new NormalMonster(scene, world, gltfLoader, new THREE.Vector3(2, 0, 2), path, player, true)
  monsters.push(normal_monster)

  //const big_boi = new LargeMonster(scene, world, new THREE.Vector3(-2, 0, 2), path, player, true)
 // monsters.push(big_boi)


  const PointerLock = new PointerLockControls(camera,document.body); //Mouse controls to control camera and player rotation 
  hud_canvas.addEventListener('click', function (){ //activate controls by clicking on screen
	  PointerLock.lock();
	});

  createMenu()//create menu screen overlay (level selection)
  addSounds()
  
  //Create and add spotlight tos scene (acts as player torch)
  torchLight = torch(0xFFFFFF, 1, 5 , 1, -0.004, [0, 0, 0]);
  scene.add(torchLight);

  initialiseDynamics(scene, sceneHUD, world, spriteNext, spriteFinish, pickupSound, gltfLoader)
  setDeathScreen(spriteDeath,sceneHUD, hitSound)

  window.addEventListener('resize', () => {
    hud_canvas.width = 0.98*window.innerWidth;
    hud_canvas.height = 0.98*window.innerHeight;
    renderer.setSize(0.98*window.innerWidth, 0.98*window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  })

  document.addEventListener('keydown',(e)=>{
    if(e.key=='`'){//open menu and pause game
      paused = true;
      PointerLock.unlock();
    }
    else if(e.code=='Digit1'|| e.code =="Numpad1"){//change to 1st item in inventory
      console.log("Pressed 1")
      changeInventorySelected(1);
    }
    else if(e.code=='Digit2'|| e.code =="Numpad2"){//change to 2nd item in inventory
      console.log("Pressed 2")
      changeInventorySelected(2);
    }
    else if(e.code=='Digit3'|| e.code =="Numpad3"){//change to 3rd item in inventory
      console.log("Pressed 3")
      console.log(player.position)
      changeInventorySelected(3);
    }
    else if(e.code=='Digit4'|| e.code =="Numpad4"){//change to 4th item in inventory
      console.log("Pressed 4")
      changeInventorySelected(4);
    }
    else if(e.code=='Digit5'|| e.code =="Numpad5"){//change to 5th item in inventory
      console.log("Pressed 5")
      changeInventorySelected(5);
    }
    else if(e.code=='Digit6'|| e.code =="Numpad6"){//change to 6th item in inventory
      console.log("Pressed 6")
      changeInventorySelected(6);
    }
    else if(e.code=='Digit7'|| e.code =="Numpad7"){//change to 7th item in inventory
      console.log("Pressed 7")
      changeInventorySelected(7);
    }
    else if (e.code=='Digit8'|| e.code =="Numpad8"){//change to 8th item in inventory
      console.log("Pressed 8")
      changeInventorySelected(8);
    }
  })
  
  window.addEventListener('mousemove',(e)=>{//Track mouse position with respect to play area
    mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = - (e.clientY / window.innerHeight) * 2 + 1;
  })

   //Click listener to move user to next level if they have selected it
  window.addEventListener('mousedown',(e)=>{
    console.log("clicked")
    console.log("Level: ",lvl)
    paused=false;

    if(goToNext){
      console.log("Current level: ",curr_lvl)
      lvl = getNextLevel();
      console.log(lvl);
      goToNext = false;
    }

    if(lvl==1){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=1 || restart){
        lvlChange(curr_lvl);
        curr_lvl=1;
        makeFirstFloor(scene,world);
        player.body.position.set(0,1,-13)

        //Adding monsters for floor 1
        var normal_monster = new NormalMonster(scene, world, gltfLoader, new THREE.Vector3(8, 0, 2), path, player, true)
        monsters.push(normal_monster)

        var large_monster = new LargeMonster(scene, world, gltfLoader, new THREE.Vector3(-8, 0, 2), path, player, true)
        monsters.push(large_monster)
      }
    }

    if(lvl==2){
      if(curr_lvl!=2|| restart){
        lvlChange(curr_lvl);
        curr_lvl=2;
        makeSecondFloor(scene,world);
        player.body.position.set(-10.5,1,-1)

        //Adding monsters for floor 2
        var normal_monster = new NormalMonster(scene, world, gltfLoader, new THREE.Vector3(11, 0, -3.8), path, player, true)
        monsters.push(normal_monster)

        normal_monster = new NormalMonster(scene, world, gltfLoader, new THREE.Vector3(-11, 0, 1.5), path, player, true)
        monsters.push(normal_monster)
      }
      
    }
    else if(lvl==3){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=3 || restart){
        lvlChange(curr_lvl);
        curr_lvl=3;
        makeBasement(scene,world);
        player.body.position.set(-10.5,1,-12)

        //Adding monsters for basement
          //Nest sack 1
          var small_monster = new SmallMonster(scene, world, gltfLoader, new THREE.Vector3(-11, 0, 3.2), path, player, true)
          monsters.push(small_monster)

          small_monster = new SmallMonster(scene, world, gltfLoader, new THREE.Vector3(-9, 0, 4.6), path, player, true)
          monsters.push(small_monster)

          //Nest sack 2
          var small_monster = new SmallMonster(scene, world, gltfLoader, new THREE.Vector3(9, 0, -13), path, player, true)
          monsters.push(small_monster)

          var small_monster = new SmallMonster(scene, world, gltfLoader, new THREE.Vector3(11, 0, -11), path, player, true)
          monsters.push(small_monster)

      }
    }
    else if(lvl==4){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=4 || restart){
        lvlChange(curr_lvl);
        curr_lvl=4;
        makeFourthFloor(scene,world);
        player.body.position.set(-11.5,1,12)

        //Adding monsters to level 4
        var large_monster = new LargeMonster(scene, world, gltfLoader, new THREE.Vector3(-10, 0, 0), path, player, true)
        monsters.push(large_monster)

        var large_monster = new LargeMonster(scene, world, gltfLoader, new THREE.Vector3(-13, 0, -5), path, player, true)
        monsters.push(large_monster)
      }  
    }

    if(lvl==-1){
      window.location.href='../res/index.html'
    }

    if(restart){
      resetHealth();
      sceneHUD.remove(spriteDeath)
    }
    restart = false;
  })

  GameLoop()
};

function update(){ //Game Logic
  //Raycaster for level selector
  const rayCasterHUD = new THREE.Raycaster();
  rayCasterHUD.setFromCamera(mousePos,cameraHUD);
  const intersectsHUD = rayCasterHUD.intersectObjects(sceneHUD.children);

  //Only update the game state if the menu is not brought up
  if(!paused){
    
    monsters.forEach(monster => {
      try{
        monster.update(delta);
      } catch (e) {}
    });
    const new_time = new Date().getTime()
    delta = new_time - time
    time = new_time
    player.update(delta)
    ground.update()
    detectObject(player)
    UI(lvl)
    //Showing that we can decrease the visible hearts on the fly
    const d = new Date();

    if(d.getMinutes()==t){
      selected+=2;
      tookDamage(3);
      changeInventorySelected(selected)
      HUD();
      t+=1;
    }
    HUD();
    //console.log(monsters.length)

    //Move the moon and skybox only when you can see them to reduce the computation needed
    if(curr_lvl==4 || lvl == null){
      //Rotates and moves the moon
      speed+=0.001
      moonLight.position.y = 20*(Math.sin(speed))+50;
      moonLight.position.z = 10*(Math.cos(speed));
      moonSphere.position.y = 20*(Math.sin(speed))+50;
      moonSphere.position.z = 10*(Math.cos(speed));
      moonSphere.rotation.x+=0.005;
      moonSphere.rotation.y+=0.005;
      moonSphere.rotation.z+=0.005;
      
      //Rotates the skybox
      skybox.rotation.x+=0.0005;
      skybox.rotation.y+=0.0005;
      skybox.rotation.z+=0.0005;

      scene.add(moonLight)
      scene.add(moonSphere)
      scene.remove(torchLight)
    }
    else{
      scene.remove(moonLight)
      scene.remove(moonSphere)
      scene.add(torchLight)
    }

    world.step(timestep)

    torchLight.position.set(player.position.x,player.position.y,player.position.z)
      
    if(intersectsHUD.length>0){
      if(intersectsHUD[0].object.uuid === next_uuid || intersectsHUD[0].object.uuid === finish_uuid){
        console.log("Next level Highlighted")
        goToNext = true;
      }
      else if(intersectsHUD[0].object.uuid === death_uuid){
        console.log("DeathSelected");
        restart = true;
      }
    }
    else{
      goToNext = false;
      restart = false;
    }
  }
  else{
    if(intersectsHUD.length==0){
      console.log("Nothing selected")
      lvl = null;
    }
    else if(intersectsHUD[0].object.uuid === lvl1_uuid){
      console.log("Level 1 Highlighted")
      lvl = 1;
    }
    else if(intersectsHUD[0].object.uuid === lvl2_uuid){
      console.log("Level 2 Highlighted")
      lvl = 2;
    }
    else if(intersectsHUD[0].object.uuid === lvl3_uuid){
      console.log("Level 3 Highlighted")
      lvl = 3;
    }
    else if(intersectsHUD[0].object.uuid === lvl4_uuid){
      console.log("Level 4 Highlighted")
      lvl = 4;
    }
  }
};

function render(){// Draw scene
  renderer.render(scene, camera);
  //Only render the pause menu sprites when the game is paused
  if(paused){
    sceneHUD.add(sprite);
    sceneHUD.add(sprite2);
    sceneHUD.add(sprite3);
    sceneHUD.add(sprite4);
  }
  else{
    sceneHUD.remove(sprite);
    sceneHUD.remove(sprite2);
    sceneHUD.remove(sprite3);
    sceneHUD.remove(sprite4);
  }

  renderer.render(sceneHUD, cameraHUD); 
};

//Function that will be called upon a level change to remove the objects that are currently in the scene
function lvlChange(curr_lvl){
  removeFloor(scene,world,curr_lvl)
  removeAllDynamics(scene,world);
  clearInventory();

  for(var i=0;i<monsters.length;i++){
    monsters[i].destroy()
  }
  monsters = []
  resetHealth();
}

function getNextLevel(){
  if(lvl<4){
    return lvl + 1;
  }
  return -1
}

function createMenu(){ //Creating the pause menu
  var container = document.createElement('canvas');

  container.setAttribute("style","width:1px; height:1px","position:absolute");
  
  document.body.appendChild( container );
  cameraHUD = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2,window.innerHeight / - 2, - 500, 1000 );
  
  cameraHUD.position.x = 0;
  cameraHUD.position.y = 0;
  cameraHUD.position.z = 0;
  
  sceneHUD = new THREE.Scene();

  var spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/Level1.jpg")
  });

  sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(-window.innerWidth / 4, window.innerHeight / 6, 0);
  sprite.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

  var spriteMaterial2 = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/Level2.jpg")
  });

  sprite2 = new THREE.Sprite(spriteMaterial2);
  sprite2.position.set(window.innerWidth / 4, window.innerHeight / 6, 0);
  sprite2.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

  var spriteMaterial3 = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/Level3.jpg")
  });

  sprite3 = new THREE.Sprite(spriteMaterial3);
  sprite3.position.set(-window.innerWidth / 4, -window.innerHeight / 6, 0);
  sprite3.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

  var spriteMaterial4 = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/Level4.jpg")
  });

  sprite4 = new THREE.Sprite(spriteMaterial4);
  sprite4.position.set(window.innerWidth / 4, -window.innerHeight / 6, 0);
  sprite4.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

  var spriteNextMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/next_level.jpg")
  });

  spriteNext = new THREE.Sprite(spriteNextMaterial);
  spriteNext.position.set(0,0,0);
  spriteNext.scale.set(window.innerHeight,window.innerWidth/5,1);

   //Sprite for finishing the game
   var spriteFinishMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/GameWon.jpg")
  });
          
  spriteFinish = new THREE.Sprite(spriteFinishMaterial);
  spriteFinish.position.set(0,0,0);
  spriteFinish.scale.set(window.innerHeight,window.innerWidth/5,1);

    
  var spriteDeathMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/GameOver.jpg")
  });

  spriteDeath = new THREE.Sprite(spriteDeathMaterial);
  spriteDeath.position.set(0,0,0);
  spriteDeath.scale.set(window.innerHeight,window.innerWidth/5,1);
                  
  
  lvl1_uuid = sprite.uuid;
  lvl2_uuid = sprite2.uuid;
  lvl3_uuid = sprite3.uuid;
  lvl4_uuid = sprite4.uuid;
  next_uuid = spriteNext.uuid;
  finish_uuid = spriteFinish.uuid;
  death_uuid = spriteDeath.uuid;

  sceneHUD.add(sprite);
  sceneHUD.add(sprite2);
  sceneHUD.add(sprite3);
  sceneHUD.add(sprite4);
}

//function that will initialise all the sounds in the game
function addSounds(){
  audioLoader = new THREE.AudioLoader();
  backgroundsound = new THREE.Audio(listener);
  hitSound = new THREE.Audio(listener);
  pickupSound = new THREE.Audio(listener);

  audioLoader.load('../res/sound_effects/ambient_noise.wav',function(buffer){
    backgroundsound.setBuffer(buffer);
    backgroundsound.setLoop(true);
    backgroundsound.setVolume(0.3);
    backgroundsound.play();
  })

  audioLoader.load('../res/sound_effects/pick_up_item.wav',function(buffer){
    pickupSound.setBuffer(buffer);
    pickupSound.setVolume(0.2);
  })

  audioLoader.load('../res/sound_effects/hurt.mp3',function(buffer){
    hitSound.setBuffer(buffer);
    hitSound.setVolume(0.2);
  })
}

function loadingScene(){
  //Loading manager that will be used to manage the loading screen
  var loadingManager = new THREE.LoadingManager();
  const progressBar = document.getElementById('progress-bar')
  const progressBarContainer = document.querySelector('.progress-bar-container')
  gltfLoader = new THREE.GLTFLoader(loadingManager);

  // Method to do things when we starting loading 
  loadingManager.onStart = function(url,item,total){
      progressBarContainer.style.display = 'block';
      progressBarContainer.style.position = 'absolute';
      console.log(`Started loading: ${url}`)
  }

  // Method called when the loading is under progress
  loadingManager.onProgress = function(url,loaded,total){
      progressBar.value = (loaded/total)*100;
  }

  // Method called called when the loading of the assest has finished
  loadingManager.onLoad = function(){
      progressBarContainer.style.display = 'none';
  }

  // Method called when there is an error
  loadingManager.onError = function(url){
      console.error(`Problem loading ${url}`)
  }
}

function GameLoop(){ //Run game loop(update -> render -> repeat)
  update();
  render();
  requestAnimationFrame(GameLoop);
};

window.init = init
