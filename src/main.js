import { sky } from './sky.js';
import { Ground } from './ground.js';
import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import Monster from '../src/monster.js'

import  monster_ai  from '../src/monster_ai.js'
import {moonCreator, addSphereMoon ,torch } from './lights.js';
import {PointerLockControls} from './PointerLockControls.js'
import {HUD, tookDamage,changeInventorySelected} from './overlay.js'
import {makeFirstFloor,makeSecondFloor,makeBasement,makeFourthFloor,removeFloor} from './house_collision.js'
import { Reflector } from '../lib/Reflector.js'

// variables to set up scene with camera
var  camera;
var scene;
var renderer;
var world;

// control variables to time actions correctly
const timestep = 1/60
var delta = 0
var time = new Date().getTime()
var speed = 0
var t = 41;
var selected = 0;

// HUD control variables
var paused = false;
var curr_lvl = null;
var lvl = null;
var lvl1_uuid = "";
var lvl2_uuid = "";
var lvl3_uuid = "";
var lvl4_uuid = "";
var sceneHUD;
var cameraHUD;
var mousePos;

// items added to scene
var player;
var monster;
var ground;
var moonLight;
var moonSphere;
var torchLight;
var skybox;


// Initialization of game (world, level, HUD, etc.)
var init = function(){
  let world_canvas = document.getElementById('MainWorld');
  var hud_canvas = document.getElementById('myCanvas');
  const progressBarContainer = document.querySelector('.progress-bar-container');
  world_canvas.width = window.innerWidth - 20;
  world_canvas.height = window.innerHeight - 20;
  hud_canvas.width = window.innerWidth;
  hud_canvas.height = window.innerHeight;
  progressBarContainer.style.display = 'none'; //hide loading screen


  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
  })

  scene = new THREE.Scene();
	
  camera = new THREE.PerspectiveCamera(
    95, // field of view (fov)
    window.innerWidth/window.innerHeight, // browser aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );
  
  renderer = new THREE.WebGLRenderer({
    maxLights: 8,
    canvas: world_canvas,
  });
  renderer.setSize(window.innerWidth, window.innerHeight,);
  renderer.shadowMap.enabled = true;
  renderer.autoClear = false;
  
  document.body.appendChild(renderer.domElement);

  mousePos = new THREE.Vector2();

  //Create and add ground mesh to scene
  ground = new Ground(scene, world)
  
  //Setting up the moon. The moon contains a directional light, a mesh and a texture
  moonLight = moonCreator(0xFFFFFF,0.8,10000,1,-0.0045);
  scene.add(moonLight);
  moonSphere = addSphereMoon(2);
  scene.add(moonSphere);
  
  //Creates and dds skybox to scene
  skybox = sky();
  scene.add(skybox);

  const initial_position = new CANNON.Vec3(0, 1, 0); //Initial player position for opening sandbox exploration

  var path = [
    new THREE.Vector3(2, 0, 2), 
    new THREE.Vector3(2, 0, -2),
    new THREE.Vector3(-2, 0, -2),
    new THREE.Vector3(-2, 0, 2)
  ]

  const monsters = [];
  player = new Player(scene, world, camera, initial_position, monsters); //Create and add player to scene and physics world

  //var monster_v2 = new monster_ai(scene,player);

  // create and add ambient light to scene
  const light = new THREE.AmbientLight();
  light.intensity = 0.4; //dim light for atmosphere
  scene.add(light);

  monster = new Monster(scene, world,new THREE.Vector3(-11, 1, -12), path, player, true); //Create and add monster to scene and physics world
  monsters.push(monster);

  const PointerLock = new PointerLockControls(camera,document.body); //Mouse controls to control camera and player rotation 
  hud_canvas.addEventListener('click', function (){ //activate controls by clicking on screen
	  PointerLock.lock();
	});

  createMenu()//create menu screen overlay (level selection)
  
  //Create and add spotlight tos scene (acts as player torch)
  torchLight = torch(0xFFFFFF, 1, 5 , 1, -0.004, [0, 0, 0]);
  scene.add(torchLight);

  window.addEventListener('resize', () => { //keep playing area relative to the scene
    hud_canvas.width = window.innerWidth;
    hud_canvas.height = window.innerHeight;
    /*sprite.position.set(-window.innerWidth / 4, window.innerHeight / 4, 0);
    sprite2.position.set(window.innerWidth / 4, window.innerHeight / 4, 0);
    sprite3.position.set(-window.innerWidth / 4, -window.innerHeight / 4, 0);
    sprite4.position.set(window.innerWidth / 4, -window.innerHeight / 4, 0);*/
    renderer.setSize(window.innerWidth,window.innerHeight);
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

  window.addEventListener('mousedown',(e)=>{
    console.log("clicked")
    console.log("Level: ",lvl)
    
    if(lvl==1){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=1){
        removeFloor(scene,world,curr_lvl)
        curr_lvl=1;
        makeFirstFloor(scene,world);
        player.body.position.set(0,2,-13)
      }
    }
    else if(lvl==2){
      if(curr_lvl!=2){
        removeFloor(scene,world,curr_lvl);
        curr_lvl=2;
        makeSecondFloor(scene,world);
        player.body.position.set(-10.5,1,-1)
      }

      const mirrorOptions = {
        clipBias: 0.000,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x808080,
        multisample: 4,
      }

      const mirrorGeo = new THREE.PlaneGeometry(1, 1);
      const mainBathroomMirror = new Reflector(mirrorGeo, mirrorOptions);
      const bedroomBathroomMirror = new Reflector(mirrorGeo, mirrorOptions);
      mainBathroomMirror.rotation.y = -Math.PI/2
      mainBathroomMirror.position.set(4.85, 0.85, 2);
      bedroomBathroomMirror.rotation.y = Math.PI/2
      bedroomBathroomMirror.position.set(-12.35, 0.85, -2);
      scene.add(mainBathroomMirror);
      scene.add(bedroomBathroomMirror);

      const loader = new THREE.GLTFLoader()
      let mainMirrorFrame;
      let bedroomMirrorFrame

      loader.load("../res/meshes/SecondFloor/MirrorFrame.glb", function(gltf){
        bedroomMirrorFrame = gltf.scene;
        bedroomMirrorFrame.position.set(-12.35, 0.3, -2);
        bedroomMirrorFrame.rotation.y = -Math.PI/2
        bedroomMirrorFrame.scale.set(0.55, 0.55);
        scene.add(bedroomMirrorFrame);
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }, (error) => {
        console.log(error);
      });

      loader.load("../res/meshes/SecondFloor/MirrorFrame.glb", function(gltf){
        mainMirrorFrame = gltf.scene;
        mainMirrorFrame.position.set(4.85, 0.3, 2);
        mainMirrorFrame.rotation.y = -Math.PI/2
        mainMirrorFrame.scale.set(0.55, 0.55);
        scene.add(mainMirrorFrame);
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }, (error) => {
        console.log(error);
      });
    }
    else if(lvl==3){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=3){
        removeFloor(scene,world,curr_lvl);
        curr_lvl=3;
        makeBasement(scene,world);
        player.body.position.set(-10.5,1,-12)
      }
    }
    else if(lvl==4){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=4){
        removeFloor(scene,world,curr_lvl);
        curr_lvl=4;
        makeFourthFloor(scene,world);
        player.body.position.set(-11.5,1,13)
      }
    }
    paused = false;
  })


  GameLoop()
};

