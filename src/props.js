export default {

    slideToShow: {
        type: [Number, Object, String],
        default: 1,
    },

    slideToScroll: {
        type: [Number, Object, String],
        default: 1,
    },

    breakpoints: {
        type: Object,
    },

    currentSlide: {
        type: [Number, String],
        type: [Number, String],
        default: 0,
    },

    vertical: {
        type: Boolean,
        default: false
    },

    fade: {
        type: Boolean,
        default: false
    },

    speed: {
        type: [Number, String],
        default: 150,
    },

    constantSpeed: {
        type: Boolean,
        default: false,
    },

    slideEasing: {
        type: String,
        default: 'linear',
    },

    heightEasing: {
        type: String,
        default: 'linear',
    },

    fadeEasing: {
        type: String,
        default: 'linear',
    },

    autoplay: {
        type: Boolean,
        default: false
    },

    autoplayDelay: {
        type: [Number, String],
        default: 5000,
    },

    disableSwipe: {
        type: Boolean,
        default: false
    },

    minSwipeDistance: {
        type: [Number, String],
        default: 10,
    },

    zIndex: {
        type: [Number, String],
        default: 100,
    },

}

