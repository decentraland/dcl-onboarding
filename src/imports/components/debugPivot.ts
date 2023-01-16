

@Component("DebugPivot")
class DebugPivot {
    constructor(entity: Entity, scale: Vector3 = new Vector3(0.05, 0.05, 0.05)) {
        const debug = new Entity()
        debug.addComponent(new Transform({
            position: Vector3.Zero(),
            scale: scale
        }))
        debug.addComponent(new SphereShape())
        debug.getComponent(SphereShape).withCollisions = false
        debug.addComponent(MaterialPool.instance().getBlue())
        debug.setParent(entity)

        const debug1 = new Entity()
        debug1.addComponent(new Transform({
            position: new Vector3(0,0,5),
            scale: new Vector3(0.5, 0.5, 10)
        }))
        debug1.addComponent(new BoxShape())
        debug1.getComponent(BoxShape).withCollisions = false
        debug1.addComponent(MaterialPool.instance().getRed())
        debug1.setParent(debug)

        const debug2 = new Entity()
        debug2.addComponent(new Transform({
            position: new Vector3(0,5,0),
            scale: new Vector3(0.5, 10, 0.5)
        }))
        debug2.addComponent(new BoxShape())
        debug2.getComponent(BoxShape).withCollisions = false
        debug2.addComponent(MaterialPool.instance().getGreen())
        debug2.setParent(debug)

        const debug3 = new Entity()
        debug3.addComponent(new Transform({
            position: new Vector3(5,0,0),
            scale: new Vector3(10, 0.5, 0.5)
        }))
        debug3.addComponent(new BoxShape())
        debug3.getComponent(BoxShape).withCollisions = false
        debug3.addComponent(MaterialPool.instance().getBlue())
        debug3.setParent(debug)
    }
}