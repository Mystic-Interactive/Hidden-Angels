import { sky } from './sky.js';
import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import Monster from '../src/monster.js'

import { pointLightCreator, InteriorWallLightCreator, ChandelierCreator, BedroomLightCreator, moonCreator, addSphereMoon } from './lights.js';
import {PointerLockControls} from './PointerLockControls.js'
import {makeHouse,makeFirstFloor} from './house_collision.js'
import * as YUKA from '../lib/yuka.module.js'
import {Monster_AI} from './monsterAI.js'
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
  
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight,);
  renderer.shadowMap.enabled = true;
  
  document.body.appendChild(renderer.domElement);
  
  makeFirstFloor(scene,world);
  
  //Setting up the moon
  var moonLight = moonCreator(0xFFFFFF,0.8,10000,1)
  scene.add(moonLight);
  var moonSphere = addSphereMoon(2);
  scene.add(moonSphere)
  
  //Added skybox
  const skybox = sky()
  scene.add(skybox)

  const initial_position = new CANNON.Vec3(0, 0, 5)

  const guy = new Player(scene, world, camera)

  var path = [
    new THREE.Vector3(0, 0, 0), 
    new THREE.Vector3(0, 0, 10), 
    new THREE.Vector3(10, 0, 10), 
    new THREE.Vector3(10, 0, 0)
  ]
  
  const monster = new Monster(scene, world,new THREE.Vector3(1, 0, 10), path)
  const light = new THREE.AmbientLight();
  light.intensity=0.5;
  scene.add(light);

  const timestep = 1/60

  const g = new Ground(scene, world)

  scene.add(g)

  var delta = 0
  var time = new Date().getTime()
  var speed = 0

 const PointerLock = new PointerLockControls(camera,document.body);
 const blocker = document.getElementById( 'blocker_child' );
	blocker.addEventListener( 'click', function () {
		PointerLock.lock();
	} );

  //yuka AI stuff
  const monster_ai = new Monster_AI();
  scene.add(monster_ai.vehicleMesh);
  //end of yuka AI stuff
  var update = function(){//game logic
    monster_ai.update();
    const new_time = new Date().getTime() 
    delta = new_time - time
    time = new_time
    guy.update(delta)
    monster.update(delta)
    g.update()

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
    moonSphere.rotation.x+=0.005;
    moonSphere.rotation.y+=0.005;
    moonSphere.rotation.z+=0.005;

    world.step(timestep)
  };

  var render = function(){//draw scene
    renderer.render(scene, camera);
  };

  var GameLoop = function(){//run game loop(update, render, repeat)
    update();
    render();
    requestAnimationFrame(GameLoop);
  };

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
  })

  GameLoop()
};

window.init = init
