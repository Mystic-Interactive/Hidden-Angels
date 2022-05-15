

export default class AnimationManager{
    /**
     * @param {[]} actions : all possible animations
     * @param {[]} paths : possible transition paths
     */
    constructor( actor, mixer, actions, paths ){
        this.actions = actions
        this.paths = paths
        this.mixer = mixer
        this.state = ""
        this.prev_state = ""
        this.playing = []
        this.transition_state = 0
    }

    setWeight(action, weight, play_direction){
        action.enabled = true;
        if (play_direction > 0){
            action.setEffectiveTimeScale(2)
        } else action.setEffectiveTimeScale(-2)
        if(weight < 10e-3) weight = 0
        action.setEffectiveWeight(weight); // accurate to 3 decimal places
    }

    getAction(name){

        var result = null
        this.actions.forEach(act => {
            if(act.name == name) {
                result = act.action
                return
            }
        })

        return result
    }

    playAction(act, play_direction){
        act.reset()
        act.play()
        act.setEffectiveTimeScale(play_direction)
        act.loop = true
    }

    stopAction(act){
        act.stop()
    }


    update(delta, desired, play_direction){
        this.prev_state = this.state
        this.state = desired

        // change from one state to another
        if(this.prev_state != desired){

            // if the desired stack is currently playing remove it from the stack
            
            const act = this.getAction(desired)
            const index = this.playing.indexOf(act)
            if(index > -1){
                this.playing.splice(index, 1)
            }
            
            // play the action and place it at the top of the playing stack
            this.playAction(act, play_direction)
            this.playing.push(act)
        }

        const to_remove = []

        for (var i = 0; i < this.playing.length - 1; i++){
            const act = this.playing[i]
            // decrease weight of past actions
            this.setWeight(act, act.getEffectiveWeight() - (act.getEffectiveWeight()/10), 1)

            // add to removal buffer when weight has hit 0
            if (this.playing[i].getEffectiveWeight() == 0) to_remove.push(this.playing[i])
        }
        const act = this.playing[this.playing.length -1]

        this.setWeight(
            act,
            act.getEffectiveWeight() + (1 - act.getEffectiveWeight())/10,
            play_direction
        )

        to_remove.forEach(act => {
            const index = this.playing.indexOf(act)
            this.playing.splice(index, 1)
        })

        try{
            this.mixer.update(delta/2000)
        }catch{
            console.error("somethings up with the mixer");
        }
    }
}
  