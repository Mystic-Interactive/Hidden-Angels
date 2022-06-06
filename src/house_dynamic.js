import * as CANNON from '../lib/cannon-es.js'
import { addToInventory, getItemSelected, clearItem } from './overlay.js';

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
var goalPosition = null;
var spriteGoal = null;


function initialiseDynamics(scene_, HUD_,world_, spriteGoal_){
    scene = scene_
    HUD = HUD_
    world = world_
    spriteGoal=spriteGoal_

    var spriteMaterialItem = new THREE.SpriteMaterial({map:
        THREE.ImageUtils.loadTexture(
        "../res/textures/pause_menu/pick_up_item.png")});
    spriteItem = new THREE.Sprite(spriteMaterialItem);
    spriteItem.position.set(0,-window.innerHeight/8,0);
    spriteItem.scale.set(window.innerHeight/2,window.innerWidth/75,1);

    var spriteMaterialInteraction = new THREE.SpriteMaterial({map:
        THREE.ImageUtils.loadTexture(
        "../res/textures/pause_menu/interact.png")});
    spriteInteraction = new THREE.Sprite(spriteMaterialInteraction);
    spriteInteraction.position.set(0,-window.innerHeight/8,0);
    spriteInteraction.scale.set(window.innerHeight/2,window.innerWidth/75,1);
}

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

function makeDynamicObject(path,scale,translate,rotation,object_num){
    var obj;

    const loader = new THREE.GLTFLoader();
    loader.load(path, function(gltf){
        obj = gltf.scene
        obj.position.set(translate[0],translate[1],translate[2]);
        obj.scale.set(scale[0],scale[1],scale[2])
        obj.rotation.set(rotation[0],rotation[1],rotation[2])
        // var newMaterial = new THREE.MeshStandardMaterial({color: 0x110000});

            //Creating shadows for each child mesh
            gltf.scene.traverse(function(node){
                if(node.type === 'Mesh'){     
                    node.castShadow=true;
                    node.receiveShadow=true; //allows us to put shadows onto the walls                    
                }
            });
            
            scene.add(obj);
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

    if(check){
       obj_positions[object_num-1][0] = null; 
    }
    
}
function setGoalPosition(position){
    goalPosition = position;
}

function distanceTo(object_pos, playerPos){
    // console.log("Player at positions: ",playerPos[0],",",playerPos[1],",",playerPos[2])
    var x = object_pos.x - playerPos.x;
    var y = object_pos.y - playerPos.y;
    var z = object_pos.z - playerPos.z;

    var distance = Math.sqrt(x * x + y * y + z * z);
    return distance
}

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
    // //Check that the closest object is the goal
    // if(distanceTo(goalPosition,player.position)<2){
    //     console.log("Close to goal")
    // }
    if(goalPosition!=null){ //check for the loading level
        if(distanceTo(goalPosition,player.position)<2){
            closest = 1 
        }
    }
}
    


function UI(){
    if(closest==1){
        console.log("Close to goal")
        HUD.add(spriteGoal)
    }
    else if(closest!=null){

        if(closest[2]){
            HUD.add(spriteInteraction)
        }
        else{
            HUD.add(spriteItem)
        }
    }
    else{
        HUD.remove(spriteInteraction)
        HUD.remove(spriteItem)
        HUD.remove(spriteGoal)
    }
    
}


function removeAllDyamics(){
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

document.addEventListener('keydown',(e)=>{
    if(e.code=='KeyE'){
        if(closest!=null){
            console.log("Pressed E ",closest)
            if(closest[2]==false){ //check for if the object is pickupable
                addToInventory(closest[1])
                removeObjectFromScene(closest[1],true)
            }
            else{
                if(getItemSelected()==closest[1]-7){
                    removeObjectFromScene(closest[1],true)
                    clearItem();
                }
                console.log("Item selected: ", getItemSelected())
                console.log("Item in scene: ", closest[1])
            }
            
            
            
        }
        
    }
})

export {makeDynamicObject,removeObjectFromScene, detectObject,removeAllDyamics,UI,initialiseDynamics,setGoalPosition}