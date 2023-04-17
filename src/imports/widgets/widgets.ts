import { Text, Dialog, textDialogs, getTextData, getText, getTexture } from '../../jsonData/textsData'
import { UpdateTimerWidgetSystem } from '../systems'
import { delay, clearDelay } from '../components/delay'
import { AudioManager } from 'src/genesis/components/audio/audio.manager'

//Seteo del modo de saltar de texto/panel
export enum SkipMode {
  Click = 0, //Al hacer click
  Auto = 1, //Automaticamente
  AutoAndClick = 2, //Al hacer click y automaticamente
  ClickAndOnlyEndAuto = 3, //Al hacer click, automaticamente solo al final
}
export type ContainerProperties = {
  width: number,
  height: number,
  positionX: number,
  positionY: number,
  color: Color4,
  hAlign: string,
  vAlign: string
}


//Type tamaño de imagen, X= ancho, y= alto
export type ImageSize = {
  x: number,
  y: number
}

//Type propiedades de imagen, source ("@direcion recurso"), texture (si la tiene), tamaño ancho original, tamaño alto original
//nueva ancho (si se desea), nuevo alto (si se desea), nueva posición respecto al padre, X= pos. horizontal, y= pos. Vertical
export type ImageProperties = {
  src: string
  texture?: Texture
  sourceWidth: number
  sourceHeight: number
  width?: number | string
  height?: number | string
  positionX?: number | string
  positionY?: number | string
}


//Type propiedades de texto, color, alin vertical, alin horizontal, ancho, alto, pos horizontal, pos altura, alin horizontal, alin vertical y tamaño letra
export type TextProperties = {
  color?: Color4
  vAlign?: string
  hAlign?: string
  width?: number | string
  height?: number | string
  positionX?: number | string
  positionY?: number | string
  hTextAlign?: string
  vTextAlign?: string
  fontSize?: number
  title?: string
}

//Type propiedades de la caja del texto, retrato?, propiedades imagen caja texto, propiedades retrato y propiedades del texto (Toda la config del "bocadillo")
export type WidgetTextBoxProperties = {
  showFaceImage?: boolean
  textBoxImageConfig?: ImageProperties
  faceImageConfig?: ImageProperties
  textConfig?: TextProperties
}

//Type Identificador del dialogo, id texto e idioma
export class TextData {
  dialogId: number
  textId: number
  textLanguage?: string = "en"
}

//wg UI, (tipado y constructor de UI)
export class Widget {
  parentUI: UIShape   //si usamos la de DeCentraland
  parentWidget: Widget
  childrenWidget: Widget[] = []
  container: UIShape  //si usamos la de DeCentraland
  bVisibleWithParent: boolean = true
  showForTimeTimeout: any
  constructor(parentUI: Widget | UIShape, container: UIShape = null) {
    //Si Usamos una propia
    if (parentUI as Widget) {
      this.parentWidget = parentUI as Widget
      this.parentUI = (parentUI as Widget).container
    }
    //Si Usamos la de DeCentraland
    else if (parentUI as UIShape) {
      this.parentUI = (parentUI as UIShape)
      this.parentWidget = null
    }
    //Propiedades del container de DeCentraland
    if (container == null) {
      this.container = new UIContainerStack(this.parentUI)
      this.container.visible = false
      this.container.vAlign = 'center'
      this.container.hAlign = 'center'
      this.container.width = '100%'
      this.container.height = '100%'
    }
    //Container por defecto
    else {
      this.container = container
    }
  }


  isVisible(){
    //debugger
    const retVal = this.container.visible
    
    return retVal
  }

  //Muestra u oculta el widget y sus hijos, no muestra los hijos que no tengan bVisibleWithParent==true
  show(bVisible: boolean) {
    this.container.visible = bVisible
    for (let index = 0; index < this.childrenWidget.length; index++) {
      if (this.childrenWidget[index].bVisibleWithParent || !bVisible) {
        this.childrenWidget[index].show(bVisible);
      }
    }
  }
  //Show durante showTime segundos
  showForTime(bVisible: boolean, showTime: float) {
    if (this.showForTimeTimeout) {
      clearDelay(this.showForTimeTimeout)
      this.showForTimeTimeout = null
    }
    this.show(bVisible)
    if (showTime > 0) {
      let self = this
      this.showForTimeTimeout = delay(() => {
        self.show(!bVisible)
      }, showTime * 1000);
    }
  }
}

