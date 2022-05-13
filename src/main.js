import { sky } from './sky.js';
import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import { Guy } from './guy.js';
import { FirstFloor } from './level2.js'
import { pointLightCreator, InteriorWallLightCreator, ChandelierCreator, BedroomLightCreator, moonCreator, addSphereMoon } from './lights.js';
import {PointerLockControls} from './PointerLockControls.js'
import {HUD, tookDamage,changeInventorySelected} from './overlay.js'
import {makeHouse,makeFirstFloor} from './house_collision.js'


class Ground extends THREE.Group{
  constructor(scene, world){
    super();
    this.scene = scene;
    this.world = world;
    this.define()
  }
  
  define(){
    const textLoader = new THREE.TextureLoader();
    let baseColor = textLoader.load("./textures/forrest_ground_01_diff_1k.jpg");
    let normalColor = textLoader.load("./textures/forrest_ground_01_disp_1k.jpg");
    let heightColor = textLoader.load("./textures/forrest_ground_01_nor_gl_1k.jpg");
    let roughnessColor = textLoader.load("./textures/forrest_ground_01_rough_1k.jpg");
    let aoColor = textLoader.load("./textures/forrest_ground_01_rough_ao_1k.jpg");

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 512, 512), 
      new THREE.MeshLambertMaterial({
        map: baseColor,
        normalMap: normalColor,
        displacementMap: heightColor,
        displacementScale: 0.2,
        roughnessMap: roughnessColor,
        aoMap: aoColor,
      })
    );
    ground.geometry.attributes.uv2 = ground.geometry.attributes.uv;
    this.add(ground)
    this.body = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(60, 60, 0.1)),
      type: CANNON.Body.STATIC,
      material: new CANNON.Material()
    })

    this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    ground.receiveShadow = true;
    ground.castShadow = true;

    this.body.position.y = -1
    
    this.scene.add(this)
    this.world.addBody(this.body)

  }
  
  update(){
    try{
      this.position.copy(this.body.position)
      this.quaternion.copy(this.body.quaternion)
    }catch{
      console.log("umm")
    }
    
  }
}

var init = function(){
  //var stats = new Stats()
  //stats.showPanel(5)
  //document.body.appendChild( stats.dom )

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
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight,);
  renderer.shadowMap.enabled = true;
  renderer.autoClear=false;
  
  document.body.appendChild(renderer.domElement);

  const level = new FirstFloor(scene, world, camera);
  scene.add(level);
  
  var hudCanvas = document.createElement('canvas');
  
  // Again, set dimensions to fit the screen.
  hudCanvas.width = window.innerWidth;
  hudCanvas.height = window.innerHeight;

  //Adds canvas HUD
  HUD(8);
  // tookDamage();
  // HUD(8);



  var hudBitmap = hudCanvas.getContext('2d');
	hudBitmap.font = "Normal 80px Arial";
  hudBitmap.textAlign = 'center';
  hudBitmap.fillStyle = "rgba(245,245,245,0.75)"; 

  // Create the camera and set the viewport to match the screen dimensions.
  var cameraHUD = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 0, 30 );

  // Create also a custom scene for HUD.
  var sceneHUD = new THREE.Scene();
 
	// Create texture from rendered graphics.
	var hudTexture = new THREE.Texture(hudCanvas) 
	hudTexture.needsUpdate = true;

  // Create HUD material.
  var material = new THREE.MeshBasicMaterial( {map: hudTexture} );
  material.transparent = true;

  var planeGeometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );
  var plane = new THREE.Mesh( planeGeometry, material );
  sceneHUD.add( plane );

  //Adds the interior wall lights
  //InteriorWallLightCreator(0xFFFFFF,0.5,50,1,scene,[0,2,0],[1,1,1],[0,0,0])
  //ChandelierCreator(0xFFFFFF,0.1,50,1,scene,[0,2,0],[1,1,1],[0,0,0])
  // BedroomLightCreator(0xFFFFFF,0.1,25,1,scene,[0,1.75,0],[1,1,1],[0,0,0])
  
  //Setting up the moon
  var moonLight = moonCreator(0xFFFFFF,0.8,10000,1)
  scene.add(moonLight);
  var moonSphere = addSphereMoon(2);
  scene.add(moonSphere)
  
  //Added skybox
  const skybox = sky()
  scene.add(skybox)

    // //Create a box
    // const boxGeo = new THREE.BoxGeometry(2,2,2);
    // const boxMat = new THREE.MeshBasicMaterial({
    //    color: 0xff0000,
    // });
    // const box = new THREE.Mesh(boxGeo,boxMat);
    // scene.add(box);
  
    // const boxBody = new CANNON.Body({
    //     shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
    //     mass: 1,
    //     position: new CANNON.Vec3(0,0,0)
    // });
  
    // world.addBody(boxBody);

  const initial_position = new CANNON.Vec3(0, 0, 5)
  const guy = new Player(scene, world, camera)
 // const fpCamera = new FirstPersonCamera(camera);
  const light = new THREE.AmbientLight();
  light.intensity=0.5;
  scene.add(light);

  const timestep = 1/60

  const g = new Ground(scene, world)

  scene.add(g)

  var delta = 0
  var time = new Date().getTime()
  var speed= 0

 const PointerLock = new PointerLockControls(camera,document.body);
 const blocker = document.getElementById( 'myCanvas' );
	blocker.addEventListener( 'click', function () {
		PointerLock.lock();
	} );

var t =0;
var selected = 0;


  var update = function(){//game logic
    //stats.begin()
    const new_time = new Date().getTime()
    delta = new_time - time
    time = new_time
    guy.update(delta)
    g.update()

    //Showing that we can decrease the visible hearts on the fly
    const d = new Date();
    console.log(d.getMinutes())
    if(d.getMinutes()==t){
      selected+=2;
      tookDamage();
      changeInventorySelected(selected)
      HUD(8);
      t+=1;
    }
    HUD(8);

    //Rotates the skybox
    skybox.rotation.x+=0.0005;
    skybox.rotation.y+=0.0005;
    skybox.rotation.z+=0.0005;

    //Move the moon
    speed+=0.001
    moonLight.position.y = 20*(Math.sin(speed))+50;
    moonLight.position.z = 10*(Math.cos(speed));
    moonSphere.position.y = 20*(Math.sin(speed))+50;
    moonSphere.position.z = 10*(Math.cos(speed));

    // //Physics bodies movement
    // box.position.copy(boxBody.position); //Copy position
    // box.quaternion.copy(boxBody.quaternion); //Copy orientation

    world.step(timestep)

    // Update HUD graphics.
    hudBitmap.clearRect(0, 0, window.innerWidth, window.innerHeight);
    hudBitmap.fillText("+ " , window.innerWidth / 2, window.innerHeight / 2);
  	hudTexture.needsUpdate = true;
    
    //stats.end()
  };

  var render = function(){//draw scene
    renderer.render(scene, camera);
    //renderer.render(sceneHUD, cameraHUD); 
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

  GameLoop()
};

window.init = init
