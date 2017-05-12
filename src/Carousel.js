import  Animation from 'vuedrops-animate'


export default class {


    constructor(vm) {

        this.vm = vm

        this.el = vm.$el

        this.initialize()

        this.setProps()

        this.setup()

        this.init()


        this.initEvents()
    }


    init() {
        this.updateSlideToShow()

        this.setSlides()
        this.setDimension()
        this.autoPlay()

    }

    initialize() {

        this.screen = this.el.querySelector('.screen')
        this.track = this.el.querySelector('.track')
        this.slides = Array.from(this.track.querySelectorAll('.slide'))
        this.slideCount = this.slides.length
        this.slideToShowCount = 1
        this.slideToScrollCount = 1
        this.prevArrow = this.el.querySelector('.previous.arrow')
        this.nextArrow = this.el.querySelector('.next.arrow')
        this.dotNav = this.el.querySelector('.dot.pagination')
        this.screenWidth = this.screen.clientWidth
        this.animationId = null
        this.imgLoaded = false
        this.__display = 'block'
        this.touch = {}
        this.touch.swipeLength = 0
        this.touch.swipeLength = 0
        this.dragging = false
        this.offestLeft = 0
    }

    setProps() {

        let props = this.vm.$props

        for (let prop in props) this[prop] = this.parseIfNumber(props[prop])

    }

    parseIfNumber(value) {

        return !isNaN(value) && typeof value !== "boolean" ? parseInt(value) : value
    }

    updateSlideToShow() {
        let slideToShow = this.slideToShow,
            slideToScroll = this.slideToScroll,
            screenWidth = this.screenWidth = this.screen.clientWidth


        if (typeof slideToShow === 'number') {
            this.slideToShowCount = slideToShow
        }

        if (typeof slideToScroll === 'number') {
            this.slideToScrollCount = slideToScroll
        }

        Object.keys(this.breakpoints)
            .sort((a, b) => a - b)
            .forEach(breakpoint => {
                if (screenWidth > this.breakpoints[breakpoint]) {

                    if (typeof slideToShow === 'object' && slideToShow.hasOwnProperty(breakpoint) && typeof slideToShow[breakpoint] === 'number')
                        this.slideToShowCount = slideToShow[breakpoint]

                    if (typeof slideToScroll === 'object' && slideToScroll.hasOwnProperty(breakpoint) && typeof slideToScroll[breakpoint] === 'number')
                        this.slideToScrollCount = slideToScroll[breakpoint]
                }
            })

        let s = 0

        while (true) {
            if ((s += this.slideToScrollCount) > this.currentSlide) {
                this.previousSlide = this.currentSlide = s - this.slideToScrollCount
                break
            }
        }


        if (this.fade) {
            this.el.classList.add('fade')
            this.slideToShowCount = 1
        }

        if (this.slideCount <= this.slideToShowCount) {
            this.slideToShowCount = this.slideCount;
            [this.prevArrow, this.nextArrow, this.dotNav].forEach((el) => el.classList.add('disabled'))
        }

        if (this.slideToShowCount < this.slideToScrollCount)
            this.slideToScrollCount = this.slideToShowCount

    }


    setup() {

        this.animation = new Animation({
            speed: this.speed,
            easing: this.easing,
            context: this,
        })

        this.breakpoints = Object.assign({}, BREAKPOINTS, this.breakpoints)


        if (this.vertical) this.el.classList.add('vertical')
    }

    setSlides() {

        this.track.querySelectorAll('.slide.cloned').forEach(cloned => this.track.removeChild(cloned))

        if (this.fade) {

            this.slides.forEach((slide, index) => {
                this.fadeOut(index)
            })

            this.fadeIn()
        }

        else {

            this.slides
                .slice(-this.slideToShowCount)
                .reverse()
                .forEach((slice) => {
                    slice = slice.cloneNode(true)
                    slice.classList.add('cloned')
                    this.track.insertBefore(slice, this.track.firstChild)
                })


            this.slides
                .slice(0, this.slideToShowCount)
                .forEach((slice) => {
                    slice = slice.cloneNode(true)
                    slice.classList.add('cloned')
                    this.track.appendChild(slice)
                })
        }

        this.allSlides = Array.from(this.track.querySelectorAll('.slide'))

        if (this.fade || this.vertical) this.allSlides.forEach((slide) => {
            slide.style.width = this.screenWidth + 'px'
        })

        this.imgs = Array.from(this.track.querySelectorAll('.slide img'))

    }

    fadeIn(position = this.currentSlide, opacity = 1) {
        this.slides[position].style.opacity = opacity
        this.slides[position].style.zIndex = this.zIndex + 2
    }

    fadeOut(position = this.previousSlide, opacity = 0) {
        this.slides[position].style.opacity = opacity
        this.slides[position].style.zIndex = this.zIndex + 1
    }

