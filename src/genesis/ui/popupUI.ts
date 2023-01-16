import { Widget } from "src/imports/widgets/widgets";
import { AudioManager } from "../components/audio/audio.manager";


const lightGray = new Color4(128 / 255, 128 / 255, 128 / 255, 0.2)

export enum POPUP_STATE {
    OneButton,
    TwoButtons,
    Tasks
}

//This are the different types of popups 
export class Popup extends Widget {
    backgroundBig: UIImage
    buttonRightImage: UIImage
    iconLimitedExperience: UIImage
    buttonLeftImage: UIImage
    exitButton: UIImage
    experienceLimited: UIImage
    checkBox: UIImage
    linkButton: UIImage
    emoteImage: UIImage

    headerBackground2: UIContainerRect
    headerBackground3: UIContainerRect
    headerBackground4: UIContainerRect
    contaierTextBig: UIContainerRect
    containerImage: UIContainerRect

    smallText: UIText
    buttonRightText: UIText
    titleBig: UIText
    textBoxBig: UIText
    buttonLeftText: UIText

    headerText1: UIText
    headerText2: UIText
    headerText3: UIText
    headerText4: UIText
    adviserText: UIText

    limitedExperienceClic: Function = () => { }
    rightButtonClic: Function = () => { }
    leftButtonClic: Function = () => { }

    check: Texture
    //imageChapter: UIImage;
    takecontrolBackground: UIContainerRect;

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
        //Container Small
        //Container Big
        var containerBig = new UIContainerRect(parent)
        containerBig.visible = true
        containerBig.vAlign = 'center'
        containerBig.hAlign = 'center'
        containerBig.width = 900 * 0.5
        containerBig.height = 1400 * 0.5
        containerBig.positionX = "0%"
        containerBig.positionY = "3%"
        containerBig.isPointerBlocker = true

        super(parentUI, containerBig)

        //Backgrounds 
        this.takecontrolBackground = new UIContainerRect(containerBig)
        this.takecontrolBackground.visible = true
        this.takecontrolBackground.hAlign = "center"
        this.takecontrolBackground.vAlign = "bottom"
        this.takecontrolBackground.width = 647 * 0.5
        this.takecontrolBackground.height = 200 * 0.4
        this.takecontrolBackground.positionX = "0%"
        this.takecontrolBackground.positionY = "5%"
        this.takecontrolBackground.isPointerBlocker = false
        this.takecontrolBackground.color = new Color4(0, 0, 0, 0.5)


        this.backgroundBig = new UIImage(containerBig, new Texture("assets/ui/UI_Pop_Up_Base.png"))
        this.backgroundBig.sourceWidth = 550
        this.backgroundBig.sourceHeight = 672
        this.backgroundBig.width = 420
        this.backgroundBig.height = 480
        this.backgroundBig.vAlign = 'top'
        this.backgroundBig.hAlign = 'center'
        this.backgroundBig.positionY = "-10%"
        this.backgroundBig.positionX = "0%"
        this.backgroundBig.opacity = 1
        this.backgroundBig.isPointerBlocker = true
        this.backgroundBig.visible = true

        const containerTitleText = new UIContainerRect(this.backgroundBig)
        containerTitleText.visible = true
        containerTitleText.vAlign = 'top'
        containerTitleText.hAlign = 'center'
        containerTitleText.width = 352 * 0.9
        containerTitleText.height = 60
        containerTitleText.positionX = "0%"
        containerTitleText.positionY = "-5%"
        containerTitleText.isPointerBlocker = false

        this.titleBig = new UIText(containerTitleText)
        this.titleBig.value = "Getting started"
        this.titleBig.width = "100%"
        this.titleBig.height = "100%"
        this.titleBig.hAlign = "center"
        this.titleBig.vAlign = "center"
        this.titleBig.hTextAlign = "center"
        this.titleBig.vTextAlign = "center"
        this.titleBig.positionX = "0%"
        this.titleBig.positionY = "0%"
        this.titleBig.color = Color4.Black()
        this.titleBig.fontSize = 22
        this.titleBig.textWrapping = false
        this.titleBig.visible = true
        this.titleBig.isPointerBlocker = false
        this.titleBig.outlineWidth = 0.15
        this.titleBig.outlineColor = Color4.Black()

