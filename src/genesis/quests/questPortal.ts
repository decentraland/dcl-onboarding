import { getHUD } from "src/hud";
import { TranslationEffectComponent } from "src/imports/components/translationEffect";
import { getEvents } from "src/imports/eventapi/checkApi";
import { PortalEvents } from "src/imports/eventapi/eventBoard";
import { GameData } from "src/imports/game.data";
import { delay, StateMachine } from "src/imports/index";
import { UserData } from "src/imports/user/user.data";
import { RobotNPC } from "../components/npcs/robotNpc";
import { POPUP_STATE } from "../ui/popupUI";
import * as bubbleText from "src/jsonData/textsTutorialBubble"
import { AudioManager } from "../components/audio/audio.manager";
import { sendTrak } from "../stats/segment";
import { TriggerComponent, TriggerSphereShape } from "@dcl/ecs-scene-utils";
import { ClaimTokenResult, ClaimUI, HandleClaimTokenCallbacks } from "src/claiming-dropin/claiming/loot";
import { DispenserPos } from "src/claiming-dropin/claiming/claimTypes";
import { doClaim, doClaimSilent, IClaimProvider, showClaimPrompt } from "src/claiming-dropin/claiming/defaultClaimProvider";
import { CONFIG } from "src/config";
import { initClaimProvider, lookupDispenerPosByCampId } from "src/modules/claiming/claimSetup";
import { ClaimConfig } from "src/claiming-dropin/claiming/loot-config";
import { activateInitialSoundPortal, activateLoopSoundPortal } from "../components/audio/sounds";

export class QuestPortal implements IClaimProvider{

    portal: Entity
    private static instanceRef: QuestPortal;

    buttonsPressed: number = 0
    allDeployButtonsPressed: boolean
    end_Scene: Entity
    tobor_portal: Entity
    fade: TranslationEffectComponent
    portal1: PortalEvents
    portal2: PortalEvents
    portal3: PortalEvents

    randomIndex: number[]
    eventpositions: IEntity[]
    refreshbuttons: Entity[]
    titleSpots: Entity[]

    //start claim code
    hasReward:boolean 
    dispenserPos:DispenserPos
    claimUI:ClaimUI|undefined
    claimCallbacks!:HandleClaimTokenCallbacks
    claimTokenReady:boolean = false
    claimInformedPending:boolean = false
    claimTokenResult:ClaimTokenResult|undefined
    showClaimPrompts:boolean = false
    //end claim code

    private constructor() { }
    public static instance(): QuestPortal { return this.instanceRef || (this.instanceRef = new this()); }


    public loadTagData() {


        this.portal = GameData.instance().getEntity("portal") as Entity
        this.tobor_portal = GameData.instance().getEntity("tobor_portal") as Entity
        this.eventpositions = GameData.instance().getEntityArray("event_portal")
        this.refreshbuttons = GameData.instance().getEntityArray("refresh_buttons") as Entity[]
        this.titleSpots = GameData.instance().getEntityArray("title_portal") as Entity[]

        //Hide Planeshapes
        this.eventpositions.forEach(e => {
            if (!e.getComponent(PlaneShape)) return
            e.getComponent(PlaneShape).visible = false
        });
    }

    public startQuestPortal() {
        this.robotToPortal()
        this.setUpClaim()
    }

    
    private setUpClaim(){
        this.dispenserPos = lookupDispenerPosByCampId( ClaimConfig.campaign.CAP.refId )
        initClaimProvider( this )
    }


    private robotToPortal() {
        //Robot adjust to portal
        GenesisData.instance().robotEntity.getComponent(Transform).position = this.tobor_portal.getComponent(Transform).position.clone()
        GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setPositon(this.tobor_portal.getComponent(Transform).position.clone())
        GenesisData.instance().robotEntity.getComponent(Transform).lookAt(Camera.instance.position)
        GenesisData.instance().robotEntity.getComponent(Transform).rotate(Vector3.Up(), 180)
        GenesisData.instance().robotEntity.getComponent(RobotNPC).lookAtTrigger()
        GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setTextWithDelay(bubbleText.OVERHERE)
        GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setActive(true)
        GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setBubbleDisapearDistance(29)
        GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setBubbleMaxScale(6)
        GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setBubbleMaxDistance(28)
        GenesisData.instance().robotEntity.getComponent(Animator).getClip("Robot_Idle").play()

        this.robotPortal()

        //this.ambienceTrigger()
    }

