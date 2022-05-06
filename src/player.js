var loaded = null
import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from "./animationManager.js"

export default class Player extends THREE.Group {
    constructor(scene, world, camera) {
        super()
        this.scene = scene
        this.world = world
        this.camera = camera
        this.init()
    }

   init() {
        const loader = new THREE.GLTFLoader()

        loader.load('../res/meshes/Character_Main.glb', (gltf) =>{
            this.gltf = gltf
            this.define()
        })

        this.max_velocity = 25
        //(backward = -1)
        //(forward  =  1)
        this.direction = 0 
        this.velocity_ratio = 0 //[0 , 1]

        //(left rotation  = -1)
        //(right rotation = 1)
        this.rotation_direction = 0
        this.rotation_ratio = 0 //[0, 1]

        this.play_direction = 1
        this.desired_action = "idle"
    }

    addControls(){
        document.addEventListener('keydown', (event)=>{
            if(event.key == 'w'){
                this.direction = 1
                this.play_direction = 1
                this.desired_action = "walk"
                if (event.ctrlKey == false){
                    
                    this.velocity_ratio = 1
                }else {
                    this.velocity_ratio = 2
                } 
            }

            if(event.key == 's'){
                this.desired_action = "walk"
                this.direction = -1
                this.play_direction = -1
                this.velocity_ratio = -1
            }

            if(event.key == 'a'){
                this.rotation_direction = 1
            }           
            
            if (event.key == 'd'){
                this.rotation_direction = -1
            }

            if (event.key == ' '){
                this.desired_action = 'jump'
            }
        })

        document.addEventListener('keyup', (event)=>{
            console.log(event)
            if(event.key == 'w' || event.key == 's'){
                this.desired_action = "idle"
                this.direction = 0
            }

            if(event.key == 'a' || event.key == 'd'){
                this.rotation_direction = 0
            }
        })
    }

    define(){
        var model = this.gltf.scene
        this.add(model);
        this.model = model
        this.model.rotateY(Math.PI)

        this.updateMaterials(this.gltf.scene);
        var skeleton = new THREE.SkeletonHelper( model );
        skeleton.visible = true;
        this.scene.add( skeleton );
        
        const animations = this.gltf.animations;

        const mixer = new THREE.AnimationMixer( model );

        //Getting the animations from the mesh
        const actions = [
            {name : "crouch",     action : mixer.clipAction( animations[ 0 ] )},
            {name : "walk",       action : mixer.clipAction( animations[ 1 ] )},
            {name : "idle",       action : mixer.clipAction( animations[ 2 ] )},
            {name : "jump",       action : mixer.clipAction( animations[ 3 ] )},
            {name : "walk",       action : mixer.clipAction( animations[ 4 ] )},        
            //{name : "standUp",    action : mixer.clipAction( animations[ 5 ] )},
        ]

        this.animation_manager = new AnimationManager(model, mixer, actions, [])
        
        this.addControls()

        this.body = new CANNON.Body({
            shape : new CANNON.Box(new CANNON.Vec3(1,2,0.7)),
            position : new CANNON.Vec3(0, 2, 10),
            mass : 60
        })

        
        this.body.linearDamping = 0.999
        this.scene.add(this)
        this.world.addBody(this.body)
    }

    update = (delta) =>{
        if(delta == 0) return
            //interpolation functions (logorithmic)
            this.velocity_ratio += (this.direction - this.velocity_ratio) / (delta/2)
            this.rotation_ratio += (this.rotation_direction - this.rotation_ratio) / (delta)
        try{
            //this.rotation.y+=(delta/100 * this.rotation_ratio)
            this.rotation.y = this.camera.rotation.y;
            this.body.quaternion.copy(this.quaternion);
            this.animation_manager.update(delta, this.desired_action, this.play_direction)
            this.updateTransform()
            this.updateMaterials(this.model)
        } catch {
            console.error('not yet loaded')
        }
    }

    updateMaterials(model) {
        model.traverse(child => {
            if (child.isMesh )child.castShadow=true;
        });
    }

    updateTransform() {
        this.body.velocity.x = - this.max_velocity * this.velocity_ratio * Math.sin(this.rotation.y)/5
        this.body.velocity.z = - this.max_velocity * this.velocity_ratio * Math.cos(this.rotation.y)/5    
        this.position.copy(this.body.position)
        this.position.y -= .5
        this.translateY(-1.5)
        this.body.quaternion.copy(this.quaternion)
        this.camera.position.copy(this.body.position)
        this.camera.quaternion.copy(this.quaternion)
        this.camera.translateY(-0.5)
        this.camera.translateZ(4)
    }

    dispose() {
        // Dispose everything that was created in this class - GLTF model, materials etc.
    }
}
