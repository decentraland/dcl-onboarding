//Camera mode manager and observer
export class CameraModeManager {
    private callbacksFirstPerson: Array<() => void> = []
    private callbacksThirdPerson: Array<() => void> = []
    cameraMode: CameraMode = CameraMode.ThirdPerson

    private static instanceRef: CameraModeManager;

    private constructor() {

        if (Camera.instance.hasOwnProperty("cameraMode")) {
            this.cameraMode = Camera.instance.cameraMode
        }

        onCameraModeChangedObservable.add(({ cameraMode }) => {
            this.cameraMode = cameraMode
            if (cameraMode == CameraMode.ThirdPerson) {
                this.callbacksThirdPerson.forEach((callback) => callback())

            } else if (cameraMode == CameraMode.FirstPerson) {
                this.callbacksFirstPerson.forEach((callback) => callback())
            }

        })

    }
    // Singleton Instance of the Object
    static instance(): CameraModeManager { return this.instanceRef || (this.instanceRef = new this()); }


    addCallbackFirstPerson(callback: () => void) {
        this.callbacksFirstPerson.push(callback)
    }
    addCallbackThirdPerson(callback: () => void) {
        this.callbacksThirdPerson.push(callback)
    }

    removeAllCallbackFirstPerson() {
        this.callbacksFirstPerson = []
    }
    removeAllCallbackThirdPerson() {
        this.callbacksThirdPerson = []
    }
    removeAllCallbacks() {
        this.removeAllCallbackFirstPerson()
        this.removeAllCallbackThirdPerson()
    }

}