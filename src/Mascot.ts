import Typewriter from 'typewriter-effect/dist/core';

export class Mascot {
    private quotesArray: [string]
    private activeQuote: string
    private mascotContainer: HTMLDivElement
    private quoteElement: HTMLDivElement
    private typeWriter: Typewriter
    constructor() {
        this.quotesArray = null
    }
    init(quotes, container, quoteElement) {
        this.quotesArray = quotes
        this.mascotContainer = container
        this.quoteElement = quoteElement
        this.typeWriter = new Typewriter('.mascot .quote', {
            autoStart: false,
            cursor: "",
            delay: 18
        });
    }
    changeActiveQuote(index) {
        this.activeQuote = this.quotesArray[index]
        // this.quoteElement.innerHTML = this.activeQuote
        console.log(this.activeQuote)
        new Typewriter('.mascot .quote', {
            autoStart: false,
            cursor: "",
            delay: 18
        }).typeString(this.activeQuote)
            .start()
    }
    makeVisible() {
        this.mascotContainer.classList.add('visible')
    }
    makeVisibleAlternative() {  
        this.mascotContainer.classList.add('alternative-version')
        this.mascotContainer.classList.add('visible')
    }
    hide() {
        this.mascotContainer.classList.remove('visible')
    }
}
