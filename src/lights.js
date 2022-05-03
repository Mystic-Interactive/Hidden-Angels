function pointLightCreator(colour,intensity,distance,decay){
    const pointLight = new THREE.PointLight(colour,intensity,distance,decay);
    pointLight.castShadow=true; //allows the light to cast shadows
    pointLight.shadow.bias = -0.004;

    const pLightHelper = new THREE.PointLightHelper(pointLight,100);
    const pLightShadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);

    return [pointLight,pLightHelper,pLightShadowHelper];
}

function InteriorWallLightCreator(colour,intensity,distance,decay,scene,position,scale,rotation){
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
    });
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }, (error) => {
      console.log(error);
    });

    var pLightObject = pointLightCreator(colour,intensity,distance,decay);
    var pLight = pLightObject[0];
    pLight.position.set(position[0],position[1],position[2]);
    var pLightHelper = pLightObject[1];
    var pLightShadowHelper = pLightObject[2];
    scene.add(pLight);
    scene.add(pLightHelper);
    scene.add(pLightShadowHelper);
}

function ChandelierCreator(colour,intensity,distance,decay,scene,position,scale,rotation){
    var obj;
    var loaded_model = false;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/Chandelier.glb', function(gltf){
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
    });
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }, (error) => {
      console.log(error);
    });

    //Builds the individual lights in the chandelier
    var pLightObject = pointLightCreator(colour,intensity,distance,decay);
    var pLight = pLightObject[0];
    pLight.position.set(0.45*scale[0]+position[0],position[1],position[2]);
    var pLightHelper = pLightObject[1];
    var pLightShadowHelper = pLightObject[2];
    scene.add(pLight);
    // scene.add(pLightHelper);
    // scene.add(pLightShadowHelper);

    
    var pLightObject2 = pointLightCreator(colour,intensity,distance,decay);
    var pLight2 = pLightObject2[0];
    pLight2.position.set(0.323*scale[0]+position[0],position[1],0.323*scale[2]-position[2]);
    var pLightHelper2 = pLightObject2[1];
    var pLightShadowHelper2 = pLightObject2[2];
    scene.add(pLight2);
    // scene.add(pLightHelper2);
    // scene.add(pLightShadowHelper2);

    var pLightObject3 = pointLightCreator(colour,intensity,distance,decay);
    var pLight3 = pLightObject3[0];
    pLight3.position.set(position[0],position[1],0.45*scale[2]-position[2]);
    var pLightHelper3 = pLightObject3[1];
    var pLightShadowHelper3 = pLightObject3[2];
    scene.add(pLight3);
    // scene.add(pLightHelper3);
    // scene.add(pLightShadowHelper3);

    var pLightObject4 = pointLightCreator(colour,intensity,distance,decay);
    var pLight4 = pLightObject4[0];
    pLight4.position.set(-0.323*scale[0]+position[0],position[1],0.323*scale[2]-position[2]);
    var pLightHelper4 = pLightObject4[1];
    var pLightShadowHelper4 = pLightObject4[2];
    scene.add(pLight4);
    // scene.add(pLightHelper4);
    // scene.add(pLightShadowHelper4);

    var pLightObject5 = pointLightCreator(colour,intensity,distance,decay);
    var pLight5 = pLightObject5[0];
    pLight5.position.set(-0.45*scale[0]+position[0],position[1],position[2]);
    var pLightHelper5 = pLightObject5[1];
    var pLightShadowHelper5 = pLightObject5[2];
    scene.add(pLight5);
    // scene.add(pLightHelper5);
    // scene.add(pLightShadowHelper5);

    var pLightObject6 = pointLightCreator(colour,intensity,distance,decay);
    var pLight6 = pLightObject6[0];
    pLight6.position.set(-0.323*scale[0]+position[0],position[1],-0.323*scale[2]-position[2]);
    var pLightHelper6 = pLightObject6[1];
    var pLightShadowHelper6 = pLightObject6[2];
    scene.add(pLight6);
    // scene.add(pLightHelper6);
    // scene.add(pLightShadowHelper6);

    var pLightObject6 = pointLightCreator(colour,intensity,distance,decay);
    var pLight6 = pLightObject6[0];
    pLight6.position.set(position[0],position[1],-0.45*scale[2]-position[2]);
    var pLightHelper6 = pLightObject6[1];
    var pLightShadowHelper6 = pLightObject6[2];
    scene.add(pLight6);
    // scene.add(pLightHelper6);
    // scene.add(pLightShadowHelper6);

    var pLightObject7 = pointLightCreator(colour,intensity,distance,decay);
    var pLight7 = pLightObject7[0];
    pLight7.position.set(0.323*scale[0]+position[0],position[1],-0.323*scale[2]-position[2]);
    var pLightHelper7 = pLightObject7[1];
    var pLightShadowHelper7 = pLightObject7[2];
    scene.add(pLight7);
    // scene.add(pLightHelper7);
    // scene.add(pLightShadowHelper7);


    
}

