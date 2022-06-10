import * as CANNON from "../lib/cannon-es.js"
import { angleBetween } from "./misc.js"

/**
 * 
 * @param {*} me 
 * @param {*} other 
 * @param {float} max_distance 
 * @param {float} angle 
 * @returns 
 * 
 * will determine if an entity has vision of another
 * 
 */

export const can_see = (me, other, max_distance, angle) => {
    try{
        const my_pos = me.body.position
        const other_pos = other.body.position

        // if the other body is too far return false
        const difference = other_pos.vsub(my_pos)
        const distance = difference.length()
        if(distance > max_distance) return false

        // if the other body is not within the cone of 'vision' return false
        var desired = (new CANNON.Vec3(difference.x, 0, difference.z).unit())
        const facing = new CANNON.Vec3(Math.sin(me.rotation.y), 0, Math.cos(me.rotation.y))
        const curr_angle = angleBetween(facing, desired) - 2 * Math.PI/3    // I have no idea why the angle is offset by 2 pi/3 but this makes it work
        if((angle - Math.abs(curr_angle) < 0)) return false
        
        // todo: if dont hit the other object return false

        return true
    } catch {
        return false
    }
    
}