//wg Contador de tiempo, Creciente
export class WidgetTextTimmer extends Widget {
  textUI: UIText
  startTime: number
  updateSystem: UpdateTimerWidgetSystem
  timeout: any
  bUpdate: boolean
  constructor(parentUI: Widget | UIShape) {
    var parent: UIShape;
    //wg propio
    if (parentUI as Widget) {
      parent = (parentUI as Widget).container
    }
    //UI DeCentraland
    else if (parentUI as UIShape) {
      parent = (parentUI as UIShape)
    }
    //Container DeCentraland, propieadades
    var container = new UIContainerRect(parent)
    container.visible = false
    container.vAlign = 'top'
    container.hAlign = 'center'
    container.width = '100%'
    container.height = '20%'
    //container.color = Color4.Gray()

    //Temporizador, propiedades
    super(parentUI, container)
    this.textUI = new UIText(container)
    this.textUI.vAlign = "top"
    this.textUI.value = '00:00'
    this.textUI.fontSize = 36
    this.textUI.color = Color4.White()

  }
  //Hacer visible temporizador
  show(bVisible: boolean) {
    if (!bVisible) {
      this.start(false)
    }
    super.show(bVisible)
  }
  //Empieza a contar!
  start(bStart: boolean) {
    if (bStart) {
      this.startTime = Date.now()
      this.bUpdate = true
      this.update()
      /*if (!this.updateSystem) {
        this.updateSystem = new UpdateTimerWidgetSystem()
        this.updateSystem.timerWidget = this
      }
      engine.addSystem(this.updateSystem)*/
    }
    else {
      this.bUpdate = false
      if (this.timeout) {
        clearDelay(this.timeout)
      }
    }
    /*else if(this.updateSystem){
      engine.removeSystem(this.updateSystem)
    }*/
  }
  //Actualiza el valor que muestra el temporizador, de forma ascendente.
  update() {
    this.textUI.value = millisToMinutesAndSeconds(Date.now() - this.startTime)
    //Para hacerlo decreciente sustituye la linea por: this.textUI.value = millisToMinutesAndSeconds(this.startTime -Date.now())
    let self = this
    this.timeout = delay(() => {
      if (self.bUpdate && self.container.visible) {
        self.update()
      }
    }, 1000);
  }
}

