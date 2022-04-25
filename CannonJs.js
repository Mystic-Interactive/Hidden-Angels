import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import * as CANNON from 'cannon-es';
import { World } from 'cannon-es';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(0,20,10);
orbit.update();

//Create the ground
const groundGeo = new THREE.PlaneGeometry(30,30);
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
});
const groundMesh = new THREE.Mesh(groundGeo,groundMat);
scene.add(groundMesh);

//Create a ball
const boxGeo = new THREE.BoxGeometry(2,2,2);
const boxMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo,boxMat);
scene.add(boxMesh);

//Create a sphere
const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
});
const sphereMesh = new THREE.Mesh(sphereGeo,sphereMat);
scene.add(sphereMesh);


const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
}); //Creates the physics world

//Creating the material for the ground to make it act in a specific way given an interaction
const groundPhysMat = new CANNON.Material();

//Creating the ground body
const groundBody = new CANNON.Body({
    //shape: new CANNON.Plane(),//Infinite plane
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.1)), //Due to the plane being infinite, if we want the objects to fall off it, we need to make it a box. A plane is 2 dimensions, so just use a small value for z to make it as thin as possible
    type: CANNON.Body.STATIC, //Gravity wont be applied to object
    material: groundPhysMat
}); //Creates a plane
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI/2,0,0);


const boxPhysMat = new CANNON.Material();

const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
    mass: 1,
    position: new CANNON.Vec3(1,20,0),
    material: boxPhysMat
});
boxBody.angularVelocity.set(0,10,0); //Gives the objects angular velocity and thus rotates them. The three values is how much each axis gets: x,y,z
boxBody.angularDamping = 0.31; //Resistance/friction to its rotation
world.addBody(boxBody);

//Specifying what happens when 2 materials get into contact
const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction:0} //Makes the box and ground act slippery upon collision
);

//Need to add the contact material to the world
world.addContactMaterial(groundBoxContactMat);

const spherePhysMat = new CANNON.Material();

const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(2),
    mass: 10,
    position: new CANNON.Vec3(0,15,0),
    material: spherePhysMat
});
sphereBody.linearDamping = 0.31; //Adds resistance to an object

world.addBody(sphereBody);

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.9} //Makes the ball bounce to 0.9 times the height it fell from,when it lands on the ground  
);

world.addContactMaterial(groundSphereContactMat);

const timeStep = 1/60;

function animate(){
    world.step(timeStep);

    //Make the THREE JS mesh micmic that of the physics system
    groundMesh.position.copy(groundBody.position); //Copy position
    groundMesh.quaternion.copy(groundBody.quaternion); //Copy orientation

    boxMesh.position.copy(boxBody.position); //Copy position
    boxMesh.quaternion.copy(boxBody.quaternion); //Copy orientation

    sphereMesh.position.copy(sphereBody.position); //Copy position
    sphereMesh.quaternion.copy(sphereBody.quaternion); //Copy orientation

    renderer.render(scene,camera);
    requestAnimationFrame(animate); 
}

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
})
animate();