    private ambienceTrigger() {

        //Sound Trigger
        const soundTriggerEnt = new Entity()
        soundTriggerEnt.addComponent(new Transform({
            position: getWorldPositionByPolygonal(this.portal),
            scale: Vector3.One().scale(1)
        }))

        const triggerShape = new TriggerSphereShape(17, new Vector3(0, 0, 0))
        soundTriggerEnt.addComponent(new TriggerComponent(triggerShape,
            {
                onCameraEnter: () => {
                    AudioManager.instance().playPortalAmbience(false)
                },
                onCameraExit: () => {
                    AudioManager.instance().playMainAmbience(false)
                },
                enableDebug: false
            }
        ))

        engine.addEntity(soundTriggerEnt)

    }

    private robotPortal() {
        GenesisData.instance().robotEntity.addComponentOrReplace(new OnPointerDown(() => {
            //remove on click
            GenesisData.instance().robotEntity.removeComponent(OnPointerDown)

            //Stat
            sendTrak('z4_quest4_00')

            AudioManager.instance().playOnce("tobor_talk", { volume: 0.6, parent: GenesisData.instance().robotEntity })
            GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setActive(false)

            GenesisData.instance().robotEntity.getComponent(Animator).getClip("Talk").play()

            //Task
            getHUD().wgQuest.showTick(0, true)
            getHUD().wgQuest.setOtherTaskDelay(12, 1)
            getHUD().wgQuest.show(true)

            //Dialog
            getHUD().setWidgetDialogIndex(getHUD().wgTalkRobot, 5)
            getHUD().wgTalkRobot.showToText(0)
            getHUD().wgTalkRobot.show(true)

            getHUD().wgTalkRobot.callback = () => {
                //Robot Talk Animation
                GenesisData.instance().robotEntity.getComponent(Animator).getClip("Robot_Idle").play()
                //Show popup tobor cap reward
                this.givereward()
                this.portal.getComponent(StateMachine).playClip("Portal_Activate", false, 1.1, false, () => {

                    activateLoopSoundPortal()   
                })
                this.displayEvents()
                //Set portal ambience to 0
                if (AudioManager.instance().audio.portal_ambiental.audioSource.playing) {
                    AudioManager.instance().audio.portal_ambiental.setVolumeSmooth(0, 2000)
                }
                activateInitialSoundPortal()
                //AudioManager.instance().playOnce("tower_charge", { volume: 1, pitch: 0.3, parent: this.portal })
                GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setTextWithDelay(bubbleText.CHOOSE_PORTAL)

                GenesisData.instance().robotEntity.getComponent(RobotNPC).bubbleTalk.setActive(true)
                //Reset cb
                getHUD().wgTalkRobot.callback = () => { }
                
                this.setupFinalDialog();
            }


        }, { hoverText: "Talk" }
        ))
    }

    private resetClaim(){
        //clear previous reward attempt if exists
        this.claimTokenResult = undefined
    }

    givereward() {

        let usetWallet = UserData.instance().getWallet()

        //Give Reward Emote 
        AudioManager.instance().playPopupOpen()
        if (usetWallet != null || usetWallet != undefined) {
            //Set up popup with reward
            getHUD().wgPopUp.popUpMode(POPUP_STATE.OneButton)
            getHUD().wgPopUp.setText(CHAPTER4)
            //********************************************************************************************************************
            //**                DISPENSER OF WEREABLES GOES HERE.  THIS IS WHERE THE PLAYER GETS THE REWARD.                    **
            //******************************************************************************************************************** 
            if(!CONFIG.CLAIM_CAPTCHA_ENABLED){
                const showUIHere_NO = false //will be shown when claim is clicked
                doClaim(this,showUIHere_NO)
            }else{
                //claim part of the click get reward button getHUD().wgPopUp.rightButtonClic 
            }
        } else {
            //Set up popup with disclaimer
            getHUD().wgPopUp.popUpMode(POPUP_STATE.TwoButtons)
            getHUD().wgPopUp.setText(CHAPTER4)
            getHUD().wgPopUp.setText(DISCLAIMTEXT)
        }

        //clear previous reward attempt if exists
        this.resetClaim()

        //Chapter Accept
        getHUD().wgPopUp.rightButtonClic = () => {
            this.onCloseRewardUI()

            if (usetWallet != null || usetWallet != undefined) {
                if(CONFIG.CLAIM_CAPTCHA_ENABLED){
                    const showUIHere_NO = false //will be shown when claim is clicked
                    doClaim(this,showUIHere_NO)
                }

                showClaimPrompt(this)//show claim UI result here
            }
        }
    }

