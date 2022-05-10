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

        //scene.add(house);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });

  //foundation
  makeCollisionCube(scene,world,[24.7,1.2,20],[0,-0.4,-3.9],[0,0,0]);

  //roofing
  makeCollisionCube(scene,world,[18,0.1,16],[0,12,-5],[0,0,0]);

  //entrance steps
  makeCollisionCube(scene,world,[5,0.75,0.6],[0,-0.6,6.8],[0,0,0]);
  makeCollisionCube(scene,world,[5,0.5,0.6],[0,0,6.25],[0,0,0]);

  //exterior walls
  makeCollisionCube(scene,world,[16,13,0.4],[-12.3,6.5,-6],[0,Math.PI/2,0]); //right
  makeCollisionCube(scene,world,[16,13,0.4],[12.3,6.5,-6],[0,Math.PI/2,0]); //left
  makeCollisionCube(scene,world,[10,25,0.4],[0,5,-13.95],[0,0,Math.PI/2]); //back
  // makeCollisionCube(scene,world,[10,25,0.4],[0,5,1.95],[0,0,Math.PI/2]); //front

  //inner staircase
  makeCollisionStaircase(scene,world,[5,0.45,0.5],[0,0.4,-8.5],[0,0,0],'front'); //front
  makeCollisionCube(scene,world,[5,0.45,2.95],[0,2.9,-12.5],[0,0,0]);
  makeCollisionStaircase(scene,world,[2.8,0.45,0.5],[-4.2,5.4,-12.3],[0,Math.PI/2,0],'left'); //left
  makeCollisionStaircase(scene,world,[2.8,0.45,0.5],[4.2,5.4,-12.3],[0,Math.PI/2,0],'right'); //right

  // downstairs
    // library/office
    makeCollisionCube(scene,world,[7.8,3.1,0.2],[-5.05,1.55,-2],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[15.8,0.5,0.2],[-5.05,4.5,-5.9],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[3.75,3.1,0.2],[-5.05,1.55,-11.9],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[5.8,0.5,0.2],[-9,4.5,-1.5],[0,0,0]);
    makeCollisionCube(scene,world,[2.75,1.8,0.2],[-6,1.55,-1.6],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[2.75,1.8,0.2],[-10.5 ,1.55,-1.6],[0,0,Math.PI/2]);
    
    // kitchen/dining room
    makeCollisionCube(scene,world,[5,3.1,0.2],[5.05,1.55,-4],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[0.5,3.1,0.2],[5.05,1.55,1],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[2.5,3.1,0.2],[5.05,1.55,-12.5],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[15.8,0.5,0.2],[5.05,4.5,-5.9],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[6.8,0.5,0.2],[8.5,4.5,-5],[0,0,0]);
    makeCollisionCube(scene,world,[2,2.5,0.2],[7,1.55,-5],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[2,1,0.2],[11.5,1.55,-5],[0,0,Math.PI/2]);

  //upstairs
    //flooring
    makeCollisionCube(scene,world,[7,0.2,15],[-8.75,6.25,-6],[0,0,0]);
    makeCollisionCube(scene,world,[7,0.2,15],[8.75,6.25,-6],[0,0,0]);
    makeCollisionCube(scene,world,[7,0.2,2],[0,6.25,1],[0,0,0]);
    makeCollisionCube(scene,world,[7,0.2,1],[0,6.25,-8],[0,0,0]);

    //masterbedroom
    makeCollisionCube(scene,world,[3.75,3.1,0.1],[-6.25,8,-11.4],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[3,3.1,0.1],[-6.25,8,-5.9],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[3,4.75,0.1],[-10,8,-4],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[9,0.2,0.1],[-6.2,11,-9],[0,Math.PI/2,0]); //
    makeCollisionCube(scene,world,[3,3,0.1],[-8,8,-7],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[3,0.5,0.1],[-11.8,8,-7],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[5,0.2,0.1],[-10,11,-7],[0,0,0]);

    //broom closet
    makeCollisionCube(scene,world,[2.5,3,0.1],[-6.25,8,0.5],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[3,1.5,0.1],[-7.5,8,-0.9],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[3,1.5,0.1],[-11.3,8,-0.9],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[5,0.2,0.1],[-10,11,-0.9],[0,0,0]);

    //bedroom 1
    makeCollisionCube(scene,world,[3.75,3.1,0.1],[6.25,8,-11.8],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[3,0.1,0.1],[6.8,8,-9.4],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[3,4,0.1],[11,8,-9.4],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[5,0.2,0.1],[9.3,11,-9.4],[0,0,0]);

    //bathroom
    makeCollisionCube(scene,world,[0.25,3.1,0.1],[6.25,8,-6.6],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[0.25,3.1,0.1],[6.25,8,-4.2],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[3,4,0.1],[9.5,8,-7],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[3,4,0.1],[9.5,8,-3.9],[0,0,Math.PI/2]);
    

    //bedroom 2
    makeCollisionCube(scene,world,[3.75,3.1,0.1],[6.25,8,0],[0,Math.PI/2,0]);
    makeCollisionCube(scene,world,[3,2.5,0.1],[8,8,-1.8],[0,0,Math.PI/2]);
    makeCollisionCube(scene,world,[3,0.1,0.1],[11.5,8,-1.8],[0,0,Math.PI/2]);



}


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
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });

  //collision for the first floor
    //floor and roof
    makeCollisionCube(scene,world,[23,0.1,19.75],[0,-0.85,-4],[0,0,0]);

    //walls
    makeCollisionCube(scene,world,[0.01,2,19.75],[-12.4,1,-4],[0,0,0]); //right wall
    makeCollisionCube(scene,world,[0.01,2,19],[12.25,1,-4],[0,0,0]); //left wall
    makeCollisionCube(scene,world,[10,2,0.1],[0,3,-13.95],[0,0,0]); //back wall stairs
    makeCollisionCube(scene,world,[6,2,0.1],[-8.5,2,-13.95],[0,0,0]); //backwall office
    makeCollisionCube(scene,world,[6,2,0.1],[8.5,2,-13.95],[0,0,0]); //backwall diningroom
    // makeCollisionCube(scene,world,[24,2,0.1],[0,1,6],[0,0,0]); //front wall

    //interior walls
        //main dividers
        makeCollisionCube(scene,world,[0.02,2,5],[-4,1,3],[0,0,0]); //right wall 1
        makeCollisionCube(scene,world,[0.02,2,10],[-4,1,-7.5],[0,0,0]); //right wall 2
        makeCollisionCube(scene,world,[0.02,2,4],[4,1,3.5],[0,0,0]); //left wall 1
        makeCollisionCube(scene,world,[0.02,2,6],[4,1,-3],[0,0,0]); //left wall 2
        makeCollisionCube(scene,world,[0.02,2,2],[4,1,-9.75],[0,0,0]); //left wall 3

        //room dividers
            //office/library divider
            makeCollisionCube(scene,world,[4.5,2,0.02],[-6.5,1,-7.9],[0,0,0]); //divider 1
            makeCollisionCube(scene,world,[1.5,2,0.02],[-11.2,1,-7.9],[0,0,0]); //divider 2

            //dining room/kitchen divider
            makeCollisionCube(scene,world,[2.5,2,0.02],[5.6,1,-1.95],[0,0,0]); //divider 1
            makeCollisionCube(scene,world,[2,2,0.02],[11,1,-1.95],[0,0,0]); //divider 2

    //stairs
    makeFirstFloorStairs(scene,world,[0,0,-8.5]);

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
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });


  //blocks
  makeCollisionCube(scene,world,[1.25,2,1.25],[-3.25+translate_x,0.5+translate_y,-4.5+translate_z],[0,0,0]); //right big
  makeCollisionCube(scene,world,[1.25,2,1.25],[3.25+translate_x,0.5+translate_y,-4.5+translate_z],[0,0,0]); //left big
  makeCollisionCube(scene,world,[0.3,1,0.5],[-2.5+translate_x,1+translate_y,-0.75+translate_z],[0,0,0]); //right small
  makeCollisionCube(scene,world,[0.3,1,0.5],[2.25+translate_x,1+translate_y,-0.75+translate_z],[0,0,0]); //left small

  //stairs
  makeNewCollisionStairCase(scene,world,[3,0.1,0.1],[translate_x,-0.9+translate_y,-1+translate_z],10,0,0.4); //straight
  makeCollisionCube(scene,world,[3,0.1,0.6],[translate_x,1.05+translate_y,-4.5+translate_z],[0,0,0]); //halfway
  makeNewCollisionStairCase(scene,world,[0.5,0.1,0.1],[-3+translate_x,1.25+translate_y,-4.7+translate_z],5,-1,0.15); //left
  makeNewCollisionStairCase(scene,world,[0.5,0.1,0.1],[3+translate_x,1.25+translate_y,-4.7+translate_z],5,1,0.15); //right

  //railings
  makeCollisionCube(scene,world,[1.25,1,0.01],[-3.25+translate_x,2+translate_y,-4+translate_z],[0,0,0]); //right top
  makeCollisionCube(scene,world,[1.25,1,0.01],[3.25+translate_x,2+translate_y,-4+translate_z],[0,0,0]); //left top
  makeCollisionCube(scene,world,[0.01,2,1.25],[-2.3+translate_x,0.1+translate_y,-3+translate_z],[0,0,0]); //right bottom
  makeCollisionCube(scene,world,[0.01,2,1.25],[2.3+translate_x,0.1+translate_y,-3+translate_z],[0,0,0]); //left bottom


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

function makeNewCollisionStairCase(scene,world,boxGeoSize,boxPos,num_stairs,direction,distance_spread){
    var rotation = [0,0,0]
    for(var i =0;i<num_stairs;i++){
        if(direction<0){
            rotation[1] = Math.PI/2
        }
        else if(direction>0){
            rotation[1] = -Math.PI/2
        }
        makeCollisionCube(scene,world,boxGeoSize,boxPos,rotation)
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

function makeCollisionStaircase(scene,world,boxGeoSize,boxPos,rotationArr,dir){
    let dir1;
    let dir2
    if(dir==='front'){
        dir1 = 1;
        dir2 = 2;
    }
    else{
        dir1 = 0;
        dir2 = 1;
    }
    
    
    for(var i =0;i<5;i++){
        makeCollisionCube(scene,world,boxGeoSize,boxPos,rotationArr)
        if(dir==='right'){
           boxPos[dir1]-=0.5;  
        }
        else{
            boxPos[dir1]+=0.5;
        }
       
        boxPos[dir2]-=0.5;
    }
    
}

export {makeHouse,makeFirstFloor}