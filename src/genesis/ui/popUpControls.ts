import { delay, Widget } from "src/imports/index";

//Here are all the ui elements that appear at the bottom of the screen
export class popUpControls extends Widget {

    containerBig: UIContainerRect
    background: UIImage

    private wasdImage: UIImage
    private lookAroundImage: UIImage
    private takecontrolCameraImage: UIImage

    containerText: UIContainerRect;
    wasdImageTextContainer: UIContainerRect;
    wasdImageText: any;
    lookAroundImagetContainer: UIContainerRect;
    lookAroundImageText: UIText;
    takecontrolCameraImageContainer: UIContainerRect;
    takecontrolCameraImageText: UIText;

    emoteContainer: UIContainerRect;
    emoteImage: UIImage;
    emoteText: UIText;

    cameraModeContainer: UIContainerRect;
    cameraModeImage: UIImage;
    cameraModeText: UIText;

    spaceContainer: UIContainerRect;
    spaceImage: UIImage;
    spaceText: UIText;

    cablesContainer: UIContainerRect;
    cablesText: UIText;

    takecontrolCameraImageContainerBackground: UIContainerRect;

    constructor(parentUI: Widget | UIShape) {
        var parent: UIShape;

        //wg 
        if (parentUI as Widget) {
            parent = (parentUI as Widget).container
        }
        //UI DeCentraland
        else if (parentUI as UIShape) {
            parent = (parentUI as UIShape)
        }
        //Container Big
        var containerBig = new UIContainerRect(parent)
        containerBig.visible = true
        containerBig.vAlign = 'center'
        containerBig.hAlign = 'center'
        containerBig.width = 1550 * 0.4
        containerBig.height = 890 * 0.4
        containerBig.positionX = "0%"
        containerBig.positionY = "-11%" //deploy 14%
        containerBig.isPointerBlocker = true


        super(parentUI, containerBig)

        this.containerBig = containerBig


        //Background
        this.takecontrolCameraImageContainerBackground = new UIContainerRect(containerBig)
        this.takecontrolCameraImageContainerBackground.visible = true
        this.takecontrolCameraImageContainerBackground.hAlign = 'center'
        this.takecontrolCameraImageContainerBackground.vAlign = 'bottom'
        this.takecontrolCameraImageContainerBackground.width = 558 * 0.5
        this.takecontrolCameraImageContainerBackground.height = 200 * 0.5
        this.takecontrolCameraImageContainerBackground.positionX = "0%"
        this.takecontrolCameraImageContainerBackground.positionY = "-25%"
        this.takecontrolCameraImageContainerBackground.isPointerBlocker = false
        this.takecontrolCameraImageContainerBackground.color = Color4.Black()
        this.takecontrolCameraImageContainerBackground.opacity = 0.5

        this.wasdImageTextContainer = new UIContainerRect(containerBig)
        this.wasdImageTextContainer.visible = false
        this.wasdImageTextContainer.hAlign = 'center'
        this.wasdImageTextContainer.vAlign = 'bottom'
        this.wasdImageTextContainer.width = 558 * 0.5
        this.wasdImageTextContainer.height = 252 * 0.5
        this.wasdImageTextContainer.positionX = "0%"
        this.wasdImageTextContainer.positionY = "-25%"
        this.wasdImageTextContainer.isPointerBlocker = false

        this.wasdImage = new UIImage(this.wasdImageTextContainer, new Texture("assets/ui/UI_Walk Around.png"))
        this.wasdImage.sourceWidth = 558
        this.wasdImage.sourceHeight = 252
        this.wasdImage.width = this.wasdImage.sourceWidth * 0.5
        this.wasdImage.height = this.wasdImage.sourceHeight * 0.5
        this.wasdImage.hAlign = "center"
        this.wasdImage.vAlign = "bottom"
        this.wasdImage.positionX = "0%"
        this.wasdImage.positionY = "-13%"
        this.wasdImage.isPointerBlocker = true
        this.wasdImage.visible = true

        this.wasdImageText = new UIText(this.wasdImageTextContainer)
        this.wasdImageText.value = "Walk Around"
        this.wasdImageText.width = "100%"
        this.wasdImageText.height = "100%"
        this.wasdImageText.hAlign = "center"
        this.wasdImageText.vAlign = "bottom"
        this.wasdImageText.hTextAlign = "center"
        this.wasdImageText.vTextAlign = "center"
        this.wasdImageText.positionX = "20%"
        this.wasdImageText.positionY = "-13%"
        this.wasdImageText.color = Color4.White()
        this.wasdImageText.fontSize = 16
        this.wasdImageText.textWrapping = false
        this.wasdImageText.visible = true
        this.wasdImageText.isPointerBlocker = false

        this.lookAroundImagetContainer = new UIContainerRect(containerBig)
        this.lookAroundImagetContainer.visible = false
        this.lookAroundImagetContainer.hAlign = 'center'
        this.lookAroundImagetContainer.vAlign = 'bottom'
        this.lookAroundImagetContainer.width = 558 * 0.5
        this.lookAroundImagetContainer.height = 252 * 0.5
        this.lookAroundImagetContainer.positionX = "-0%"
        this.lookAroundImagetContainer.positionY = "-25%"
        this.lookAroundImagetContainer.isPointerBlocker = false

        this.lookAroundImage = new UIImage(this.lookAroundImagetContainer, new Texture("assets/ui/UI_Look Around.png"))
        this.lookAroundImage.sourceWidth = 558
        this.lookAroundImage.sourceHeight = 252
        this.lookAroundImage.width = this.lookAroundImage.sourceWidth * 0.5
        this.lookAroundImage.height = this.lookAroundImage.sourceHeight * 0.5
        this.lookAroundImage.hAlign = "center"
        this.lookAroundImage.vAlign = "bottom"
        this.lookAroundImage.positionX = "0%"
        this.lookAroundImage.positionY = "-13%"
        this.lookAroundImage.isPointerBlocker = true
        this.lookAroundImage.visible = true
        this.lookAroundImage.opacity = 1

        this.lookAroundImageText = new UIText(this.lookAroundImagetContainer)
        this.lookAroundImageText.value = "Look at \n the spheres"
        this.lookAroundImageText.width = "100%"
        this.lookAroundImageText.height = "100%"
        this.lookAroundImageText.hAlign = "center"
        this.lookAroundImageText.vAlign = "bottom"
        this.lookAroundImageText.hTextAlign = "center"
        this.lookAroundImageText.vTextAlign = "center"
        this.lookAroundImageText.positionX = "20%"
        this.lookAroundImageText.positionY = "-13%"
        this.lookAroundImageText.color = Color4.White()
        this.lookAroundImageText.fontSize = 16
        this.lookAroundImageText.textWrapping = false
        this.lookAroundImageText.visible = true
        this.lookAroundImageText.isPointerBlocker = false
        this.lookAroundImageText.opacity = 1

        this.takecontrolCameraImageContainer = new UIContainerRect(containerBig)
        this.takecontrolCameraImageContainer.visible = true
        this.takecontrolCameraImageContainer.hAlign = 'center'
        this.takecontrolCameraImageContainer.vAlign = 'bottom'
        this.takecontrolCameraImageContainer.width = 520
        this.takecontrolCameraImageContainer.height = 258
        this.takecontrolCameraImageContainer.positionX = "0%"
        this.takecontrolCameraImageContainer.positionY = "-30%"
        this.takecontrolCameraImageContainer.isPointerBlocker = false

        this.takecontrolCameraImage = new UIImage(this.takecontrolCameraImageContainer, new Texture("assets/ui/UI_Control.png"))
        this.takecontrolCameraImage.sourceWidth = 520
        this.takecontrolCameraImage.sourceHeight = 258
        this.takecontrolCameraImage.width = this.takecontrolCameraImage.sourceWidth * 0.5
        this.takecontrolCameraImage.height = this.takecontrolCameraImage.sourceHeight * 0.5
        this.takecontrolCameraImage.hAlign = "center"
        this.takecontrolCameraImage.vAlign = "bottom"
        this.takecontrolCameraImage.positionX = "0%"
        this.takecontrolCameraImage.positionY = "0%"
        this.takecontrolCameraImage.isPointerBlocker = true
        this.takecontrolCameraImage.visible = true


        this.takecontrolCameraImageText = new UIText(this.takecontrolCameraImageContainer)
        this.takecontrolCameraImageText.value = ""
        this.takecontrolCameraImageText.width = "100%"
        this.takecontrolCameraImageText.height = "100%"
        this.takecontrolCameraImageText.hAlign = "center"
        this.takecontrolCameraImageText.vAlign = "bottom"
        this.takecontrolCameraImageText.hTextAlign = "center"
        this.takecontrolCameraImageText.vTextAlign = "center"
        this.takecontrolCameraImageText.positionX = "6%"
        this.takecontrolCameraImageText.positionY = "-26%"
        this.takecontrolCameraImageText.color = Color4.White()
        this.takecontrolCameraImageText.fontSize = 14
        this.takecontrolCameraImageText.textWrapping = false
        this.takecontrolCameraImageText.visible = true
        this.takecontrolCameraImageText.isPointerBlocker = false

        this.emoteContainer = new UIContainerRect(this.containerBig)
        this.emoteContainer.visible = false
        this.emoteContainer.hAlign = 'center'
        this.emoteContainer.vAlign = 'bottom'
        this.emoteContainer.width = 558
        this.emoteContainer.height = 252
        this.emoteContainer.positionX = "0%"
        this.emoteContainer.positionY = "-30%"
        this.emoteContainer.isPointerBlocker = false

        this.emoteImage = new UIImage(this.emoteContainer, new Texture("assets/ui/UI_B.png"))
        this.emoteImage.sourceWidth = 85
        this.emoteImage.sourceHeight = 86
        this.emoteImage.width = this.emoteImage.sourceWidth * 1
        this.emoteImage.height = this.emoteImage.sourceHeight * 1
        this.emoteImage.hAlign = "center"
        this.emoteImage.vAlign = "bottom"
        this.emoteImage.positionX = -75
        this.emoteImage.positionY = "7%"
        this.emoteImage.isPointerBlocker = false
        this.emoteImage.visible = true

        this.emoteText = new UIText(this.emoteContainer)
        this.emoteText.value = "Open emote menu\nand select a move"
        this.emoteText.width = "100%"
        this.emoteText.height = "100%"
        this.emoteText.hAlign = "center"
        this.emoteText.vAlign = "bottom"
        this.emoteText.hTextAlign = "center"
        this.emoteText.vTextAlign = "center"
        this.emoteText.positionX = "6%"
        this.emoteText.positionY = "-26%"
        this.emoteText.color = Color4.White()
        this.emoteText.fontSize = 14
        this.emoteText.textWrapping = false
        this.emoteText.visible = true
        this.emoteText.isPointerBlocker = false

        this.cameraModeContainer = new UIContainerRect(this.containerBig)
        this.cameraModeContainer.visible = false
        this.cameraModeContainer.hAlign = 'center'
        this.cameraModeContainer.vAlign = 'bottom'
        this.cameraModeContainer.width = 558
        this.cameraModeContainer.height = 252
        this.cameraModeContainer.positionX = "0%"
        this.cameraModeContainer.positionY = "-30%"
        this.cameraModeContainer.isPointerBlocker = false

        this.cameraModeImage = new UIImage(this.cameraModeContainer, new Texture("assets/ui/UI_V.png"))
        this.cameraModeImage.sourceWidth = 85
        this.cameraModeImage.sourceHeight = 86
        this.cameraModeImage.width = this.cameraModeImage.sourceWidth * 1
        this.cameraModeImage.height = this.cameraModeImage.sourceHeight * 1
        this.cameraModeImage.hAlign = "center"
        this.cameraModeImage.vAlign = "bottom"
        this.cameraModeImage.positionX = -75
        this.cameraModeImage.positionY = "7%"
        this.cameraModeImage.isPointerBlocker = false
        this.cameraModeImage.visible = true

        this.cameraModeText = new UIText(this.cameraModeContainer)
        this.cameraModeText.value = "Toggle camera to get\na closer look"
        this.cameraModeText.width = "100%"
        this.cameraModeText.height = "100%"
        this.cameraModeText.hAlign = "center"
        this.cameraModeText.vAlign = "bottom"
        this.cameraModeText.hTextAlign = "center"
        this.cameraModeText.vTextAlign = "center"
        this.cameraModeText.positionX = "6%"
        this.cameraModeText.positionY = "-26%"
        this.cameraModeText.color = Color4.White()
        this.cameraModeText.fontSize = 14
        this.cameraModeText.textWrapping = false
        this.cameraModeText.visible = true
        this.cameraModeText.isPointerBlocker = false

        this.spaceContainer = new UIContainerRect(this.containerBig)
        this.spaceContainer.visible = false
        this.spaceContainer.hAlign = 'center'
        this.spaceContainer.vAlign = 'bottom'
        this.spaceContainer.width = 558
        this.spaceContainer.height = 252
        this.spaceContainer.positionX = "0%"
        this.spaceContainer.positionY = "-29%"
        this.spaceContainer.isPointerBlocker = false

        this.spaceImage = new UIImage(this.spaceContainer, new Texture("assets/ui/UI_Space.png"))
        this.spaceImage.sourceWidth = 254
        this.spaceImage.sourceHeight = 104
        this.spaceImage.width = this.spaceImage.sourceWidth * 0.5
        this.spaceImage.height = this.spaceImage.sourceHeight * 0.5
        this.spaceImage.hAlign = "center"
        this.spaceImage.vAlign = "bottom"
        this.spaceImage.positionX = -50
        this.spaceImage.positionY = "14%"
        this.spaceImage.isPointerBlocker = false
        this.spaceImage.visible = true

        this.spaceText = new UIText(this.spaceContainer)
        this.spaceText.value = "Jump"
        this.spaceText.width = "100%"
        this.spaceText.height = "100%"
        this.spaceText.hAlign = "center"
        this.spaceText.vAlign = "bottom"
        this.spaceText.hTextAlign = "center"
        this.spaceText.vTextAlign = "center"
        this.spaceText.positionX = "12%"
        this.spaceText.positionY = "-26%"
        this.spaceText.color = Color4.White()
        this.spaceText.fontSize = 16
        this.spaceText.textWrapping = false
        this.spaceText.visible = true
        this.spaceText.isPointerBlocker = false


        this.cablesContainer = new UIContainerRect(this.containerBig)
        this.cablesContainer.visible = false
        this.cablesContainer.hAlign = 'center'
        this.cablesContainer.vAlign = 'bottom'
        this.cablesContainer.width = 558
        this.cablesContainer.height = 252
        this.cablesContainer.positionX = "0%"
        this.cablesContainer.positionY = "-30%"
        this.cablesContainer.isPointerBlocker = false

        this.cablesText = new UIText(this.cablesContainer)
        this.cablesText.value = "Connect the cables"
        this.cablesText.width = "100%"
        this.cablesText.height = "100%"
        this.cablesText.hAlign = "center"
        this.cablesText.vAlign = "bottom"
        this.cablesText.hTextAlign = "center"
        this.cablesText.vTextAlign = "center"
        this.cablesText.positionX = "0%"
        this.cablesText.positionY = "-25%"
        this.cablesText.color = Color4.White()
        this.cablesText.fontSize = 16
        this.cablesText.textWrapping = false
        this.cablesText.visible = true
        this.cablesText.isPointerBlocker = false

        this.show(false)

    }

