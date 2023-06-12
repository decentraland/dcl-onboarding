import { getHUD } from "src/hud";
import { GameData } from "src/imports/game.data";
import { clearDelay, delay, SkipMode, StateMachine } from "src/imports/index";
import { AudioManager } from "../components/audio/audio.manager";
import { QuestNpc } from "../components/npcs/questNpc";
import { QuestIndicator, IndicatorState } from "../components/npcs/questIndicator";
import * as utils from '@dcl/ecs-scene-utils'
import * as bubbleTalk from 'src/jsonData/textsTutorialBubble';
import { POPUP_STATE } from "../ui/popupUI";
import { UserData } from "src/imports/user/user.data";
import { sendTrak } from "../stats/segment";
import { DispenserPos } from "src/claiming-dropin/claiming/claimTypes";
import { ClaimTokenResult, ClaimUI, HandleClaimTokenCallbacks } from "src/claiming-dropin/claiming/loot";
import { initClaimProvider, lookupDispenerPosByCampId } from "src/modules/claiming/claimSetup";
import { ClaimConfig } from "src/claiming-dropin/claiming/loot-config";
import { doClaim, doClaimSilent, IClaimProvider, showClaimPrompt } from "src/claiming-dropin/claiming/defaultClaimProvider";
import { CONFIG } from "src/config";
import { activateSoundPillar2 } from "../components/audio/sounds";
import { foxBezier } from "src/compass";

export class QuestEmote implements IClaimProvider {

    private static instanceRef: QuestEmote;
    particle: Entity;
    public static instance(): QuestEmote { return this.instanceRef || (this.instanceRef = new this()); }

    npc1: IEntity
    npc1Anim: Entity
    npc1PlazaPosition: Vector3
    pilar_2: Entity
    cable_off: Entity;
    cable_on: Entity;

    emoteZone: Entity
    emotesMoves: number = 0
    tick1: Entity
    tick2: Entity
    tick3: Entity
    bridge_2: Entity
    arrow: Entity

    bnpc1isInPlaza: boolean = false

    firstTimeClosingRewardUI: boolean = true

    //start claim code
    hasReward: boolean
    dispenserPos: DispenserPos
    claimUI: ClaimUI | undefined
    claimCallbacks!: HandleClaimTokenCallbacks
    claimTokenReady: boolean = false
    claimInformedPending: boolean = false
    claimTokenResult: ClaimTokenResult | undefined
    showClaimPrompts: boolean = false
    //end claim code

    private showHintTimeout: any
    private readonly showHintDelayInSecs: number = 60 * 1

    private constructor() {
    }

    loadTagData() {

        this.npc1 = GameData.instance().getEntity("npc1")
        this.npc1Anim = GameData.instance().getEntity("npc1_anim") as Entity
        this.pilar_2 = GameData.instance().getEntity("pilar_2") as Entity
        this.emoteZone = GameData.instance().getEntity("emote_zone") as Entity
        this.tick1 = GameData.instance().getEntity("tick_1") as Entity
        this.tick2 = GameData.instance().getEntity("tick_2") as Entity
        this.tick3 = GameData.instance().getEntity("tick_3") as Entity
        this.bridge_2 = GameData.instance().getEntity("bridge_2") as Entity
        this.cable_off = GameData.instance().getEntity("cables2_off") as Entity
        this.cable_on = GameData.instance().getEntity("cables2_on") as Entity


        this.bridge_2.addComponentOrReplace(new OnPointerDown(()=>{

            }
            ,{
                hoverText:'Talk to Bezier Before Crossing'
            }
        ))

        GenesisData.instance().quest1.npc1 = this.npc1
        GenesisData.instance().quest1.npc1Anim = this.npc1Anim

        this.activeCables(false)
        this.initCheckPanel()
        this.createParticleEntity()
    }

    private initCheckPanel() {
        this.tick1.getComponent(GLTFShape).visible = false
        this.tick2.getComponent(GLTFShape).visible = false
        this.tick3.getComponent(GLTFShape).visible = false
    }

