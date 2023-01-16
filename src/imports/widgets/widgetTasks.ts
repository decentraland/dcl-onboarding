//import { AudioManager } from 'src/audio/audioManager'
import { getTasksTexts, getObjective, getTaskLength, checkCompleted, setObjectiveCompleted, getObjectiveInfo, setCompleted } from '../../jsonData/tasksTexts'
import { delay, clearDelay } from '../index'
import { ImageProperties, Widget } from './widgets'

export enum TaskType {
  Multiple = 0,
  Simple = 1,
}


export class WidgetTasksBox extends Widget {
  taskBoxImage: UIImage
  textUI: UIText[] = []
  infoUI: UIText[] = []
  checkImage: UIImage[] = []
  checkBoxImage: UIImage[] = []
  //openButtonImage: UIImage
  openTexture: Texture
  closeTexture: Texture
  checkTexture: Texture
  taskBoxLargeTexture: Texture
  taskBoxSmallTexture: Texture
  taskBoxMediumTexture: Texture
  checkBoxTexture: Texture
  taskId: number
  checkBoxImageConfig: ImageProperties
  checkImageConfig: ImageProperties
  tasksSpaceLining: number
  infoContainer: UIContainerRect
  tasksContainer: UIContainerStack

  auxcontainer: UIContainerRect

  constructor(parentUI: Widget | UIShape, questId: number
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

    //Container that contains all content
    var container = new UIContainerRect(parent)
    container.visible = true
    container.vAlign = 'top'
    container.hAlign = 'right'
    container.width = '20%'
    container.height = '20%'
    container.positionY = "-12%"
    container.positionX = "4.2%"
    //container.color = Color4.Red()
    //container.opacity = 0.5
    super(parentUI, container)

    //Containder that contains the extra info of each mission is the questType is Simple
    this.infoContainer = new UIContainerRect(this.container)
    this.infoContainer.visible = true
    this.infoContainer.vAlign = 'center'
    this.infoContainer.hAlign = 'center'
    this.infoContainer.width = '90%'
    this.infoContainer.height = '26%'
    this.infoContainer.positionY = "6%"
    this.infoContainer.positionX = "0%"
    //this.infoContainer.color = new Color4(0,0,0,0.5)
    //this.infoContainer.opacity = 0.5

    //Image Configurations
    this.checkImageConfig = {
      src: "assets/ui/UI_Tasks_Tick.png",
      sourceWidth: 50,
      sourceHeight: 50,
      width: 50 * 0.45,
      height: 50 * 0.45,
      positionX: "16%",
      positionY: "-48%"
    }

    this.checkBoxImageConfig = {
      src: "assets/ui/UI_Tasks_Box.png",
      sourceWidth: 50,
      sourceHeight: 50,
      width: 50 * 0.5,
      height: 50 * 0.5,
      positionX: "16%"
    }

    this.taskId = questId

    //Texture configurations
    try {
      this.checkTexture = new Texture(this.checkImageConfig.src)
    } catch (error) {
      // console_log(error)
      // this.checkTexture = new Texture("")
    }

    try {
      this.checkBoxTexture = new Texture(this.checkBoxImageConfig.src)
    } catch (error) {
      // console_log(error)
      // this.checkBoxTexture = new Texture("")
    }

    this.auxcontainer = new UIContainerRect(this.container)
    this.auxcontainer.visible = true
    this.auxcontainer.name = 'questBoxContainer'
    this.auxcontainer.width = 280
    this.auxcontainer.height = 80
    this.auxcontainer.positionX = "-11%"
    this.auxcontainer.positionY = "50%"
    this.auxcontainer.vAlign = 'center'
    this.auxcontainer.hAlign = 'center'
    this.auxcontainer.color = new Color4(0, 0, 0, 0.5)

  }
}

export class WidgetTasks extends WidgetTasksBox {
  objectiveId: number = 0;
  canSetNex: boolean = true
  taskType: TaskType

  private setOtherTaskTimeout: any

  constructor(taskType: TaskType, parentUI: Widget | UIShape, taskId: number) {
    super(parentUI, taskId)
    this.taskType = taskType

    this.setText()
  }

