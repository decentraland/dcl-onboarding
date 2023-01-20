import * as ui from '@dcl/ui-scene-utils'
import { CONFIG, initConfig } from "src/config"
import { sharedClaimBgTexture } from "src/claiming-dropin/claiming/claimResources"
import { createDispeners } from "src/claiming-dropin/claiming/dispensers"
import { ClaimConfig, ClaimConfigInstType, initClaimConfig } from "src/claiming-dropin/claiming/loot-config"
import { campaignData, initCampaignData, initDispenserScheduler, startDispenserScheduler } from "src/claiming-dropin/claiming/schedule/scheduleSetup"
import { customResolveSourceImageSize } from "src/claiming-dropin/claiming/utils"
import { ClaimTokenResult, ClaimUI, HandleClaimTokenCallbacks } from "src/claiming-dropin/claiming/loot"
import { ClaimUiType, ItemData } from "src/claiming-dropin/claiming/claimTypes"
import { doClaim, IClaimProvider } from "src/claiming-dropin/claiming/defaultClaimProvider"

 
initConfig()

//SETUP DISPENERS AND SCHEDULE

//make changes/add more if you want here, otherwise will use what is in there
//MAKE SURE YOUR KEY IS IN THERE
function extendCampaignData(){ 
  
  //fetch or otherwise modify if needed here
   

}
 
export const claimCallbacks:HandleClaimTokenCallbacks = {
    onOpenUI:(type:ClaimUiType,claimResult?:ClaimTokenResult)=>{
        log("on open",type,claimResult)
    },
    
    onAcknowledge:(type:ClaimUiType,claimResult?:ClaimTokenResult)=>{
        log("on ack",type,claimResult)
        if(claimResult && claimResult.success){
            const data: ItemData = claimResult.json.data[0]

            /*if(
                testForPortableXP(data)
                || (CONFIG.CLAIM_TESTING_ENABLED && testForWearable(data,WearableEnum.PANTS_ADDRESS))
                ){
                openTutorialPrompt()
            }*/
        }
    },
    onCloseUI:(type:ClaimUiType,claimResult?:ClaimTokenResult)=>{
        log("on close",type,claimResult)

        const hasClaimConfig = claimResult && claimResult.requestArgs && claimResult.requestArgs.claimConfig
        /*switch(type){
            case ClaimUiType.YOU_ALREADY_HAVE_IT:
                if(
                    hasClaimConfig 
                    && ( claimResult?.requestArgs?.claimConfig?.refId == ClaimConfig.campaign.dcl_artweek_px.refId )
                    ){
                    openTutorialPrompt()
                }
            break;
        }*/
    },

    onRetry:(type:ClaimUiType,claimResult?:ClaimTokenResult)=>{
        log("on retry",type,claimResult)

       
    }
    
    /*
    onRetry?:(type:ClaimUiType,claimResult?:ClaimTokenResult)=>{
        doClaim()
    }*/
} 


export function initClaimProvider(claimProvider:IClaimProvider){
    log("initClaimProvider","ENTRY",claimProvider)
    
    claimProvider.claimUI = new ClaimUI(claimProvider.dispenserPos.claimUIConfig,claimProvider.dispenserPos.claimConfig)
    claimCallbacks.onRetry=(type:ClaimUiType,claimResult?:ClaimTokenResult)=>{
        log("on retry",type,claimResult)
        //reset values
        
        doClaim(claimProvider,true)
    }
    claimProvider.claimCallbacks = claimCallbacks
}

export function lookupDispenerPosByCampId(id:string){
    for(const d of CONFIG.DISPENSER_POSITIONS){
        if(d.name == id){
            return d 
        }
    }
    log("lookupDispenerPosByCampId","RETURN","FAILED TO FIND",id)
    return undefined
}

export function initDispenserPositions(){
    const camps:ClaimConfigInstType[] = [
        ClaimConfig.campaign.CAP,
        ClaimConfig.campaign.VEST,
        ClaimConfig.campaign.EMOTE
    ]
    let x=0
    for(const camp of camps){
        //const camp = 
        CONFIG.DISPENSER_POSITIONS.push(
        {   
            name:camp.refId, //clickable object
            model: 'boxshape' ,  //put model path when we have one
            claimConfig: camp,
            claimData:{claimServer: ClaimConfig.rewardsServer , campaign:camp.campaign,campaign_key:camp.campaignKeys.key1},
            dispenserUI:{
                boothModel:'src/claiming-dropin/models/poap/Wearable_Dispenser_WelcomeArea.glb',boothModelButton:'src/claiming-dropin/models/poap/Wearable_Button_WelcomeArea.glb'
                ,hoverText:"Claim Wearable" }, 
            wearableUrnsToCheck: camp.wearableUrnsToCheck,
            claimUIConfig: {bgTexture:sharedClaimBgTexture,claimServer:ClaimConfig.rewardsServer,resolveSourceImageSize:customResolveSourceImageSize,customPromptStyle:ui.PromptStyles.LIGHTLARGE},
            transform: {position:new Vector3( 225,69+x,125 ) ,rotation:Quaternion.Euler(0,0,0) }
        }
        )
        x++ 
    }
  
  
}


export function initSceneClaiming(){

  initClaimConfig()
  initCampaignData() 
  extendCampaignData()
  const dispenserScheduler = initDispenserScheduler()
  createDispeners(CONFIG.DISPENSER_POSITIONS, dispenserScheduler.campaignSchedule)
  startDispenserScheduler()

}
