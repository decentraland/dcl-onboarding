import { GameData } from "src/imports/game.data";
import * as utils from '@dcl/ecs-scene-utils'
import * as bubbleTalk from 'src/jsonData/textsTutorialBubble';
import { delay, SkipMode, StateMachine } from "src/imports/index";
import { QuestIndicator, IndicatorState } from "../components/npcs/questIndicator";
import { getHUD } from "src/hud";
import { getTextData } from "src/jsonData/textsData";
import { QuestNpc } from "../components/npcs/questNpc";
import { POPUP_STATE } from "../ui/popupUI";
import { AudioManager } from "../components/audio/audio.manager";
import { UserData } from "src/imports/user/user.data";
import { sendTrak } from "../stats/segment";
import { BubbleTalk } from "src/imports/components/bubbleTalk";
import { initClaimProvider, lookupDispenerPosByCampId } from "src/modules/claiming/claimSetup";
import { ClaimConfig } from "src/claiming-dropin/claiming/loot-config";
import { doClaim, doClaimSilent, IClaimProvider, showClaimPrompt } from "src/claiming-dropin/claiming/defaultClaimProvider";
import { DispenserPos } from "src/claiming-dropin/claiming/claimTypes";
import { ClaimTokenResult, ClaimUI, HandleClaimTokenCallbacks } from "src/claiming-dropin/claiming/loot";
import { CONFIG } from "src/config";
import { activateSoundPillar3 } from "../components/audio/sounds";
import { QuestPuzzle } from "./questPuzzle";
import {s0_Z3_Prop_Stairs02_Art_3__01, s0_Z3_Prop_Stairs02_Art_4__01, s0_Z3_Prop_Stairs02_Art_5__01, s0_Z3_Prop_Stairs03_Art_01, s0_Z3_Prop_Stairs03_Art_16__01 } from "src/game";

//Quest collect matterials
export class QuestMaterials implements IClaimProvider {

    private static instanceRef: QuestMaterials;
    npc2Anim: Entity;
    pilarQmat: Entity;
    particle: Entity;
    public static instance(): QuestMaterials { return this.instanceRef || (this.instanceRef = new this()); }

    materialsCollected: number = 0
    npc2: Entity;
    bubbleTalk: BubbleTalk;
    quest3Started: boolean = false
    box_triangle: Entity;
    box_material: Entity;
    cable_off: Entity;
    cable_on: Entity;
    blocker: Entity;
    barrier_2: Entity
    //arrow: Entity
    //arrowsToFlip: Entity []


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


    debug: boolean = false
    private constructor() { }

    loadTagData() {

        this.npc2 = GameData.instance().getEntity("npc2") as Entity
        this.npc2Anim = GameData.instance().getEntity("npc2_anim") as Entity
        this.pilarQmat = GameData.instance().getEntity("pilar_3") as Entity
        this.box_triangle = GameData.instance().getEntity("box_triangle") as Entity
        this.box_material = GameData.instance().getEntity("box_material") as Entity
        this.cable_off = GameData.instance().getEntity("cables3_off") as Entity
        this.cable_on = GameData.instance().getEntity("cables3_on") as Entity
        this.barrier_2 = GameData.instance().getEntity("z2_barrier") as Entity
 
        this.box_triangle.getComponent(StateMachine).playClip("Box_01_Static", false, 0.5, true, () => { })

        this.barrier_2.addComponentOrReplace(new OnPointerDown(()=>{

        }
        ,{
            hoverText:'Talk to Mat Before Continuing'
        }
    ))

        this.activeCables(false)
        this.spawnparticles(false)
        this.spawnBlockToNextIsalnd()
        
    }

