
type ObjectiveTargetConstructorArgs = {
    position: Vector3
    scale?: Vector3
    rotation?: Quaternion
    parent?: Entity
    arrowHeight?: number
    bDebug?: boolean
}

class ObjectiveTarget extends Entity {

    arrowEntity: Entity
    floorCircleEntity: Entity

    constructor(constructorArgs: ObjectiveTargetConstructorArgs) {
        super()

        this.addComponent(new Transform({
            position: constructorArgs.position,
            scale: constructorArgs.scale || new Vector3(1, 1, 1),
            rotation: constructorArgs.rotation || Quaternion.Euler(0, 0, 0)
        }))

        if (constructorArgs.parent) {
            this.setParent(constructorArgs.parent)
        }

        this.arrowEntity = new Entity()
        this.arrowEntity.addComponent(new Transform({
            position: new Vector3(0, constructorArgs.arrowHeight || 1, 0),
            rotation: Quaternion.Euler(0, 0, 0),
            scale: new Vector3(1, 1, 1)
        }))

        this.arrowEntity.addComponent(new GLTFShape("assets/glb_assets/target_arrow.glb"))
        this.arrowEntity.getComponent(GLTFShape).withCollisions = false
        this.arrowEntity.getComponent(GLTFShape).visible = false

        this.floorCircleEntity = new Entity()
        this.floorCircleEntity.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(100, 100, 100)
        }))

        this.floorCircleEntity.addComponent(new GLTFShape("assets/glb_assets/target_position.glb"))
        this.floorCircleEntity.getComponent(GLTFShape).withCollisions = false
        this.floorCircleEntity.getComponent(GLTFShape).visible = false

        engine.addEntity(this)
        this.arrowEntity.setParent(this)
        this.floorCircleEntity.setParent(this)

        if (constructorArgs.bDebug) {
            this.addComponent(new DebugPivot(this))
            this.arrowEntity.addComponent(new DebugPivot(this.arrowEntity))
            this.floorCircleEntity.addComponent(new DebugPivot(this.floorCircleEntity))
        }

    }

    translate(position: Vector3) {
        this.getComponent(Transform).position = position
    }

    setArrowHeight(height: number) {
        this.arrowEntity.getComponent(Transform).position.y = height
    }

    setCircleScale(scale: number) {
        this.floorCircleEntity.getComponent(Transform).scale = Vector3.One().scale(scale * 100)
    }

    showArrow(bShow: boolean) {
        this.arrowEntity.getComponent(GLTFShape).visible = bShow
    }

    showCircle(bShow: boolean) {
        this.floorCircleEntity.getComponent(GLTFShape).visible = bShow
    }

    show(bShow: boolean) {
        this.showArrow(bShow)
        this.showCircle(bShow)
    }
    delete() {

        engine.removeEntity(this.arrowEntity)
        engine.removeEntity(this.floorCircleEntity)
        engine.removeEntity(this)
    }
}