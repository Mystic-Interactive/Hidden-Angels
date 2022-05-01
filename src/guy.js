var loaded = null
import * as CANNON from '../lib/cannon-es.js'

export  class Guy extends THREE.Group {
    constructor(scene, world, camera) {
        super()
        this.scene = scene
        this.world = world
        this.camera = camera
        this.movements = new KeyBoardHandler();
        console.log(world)
        this.init()
    }

   init() {
        const loader = new THREE.GLTFLoader()

        loader.load('../../res/meshes/Soldier.glb', (gltf) =>{
            this.gltf = gltf
            this.define()
        })
        this.animation_state = 0
        this.transition_state = 0
        this.rotDir = 0
        this.rot_scale = 0
    }
    
    playAllAnimations(){
        this.actions.forEach(action => {
            action.play()
            action.setEffectiveWeight(4)
            action.loop = true
        });
    }

    addControls(){
        document.addEventListener('keydown', (event)=>{
            if(event.code == 'KeyW'){
                if (event.ctrlKey == false){
                    this.animation_state = 1
                }else {
                    this.animation_state = 2
                } 
            }

            if(event.code == 'KeyS'){
                this.animation_state = -1
            }

            if(event.code == 'KeyA'){
                this.rotDir = 1
            }           
            
            if (event.code == 'KeyD'){
                this.rotDir = -1
            }
        })

        document.addEventListener('keyup', (event)=>{
            console.log(event)
            if(event.code == 'KeyW' || event.code == 'KeyS'){
                this.animation_state = 0
            }

            if(event.code == 'KeyA' || event.code == 'KeyD'){
                this.rotDir = 0
            }
        })
    }
    updateMovements(){


    }
    define(){
        var model = this.gltf.scene
        this.add(model);

        this.updateMaterials(this.gltf.scene);
        this.animations = this.gltf.animations;
        this.mixer = new THREE.AnimationMixer( model );

        this.idleAction = this.mixer.clipAction( this.animations[ 0 ] );
        this.walkAction = this.mixer.clipAction( this.animations[ 3 ] );
        this.runAction = this.mixer.clipAction( this.animations[ 1 ] );

        this.actions = [ this.idleAction, this.walkAction, this.runAction ];

        this.playAllAnimations()
        this.addControls()

        this.body = new CANNON.Body({
            shape : new CANNON.Sphere(2),
            position : new CANNON.Vec3(0, 1, 0),
            mass : 1
        })

        this.scene.add(this)
        this.world.addBody(this.body)
    }


    setWeight(action, weight){
        action.enabled = true;
        if (this.transition_state > 0){
            action.setEffectiveTimeScale(1);
        } else action.setEffectiveTimeScale(-1)
        
        action.setEffectiveWeight(weight);
    }

    determineAnimationWeights(){
        for (const index in this.actions) {

            var diff = Math.abs(Math.abs(this.transition_state) - index)
           const action = this.actions[index]
            

            if(diff < 1){
                this.setWeight(action, 1 - diff)
            }else{
                this.setWeight(action, 0)
            }
        }
    }

    update = () =>{
        this.transition_state += (this.animation_state - this.transition_state)/100
        this.rot_scale += (this.rotDir - this.rot_scale) / 100
        try{
            this.determineAnimationWeights()
            this.mixer.update(1/100)
            this.rotation.y+=(0.01 * this.rot_scale)
            this.updateTransform()
        } catch {
            console.log('not yet loaded')
        }
    }

    updateMaterials(model) {
        model.traverse(child => {
            if (child.isMesh )child.castShadow=true;
        });
    }

    updateTransform() {
        this.body.velocity.x = - 10 * this.transition_state * Math.sin(this.rotation.y)
        this.body.velocity.z = - 10 * this.transition_state * Math.cos(this.rotation.y)
        this.position.copy(this.body.position)
        this.translateY(-1.5)
        this.body.quaternion.copy(this.quaternion)
        this.camera.position.copy(this.body.position)
        this.camera.translateY(1)
        this.camera.translateZ(4)
    }

    dispose() {
        // Dispose everything that was created in this class - GLTF model, materials etc.
    }
}


class KeyBoardHandler{ //handles user's keyboard inputs - used to pass movements to character
 constructor(){
  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;
  document.addEventListener('keydown', (event)=>{
    if(event.code == 'KeyW'){
       this.moveForward = true;   
    }

    if(event.code == 'KeyS'){
        this.moveBackward = true;
    }

    if(event.code == 'KeyA'){
        this.moveRight = true;
    }           
    
    if (event.code == 'KeyD'){
        this.moveLeft = true;
    }
 })
  document.addEventListener('keyup', (event)=>{
    if(event.code == 'KeyW'){
       this.moveForward = false;   
    }

    if(event.code == 'KeyS'){
        this.moveBackward = false;
    }

    if(event.code == 'KeyA'){
        this.moveRight = false;
    }           
    
    if (event.code == 'KeyD'){
        this.moveLeft = false;
    }
 })
}
  getForward(){
      return this.moveForward;
  }
   getBackward(){
      return this.moveBackward;
  }
   getLeft(){
      return this.moveLeft;
  }
   getRight(){
      return this.moveRight;
  }
 
}
class MouseHandler{ //handle's user's mouse movements - for firstperson camera movement
 constructor(){
    this.current = {
    x : 0,
    y : 0
    };
    this.previous = {x : null, y: null};
    document.addEventListener('mousemove', (event)=>{
        this.current.x = event.pageX  - window.innerWidth/2;
        this.current.y = event.pageY - window.innerHeight/2;
        if(this.previous.x == null){
            this.previous.x = this.current.x;
            this.previous.y = this.current.y;
        }
     })
 }
 update(){
    this.previous.x = this.current.x;
    this.previous.y = this.current.y;
 }

}

export class FirstPersonCamera{ //handles the mousemovements and rotates the camera accordingly
 constructor(camera){
     this.camera = camera;
     this.movements = new MouseHandler();
     this.r = 0;
     this.theta = 0;
     this.rotation = new THREE.Quaternion(); 
    
 }

 updateRotation(){//make rotation matrix to make camera look at new difference in x and y values
 //convert x,y deltas into spherical coordinates phi and theta
 const deltaX = (this.movements.current.x - this.movements.previous.x)/window.innerWidth;
 const deltaY = (this.movements.current.y - this.movements.previous.y)/window.innerHeight;

 this.r = this.r -deltaX * 5;
 this.theta =  Math.min(Math.max(this.theta +  -deltaY*5, -Math.PI/3), Math.PI/3);
 //convert r and theta into a rotation
 const qx = new THREE.Quaternion();
 qx.setFromAxisAngle(new THREE.Vector3(0,1,0),this.r);
 const qz = new THREE.Quaternion();
 qz.setFromAxisAngle(new THREE.Vector3(1,0,0),this.theta);

 const q = new THREE.Quaternion();
 q.multiply(qx);
 q.multiply(qz);
 this.rotation.copy(q);
 
}
 updateCamera(){ //rotate camera using rotation
   this.camera.quaternion.copy(this.rotation);
 }
 update(){
     this.updateRotation();
     this.updateCamera();
     this.movements.update();
 }

}


  