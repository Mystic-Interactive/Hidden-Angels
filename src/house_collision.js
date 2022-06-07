import * as CANNON from '../lib/cannon-es.js'
import { Reflector } from '../lib/Reflector.js'
import  {makeDynamicObject,setGoalPosition}  from '../src/house_dynamic.js'

//Lists that will be used to remove the objects in the scene from that floor before drawing a new scene
var collisions = []
var objects = []

//Loading manager that will be used to manage the loading screen
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

//Function that will add all objects in the first floor to the scene
function makeFirstFloor(scene,world){
    //Make first floor blender model
    makeObject(scene,'../res/meshes/FirstFloor/FirstFloor.glb',[1,1,1],[0,-0.83,-4],[0,0,0],null)

  //collision for the first floor
    //floor and roof
    makeCollisionCube(scene,world,[23,0.1,19.75],[0,-0.85,-4],[0,0,0]); //floor
    // makeCollisionCube(scene,world,[23,0.1,19.75],[0,5.5,-4],[0,0,0]); //roof


    //walls
        makeCollisionCube(scene,world,[0.01,2,5.6],[-12.4,1,-11.2],[0,0,0]); //right wall
        makeCollisionCube(scene,world,[0.01,2,19],[12.25,1,-4],[0,0,0]); //left wall
        makeCollisionCube(scene,world,[10,2,0.1],[0,3,-13.95],[0,0,0]); //back wall stairs
        makeCollisionCube(scene,world,[6.1,2,0.1],[-8.5,2,-13.95],[0,0,0]); //backwall office
        makeCollisionCube(scene,world,[6,2,0.1],[8.5,2,-13.95],[0,0,0]); //backwall diningroom
        // makeCollisionCube(scene,world,[24,2,0.1],[0,1,6],[0,0,0]); //front wall

    //interior walls
        //main dividers
        makeCollisionCube(scene,world,[0.02,2,5],[-4,1,3],[0,0,0]); //right wall 1
        makeCollisionCube(scene,world,[0.02,2,10],[-4,1,-7.5],[0,0,0]); //right wall 2
        makeCollisionCube(scene,world,[0.02,2,4],[4,1,3.5],[0,0,0]); //left wall 1
        makeCollisionCube(scene,world,[0.02,2,6],[4,1,-3],[0,0,0]); //left wall 2
        makeCollisionCube(scene,world,[0.02,2,4],[4,1,-11],[0,0,0]); //left wall 3

        //room dividers
            //office/library divider
            makeCollisionCube(scene,world,[4.5,2,0.02],[-6.5,1,-7.9],[0,0,0]); //divider 1
            makeCollisionCube(scene,world,[1.5,2,0.02],[-11.2,1,-7.9],[0,0,0]); //divider 2

            //dining room/kitchen divider
            makeCollisionCube(scene,world,[2.5,2,0.02],[5.6,1,-1.95],[0,0,0]); //divider 1
            makeCollisionCube(scene,world,[2,2,0.02],[11,1,-1.95],[0,0,0]); //divider 2

    //Interior objs
        //Stairs
        makeFirstFloorStairs(scene,world,[0,0,-8.5]);
        
        //Fridge
        makeObject(scene,'../res/meshes/FirstFloor/Fridge.glb',[1,1,1],[5,-0.75,-1],[0,-Math.PI,0],null)
        makeCollisionCube(scene,world,[0.5,1,0.5],[5,1,-1],[0,0,0]); //main fridge
        makeCollisionCube(scene,world,[0.1,1,0.01],[6,1,-0.75],[0,Math.PI/3,0]); //door
        
        //Bookshelves


        makeBookShelf(scene,[-12,-0.8,4.2],[0,Math.PI/2,0]);
        makeBookShelf(scene,[-12,-0.8,0.9],[0,Math.PI/2,0]);
        makeBookShelf(scene,[-12,-0.8,-2.4],[0,Math.PI/2,0]);
        makeBookShelf(scene,[-12,-0.8,-5.7],[0,Math.PI/2,0]);
            makeCollisionCube(scene,world,[0.01,2,12],[-11.9,1,-1],[0,0,0],1); //bookshelf collision


        //Oven
        makeObject(scene,'../res/meshes/FirstFloor/Oven.glb',[0.01,0.01,0.01],[28.7,-0.7,-10],[0,5/2*Math.PI,0],null)
        
        //counter
        makeObject(scene,'../res/meshes/FirstFloor/Counter.glb',[4.1,1,1],[8.2,-0.7,5.4],[0,Math.PI,0],null)
        makeObject(scene,'../res/meshes/FirstFloor/Counter.glb',[1.6,1,1],[11.75,-0.7,3.1],[0,Math.PI/2,0],null)
        makeObject(scene,'../res/meshes/FirstFloor/Counter.glb',[1.15,1,1],[11.75,-0.7,-0.8],[0,Math.PI/2,0],null)
            makeCollisionCube(scene,world,[8,0.75,0.125],[8,0.25,5],[0,0,0]);
            makeCollisionCube(scene,world,[0.125,0.25,6],[12,0.5,1],[0,0,0]);


    //adding lights
        //entrance hall
            
            InteriorWallLightCreator(scene,[-3.5,1,3],[0,Math.PI/2,0]); //right wall 1
            InteriorWallLightCreator(scene,[-3.5,1,-5],[0,Math.PI/2,0]); //right wall 2
            InteriorWallLightCreator(scene,[3.5,1,3],[0,-Math.PI/2,0]); //left wall 1
            InteriorWallLightCreator(scene,[3.5,1,-5],[0,-Math.PI/2,0]); //left wall 2
        
        //library
            BedroomLightCreator(scene,[-8,2.15,-1],[0,Math.PI/2,0]);
        
        //office
            BedroomLightCreator(scene,[-8,2.15,-11],[0,Math.PI/2,0]);
        
        //kitchen
            InteriorWallLightCreator(scene,[8,1,5.5],[0,Math.PI,0]);
        
        //dining room
            ChandelierCreator(scene,[8,1.8,-8],[0,Math.PI,0]);
    
    //Placing level items
    makeDynamicObject('../res/meshes/PuzzleItems/Key.glb',[1,1,1],[11.5,-0.75,-13],[0,0,0],6) //Library key
    makeDynamicObject('../res/meshes/PuzzleItems/Book.glb',[1,1,1],[6,0.4,4.75],[Math.PI/2,0,0],7) //secretbook

    //Placing interactable objects
    makeDynamicObject('../res/meshes/DoubleDoor.glb',[1,1,1],[-4,-1,-1.05],[0,Math.PI/2,0],13) //Library
    makeDynamicObject('../res/meshes/FirstFloor/Bookshelf.glb',[0.85,1,1],[-10,-0.8,-7.5],[0,0,0],14) //Secretbookcase

    //make goal position
    setGoalPosition(new THREE.Vector3(-11.5,-0.75,-13))
    makeObject(scene,'../res/meshes/Flag.glb',[0.75,0.75,0.75],[-11.5,-0.75,-13],[0,-Math.PI,0],null)


}

