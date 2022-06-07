//Class that will handle the creation of lights

//point light creator that will be used to make all lights
function pointLightCreator(colour,intensity,distance,decay,bias){
    const pointLight = new THREE.PointLight(colour,intensity,distance,decay);
    pointLight.castShadow=true; //allows the light to cast shadows
    pointLight.shadow.bias = bias; //sets the bias so the shadows dont look too bad
    
    return pointLight;
}

//Will create the moon with the adequate data
function moonCreator(colour,intensity,distance,decay){

    var moonLight = pointLightCreator(colour,intensity,distance,decay);
    moonLight.castShadow=true; //allows the light to cast shadows
    moonLight.shadow.bias = 0.001;
    moonLight.shadow.mapSize.width = 2048; 
    moonLight.shadow.mapSize.height = 2048;

    return moonLight
        
}

//Creates the moon geometry that will move with the point light
function addSphereMoon(radius){
  //Texture loader to store the texture and bumpmap for the moon
  const textLoader = new THREE.TextureLoader();
  var texture = textLoader.load("./textures/moon_texture.jfif");
  var displacementMap =  textLoader.load("./textures/moon_displacement.jpg");


  const sphereGeo = new THREE.SphereGeometry(radius);
  const sphereMaterial = new THREE.MeshLambertMaterial (  //Adding a special material to make the moon look more realistic
    { color: 0xffffff ,
    map: texture ,
    displacementMap: displacementMap,
    displacementScale: 1,
    bumpMap: displacementMap,
    bumpScale: 1,
    reflectivity:1, 
    shininess :1,
    emissive:0xffffff,
    emissiveMap: texture
    }); 
  const moon = new THREE.Mesh(sphereGeo,sphereMaterial);
  moon.position.set(0,0,0);
  moon.castShadow = false;  //Dont want the moon the cast a shadow as it should be considered a directional light
  return moon;
}

//Create a torch object light that will follow the players position
function torch(colour,intensity,distance,decay,bias,position){
  var pLight = pointLightCreator(colour,intensity,distance,decay,bias);
  pLight.position.set(position[0],position[1]+0.4,position[2]);
  return pLight;
}

export {moonCreator, addSphereMoon,torch}