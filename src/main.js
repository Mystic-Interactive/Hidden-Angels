import { sky } from './sky.js';
import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import Monster from '../src/monster.js'

import  monster_ai  from '../src/monster_ai.js'
import {moonCreator, addSphereMoon ,torch } from './lights.js';
import {PointerLockControls} from './PointerLockControls.js'
import {HUD, tookDamage,changeInventorySelected} from './overlay.js'
import {makeFirstFloor,makeSecondFloor,makeBasement,makeFourthFloor,removeFloor} from './house_collision.js'
import { Reflector } from '../lib/Reflector.js'

var paused = false;
var curr_lvl = null;
var lvl = null;
var lvl1_uuid = "";
var lvl2_uuid = "";
var lvl3_uuid = "";
var lvl4_uuid = "";



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
    let aoColor = textLoader.load("./textures/forrest_ground_01_rough_ao_1k.jpg");

    // Create plane with ground textures
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), 
      new THREE.MeshLambertMaterial({ // Lambert Material used so shadows look smooth
        map: baseColor,
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

// Initialization of game (world, level, HUD, etc.)
var init = function(){
  var hud_canvas = document.getElementById('myCanvas');
  hud_canvas.width = window.innerWidth;
  hud_canvas.height = window.innerHeight;


  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
  })

  var scene = new THREE.Scene();
	
  var camera = new THREE.PerspectiveCamera(
    95, // field of view (fov)
    window.innerWidth/window.innerHeight, // browser aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );
  
  var renderer = new THREE.WebGLRenderer({maxLights: 8});
  renderer.setSize(window.innerWidth, window.innerHeight,);
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

  const initial_position = new CANNON.Vec3(0, 1, 5)




  var path = [
    new THREE.Vector3(2, 0, 2), 
    new THREE.Vector3(2, 0, -2),
    new THREE.Vector3(-2, 0, -2),
    new THREE.Vector3(-2, 0, 2)
  ]
  const monsters = []
  const player = new Player(scene, world, camera, initial_position, monsters)
  const monster = new Monster(scene, world,new THREE.Vector3(1, 0, -6), path, player)
  monsters.push(monster)
 // const fpCamera = new FirstPersonCamera(camera);
  //var monster_v2 = new monster_ai(scene,player);
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
      "../res/textures/pause_menu/level-1.png")});
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(0,window.innerHeight/3,0);
      sprite.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

      var spriteMaterial2 = new THREE.SpriteMaterial({map:
        THREE.ImageUtils.loadTexture(
        "../res/textures/pause_menu/level-2.png")});
        var sprite2 = new THREE.Sprite(spriteMaterial2);
        sprite2.position.set(0,window.innerHeight/12,0);
        sprite2.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

        var spriteMaterial3 = new THREE.SpriteMaterial({map:
          THREE.ImageUtils.loadTexture(
          "../res/textures/pause_menu/level-3.png")});
          var sprite3 = new THREE.Sprite(spriteMaterial3);
          sprite3.position.set(0,-window.innerHeight/6,0);
          sprite3.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);

        var spriteMaterial4 = new THREE.SpriteMaterial({map:
           THREE.ImageUtils.loadTexture(
           "../res/textures/pause_menu/level-4.png")});
           var sprite4 = new THREE.Sprite(spriteMaterial4);
           sprite4.position.set(250,-window.innerHeight/8,0);
           sprite4.scale.set(window.innerHeight/1.75,window.innerWidth/10,1);
      
      lvl1_uuid = sprite.uuid;
      lvl2_uuid = sprite2.uuid;
      lvl3_uuid = sprite3.uuid;
      lvl4_uuid = sprite4.uuid

      sceneHUD.add(sprite);
      sceneHUD.add(sprite2);
      sceneHUD.add(sprite3);
      sceneHUD.add(sprite4);


var t =41;
var selected = 0;
      
var torchLight = torch(0xFFFFFF,1,5,1,-0.004,[0,0,0])
scene.add(torchLight)
  var update = function(){//game logic
    if(!paused){
      monster.update( delta );
      const new_time = new Date().getTime()
      delta = new_time - time
      time = new_time
      player.update(delta)
      //monster.update(delta)
      g.update()

      //Showing that we can decrease the visible hearts on the fly
      const d = new Date();
      // console.log(d.getMinutes())
      if(d.getMinutes()==t){
        selected+=2;
        tookDamage(1.5);
        changeInventorySelected(selected)
        HUD(8,[1,2,3,4,5,6,7,-1]);
        t+=1;
      }
      HUD(8,[1,2,3,4,5,6,7,-1]);

      

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
      torchLight.position.set(player.position.x,player.position.y,player.position.z)

      



      //stats.end()
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

  var render = function(){//draw scene
    renderer.render(scene, camera);
    if(paused){
      //renderer.clearDepth();
      renderer.render(sceneHUD, cameraHUD); 
    }
    
  };

  var GameLoop = function(){//run game loop(update, render, repeat)
    update();
    render();
    requestAnimationFrame(GameLoop);
  };

  window.addEventListener('resize', () => {
    hud_canvas.width = window.innerWidth;
    hud_canvas.height = window.innerHeight;
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
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
  })
  
  window.addEventListener('mousemove',(e)=>{
    mousePos.x = (e.clientX/window.innerWidth)*2-1;
    mousePos.y = - (e.clientY/window.innerHeight)*2+1;
  })

  window.addEventListener('mousedown',(e)=>{
    console.log("clicked")
    console.log("Level: ",lvl)
    paused=false;
    if(lvl==1){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=1){
        removeFloor(scene,world,curr_lvl)
        curr_lvl=1;
        makeFirstFloor(scene,world);
        player.body.position.set(-11.5,0,-13)
      }
    }

    if(lvl==2){
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
    if(lvl==3){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=3){
        removeFloor(scene,world,curr_lvl);
        curr_lvl=3;
        makeBasement(scene,world);
        player.body.position.set(-10.5,-0.75,-12)
      }
    }
    if(lvl==4){
      console.log("Current level: ",curr_lvl)
      if(curr_lvl!=4){
        removeFloor(scene,world,curr_lvl);
        curr_lvl=4;
        makeFourthFloor(scene,world);
        player.body.position.set(-11.5,0,-13)
      }
    }
  })


  GameLoop()
};

window.init = init
