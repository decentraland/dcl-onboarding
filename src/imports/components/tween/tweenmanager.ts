import { MoveComponent } from "./movementV2";
import { RotateComponent } from "./rotate";
import { ScaleComponent } from "./scale";
import { MovementType, RotateType, ScaleType } from "./tween.schema";
/**
 * Manager for all the tween an entity can have
 * @param  entityToTween: Entity;
 * @param  movement: MoveComponent
 * @param  rotation: RotateComponent
 * @param  scale: ScaleComponent
 */
@Component("TweenManagerComponent")
export class TweenManagerComponent {

    entityToTween: Entity;
    movement: MoveComponent
    rotation: RotateComponent
    scale: ScaleComponent

    constructor(entityToTween: Entity) {
        this.entityToTween = entityToTween
    }

    //----------------------------------------------------------------MOVEMENT----------------------------------------------------------------
    addMovement(movementtype: MovementType, target: Vector3, speed: number, bActive: boolean, orientAxisMovement: boolean, loop: boolean, callback = function () { }, islerp: boolean = false) {
        switch (movementtype) {
            //----- Move Components -------------------------------
            case MovementType.Simple:
                this.entityToTween.addComponent(new MoveComponent(MovementType.Simple, this.entityToTween, target, speed, bActive, orientAxisMovement, loop ,callback))
                break;
            case MovementType.Projectile:
                this.entityToTween.addComponent(new MoveComponent(MovementType.Projectile, this.entityToTween, target, speed, bActive, orientAxisMovement, loop, callback))
                break;
            case MovementType.Aceleration:
                this.entityToTween.addComponent(new MoveComponent(MovementType.Aceleration, this.entityToTween, target, speed, bActive, orientAxisMovement, loop, callback))
                break;
            case MovementType.Lerp:
                this.entityToTween.addComponent(new MoveComponent(MovementType.Lerp, this.entityToTween, target, speed, bActive, orientAxisMovement, loop, callback, islerp))
                break;
        }
    }
    setMovement(movement: MoveComponent) {
        this.movement = this.entityToTween.addComponentOrReplace(movement)
    }
    removeMovement() {
        if (this.entityToTween.hasComponent(MoveComponent)) {
            
            this.movement = null
            this.entityToTween.removeComponent(MoveComponent)
        }
    }
    //----------------------------------------------------------------ROTATE-------------------------------------------------------------------
    addRotate(rotatetype: RotateType, target: Quaternion, speed: number,bActive: boolean, callback = function () { }) {
        switch (rotatetype) {
            //----- Rotate Components -------------------------------
            case RotateType.Right:
                this.entityToTween.addComponent(new RotateComponent(RotateType.Right, this.entityToTween, target, speed, bActive, callback))
                break;
            case RotateType.Left:
                this.entityToTween.addComponent(new RotateComponent(RotateType.Left, this.entityToTween, target, speed, bActive, callback))
                break;
            case RotateType.Forward:
                this.entityToTween.addComponent(new RotateComponent(RotateType.Forward, this.entityToTween, target, speed, bActive, callback))
                break;
            case RotateType.Backward:
                this.entityToTween.addComponent(new RotateComponent(RotateType.Backward, this.entityToTween, target, speed, bActive, callback))
                break;
            case RotateType.Up:
                this.entityToTween.addComponent(new RotateComponent(RotateType.Up, this.entityToTween, target, speed, bActive, callback))
                break;
            case RotateType.Down:
                this.entityToTween.addComponent(new RotateComponent(RotateType.Down, this.entityToTween, target, speed, bActive, callback))
                break;
        }
    }
    setRotate(rotation: RotateComponent) {
        this.rotation = this.entityToTween.addComponentOrReplace(rotation)
    }
    removeRotate() {
        if (this.rotation && this.entityToTween.hasComponent(RotateComponent)) {

            this.rotation = null
            this.entityToTween.removeComponent(RotateComponent)
        }
    }
    //----------------------------------------------------------------SCALE--------------------------------------------------------------------
    addScale(scaletype: ScaleType, target: Vector3, speed: number, bActive: boolean, callback = function () { }, islerp: boolean = false) {
        switch (scaletype) {
            //----- Scale Component --------------------------------
            case ScaleType.xSide:
                this.entityToTween.addComponent(new ScaleComponent(ScaleType.xSide, this.entityToTween, target, speed, bActive, callback))
                break;
            case ScaleType.ySide:
                this.entityToTween.addComponent(new ScaleComponent(ScaleType.ySide, this.entityToTween, target, speed, bActive, callback))
                break;
            case ScaleType.zSide:
                this.entityToTween.addComponent(new ScaleComponent(ScaleType.zSide, this.entityToTween, target, speed, bActive, callback))
                break;
            case ScaleType.All:
                this.entityToTween.addComponent(new ScaleComponent(ScaleType.All, this.entityToTween, target, speed, bActive, callback))
                break;
            case ScaleType.PingPong:
                this.entityToTween.addComponent(new ScaleComponent(ScaleType.PingPong, this.entityToTween, target, speed, bActive, callback, islerp))
                break;
        }
    }
    setScale(scale: ScaleComponent) {
        this.scale = this.entityToTween.addComponentOrReplace(scale)
    }
    removeScale() {
        if ( this.entityToTween.hasComponent(ScaleComponent)) {
            this.scale = null
            this.entityToTween.removeComponent(ScaleComponent)
        }
    }
    //----------------------------------------------------------------ALL----------------------------------------------------------------------
    removeAll() {
        this.removeMovement()
        this.removeRotate()
        this.removeScale()
    }
}


