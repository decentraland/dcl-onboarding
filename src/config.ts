import { isPreviewMode } from '@decentraland/EnvironmentAPI'
import { DispenserPos } from "./claiming-dropin/claiming/claimTypes"


const ParcelCountX:number = 12
const ParcelCountZ:number = 8

const DEFAULT_ENV = "prd" //set to local to use local values


const FORCE_PREVIEW_VAL: Record<string, boolean> = {
  local: true,//for local testing if u need different value
  stg: true,//DEV/preview
  prd: false,//PROD/live use this for launch
};
const FAKE_LOCALLY_VAL: Record<string, boolean> = {
  local: true,//for local testing if u need different value
  stg: false,//DEV/preview
  prd: false,//PROD/live use this for launch
};

const DEBUG_CLAIMING_FLAGS_VAL: Record<string, boolean> = {
  local: true,//for local testing if u need different value
  stg: false,//DEV/preview
  prd: false,//PROD/live use this for launch
};


const DEBUG_VIDEO_PANEL_FLAGS_VAL: Record<string, boolean> = {
  local: true,//for local testing if u need different value
  stg: true,//DEV/preview
  prd: false,//PROD/live use this for launch
}; 


const REMOTE_VIDEO_CONFIG: Record<string, string> = {
    "local": "PROVIDE CONFIG JSON HERE",//for local testing if u need different value
    "stg": "PROVIDE CONFIG JSON HERE",//DEV/preview
    "prd": "PROVIDE CONFIG JSON HERE",//PROD/live use this for launch
};

enum QuestTypeEnum{
  EMOTE='emote',
  MATERIAL='material',
  PUZZLE='puzzle'
} 

const CLAIM_NONWEB3_SHOW_DISCLAIMER_FLAG: Record<string, Record<QuestTypeEnum,boolean>> = {
  "local": {emote:true,material:true,puzzle:true},//for local testing if u need different value
  "stg": {emote:true,material:true,puzzle:true},//DEV/preview
  "prd": {emote:true,material:false,puzzle:false},//PROD/live use this for launch
};

const ENABLED_DETECT_SCENE_ACTIVE_UTIL = true 
export class Config{
  sizeX!:number
  sizeY!:number
  sizeZ!:number

  IN_PREVIEW = false//IN_PREVIEW set dynamically below in initConfig=>isPreviewMode 
  FORCE_PREVIEW_ENABLED = FORCE_PREVIEW_VAL[DEFAULT_ENV] //will override IN_PREVIEW

  center!:Vector3
  centerGround!:Vector3
  
  initAlready:boolean = false 

  //if trigger is visibile
  DEBUG_ACTIVE_SCENE_TRIGGER_ENABLED=false //show debug trigger shape for active area
  DEBUG_3D_PANEL_ENABLED=DEBUG_VIDEO_PANEL_FLAGS_VAL[DEFAULT_ENV] 
  DEBUG_2D_PANEL_ENABLED=DEBUG_VIDEO_PANEL_FLAGS_VAL[DEFAULT_ENV]
  DEBUG_3D_PANEL_POSITION=new Vector3(8, 7.7+2, 8)
 
  //
  ENABLED_DETECT_SCENE_ACTIVE_UTIL = ENABLED_DETECT_SCENE_ACTIVE_UTIL
  //detect if video is allowed to be played
  CAN_PLAY_VIDEO = !ENABLED_DETECT_SCENE_ACTIVE_UTIL


  //START claiming/dispensers
  CLAIM_TESTING_ENABLED = DEBUG_CLAIMING_FLAGS_VAL[DEFAULT_ENV]
  CLAIM_TESTING_CAPTCHA_ENABLED = DEBUG_CLAIMING_FLAGS_VAL[DEFAULT_ENV]
  CLAIM_DO_HAS_WEARABLE_CHECK = false
  CLAIM_DATE_TESTING_ENABLED = DEBUG_CLAIMING_FLAGS_VAL[DEFAULT_ENV]
  DISPENSER_POSITIONS:DispenserPos[] = [] 
  CLAIM_CAPTCHA_ENABLED = true //worlds needs recaptcha since world catalyst not trusted by reward server
  CLAIM_NONWEB3_SHOW_DISCLAIMER = CLAIM_NONWEB3_SHOW_DISCLAIMER_FLAG[DEFAULT_ENV]
  //END claiming/dispensers
 
  init(){
    if(this.initAlready) return;

    this.sizeX = ParcelCountX*16
    this.sizeZ = ParcelCountZ*16 
    this.sizeY = (Math.log((ParcelCountX*ParcelCountZ) + 1) * Math.LOG2E) * 20// log2(n+1) x 20 //Math.log2( ParcelScale + 1 ) * 20
    this.center = new Vector3(this.sizeX/2,this.sizeY/2,this.sizeZ/2)
    this.centerGround = new Vector3(this.sizeX/2,0,this.sizeZ/2)

    this.initAlready = true

  }
}

export const CONFIG = new Config()

export function initConfig(){
  log("initConfig() with " + DEFAULT_ENV)
  CONFIG.init()

  isPreviewMode().then( (val:boolean) =>{
    log("IN_PREVIEW",CONFIG.IN_PREVIEW,val)
    CONFIG.IN_PREVIEW = val || CONFIG.FORCE_PREVIEW_ENABLED
  })
  return CONFIG
}