    private onCloseRewardUI() {
        getHUD().wgPopUp.rightButtonClic = () => { }
        getHUD().wgPopUp.leftButtonClic = () => { }
    }

    async displayEvents() {
        const event = await getEvents("https://events.decentraland.org/api/events/?limit=10")
        const places = await getEvents("https://places.decentraland.org/api/places/?limit=10")
        const genesisPlazas = await getEvents("https://events.decentraland.org/api/events/?limit=0") //force error to show genesis plazas


        this.randomIndex = randomNumbers(event.length)
        if (event) {
            this.portal1 = new PortalEvents(this.eventpositions[0], event, this.titleSpots[1])
            this.portal1.displayEvent(this.portal1.events, this.randomIndex[0])

            this.portal2 = new PortalEvents(this.eventpositions[2], genesisPlazas, this.titleSpots[0])
            this.portal2.displayEvent(this.portal2.events, 0)

            this.portal3 = new PortalEvents(this.eventpositions[1], places, this.titleSpots[2])
            this.portal3.displayEvent(this.portal3.events, this.randomIndex[2])
        }

        this.refreshbuttons[0].addComponent(new OnPointerDown(() => {
            this.randomIndex = randomNumbers(event.length)
            this.portal3.displayEvent(this.portal3.events, this.randomIndex[0])
            AudioManager.instance().playOnce("button_interact", { volume: 0.5, pitch: 1, parent: this.refreshbuttons[1] })
        }, { hoverText: "Refresh" }
        ))

        this.refreshbuttons[1].addComponent(new OnPointerDown(() => {
            this.randomIndex = randomNumbers(event.length)
            this.portal1.displayEvent(this.portal1.events, this.randomIndex[2])
            AudioManager.instance().playOnce("button_interact", { volume: 0.5, pitch: 1, parent: this.refreshbuttons[0] })
        }, { hoverText: "Refresh" }
        ))

        delay(() => {
            //Show Planeshapes
            this.eventpositions.forEach(e => {
                if (!e.getComponent(PlaneShape)) return
                e.getComponent(PlaneShape).visible = true
            });
            this.portal1.clickPanel.getComponent(BoxShape).visible = true
            this.portal2.clickPanel.getComponent(BoxShape).visible = true
            this.portal3.clickPanel.getComponent(BoxShape).visible = true

        }, 6000)

    }

    private setupFinalDialog(){
        let robotNpc = GenesisData.instance().robotEntity;
        robotNpc.getComponent(RobotNPC).bubbleTalk.setTextWithDelay(bubbleText.CHOOSE_PORTAL)
        robotNpc.getComponent(RobotNPC).bubbleTalk.setActive(true)
        GenesisData.instance().robotEntity.getComponent(Animator).getClip("Robot_Idle").play()

        robotNpc.addComponentOrReplace(new OnPointerDown(() => {
            //this.tellPlayerToFindMat();
            robotNpc.removeComponent(OnPointerDown);

            if(!this.hasReward)
                this.remindPlayerOfReward();
            else
                this.tellPlayerToGoThroughPortal();

        },
        {
            hoverText: "Talk"
        }))
    }

    private remindPlayerOfReward(){
        let robotNpc = GenesisData.instance().robotEntity;
        getHUD().wgTalkRobot.showToText(4);

        AudioManager.instance().playOnce("tobor_talk", 
            { volume: 0.6, parent: GenesisData.instance().robotEntity });

        robotNpc.getComponent(Animator).getClip("Talk").play();
        robotNpc.getComponent(RobotNPC).bubbleTalk.setActive(false);
        getHUD().wgTalkRobot.callback = () => {
            this.setupFinalDialog();
            this.givereward();
        }
    }

    private tellPlayerToGoThroughPortal(){
        let robotNpc = GenesisData.instance().robotEntity;
        getHUD().wgTalkRobot.showToText(3);

        AudioManager.instance().playOnce("tobor_talk", 
            { volume: 0.6, parent: GenesisData.instance().robotEntity });

        robotNpc.getComponent(Animator).getClip("Talk").play();
        robotNpc.getComponent(RobotNPC).bubbleTalk.setActive(false);
        getHUD().wgTalkRobot.callback = () => {

            this.setupFinalDialog();
        }
    }
}

