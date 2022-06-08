import * as CANNON from '../lib/cannon-es.js'
import { addToInventory, getItemSelected, clearItem } from './overlay.js';

//Declaring variables that will be used throughtout the class
var bathroomKey = null;
var closetKey = null;
var screwdriver = null;
var shovel = null;
var goalKey = null;
var libraryKey = null;
var secretBook = null;

var bathroomDoor = [null,null];
var bedroom1Door = [null,null];
var bedroom2Door = [null,null];
var closetDoor = [null,null];
var goalDoor = [null,null];
var libraryDoor = [null,null];
var secretBookCase = [null,null];

var collisions = []
var closest = null
let obj_positions = [[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null]]
var spriteItem = null;
var spriteInteraction = null;
var scene = null;
var HUD = null;
var world = null;
var gltfLoader = null;
var goalPosition = null;
var spriteNext = null;
var spriteFinish = null;
var audioPickUp = null;

//Called to give all values from other classes
function initialiseDynamics(scene_, HUD_,world_,spriteNext_,spriteFinish_, audioPickUp_, gltfLoader_){
    scene = scene_
    HUD = HUD_
    world = world_
    spriteNext = spriteNext_ //Next level sprite
    spriteFinish = spriteFinish_ //Finished the game sprite
    audioPickUp = audioPickUp_ //check to play sound
    gltfLoader = gltfLoader_ //pass the loader to the loading screen

    //Pick up the item sprite
    var spriteMaterialItem = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load("../res/textures/pause_menu/pick_up_item.png")
    });

    spriteItem = new THREE.Sprite(spriteMaterialItem);
    spriteItem.position.set(0,-window.innerHeight/8,0);
    spriteItem.scale.set(window.innerHeight/2,window.innerWidth/75,1);

    //Interact with item sprite
    var spriteMaterialInteraction = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load("../res/textures/pause_menu/interact.png")
    });

    spriteInteraction = new THREE.Sprite(spriteMaterialInteraction);
    spriteInteraction.position.set(0,-window.innerHeight/8,0);
    spriteInteraction.scale.set(window.innerHeight/2,window.innerWidth/75,1);
}

//Makes collision boxes for interactable bodies
function makeDynamicCollision(boxGeoSize,boxPos,rotationArr){
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
    
    collisions.push(boxBody);
    return boxBody;
}    

