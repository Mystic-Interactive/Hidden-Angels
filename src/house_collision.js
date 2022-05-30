import * as CANNON from '../lib/cannon-es.js'

    var first_floor_objects = [];
    var first_floor_collisions= [];

    var second_floor_objects= [];
    var second_floor_collisions= [];

    var third_floor_objects= [];
    var third_floor_collisions= [];

    var fourth_floor_objects= [];
    var fourth_floor_collisions= [];

    const loadingManager = new THREE.LoadingManager();
    const progressBar = document.getElementById('progress-bar')
    const progressBarContainer = document.querySelector('.progress-bar-container')

    // Method to do things when we starting loading 
    loadingManager.onStart = function(url,item,total){
        progressBarContainer.style.display = 'block';
        progressBarContainer.style.position = 'absolute';

        console.log(`Started loading: ${url}`)
    }
    
    // Method called when the loading is under progress
    loadingManager.onProgress = function(url,loaded,total){
        progressBar.value = (loaded/total)*100;
    }

    
    // Method called called when the loading of the assest has finished
    loadingManager.onLoad = function(){
        progressBarContainer.style.display = 'none';
    }

    // Method called when there is an error
    loadingManager.onError = function(url){
        console.error(`Problem loading ${url}`)
    }

    const gltfLoader = new THREE.GLTFLoader(loadingManager);

function makeFirstFloor(scene,world){
    //Make first floor blender model
    makeObject(scene,'../res/meshes/FirstFloor/FirstFloor.glb',[1,1,1],[0,-0.83,-4],[0,0,0],1,null)

  //collision for the first floor
    //floor and roof
    makeCollisionCube(scene,world,[23,0.1,19.75],[0,-0.85,-4],[0,0,0]); //floor
    // makeCollisionCube(scene,world,[23,0.1,19.75],[0,5.5,-4],[0,0,0]); //roof


    //walls
        makeCollisionCube(scene,world,[0.01,2,5.6],[-12.4,1,-11.2],[0,0,0],1); //right wall
        makeCollisionCube(scene,world,[0.01,2,19],[12.25,1,-4],[0,0,0],1); //left wall
        makeCollisionCube(scene,world,[10,2,0.1],[0,3,-13.95],[0,0,0],1); //back wall stairs
        makeCollisionCube(scene,world,[6.1,2,0.1],[-8.5,2,-13.95],[0,0,0],1); //backwall office
        makeCollisionCube(scene,world,[6,2,0.1],[8.5,2,-13.95],[0,0,0],1); //backwall diningroom
        // makeCollisionCube(scene,world,[24,2,0.1],[0,1,6],[0,0,0]); //front wall

    //interior walls
        //main dividers
        makeCollisionCube(scene,world,[0.02,2,5],[-4,1,3],[0,0,0],1); //right wall 1
        makeCollisionCube(scene,world,[0.02,2,10],[-4,1,-7.5],[0,0,0],1); //right wall 2
        makeCollisionCube(scene,world,[0.02,2,4],[4,1,3.5],[0,0,0],1); //left wall 1
        makeCollisionCube(scene,world,[0.02,2,6],[4,1,-3],[0,0,0],1); //left wall 2
        makeCollisionCube(scene,world,[0.02,2,4],[4,1,-11],[0,0,0],1); //left wall 3

        //room dividers
            //office/library divider
            makeCollisionCube(scene,world,[4.5,2,0.02],[-6.5,1,-7.9],[0,0,0],1); //divider 1
            makeCollisionCube(scene,world,[1.5,2,0.02],[-11.2,1,-7.9],[0,0,0],1); //divider 2

            //dining room/kitchen divider
            makeCollisionCube(scene,world,[2.5,2,0.02],[5.6,1,-1.95],[0,0,0],1); //divider 1
            makeCollisionCube(scene,world,[2,2,0.02],[11,1,-1.95],[0,0,0],1); //divider 2

    //Interior objs
        //Stairs
        makeFirstFloorStairs(scene,world,[0,0,-8.5]);
        
        //Fridge
        makeObject(scene,'../res/meshes/FirstFloor/Fridge.glb',[1,1,1],[5,-0.75,-1],[0,-Math.PI,0],1,null)
        makeCollisionCube(scene,world,[0.5,1,0.5],[5,1,-1],[0,0,0],1); //main fridge
        makeCollisionCube(scene,world,[0.1,1,0.01],[6,1,-0.75],[0,Math.PI/3,0],1); //door
        
        //Bookshelves
        makeBookShelf(scene,[-12,-0.8,4.2],[0,Math.PI/2,0]);
        makeBookShelf(scene,[-12,-0.8,0.9],[0,Math.PI/2,0]);
        makeBookShelf(scene,[-12,-0.8,-2.4],[0,Math.PI/2,0]);
        makeBookShelf(scene,[-12,-0.8,-5.7],[0,Math.PI/2,0]);
        makeBookShelf(scene,[-10,-0.8,-7.5],[0,0,0]);
            makeCollisionCube(scene,world,[0.01,2,12],[-11.9,1,-1],[0,0,0],1); //bookshelf collision

        //Oven
        makeObject(scene,'../res/meshes/FirstFloor/Oven.glb',[0.01,0.01,0.01],[28.7,-0.7,-10],[0,5/2*Math.PI,0],1,null)
            makeCollisionCube(scene,world,[0.5,1,0.5],[11.5,1,0.9],[0,0,0],1);
        
        //counter
        makeObject(scene,'..res/meshes/FirstFloor/Counter.glb',[100,100,100],[0,0,0],[0,0,0],1,null)


    //adding lights
        //entrance hall
            
            InteriorWallLightCreator(scene,[-3.5,1,3],[0,Math.PI/2,0],1); //right wall 1
            InteriorWallLightCreator(scene,[-3.5,1,-5],[0,Math.PI/2,0],1); //right wall 2
            InteriorWallLightCreator(scene,[3.5,1,3],[0,-Math.PI/2,0],1); //left wall 1
            InteriorWallLightCreator(scene,[3.5,1,-5],[0,-Math.PI/2,0],1); //left wall 2
        
        //library
            BedroomLightCreator(scene,[-8,2.15,-1],[0,Math.PI/2,0],1);
        
        //office
            BedroomLightCreator(scene,[-8,2.15,-11],[0,Math.PI/2,0],1);
        
        //kitchen
            InteriorWallLightCreator(scene,[8,1,5.5],[0,Math.PI,0],1);
        
        //dining room
            ChandelierCreator(scene,[8,1.8,-8],[0,Math.PI,0],1);

}

