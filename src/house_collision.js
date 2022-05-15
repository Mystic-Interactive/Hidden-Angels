import * as CANNON from '../lib/cannon-es.js'

    var first_floor_objects = [];
    var first_floor_collisions= [];

    var second_floor_objects= [];
    var second_floor_collisions= [];

    var third_floor_objects= [];
    var third_floor_collisions= [];

function makeFirstFloor(scene,world){
    var first_floor;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/FirstFloor.glb', function(gltf){
        first_floor = gltf.scene
        first_floor.position.set(0,-0.83,-4);
        first_floor.scale.set(1, 1, 1);
            //Creating shadows for each child mesh
            gltf.scene.traverse(function(node){
                if(node.type === 'Mesh'){     
                    node.castShadow=true;
                    node.receiveShadow=true; //allows us to put shadows onto the walls
                }
            });

            scene.add(first_floor);
            first_floor_objects.push(first_floor);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });

  //collision for the first floor
    //floor and roof
    makeCollisionCube(scene,world,[23,0.1,19.75],[0,-0.85,-4],[0,0,0]); //floor
    // makeCollisionCube(scene,world,[23,0.1,19.75],[0,5.5,-4],[0,0,0]); //roof


    //walls
    makeCollisionCube(scene,world,[0.01,2,19.75],[-12.4,1,-4],[0,0,0],1); //right wall
    makeCollisionCube(scene,world,[0.01,2,19],[12.25,1,-4],[0,0,0],1); //left wall
    makeCollisionCube(scene,world,[10,2,0.1],[0,3,-13.95],[0,0,0],1); //back wall stairs
    makeCollisionCube(scene,world,[6,2,0.1],[-8.5,2,-13.95],[0,0,0],1); //backwall office
    makeCollisionCube(scene,world,[6,2,0.1],[8.5,2,-13.95],[0,0,0],1); //backwall diningroom
    // makeCollisionCube(scene,world,[24,2,0.1],[0,1,6],[0,0,0]); //front wall

    //interior walls
        //main dividers
        makeCollisionCube(scene,world,[0.02,2,5],[-4,1,3],[0,0,0],1); //right wall 1
        makeCollisionCube(scene,world,[0.02,2,10],[-4,1,-7.5],[0,0,0],1); //right wall 2
        makeCollisionCube(scene,world,[0.02,2,4],[4,1,3.5],[0,0,0],1); //left wall 1
        makeCollisionCube(scene,world,[0.02,2,6],[4,1,-3],[0,0,0],1); //left wall 2
        makeCollisionCube(scene,world,[0.02,2,2],[4,1,-9.75],[0,0,0],1); //left wall 3

        //room dividers
            //office/library divider
            makeCollisionCube(scene,world,[4.5,2,0.02],[-6.5,1,-7.9],[0,0,0],1); //divider 1
            makeCollisionCube(scene,world,[1.5,2,0.02],[-11.2,1,-7.9],[0,0,0],1); //divider 2

            //dining room/kitchen divider
            makeCollisionCube(scene,world,[2.5,2,0.02],[5.6,1,-1.95],[0,0,0],1); //divider 1
            //makeCollisionCube(scene,world,[2,2,0.02],[11,1,-1.95],[0,0,0]); //divider 2

    //stairs
    makeFirstFloorStairs(scene,world,[0,0,-8.5]);

    makeFridge(scene,world);

}

