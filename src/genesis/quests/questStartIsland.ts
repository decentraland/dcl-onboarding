import { getHUD } from 'src/hud';
import { BubbleTalk } from 'src/imports/components/bubbleTalk';
import * as utils from '@dcl/ecs-scene-utils'

import { GameData } from "src/imports/game.data";
import { RobotNPC } from '../components/npcs/robotNpc';
import { AudioManager } from '../components/audio/audio.manager';
import * as bubbleText from "src/jsonData/textsTutorialBubble"
import { blockPlayer, delay, MovementType, releasePlayer, StateMachine } from 'src/imports/index';
import { POPUP_STATE } from '../ui/popupUI';
import { movePlayerTo } from '@decentraland/RestrictedActions';
import { TweenManagerComponent } from 'src/imports/components/tween/tweenmanager';
import { sendTrak } from '../stats/segment';
import { activateSoundPillar1 } from '../components/audio/sounds';
export class SpawnIsland {

    private static instanceRef: SpawnIsland;

    tobor: Entity;
    obstacle: Entity
    blockPlayer: Entity

    //Debug for triggers
    debug: boolean = false
    start_stairs: Entity;
    end_stairs: Entity;
    pilar_1: Entity;
    bubbleTalk: BubbleTalk;
    pilar_tobor: Entity
    bridge_1: Entity
    barrier_1: Entity
    lookAt3DText: Entity

    readonly SPAWN_POSITION = new Vector3(223.85, 71.7368, 123.52) //actual start
    //readonly SPAWN_POSITION = new Vector3(107, 88, 107) //portal
    readonly SPAWN_TARGET = new Vector3(219.13, 70.7368, 125.91)
    cable_off: Entity;
    cable_on: Entity;

    bLoadedFocus: boolean = false

    private constructor() { }

    public static instance(): SpawnIsland { return this.instanceRef || (this.instanceRef = new this()); }


    loadTagData() {

        this.tobor = GameData.instance().getEntity("tobor") as Entity

        this.obstacle = GameData.instance().getEntity("obstacle") as Entity

        this.start_stairs = GameData.instance().getEntity("start_stairs") as Entity
        this.end_stairs = GameData.instance().getEntity("end_stairs") as Entity
        this.pilar_1 = GameData.instance().getEntity("pilar_1") as Entity
        this.pilar_tobor = GameData.instance().getEntity("pilar_tobor") as Entity
        this.bridge_1 = GameData.instance().getEntity("bridge_1") as Entity
        this.barrier_1 = GameData.instance().getEntity("z0_barrier") as Entity
            
        this.barrier_1.addComponentOrReplace(new OnPointerDown(()=>{

            },{
                hoverText:'Talk to Tobor First'
            }
        ))
  
        this.bridge_1.addComponentOrReplace(new OnPointerDown(()=>{

            }
            ,{
                hoverText:'Talk to Tobor Before Crossing'
            }
        ))
 
        this.cable_off = GameData.instance().getEntity("cables1_off") as Entity
        this.cable_on = GameData.instance().getEntity("cables1_on") as Entity

        GenesisData.instance().robotEntity = this.tobor
        this.spawnRobot()
        this.bubbleTalk = this.tobor.getComponent(RobotNPC).bubbleTalk

        this.respawnTrigger()
        this.activeCables(false)
    }

    respawnTrigger() {
        const triggerPos = new Vector3(160, 10, 160)

        const triggerEnt = new Entity()
        triggerEnt.addComponent(new Transform({
            position: triggerPos,
            scale: new Vector3(300, 20, 300)
        }))
        engine.addEntity(triggerEnt)

        const triggerShape = new utils.TriggerBoxShape(new Vector3(300, 30, 300), Vector3.Zero())

        triggerEnt.addComponent(new utils.TriggerComponent(
            triggerShape,
            {
                onCameraEnter: () => {
                    movePlayerTo(this.SPAWN_POSITION.clone().add(new Vector3(0, 1, 0)), this.SPAWN_TARGET.clone())
                },
                enableDebug: false
            }
        ))

    }

