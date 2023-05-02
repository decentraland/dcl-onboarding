import * as ui from '@dcl/ui-scene-utils'

initGameSupportUI()

export function initGameSupportUI(){


    let prompt = new ui.OkPrompt(
        'Ask for more informationts to the Decentraland support.',
        () => {
            openExternalURL("https://intercom.decentraland.org/")
        },
        'Bring me',
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