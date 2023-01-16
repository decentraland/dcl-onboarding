

@Component('BillboardPM')
export class BillboardPM{
    bActive: boolean
    x: 0|1 = 1
    y: 0|1 = 1
    z: 0|1 = 1
    entityToOrient: IEntity
    targetToOrient: Vector3
    constructor(bActive: boolean = true){
        this.setActive(bActive)
        BillboardSystem.instance()
    }
    setActive(activate = true){
        this.bActive = activate
    }
    setAxis(axis: {
        x?: 0|1,
        y?: 0|1,
        z?: 0|1
    }){
        if (axis.hasOwnProperty("x")) {
            this.x = axis.x
        }
        if (axis.hasOwnProperty("y")) {
            this.y = axis.y
        }
        if (axis.hasOwnProperty("z")) {
            this.z = axis.z
        }
    }
    setTarget(entity: IEntity, target: Vector3){
        this.entityToOrient = entity
        this.targetToOrient = target.clone()
    }
    update(dt:number){
        if (this.entityToOrient && this.entityToOrient.hasComponent(Transform)) {
            const target = new Vector3(
              (this.x)? this.targetToOrient.x : this.entityToOrient.getComponent(Transform).position.x,
              (this.y)? this.targetToOrient.y : this.entityToOrient.getComponent(Transform).position.y,
              (this.z)? this.targetToOrient.z : this.entityToOrient.getComponent(Transform).position.z
            )

            this.entityToOrient.getComponent(Transform).lookAt(target, Vector3.Up())
        }
    }
}

// Global update actived move components system
export class BillboardSystem implements ISystem {
    private bActive: boolean = false
  
    private static instanceRef: BillboardSystem;
    public static instance(): BillboardSystem { return this.instanceRef || (this.instanceRef = new this()); }
    private constructor(){
      this.setActive()
    }
    isActive(){
      return this.bActive
    }
    setActive(active = true){
      if (active && !this.bActive) {
        try {
          engine.addSystem(this)
        } catch (error) {}
      }
      if (!active && this.bActive) {
        try {
          engine.removeSystem(this)
        } catch (error) {}
      }
      this.bActive = active
    }
    //Executed ths function on every frame
    update(dt: number) {
      if (this.bActive) {
        let playerPos = Camera.instance.position.clone()
        let moveEntities = engine.getComponentGroup(BillboardPM)
        for (let entity of moveEntities.entities) {
          if (entity.hasComponent(BillboardPM) && entity.getComponent(BillboardPM).bActive) {
            entity.getComponent(BillboardPM).setTarget(entity, playerPos)
            entity.getComponent(BillboardPM).update(dt)
          }
        }
      }
    }
      
  }