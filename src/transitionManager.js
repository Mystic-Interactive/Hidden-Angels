

class TranstionManager{
    /**
     * @param {[]} actions : all possible animations
     * @param {[]} paths : possible transition paths
     */
    constructor( actor, actions, paths ){
        this.actions = actions
        this.paths = paths
        this.transition_state = 0
    }

    setWeight(action, weight){
        action.enabled = true;
        if (this.transition_state > 0){
            action.setEffectiveTimeScale(1)
        } else action.setEffectiveTimeScale(-1)
        
        action.setEffectiveWeight(weight);
    }

    determineAnimationWeights(){
        for (const index in this.actions) {

            var diff = Math.abs(Math.abs(this.transition_state) - index)
            const action = this.actions[index]
            
            if(diff < 1){
                this.setWeight(action, 1 - diff)
            }else{
                this.setWeight(action, 0)
            }
        }
    }

    update(delta, desired){

    }
}
  