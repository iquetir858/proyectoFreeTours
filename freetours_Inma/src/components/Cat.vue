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
    animation: purr 0.5s infinite ease-in-out;
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
    position: relative;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #FFD700;
    overflow: hidden;
}

.eye::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 16px;
    background: #000;
    border-radius: 50%;
    top: 0;
    left: 5px;
    animation: pupil-move 5s infinite;
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
     0%, 100% { transform: scaleY(1); }
     95% { transform: scaleY(1); }
     97.5% { transform: scaleY(0.1); }
}

@keyframes pupil-move {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-1px) scaleY(1.2); }
}

@keyframes purr {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
}

.cat::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 10px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  animation: shadow-move 5s infinite ease-in-out;
}

@keyframes shadow-move {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
  50% { transform: translateX(-50%) scale(1.2); opacity: 0.2; }
}

.cat:hover {
  animation-play-state: paused;
}

.cat:hover .tail-segment {
  animation-duration: 2s;
}

.cat:hover .eye::after {
  animation: hover-pupil 1s infinite;
}

@keyframes hover-pupil {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
</style>