        const grayBar = new UIContainerRect(this.backgroundBig)
        grayBar.visible = true
        grayBar.vAlign = 'top'
        grayBar.hAlign = 'center'
        grayBar.width = 352 * 0.9
        grayBar.height = 1
        grayBar.positionX = "0%"
        grayBar.positionY = "-17%"
        grayBar.isPointerBlocker = false
        grayBar.color = new Color4(128 / 255, 128 / 255, 128 / 255, 0.4)

        const headerText1container = new UIContainerRect(this.backgroundBig)
        headerText1container.visible = true
        headerText1container.vAlign = 'top'
        headerText1container.hAlign = 'center'
        headerText1container.width = 352 * 0.9
        headerText1container.height = 50 * 0.9
        headerText1container.positionX = "0%"
        headerText1container.positionY = "-18%"
        headerText1container.isPointerBlocker = false

        this.headerText1 = new UIText(headerText1container)
        this.headerText1.value = "OBJECTIVES"
        this.headerText1.width = "100%"
        this.headerText1.height = "100%"
        this.headerText1.hAlign = "center"
        this.headerText1.vAlign = "center"
        this.headerText1.hTextAlign = "center"
        this.headerText1.vTextAlign = "center"
        this.headerText1.positionX = "0%"
        this.headerText1.positionY = "0%"
        this.headerText1.color = Color4.Gray()
        this.headerText1.fontSize = 18
        this.headerText1.textWrapping = false
        this.headerText1.visible = true
        this.headerText1.isPointerBlocker = false

        this.contaierTextBig = new UIContainerRect(this.backgroundBig)
        this.contaierTextBig.width = 430 * 0.7
        this.contaierTextBig.height = 100 * 0.7
        this.contaierTextBig.hAlign = "center"
        this.contaierTextBig.vAlign = "top"
        this.contaierTextBig.positionX = "0%"
        this.contaierTextBig.positionY = "-40%"
        this.contaierTextBig.visible = true

        this.textBoxBig = new UIText(this.contaierTextBig)
        this.textBoxBig.value = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        this.textBoxBig.width = "90%"
        this.textBoxBig.hAlign = "center"
        this.textBoxBig.vAlign = "center"
        this.textBoxBig.hTextAlign = "center"
        this.textBoxBig.vTextAlign = "top"
        this.textBoxBig.positionX = "0%"
        this.textBoxBig.positionY = "0%"
        this.textBoxBig.color = Color4.Black()
        this.textBoxBig.fontSize = 16
        this.textBoxBig.textWrapping = true
        this.textBoxBig.visible = true
        this.textBoxBig.isPointerBlocker = false

        const advisorBackgroundText = new UIContainerRect(this.backgroundBig)
        advisorBackgroundText.width = 430 * 0.7
        advisorBackgroundText.height = 50
        advisorBackgroundText.hAlign = "center"
        advisorBackgroundText.vAlign = "top"
        advisorBackgroundText.positionX = "0%"
        advisorBackgroundText.positionY = "-60%"
        advisorBackgroundText.visible = true

        this.adviserText = new UIText(advisorBackgroundText)
        this.adviserText.value = "You currently cannot claim this prize as you don't have connected wallet"
        this.adviserText.width = "90%"
        this.adviserText.hAlign = "center"
        this.adviserText.vAlign = "center"
        this.adviserText.hTextAlign = "center"
        this.adviserText.vTextAlign = "center"
        this.adviserText.positionX = "0%"
        this.adviserText.positionY = "0%"
        this.adviserText.color = Color4.Red()
        this.adviserText.fontSize = 14
        this.adviserText.textWrapping = true
        this.adviserText.visible = true
        this.adviserText.isPointerBlocker = false


