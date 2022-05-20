export class Mascot {
    private quotesArray: [string]
    private activeQuote: string
    private mascotContainer: HTMLDivElement
    private quoteElement: HTMLDivElement
    constructor() {
        this.quotesArray = null
    }
    init(quotes, container, quoteElement) {
        this.quotesArray = quotes
        this.mascotContainer = container
        this.quoteElement = quoteElement
        this.changeActiveQuote(0)
    }
    changeActiveQuote(index) {
        this.activeQuote = this.quotesArray[index]
        this.quoteElement.innerHTML = this.activeQuote
    }
    makeVisible() {
        this.mascotContainer.classList.add('visible')
    }
    hide() {
        this.mascotContainer.classList.remove('visible')
    }
}