//Function that will add all objects in the second floor to the scene
function makeSecondFloor(scene,world){
    //House exterior walls
    makeObject(scene,'../res/meshes/SecondFloor/SecondFloor.glb',[1,1,1],[0,-0.83,-4],[0,0,0],null)

  //Collision boxes
    //exterior walls
      makeCollisionCube(scene,world,[0.01,2,19.75],[-12.4,1,-4],[0,0,0]); //right wall
      makeCollisionCube(scene,world,[0.01,2,19],[12.25,1,-4],[0,0,0]); //left wall
      makeCollisionCube(scene,world,[24,2,0.1],[0,1,-13.95],[0,0,0]); //back wall stairs
    //   makeCollisionCube(scene,world,[24,2,0.1],[0,1,6],[0,0,0]); //front wall

    //master bedroom
    makeCollisionCube(scene,world,[8,3,0.01],[-7.5,1,0.1],[0,0,0]); //back bathroom
    makeCollisionCube(scene,world,[5,3,0.1],[-6,1,-4],[0,0,0]); //bathroom divider big
    makeCollisionCube(scene,world,[2,3,0.1],[-11,1,-4],[0,0,0]); //bathroom divider small
    makeCollisionCube(scene,world,[0.1,3,6.5],[-3,1,-3.75],[0,0,0]); //right divider big
    makeCollisionCube(scene,world,[0.1,3,5],[-3,1,-11],[0,0,0]); //right divider small

    //bedroom far
    makeCollisionCube(scene,world,[6,2,0.1],[8,1,-6.5],[0,0,0]); //door
    makeCollisionCube(scene,world,[0.1,2,7],[5,1,-10],[0,0,0]); //wall

    //bedroom close
    makeCollisionCube(scene,world,[5,2,0.1],[8,1,-1.5],[0,0,0]); //door
    makeCollisionCube(scene,world,[0.1,2,7],[5,1,2],[0,0,0]); //wall

    //toilet
    makeCollisionCube(scene,world,[3,2,0.1],[3,1,1],[0,0,0]); //door
    makeCollisionCube(scene,world,[0.1,2,4.5],[0,1,3.5],[0,0,0]); //wall


    //storage room
    makeCollisionCube(scene,world,[3.25,2,0.01],[-7.3,1,2.5],[0,0,0]); //front wall big
    makeCollisionCube(scene,world,[1.25,2,0.01],[-11.1,1,2.5],[0,0,0]); //front wall small
    makeCollisionCube(scene,world,[0.1,2,2.5],[-5.5,1,4.3],[0,0,0]); //right wall

    //Goal wall
    makeCollisionCube(scene,world,[5.5,3,0.2],[0.25,1,-11.5],[0,0,0]); //back bathroom


    //Adding objects to the scene
        //Bathroom
        makeObject(scene,'../res/meshes/SecondFloor/Toilet.glb',[0.16,0.16,0.16],[0.75,-0.75,5.4],[0,-Math.PI,0],null)
            makeCollisionCube(scene,world,[0.1,1,0.1],[0.75,1,5.5],[0,0,0]);
        InteriorWallLightCreator(scene,[4.5,1,3.5],[0,3*Math.PI/2,0]);
        
        //Main Bedroom
            //Bed
            makeObject(scene,'../res/meshes/SecondFloor/DoubleBed.glb',[0.7,0.7,0.7],[-9,-0.8,-12],[0,-Math.PI/2,0],null)
                makeCollisionCube(scene,world,[2.2,1,4],[-8.9,0,-12],[0,0,0]); 
            //Toilet
            makeObject(scene,'../res/meshes/SecondFloor/Toilet.glb',[0.16,0.16,0.16],[-11.8,-0.8,-2],[0,Math.PI,0],null)
                makeCollisionCube(scene,world,[0.3,0.01,0.1],[-12,0,-2],[0,0,0]);
            //Bath
            makeObject(scene,'../res/meshes/SecondFloor/Bath.glb',[1,1,1.25],[-4,-0.8,-2],[0,Math.PI,0],null)
                makeCollisionCube(scene,world,[0.5,0.5,3.5],[-4,0,-2],[0,0,0]); //right divider small
            //Light
            BedroomLightCreator(scene,[-8,2.15,-8],[0,Math.PI/2,0]);
            InteriorWallLightCreator(scene,[-7.5,1,-3.5],[0,0,0]);
        
        //Other bedrooms
            //Bedroom 1
            makeObject(scene,'../res/meshes/SecondFloor/SingleBed.glb',[0.7,0.7,0.7],[6.5,-0.8,-13],[0,-Math.PI/2,0],null) //bedroom 1
                makeCollisionCube(scene,world,[2.5,0.01,1],[6.5,0,-13],[0,0,0]);
            BedroomLightCreator(scene,[9,2.15,-11],[0,Math.PI/2,0]);
            //Bedroom 2
            makeObject(scene,'../res/meshes/SecondFloor/SingleBed.glb',[0.7,0.7,0.7],[6.5,-0.8,5],[0,-Math.PI/2,0],null) //bedroom 2
                makeCollisionCube(scene,world,[2.5,0.01,1],[6.5,0,5],[0,0,0]);
            BedroomLightCreator(scene,[9,2.15,2],[0,Math.PI/2,0]);
        
        //storage room
        InteriorWallLightCreator(scene,[-6,1,4],[0,3*Math.PI/2,0]);

        

        //Mirrors
        makeMirrors(scene)

        //Placing level items
        makeDynamicObject('../res/meshes/PuzzleItems/Key.glb',[1,1,1],[-11.5,-0.75,-13],[0,0,0],1) //Bathroom key
        makeDynamicObject('../res/meshes/PuzzleItems/Key.glb',[1,1,1],[11.5,-0.75,5],[0,0,0],2) //Closet Key
        makeDynamicObject('../res/meshes/PuzzleItems/Screwdriver.glb',[0.5,0.5,0.5],[5,-0.8,5.5],[Math.PI/2,0,Math.PI/2],3) //Screw driver
        makeDynamicObject('../res/meshes/PuzzleItems/Shovel.glb',[0.5,0.25,0.3],[11.5,-0.75,-13.25],[0,Math.PI/2,-Math.PI/6],4) //Shovel
        makeDynamicObject('../res/meshes/PuzzleItems/Key.glb',[1,1,1],[-11.5,-0.75,4.75],[0,0,0],5) //GoalKey

        //Placing interactable objects
        makeDynamicObject('../res/meshes/Door.glb',[0.95,1,1],[0.75,-0.75,0.95],[0,0,0],8) //bathroom door
        makeDynamicObject('../res/meshes/Blockade.glb',[0.5,0.75,1],[11.5,-0.75,-6.4],[0,0,0],10) //bedroom 1 door
        makeDynamicObject('../res/meshes/Rubble.glb',[0.5,0.75,0.75],[11.5,-0.75,-1],[0,0,0],11) //bedroom 2 door
        makeDynamicObject('../res/meshes/Door.glb',[1,1,1],[-9.75,-0.75,2.5],[0,0,0],9) //closet door
        makeDynamicObject('../res/meshes/Door.glb',[1.1,1,1],[4.1,-0.75,-11.5],[0,0,0],12) //goal door

        //make goal position
        setGoalPosition(new THREE.Vector3(0,-0.75,-13))
        makeObject(scene,'../res/meshes/Flag.glb',[1,1,1],[0,-0.75,-13],[0,-Math.PI,0],null)
}

