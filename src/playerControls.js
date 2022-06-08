
export default class PlayerController{ //handles user's keyboard inputs - used to pass movements to character

    constructor(player, animation_manager){
        this.player = player
        this.animation_manager = animation_manager // Initialize Helper so animations are played in correct order  

        // Define possible movements 
        this.forward = false
        this.backward = false
        this.left = false
        this.right = false
        this.jump = false
        this.crouch = false
        this.max_jump_duration = 1500
        this.max_jump_height = 1
        this.fps = true
        this.define()

        this.state = []
    }

    define(){
        document.addEventListener('keydown', (event)=>{
            switch( event.key.toLowerCase() ){ // set movement to true while key is pressed
                case "w"        : this.forward     = true; break
                case "s"        : this.backward    = true; break
                case "a"        : this.left        = true; break
                case "d"        : this.right       = true; break
                case " "        : this.jump        = true; break
                case "shift"    : this.crouch      = true; break
                case "tab"      : this.fps         = !this.fps; break
            }
        })

        document.addEventListener('keyup', (event)=>{
            switch( event.key.toLowerCase() ){ // set movement to false when key is not pressed
                case "w"        : this.forward     = false; break
                case "s"        : this.backward    = false; break
                case "a"        : this.left        = false; break
                case "d"        : this.right       = false; break
                case " "        : this.jump        = false; break
                case "shift"    : this.crouch      = false; break
            }
        })
    }

    compose_state(action, direction){
        return {action : action, direction : direction}
    }
    
    choose_state(delta){
        const st = []
        var movement = ""
        var direction = 0

        if(this.fps){
            this.player.view = 0
        } else {this.player.view = 3}

        if(this.jump) {
            // store start height for jump
            if(this.jump_duration == 0){
                this.start_height = this.player.position.y
            }

            if(this.player.position.y - this.start_height >= this.max_jump_height) this.jump_duration += this.max_jump_duration

            this.jump_duration += delta
            if(this.jump_duration < this.max_jump_duration){
                st.push(this.compose_state("jump", 1))
                this.state = st
                return
            }
            
            
            
        } else {
            this.jump_duration = 0
        }
        
        if(this.left) {
            movement += "left"
            direction = 1
        }

        if(this.right) {
            movement += "right"
            direction = 1
        }

        if(this.forward){
            movement = "forward" + " " + movement
            direction = 1
        } else if (this.backward){
            movement = "backward" + " " + movement
            direction = -1
        } else if (!(this.left || this.right)) {
            st.push(this.compose_state("idle", 1))
            this.state = st
            return
        }
        
        if(this.crouch) {
            movement = "crouch-walk" + " " + movement
        } else {
            movement = "walk" + " " + movement
        }

        st.push(this.compose_state(movement, direction))

        this.state = st
    }

    update(delta){
        this.choose_state(delta)
        var current_state = this.state[0]
        this.player.current_state = current_state
        this.animation_manager.update(delta, current_state.action.split(" ")[0], current_state.direction)

    }
}