
import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from './animationManager.js'

export default class Monster extends THREE.Group {

    constructor(scene, world, path){
        super()
        this.scene = scene
        this.world = world
        this.start_pos = this.position
        this.path = path
        this.prev_direction = new CANNON.Vec3(0, 0, 0)
        this.path_index = 1
        this.loaded = false
        this.init()
    }

    init() {
        const loader = new THREE.GLTFLoader()
        loader.load('../res/meshes/Basic_Monster.glb', (gltf) => {
            this.gltf = gltf
            this.define()
        })

        this.animation_state = 0
        this.transition_state = 0
        this.rotdir = 0
        this.rot_scale = 0
    }

    updateMaterials(model) {
        model.traverse(child => {
            if (child.isMesh )child.castShadow=true;
        });
    }

    define(){
        var model = this.gltf.scene
        this.add(model)
        this.model = model

        this.updateMaterials(model)

        this.skeleton = new THREE.SkeletonHelper( model )
        this.skeleton.visible = true;
        this.scene.add( this.skeleton )

        const animations = this.gltf.animations;

        const mixer = new THREE.AnimationMixer( model );

        //Getting the animations from the mesh
        const actions = [
            {name : "basic_attack",       action : mixer.clipAction( animations[ 0 ] )},
            {name : "walk",       action : mixer.clipAction( animations[ 1 ] )},
            {name : "roar",       action : mixer.clipAction( animations[ 2 ] )}
        ]

        this.animation_manager = new AnimationManager(model, mixer, actions, [])

        this.body = new CANNON.Body({
            shape : new CANNON.Sphere(0.5),
            position : new CANNON.Vec3(0, 1, 0),
            mass : 10,
        })


        this.body.linearDamping = 0
        this.scene.add(this)
        this.world.addBody(this.body)
        this.loaded = true
    }

    updateTransform(){
       
        const p = this.path[this.path_index]
        const b = this.body.position
        const curr_direction = (new CANNON.Vec3(p.x - b.x, 0, p.z - b.z).unit())

        // distance between the body and the point its trying to reach
        const diff = Math.sqrt(Math.pow(p.x - b.x, 2) + Math.pow(p.y - b.y, 2) + Math.pow(p.z - b.z, 2))

        if (diff  <= 0.5){
            this.path_index = (this.path_index + 1) % this.path.length
        }

        this.body.velocity = curr_direction.scale(10)
        this.position.copy(this.body.position)
        this.translateY(-this.body.boundingRadius)
    }

    update( delta ){
        if(!this.loaded) return
        try{
            this.play_direction = 1 
            this.desired_action = "roar"
            this.animation_manager.update( delta, this.desired_action, this.play_direction )
            this.updateTransform()
        }catch(e){
            console.error(e.stack)
        }
    }

}