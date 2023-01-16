import * as utils from '@dcl/ecs-scene-utils'


export class TranslationEffectComponent {
    // Custom parameters - opacity between 0 and 1
    enterColor: Color4;
    exitColor?: Color4;
    opactiyReductionRate: number;
    tpTimeDelay: number;
    maxOpacity: number;
    entityScreenChanged: Entity;
    canvas: UICanvas;
    uiContainerRect: UIContainerRect;

    constructor(color: Color4, tpTime: number, maxOpacity: number, color2?: Color4) {
        this.enterColor = color;
        this.tpTimeDelay = tpTime;
        this.exitColor = color2;
        this.maxOpacity = maxOpacity;
        this.opactiyReductionRate = (this.maxOpacity / this.tpTimeDelay) * 250;
        this.entityScreenChanged = new Entity();
        engine.addEntity(this.entityScreenChanged);
        this.canvas = new UICanvas()
        this.uiContainerRect = new UIContainerRect(this.canvas)
        this.uiContainerRect.isPointerBlocker = false;
        // this.createTheEffect();
    }

    setFadeTime(newTime: number){
        this.tpTimeDelay = newTime;
        this.opactiyReductionRate = (this.maxOpacity / this.tpTimeDelay) * 250;
    }

    fadeInWithDistance(target: Vector3, maxDistance: number, minDistance: number = 0): void {
        this.uiContainerRect.opacity = 0
        this.canvas.visible = true;
        this.uiContainerRect.width = "150%";
        this.uiContainerRect.height = "150%";
        this.uiContainerRect.color = this.enterColor
        this.entityScreenChanged.addComponentOrReplace(new utils.Interval(50, () => {
            this.uiContainerRect.opacity = clamp(lerp(1, 0, (Vector3.Distance(target, Camera.instance.position)-minDistance) / (maxDistance-minDistance)), 0, 1)
        }))
    }

    stopFadeIn(){
        this.entityScreenChanged.removeComponent(utils.Interval);
    }

    fadeIn(newTime?: number){
        if (newTime) {
            this.setFadeTime(newTime)
        }
        this.uiContainerRect.opacity = 0
        this.canvas.visible = true;
        this.uiContainerRect.width = "150%";
        this.uiContainerRect.height = "150%";
        this.uiContainerRect.color = this.enterColor
        this.entityScreenChanged.addComponentOrReplace(new utils.Interval(100, () => {
            this.increaseOpacity(this.uiContainerRect)
            if (this.uiContainerRect.opacity>=this.maxOpacity && this.entityScreenChanged.hasComponent(utils.Interval)) {
                this.entityScreenChanged.removeComponent(utils.Interval)
            }
        }))
    }
    fadeOut(newTime?: number){
        if (newTime) {
            this.setFadeTime(newTime)
        }
        this.uiContainerRect.opacity = 1
        this.canvas.visible = true;
        this.uiContainerRect.width = "150%";
        this.uiContainerRect.height = "150%";
        this.uiContainerRect.color = this.enterColor
        this.entityScreenChanged.addComponentOrReplace(new utils.Interval(100, () => {
            this.reduceOpacity(this.uiContainerRect)
            if (this.uiContainerRect.opacity<=0) {
                this.canvas.visible = false
                this.canvas.opacity = 0
                if (this.entityScreenChanged.hasComponent(utils.Interval)) {
                    this.entityScreenChanged.removeComponent(utils.Interval)
                }
                
            }
        }))
    }


    completeTranslationEffect(): void {
        // Create the container for the canvas

        // Making canvas visible
        this.canvas.visible = true;
        // Properties of the container - The color will be the enter color passed in the constructor
        this.uiContainerRect.width = "150%";
        this.uiContainerRect.height = "150%";
        this.uiContainerRect.color = this.enterColor
        // At the begining the container wont be visible
        this.uiContainerRect.opacity = 0

        this.entityScreenChanged.removeComponent(utils.Interval);
        // ------------------------------------- FADE IN EFFECT --------------------------------------------------
        // Adding interval for increasing the oppacity each 0.150s
        this.entityScreenChanged.addComponent(new utils.Interval(150, () => this.increaseOpacity(this.uiContainerRect)))
        // Once half of the time entered passed we will execute the 
        utils.setTimeout(this.tpTimeDelay / 2, () => {

            // We remove the first interval which handles the fade in effect
            this.entityScreenChanged.removeComponent(utils.Interval);
            // we change the color once the opacity reached the max value
            this.uiContainerRect.color = this.exitColor
            // The opacity will start with the value passed in the constructor
            this.uiContainerRect.opacity = this.maxOpacity;

            // ------------------------------------- FADE OUT EFFECT --------------------------------------------------
            // Adding interval for reducing the oppacity each 0.150s
            this.entityScreenChanged.addComponent(new utils.Interval(150, () => this.reduceOpacity(this.uiContainerRect)))
            // When the tp has been finished we remove we will handle the UI properly
            utils.setTimeout(this.tpTimeDelay / 2, () => {
                // Remove the interval created fot the fade out
                this.entityScreenChanged.removeComponent(utils.Interval);
                // We make the canvas invisible
                this.canvas.visible = false;
                // The opacity is reduced to 0 and it won be visible
                this.uiContainerRect.opacity = 0
            })
        })
    }

    completeFadeInEffect(): void {
        // Making canvas visible
        this.canvas.visible = true;

        // Properties of the container - The color will be the enter color passed in the constructor
        this.uiContainerRect.width = "150 %"
        this.uiContainerRect.height = "150 %"
        this.uiContainerRect.color = this.enterColor
        // At the begining the container wont be visible
        this.uiContainerRect.opacity = 0

        // Adding interval for increasing the oppacity each 0.150s
        this.entityScreenChanged.addComponent(new utils.Interval(250, () => this.increaseOpacity(this.uiContainerRect)))
        // Once half of the time entered passed we will execute the 
        utils.setTimeout(this.tpTimeDelay, () => {
            // We remove the first interval which handles the fade in effect
            this.entityScreenChanged.removeComponent(utils.Interval);
            // Remove the interval created fot the fade out
            this.entityScreenChanged.removeComponent(utils.Interval);
            // We make the canvas invisible
            this.canvas.visible = false;
            // The opacity is reduced to 0 and it won be visible
            this.uiContainerRect.opacity = 0
        })
    }

    completeFadeOutEffect() {
        // Making canvas visible
        this.canvas.visible = true;

        // Properties of the container - The color will be the enter color passed in the constructor
        this.uiContainerRect.width = "150 %"
        this.uiContainerRect.height = "150 %"
        this.uiContainerRect.color = this.enterColor
        // At the begining the container wont be visible
        this.uiContainerRect.opacity = this.maxOpacity

        // Adding interval for increasing the oppacity each 0.150s
        this.entityScreenChanged.addComponent(new utils.Interval(250, () => this.reduceOpacity(this.uiContainerRect)))
        // Once half of the time entered passed we will execute the 
        utils.setTimeout(this.tpTimeDelay, () => {
            // We remove the interval which handles the fade out effect
            this.entityScreenChanged.removeComponent(utils.Interval);
            // We make the canvas invisible
            this.canvas.visible = false;
            // The opacity is reduced to 0 and it won be visible
            this.uiContainerRect.opacity = 0
        })
    }


    reduceOpacity(uiContainerRect: UIContainerRect): void {
        uiContainerRect.opacity -= this.opactiyReductionRate;
    }

    increaseOpacity(uiContainerRect: UIContainerRect): void {
        uiContainerRect.opacity += this.opactiyReductionRate;
    }
}

