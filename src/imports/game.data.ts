
export class GameData {

    varData: { [key: string]: any } = {};
    entityData: { [key: string]: IEntity } = {};
    entityArrayData: { [key: string]: IEntity[] } = {};
    callbacks: { [key: string]: Function } = {};

    private static instanceRef: GameData;

    private constructor() { }
    // Singleton Instance of the Object
    static instance(): GameData { return this.instanceRef || (this.instanceRef = new this()); }

    private addTagToEntity(entity: IEntity, tag: string): void {
        if (!entity["pmtags"]) {
            entity["pmtags"] = {};
        }
        entity["pmtags"][tag] = tag;
    }

    entityHasTag(entity: IEntity, tag: string): boolean {
        if (!entity["pmtags"]) {
            return false;
        }
        return entity["pmtags"][tag] === tag;
    }

    getEntityTags(entity: IEntity): string[] {
        if (!entity["pmtags"]) {
            return [];
        }
        return Object.keys(entity["pmtags"]);
    }

    getVar(name: string): any {
        if (!this.varData[name] && DebugAccess.instance().hasDebug()) {
            DebugAccess.instance().log("Variable not found: " + name, LogType.ERROR);
        }

        return this.varData[name];
    }

    setVar(name: string, value: any): void {
        this.varData[name] = value;
    }

    getEntity(name: string): IEntity {
        if (!this.entityData[name] && DebugAccess.instance().hasDebug()) {
            DebugAccess.instance().log("Entity not found: " + name, LogType.ERROR);
        }
            
        return this.entityData[name];
    }

    setEntity(name: string, entity: IEntity): void {
        this.addTagToEntity(entity, name);
        this.entityData[name] = entity;
    }

    getEntityArray(name: string): IEntity[] {
        if (!this.entityArrayData[name] && DebugAccess.instance().hasDebug()) {
            DebugAccess.instance().log("Entity array not found: " + name, LogType.ERROR);
        }
        
        return this.entityArrayData[name];
    }

    addEntityArray(name: string, entity: IEntity): void {
        if (!this.entityArrayData[name]) {
            this.entityArrayData[name] = [];
        }
        this.addTagToEntity(entity, name);
        this.entityArrayData[name].push(entity);
    }

    callCallback(name: string, ...args: any[]): void {
        if (this.callbacks[name]) {
            this.callbacks[name](...args);
        }
    }

    getCallback(name: string): Function {
        return this.callbacks[name];
    }

    setCallback(name: string, callback: Function): void {
        this.callbacks[name] = callback;
    }

}