//wg Caja de Texto
export class WidgetTextBox extends Widget {
  textBoxImage: UIImage
  faceImage: UIImage
  faceTexture: Texture
  textUI: UIText
  textData: TextData
  timeoutNextChar: any
  bWritingText: boolean
  wgTextControlls: Widget
  nAllowDelayText: boolean
  containerTextBox: UIContainerRect
  mouseIconUI: {
    container: UIContainerStack,
    image: UIImage,
    text: UIText
  }
  speedText: number = 20
  private _matchedHTML: RegExpMatchArray[] = []
  constructor(parentUI: Widget | UIShape, textData: TextData = null,
    widgetData: WidgetTextBoxProperties = { showFaceImage: false }
  ) {
    //cuadro texto como wg (propio)
    var parent: UIShape;
    if (parentUI as Widget) {
      parent = (parentUI as Widget).container
    }
    //cuadro texto DeCentraland
    else if (parentUI as UIShape) {
      parent = (parentUI as UIShape)
    }

    //propiedades del contenedor
    var container = new UIContainerRect(parent)
    container.visible = false
    container.vAlign = 'bottom'
    container.hAlign = 'center'
    container.width = '100%'
    container.height = '25%'
    container.positionY = "2%"
    //container.color = Color4.Gray()
    super(parentUI, container)

    //IMAGES
    let showFaceImage: boolean = widgetData.showFaceImage

    //Text Box img
    let textBoxImageConfig: ImageProperties = {
      src: "assets/ui/UI_NPC_base.png",
      sourceWidth: 730,
      sourceHeight: 330,
      width: 730 * 0.8,
      height: 330 * 0.8,
      positionY: "-46%",
      positionX: "3%"
    }

    if (widgetData.textBoxImageConfig) {
      textBoxImageConfig = widgetData.textBoxImageConfig
    }

    if (widgetData.textBoxImageConfig) {
      if (widgetData.textBoxImageConfig.sourceWidth) textBoxImageConfig.sourceWidth = widgetData.textBoxImageConfig.sourceWidth
      if (widgetData.textBoxImageConfig.sourceHeight) textBoxImageConfig.sourceHeight = widgetData.textBoxImageConfig.sourceHeight
      if (widgetData.textBoxImageConfig.width) textBoxImageConfig.width = widgetData.textBoxImageConfig.width
      if (widgetData.textBoxImageConfig.height) textBoxImageConfig.height = widgetData.textBoxImageConfig.height
      if (widgetData.textBoxImageConfig.positionX) textBoxImageConfig.positionX = widgetData.textBoxImageConfig.positionX
      if (widgetData.textBoxImageConfig.positionY) textBoxImageConfig.positionY = widgetData.textBoxImageConfig.positionY
    }

    //Textura de la caja de texto, si la tiene
    let textBoxTexture: Texture
    try {
      textBoxTexture = new Texture(textBoxImageConfig.src)
    } catch (error) {
      // console_log("Texture " + textBoxImageConfig.src + " not found")
      // console_log(error)
      textBoxTexture = new Texture("")
    }

    //Propiedades de la imagen en la caja de texto si la tiene
    this.textBoxImage = new UIImage(container, textBoxTexture)
    this.textBoxImage.name = 'textBoxImage'
    this.textBoxImage.sourceWidth = textBoxImageConfig.sourceWidth
    this.textBoxImage.sourceHeight = textBoxImageConfig.sourceHeight
    this.textBoxImage.width = textBoxImageConfig.width,
      this.textBoxImage.height = textBoxImageConfig.height,
      this.textBoxImage.positionX = textBoxImageConfig.positionX,
      this.textBoxImage.positionY = textBoxImageConfig.positionY,
      this.textBoxImage.vAlign = 'bottom'
    this.textBoxImage.hAlign = 'center'

    this.containerTextBox = new UIContainerRect(this.textBoxImage)
    this.containerTextBox.vAlign = 'bottom'
    this.containerTextBox.hAlign = 'center'
    this.containerTextBox.width = '75%'
    this.containerTextBox.height = '42%'
    this.containerTextBox.positionY = "28%"
    this.containerTextBox.positionX = "0%"
    //this.containerTextBox.color = Color4.Blue()

    let faceBorder = new UIImage(container, new Texture("assets/ui/UI_NPC_Character.png"))
    faceBorder.name = 'faceBorder'
    faceBorder.sourceWidth = 280
    faceBorder.sourceHeight = 280
    faceBorder.width = 280 * 0.8
    faceBorder.height = 280 * 0.8
    faceBorder.positionX = -285,//"-32%"
    faceBorder.positionY = "-13%"

    //SHOW Face img
    if (showFaceImage) {
      let faceImageConfig: ImageProperties = {
        src: "assets/ui/UI_NPC_Character_Robot.png",
        sourceWidth: 280,
        sourceHeight: 280,
        width: 280 * 0.80 + 'px',
        height: 280 * 0.80 + 'px',
        positionX: -285,//"-32%",
        positionY: "-13%",
      }

      if (widgetData.faceImageConfig) {
        if (widgetData.faceImageConfig.sourceWidth) faceImageConfig.sourceWidth = widgetData.faceImageConfig.sourceWidth
        if (widgetData.faceImageConfig.sourceHeight) faceImageConfig.sourceHeight = widgetData.faceImageConfig.sourceHeight
        if (widgetData.faceImageConfig.width) faceImageConfig.width = widgetData.faceImageConfig.width
        if (widgetData.faceImageConfig.height) faceImageConfig.height = widgetData.faceImageConfig.height
        if (widgetData.faceImageConfig.positionX) faceImageConfig.positionX = widgetData.faceImageConfig.positionX
        if (widgetData.faceImageConfig.positionY) faceImageConfig.positionY = widgetData.faceImageConfig.positionY
        if (widgetData.faceImageConfig.src) faceImageConfig.src = widgetData.faceImageConfig.src
      }

      try {
        this.faceTexture = new Texture(faceImageConfig.src)
      } catch (error) {
        // console_log("Texture " + faceImageConfig.src + " not found")
        // console_log(error)
        this.faceTexture = new Texture("")
      }

      this.faceImage = new UIImage(container, this.faceTexture)
      this.faceImage.sourceWidth = faceImageConfig.sourceWidth
      this.faceImage.sourceHeight = faceImageConfig.sourceHeight
      this.faceImage.width = faceImageConfig.width
      this.faceImage.height = faceImageConfig.height
      this.faceImage.vAlign = 'center'
      this.faceImage.hAlign = 'center'
      this.faceImage.positionX = faceImageConfig.positionX
      this.faceImage.positionY = faceImageConfig.positionY
    }

    //TEXT (propio)
    let textConfig: TextProperties = {
      color: Color4.Black(),
      vAlign: 'center',
      hAlign: 'left',
      width: '100%',
      height: '100%',
      positionX: "0%",
      positionY: "0%",
      fontSize: 16,
      hTextAlign: "",
      vTextAlign: "",
      title: ""
    }

    if (widgetData.textConfig) {
      if (widgetData.textConfig.color) textConfig.color = widgetData.textConfig.color
      if (widgetData.textConfig.vAlign) textConfig.vAlign = widgetData.textConfig.vAlign
      if (widgetData.textConfig.hAlign) textConfig.hAlign = widgetData.textConfig.hAlign
      if (widgetData.textConfig.width) textConfig.width = widgetData.textConfig.width
      if (widgetData.textConfig.height) textConfig.height = widgetData.textConfig.height
      if (widgetData.textConfig.positionX) textConfig.positionX = widgetData.textConfig.positionX
      if (widgetData.textConfig.positionY) textConfig.positionY = widgetData.textConfig.positionY
      if (widgetData.textConfig.fontSize) textConfig.fontSize = widgetData.textConfig.fontSize
      if (widgetData.textConfig.hTextAlign) textConfig.hTextAlign = widgetData.textConfig.hTextAlign
      if (widgetData.textConfig.vTextAlign) textConfig.vTextAlign = widgetData.textConfig.vTextAlign
      if (widgetData.textConfig.title) textConfig.title = widgetData.textConfig.title
    }

    const containerTextTitle = new UIContainerRect(this.textBoxImage)
    containerTextTitle.visible = true
    containerTextTitle.vAlign = 'top'
    containerTextTitle.hAlign = 'left'
    containerTextTitle.width = 195
    containerTextTitle.height = 54
    containerTextTitle.positionX = "12.5%"
    containerTextTitle.positionY = "-13.5%"
    containerTextTitle.isPointerBlocker = false
    //containerTextTitle.color = new Color4(0,0,1,0.6)

    let nameText = new UIText(containerTextTitle)
    nameText.name = 'nameText'
    nameText.value = textConfig.title
    nameText.fontSize = 26
    nameText.color = Color4.Black()
    nameText.vAlign = 'center'
    nameText.hAlign = 'left'
    nameText.vTextAlign = 'center'
    nameText.hTextAlign = 'left'
    nameText.positionX = "10%"
    nameText.positionY = "0%"
    nameText.width = "100%"
    nameText.height = "100%"
    nameText.visible = true


    //Text (DeCentraland)
    this.textUI = new UIText(this.containerTextBox)
    this.textUI.value = ''
    this.textUI.color = textConfig.color
    this.textUI.vAlign = textConfig.vAlign
    this.textUI.hAlign = textConfig.hAlign
    this.textUI.width = textConfig.width
    this.textUI.height = textConfig.height
    this.textUI.positionX = textConfig.positionX
    this.textUI.positionY = textConfig.positionY
    this.textUI.fontSize = textConfig.fontSize
    this.textUI.textWrapping = true
    this.textUI.adaptHeight = true

    this.textData = textData
    this.nAllowDelayText = true
  }
  //mostrar texto
  show(bVisible: boolean) {

    if (this.timeoutNextChar) {
      this.bWritingText = false
      clearDelay(this.timeoutNextChar)
      this.timeoutNextChar = null
    }
    if (bVisible && this.textData && textDialogs[this.textData.dialogId].texts[this.textData.textId]) {
      this.setText(this.textData)
    }
    super.show(bVisible)
  }
  //Elegir texto con "animacion" maquina escribir
  setText(text: TextData, bWithDelay: boolean = true) {

    if (this.timeoutNextChar) {
      this.bWritingText = false
      clearDelay(this.timeoutNextChar)
      this.timeoutNextChar = null
    }
    this.textUI.value = ""
    this.textUI.fontSize = getTextData(text.dialogId, text.textId).fontSize
    this.textUI.positionY = getTextData(text.dialogId, text.textId).vAlign

    if (bWithDelay && this.nAllowDelayText) {
      this.checkHTMLTag(getText(text.dialogId, text.textId, text.textLanguage))
      this.setTextWithDelay(getText(text.dialogId, text.textId, text.textLanguage))
    }
    else {
      this.textUI.value = getText(text.dialogId, text.textId, text.textLanguage)
    }
  }
  //Elegir texto con retardo de tiempo
  setTextWithDelay(finalText: string, currentText: string = "") {

    if (currentText.length == 1) {
      AudioManager.instance().playOnceGlobal("chatbox", { volume: 0.2 })
    }

    if (currentText.length < finalText.length) {
      this.bWritingText = true
      //If there is a html tag, print all of it at once
      if (this._matchedHTML[0] && this._matchedHTML[0].index == currentText.length) {
        currentText = currentText + finalText.substr(this._matchedHTML[0].index, this._matchedHTML[0][0].length)
        this._matchedHTML.shift()
      }
      else {
        //Add the next char to the text
        currentText = currentText + finalText.charAt(currentText.length)
      }
      this.textUI.value = currentText
      let self = this
      this.timeoutNextChar = delay(() => {
        self.setTextWithDelay(finalText, currentText)
      }, this.speedText);
    }
    else {
      AudioManager.instance().stop("chatbox")
      this.bWritingText = false
    }

  }
  //Find an html <> tag in the text
  private matchHTMLTag(text: string): RegExpMatchArray {
    return text.match(/<[^>]*>/)
  }
  private checkHTMLTagRecursive(text: string, index = 0) {
    let match = this.matchHTMLTag(text.substr(index))
    if (match && match[0]) {
      this._matchedHTML.push(match)
      match.index = index + match.index
      index = match.index + match[0].length
      return this.checkHTMLTagRecursive(text, index)
    }
  }
  //Find and store all html <> tags in the text nad its char index
  private checkHTMLTag(text: string) {
    this._matchedHTML = []
    this.checkHTMLTagRecursive(text)
  }

