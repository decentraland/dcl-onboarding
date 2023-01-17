//cannot import this or will cause cylic depedency
//import { CONFIG, initConfig } from "src/config"

//import { CONFIG } from "src/config"

//initConfig()


export function initClaimConfig(){

}

const PROD_PARCHUTE_CAMP_KEY = "PROVIDE_PRODUCTION_KEY_HERE"
const PROD_PARCHUTE_CAMP_KEY_KRAKEN = "PROVIDE_PRODUCTION_KEY_HERE"


function toStringURLArray(wearableInstArr: WearableEnumInst[]): string[] {
  const urnArr: string[] = []
  for (const p in wearableInstArr) {
    const urn = wearableInstArr[p].urn
    if (urn !== undefined) {
      urnArr.push(urn)
    }
  }
  return urnArr
}

export type WearableEnumConstructorArg = {
  address?: string
  urn?: string
  name?: string
  itemId?: string
}
export class WearableEnumInst {
  name?: string
  address?: string
  urn?: string
  itemId?: string

  constructor(args: WearableEnumConstructorArg) {
    if (args && args.name) this.name = args.name
    if (args && args.address) this.address = args.address
    if (args && args.itemId) this.itemId = args.itemId
    if (args && args.urn) this.urn = args.urn
    if (this.address && this.itemId && this.urn) {
      if (this.urn.indexOf(this.address + ":" + this.itemId)) {
        log("WARNING address + itemId vs urn missmatch!!", this.urn, "vs", this.address, this.itemId, "for", this.name)
        log("WARNING address + itemId vs urn missmatch!!", this.urn, "vs", this.address, this.itemId, "for", this.name)
        log("WARNING address + itemId vs urn missmatch!!", this.urn, "vs", this.address, this.itemId, "for", this.name)
      }
    } else if (this.address && this.urn) {
      if (this.urn.indexOf(this.address)) {
        log("WARNING address  vs urn missmatch!!", this.urn, "vs", this.address, this.itemId, "for", this.name)
        log("WARNING address  vs urn missmatch!!", this.urn, "vs", this.address, this.itemId, "for", this.name)
        log("WARNING address  vs urn missmatch!!", this.urn, "vs", this.address, this.itemId, "for", this.name)
      }
    }
  }
}
//json is json copied from reward server UI
function createWerableEnumInst(json:{collectionAddress:string,collectionName:string,itemName:string,itemId:string,rarity:string}){
  return new WearableEnumInst({ name: json.itemName, address: json.collectionAddress, itemId: json.itemName, urn: 'urn:decentraland:matic:collections-v2:'+json.collectionAddress+':'+json.itemId+'' })
}
export class WearableEnum {
  //0 is bucket hat
  //2 is raincoat

  static PLACEHOLDER_TODO_NEED_ACTUAL_WEARBLE_DATA_HERE = new WearableEnumInst({ name: "PLACEHOLDER_TODO_NEED_ACTUAL_WEARBLE_DATA_HERE", address: "0xa4a345afb8fa378cdabc68e83e1a578c810f0abb", itemId: "5", urn: 'urn:decentraland:matic:collections-v2:0xa4a345afb8fa378cdabc68e83e1a578c810f0abb:5' })

  //{"collectionAddress":"0x6804ac297f50a099c454a1d3cef2e5a97ddb93f2","collectionName":"Party Degens","itemName":"Woodstock 3.0","itemId":"0","rarity":"epic"}
  static EMOTE = createWerableEnumInst({"collectionAddress":"0x167d6b63511a7b5062d1f7b07722fccbbffb5105","collectionName":"Decentraland Tutorial Wearables","itemName":"Bezier Dance","itemId":"0","rarity":"common"})
  static VEST = createWerableEnumInst({"collectionAddress":"0x167d6b63511a7b5062d1f7b07722fccbbffb5105","collectionName":"Decentraland Tutorial Wearables","itemName":"Vest - Mat Quest","itemId":"1","rarity":"common"})
  static CAP = createWerableEnumInst({"collectionAddress":"0x167d6b63511a7b5062d1f7b07722fccbbffb5105","collectionName":"Decentraland Tutorial Wearables","itemName":"Tobor Cap - Kit Quest","itemId":"2","rarity":"common"})

}

const TEST_CAMPAIGN_ID = '649c5e38-bef8-4bd6-b13f-bd6a2bdcc096'
const TEST_CAMPAIGN_KEY = 'eyJpZCI6ImJjMmQ1NWRjLWY3Y2UtNDEyOS05ODMxLWE5Nzk4ZTlmMTRiMSIsImNhbXBhaWduX2lkIjoiNjQ5YzVlMzgtYmVmOC00YmQ2LWIxM2YtYmQ2YTJiZGNjMDk2In0=.ECydl7nxWNUAgPWNgskHcFsqRGArULfHRtMyfc1UXIY='

