import { scss } from '../../deps.ts'

export default scss`
@-webkit-keyframes rotateDiscoBall {
  0% {-webkit-transform: rotateX(90deg) rotateZ(0deg) rotate(0deg); }
  100% {-webkit-transform: rotateX(90deg) rotateZ(360deg) rotate(0deg); }
}

@keyframes rotateDiscoBall {
  0% {transform: rotateX(90deg) rotateZ(0deg) rotate(0deg); }
  100% {transform: rotateX(90deg) rotateZ(360deg) rotate(0deg); }
}

@-webkit-keyframes rotateDiscoBallMiddle {
  0% {-webkit-transform: rotateX(90deg) rotateY(0deg) rotate(0deg); }
  100% {-webkit-transform: rotateX(90deg) rotateY(-360deg) rotate(0deg); }
}

@keyframes rotateDiscoBallMiddle {
  0% {transform: rotateX(90deg) rotateY(0deg) rotate(0deg); }
  100% {transform: rotateX(90deg) rotateY(-360deg) rotate(0deg); }
}

@-webkit-keyframes reflect {
  0% {-webkit-filter: brightness(60%);}
  50% {-webkit-filter: brightness(120%);}  
  100% {-webkit-filter: brightness(90%);}  
}

@keyframes reflect {
  0% {opacity: 1;}
  50% {opacity: 0.4;}  
  100% {opacity: 1;}  
}

@keyframes moveDown {
  from {
    transform: translateY(-123px);
  }
  to {
    transform: translateY(0px);
  }
}

.c-disco-ball {
  .disco-ball-container {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 23px;
    left: 50%;
    animation: moveDown 1s ease-in-out;

    .disco-stick {
      position: absolute;
      top: -23px;
      left: 50%;
      background: #313141;
      width: 3px;
      height: 23px;
    }

    .disco-ball-light {
      width: 100px;
      height: 100px;
      position: absolute;
      top: 0px;
      left: 50%;
      margin-left: -50px; 
      border-radius: 100%;
      background-color: white; 
      opacity: 0.2;
      -webkit-filter: blur(20px);
    }
  
    .disco-ball {
      -webkit-transform-style: preserve-3d;
      transform-style: preserve-3d;
      width: 100px;
      height: 100px;
      position: absolute;
      top: 0px;
      left: 50%;
      margin-left: -50px;
      -webkit-animation: rotateDiscoBall 18s linear infinite;
      animation: rotateDiscoBall 18s linear infinite;
  
      .disco-ball-middle { 
        height: 100%;
        border-radius: 100%;
        background-color: #111;
        position: absolute;
        background: -webkit-linear-gradient(top, #111, #333);
        background: -moz-linear-gradient(top, #111, #333);
        background: linear-gradient(top, #111, #333);
        -webkit-animation: rotateDiscoBallMiddle 18s linear infinite;
        animation: rotateDiscoBallMiddle 18s linear infinite;
      }
  
      .square {
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;	
        position: absolute;
        top: 50px;
        left: 50px;
        width: 6px;
        height: 6px;
        position: absolute;
        transform: rotateX(90deg) rotateY(0deg) translateZ(0px);
      }
    }
  }
}
`