  setFaceImage(texture: Texture) {
    this.faceImage.source = texture
    //this.faceImage = new UIImage(this.container, texture)
  }

  setContainerTextPos(posY: number | string) {
    this.containerTextBox.positionY = posY
  }

  //nuevo wg click
  protected createClickWg() {

    //Propiedades de la caja
    const container = new UIContainerStack(this.textBoxImage)
    container.stackOrientation = UIStackOrientation.HORIZONTAL
    container.visible = false
    container.width = "15%"
    container.height = "15%"
    container.vAlign = 'bottom'
    container.hAlign = 'right'
    container.positionX = "-8%"
    container.positionY = "15%"
    //container.color = new Color4(1,0.2,1,0.5)

    let controlsWg = new Widget(this, container)

    //Propiedades Imagen clickeable
    const clickImage = new UIImage(container, new Texture("assets/UI_Button_M1.png"))
    clickImage.sourceWidth = 100
    clickImage.sourceHeight = 100
    clickImage.width = 25
    clickImage.height = 25
    clickImage.vAlign = 'center'
    clickImage.hAlign = 'left'

    //Propiedades Texto
    const controlsText = new UIText(container)
    controlsText.value = ': Next'
    controlsText.color = Color4.Black()
    controlsText.adaptHeight = true
    controlsText.vAlign = 'center'
    controlsText.positionY = "0%"
    controlsText.positionX = "-35%"
    controlsText.hTextAlign = 'left'
    controlsText.vTextAlign = 'center'
    controlsText.fontSize = 16


    let controlsTextWg = new Widget(controlsWg, controlsText)
    let controlsImgWg = new Widget(controlsWg, clickImage)

    controlsWg.childrenWidget = [controlsTextWg, controlsImgWg]
    this.childrenWidget.push(controlsWg)
    this.wgTextControlls = controlsWg
    controlsWg.show(true)

    this.mouseIconUI = {
      container: container,
      image: clickImage,
      text: controlsText
    }

  }

}

