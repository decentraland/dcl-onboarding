//#region lamp

import { AudioManager } from "./audio.manager"

const lampClip = new AudioClip("assets/audio/v3/Lamp.mp3")

const lamp1 = new Entity()
lamp1.addComponent(new Transform({position: new Vector3(124.85, 75.29, 123.76)}))
const surce = new AudioSource(lampClip)
lamp1.addComponent(surce)
surce.loop = true
surce.volume = 0.008
surce.playOnce()
engine.addEntity(lamp1)


const lamp2 = new Entity()
lamp2.addComponent(new Transform({position: new Vector3(136.87, 70.57, 149.46)}))
const surce2 = new AudioSource(lampClip)
lamp2.addComponent(surce2)
surce2.loop = true
surce2.volume = 0.008
surce2.playOnce()
engine.addEntity(lamp2)


const lamp3 = new Entity()
lamp3.addComponent(new Transform({position: new Vector3(159.85, 67.76, 161.82)}))
const surce3 = new AudioSource(lampClip)
lamp3.addComponent(surce3)
surce3.loop = true
surce3.volume = 0.008
surce3.playOnce()
engine.addEntity(lamp3)


const lamp4 = new Entity()
lamp4.addComponent(new Transform({position: new Vector3(164.19, 66.77, 137.21)}))
const surce4 = new AudioSource(lampClip)
lamp4.addComponent(surce4)
surce4.loop = true
surce4.volume = 0.008
surce4.playOnce()
engine.addEntity(lamp4)

const lamp5 = new Entity()
lamp5.addComponent(new Transform({position: new Vector3(158.51, 64.78, 108.98)}))
const surce5 = new AudioSource(lampClip)
lamp5.addComponent(surce5)
surce5.loop = true
surce5.volume = 0.008
surce5.playOnce()
engine.addEntity(lamp5)


const lamp6 = new Entity()
lamp6.addComponent(new Transform({position: new Vector3(158.51, 64.78, 108.98)}))
const surce6 = new AudioSource(lampClip)
lamp6.addComponent(surce6)
surce6.loop = true
surce6.volume = 0.008
surce6.playOnce()
engine.addEntity(lamp6)
//#endregion

//#region windOnLeafs

const windOnLEafClip = new AudioClip("asets/audio/v3/WindOnLeafs.mp3")

const tree1 = new Entity()
tree1.addComponent(new Transform({position: new Vector3(168.2958, 65.22231, 140.32)}))
const treeSource = new AudioSource(windOnLEafClip)
tree1.addComponent(treeSource)
treeSource.loop = true
treeSource.volume = 0.2
treeSource.pitch = 1
treeSource.playOnce()
engine.addEntity(tree1)

const tree6 = new Entity()
tree6.addComponent(new Transform({position: new Vector3(195.69, 65.59, 131.08)}))
const treeSource6 = new AudioSource(windOnLEafClip)
tree6.addComponent(treeSource6)
treeSource6.loop = true
treeSource6.volume = 0.02
treeSource6.playOnce()
engine.addEntity(tree6)

const tree4 = new Entity()
tree4.addComponent(new Transform({position: new Vector3(142, 75.59, 152.08)}))
const treeSource4 = new AudioSource(windOnLEafClip)
tree4.addComponent(treeSource4)
treeSource4.loop = true
treeSource4.volume = 1
treeSource4.playOnce()
engine.addEntity(tree4)

const tree5 = new Entity()
tree5.addComponent(new Transform({position: new Vector3(86, 85.59, 152.08)}))
const treeSource5 = new AudioSource(windOnLEafClip)
tree5.addComponent(treeSource5)
treeSource5.loop = true
treeSource5.volume = 1
treeSource5.playOnce()
engine.addEntity(tree5)

const tree7 = new Entity()
tree7.addComponent(new Transform({position: new Vector3(130, 80, 115)}))
const treeSource7 = new AudioSource(windOnLEafClip)
tree7.addComponent(treeSource7)
treeSource7.loop = true
treeSource7.volume = 1
treeSource7.playOnce()
engine.addEntity(tree7)

//#endregion 

//#region Rocks
const floatingRoksClip = new AudioClip("assets/audio/v3/FloatingRoks.mp3")

const rock = new Entity()
rock.addComponent(new Transform({position: new Vector3(190, 65.59, 140)}))
const rockSource = new AudioSource(floatingRoksClip)
rock.addComponent(rockSource)
rockSource.loop = true
rockSource.volume = 0.05
rockSource.pitch = 1
rockSource.playOnce()
engine.addEntity(rock)

const rock2 = new Entity()
rock2.addComponent(new Transform({position: new Vector3(160, 70, 175)}))
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
generators.addComponent(new Transform({position: new Vector3(101, 79, 140)}))
const generatorSource = new AudioSource(generatorsClip)
generators.addComponent(generatorSource)
generatorSource.loop = true
generatorSource.volume = 0.3
generatorSource.playOnce()
engine.addEntity(generators)

export function changeGeneratosSound(){
    engine.removeEntity(generators)

    const generatorsClip = new AudioClip("assets/audio/v3/FixedGenerators.mp3")

    const fixedGenerators = new Entity()
    fixedGenerators.addComponent(new Transform({position: new Vector3(101, 79, 140)}))
    const generatorSource = new AudioSource(generatorsClip)
    fixedGenerators.addComponent(generatorSource)
    generatorSource.loop = true
    generatorSource.volume = 0.05
    generatorSource.playOnce()
    engine.addEntity(fixedGenerators)
}
//#endregion

//#region Portals
const portalClip = new AudioClip("assets/audio/v3/Pillar.mp3")

export function activateInitialSoundPortal(){
    
    const portals = new Entity()
    portals.addComponent(new Transform({position: new Vector3(100, 95, 95)}))
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