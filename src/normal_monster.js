import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from './animationManager.js'
import Monster from './base_monster.js'
import { Pathfinding } from '../lib/Pathfinding.js'
export default class NormalMonster extends Monster {

    constructor(scene, world, position, path, player, paused){
        super(scene, world, position, path, player, paused, "../res/meshes/Characters/BasicMonster.glb")
        let navmesh;
        const loader = new THREE.GLTFLoader();
        loader.load( '../res/meshes/FirstFloor_nav.glb', ({scene}) => {
            scene.traverse((node) => {
                if (node.isMesh){ 
                    navmesh = node;
                    navmesh.material.transparent = true;
                    navmesh.material.opacity = 0.5;
                    this.navmesh  = navmesh;
                    console.log("navmesh found")
                }
                
                
            });
        }, undefined, (e) => {
            console.error(e);
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
            {name : "basic_attack",         action : mixer.clipAction( animations[ 0 ] )},
            {name : "idle",                 action : mixer.clipAction( animations[ 1 ] )},
            {name : "walk",                 action : mixer.clipAction( animations[ 2 ] )},
        ]

        this.animation_manager = new AnimationManager(model, mixer, actions, [])

        this.body = new CANNON.Body({
            shape : new CANNON.Sphere(0.5),
            position : new CANNON.Vec3(this.start_pos.x, this.start_pos.y, this.start_pos.z),
            mass : 10,
        })


        this.body.linearDamping = 0
        this.scene.add(this)
        this.world.addBody(this.body)
        this.loaded = true
    }

}