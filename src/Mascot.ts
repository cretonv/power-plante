import Typewriter from 'typewriter-effect/dist/core';
import { GlobalLoader } from './GlobalLoader';

export class Mascot {
    private quotesArray: [string]
    private activeQuote: string
    private mascotContainer: HTMLDivElement
    // @ts-ignore
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
            delay: 16
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
        this.mascotContainer.classList.remove('alternative-version')
        this.talk()
        this.mascotContainer.classList.add('visible')

    }
    makeVisibleAlternative() {
        this.mascotContainer.classList.add('alternative-version')
        window.setTimeout(()=>{
        this.mascotContainer.classList.add('visible')
        },1200
        )
        this.talk()
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
    talk(){
        let random_boolean = Math.random() < 0.5;
        if(random_boolean){
            GlobalLoader.getInstance().playSound("glowy1")
        }
        else{
            GlobalLoader.getInstance().playSound("glowy2")
        }
    }
}
