
import * as CANNON from '../lib/cannon-es.js'

export default class Monster extends three.Group {

    constructor(scene, world){
        super()
        this.scene = scene
        this.world = world
    }

    init_() {
        const loader = new THREE.GLTFLoader()

        loader.load('', (gltf) => {
            this.gltf = gltf
            this.define()
        })

        this.animation_state = 0
        this.transition_state = 0
        this.rotdir = 0
        this.rot_scale = 0
    }

    define(){

    }

    update(){
        
    }

}