  setText() {
    let auxPositionX = "19%"
    let auxPositionY = "-47%"
    let visibility: boolean = false

    if (this.taskType == TaskType.Simple) {
      this.tasksSpaceLining = 0
      //this.taskBoxImage.source = this.taskBoxMediumTexture
      visibility = false
    } else {
      this.tasksSpaceLining = 28
      // this.taskBoxImage.source = this.taskBoxLargeTexture
      visibility = true
    }

    if (getTaskLength(this.taskId) == undefined) {
      // console_log("Quest does not exist")
      return;
    }

    for (let i = 0; i < getTaskLength(this.taskId); i++) {


      this.checkBoxImage[i] = new UIImage(this.auxcontainer, this.checkBoxTexture)
      this.checkBoxImage[i].visible = visibility
      this.checkBoxImage[i].name = 'checkBoxImage' + i
      this.checkBoxImage[i].sourceWidth = this.checkBoxImageConfig.sourceWidth
      this.checkBoxImage[i].sourceHeight = this.checkBoxImageConfig.sourceHeight
      this.checkBoxImage[i].width = this.checkBoxImageConfig.width
      this.checkBoxImage[i].height = this.checkBoxImageConfig.height
      this.checkBoxImage[i].positionX = 15
      this.checkBoxImage[i].positionY = -38
      this.checkBoxImage[i].vAlign = 'top'
      this.checkBoxImage[i].hAlign = 'left'

      this.checkImage[i] = new UIImage(this.auxcontainer, this.checkTexture)
      this.checkImage[i].visible = checkCompleted(this.taskId, i)
      this.checkImage[i].name = 'checkImage' + i
      this.checkImage[i].sourceWidth = this.checkImageConfig.sourceWidth
      this.checkImage[i].sourceHeight = this.checkImageConfig.sourceHeight
      this.checkImage[i].width = this.checkImageConfig.width
      this.checkImage[i].height = this.checkImageConfig.height
      this.checkImage[i].positionX = 14
      this.checkImage[i].positionY = -40
      this.checkImage[i].vAlign = 'top'
      this.checkImage[i].hAlign = 'left'

      this.textUI[i] = new UIText(this.auxcontainer)
      this.textUI[i].visible = visibility
      this.textUI[i].value = "<b>" + getObjective(this.taskId, i, 'en') + "</b>"
      this.textUI[i].font = new Font(Fonts.SansSerif)
      this.textUI[i].fontSize = getTasksTexts(this.taskId, i).fontSize
      this.textUI[i].color = Color4.White()
      this.textUI[i].vAlign = 'top'
      this.textUI[i].hAlign = 'left'
      this.textUI[i].positionX = "7%"
      this.textUI[i].positionY = -15
      this.textUI[i].hTextAlign = "left"
      this.textUI[i].vTextAlign = "top"

      if (this.taskType == TaskType.Simple) {
        this.infoUI[i] = new UIText(this.auxcontainer)
        this.infoUI[i].visible = visibility
        this.infoUI[i].value = getObjectiveInfo(this.taskId, i, 'en')
        this.infoUI[i].font = new Font(Fonts.SansSerif)
        this.infoUI[i].fontSize = getTasksTexts(this.taskId, i).fontSize
        this.infoUI[i].color = Color4.White()
        this.infoUI[i].vAlign = 'top'
        this.infoUI[i].hAlign = 'left'
        this.infoUI[i].positionX = 40
        this.infoUI[i].positionY = -40
        this.infoUI[i].hTextAlign = "left"
        this.infoUI[i].vTextAlign = "top"
        this.infoUI[i].width = "80%"
        this.infoUI[i].height = "100%"
        this.infoUI[i].textWrapping = true
      }
    }

    if (this.taskType == TaskType.Multiple) {
      return
    }
    this.checkBoxImage[this.objectiveId].visible = true
    this.textUI[this.objectiveId].visible = true
    this.infoUI[this.objectiveId].visible = true
  }

