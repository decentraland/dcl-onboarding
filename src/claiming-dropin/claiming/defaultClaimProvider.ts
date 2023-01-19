import { CONFIG } from "src/config"
import { ClaimCodes, DispenserPos } from "./claimTypes"
import { checkIfPlayerHasAnyWearableByUrn, ClaimTokenRequest, ClaimTokenResult, ClaimUI, HandleClaimTokenCallbacks } from "./loot"

export interface IClaimProvider {
    claimUI:ClaimUI|undefined
    claimCallbacks:HandleClaimTokenCallbacks
    claimTokenReady:boolean
    claimInformedPending:boolean 
    claimTokenResult:ClaimTokenResult|undefined
    hasReward:boolean 
    dispenserPos:DispenserPos
    showClaimPrompts:boolean
}
export async function doClaimSilent(claimProvider:IClaimProvider){
  doClaim(claimProvider,false)
}
export async function doClaim(claimProvider:IClaimProvider,showClaimPrompts:boolean){
  const METHOD_NAME ="doClaim"
  log(METHOD_NAME,"ENTRY",claimProvider,"showClaimPrompts",showClaimPrompts)
	const h = claimProvider.dispenserPos
  
  //flag if we want UI popping up
  claimProvider.showClaimPrompts = showClaimPrompts

                    const claimUI = claimProvider.claimUI
                    //help with message, know if out of stock or wait till next day
                    //claimUI.campaignSchedule = dispenserSchedule
                    log(METHOD_NAME,'get item clicked')
                    if(claimUI && claimUI.lastUI && claimUI.lastUI.background.visible){
                        log(METHOD_NAME,"prevent clicking till modal closed claim")    
                        return;
                    }
                     
                    log(METHOD_NAME,"doing " , h.name,claimUI)
                    //show example of working directly with ClaimTokenRequest 

                    const hasWearable = claimUI.claimConfig?.wearableUrnsToCheck !== undefined ? await checkIfPlayerHasAnyWearableByUrn(
                        //ClaimConfig.campaign.dcl_artweek_px.wearableUrnsToCheck
                        claimUI.claimConfig?.wearableUrnsToCheck
                        //ClaimConfig.campaign.mvfw.wearableUrnsToCheck
                        ) : false
                    
                    
                    
                   
                    if(hasWearable){
                        const claimResult=new ClaimTokenResult()
                        claimResult.requestArgs = {...h.claimData}
                        claimResult.requestArgs.claimConfig = h.claimConfig
                        claimResult.claimCode = ClaimCodes.ALREADY_HAVE_IT
                        
                        //claimResult.claimCode = ClaimCodes.ALREADY_HAVE_IT
                        claimProvider.claimTokenReady = true
                        
                        if(!claimProvider.hasReward) claimProvider.hasReward = hasWearable

                        //giving it to giftbox when claiming now
                        claimProvider.claimTokenResult = claimResult

                        
                        claimUI.openYouHaveAlready(claimResult,claimProvider.claimCallbacks)
                    }else{
                        const claimReq = new ClaimTokenRequest( h.claimData )
                
                        //if(!this.claimUI.claimInformedPending){
                        if(claimProvider.showClaimPrompts){
                          claimProvider.claimUI.openClaimInProgress()
                          //claimProvider.claimUI.claimInformedPending = true
                        }
                        claimProvider.claimUI.claimInformedPending = true

                        log(METHOD_NAME,"claimReq.isCaptchaEnabled()",claimReq.isCaptchaEnabled(),"CONFIG.CLAIM_TESTING_ENABLED",CONFIG.CLAIM_TESTING_ENABLED)

                        
                        if(claimReq.isCaptchaEnabled()){
                          let server = claimReq.claimServer
                          
                          let captchaUUID=''
                          if(CONFIG.CLAIM_TESTING_CAPTCHA_ENABLED){
                            server = "local"
                            captchaUUID = "src/claiming-dropin/images/example-botdetect3-captcha-ancientmosaic.jpeg"
                          }else{
                            captchaUUID = await claimReq.getCaptcha()
                          }
                          claimReq.challengeAnswer = await claimUI.openCaptchaChallenge(server, captchaUUID)
                        }
                        const claimResult = await claimReq.claimToken()

                        log(METHOD_NAME,"claim result",claimResult.success)

                        claimUI.setClaimUIConfig( h.claimUIConfig )

                        
                        claimProvider.claimTokenReady = true
                        //giving it to giftbox when claiming now
                        claimProvider.claimTokenResult = claimResult

                        
                          if(claimProvider.claimUI.claimInformedPending){
                            claimProvider.claimUI.claimInformedPending = false
                          }
                          if(claimProvider.showClaimPrompts){
                            showClaimPrompt(claimProvider)
                          }else{
                            log(METHOD_NAME,"not showing claim prompt yet")
                          }
                    }

}
export function showClaimPrompt(claimProvider:IClaimProvider){
    const METHOD_NAME = "showClaimPrompt"
 
    log(METHOD_NAME,"ENTRY","this.claimTokenReady","this.claimInformedPending",claimProvider.claimInformedPending,claimProvider.claimTokenReady,"this.claimTokenResult",claimProvider.claimTokenResult)
    //const host = this
    
    //const pointerEnt = this.glassesCollider

    //enable just incase call back was still pending in intial claim
    claimProvider.showClaimPrompts = true
    if(claimProvider.claimTokenReady){
      
      //host.opened = true

      const claimSuccess = (claimProvider.claimTokenResult !== undefined) ? claimProvider.claimTokenResult.isClaimJsonSuccess() : false
      log(METHOD_NAME,'handleClaimJson success:' + claimSuccess,claimProvider.claimTokenResult)

      try{ 
        //320233-313689 
        //saving ~6k of polygons + some materials. remove once engine happy
        if(claimProvider.claimUI !== undefined && claimProvider.claimTokenResult !== undefined){
          if (claimSuccess){
            //if(this.glasses.alive) engine.removeEntity(this.glasses);

            //pointerEnt.removeComponent(OnPointerDown)
            claimProvider.hasReward = true
            //claimProvider.updateUIHasItemAlready()
          }
          //this.claimUI.openClaimInProgress()
          claimProvider.claimUI.handleClaimJson( claimProvider.claimTokenResult, claimProvider.claimCallbacks )
          
          //this.hide()
        }else{
          //show some basic message???
          log(METHOD_NAME,"ERROR claimUI or  claimTokenResult null unable to handle json" )
        } 
        //do after claim completes? // double check it from wearable server?
        // quest.makeProgress(QUEST_OPEN_PRESENT)
        //quest.complete(QUEST_OPEN_PRESENT)
        // updateProgression('w1')
      }catch(e){
        log(METHOD_NAME,"failed to complete quest " + e,e)
        //prevent infinite loop
        //host.removeComponent(utils.Delay)
        throw e;
      }
    }else if(claimProvider.claimUI !== undefined){
      log(METHOD_NAME,"still loading....")
      //still loading
      claimProvider.claimUI.openClaimInProgress()
      claimProvider.claimUI.claimInformedPending = true
      //host.addCompon
    }else{
      log(METHOD_NAME,"claimUI missing but not ready yet")
      //this.claimUI.claimInformedPending = true
    }
      //quest.close() 
  
}
