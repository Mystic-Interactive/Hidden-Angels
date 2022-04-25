import Guy from './guy.js'
import * as CANNON from '../lib/cannon-es.js'
var j = 0;


class Ground extends THREE.Group{
  constructor(scene, world){
    super();
    this.scene = scene;
    this.world = world;
    this.define()
  }
  
  define(){
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    /*const groundMat = new THREE.MeshBasicMaterial({
      color: 0xfc0f03,
      side: THREE.DoubleSide,
      wireframe: true
    })*/
    const groundMat = new THREE.MeshNormalMaterial()

    this.body = new CANNON.Body({
      shape: new CANNON.Box(new CANNON.Vec3(100, 100, 0.1)),
      type: CANNON.Body.STATIC,
      material: new CANNON.Material()
    })

    this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    this.body.position.y = -1

    this.add(new THREE.Mesh(groundGeo, groundMat))
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
    gravity: new CANNON.Vec3(0, -9.81, 0)
  })

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    75, // field of view (fov)
    window.innerWidth/window.innerHeight, // browser aspect ratio
    0.1, // near clipping plane
    1000 // far clipping plane
  );
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight,);

  document.body.appendChild(renderer.domElement);

  var cube;
  const loader = new THREE.GLTFLoader();
  loader.load('../res/meshes/House.glb', function(gltf){
    cube = gltf.scene
    cube.position.set(5,-1,-4);
    cube.scale.set(0.1, 0.1, 0.1);
    scene.add(cube);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });

  const guy = new Guy(scene, world, camera)

  const light = new THREE.AmbientLight();
  scene.add(light);

  const timestep = 1/60

  const g =new Ground(scene, world)
  console.log(g)

  scene.add(g)

  var update = function(){//game logic
    guy.update()
    g.update()
    world.step(timestep)
    j++;
    if (cube != null){
      cube.rotation.y = 0.005*j;
    }
  };

  var render = function(){//draw scene
    renderer.render(scene, camera);
  };

  var GameLoop = function(){//run game loop(update, render, repeat)
    j++;
    update();
    render();
    requestAnimationFrame(GameLoop);
  };

  GameLoop()
};

window.init = init