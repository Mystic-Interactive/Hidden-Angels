
class MouseHandler{ //handle's user's mouse movements - for firstperson camera movement

    constructor(){
        this.current = {
            x : 0,
            y : 0
        };

        this.previous = {x : null, y: null};

        document.addEventListener('mousemove', (event)=>{
            this.current.x = event.movementX;
            this.current.y = event.movementY;
            if(this.previous.x == null){
                this.previous.x = this.current.x;
                this.previous.y = this.current.y;
            }
        });
    }

    update(){
        this.previous.x = this.current.x;
        this.previous.y = this.current.y;
    }
}

export class FirstPersonCamera{ //handles the mouse movements and rotates the camera accordingly

    constructor(camera){
     this.camera = camera;
     this.movements = new MouseHandler();
     this.r = 0;
     this.theta = 0;
     this.rotation = new THREE.Quaternion(); 
    }

    updateRotation(){//make rotation matrix to make camera look at new difference in x and y values
        //convert x,y deltas into spherical coordinates phi and theta
        const deltaX = (this.movements.current.x - this.movements.previous.x)/window.innerWidth;
        const deltaY = (this.movements.current.y - this.movements.previous.y)/window.innerHeight;

        this.r = this.r -deltaX * 5;
        this.theta =  Math.min(Math.max(this.theta +  -deltaY*5, -Math.PI/3), Math.PI/3);
        //convert r and theta into a rotation
        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0,1,0),this.r);
        const qz = new THREE.Quaternion();
        qz.setFromAxisAngle(new THREE.Vector3(1,0,0),this.theta);

        const q = new THREE.Quaternion();
        q.multiply(qx);
        q.multiply(qz);
        this.rotation.copy(q);
    }

    updateCamera(){ //rotate camera using rotation
        this.camera.quaternion.copy(this.rotation);
    }

    update(){
        this.updateRotation();
        this.updateCamera();
        this.movements.update();
    }
}