const PROVIDE_PRODUCTION_KEY_HERE = "PROVIDE_PRODUCTION_KEY_HERE"
/**
 * artnet
 * burton
 * dcl_artweek
 * dcl_artweek_px
 */

//workaround will rewrite in booststrap
const CONFIG_CLAIM_TESTING_ENABLED = false



export type ClaimConfigInstType = {
  refId: string,
  campaign: string,
  campaignKeys: Record<string,string>
  wearableUrnsToCheck: string[]
}


export const ClaimConfig = {
  //rewardsServer: CONFIG_CLAIM_TESTING_ENABLED ? 'https://rewards.decentraland.io' : 'https://rewards.decentraland.org',
  rewardsServer: CONFIG_CLAIM_TESTING_ENABLED ? 'https://rewards.decentraland.io' : 'https://rewards.decentraland.org',
  campaign: {
    EMOTE: {
        refId: "emote",
          campaign: CONFIG_CLAIM_TESTING_ENABLED ? TEST_CAMPAIGN_ID : "4f39311b-8bd6-4dc0-b481-d2d12350a1b7",
        campaignKeys: {
          key1: CONFIG_CLAIM_TESTING_ENABLED ? TEST_CAMPAIGN_KEY
            : "eyJpZCI6IjJhNjY0NGY4LWIxNzEtNDZlNC05ZDJmLTIzZmYwNzJiNWU3ZSIsImNhbXBhaWduX2lkIjoiNGYzOTMxMWItOGJkNi00ZGMwLWI0ODEtZDJkMTIzNTBhMWI3In0=.WboJjCfelGNKUnq8Lm7bC5J0Zp9Nf54PjLcjd3ZkCVc=",
        },
        wearableUrnsToCheck: toStringURLArray([
          WearableEnum.EMOTE
        ])
      },
    VEST: {
        refId: "vest",
        campaign: CONFIG_CLAIM_TESTING_ENABLED ? TEST_CAMPAIGN_ID : "4f39311b-8bd6-4dc0-b481-d2d12350a1b7",
        campaignKeys: {
          key1: CONFIG_CLAIM_TESTING_ENABLED ? TEST_CAMPAIGN_KEY
            : "eyJpZCI6IjVmMjA4OGRhLTc4MmYtNDk0OS05YmQyLTcyM2ZiZTRmY2U1NiIsImNhbXBhaWduX2lkIjoiNGYzOTMxMWItOGJkNi00ZGMwLWI0ODEtZDJkMTIzNTBhMWI3In0=.8WlZ55X7hsVaRHK35niEoOxcrCtPNCy7-0HDZ12ikn4=",
        },
        wearableUrnsToCheck: toStringURLArray([
          WearableEnum.VEST
        ])
      },
    CAP: {
        refId: "cap",
        campaign: CONFIG_CLAIM_TESTING_ENABLED ? TEST_CAMPAIGN_ID : "4f39311b-8bd6-4dc0-b481-d2d12350a1b7",
        campaignKeys: {
          key1: CONFIG_CLAIM_TESTING_ENABLED ? TEST_CAMPAIGN_KEY
            : "eyJpZCI6IjgwMGJkMmY2LWI3ODYtNDY1Ny1iMTQ1LWZkNTRmNjgyNzAyNCIsImNhbXBhaWduX2lkIjoiNGYzOTMxMWItOGJkNi00ZGMwLWI0ODEtZDJkMTIzNTBhMWI3In0=.wnO73VddYOJPcfVzTenGwID4-02zjonI0wdy7S4dUwY=",
        },
        wearableUrnsToCheck: toStringURLArray([
          WearableEnum.CAP
        ])
      }
  }
}

export function updateConfigToTesting(testing:boolean){
  if(testing==false){
    return;
  }
  log("updateConfigToTesting in testing rewriting all")
  ClaimConfig.rewardsServer = 'https://rewards.decentraland.io'
  for(const p in ClaimConfig.campaign){
    const obj = (ClaimConfig.campaign as any)[p]

    if(obj !== undefined){
        obj.campaign = TEST_CAMPAIGN_ID
      if(obj.campaignKeys !== undefined){
        for(const q in obj.campaignKeys){
          obj.campaignKeys[q] = TEST_CAMPAIGN_KEY
        }
      }
    }
  }
}
