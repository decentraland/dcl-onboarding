import * as utils from '@dcl/ecs-scene-utils'


enum states {
  STOP = 0,
  START = 1,
  PLAYING = 2,
  PAUSED = 3,
  ENDCLIP = 4,
  PAUSE = 5,
  NEXTCLIP = 6,
  PRIORCLIP = 7,
  REVERSE = 8
}

@Component("StateMachine")
export class StateMachine {
  entity: Entity
  animClips: string[]
  clipsLength: number[]

  onStart: Function
  onPause: Function
  onEnd: Function

  delayInterval: number
  state: number

  playing: boolean
  animFinished: boolean
  reverse: boolean

  constructor(entity: Entity, animClips: string[], clipsLength: number[]) {
    this.entity = entity
    this.animClips = animClips
    this.clipsLength = clipsLength

    this.delayInterval = 0
    this.state = states.STOP

    this.playing = false
    this.animFinished = true
    this.reverse = false

    entity.addComponent(new Animator)
    let i: number = 0

    animClips.forEach(clipName => {                                          //Por cada clipname que recibimos en el array...
      var lengthNumber: string = clipName + "_Length"                        //Creamos el string  clipname + _length para usarlo mas adelante como nombre de variable

      entity.getComponent(Animator).addClip(new AnimationState(clipName))    //Creamos el clip añadiendolo al animator

      if (clipsLength[i] != null) {
        this[lengthNumber] = clipsLength[i]                                  // Creamos el length number        /// clipName_Length = length del mismo index en la lista de length
      }

      i++
    })

    this.entity.addComponent(new utils.Interval(100, () => {
      if (this.state == states.START) {
        this.delayInterval = 0
        if(this.reverse == true){
          this.state = states.REVERSE
        }else{
          this.state = states.PLAYING
        }
        this.playing = false
        if (this.onStart != null) {
          this.onStart()
        }
        //console_log(this.entity.name + " onSTART!!")
      }
      else if (this.state == states.PLAYING){
        this.delayInterval += 100
        this.playing = true
      }
      else if (this.state == states.REVERSE){
        this.delayInterval -= 100
        this.playing = true
      }
      else if (this.state == states.PAUSED){
        this.playing = false
        this.state = states.PAUSE
        if (this.onPause != null){
          this.onPause()
        }
        //console_log(this.entity.name + " onPAUSE!!")
      }
      else if (this.state == states.ENDCLIP){
        this.animFinished = true
        this.playing = false
        this.state = states.STOP
        this.delayInterval = 0
        if (this.onEnd != null){
          this.onEnd()
        }
        //console_log(this.entity.name + " onEND!!!!")
      }
      else if (this.state == states.STOP){
        this.playing = false
        this.delayInterval = 0
      }
      //console_log(this.entity.name + " anim_ state: " + this.state + "!!")
    }))
  }

