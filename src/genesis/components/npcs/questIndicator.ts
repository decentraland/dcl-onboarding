import { RotateType } from "src/imports/components/tween/tween.schema"
import { TweenManagerComponent } from "src/imports/components/tween/tweenmanager"

export enum IndicatorState {
    EXCLAMATION,
    INTERROGATION,
}

@Component('QuestIndicator')
export class QuestIndicator {
    icon: Entity

    constructor(parent: Entity) {
        this.icon = new Entity("IconQuest")
        this.icon.setParent(parent)
        this.icon.addComponent(new Transform({
            position: new Vector3(0.2, -0.4, 0),
            rotation: new Vector3(90, 0, 0).toQuaternion(),
            scale: new Vector3(0.5, 0.5, 0.5)
        }))
        this.icon.addComponent(new GLTFShape("assets/QuestExclamation.glb"))
        this.icon.getComponent(GLTFShape).withCollisions = false
        this.icon.getComponent(GLTFShape).visible = true
        this.icon.addComponentOrReplace(new TweenManagerComponent(this.icon))
        this.icon.getComponent(TweenManagerComponent).addRotate(RotateType.Left, Quaternion.Euler(0, 0, 0), 5, true)
    }

    updateStatus(status: IndicatorState) {
        if (status == IndicatorState.EXCLAMATION) {
            this.icon.addComponentOrReplace(new GLTFShape("assets/QuestExclamation.glb"))

        }
        else if (status == IndicatorState.INTERROGATION) {
            this.icon.addComponentOrReplace(new GLTFShape("assets/QuestInterrogation.glb"))
        }

        this.icon.getComponent(GLTFShape).visible = true
    }

    hide() {
        this.icon.getComponent(GLTFShape).visible = false
    }

}