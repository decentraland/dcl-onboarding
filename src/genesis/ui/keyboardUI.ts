import { delay } from "src/imports/index";
import { UserData } from "src/imports/user/user.data";
import { Widget } from "../../imports/widgets/widgets"

//This is the Ui for the keyboard that appearts at the start of the game
export class KeyboardUI extends Widget {
    image: UIImage
    inputSubscribeArray: any[] = []
    hideTimeout: any
    callback: Function
    callbackStart: Function

    private readonly IMAGE_SCALE: number = 0.7
    pressanykey: UIText;
    bHideInProcess: boolean = false
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

        const container = new UIContainerRect(parent)
        container.visible = true
        container.vAlign = 'center'
        container.hAlign = 'center'
        container.width = '100%'
        container.height = '100%'

        super(parentUI, container)


        const background = new UIContainerStack(this.container)
        background.color = new Color4(0, 0, 0, 1)
        background.visible = true
        background.width = '200%'
        background.height = '200%'
        background.adaptHeight = false
        background.adaptWidth = false
        background.isPointerBlocker = false

        this.image = new UIImage(this.container, new Texture("assets/ui/UI_Keyboard.png"))
        this.image.sourceWidth = 1302
        this.image.sourceHeight = 846
        this.image.width = this.image.sourceWidth * this.IMAGE_SCALE
        this.image.height = this.image.sourceHeight * this.IMAGE_SCALE
        this.image.vAlign = 'center'
        this.image.hAlign = 'center'
        this.image.positionY = "0%"
        this.image.positionX = "0%"
        this.image.isPointerBlocker = false
        this.image.visible = true


        this.pressanykey = new UIText(this.container)
        this.pressanykey.value = "Press left click to Continue..."
        this.pressanykey.width = "100%"
        this.pressanykey.height = "100%"
        this.pressanykey.hAlign = "center"
        this.pressanykey.vAlign = "bottom"
        this.pressanykey.hTextAlign = "center"
        this.pressanykey.vTextAlign = "center"
        this.pressanykey.positionX = "1%"
        this.pressanykey.positionY = "-35%"
        this.pressanykey.color = Color4.White()
        this.pressanykey.fontSize = 24
        this.pressanykey.textWrapping = false
        this.pressanykey.visible = true
        this.pressanykey.isPointerBlocker = false


        this.show(true)
    }
    show(bVisible: boolean): void {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout)
            this.hideTimeout = null
        }

        super.show(bVisible)
        if (bVisible) {
            this.subscribeInput()
        }
        else {
            this.unsubscribeInputs()
        }
        this.bHideInProcess = false
    }

    hideAnim() {
        //call the second we start to hide,
        //this was on the final 
        if (this.callbackStart) this.callbackStart()

        if (!this.container.visible) return;
        this.unsubscribeInputs()
        this.bHideInProcess = true
        GenesisData.instance().onStartHideKeyboardUI()
        this.hideAnimRecursive()

    }

    private hideAnimRecursive(alpha: number = 1) {
        if (alpha <= 0) {
            this.show(false)
            if (this.callback) this.callback()
            //deactivate  look at
            GenesisData.instance().onEndHideKeyboardUI()

            return
        }

        this.container.opacity = alpha

        this.hideTimeout = delay(() => {
            this.hideAnimRecursive(alpha - 0.05)
        }, 62);
    }

    setcallbackStart(callback: Function) {
        this.callbackStart = callback
    }
    setcallback(callback: Function) {
        this.callback = callback
    }

    private subscribeInput() {
        this.inputSubscribeArray[0] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[1] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, e => {
            this.hideAnim()
        })

        this.inputSubscribeArray[2] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.JUMP, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[3] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.ACTION_3, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[4] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.ACTION_4, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[5] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.ACTION_5, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[6] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.ACTION_6, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[7] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.FORWARD, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[8] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.BACKWARD, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[9] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.LEFT, false, e => {
            this.hideAnim()
        })
        this.inputSubscribeArray[10] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.RIGHT, false, e => {
            this.hideAnim()
        })
        
        this.subscribeDesktopInput()
    }

    private async subscribeDesktopInput() {
        await UserData.instance().loadPlatform()

        if (UserData.instance().isDesktop()) {
            this.inputSubscribeArray[11] = Input.instance.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, e => {
                this.hideAnim()
            })
        }

    }

    private unsubscribeInputs() {
        if (this.inputSubscribeArray && this.inputSubscribeArray.length > 0) {
            for (let i = 0; i < this.inputSubscribeArray.length; i++) {
                this.inputSubscribeArray[i]()
            }
        }
    }

}