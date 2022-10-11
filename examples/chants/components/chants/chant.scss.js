import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";

export default scss`
.c-chants {
  display: flex;
}

.chant-container {
  background-size: 1800% 1800% !important;

  width: 80px;
  height: 36px;
  cursor: pointer;
  border-radius: 22px;
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  padding-left: 10px;
  padding-right: 12px;

  -webkit-animation: rainbow 18s ease infinite;
  -z-animation: rainbow 18s ease infinite;
  -o-animation: rainbow 18s ease infinite;
  animation: rainbow 18s ease infinite;
}

.emoji {
  margin-top: 3px;
  margin-bottom: 3px;
}

.count {
  display: flex;
  color: black;
  font-family: Hobeaux;
  font-style: normal;
  font-weight: bold;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.0025em;
}

@keyframes pop {
  50%  {
    transform: scale(2);
  }
}

@-webkit-keyframes rainbow {
  0%{background-position:0% 82%}
  50%{background-position:100% 19%}
  100%{background-position:0% 82%}
}
@-moz-keyframes rainbow {
  0%{background-position:0% 82%}
  50%{background-position:100% 19%}
  100%{background-position:0% 82%}
}
@-o-keyframes rainbow {
  0%{background-position:0% 82%}
  50%{background-position:100% 19%}
  100%{background-position:0% 82%}
}
@keyframes rainbow { 
  0%{background-position:0% 82%}
  50%{background-position:100% 19%}
  100%{background-position:0% 82%}
}
`;
