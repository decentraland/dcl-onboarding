import { BubbleTalk } from "src/imports/components/bubbleTalk"
import { MovementType } from "src/imports/components/tween/tween.schema"
import { TweenManagerComponent } from "src/imports/components/tween/tweenmanager"
import { MoveComponent } from "src/imports/components/tween/movementV2";
import { QuestIndicator } from "./questIndicator"
import { StateMachine } from "src/imports/components/stateMachine";
import { getEntityWorldPosition } from "@dcl/ecs-scene-utils";
import * as utils from '@dcl/ecs-scene-utils'
import { clearDelay, delay } from "src/imports/index";


/**
 * GenesisNPCOptions.
 * @property {Entity} animEntity - The entity that the NPC will use to play animations.
 * @property {Vector3} bubbleOffset - The offset of the speech bubble from the NPC's position.
 * @property {Vector3} indicatorPosition - The position of the indicator.
 * @property {Vector3} indicatorScale - The scale of the indicator.
 * @property {0 | 1} mode - 0 ; NPC will not move, 1 ; 
 */
export type GenesisNPCOptions = {
    animEntity?: Entity,
    bubbleOffset?: Vector3,
    indicatorPosition?: Vector3,
    indicatorScale?: Vector3,
    mode?: 0 | 1
}
/**
 * GenesisNPC
 * @param entity IEntity
 * @param options GenesisNPCOptions
 * @param options.animEntity Entity that has the animations
 * @param options.bubbleOffset Offset of the bubble talk
 * @param options.indicatorPosition Offset of the quest indicator
 * @param options.indicatorScale Scale of the quest indicator
 * @param options.mode 0 = Quest NPC, 1 = Genesis NPC  This is the type of the bubble 
 */
export class GenesisNPC {
    entity: IEntity
    animEntity: IEntity
    bubbleTalk: BubbleTalk
    indicator: QuestIndicator
    protected moveSpeed: number = 2

    readonly ANIM_IDLE: string = "Robot_Idle"
    readonly ANIM_WALK_START: string = "Walk_Start"
    readonly ANIM_WALK_LOOP: string = "Walk_Loop"
    readonly ANIM_WALK_END: string = "Walk_End"
    readonly ANIM_TALK: string = "Talk"

    protected animState: string = ""
    protected talkLooping: boolean
    protected onEndTalkLoop = () => { }
    lookAtPlayerActive: boolean = false
    lookingplayerDelay: any;
    triggerLook: Entity;

    constructor(entity: IEntity, options: GenesisNPCOptions = {}) {
        this.entity = entity
        this.animEntity = options.animEntity || entity

        entity.addComponent(new TweenManagerComponent(entity as Entity))

        this.bubbleTalk = new BubbleTalk(getEntityWorldPosition(entity), {
            positionOffset: (options.bubbleOffset) ? options.bubbleOffset : new Vector3(0, 1.8, 0),
            panelScale: { x: 0.5, y: 0.5 },
            textScale: 1,
            textFontSize: 1,
            textContainerSize: { x: 1.55, y: 0.25 },
            bScaleToDistance: true,
            maxDistance: 14,
            minDistance: 2,
            disapearDistance: 16,
            maxScale: 4,
            bDebugMode: false,
            mode: (options.mode) ? options.mode : 0
        })

        this.indicator = new QuestIndicator(entity as Entity)
        this.entity.addComponent(this.indicator)

        this.indicator.icon.getComponent(Transform).position = (options.indicatorPosition) ? options.indicatorPosition : new Vector3(0, 2.2, 0)
        this.indicator.icon.getComponent(Transform).scale = (options.indicatorScale) ? options.indicatorScale : new Vector3(1, 1, 1)
        this.indicator.icon.getComponent(Transform).rotation = Quaternion.Euler(0, -90, 0)

        this.indicator.hide()
    }

    setBubbleMaxScale(scale: number) {
        this.bubbleTalk.setBubbleMaxScale(scale)
    }
    setBubbleRotation(rotation: Quaternion) {
        this.bubbleTalk.setRotation(rotation)
    }
    activeBubbleAutoRotation(bActive: boolean) {
        this.bubbleTalk.activeAutoRotation(bActive)
    }

