// From CodePen:
// https://codepen.io/juliangarnier/pen/gmOwJX
import anime from 'animejs';


// const ctx = canvasEl.getContext('2d');
const numberOfParticules = 60;

const colors = ['#FF595E', '#313E50', '#87BCDE', 'darkviolet'];

function setCanvasSize() {
  const canvasEl = document.querySelector('.fireworks');
  canvasEl.width = window.innerWidth * 2;
  canvasEl.height = window.innerHeight * 2;
  canvasEl.style.width = `${window.innerWidth}px`;
  canvasEl.style.height = `${window.innerHeight}px`;
  canvasEl.getContext('2d').scale(2, 2);
}

function setParticuleDirection(p) {
  const angle = (anime.random(0, 360) * Math.PI) / 180;
  const value = anime.random(50, 180) * 2; // this is total radius of direction
  const radius = [-1, 1][anime.random(0, 1)] * value;
  return {
    x: p.x + (radius * Math.cos(angle)),
    y: p.y + (radius * Math.sin(angle)),
  };
}

function createParticule(x, y) {
  const p = {};
  p.x = x;
  p.y = y;
  p.color = colors[anime.random(0, colors.length - 1)];
  p.radius = anime.random(16, 32);
  p.endPos = setParticuleDirection(p);
  const canvasEl = document.querySelector('.fireworks');
  const ctx = canvasEl.getContext('2d');
  p.draw = function draw() {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = p.color;
    ctx.fill();
  };
  return p;
}

function createCircle(x, y) {
  setCanvasSize();
  const p = {};
  p.x = x;
  p.y = y;
  p.color = '#FFF';
  p.radius = 0.1;
  p.alpha = 0.5;
  p.lineWidth = 6;
  const canvasEl = document.querySelector('.fireworks');
  const ctx = canvasEl.getContext('2d');
  p.draw = function draw() {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.lineWidth = p.lineWidth;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  return p;
}

function renderParticule(anim) {
  for (let i = 0; i < anim.animatables.length; i += 1) {
    anim.animatables[i].target.draw();
  }
}

function animateParticules(x, y) {
  const circle = createCircle(x, y);
  const particules = [];
  for (let i = 0; i < numberOfParticules; i += 1) {
    particules.push(createParticule(x, y));
  }
  anime.timeline().add({
    targets: particules,
    x(p) { return p.endPos.x; },
    y(p) { return p.endPos.y; },
    radius: 0.1,
    duration: anime.random(4200, 4800),
    easing: 'easeOutExpo',
    update: renderParticule,
  })
    .add({
      targets: circle,
      radius: anime.random(280, 360), // circle radius
      lineWidth: 0,
      alpha: {
        value: 0,
        easing: 'linear',
        duration: anime.random(600, 800),
      },
      duration: anime.random(1200, 1800),
      easing: 'easeOutExpo',
      update: renderParticule,
      offset: 0,
    });
}

/* const render = anime({
  duration: Infinity,
  update() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  },
});
 document.addEventListener(tap, function(e) {
  window.human = true;
  render.play();
  updateCoords(e);
  animateParticules(pointerX, pointerY);
}, false); */

const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

function render() {
  const canvasEl = document.querySelector('.fireworks');
  const ctx = canvasEl.getContext('2d');
  return anime({
    duration: Infinity,
    update() {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    },
  });
}


function playFirework(duration) {
  render();
  console.log('firework');
  animateParticules(
    anime.random(centerX, centerX),
    anime.random(centerY, centerY),
  );
  return anime({ duration }).finished;
}

// setCanvasSize();
// window.addEventListener('resize', setCanvasSize, false);

window.playFirework = playFirework;

export default {
  playFirework,
};
