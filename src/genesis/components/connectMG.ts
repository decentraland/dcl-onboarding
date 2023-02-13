import { getHUD } from "src/hud"
import { GameData } from "src/imports/game.data"
import { delay } from "src/imports/index"
import { AudioManager } from "./audio/audio.manager"

//This is the rotation order of the pieces 
const pieceState = [
    0, 45, 90, 135, 180, 225, 270, 315
]

//3 sets of puzzle pieces
export class ConnectMiniGame {

    board: Entity
    board_mat: Material
    pieces: Piece[] = []

    debug: boolean = true
    firstConection: boolean = false
    boardCompleted: boolean = false

    //Once is completed this callback is called this also avoids cycling dependencies
    completeEvent2PuzzleCallback: Function = () => { }

    puzzle_cable_1_off: Entity[] = []
    puzzle_cable_2_off: Entity[] = []
    puzzle_cable_3_off: Entity[] = []

    puzzle_cable_1_on: Entity[] = []
    puzzle_cable_2_on: Entity[] = []
    puzzle_cable_3_on: Entity[] = []

    bStarted: boolean = false
    piecesActivated: boolean = false

    constructor() {

        this.getPieces()

    }


    getPieces() {

        this.puzzle_cable_1_off = GameData.instance().getEntityArray("puzzle_cable_1_off") as Entity[]
        this.puzzle_cable_1_on = GameData.instance().getEntityArray("puzzle_cable_1_on") as Entity[]

        if (!this.puzzle_cable_1_off || this.puzzle_cable_1_off.length <= 0) {
            DebugAccess.instance().log("puzzle_cable_1_off not found", LogType.ERROR)
        }
        if (!this.puzzle_cable_1_on || this.puzzle_cable_1_on.length <= 0) {
            DebugAccess.instance().log("puzzle_cable_1_on not found", LogType.ERROR)
        }
        for (let i = 0; i < this.puzzle_cable_1_on.length; i++) {
            this.puzzle_cable_1_off[i].getComponent(GLTFShape).visible = true
            this.puzzle_cable_1_on[i].getComponent(GLTFShape).visible = false

        }

        this.puzzle_cable_2_off = GameData.instance().getEntityArray("puzzle_cable_2_off") as Entity[]
        this.puzzle_cable_2_on = GameData.instance().getEntityArray("puzzle_cable_2_on") as Entity[]
        if (!this.puzzle_cable_2_off || this.puzzle_cable_2_off.length <= 0) {
            DebugAccess.instance().log("puzzle_cable_2_off not found", LogType.ERROR)
        }
        if (!this.puzzle_cable_2_on || this.puzzle_cable_2_on.length <= 0) {
            DebugAccess.instance().log("puzzle_cable_2_on not found", LogType.ERROR)
        }
        for (let i = 0; i < this.puzzle_cable_2_on.length; i++) {
            this.puzzle_cable_2_off[i].getComponent(GLTFShape).visible = true
            this.puzzle_cable_2_on[i].getComponent(GLTFShape).visible = false

        }

        this.puzzle_cable_3_off = GameData.instance().getEntityArray("puzzle_cable_3_off") as Entity[]
        this.puzzle_cable_3_on = GameData.instance().getEntityArray("puzzle_cable_3_on") as Entity[]
        if (!this.puzzle_cable_3_off || this.puzzle_cable_3_off.length <= 0) {
            DebugAccess.instance().log("puzzle_cable_3_off not found", LogType.ERROR)
        }
        if (!this.puzzle_cable_3_on || this.puzzle_cable_3_on.length <= 0) {
            DebugAccess.instance().log("puzzle_cable_3_on not found", LogType.ERROR)
        }
        for (let i = 0; i < this.puzzle_cable_3_on.length; i++) {
            this.puzzle_cable_3_off[i].getComponent(GLTFShape).visible = true
            this.puzzle_cable_3_on[i].getComponent(GLTFShape).visible = false

        }


    }

    startGame() {
        if (this.bStarted) return
        this.bStarted = true

        this.pieces.push(new Piece(GameData.instance().getEntity("puzzle_build_1") as Entity, this.puzzle_cable_1_on, this.puzzle_cable_1_off, 3, 0))
        this.pieces.push(new Piece(GameData.instance().getEntity("puzzle_build_2") as Entity, this.puzzle_cable_2_on, this.puzzle_cable_2_off, 4, 0))
        this.pieces.push(new Piece(GameData.instance().getEntity("puzzle_build_3") as Entity, this.puzzle_cable_3_on, this.puzzle_cable_3_off, 5, 0))

        this.boardControl()
    }

