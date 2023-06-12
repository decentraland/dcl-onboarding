
import * as ui from '@dcl/ui-scene-utils'


type ClosestDataType = {closestPagePosition?:Vector3,closestPageDistance?:number}

enum compassDirections {
  N,
  NE,
  E,
  SE,
  S,
  SW,
  W,
  NW,
  NONE,
}

let compassDiedMessage = false;

let camera = Camera.instance

export class compassSystem implements ISystem {
    enabled: boolean = false
    uiImage: UIImage
    currentDirection: compassDirections = compassDirections.NONE
    npcsToFind: Entity[]
    closestData: ClosestDataType = {}

    constructor(npcsToFind: Entity[], uiImage: UIImage) {
        this.currentDirection = compassDirections.NONE
        this.uiImage = uiImage
        this.npcsToFind = npcsToFind
    }

    update(dt: number) {
        if (!this.enabled) return // if we import anything from ./mica, the script can't be compiled, i think it has to do with circular references

        let cameraForward = PhysicsCast.instance.getRayFromCamera(1).direction
        let playerPos = camera.position.clone()
        playerPos.y = 0

        this.closestData.closestPageDistance = 9999

        computeInPlaceClosestDistance(this.closestData, this.npcsToFind)

        if (this.closestData.closestPageDistance == 9999) {
            this.uiImage.sourceLeft = 0
            this.uiImage.sourceTop = 0
            
            if (!compassDiedMessage) {
                compassDiedMessage = true
                //NPC_REGISTRY.elf2.talk(presentsTuto, 'compassDied')//no duration, force them to acknolege
            }

            return
        }

        let deltaVector = playerPos.subtract(this.closestData.closestPagePosition)
        deltaVector.y = 0

        let angle = Vector3.GetAngleBetweenVectors(
            new Vector3(cameraForward.x, 0, cameraForward.z),
            deltaVector,
            Vector3.Up()
        )

        if (Math.abs(angle) >= 3) {
            if (this.currentDirection == compassDirections.N) return

            this.uiImage.sourceLeft = 2 * this.uiImage.sourceWidth
            this.uiImage.sourceTop = 0 * this.uiImage.sourceHeight

            this.currentDirection = compassDirections.N
        } else if (Math.abs(angle) <= 0.2) {
            if (this.currentDirection == compassDirections.S) return

            this.uiImage.sourceLeft = this.uiImage.sourceWidth
            this.uiImage.sourceTop = this.uiImage.sourceHeight

            this.currentDirection = compassDirections.S
        } else {
            if (angle > 0) {
                if (angle > 2) {
                    if (this.currentDirection == compassDirections.NE) return

                    this.uiImage.sourceLeft = 0
                    this.uiImage.sourceTop = 2 * this.uiImage.sourceHeight

                    this.currentDirection = compassDirections.NE
                } else if (angle > 1) {
                    if (this.currentDirection == compassDirections.E) return

                    this.uiImage.sourceLeft = 0
                    this.uiImage.sourceTop = this.uiImage.sourceHeight

                    this.currentDirection = compassDirections.E
                } else if (angle > 0) {
                    if (this.currentDirection == compassDirections.SE) return

                    this.uiImage.sourceLeft = 2 * this.uiImage.sourceWidth
                    this.uiImage.sourceTop = 2 * this.uiImage.sourceHeight

                    this.currentDirection = compassDirections.SE
                }
            } else {
                if (angle < -2) {
                    if (this.currentDirection == compassDirections.NW) return

                    this.uiImage.sourceLeft = 2 * this.uiImage.sourceWidth
                    this.uiImage.sourceTop = this.uiImage.sourceHeight

                    this.currentDirection = compassDirections.NW
                } else if (angle < -1) {
                    if (this.currentDirection == compassDirections.W) return

                    this.uiImage.sourceLeft = this.uiImage.sourceWidth
                    this.uiImage.sourceTop = 0

                    this.currentDirection = compassDirections.W
                } else if (angle < 0) {
                    if (this.currentDirection == compassDirections.SW) return

                    this.uiImage.sourceLeft = this.uiImage.sourceWidth
                    this.uiImage.sourceTop = 2 * this.uiImage.sourceHeight

                    this.currentDirection = compassDirections.SW
                }
            }
        }
    }
}


//#region UI
export let atlas = new Texture('assets/ui/compass/CompassSprites1a.png') //CompassSprites

let currentHandsY: number = -20
export const uiContainer = new UIContainerRect(ui.canvas)
uiContainer.isPointerBlocker = false
uiContainer.width = '100%'
uiContainer.height = '100%'
uiContainer.positionY = currentHandsY
uiContainer.visible = false

export let compassImage = new UIImage(uiContainer, atlas)
compassImage.hAlign = 'left'
compassImage.vAlign = 'bottom'
compassImage.positionX = '10%'
compassImage.positionY = currentHandsY - 10
compassImage.sourceWidth = 425
compassImage.sourceHeight = 425
compassImage.sourceLeft = 0
compassImage.sourceTop = 4 * compassImage.sourceWidth
compassImage.width = compassImage.sourceWidth * 0.6
compassImage.height = compassImage.sourceHeight * 0.6
compassImage.visible = false
compassImage.opacity = 1
//#endregion


export let _compassSystem: compassSystem

export function showCompass() {
    log("compass.ts" + "showCompass()")

    uiContainer.visible = true
    compassImage.visible = true

    _compassSystem = new compassSystem(PRESENT_STATE.npcs, compassImage)
    engine.addSystem(_compassSystem)
    _compassSystem.enabled = true
  
    PRESENT_STATE.compassVisible = true
}

export function hideCompass() {
    log("compass.ts" + "hideCompass()")

    uiContainer.visible = false
    compassImage.visible = false

    if(_compassSystem !== null && _compassSystem !== undefined){
      engine.removeSystem(_compassSystem)
      _compassSystem.enabled = false
    }
  
    PRESENT_STATE.compassVisible = false
}

export function disableCompass() {
    log("compass.ts" + "disableCompass")

    if(_compassSystem !== null && _compassSystem !== undefined){
      engine.removeSystem(_compassSystem)
      _compassSystem.enabled = false
    }
}

function computeInPlaceClosestDistance(closestData: ClosestDataType, npcs: Entity[]) {
    for (let i = 0; i < npcs.length; i++) {
      const currentPage = npcs[i] as npc
  
      if (currentPage.isComplated) continue
  
      let distanceToPlayer = Vector3.Distance(
        currentPage.transform.position,
        camera.position
      )
      if (distanceToPlayer < closestData.closestPageDistance) {
        closestData.closestPagePosition = currentPage.transform.position.clone()
        closestData.closestPageDistance = distanceToPlayer
      }
    }
}

class npcState{
    TOTAL_TO_FIND: number = 4
    firstNPC: boolean
    npcs = []
    compassVisible: boolean = false
    hintedAtPuzzle:boolean = false
    warnedIfNotWeb3:boolean = false //find better place for this!?!?!
}
  
export const PRESENT_STATE = new npcState()

export class npc extends Entity {
    name: string
    transform: Transform
    isComplated: boolean
}

const foxTransform = new Transform({ position: new Vector3(170.31, 68.796, 159.06)})
const fox = new npc("fox", foxTransform, false )