    moveTo(target: Vector3, bRemoveOnEnd: boolean, callback = () => { }) {
        this.deactivateLookAtPlayer()
        this.removeMovement()
        this.entity.getComponent(Transform).lookAt(target).rotate(Vector3.Up(), 180)
        //Start walk anim
        this.walkStartAnim()
        this.entity.getComponent(TweenManagerComponent).addMovement(MovementType.Simple, target.clone(), this.moveSpeed, true, false, true, () => {
            this.bubbleTalk.setPositon(this.entity.getComponent(Transform).position.clone())
            //Idle anim
            this.idleAnim()
            //Look at player at end
            this.lookAtPlayer()
            this.triggerLook.getComponent(Transform).position = this.entity.getComponent(Transform).position.clone()

            if (bRemoveOnEnd) {
                this.removeMovement()
            }
            callback()
        })
    }
    lookAtPlayer() {
        this.entity.getComponent(Transform).lookAt(
            new Vector3(Camera.instance.position.x, this.entity.getComponent(Transform).position.y, Camera.instance.position.z)
        ).rotate(Vector3.Up(), 180)
    }
    ovewriteMoveToCallback(callback: () => void) {
        if (!this.entity.hasComponent(MoveComponent) || !this.entity.getComponent(MoveComponent).movement) {
            return;
        }

        this.entity.getComponent(MoveComponent).movement.callback = callback
    }
    setMoveSpeed(speed: number) {
        this.moveSpeed = speed
        if (this.entity.hasComponent(MoveComponent)) {
            this.entity.getComponent(MoveComponent).setSpeed(speed)
        }
    }
    setPosition(position: Vector3) {
        this.entity.getComponent(Transform).position = position
        this.bubbleTalk.setPositon(position)
    }
    removeMovement() {
        this.entity.getComponent(TweenManagerComponent).removeMovement()
    }

    //Anims
    idleAnim() {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_IDLE)
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_IDLE, true, 1, true)
        }
        else DebugAccess.instance().log("MISSING NPC STATE MACHINE " + this.ANIM_IDLE + " ", LogType.ERROR);
    }

    walkStartAnim(onEnd = () => { }) {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_WALK_START)
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_WALK_START, true, 1, false, () => {
                this.walkLoopAnim()
                onEnd()
            })
        }
        else DebugAccess.instance().log("MISSING NPC STATE MACHINE " + this.ANIM_WALK_START + " ", LogType.ERROR);
    }
    walkLoopAnim() {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_WALK_LOOP)
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_WALK_LOOP, true, 1, true)
        }
        else DebugAccess.instance().log("MISSING NPC STATE MACHINE " + this.ANIM_WALK_LOOP + " ", LogType.ERROR);
    }
    walkEndAnim(onEnd = () => { }) {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_WALK_END)
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_WALK_END, true, 1, false, () => {
                onEnd()
            })
        }
        else DebugAccess.instance().log("MISSING NPC STATE MACHINE " + this.ANIM_WALK_END + " ", LogType.ERROR);
    }
    talkAnim() {
        if (this.animEntity.hasComponent(StateMachine)) {
            this.changeAnimState(this.ANIM_TALK)
            this.talkLooping = true
            this.animEntity.getComponent(StateMachine).playClip(this.ANIM_TALK, true, 1, true)
            this.talkLoopAnim()
        }
        else DebugAccess.instance().log("MISSING NPC STATE MACHINE" + this.ANIM_TALK + " ", LogType.ERROR);
    }

    idleAnimFromTalk() {
        if (this.animEntity.hasComponent(StateMachine)) {
            if (!this.talkLooping || this.animState != this.ANIM_TALK) {
                this.idleAnim()
                return;
            }

            this.talkLooping = false
            this.onEndTalkLoop = () => {
                this.idleAnim()
            }
        }
        else DebugAccess.instance().log("MISSING NPC STATE MACHINE " + this.ANIM_TALK + " ", LogType.ERROR);
    }

    private talkLoopAnim() {
        if (!this.talkLooping || this.animState != this.ANIM_TALK) {
            return;
        }
        this.animEntity.getComponent(StateMachine).playClip(this.ANIM_TALK, true, 1, false, () => {
            //End the loop
            if (!this.talkLooping) {
                this.onEndTalkLoop()
                return;
            }
            this.talkLoopAnim()
        })
    }

    protected changeAnimState(state: string) {
        this.animState = state
        //DebugAccess.instance().log("NPC ANIM STATE: " + state, LogType.LOG);
    }

    lookAtTrigger() {
        this.triggerLook = new Entity()
        this.triggerLook.addComponent(new Transform({ position: this.entity.getComponent(Transform).position }))
        this.triggerLook.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(15, 5, 15)), {
            onCameraEnter: () => {
                this.activateLookAtPlayer()

            },
            onCameraExit: () => {

                this.deactivateLookAtPlayer()
            }, enableDebug: false
        }))
        engine.addEntity(this.triggerLook)
    }

    loopLookAtPlayer() {
        if (this.lookingplayerDelay) {
            clearDelay(this.lookingplayerDelay)
            this.lookingplayerDelay = null
        }
        this.lookingplayerDelay = delay(() => {
            if (!this.entity.hasComponent(MoveComponent))
                this.lookAtPlayer()
            this.loopLookAtPlayer()

        }, 200)

    }

    activateLookAtPlayer() {
        this.lookAtPlayerActive = true
        this.loopLookAtPlayer()
        if (this.triggerLook) {

            if (!this.triggerLook.isAddedToEngine()) {
                engine.addEntity(this.triggerLook)
            }
        }
    }

    deactivateLookAtPlayer() {
        this.lookAtPlayerActive = false
        if (this.lookingplayerDelay) {
            clearDelay(this.lookingplayerDelay)
            this.lookingplayerDelay = null
        }
    }
}