import { getDecentralandTime } from '@decentraland/EnvironmentAPI';
import * as utils from '@dcl/ecs-scene-utils'
import { delay } from "./delay";
//import { getDecentralandTimeX } from 'src/DebugTool';


@Component('dclTime')
export class dclTime{
  entity: IEntity
  entities: IEntity[] = [];
  goalTime: number
  eventPlayed: boolean
  backEventPlayed: boolean
  constructor(){
    this.eventPlayed = false
    this.backEventPlayed = false
  }

  atFixedTime(goalTime: number, callback: ()=>void, testExport?:boolean){
    this.goalTime = goalTime
    let timeIncrement:number = 25
    if(testExport == true){
      timeIncrement = 25
    }else{
      timeIncrement = 13
    }
    if(this.eventPlayed == false){
      executeTask(async () => {
        let time = await getDecentralandTime()
        //log("Initial Dcl time = " + time.seconds)
        let dclTime: number = time.seconds
        this.entity = new Entity
        engine.addEntity(this.entity)
        this.entity.addComponent(new utils.Interval(1000, () => {
          if (dclTime >= this.goalTime - timeIncrement*2 && dclTime <= this.goalTime + timeIncrement*2) { //dclTime must be in the range around goaltime
            executeTask(async () => {
              let time = await getDecentralandTime() //Get dclTime one more time to check if the counter is ok and rectify if neccesary
              //log("NEW Dcl time = " + time.seconds)
              if(time.seconds >= this.goalTime - timeIncrement*4 && time.seconds <= this.goalTime + timeIncrement*4){
                //Aqui va el evento
                callback()
                this.eventPlayed = true
                //log("////// Dcl Time //////")
                this.entity.removeComponent(utils.Interval)
              }else{ // If the count is not at +-100 dcl seconds around set a new dclTime and keep the count going on
                dclTime = time.seconds
                //log("Start Dcl Count Again")
              }
            })
          }else{
            dclTime += timeIncrement //25 because of the local testing skybox duration 1 hour, instead of 2 hours. This must be 13 if you are not testing
            //log("Calculated Dcl Time = " + dclTime)
            if(dclTime > 86400){ dclTime = timeIncrement }
          }
        }))
      })
    }
  }

  atDayNight(callbackDay: ()=>void, callbackNight: ()=>void){
    executeTask(async () => {
      let time = await getDecentralandTime()
      //log("Initial Dcl time = " + time.seconds)
      let dclTime: number = time.seconds
      if(dclTime < 22500 || dclTime > 71460){
        if(this.eventPlayed == false){
          callbackNight()
          //log("Dcl Night Time")
          this.eventPlayed = true
          this.backEventPlayed = false
        }
      }else if(dclTime > 22500 && dclTime < 71460){
        if (this.backEventPlayed == false){
          callbackDay()
          //log("Dcl Day Time")
          this.backEventPlayed = true
          this.eventPlayed = false
        }
      }
    })
    delay(()=>{this.atDayNight(()=>{callbackDay()},()=>{callbackNight()})}, 10000) //Volvemos a llamar la accion en un minuto para ver si sigue dentro del tiempo //10s
  }

  atTimeRange(time1:number, time2:number, callbackInTime: ()=>void, callbackOutTime?: ()=>void){
    executeTask(async () => {
      let time = await getDecentralandTime()
      //log("Initial Dcl time = " + time.seconds)
      let dclTime: number = time.seconds
      if(time1 < time2){
        if(dclTime > time1 && dclTime < time2){
          if(this.eventPlayed == false){
            callbackInTime()
            this.eventPlayed = true
            this.backEventPlayed = false
          }
        }else{
          if (this.backEventPlayed == false){
            if(callbackOutTime != null){callbackOutTime()}
            this.backEventPlayed = true
            this.eventPlayed = false
          }
        }
      }else if(time2 < time1){
        if(dclTime > time1 || dclTime < time2){
          if(this.eventPlayed == false){
            callbackInTime()
            this.eventPlayed = true
            this.backEventPlayed = false
          }
        }else{
          if (this.backEventPlayed == false){
            if(callbackOutTime != null){callbackOutTime()}
            this.backEventPlayed = true
            this.eventPlayed = false
          }
        }
      }
    })
    delay(()=>{this.atTimeRange(time1, time2, ()=>{callbackInTime()}, ()=>{callbackOutTime()})}, 10000) //Volvemos a llamar la accion en un minuto para ver si sigue dentro del tiempo
  }

}