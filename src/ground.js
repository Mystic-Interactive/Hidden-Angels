import * as CANNON from '../lib/cannon-es.js'

// Class to make the world's surface 
export class Ground extends THREE.Group{
    // Constructor to get scene and camera and place plane in world
    constructor(scene, world){
      super();
      this.scene = scene;
      this.world = world;
      this.define()
    }
    
    define(){ // Create plane with ground textures and add it to world
      const textLoader = new THREE.TextureLoader();
      let baseColor = textLoader.load("./textures/ground/forrest_ground_01_diff_1k.jpg");
      let aoColor = textLoader.load("./textures/ground/forrest_ground_01_rough_ao_1k.jpg");
  
      // Create plane with ground textures
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 512, 512), 
        new THREE.MeshLambertMaterial({ // Lambert Material used so shadows look smooth
          map: baseColor,
          aoMap: aoColor,
        })
      );
      ground.geometry.attributes.uv2 = ground.geometry.attributes.uv;
      ground.rotation.set(-Math.PI/2, 0, 0)
      ground.position.y = -1
  
      this.body = new CANNON.Body({ // create physics body for plane
        shape: new CANNON.Box(new CANNON.Vec3(60, 60, 0.1)), // Cannon.js planes are infinite so use a cube instead
        type: CANNON.Body.STATIC,// Isn't affected by gravity
        material: new CANNON.Material()
      })
  
      // Enable shadows on surface
      this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      ground.receiveShadow = true;
      ground.castShadow = true;
  
      this.body.position.y = -1 
      // Add both body and plane to world
      this.add(ground)
      this.scene.add(this)
      this.world.addBody(this.body)
    }
    
    update(){ // link the physics body to the plane
      try{
        this.position.copy(this.body.position)
        this.quaternion.copy(this.body.quaternion)
      }catch(e){
        console.error(e.stack);
      }
    }
  }
  