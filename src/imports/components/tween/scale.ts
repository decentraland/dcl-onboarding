import { IScale, ScaleType } from "./tween.schema"


/**
 * Scales the entity  depending on the ScaleType property with the speed given
 * @param   type: ScaleType
 * @param   entityToTween: Entity
 * @param   target: Vector3
 * @param   bActive: boolean    //Activate the component to update
 * @param   speed: float   //Scale speed * frame time Lower Speed = faster
 * @param   dt: float
 * @param   callback: Function   //Callback to call when targetLocation is reached
 * @param   mylerpdata: { origin: Vector3; target: Vector3; fraction: number }
 * @param   btarget:boolean
 * @param   clock:number = 0
 */
class Scale implements IScale {
    type: ScaleType
    entityToTween: Entity
    target: Vector3
    bActive: boolean    //Activate the component to update
    speed: float   //Scale speed * frame time Lower Speed = faster
    dt: float
    callback: Function   //Callback to call when targetLocation is reached
    mylerpdata: { origin: Vector3; target: Vector3; fraction: number }
    btarget: boolean
    clock: number = 0
    islerp: boolean
    constructor(type: ScaleType, entityToTween: Entity, target: Vector3, speed: number, bActive: boolean, callback = function () { }, islerp: boolean = false) {
        this.type = type
        this.entityToTween = entityToTween
        this.speed = speed
        this.dt = 0
        this.target = target.clone()
        this.mylerpdata = {
            origin: this.entityToTween.getComponent(Transform).scale.clone(),
            target: this.target,
            fraction: 0
        }
        this.callback = callback
        this.bActive = bActive
        this.islerp = islerp
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
            this.mylerpdata.origin = this.entityToTween.getComponent(Transform).scale.clone()
            this.target = target.clone()
            this.mylerpdata.target = target.clone()
            this.btarget = true
            this.clock = 0
        }
    }

    //Update called in the system update loop
    update(dt: number) {
        if (this.bActive) {

            var transform = this.entityToTween.getComponent(Transform)

            if (this.dt > 0 && this.dt < dt) {
                dt = this.dt
            }
            if (this.islerp) {

                this.scaleLerp(transform, dt)
            } else {

                this.scaleSimple(transform, dt)
            }
        }
    }
    private scaleSimple(transform: Transform, dt: number) {
        let distance = directionVectorBetweenTwoPoints(transform.scale.clone(), this.target).scale(dt * this.speed)

        switch (this.type) {
            case ScaleType.xSide:
                this.scaleTranslate(transform, distance.x, 0, 0)
                break;
            case ScaleType.ySide:
                this.scaleTranslate(transform, 0, distance.y, 0)
                break;
            case ScaleType.zSide:
                this.scaleTranslate(transform, 0, 0, distance.z)
                break;
            case ScaleType.All:
                this.scaleTranslate(transform, distance.x, distance.y, distance.z)
                break;
            case ScaleType.PingPong:
                this.scaleTranslate(transform, distance.x, distance.y, distance.z)
                break;

        }

    }
    private scaleTranslate(transform: Transform, x: number, y: number, z: number) {
        let distance = new Vector3(x, y, z)

        if (Vector3.Distance(transform.scale, this.target) > distance.length()) {
            var newScale = new Vector3(transform.scale.x + x, transform.scale.y + y, transform.scale.z + z)
            transform.scale = newScale

        } else {
            transform.scale = this.target.clone()
            this.callback()
            this.bActive = (this.type == ScaleType.PingPong)
            if (this.type == ScaleType.PingPong) {
                this.setTarget(this.mylerpdata.origin.clone())
            }

        }


    }
    private scaleLerp(transform: Transform, dt: number) {

        if (this.mylerpdata.fraction < 1) {

            let newScale: number
            switch (this.type) {
                case ScaleType.xSide:
                    newScale = Scalar.Lerp(this.mylerpdata.origin.x, this.mylerpdata.target.x, this.mylerpdata.fraction)
                    transform.scale.x = newScale
                    break;
                case ScaleType.ySide:
                    newScale = Scalar.Lerp(this.mylerpdata.origin.y, this.mylerpdata.target.y, this.mylerpdata.fraction)
                    transform.scale.y = newScale
                    break;
                case ScaleType.zSide:
                    newScale = Scalar.Lerp(this.mylerpdata.origin.z, this.mylerpdata.target.z, this.mylerpdata.fraction)
                    transform.scale.z = newScale
                    break;
                case ScaleType.All:
                    transform.scale = Vector3.Lerp(this.mylerpdata.origin, this.mylerpdata.target, this.mylerpdata.fraction)
                    break;

                case ScaleType.PingPong:
                    transform.scale = Vector3.Lerp(this.mylerpdata.origin, this.mylerpdata.target, this.mylerpdata.fraction)
                    break;

            }

            this.mylerpdata.fraction += dt * this.speed
        } else {

            switch (this.type) {
                case ScaleType.xSide:
                    transform.scale.x = this.mylerpdata.target.clone().x
                    break;
                case ScaleType.ySide:
                    transform.scale.y = this.mylerpdata.target.clone().y
                    break;
                case ScaleType.zSide:
                    transform.scale.z = this.mylerpdata.target.clone().z
                    break;
                case ScaleType.All:
                    transform.scale = this.mylerpdata.target.clone()
                    break;
                case ScaleType.PingPong:
                    transform.scale = this.mylerpdata.target.clone()
                    break;
            }


            this.callback()
            this.bActive = (this.type == ScaleType.PingPong)
            if (this.type == ScaleType.PingPong) {
                this.setTarget(this.mylerpdata.origin.clone())
                this.mylerpdata.fraction = 0
            }
        }

    }
}

@Component('ScaleComponent')
export class ScaleComponent {
    movement: Scale
    constructor(typeofTween: ScaleType, entityToScale: Entity, target: Vector3, speed: number, bActive: boolean, callback = function () { }, islerp: boolean = false) {
        this.setScale(typeofTween, entityToScale, target, speed, bActive, callback, islerp)
    }

    setScale(typeoftween: ScaleType, entityToScale: Entity, target: Vector3, speed: number, bActive: boolean, callback = function () { }, islerp: boolean = false) {
        if (this.movement) {
            this.movement.deactivate()
        }

        this.movement = new Scale(typeoftween, entityToScale, target, speed, bActive, callback, islerp)

    }
    settarget(target: Vector3) {
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

// Use engine.addSystem(new UpdateRotateComponentsSystem()) to update the rotation system