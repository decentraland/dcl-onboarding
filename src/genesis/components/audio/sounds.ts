//#region lamp

import { AudioManager } from "./audio.manager"

AudioManager.instance().playMainMusic()
const lampClip = new AudioClip("assets/audio/v3/Lamp.wav")

const lamp1 = new Entity()
const lamp1Transform = new Transform({position: new Vector3(124.85, 82, 123.76)})
lamp1.addComponent(lamp1Transform)
const surce = new AudioSource(lampClip)
lamp1.addComponent(surce)
surce.loop = true
surce.volume = 0.008
surce.playOnce()
engine.addEntity(lamp1)


const lamp2 = new Entity()
const lamp2Transform = new Transform({position: new Vector3(136.87, 77, 149.46)})
lamp2.addComponent(lamp2Transform)
const surce2 = new AudioSource(lampClip)
lamp2.addComponent(surce2)
surce2.loop = true
surce2.volume = 0.008
surce2.playOnce()
engine.addEntity(lamp2)


const lamp3 = new Entity()
const lamp3Transform = new Transform({position: new Vector3(159.85, 74, 161.82)})
lamp3.addComponent(lamp3Transform)
const surce3 = new AudioSource(lampClip)
lamp3.addComponent(surce3)
surce3.loop = true
surce3.volume = 0.008
surce3.playOnce()
engine.addEntity(lamp3)


const lamp4 = new Entity()
const lamp4Transform = new Transform({position: new Vector3(164.19, 73, 137.21)})
lamp4.addComponent(lamp4Transform)
const surce4 = new AudioSource(lampClip)
lamp4.addComponent(surce4)
surce4.loop = true
surce4.volume = 0.008
surce4.playOnce()
engine.addEntity(lamp4)

const lamp5 = new Entity()
const lamp5Transform = new Transform({position: new Vector3(158.51, 71, 108.98)})
lamp5.addComponent(lamp5Transform)
const surce5 = new AudioSource(lampClip)
lamp5.addComponent(surce5)
surce5.loop = true
surce5.volume = 0.008
surce5.playOnce()
engine.addEntity(lamp5)


const lamp6 = new Entity()
const lamp6Transform = new Transform({position: new Vector3(158.51, 71, 108.98)})
lamp6.addComponent(lamp6Transform)
const surce6 = new AudioSource(lampClip)
lamp6.addComponent(surce6)
surce6.loop = true
surce6.volume = 0.008
surce6.playOnce()
engine.addEntity(lamp6)
//#endregion

//#region windOnLeafs

const windOnLEafClip = new AudioClip("assets/audio/v3/WindOnLeafs.mp3")

const tree1 = new Entity()
const tree1Transform = new Transform({position: new Vector3(168.2958, 70, 140.32)})
tree1.addComponent(tree1Transform)
const treeSource = new AudioSource(windOnLEafClip)
tree1.addComponent(treeSource)
treeSource.loop = true
treeSource.volume = 0.03
treeSource.pitch = 0.9
treeSource.playOnce()
engine.addEntity(tree1)

const tree2 = new Entity()
const tree2Transform = new Transform({position: new Vector3(195.69, 65.59, 131.08)})
tree2.addComponent(tree2Transform)
const treeSource2 = new AudioSource(windOnLEafClip)
tree2.addComponent(treeSource2)
treeSource2.loop = true
treeSource2.volume = 0.03
treeSource.pitch = 0.9
treeSource2.playOnce()
engine.addEntity(tree2)

const tree3 = new Entity()
const tree3Transform = new Transform({position: new Vector3(130, 80, 115)})
tree3.addComponent(tree3Transform)
const treeSource3 = new AudioSource(windOnLEafClip)
tree3.addComponent(treeSource3)
treeSource3.loop = true
treeSource3.volume = 0.03
treeSource.pitch = 0.9
treeSource3.playOnce()
engine.addEntity(tree3)

const tree4 = new Entity()
const tree4Transform = new Transform({position: new Vector3(142, 75.59, 152.08)})
tree4.addComponent(tree4Transform)
const treeSource4 = new AudioSource(windOnLEafClip)
tree4.addComponent(treeSource4)
treeSource4.loop = true
treeSource4.volume = 0.03
treeSource.pitch = 0.9
treeSource4.playOnce()
engine.addEntity(tree4)

const tree5 = new Entity()
const tree5Transform = new Transform({position: new Vector3(86, 85.59, 152.08)})
tree5.addComponent(tree5Transform)
const treeSource5 = new AudioSource(windOnLEafClip)
tree5.addComponent(treeSource5)
treeSource5.loop = true
treeSource5.volume = 0.03
treeSource.pitch = 0.9
treeSource5.playOnce()
engine.addEntity(tree5)


//#endregion 

//#region Rocks
const floatingRoksClip = new AudioClip("assets/audio/v3/FloatingRoks.mp3")

const rock = new Entity()
const rock1Transform = new Transform({position: new Vector3(190, 65.59, 140)})
rock.addComponent(rock1Transform)
const rockSource = new AudioSource(floatingRoksClip)
rock.addComponent(rockSource)
rockSource.loop = true
rockSource.volume = 0.05
rockSource.pitch = 1
rockSource.playOnce()
engine.addEntity(rock)

const rock2 = new Entity()
const rock2Transform = new Transform({position: new Vector3(160, 70, 175)})
rock2.addComponent(rock2Transform)
const rockSource2 = new AudioSource(floatingRoksClip)
rock2.addComponent(rockSource2)
rockSource2.loop = true
rockSource2.volume = 0.05
rockSource2.pitch = 1
rockSource2.playOnce()
engine.addEntity(rock2)
//#endregion 

