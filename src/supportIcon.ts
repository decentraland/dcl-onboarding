import * as ui from '@dcl/ui-scene-utils'


export type SupportConfig={
    iconPath:string
    destinationUrl?:string | undefined
    promptDescription:string
    promptButtonText:string
    hAllign: "left" | "center" | "right"
    vAllign: "top" | "center" | "bottom"
    positionX: number
    positionY: number
    width: number 
    height: number
}
 

export function initGameSupportUI(support: SupportConfig){
    let prompt = new ui.OkPrompt(
        support.promptDescription,
        () => {
            openExternalURL(support.destinationUrl)
        },
        support.promptButtonText,
        false
    )
    prompt.hide()

    let open = false
    const clickableImage = new UIImage(prompt.canvas, new Texture('assets/ui/support/support_icon.png'))
    clickableImage.hAlign = "left"
    clickableImage.vAlign = "top"
    clickableImage.width = 34
    clickableImage.height = 34
    clickableImage.positionX = 163
    clickableImage.positionY = 25
    clickableImage.sourceWidth = 36
    clickableImage.sourceHeight = 36
    clickableImage.isPointerBlocker = true
    clickableImage.onClick = new OnPointerDown(() => {
        if(open){
            open = false
            prompt.hide()
        }else{
            open = true
            prompt.show()
        }
    })
}