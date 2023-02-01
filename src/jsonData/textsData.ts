
import * as text2D from "./textsTutorialPopups"

export class Text {
  text: { en: string }
  comfirmText?: { en: string, fontSize?: number }
  cancelText?: { en: string, fontSize?: number }
  fontSize: number
  vAlign: string
  portrait: string
  nextTextIndex?: number
  bIsComfirmText?: boolean = false
  comfirmTextIndex?: number
  cancelTextIndex?: number
  comfirmFunction?: Function
  cancelFunction?: Function
  callback?: Function
  bEndDialog?: boolean = false
}
export class Dialog {
  texts: Text[]
}
export const textDialogs: Dialog[] = [
  {
    texts: [//dialog index 0 (Tobor)
      {
        text: { // text 0
          en: text2D.START_ISLAND_0,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",

      },
      {
        text: { // text 1
          en: text2D.START_ISLAND_1,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      },
      {
        text: { // text 2
          en: text2D.START_ISLAND_2,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
        bEndDialog: true,
      },
      {
        text: { // text 3
          en: text2D.START_ISLAND_3,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      },
      {
        text: {   // text 4
          en: text2D.START_ISLAND_4,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      },
      {
        text: { // text 5
          en: text2D.START_ISLAND_5,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Happy.png",
        bEndDialog: true,
      },
      {
        text: { // text 6
          en: "",
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      },
      // {
      //   text: { // text 7
      //     en: text2D.ROOM_CAMERA_2,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      //   bEndDialog: true,
      // },
      // {
      //   text: {   // text 8
      //     en: text2D.ROOM_BOOK_0,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Happy.png",
      // },
      // {
      //   text: {   // text 9
      //     en: text2D.ROOM_BOOK_1,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      //   bEndDialog: true,
      // },
      // {
      //   text: {  // text 10
      //     en: text2D.ROOM_BOOK_2,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      //   bEndDialog: true
      // },
      // {
      //   text: {  // text 11
      //     en: text2D.ROOM_BOOK_3,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Happy.png",
      // },
      // {
      //   text: {  // text 12
      //     en: text2D.ROOM_BOOK_4,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      // },
      // {
      //   text: {   // text 13
      //     en: text2D.ROOM_BOOK_5,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      //   bEndDialog: true,
      // },
      // {
      //   text: {  // text 14
      //     en: text2D.ROOM_BOOK_6,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Happy.png",
      // },
      // {
      //   text: {   // text 15
      //     en: text2D.ROOM_BOOK_7,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      //   bEndDialog: true,

      // },
      // {
      //   text: {   // text 16
      //     en: text2D.TUNNEL_0,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      // },
      // {
      //   text: {   // text 17
      //     en: text2D.TUNNEL_1,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      // },
      // {
      //   text: {   // text 18
      //     en: text2D.TUNNEL_2,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      //   bEndDialog: true

      // },
      // {
      //   text: {   // text 19
      //     en: text2D.TUNNEL_JUMP_0,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      // },
      // {
      //   text: {   // text 20
      //     en: text2D.TUNNEL_JUMP_1,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      //   bEndDialog: true,

      // },
      // {
      //   text: {   // text 21
      //     en: text2D.TUNNEL_AFTERJUMP_0,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      // },
      // {
      //   text: {   // text 22
      //     en: text2D.TUNNEL_AFTERJUMP_1,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Happy.png",
      //   bEndDialog: true,
      // },
      // {
      //   text: {   // text 23
      //     en: text2D.TUNNEL_AFTERJUMP_2,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      //   bEndDialog: true,
      // },
    ]
  },
  {
    texts: [//dialog index 1 Tobor in zone 0
      // {
      //   text: { //0
      //     en: text2D.ZONE_0_ROBOT_WELCOME_0,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      // },
      // {
      //   text: { //1
      //     en: text2D.ZONE_0_ROBOT_WELCOME_1,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      // },
      // {
      //   text: { //2
      //     en: text2D.ZONE_0_ROBOT_WELCOME_2,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      //   bEndDialog: true
      // },
      // {
      //   text: { //3
      //     en: text2D.ZONE_0_ROBOT_PILAR_0,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      // },
      // {
      //   text: { //4
      //     en: text2D.ZONE_0_ROBOT_PILAR_1,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      // },
      // { //5
      //   text: {
      //     en: text2D.ZONE_0_ROBOT_PILAR_2,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      // },
      // { //6
      //   text: {
      //     en: text2D.ZONE_0_ROBOT_PILAR_3,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      //   bEndDialog: true
      // },
      // { //7
      //   text: {
      //     en: text2D.ZONE_0_ROBOT_PILAR_4,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      //   bEndDialog: true
      // }

    ]
  },
  {
    texts: [//dialog index 2 Fox in zone 1 (Bezier)
      {
        text: { //0
          en: text2D.SECOND_ISLAND_0,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Idle.png",
      },
      {
        text: { //1
          en: text2D.SECOND_ISLAND_1,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Talking.png",
      },
      {
        text: { //2
          en: text2D.SECOND_ISLAND_2,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Sourprised.png",
        bEndDialog: true
      },
      {
        text: { //3
          en: text2D.SECOND_ISLAND_3,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Sourprised.png",
      },
      {
        text: { //4
          en: text2D.SECOND_ISLAND_4,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Happy.png",
      },
      { 
        text: { //5
          en: text2D.SECOND_ISLAND_5,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Happy.png",
        bEndDialog: true
      },
      { 
        text: { //6
          en: text2D.SECOND_ISLAND_6,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Talking.png",
        bEndDialog: true
      },
      { 
        text: { //7
          en: text2D.SECOND_ISLAND_0,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Idle.png",
        bEndDialog: true
      },
      { 
        text: { //8
          en: text2D.SECOND_ISLAND_0,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Talking.png",
        bEndDialog: true
      },
      { 
        text: { //9
          en: text2D.SECOND_ISLAND_0,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Talking.png",
        bEndDialog: true,
        bIsComfirmText: false,
      },      { 
        text: { //10
          en: text2D.SECOND_ISLAND_7,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Fox_Idle.png",
        bEndDialog: true
      },
    ]
  },
  {
    texts: [//dialog index 3 Raccon in central zone
      {
        text: { //Id 0
          en: text2D.THIRD_ISLAND_0,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Idle.png",
      },
      {
        text: { //Id 1
          en: text2D.THIRD_ISLAND_1,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Happy.png",
      },
      {
        text: { //Id 2
          en: text2D.THIRD_ISLAND_2,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Sourprised.png",
      },
      {
        text: { //Id 3
          en: text2D.THIRD_ISLAND_3,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Happy.png",
        bEndDialog: true,
      },
      {
        text: { //Id 4
          en: text2D.THIRD_ISLAND_4,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Idle.png",
        bEndDialog: true,
      },
      {
        text: { //Id 5
          en: text2D.THIRD_ISLAND_5,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Idle.png",
        bEndDialog: true,
      },
      {
        text: { //Id 6
          en: text2D.THIRD_ISLAND_6,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Idle.png",
      },
      {
        text: { //Id 7
          en: text2D.THIRD_ISLAND_7,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Idle.png",
      },
      {
        text: { //Id 8
          en: text2D.THIRD_ISLAND_8,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Happy.png",
        bEndDialog: true,
      },
      {
        text: { //Id 9
          en: text2D.THIRD_ISLAND_9,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Happy.png",
        bEndDialog: true,
      },
      { 
        text: { //10
          en: text2D.THIRD_ISLAND_10,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Happy.png",
        bEndDialog: false
      },
      { 
        text: { //11
          en: text2D.THIRD_ISLAND_11
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Happy.png",
        bEndDialog: true
      },
      // {
      //   text: { //Id 10
      //     en: text2D.EVENT2_10_NPC2,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Happy.png",
      //   bEndDialog: true,
      //   bIsComfirmText: false,
      // },
      // {
      //   text: { //Id 11
      //     en: text2D.PARTY_DEPLOY_NPC_2,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Happy.png",
      //   bEndDialog: true,
      //   bIsComfirmText: false,

      // },
      // , {
      //   text: { //Id 12
      //     en: text2D.EVENT4_0_NPC4,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Sourprised.png",
      //   bEndDialog: true,
      //   bIsComfirmText: false,
      // },
      // {
      //   text: { //Id 13
      //     en: text2D.EVENT4_1_NPC4,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Sourprised.png",
      //   bEndDialog: true,
      //   bIsComfirmText: false,
      // }
    ]
  },
  {
    texts: [ //Dialog index 4 Raccon in zone 3
      {
        text: { //Id 0
          en: text2D.FOURTH_ISLAND_0,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Idle.png",
      },
      {
        text: { //Id 1
          en: text2D.FOURTH_ISLAND_1,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Sourprised.png",
      },
      {
        text: { //Id 2
          en: text2D.FOURTH_ISLAND_2,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Talking.png",
        bEndDialog: true
      },
      {
        text: { //Id 3
          en: text2D.FOURTH_ISLAND_3,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Talking.png",
        bEndDialog: true
      },
      {
        text: { //Id 4
          en: text2D.FOURTH_ISLAND_4,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Sourprised.png",
        bEndDialog: true

      },
      {
        text: { //Id 5
          en: text2D.FOURTH_ISLAND_5,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Sourprised.png",
        bEndDialog: true

      },
      {
        text: { //Id 6
          en: text2D.FOURTH_ISLAND_6,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Talking.png",
        bEndDialog: true
      },
      // {
      //   text: { //Id 7
      //     en: text2D.EVENT3_7_NPC3,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Talking.png",
      //   bEndDialog: true
      // },
      // {
      //   text: { //Id 8
      //     en: text2D.EVENT3_8_NPC3,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Racoon2_Sourprised.png",
      //   bEndDialog: true
      // },
      // {
      //   text: { //Id 9
      //     en: text2D.PARTY_DEPLOY_NPC_3,
      //   },
      //   fontSize: 18,
      //   vAlign: "0%",
      //   portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Sourprised.png",
      //   bEndDialog: true,
      // }
    ]
  },
  {
    texts: [ //Dialog NPCs(Help others) 5
      {
        text: {
          en: text2D.PORTAL_ISLAND_0,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
      },
      {
        text: {
          en: text2D.PORTAL_ISLAND_1,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
      },
      {
        text: {
          en: text2D.PORTAL_ISLAND_2,
        },
        fontSize: 18,
        vAlign: "0%",
        portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
        bEndDialog: true,
      },
    ]
  },
  // {
  //   texts: [ //Dialog NPCs(Go party) 6
  //     {
  //       text: {
  //         en: text2D.EVENT3_8_NPC3,
  //       },
  //       fontSize: 18,
  //       vAlign: "0%",
  //       portrait: "assets/ui/portraits/UI_NPC_Character_Racoon1_Idle.png",
  //       bEndDialog: true
  //     },
  //   ]
  // },
  // {
  //   texts: [ //Dialog NPCs(Go party) 7
  //     {
  //       text: {
  //         en: text2D.EVENT3_NPC0_3,
  //       },
  //       fontSize: 18,
  //       vAlign: "0%",
  //       portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Idle.png",
  //       bEndDialog: true
  //     },
  //     {
  //       text: {
  //         en: text2D.PORTAL_ROBOT_0,
  //       },
  //       fontSize: 18,
  //       vAlign: "0%",
  //       portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
  //     },
  //     {
  //       text: {
  //         en: text2D.PORTAL_ROBOT_1,
  //       },
  //       fontSize: 18,
  //       vAlign: "0%",
  //       portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
  //     },
  //     {
  //       text: {
  //         en: text2D.PORTAL_ROBOT_2,
  //       },
  //       fontSize: 18,
  //       vAlign: "0%",
  //       portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
  //     },
  //     {
  //       text: {
  //         en: text2D.PORTAL_ROBOT_3,
  //       },
  //       fontSize: 18,
  //       vAlign: "0%",
  //       portrait: "assets/ui/portraits/UI_NPC_Character_Robot_Talking.png",
  //       bEndDialog: true
  //     },
  //   ]
  // }
]

//Get textures
export function getTexture(dialogId: number, textId: number): Texture {
  let src = ""
  if (textDialogs[dialogId]) {
    if (textDialogs[dialogId].texts[textId]) {
      src = textDialogs[dialogId].texts[textId].portrait
      let texture = new Texture(src)
      return texture;
    }
    else return new Texture("");
  }
  else new Texture("");
}

export function getTextData(dialogId: number, textId: number): Text {
  if (textDialogs[dialogId]) {
    if (textDialogs[dialogId].texts[textId]) {
      return textDialogs[dialogId].texts[textId];
    }
    else return null;
  }
  else return null;

}

export function getText(dialogId: number, textId: number, textLanguage: string): string {
  if (textDialogs[dialogId]) {
    if (textDialogs[dialogId].texts[textId]) {
      if (!textDialogs[dialogId].texts[textId].text[textLanguage]) {
        textLanguage = 'en'
      }
      return textDialogs[dialogId].texts[textId].text[textLanguage];
    }
    else return "";
  }
  else return "";

}
