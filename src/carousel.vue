<template>

    <div class="carousel"
         tabindex="1"
         @keyup.38.39="carousel.next()"
         @keyup.37.40="carousel.previous()"
         @keyup.space="carousel.autoPlay(false)"
    >

        <div class="screen">
            <div class="track">
                <slot></slot>
            </div>
        </div>

        <div class="navigation">

            <a href="#" class="previous arrow" @click="carousel.previous()">
                <i class="fa fa-arrow-left" aria-hidden="true"><</i>
            </a>

            <ul class="dot pagination">

                <li v-for="dot in dots"
                    @click="carousel.animate(dot.current)"
                    :class="{active:dot.active}"
                >
                    <a href="#" v-text="dot.index + 1"></a>
                </li>

            </ul>

            <a href="#" class="next arrow" @click="carousel.next()">
                <i class="fa fa-arrow-right" aria-hidden="true">></i>
            </a>

        </div>

    </div>

</template>


<script>
    import Carousel from './Carousel'
    import props from './props'

    export default {

        name: 'carousel',

        data() {
            return {
                carousel: null,
                dots: Array()
            }
        },

        props,

        mounted() {
            this.carousel = new Carousel(this)
        }

    }
</script>

<style lang="scss">
    .carousel {
        outline: none;
        position: relative;
        display: block;
        max-width: 100%;
        .screen {
            overflow: hidden;
            position: relative;
            display: block;
            .track {
                display: block;
                position: relative;
                top: 0;
                left: 0;

                &:after {
                    clear: both;
                    content: "";
                    display: table;
                }

                &.grab {
                    cursor: grab;
                }

                &.grabbing {
                    cursor: grabbing;
                }
            }
        }

        .navigation {
            text-align: center;

            a {
                text-decoration: none;
                &:hover {
                    color: orange;
                }
            }

            .pagination li,
            .pagination,
            .arrow {
                padding: 0;
                display: inline;
                margin-left: .5em;
                margin-right: .5em;
            }
            & .active a {
                color: red;
                font-weight: bold;
            }
        }
    }
</style>