    private setUpTriggerHi() { 
        let triggerHi = new Entity()
        triggerHi.addComponent(new Transform({ position: this.npc2.getComponent(Transform).position.clone() }))
        triggerHi.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(15, 5, 15)), {
            onCameraEnter: () => {
                triggerHi.getComponent(utils.TriggerComponent).onCameraEnter = null
                triggerHi.getComponent(utils.TriggerComponent).onCameraExit = null
                AudioManager.instance().playOnce("npc_2_salute", { volume: 1, parent: this.npc2 })
                this.npc2.getComponent(QuestNpc).hiAnim(() => {
                    this.npc2.getComponent(QuestNpc).idleAnim()
                })
                engine.removeEntity(triggerHi)
            },
            onCameraExit: () => {
                this.npc2.getComponent(QuestNpc).idleAnim()
            }
        }))
        engine.addEntity(triggerHi)
    }

    public startQuest() {
        this.setBubbleNpc()
        this.setQuestStartDialog()
        this.setUpTriggerHi()
        this.setUpClaim()
        this.setUpArrows()
    }

    private setUpArrows(){

        const zOffsets = [-2.75, -1.5, -0.3, 0.9, 2.17, 3.41, 4.67, 5.9, 7.2, -2.75, -1.5, -0.3, 0.9, 2.17, 3.41, 4.67, 5.9, 7.2]
        const yOffsets = [-1.085, -0.77, -0.46, -0.13, 0.18, 0.6, 0.915, 1.35, 1.67, -1.05, -0.72, -0.4, -0.15, 0.178, 0.59, 0.9, 1.33, 1.65]
        Arrows.instance().createStairsArrows(s0_Z3_Prop_Stairs03_Art_01, yOffsets, zOffsets)
        

        const zOffsets2 = [0.32, 1.56, 2.75, 3.93, 5.2, 6.41, 7.67, 8.9, 10.2, 11.4, 12.7, 0.32, 1.56, 2.75, 3.93, 5.2, 6.41, 7.67, 8.9, 10.2, 11.4, 12.7]
        const yOffsets2 = [-0.23, 0.07, 0.37, 0.67, 0.97, 1.37, 1.685, 2.1, 2.44, 2.76, 3.08, -0.23, 0.07, 0.37, 0.67, 0.97, 1.37, 1.685, 2.52, 2.44, 2.76, 3.08] 
        Arrows.instance().createStairsArrows(s0_Z3_Prop_Stairs02_Art_3__01, yOffsets2, zOffsets2)


        const zOffsets3 = [0.32, 1.56, 2.75, 0.32, 1.56, 2.75]
        const yOffsets3 = [-0.23, 0.07, 0.37, -0.23, 0.07, 0.37] 
        Arrows.instance().createStairsArrows(s0_Z3_Prop_Stairs02_Art_4__01, yOffsets3, zOffsets3)

        
        Arrows.instance().createStairsArrows(s0_Z3_Prop_Stairs02_Art_5__01, yOffsets3, zOffsets3)





        let arrowsToFlipRef = []


    }
 

    private setUpClaim() {
        this.dispenserPos = lookupDispenerPosByCampId(ClaimConfig.campaign.VEST.refId)
        initClaimProvider(this)
    }

    private spawnBlockToNextIsalnd() {
        this.blocker = new Entity("Blocker")
        this.blocker.addComponent(new Transform({ position: new Vector3(149.93, 72.45, 156.78), scale: new Vector3(3, 5, 9) }))
        this.blocker.addComponent(new BoxShape).isPointerBlocker = false
        this.blocker.addComponent(MaterialPool.instance().getTotalTransMaterial())
        engine.addEntity(this.blocker)
    }

    private deleteBlocker() {
        engine.removeEntity(this.blocker)
    
        //Remove barrier
        this.barrier_2.getComponent(GLTFShape).visible = false
        this.barrier_2.getComponent(GLTFShape).withCollisions = false
        this.barrier_2.getComponent(Transform).position = new Vector3(0, 0, 0)
        this.barrier_2.getComponent(Transform).scale = new Vector3(0,0,0) 

    }

    private setBubbleNpc() {
        this.npc2.addComponent(new QuestNpc(this.npc2, {
            animEntity: this.npc2Anim,
            bubbleOffset: new Vector3(0, 1.1, 0),
            indicatorPosition: new Vector3(0, 1.5, -0.1),
            indicatorScale: new Vector3(1.4, 1.2, 1.4)
        }))
        this.npc2.getComponent(QuestNpc).bubbleTalk.setTitle("Mat")
        this.npc2.getComponent(QuestNpc).indicator.updateStatus(IndicatorState.EXCLAMATION)
        this.bubbleTalk = this.npc2.getComponent(QuestNpc).bubbleTalk

        //Idle anim
        this.npc2.getComponent(QuestNpc).idleAnim()

        //Bubble
        const auxOffsetText = { x: -1, y: 0 }
        this.npc2.getComponent(QuestNpc).bubbleTalk.setOffsetText(auxOffsetText)
        this.bubbleTalk.setBubbleMaxScale(1.8)
        //Targeter
        GenesisData.instance().targeterNpc2 = new ObjectiveTarget({ position: new Vector3(0, 0, 0), scale: new Vector3(1, 1, 1) });
        GenesisData.instance().targeterNpc2.show(true);
        GenesisData.instance().targeterNpc2.translate(getWorldPositionByPolygonal(this.npc2Anim).add(new Vector3(0, 0.1, 0)))
        GenesisData.instance().targeterNpc2.showArrow(false);

    }

    private setQuestStartDialog() {
        getHUD().wgTalkNPC2.setSkipMode(SkipMode.Click)
        this.npc2.addComponent(new OnPointerDown(() => {

            if (getHUD().wgTalkNPC1.visible || getHUD().wgTalkNPC3.visible) return
            this.npc2.removeComponent(OnPointerDown)

            //Stat
            sendTrak('z2_quest2_00')

            getHUD().wgQuest.showTick(0, true)

            //2D UI
            getHUD().setWidgetDialogIndex(getHUD().wgTalkNPC2, 3)
            getHUD().wgTalkNPC2.showToText(0)
            getHUD().wgTalkNPC2.show(true)

            //Animation
            this.npc2.getComponent(QuestNpc).talkAnim()

            AudioManager.instance().playOnce("npc_2_salute", { volume: 0.7, parent: this.npc2 })

            //Confirm by 2D UI
            this.accetpQuest()

        }, {
            hoverText: "Talk",

        }))
    }

    private accetpQuest() {

        this.addParticleEntity()

        //Targeter
        GenesisData.instance().targeterNpc2.show(false)
        GenesisData.instance().targeterNpc2.translate(getWorldPositionByPolygonal(this.box_triangle))
        GenesisData.instance().targeterNpc2.arrowEntity.getComponent(Transform).scale.setAll(0.8)
        GenesisData.instance().targeterNpc2.showArrow(true);

        GenesisData.instance().targeterRobot.show(false);
        GenesisData.instance().targeterRobot.translate(getWorldPositionByPolygonal(this.box_material))
        GenesisData.instance().targeterRobot.arrowEntity.getComponent(Transform).scale.setAll(0.8)
        GenesisData.instance().targeterRobot.showArrow(true);

        //UI
        getHUD().wgTalkNPC2.setSkipMode(SkipMode.ClickAndOnlyEndAuto)
        //Next dialog

        //Task swap
        getHUD().wgQuest.setOtherTaskDelay(6, 1)
        getHUD().wgQuest.show(true)

        //Indicator
        this.npc2.getComponent(QuestIndicator).hide()

        //At end of dialog
        getHUD().wgTalkNPC2.callback = () => {
            //Clean callback
            getHUD().wgTalkNPC2.callback = () => { }
            //Init bubble hint
            this.npc2.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.ZONE_3_COLLECT_0)
            this.npc2.getComponent(QuestNpc).bubbleTalk.setActive(true)
            this.npc2.getComponent(QuestNpc).idleAnim()
            //Create OnpointerDowns on boxes
            this.startQuestCollectMaterials()

        }

    }


    startQuestCollectMaterials() {
        //Start Quest 3 if not started
        if (this.quest3Started == false) {
            this.quest3Started = true
            this.onclickMaterial()
            this.onclickTriangles()
        }
    }

    onclickMaterial() {
        this.box_material.addComponent(new OnPointerDown(() => {

            this.box_material.removeComponent(OnPointerDown)

            //Targeter
            GenesisData.instance().targeterRobot.show(false);

            //Pick up Animation
            if (!this.box_material?.hasComponent(StateMachine)) {
                DebugAccess.instance().log("box_material not found, or no state machine. Skip animation", LogType.ERROR)
                return;
            }
            AudioManager.instance().playOnce("pickup_box", { volume: 0.8, parent: this.box_material })

            this.box_material.getComponent(StateMachine).playClip("Box_02_Anim", false, 2, false, () => {
                //GLTF
                this.box_material.getComponent(GLTFShape).visible = false
                engine.removeEntity(this.box_material)
            })

            this.pickPiece()

        }, {
            hoverText: "Grab",
            button: ActionButton.PRIMARY
        }
        ))
    }

    onclickTriangles() {
        this.box_triangle.addComponent(new OnPointerDown(() => {
            this.box_triangle.removeComponent(OnPointerDown)

            //Targeter
            GenesisData.instance().targeterNpc2.show(false);

            //Pick up Animation
            if (!this.box_triangle?.hasComponent(StateMachine)) {
                DebugAccess.instance().log("box_triangle not found, or no state machine. Skip animation", LogType.ERROR)
                return;
            }
            AudioManager.instance().playOnce("pickup_box", { volume: 0.8, parent: this.box_triangle })

            //Animation swap
            this.box_triangle.getComponent(StateMachine).pauseClip("Box_01_Static")
            this.box_triangle.getComponent(StateMachine).playClip("Box_01_Anim", true, 2, false, () => {
                //GLTF
                this.box_triangle.getComponent(GLTFShape).visible = false
                engine.removeEntity(this.box_triangle)

            })

            this.pickPiece()

        }, {
            hoverText: "Grab",
            button: ActionButton.PRIMARY
        }
        ))
    }
    private pickPiece() {
        this.materialsCollected++
        if (this.materialsCollected == 2) {
            //Stat
            sendTrak('z2_quest2_02')

            this.pickedAllPieces()
            this.bubbleTalk.setActive(false)
            getHUD().wgTalkNPC2.showToText(5)

        } else {
            //Stat
            sendTrak('z2_quest2_01')

            //Open Mat dialog 2 
            getHUD().wgTalkNPC2.showToText(4)

        }
    }
    private pickedAllPieces() {

        //INDICATOR
        this.npc2.getComponent(QuestNpc).indicator.updateStatus(IndicatorState.INTERROGATION)

        //Tasks
        getHUD().wgQuest.showTick(0, true)
        //Task swap
        getHUD().wgQuest.setOtherTaskDelay(7, 1)
        getHUD().wgQuest.show(true)

        this.deliverAllPiecesClick()

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
            GenesisData.instance().particleGlowEntity.getComponent(Transform).position = getWorldPositionByPolygonal(this.npc2).add(new Vector3(0, 0.4, 0.15))
            GenesisData.instance().particleGlowEntity.getComponent(Transform).scale = Vector3.One().scale(2.5)
            GenesisData.instance().particleGlowEntity.getComponent(Transform).rotation = getWorldRotationByPolygonal(this.npc2)
            GenesisData.instance().particleGlowEntity.getComponent(Transform).rotate(Vector3.Up(), 15)
            delay(() => {
                GenesisData.instance().particleGlowEntity.getComponent(GLTFShape).visible = false
            }, 1000)
        }

        GenesisData.instance().particleGlowEntity.getComponent(GLTFShape).visible = bActive

    }

    private deliverAllPiecesClick() {
        //Set clic post quest
        this.npc2.addComponentOrReplace(new OnPointerDown(() => {
            if (getHUD().wgTalkNPC1.visible || getHUD().wgTalkNPC3.visible) return
            //remove pointer
            this.npc2.removeComponent(OnPointerDown)

            //Stat
            sendTrak('z2_quest2_03')

            //Indicator off
            this.npc2.getComponent(QuestNpc).indicator.hide()
            //Bubble off
            this.bubbleTalk.setActive(false)

            this.talkNpcCompleteQuest()

        }, {
            hoverText: "Talk",
        }))
    }

    private talkNpcCompleteQuest() {
        //Spawn particles
        this.spawnparticles(true)

        AudioManager.instance().playOnce("npc_2_salute", { volume: 0.7, parent: this.npc2 })
        //2D Talk
        getHUD().wgTalkNPC2.showToText(6)
        //Anim
        this.npc2.getComponent(QuestNpc).celebrateAnim(() => {
            if (getHUD().wgTalkNPC2.container.visible) {
                this.npc2.getComponent(QuestNpc).talkAnim()
                return;
            }
            this.npc2.getComponent(QuestNpc).idleAnim()
        })

        getTextData(3, 8).callback = () => {
            this.npc2.getComponent(QuestNpc).idleAnimFromTalk()
            this.removeParticleEntity()
            //Complete quest
            GenesisData.instance().quest3.bCompleted = true
            getHUD().wgQuestMultiple.showTick(1)
            getHUD().wgQuest.showTick(0, true)
            //Task swap
            getHUD().wgQuest.setOtherTaskDelay(8, 1)
            getHUD().wgQuest.show(true)

            //despawn particles
            this.spawnparticles(false)

            this.giveReward()

            //Create puzzle
            QuestPuzzle.instance().puzzleQuest()
        }
    }

    private resetClaim() {
        //clear previous reward attempt if exists
        this.claimTokenResult = undefined
    }

    private giveReward() {


        let usetWallet = UserData.instance().getWallet()

        //Give Reward Emote 
        AudioManager.instance().playPopupOpen()
        if (usetWallet != null || usetWallet != undefined) {
            //Set up popup with reward
            getHUD().wgPopUp.popUpMode(POPUP_STATE.OneButton)
            getHUD().wgPopUp.setText(CHAPTER3)
            //********************************************************************************************************************
            //**                DISPENSER OF WEREABLES GOES HERE.  THIS IS WHERE THE PLAYER GETS THE REWARD.                    **
            //******************************************************************************************************************** 
            if (!CONFIG.CLAIM_CAPTCHA_ENABLED) {
                const showUIHere_NO = false //will be shown when claim is clicked
                doClaim(this, showUIHere_NO)
            } else {
                //claim part of the click get reward button getHUD().wgPopUp.rightButtonClic 
            }
        } else { 
            if(!CONFIG.CLAIM_NONWEB3_SHOW_DISCLAIMER.material){
                log("CONFIG.CLAIM_NONWEB3_ONLY_SHOW_DISCLAIMER_ONCE",CONFIG.CLAIM_NONWEB3_SHOW_DISCLAIMER, "skipping showing them DISCLAIMTEXT")
                this.onCloseRewardUI()
                return
            }
            //Set up popup with disclaimer
            getHUD().wgPopUp.popUpMode(POPUP_STATE.TwoButtons)
            getHUD().wgPopUp.setText(CHAPTER3)
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

            this.firstTimeClosingRewardUI = false
        }

        this.afterEndQuestClick()
        StateManager.instance().startState("IslandQuest3State")

        //need this as onfocus listerner has been removed
        getHUD().wgPopUpControls.showTakecontrolCameraImage(true,3000,true)
        getHUD().wgPopUpControls.takecontrolCameraImageContainerBackground.visible = true

    }

    private activatePilar() {

        //Swap pillar material
        AudioManager.instance().playTowerCharge(this.pilarQmat)
        this.pilarQmat.getComponent(StateMachine).playClip("Pillar_Anim", false, 3, false, () => {
            AudioManager.instance().playTowerActivated(this.pilarQmat)
            activateSoundPillar3(this.pilarQmat)
            //BLA PILLAR3
            this.pilarQmat.getComponent(StateMachine).playClip("Pillar_ON", false, 0.5, false)

            //Cable on
            this.activeCables(true)
        })
        //Remove blocker to next island
        this.deleteBlocker()

        //ABC
        //this.setUpArrows()
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

    private afterEndQuestClick() {

        this.npc2.getComponent(QuestNpc).bubbleTalk.setTextWithDelay(bubbleTalk.HELP_KIT)
        this.npc2.getComponent(QuestNpc).bubbleTalk.setActive(true)

        this.npc2.addComponentOrReplace(new OnPointerDown(() => {
            if (getHUD().wgTalkNPC1.visible || getHUD().wgTalkNPC3.visible) return
            this.npc2.removeComponent(OnPointerDown)

            if (!this.hasReward)
                this.playerForgotRewardDialog()
            else
                this.dialogEndQuest()

        }, {
            hoverText: "Talk",
        }))
    }

    private playerForgotRewardDialog() {
        //Anim
        this.npc2.getComponent(QuestNpc).talkAnim()

        //Dialog if all quest completed
        getHUD().wgTalkNPC2.showToText(10)
        AudioManager.instance().playOnce("npc_2_salute", { volume: 0.7, parent: this.npc2 })

        this.bubbleTalk.setActive(false)

        getHUD().wgTalkNPC2.callback = () => {
            this.npc2.getComponent(QuestNpc).idleAnimFromTalk()
            this.afterEndQuestClick()
            this.giveReward()
        }
    }

    private dialogEndQuest() {
        //Anim
        this.npc2.getComponent(QuestNpc).talkAnim()

        //Dialog if all quest completed
        getHUD().wgTalkNPC2.showToText(9)
        AudioManager.instance().playOnce("npc_2_salute", { volume: 0.7, parent: this.npc2 })

        this.bubbleTalk.setActive(false)

        getHUD().wgTalkNPC2.callback = () => {

            this.npc2.getComponent(QuestNpc).idleAnimFromTalk()
            this.afterEndQuestClick()
        }
    }
}
