var bathroomKey = null;
var closetKey = null;
var screwdriver = null;
var shovel = null;
var goalKey = null;
var libraryKey = null;
var secretBook = null;

let obj_positions = [[null],[null],[null],[null],[null],[null],[null]]

var spriteMaterialItem = new THREE.SpriteMaterial({map:
    THREE.ImageUtils.loadTexture(
    "../res/textures/pause_menu/pick_up_item.png")});
    var spriteItem = new THREE.Sprite(spriteMaterialItem);
    spriteItem.position.set(0,-window.innerHeight/8,0);
    spriteItem.scale.set(window.innerHeight/2,window.innerWidth/75,1);

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
                obj_positions[0] = [obj.position, object_num]
            }
            else if(object_num == 2 && closetKey==null){
                closetKey=obj;
                obj_positions[1] = [obj.position, object_num]
            }
            else if(object_num == 3 && screwdriver==null){
                screwdriver=obj;
                obj_positions[2] = [obj.position, object_num]
            }
            else if(object_num == 4 && shovel==null){
                shovel=obj;
                obj_positions[3] = [obj.position, object_num]
            }
            else if(object_num == 5 && goalKey==null){
                goalKey=obj;
                obj_positions[4] = [obj.position, object_num]
            }
            else if(object_num == 6 && libraryKey==null){
                libraryKey=obj;
                obj_positions[5] = [obj.position, object_num]
            }
            else if(object_num == 7 && secretBook==null){
                secretBook=obj;
                obj_positions[6] = [obj.position, object_num]
            }
            // obj_positions.push([obj.position, object_num])
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });
}

function removeObjectFromScene(scene,object_num,check){
    if(object_num==1 && bathroomKey!=null){ 
        bathroomKey.removeFromParent();
        // bathroomKey.geometry.dispose();
        scene.remove(bathroomKey);
        
        bathroomKey=null;
    }
    else if(object_num == 2 && closetKey!=null){
        scene.remove(closetKey);
        closetKey=null;
    }
    else if(object_num == 3 && screwdriver==null){
        scene.remove(screwdriver);
        screwdriver=null;
    }
    else if(object_num == 4 && shovel==null){
        scene.remove(shovel);
        shovel=null;
    }
    else if(object_num == 5 && goalKey==null){
        scene.remove(goalKey);
        goalKey=null;
    }
    else if(object_num == 6 && libraryKey==null){
        scene.remove(libraryKey);
        libraryKey=null;
    }
    else if(object_num == 7 && secretBook==null){
        scene.remove(secretBook);
        secretBook=null;
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
            distances.push([distanceTo(obj_positions[i][0],player.position), obj_positions[i][1]])
        }
        // console.log("Distance length: ",distances.length)
    }
    
    for (var j = 0 ; j < distances.length; j++){
        // console.log(distances[j][0])
        if (distances[j][0] <= 2){    
            console.log('press \"e\" to interact')
            sceneHUD.add(spriteItem)
            let num = distances[j][1]
            // obj_positions[j][0] = null;
            document.addEventListener('keydown',(e)=>{
                if(e.code=='KeyE'){
                    console.log("Pressed E")
                    // changeObjPos(j)
                    removeObjectFromScene(scene, num,true)
                    pso = true
                    
                    sceneHUD.remove(spriteItem)
                }
                else{
                    sceneHUD.remove(spriteItem)
                }
            })
        if(pso){
            obj_positions[j][0] = new THREE.Vector3(1000,1000,1000);
            console.log("Object positions: ",obj_positions)
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