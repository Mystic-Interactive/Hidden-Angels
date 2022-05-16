import * as YUKA from '../lib/yuka.module.js' 

export class Monster_AI extends THREE.Group{
    

    constructor(){
        super();
        this.vehicleGeometry = new THREE.ConeBufferGeometry(0.1,0.5,8);
        this.vehicleMaterial = new THREE.MeshNormalMaterial();
        this.vehicleMesh = new THREE.Mesh(this.vehicleGeometry,this.vehicleMaterial);
        this.vehicleMesh.matrixAutoUpdate = false;
        
        this.vehicle = new YUKA.Vehicle();
        function sync(entity, renderComponent) {
            renderComponent.matrix.copy(entity.worldMatrix);
        }
        this.vehicle.setRenderComponent(this.vehicleMesh,sync)
        this.path = new YUKA.Path();
        this.path.add(new YUKA.Vector3(0,0,0));
        this.path.add(new YUKA.Vector3(0,10,10));
        this.path.loop = true;
        this.vehicle.position.copy(this.path.current());
      
        const followPathBehavior = new YUKA.FollowPathBehavior(this.path,0.5);
        this.vehicle.steering.add(followPathBehavior);
        this.entityManager = new YUKA.EntityManager();
        this.entityManager.add(this.vehicle);
        this.time = new YUKA.Time();

        
    }

    update(){
        const delta = this.time.update().getDelta();
        this.entityManager.update(delta);
    }


}