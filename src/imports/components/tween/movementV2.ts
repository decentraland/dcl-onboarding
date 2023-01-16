import { IMovement, MovementType, } from "./tween.schema"

/**
 * Translates the entityToMove to a target position and if loop is true it will pingPong to the target and the original position
 * @param type: MovementType
 * @param entityToTween: Entity
 * @param speed: float   //Movement speed * frame time
 * @param bActive: boolean    //Activate the component to update
 * @param dt: float
 * @param callback: Function   //Callback to call when target is reached
 * @param hasFaceHisTarget: boolean 
 * @param target: Vector3
 * @param bOrientAxisToMovement: boolean
 * @param loop: boolean 
 * @param mylerpdata: { origin: Vector3; target: Vector3; fraction: number }
 */
export class Translate implements IMovement {
  type: MovementType
  entityToTween: Entity
  speed: float   //Movement speed * frame time
  bActive: boolean    //Activate the component to update
  dt: float
  callback: Function   //Callback to call when target is reached
  hasFaceHisTarget: boolean
  target: Vector3
  bOrientAxisToMovement: boolean
  loop: boolean
  mylerpdata: { origin: Vector3; target: Vector3; fraction: number }
  islerop: boolean = false
  constructor(entityToMove: Entity, target: Vector3, speed: number, bActive: boolean, bOrientAxisToMovement: boolean, loop: boolean, callback = function () { }, islerp: boolean = false) {

    this.target = target
    this.entityToTween = entityToMove
    this.speed = speed
    this.callback = callback
    this.dt = 0
    this.hasFaceHisTarget = false
    this.bOrientAxisToMovement = bOrientAxisToMovement
    this.mylerpdata = {
      origin: this.entityToTween.getComponent(Transform).position.clone(),
      target: target,
      fraction: 0
    }
    this.loop = loop
    this.islerop = islerp
    this.bActive = bActive
  }

  activate(speed: float = -1) {
    if (speed >= 0) {
      this.speed = speed
    }
    this.bActive = true
  }
  deactivate() {
    this.bActive = false
  }
  setSpeed(speed: number) {
    this.speed = speed
  }

  setTarget(target: Vector3) {
    if (target && target != undefined) {
      this.mylerpdata.origin = this.entityToTween.getComponent(Transform).position.clone()
      this.target = target.clone()
      this.mylerpdata.target = target.clone()
      this.hasFaceHisTarget = false
      this.mylerpdata.fraction = 0
    }
  }
  //Update called in the system update loop
  update(dt: number) {

    if (this.bActive) {
      if (this.dt > 0 && this.dt < dt) {
        dt = this.dt
      }
      let transform = this.entityToTween.getComponent(Transform)

      this.orientToMovement(transform)
      //
      if (this.islerop) {
        this.lerpsimplemove(transform, dt, this.loop)
      } else {
        this.simplemove(transform, dt, this.loop)
      }

    }
  }

  private orientToMovement(transform: Transform) {
    if (this.bOrientAxisToMovement && !this.hasFaceHisTarget) {
      transform.lookAt(new Vector3(this.target.x, transform.position.y, this.target.z))
      this.hasFaceHisTarget = true
    }
  }

  private simplemove(transform: Transform, dt: number, islooping: boolean = false) {
    let distance = directionVectorBetweenTwoPoints(transform.position, this.target).scale(dt * this.speed)
    let myposition = this.entityToTween.getComponent(Transform).position.clone()

    if (Vector3.Distance(transform.position, this.target) <= distance.length()) {
      transform.position = this.target.clone()
      this.bActive = islooping

      if (islooping) {
        if (myposition.x == this.mylerpdata.target.x && myposition.y == this.mylerpdata.target.y && myposition.z == this.mylerpdata.target.z) {
          this.setTarget(this.mylerpdata.origin.clone())
          this.callback()
        }
      }
      else {
        this.callback()
      }
    }
    else {
      transform.translate(distance)
    }
  }

