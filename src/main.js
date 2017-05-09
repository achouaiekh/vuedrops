import Vue from 'vue'
import slide from './slide.vue'
import carousel from './carousel.vue'


Vue.component('slide', slide)
Vue.component('carousel', carousel)

var vue = new Vue({

    el: '#app',
})
