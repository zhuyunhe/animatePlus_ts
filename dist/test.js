// import animate from "https://cdn.jsdelivr.net/npm/animateplus@2/animateplus.js";
import animate from './index.js';
animate({
  elements: "div",
  duration: 2000,
  loop: false,
  optimize: true,
  // direction: 'reverse',
  delay: index => index * 100,
  transform: ["translate(0px,0px)", "translate(100px, 100px)"]
  // transform: ["translate(0%)", "translate(500%)"]
})
  