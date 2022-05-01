

export default class AnimationManager{
    /**
     * @param {[]} actions : all possible animations
     * @param {[]} paths : possible transition paths
     */
    constructor( actor, mixer, actions, paths ){
        this.actions = actions
        this.paths = paths
        this.mixer = mixer
        this.transition_state = 0
        this.playAllAnimations()
    }

    playAllAnimations(){
        this.actions.forEach(action => {
            action.action.play()
            action.action.setEffectiveWeight(4)
            action.action.loop = true
        });
    }

    setWeight(action, weight, play_direction){
        action.enabled = true;
        if (play_direction > 0){
            action.setEffectiveTimeScale(2)
        } else action.setEffectiveTimeScale(-2)
        action.setEffectiveWeight(weight);
    }

    update(delta, desired, play_direction){
        this.actions.forEach(act =>{
            const a = act.action
            //console.log(a.getEffectiveTimeScale())
            if(act.name == desired){
                this.setWeight(
                    a,
                    a.getEffectiveWeight() + (1 - a.getEffectiveWeight())/10,
                    play_direction
                )
            } else this.setWeight(act.action, a.getEffectiveWeight() - (a.getEffectiveWeight()/10), a.getEffectiveTimeScale())
        })
        try{
            this.mixer.update(delta/2000)
        }catch{
            console.error("somethings up with the mixer");
        }
    }
}
  