    startSpawnIsland() {

        //Stat
        sendTrak('z0_quest0_00')

        //idle animation
        this.tobor.getComponent(RobotNPC).idleAnim()

        //Start ambiental sound
        AudioManager.instance().playMainAmbience(true)
        AudioManager.instance().play("waterfall", { volume: 1, loop: true, position: new Vector3(226.94, 70, 130.37) })

        //Show controls
        getHUD().wgPopUpControls.show(true)
        getHUD().wgPopUpControls.showTakecontrolCameraImage(true)

        //Focus pointer in game
        onPointerLockedStateChange.add(({ locked }) => {

            this.onFocusScreen(locked)
        })

        //Close Keyboard UI
        GenesisData.instance().onStartHideKeyboardUI = () => {
            movePlayerTo(this.SPAWN_POSITION.clone(), this.SPAWN_TARGET.clone())
            delay(() => {
                if (GameData.instance().getVar("start_with_orbs") == true) blockPlayer()
            }, 500)

            this.onFocusScreen(true)
        }


    }

    private onFocusScreen(locked = true) {
        GenesisData.instance().bCameraLocked = locked
        if (locked) {
            if (this.bLoadedFocus) return;
            this.bLoadedFocus = true


            if (!getHUD().wgKeyBoard.bHideInProcess) getHUD().wgKeyBoard.hideAnim();

            getHUD().wgPopUpControls.showLookAroundImage(true)
            if (GameData.instance().getVar("start_with_orbs") == true) {
                this.lookaroundQuest()
            }
            else {
                this.finishLookArround()

            }
            onPointerLockedStateChange.clear()
        }
    }

    lookaroundQuest() {

        var blookedLeft = false
        var blookedRight = false

        let lookleftEntity = new Entity()
        lookleftEntity.addComponent(new Transform({ position: new Vector3(220.85, 70.0, 123.22), scale: new Vector3(9, 9, 9) }))
        lookleftEntity.addComponent(new GLTFShape("unity_assets/s0_Baliza_off_art_01.glb"))
        lookleftEntity.addComponent(new TweenManagerComponent(lookleftEntity))
        lookleftEntity.getComponent(TweenManagerComponent).addMovement(MovementType.Lerp, new Vector3(220.85, 70.6, 123.22), 0.3, true, false, true)
        lookleftEntity.addComponent(new OnPointerHoverEnter(() => {
            lookleftEntity.getComponent(OnPointerHoverEnter).callback = () => { }

            AudioManager.instance().playOnceGlobal("pop_up_close", { volume: 0.5 })

            if (!blookedLeft) {
                lookleftEntity.addComponentOrReplace(new GLTFShape("unity_assets/s0_Baliza_on_art_01.glb"))
                blookedLeft = true
            }
            if (blookedLeft && blookedRight) {

                delay(() => {
                    lookleftEntity.getComponent(TweenManagerComponent).removeAll()

                    engine.removeEntity(lookleftEntity)
                    engine.removeEntity(lookrightEntity)

                    this.finishLookArround()
                }, 1000)
            }

        }))
        engine.addEntity(lookleftEntity)

        let lookrightEntity = new Entity()
        lookrightEntity.addComponent(new Transform({ position: new Vector3(222.69, 70.0, 126.99), scale: new Vector3(9, 9, 9) }))
        lookrightEntity.addComponent(new GLTFShape("unity_assets/s0_Baliza_off_art_01.glb"))
        lookrightEntity.addComponent(new TweenManagerComponent(lookrightEntity))
        lookrightEntity.getComponent(TweenManagerComponent).addMovement(MovementType.Lerp, new Vector3(222.69, 70.6, 126.99), 0.3, true, false, true)
        lookrightEntity.addComponent(new OnPointerHoverEnter(() => {
            lookrightEntity.getComponent(OnPointerHoverEnter).callback = () => { }

            AudioManager.instance().playOnceGlobal("pop_up_close", { volume: 0.5 })

            if (!blookedRight) {
                lookrightEntity.addComponentOrReplace(new GLTFShape("unity_assets/s0_Baliza_on_art_01.glb"))
                blookedRight = true
            }

            if (blookedLeft && blookedRight) {
                delay(() => {
                    lookrightEntity.getComponent(TweenManagerComponent).removeAll()

                    engine.removeEntity(lookleftEntity)
                    engine.removeEntity(lookrightEntity)

                    this.finishLookArround()
                }, 1000)
            }

        }))
        engine.addEntity(lookrightEntity)


    }

