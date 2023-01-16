//Forbiden imports here


//Global access to the game data
class GenesisData {

    //Variables of quest 1
    quest1: {
        bCompleted: boolean,
        npc1: IEntity,
        npc1Anim: Entity,
    }

    //Variables of quest 2
    quest2: {
        bCompleted: boolean,
        npc2: Entity,
        npc2Anim: Entity,
        lastQuest: boolean,
    }

    //Variables of quest 3
    quest3: {
        bCompleted: boolean,
        npc3: Entity,
        npc3Anim: Entity,
    }

    //Other variables
    robotEntity: Entity;

    targeterRobot: ObjectiveTarget
    targeterNpc1: ObjectiveTarget
    targeterNpc3: ObjectiveTarget
    targeterNpc2: ObjectiveTarget

    particleGlowEntity: Entity

    onStartHideKeyboardUI: () => void = () => { }
    onEndHideKeyboardUI: () => void = () => { }

    bCameraLocked: boolean = false;

    readonly startPlayTime: number = Date.now()

    private static instanceRef: GenesisData;

    bdeploy: boolean = false;

    private constructor() {

        this.quest1 = {
            bCompleted: false,
            npc1: null,
            npc1Anim: null,

        }

        this.quest2 = {
            bCompleted: false,
            npc2: null,
            npc2Anim: null,

            lastQuest: false
        }
        this.quest3 = {
            bCompleted: false,
            npc3: null,
            npc3Anim: null,

        }
    }
    public static instance(): GenesisData { return this.instanceRef || (this.instanceRef = new this()); }
}