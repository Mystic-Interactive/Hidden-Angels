import { sky } from './sky.js';
import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import { Guy } from './guy.js';
import { FirstFloor } from './level2.js'
import { FirstPersonCamera } from './FirstPersonControls.js'
import { pointLightCreator, InteriorWallLightCreator, ChandelierCreator, BedroomLightCreator, moonCreator, addSphereMoon } from './lights.js';


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
  
  document.body.appendChild(renderer.domElement);

  const level = new FirstFloor(scene, world, camera);
  scene.add(level);
  
  /*var cube;
  const loader = new THREE.GLTFLoader();
  loader.load('../res/meshes/House.glb', function(gltf){
    cube = gltf.scene
    cube.position.set(5,-0.83,-4);
    cube.scale.set(1, 1, 1);

        //Creating shadows for each child mesh
        gltf.scene.traverse(function(node){
          if(node.type === 'Mesh'){     
              node.castShadow=true;
              node.receiveShadow=true; //allows us to put shadows onto the walls
          }
        });

    scene.add(cube);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });*/

  //Adds the interior wall lights
  //InteriorWallLightCreator(0xFFFFFF,0.5,50,1,scene,[0,2,0],[1,1,1],[0,0,0])
  //ChandelierCreator(0xFFFFFF,0.1,50,1,scene,[0,2,0],[1,1,1],[0,0,0])
  //BedroomLightCreator(0xFFFFFF,0.1,25,1,scene,[0,1.75,10],[1,1,1],[0,0,0])
  
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
  const fpCamera = new FirstPersonCamera(camera);
  const light = new THREE.AmbientLight();
  light.intensity=0.2;
  scene.add(light);

  const timestep = 1/60

  const g = new Ground(scene, world)
  console.log(g)

  scene.add(g)

  var delta = 0
  var time = new Date().getTime()
  var speed= 0

  var update = function(){//game logic
    //stats.begin()
    const new_time = new Date().getTime()
    delta = new_time - time
    time = new_time
    guy.update(delta)
    g.update()

    //Rotates the skybox
    skybox.rotation.x+=0.0005;
    skybox.rotation.y+=0.0005;
    skybox.rotation.z+=0.0005;

    //Move the moon
    speed+=0.001
    moonLight.position.y = 20*(Math.sin(speed))+10;
    moonLight.position.z = 10*(Math.cos(speed));
    moonSphere.position.y = 20*(Math.sin(speed))+10;
    moonSphere.position.z = 10*(Math.cos(speed));

    world.step(timestep)
    fpCamera.update();
    //stats.end()
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