function makeSecondFloor(scene,world){
    var second_floor;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/SecondFloor.glb', function(gltf){
        second_floor = gltf.scene
        // second_floor.position.set(0,3.5,-4);
        second_floor.position.set(0,-0.83,-4);

            //Creating shadows for each child mesh
            gltf.scene.traverse(function(node){
                if(node.type === 'Mesh'){     
                    node.castShadow=true;
                    node.receiveShadow=true; //allows us to put shadows onto the walls
                    if(node.material.map) node.material.map.anisotropy = 16; 
                }
            });

            scene.add(second_floor);
            second_floor_objects.push(second_floor)
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });;

  //Collision boxes
    //exterior walls
      makeCollisionCube(scene,world,[0.01,2,19.75],[-12.4,1,-4],[0,0,0],2); //right wall
      makeCollisionCube(scene,world,[0.01,2,19],[12.25,1,-4],[0,0,0],2); //left wall
      makeCollisionCube(scene,world,[24,2,0.1],[0,1,-13.95],[0,0,0],2); //back wall stairs
    //   makeCollisionCube(scene,world,[24,2,0.1],[0,1,6],[0,0,0]); //front wall

    //master bedroom
    makeCollisionCube(scene,world,[8,2,0.01],[-7.5,1,0.1],[0,0,0],2); //back bathroom
    makeCollisionCube(scene,world,[5,2,0.1],[-6,1,-4],[0,0,0],2); //bathroom divider big
    makeCollisionCube(scene,world,[2,2,0.1],[-11,1,-4],[0,0,0],2); //bathroom divider small
    makeCollisionCube(scene,world,[0.1,2,6.5],[-3,1,-3.75],[0,0,0],2); //right divider big
    makeCollisionCube(scene,world,[0.1,2,5],[-3,1,-11],[0,0,0],2); //right divider small

    //bedroom far
    makeCollisionCube(scene,world,[6,2,0.1],[8,1,-6.5],[0,0,0],2); //door
    makeCollisionCube(scene,world,[0.1,2,7],[5,1,-10],[0,0,0],2); //wall

    //bedroom close
    makeCollisionCube(scene,world,[5,2,0.1],[8,1,-1.5],[0,0,0],2); //door
    makeCollisionCube(scene,world,[0.1,2,7],[5,1,2],[0,0,0],2); //wall

    //toilet
    makeCollisionCube(scene,world,[3,2,0.1],[3,1,1],[0,0,0],2); //door
    makeCollisionCube(scene,world,[0.1,2,4.5],[0,1,3.5],[0,0,0],2); //wall


}

function makeFirstFloorStairs(scene,world,translate){
    var first_floor_stairs;
    const translate_x =translate[0] 
    const translate_y =translate[1] 
    const translate_z =translate[2] 

    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/FirstFloorStairs.glb', function(gltf){
        first_floor_stairs = gltf.scene
        first_floor_stairs.position.set(translate_x,-0.9+translate_y,-4+translate_z);
        first_floor_stairs.scale.set(1, 1, 1);
            //Creating shadows for each child mesh
            gltf.scene.traverse(function(node){
                if(node.type === 'Mesh'){     
                    node.castShadow=true;
                    node.receiveShadow=true; //allows us to put shadows onto the walls
                }
            });

        scene.add(first_floor_stairs);
        first_floor_objects.push(first_floor_stairs);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });


  //blocks
  makeCollisionCube(scene,world,[1.25,2,1.25],[-3.25+translate_x,0.5+translate_y,-4.5+translate_z],[0,0,0],1); //right big
  makeCollisionCube(scene,world,[1.25,2,1.25],[3.25+translate_x,0.5+translate_y,-4.5+translate_z],[0,0,0],1); //left big
  makeCollisionCube(scene,world,[0.3,1,0.5],[-2.5+translate_x,1+translate_y,-0.75+translate_z],[0,0,0],1); //right small
  makeCollisionCube(scene,world,[0.3,1,0.5],[2.25+translate_x,1+translate_y,-0.75+translate_z],[0,0,0],1); //left small

  //stairs
  makeCollisionStairCase(scene,world,[3,0.1,0.1],[translate_x,-0.9+translate_y,-1+translate_z],10,0,0.4,1); //straight
  makeCollisionCube(scene,world,[3,0.1,0.6],[translate_x,1.05+translate_y,-4.5+translate_z],[0,0,0],1); //halfway
  makeCollisionStairCase(scene,world,[0.5,0.1,0.1],[-3+translate_x,1.25+translate_y,-4.7+translate_z],5,-1,0.15,1); //left
  makeCollisionStairCase(scene,world,[0.5,0.1,0.1],[3+translate_x,1.25+translate_y,-4.7+translate_z],5,1,0.15,1); //right

  //railings
  makeCollisionCube(scene,world,[1.25,1,0.01],[-3.25+translate_x,2+translate_y,-4+translate_z],[0,0,0],1); //right top
  makeCollisionCube(scene,world,[1.25,1,0.01],[3.25+translate_x,2+translate_y,-4+translate_z],[0,0,0],1); //left top
  makeCollisionCube(scene,world,[0.01,2,1.25],[-2.3+translate_x,0.1+translate_y,-3+translate_z],[0,0,0],1); //right bottom
  makeCollisionCube(scene,world,[0.01,2,1.25],[2.3+translate_x,0.1+translate_y,-3+translate_z],[0,0,0],1); //left bottom


}

