import Carousel from './carousel'
import Slide from './slide'

function plugin (Vue) {
    Vue.component({Slide})
    Vue.component({Carousel})
}



if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
}

export default plugin

export {Slide, Carousel}