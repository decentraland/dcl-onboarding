
import * as utils from '@dcl/ecs-scene-utils'
import { getHUD } from 'src/hud'
import { GameData } from 'src/imports/game.data'
import { delay, SkipMode, StateMachine } from 'src/imports/index'
import { ConnectMiniGame } from '../components/connectMG'
import { QuestIndicator, IndicatorState } from '../components/npcs/questIndicator'
import * as bubbleTalk from 'src/jsonData/textsTutorialBubble';
import { QuestNpc } from '../components/npcs/questNpc'
import { AudioManager } from '../components/audio/audio.manager'
import { sendTrak } from '../stats/segment'
import { CameraModeManager } from '../cameraMode'
import { initClaimProvider, lookupDispenerPosByCampId } from 'src/modules/claiming/claimSetup'
import { ClaimConfig } from 'src/claiming-dropin/claiming/loot-config'
import { DispenserPos } from 'src/claiming-dropin/claiming/claimTypes'
import { ClaimTokenResult, ClaimUI, HandleClaimTokenCallbacks } from 'src/claiming-dropin/claiming/loot'
import { IClaimProvider } from 'src/claiming-dropin/claiming/defaultClaimProvider'
import { activatePillarSound4, changeGeneratosSound } from '../components/audio/sounds'
import { s0_Z3_Prop_Stairs02_Art_3__01, s0_Z3_Prop_Stairs02_Art_4__01, s0_Z3_Prop_Stairs02_Art_5__01, s0_Z3_Prop_Stairs03_Art_01 } from 'src/game'

//Quest restore energy

export class QuestPuzzle /*implements IClaimProvider*/ {

    private static instanceRef: QuestPuzzle;
    particle: Entity
    public static instance(): QuestPuzzle { return this.instanceRef || (this.instanceRef = new this()); }

    npc3: Entity
    npc3Anim: Entity
    npc2PlazaPosition: Vector3
    pilar4: Entity
    cable_off: Entity
    cable_on: Entity


    /*//start claim code
    hasReward:boolean 
    dispenserPos:DispenserPos
    claimUI:ClaimUI|undefined
    claimCallbacks!:HandleClaimTokenCallbacks
    claimTokenReady:boolean = false
    claimInformedPending:boolean = false
    claimTokenResult:ClaimTokenResult|undefined
    showClaimPrompts:boolean = false
    //end claim code*/

    connect_game: ConnectMiniGame

    private constructor() {

    }

    loadTagData() {

        this.npc3 = GameData.instance().getEntity("npc3") as Entity
        this.npc3Anim = GameData.instance().getEntity("npc3_anim") as Entity
        this.pilar4 = GameData.instance().getEntity("pilar_4") as Entity
        this.cable_off = GameData.instance().getEntity("cables4_off") as Entity
        this.cable_on = GameData.instance().getEntity("cables4_on") as Entity

        GenesisData.instance().quest3.npc3 = this.npc3
        GenesisData.instance().quest3.npc3Anim = GameData.instance().getEntity("npc3_anim") as Entity

        this.activeCables(false)

        this.connect_game = new ConnectMiniGame()
    }


    public startQuestPuzzle() {
        this.setBubbleNpc2()
        this.setUpInitQuest()
        this.setUpTriggerHi()
        this.setUpClaim()
    }


    private setUpClaim() {
        /*this.dispenserPos = lookupDispenerPosByCampId( ClaimConfig.campaign.CAP.refId )
        initClaimProvider( this )*/
    }

