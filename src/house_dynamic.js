var bathroomKey = null;
var closetKey = null;
var screwdriver = null;
var shovel = null;
var goalKey = null;
var libraryKey = null;
var secretBook = null;

let obj_positions = []

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
            }
            else if(object_num == 2 && closetKey==null){
                closetKey=obj;
            }
            else if(object_num == 3 && screwdriver==null){
                screwdriver=obj;
            }
            else if(object_num == 4 && shovel==null){
                shovel=obj;
            }
            else if(object_num == 5 && goalKey==null){
                goalKey=obj;
            }
            else if(object_num == 6 && libraryKey==null){
                libraryKey=obj;
            }
            else if(object_num == 7 && secretBook==null){
                secretBook=obj;
            }
            obj_positions.push([obj.position, object_num])
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });
}

function removeObjectFromScene(scene,object_num){
    if(object_num==1 && bathroomKey!=null){ 
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
}

function detectObjects(player, scene, sceneHUD){
    let distances = []
    for (var i = 0; i < obj_positions.length; i++){
        distances.push([obj_positions[i][0].distanceTo(player.position), obj_positions[i][1]])
    }
    for (var i = 0 ; i < distances.length; i++){
        if (distances[i][0] <= 2){            
            console.log('press \"e\" to interact')
            sceneHUD.add(spriteItem)
            let num = distances[i][1]
            document.addEventListener('keydown',(e)=>{
                if(e.code=='KeyE'){
                    console.log("Pressed E")
                    removeObjectFromScene(scene, num)
                    objFix(i)
                }
                else{
                    sceneHUD.remove(spriteItem)
                }
            })
        }  
    }
}

export {makeDynamicObject,removeObjectFromScene, detectObjects}