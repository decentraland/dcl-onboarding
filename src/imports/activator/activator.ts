
export interface IActivator {
    activables: IActivable[];
    bEnabled: boolean;
    addActivable(activable: IActivable): void;
    addActivables(activables: IActivable[]): void
    removeActivable(activable: IActivable): void;
    enable(bEnable: boolean): void;
    exec(...args: any[]): void;
}

export interface IActivable {
    bEnabled: boolean;
    callback: (...args: any[]) => void;
    enable(bEnable: boolean): void;
    exec(...args: any[]): void;
}

export class Activator implements IActivator {
    activables: IActivable[] = [];
    bEnabled: boolean;
    constructor(activables: IActivable[] = []) {
        this.activables = activables;
        this.bEnabled = true;
    }
    addActivable(activable: IActivable): void {
        this.activables.push(activable);
    }
    addActivables(activables: IActivable[]): void {
        for (let i = 0; i < activables.length; i++) {
            this.addActivable(activables[i]);
        }
    }
    removeActivable(activable: IActivable): void {
        this.activables.splice(this.activables.indexOf(activable), 1);
    }
    enable(bEnable: boolean): void {
        this.bEnabled = bEnable;
    }
    exec(...args: any[]): void {
        for (let i = 0; i < this.activables.length; i++) {
            if (this.activables[i].bEnabled) {
                this.activables[i].exec(args);
            }
        }
    }
}

export class ActivableBasic implements IActivable {
    bEnabled: boolean;
    callback: (...args: any[]) => void;
    constructor(callback: (...args: any[]) => void = () => { }) {
        this.bEnabled = true;
        this.callback = callback;
    }
    setCallback(callback: (...args: any[]) => void): void {
        this.callback = callback;
    }
    enable(bEnable: boolean): void {
        this.bEnabled = bEnable;
    }
    exec(...args: any[]): void {
        this.callback(args);
    }
}