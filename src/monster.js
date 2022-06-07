
import * as CANNON from '../lib/cannon-es.js'
import AnimationManager from './animationManager.js'
import { angleBetween } from './misc.js'
import * as YUKA from '../lib/yuka.module.js'


export default class Monster extends THREE.Group {

    constructor(scene, world, position, player){
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
        //load navigation mesh
        console.log("attempting to load navmesh")
        const nav_loader = new YUKA.NavMeshLoader();
        nav_loader.load( '../res/meshes/FirstFloor_nav.glb' ).then( ( navigationMesh ) => {
         this.navMesh = navigationMesh;
        this.vehicle = new YUKA.Vehicle();
        function sync(entity, renderComponent) {
            renderComponent.matrix.copy(entity.worldMatrix);
        }
        this.vehicle.maxSpeed = 5;
        this.path = new YUKA.Path();
        this.path.add(new YUKA.Vector3(0,-1,0));
        this.path.add(new YUKA.Vector3(0,-1,2.5));
        this.path.add(new YUKA.Vector3(0,-1,-2.5));
        this.path.add(new YUKA.Vector3(2.5,-1,1.5));
        this.path.add(new YUKA.Vector3(5,-1,0));
        this.path.loop = true;
        this.vehicle.position.copy(this.path.current());
      
        this.followPathBehavior = new YUKA.FollowPathBehavior(this.path,0.5);
        this.vehicle.steering.add(this.followPathBehavior);
        this.entityManager = new YUKA.EntityManager();
        this.entityManager.add(this.vehicle);
         console.log("loading navmesh")
  
    //     console.log("added navmesh");
    //   
    //      
      });        

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
        this.model.matrixAutoUpdate = false;
    //    this.updateMaterials(model)

      //  this.skeleton = new THREE.SkeletonHelper( model )
      //  this.skeleton.visible = true;
     //   this.scene.add( this.skeleton )

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
            position : new CANNON.Vec3(this.start_pos.x, this.start_pos.y, this.start_pos.z),
            mass : 10,
        })


        this.body.linearDamping = 0
        this.scene.add(this)
        this.world.addBody(this.body)
        this.loaded = true

        this.model.matrixAutoUpdate = false;

        this.vehicle.setRenderComponent(this.model,sync)
        function sync(entity, renderComponent) {
            renderComponent.matrix.copy(entity.worldMatrix);
        }
    }


    findPathTo(place) {

        const from = this.vehicle.position;
        const to = place;
    
        const movements = this.navMesh.findPath( from, to );
    
        this.followPathBehavior.active = true;
        this.path.clear();
    
        for ( const point of movements ) {
    
            this.path.add( point );
    
        }
    
    }   

    update( delta ){
        if(!this.loaded) return
        try{
            this.play_direction = 1; 
            this.desired_action = "walk"
            this.animation_manager.update( delta * 4500, this.desired_action, this.play_direction )
        }catch(e){
            console.error(e.stack)
        }
        this.player.update();
        //move monster to player position
        // const position =  new YUKA.Vector3();
        // position.copy(this.player.position);
        // this.path.clear();
        // this.path.add(position);   
        // this.entityManager.update(delta);
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