function makeSecondFloor(scene,world){
    //House exterior walls
    makeObject(scene,'../res/meshes/SecondFloor/SecondFloor.glb',[1,1,1],[0,-0.83,-4],[0,0,0],2,null)

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

    //storage room
    makeCollisionCube(scene,world,[3.25,2,0.01],[-7.3,1,2.5],[0,0,0],2); //front wall big
    makeCollisionCube(scene,world,[1.25,2,0.01],[-11.1,1,2.5],[0,0,0],2); //front wall small
    makeCollisionCube(scene,world,[0.1,2,2.5],[-5.5,1,4.3],[0,0,0],2); //right wall


    //Adding objects to the scene
        //Bathroom
        makeObject(scene,'../res/meshes/SecondFloor/Toilet.glb',[0.16,0.16,0.16],[0.75,-0.75,5.4],[0,-Math.PI,0],2,null)
            makeCollisionCube(scene,world,[0.1,1,0.1],[0.75,1,5.5],[0,0,0],2);
        
        //Main Bedroom
            //Bed
            makeObject(scene,'../res/meshes/SecondFloor/DoubleBed.glb',[0.7,0.7,0.7],[-9,-0.8,-12],[0,-Math.PI/2,0],2,null)
                makeCollisionCube(scene,world,[2.2,1,4],[-8.9,0,-12],[0,0,0],2); 
            //Toilet
            makeObject(scene,'../res/meshes/SecondFloor/Toilet.glb',[0.16,0.16,0.16],[-11.8,-0.8,-2],[0,Math.PI,0],2,null)
                makeCollisionCube(scene,world,[0.3,0.01,0.1],[-12,0,-2],[0,0,0],2);
        
        //Other bedrooms
        makeObject(scene,'../res/meshes/SecondFloor/SingleBed.glb',[0.7,0.7,0.7],[6.5,-0.8,-13],[0,-Math.PI/2,0],2,null) //bedroom 1
            makeCollisionCube(scene,world,[2.5,0.01,1],[6.5,0,-13],[0,0,0],2);
        makeObject(scene,'../res/meshes/SecondFloor/SingleBed.glb',[0.7,0.7,0.7],[6.5,-0.8,5],[0,-Math.PI/2,0],2,null) //bedroom 2
            makeCollisionCube(scene,world,[2.5,0.01,1],[6.5,0,5],[0,0,0],2);
}

