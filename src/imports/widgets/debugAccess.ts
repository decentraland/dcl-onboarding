
enum LogType {
    LOG = 0,
    WARN = 1,
    ERROR = 2,
}

class DebugAccess {
    private static instanceRef: DebugAccess;
    public static instance(): DebugAccess { return this.instanceRef || (this.instanceRef = new this()); }
    private constructor() {}

    static readonly LogType = LogType;
    private wgDebugs: ((text: string, type: LogType) => void)[] = [];

    addWidgetDebug(callback: (text: string, type: LogType)=>void) {
        this.wgDebugs.push(callback);
        return this.wgDebugs.length - 1;
    }
    removeWidgetDebug(index: number) {
        this.wgDebugs.splice(index, 1);
    }

    log(text: string, type: LogType = LogType.LOG) {
        
        this.wgDebugs.forEach((wgLog) => {       
            wgLog(text, type);
        });
    }

    hasDebug() {
        return this.wgDebugs.length > 0;
    }
}