    private createParticleEntity() {
        if (!GenesisData.instance().particleGlowEntity) {
            GenesisData.instance().particleGlowEntity = new Entity()
            GenesisData.instance().particleGlowEntity.addComponent(new Transform({ position: getWorldPositionByPolygonal(this.npc1), scale: new Vector3(2.5, 2.5, 2.5), rotation: getWorldRotationByPolygonal(this.npc1) }))
            GenesisData.instance().particleGlowEntity.addComponent(new GLTFShape("assets/CheckParticles_Art.glb"))
            GenesisData.instance().particleGlowEntity.getComponent(GLTFShape).visible = false
            engine.addEntity(GenesisData.instance().particleGlowEntity)
        }
    }
    private removeParticleEntity() {
        if (GenesisData.instance().particleGlowEntity && GenesisData.instance().particleGlowEntity.isAddedToEngine()) {
            engine.removeEntity(GenesisData.instance().particleGlowEntity)
        }
    }

    private spawnparticles(bActive: boolean) {

        if (!GenesisData.instance().particleGlowEntity) {
            this.createParticleEntity()
        }

        if (bActive) {
            if (!GenesisData.instance().particleGlowEntity.isAddedToEngine()) {
                engine.addEntity(GenesisData.instance().particleGlowEntity)
            }
            GenesisData.instance().particleGlowEntity.getComponent(Transform).position = getWorldPositionByPolygonal(this.npc1).add(new Vector3(0, 0.5, 0))
            GenesisData.instance().particleGlowEntity.getComponent(Transform).scale = new Vector3(2.5, 2.5, 2.5)
            GenesisData.instance().particleGlowEntity.getComponent(Transform).rotation = getWorldRotationByPolygonal(this.npc1)
            GenesisData.instance().particleGlowEntity.getComponent(Transform).rotate(Vector3.Up(), 90)
            delay(() => {
                GenesisData.instance().particleGlowEntity.getComponent(GLTFShape).visible = false
            }, 1000)
        }

        GenesisData.instance().particleGlowEntity.getComponent(GLTFShape).visible = bActive
    }

    public startQuest1() {
        this.setUpNpc1()
        this.setupStartQuestClick()
        this.setUpTriggerHi()
        this.createParticleEntity()
        this.setUpClaim()
    }

    private setUpClaim() {
        this.dispenserPos = lookupDispenerPosByCampId(ClaimConfig.campaign.EMOTE.refId)
        initClaimProvider(this)
    }


    private setUpNpc1() {
        this.npc1.addComponent(new QuestNpc(GenesisData.instance().quest1.npc1, {
            animEntity: GenesisData.instance().quest1.npc1Anim,
            bubbleOffset: new Vector3(0, 1.1, 0),
            indicatorPosition: new Vector3(0, 1.2, 0),
            indicatorScale: new Vector3(1, 0.8, 1)
        }))

        //Bubble
        this.npc1.getComponent(QuestNpc).bubbleTalk.setTitle("Bezier")
        this.npc1.getComponent(QuestNpc).bubbleTalk.setBubbleMaxScale(3)
        const auxOffsetText = { x: -1, y: 0 }
        this.npc1.getComponent(QuestNpc).bubbleTalk.setOffsetText(auxOffsetText)
        this.npc1.getComponent(QuestIndicator).updateStatus(IndicatorState.EXCLAMATION)
        //Targeter
        GenesisData.instance().targeterNpc1 = new ObjectiveTarget({ position: new Vector3(8, -10, 8), scale: new Vector3(0.75, 0.75, 0.75) });
        GenesisData.instance().targeterNpc1.show(true);
        GenesisData.instance().targeterNpc1.translate(getWorldPositionByPolygonal(this.npc1Anim).add(new Vector3(0, 0.1, 0)))
        GenesisData.instance().targeterNpc1.showArrow(false);

        //Idle animation
        this.npc1.getComponent(QuestNpc).idleAnim()
    }

