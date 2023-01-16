


/**
 * @MovementType Simple, Aceleration, Projectile
 */

export enum MovementType {
    Simple = "Simple",
    Aceleration = "Aceleration",
    Projectile = "Projectile",
    Lerp = "Lerp",
}
/**
 * @RotateType Left, Right, Forward, Backward, Up, Down
 */

export enum RotateType {
    Left = "Left",
    Right = "Right",
    Forward = "Forward",
    Backward = "Backward",
    Up = "Up",
    Down = "Down",
}

/**
 * @ScaleType xSide, ySide, zSide, PingPong
 */
export enum ScaleType {
    xSide = "xSide",
    ySide = "ySide",
    zSide = "zSide",
    All = "All",
    PingPong = "PingPong"
}
/**
 * @LerpSizeData 
 * @param origin: number
 * @param  target: number
 * @param  fraction: number
 */
export type LerpSizeData = {
    origin: number
    target: number
    fraction: number
}

/**
 * @interface ITween
 * @param type: any
 * @param entityToTween: Entity
 * @param speed: number
 * @param bActive: boolean
 * @param dt: number
 * @param target: any
 * @param callback?: Function
 * 
 * @functions update, activate, deactivate, setSpeed
 */
export interface ITween {
    type: any
    entityToTween: Entity
    speed: number
    bActive: boolean
    dt: number
    target: any
    callback?: Function
    update(dt: number): void
    activate(): void
    deactivate(): void
    setSpeed(speed: float): void
}
/**
 * @extends ITween
 * @interface IMovement
 * @param type :MovementType
 * @param target :Vector3
 * @param bOrientAxisToMovement :boolean
 */
export interface IMovement extends ITween {
    type: MovementType
    target: Vector3
    bOrientAxisToMovement: boolean
}
/**
 * @extends ITween
 * @interface IRotate
 * @param type :RotateType
 * @param target :Quaternion
 */
export interface IRotate extends ITween {
    type: RotateType
    target: Quaternion
}
/**
 * @extends ITween
 * @interface IScale
 * @param type :ScaleType
 * @param target :Vector3
 * @param size :number
 */
export interface IScale extends ITween {
    type: ScaleType
    target: Vector3
}


