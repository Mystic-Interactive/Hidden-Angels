var bathroomKey = null;
var closetKey = null;
var screwdriver = null;
var shovel = null;
var goalKey = null;
var libraryKey = null;
var secretBook = null;

var bathroomDoor = null;
var bedroom1Door = null;
var bedroom2Door = null;
var closetDoor = null;
var goalDoor = null;
var libraryDoor = null;
var secretBookCase = null;

let obj_positions = [[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null],[null]]

var spriteMaterialItem = new THREE.SpriteMaterial({map:
    THREE.ImageUtils.loadTexture(
    "../res/textures/pause_menu/pick_up_item.png")});
    var spriteItem = new THREE.Sprite(spriteMaterialItem);
    spriteItem.position.set(0,-window.innerHeight/8,0);
    spriteItem.scale.set(window.innerHeight/2,window.innerWidth/75,1);

var spriteMaterialInteraction = new THREE.SpriteMaterial({map:
    THREE.ImageUtils.loadTexture(
    "../res/textures/pause_menu/interact.png")});
    var spriteInteraction = new THREE.Sprite(spriteMaterialInteraction);
    spriteInteraction.position.set(0,-window.innerHeight/8,0);
    spriteInteraction.scale.set(window.innerHeight/2,window.innerWidth/75,1);

function makeDynamicObject(scene,path,scale,translate,rotation,object_num){
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
            else if(object_num == 8 && bathroomDoor==null){
                bathroomDoor=obj;
                obj_positions[7] = [obj.position, object_num,true]
            }
            else if(object_num == 9 && bedroom1Door==null){
                bedroom1Door=obj;
                obj_positions[8] = [obj.position, object_num,true]
            }
            else if(object_num == 10 && bedroom2Door==null){
                bedroom2Door=obj;
                obj_positions[9] = [obj.position, object_num,true]
            }
            else if(object_num == 11 && closetDoor==null){
                closetDoor=obj;
                obj_positions[10] = [obj.position, object_num,true]
            }
            else if(object_num == 12 && goalDoor==null){
                goalDoor=obj;
                obj_positions[11] = [obj.position, object_num,true]
            }
            else if(object_num == 13 && libraryDoor==null){
                libraryDoor=obj;
                obj_positions[12] = [obj.position, object_num,true]
            }
            else if(object_num == 14 && secretBookCase==null){
                secretBookCase=obj;
                obj_positions[13] = [obj.position, object_num,true]
            }

  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });
}

function removeObjectFromScene(scene,object_num,check){
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
    else if(object_num == 8 && bathroomDoor!=null){
        scene.remove(bathroomDoor);
        bathroomDoor=null;
    }
    else if(object_num == 9 && bedroom1Door!=null){
        scene.remove(bedroom1Door);
        bedroom1Door=null;
    }
    else if(object_num == 10 && bedroom2Door!=null){
        scene.remove(bedroom2Door);
        bedroom2Door=null;
    }
    else if(object_num == 11 && closetDoor!=null){
        scene.remove(closetDoor);
        closetDoor=null;
    }
    else if(object_num == 12 && goalDoor!=null){
        scene.remove(goalDoor);
        goalDoor=null;
    }
    else if(object_num == 13 && libraryDoor!=null){
        scene.remove(libraryDoor);
        libraryDoor=null;
    }
    else if(object_num == 14 && secretBookCase!=null){
        scene.remove(secretBookCase);
        secretBookCase=null;
    }

    if(check){
       obj_positions[object_num-1][0] = null; 
    }
    
}


function distanceTo(object_pos, playerPos){
    // console.log("Player at positions: ",playerPos[0],",",playerPos[1],",",playerPos[2])
    var x = object_pos.x - playerPos.x;
    var y = object_pos.y - playerPos.y;
    var z = object_pos.z - playerPos.z;

    var distance = Math.sqrt(x * x + y * y + z * z);
    return distance
}


function detectObjects(player, scene, sceneHUD){
    let distances = []
    var pso = false;
    for (var i = 0; i < obj_positions.length; i++){
        // if(obj_positions[i]!=[null]){
        //     // distances.push([obj_positions[i][0].distanceTo(player.position), obj_positions[i][1]])
        //     // console.log(obj_positions[i][0])
        //     // console.log(player.position)
        //     console.log("Hello",obj_positions[i])
        // }
        if(obj_positions[i][0]!=null){
            // console.log(obj_positions[i][0])
            distances.push([distanceTo(obj_positions[i][0],player.position), obj_positions[i][1],obj_positions[i][2]])
        }
        // console.log("Distance length: ",distances.length)
    }
    
    for (var j = 0 ; j < distances.length; j++){
        // console.log(distances[j][0])
        if (distances[j][0] <= 2){    
            console.log('press \"e\" to interact')

            //Object is a pickable item
            if(distances[j][2]==false){
                sceneHUD.add(spriteItem)
                let num = distances[j][1]
                document.addEventListener('keydown',(e)=>{
                    if(e.code=='KeyE'){
                        console.log("Pressed E")
                        removeObjectFromScene(scene, num,true)
                    
                        sceneHUD.remove(spriteItem)
                    }
                    else{
                        sceneHUD.remove(spriteItem)
                    }
                })
            }
            else{
                //Object is an interactable object
                sceneHUD.add(spriteInteraction)
                let num = distances[j][1]
                console.log("num: ",num)
                document.addEventListener('keydown',(e)=>{
                    if(e.code=='KeyE'){
                        console.log("Pressed E")
                        removeObjectFromScene(scene, num,true)
                    
                        sceneHUD.remove(spriteInteraction)
                    }
                    else{
                        sceneHUD.remove(spriteInteraction)
                    }
                })
            }
            
        }  
    }

    // for (var j = 0 ; j < distances.length; j++){  
    //     if (distances[j][0] <= 2){    
    //         console.log('press \"e\" to interact')
    //         sceneHUD.add(spriteItem)
    //         let num = distances[j][1]
    //         document.addEventListener('keydown',(e)=>{
    //             if(e.code=='KeyE'){
    //                 console.log("Pressed E")
    //                 removeObjectFromScene(scene, num)
    //             }
    //             else{
    //                 sceneHUD.remove(spriteItem)
    //             }
    //         })
    //     }  
    // }
}

function removeAllDyamics(scene){
    for(var i = 0; i<8;i++){
        removeObjectFromScene(scene,i,false)
    }
        
}

export {makeDynamicObject,removeObjectFromScene, detectObjects,removeAllDyamics}