//Function that will add all objects in the basement to the scene
function makeBasement(scene,world){
   
    //making the phing shading for the nests
    const textLoader = new THREE.TextureLoader();
    let normalColor = textLoader.load('../res/textures/nest_bumpmap.png');
    const nestMat = new THREE.MeshPhongMaterial({flatShading:true,color:0x3CD070,emissive:0x3CD070,emissiveIntensity:0.01,specular:0x636e72,normalMap:normalColor})

    //Make basement blender model
    makeObject(scene,'../res/meshes/Basement/Basement.glb',[1,1,1],[0,-0.83,-4],[0,0,0],null)

    //nests
    makeObject(scene,'../res/meshes/Basement/Nest.glb',[1,1,1],[-11,-0.83,4.5],[0,0,0],nestMat)
    makeObject(scene,'../res/meshes/Basement/Nest.glb',[1,1,1],[11.25,-0.83,-12.75],[0,0,0],nestMat)

  //Collision boxes
    //exterior walls
    makeCollisionCube(scene,world,[0.01,2,19.75],[-12.4,1,-4],[0,0,0]); //right wall
    makeCollisionCube(scene,world,[0.01,2,19],[12.25,1,-4],[0,0,0]); //left wall
    makeCollisionCube(scene,world,[24,2,0.1],[0,1,-13.95],[0,0,0]); //back wall 
    //   makeCollisionCube(scene,world,[24,2,0.1],[0,1,6],[0,0,0]); //front wall

    //pillars
    makeCollisionCube(scene,world,[1.2,5,1.2],[-7,0,1.9],[0,0,0]); //pillar 1
    makeCollisionCube(scene,world,[1.2,5,1.2],[-3,0,-10],[0,0,0]); //pillar 2
    makeCollisionCube(scene,world,[1.2,5,1.2],[5,0,-10],[0,0,0]); //pillar 3

    //dividers
    makeCollisionCube(scene,world,[0.01,2,15],[0,1,-6],[0,0,0]); //main divider big
    makeCollisionCube(scene,world,[0.01,2,1],[0,1,5],[0,0,0]); //main divider small

    //exit room
    makeCollisionCube(scene,world,[0.01,2,9],[5.5,1,0.75],[0,0,0]); //big wall
    makeCollisionCube(scene,world,[3.5,2,0.01],[7.75,1,-4],[0,0,0]); //small recommendation
    makeCollisionCube(scene,world,[0.01,2,0.01],[12.1,1,-4],[0,0,0]); //small recommendation

    //ladder
    makeCollisionCube(scene,world,[0.01,5,0.5],[10,1.5,4.75],[0,0,-Math.PI/4]);

    //egg sacks meshes
    makeCollisionCube(scene,world,[1.2,4,1.5],[-11,0,4.75],[0,0,0]);
    makeCollisionCube(scene,world,[1.2,4,1.5],[11,0,-12.5],[0,0,0]);

    //make goal position
    setGoalPosition(new THREE.Vector3(7.75,-0.75,4.75))
    makeObject(scene,'../res/meshes/Flag.glb',[0.75,0.75,0.75],[7.5,-0.75,4.5],[0,-Math.PI,0],null)


}

