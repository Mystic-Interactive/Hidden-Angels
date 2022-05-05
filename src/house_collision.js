import * as CANNON from '../lib/cannon-es.js'
function makeHouse(scene,world){
    var house;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/House.glb', function(gltf){
        house = gltf.scene
        house.position.set(0,-0.83,-4);
        house.scale.set(1, 1, 1);
            //Creating shadows for each child mesh
            gltf.scene.traverse(function(node){
                if(node.type === 'Mesh'){     
                    node.castShadow=true;
                    node.receiveShadow=true; //allows us to put shadows onto the walls
                }
            });

    scene.add(house);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });

  //foundation
  makeCollisionCube(scene,world,[24.7,1.2,20],[0,-0.4,-3.9],[0,0,0]);

  //entrance steps
  makeCollisionCube(scene,world,[5,0.75,0.6],[0,-0.6,6.8],[0,0,0]);
  makeCollisionCube(scene,world,[5,0.5,0.6],[0,-0,6.25],[0,0,0]);

  //walls
  makeCollisionCube(scene,world,[16,13,0.4],[-12.3,6.5,-6],[0,Math.PI/2,0]); //right
  makeCollisionCube(scene,world,[16,13,0.4],[12.3,6.5,-6],[0,Math.PI/2,0]); //left
  makeCollisionCube(scene,world,[10,25,0.4],[0,5,-13.95],[0,0,Math.PI/2]); //back
  //makeCollisionCube(scene,world,[10,25,0.4],[0,5,1.95],[0,0,Math.PI/2]); //front


}

function makeCollisionCube(scene,world,boxGeoSize,boxPos,rotationArr){
    const boxGeo = new THREE.BoxGeometry(boxGeoSize[0],boxGeoSize[1],boxGeoSize[2]);
    const boxMat = new THREE.MeshBasicMaterial({
       color: 0xffffff,
       wireframe:true
    });
    const box = new THREE.Mesh(boxGeo,boxMat);
    box.position.set(boxPos[0],boxPos[1],boxPos[2]);
    box.rotation.set(rotationArr[0],rotationArr[1],rotationArr[2])
    scene.add(box);
  
    const boxBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(boxGeoSize[0]/2,boxGeoSize[1]/2,boxGeoSize[2]/2)),
        type: CANNON.Body.STATIC,
    });
  
    world.addBody(boxBody);



    boxBody.position.copy(box.position); //Copy position
    boxBody.quaternion.copy(box.quaternion); //Copy orientation

}

export {makeHouse}