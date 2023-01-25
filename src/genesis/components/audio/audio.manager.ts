import { AudioEntity, AudioSourceOptions, PlayAudioOptions } from "./audioEntity";

//Add all audio files here
export enum AudioNames {
    npc_1_salute = "assets/audio/v2/npc_1_salute.mp3",
    npc_2_salute = "assets/audio/v2/npc_2_salute.mp3",
    pickup_box = "assets/audio/v2/pickup_box.mp3",
    portal_ambiental = "assets/audio/v2/portal_ambiental.mp3",
    puzzle_all_connect = "assets/audio/v2/puzzle_all_connect.mp3",
    puzzle_interact = "assets/audio/v2/puzzle_interact.mp3",
    tobor_talk = "assets/audio/v2/tobor_talk.mp3",
    tower_activated = "assets/audio/v2/tower_activated.mp3",
    tower_charge = "assets/audio/v2/tower_charge.mp3",
    Bridge_sound = "assets/audio/Bridge_sound_ok.mp3",
    button_interact = "assets/audio/Button_Interact.mp3",
    chatbox = "assets/audio/chatbox.mp3",
    island_ambiental = "assets/audio/Mainland_Ambient.mp3",
    pop_1 = "assets/audio/pop_1.mp3",
    pop_2 = "assets/audio/pop_2.mp3",
    pop_up_close = "assets/audio/pop_up_close.mp3",
    waterfall = "assets/audio/waterfall_r.mp3",

    ambient = "assets/audio/v3/",
    waterfall2 = "assets/audio/v3/waterfall.mp3",
    bigWaterfall = "assets/audio/v3/BigWaterFall.mp3",
    floatingRoks = "assets/audio/v3/FloatingRoks.mp3",
    windOnLeaf = "assets/audio/v3/WindOnLeaf.mp3",
    pillar = "assets/audio/v3/Pillar.mp3",
    notWorkingGenerators = "assets/audio/v3/NotWorkingGenerators.mp3",
    workingGeneratos = "assets/audio/v3/WorkingGenerators.mp3",
    portals = "assets/audio/v3/Portals.mp3",
    lamp = "assets/audio/v3/Lamp.mp3",
    robot = "assets/audio/v3/Robot.mp3",
    npc_3_salute = "assets/audio/v3/Racoon.mp3",
}
//Add all audio files here too 
export class AudioManager {

