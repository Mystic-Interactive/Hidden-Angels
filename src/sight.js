import * as CANNON from "../lib/cannon-es.js"
import { angleBetween_3d } from "./misc.js"


/**
 * 
 * @param {*} me 
 * @param {*} other 
 * @param {float} max_distance 
 * @param {float} h_angle 
 * @param {float} v_angle 
 * @returns 
 * 
 * will determine if an entity has vision of another
 * 
 */
export const can_see = (me, other, max_distance, h_angle, v_angle) => {
    const my_pos = me.body.position
    const other_pos = other.body.position

    // if the other body is too far return false
    const difference = other_pos.vsub(my_pos)
    const distance = difference.length()

    //console.log (me.body.quaternion)
    
    
    //if(distance > max_distance) return false


    // if the other body is not within the cone return false
    var rot = me.rotation
    //console.log(rot)
    var facing = new CANNON.Vec3(Math.sin(rot.y), 0, Math.cos(rot.y)).unit()

    facing = new THREE.Vector3(facing.x, facing.y, facing.z)
    //console.log(angleBetween_3d(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0,0,1)))
    //console.log(facing)
    //console.log(difference)
    console.log(angleBetween_3d( facing, difference.unit() ) -Math.PI + rot.y/2)

    // if rays hit the other object return true
    return true
    
}