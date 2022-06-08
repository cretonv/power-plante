import Typewriter from 'typewriter-effect/dist/core';

export class Mascot {
    private quotesArray: [string]
    private activeQuote: string
    private mascotContainer: HTMLDivElement
    private typeWriter: Typewriter
    private buttonHandler

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
        this.removeEventOnButton()

    }
    makeVisible() {
        this.mascotContainer.classList.add('visible')
        this.mascotContainer.classList.add('alternative-remove')
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
        this.removeEventOnButton()
    }
    addEventOnButton(callback:Function,buttonContent:string ){
        this.buttonHandler = callback.bind(this);
        window.addEventListener('mousedown', this.buttonHandler);
        this.mascotContainer.getElementsByClassName("button-interract-mascot")[0].getElementsByClassName("text")[0].innerHTML = buttonContent
        this.displaybutton()
    }
    removeEventOnButton(){
        window.removeEventListener('mousedown', this.buttonHandler)
        this.hideButton()

    }
    hideButton(){
        this.mascotContainer.getElementsByClassName( "button-interract-mascot")[0].classList.add('hidden')

    }
    displaybutton(){
        this.mascotContainer.getElementsByClassName( "button-interract-mascot")[0].classList.remove('hidden')

    }
}