//Makes the objects
function makeDynamicObject(path,scale,translate,rotation,object_num){
    var obj;

    gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load(path, function(gltf){
        obj = gltf.scene
        obj.position.set(translate[0],translate[1],translate[2]);
        obj.scale.set(scale[0],scale[1],scale[2])
        obj.rotation.set(rotation[0],rotation[1],rotation[2])

        //Creating shadows for each child mesh
        gltf.scene.traverse(function(node){
            if(node.type === 'Mesh'){     
                node.castShadow=true;
                node.receiveShadow=true; //allows us to put shadows onto the walls                    
            }
        });
        //These needs to be hardcoded else we wont know which particular item must be removed
        scene.add(obj);
        //Pickupable objects
        if(object_num==1 && bathroomKey==null){ //Second check to make sure we dont add multiple of the same objects per level
            bathroomKey=obj;
            obj_positions[0] = [obj.position, object_num,false]
        }
        else if(object_num == 2 && closetKey==null){
            closetKey=obj;
            obj_positions[1] = [obj.position, object_num,false]
        }
        else if(object_num == 3 && screwdriver==null){
            screwdriver=obj;
            obj_positions[2] = [obj.position, object_num,false]
        }
        else if(object_num == 4 && shovel==null){
            shovel=obj;
            obj_positions[3] = [obj.position, object_num,false]
        }
        else if(object_num == 5 && goalKey==null){
            goalKey=obj;
            obj_positions[4] = [obj.position, object_num,false]
        }
        else if(object_num == 6 && libraryKey==null){
            libraryKey=obj;
            obj_positions[5] = [obj.position, object_num,false]
        }
        else if(object_num == 7 && secretBook==null){
            secretBook=obj;
            obj_positions[6] = [obj.position, object_num,false]
        }

        //Collision and interactable objects
        else if(object_num == 8){
            var collision =makeDynamicCollision([1,2,0.01],[translate[0],translate[1]+1,translate[2]],rotation)
            bathroomDoor=[obj,collision];
            obj_positions[7] = [obj.position, object_num,true]
        }
        else if(object_num == 9){
            var collision =makeDynamicCollision([1,2,0.01],[translate[0],translate[1]+1,translate[2]],rotation)
            closetDoor=[obj,collision];
            obj_positions[8] = [obj.position, object_num,true]
        }
        else if(object_num == 10){
            var collision =makeDynamicCollision([1,2,0.01],[translate[0],translate[1]+1,translate[2]-0.5],rotation)
            bedroom1Door=[obj,collision];
            obj_positions[9] = [obj.position, object_num,true]
        }
        else if(object_num == 11){
            var collision =makeDynamicCollision([1,2,0.01],[translate[0],translate[1]+1,translate[2]],rotation)
            bedroom2Door=[obj,collision];
            obj_positions[10] = [obj.position, object_num,true]
        }
        else if(object_num == 12){
            var collision =makeDynamicCollision([1,2,0.01],[translate[0],translate[1]+1,translate[2]],rotation)
            goalDoor=[obj,collision];
            obj_positions[11] = [obj.position, object_num,true]
        }
        else if(object_num == 13){
            var collision =makeDynamicCollision([2,2,0.01],[translate[0],translate[1]+2,translate[2]],rotation)
            libraryDoor=[obj,collision];
            obj_positions[12] = [obj.position, object_num,true]
        }
        else if(object_num == 14){
            var collision =makeDynamicCollision([2,2,0.01],[translate[0],translate[1]+1.5,translate[2]],rotation)
            secretBookCase=[obj,collision];
            obj_positions[13] = [obj.position, object_num,true]
        }
    }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }, (error) => {
        console.log(error);
    });
}

//Function to remove a particular object from the scene
function removeObjectFromScene(object_num,check){
    if(object_num==1 && bathroomKey!=null){ 
        scene.remove(bathroomKey);
        bathroomKey=null;
    }
    else if(object_num == 2 && closetKey!=null){
        scene.remove(closetKey);
        closetKey=null;
    }
    else if(object_num == 3 && screwdriver!=null){
        scene.remove(screwdriver);
        screwdriver=null;
    }
    else if(object_num == 4 && shovel!=null){
        scene.remove(shovel);
        shovel=null;
    }
    else if(object_num == 5 && goalKey!=null){
        scene.remove(goalKey);
        goalKey=null;
    }
    else if(object_num == 6 && libraryKey!=null){
        scene.remove(libraryKey);
        libraryKey=null;
    }
    else if(object_num == 7 && secretBook!=null){
        scene.remove(secretBook);
        secretBook=null;
    }
    
    //Interactables
    else if(object_num == 8 && bathroomDoor[0]!=null){
        scene.remove(bathroomDoor[0]);
        if(check){
            world.removeBody(bathroomDoor[1]);
        }
        
        bathroomDoor = [null, null];
    }
    else if(object_num == 9 && closetDoor[0]!=null){
        scene.remove(closetDoor[0]);
        if(check){
            world.removeBody(closetDoor[1]);
        }
        
        closetDoor = [null, null];
    }
    else if(object_num == 10 && bedroom1Door[0]!=null){
        scene.remove(bedroom1Door[0]);
        if(check){
            world.removeBody(bedroom1Door[1]);
        }
        
        bedroom1Door = [null, null];
    }

    else if(object_num == 11 && bedroom2Door[0]!=null){
        scene.remove(bedroom2Door[0]);
        if(check){
            world.removeBody(bedroom2Door[1]);
        }
        
        bedroom2Door = [null, null];
    }

    else if(object_num == 12 && goalDoor[0]!=null){
        scene.remove(goalDoor[0]);
        if(check){
            world.removeBody(goalDoor[1]);
        }
        
        goalDoor = [null, null];
    }

    else if(object_num == 13 && libraryDoor[0]!=null){
        scene.remove(libraryDoor[0]);
        if(check){
            world.removeBody(libraryDoor[1]);
        }
        
        libraryDoor = [null, null];
    }

    else if(object_num == 14 && secretBookCase[0]!=null){
        scene.remove(secretBookCase[0]);
        if(check){
            world.removeBody(secretBookCase[1]);
        }
        
        secretBookCase = [null, null];
    }

    //Used to make sure we dont remove all objects in the scene
    if(check){
       obj_positions[object_num-1][0] = null; 
    }
    
}

