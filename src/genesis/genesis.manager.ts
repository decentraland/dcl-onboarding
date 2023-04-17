import { bootStrapClaimingDropins } from "src/claiming-dropin/bootstrapClaiming";
import { initClaimConfig } from "src/claiming-dropin/claiming/loot-config";
import { initConfig } from "src/config";
import { GameData } from "src/imports/game.data";
import { initDispenserPositions, initSceneClaiming } from "src/modules/claiming/claimSetup";
import { CameraModeManager } from "./cameraMode";
import { QuestEmote } from "./quests/questEmote";
import { QuestMaterials } from "./quests/questMaterials";
import { QuestPortal } from "./quests/questPortal";
import { QuestPuzzle } from "./quests/questPuzzle";
import { SpawnIsland } from "./quests/questStartIsland";
import { getHUD } from "src/hud";

//All game manager
export class GenesisManager {

    private static instanceRef: GenesisManager;
    public static instance(): GenesisManager { return this.instanceRef || (this.instanceRef = new this()); }
    stateStarted = false;
    private constructor() {

        CameraModeManager.instance()

        StateManager.instance().addState(new IslandStartState());
        StateManager.instance().addState(new IslandQuest1State());
        StateManager.instance().addState(new IslandQuest2State());
        StateManager.instance().addState(new IslandQuest3State());

        StateManager.instance().addState(new PortalState());

        //Example: load all room data on GenesisManager construct
        StateManager.instance().initState("IslandStartState");

        StateManager.instance().initState("IslandQuest1State");
        StateManager.instance().initState("IslandQuest2State");
        StateManager.instance().initState("IslandQuest3State");

        StateManager.instance().initState("PortalState");



        //INITIALIZING claiming
        initConfig()
        bootStrapClaimingDropins()
        initClaimConfig()
        initDispenserPositions()
        initSceneClaiming()

    }

    start() {
        if (this.stateStarted) return;
        this.stateStarted = true;
        this.startRoom();
    }

    startRoom() {
        StateManager.instance().startState("IslandStartState");
    }

}


class IslandStartState implements State {
    readonly name: GameState = GameState.ISLAND_START;
    //Put on true if you want to start with orbs active for camera control tutorial
    readonly startWithOrbs = false;
    stateStarted = false;
    init() {
        SpawnIsland.instance().loadTagData();
    }
    start() {
        if (this.stateStarted) return;
        this.stateStarted = true;
        GameData.instance().setVar("start_with_orbs", this.startWithOrbs)
        SpawnIsland.instance().startSpawnIsland();
    }
    end() {
        
    }
}

class IslandQuest1State implements State {
    readonly name: GameState = GameState.ISLAND_QUEST1;
    stateStarted = false;
    init() {
        QuestEmote.instance().loadTagData();
    }
    start() {
        if (this.stateStarted) return;
        this.stateStarted = true;
        QuestEmote.instance().startQuest1();
    }
    end() {
        log("IslandQuest1State","end","ENTRY")
        log("IslandQuest1State","end","onPointerLockedStateChange.clear")
        //onPointerLockedStateChange
        //ensure take control is removed
        //up to this point the "take control , clear cursor msg: is OK but will start to conflict
        //with the "press V" message, long term they have to fix the fact they all share same parent container :(
        getHUD().wgPopUpControls.showTakecontrolCameraImage(false,0)
        onPointerLockedStateChange.clear()
    }
}

class IslandQuest2State implements State {
    readonly name: GameState = GameState.ISLAND_QUEST2;
    stateStarted = false;
    init() {
        QuestMaterials.instance().loadTagData();
    }
    start() {
        if (this.stateStarted) return;
        this.stateStarted = true;
        QuestMaterials.instance().startQuest();
    }
    end() {
        
    }
}

class IslandQuest3State implements State {
    readonly name: GameState = GameState.ISLAND_QUEST3;
    stateStarted = false;
    init() {
        QuestPuzzle.instance().loadTagData();
    }
    start() {
        if (this.stateStarted) return;
        this.stateStarted = true;
        QuestPuzzle.instance().startQuestPuzzle();
    }
    end() {

    }
}


class PortalState implements State {
    readonly name: GameState = GameState.PORTAL;
    stateStarted = false;
    init() {
        QuestPortal.instance().loadTagData();
    }
    start() {
        if (this.stateStarted) return;
        this.stateStarted = true;
        QuestPortal.instance().startQuestPortal();
    }
    end() {

    }
} 