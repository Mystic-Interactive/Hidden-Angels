var meshes = []

function pointLightCreator(colour,intensity,distance,decay,bias){
    const pointLight = new THREE.PointLight(colour,intensity,distance,decay);
    pointLight.castShadow=true; //allows the light to cast shadows
    pointLight.shadow.bias = bias;

    const pLightHelper = new THREE.PointLightHelper(pointLight,100);
    const pLightShadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);

    return [pointLight,pLightHelper,pLightShadowHelper];
}

function InteriorWallLightCreator(colour,intensity,distance,decay,scene,position,scale,rotation,bias){
    var obj;
    var loaded_model = false;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/InteriorWallLight.glb', function(gltf){
      obj = gltf.scene
      obj.position.set(position[0],position[1],position[2]);
      
      obj.rotation.x+=rotation[0];
      obj.rotation.y=rotation[1];
      obj.rotation.z=rotation[2];
      
      obj.scale.set(scale[0], scale[1], scale[2]);

      //Creating shadows for each child mesh
      gltf.scene.traverse(function(node){
        if(node.type === 'Mesh'){     
            node.castShadow=true;
            node.receiveShadow=true; //allows us to put shadows onto the walls
        }
        scene.add(obj)
        meshes.push(obj)
    });
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }, (error) => {
      console.log(error);
    });

    var pLightObject = pointLightCreator(colour,intensity,distance,decay,bias);
    var pLight = pLightObject[0];
    pLight.position.set(position[0],position[1]+0.4,position[2]);
    var pLightHelper = pLightObject[1];
    var pLightShadowHelper = pLightObject[2];
    return pLight;
}

function ChandelierCreator(colour,intensity,distance,decay,scene,position,scale,rotation,bias){
    var obj;
    var loaded_model = false;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/FirstFloor/Chandelier.glb', function(gltf){
      obj = gltf.scene
      obj.position.set(position[0],position[1],position[2]);
      
      obj.rotation.x+=rotation[0];
      obj.rotation.y=rotation[1];
      obj.rotation.z=rotation[2];
      
      obj.scale.set(scale[0], scale[1], scale[2]);

      //Creating shadows for each child mesh
      gltf.scene.traverse(function(node){
        if(node.type === 'Mesh'){     
            node.castShadow=true;
            node.receiveShadow=true; //allows us to put shadows onto the walls
        }
        scene.add(obj)
        meshes.push(obj)
    });
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }, (error) => {
      console.log(error);
    });

    //Builds the individual lights in the chandelier
    var pLightObject = pointLightCreator(colour,intensity,distance,decay,bias);
    var pLight = pLightObject[0];
    pLight.position.set(position[0],position[1]+0.01,position[2]);
    var pLightHelper = pLightObject[1];
    var pLightShadowHelper = pLightObject[2];
    return pLight;
}

function BedroomLightCreator(colour,intensity,distance,decay,scene,position,scale,rotation,bias){
    var obj;
    var loaded_model = false;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/SecondFloor/BedroomLights.glb', function(gltf){
      obj = gltf.scene
      obj.position.set(position[0],position[1],position[2]);
      
      obj.rotation.x+=rotation[0];
      obj.rotation.y=rotation[1];
      obj.rotation.z=rotation[2];
      
      obj.scale.set(scale[0], scale[1], scale[2]);

      //Creating shadows for each child mesh
      gltf.scene.traverse(function(node){
        if(node.type === 'Mesh'){     
            node.castShadow=true;
            node.receiveShadow=true; //allows us to put shadows onto the walls
        }
        scene.add(obj)
        meshes.push(obj)
    });
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }, (error) => {
      console.log(error);
    });

    var pLightObject = pointLightCreator(colour,intensity,distance,decay,bias);
    var pLight = pLightObject[0];
    pLight.position.set(position[0],position[1]+0.3,position[2]);
    var pLightHelper = pLightObject[1];
    var pLightShadowHelper = pLightObject[2];
    return pLight;   
}

function moonCreator(colour,intensity,distance,decay,bias){

    var pLightObject = pointLightCreator(colour,intensity,distance,decay,bias);
    var moonLight = pLightObject[0];
    moonLight.castShadow=true; //allows the light to cast shadows
    moonLight.shadow.bias = 0.001;
    moonLight.shadow.mapSize.width = 2048; 
    moonLight.shadow.mapSize.height = 2048;

    var pLightHelper = pLightObject[1];
    var pLightShadowHelper = pLightObject[2];
    return moonLight
        
}

function addSphereMoon(radius){
  const textLoader = new THREE.TextureLoader();
  var texture = textLoader.load("./textures/moon_texture.jfif");
  var displacementMap =  textLoader.load("./textures/moon_displacement.jpg");


  const sphereGeo = new THREE.SphereGeometry(radius);
  const sphereMaterial = new THREE.MeshLambertMaterial ( 
    { color: 0xffffff ,
    map: texture ,
    displacementMap: displacementMap,
    displacementScale: 0.2,
    bumpMap: displacementMap,
    bumpScale: 0.1,
     reflectivity:1, 
     shininess :0,
     emissive:0xffffff,
     emissiveIntensity:0.75
    }); 
  const moon = new THREE.Mesh(sphereGeo,sphereMaterial);
  moon.position.set(0,0,0);
  moon.castShadow = false; 
  return moon;
}

function removeMeshes(scene){
  for(var i =0;i<meshes.length;i++){
    scene.remove(meshes[i]);
  }
  meshes = []
}

function torch(colour,intensity,distance,decay,bias,position){
  var pLightObject = pointLightCreator(colour,intensity,distance,decay,bias);
  var pLight = pLightObject[0];
  pLight.position.set(position[0],position[1]+0.4,position[2]);
  var pLightHelper = pLightObject[1];
  var pLightShadowHelper = pLightObject[2];
  return pLight;
}

export { pointLightCreator, InteriorWallLightCreator, ChandelierCreator, BedroomLightCreator, moonCreator, addSphereMoon,removeMeshes,torch}