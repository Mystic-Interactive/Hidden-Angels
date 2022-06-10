import * as CANNON from '../lib/cannon-es.js'
import { angleBetween } from './misc.js'
import { tookDamage } from './overlay.js'
import { can_see } from './sight.js'
import { Pathfinding } from '../lib/Pathfinding.js'
export default class Monster extends THREE.Group {

    constructor(scene, world, GLTFLoader, position, path, player, paused, mesh_source, damage,level){
        super()
        this.loader = GLTFLoader
        this.scene = scene
        this.world = world
        this.start_pos = position
        this.prev_path = null;
        // offsetting the path based on the monsters position
        // alows defining a path in object coordinates.
        for (var i = 0; i < path.length; i++){
            path[i].addVectors(path[i], this.start_pos)
        }
        this.hitting = false
        this.patrol = path
        this.prev_direction = new CANNON.Vec3(0, 0, 0)
        this.path_index = 1
        this.loaded = false
        this.enemy = player
        this.paused = paused
        this.pathfinding = null;
        this.ZONE = null;
        this.init(mesh_source)
        this.damage = damage //damage will be set in each individual monster
        this.vision_limit = 0
        this.angle = Math.PI * 2
        this.processNavMesh(level);
        this.max_attack_duration = 2000
        this.attack_duration = 0
    }
    
    //choose pathfinding navmesh and load navmesh for monster
    processNavMesh(level){
        //choose navigation mesh to use depending on level
        let mesh;
        let zoneName
        if(level == 1){
            mesh = '../res/meshes/Navigation/Level1_nav.glb';
            zoneName = 'level1';
        }else if(level == 2){
            mesh = '../res/meshes/Navigation/Level2_nav.glb';
            zoneName = 'level2';
        }
        else if(level == 3){
            mesh = '../res/meshes/Navigation/Level3_nav.glb';
            zoneName = 'level3';
        }
        else if(level == 4){
            mesh = '../res/meshes/Navigation/Level4_nav.glb';
            zoneName = 'level4';
        }
        else{
            mesh = '../res/meshes/Navigation/Level1_nav.glb';
            zoneName = 'level1';
        }
        const loader = new THREE.GLTFLoader();
        //load navigation mesh
        loader.load(mesh, ({ scene }) => {            
            scene.traverse((node) => {
                //first floor = [0,-0.83,-4]
                //second floor = [0,-0.83,-4]
                // basement translation = [0,-0.83,-4]
                //maze = scale = [1,2,1], translation = [0,-1,0]

                if (node.name == "NavMesh") { //navmesh is found
                    if((zoneName == 'level1') |(zoneName == 'level2') | (zoneName == 'level3') ){
                        node.position.set(0,0,-4);
                        if(zoneName == 'level1'){
                            this.scene.add(node);
                        }
                    }
                    else{
                        node.scale.set(1,2,1);
                    }
                    this.navmesh = node;
                    this.setUpPathfinding(zoneName);
                }
            }, undefined, (e) => {
                console.error(e);
            });
        });
    }
    setUpPathfinding(zoneName) {// create Pathfinding instance and setup the zones to be used
        this.pathfinding = new Pathfinding();
        this.ZONE = zoneName
        this.pathfinding.setZoneData(this.ZONE, Pathfinding.createZone(this.navmesh.geometry));
    }

    // initialize the monster by loading its mesh then defining specific attributes
    init(source){
        this.loader.load(source, (gltf) => {
            this.gltf = gltf
            this.define()
        })
    }

    // cast shadows
    updateMaterials(model) {
        model.traverse(child => {
            if (child.isMesh) child.castShadow = true;
        });
    }

    updateTransform(delta){ //moves monster
        const p = this.path[0]
        const b = this.body.position
        var desired = (new CANNON.Vec3(p.x - b.x, 0, p.z - b.z).unit()) // direction vector of where we want to go
        const facing = new CANNON.Vec3(Math.sin(this.rotation.y), 0, Math.cos(this.rotation.y)) // direction currently facing
        
        // face the correct direction
        const angle = Math.round(angleBetween(desired, facing))
        this.rotation.y += delta * angle///500
        if (angle != 0) return;
        const curr_direction = desired

        this.body.velocity = curr_direction.scale(3)
        this.position.copy(this.body.position)
        this.translateY(-this.body.boundingRadius)

    }

    set_looked_at(bool){
        this.being_looked_at = bool
    }

    changePath(target) {//changes path using the navmesh
        let pos = new THREE.Vector3(0,0,0);
        pos.copy(this.body.position);
        pos.y = 0;
        let pos2 = new THREE.Vector3(0,0,0);
        pos2.copy(target);
        pos2.y = 0; 
        var groupID = this.pathfinding.getGroup(this.ZONE,pos);
        var path = this.pathfinding.findPath(pos, pos2, this.ZONE, groupID);
        if( (this.path_prev != null)&&(this.path_prev == path)){

        }else{
        this.path = path;
    }
        this.path_prev = path;
    }

    looking_at_player(){
        return can_see(this, this.enemy, this.vision_limit, this.angle)
    }

    update( delta ){
        if(!this.loaded) return;
        
        try{
            this.play_direction = 1 
            this.desired_action = "walk"
            if(this.being_looked_at != true){// if the player is not looking at monster
                if(this.position.distanceTo(this.enemy.position) < 1.5){ //attack if the player is close to the monster
                    this.body.velocity = new CANNON.Vec3(0, 0, 0)
                    
                    if(!this.paused && this.attack_duration > this.max_attack_duration) {
                        tookDamage(this.damage)
                        this.attack_duration = 0
                    }

                    this.attack_duration += delta
                    this.desired_action = "basic_attack"

                } else { 

                    this.attack_duration = 0
                    // only chase when the player is visible to the monster or on specific levels
                    if (this.looking_at_player() || (this.zoneName == 'level3') | (this.zoneName == 'level4')){
                        this.changePath(this.enemy.body.position);
                    } 
                    else { // return to patrol path 
                        this.changePath(this.patrol[this.path_index])
                        const p = this.patrol[this.path_index]
                        const b = this.body.position

                        // distance between the body and the point its trying to reach
                        const diff = Math.sqrt(Math.pow(p.x - b.x, 2) + Math.pow(p.y - b.y, 2) + Math.pow(p.z - b.z, 2))
                        if (diff  <= 0.5){
                            this.path_index = (this.path_index + 1) % this.patrol.length
                        }  

                    }
                    this.paused = false;
                    this.updateTransform(delta)
                }
                this.animation_manager.update( delta, this.desired_action, this.play_direction )
            } else {
                this.body.velocity = new CANNON.Vec3(0, 0, 0)
            }
            
            
        }catch(e){
            console.error(e.stack)
        }
    }

    destroy(){ //method used to remove a monster from memory
        const index = this.world.bodies.indexOf(this.body)
        this.scene.remove(this.skeleton)
        this.world.bodies.splice(index, 1)
        this.scene.remove(this)
    }
}