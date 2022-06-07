
import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from './animationManager.js'
import { angleBetween } from './misc.js'



export default class Monster extends THREE.Group {

    constructor(scene, world, position, player) {
        super()
        this.scene = scene
        this.world = world
        this.start_pos = position
        this.player = new PlayerProxy(player);
        this.prev_direction = new CANNON.Vec3(0, 0, 0)
        this.path_index = 1
        this.loaded = false





        const loader = new THREE.GLTFLoader()
        loader.load('../res/meshes/Characters/BasicMonster.glb', (gltf) => {
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
        }
    }


    update(delta) {
        if (!this.loaded) return
        try {
            this.play_direction = 1;
            this.desired_action = "walk"
            this.animation_manager.update(delta * 4500, this.desired_action, this.play_direction)
        } catch (e) {
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