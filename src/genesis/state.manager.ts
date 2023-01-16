//Prohibido poner imports

enum GameState {
    ISLAND_START = "IslandStartState",
    ISLAND_QUEST1 = "IslandQuest1State",
    ISLAND_QUEST2 = "IslandQuest2State",
    ISLAND_QUEST3 = "IslandQuest3State",
    PORTAL = "PortalState",
}

class StateManager {
    private static instanceRef: StateManager;
    public static instance(): StateManager { return this.instanceRef || (this.instanceRef = new this()); }
    private constructor() { }

    private states: { [key: string]: State } = {};

    private currentState: State;

    public addState(state: State) {
        this.states[state.name] = state;
    }

    public getState(name: string): State {
        return this.states[name];
    }

    public initState(name: string) {
        this.states[name].init();
    }

    public startState(name: string) {
        if (this.currentState) {
            this.currentState.end();
        }
        this.currentState = this.states[name];
        this.states[name].start();
    }

    getCurrentState(): State {
        return this.currentState;
    }
    public isInState(name: GameState): boolean {
        return this.currentState.name == name;
    }

}

interface State {
    readonly name: GameState;
    init(): void
    start(): void;
    end(): void;
}