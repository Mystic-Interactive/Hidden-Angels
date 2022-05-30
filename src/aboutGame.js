import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import {PointerLockControls} from './PointerLockControls.js'

// Initialization of game (world, level, HUD, etc.)
var init = function(){
    var miniWorld = document.getElementById("player");

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
    
    var renderer = new THREE.WebGLRenderer({
        canvas: miniWorld
    });

    renderer.setSize(600, 300);
    renderer.autoClear=false;
    
    document.body.appendChild(renderer.domElement);

    const mousePos = new THREE.Vector2();

    const initial_position = new CANNON.Vec3(0, 0, 5)

    const body = new CANNON.Body({ // create physics body for plane
        shape: new CANNON.Box(new CANNON.Vec3(60, 60, 0.1)), // Cannon.js planes are infinite so use a cube instead
        type: CANNON.Body.STATIC,// Isn't affected by gravity
    })
  
    world.addBody(body)

    const loader = new THREE.GLTFLoader()
    let player;

    loader.load("../res/meshes/Characters/Character_Main.glb", function(gltf){
        player= gltf.scene;
        scene.add(player);
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }, (error) => {
        console.log(error);
      });
    //const guy = new Player(scene, world, camera)
    //scene.add(guy);

    const light = new THREE.AmbientLight();
    //light.intensity=0.5;
    scene.add(light);

    const PointerLock = new PointerLockControls(camera,document.body);

    miniWorld.addEventListener( 'click', function () {
        PointerLock.lock();
    });

    var delta = 0
    var time = new Date().getTime()
    var speed = 0

    var update = function(){//game logic
        const new_time = new Date().getTime()
        delta = new_time - time
        time = new_time
        //guy.update(delta)
    };
  

    var render = function(){//draw scene
        renderer.render(scene, camera);
    };

    var GameLoop = function(){//run game loop(update, render, repeat)
        update();
        render();
        requestAnimationFrame(GameLoop);
    };

    GameLoop()
};

window.init = init