    private setBubbleNpc2() {

        this.npc3.addComponent(new QuestNpc(this.npc3, {
            animEntity: GenesisData.instance().quest3.npc3Anim,
            bubbleOffset: new Vector3(0, 1, 0),
            indicatorPosition: new Vector3(0, 1.4, -0.1),
            indicatorScale: new Vector3(1.4, 1.2, 1.4)
        }))
        this.npc3.getComponent(QuestNpc).bubbleTalk.setTitle("Kit")
        this.npc3.getComponent(QuestIndicator).updateStatus(IndicatorState.EXCLAMATION)

        //Animation
        this.npc3.getComponent(QuestNpc).idleAnim()

        //Bubble
        const auxOffsetText = { x: -1, y: 0 }
        this.npc3.getComponent(QuestNpc).bubbleTalk.setOffsetText(auxOffsetText)
        this.npc3.getComponent(QuestNpc).bubbleTalk.setBubbleMaxScale(3)

        //Targeter
        GenesisData.instance().targeterNpc3 = new ObjectiveTarget({ position: new Vector3(8, -10, 8), scale: new Vector3(0.75, 0.75, 0.75) });
        GenesisData.instance().targeterNpc3.show(true);
        GenesisData.instance().targeterNpc3.translate(getWorldPositionByPolygonal(this.npc3Anim).add(new Vector3(0, 0.1, 0)))
        GenesisData.instance().targeterNpc3.showArrow(false);

    }
    private setUpTriggerHi() {
        let triggerHi = new Entity()
        triggerHi.addComponent(new Transform({ position: this.npc3.getComponent(Transform).position.clone() }))
        triggerHi.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(15, 5, 15)), {
            onCameraEnter: () => {
                triggerHi.getComponent(utils.TriggerComponent).onCameraEnter = null
                triggerHi.getComponent(utils.TriggerComponent).onCameraExit = null

                AudioManager.instance().playOnce("npc_3_salute", { volume: 1, pitch: 1, parent: this.npc3 })
                this.npc3.getComponent(QuestNpc).hiAnim(() => {
                    this.npc3.getComponent(QuestNpc).idleAnim()
                })
                engine.removeEntity(triggerHi)
            },
            onCameraExit: () => {
                this.npc3.getComponent(QuestNpc).idleAnim()
            }
        }))
        engine.addEntity(triggerHi)
    }

    private setUpInitQuest() {
        getHUD().wgTalkNPC3.setSkipMode(SkipMode.Click)

        this.npc3.addComponentOrReplace(new OnPointerDown(() => {
            if (getHUD().wgTalkNPC1.visible || getHUD().wgTalkNPC2.visible) return
            this.npc3.removeComponent(OnPointerDown)

            //Stat
            sendTrak('z3_quest3_00')

            //Task 
            getHUD().wgQuest.showTick(0, true)
            getHUD().wgQuest.setOtherTaskDelay(9, 1),
                getHUD().wgQuest.show(true)

            //Indicator
            this.npc3.getComponent(QuestIndicator).hide()
            //Targeter
            GenesisData.instance().targeterNpc3.show(false);

            //Animation
            this.npc3.getComponent(QuestNpc).talkAnim()
            AudioManager.instance().playOnce("npc_3_salute", { volume: 0.7, pitch: 1, parent: this.npc3 })

            //2D UI
            getHUD().setWidgetDialogIndex(getHUD().wgTalkNPC3, 4)
            getHUD().wgTalkNPC3.show(true)


            getHUD().wgTalkNPC3.callback = () => {
                getHUD().wgTalkNPC3.callback = () => { }

                this.accetpQuest()
                this.cameraModeAngleCheck()
            }


        }, {
            hoverText: "Talk",
        }))
    }


    private accetpQuest() {

        this.addParticleEntity()
        //Activate Pieces
        this.connect_game.activatePieces()

        //2D UI
        getHUD().wgTalkNPC3.setSkipMode(SkipMode.ClickAndOnlyEndAuto)

        //Init bubble hint
        this.npc3.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.ZONE_2_PUZZLE_0)
        this.npc3.getComponent(QuestNpc).bubbleTalk.setActive(true)

        this.npc3.getComponent(QuestNpc).idleAnimFromTalk()

    }

    cameraModeAngleCheck(){
        if (CameraModeManager.instance().cameraMode == CameraMode.ThirdPerson) {
            getHUD().wgPopUpControls.showCameraModeImage(true)
            CameraModeManager.instance().addCallbackFirstPerson(() => {
                CameraModeManager.instance().removeAllCallbacks()
                getHUD().wgPopUpControls.showCameraModeImage(false)
                getHUD().wgPopUpControls.showCablesImage(true)
            })
        }
        else {
            getHUD().wgPopUpControls.showCablesImage(true)
        }

    }
    puzzleQuest() {
        if (this.connect_game.bStarted) return

        //Create puzzle game
        this.connect_game.startGame()

        //when finihs
        this.connect_game.completeEvent2PuzzleCallback = () => {
            //BLA fixed generator
            changeGeneratosSound()
            //Kit look player
            this.npc3.getComponent(Transform).lookAt(Camera.instance.worldPosition)
            //Stat
            sendTrak('z3_quest3_01')

            CameraModeManager.instance().removeAllCallbacks()
            this.npc3.getComponent(QuestNpc).bubbleTalk.setActive(false)
            delay(() => {
                getHUD().wgTalkNPC3.showToText(4)
                getHUD().wgPopUpControls.showCablesImage(false)
                this.taskTalkSwap()
                this.clicOnNPC2PuzzleCompleted()
                this.npc3.getComponent(QuestNpc).indicator.updateStatus(IndicatorState.INTERROGATION)
            }, 1000)

        }

    }
    private taskTalkSwap() {
        getHUD().wgQuest.showTick(0, true)
        getHUD().wgQuest.setOtherTaskDelay(10, 1)
        getHUD().wgQuest.show(true)
    }
    private clicOnNPC2PuzzleCompleted() {

        this.npc3.addComponentOrReplace(new OnPointerDown(() => {
            this.npc3.removeComponent(OnPointerDown)
            this.spawnparticles(true)

            //Stat
            sendTrak('z3_quest3_02')

            //Interrogation off
            this.npc3.getComponent(QuestNpc).indicator.hide()

            //Animation
            this.npc3.getComponent(QuestNpc).celebrateAnim(() => {
                if (getHUD().wgTalkNPC3.container.visible) {
                    this.npc3.getComponent(QuestNpc).talkAnim()
                    return;
                }
                this.npc3.getComponent(QuestNpc).idleAnim()
            })

            //2D UI
            getHUD().wgTalkNPC3.showToText(5)
            AudioManager.instance().playOnce("npc_3_salute", { volume: 0.7, pitch: 1, parent: this.npc3 })

            getHUD().wgTalkNPC3.callback = () => {
                getHUD().wgTalkNPC3.callback = () => { }
                this.npc3.getComponent(QuestNpc).idleAnimFromTalk()

                //Pilar Anim
                AudioManager.instance().playTowerCharge(this.pilar4)
                this.pilar4.getComponent(StateMachine).playClip("Pillar_Anim", false, 3, false, () => {
                    AudioManager.instance().playTowerActivated(this.pilar4)
                    activatePillarSound4(this.pilar4)

                    //BLA PILLAR4
                    this.pilar4.getComponent(StateMachine).playClip("Pillar_ON", false, 0.5, false)

                    this.activeCables(true)
                })

                //Task Multiple UI
                getHUD().wgQuestMultiple.showTick(2)
                delay(() => {
                    getHUD().wgQuestMultiple.show(false)
                    getHUD().wgQuest.setPaddingY("-12%")
                }, 2)

                //Tasks Simple UI
                getHUD().wgQuest.showTick(0, true)
                getHUD().wgQuest.setOtherTaskDelay(11, 1)
                getHUD().wgQuest.show(true)

                //End Quest
                this.dialogQuestFinished()
                this.spawnparticles(false)
                this.removeParticleEntity()
                StateManager.instance().startState("PortalState")

            }
        }, {
            hoverText: "Talk",
        }))
    }


    private addParticleEntity() {
        if (!GenesisData.instance().particleGlowEntity.isAddedToEngine()) {
            engine.addEntity(GenesisData.instance().particleGlowEntity)
        }
    }

    private removeParticleEntity() {
        if (GenesisData.instance().particleGlowEntity && GenesisData.instance().particleGlowEntity.isAddedToEngine()) {
            engine.removeEntity(GenesisData.instance().particleGlowEntity)
        }
    }

    private spawnparticles(bActive: boolean) {

        if (bActive) {
            this.addParticleEntity()
            GenesisData.instance().particleGlowEntity.getComponent(Transform).position = getWorldPositionByPolygonal(this.npc3).add(new Vector3(0, 0.2, 0))
            GenesisData.instance().particleGlowEntity.getComponent(Transform).scale = Vector3.One().scale(2.5)
            GenesisData.instance().particleGlowEntity.getComponent(Transform).rotation = getWorldRotationByPolygonal(this.npc3)
            delay(() => {
                GenesisData.instance().particleGlowEntity.getComponent(GLTFShape).visible = false
            }, 1000)
        }

        GenesisData.instance().particleGlowEntity.getComponent(GLTFShape).visible = bActive

    }

    //Dialog End Quest
    private dialogQuestFinished() {

        
        Arrows.instance().flipArrows()

        this.npc3.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.GO_TO_PORTAL)
        this.npc3.getComponent(QuestNpc).bubbleTalk.setActive(true)

        this.npc3.addComponentOrReplace(new OnPointerDown(() => {
            this.npc3.removeComponent(OnPointerDown)
            //Dialog end quest
            getHUD().wgPopUp.show(false)

            //Bubble       
            this.npc3.getComponent(QuestNpc).bubbleTalk.setActive(false)

            getHUD().wgTalkNPC3.showToText(6)
            AudioManager.instance().playOnce("npc_3_salute", { volume: 0.7, pitch: 1, parent: this.npc3 })

            //Play talk animation
            this.npc3.getComponent(QuestNpc).talkAnim()

            //Set up Idle animation
            getHUD().wgTalkNPC3.callback = () => {

                //Clear callback
                getHUD().wgTalkNPC3.callback = () => { }

                //Animatio back to idle
                this.npc3.getComponent(QuestNpc).idleAnim()

                //Recursive Call
                this.dialogQuestFinished()
            }

        }, { hoverText: "Talk" }))
    }

    disableBubbleTalk() {
        this.npc3.getComponent(QuestNpc).bubbleTalk.setActive(false)
    }

    cleanUpClick() {
        this.npc3.removeComponent(OnPointerDown)
        GenesisData.instance().quest3.npc3.removeComponent(OnPointerDown)
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