//Wg botones de confirmacion, E-> Si, F->No
export class WidgetComfirm extends Widget {
  buttonComfirmImage: UIImage
  buttonCancelImage: UIImage
  comfrimTextUI: UIText
  cancelTextUI: UIText
  comfirmFunction: Function
  inputComfirmUnsubscribe: any
  inputCancelUnsubscribe: any
  cancelFunction: Function
  comfirmDialog: TextData[]
  cancelDialog: TextData[]
  inputInstance: Input
  constructor(parentUI: Widget | UIShape) {
    var parent: UIShape;
    if (parentUI as Widget) {
      parent = (parentUI as Widget).container
    }
    else if (parentUI as UIShape) {
      parent = (parentUI as UIShape)
    }
    var container = new UIContainerRect(parent)
    container.visible = false
    container.vAlign = 'bottom'
    container.hAlign = 'center'
    container.width = '50%'
    container.height = '35%'
    container.positionY = "0%"
    //container.color = new Color4(0.5,1,1,0.5)
    super(parentUI, container)

    //Propiedades imagen boton "Confirmar"
    this.buttonComfirmImage = new UIImage(container, new Texture("assets/ui/UI_Button_Red.png"))
    this.buttonComfirmImage.name = 'buttonComfirmImage'
    this.buttonComfirmImage.sourceWidth = 190
    this.buttonComfirmImage.sourceHeight = 110
    this.buttonComfirmImage.width = this.buttonComfirmImage.sourceWidth * 0.7
    this.buttonComfirmImage.height = this.buttonComfirmImage.sourceHeight * 0.7
    this.buttonComfirmImage.vAlign = 'center'
    this.buttonComfirmImage.hAlign = 'center'
    this.buttonComfirmImage.positionX = "15%"
    this.buttonComfirmImage.positionY = "-35%"

    //Propiedades texto boton "Confirmar"
    this.comfrimTextUI = new UIText(this.buttonComfirmImage)
    this.comfrimTextUI.value = 'E:   YES'
    this.comfrimTextUI.vAlign = 'center'
    this.comfrimTextUI.hAlign = 'center'
    this.comfrimTextUI.color = Color4.White()
    this.comfrimTextUI.fontSize = 10
    this.comfrimTextUI.width = "100%"
    this.comfrimTextUI.hTextAlign = 'center'
    this.comfrimTextUI.vTextAlign = 'center'
    this.comfrimTextUI.positionY = "0%"
    this.comfrimTextUI.positionX = "0%"
    this.comfrimTextUI.outlineWidth = 0.1
    this.comfrimTextUI.outlineColor = Color4.White()

    //Propiedades imagen boton "Denegar"
    this.buttonCancelImage = new UIImage(container, new Texture("assets/ui/UI_Button_Grey.png"))
    this.buttonCancelImage.name = 'buttonCancelImage'
    this.buttonCancelImage.sourceWidth = 190
    this.buttonCancelImage.sourceHeight = 110
    this.buttonCancelImage.width = this.buttonCancelImage.sourceWidth * 0.7
    this.buttonCancelImage.height = this.buttonCancelImage.sourceHeight * 0.7
    this.buttonCancelImage.vAlign = 'center'
    this.buttonCancelImage.hAlign = 'center'
    this.buttonCancelImage.positionX = "-6%"
    this.buttonCancelImage.positionY = "-35%"

    //Propiedades texto boton "Denegar"
    this.cancelTextUI = new UIText(this.buttonCancelImage)
    this.cancelTextUI.value = 'F:   NO'
    this.cancelTextUI.vAlign = 'center'
    this.cancelTextUI.hAlign = 'center'
    this.cancelTextUI.color = Color4.White()
    this.cancelTextUI.fontSize = 10
    this.cancelTextUI.width = "100%"
    this.cancelTextUI.hTextAlign = 'center'
    this.cancelTextUI.vTextAlign = 'center'
    this.cancelTextUI.positionY = "0%"
    this.cancelTextUI.positionX = "0%"
    this.cancelTextUI.outlineWidth = 0.1
    this.cancelTextUI.outlineColor = Color4.White()

    this.inputInstance = Input.instance
  }
  //Mostrar botones
  show(bVisible: boolean) {
    if (bVisible) {
      let self = this
      self.unsubscribeInputs()
      self.inputComfirmUnsubscribe = this.inputInstance.subscribe("BUTTON_DOWN", ActionButton.PRIMARY, false, e => {
        if (self.container.visible) {
          self.show(false)
          self.comfirmFunction()
          self.unsubscribeInputs()
        }

      })

      self.inputCancelUnsubscribe = this.inputInstance.subscribe("BUTTON_DOWN", ActionButton.SECONDARY, false, e => {
        if (self.container.visible) {
          self.show(false)
          self.cancelFunction()
          self.unsubscribeInputs()
        }
      })
    }
    else {
      this.unsubscribeInputs()
    }
    super.show(bVisible)


  }
  //Desactivar "imputs" botones
  unsubscribeInputs() {
    if (this.inputComfirmUnsubscribe) {
      this.inputComfirmUnsubscribe()

    }
    if (this.inputCancelUnsubscribe) {
      this.inputCancelUnsubscribe()

    }
  }

}