  //If quest type is Simple, use this function to mark the mission as completed and pass to the next one
  setNextText() {
    if (this.canSetNex) {
      this.canSetNex = false
      this.objectiveId += 1
      if (getObjective(this.taskId, this.objectiveId, 'en') == "") {
        this.checkImage[this.objectiveId - 1].visible = true
        delay(() => {
          this.container.visible = false
        }, 1500)
        return
      }
      this.checkImage[this.objectiveId - 1].visible = true
      setObjectiveCompleted(this.taskId, this.objectiveId - 1)
      delay(() => {
        this.canSetNex = true
        this.checkImage[this.objectiveId - 1].visible = false
        this.textUI[this.objectiveId - 1].visible = false
        this.infoUI[this.objectiveId - 1].visible = false
        this.checkBoxImage[this.objectiveId - 1].visible = false
        this.textUI[this.objectiveId].visible = true
        this.checkBoxImage[this.objectiveId].visible = true
        this.infoUI[this.objectiveId].visible = true
      }, 1500)
    }
  }

  //If quest type is Multiple, use this function to mark one of teh missions as completed
  showTick(objectiveId: number, visibility: boolean, callback?: Function) {
    if (this.checkImage[objectiveId] == null) {
      // console_log("No mission")
      return
    }
    this.checkImage[objectiveId].visible = visibility

    setObjectiveCompleted(this.taskId, objectiveId)
    if (callback) {
      callback()
    }
  }

  //Use this function to update the text value of a mission
  updadeMissionInfo(missionId: number, variable: string | number, callback?: Function) {
    this.textUI[missionId].value = variable + getObjective(this.taskId, missionId, 'en')
    if (callback) {
      callback()
    }
  }

  //Functions used by the openButtonImage to hide and show the tasks
  hideTasks() {
    if (!this.canSetNex) {
      return
    }
    if (this.taskType == TaskType.Multiple) {
      for (let i = 0; i < getTaskLength(this.taskId); i++) {
        this.checkImage[i].visible = false
        this.checkBoxImage[i].visible = false
        this.textUI[i].visible = false
      }
    } else {
      this.checkImage[this.objectiveId].visible = false
      this.checkBoxImage[this.objectiveId].visible = false
      this.textUI[this.objectiveId].visible = false
      this.infoUI[this.objectiveId].visible = false
    }

  }

  showTasks() {
    if (this.taskType == TaskType.Multiple) {
      for (let i = 0; i < getTaskLength(this.taskId); i++) {
        this.checkBoxImage[i].visible = true
        this.textUI[i].visible = true
        if (checkCompleted(this.taskId, i)) {
          this.checkImage[i].visible = true
        } else {
          this.checkImage[i].visible = false
        }
      }
    } else {
      this.taskBoxImage.source = this.taskBoxMediumTexture
      this.checkBoxImage[this.objectiveId].visible = true
      this.textUI[this.objectiveId].visible = true
      this.infoUI[this.objectiveId].visible = true
      if (checkCompleted(this.taskId, this.objectiveId)) {
        this.checkImage[this.objectiveId].visible = true
      } else {
        this.checkImage[this.objectiveId].visible = false
      }
    }
  }

  setOtherTask(taskId: number) {
    if (this.setOtherTaskTimeout) {
      clearDelay(this.setOtherTaskTimeout);
      this.setOtherTaskTimeout = null;
    }
    this.hideTasks()
    this.taskId = taskId
    this.setText()
  }
  /**
   * 
   * @param taskId 
   * @param time  in seconds
   */
  setOtherTaskDelay(taskId: number, time: number) {
    if (this.setOtherTaskTimeout) {
      clearDelay(this.setOtherTaskTimeout);
      this.setOtherTaskTimeout = null;
    }
    this.setOtherTaskTimeout = delay(() => {
      this.hideTasks()
      this.taskId = taskId
      this.setText()
    }, time * 1000)
  }

  resetTasks(questId: number) {
    for (let i = 0; i < getTaskLength(questId); i++) {
      setCompleted(questId, i, false)
      this.checkImage[i].visible = false
    }
  }

  setVisibility(visibility: boolean) {
    this.container.visible = visibility
  }

  setPaddingY(padding: string) {
    this.container.positionY = padding
  }
  setPaddingX(padding: string) {
    this.container.positionX = padding
  }
}

