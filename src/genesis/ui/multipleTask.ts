import { Widget } from "src/imports/index";
import { ImageProperties } from "src/imports/widgets/widgets";

class TaskData {
  text: string;
  status: boolean;
}

const TASKINFO: TaskData[] = [
  {
    text: "Help Bezier with the moves.",
    status: false
  },
  {
    text: "Help Mat with the meshes.",
    status: false
  },
  {
    text: "Help Kit with the connection.",
    status: false
  },
]
//This is the UI for the multiple tasks that appears on the right side of the screen
export class MultipleTasks extends Widget {
  taskBoxImage: UIImage
  checkTexture: Texture
  taskBoxLargeTexture: Texture
  checkBoxTexture: Texture
  checkBoxImageConfig: ImageProperties
  checkImageConfig: ImageProperties
  tasksSpaceLining: number
  infoContainer: UIContainerRect
  tasksContainer: UIContainerStack

  taskText: UIText[] = []
  checkImages: UIImage[] = []
  checkBoxImages: UIImage[] = []

  auxcontainer: UIContainerRect

  constructor(parentUI: Widget | UIShape) {
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
    container.positionY = "-14%"
    container.positionX = "4.2%"
    //container.color = Color4.Gray()
    super(parentUI, container)

    //Containder that contains the extra info of each mission is the questType is Multiple
    this.infoContainer = new UIContainerRect(this.container)
    this.infoContainer.visible = true
    this.infoContainer.vAlign = 'center'
    this.infoContainer.hAlign = 'center'
    this.infoContainer.width = '90%'
    this.infoContainer.height = '26%'
    this.infoContainer.positionY = "6%"
    this.infoContainer.positionX = "0%"


    //Image Configurations
    this.checkImageConfig = {
      src: "assets/ui/UI_Tasks_Tick.png",
      sourceWidth: 50,
      sourceHeight: 50,
      width: 50 * 0.45,
      height: 50 * 0.45,
    }

    this.checkBoxImageConfig = {
      src: "assets/ui/UI_Tasks_Box.png",
      sourceWidth: 50,
      sourceHeight: 50,
      width: 50 * 0.5,
      height: 50 * 0.5,
    }

    //Texture configurations
    try {
      this.checkTexture = new Texture(this.checkImageConfig.src)
    } catch (error) {
      //console_log(error)
      this.checkTexture = new Texture("")
    }

    try {
      this.checkBoxTexture = new Texture(this.checkBoxImageConfig.src)
    } catch (error) {
      //console_log(error)
      this.checkBoxTexture = new Texture("")
    }


    this.auxcontainer = new UIContainerRect(this.container)
    this.auxcontainer.visible = true
    this.auxcontainer.name = 'questBoxContainer'
    this.auxcontainer.width = 280
    this.auxcontainer.height = 150
    this.auxcontainer.positionX = "-30%"//-80//"-11%"// percent was causing text off screen on narrow windows
    this.auxcontainer.positionY = "50%"
    this.auxcontainer.vAlign = 'center'
    this.auxcontainer.hAlign = 'center'
    this.auxcontainer.color = new Color4(0, 0, 0, 0.5)

    var title = new UIText(this.auxcontainer)
    title.value = "Explore the island"
    title.fontSize = 18
    title.font = new Font(Fonts.SansSerif_Bold)
    title.color = new Color4(1, 1, 1)
    title.vAlign = 'top'
    title.hAlign = 'left'
    //title.positionX = "7%" //padding is what is wanted
    title.paddingLeft = 10
    title.positionY = -15
    title.hTextAlign = "left"
    title.vTextAlign = "top"

    this.setTasks()
    this.show(false)
  }

  setTasks() {
    const paddingY = -32

    for (let i = 0; i < TASKINFO.length; i++) {
      this.taskText.push(this.setTaskTextProperties(i, paddingY * i))
      this.checkBoxImages.push(this.setCheckBoxImage(paddingY * i))
      this.checkImages.push(this.setCheckImage(TASKINFO[i].status, paddingY * i))
    }

  }

  setTaskTextProperties(index: number, paddingY: number) {
    var taskText = new UIText(this.auxcontainer)
    taskText.value = TASKINFO[index].text
    taskText.fontSize = 14
    taskText.font = new Font(Fonts.SansSerif)
    taskText.color = new Color4(1, 1, 1)
    taskText.vAlign = 'top'
    taskText.hAlign = 'left'
    taskText.positionX = 40
    taskText.positionY = -50 + paddingY
    taskText.hTextAlign = "left"
    taskText.vTextAlign = "top"

    return taskText
  }

  setCheckBoxImage(paddingY: number) {
    var checkBoxImage = new UIImage(this.auxcontainer, this.checkBoxTexture)
    checkBoxImage.vAlign = 'top'
    checkBoxImage.hAlign = 'left'
    checkBoxImage.positionX = 15
    checkBoxImage.positionY = -46 + paddingY
    checkBoxImage.width = this.checkBoxImageConfig.width
    checkBoxImage.height = this.checkBoxImageConfig.height
    checkBoxImage.sourceWidth = this.checkBoxImageConfig.sourceWidth
    checkBoxImage.sourceHeight = this.checkBoxImageConfig.sourceHeight
    checkBoxImage.visible = true

    return checkBoxImage
  }

  setCheckImage(status: boolean, paddingY: number) {
    var checkImage = new UIImage(this.auxcontainer, this.checkTexture)
    checkImage.vAlign = 'top'
    checkImage.hAlign = 'left'
    checkImage.positionX = 14
    checkImage.positionY = -48 + paddingY
    checkImage.width = this.checkImageConfig.width
    checkImage.height = this.checkImageConfig.height
    checkImage.sourceWidth = this.checkImageConfig.sourceWidth
    checkImage.sourceHeight = this.checkImageConfig.sourceHeight
    checkImage.visible = status

    return checkImage
  }

  showTick(index: number) {
    this.checkImages[index].visible = true
  }
}