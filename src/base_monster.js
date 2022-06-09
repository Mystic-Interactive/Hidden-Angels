import * as CANNON from '../lib/cannon-es.js'
import { angleBetween } from './misc.js'
import { tookDamage } from './overlay.js'
import { can_see } from './sight.js'

export default class Monster extends THREE.Group {
    constructor(scene, world, GLTFLoader, position, path, player, paused, mesh_source, damage){
        super()
        this.loader = GLTFLoader
        this.scene = scene
        this.world = world
        this.start_pos = position
        
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
        this.damage = 0 //damage will be set in each individual monster
        this.vision_limit = 0
        this.angle = Math.PI * 2
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

    updateTransform(delta){
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

    // seesPlayer(){
    //     let raycaster = new THREE.Raycaster(this.body.position,this.getWorldDirection,);
    //     if()
    //     return false;
    // }

    changePath(target) {//changes path using the navmesh
        let pos = new THREE.Vector3(0,0,0);
        pos.copy(this.body.position);
        pos.y = 0;
        let pos2 = new THREE.Vector3(0,0,0);
        pos2.copy(target);
        pos2.y = 0; 
        const path = this.pathfinding.findPath(pos, pos2, this.ZONE, 0);

        this.path = path
    }

    looking_at_player(){
        return can_see(this, this.enemy, this.vision_limit, this.angle)
    }

    update( delta ){
        if(!this.loaded) return;
        
        try{
            let time = delta%30;
            this.play_direction = 1 
            this.desired_action = "walk"
            if(this.being_looked_at != true){
                if(this.position.distanceTo(this.enemy.position) < 2){
                    this.body.velocity = new CANNON.Vec3(0, 0, 0)
                    if(!this.hitting && !this.paused && time == 0) {
                        tookDamage(this.damage)
                    }
                    this.desired_action = "basic_attack"
                } else { 
                    // only chase when the player is visible to the monster
                    if (this.looking_at_player()){
                        this.changePath(this.enemy.body.position);
                        console.log("i see you")
                    } 
                    else { // return to patrol path
                        console.log("i cant see you")
                        this.changePath(this.patrol[this.path_index])
                        const p = this.patrol[this.path_index]
                        const b = this.body.position

                        // distance between the body and the point its trying to reach
                        const diff = Math.sqrt(Math.pow(p.x - b.x, 2) + Math.pow(p.y - b.y, 2) + Math.pow(p.z - b.z, 2))
                        if (diff  <= 0.5){
                            this.path_index = (this.path_index + 1) % this.patrol.length
                            console.log(this.patrol[this.path_index])
                        }  

                    }
                    
                    this.hitting = false;
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

    destroy(){
        const index = this.world.bodies.indexOf(this.body)
        this.scene.remove(this.skeleton)
        this.world.bodies.splice(index, 1)
        this.scene.remove(this)
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