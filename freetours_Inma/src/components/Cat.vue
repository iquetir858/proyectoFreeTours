<template>
    <div id="box">
        <div class="cat">
            <div class="head">
                <div class="ears">
                    <div class="ear left"></div>
                    <div class="ear right"></div>
                </div>
                <div class="eyes">
                    <div class="eye left"></div>
                    <div class="eye right"></div>
                </div>
                <div class="muzzle">
                    <div class="nose"></div>
                </div>
            </div>
            <div class="bodyCat">
                <div class="paw"></div>
            </div>
            <div class="tail">
                <div class="tail-segment">
                    <div class="tail-segment">
                        <div class="tail-segment">
                            <div class="tail-segment">
                                <div class="tail-segment">
                                    <div class="tail-segment">
                                        <div class="tail-segment">
                                            <div class="tail-segment">
                                                <div class="tail-segment">
                                                    <div class="tail-segment">
                                                        <div class="tail-segment">
                                                            <div class="tail-segment">
                                                                <div class="tail-segment">
                                                                    <div class="tail-segment">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
/*------ESTILO DEL GATO NEGRO------- */

#box {
    display: block;
    height: 100%;
    width: 100%;
}

.cat * {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
}

.cat,
.ears,
.eyes,
.muzzle,
.bodyCat,
.paw,
.tail,
.tail-segment {
    position: relative;
}

.head,
.bodyCat,
.paw,
.tail-segment {
    background-color: #000000;
}

.left {
    float: left;
}

.right {
    float: right;
}

.cat {
    margin-top: 30px;
    animation: purr 5s infinite cubic-bezier(0, .75, 1, .25);
}

.head {
    width: 100px;
    height: 90px;
    border-radius: 50%;
    z-index: 20;
    position: relative;
    left: 0%;
    animation: head-bob 5s infinite ease-in-out;
}

.ears {
    top: -20px;
    z-index: 5;
}

.ear {
    width: 0;
    height: 0;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 50px solid #000000;
}

.ear.left {
    transform: rotate(-20deg) translateX(-10px);
}

.ear.right {
    transform: rotate(20deg) translateX(10px);
}

.eyes {
    top: -18px;
    width: 60%;
}

.eye {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #FFD700;
    animation: eye-blink 5s infinite;
    text-align: center;
}

.muzzle {
    top: 50px;
}

.nose {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #666666;
}

.bodyCat {
    width: 200px;
    height: 120px;
    border-top-left-radius: 200px;
    border-top-right-radius: 200px;
    top: -75px;
    left: 90px;
    z-index: 10;
}

.paw {
    height: 30px;
    width: 50px;
    border-radius: 25px;
    left: -100px;
    top: 90px;
}

.tail {
    left: 180px;
    top: -100px;
    transform: rotate(90deg);

}

.tail-segment {
    height: 20px;
    width: 30px;
    border-radius: 25px;
    top: 0px;
    left: 10px;
    /*transform: rotate(10deg);*/
    animation: tail-swish 5s infinite cubic-bezier(.8, 0, .2, 1);
}

@keyframes tail-swish {
    0% {
        transform: rotate(12deg);
    }

    10% {
        transform: rotate(12deg);
    }

    40% {
        transform: rotate(-5deg);
    }

    50% {
        transform: rotate(5deg);
    }

    60% {
        transform: rotate(-5deg);
    }

    100% {
        transform: rotate(12deg);
    }
}

@keyframes head-bob {
    0% {
        transform: translateX(-15px) translateY(45px);
    }

    10% {
        transform: translateX(-15px) translateY(45px);
    }

    30% {
        transform: translateX(0) translateY(0);
    }

    75% {
        transform: translateX(0) translateY(0);
    }

    90% {
        transform: translateX(-15px) translateY(45px);
    }

    100% {
        transform: translateX(-15px) translateY(45px);
    }
}

@keyframes eye-blink {
    0% {
        transform: scaleY(0);
    }

    10% {
        transform: scaleY(0);
    }

    15% {
        transform: scaleY(1);
    }

    48% {
        transform: scaleY(1);
    }

    50% {
        transform: scaleY(0);
    }

    52% {
        transform: scaleY(1);
    }

    90% {
        transform: scaleY(1);
    }

    95% {
        transform: scaleY(0);
    }

    100% {
        transform: scaleY(0);
    }
}

@keyframes purr {
    0% {
        left: -1px;
    }

    1% {
        left: 0px;
    }

    2% {
        left: -1px;
    }

    3% {
        left: 0px;
    }

    4% {
        left: -1px;
    }

    5% {
        left: 0px;
    }

    6% {
        left: -1px;
    }

    7% {
        left: 0px;
    }

    8% {
        left: -1px;
    }

    9% {
        left: 0px;
    }

    10% {
        left: -1px;
    }

    11% {
        left: 0px;
    }

    12% {
        left: -1px;
    }

    13% {
        left: 0px;
    }

    14% {
        left: -1px;
    }

    15% {
        left: 0px;
    }

    16% {
        left: -1px;
    }

    17% {
        left: 0px;
    }

    18% {
        left: -1px;
    }

    19% {
        left: 0px;
    }

    20% {
        left: -1px;
    }

    21% {
        left: 0px;
    }

    94% {
        left: 0px;
    }

    95% {
        left: -1px;
    }

    96% {
        left: 0px;
    }

    97% {
        left: -1px;
    }

    98% {
        left: 0px;
    }

    99% {
        left: -1px;
    }

    100% {
        left: 0px;
    }
}
</style>