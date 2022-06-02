import * as CANNON from "../lib/cannon-es.js"


/**
 * 
 * @param {CANNON.Vec3} v1 
 * @param {CANNON.Vec3} v2 
 * 
 * get the angle between two vectors in every axis
 */
function angleBetween(v1, v2){
    var angle = 0
    const num =  v1.x * v2.x + v1.z * v2.z
    const den =  Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.z - v2.z) * (v1.z - v2.z))

    angle = Math.acos(num / den)

    if(isNaN(angle)) {
        angle = 0
    }

    return(angle)
}

const sqrt = Math.sqrt
const sqr = (num) => {
    return Math.pow(num, 2)
}

function angleBetween_3d(v1, v2){
    var angle = 0
    const num = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
    const den = sqrt(sqr(v1.x) + sqr(v1.y) + sqr(v1.z)) * sqrt(sqr(v2.x) + sqr(v2.y) + sqr(v2.z))
    
    //Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.z - v2.z) * (v1.z - v2.z))

    angle = Math.acos(num / den)

    if(isNaN(angle)) {
        angle = 0
    }

    return(angle)
}

export {angleBetween, angleBetween_3d}
    