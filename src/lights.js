function pointLightCreator(colour, intensity, distance, decay, bias){
  const pointLight = new THREE.PointLight(colour, intensity, distance, decay);
  pointLight.castShadow = true; //allows the light to cast shadows
  pointLight.shadow.bias = bias;

  const pLightHelper = new THREE.PointLightHelper(pointLight,100);
  const pLightShadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);

  return [pointLight,pLightHelper,pLightShadowHelper];
}

function moonCreator(colour, intensity, distance, decay){
  var pLightObject = pointLightCreator(colour,intensity,distance,decay);
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

  const sphereGeo = new THREE.SphereGeometry(radius);
  const sphereMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xffffff ,
    map: texture ,
    reflectivity:1, 
    emissive:0xffffff,
    emissiveIntensity:0.75
  }); 
  const moon = new THREE.Mesh(sphereGeo,sphereMaterial);
  moon.position.set(0,0,0);
  moon.castShadow = false; 
  return moon;
}

function torch(colour, intensity, distance, decay, bias, position){
  var pLightObject = pointLightCreator(colour,intensity,distance,decay,bias);
  var pLight = pLightObject[0];
  pLight.position.set(position[0],position[1]+0.4,position[2]);
  var pLightHelper = pLightObject[1];
  var pLightShadowHelper = pLightObject[2];
  return pLight;
}

export { pointLightCreator, moonCreator, addSphereMoon,torch}