  private lerpsimplemove(transform: Transform, dt: number, islooping: boolean = false) {
    let myposition = this.entityToTween.getComponent(Transform).position.clone()

    if (this.mylerpdata.fraction < 1) {

      transform.position = Vector3.Lerp(this.mylerpdata.origin, this.mylerpdata.target, this.mylerpdata.fraction)
      this.mylerpdata.fraction += dt * this.speed
    }
    else {
      transform.position = this.target.clone()
      this.bActive = islooping
      if (islooping) {

        if (myposition.x == this.mylerpdata.target.x && myposition.y == this.mylerpdata.target.y && myposition.z == this.mylerpdata.target.z) {
          this.setTarget(this.mylerpdata.origin.clone())
          this.callback()
        }
      }
      else {
        this.callback()
      }
    }
  }

}
/**
 * Acelerates the entity with a specified speed and max Speed depenting on the aceleration and deceleration until reached the target 
 * @param type: MovementType
 * @param entityToTween: Entity
 * @param target: Vector3
 * @param bActive: boolean
 * @param bOrientAxisToMovement: boolean
 * @param brakingDistance: float
 * @param deceleration: float
 * @param acceleration: float
 * @param speedAlpha: float
 * @param speed: number
 * @param maxSpeed: float
 * @param dt: number
 * @param callback?: Function
 */
export class Acelerate implements IMovement {
  type: MovementType
  entityToTween: Entity
  target: Vector3
  bActive: boolean
  bOrientAxisToMovement: boolean
  brakingDistance: float
  deceleration: float
  acceleration: float
  speedAlpha: float
  speed: number
  maxSpeed: float
  dt: number
  callback?: Function
  constructor(entityToMove: Entity, target: Vector3, speed: number, bActive: boolean, bOrientAxisToMovement: boolean, callback = function () { }) {
    this.entityToTween = entityToMove
    this.maxSpeed = speed
    this.speed = 0
    this.speedAlpha = 0
    this.acceleration = 0.01
    this.deceleration = 0.5
    this.target = target
    this.bOrientAxisToMovement = bOrientAxisToMovement
    this.bActive = bActive
    this.callback = callback
  }
  setSpeed(speed: float) {
    this.maxSpeed = speed
    this.brakingDistance = (0 - (this.maxSpeed ^ 2)) / (this.deceleration * -4)
  }
  activate(speed: float = -1) {
    if (speed >= 0) {
      this.setSpeed(speed)
    }
    this.bActive = true
    this.speedAlpha = 0
    this.speed = 0
  }
  deactivate() {
    this.bActive = false
    this.speedAlpha = 0
    this.speed = 0
  }
  //Update called in the system update loop
  update(dt: number) {
    if (this.bActive) {
      if (this.dt > 0) {
        dt = this.dt
      }
      let transform = this.entityToTween.getComponent(Transform)
      this.speed = lerp(0, this.maxSpeed, this.speedAlpha)
      if (this.speedAlpha <= 0) {
        this.speed = 1
      }
      let distance = directionVectorBetweenTwoPoints(transform.position, this.target).scale(dt * this.speed)
      if (this.bOrientAxisToMovement) {
        transform.lookAt(new Vector3(this.target.x, transform.position.y, this.target.z))
      }
      transform.translate(distance)
      if (Vector3.Distance(transform.position, this.target) <= distance.length()) {
        this.bActive = false
        this.callback()
      }
      else {

        let distance = Vector3.Distance(transform.position, this.target)
        distance = Math.sin(distance)
        if (distance <= this.brakingDistance) {
          if (this.speedAlpha > 0) {
            this.speedAlpha = distance / this.brakingDistance
          }
          if (this.speedAlpha < 0.01) {
            this.speedAlpha = 0.01
          }

        }
        else if (this.speedAlpha < 1) {
          this.speedAlpha = this.speedAlpha + 0.01
          if (this.speedAlpha > 1) {
            this.speedAlpha = 1
          }
        }
      }
    }
  }
}
/**
 * Move the entity with the given direction and acceleration until it crashes or goes to infinite
 * @param type: MovementType
 * @param target: Vector3
 * @param bOrientAxisToMovement: boolean
 * @param entityToTween: Entity
 * @param speed: number
 * @param bActive: boolean
 * @param dt: number
 * @param callback?: Function
 * @param inicialDirection: Vector3
 * @param currentDirection: Vector3
 * @param gravity: number
 * @param bStopInFloor: boolean
 */
