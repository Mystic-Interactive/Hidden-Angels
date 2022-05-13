import * as CANNON from '../lib/cannon-es.js'

export class FirstFloor extends THREE.Group {
    constructor(scene, world, camera) {
        super()
        this.scene = scene
        this.world = world
        this.camera = camera
        this.init_()
    }

    init_(){
        const loader = new THREE.GLTFLoader()

        loader.load('../res/meshes/FirstFloor.glb', (gltf) =>{
            this.gltf = gltf
            this.define()
        })

        this.update()
    }

    define(){
        var model = this.gltf.scene
        this.add(model);

        this.updateMaterials(this.gltf.scene);

        this.body = new CANNON.Body({
            shape : new CANNON.Box(new CANNON.Vec3(40, 8, 50)),
            position : new CANNON.Vec3(0, 10, 0),
            mass : 1,
        })

        this.body.linearDamping = 0.999
        this.scene.add(this)
        this.world.addBody(this.body)
    }

    update = () =>{
        try{
            this.position.copy(this.body.position);
            this.quaternion.copy(this.body.quaternion);
            this.updateMaterials(this.model)
        } catch {
            console.error('not yet loaded')
        }
    }

    updateMaterials(model) {
        model.traverse(child => {
            if (child.isMesh ){
                child.castShadow=true;
                child.receiveShadow=true; 
            }
        });
    }
}