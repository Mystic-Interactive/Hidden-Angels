
export default class PlayerController{ //handles user's keyboard inputs - used to pass movements to character

    constructor(player, animation_manager){
        this.player = player
        this.animation_manager = animation_manager

        this.forward = false
        this.backward = false
        this.left = false
        this.right = false
        this.jump = false
        this.crouch = false

        this.max_jump_duration = 1500
        this.define()

        this.state = []
    }

    define(){
        document.addEventListener('keydown', (event)=>{
            switch( event.key.toLowerCase() ){
                case "w"        : this.forward     = true; break
                case "s"        : this.backward    = true; break
                case "a"        : this.left        = true; break
                case "d"        : this.right       = true; break
                case " "        : this.jump        = true; break
                case "shift"    : this.crouch      = true; break
            }
        })

        document.addEventListener('keyup', (event)=>{
            switch( event.key.toLowerCase() ){
                case "w"        : this.forward     = false; break
                case "s"        : this.backward    = false; break
                case "a"        : this.left        = false; break
                case "d"        : this.right       = false; break
                case " "        : this.jump        = false; break
                case "shift"    : this.crouch      = false; break
            }
        })
    }

    state_comp(action, direction){
        return {action : action, direction : direction}
    }

    choose_state(delta){
        const st = []

        if(this.jump) {
            if(this.jump_duration < this.max_jump_duration){
                st.push(this.state_comp("jump", 1))
            }
            this.jump_duration += delta
        } else {
            this.jump_duration = 0
        }
        
        if(this.crouch) {
            if(this.forward) {
                st.push(this.state_comp("crouch-walk", 1))
            }
    
            if(this.backward) {
                st.push(this.state_comp("crouch-walk", -1))
            }

            st.push(this.state_comp("crouch", 1))

        } else {
            if(this.forward ) {
                st.push(this.state_comp("walk", 1))
            }

            if(this.backward) {
                st.push(this.state_comp("walk", -1))
            }

            st.push(this.state_comp("idle", 1))

        }

        if(this.left) {
            st.push(this.state_comp("left", 1))
        }

        if(this.right) {
            st.push(this.state_comp("right", 1))
        }

        this.state = st
    }

    update(delta){
        this.choose_state(delta)
        const current_state = this.state[0]
        this.player.current_state = current_state
        this.animation_manager.update(delta, current_state.action, current_state.direction)

    }
}