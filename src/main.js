import Vue from "vue"

import Carousel from "../dist/vuedrops-carousel"

import {slide, carousel} from "../dist/vuedrops-carousel"

console.log(Carousel, slide, carousel)






let vue = new Vue({
    el: '#app',
    components: {slide, carousel}
})
