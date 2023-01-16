import { delay } from "./delay";

type TextContainer = {
    value: string;
    [key: string]: any
}

export class PmText {
    private _text: string
    private _bWriting: boolean = false
    private _timeout: any = null
    private _textContainers: TextContainer[] = []
    private _matchedHTML: RegExpMatchArray[] = []
    private _setTextCallback: (text: string) => void
    constructor(text: string, _textContainers: TextContainer[] = []) {
        this._text = text
        this._textContainers = _textContainers
    }

    public get value() : string {
        return this._text
    }  

    setText(text: string){
        this._text = text
        if (this._textContainers.length > 0) {
            this._textContainers.forEach(textContainer => {
                textContainer.value = text
            });
        }
        if (this._setTextCallback) this._setTextCallback(text)
    }

    setTextWithDelay(text: string, timeBetweenChars: number, callback: (text: string)=>void = ()=>{}) {

        this.stopWritingText()
        this._bWriting = true
        this.checkHTMLTag(text)
        this._setTextWithDelayRecursive(text, timeBetweenChars, callback)

    }

    private _setTextWithDelayRecursive(
        finalText: string,
        delayTime: number, 
        callback: (text: string)=>void, 
        currentText: string = ""
    ) {
        if (!this._bWriting) return;
        
        if (currentText.length < finalText.length) {

            //If there is a html tag, print all of it at once
            if (this._matchedHTML[0] && this._matchedHTML[0].index == currentText.length) {
                currentText = currentText + finalText.substr(this._matchedHTML[0].index, this._matchedHTML[0][0].length)
                this._matchedHTML.shift()          
            }
            else{
                //Add the next char to the text
                currentText = currentText + finalText.charAt(currentText.length)
            }
            
            callback(currentText)
            this.setText(currentText)
            
            let self = this
            //Call recursively for the next char after the delay
            this._timeout = delay(() => {
                self._setTextWithDelayRecursive(finalText, delayTime, callback, currentText)
            }, delayTime);
        }
        else { this._bWriting = false }
      
    }
    //Find an html <> tag in the text
    private matchHTMLTag(text: string): RegExpMatchArray {
        return text.match(/<[^>]*>/)
    }

    private checkHTMLTagRecursive(text: string, index = 0) {
        let match = this.matchHTMLTag(text.substr(index))
        if (match && match[0]) {
            this._matchedHTML.push(match)
            match.index = index + match.index
            index = match.index + match[0].length
            return this.checkHTMLTagRecursive(text, index)
        }
    }
    //Find and store all html <> tags in the text nad its char index
    private checkHTMLTag(text: string) {
        this._matchedHTML = []
        this.checkHTMLTagRecursive(text)
    }


    stopWritingText() {
        if (!this._bWriting) return;

        this._bWriting = false
        if (this._timeout) {
            clearTimeout(this._timeout)
            this._timeout = null
        }
    }

}
