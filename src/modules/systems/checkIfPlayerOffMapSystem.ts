import { movePlayerTo } from "@decentraland/RestrictedActions";
import { SpawnIsland } from "src/genesis/quests/questStartIsland";
import { IntervalUtil } from "../utils/interval-util";

const interval = new IntervalUtil(5000)

const camera = Camera.instance

export class CheckIfPlayerOffMapSystem implements ISystem {

  update(dt: number) {
    if(interval.update(dt)){
      //check player is on land. if fell too far bring them back up
      if(camera.feetPosition.y < 40){
        log("player fell, move them back to start: pos.y:",camera.feetPosition.y)   
        movePlayerTo(SpawnIsland.instance().SPAWN_POSITION.clone().add(new Vector3(0, 1, 0)), SpawnIsland.instance().SPAWN_TARGET.clone())
      }else{
        //log("player good, ",camera.feetPosition.y)
      }
    }
  }
}

engine.addSystem(new CheckIfPlayerOffMapSystem())