function makeBasement(scene,world){
    //Make basement blender model
    makeObject(scene,'../res/meshes/Basement/Basement.glb',[1,1,1],[0,-0.83,-4],[0,0,0],3,null)

  //Collision boxes
    //exterior walls
    makeCollisionCube(scene,world,[0.01,2,19.75],[-12.4,1,-4],[0,0,0],3); //right wall
    makeCollisionCube(scene,world,[0.01,2,19],[12.25,1,-4],[0,0,0],3); //left wall
    makeCollisionCube(scene,world,[24,2,0.1],[0,1,-13.95],[0,0,0],3); //back wall 
    //   makeCollisionCube(scene,world,[24,2,0.1],[0,1,6],[0,0,0],3); //front wall

    //pillars
    makeCollisionCube(scene,world,[1.2,5,1.2],[-7,0,1.9],[0,0,0],3); //pillar 1
    makeCollisionCube(scene,world,[1.2,5,1.2],[-3,0,-10],[0,0,0],3); //pillar 2
    makeCollisionCube(scene,world,[1.2,5,1.2],[5,0,-10],[0,0,0],3); //pillar 3

    //dividers
    makeCollisionCube(scene,world,[0.01,2,15],[0,1,-6],[0,0,0],3); //main divider big
    makeCollisionCube(scene,world,[0.01,2,1],[0,1,5],[0,0,0],3); //main divider small

    //exit room
    makeCollisionCube(scene,world,[0.01,2,9],[5.5,1,0.75],[0,0,0],3); //big wall
    makeCollisionCube(scene,world,[3.5,2,0.01],[7.75,1,-4],[0,0,0],3); //small recommendation
    makeCollisionCube(scene,world,[0.01,2,0.01],[12.1,1,-4],[0,0,0],3); //small recommendation

    //ladder
    makeCollisionCube(scene,world,[0.01,5,0.5],[10,1.5,4.75],[0,0,-Math.PI/4],3);
}

function makeFourthFloor(scene,world){
    makeObject(scene,'../res/meshes/Maze/GardenMaze.glb',[1,2,1],[0,-1,0],[0,0,0],4,null)
    
    //collisions
        //outer walls 
        makeCollisionCube(scene,world,[0.1,3,30],[-14.75,1,0],[0,0,0],4); //left
        makeCollisionCube(scene,world,[0.1,3,30],[14.75,1,0],[0,0,0],4); //right
        makeCollisionCube(scene,world,[20,3,0.01],[-4,1,-14.75],[0,0,0],4); //back long
        makeCollisionCube(scene,world,[5.5,3,0.01],[11.5,1,-14.75],[0,0,0],4); //exit
        // makeCollisionCube(scene,world,[30,3,0.01],[0,1,14.75],[0,0,0],4); //front

        //inner horizontal walls
        makeCollisionCube(scene,world,[6,3,0.25],[-11.5,1,5.8],[0,0,0],4);
        makeCollisionCube(scene,world,[6,3,0.25],[-8.8,1,11.65],[0,0,0],4);
        makeCollisionCube(scene,world,[2.8,3,0.25],[-9.8,1,8.8],[0,0,0],4);
        makeCollisionCube(scene,world,[2.4,3,0.25],[-1.4,1,6],[0,0,0],4);
        makeCollisionCube(scene,world,[2.4,3,0.25],[1,1,11.7],[0,0,0],4);
        makeCollisionCube(scene,world,[2.4,3,0.25],[7,1,11.7],[0,0,0],4);
        makeCollisionCube(scene,world,[5,3,0.25],[6,1,6],[0,0,0],4);
        makeCollisionCube(scene,world,[6,3,0.25],[12,1,9],[0,0,0],4);
        makeCollisionCube(scene,world,[2.4,3,0.25],[13,1,0],[0,0,0],4);
        makeCollisionCube(scene,world,[3,3,0.25],[-10,1,3],[0,0,0],4);
        makeCollisionCube(scene,world,[6,3,0.25],[-6,1,0],[0,0,0],4);
        makeCollisionCube(scene,world,[6,3,0.25],[-8.5,1,-3],[0,0,0],4);
        makeCollisionCube(scene,world,[3,3,0.25],[-10.5,1,-6],[0,0,0],4);
        makeCollisionCube(scene,world,[3,3,0.25],[-13.5,1,-11.5],[0,0,0],4);
        makeCollisionCube(scene,world,[2.4,3,0.25],[-7.5,1,-8.5],[0,0,0],4);
        makeCollisionCube(scene,world,[6,3,0.25],[-3,1,-5.75],[0,0,0],4);
        makeCollisionCube(scene,world,[2.4,3,0.25],[-4.75,1,-11.75],[0,0,0],4);
        makeCollisionCube(scene,world,[9,3,0.25],[4.5,1,-8.75],[0,0,0],4);
        makeCollisionCube(scene,world,[6,3,0.25],[8.75,1,-11.5],[0,0,0],4);
        makeCollisionCube(scene,world,[3,3,0.25],[13.25,1,-8.5],[0,0,0],4);
        makeCollisionCube(scene,world,[9,3,0.25],[7,1,-5.75],[0,0,0],4);
        makeCollisionCube(scene,world,[3.3,3,0.25],[10.25,1,-3],[0,0,0],4);
        makeCollisionCube(scene,world,[3.3,3,0.25],[-1.5,1,-2.9],[0,0,0],4);
        makeCollisionCube(scene,world,[3.3,3,0.25],[1.5,1,0],[0,0,0],4);
        makeCollisionCube(scene,world,[3.3,3,0.25],[-1.5,1,3],[0,0,0],4);
        makeCollisionCube(scene,world,[3.3,3,0.25],[4.3,1,3],[0,0,0],4);

        //inner vertical walls
        makeCollisionCube(scene,world,[0.25,3,2.5],[-11.5,1,10],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.75],[-6,1,7.5],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,6.4],[-2.9,1,8.75],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.75],[0,1,7.5],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.75],[3,1,7.5],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.75],[3,1,13],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.75],[5.75,1,10],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.75],[8.75,1,10],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.75],[11.75,1,13],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,5.5],[8.75,1,3],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,5.5],[11.75,1,3],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,5.5],[5.75,1,0],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,5.5],[-3,1,0],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,5.5],[2.8,1,-3],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,5.5],[-0.2,1,-6],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-5.8,1,2],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,5.5],[-11.5,1,0],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-8.8,1,-4],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,5.5],[-11.6,1,-9],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-8.8,1,-10],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-5.8,1,-13],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-2.9,1,-10],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[0,1,-13],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[3,1,-10],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[5.9,1,-13],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[5.9,1,-7],[0,0,0],4);
        makeCollisionCube(scene,world,[0.25,3,2.5],[11.8,1,-7],[0,0,0],4);

}