function update(){ //Game Logic
  if(!paused){ // Run Game if not paused
    const new_time = new Date().getTime();
    delta = new_time - time;
    time = new_time;
    monster.update(delta);
    player.update(delta)
    ground.update()

    //Showing that we can decrease the visible hearts on the fly
    const d = new Date();
    if(d.getMinutes() == t){
      selected+=2;
      tookDamage(1.5);
      changeInventorySelected(selected)
      HUD(8,[1,2,3,4,5,6,7,-1]);
      t+=1;
    }
    HUD(8,[1,2,3,4,5,6,7,-1]);


    //Move the moon and skybox only when you can see them to reduce the compuation needed
    if(curr_lvl == 4){
      //Rotates and moves the moon
      speed += 0.001
      moonLight.position.y = 20 * (Math.sin(speed)) + 50;
      moonLight.position.z = 10 * (Math.cos(speed));
      moonSphere.position.y = 20 * (Math.sin(speed)) + 50;
      moonSphere.position.z = 10 * (Math.cos(speed));
      moonSphere.rotation.x += 0.005;
      moonSphere.rotation.y += 0.005;
      moonSphere.rotation.z += 0.005;
      
      //Rotates the skybox
      skybox.rotation.x+=0.0005;
      skybox.rotation.y+=0.0005;
      skybox.rotation.z+=0.0005;
    }
    else{
      moonLight.position.set(0,10,0);
      moonSphere.position.set(0,10,0);
    }
    
    world.step(timestep)
    torchLight.position.set(player.position.x,player.position.y,player.position.z)
  }
  else{
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(mousePos,cameraHUD);
    const intersects = rayCaster.intersectObjects(sceneHUD.children);
    if(intersects.length==0){
      console.log("Nothing selected")
      lvl = null;
    }
    else if(intersects[0].object.uuid === lvl1_uuid){
      console.log("Level 1 Highlighted")
      lvl = 1;
    }
    else if(intersects[0].object.uuid === lvl2_uuid){
      console.log("Level 2 Highlighted")
      lvl = 2;
    }
    else if(intersects[0].object.uuid === lvl3_uuid){
      console.log("Level 3 Highlighted")
      lvl = 3;
    }
    else{
      console.log("Level 4 Highlighted")
      lvl = 4;
    }
  }
};

function render(){// Draw scene
  renderer.render(scene, camera);
  if(paused){
    //renderer.clearDepth();
    renderer.render(sceneHUD, cameraHUD); 
  }
};

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

  var sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(-window.innerWidth / 4, window.innerHeight / 4, 0);
  sprite.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

  var spriteMaterial2 = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/Level2.jpg")
  });

  var sprite2 = new THREE.Sprite(spriteMaterial2);
  sprite2.position.set(window.innerWidth / 4, window.innerHeight / 4, 0);
  sprite2.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

  var spriteMaterial3 = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/Level3.jpg")
  });

  var sprite3 = new THREE.Sprite(spriteMaterial3);
  sprite3.position.set(-window.innerWidth / 4, -window.innerHeight / 4, 0);
  sprite3.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

  var spriteMaterial4 = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("../res/textures/pause_menu/Level4.jpg")
  });

  var sprite4 = new THREE.Sprite(spriteMaterial4);
  sprite4.position.set(window.innerWidth / 4, -window.innerHeight / 4, 0);
  sprite4.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);
  
  lvl1_uuid = sprite.uuid;
  lvl2_uuid = sprite2.uuid;
  lvl3_uuid = sprite3.uuid;
  lvl4_uuid = sprite4.uuid

  sceneHUD.add(sprite);
  sceneHUD.add(sprite2);
  sceneHUD.add(sprite3);
  sceneHUD.add(sprite4);
}

function GameLoop(){ //Run game loop(update -> render -> repeat)
  update();
  render();
  requestAnimationFrame(GameLoop);
};

window.init = init