  playClip(clipName: string, reset?: boolean, speed?: number, looping?: boolean, onEnd?: Function, onStart?: Function, onPause?: Function){

    const clipLenghtName = clipName + "_Length"
    const clip: AnimationState = this.entity.getComponent(Animator).getClip(clipName)

    let animLength: number = Math.abs(1000 * this[clipLenghtName])
    let delayTime: number = (animLength - 100)/speed

    if (reset == true){
      this.animFinished = false
      this.delayInterval = 0
      if (looping == false){
        if(speed > 0){
          this.setVariables(clipName, speed, looping, onStart, onPause, onEnd)
          this.entity.getComponent(Animator).play(clip, reset)
          if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay)}
          this.entity.addComponentOrReplace(new utils.Delay(delayTime, () => {
            this.state = states.ENDCLIP
            this.animFinished = true
            this.entity.getComponent(Animator).pause()
            if (this.entity.hasComponent(utils.Delay)) {this.entity.removeComponent(utils.Delay)}
          }))
          this.stateSelection(speed)
        }else if (speed < 0){
          //console_warn("WARNING, anim not playing.\nError, Looping should be true to play negative speed animations from the beginning")
          return
        }
      }else if (looping == true){
        if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay)}
        this.setVariables(clipName, speed, looping, onStart, onPause, onEnd)
        this.entity.getComponent(Animator).play(clip, reset)
        if (this.animFinished = true){this.animFinished = false}
        this.stateSelection(speed)
      }
    }else{ //reset==false
      if(this.playing){
        if(clip.looping == true && looping == true){
          this.setVariables(clipName, speed, looping, onStart, onPause, onEnd)
          if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay) }
          this.animFinished = false
          this.entity.getComponent(Animator).play(clip, reset)
          
          this.stateSelection(speed)
        }else{
          //onsole_warn("WARNING, anim not playing.\nError, Can't play this animation before the previous one is ended")
          return
        }
      }else{ //playing = false
        if(clip.looping == true){
          if(looping == true){
            this.setVariables(clipName, speed, looping, onStart, onPause, onEnd)
            if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay) }
            this.animFinished = false
            this.entity.getComponent(Animator).play(clip, reset)
            this.stateSelection(speed)
          }else{ //looping=false
            this.setVariables(clipName, speed, looping, onStart, onPause, onEnd)
            this.entity.getComponent(Animator).play(clip, reset)
            this.entity.addComponentOrReplace(new utils.Delay(delayTime, () => {
              this.state = states.ENDCLIP
              this.animFinished = true
              this.entity.getComponent(Animator).pause()
              if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay) }
            }))
            this.stateSelection(speed)
          }
        }else{  //clip.looping = false
          if (looping == false && this.animFinished == true){
            if (speed > 0 && clip.speed <0) {
              this.setVariables(clipName, speed, looping, onStart, onPause, onEnd)
              this.entity.getComponent(Animator).play(clip, reset)
              this.entity.addComponentOrReplace(new utils.Delay(delayTime, () => {
                this.state = states.ENDCLIP
                this.animFinished = true
                this.entity.getComponent(Animator).pause()
                if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay) }
              }))
              this.stateSelection(speed)
            }else if(speed < 0 && clip.speed>0){ 
              this.setVariables(clipName, speed, looping, onStart, onPause, onEnd)
              this.entity.getComponent(Animator).play(clip, reset)
              this.entity.addComponentOrReplace(new utils.Delay(delayTime, () => {
                this.state = states.ENDCLIP
                this.animFinished = true
                this.entity.getComponent(Animator).pause()
                if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay) }
              }))
              this.stateSelection(speed)
            }else{
              //console_warn("WARNING, anim not playing.\nError, Reset should be true to play the same animation that just played in the same direction/speed")
              return
            }
          }else if(looping == true && this.animFinished == true){
            this.setVariables(clipName, speed, looping, onStart, onPause, onEnd)
            if(this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay)}
            this.animFinished = false
            this.entity.getComponent(Animator).play(clip, reset)
            this.stateSelection(speed)
          }
        }
      }
    }
  }

  pauseClip(clipName?: string){
    if (this.state == states.PLAYING) {
      if(clipName){
        const clip: AnimationState = this.entity.getComponent(Animator).getClip(clipName)
        this.entity.getComponent(Animator).pause(clip)
      }else{
        this.entity.getComponent(Animator).pause()
      }
      if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay) }
      this.state = states.PAUSED
    }
  }

  stopClip(clipName?: string){
    if (clipName){
      const clip: AnimationState = this.entity.getComponent(Animator).getClip(clipName)
      this.entity.getComponent(Animator).stop(clip)
    }else{
      this.entity.getComponent(Animator).stop()
    }
    if (this.entity.hasComponent(utils.Delay)) { this.entity.removeComponent(utils.Delay) }
    this.animFinished = true
    this.state = states.ENDCLIP
  }

  private setVariables(clipName: string, speed?: number, looping?: boolean, onStart?: Function, onPause?: Function, onEnd?: Function) {
    const clip: AnimationState = this.entity.getComponent(Animator).getClip(clipName)
    if (speed != null) { clip.speed = speed } else { clip.speed = states.START }
    if (looping != null) { clip.looping = looping } else { clip.looping = false }
    this.onStart = onStart 
    this.onPause = onPause 
    this.onEnd = onEnd
  }

  private stateSelection(speed?: number) {
    //Paused ----> Play or Reverse depending on the speed
    if (this.state == states.PAUSE) {                                //if paused play goes to state states.PLAYING, not states.START
      if (speed > 0) {
        this.reverse = false
        this.state = states.PLAYING
      }else if (speed < 0){ 
        this.reverse = true
        this.state = states.REVERSE
      }
    }
    //Any other state -----> Start, Forward or Reverse depending on the speed
    else {
      if (speed > 0) {
        this.reverse = false
        this.state = states.START
      } else if (speed < 0) {
        this.reverse = true
        this.state = states.START
      }
    }
  }
}