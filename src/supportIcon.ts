import * as ui from '@dcl/ui-scene-utils'

initGameSupportUI()

export function initGameSupportUI(){
    let healthIcon = new ui.SmallIcon('assets/ui/support/support_icon.png', -20, 10, 36, 36)
    
 

    let prompt = new ui.OkPrompt(
        'If you need more information click',
        () => {
            openExternalURL("https://intercom.decentraland.org/")
        },
        'Here',
        false
    )

    healthIcon.addComponent(new OnPointerDown(() => void{
        
        createPrompt(){
            log("createPrompt has been called")
            let dio = new ui.OkPrompt(
                'This is an Ok Prompt',
                () => {
                  log(`accepted`)
                },
                'Ok',
                true
              )
        }
        
    }))
}