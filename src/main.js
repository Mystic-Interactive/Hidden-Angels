import { sky } from './sky.js';
import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import Monster from '../src/monster.js'

import  monster_ai  from '../src/monster_ai.js'
import {moonCreator, addSphereMoon ,torch } from './lights.js';
import {PointerLockControls} from './PointerLockControls.js'
import {HUD, tookDamage,changeInventorySelected,clearInventory,setDeathScreen, resetHealth} from './overlay.js'
import {makeFirstFloor,makeSecondFloor,makeBasement,makeFourthFloor,removeFloor} from './house_collision.js'
import {detectObject,UI, removeAllDyamics,initialiseDynamics} from './house_dynamic.js'

var paused = false;
var curr_lvl = null;
var lvl = null;
var lvl1_uuid = "";
var lvl2_uuid = "";
var lvl3_uuid = "";
var lvl4_uuid = "";
var next_uuid = "";
var death_uuid = "";
var goToNext = false;
var deathScreen = false;
var restart = false;

// Class to make the world's surface 
class Ground extends THREE.Group{
  // Constructor to get scene and camera and place plane in world
  constructor(scene, world){
    super();
    this.scene = scene;
    this.world = world;
    this.define()
  }
  
  define(){ // Create plane with ground textures and add it to world
    const textLoader = new THREE.TextureLoader();
    let baseColor = textLoader.load("./textures/forrest_ground_01_diff_1k.jpg");
    let normalColor = textLoader.load("./textures/forrest_ground_01_disp_1k.jpg");
    let heightColor = textLoader.load("./textures/forrest_ground_01_nor_gl_1k.jpg");
    let roughnessColor = textLoader.load("./textures/forrest_ground_01_rough_1k.jpg");
    let aoColor = textLoader.load("./textures/forrest_ground_01_rough_ao_1k.jpg");

    // Create plane with ground textures
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 512, 512), 
      new THREE.MeshLambertMaterial({ // Lambert Material used so shadows look smooth
        map: baseColor,
        normalMap: normalColor,
        displacementMap: heightColor,
        displacementScale: 0.2,
        roughnessMap: roughnessColor,
        aoMap: aoColor,
      })
    );
    ground.geometry.attributes.uv2 = ground.geometry.attributes.uv;

    this.body = new CANNON.Body({ // create physics body for plane
      shape: new CANNON.Box(new CANNON.Vec3(60, 60, 0.1)), // Cannon.js planes are infinite so use a cube instead
      type: CANNON.Body.STATIC,// Isn't affected by gravity
      material: new CANNON.Material()
    })

    // Enable shadows on surface
    this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    ground.receiveShadow = true;
    ground.castShadow = true;

    this.body.position.y = -1 
    
    // Add both body and plane to world
    this.add(ground)
    this.scene.add(this)
    this.world.addBody(this.body)
  }
  
  update(){ // link the physics body to the plane
    try{
      this.position.copy(this.body.position)
      this.quaternion.copy(this.body.quaternion)
    }catch{
      // console.log("umm")
    }
    
  }
}

function getNextLevel(){
  if(lvl<4){
    return lvl+1;
  }
  return -1
}

