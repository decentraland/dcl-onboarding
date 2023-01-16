
import { getEntityWorldPosition } from "@dcl/ecs-scene-utils"
import { TagComponent } from "./components/components"
import { MoveComponent } from "./components/tween/movementV2"
import { RotateComponent } from "./components/tween/rotate"
import { ScaleComponent } from "./components/tween/scale"
import { WidgetTextTimmer } from "./widgets/widgets"

export class UpdateTweenComponentsSystem implements ISystem {

  update(dt: number) {

    let tweenEntities = engine.getComponentGroup(MoveComponent)
    for (let entity of tweenEntities.entities) {
      if (entity.getComponent(MoveComponent).movement.bActive) {
        entity.getComponent(MoveComponent).update(dt)
      }
    }
    tweenEntities = engine.getComponentGroup(RotateComponent)
    for (let entity of tweenEntities.entities) {
      if (entity.getComponent(RotateComponent).movement.bActive) {
        entity.getComponent(RotateComponent).update(dt)
      }
    }
    tweenEntities = engine.getComponentGroup(ScaleComponent)
    for (let entity of tweenEntities.entities) {
      if (entity.getComponent(ScaleComponent).movement.bActive) {
        entity.getComponent(ScaleComponent).update(dt)
      }
    }

  }
}


// Global update actived move components system
export class UpdateTimerWidgetSystem implements ISystem {
  timerWidget: WidgetTextTimmer
  //Executed ths function on every frame
  update() {
    if (this.timerWidget && this.timerWidget.container.visible) {
      this.timerWidget.update()
    }
  }
}

// Global update actived move components system
export class UpdateToPlayerSystem implements ISystem {
  entities: IEntity[]
  //Executed ths function on every frame
  update() {
    for (let index = 0; index < this.entities.length; index++) {
      if (this.entities[index].hasComponent(Transform)) {
        let position = Camera.instance.position
        if (this.entities[index].hasComponent(TagComponent) && this.entities[index].getComponent(TagComponent).tag == "ambience") {
          this.entities[index].getComponent(Transform).position = new Vector3(40, position.y, -25)
        }
        else {
          this.entities[index].getComponent(Transform).position = position
        }
      }
    }
  }
}

type ScaleWithDistance = {
  bActive: boolean,
  maxDistance: number
  minDistance: number
  minScale: EcsMathReadOnlyVector3
  maxScale: EcsMathReadOnlyVector3
  disapearDistance?: number
  bSmoothScale?: boolean
  targetScale?: Vector3
  targetAlpha?: number
  dtTime?: number
}

export class ScaleWithDistanceSystem implements ISystem {

  private bActive: boolean
  private scaleEntities: (ScaleWithDistance & { entity: IEntity })[] = []

  private static instanceRef: ScaleWithDistanceSystem;
  private constructor() {
    this.setActive(true)
  }
  // Singleton Instance of the Object
  static instance(): ScaleWithDistanceSystem { return this.instanceRef || (this.instanceRef = new this()); }

  //Executed ths function on every frame
  update(dt: number) {

    for (let i = 0; i < this.scaleEntities.length; i++) {
      const element = this.scaleEntities[i]

      if (!element.bActive || !element.entity.hasComponent(Transform)) {
        continue;
      }
      //No smooth scale
      if (!element.bSmoothScale) {

        let distance = this.getTargetDistance(element)
        //Reached disapear distance
        if (this.isDisapearDistance(distance, element)) {
          element.entity.getComponent(Transform).scale = Vector3.Zero()
          continue;
        }

        element.entity.getComponent(Transform).scale = this.calculateTargetScale(distance, element).clone()
        continue;
      }

      // -- Smooth scale alpha --
      //Update target scale in intervals
      if (element.dtTime < 0.5) {
        element.dtTime += dt
      }
      else {
        element.dtTime = 0
        let distance = this.getTargetDistance(element)

        //Reached disapear distance
        if (this.isDisapearDistance(distance, element)) {
          element.targetScale = Vector3.Zero()
        }
        //Normal behavior
        else {
          element.targetScale = this.calculateTargetScale(distance, element).clone()
        }

      }
      let targetDistanceThreshold = 0.02
      if (element.targetScale.equals(Vector3.Zero())) targetDistanceThreshold = 0.5;
      if (Vector3.Distance(element.entity.getComponent(Transform).scale.clone(), element.targetScale.clone()) <= targetDistanceThreshold) {
        //Increase alpha to avoid the infinite slowdown of the lerp
        element.targetAlpha += 0.1;
        if (element.targetScale.equals(Vector3.Zero())) element.targetAlpha += 0.3;
        if (element.targetAlpha > 1) element.targetAlpha = 1;

      }
      else {
        //Update scale 0.1 alpha only
        element.targetAlpha = 0.1;
        if (element.targetScale.equals(Vector3.Zero())) element.targetAlpha = 0.2;
      }
      // -- Smooth scale alpha --

      element.entity.getComponent(Transform).scale = Vector3.Lerp(element.entity.getComponent(Transform).scale.clone(), element.targetScale.clone(), element.targetAlpha)

    }
  }

