class KeyBoardHandler{ //handles user's keyboard inputs - used to pass movements to character

    constructor(){
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        document.addEventListener('keydown', (event)=>{
            if(event.code == 'KeyW'){
                this.moveForward = true;   
            }

            if(event.code == 'KeyS'){
                this.moveBackward = true;
            }

            if(event.code == 'KeyA'){
                this.moveRight = true;
            }           
    
            if (event.code == 'KeyD'){
                this.moveLeft = true;
            }
        });

        document.addEventListener('keyup', (event)=>{
            if(event.code == 'KeyW'){
            this.moveForward = false;   
            }

            if(event.code == 'KeyS'){
                this.moveBackward = false;
            }

            if(event.code == 'KeyA'){
                this.moveRight = false;
            }           
            
            if (event.code == 'KeyD'){
                this.moveLeft = false;
            }
        });
    }

    getForward(){
        return this.moveForward;
    }

    getBackward(){
        return this.moveBackward;
    }

    getLeft(){
        return this.moveLeft;
    }

    getRight(){
        return this.moveRight;
    }
}

class MouseHandler{ //handle's user's mouse movements - for firstperson camera movement

    constructor(){
        this.current = {
            x : 0,
            y : 0
        };

        this.previous = {x : null, y: null};

        document.addEventListener('mousemove', (event)=>{
            this.current.x = event.pageX  - window.innerWidth/2;
            this.current.y = event.pageY - window.innerHeight/2;
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