//wg dialogos NPCs
export class WidgetTalk extends WidgetTextBox {
  dialogIndex: number
  dialogData: Dialog
  index: number
  timeToNext: float
  skipMode: SkipMode
  bHideWhenEnded: boolean
  callback: Function
  private timeoutNextText: any
  private inputInstance: Input
  private inputUnsubscribe: Function
  comfirmWg: WidgetComfirm
  visible: boolean
  constructor(
    parentUI: Widget | UIShape,
    dialogIndex: number,
    bHideWhenEnded: boolean,
    skipMode: SkipMode,
    callback = function () { },
    widgetData: WidgetTextBoxProperties = { showFaceImage: false }
  ) {
    super(parentUI, null, widgetData)

    this.dialogIndex = dialogIndex
    this.skipMode = skipMode
    this.bHideWhenEnded = bHideWhenEnded
    this.dialogData = textDialogs[this.dialogIndex]
    this.callback = callback

    this.textData = {
      dialogId: dialogIndex,
      textId: -1
    }

    this.visible = false
  }
  //Mostrar dialogo
  show(bVisible: boolean) {
    if (this.timeoutNextText) {
      clearDelay(this.timeoutNextText)
      this.timeoutNextText = null
    }
    if (bVisible) {
      if (!this.visible) {
        this.dialogData = textDialogs[this.dialogIndex]

        if (this.skipMode == SkipMode.Click || this.skipMode == SkipMode.AutoAndClick || this.skipMode == SkipMode.ClickAndOnlyEndAuto) {
          //Skip with click
          this.setClickEvent()
        }
        if (this.isAutoSkip()) {
          //Skip when finish text after 4s
          this.timeToNext = 4
        }
      }
    }
    else {
      if (this.inputUnsubscribe) {
        this.inputUnsubscribe()
        this.inputUnsubscribe = null
      }
      if (this.comfirmWg && this.comfirmWg.container.visible) {
        this.setContainerTextPos("28%")
        this.comfirmWg.show(false)
      }
    }
    if (bVisible && !this.visible) {
      this.textData.textId = -1
    }
    super.show(bVisible)
    if (bVisible && !this.visible) {
      this.showNextText()
    }
    this.visible = bVisible
  }
  showToText(textId: number) {
    if (this.timeoutNextText) {
      clearDelay(this.timeoutNextText)
      this.timeoutNextText = null
    }

    if (!this.visible) {
      this.dialogData = textDialogs[this.dialogIndex]

      if (this.skipMode == SkipMode.Click || this.skipMode == SkipMode.AutoAndClick || this.skipMode == SkipMode.ClickAndOnlyEndAuto) {
        //Skip with click
        this.setClickEvent()
      }
      if (this.isAutoSkip()) {
        //Skip when finish text after 4s
        this.timeToNext = 4
      }
    }

    this.textData.textId = textId
    super.show(true)
    this.visible = true
  }
  //Mostrar siguiente Dialogo
  showNextText() {
    const text = getTextData(this.textData.dialogId, this.textData.textId)
    if (text && text.callback) {
      text.callback()
    }
    if (getTextData(this.textData.dialogId, this.textData.textId + 1)
      && (!text || !text.bEndDialog)
    ) {
      this.textData.textId = this.textData.textId + 1
      this.setText(this.textData)
    }
    else {
      this.callback()
      if (this.bHideWhenEnded) {
        this.show(false)
      }
    }

  }