//Sets the goal position for that particular level
function setGoalPosition(position){
    goalPosition = position;
}

//Calculate the euclidean distance between the player and the particular object
function distanceTo(object_pos, playerPos){
    var x = object_pos.x - playerPos.x;
    var y = object_pos.y - playerPos.y;
    var z = object_pos.z - playerPos.z;

    var distance = Math.sqrt(x * x + y * y + z * z);
    return distance
}

//Detects the closest object to the user
function detectObject(player){
    closest = null
    var old_distance = 100;
    for(var i=0;i<obj_positions.length;i++){
        if(obj_positions[i][0]!=null){
            var distance = distanceTo(obj_positions[i][0],player.position)
            //Check that we only add to the array if dealing with the objects in that scene
            if(distance<1.5 && old_distance>distance){
                closest = obj_positions[i] //Get the object that we are closest to
                old_distance=distance
            }            
    
        }
    }
    if(goalPosition!=null){ //check for the finishing level
        if(distanceTo(goalPosition,player.position)<2){
            closest = 1 
        }
    }
}
    
//Loads the UI for that paricular time period
function UI(lvl){
    if(closest==1){ //Check if we're not closest to the goal
        if(lvl==4){ //Check if we need to display game done or go to next level
            HUD.add(spriteFinish)
        }
        else{
            HUD.add(spriteNext)
        }
    }
    else if(closest!=null){ //Not closest to the goal but to an object/interactable
        if(closest[2]){ //closest to an interactable
            HUD.add(spriteInteraction)
        }
        else{ //closest to a pickupable item
            HUD.add(spriteItem)
        }
    }
    else{
        HUD.remove(spriteInteraction)
        HUD.remove(spriteItem)
        HUD.remove(spriteNext)
        HUD.remove(spriteFinish)
    }
    
}

//Removes all remaining dynamic objects from the scene
function removeAllDynamics(){
    for(var i = 1; i<=obj_positions.length;i++){
        removeObjectFromScene(i,false)
        obj_positions[i-1][0]=null;
    }
    for(var i =0;i<collisions.length;i++){
        world.removeBody(collisions[i])
    }
    collisions = []
    goalPosition = null;
        
}

//Event listener to check if the user is clicking e to interact/pick up the item
document.addEventListener('keydown',(e)=>{
    if(e.code=='KeyE'){
        if(closest!=null){
            if(closest[2]==false){ //check for if the object is pickupable
                addToInventory(closest[1])
                removeObjectFromScene(closest[1],true)
                audioPickUp.play(); //Have to put audio in these statements seperately else it would play when nothing is being picked-up/used
            }
            else{
                if(getItemSelected()==closest[1]-7){
                    removeObjectFromScene(closest[1],true)
                    clearItem();
                    audioPickUp.play(); 
                }
            }
                       
            
        }
        
    }
})

export {makeDynamicObject,removeObjectFromScene, detectObject,removeAllDynamics,UI,initialiseDynamics,setGoalPosition}