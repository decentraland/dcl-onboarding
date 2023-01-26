const lampClip = new AudioClip("assets/audio/v3/Lamp.mp3")

const lamp1 = new Entity()
lamp1.addComponent(new Transform({position: new Vector3(124.85, 75.29, 123.76)}))
const surce = new AudioSource(lampClip)
lamp1.addComponent(surce)
surce.loop = true
surce.volume = 0.04
surce.playOnce()
engine.addEntity(lamp1)


const lamp2 = new Entity()
lamp2.addComponent(new Transform({position: new Vector3(136.87, 70.57, 149.46)}))
const surce2 = new AudioSource(lampClip)
lamp2.addComponent(surce2)
surce2.loop = true
surce2.volume = 0.04
surce2.playOnce()
engine.addEntity(lamp2)


const lamp3 = new Entity()
lamp3.addComponent(new Transform({position: new Vector3(159.85, 67.76, 161.82)}))
const surce3 = new AudioSource(lampClip)
lamp3.addComponent(surce3)
surce3.loop = true
surce3.volume = 0.04
surce3.playOnce()
engine.addEntity(lamp3)


const lamp4 = new Entity()
lamp4.addComponent(new Transform({position: new Vector3(164.19, 66.77, 137.21)}))
const surce4 = new AudioSource(lampClip)
lamp4.addComponent(surce4)
surce4.loop = true
surce4.volume = 0.04
surce4.playOnce()
engine.addEntity(lamp4)

const lamp5 = new Entity()
lamp5.addComponent(new Transform({position: new Vector3(158.51, 64.78, 108.98)}))
const surce5 = new AudioSource(lampClip)
lamp5.addComponent(surce5)
surce5.loop = true
surce5.volume = 0.04
surce5.playOnce()
engine.addEntity(lamp5)


const lamp6 = new Entity()
lamp6.addComponent(new Transform({position: new Vector3(158.51, 64.78, 108.98)}))
const surce6 = new AudioSource(lampClip)
lamp6.addComponent(surce6)
surce6.loop = true
surce6.volume = 0.04
surce6.playOnce()
engine.addEntity(lamp6)