  //Seleccionar dialogo de texto
  setText(textData: TextData, bWithDelay: boolean = true) {

    if (getTextData(this.dialogIndex, this.textData.textId).bIsComfirmText) {
      this.setComfirmText(this.textData)
    }
    super.setText(textData, bWithDelay)
    //swap portrait
    this.setFaceImage(getTexture(this.textData.dialogId, this.textData.textId))
    if (!bWithDelay) {
      this.setNextAutoSkip()
      this.lastTextMessage()
    }
  }
  //Seleccionar dialogo de texto "maquina de escribir"
  setTextWithDelay(finalText: string, currentText: string = "") {
    super.setTextWithDelay(finalText, currentText)
    if (currentText.length >= finalText.length) {
      this.bWritingText = false
      clearDelay(this.timeoutNextChar)
      this.timeoutNextChar = null
      this.setNextAutoSkip()
      this.lastTextMessage()
    }

  }
  //Activa pasar al siguiente texto de un mismo dialogo automaticamente
  isAutoSkip() {
    return this.skipMode == SkipMode.Auto || this.skipMode == SkipMode.AutoAndClick || this.skipMode == SkipMode.ClickAndOnlyEndAuto
  }
  setSkipMode(skipMode: SkipMode) {
    this.skipMode = skipMode
    if (this.isAutoSkip()) {
      //Skip when finish text after 4s
      this.timeToNext = 8
    }
  }
  private setNextAutoSkip() {
    if (!this.isAutoSkip()) {
      return;
    }
    if (this.skipMode == SkipMode.ClickAndOnlyEndAuto && !getTextData(this.textData.dialogId, this.textData.textId)?.bEndDialog) {
      return;
    }
    clearDelay(this.timeoutNextText)
    let self = this
    this.timeoutNextText = delay(() => {
      self.showNextText()
    }, this.timeToNext * 1000);

  }
  private setClickEvent() {
    //Skip with click
    let self = this
    if (!self.inputInstance) {
      self.inputInstance = Input.instance
      self.createClickWg()
    }
    delay(() => {
      self.inputUnsubscribe = self.inputInstance.subscribe("BUTTON_DOWN", ActionButton.POINTER, false, e => {
        if (self.bWritingText) {
          self.bWritingText = false
          clearDelay(self.timeoutNextChar)
          self.timeoutNextChar = null
          self.setText(self.textData, false)
          AudioManager.instance().stop("chatbox")

        }
        else if (!getTextData(self.textData.dialogId, self.textData.textId).bIsComfirmText) {
          self.showNextText()
        }
      })
    }, 100)
  }
  private lastTextMessage() {

    if (getTextData(this.textData.dialogId, this.textData.textId)
      && (getTextData(this.textData.dialogId, this.textData.textId).bEndDialog || getTextData(this.textData.dialogId, this.textData.textId).bIsComfirmText)
    ) {
      if ((this.bHideWhenEnded && this.wgTextControlls.childrenWidget[0].container as UIText) && !getTextData(this.textData.dialogId, this.textData.textId).bIsComfirmText) {
        (this.wgTextControlls.childrenWidget[0].container as UIText).value = ": Close"
        this.wgTextControlls.show(true)
      }
      else {
        this.wgTextControlls.show(false)
      }
    }
    else {
      (this.wgTextControlls.childrenWidget[0].container as UIText).value = ": Next"
      this.wgTextControlls.show(true)
    }
  }
  //Propiedades del texto de los botones
  setComfirmText(textData: TextData) {
    if (!this.comfirmWg) {
      this.comfirmWg = new WidgetComfirm(this)
      this.comfirmWg.bVisibleWithParent = false
      this.childrenWidget.push(this.comfirmWg)
    }

    let self = this
    let text = getTextData(textData.dialogId, textData.textId)
    if (text.comfirmText) {
      self.comfirmWg.comfrimTextUI.value = text.comfirmText.en
      if (text.comfirmText.fontSize) {
        self.comfirmWg.comfrimTextUI.fontSize = text.comfirmText.fontSize
      }
    }
    else {
      self.comfirmWg.comfrimTextUI.value = 'YES'
      self.comfirmWg.comfrimTextUI.fontSize = 20
    }
    if (text.cancelText) {
      self.comfirmWg.cancelTextUI.value = text.cancelText.en
      if (text.cancelText.fontSize) {
        self.comfirmWg.cancelTextUI.fontSize = text.cancelText.fontSize
      }
    }
    else {
      self.comfirmWg.cancelTextUI.value = 'NO'
      self.comfirmWg.cancelTextUI.fontSize = 20
    }

    self.comfirmWg.comfirmFunction = function () {
      if (text.comfirmFunction) {
        text.comfirmFunction()
      }

      self.comfirmWg.unsubscribeInputs()
      if (text.comfirmTextIndex > 0) {
        self.textData.textId = text.comfirmTextIndex
        self.setText(self.textData)
      }

    }
    self.comfirmWg.cancelFunction = function () {
      if (text.cancelFunction) {
        text.cancelFunction()
      }
      self.comfirmWg.unsubscribeInputs()
      if (text.cancelTextIndex > 0) {
        self.textData.textId = text.cancelTextIndex
        self.setText(self.textData)
      }
    }
    this.setContainerTextPos("32%")
    this.comfirmWg.show(true)
  }
}
