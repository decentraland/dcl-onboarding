type TimeoutRef = any
type IntervalRef = any
type ImmediateRef = any

declare function setTimeout(callback: Function, ms: number, ...args: any[]): TimeoutRef;
declare function clearTimeout(timeout: TimeoutRef): void;
declare function setInterval(callback: (...args: any[]) => void, ms: number, ...args: any[]): IntervalRef;
declare function clearInterval(interval: IntervalRef): void;
declare function setImmediate(callback: (...args: any[]) => void, ...args: any[]): ImmediateRef;
declare function clearImmediate(immediate: ImmediateRef): void;
