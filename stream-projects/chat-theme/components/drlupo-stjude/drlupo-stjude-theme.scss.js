import { scss } from '../../deps.ts'

export default scss`
.c-drlupo-stjude-theme {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  
  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
}


/*54.7 degrees.
35.3*/

/* - - - - - Wrappers - - - - - */

.wrapper{
  perspective: 800px;
  perspective-origin: 50% 50%;
  
  margin: 0 auto;
  width: 100%;
  height: 400px;
  z-index: -1;

  
  overflow: hidden;
}

.poswrap{
  transform-style: preserve-3d;
  position: absolute;
  left:50%;
  top: 5%;
}

.tran1{
  transform-style: preserve-3d;
  transform: rotateX(35.3deg);
}

.tran2{
  transform-style: preserve-3d;
  transform: rotateZ(45deg);
}




/* - - - - - Animation - - - - - */

.floatwrap {
  transform-style: preserve-3d;
  animation: float 10s infinite cubic-bezier(.5, 0, .5, 1);
}

.spinwrap{
  transform-style: preserve-3d;
  // animation: spin 30s infinite linear;
}

@keyframes float{
  0% {transform: translateY(15px);}
  50% {transform: translateY(-15px);}
  100% {transform: translateY(15px);}
}

@keyframes spin {
     from{transform: rotateY(0deg);}
     to{transform: rotateY(-360deg);} 
  }

/* - - - - - Cube properties - - - - - */

.cube_face {
  position: absolute;
  transform-origin: center;
  
  text-align: center;
  font-size: 40px;
  line-height: 50px;
  color: RGBA(255, 255, 255, 0);
}


/* - - - - - Additional cube styling - - - - - */



.cube {
  position: absolute;
  transform-style: preserve-3d;
}

.side {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  border-radius: 0;
  box-sizing: border-box;
}

.top {
  /* border-top: 1px solid #FFF;*/
  /* border-left: 1px solid #FFF;*/
}

.front {
  transform: rotateX(90deg);
  transform-origin: bottom;
  /* border-top: 1px solid #FFF;*/
  /* border-bottom: 1px solid #FFF;*/
  /* border-left: 1px solid #FFF;*/
}

.left {
  transform-origin: right;
  /* border: 1px solid #FFF;*/
}

`