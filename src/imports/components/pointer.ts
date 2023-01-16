import { ActivableBasic, Activator, IActivable } from "../activator/activator";

export type PmOnPointerOptions = {
    activables?: IActivable[];
    callbacks?: ((event?: any)=> void)[]
}


abstract class PmOnPointer extends Activator implements IPmComponent{
    entity: Entity
    entities: IEntity[] = [];
    onPointer: OnPointerDown | OnPointerUp | OnPointerHoverEnter | OnPointerHoverExit
    activables: IActivable[];
    bEnabled: boolean;
    protected options: OnPointerUUIDEventOptions & PmOnPointerOptions
    constructor(entity: Entity, options?: OnPointerUUIDEventOptions & PmOnPointerOptions){
        super();
        this.entity = entity;
        this.activables = [];
        this.bEnabled = true;
        this.options = options

        if (options && options.callbacks && options.callbacks.length > 0) {
            for (let i = 0; i < options.callbacks.length; i++) {
                this.addActivable(new ActivableBasic(options.callbacks[i]));
            }
        } 
        if (options && options.activables && options.activables.length > 0) {
            for (let i = 0; i < options.activables.length; i++) {
                this.addActivable(options.activables[i]);
            }
        } 
        ////////   IS CLICKED? HOW TO GET TIMES CLICKED

        this.setPointer()
    }
    addCallback(callback: (event: IEvents['pointerDown'])=> void){
        this.addActivable(new ActivableBasic(callback));
    }
    enable(bEnable: boolean): void {
        super.enable(bEnable);
        if (bEnable) {
            this.entity.addComponentOrReplace(this.onPointer);
        }
        else this.entity.removeComponent(this.onPointer);
    }

    protected abstract setPointer(): void;
    //Remove PmOnPointer from entity
    removeFromEntity(entity: IEntity): void {
        if (!entity.hasComponent(getComponentName(this))) {
            return;
        }
        //Remove PmOnPointer
        entity.removeComponent(getComponentName(this));
        //Remove OnPointer
        if (entity.hasComponent(getComponentName(this.onPointer))) entity.removeComponent(getComponentName(this.onPointer));

        //Remove entity from array
        const index = indexOfEntity(this.entities, entity);
        if (index!==-1) this.entities.splice(index, 1);
        
    }
    //Add PmOnPointer to entity, keep existing PmOnPointer Activables if it exists
    addToEntity(entity: IEntity): void {
        //If PmOnPointer is already added to entity, add old activables to new Activator
        if (entity.hasComponent(getComponentName(this))) {
            this.addActivables(entity.getComponent(getComponentName(this)).activables);
        }
        //If Not previous PmOnPointer & OnPointer is already added to entity, add OnPointer callback to new PmOnPointer
        else if (entity.hasComponent(getComponentName(this.onPointer)) && entity.getComponent(getComponentName(this.onPointer)).callback) {
            this.addCallback(entity.getComponent(getComponentName(this.onPointer)).callback)
        }

        //Add new PmOnPointer
        entity.addComponentOrReplace(this.onPointer);
        entity.addComponentOrReplace(this);

        //Add entity to array
        if (indexOfEntity(this.entities, entity)==-1) {
            this.entities.push(entity);
        }

    }
}


@Component('PmOnPointerDown')
export class PmOnPointerDown extends PmOnPointer{
    onPointer: OnPointerDown
    timesClicked:number = 0  //ADDED TO TRACK CLICKS
    protected setPointer(){
        this.onPointer = new OnPointerDown(
            (event: IEvents['pointerDown'])=>{
                this.exec(event)
                this.timesClicked++   //ADDED TO TRACK CLICKS
            }, 
            this.options
        );
    }
}

@Component('PmOnPointerUp')
export class PmOnPointerUp extends PmOnPointer{
    onPointer: OnPointerUp
    timesClicked:number = 0  //ADDED TO TRACK CLICKS
    protected setPointer(){
        this.onPointer = new OnPointerUp(
            (event: IEvents['pointerUp'])=>{
                this.exec(event)
                this.timesClicked++   //ADDED TO TRACK CLICKS
            }, 
            this.options
        );
    }
}

@Component('PmOnPointerHoverEnter')
export class PmOnPointerHoverEnter extends PmOnPointer{
    onPointer: OnPointerHoverEnter
    timesClicked:number = 0  //ADDED TO TRACK CLICKS
    protected setPointer(){
        this.onPointer = new OnPointerHoverEnter(
            ()=>{
                this.exec()
                this.timesClicked++   //ADDED TO TRACK CLICKS
            }, 
            this.options
        );
    }
}

@Component('PmOnPointerHoverExit')
export class PmOnPointerHoverExit extends PmOnPointer{
    onPointer: OnPointerHoverExit
    timesClicked:number = 0  //ADDED TO TRACK CLICKS
    constructor(entity: Entity, options?: PmOnPointerOptions){
        super(entity, options);
    }
    protected setPointer(){
        this.onPointer = new OnPointerHoverExit(
            ()=>{
                this.exec()
                this.timesClicked++
            }
        );
    }
}
