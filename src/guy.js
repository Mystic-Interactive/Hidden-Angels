var loaded = null
import * as CANNON from '../lib/cannon-es.js'

export default class Guy extends THREE.Group {
    constructor(scene, world, camera) {
        super()
        this.scene = scene
        this.world = world
        this.camera = camera
        console.log(world)
        this.init()
    }

   init() {
        const loader = new THREE.GLTFLoader()

        loader.load('../res/meshes/Character_Main.glb', (gltf) =>{
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
            if(event.code == 'ArrowUp'){
                if (event.ctrlKey == false){
                    this.animation_state = 1
                }else {
                    this.animation_state = 2
                } 
            }

            if(event.code == 'ArrowDown'){
                this.animation_state = -1
            }

            if(event.code == 'ArrowLeft'){
                this.rotDir = 1
            }           
            
            if (event.code == 'ArrowRight'){
                this.rotDir = -1
            }
        })

        document.addEventListener('keyup', (event)=>{
            console.log(event)
            if(event.code == 'ArrowUp' || event.code == 'ArrowDown'){
                this.animation_state = 0
            }

            if(event.code == 'ArrowLeft' || event.code == 'ArrowRight'){
                this.rotDir = 0
            }
        })
    }

    define(){
        var model = this.gltf.scene
        this.add(model);

        this.updateMaterials(this.gltf.scene);
        var skeleton = new THREE.SkeletonHelper( model );
        skeleton.visible = true;
        this.scene.add( skeleton );
        
        this.animations = this.gltf.animations;

        this.mixer = new THREE.AnimationMixer( model );

        //Getting the animations from the mesh
        this.crouchAction       = this.mixer.clipAction( this.animations[ 0 ] )
        this.crouchWalkAction   = this.mixer.clipAction( this.animations[ 1 ] )
        this.idleAction         = this.mixer.clipAction( this.animations[ 2 ] )
        this.jumpAction         = this.mixer.clipAction( this.animations[ 3 ] )
        this.walkAction         = this.mixer.clipAction( this.animations[ 4 ] )        
        this.standUpAction      = this.mixer.clipAction( this.animations[ 5 ] )

        this.actions = [ this.idleAction, this.walkAction];

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
        this.camera.quaternion.copy(this.body.quaternion)
        this.camera.rotation.x
        this.camera.translateY(0)
        this.camera.translateZ(4)
    }

    dispose() {
        // Dispose everything that was created in this class - GLTF model, materials etc.
    }
}
  