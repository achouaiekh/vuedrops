<template>

    <figure
            class="slide"
            @dblclick="shown=!shown"
            @mouseleave="shown = false"
    >

        <img :src="src" :alt="title" draggable="false"/>

        <figcaption
                v-if="!noCaption"
                :class="{shown: shown}"
        >

            <slot name="caption">
                <h3>{{title}}
                    <small>by {{author}}</small>
                </h3>
                <p>{{description}}</p>
            </slot>

        </figcaption>

    </figure>

</template>

<script>
    export default {
        name: 'slide',

        props: {
            src: {
                type: String,
                default: 'dist/imgs/example1.jpg'

            },

            title: {
                type: String,
                default: ''

            },

            author: {
                type: String,
                default: ''

            },

            description: {
                type: String,
                default: ''

            },

            noCaption: {
                type: Boolean,
                default: false,
            }
        },

        data() {
            return {
                shown: false
            }
        }
    }
</script>

<style lang="scss">

    .slide {
        margin: 0;
        position: relative;
        float: left;

        img {
            display: block;
            height: 100%;
        }

        figcaption {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            transform: translateY(-100%);
            transition: transform .3s;
            padding: .5em;
            color: white;

            &.shown {
                transform: translateY(0);
            }
        }

        .vertical & {

            img {
                height: auto;
                width: 100%;
            }

            figcaption {
                transform: translateX(-100%);
                &.shown {
                    transform: translateX(0);
                }
            }
        }

        .fade & {
            position: absolute;

            img {
                position: relative;
                top: 0;
                z-index: 110;
                width: 100%;
                height: auto;
            }

            figcaption {
                z-index: 115;
            }
        }
    }
</style>