    show(bVisible: boolean) {

        super.show(bVisible)
        this.containerBig.visible = bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible
        if (!bVisible) {
            this.hideAll()
        }
    }

    private hideAll() {
        this.takecontrolCameraImageContainer.visible = false
        this.lookAroundImagetContainer.visible = false
        this.wasdImageTextContainer.visible = false
        this.emoteContainer.visible = false
        this.cameraModeContainer.visible = false
        this.cablesContainer.visible = false
        this.spaceContainer.visible = false
    }

    showTakecontrolCameraImage(bVisible: boolean) {
        if (bVisible) {
            this.hideAll()
        }
        this.takecontrolCameraImageText.value = "Click to take control \nof the camera"
        this.containerBig.visible = bVisible
        this.takecontrolCameraImageContainer.visible = bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible
        delay(() => {
            this.containerBig.visible = !bVisible
            this.takecontrolCameraImageContainer.visible = !bVisible
            this.takecontrolCameraImageContainerBackground.visible = !bVisible
        }, 3000)

    }

    showLookAroundImage(bVisible: boolean) {
        if (bVisible) {
            this.hideAll()
        }
        this.containerBig.visible = bVisible
        this.takecontrolCameraImageContainer.visible = !bVisible
        this.lookAroundImagetContainer.visible = bVisible
        this.wasdImageTextContainer.visible = !bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible

    }