    activatePieces() {
        if (this.piecesActivated) return
        this.piecesActivated = true
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].pieceTargeter.showArrow(true)
        }
    }

    boardControl() {
        for (let i = 0; i < this.pieces.length; i++) {
            let piece = this.pieces[i].getEntity()
            if (this.pieces[i].correctState != this.pieces[i].currentState) {
                piece.addComponent(new OnPointerDown(e => {
                    if (this.piecesActivated == false) return
                    this.pieces[i].nextState()
                    this.checkBoard()

                }, { hoverText: "Interact" }))
            }
        }
    }


    checkBoard() {
        let correct = 0
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].correctState == this.pieces[i].currentState) {
                if (!this.firstConection) {
                    this.firstConection = true
                    delay(() => {

                        getHUD().wgTalkNPC3.showToText(3)
                        getHUD().wgPopUpControls.showCameraModeImage(false)
                        getHUD().wgPopUpControls.showCablesImage(true)
                    }, 500)

                }

                if (this.checkallPieces()) {
                    this.boardCompleted = true
                }
            }
        }

        if (this.boardCompleted) {
            this.completeEvent2PuzzleCallback()
        }

    }
    private checkallPieces() {
        let finish = true
        for (let i = 0; i < this.pieces.length; i++) {
            if (!this.pieces[i].checkState()) { return false }
        }
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].getEntity().removeComponent(OnPointerDown)
            this.pieces[i].pieceTargeter.delete()
        }
        return finish
    }

    isGameCompleted() {
        return this.boardCompleted
    }
}


class Piece {
    piece_box: Entity
    currentState: number
    piece_mat: Material
    debug: boolean = true
    correctState: number
    red_mat: Material //Wrong Position Mat
    green_mat: Material //Good Position Mat
    puzzle_cables_on: Entity[]
    puzzle_cables_off: Entity[]
    pieceTargeter: ObjectiveTarget
    piece: Entity

    constructor(_entity: Entity, puzzle_cables_on: Entity[], puzzle_cables_off: Entity[], _startState: number = 0, _correctState: number = 2) {
        this.piece = new Entity()
        this.piece.addComponent(new Transform({ position: new Vector3(0, 0, 0), rotation: Quaternion.Euler(0, 0, 0), scale: new Vector3(1, 1, 1) }))
        this.piece.addComponent(new BoxShape())
        this.piece.getComponent(BoxShape).withCollisions = false
        this.piece.getComponent(BoxShape).visible = true
        this.piece.addComponent(MaterialPool.instance().getTotalTransMaterial())
        this.piece.setParent(_entity)
        engine.addEntity(this.piece)
        this.piece_box = _entity
        this.correctState = _correctState
        this.puzzle_cables_on = puzzle_cables_on
        this.puzzle_cables_off = puzzle_cables_off
        this.piece_mat = this.red_mat
        engine.addEntity(this.piece_box)
        this.pieceTargeter = new ObjectiveTarget({ position: this.piece_box.getComponent(Transform).position })
        this.pieceTargeter.setArrowHeight(0.8)
        this.setState(_startState)
        this.pieceTargeter.showArrow(false)
    }


    nextState() {
        this.currentState++
        AudioManager.instance().playOnce("puzzle_interact", { volume: 0.5, parent: this.piece })

        if (this.currentState >= pieceState.length) {
            this.currentState = 0
        }
        this.piece_box.getComponent(Transform).rotate(new Vector3(1, 0, 0), 45)
        if (this.currentState == this.correctState) AudioManager.instance().playOnce("puzzle_all_connect", { volume: 0.8, parent: this.piece })

        return this.checkState()
    }

    setState(_state: number) {
        this.currentState = _state
        this.piece_box.getComponent(Transform).rotate(new Vector3(1, 0, 0), 45 * this.currentState)
        this.checkState()
    }

    getEntity() {
        return this.piece
    }

    /**
     * If the current state of the puzzle is the same as the correct state, then turn off the cables
     * that are off and turn on the cables that are on. If the current state of the puzzle is not the
     * same as the correct state, then turn on the cables that are off and turn off the cables that are
     * on.
     */
    checkState() {

        if (this.currentState == this.correctState) {
            this.puzzle_cables_off.forEach(element => {
                element.getComponent(GLTFShape).visible = false
            });
            this.puzzle_cables_on.forEach(element => {
                element.getComponent(GLTFShape).visible = true

            });
            this.pieceTargeter.showArrow(false)

            return true
        } else {
            this.puzzle_cables_off.forEach(element => {
                element.getComponent(GLTFShape).visible = true
            });
            this.puzzle_cables_on.forEach(element => {
                element.getComponent(GLTFShape).visible = false
            });

            this.pieceTargeter.showArrow(true)

            return false
        }
    }


}