//Function that will add all objects in the maze to the scene
function makeFourthFloor(scene,world){
    var mazeMat =new THREE.MeshBasicMaterial({color: 0xFF0000});
    makeObject(scene,'../res/meshes/Maze/GardenMaze.glb',[1,2,1],[0,-1,0],[0,0,0],mazeMat)
    
    //collisions
        //outer walls 
        makeCollisionCube(scene,world,[0.1,3,30],[-14.75,1,0],[0,0,0]); //left
        makeCollisionCube(scene,world,[0.1,3,30],[14.75,1,0],[0,0,0]); //right
        makeCollisionCube(scene,world,[20,3,0.01],[-4,1,-14.75],[0,0,0]); //back long
        makeCollisionCube(scene,world,[5.5,3,0.01],[11.5,1,-14.75],[0,0,0]); //exit
        // makeCollisionCube(scene,world,[30,3,0.01],[0,1,14.75],[0,0,0],4); //front

        //inner horizontal walls
        makeCollisionCube(scene,world,[6,3,0.25],[-11.5,1,5.8],[0,0,0]);
        makeCollisionCube(scene,world,[6,3,0.25],[-8.8,1,11.65],[0,0,0]);
        makeCollisionCube(scene,world,[2.8,3,0.25],[-9.8,1,8.8],[0,0,0]);
        makeCollisionCube(scene,world,[2.4,3,0.25],[-1.4,1,6],[0,0,0]);
        makeCollisionCube(scene,world,[2.4,3,0.25],[1,1,11.7],[0,0,0]);
        makeCollisionCube(scene,world,[2.4,3,0.25],[7,1,11.7],[0,0,0]);
        makeCollisionCube(scene,world,[5,3,0.25],[6,1,6],[0,0,0]);
        makeCollisionCube(scene,world,[6,3,0.25],[12,1,9],[0,0,0]);
        makeCollisionCube(scene,world,[2.4,3,0.25],[13,1,0],[0,0,0]);
        makeCollisionCube(scene,world,[3,3,0.25],[-10,1,3],[0,0,0]);
        makeCollisionCube(scene,world,[6,3,0.25],[-6,1,0],[0,0,0]);
        makeCollisionCube(scene,world,[6,3,0.25],[-8.5,1,-3],[0,0,0]);
        makeCollisionCube(scene,world,[3,3,0.25],[-10.5,1,-6],[0,0,0]);
        makeCollisionCube(scene,world,[3,3,0.25],[-13.5,1,-11.5],[0,0,0]);
        makeCollisionCube(scene,world,[2.4,3,0.25],[-7.5,1,-8.5],[0,0,0]);
        makeCollisionCube(scene,world,[6,3,0.25],[-3,1,-5.75],[0,0,0]);
        makeCollisionCube(scene,world,[2.4,3,0.25],[-4.75,1,-11.75],[0,0,0]);
        makeCollisionCube(scene,world,[9,3,0.25],[4.5,1,-8.75],[0,0,0]);
        makeCollisionCube(scene,world,[6,3,0.25],[8.75,1,-11.5],[0,0,0]);
        makeCollisionCube(scene,world,[3,3,0.25],[13.25,1,-8.5],[0,0,0]);
        makeCollisionCube(scene,world,[9,3,0.25],[7,1,-5.75],[0,0,0]);
        makeCollisionCube(scene,world,[3.3,3,0.25],[10.25,1,-3],[0,0,0]);
        makeCollisionCube(scene,world,[3.3,3,0.25],[-1.5,1,-2.9],[0,0,0]);
        makeCollisionCube(scene,world,[3.3,3,0.25],[1.5,1,0],[0,0,0]);
        makeCollisionCube(scene,world,[3.3,3,0.25],[-1.5,1,3],[0,0,0]);
        makeCollisionCube(scene,world,[3.3,3,0.25],[4.3,1,3],[0,0,0]);

        //inner vertical walls
        makeCollisionCube(scene,world,[0.25,3,2.5],[-11.5,1,10],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.75],[-6,1,7.5],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,6.4],[-2.9,1,8.75],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.75],[0,1,7.5],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.75],[3,1,7.5],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.75],[3,1,13],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.75],[5.75,1,10],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.75],[8.75,1,10],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.75],[11.75,1,13],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,5.5],[8.75,1,3],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,5.5],[11.75,1,3],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,5.5],[5.75,1,0],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,5.5],[-3,1,0],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,5.5],[2.8,1,-3],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,5.5],[-0.2,1,-6],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-5.8,1,2],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,5.5],[-11.5,1,0],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-8.8,1,-4],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,5.5],[-11.6,1,-9],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-8.8,1,-10],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-5.8,1,-13],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-2.9,1,-10],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[-5.9,1,-8],[0,0,0]); 
        makeCollisionCube(scene,world,[0.25,3,2.5],[0,1,-13],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,3],[3,1,-10],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[5.9,1,-13],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[5.9,1,-7],[0,0,0]);
        makeCollisionCube(scene,world,[0.25,3,2.5],[11.8,1,-7],[0,0,0]);

    //make goal position
    setGoalPosition(new THREE.Vector3(7.75,-0.75,-16))
    makeObject(scene,'../res/meshes/Flag.glb',[0.75,0.75,0.75],[7.5,-0.75,-15],[0,-Math.PI,0],null)
}

