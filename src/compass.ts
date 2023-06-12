import * as ui from '@dcl/ui-scene-utils'


//#region npcs
export class npcCompassReference extends Entity {
    name: string
    transform: Transform
    isComplated: boolean

    constructor(name: string, transform: Transform, isComplated: boolean){
        super()
        this.name = name
        this.transform = transform
        this.isComplated = isComplated
    }
}

const foxBezierTransform = new Transform({position: new Vector3(160.1, 66.1, 104.3)})
const foxBezier = new npcCompassReference("foxBezier", foxBezierTransform, false)

const racoonMatTransform = new Transform({position: new Vector3(170.4, 68.9, 159)})
const racoonMat = new npcCompassReference("racoonMat", racoonMatTransform, false)

const racoonKitTransform = new Transform({ position: new Vector3(111, 77.6, 138.8)})
const racoonKit = new npcCompassReference("racoonKit", racoonKitTransform, false)

const portalToborTransform = new Transform({ position: new Vector3(117.2, 80.9, 113)})
const portalTobor = new npcCompassReference("portalTobor", portalToborTransform, false)

const npcsToFind = [foxBezier, racoonMat, racoonKit, portalTobor]


class npcState{
    TOTAL_TO_FIND: number = 4
    firstNPC: boolean
    npcs = npcsToFind
    compassVisible: boolean = false
    hintedAtPuzzle:boolean = false
    warnedIfNotWeb3:boolean = false //find better place for this!?!?!
}
  
export const NPC_STATE = new npcState()
//#endregion

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
        this.npcsToFind = npcsToFind
        this.uiImage = uiImage
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

    _compassSystem = new compassSystem(NPC_STATE.npcs, compassImage)
    engine.addSystem(_compassSystem)
    _compassSystem.enabled = true
  
    NPC_STATE.compassVisible = true
}

export function hideCompass() {
    log("compass.ts" + "hideCompass()")

    uiContainer.visible = false
    compassImage.visible = false

    if(_compassSystem !== null && _compassSystem !== undefined){
      engine.removeSystem(_compassSystem)
      _compassSystem.enabled = false
    }
  
    NPC_STATE.compassVisible = false
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
      const currentPage = npcs[i] as npcCompassReference
  
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