    private finishLookArround() {

        //Stat
        sendTrak('z0_quest0_01')

        releasePlayer()

        this.wasdtrigger()

        //Set up bubble
        this.bubbleTalk.setTextWithDelay(bubbleText.CLICKME)
        this.bubbleTalk.setActive(true)

        GenesisData.instance().targeterRobot.showCircle(true)
        getHUD().wgPopUpControls.showWasdImage(true)
    }

    private wasdtrigger() {
        let obstacletrigger = new Entity();
        obstacletrigger.addComponent(new Transform({
            position: utils.getEntityWorldPosition(this.tobor),
            rotation: utils.getEntityWorldRotation(this.tobor),
            scale: Vector3.One()
        }))
        let triggerBox = new utils.TriggerBoxShape(new Vector3(10, 6, 10))

        obstacletrigger.addComponent(
            new utils.TriggerComponent(
                triggerBox, //shape
                {
                    onCameraEnter: () => {
                        obstacletrigger.getComponent(utils.TriggerComponent).onCameraEnter = null
                        engine.removeEntity(obstacletrigger)
                        this.startInteractQuest()


                    }, enableDebug: false

                }
            )
        )

        engine.addEntity(obstacletrigger)
    }

    private startInteractQuest() {

        this.tobor.getComponent(RobotNPC).indicator.hide()

        getHUD().wgPopUpControls.show(false)

        //1º Click on tobor
        this.tobor.addComponentOrReplace(new OnPointerDown((e) => {
            this.tobor.removeComponent(OnPointerDown)

            //Stat
            sendTrak('z0_quest0_02')

            //Bubble off
            this.bubbleTalk.setActive(false)
            GenesisData.instance().targeterRobot.show(false)

            //fail safe. should be  part of keyboard wgKeyBoard.setcallbackStart ???
            //just incase was not called!!!
            if(!getHUD().wgQuest){
                log("getHUD().wgQuest was null!!! workaround why was this null")
                getHUD().setWidgetQuest(0, TaskType.Simple)
            }
            //Task interact complete
            getHUD().wgQuest.showTick(0, true)

            //Hide controls ui
            getHUD().wgPopUpControls.showWasdImage(false)
            getHUD().wgPopUpControls.show(false)

            //sound effect
            AudioManager.instance().playOnce("tobor_talk", { volume: 0.6, parent: this.tobor })
            delay(() => {
                //Start Dialog ZZZ
                getHUD().setWidgetDialogIndex(getHUD().wgTalkRobot, 0)
                getHUD().wgTalkRobot.show(true)

            }, 500)

            //Talk anim
            this.tobor.getComponent(RobotNPC).robotTalkAnim()

            getHUD().wgTalkRobot.callback = () => {
                getHUD().wgTalkRobot.callback = () => { }

                //Complete interact quest
                getHUD().wgTalkRobot.speedText = 20
                getHUD().wgQuest.setOtherTaskDelay(1, 1)

                //anim
                this.tobor.getComponent(RobotNPC).lookAtTrigger()

                this.tobor.getComponent(RobotNPC).activateLookAtPlayer()
                this.tobor.getComponent(RobotNPC).idleAnim()

                this.jumpquest()
                this.startMoveQuest()

            }


        }, { hoverText: "Talk" }))
    }
    //Move tobor to movement task point
    private startMoveQuest() {

        this.tobor.getComponent(RobotNPC).moveTo(this.start_stairs.getComponent(Transform).position, true, () => {
            this.tobor.getComponent(RobotNPC).moveTo(this.end_stairs.getComponent(Transform).position, true, () => {

                this.waitforjump()
                getHUD().wgPopUpControls.showSpaceImage(true)

            })

        })
    }

