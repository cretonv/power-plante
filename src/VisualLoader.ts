export class VisualLoader {
    private valueSpan: HTMLSpanElement
    private loadBar: HTMLDivElement

    constructor() {
        this.valueSpan = document.querySelector('.loader .value')
        this.loadBar = document.querySelector('.loader .load-bar .level')
    }

    changeValue(newValue: number) {
        if(newValue === 100) {
            newValue = 99
        }
        this.valueSpan.innerText = String(newValue)
        this.loadBar.style.width = newValue + '%'
    }

}
