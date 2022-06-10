import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from "./animationManager.js"
import PlayerController from "./playerControls.js"
import { 
    can_see 
} from './sight.js'

const contains = (item, list) => {
    return(list.indexOf(item) > -1)
}
export default class Player extends THREE.Group {
    constructor(scene, world, camera, GLTFLoader, init_pos, monsters) {
        super()
        this.loader = GLTFLoader
        this.scene = scene
        this.world = world
        this.camera = camera
        this.loaded = false
        this.init_pos = init_pos
        this.view = 0
        this.init_()
        this.vision_limit = 4
        this.monsters = monsters
        this.angle = Math.PI/12
    }

   init_() {
        //const loader = new THREE.GLTFLoader()

        this.loader.load('../res/meshes/Characters/Character_Main.glb', (gltf) =>{
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
        skeleton.visible = false;
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
        this.player_controls = new PlayerController(this, this.animation_manager)

        this.body = new CANNON.Body({
            shape : new CANNON.Box(new CANNON.Vec3(0.5,2,0.7)),
            position : this.init_pos,
            mass : 60
        })
        this.body.linearDamping = 0.5

        this.scene.add(this)
        this.world.addBody(this.body)
        this.loaded = true
        this.updateMaterials(this.model)
    }
    
    looking_at(other) {
        return can_see(this, other, this.vision_limit, this.angle)
    } 

    update = (delta) =>{
        //guards
        if(delta == 0) return
        if(!this.loaded) return
        this.player_controls.update(delta)
        //interpolation functions (logorithmic)
        var found = false
        const list = ["walk", "crouch_walk", "left", "right"]
        list.forEach(element => {
            if(contains(element, this.current_state.action)) {
                found = true
            } 
        })

        if(found){
            this.velocity_ratio += (this.current_state.direction - this.velocity_ratio) / (10)
        }
        
        try{
            //this.rotation.y = this.camera.rotation.y;
            this.body.quaternion.copy(this.quaternion);
            this.updateTransform(delta)
            //this.looking_at()
                
            //loop through each monster and determine whether they are "visible" to the player
            console.log(this.monsters.length)
            this.monsters.forEach(monster => {
                monster.set_looked_at(this.looking_at(monster))
            });
        } catch(e) {
            console.error(e.stack)
        }


    }

    updateMaterials(model) {
        model.traverse(child => {
            if (child.isMesh )child.castShadow=true;
        });
    }

    updateTransform(delta) {
        const state = this.current_state
        
        const controls = this.player_controls
        if(contains("jump", state.action)){
            this.body.applyForce(new CANNON.Vec3(0, 10000, 0))
        } else if ((contains("walk", state.action) || contains("crouch-walk", state.action)) && !(controls.left || controls.right)){
            this.body.velocity.x = - this.max_velocity * this.velocity_ratio * Math.sin(this.rotation.y)
            this.body.velocity.z = - this.max_velocity * this.velocity_ratio * Math.cos(this.rotation.y)
        } else if ((controls.left || controls.right) && !(controls.forward || controls.backward)){
            var x_dir = 1
            if(controls.right){
                x_dir = -1
            }
            
            this.body.velocity.x = - x_dir * this.max_velocity * this.velocity_ratio * Math.sin(this.rotation.y +  Math.PI / 2)
            this.body.velocity.z = - x_dir * this.max_velocity * this.velocity_ratio * Math.cos(this.rotation.y +  Math.PI / 2)
        } else if ((controls.left || controls.right) && (controls.backward || controls.forward)){
            var y_dir = -1
            var x_dir = 1
            if(controls.forward){
                y_dir = 1
            }

            if (controls.right){
                x_dir = -1
            }
            
            this.body.velocity.x = - this.max_velocity * this.velocity_ratio * Math.sin(this.rotation.y + y_dir * x_dir * Math.PI/4)
            this.body.velocity.z = - this.max_velocity * this.velocity_ratio * Math.cos(this.rotation.y + y_dir * x_dir * Math.PI/4)
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
        
        this.camera.translateZ(this.view)
    }

    dispose() {
        // Dispose everything that was created in this class - GLTF model, materials etc.
    }
}