    audio = {
        button_interact: new AudioEntity(new Entity(), AudioNames.button_interact, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        waterfall: new AudioEntity(new Entity(), AudioNames.waterfall, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        pop_up_close: new AudioEntity(new Entity(), AudioNames.pop_up_close, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        Bridge_sound: new AudioEntity(new Entity(), AudioNames.Bridge_sound, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        pop_1: new AudioEntity(new Entity(), AudioNames.pop_1, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        chatbox: new AudioEntity(new Entity(), AudioNames.chatbox, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        island_ambiental: new AudioEntity(new Entity(), AudioNames.island_ambiental, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        npc_1_salute: new AudioEntity(new Entity(), AudioNames.npc_1_salute, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        npc_2_salute: new AudioEntity(new Entity(), AudioNames.npc_2_salute, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        pickup_box: new AudioEntity(new Entity(), AudioNames.pickup_box, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        portal_ambiental: new AudioEntity(new Entity(), AudioNames.portal_ambiental, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        puzzle_all_connect: new AudioEntity(new Entity(), AudioNames.puzzle_all_connect, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        puzzle_interact: new AudioEntity(new Entity(), AudioNames.puzzle_interact, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        tobor_talk: new AudioEntity(new Entity(), AudioNames.tobor_talk, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        tower_activated: new AudioEntity(new Entity(), AudioNames.tower_activated, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        tower_charge: new AudioEntity(new Entity(), AudioNames.tower_charge, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),


        ambient: new AudioEntity(new Entity(), AudioNames.ambient, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        waterfall2: new AudioEntity(new Entity(), AudioNames.waterfall2, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        bigWaterFall: new AudioEntity(new Entity(), AudioNames.bigWaterfall, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        floatingRoks: new AudioEntity(new Entity(), AudioNames.floatingRoks, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        windOnLeafs: new AudioEntity(new Entity(), AudioNames.windOnLeaf, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        pillar: new AudioEntity(new Entity(), AudioNames.pillar, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        notWorkingGenerators: new AudioEntity(new Entity(), AudioNames.notWorkingGenerators, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        workingGenerators: new AudioEntity(new Entity(), AudioNames.workingGeneratos, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        portals: new AudioEntity(new Entity(), AudioNames.portals, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        lamp: new AudioEntity(new Entity(), AudioNames.lamp, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
        npc_3_salute: new AudioEntity(new Entity(), AudioNames.npc_3_salute, { volume: 0.6, pitch: 1, loop: false, autoPlay: false }),
        robot: new AudioEntity(new Entity(), AudioNames.robot, { volume: 0.6, pitch: 1, loop: true, autoPlay: false }),
    };

    private static instanceRef: AudioManager;
    static instance(): AudioManager {
        return this.instanceRef || (this.instanceRef = new this());
    }
    private constructor() {

        Object.keys(this.audio).forEach((key) => {
            this.audio[key].entity.addComponent(new Transform());
            engine.addEntity(this.audio[key].entity);
        });

    }

    playMainAmbience(bSmooth: boolean = false) {
        if (!bSmooth) {
            this.stopAllAmbience();
            this.audio.island_ambiental.playGlobal({ volume: 0.4 });
            return;
        }

        if (this.audio.portal_ambiental.audioSource.playing) {
            this.audio.portal_ambiental.stopSmooth(2000);
        }

        this.audio.island_ambiental.playGlobal({ volume: 0 });
        this.audio.island_ambiental.setVolumeSmooth(0.4, 2000);
    }

    playPortalAmbience(bSmooth: boolean = false) {
        if (!bSmooth) {
            this.stopAllAmbience();
            this.audio.portal_ambiental.playGlobal({ volume: 0.015 });
            return;
        }

        if (this.audio.island_ambiental.audioSource.playing) {
            this.audio.island_ambiental.stopSmooth(2000);
        }

        this.audio.portal_ambiental.playGlobal({ volume: 0 });
        this.audio.portal_ambiental.setVolumeSmooth(0.015, 2000);
    }

    stopAllAmbience() {
        this.audio.island_ambiental.stop();
        this.audio.portal_ambiental.stop();
    }

    playBridge(bridgeEnt: Entity) {
        this.audio.Bridge_sound.playOnce({ volume: 1, parent: bridgeEnt });
    }

    playTowerCharge(towerEntity: Entity) {
        this.audio.tower_charge.playOnce({ volume: 0.4, pitch: 1, parent: towerEntity });
    }

    playTowerActivated(towerEntity: Entity) {
        this.audio.tower_activated.playOnce({ volume: 0.8, pitch: 1, parent: towerEntity });
    }

    playPopupOpen() {
        this.audio.pop_1.playOnceGlobal({ volume: 0.5, pitch: 1 });
    }

    playPopupClose() {
        this.audio.pop_1.playOnceGlobal({ volume: 0.5, pitch: 0.5 });
    }

    createAudioEntity(name: string, entity: Entity, src: string, options: AudioSourceOptions = {}) {
        this.audio[name] = new AudioEntity(entity, src, options);
    }

    addAudioEntity(name: string, audioEnt: AudioEntity) {
        this.audio[name] = audioEnt;
    }

    getAudioEnt(index: number): AudioEntity {

        if (!Object.keys(this.audio)[index]) {
            console.error("Invalid sound array access, index: " + index)
            return;
        }

        return this.audio[Object.keys(this.audio)[index]]
    }

    stop(name: string) {
        if (!this.audio[name]) {
            DebugAccess.instance().log("AudioManager: stop: " + name + " not found", LogType.ERROR)
            return;
        }
        this.audio[name].stop();
    }

    play(name: string, options?: PlayAudioOptions) {
        if (!this.audio[name]) {
            DebugAccess.instance().log("AudioManager: play: " + name + " not found", LogType.ERROR)
            return;
        }
        this.audio[name].play(options);
    }
    playGlobal(name: string, options?: Omit<Omit<PlayAudioOptions, "position">, "parent">) {
        if (!this.audio[name]) {
            DebugAccess.instance().log("AudioManager: play: " + name + " not found", LogType.ERROR)
            return;
        }
        this.audio[name].playGlobal(options);
    }
    playOnce(name: string, options?: Omit<PlayAudioOptions, "loop">) {
        if (!this.audio[name]) {
            DebugAccess.instance().log("AudioManager: play: " + name + " not found", LogType.ERROR)
            return;
        }
        this.audio[name].playOnce(options);
    }
    playOnceGlobal(name: string, options?: Omit<Omit<Omit<PlayAudioOptions, "loop">, "position">, "parent">) {
        if (!this.audio[name]) {
            DebugAccess.instance().log("AudioManager: play: " + name + " not found", LogType.ERROR)
            return;
        }
        this.audio[name].playOnceGlobal(options);
    }
}