import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from "./animationManager.js"
import PlayerController from "./playerControls.js"

export default class Player extends THREE.Group {
    constructor(scene, world, camera) {
        super()
        this.scene = scene
        this.world = world
        this.camera = camera
        this.loaded = false
        this.init_()
    }

   init_() {
        const loader = new THREE.GLTFLoader()

        loader.load('../res/meshes/Characters/Character_Main.glb', (gltf) =>{
            this.gltf = gltf
            this.define()
        })

        this.max_velocity = 10
        //(backward = -1)
        //(forward  =  1)
        this.direction = 0 
        this.velocity_ratio = 0 //[0 , 1]
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
            {name : "crouch",       action : mixer.clipAction( animations[ 0 ] )},
            {name : "crouch-walk",  action : mixer.clipAction( animations[ 1 ] )},
            {name : "idle",         action : mixer.clipAction( animations[ 2 ] )},
            {name : "jump",         action : mixer.clipAction( animations[ 3 ] )},
            {name : "walk",         action : mixer.clipAction( animations[ 4 ] )},        
            {name : "stand-up",     action : mixer.clipAction( animations[ 5 ] )},
        ]

        this.animation_manager = new AnimationManager(model, mixer, actions, [])
        this.player_controlls = new PlayerController(this, this.animation_manager)

        this.body = new CANNON.Body({
            shape : new CANNON.Box(new CANNON.Vec3(0.5,2,0.7)),
            position : new CANNON.Vec3(0, 3, 20),
            mass : 20
        })
        this.body.linearDamping = 0.5

        this.body.addEventListener("collide",function(e){
            //Add this to detect collision with specific object
            // if(e.body.id==24){
                // console.log("Box collided");
            // }
           
             //console.log(e.body.id)
        })

        this.scene.add(this)
        this.world.addBody(this.body)
        this.loaded = true
        this.updateMaterials(this.model)
    }

    update = (delta) =>{
        //guards
        if(delta == 0) return
        if(!this.loaded) return
        this.player_controlls.update(delta)
        //interpolation functions (logorithmic)
        if(["walk", "crouch_walk", "left", "right"].indexOf(this.current_state.action) > -1){
            this.velocity_ratio += (this.current_state.direction - this.velocity_ratio) / (delta * 0.1)
        }
        
        try{
            //this.rotation.y = this.camera.rotation.y;
            this.body.quaternion.copy(this.quaternion);
            this.updateTransform()
            
        } catch(e) {
            console.error(e.stack)
        }
    }

    updateMaterials(model) {
        model.traverse(child => {
            if (child.isMesh )child.castShadow=true;
        });
    }

    updateTransform() {


        if(this.current_state.action == "jump"){
            this.body.applyImpulse(new CANNON.Vec3(0, 33.5, 0))
        } else if (this.current_state.action == "walk" || this.current_state.action == "crouch-walk"){
            this.body.velocity.x = - this.max_velocity * this.velocity_ratio * Math.sin(this.rotation.y)
            this.body.velocity.z = - this.max_velocity * this.velocity_ratio * Math.cos(this.rotation.y)
        } else if (this.current_state.action == "left" || this.current_state.action == "right"){
            //console.log(Math.cos(this.rotation.y))
            this.body.velocity.x = - this.max_velocity * this.velocity_ratio * Math.sin(this.rotation.y +  Math.PI / 2)
            this.body.velocity.z = - this.max_velocity * this.velocity_ratio * Math.cos(this.rotation.y +  Math.PI / 2)
        }

        this.position.copy(this.body.position)
        this.position.y -= 2
        this.body.quaternion.copy(this.quaternion)
        this.camera.position.copy(this.body.position)

        const _euler = new THREE.Euler( 0, 0, 0, 'YXZ');
        _euler.setFromQuaternion(this.camera.quaternion)
        
        if(_euler.y > 0){
            this.rotation.y = _euler.y
        } else {
            this.rotation.y = _euler.y + Math.PI * 2
        }
        this.camera.translateY(-0.5)

        //this.camera.translateZ(5)
    }

    dispose() {
        // Dispose everything that was created in this class - GLTF model, materials etc.
    }
}
