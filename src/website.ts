import '../assets/css/main.css'
import '../assets/css/locomotive-scroll.css'
import LocomotiveScroll from 'locomotive-scroll';
import Swiper, { Navigation } from 'swiper';

Swiper.use([Navigation]);

new Swiper('.swiper', {
    speed: 400,
    slidesPerView: 7,
    spaceBetween: 32,
    direction: 'horizontal',
    navigation: {
        nextEl: '.button-next',
        prevEl: '.button-prev',
        disabledClass: 'disabled'
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true
});
