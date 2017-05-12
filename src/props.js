export default {

    slideToShow: {
        type: [Number, Object],
        default: 1,
    },

    slideToScroll: {
        type: [Number, Object],
        default: 1,
    },

    currentSlide: {
        type: Number,
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
        type: Number,
        default: 150,
    },

    constantSpeed: {
        type: Boolean,
        default: false,
    },

    easing: {
        type: String,
        default: 'linear',
    },



    breakpoints: {
        type: Object,
        default: function () {
            return
        },
    },

    autoplay: {
        type: Boolean,
        default: false
    },

    disableSwipe: {
        type: Boolean,
        default: false
    },

    minSwipeDistance: {
        type: Number,
        default: 8,
    },

    zIndex: {
        type: String,
        default: "100",
    },

    animationInterruptDisabled: {
        type: Boolean,
        default: false
    }
}