    setDimension() {
        if (this.imgLoaded) {
            this.el.style.display = this.__display
            this.setHeight(this.calculateHeight())
            this.setDots()
        }
        else {
            this.__display = this.el.style.display
            this.el.style.display = 'none'
            this.loadImages().then(() => {
                this.imgLoaded = true
                this.el.style.display = this.__display
                this.setHeight(this.calculateHeight())
                this.setDots()
            })
        }


    }

    loadImages(callback = function () {
    }, count = this.imgs.length) {
        return new Promise((resolve, reject) => {
            let i = 0,
                _this = this

            this.imgs.forEach((img) => img.onload = () => {
                callback.call(_this, this)
                if (++i == count) resolve(_this)
            })
        })

    }

    setHeight(height) {

        if (this.fade) {
            this.track.style.height = height + 'px'
        }

        else if (this.vertical) {
            this.screen.style.height = height + 'px'
            this.track.style.width = this.screen.clientWidth + 'px'

            this.allSlides.forEach((slide) => slide.style.height = slide.querySelector('img').offsetHeight + 'px')
        }

        else {

            this.allSlides.forEach((slide) => {
                slide.style.height = height + 'px'
                slide.style.width = slide.querySelector('img').clientWidth + 'px'
            })

            this.screen.style.height = height + 'px'

            this.track.style.width = this.allSlides
                    .reduce((initial, slide) => initial + slide.offsetWidth + 1, 0) + 'px'
        }


        this.setLeft(this.calculateLeft(this.currentSlide))

        return this
    }

    calculateHeight(position = this.currentSlide) {

        if (this.fade) {
            return this.slides[position].offsetHeight
        }

        else if (this.vertical) {
            return this.slides
                .slice(position, position + this.slideToShowCount)
                .reduce((initial, slide) => initial + slide.querySelector('img').offsetHeight, 0)
        }

        else {
            let fraction = this.allSlides
                .slice(position + this.slideToShowCount, position + 2 * this.slideToShowCount)
                .reduce((initial, slide) => {
                    let img = slide.querySelector('img')

                    return initial + img.clientWidth / img.clientHeight
                }, 0)

            return this.screenWidth / fraction
        }
    }

    setLeft(position) {

        let prop = this.vertical ? 'top' : 'left'

        this.track.style[prop] = position + 'px'

        this.offsetLeft = position


        return this
    }

    calculateLeft(position = this.currentSlide) {

        if (this.fade) return 0

        let prop = this.vertical ? 'offsetHeight' : 'offsetWidth'

        return (-1) * this.allSlides
                .slice(0, position + this.slideToShowCount)
                .reduce((initial, slide) => initial + slide[prop], 0)
    }

    autoPlay(autoplay = this.autoplay) {

        if (autoplay) {
            let _this = this

            this.animationId = setInterval(() => {
                _this.next()
            }, 5000)
        }
        else {
            clearInterval(this.animationId)
        }
    }

    setFade(opacity) {
        this.fadeOut(this.previousSlide, 1 - opacity)
        this.fadeIn(this.currentSlide, opacity)
    }


    next() {

        if (this.interrupt()) return

        this.currentSlide += this.slideToScrollCount

        this.rectifyNext()

        this.animateSlide()
    }

    interrupt() {
        return (this.animationInterruptDisabled && this.animating) ||
            this.slideToShowCount <= this.slideToScrollCount
    }

    rectifyNext() {

        let lastIndex = this.slideCount - 1

        if (this.currentSlide > lastIndex) {

            this.currentSlide = 0

            if (!this.fade) {
                this.previousSlide = this.slideToScrollCount == 1 ?
                    -1 : -(lastIndex % this.slideToScrollCount) - 1
            }
        }
    }

    previous() {

        if (this.interrupt()) return

        this.currentSlide -= this.slideToScrollCount

        this.rectifyPrevious()

        this.animateSlide()
    }

    rectifyPrevious() {

        if (this.currentSlide < 0) {

            if (!this.fade)
                this.previousSlide = this.slideCount

            let offset = this.slideToScrollCount === 1 ? 0 : (this.slideCount - 1) % this.slideToScrollCount

            this.currentSlide = this.slideCount - 1 - offset
        }
    }

    animateSlide(position = this.currentSlide, from) {

        if (this.interrupt()) return

        this.animating = true

        this.animation.stop()

        this.currentSlide = position

        this.setDots()

        this.animate(from).then(() => {
            this.animating = false
            this.previousSlide = this.currentSlide

        })
    }

    animate(from) {

        if (this.fade) {

            if (this.calculateHeight(this.previousSlide) > this.calculateHeight(this.currentSlide))
                return this.animateHeight().then(() => this.fadeSlide())

            else
                return this.fadeSlide().then(() => this.animateHeight())
        }

        else
            return this.translateSlide(from).then(() => this.animateHeight())

    }

    getDots() {
        let count = Math.ceil(this.slides.length / this.slideToScrollCount),
            index = -1,
            dots = []

        while (++index < count) {
            dots.push({
                current: this.slideToScrollCount * index,
                index,
                active: (this.currentSlide === this.slideToScrollCount * index)
            })
        }

        return dots

    }

