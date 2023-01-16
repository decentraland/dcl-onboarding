import { movePlayerTo } from "@decentraland/RestrictedActions"
import { loadBlockPlayer, UpdateTweenComponentsSystem } from "./imports/index"
import { GenesisManager } from "./genesis/genesis.manager"
import { UserData } from "./imports/user/user.data"
import { getHUD } from "./hud"

function loadStats() {
  const SCENE_CENTER = new Vector3(16, 16, 16)
  const SCENE_SIZE = new Vector3(31, 32, 31)
  const statTriggerEntity = new Entity()
  statTriggerEntity.addComponent(new Transform({ position: SCENE_CENTER, scale: SCENE_SIZE }))
  engine.addEntity(statTriggerEntity)

}

async function loadGuestDisclaimer() {
  getHUD().wgPopUpWallet.show(false)
  await UserData.instance().loadUserData()

  if (UserData.instance().isGuest()) {
    getHUD().wgPopUpWallet.show(true)
  } else {
    getHUD().wgKeyBoard.image.visible = true
  }

}

function moveDebug() {
  //Debug TP player to robot
  var count = 0
  Input.instance.subscribe("BUTTON_DOWN", ActionButton.ACTION_6, false, (e) => {
    if (count < 4) {
      count++
      return
    }
    count = 0

    //Debug Island Quests4
    movePlayerTo(new Vector3(105.93, 77.61, 146.43))

    //QuestRoom.instance().completeOpenBookQuest()

    // StateManager.instance().startState("IslandStartState")
    //StateManager.instance().startState("IslandQuest3State")
    //StateManager.instance().startState("IslandQuest2State")
    //StateManager.instance().startState("IslandQuest3State")
    StateManager.instance().startState("PortalState")

    //Debug Room
    //movePlayerTo(GenesisData.instance().robotEntity.getComponent(Transform).position)
    DebugAccess.instance().log("Debug teleport to robot")
  })
}

export const loadInit = function () {

  UserData.instance().loadUserData()
  loadBlockPlayer()
  getHUD()

  // This is the function that runs when the scene is ready
  // loadGuestDisclaimer()
  // moveDebug()
  engine.addSystem(new UpdateTweenComponentsSystem())

  GenesisManager.instance().start()

}

loadInit()