    jumpquest() {

        //Show controls ui
        getHUD().wgPopUpControls.showSpaceImage(true)

        //Remove barrier
        this.barrier_1.getComponent(GLTFShape).visible = false
        this.barrier_1.getComponent(GLTFShape).withCollisions = false
        this.barrier_1.getComponent(Transform).position = new Vector3(0, 0, 0)
        this.barrier_1.getComponent(Transform).scale = new Vector3(0,0,0) 

        let obstacletrigger = new Entity();
        obstacletrigger.addComponent(new Transform({ position: utils.getEntityWorldPosition(this.obstacle).addInPlace(new Vector3(-2, 0, 3)) }))
        let triggerBox = new utils.TriggerBoxShape(new Vector3(3, 9, 10))

        obstacletrigger.addComponent(
            new utils.TriggerComponent(
                triggerBox, //shape
                {
                    onCameraEnter: () => {

                        engine.removeEntity(obstacletrigger)

                        this.completeJumpQuest()

                        this.bubbleTalk.setActive(false)

                        //Task jump complete
                        getHUD().wgQuest.showTick(0, true)
                        getHUD().wgQuest.setOtherTaskDelay(2, 1)

                        //Hide controls ui
                        getHUD().wgPopUpControls.showSpaceImage(false)

                        //Reset scale max bubble
                        this.bubbleTalk.setBubbleMaxScale(1)

                    }, enableDebug: false

                }
            )
        )

        engine.addEntity(obstacletrigger)
    }

    private completeJumpQuest() {

        //Stat
        sendTrak('z0_quest0_03')

        //hide controls ui
        getHUD().wgPopUpControls.show(false)

        this.tobor.getComponent(RobotNPC).setMoveSpeed(6)
        this.tobor.getComponent(RobotNPC).moveTo(this.pilar_tobor.getComponent(Transform).position, true, () => {

            this.dialogAtPilar()

            //Show bubble
            this.bubbleTalk.setTextWithDelay(bubbleText.OVERHERE)
            this.bubbleTalk.setBubbleMaxScale(1.7)
            this.bubbleTalk.setActive(true)

            GenesisData.instance().targeterRobot.translate(utils.getEntityWorldPosition(this.tobor).add(new Vector3(0, 0, 0)))
            GenesisData.instance().targeterRobot.showCircle(true)
        })
    }

    dialogAtPilar() {
        this.tobor.addComponentOrReplace(new OnPointerDown((e) => {
            this.tobor.removeComponent(OnPointerDown)
            this.bubbleTalk.setBubbleDisapearDistance(10)

            //Stat
            sendTrak('z0_quest0_04')

            //Task
            getHUD().wgQuest.showTick(0, true)
            getHUD().wgQuest.setOtherTaskDelay(3, 1)

            //Bubble off
            this.bubbleTalk.setActive(false)
            GenesisData.instance().targeterRobot.show(false);

            //sound effect
            AudioManager.instance().playOnce("tobor_talk", { volume: 0.6, parent: this.tobor })
            delay(() => {
                //Start Dialog Robot
                getHUD().wgTalkRobot.show(false)
                getHUD().wgTalkRobot.showToText(3)

            }, 500)

            this.tobor.getComponent(RobotNPC).robotTalkAnim()

            //On last dialog start Move Quest
            getHUD().wgTalkRobot.callback = () => {
                //Reset callback
                getHUD().wgTalkRobot.callback = () => { }

                //Chapter Accept
                getHUD().wgPopUp.rightButtonClic = () => {
                    this.onCloseRewardUI()
                }

                //play close sound
                AudioManager.instance().playOnce("pop_up_close", { volume: 0.2, parent: this.tobor })

                //Show popup tutorial tasks
                getHUD().wgPopUp.popUpMode(POPUP_STATE.Tasks)

                //Play popup sound
                AudioManager.instance().playPopupOpen()

                //show bubble
                this.bubbleTalk.setTextWithDelay(bubbleText.HELP_BEIZER)
                this.bubbleTalk.setActive(true)

            }
        }, { hoverText: "Talk" }))
    }

    private onCloseRewardUI() {
        getHUD().wgPopUp.rightButtonClic = () => { }
        getHUD().wgPopUp.leftButtonClic = () => { }
        this.activatePilar()
        this.ativateBridge()
        getHUD().wgPopUpControls.showTakecontrolCameraImage(true)
        getHUD().wgPopUpControls.takecontrolCameraImageContainerBackground.visible = true

        //Start Emote State Quest
        StateManager.instance().startState("IslandQuest1State")

    }

