var j = 0;

var init = function(){
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
    cube = gltf.scene;
    cube.position.set(0,-1,-4);
    cube.scale.set(0.1, 0.1, 0.1);
    scene.add(cube);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });

  const light = new THREE.AmbientLight();
  scene.add(light);

  var update = function(){//game logic
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