//Makes the stairs with its collisions
function makeFirstFloorStairs(scene,world,translate){
    const translate_x =translate[0] 
    const translate_y =translate[1] 
    const translate_z =translate[2] 


    //Make stairs blender model
    makeObject(scene,'../res/meshes/FirstFloor/FirstFloorStairs.glb',[1,1,1],[translate_x,-0.9+translate_y,-4+translate_z],[0,0,0],null)
  
  //blocks
  makeCollisionCube(scene,world,[1.25,2,1.25],[-3.25+translate_x,0.5+translate_y,-4.5+translate_z],[0,0,0]); //right big
  makeCollisionCube(scene,world,[1.25,2,1.25],[3.25+translate_x,0.5+translate_y,-4.5+translate_z],[0,0,0]); //left big
  makeCollisionCube(scene,world,[0.3,1,0.5],[-2.5+translate_x,1+translate_y,-0.75+translate_z],[0,0,0]); //right small
  makeCollisionCube(scene,world,[0.3,1,0.5],[2.25+translate_x,1+translate_y,-0.75+translate_z],[0,0,0]); //left small

  //stairs
  makeCollisionStairCase(scene,world,[3,0.1,0.1],[translate_x,-0.9+translate_y,-1+translate_z],10,0,0.4); //straight
  makeCollisionCube(scene,world,[3,0.1,0.6],[translate_x,1.05+translate_y,-4.5+translate_z],[0,0,0]); //halfway
  makeCollisionStairCase(scene,world,[0.5,0.1,0.1],[-3+translate_x,1.25+translate_y,-4.7+translate_z],5,-1,0.15); //left
  makeCollisionStairCase(scene,world,[0.5,0.1,0.1],[3+translate_x,1.25+translate_y,-4.7+translate_z],5,1,0.15); //right

  //railings
  makeCollisionCube(scene,world,[1.25,1,0.01],[-3.25+translate_x,2+translate_y,-4+translate_z],[0,0,0]); //right top
  makeCollisionCube(scene,world,[1.25,1,0.01],[3.25+translate_x,2+translate_y,-4+translate_z],[0,0,0]); //left top
  makeCollisionCube(scene,world,[0.01,2,1.25],[-2.3+translate_x,0.1+translate_y,-3+translate_z],[0,0,0]); //right bottom
  makeCollisionCube(scene,world,[0.01,2,1.25],[2.3+translate_x,0.1+translate_y,-3+translate_z],[0,0,0]); //left bottom


}

