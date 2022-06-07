
import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from './animationManager.js'
import { angleBetween } from './misc.js'
import { tookDamage } from './overlay.js'



export default class Monster extends THREE.Group {

<<<<<<< HEAD:src/monster.js
    constructor(scene, world, position, player) {
=======
    constructor(scene, world, position, path, player, paused, mesh_source){
>>>>>>> 731d1fc73ec4b98b53cdad3975f2b6dad62c7bc3:src/base_monster.js
        super()
        this.scene = scene
        this.world = world
        this.start_pos = position
<<<<<<< HEAD:src/monster.js
        this.player = new PlayerProxy(player);
        this.prev_direction = new CANNON.Vec3(0, 0, 0)
        this.path_index = 1
        this.loaded = false





=======
        for (var i = 0; i < path.length; i++){
            path[i].add(path[i], this.start_pos)
        }
        this.hitting = false
        this.path = path
        this.prev_direction = new CANNON.Vec3(0, 0, 0)
        this.path_index = 1
        this.loaded = false
        this.enemy = player
        this.paused = paused
        this.init(mesh_source)
    }
    
    init(source){
>>>>>>> 731d1fc73ec4b98b53cdad3975f2b6dad62c7bc3:src/base_monster.js
        const loader = new THREE.GLTFLoader()
        loader.load(source, (gltf) => {
            this.gltf = gltf
            this.define()
        })

        this.animation_state = 0
        this.transition_state = 0
        this.rotdir = 0
        this.rot_scale = 0
        //monster ai

    }

    updateMaterials(model) {
        model.traverse(child => {
            if (child.isMesh) child.castShadow = true;
        });
    }

<<<<<<< HEAD:src/monster.js
    define() {
        var model = this.gltf.scene
        this.add(model)
        this.model = model
        this.model.matrixAutoUpdate = false;
        //    this.updateMaterials(model)

        //  this.skeleton = new THREE.SkeletonHelper( model )
        //  this.skeleton.visible = true;
        //   this.scene.add( this.skeleton )

        const animations = this.gltf.animations;

        const mixer = new THREE.AnimationMixer(model);

        //Getting the animations from the mesh
        const actions = [
            { name: "basic_attack", action: mixer.clipAction(animations[0]) },
            { name: "walk", action: mixer.clipAction(animations[1]) },
            { name: "roar", action: mixer.clipAction(animations[2]) }
        ]

        this.animation_manager = new AnimationManager(model, mixer, actions, [])

        this.body = new CANNON.Body({
            shape: new CANNON.Sphere(0.5),
            position: new CANNON.Vec3(this.start_pos.x, this.start_pos.y, this.start_pos.z),
            mass: 10,
        })


        this.body.linearDamping = 0
        this.scene.add(this)
        this.world.addBody(this.body)
        this.loaded = true

        this.model.matrixAutoUpdate = false;

        this.vehicle.setRenderComponent(this.model, sync)
        function sync(entity, renderComponent) {
            renderComponent.matrix.copy(entity.worldMatrix);
=======
    updateTransform(delta){
       
        const p = this.path[this.path_index]
        const b = this.body.position
        var desired = (new CANNON.Vec3(p.x - b.x, 0, p.z - b.z).unit())
        const facing = new CANNON.Vec3(Math.sin(this.rotation.y), 0, Math.cos(this.rotation.y))
        
        // face the correct direction
        const angle = Math.round(angleBetween(desired, facing))
        this.rotation.y += delta * angle///500
        if (angle != 0) return;
        const curr_direction = desired

        // distance between the body and the point its trying to reach
        const diff = Math.sqrt(Math.pow(p.x - b.x, 2) + Math.pow(p.y - b.y, 2) + Math.pow(p.z - b.z, 2))
        if (diff  <= 0.5){
            this.path_index = (this.path_index + 1) % this.path.length
>>>>>>> 731d1fc73ec4b98b53cdad3975f2b6dad62c7bc3:src/base_monster.js
        }
    }

<<<<<<< HEAD:src/monster.js

    update(delta) {
        if (!this.loaded) return
        try {
            this.play_direction = 1;
            this.desired_action = "walk"
            this.animation_manager.update(delta * 4500, this.desired_action, this.play_direction)
        } catch (e) {
=======
    set_looked_at(bool){
        this.being_looked_at = bool
    }

    update( delta ){
        if(!this.loaded) return
        
        try{
            let time = delta%10;
            this.play_direction = 1 
            this.desired_action = "walk"
            if(this.being_looked_at != true){
                if(this.position.distanceTo(this.enemy.position) < 2){
                    this.body.velocity = new CANNON.Vec3(0, 0, 0)
                    if(!this.hitting && !this.paused && time == 0) {
                        tookDamage(0.5)
                    }
                    this.desired_action = "basic_attack"
                } else { 
                    this.hitting = false;
                    this.paused = false;
                    this.updateTransform(delta)
                }
                this.animation_manager.update( delta, this.desired_action, this.play_direction )
            } else {
                this.body.velocity = new CANNON.Vec3(0, 0, 0)
            }
            
            
        }catch(e){
>>>>>>> 731d1fc73ec4b98b53cdad3975f2b6dad62c7bc3:src/base_monster.js
            console.error(e.stack)
        }
        this.player.update();
        if(this.player.watching){
            //player is looking at monster so monster should not do anything
        }
        else{
            //if monster sees player, go to player
            //else follow set path
            
        }

    }

}
class PlayerProxy {
    constructor(player) {
        this.player = player;
        this.position = new THREE.Vector3(); //keeps track of player position
        this.position.copy(this.player.position);
        this.watching = false; //is player looking at monster

    }
    update() { //copy player coordinates and check if player is looking at monster
        this.position.copy(this.player.position);
    }

}