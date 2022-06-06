import { Ground } from './ground.js';
import * as CANNON from '../lib/cannon-es.js'
import Player from '../src/player.js'
import {PointerLockControls} from './PointerLockControls.js'

// variables to set up scene with camera
var  camera;
var scene;
var renderer;
var world;

// control variables to time actions correctly
var delta = 0;
var time

// items added to scene
var player;
var ground;

// Initialization of game (world, level, HUD, etc.)
var init = function(){
    let world_canvas = document.getElementById('player');
    time = new Date().getTime()

    console.log('hello')

    world = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0)
    })

    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer({
        maxLights: 8,
        canvas: world_canvas,
    });
    renderer.setSize(600, 300);
    renderer.shadowMap.enabled = true;
    renderer.autoClear = false;
    
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        95, // field of view (fov)
        600/300, // browser aspect ratio
        0.1, // near clipping plane
        1000 // far clipping plane
    );

    //Create and add ground mesh to scene
    ground = new Ground(scene, world)

    const initial_position = new CANNON.Vec3(0, 1, 0); //Initial player position for opening sandbox exploration

    const monsters = [];
    player = new Player(scene, world, camera, initial_position, monsters); //Create and add player to scene and physics world

    // create and add ambient light to scene
    const light = new THREE.AmbientLight();
    light.intensity = 0.4; //dim light for atmosphere
    scene.add(light);

    const PointerLock = new PointerLockControls(camera,document.body); //Mouse controls to control camera and player rotation 
    world_canvas.addEventListener('click', function (){ //activate controls by clicking on screen
	  PointerLock.lock();
    });
    GameLoop()
};

function update(){ //Game Logic
    const new_time = new Date().getTime();
    delta = new_time - time;
    time = new_time;
    player.update(delta)
    ground.update()
}

function render(){// Draw scene
    renderer.render(scene, camera);
}


function GameLoop(){ //Run game loop(update -> render -> repeat)
  update();
  render();
  requestAnimationFrame(GameLoop);
};

window.init = init