    private setUpTriggerHi() {
        let triggerHi = new Entity()
        triggerHi.addComponent(new Transform({ position: this.npc1.getComponent(Transform).position }))
        triggerHi.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(15, 5, 15)), {
            onCameraEnter: () => {

                triggerHi.getComponent(utils.TriggerComponent).onCameraEnter = null
                triggerHi.getComponent(utils.TriggerComponent).onCameraExit = null

                AudioManager.instance().playOnce("npc_1_salute", { volume: 1, parent: this.npc1 })
                this.npc1.getComponent(QuestNpc).hiAnim(() => {
                    this.npc1.getComponent(QuestNpc).idleAnim()
                })
                engine.removeEntity(triggerHi)
            },
            onCameraExit: () => {
                this.npc1.getComponent(QuestNpc).idleAnim()

            }
        }))
        engine.addEntity(triggerHi)
    }

    private setupStartQuestClick() {

        getHUD().wgTalkNPC1.show(false)

        this.npc1.addComponentOrReplace(new OnPointerDown(() => {
            if (getHUD().wgTalkNPC3.visible || getHUD().wgTalkNPC2.visible) return
            this.npc1.removeComponent(OnPointerDown)

            //Stat
            sendTrak('z1_quest1_00')

            //2D UI
            getHUD().wgTalkNPC1.setSkipMode(SkipMode.Click)
            getHUD().setWidgetDialogIndex(getHUD().wgTalkNPC1, 2)
            getHUD().wgTalkNPC1.showToText(0)

            //Animation
            this.npc1.getComponent(QuestNpc).talkAnim()
            //Audio
            AudioManager.instance().playOnce("npc_1_salute", { volume: 0.5, parent: this.npc1 })

            //Confirm by 2D UI
            this.accetpQuest()

        }, {
            hoverText: "Talk",
        }))
    }

    private accetpQuest() {
        //Targeter
        GenesisData.instance().targeterNpc1.show(false);

        //Indicator
        this.npc1.getComponent(QuestIndicator).hide()
        GenesisData.instance().targeterRobot.show(false)

        //Show UI task
        getHUD().wgQuest.showTick(0, true)
        getHUD().wgQuest.setOtherTaskDelay(4, 1)

        //Audio
        AudioManager.instance().playOnce("npc_1_salute", { volume: 0.5, parent: this.npc1 })

        //Wait to end last text
        getHUD().wgTalkNPC1.callback = () => {
            getHUD().wgTalkNPC1.callback = () => { }

            getHUD().wgTalkNPC1.show(false)
            getHUD().wgTalkNPC1.setSkipMode(SkipMode.ClickAndOnlyEndAuto)

            //Create emote zone
            this.createEmoteZone(true)

            //Init bubble hint
            this.showHintBubble(this.showHintDelayInSecs)

            this.npc1.getComponent(QuestNpc).idleAnimFromTalk()
        }

    }


    private createEmoteZone(bEnable: boolean) {

        if (bEnable) {
            if (!this.emoteZone) {
                DebugAccess.instance().log("EMOTE ZONE MISSING", LogType.ERROR)
                return;
            }
            let triggerBox = new utils.TriggerBoxShape(new Vector3(9, 4, 9))
            this.emoteZone.addComponentOrReplace(
                new utils.TriggerComponent(
                    triggerBox,
                    {
                        onCameraEnter: () => {
                            this.emoteZone.getComponent(utils.TriggerComponent).onCameraEnter = null
                            this.emoteZone.addComponentOrReplace(new CameraModeArea({ area: { box: new Vector3(9, 4, 9) }, cameraMode: CameraMode.ThirdPerson, }))
                            this.emoterChecker()
                        }
                    }
                )
            )
            engine.addEntity(this.emoteZone)
        }
        if (!bEnable) {
            engine.removeEntity(this.emoteZone)
        }
    }

    private showHintBubble(inSeconds = 0) {
        if (this.showHintTimeout) {
            clearDelay(this.showHintTimeout)
            this.showHintTimeout = null
        }
        if (inSeconds == 0) {
            this.npc1.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.ZONE_1_EMOTE_0)
            this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(true)
            return
        }
        this.showHintTimeout = delay(() => {
            this.npc1.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.ZONE_1_EMOTE_0)
            this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(true)
        }, inSeconds * 1000)
    }

    private emoterChecker() {
        getHUD().wgPopUpControls.showEmoteImage(true)
        onPlayerExpressionObservable.add(() => {
            this.emotesMoves++
            this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(false)

            if (this.emotesMoves == 1) {
                //Stat
                sendTrak('z1_quest1_01')

                this.showHintBubble(this.showHintDelayInSecs)
                this.tick1.getComponent(GLTFShape).visible = true
                this.npc1.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.ZONE_1_EMOTE_1)
                this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(true)
                this.npc1.getComponent(QuestNpc).bubbleTalk.closeBubbleInTime(4)
                this.spawnparticles(true)
                return;
            }
            if (this.emotesMoves == 2) {
                //Stat
                sendTrak('z1_quest1_02')

                this.showHintBubble(this.showHintDelayInSecs)
                this.tick2.getComponent(GLTFShape).visible = true
                this.npc1.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.ZONE_1_EMOTE_2)
                this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(true)
                this.npc1.getComponent(QuestNpc).bubbleTalk.closeBubbleInTime(4)
                this.spawnparticles(true)
                return;
            }
            if (this.emotesMoves == 3) {
                //Stat
                sendTrak('z1_quest1_03')

                this.tick3.getComponent(GLTFShape).visible = true
                this.npc1.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.ZONE_1_EMOTE_3)
                this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(true)
                //Remove hint timeout
                if (this.showHintTimeout) {
                    clearDelay(this.showHintTimeout)
                    this.showHintTimeout = null
                }
                this.spawnparticles(true)
                this.completeQuestDialog()

                getHUD().wgPopUpControls.showEmoteImage(false)

                engine.removeEntity(this.emoteZone)
                return;
            }
        })
    }

    private completeQuestDialog() {

        this.npc1.getComponent(QuestNpc).celebrateAnim(() => {
            this.npc1.removeComponent(OnPointerDown)

            this.npc1.getComponent(QuestNpc).idleAnim()
            this.spawnparticles(false)
            this.removeParticleEntity()

            //task
            getHUD().wgQuest.showTick(0, true)
            getHUD().wgQuest.setOtherTaskDelay(5, 1)


            delay(() => {
                //Bubble off
                this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(false)

                //Quest UI
                getHUD().wgQuestMultiple.showTick(0)

                //Talk animation
                this.npc1.getComponent(QuestNpc).talkAnim()

                //End quest dialog
                getHUD().wgTalkNPC1.showToText(3)

                //sound talk 
                AudioManager.instance().playOnce("npc_1_salute", { volume: 0.5, parent: this.npc1 })

                getHUD().wgTalkNPC1.callback = () => {
                    getHUD().wgTalkNPC1.callback = () => { }

                    this.npc1.getComponent(QuestNpc).idleAnimFromTalk()
                    //POP UP REWARD OR DISCLAIMER
                    this.giveReward()
                }

            }, 3000)
        })

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

    private resetClaim() {
        //clear previous reward attempt if exists
        this.claimTokenResult = undefined
    }

    private giveReward() {
        //Pilar Anim

        let usetWallet = UserData.instance().getWallet()

        //Give Reward Emote 
        AudioManager.instance().playPopupOpen()
        if (usetWallet != null || usetWallet != undefined) {
            //Set up popup with reward
            getHUD().wgPopUp.popUpMode(POPUP_STATE.OneButton)
            getHUD().wgPopUp.setText(CHAPTER2)
            //******************************************************************************************************************** 
            //**                DISPENSER OF EMOTE GOES HERE.  THIS IS WHERE THE PLAYER GETS THE REWARD.                    **
            //******************************************************************************************************************** 
            if (!CONFIG.CLAIM_CAPTCHA_ENABLED) {
                const showUIHere_NO = false //will be shown when claim is clicked
                doClaim(this, showUIHere_NO)
            } else {
                //claim part of the click get reward button getHUD().wgPopUp.rightButtonClic 
            }
        } else {
            if(!CONFIG.CLAIM_NONWEB3_SHOW_DISCLAIMER.emote){
                log("CONFIG.CLAIM_NONWEB3_SHOW_DISCLAIMER",CONFIG.CLAIM_NONWEB3_SHOW_DISCLAIMER, "skipping showing them DISCLAIMTEXT")
                this.onCloseRewardUI()
                return
            }
            //Set up popup with disclaimer
            getHUD().wgPopUp.popUpMode(POPUP_STATE.TwoButtons)
            getHUD().wgPopUp.setText(CHAPTER2)
            getHUD().wgPopUp.setText(DISCLAIMTEXT)
        }

        //clear previous reward attempt if exists
        this.resetClaim()

        //Chapter Accept
        getHUD().wgPopUp.rightButtonClic = () => {
            this.onCloseRewardUI()

            if (usetWallet != null || usetWallet != undefined) {
                if (CONFIG.CLAIM_CAPTCHA_ENABLED) {
                    const showUIHere_NO = false //will be shown when claim is clicked
                    doClaim(this, showUIHere_NO)
                }

                showClaimPrompt(this)//show claim UI result here
            }
        }
        getHUD().wgPopUp.leftButtonClic = () => {
            this.onCloseRewardUI()
        }

    }
    private onCloseRewardUI() {
        getHUD().wgPopUp.rightButtonClic = () => { }
        getHUD().wgPopUp.leftButtonClic = () => { }

        if(this.firstTimeClosingRewardUI){
            //Pilar Turn ON
            this.activatePilar()
            //Bridge Turn ON
            this.activateBridge()

            foxBezier.questCompleted = true

            this.firstTimeClosingRewardUI = false
        }

        this.dialogQuestFinished()
        StateManager.instance().startState("IslandQuest2State")

        //have an onFocusListener now, no need to call this here
        getHUD().wgPopUpControls.showTakecontrolCameraImage(true,3000)
        getHUD().wgPopUpControls.takecontrolCameraImageContainerBackground.visible = true

    }
    activatePilar() {
        AudioManager.instance().playTowerCharge(this.pilar_2)
        this.pilar_2.getComponent(StateMachine).playClip("Pillar_Anim", false, 3, false, () => {
            AudioManager.instance().playTowerActivated(this.pilar_2)
            activateSoundPillar2(this.pilar_2)
            //BLA PILLAR2
            this.pilar_2.getComponent(StateMachine).playClip("Pillar_ON", false, 0.5, false, () => {
                //Cable Turn ON
                this.activeCables(true)
            })
        })

    }
    activateBridge() {
        AudioManager.instance().playBridge(this.bridge_2)

        //remove onclick tooltip
        if(this.bridge_2.hasComponent(OnPointerDown)) this.bridge_2.removeComponent(OnPointerDown)
        
        this.bridge_2.getComponent(StateMachine).playClip("Bridge Animation", false, 3, false, () => {

            this.bridge_2.getComponent(StateMachine).playClip("Bridge On", false, 1, false, () => {


            }) 
        })
    }

    private dialogQuestFinished() {

        this.npc1.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.ZONE_1_EMOTE_4)
        this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(true)


        const xArrowsOffsets = [-2.3, -0.6, 0.7, 2.3, -2.3, -0.6, 0.7, 2.3]
        Arrows.instance().createBridgeArrows(this.bridge_2, false, xArrowsOffsets)
        

        this.npc1.addComponentOrReplace(new OnPointerDown(() => {

            //this.tellPlayerToFindMat();
            if (!this.hasReward)
                this.remindPlayerOfReward();
            else
                this.tellPlayerToFindMat();

        },
            {
                hoverText: "Talk"
            }))
    }

    private remindPlayerOfReward() {

        this.npc1.removeComponent(OnPointerDown)

        this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(false)

        getHUD().wgQuestMultiple.showTick(0);

        this.npc1.getComponent(QuestNpc).talkAnim();

        getHUD().wgTalkNPC1.showToText(10)

        AudioManager.instance().playOnce("npc_1_salute", { volume: .5, parent: this.npc1 });

        getHUD().wgTalkNPC1.callback = () => {
            getHUD().wgTalkNPC1.callback = () => { };
            //Recursive Call
            this.npc1.getComponent(QuestNpc).idleAnimFromTalk();

            this.giveReward()
        }
        
    }

    private tellPlayerToFindMat() { //Go to Next Island Dialog

        //reomove onpointerdown
        this.npc1.removeComponent(OnPointerDown)

        //Dialog end quest
        getHUD().wgPopUp.show(false)

        //Bubble Talk
        this.npc1.getComponent(QuestNpc).bubbleTalk.setActive(false)
        getHUD().wgTalkNPC1.showToText(6)
        AudioManager.instance().playOnce("npc_1_salute", { volume: 0.5, parent: this.npc1 })

        //Play talk animation
        this.npc1.getComponent(QuestNpc).talkAnim()

        getHUD().wgTalkNPC1.callback = () => {

            //Reset Callback
            getHUD().wgTalkNPC1.callback = () => { }

            //Animation back to idle
            this.npc1.getComponent(QuestNpc).idleAnimFromTalk()

            //Recursive Call
            this.dialogQuestFinished()
        }
    }

    cleanUpClick() {
        this.npc1.removeComponent(OnPointerDown)
        GenesisData.instance().quest1.npc1.removeComponent(OnPointerDown)
    }


}