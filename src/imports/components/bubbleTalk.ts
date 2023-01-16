import { PmText } from './text'
import { BillboardPM } from './billboard'
import { ScaleWithDistanceSystem } from '../systems'
import { clearDelay, delay } from './delay'
import { AudioManager } from 'src/genesis/components/audio/audio.manager'

export type BubbleTalkOptions = {
    positionOffset?: ReadOnlyVector3
    textOffset?: ReadOnlyVector2
    bubbleSrc?: string,
    scale?: ReadOnlyVector3
    panelScale?: EcsMathReadOnlyVector2
    textScale?: number
    textContainerSize?: EcsMathReadOnlyVector2
    textFontSize?: number
    bScaleToDistance?: boolean
    maxDistance?: number
    minDistance?: number
    maxScale?: number
    disapearDistance?: number  //0 or greater then maxDistance
    bDebugMode?: boolean
    mode?: 0 | 1
}

@Component("BubbleTalk")
export class BubbleTalk {
    centerEntity: Entity
    panelEntity: Entity
    textEntity: Entity
    titleEntity: Entity

    private _bActive: boolean

    private centerGlb: GLTFShape
    private sideGlb: GLTFShape
    private storeEntity: Entity

    private titleText: TextShape
    private textShape: TextShape
    private options: BubbleTalkOptions

    private text: PmText
    private billboard: BillboardPM
    private scaleSistemIndex: number = -1

    private savedMaxScale: ReadOnlyVector3
    private savedMinScale: ReadOnlyVector3

    private closeTimmer: any

    private readonly TITLE_TEXT_CENTER = new Vector3(0.25, 0.16, 0.035)
    private readonly TITLE_TEXT_SIDE = new Vector3(-0.72, 0.07, 0.035)
    private readonly TEXT_OFFSET_CENTER = { x: 0, y: 0.08 }
    private readonly TEXT_OFFSET_SIDE = { x: 0.35, y: -0.02 }