function makeFirstFloorStairs(scene,world,translate){
    const translate_x =translate[0] 
    const translate_y =translate[1] 
    const translate_z =translate[2] 

    //Make stairs blender model
    makeObject(scene,'../res/meshes/FirstFloor/FirstFloorStairs.glb',[1,1,1],[translate_x,-0.9+translate_y,-4+translate_z],[0,0,0],1,null)


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

function makeBookShelf(scene,translate,rotation){
    makeObject(scene,'../res/meshes/FirstFloor/Bookshelf.glb',[0.035,0.015,0.015],translate,rotation,1,null)
}

function makeObject(scene,path,scale,translate,rotation,floor,material){
    var obj;
    // const loader = new THREE.GLTFLoader();
    gltfLoader.load(path, function(gltf){
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
                    if(material!=null){
                        node.material = material
                    }
                    
                }
            });
            
            scene.add(obj);
            if(floor==1){
                first_floor_objects.push(obj);
            }
            else if(floor == 2){
                second_floor_objects.push(obj);
            }
            else if(floor == 3){
                third_floor_objects.push(obj);
            }
            else{
                fourth_floor_objects.push(obj)
            }
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });
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
    else if(floor == 3){
        third_floor_objects.push(box);
        third_floor_collisions.push(boxBody);
    }
    else{
        fourth_floor_objects.push(box);
        fourth_floor_collisions.push(boxBody);
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

function InteriorWallLightCreator(scene,position,rotation,floor){
    makeObject(scene,'../res/meshes/InteriorWallLight.glb',[1,1,1],position,rotation,floor,null)
}

function BedroomLightCreator(scene,position,rotation,floor){
    makeObject(scene,'../res/meshes/SecondFloor/BedroomLights.glb',[1,0.75,1],position,rotation,floor,null)
}

function ChandelierCreator(scene,position,rotation,floor){
    makeObject(scene,'../res/meshes/FirstFloor/Chandelier.glb',[2,1.5,2],position,rotation,floor,null)
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
        for(var i=0;i<third_floor_collisions.length;i++){
            world.removeBody(third_floor_collisions[i]);
        }
        for(var i=0;i<third_floor_objects.length;i++){
            scene.remove(third_floor_objects[i]);
        }

    }
    else{
        for(var i=0;i<fourth_floor_collisions.length;i++){
            world.removeBody(fourth_floor_collisions[i]);
        }
        for(var i=0;i<fourth_floor_objects.length;i++){
            scene.remove(fourth_floor_objects[i]);
        }
    }
}

export {makeFirstFloor,makeSecondFloor,makeBasement,makeFourthFloor,removeFloor}