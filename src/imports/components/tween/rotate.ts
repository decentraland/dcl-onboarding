import { IRotate, RotateType } from "./tween.schema"

/**
 * Rotates the entity  depending on the RotateType property with the speed given
 * @param   type: RotateType
 * @param   entityToTween: Entity
 * @param   bActive: boolean    //Activate the component to update
 * @param   speed: float   //Rotate speed * frame time
 * @param   dt: float
 * @param   callback: Function   //Callback to call when targetLocation is reached
 * @param   lookAtTarget: Vector3
 * @param   target: Quaternion 
 * @param   mylerpdata: { origin: Quaternion; target: Quaternion; fraction: number }
 * @param   btarget:boolean
 * @param   clock:number = 0
 */
class Rotate implements IRotate {

    type: RotateType
    entityToTween: Entity
    bActive: boolean    //Activate the component to update
    speed: float   //Rotate speed * frame time
    dt: float
    callback: Function   //Callback to call when targetLocation is reached
    lookAtTarget: Vector3
    target: Quaternion
    mylerpdata: { origin: Quaternion; target: Quaternion; fraction: number }
    btarget: boolean
    clock: number = 0
    constructor(type: RotateType, entityToRotate: Entity, target: Quaternion, speed: number, bActive: boolean, callback = function () { }) {
        this.type = type
        this.entityToTween = entityToRotate
        this.speed = speed
        this.dt = 0.03
        this.target = target.clone()
        this.mylerpdata = { origin: new Quaternion(0, 0, 0, 0), target: new Quaternion(0, 0, 0, 0), fraction: 0 }
        this.resetlerpdata()
        this.callback = callback
        this.btarget = false
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
    setTarget(target: Quaternion) {
        if (target && target != undefined) {
            this.resetlerpdata()
            this.target = target.clone()
            this.btarget = true
            this.clock = 0
        }
    }

    //Update called in the system update loop
    update(dt: number) {
        if (this.bActive) {


            let transform = this.entityToTween.getComponent(Transform)
            if (!this.btarget) {
                if (this.dt > 0 && this.dt < dt) {
                    dt = this.dt
                }
                if (this.substractQuaternion(transform.rotation, this.target) != 0) {
                    switch (this.type) {
                        case RotateType.Left: transform.rotate(Vector3.Down(), this.speed)
                            break;
                        case RotateType.Right: transform.rotate(Vector3.Up(), this.speed)
                            break;
                        case RotateType.Forward: transform.rotate(Vector3.Right(), this.speed)
                            break;
                        case RotateType.Backward: transform.rotate(Vector3.Left(), this.speed)
                            break;
                        case RotateType.Up: transform.rotate(Vector3.Backward(), this.speed)
                            break;
                        case RotateType.Down: transform.rotate(Vector3.Forward(), this.speed)
                            break;
                    }
                }
            } else {

                if (this.target.eulerAngles.x == transform.rotation.eulerAngles.x && this.target.eulerAngles.y == transform.rotation.eulerAngles.y && this.target.eulerAngles.z == transform.rotation.eulerAngles.z) {
                    this.clock = 0
                }
                if (this.clock < 1) {
                    this.clock += this.dt
                    transform.rotation = this.target


                } else {

                    this.speed = 0

                }
            }
        }
    }

    resetlerpdata() {

        this.mylerpdata.target = this.target
        this.mylerpdata.origin = this.entityToTween.getComponent(Transform).rotation.clone()
        this.mylerpdata.fraction = 0

    }

    substractQuaternion(qua1: Quaternion, qua2: Quaternion): number {

        var sub: number = 0
        sub += qua1.x - qua2.x
        sub += qua1.y - qua2.y
        sub += qua1.z - qua2.z
        sub += qua1.w - qua2.w

        return sub
    }
}


@Component('RotateComponent')
export class RotateComponent {
    movement: Rotate
    constructor(rotationType: RotateType, entityToRotate: Entity, target: Quaternion, speed: number, bActive: boolean, callback = function () { }) {
        this.setRotation(rotationType, entityToRotate, target, speed, bActive, callback)
    }
    setRotation(rotationType: RotateType, entityToRotate: Entity, target: Quaternion, speed: number, bActive: boolean, callback = function () { }) {
        if (this.movement) {
            this.movement.deactivate()
        }
        this.movement = new Rotate(rotationType, entityToRotate, target, speed, bActive, callback)
    }

    settarget(target: Quaternion) {
        this.movement.setTarget(target.clone())
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