    constructor(position: Vector3, options?: BubbleTalkOptions) {
        this.options = options || {
            positionOffset: Vector3.Zero(),
            mode: 0,
        }

        this.options.textOffset = (this.options.mode) ? this.TEXT_OFFSET_CENTER : this.TEXT_OFFSET_SIDE

        this.centerEntity = new Entity()
        this.centerEntity.addComponent(new Transform({
            position: position.add(this.options.positionOffset),
            scale: new Vector3(
                (this.options?.scale) ? this.options.scale.x : 1,
                (this.options?.scale) ? this.options.scale.y : 1,
                (this.options?.scale) ? this.options.scale.z : 1
            )
        }))


        this.panelEntity = new Entity()
        this.panelEntity.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            rotation: Quaternion.Euler(0, 180, 0),
            scale: new Vector3(
                (this.options?.panelScale) ? this.options.panelScale.x : 1,
                (this.options?.panelScale) ? this.options.panelScale.y : 1,
                1
            ),
        }))



        if (this.options.mode) {
            this.centerGlb = new GLTFShape("assets/glb_assets/s0_centerbubble_01.glb")
            this.panelEntity.addComponent(this.centerGlb)

            this.sideGlb = new GLTFShape("assets/glb_assets/s0_sidebubble_01.glb");
            this.sideGlb.withCollisions = false;
            this.sideGlb.visible = false;

            this.storeEntity = new Entity();
            this.storeEntity.addComponent(this.sideGlb);
            engine.addEntity(this.storeEntity);

        }
        else {
            this.sideGlb = new GLTFShape("assets/glb_assets/s0_sidebubble_01.glb")
            this.panelEntity.addComponent(this.sideGlb)

            this.centerGlb = new GLTFShape("assets/glb_assets/s0_centerbubble_01.glb")
            this.centerGlb.withCollisions = false;
            this.centerGlb.visible = false;
        }

        this.panelEntity.getComponent(GLTFShape).withCollisions = false

        this.textEntity = new Entity()
        this.titleEntity = new Entity()

        this.textEntity.addComponent(new Transform({
            position: new Vector3(0, 0, 0.035),
            rotation: Quaternion.Euler(0, 180, 0),
            scale: new Vector3(
                (this.options?.textScale) ? this.options.textScale : 1,
                (this.options?.textScale) ? this.options.textScale : 1,
                1
            )
        }))

        this.titleEntity.addComponent(new Transform({
            position: this.TITLE_TEXT_CENTER,
            rotation: Quaternion.Euler(0, 180, 0),
            scale: new Vector3(1, 1, 1)
        }))


        if (this.options.mode) {

            this.textEntity.getComponent(Transform).position.x = ((this.options.textOffset?.x) ? this.options.textOffset.x : 0)
        }
        else {

            this.textEntity.getComponent(Transform).position.x = -this.panelEntity.getComponent(Transform).scale.x / 2 + ((this.options.textOffset?.x) ? this.options.textOffset.x : 0)

            this.titleEntity.getComponent(Transform).position = this.TITLE_TEXT_SIDE
        }


        this.textEntity.getComponent(Transform).position.y = this.panelEntity.getComponent(Transform).scale.y / 2 + ((this.options.textOffset?.y) ? this.options.textOffset.y : 0)

        engine.addEntity(this.centerEntity)
        this.panelEntity.setParent(this.centerEntity)
        this.textEntity.setParent(this.centerEntity)

        this.textShape = new TextShape()
        this.textShape.color = Color3.Black()
        this.textShape.fontSize = (this.options?.textFontSize) ? this.options.textFontSize : 1
        this.textShape.hTextAlign = "left"
        this.textShape.vTextAlign = "top"


        this.textShape.width = (this.options?.textContainerSize) ? this.options.textContainerSize.x : 0.95
        this.textShape.height = (this.options?.textContainerSize) ? this.options.textContainerSize.y : 0.95
        this.textShape.textWrapping = true

        this.text = new PmText("", [this.textShape])
        this.textShape.value = this.text.value

        this.textEntity.addComponent(this.textShape)

        this.titleEntity.setParent(this.centerEntity)

        this.titleText = new TextShape()
        this.titleText.color = Color3.Black()
        this.titleText.fontSize = 1
        this.titleText.hTextAlign = "left"
        this.titleText.vTextAlign = "top"
        this.titleText.value = ""
        this.titleText.width = 0.95
        this.titleText.height = 0.95
        this.titleText.textWrapping = true

        this.titleEntity.addComponent(this.titleText)

        this.billboard = new BillboardPM(false)
        this.centerEntity.addComponent(this.billboard)
        this.billboard.setAxis({ x: 1, y: 0, z: 1 })
        this.billboard.setActive(true)

        if (this.options?.bScaleToDistance) {
            this.savedMaxScale = this.centerEntity.getComponent(Transform).scale.clone().scale((this.options?.maxScale) ? this.options.maxScale : 4)
            this.savedMinScale = this.centerEntity.getComponent(Transform).scale.clone()

            if (this.options?.disapearDistance && this.options?.disapearDistance < this.options?.maxDistance) {
                this.options.maxDistance = this.options.disapearDistance
                DebugAccess.instance().log("BubbleTalk: disapearDistance is smaller than maxDistance, setting maxDistance to disapearDistance", LogType.WARN)
                console.warn("BubbleTalk: disapearDistance is smaller than maxDistance, setting maxDistance to disapearDistance")
            }

            this.scaleSistemIndex = ScaleWithDistanceSystem.instance().addEntity(this.centerEntity, {
                maxDistance: (this.options?.maxDistance) ? this.options.maxDistance : 20,
                minDistance: (this.options?.minDistance) ? this.options?.minDistance : 4,
                minScale: this.savedMinScale,
                maxScale: this.savedMaxScale,
                disapearDistance: (this.options?.disapearDistance) ? this.options.disapearDistance : 0,
                bSmoothScale: true,
            })
        }

        if (this.options?.bDebugMode) {
            this.centerEntity.addComponent(new DebugPivot(this.centerEntity))
            this.panelEntity.addComponent(new DebugPivot(this.panelEntity))
            this.textEntity.addComponent(new DebugPivot(this.textEntity))

            const debugText = new Entity()
            debugText.addComponent(new Transform({
                position: new Vector3(0, 0, 0.001),
                scale: new Vector3(this.textShape.width, this.textShape.height, 1)
            }))
            debugText.addComponent(new PlaneShape())
            debugText.setParent(this.textEntity)

            debugText.addComponent(MaterialPool.instance().getDebugTransMaterial())
        }

        this.setActive(false)

    }

    changeMode(mode: 0 | 1) {
        if (mode == 0) {

            this.sideGlb.visible = false
            this.sideGlb.withCollisions = false
            this.centerGlb.visible = false
            this.centerGlb.withCollisions = false

            this.panelEntity.addComponentOrReplace(this.sideGlb)
            if (this.storeEntity.hasComponent(GLTFShape)) {
                this.storeEntity.addComponentOrReplace(this.centerGlb)
            }

            this.options.textOffset = this.TEXT_OFFSET_SIDE
            this.textEntity.getComponent(Transform).position.x = -this.panelEntity.getComponent(Transform).scale.x / 2 + ((this.options.textOffset?.x) ? this.options.textOffset.x : 0) - 1
            this.titleEntity.getComponent(Transform).position = this.TITLE_TEXT_SIDE.clone()
        }
        else {

            this.centerGlb.visible = false
            this.centerGlb.withCollisions = false
            this.sideGlb.visible = false
            this.sideGlb.withCollisions = false

            if (this.storeEntity.hasComponent(GLTFShape)) {
                this.storeEntity.addComponentOrReplace(this.sideGlb)
            }

            this.panelEntity.addComponentOrReplace(this.centerGlb)
            this.options.textOffset = this.TEXT_OFFSET_CENTER
            this.textEntity.getComponent(Transform).position.x = ((this.options.textOffset?.x) ? this.options.textOffset.x : 0)
            this.titleEntity.getComponent(Transform).position = this.TITLE_TEXT_CENTER.clone()
        }

        this.textEntity.getComponent(Transform).position.y = this.panelEntity.getComponent(Transform).scale.y / 2 + ((this.options.textOffset?.y) ? this.options.textOffset.y : 0)
    }

    setOffsetText(offset: { x: number, y: number }) {
        this.textEntity.getComponent(Transform).position.x = this.textEntity.getComponent(Transform).position.x + offset.x
        this.textEntity.getComponent(Transform).position.y = this.textEntity.getComponent(Transform).position.y + offset.y
    }

    setBubbleMaxScale(scale: number) {
        if (!this.options.bScaleToDistance) return;

        ScaleWithDistanceSystem.instance().setEntityOptions(this.scaleSistemIndex, {
            maxScale: new Vector3(this.savedMinScale.x, this.savedMinScale.y, this.savedMinScale.z).scale(scale),
        })
    }

    setBubbleMaxDistance(distance: number) {
        if (!this.options.bScaleToDistance) return;

        ScaleWithDistanceSystem.instance().setEntityOptions(this.scaleSistemIndex, {
            maxDistance: distance,
        })
    }

    setBubbleDisapearDistance(distance: number) {
        if (!this.options.bScaleToDistance) return;

        ScaleWithDistanceSystem.instance().setEntityOptions(this.scaleSistemIndex, {
            disapearDistance: distance,
        })
    }

    get bActive() {
        return this._bActive
    }

    setActive(bActive: boolean) {
        this._bActive = bActive
        this.centerEntity.getComponent(BillboardPM).setActive(bActive)
        this.panelEntity.getComponent(GLTFShape).visible = bActive
        this.textEntity.getComponent(TextShape).visible = bActive
        this.titleEntity.getComponent(TextShape).visible = bActive
        this.clearCloseTimmer()
        if (this.options.bScaleToDistance) {

            ScaleWithDistanceSystem.instance().activeEntity(this.scaleSistemIndex, bActive)
            if (bActive) {
                this.centerEntity.getComponent(Transform).scale = Vector3.Zero()
            }
        }

        if (bActive) {
            AudioManager.instance().playOnce("button_interact", { volume: 0.5, pitch: 1.5, parent: this.centerEntity })
        }
    }

    setPositon(position: Vector3) {
        this.centerEntity.getComponent(Transform).position = position.add(this.options.positionOffset)
    }

    setRotation(rotation: Quaternion) {
        this.centerEntity.getComponent(Transform).rotation = rotation
    }

    activeAutoRotation(bActive: boolean) {
        this.billboard.setActive(bActive)
    }

    setTitle(title: string) {
        this.titleText.value = title
    }

    setText(text: string) {
        this.text.setText(text)
    }

    setTextWithDelay(text: string) {
        this.text.setTextWithDelay(text, 20)
    }
    closeBubbleInTime(seconds: number) {
        this.clearCloseTimmer()
        this.closeTimmer = delay(() => {
            this.setActive(false)
        }, seconds * 1000)
    }

    private clearCloseTimmer() {
        if (this.closeTimmer) {
            clearDelay(this.closeTimmer)
            this.closeTimmer = null
        }
    }

}


