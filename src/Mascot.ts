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
        window.setTimeout(()=>{
        this.mascotContainer.classList.add('visible')
        },1000
        )
    }
    hide() {
        this.mascotContainer.classList.remove('visible')
    }
}