//Males the bookshelf
function makeBookShelf(scene,translate,rotation){
    makeObject(scene,'../res/meshes/FirstFloor/Bookshelf.glb',[0.85,1,1],translate,rotation,1,null)
}

//Makes the mirrors with their reflection
function makeMirrors(scene){
    const mirrorOptions = {
        clipBias: 0.000,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x808080,
        multisample: 4,
      }

      const mirrorGeo = new THREE.PlaneGeometry(1, 1);
      const mainBathroomMirror = new Reflector(mirrorGeo, mirrorOptions);
      const bedroomBathroomMirror = new Reflector(mirrorGeo, mirrorOptions);
      mainBathroomMirror.rotation.y = -Math.PI/2
      mainBathroomMirror.position.set(4.85, 0.85, 2);
      bedroomBathroomMirror.rotation.y = Math.PI/2
      bedroomBathroomMirror.position.set(-12.35, 0.85, -2);
      scene.add(mainBathroomMirror);
      scene.add(bedroomBathroomMirror);

      objects.push(mainBathroomMirror);
      objects.push(bedroomBathroomMirror);

      let mainMirrorFrame;
      let bedroomMirrorFrame

      gltfLoader.load("../res/meshes/SecondFloor/MirrorFrame.glb", function(gltf){
        bedroomMirrorFrame = gltf.scene;
        bedroomMirrorFrame.position.set(-12.35, 0.3, -2);
        bedroomMirrorFrame.rotation.y = -Math.PI/2
        bedroomMirrorFrame.scale.set(0.55, 0.55);
        scene.add(bedroomMirrorFrame);
        objects.push(bedroomMirrorFrame);
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }, (error) => {
        console.log(error);
      });

      gltfLoader.load("../res/meshes/SecondFloor/MirrorFrame.glb", function(gltf){
        mainMirrorFrame = gltf.scene;
        mainMirrorFrame.position.set(4.85, 0.3, 2);
        mainMirrorFrame.rotation.y = -Math.PI/2
        mainMirrorFrame.scale.set(0.55, 0.55);
        scene.add(mainMirrorFrame);
        objects.push(mainMirrorFrame);
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }, (error) => {
        console.log(error);
      });

      
      
}

