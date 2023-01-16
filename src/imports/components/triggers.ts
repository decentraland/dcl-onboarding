import * as utils from '@dcl/ecs-scene-utils'

export var triggersInfo: Trigger[] = []

enum OnExecTriggerType {
  onTriggerEnter = "onTriggerEnter",
  onTriggerExit = "onTriggerExit",
  onCameraEnter = "onCameraEnter",
  onCameraExit = "onCameraExit",
}

export class Trigger {
  triggerPosition: Vector3
  triggerSize: Vector3
  triggerRotation: Quaternion
  tags: string[]
  trigger: utils.TriggerComponent
  triggerEntity: Entity
  parentEntity: Entity
  enableDebug: boolean
  private onExec: Record<string, (() => void)[]> = {}
  bDebug: boolean
  constructor(position: Vector3, size: Vector3, tags?: string[], enableDebug?: boolean, triggerRotation: Quaternion = new Quaternion(0, 0, 0, 0), parentEntity?: Entity) {
    this.triggerPosition = position
    this.triggerSize = size
    this.triggerRotation = triggerRotation
    this.tags = tags
    this.parentEntity = parentEntity
    this.enableDebug = enableDebug
    this.bDebug = false
  }
  addOnTriggerEnter(func: () => void) {
    this.addOnExec(OnExecTriggerType.onTriggerEnter, func)
  }
  addOnTriggerExit(func: () => void) {
    this.addOnExec(OnExecTriggerType.onTriggerExit, func)
  }
  addOnCameraEnter(func: () => void) {
    this.addOnExec(OnExecTriggerType.onCameraEnter, func)
  }
  addOnCameraExit(func: () => void) {
    this.addOnExec(OnExecTriggerType.onCameraExit, func)
  }
  removeAllOnExec(name: OnExecTriggerType) {
    if (this.onExec[name]) {
      this.onExec[name] = []
    }
  }
  removeOnExec(name: OnExecTriggerType, index: number) {
    if (this.onExec[name]) {
      if (index > -1) {
        this.onExec[name].splice(index, 1)
      }
    }
  }
  private addOnExec(name: OnExecTriggerType, func: () => void) {
    if (!this.onExec[name]) {
      this.onExec[name] = []
    }
    this.onExec[name].push(func)
    this.trigger[name] = () => {
      for (const funci of this.onExec[name]) {
        if (funci) {
          funci()
        }
      }
    }
  }
  getOnExec(name: OnExecTriggerType) {
    return this.onExec[name]
  }
  useTriggerFromEntity(entityWithTrigger: Entity) {
    if (entityWithTrigger.hasComponent(utils.TriggerComponent)) {
      this.trigger = entityWithTrigger.getComponent(utils.TriggerComponent)
      this.triggerEntity = entityWithTrigger
      this.trigger["pmTrigger"] = this
    }
  }
  createTrigger(parentEntity?: Entity) {
    let triggerBox = new utils.TriggerBoxShape(this.triggerSize, new Vector3(0, 0, 0))
    //create trigger for entity
    let trigger = new utils.TriggerComponent(
      triggerBox, //shape
      {
        layer: 0, //layer
        triggeredByLayer: 0, //triggeredByLayer
        onTriggerEnter: null, //onTriggerEnter
        onTriggerExit: null, //onTriggerExit
        onCameraEnter: null,  //onCameraEnter
        onCameraExit: null, //onCameraExit
        enableDebug: this.enableDebug
      }
    )

    const triggerEntity = new Entity()
    triggerEntity.addComponent(new Transform({ position: this.triggerPosition, rotation: this.triggerRotation }))
    triggerEntity.addComponent(trigger)

    if (parentEntity) {
      triggerEntity.setParent(parentEntity)
    }
    else if (this.parentEntity) {
      triggerEntity.setParent(this.parentEntity)
    }

    engine.addEntity(triggerEntity)
    if (this.bDebug) {
      //Debug
      const debugEntity = new Entity()
      debugEntity.addComponent(new Transform({ position: this.triggerPosition, scale: this.triggerSize }))
      debugEntity.addComponent(new BoxShape())
      debugEntity.getComponent(BoxShape).withCollisions = false
      const myDebugMaterial = new Material()
      myDebugMaterial.albedoColor = new Color4(1, 0, 0, 0.2)
      debugEntity.addComponent(myDebugMaterial)
      engine.addEntity(debugEntity)
    }

    this.triggerEntity = triggerEntity
    this.trigger = trigger
    trigger["pmTrigger"] = this

    return trigger;
  }
}