// Initialization of game (world, level, HUD, etc.)
var init = function(){
  var hud_canvas = document.getElementById('myCanvas');
  hud_canvas.width = window.innerWidth;
  hud_canvas.height = window.innerHeight;

  const progressBarContainer = document.querySelector('.progress-bar-container')
  progressBarContainer.style.display = 'none';

  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -98.1, 0)
  })

  var scene = new THREE.Scene();
	
  var camera = new THREE.PerspectiveCamera(
    95, // field of view (fov)
    window.innerWidth/window.innerHeight, // browser aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );
  
  var renderer = new THREE.WebGLRenderer({maxLights: 8});
  renderer.setSize(0.999*window.innerWidth,0.999* window.innerHeight,);
  renderer.shadowMap.enabled = true;
  renderer.autoClear=false;
  
  document.body.appendChild(renderer.domElement);

  const mousePos = new THREE.Vector2();
  
  //Setting up the moon
  var moonLight = moonCreator(0xFFFFFF,0.8,10000,1,-0.0045);
  scene.add(moonLight);
  var moonSphere = addSphereMoon(2);
  scene.add(moonSphere)
  
  //Added skybox
  const skybox = sky()
  scene.add(skybox)

  const initial_position = new CANNON.Vec3(0, 0, 5)

  const guy = new Player(scene, world, camera)



  var path = [
    new THREE.Vector3(10, 0, 0), 
    new THREE.Vector3(-10, 0, 0)
  ]
  
 // const monster = new Monster(scene, world,new THREE.Vector3(1, 0, 10), path)
 // const fpCamera = new FirstPersonCamera(camera);
  var monster_v2 = new monster_ai(scene,guy);
  const light = new THREE.AmbientLight();
  // light.intensity=0.02;
  light.intensity=1;
  scene.add(light);

  const timestep = 1/60

  const g = new Ground(scene, world)

  scene.add(g)

  var delta = 0
  var time = new Date().getTime()
  var speed = 0

 const PointerLock = new PointerLockControls(camera,document.body);
 const blocker = document.getElementById( 'myCanvas' );
	blocker.addEventListener( 'click', function () {
		PointerLock.lock();
	} );


  //Creating the pause menu
  var container = document.createElement('canvas');
  container.setAttribute(
    "style","width:1px; height:1px","position:absolute");
    document.body.appendChild( container );
    var cameraHUD = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2,window.innerHeight / - 2, - 500, 1000 );
      cameraHUD.position.x = 0;
      cameraHUD.position.y = 0;
      cameraHUD.position.z = 0;
    
    var sceneHUD = new THREE.Scene();

    var spriteMaterial = new THREE.SpriteMaterial({map:
      THREE.ImageUtils.loadTexture(
      "../res/textures/pause_menu/Level1.jpg")});
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(-window.innerWidth/4,window.innerHeight/4,0);
      sprite.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

      var spriteMaterial2 = new THREE.SpriteMaterial({map:
        THREE.ImageUtils.loadTexture(
        "../res/textures/pause_menu/Level2.jpg")});
        var sprite2 = new THREE.Sprite(spriteMaterial2);
        sprite2.position.set(window.innerWidth/4,window.innerHeight/4,0);
        sprite2.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

        var spriteMaterial3 = new THREE.SpriteMaterial({map:
          THREE.ImageUtils.loadTexture(
          "../res/textures/pause_menu/Level3.jpg")});
          var sprite3 = new THREE.Sprite(spriteMaterial3);
          sprite3.position.set(-window.innerWidth/4,-window.innerHeight/8,0);
          sprite3.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

        var spriteMaterial4 = new THREE.SpriteMaterial({map:
           THREE.ImageUtils.loadTexture(
           "../res/textures/pause_menu/Level4.jpg")});
           var sprite4 = new THREE.Sprite(spriteMaterial4);
           sprite4.position.set(window.innerWidth/4,-window.innerHeight/8,0);
           sprite4.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);
        
        var spriteNextMaterial = new THREE.SpriteMaterial({map:
          THREE.ImageUtils.loadTexture(
          "../res/textures/pause_menu/next_level.jpg")});
          var spriteNext = new THREE.Sprite(spriteNextMaterial);
          spriteNext.position.set(0,0,0);
          spriteNext.scale.set(window.innerHeight,window.innerWidth/5,1);
        
        var spriteFinishMaterial = new THREE.SpriteMaterial({map:
          THREE.ImageUtils.loadTexture(
          "../res/textures/pause_menu/next_level.jpg")});
          // var spriteFinish = new THREE.Sprite(spriteNextMaterial);
          // spriteNext.position.set(0,0,0);
          // spriteNext.scale.set(window.innerHeight,window.innerWidth/5,1);
          
        var spriteDeathMaterial = new THREE.SpriteMaterial({map:
          THREE.ImageUtils.loadTexture(
          "../res/textures/pause_menu/GameOver.jpg")});
          var spriteDeath = new THREE.Sprite(spriteDeathMaterial);
          spriteDeath.position.set(0,0,0);
          spriteDeath.scale.set(window.innerHeight,window.innerWidth/5,1);
                        
                       
      
      lvl1_uuid = sprite.uuid;
      lvl2_uuid = sprite2.uuid;
      lvl3_uuid = sprite3.uuid;
      lvl4_uuid = sprite4.uuid;
      next_uuid = spriteNext.uuid;
      death_uuid = spriteDeath.uuid;


initialiseDynamics(scene, sceneHUD, world, spriteNext)
setDeathScreen(spriteDeath,sceneHUD)

var t =9;
var selected = 0;