export class ProjectileMove implements IMovement {
  type: MovementType
  entityToTween: Entity
  target: Vector3
  bOrientAxisToMovement: boolean
  speed: number
  bActive: boolean
  dt: number
  callback?: Function
  inicialDirection: Vector3
  currentDirection: Vector3
  gravity: number
  bStopInFloor: boolean
  constructor(entityToTween: Entity, inicialDirection: Vector3, speed: number, bActive: boolean, bOrientAxisToMovement: boolean, callback = function () { }) {
    this.entityToTween = entityToTween
    this.inicialDirection = inicialDirection.normalize()
    this.currentDirection = inicialDirection.normalize()
    this.gravity = 0
    this.bStopInFloor = true
    this.speed = speed
    this.bOrientAxisToMovement = bOrientAxisToMovement
    this.bActive = bActive
    this.callback = callback
  }
  activate(speed: float = -1) {
    if (speed >= 0) {
      this.speed = speed
    }
    this.bActive = true
  }
  deactivate() {
    this.bActive = false
  }
  setSpeed(speed: number) {
    this.speed = speed
  }
  //Update called in the system update loop
  update(dt: number) {
    if (this.bActive) {
      if (this.dt > 0 && this.dt < dt) {
        dt = this.dt
      }
      let transform = this.entityToTween.getComponent(Transform)
      let distance = this.currentDirection.clone().scale(dt * this.speed)

      if (this.bOrientAxisToMovement) {
        transform.rotation = Quaternion.LookRotation(this.currentDirection)
      }

      transform.translate(distance)

      if (this.gravity) {
        this.currentDirection = Vector3.Lerp(this.currentDirection.clone(), Vector3.Down(), this.gravity).normalize()
      }
    }
  }
  setDirection(newDirection: Vector3) {
    this.inicialDirection = newDirection.clone().normalize()
    this.currentDirection = this.inicialDirection.clone()
  }
}



/**
 * Creates a Movement Compnent that can be use to move an entity depending on the MovementType
 * @param type: MovementType
 * @param target: Vector3
 * @param bOrientAxisToMovement: boolean
 * @param entityToTween: Entity
 * @param speed: number
 * @param bActive: boolean
 * @param dt: number
 * @param callback?: Function
 * @param movement: any
 * @param loop : boolean
 * @param islerp: boolean = false
 */
@Component('MoveComponent')
export class MoveComponent implements IMovement {
  type: MovementType
  target: Vector3
  bOrientAxisToMovement: boolean
  entityToTween: Entity
  speed: number
  bActive: boolean
  dt: number
  callback?: Function
  movement: any
  loop: boolean
  constructor(movementType: MovementType, entityToMove: Entity, target: Vector3, speed: number, bActive: boolean, bOrientAxisToMovement: boolean, loop: boolean, callback = function () { }, islerp: boolean = false) {
    this.type = movementType
    this.target = target
    this.bOrientAxisToMovement = bOrientAxisToMovement
    this.entityToTween = entityToMove
    this.speed = speed
    this.bActive = bActive
    this.loop = loop

    this.setMovement(movementType, entityToMove, target, speed, bActive, bOrientAxisToMovement, loop, callback, islerp)
  }
  /**
   * Transaltes MovementType in the  constructor be able to add the especific movement chosen
   */
  setMovement(movementType: MovementType, entityToMove: Entity, target: Vector3, speed: number, bActive: boolean, bOrientAxisToMovement: boolean, loop: boolean, callback = function () { }, islerp: boolean = false) {

    switch (movementType) {
      case MovementType.Simple:
        this.movement = new Translate(entityToMove, target, speed, bActive, bOrientAxisToMovement, loop, callback, false)
        break;
      case MovementType.Aceleration:
        this.movement = new Acelerate(entityToMove, target, speed, bActive, bOrientAxisToMovement, callback)
        break;
      case MovementType.Projectile:
        this.movement = new ProjectileMove(entityToMove, target, speed, bActive, bOrientAxisToMovement, callback)
        break;
      case MovementType.Lerp:
        this.movement = new Translate(entityToMove, target, speed, bActive, bOrientAxisToMovement, loop, callback, true)
        break;
    }
  }

  gettarget() {
    return this.target
  }

  settarget(target: Vector3) {
    this.movement.setTarget(target.clone())
    this.target = target
  }
  //Update called in the system update loop
  update(dt: number) {
    this.movement.update(dt)
  }
  activate(speed: float = -1) {
    this.movement.activate(speed)
  }
  deactivate() {
    this.movement.deactivate()
  }
  setSpeed(speed: float) {
    this.movement.setSpeed(speed)
  }

}

//Remember to update the movement using: engine.addSystem(new UpdateMovementComponentsSystem())