// import { QuestEmote } from "./genesis/quests/questEmote";

// const debugCanvas = new UICanvas();

// let buttonA = new UIImage(debugCanvas, new Texture("icon.png"));
// buttonA.isPointerBlocker = true;
// buttonA.onClick = new OnPointerDown(() => {
//     log("//. Use Debugger")
//     QuestEmote.instance().dialogQuestFinished();
//     log("Debugger End")
// });

// buttonA.width = 100;
// buttonA.height = 35;

// buttonA.hAlign = "left"

// buttonA.positionX = 250;
// buttonA.positionY = 300;


export function getDecentralandTimeX() : Promise<{seconds: number}>{
    let resultPromise = new Promise<{seconds: number}>((resolve, reject) => {
        resolve({seconds: Math.random()*3})
    })
    return resultPromise;
}