    //Movement task dialog
    private waitforjump() {

        //Bubble
        this.tobor.getComponent(RobotNPC).activateLookAtPlayer()

        //Movement task bubble
        this.bubbleTalk.setBubbleDisapearDistance(0)
        this.bubbleTalk.setBubbleMaxScale(3)
        this.bubbleTalk.setTextWithDelay(bubbleText.JUMP)
        this.bubbleTalk.setActive(true)

    }


    activatePilar() {

        AudioManager.instance().playTowerCharge(this.pilar_1)
        this.pilar_1.getComponent(StateMachine).playClip("Pillar_Anim", false, 3, false, () => {

            AudioManager.instance().playTowerActivated(this.pilar_1)
            activateSoundPillar1(this.pilar_1)

            this.pilar_1.getComponent(StateMachine).playClip("Pillar_ON", false, 0.5, false, () => {
                this.activeCables(true)
            })

        })

    }
    ativateBridge() {

        AudioManager.instance().playBridge(this.bridge_1)

        //remove onclick tooltip
        //if(this.bridge_1.hasComponent(OnPointerDown)) this.bridge_1.removeComponent(OnPointerDown)

        this.bridge_1.getComponent(StateMachine).playClip("Bridge Animation", false, 3, false, () => {

            this.bridge_1.getComponent(StateMachine).playClip("Bridge On", false, 1, false, () => {

                //Show MultiTask
                getHUD().wgQuestMultiple.show(true)
                getHUD().wgQuest.setPaddingY("-35%")

                //Play tobor idle anim
                this.tobor.getComponent(RobotNPC).idleAnim()
            })
        })
    }

    spawnRobot() {

        if (!GenesisData.instance().robotEntity) {
            DebugAccess.instance().log("MISSING ROBOT ENTITY", LogType.ERROR);
            return;
        }

        this.tobor.getComponent(Transform).scale = new Vector3(1, 1, 1)

        //Set robot bubble in mode 1 ( middle bubble)
        this.tobor.addComponent(new RobotNPC(GenesisData.instance().robotEntity, { mode: 1 }))

        this.bubbleTalk = this.tobor.getComponent(RobotNPC).bubbleTalk
        this.bubbleTalk.setPositon(new Vector3(this.bubbleTalk.centerEntity.getComponent(Transform).position.x,
            this.bubbleTalk.centerEntity.getComponent(Transform).position.y - 2,
            this.bubbleTalk.centerEntity.getComponent(Transform).position.z))
        this.bubbleTalk.activeAutoRotation(true)

        this.bubbleTalk.setTitle("Tobor")
        this.bubbleTalk.setBubbleDisapearDistance(18)
        this.tobor.getComponent(RobotNPC).setBubbleMaxScale(1)

        this.tobor.getComponent(RobotNPC).setMoveSpeed(5)

        this.loadTargeterRobot()

        engine.addEntity(GenesisData.instance().robotEntity)
        GenesisData.instance().robotEntity.getComponent(Animator).getClip("Robot_Idle").play()
    }

    loadTargeterRobot() {
        GenesisData.instance().targeterRobot = new ObjectiveTarget({ position: new Vector3(8, -10, 8) });
        GenesisData.instance().targeterRobot.show(false);
        GenesisData.instance().targeterRobot.translate(utils.getEntityWorldPosition(this.tobor).add(new Vector3(0, 0, 0)))
        GenesisData.instance().targeterRobot.showArrow(false)
        GenesisData.instance().targeterRobot.setCircleScale(0.4)
    }

    private activeCables(bActive: boolean) {
        if (!this.cable_off?.hasComponent(GLTFShape)) {
            DebugAccess.instance().log("cable_off not found. Skip", LogType.WARN)
        }
        else this.cable_off.getComponent(GLTFShape).visible = !bActive

        if (!this.cable_on?.hasComponent(GLTFShape)) {
            DebugAccess.instance().log("cable_on not found. Skip", LogType.WARN)
        }
        else this.cable_on.getComponent(GLTFShape).visible = bActive
    }
}