        this.buttonLeftImage = new UIImage(this.backgroundBig, new Texture("assets/ui/UI_button_black_version_2.png"))
        this.buttonLeftImage.sourceWidth = 254
        this.buttonLeftImage.sourceHeight = 104
        this.buttonLeftImage.width = 254 * 0.6
        this.buttonLeftImage.height = 104 * 0.6
        this.buttonLeftImage.hAlign = "center"
        this.buttonLeftImage.vAlign = "bottom"
        this.buttonLeftImage.positionX = "0%"
        this.buttonLeftImage.positionY = "5%"
        this.buttonLeftImage.opacity = 1
        this.buttonLeftImage.isPointerBlocker = true
        this.buttonLeftImage.visible = true
        this.buttonLeftImage.onClick = new OnPointerDown(() => {
            AudioManager.instance().playPopupClose()
            this.leftButtonClic()
        })

        this.buttonRightImage = new UIImage(this.backgroundBig, new Texture("assets/ui/UI_button_red_version_2.png"))
        this.buttonRightImage.sourceWidth = 254
        this.buttonRightImage.sourceHeight = 104
        this.buttonRightImage.width = 254 * 0.6
        this.buttonRightImage.height = 104 * 0.6
        this.buttonRightImage.hAlign = "center"
        this.buttonRightImage.vAlign = "bottom"
        this.buttonRightImage.positionX = "0%"
        this.buttonRightImage.positionY = "5%"
        this.buttonRightImage.opacity = 1
        this.buttonRightImage.isPointerBlocker = true
        this.buttonRightImage.visible = true
        this.buttonRightImage.onClick = new OnPointerDown(() => {
            AudioManager.instance().playPopupClose()
            this.rightButtonClic()
            this.show(false)
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
        this.buttonLeftText.fontSize = 16
        this.buttonLeftText.textWrapping = false
        this.buttonLeftText.visible = true
        this.buttonLeftText.isPointerBlocker = false

        const containerButtonRightText = new UIContainerRect(this.buttonRightImage)
        containerButtonRightText.visible = true
        containerButtonRightText.vAlign = 'center'
        containerButtonRightText.hAlign = 'center'
        containerButtonRightText.width = 170
        containerButtonRightText.height = 46 * 0.9
        containerButtonRightText.positionX = -2
        containerButtonRightText.positionY = 1
        containerButtonRightText.isPointerBlocker = false

        this.buttonRightText = new UIText(this.buttonRightImage)
        this.buttonRightText.value = "Connect wallet"
        this.buttonRightText.width = "100%"
        this.buttonRightText.height = "100%"
        this.buttonRightText.hAlign = "center"
        this.buttonRightText.vAlign = "center"
        this.buttonRightText.hTextAlign = "center"
        this.buttonRightText.vTextAlign = "center"
        this.buttonRightText.positionX = "0%"
        this.buttonRightText.positionY = 0
        this.buttonRightText.color = Color4.White()
        this.buttonRightText.fontSize = 16
        this.buttonRightText.textWrapping = false
        this.buttonRightText.visible = true
        this.buttonRightText.isPointerBlocker = false

        const MouseRigth = new UIImage(this.takecontrolBackground, new Texture("assets/ui/UI_mouse_2.png"))
        MouseRigth.sourceWidth = 100
        MouseRigth.sourceHeight = 100
        MouseRigth.width = MouseRigth.sourceWidth * 0.65  //620
        MouseRigth.height = MouseRigth.sourceHeight * 0.65  //356
        MouseRigth.vAlign = 'center'
        MouseRigth.hAlign = 'left'
        MouseRigth.positionY = "0%"
        MouseRigth.positionX = "5%"
        MouseRigth.opacity = 1
        MouseRigth.visible = true

        const containerTextTakeControl = new UIContainerRect(this.takecontrolBackground)
        containerTextTakeControl.visible = true
        containerTextTakeControl.vAlign = 'center'
        containerTextTakeControl.hAlign = 'center'
        containerTextTakeControl.width = "75%"
        containerTextTakeControl.height = "100%"
        containerTextTakeControl.positionX = "10%"
        containerTextTakeControl.positionY = "0%"
        containerTextTakeControl.isPointerBlocker = false
        //containerTextTakeControl.color = new Color4(0, 1, 1, 0.6)

        const takecontrol = new UIText(containerTextTakeControl)
        takecontrol.value = "Press the right-click mouse \nbutton to take control"
        takecontrol.width = "100%"
        takecontrol.height = "100%"
        takecontrol.hAlign = "center"
        takecontrol.vAlign = "center"
        takecontrol.hTextAlign = "center"
        takecontrol.vTextAlign = "center"
        takecontrol.positionY = "0%"
        takecontrol.positionX = "0%"
        takecontrol.color = Color4.White()
        takecontrol.fontSize = 14
        takecontrol.textWrapping = true
        takecontrol.visible = true
        takecontrol.isPointerBlocker = false

        this.headerBackground4 = new UIContainerRect(this.backgroundBig)
        this.headerBackground4.width = 352 * 0.9
        this.headerBackground4.height = 50
        this.headerBackground4.vAlign = 'top'
        this.headerBackground4.hAlign = 'center'
        this.headerBackground4.positionY = "-32%"
        this.headerBackground4.positionX = "0%"
        this.headerBackground4.opacity = 1
        this.headerBackground4.visible = true
        this.headerBackground4.color = lightGray

        this.headerText4 = new UIText(this.headerBackground4)
        this.headerText4.value = "Show Bezier your moves"
        this.headerText4.hAlign = "center"
        this.headerText4.vAlign = "center"
        this.headerText4.hTextAlign = "center"
        this.headerText4.vTextAlign = "center"
        this.headerText4.positionY = "0%"
        this.headerText4.color = Color4.Black()
        this.headerText4.fontSize = 15
        this.headerText4.outlineWidth = 0.1
        this.headerText4.outlineColor = Color4.Black()

        this.headerBackground2 = new UIContainerRect(this.backgroundBig)
        this.headerBackground2.width = 352 * 0.9
        this.headerBackground2.height = 50
        this.headerBackground2.vAlign = 'top'
        this.headerBackground2.hAlign = 'center'
        this.headerBackground2.positionY = "-44%"
        this.headerBackground2.positionX = "0%"
        this.headerBackground2.opacity = 1
        this.headerBackground2.visible = true
        this.headerBackground2.color = lightGray

        this.headerText2 = new UIText(this.headerBackground2)
        this.headerText2.value = "Help Mat with the meshes"
        this.headerText2.hAlign = "center"
        this.headerText2.vAlign = "center"
        this.headerText2.hTextAlign = "center"
        this.headerText2.vTextAlign = "center"
        this.headerText2.positionY = "0%"
        this.headerText2.color = Color4.Black()
        this.headerText2.fontSize = 15
        this.headerText2.outlineWidth = 0.1
        this.headerText2.outlineColor = Color4.Black()

        this.headerBackground3 = new UIContainerRect(this.backgroundBig)
        this.headerBackground3.width = 352 * 0.9
        this.headerBackground3.height = 50
        this.headerBackground3.vAlign = 'top'
        this.headerBackground3.hAlign = 'center'
        this.headerBackground3.positionY = "-56%"
        this.headerBackground3.positionX = "0%"
        this.headerBackground3.opacity = 1
        this.headerBackground3.visible = true
        this.headerBackground3.color = lightGray

        this.headerText3 = new UIText(this.headerBackground3)
        this.headerText3.value = "Help Kit with the connection"
        this.headerText3.hAlign = "center"
        this.headerText3.vAlign = "center"
        this.headerText3.hTextAlign = "center"
        this.headerText3.vTextAlign = "center"
        this.headerText3.positionY = "0%"
        this.headerText3.color = Color4.Black()
        this.headerText3.fontSize = 15
        this.headerText3.outlineWidth = 0.1
        this.headerText3.outlineColor = Color4.Black()


        this.containerImage = new UIContainerRect(this.backgroundBig)
        this.containerImage.width = 130 * 0.9
        this.containerImage.height = 130 * 0.9
        this.containerImage.vAlign = 'top'
        this.containerImage.hAlign = 'center'
        this.containerImage.positionY = "-38%"
        this.containerImage.positionX = "0%"
        this.containerImage.opacity = 1
        this.containerImage.color = lightGray

        this.emoteImage = new UIImage(this.containerImage, EMOTETEXTURE)
        this.emoteImage.sourceWidth = 130
        this.emoteImage.sourceHeight = 130
        this.emoteImage.width = 130 * 0.9
        this.emoteImage.height = 130 * 0.9
        this.emoteImage.hAlign = "center"
        this.emoteImage.vAlign = "center"
        this.emoteImage.positionX = "0%"
        this.emoteImage.positionY = "0%"
        this.emoteImage.opacity = 1
        this.emoteImage.isPointerBlocker = true


        this.taskTexts(false)

        this.show(false)
    }
    taskTexts(bVisible: boolean) {
        //set config task false as default
        this.headerBackground2.visible = bVisible
        this.headerBackground3.visible = bVisible
        this.headerBackground4.visible = bVisible
    }

    //Functions
    setText(config: CONFIG) {
        if (config.title) {
            this.titleBig.value = config.title
        }
        if (config.text) {
            this.textBoxBig.value = config.text
        }
        if (config.buttonRight) {
            this.buttonRightText.value = config.buttonRight
        }
        if (config.headerText) {
            this.headerText1.value = config.headerText
        }
        if (config.buttonLeft) {
            this.buttonLeftText.value = config.buttonLeft
        }
        if (config.disclaimText) {
            this.adviserText.value = config.disclaimText
        }
        if (config.getText) {
            this.textBoxBig.value = config.getText()
        }
        if (config.src) {
            this.emoteImage.source = config.src
        }

        this.show(true)
    }

    buttonsMode() {
        this.containerImage.visible = true
        this.emoteImage.visible = true
    }

    modeSetUp(mode: "1button" | "2button" | "tasks") {
        if (mode == "1button") {
            this.buttonsMode()
            this.contaierTextBig.positionY = "-63%"
            this.buttonLeftImage.visible = false
            this.buttonRightImage.hAlign = "center"
            this.buttonRightImage.positionY = "5%"
            this.adviserText.visible = false

            this.taskTexts(false)
            this.textBoxBig.visible = true
            this.containerImage.visible = true
        }
        if (mode == "2button") {
            this.buttonsMode()
            this.containerImage.positionY = "-30%"
            this.contaierTextBig.positionY = "-53%"
            this.buttonLeftImage.visible = true
            this.buttonRightImage.hAlign = "center"
            this.buttonLeftImage.positionY = "5%"
            this.buttonRightImage.positionY = "18%"

            this.taskTexts(false)
            this.containerImage.visible = true
            this.textBoxBig.visible = true
        }

        if (mode == "tasks") {
            this.taskTexts(true)
            this.buttonRightText.value = "OK"
            this.buttonRightImage.positionY = "10%"
            this.textBoxBig.visible = false
            this.buttonLeftImage.visible = false
            this.adviserText.visible = false
            this.containerImage.visible = false
        }

    }



    popUpMode(mode: POPUP_STATE) {
        this.buttonLeftImage.visible = true
        switch (mode) {
            case POPUP_STATE.OneButton:
                this.modeSetUp("1button")
                this.buttonRightImage.onClick = new OnPointerDown(() => {
                    AudioManager.instance().playPopupClose()
                    this.rightButtonClic()
                    this.show(false)
                })
                this.buttonLeftImage.onClick = new OnPointerDown(() => {
                    AudioManager.instance().playPopupClose()
                    this.leftButtonClic()
                    this.show(false)
                })

                break;
            case POPUP_STATE.TwoButtons:
                this.modeSetUp("2button")
                if (DISCLAIMTEXT.disclaimText) {
                    this.adviserText.value = DISCLAIMTEXT.disclaimText
                    this.adviserText.visible = true
                }
                this.buttonRightImage.onClick = new OnPointerDown(() => {
                    openExternalURL('https://docs.decentraland.org/player/blockchain-integration/get-a-wallet/')
                    AudioManager.instance().playPopupClose()
                    this.rightButtonClic()
                    this.show(false)
                })
                this.buttonLeftImage.onClick = new OnPointerDown(() => {
                    AudioManager.instance().playPopupClose()
                    this.leftButtonClic()
                    this.show(false)
                })

                break;
            case POPUP_STATE.Tasks:
                this.modeSetUp("tasks")
                this.setText(CHAPTER1)
                break;
        }
    }


}
