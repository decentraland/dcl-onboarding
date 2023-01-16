import { delay } from "src/imports/components/delay";

export type AudioSourceOptions = {

    volume?: number;
    loop?: boolean;
    pitch?: number; //Pitch, default: 1.0, range from 0.0 to MaxFloat
    autoPlay?: boolean;
}

/**
 * PlayAudioOptions is an object with optional properties position, parent, lifespan, volume, loop, and
 * pitch.
 * @property {Vector3} position - The position of the audio source.
 * @property {IEntity | Attachable} parent - The entity to attach the audio to.
 * @property {number} lifespan - The amount of time in seconds that the audio will play for.
 * @property {number} volume - The volume of the audio.
 * @property {boolean} loop - Whether or not the audio should loop.
 * @property {number} pitch - The pitch of the audio.
 */
export type PlayAudioOptions = {
    position?: Vector3;
    parent?: IEntity | Attachable;
    lifespan?: number;
    volume?: number;
    loop?: boolean;
    pitch?: number;
}

/* It's a class that creates an entity with an audio source and audio clip, and has methods to play,
pause, and stop the audio. */
export class AudioEntity {
    entity: Entity;
    audioSource: AudioSource;
    audioClip: AudioClip;
    playTimeout: any
    private intervalSmoothVolume: any;
    constructor(entity: Entity, src: string, options: AudioSourceOptions = {}) {
        this.entity = entity;
        this.audioClip = new AudioClip(src);
        this.audioSource = new AudioSource(this.audioClip);
        this.entity.addComponentOrReplace(this.audioSource);

        if (options?.hasOwnProperty('volume')) {
            this.audioSource.volume = options.volume;
        }
        if (options?.hasOwnProperty('loop')) {
            this.audioSource.loop = options.loop;
        }
        if (options?.hasOwnProperty('pitch')) {
            this.audioSource.pitch = options.pitch;
        }
        if (options?.autoPlay) {
            this.play()
        }

    }
    setVolumeSmooth(targetVolume: number, duration: number) {
        if (this.intervalSmoothVolume) {
            clearInterval(this.intervalSmoothVolume);
            this.intervalSmoothVolume = null;
        }
        let startVolume = this.audioSource.volume;
        let startTime = Date.now();
        this.intervalSmoothVolume = setInterval(() => {
            let now = Date.now();
            let t = (now - startTime) / duration;
            if (t > 10) {
                t = 1;
                clearInterval(this.intervalSmoothVolume);
            }
            this.audioSource.volume = lerp(startVolume, targetVolume, t);
        }, 33);
    }
    stopSmooth(duration: number) {
        if (this.intervalSmoothVolume) {
            clearInterval(this.intervalSmoothVolume);
            this.intervalSmoothVolume = null;
        }
        let startVolume = this.audioSource.volume;
        let startTime = Date.now();
        this.intervalSmoothVolume = setInterval(() => {
            let now = Date.now();
            let t = (now - startTime) / duration;
            if (t > 10) {
                t = 1;
                clearInterval(this.intervalSmoothVolume);
                this.stop();
                this.audioSource.volume = startVolume
            }
            this.audioSource.volume = lerp(startVolume, 0, t);
        }, 33);
    }
    play(options?: PlayAudioOptions) {
        if (options?.position) {
            this.entity.getComponent(Transform).position = options.position;
        }

        if (options?.hasOwnProperty('volume')) {
            this.audioSource.volume = options.volume;
        }

        if (options?.hasOwnProperty('loop')) {
            this.audioSource.loop = options.loop;
        }

        if (options?.hasOwnProperty('pitch')) {
            this.audioSource.pitch = options.pitch;
        }

        if (options?.parent) {
            this.entity.setParent(options.parent);
        }

        if (this.playTimeout) {
            clearTimeout(this.playTimeout);
            this.playTimeout = null;
        }

        if (options?.lifespan) {
            this.playTimeout = delay(() => {
                this.stop();
            }, options.lifespan);
        }

        this.audioSource.playing = true;
    }
    playOnce(options?: Omit<PlayAudioOptions, "loop">) {
        if (options?.position) {
            this.entity.getComponent(Transform).position = options.position;
        }

        if (options?.hasOwnProperty('volume')) {
            this.audioSource.volume = options.volume;
        }

        if (options?.hasOwnProperty('pitch')) {
            this.audioSource.pitch = options.pitch;
        }

        if (options?.parent) {
            this.entity.setParent(options.parent);
        }
        else {
            this.entity.setParent(null);
            if (!this.entity.isAddedToEngine()) {
                engine.addEntity(this.entity);
            }
        }

        if (this.playTimeout) {
            clearTimeout(this.playTimeout);
            this.playTimeout = null;
        }

        if (options?.lifespan) {
            this.playTimeout = delay(() => {
                this.stop();
            }, options.lifespan);
        }

        this.audioSource.playOnce();
    }
    playGlobal(options?: Omit<Omit<PlayAudioOptions, "position">, "parent">) {
        const opt: PlayAudioOptions = options || {}
        opt.parent = Attachable.FIRST_PERSON_CAMERA;
        this.play(opt);
    }
    playOnceGlobal(options?: Omit<Omit<Omit<PlayAudioOptions, "loop">, "position">, "parent">) {
        const opt: PlayAudioOptions = options || {}
        opt.parent = Attachable.FIRST_PERSON_CAMERA;
        this.playOnce(opt);
    }
    stop() {
        this.audioSource.playing = false;
    }
}