    showWasdImage(bVisible: boolean) {
        if (bVisible) {
            this.hideAll()
        }
        this.containerBig.visible = bVisible
        this.takecontrolCameraImageContainer.visible = !bVisible
        this.lookAroundImagetContainer.visible = !bVisible
        this.wasdImageTextContainer.visible = bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible

    }

    showEmoteImage(bVisible: boolean) {
        if (bVisible) {
            this.hideAll()
        }
        this.containerBig.visible = bVisible
        this.emoteContainer.visible = bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible

    }

    showCameraModeImage(bVisible: boolean) {
        if (bVisible) {
            this.hideAll()
        }
        this.containerBig.visible = bVisible
        this.cameraModeContainer.visible = bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible

    }

    showCablesImage(bVisible: boolean) {
        if (bVisible) {
            this.hideAll()
        }
        this.containerBig.visible = bVisible
        this.cablesContainer.visible = bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible

    }

    showSpaceImage(bVisible: boolean) {
        if (bVisible) {
            this.hideAll()
        }
        this.containerBig.visible = bVisible
        this.spaceContainer.visible = bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible

    }

    showClickInteractImage(bVisible: boolean) {
        if (bVisible) {
            this.hideAll()
        }
        this.takecontrolCameraImageText.value = "Click to interact"
        this.containerBig.visible = bVisible
        this.takecontrolCameraImageContainer.visible = bVisible
        this.takecontrolCameraImageContainerBackground.visible = bVisible
    }

    isVisible() {
        return this.containerBig.visible
    }
}