var torchLight = torch(0xFFFFFF,1,5,1,-0.004,[0,0,0])
scene.add(torchLight)
  var update = function(){//game logic

    //Raycaster for level selector
    const rayCasterHUD = new THREE.Raycaster();
    rayCasterHUD.setFromCamera(mousePos,cameraHUD);
    const intersectsHUD = rayCasterHUD.intersectObjects(sceneHUD.children);



    if(!paused){
      monster_v2.update();
      const new_time = new Date().getTime()
      delta = new_time - time
      time = new_time
      guy.update(delta)
      g.update()

      detectObject(guy)
      UI()

      //Showing that we can decrease the visible hearts on the fly
      const d = new Date();
      // console.log(d.getMinutes())
      if(d.getMinutes()==t){
        selected+=2;
        tookDamage(1.5);
        changeInventorySelected(selected)
        HUD();
        t+=1;
      }
      HUD();

      

      //Move the moon and skybox only when you can see them to reduce the compuation needed
      if(curr_lvl==4){
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
      }
      else{
        moonLight.position.set(0,10,0);
        moonSphere.position.set(0,10,0);
      }
      
      

      world.step(timestep)
      // console.log(camera.position)
      torchLight.position.set(guy.position.x,guy.position.y,guy.position.z)
        
      if(intersectsHUD.length>0){
        if(intersectsHUD[0].object.uuid === next_uuid){
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


      //stats.end()
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

  var render = function(){//draw scene
    renderer.render(scene, camera);
    
    if(paused){
      //renderer.clearDepth();
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

  var GameLoop = function(){//run game loop(update, render, repeat)
    update();
    render();
    requestAnimationFrame(GameLoop);
  };

  function lvlChange(curr_lvl){
    removeFloor(scene,world,curr_lvl)
    removeAllDyamics(scene,world);
    clearInventory();
    resetHealth();
    guy.body.position.set(0,1,-1);
  }

  window.addEventListener('resize', () => {
    hud_canvas.width = window.innerWidth;
    hud_canvas.height = window.innerHeight;
    renderer.setSize(0.98*window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    sprite.position.set(-window.innerWidth/4,window.innerHeight/4,0);
    sprite2.position.set(window.innerWidth/4,window.innerHeight/4,0);
    sprite3.position.set(-window.innerWidth/4,-window.innerHeight/8,0);
    sprite4.position.set(window.innerWidth/4,-window.innerHeight/8,0);
  })

  document.addEventListener('keydown',(e)=>{
    if(e.code=='Escape'){
      console.log("Bring up menu");
      paused = true;
    }
    else if(e.code=='Digit1'|| e.code =="Numpad1"){
      console.log("Pressed 1")
      changeInventorySelected(1);
    }
    else if(e.code=='Digit2'|| e.code =="Numpad2"){
      console.log("Pressed 2")
      changeInventorySelected(2);
    }
    else if(e.code=='Digit3'|| e.code =="Numpad3"){
      console.log("Pressed 3")
      changeInventorySelected(3);
    }
    else if(e.code=='Digit4'|| e.code =="Numpad4"){
      console.log("Pressed 4")
      changeInventorySelected(4);
    }
    else if(e.code=='Digit5'|| e.code =="Numpad5"){
      console.log("Pressed 5")
      changeInventorySelected(5);
    }
    else if(e.code=='Digit6'|| e.code =="Numpad6"){
      console.log("Pressed 6")
      changeInventorySelected(6);
    }
    else if(e.code=='Digit7'|| e.code =="Numpad7"){
      console.log("Pressed 7")
      changeInventorySelected(7);
    }
    else if (e.code=='Digit8'|| e.code =="Numpad8"){
      console.log("Pressed 8")
      changeInventorySelected(8);
    }
    /*else if(e.code=='KeyE'){
      console.log("Pressed E")
      if(curr_lvl==2){
        console.log("Is on level 2")
        removeObjectFromScene(scene,1)
        sceneHUD.remove(spriteItem)
      }
    }*/
  })
  
  window.addEventListener('mousemove',(e)=>{
    mousePos.x = (e.clientX/window.innerWidth)*2-1;
    mousePos.y = - (e.clientY/window.innerHeight)*2+1;
    if(curr_lvl==null){
      console.log("No current level")
    }
  })

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
      }
    }

    if(lvl==2){
      if(curr_lvl!=2|| restart){
        lvlChange(curr_lvl);
        curr_lvl=2;
        makeSecondFloor(scene,world);
      }
      
    }
    if(lvl==3){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=3 || restart){
        lvlChange(curr_lvl);
        curr_lvl=3;
        makeBasement(scene,world);
      }
      
    }
    if(lvl==4){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=4 || restart){
        lvlChange(curr_lvl);
        curr_lvl=4;
        makeFourthFloor(scene,world);
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

window.init = init
