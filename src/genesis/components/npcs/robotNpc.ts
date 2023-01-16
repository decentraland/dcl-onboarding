import { StateMachine } from "src/imports/components/stateMachine";
import { GenesisNPC } from "./genesisNpc";


@Component("RobotNPC")
export class RobotNPC extends GenesisNPC {

    readonly ANIM_IDLE = "Robot_Idle"
    readonly ANIM_WALK_START = "Walk_Start"
    readonly ANIM_WALK_LOOP = "Walk_Loop"
    readonly ANIM_WALK_END = "Walk_End"
    readonly ANIM_TALK = "Talk"
    readonly ANIM_ROBOT_ON = "Robot_On"
    readonly ANIM_ROBOT_OFF = "Robot_off"


    robotOnAnim(onEnd = () => { }) {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_ROBOT_ON);
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_ROBOT_ON, true, 1, false, () => {
                //Idle animation
                this.animEntity.getComponent(RobotNPC).idleAnim()
                onEnd()
            })
        }
        else DebugAccess.instance().log("MISSING ROBOT STATE MACHINE " + this.ANIM_ROBOT_ON, LogType.ERROR);
    }

    robotOffAnim() {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_ROBOT_OFF);
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_ROBOT_OFF, true, 1, true)
        }
        else DebugAccess.instance().log("MISSING ROBOT STATE MACHINE " + this.ANIM_ROBOT_OFF, LogType.ERROR);
    }

    robotTalkAnim() {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_TALK)
            this.talkLooping = true
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_TALK, true, 1, true)


        }
        else DebugAccess.instance().log("MISSING ROBOT STATE MACHINE " + this.ANIM_TALK, LogType.ERROR);
    }

    robotCelebrateAnim() {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_TALK)
            this.talkLooping = true
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_TALK, true, 1, true)
            this.robotCelebrateAnim()

        }
        else DebugAccess.instance().log("MISSING ROBOT STATE MACHINE " + this.ANIM_TALK, LogType.ERROR);
    }

}