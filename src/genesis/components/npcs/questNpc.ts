import { StateMachine } from "src/imports/components/stateMachine";
import { GenesisNPC, GenesisNPCOptions } from "./genesisNpc";

type QuestNPCOptions = GenesisNPCOptions & { animEntity: Entity }

@Component("QuestNpc")
export class QuestNpc extends GenesisNPC {

    readonly ANIM_IDLE = "Idle"
    readonly ANIM_TALK = "Talk";
    readonly ANIM_HI = "Hi";
    readonly ANIM_BYE = "Bye";
    readonly ANIM_CELEBRATE = "Celebrate";
    readonly ANIM_DANCE = "Dance";

    constructor(entity: IEntity, options: QuestNPCOptions) {
        super(entity, options);
    }

    hiAnim(onEnd = () => { }) {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_HI);
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_HI, true, 1, false, () => {
                onEnd()
            });
        }
        else DebugAccess.instance().log("MISSING QUEST NPC STATE MACHINE " + this.ANIM_HI + " ", LogType.ERROR);
    }
    byeAnim(onEnd = () => { }) {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_BYE);
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_BYE, true, 1, false, () => {
                onEnd()
            })
        }
        else DebugAccess.instance().log("MISSING QUEST NPC STATE MACHINE " + this.ANIM_BYE + " ", LogType.ERROR)
    }

    celebrateAnim(onEnd = () => { }) {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_CELEBRATE);
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_CELEBRATE, true, 1, false, () => {
                onEnd()
            })
        }
        else DebugAccess.instance().log("MISSING QUEST NPC STATE MACHINE " + this.ANIM_CELEBRATE + " ", LogType.ERROR);
    }

    danceAnim(onEnd = () => { }) {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_DANCE);
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_DANCE, true, 1, true, () => {
                onEnd()
            })
        }
        else DebugAccess.instance().log("MISSING QUEST NPC STATE MACHINE " + this.ANIM_DANCE + " ", LogType.ERROR);
    }

    lookAtPlayer() {
        this.entity.getComponent(Transform).lookAt(
            new Vector3(Camera.instance.position.x, this.entity.getComponent(Transform).position.y, Camera.instance.position.z)
        ).rotate(Vector3.Up(), -90)
    }
}