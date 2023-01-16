import { Widget } from "./widgets"




export class DebugUI extends Widget {

    private _logText: UIText
    private _errorText: UIText
    private _warnText: UIText

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
        containerBig.vAlign = 'bottom'
        containerBig.hAlign = 'left'
        containerBig.width = 270 
        containerBig.height = 150
        containerBig.positionX = "4.5%"
        containerBig.positionY = "18%"
        containerBig.color = new Color4(1,1,1,0.2)
        containerBig.isPointerBlocker = true

        super(parentUI, containerBig)

        this._logText = new UIText(containerBig)
        this._logText.value = "Log Started"
        this._logText.fontSize = 14
        this._logText.color = Color4.Black()
        this._logText.vAlign = 'top'
        this._logText.hAlign = 'left'
        this._logText.positionX = "0%"
        this._logText.positionY = "0%"
        this._logText.width = "100%"
        this._logText.height = "100%"

        this._errorText = new UIText(containerBig)
        this._errorText.value = ""
        this._errorText.fontSize = 14
        this._errorText.color = Color4.Red()
        this._errorText.vAlign = 'top'
        this._errorText.hAlign = 'left'
        this._errorText.positionX = "0%"
        this._errorText.positionY = "0%"
        this._errorText.width = "100%"
        this._errorText.height = "100%"

        this._warnText = new UIText(containerBig)
        this._warnText.value = ""
        this._warnText.fontSize = 14
        this._warnText.color = Color4.Yellow()
        this._warnText.vAlign = 'top'
        this._warnText.hAlign = 'left'
        this._warnText.positionX = "0%"
        this._warnText.positionY = "0%"
        this._warnText.width = "100%"
        this._warnText.height = "100%"

        DebugAccess.instance().addWidgetDebug((text: string, type: LogType = LogType.LOG) => {
            this.log(text, type);
        })
        this.show(false)
    }

    log(text: string, type: LogType = LogType.LOG) {
        switch (type) {
  
            case LogType.WARN:
                this._logText.value += " \n "
                this._errorText.value += " \n "
                this._warnText.value += "\n " + text
                break;
            case LogType.ERROR:
                this._logText.value += " \n "
                this._warnText.value += " \n "
                this._errorText.value += "\n " + text
                break;
            default:
                this._logText.value += "\n " + text
                this._errorText.value += " \n "
                this._warnText.value += " \n "
                break;
        }
        
    }



}