  private isDisapearDistance(distance: number, element: ScaleWithDistance) {
    return element.disapearDistance && distance > element.disapearDistance
  }

  private getTargetDistance(element: (ScaleWithDistance & { entity: IEntity })) {
    return Vector3.Distance(Camera.instance.position.clone(), getEntityWorldPosition(element.entity)) + ((Camera.instance.cameraMode != CameraMode.FirstPerson) ? 4 : 0)
  }

  private calculateTargetScale(distance: number, element: (ScaleWithDistance & { entity: IEntity })) {
    distance = clamp(distance, element.minDistance, element.maxDistance)
    let alpha = (distance - element.minDistance) / (element.maxDistance - element.minDistance)
    let targetScale = Vector3.Lerp(element.minScale, element.maxScale, alpha)
    return targetScale
  }

  setActive(bActive: boolean = true): void {

    if (this.bActive && !bActive) {
      engine.removeSystem(this)
    }
    else if (!this.bActive && bActive) {
      engine.addSystem(this)
    }

    this.bActive = bActive
  }

  addEntity(entity: IEntity, options?: Partial<ScaleWithDistance>) {
    const scaleEntity: (ScaleWithDistance & { entity: IEntity }) = {
      bActive: (options?.hasOwnProperty('bActive')) ? options.bActive : true,
      maxDistance: (options?.hasOwnProperty('maxDistance')) ? options.maxDistance : 100,
      minDistance: (options?.hasOwnProperty('minDistance')) ? options.minDistance : 0,
      minScale: (options?.hasOwnProperty('minScale')) ? options.minScale : Vector3.Zero(),
      maxScale: (options?.hasOwnProperty('maxScale')) ? options.maxScale : Vector3.One(),
      disapearDistance: (options?.hasOwnProperty('disapearDistance')) ? options.disapearDistance : 0,
      bSmoothScale: (options?.hasOwnProperty('bSmoothScale')) ? options.bSmoothScale : false,
      entity: entity,
      targetAlpha: 0
    }
    this.scaleEntities.push(scaleEntity)
    return this.scaleEntities.length - 1
  }
  setEntityOptions(index: number, options: Partial<ScaleWithDistance>) {
    if (!this.scaleEntities[index]) {
      return;
    }
    if (options.hasOwnProperty('bActive')) {
      this.scaleEntities[index].bActive = options.bActive
    }
    if (options.hasOwnProperty('maxDistance')) {
      this.scaleEntities[index].maxDistance = options.maxDistance
    }
    if (options.hasOwnProperty('minDistance')) {
      this.scaleEntities[index].minDistance = options.minDistance
    }
    if (options.hasOwnProperty('minScale')) {
      this.scaleEntities[index].minScale = options.minScale
    }
    if (options.hasOwnProperty('maxScale')) {
      this.scaleEntities[index].maxScale = options.maxScale
    }
    if (options.hasOwnProperty('bSmoothScale')) {
      this.scaleEntities[index].bSmoothScale = options.bSmoothScale
    }
    if (options.hasOwnProperty('disapearDistance')) {
      this.scaleEntities[index].disapearDistance = options.disapearDistance
    }
  }
  activeEntity(index: number, bActive: boolean) {
    this.scaleEntities[index].bActive = bActive
  }
  removeEntity(index: number) {
    this.scaleEntities.splice(index, 1)
  }
}