    animateHeight() {

        let delta = "linear"
        if (this.fade) delta = this.delta

        return this.animation
            .from(this.calculateHeight(this.previousSlide))
            .to(this.calculateHeight(this.currentSlide))
            .play(this.setHeight, {delta})
    }

    translateSlide(from, to) {

        from = from ? from : this.calculateLeft(this.previousSlide)
        to = to ? to : this.calculateLeft(this.currentSlide)

        let speed = this.constantSpeed ?
            Math.ceil(Math.abs(to - from) / this.screenWidth) * this.slideToScrollCount * this.speed :
            this.speed


        return this.animation
            .from(from)
            .to(to)
            .play(this.setLeft, {speed})
    }

    fadeSlide() {
        return this.animation
            .from(0)
            .to(1)
            .play(this.setFade, {delta: "linear"})
    }

    setDots() {
        this.vm.dots = this.getDots()
    }

    initEvents(remove = false) {

        let action = remove ? 'remove' : 'add'

        "mousedown touchstart mousemove touchmove mouseup touchend mouseleave touchcancel dblclick".split(" ")
            .forEach((eventType) => this.track[`${action}EventListener`](eventType, this.proxy(this.swipeHandler)))

        window[`${action}EventListener`]('resize', this.proxy(this.init))
    }


    swipeHandler(event) {

        event.preventDefault()

        this.touch.fingerCount = event.changedTouches !== undefined ? event.changedTouches.length : 1

        if (this.disableSwipe || this.fade || this.interrupt() || this.touch.fingerCount !== 1) return false


        switch (event.type) {
            case 'touchstart':
            case 'mousedown':
                this.swipeStart(event)
                break

            case 'mousemove':
            case 'touchmove':
                this.swipeMove(event)
                break

            case 'mouseup':
            case 'mouseleave':
            case 'touchend':
            case 'touchcancel':
                this.swipeEnd(event)
                break

            case 'dblclick':
                this.dragging = false
                break

        }

    }

    swipeStart(event) {

        if (this.dragging) return false

        this.track.style.cursor = "-webkit-grab"

        this.dragging = true

        this.touch.animating = this.animating

        this.animation.stop()

        let touches = event.changedTouches && event.changedTouches[0]

        this.touch.startX = this.touch.curX = touches !== undefined ? touches.pageX : event.clientX
        this.touch.startY = this.touch.curY = touches !== undefined ? touches.pageY : event.clientY

        this.touch.swipeLength = 0

        this.touch.offsetLeft = this.offsetLeft

        this.setLeft(this.touch.offsetLeft)

    }

    swipeMove(event) {

        if (!this.dragging) return false

        this.track.style.cursor = '-webkit-grabbing'

        let touches = event.changedTouches && event.changedTouches[0]

        this.touch.curX = touches !== undefined ? touches.pageX : event.clientX
        this.touch.curY = touches !== undefined ? touches.pageY : event.clientY

        this.touch.swipeLength = this.vertical ?
            this.touch.curY - this.touch.startY :
            this.touch.curX - this.touch.startX

        let offsetLeft = this.touch.offsetLeft + this.touch.swipeLength

        this.touch.direction = Math.sign(this.touch.swipeLength)

        if (offsetLeft > this.calculateLeft(0) && this.touch.swipeLength > 0) this.touch.offsetLeft = this.calculateLeft(this.slideCount)
        if (offsetLeft < this.calculateLeft(Math.trunc((this.slides.length - 1) / this.slideToShowCount) * this.slideToShowCount) && this.touch.swipeLength < 0) this.touch.offsetLeft = this.calculateLeft(-(this.slideCount - 1) % this.slideToScrollCount - 1)

        this.setLeft(this.touch.offsetLeft + this.touch.swipeLength)
    }

    swipeEnd(event) {

        if (!this.dragging) return false

        this.dragging = false

        this.track.style.cursor = "default"

        let offsetLeft = this.touch.offsetLeft + this.touch.swipeLength

        if (Math.abs(this.touch.swipeLength) < this.minSwipeDistance && !this.touch.animating)
            this.animateSlide(this.previousSlide, offsetLeft)

        else {

            let direction = this.touch.direction = Math.sign(this.touch.swipeLength),
                i = 0


            while (++i) {
                this.currentSlide -= direction * this.slideToScrollCount

                this.rectifyNext()
                this.rectifyPrevious()

                let position = this.calculateLeft(this.currentSlide)
                if (direction * (position - offsetLeft) >= 0 || i > this.slideCount) break
            }


            this.animateSlide(this.currentSlide, offsetLeft)
        }

    }

    proxy(fn, object = this) {
        return function () {
            return fn.apply(object, arguments)
        }
    }

    sort(object) {

        let temp = {}

        Object.keys(object)
            .sort((a, b) => object[a] - object[b])
            .forEach((key) => {
                temp[key] = object[key]
            })

        return object = temp
    }

}

const BREAKPOINTS = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
}