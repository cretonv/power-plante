import '../assets/css/main.css'
import '../assets/css/locomotive-scroll.css'
import LocomotiveScroll from 'locomotive-scroll';

new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
});
