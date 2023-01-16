
import { DebugUI } from "./imports/widgets/widgetDebug"
import { SkipMode, Widget, WidgetTalk } from "./imports/index"
import { TaskType, WidgetTasks } from "./imports/widgets/widgetTasks"
import { textDialogs } from './jsonData/textsData'
import { Popup } from "./genesis/ui/popupUI"
import { KeyboardUI } from "./genesis/ui/keyboardUI"
import { MultipleTasks } from "./genesis/ui/multipleTask"
import { popUpWallet } from "./genesis/ui/popUpWallet"
import { popUpControls } from "./genesis/ui/popUpControls"

var hud: HUD = null

export function getHUD() {
  if (!hud) {
    spawnHUD()
  }
  return hud
}

function spawnHUD() {
  hud = new HUD()
}
//Clase HUD, TODO aquello que queramos mostrar por pantalla estara aninado en esta clase
export class HUD {

  canvas: UICanvas

  widgets: Widget[]         //Array que almacena los widget, para llamarlos indicar el indice del metodo

  wgTalk: WidgetTalk
  wgTalkRobot: WidgetTalk
  wgQuest: WidgetTasks
  wgQuestMultiple: MultipleTasks
  debugUI: DebugUI
  wgTalkNPC1: WidgetTalk
  wgTalkNPC2: WidgetTalk
  wgTalkNPC3: WidgetTalk
  wgPopUp: Popup
  wgKeyBoard: KeyboardUI
  wgPopUpWallet: popUpWallet
  wgPopUpControls: popUpControls

  constructor() {
    this.canvas = new UICanvas()
    this.canvas.visible = true

    this.wgPopUpControls = new popUpControls(this.canvas)

    this.wgTalkRobot = new WidgetTalk(this.canvas, 1, true, SkipMode.Click, () => { }, { showFaceImage: true, faceImageConfig: { src: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png", sourceWidth: 280, sourceHeight: 280 }, textConfig: { title: "Tobor" } })
    //NPCs Islands
    this.wgTalkNPC1 = new WidgetTalk(this.canvas, 1, true, SkipMode.ClickAndOnlyEndAuto, () => { }, { showFaceImage: true, faceImageConfig: { src: "assets/ui/portraits/UI_NPC_Character_Fox_Idle.png", sourceWidth: 280, sourceHeight: 280 }, textConfig: { title: "Bezier" } })
    this.wgTalkNPC2 = new WidgetTalk(this.canvas, 1, true, SkipMode.ClickAndOnlyEndAuto, () => { }, { showFaceImage: true, faceImageConfig: { src: "assets/ui/portraits/UI_NPC_Character_Racoon1_Idle.png", sourceWidth: 280, sourceHeight: 280 }, textConfig: { title: "Mat" } })
    this.wgTalkNPC3 = new WidgetTalk(this.canvas, 1, true, SkipMode.ClickAndOnlyEndAuto, () => { }, { showFaceImage: true, faceImageConfig: { src: "assets/ui/portraits/UI_NPC_Character_Racoon1_Idle.png", sourceWidth: 280, sourceHeight: 280 }, textConfig: { title: "Kit" } })

    // this.debugUI = new DebugUI(this.canvas)
    // this.debugUI.show(true)

    this.wgPopUp = new Popup(this.canvas)
    this.wgKeyBoard = new KeyboardUI(this.canvas)
    this.wgKeyBoard.show(true)
    this.wgQuestMultiple = new MultipleTasks(this.canvas)
    this.wgPopUpWallet = new popUpWallet(this.canvas)

    //load all the callbacks
    this.loadHudCallbacks()
  }

  setWidgetQuest(questId: number, questType: TaskType) {
    this.wgQuest = new WidgetTasks(questType, this.canvas, questId)
  }
  //Seleccionar el dialogo del wgTalk, el array de texto por el que empezara la conversacion
  setWidgetDialogIndex(widget: number | WidgetTalk, newIndex: number) {
    try {
      let widgetTalk: WidgetTalk
      if (typeof widget == 'number') {
        widgetTalk = this.widgets[widget] as WidgetTalk
      }
      else {
        widgetTalk = widget as WidgetTalk
      }
      widgetTalk.dialogIndex = newIndex
      widgetTalk.dialogData = textDialogs[newIndex]
      widgetTalk.textData = {
        dialogId: newIndex,
        textId: -1
      }
    } catch (error) {

    }

  }
  //Mostrar un tiempo el dialogo con el index indicado, permite ocultar otros
  showWidgetIndex(index: number, hideOthers: boolean, showForTime: number = 0) {
    if (hideOthers) {
      this.hideAll()
    }
    if (this.widgets[index]) {
      if (showForTime > 0) {
        this.widgets[index].showForTime(true, showForTime)
      }
      else { this.widgets[index].show(true) }
    }

  }
  //Ocultar los dialogos indicados
  hideWidgetIndex(index: number) {
    if (this.widgets[index] && this.widgets[index].container.visible) {
      this.widgets[index].show(false);
    }
  }
  //Ocultar todo
  hideAll() {
    for (let i = 0; i < this.widgets.length; i++) {
      this.hideWidgetIndex(i)
    }
  }
  //Añadir wg al HUD
  addWidgetToHUD(wg: Widget): number {
    this.widgets.push(wg)
    return this.widgets.length - 1
  }

  loadHudCallbacks() {

    this.wgKeyBoard.setcallback(() => {
      this.setWidgetQuest(0, TaskType.Simple)
      this.wgQuest.show(true)
      this.wgPopUpControls.containerBig.visible = true
    })

    this.wgPopUpWallet.setLeftButtonCallback(() => {
      this.wgPopUpWallet.show(false)
      this.wgKeyBoard.image.visible = true
    })

    this.wgPopUpWallet.setRigthButtonCallback(() => {
      openExternalURL('https://docs.decentraland.org/player/blockchain-integration/get-a-wallet/')
      this.wgPopUpWallet.show(false)
      this.wgKeyBoard.image.visible = true
    })

  }

}


