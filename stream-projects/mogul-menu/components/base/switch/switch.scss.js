// taken from https://www.w3schools.com/howto/howto_css_switch.asp

import { scss } from "../../../deps.ts";

export default scss`
.c-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;

  &.is-loading {
    cursor: not-allowed;
    filter: brightness(40%);
    transition: .2s;
  }
  
  input { 
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.29);
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
  
  input:checked + .slider {
    background-color: var(--mm-color-primary);
  }
  
  input:focus + .slider {
    box-shadow: 0 0 1px var(--mm-color-primary);
  }
  
  input:checked + .slider:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
    background-color: var(--mm-color-bg-primary);
  }
  
  /* Rounded sliders */
  .slider.round {
    border-radius: 28px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
}
`;
