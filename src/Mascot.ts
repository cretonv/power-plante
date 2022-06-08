import Typewriter from 'typewriter-effect/dist/core';

export class Mascot {
    private quotesArray: [string]
    private activeQuote: string
    private mascotContainer: HTMLDivElement
    private typeWriter: Typewriter
    constructor() {
        this.quotesArray = null
    }
    init(quotes, container) {
        this.quotesArray = quotes
        this.mascotContainer = container
        this.typeWriter = new Typewriter('.mascot .quote', {
            autoStart: false,
            cursor: "",
            delay: 25
        });
    }
    changeActiveQuote(index) {
        this.activeQuote = this.quotesArray[index]
        // this.quoteElement.innerHTML = this.activeQuote
        console.log(this.activeQuote)
        this.typeWriter
            .typeString(this.activeQuote)
            .start()
    }
    makeVisible() {
        this.mascotContainer.classList.add('visible')
    }
    hide() {
        this.mascotContainer.classList.remove('visible')
    }
}