function makeFridge(scene,world){
    var fridge;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/Fridge.glb', function(gltf){
        fridge = gltf.scene
        fridge.position.set(5,-0.75,-1);
        fridge.rotation.y=-Math.PI
            //Creating shadows for each child mesh
            gltf.scene.traverse(function(node){
                if(node.type === 'Mesh'){     
                    node.castShadow=true;
                    node.receiveShadow=true; //allows us to put shadows onto the walls
                }
            });

            scene.add(fridge);
            first_floor_objects.push(fridge);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });

  makeCollisionCube(scene,world,[0.5,1,0.5],[5,1,-1],[0,0,0],1); //main fridge
  makeCollisionCube(scene,world,[0.1,1,0.01],[6,1,-0.75],[0,Math.PI/3,0],1); //door
}

function makeCollisionCube(scene,world,boxGeoSize,boxPos,rotationArr,floor){
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
    if(floor==1){
        first_floor_objects.push(box);
        first_floor_collisions.push(boxBody);
    }
    else if(floor == 2){
        second_floor_objects.push(box);
        second_floor_collisions.push(boxBody);
    }
    else{
        third_floor_objects.push(box);
        third_floor_collisions.push(boxBody);
    }



    boxBody.position.copy(box.position); //Copy position
    boxBody.quaternion.copy(box.quaternion); //Copy orientation

}

function makeCollisionStairCase(scene,world,boxGeoSize,boxPos,num_stairs,direction,distance_spread,floor){
    var rotation = [0,0,0]
    for(var i =0;i<num_stairs;i++){
        if(direction<0){
            rotation[1] = Math.PI/2
        }
        else if(direction>0){
            rotation[1] = -Math.PI/2
        }
        makeCollisionCube(scene,world,boxGeoSize,boxPos,rotation,floor)
        boxPos[1]+=0.2
        if(direction==0){
            boxPos[2]-=distance_spread
        }
        else if(direction<0){
            boxPos[0]-=distance_spread
        }
        else{
            boxPos[0]+=distance_spread
        }
        
    }
}


function removeFloor(scene,world,floor){
    if(floor==1){
        for(var i=0;i<first_floor_collisions.length;i++){
            world.removeBody(first_floor_collisions[i]);
        }
        for(var i=0;i<first_floor_objects.length;i++){
            scene.remove(first_floor_objects[i]);
        }
    }

    if(floor==2){
        for(var i=0;i<second_floor_collisions.length;i++){
            world.removeBody(second_floor_collisions[i]);
        }
        for(var i=0;i<second_floor_objects.length;i++){
            scene.remove(second_floor_objects[i]);
        }
    }

    if(floor==3){
        for(var i=0;i<second_floor_collisions.length;i++){
            world.removeBody(third_floor_collisions[i]);
        }
        for(var i=0;i<second_floor_objects.length;i++){
            scene.remove(third_floor_objects[i]);
        }

    }
}
export {makeFirstFloor,makeSecondFloor,removeFloor}