function BedroomLightCreator(colour,intensity,distance,decay,scene,position,scale,rotation){
    var obj;
    var loaded_model = false;
    const loader = new THREE.GLTFLoader();
    loader.load('../res/meshes/BedroomLights.glb', function(gltf){
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
    });
    }, (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    }, (error) => {
      console.log(error);
    });

    var pLightObject = pointLightCreator(colour,intensity,distance,decay);
    var pLight = pLightObject[0];
    pLight.position.set(0.5*scale[0]+position[0],position[1],position[2]);
    var pLightHelper = pLightObject[1];
    var pLightShadowHelper = pLightObject[2];
    scene.add(pLight);
    // scene.add(pLightHelper);
    // scene.add(pLightShadowHelper);

    var pLightObject2 = pointLightCreator(colour,intensity,distance,decay);
    var pLight2 = pLightObject2[0];
    pLight2.position.set(position[0],position[1],0.5*scale[2]+position[2]);
    var pLightHelper2 = pLightObject2[1];
    var pLightShadowHelper2 = pLightObject2[2];
    scene.add(pLight2);
    // scene.add(pLightHelper2);
    // scene.add(pLightShadowHelper2);

    var pLightObject3 = pointLightCreator(colour,intensity,distance,decay);
    var pLight3 = pLightObject3[0];
    pLight3.position.set(-0.5*scale[0]+position[0],position[1],position[2]);
    var pLightHelper3 = pLightObject3[1];
    var pLightShadowHelper3 = pLightObject3[2];
    scene.add(pLight3);
    // scene.add(pLightHelper3);
    // scene.add(pLightShadowHelper3);

    var pLightObject4 = pointLightCreator(colour,intensity,distance,decay);
    var pLight4 = pLightObject4[0];
    pLight4.position.set(position[0],position[1],-0.5*scale[2]+position[2]);
    var pLightHelper4 = pLightObject4[1];
    var pLightShadowHelper4 = pLightObject4[2];
    scene.add(pLight4);
    // scene.add(pLightHelper4);
    // scene.add(pLightShadowHelper4);

    
}

function moonCreator(colour,intensity,distance,decay){

    var pLightObject = pointLightCreator(colour,intensity,distance,decay);
    var moonLight = pLightObject[0];
    moonLight.castShadow=true; //allows the light to cast shadows
    moonLight.shadow.bias = 0.001;
    moonLight.shadow.mapSize.width = 2048; 
    moonLight.shadow.mapSize.height = 2048;

    var pLightHelper = pLightObject[1];
    var pLightShadowHelper = pLightObject[2];

    // scene.add(moonLight);
    // scene.add(pLightHelper);
    // scene.add(pLightShadowHelper);
    return moonLight
        
}

function addSphereMoon(radius){
  const sphereGeo = new THREE.SphereGeometry(radius);
  const sphereMaterial = new THREE.MeshBasicMaterial({color:0xFFFFFF});
  const moon = new THREE.Mesh(sphereGeo,sphereMaterial);
  moon.position.set(0,0,0);
  moon.castShadow = false; 
  return moon;
}

export { pointLightCreator, InteriorWallLightCreator, ChandelierCreator, BedroomLightCreator, moonCreator, addSphereMoon}