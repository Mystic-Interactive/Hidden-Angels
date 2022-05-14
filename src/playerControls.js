
export default class PlayerController{ //handles user's keyboard inputs - used to pass movements to character

    constructor(player, animation_manager){
        this.player = player


        this.forward = false
        this.backward = false
        this.left = false
        this.right = false
        this.jump = false
        this.crouch = false
        this.define()

        this.state = []
    }

    define(){
        document.addEventListener('keydown', (event)=>{

            switch(event.key){
                case "w" : this.forward     = true
                case "s" : this.backward    = true
                case "a" : this.left        = true
                case "d" : this.right       = true
                case " " : this.jump        = true
            }
        })

        document.addEventListener('keyup', (event)=>{
            switch(event.key){
                case "w" : this.forward     = false
                case "s" : this.backward    = false
                case "a" : this.left        = false
                case "d" : this.right       = false
                case " " : this.jump        = false
            }
        })
    }

    state_comp(action, direction){
        return {action : action, direction : direction}
    }

    generate_state(){
        const st = []

        if(this.jump) {
            st.push(this.state_comp("jump", 1))
        }

        if(this.forward) {
            st.push(this.state_comp("walk", 1))
        }

        if(this.backward) {
            st.push(this.state_comp("walk", 1))
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
        this.generate_state()

    }
}