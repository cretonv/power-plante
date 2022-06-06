export class TestTube2D {
    private htmlElement: HTMLDivElement
    private value: number
    constructor() {
        this.htmlElement = null
        this.value = 10
    }
    init(className: String) {
        console.log('.' + className + ' .tube__contents')
        this.htmlElement = document.querySelector('.' + className + ' .tube__contents')
    }
    changeValue(value: number) {
        if(this.value !== 95) {
            this.value = value * 10 - value + 10
            if(this.value > 95) {
                this.value = 95
            }
            this.htmlElement.style.height = this.value + '%'
        }
    }
}
