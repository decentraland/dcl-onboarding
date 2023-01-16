import { movePlayerTo } from "@decentraland/RestrictedActions"
import { delay } from "./delay"
import { MovementType } from "./tween/tween.schema"

var blockPlayerInstance: BlockPlayer

export function loadBlockPlayer() {
    if (!blockPlayerInstance) {
        blockPlayerInstance = new BlockPlayer()
    }
}

export function blockPlayer() {
    try {
        blockPlayerInstance.blockPlayer()
    } catch (error) {
        console_log("Block Player error, call loadBlockPlayer() before using blockPlayer")
        console_log(error)
    }
}

export function releasePlayer() {
    try {
        blockPlayerInstance.releasePlayer()
    } catch (error) {
        console_log("Block Player error, call loadBlockPlayer() before using blockPlayer")
        console_log(error)
    }
}

class BlockPlayer {
    spawnPosition: Vector3 = new Vector3(10, 5, 10)
    walls: Entity[] = []
    readonly DEBUG_MODE = false
    readonly WALL_SIZE = 1
    constructor() {

        this.walls[0] = new Entity()
        this.walls[0].addComponent(new BoxShape())
        this.walls[0].addComponent(new Transform({
            position: this.spawnPosition,
            scale: new Vector3(0.2, 8, this.WALL_SIZE),
        }))

        engine.addEntity(this.walls[0])

        this.walls[0].getComponent(BoxShape).visible = false
        this.walls[0].getComponent(BoxShape).isPointerBlocker = false

        this.walls[1] = new Entity()
        this.walls[1].addComponent(new BoxShape())
        this.walls[1].addComponent(new Transform({
            position: this.spawnPosition,
            scale: new Vector3(this.WALL_SIZE, 8, 0.2),
        }))

        engine.addEntity(this.walls[1])
        this.walls[1].getComponent(BoxShape).visible = false
        this.walls[1].getComponent(BoxShape).isPointerBlocker = false

        this.walls[2] = new Entity()
        this.walls[2].addComponent(new BoxShape())
        this.walls[2].addComponent(new Transform({
            position: this.spawnPosition,
            scale: new Vector3(this.WALL_SIZE, 8, 0.2),
        }))

        engine.addEntity(this.walls[2])
        this.walls[2].getComponent(BoxShape).visible = false
        this.walls[2].getComponent(BoxShape).isPointerBlocker = false

        this.walls[3] = new Entity()
        this.walls[3].addComponent(new BoxShape())
        this.walls[3].addComponent(new Transform({
            position: this.spawnPosition,
            scale: new Vector3(0.2, 8, this.WALL_SIZE),
        }))

        engine.addEntity(this.walls[3])
        this.walls[3].getComponent(BoxShape).visible = false
        this.walls[3].getComponent(BoxShape).isPointerBlocker = false

        this.walls[4] = new Entity()
        this.walls[4].addComponent(new BoxShape())
        this.walls[4].addComponent(new Transform({
            position: this.spawnPosition,
            scale: new Vector3(10, 0.2, 10),
        }))

        engine.addEntity(this.walls[4])
        this.walls[4].getComponent(BoxShape).visible = false
        this.walls[4].getComponent(BoxShape).isPointerBlocker = false

        this.walls[5] = new Entity()
        this.walls[5].addComponent(new BoxShape())
        this.walls[5].addComponent(new Transform({
            position: this.spawnPosition,
            scale: new Vector3(10, 0.2, 10),
        }))

        engine.addEntity(this.walls[5])
        this.walls[5].getComponent(BoxShape).visible = false
        this.walls[5].getComponent(BoxShape).isPointerBlocker = false

        if (this.DEBUG_MODE) {
            this.walls.forEach(wall => {
                wall.addComponent(MaterialPool.instance().getDebugTransMaterial())
                wall.getComponent(BoxShape).visible = true
                wall.getComponent(BoxShape).isPointerBlocker = true
            })
        }

    }
    blockPlayer() {
        const pos = Camera.instance.feetPosition.clone()

        this.walls[0].getComponent(BoxShape).withCollisions = true
        this.walls[1].getComponent(BoxShape).withCollisions = true
        this.walls[2].getComponent(BoxShape).withCollisions = true
        this.walls[3].getComponent(BoxShape).withCollisions = true
        //this.walls[4].getComponent(BoxShape).withCollisions = true
        this.walls[5].getComponent(BoxShape).withCollisions = true


        this.walls[0].getComponent(Transform).position = pos.add(new Vector3((this.WALL_SIZE - 0.1) / 2, -0.5, 0))
        this.walls[1].getComponent(Transform).position = pos.add(new Vector3(0, -0.5, (this.WALL_SIZE - 0.1) / 2))
        this.walls[2].getComponent(Transform).position = pos.add(new Vector3(0, -0.5, (this.WALL_SIZE - 0.1) / -2))
        this.walls[3].getComponent(Transform).position = pos.add(new Vector3((this.WALL_SIZE - 0.1) / -2, -0.5, 0))
        //this.walls[4].getComponent(Transform).position = pos.add(new Vector3(0,-2,0))
        this.walls[5].getComponent(Transform).position = pos.add(new Vector3(0, 3, 0))


    }
    releasePlayer() {

        this.walls[0].getComponent(BoxShape).withCollisions = false
        this.walls[1].getComponent(BoxShape).withCollisions = false
        this.walls[2].getComponent(BoxShape).withCollisions = false
        this.walls[3].getComponent(BoxShape).withCollisions = false
        this.walls[4].getComponent(BoxShape).withCollisions = false
        this.walls[5].getComponent(BoxShape).withCollisions = false

        this.walls[0].getComponent(Transform).position = this.spawnPosition
        this.walls[1].getComponent(Transform).position = this.spawnPosition
        this.walls[2].getComponent(Transform).position = this.spawnPosition
        this.walls[3].getComponent(Transform).position = this.spawnPosition
        this.walls[4].getComponent(Transform).position = this.spawnPosition
        this.walls[5].getComponent(Transform).position = this.spawnPosition
    }


}