//#region Pillars
const pillarClip = new AudioClip("assets/audio/v3/Pillar.mp3")

export function activateSoundPillar1(pillar:Entity){
    const pillarPos = pillar.getComponent(Transform).position
    
    const pillar1 = new Entity()
    pillar1.addComponent(new Transform({position: pillarPos}))
    const pillarSource = new AudioSource(pillarClip)
    pillar1.addComponent(pillarSource)
    pillarSource.loop = true
    pillarSource.volume = 0.05
    pillarSource.playOnce()
    engine.addEntity(pillar1)
}

export function activateSoundPillar2(pillarEntity:Entity){
    const pillarPos = pillarEntity.getComponent(Transform).position
    
    const pillar = new Entity()
    pillar.addComponent(new Transform({position: pillarPos}))
    const pillarSource = new AudioSource(pillarClip)
    pillar.addComponent(pillarSource)
    pillarSource.loop = true
    pillarSource.volume = 0.05
    pillarSource.playOnce()
    engine.addEntity(pillar)
}

export function activateSoundPillar3(pillarEntity:Entity){
    const pillarPos = pillarEntity.getComponent(Transform).position
    
    const pillar = new Entity()
    pillar.addComponent(new Transform({position: pillarPos}))
    const pillarSource = new AudioSource(pillarClip)
    pillar.addComponent(pillarSource)
    pillarSource.loop = true
    pillarSource.volume = 0.05
    pillarSource.playOnce()
    engine.addEntity(pillar)
}

export function activatePillarSound4(pillarEntity:Entity){
    const pillarPos = pillarEntity.getComponent(Transform).position
    
    const pillar = new Entity()
    pillar.addComponent(new Transform({position: pillarPos}))
    const pillarSource = new AudioSource(pillarClip)
    pillar.addComponent(pillarSource)
    pillarSource.loop = true
    pillarSource.volume = 0.05
    pillarSource.playOnce()
    engine.addEntity(pillar)
}
//#endregion 

//#region Generators
const generatorsClip = new AudioClip("assets/audio/v3/NotWorkingGenerators.mp3")

const generators = new Entity()
const generatorsTransform = new Transform({position: new Vector3(101, 79, 140)})
generators.addComponent(generatorsTransform)
const generatorSource = new AudioSource(generatorsClip)
generators.addComponent(generatorSource)
generatorSource.loop = true
generatorSource.volume = 0.3
generatorSource.playOnce()
engine.addEntity(generators)

export function changeGeneratosSound(){
    engine.removeEntity(generators)

    const generatorsClip = new AudioClip("assets/audio/v3/FixedGenerators.wav")

    const fixedGenerators = new Entity()
    fixedGenerators.addComponent(new Transform({position: new Vector3(101, 79, 140)}))
    const generatorSource = new AudioSource(generatorsClip)
    fixedGenerators.addComponent(generatorSource)
    generatorSource.loop = true
    generatorSource.volume = 0.01
    generatorSource.playOnce()
    engine.addEntity(fixedGenerators)
}
//#endregion

//#region Portals
const portalClip = new AudioClip("assets/audio/v3/Pillar.mp3")
const portalsTransform = new Transform({position: new Vector3(100, 95, 95)})

export function activateInitialSoundPortal(){
    
    const portals = new Entity()
    portals.addComponent(portalsTransform)
    AudioManager.instance().playOnce("tower_charge", { volume: 1, pitch: 0.3, parent: portals })
    const portalSource = new AudioSource(portalClip)
    portals.addComponent(portalSource)
    portalSource.loop = false
    portalSource.volume = 0.5
    portalSource.playOnce()
    engine.addEntity(portals)
}

const portalLoopClip = new AudioClip("assets/audio/v3/Portals.mp3")

export function activateLoopSoundPortal(){
    const portals = new Entity()
    portals.addComponent(new Transform({position: new Vector3(100, 95, 95)}))
    const portalSource = new AudioSource(portalLoopClip)
    portals.addComponent(portalSource)
    portalSource.loop = true
    portalSource.volume = 0.5
    portalSource.playOnce()
    engine.addEntity(portals)
}
//#endregion

let cubeDebuggerEnable = false
const soundEntityes = [rock,rock2,tree1,tree2,tree3,tree4,tree5,lamp1, lamp2, lamp3, lamp4, lamp5, lamp6, generators]
cubeSpawner()

function cubeSpawner(){
    if(cubeDebuggerEnable){
        for(const e of soundEntityes){ 
            const a = new Entity()
            a.setParent(e) 
            a.addComponent(new BoxShape())

            let hoverText = "has no audio"
            if( e.hasComponent(AudioSource) ){
                const audioSource = e.getComponent(AudioSource)
                hoverText = audioSource.audioClip.url + "\nplaying:"+audioSource.playing
            }
            a.addComponent(new OnPointerDown(()=>{
                if( e.hasComponent(AudioSource) ){
                    const audioSource = e.getComponent(AudioSource)
                    const pointerDown = a.getComponent(OnPointerDown)
                    if(audioSource.playing){
                        audioSource.playing = false
                    }else{
                        audioSource.playing = true
                    }
                    pointerDown.hoverText =  audioSource.audioClip.url + "\nplaying:"+audioSource.playing
                }
            },{
                hoverText: hoverText
            }))

            engine.addEntity(a)
        }
    }
}