//Make object method that will be used to add the majorith of gltf files to the scene
function makeObject(scene,path,scale,translate,rotation,material){
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
            objects.push(obj)
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  }, (error) => {
    console.log(error);
  });
}

//Make collision method that will add a collision box at boxPos
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
    objects.push(box)
    collisions.push(boxBody)



    boxBody.position.copy(box.position); //Copy position
    boxBody.quaternion.copy(box.quaternion); //Copy orientation

}

//Will be used when making the stairs
function makeCollisionStairCase(scene,world,boxGeoSize,boxPos,num_stairs,direction,distance_spread){
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

//Makes the wall light
function InteriorWallLightCreator(scene,position,rotation){
    makeObject(scene,'../res/meshes/InteriorWallLight.glb',[1,1,1],position,rotation,null)
}

//Makes the smaller chandelier
function BedroomLightCreator(scene,position,rotation){
    makeObject(scene,'../res/meshes/SecondFloor/BedroomLights.glb',[1,0.75,1],position,rotation,null)
}

//Makes the grand chandelier
function ChandelierCreator(scene,position,rotation){
    makeObject(scene,'../res/meshes/FirstFloor/Chandelier.glb',[2,1.5,2],position,rotation,null)
}

//Function that will remove the floor and all objects on the floor
function removeFloor(scene,world){
    for(var i=0;i<collisions.length;i++){
        world.removeBody(collisions[i]);
    }
    for(var i=0;i<objects.length;i++){
        scene.remove(objects[i]);
    }
    collisions = []
    objects = []
}

export {makeFirstFloor,makeSecondFloor,makeBasement,makeFourthFloor,removeFloor,makeObject,makeCollisionCube}
