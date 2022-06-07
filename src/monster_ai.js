import { Vec3 } from '../lib/cannon-es.js';
import * as YUKA from '../lib/yuka.module.js' 
import AnimationManager from './animationManager.js'

export default class monster_ai extends THREE.Group{
    constructor(scene,player){
        super();
        this.scene = scene;
         //player proxy
         this.player = new PlayerProxy(player);
        //yuka logic for following a path
        this.vehicle = new YUKA.Vehicle();
        function sync(entity, renderComponent) {
            renderComponent.matrix.copy(entity.worldMatrix);
        }
        this.vehicle.maxSpeed = 5;
        this.path = new YUKA.Path();
        this.path.add(new YUKA.Vector3(0,0,0));
        this.path.add(new YUKA.Vector3(0,0,10));
        this.path.loop = false;
        this.vehicle.position.copy(this.path.current());
      
        this.followPathBehavior = new YUKA.FollowPathBehavior(this.path,0.5);
        this.vehicle.steering.add(this.followPathBehavior);
        this.entityManager = new YUKA.EntityManager();
        this.entityManager.add(this.vehicle);
        
        //make monster mesh
        const loader = new THREE.GLTFLoader()
        loader.load('../res/meshes/Characters/BasicMonster.glb', (gltf) => {
            this.gltf = gltf;
            var model = this.gltf.scene
            this.model = model;
            this.add(model)
            this.scene.add(this)
            this.model.matrixAutoUpdate = false;

            this.vehicle.setRenderComponent(this.model,sync)
        }) 
        //time for yuka logic
        this.time = new YUKA.Time();
       
    }

    update(){
        const delta = this.time.update().getDelta();
        this.player.update();
        const position =  new YUKA.Vector3();
        position.copy(this.player.position);
        const vec = new Vec3(0,0,0);
        if(!(position.equals(vec))){
            this.path.clear();
            this.path.add(position);

        }
        
        this.entityManager.update(delta);
    }

}

class PlayerProxy{
    constructor(player){
        this.player = player;
        this.position = new THREE.Vector3(); //keeps track of player position
        this.position.copy(this.player.position);
        this.watching = false; //is player looking at monster
        
    }
    update(){ //copy player coordinates and check if player is looking at monster
        this.position.copy(this.player.position);
    }

}