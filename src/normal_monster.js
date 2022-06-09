import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from './animationManager.js'
import Monster from './base_monster.js'
import { Pathfinding } from '../lib/Pathfinding.js'
export default class NormalMonster extends Monster {


    constructor(scene, world, GLTFLoader, position, path, player, paused) {
        //translate = [translate_x,-0.9+translate_y,-4+translate_z]
        super(scene, world, GLTFLoader, position, path, player, paused, "../res/meshes/Characters/BasicMonster.glb", 1)
        let navmesh;
        const loader2 = new THREE.GLTFLoader();
        loader2.load('../res/meshes/FirstFloor_nav.glb', ({ scene }) => {            
            scene.traverse((node) => {
                if (node.name == "NavMesh") {
                 //   node.position.set(0, -0.9, -4);
                    this.navmesh = node;
                    this.setUpPathfinding();
                    this.scene.add(node);
                }

            }, undefined, (e) => {
                console.error(e);
            });
        });
    }

    setUpPathfinding() {// initialise navmesh to be used
        this.pathfinding = new Pathfinding();
        this.ZONE = 'firstfloor'
        console.log(Pathfinding.createZone(this.navmesh.geometry));
        this.pathfinding.setZoneData(this.ZONE, Pathfinding.createZone(this.navmesh.geometry));
    }

    define() {
        var model = this.gltf.scene
        this.add(model)
        this.model = model

        this.updateMaterials(model)

        this.skeleton = new THREE.SkeletonHelper(model)
        this.skeleton.visible = true;
        this.scene.add(this.skeleton)

        const animations = this.gltf.animations;

        const mixer = new THREE.AnimationMixer(model);

        //Getting the animations from the mesh
        const actions = [
            { name: "basic_attack", action: mixer.clipAction(animations[0]) },
            { name: "idle", action: mixer.clipAction(animations[1]) },
            { name: "walk", action: mixer.clipAction(animations[2]) },
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
    }

}