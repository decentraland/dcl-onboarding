import { Widget } from "src/imports/index";


//In here are the popups for the wallet in case the player dosent have one 
export class popUpWallet extends Widget {

    containerBig: UIContainerRect
    background: UIImage

    private buttonRightImage: UIImage
    private buttonLeftImage: UIImage

    title: UIText
    textBox: UIText
    buttonRightText: UIText
    buttonLeftText: UIText

    input: Input
    containerText: UIContainerRect;

    private rightButtonClick: Function = () => { }
    private leftButtonClick: Function = () => { }

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
        containerBig.visible = false
        containerBig.vAlign = 'center'
        containerBig.hAlign = 'center'
        containerBig.width = 1550 * 0.4
        containerBig.height = 890 * 0.4
        containerBig.positionX = "0%"
        containerBig.positionY = "0%" //deploy 14%
        containerBig.isPointerBlocker = true

        super(parentUI, containerBig)

        this.background = new UIImage(this.containerBig, new Texture("assets/ui/popup/UI_PopUp_Base.png"))
        this.background.sourceWidth = 750
        this.background.sourceHeight = 540
        this.background.width = this.background.sourceWidth * 0.8
        this.background.height = this.background.sourceHeight * 0.8
        this.background.vAlign = 'center'
        this.background.hAlign = 'center'
        this.background.positionY = "0%"
        this.background.positionX = "0%"
        this.background.opacity = 1
        this.background.isPointerBlocker = true
        this.background.visible = false

        this.title = new UIText(this.background)
        this.title.value = "Your experience is limited"
        this.title.width = "100%"
        this.title.height = "20%"
        this.title.hAlign = "center"
        this.title.vAlign = "top"
        this.title.hTextAlign = "center"
        this.title.vTextAlign = "top"
        this.title.positionX = "0%"
        this.title.positionY = "-17%"
        this.title.font = new Font(Fonts.SansSerif_Bold)
        this.title.color = Color4.White()
        this.title.fontSize = 20
        this.title.textWrapping = false
        this.title.visible = true
        this.title.isPointerBlocker = false

        this.containerText = new UIContainerRect(this.background)
        this.containerText.width = "65%"
        this.containerText.height = "45%"
        this.containerText.hAlign = "center"
        this.containerText.vAlign = "center"
        this.containerText.positionX = "0%"
        this.containerText.positionY = "-5%"
        this.containerText.opacity = 1
        this.containerText.isPointerBlocker = true
        this.containerText.visible = true

        this.textBox = new UIText(this.containerText)
        this.textBox.value = "Your experience is being limited because you are playing without a web3 wallet.\nWithout wallet, you are not able to complete quest or earn rewards.\n\nOnce you have your wallet set up, refresh the page."
        this.textBox.width = "100%"
        this.textBox.height = "100%"
        this.textBox.hAlign = "left"
        this.textBox.vAlign = "top"
        this.textBox.hTextAlign = "left"
        this.textBox.vTextAlign = "top"
        this.textBox.positionX = "0%"
        this.textBox.positionY = "-5%"
        this.textBox.color = Color4.Black()
        this.textBox.fontSize = 16
        this.textBox.textWrapping = true
        this.textBox.visible = true
        this.textBox.isPointerBlocker = false


        this.buttonLeftImage = new UIImage(this.background, new Texture("assets/ui/popup/UI_Button_Red.png"))
        this.buttonLeftImage.sourceWidth = 190
        this.buttonLeftImage.sourceHeight = 110
        this.buttonLeftImage.width = this.buttonLeftImage.sourceWidth * 0.8
        this.buttonLeftImage.height = this.buttonLeftImage.sourceHeight * 0.8
        this.buttonLeftImage.hAlign = "left"
        this.buttonLeftImage.vAlign = "bottom"
        this.buttonLeftImage.positionX = "20%"
        this.buttonLeftImage.positionY = "0%"
        this.buttonLeftImage.opacity = 1
        this.buttonLeftImage.isPointerBlocker = true
        this.buttonLeftImage.visible = true
        this.buttonLeftImage.onClick = new OnPointerDown(() => {
            this.leftButtonClick()
        })

        this.buttonLeftText = new UIText(this.buttonLeftImage)
        this.buttonLeftText.value = "Play as guest "
        this.buttonLeftText.width = "100%"
        this.buttonLeftText.height = "100%"
        this.buttonLeftText.hAlign = "center"
        this.buttonLeftText.vAlign = "center"
        this.buttonLeftText.hTextAlign = "center"
        this.buttonLeftText.vTextAlign = "center"
        this.buttonLeftText.positionX = "0%"
        this.buttonLeftText.positionY = 0
        this.buttonLeftText.color = Color4.White()
        this.buttonLeftText.fontSize = 15
        this.buttonLeftText.textWrapping = false
        this.buttonLeftText.visible = true
        this.buttonLeftText.isPointerBlocker = false

        this.buttonRightImage = new UIImage(this.background, new Texture("assets/ui/popup/UI_Button_Grey.png"))
        this.buttonRightImage.sourceWidth = 190
        this.buttonRightImage.sourceHeight = 110
        this.buttonRightImage.width = this.buttonRightImage.sourceWidth * 0.8
        this.buttonRightImage.height = this.buttonRightImage.sourceHeight * 0.8
        this.buttonRightImage.hAlign = "right"
        this.buttonRightImage.vAlign = "bottom"
        this.buttonRightImage.positionX = "-20%"
        this.buttonRightImage.positionY = "0%"
        this.buttonRightImage.opacity = 1
        this.buttonRightImage.isPointerBlocker = true
        this.buttonRightImage.visible = true
        this.buttonRightImage.onClick = new OnPointerDown(() => {
            this.rightButtonClick()
        })


        this.buttonRightText = new UIText(this.buttonRightImage)
        this.buttonRightText.value = "Get a wallet"
        this.buttonRightText.width = "100%"
        this.buttonRightText.height = "100%"
        this.buttonRightText.hAlign = "center"
        this.buttonRightText.vAlign = "center"
        this.buttonRightText.hTextAlign = "center"
        this.buttonRightText.vTextAlign = "center"
        this.buttonRightText.positionX = "0%"
        this.buttonRightText.positionY = 0
        this.buttonRightText.color = Color4.White()
        this.buttonRightText.fontSize = 15
        this.buttonRightText.textWrapping = false
        this.buttonRightText.visible = true
        this.buttonRightText.isPointerBlocker = false


    }

    show(bVisible: boolean) {
        this.background.visible = bVisible
        this.container.visible = bVisible
        for (let index = 0; index < this.childrenWidget.length; index++) {
            if (this.childrenWidget[index].bVisibleWithParent || !bVisible) {
                this.childrenWidget[index].show(bVisible);
            }
        }
    }

    setRigthButtonCallback(callback: () => void) {
        //clear all callback
        this.rightButtonClick = () => { }
        this.rightButtonClick = callback
    }
    setLeftButtonCallback(callback: () => void) {
        //clear all callback
        this.leftButtonClick = () => { }
        this.leftButtonClick = callback
    }

}