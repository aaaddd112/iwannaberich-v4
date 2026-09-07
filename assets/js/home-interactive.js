/* IWANNABERICH interactive homepage layer */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('interactive-ready');

  // Subtle cursor spotlight on desktop.
  if (!reducedMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    var cursor = document.createElement('div');
    cursor.className = 'interactive-cursor';
    document.body.appendChild(cursor);
    window.addEventListener('pointermove', function (event) {
      cursor.style.left = event.clientX + 'px';
      cursor.style.top = event.clientY + 'px';
    }, { passive: true });
  }

  // Gentle 3D response for the main goal card.
  var goal = document.querySelector('.hero-goal');
  if (goal && !reducedMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    goal.addEventListener('pointermove', function (event) {
      var rect = goal.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      goal.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
      goal.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
      goal.style.transform = 'perspective(900px) rotateX(' + (-y * 3) + 'deg) rotateY(' + (x * 4) + 'deg) translateZ(0)';
    });
    goal.addEventListener('pointerleave', function () {
      goal.style.transform = '';
    });
  }

  // Turn the four-step loop into a small interactive story.
  var loopSteps = Array.prototype.slice.call(document.querySelectorAll('.mission-loop-step'));
  if (loopSteps.length) {
    loopSteps.forEach(function (step, index) {
      step.addEventListener('click', function () {
        loopSteps.forEach(function (item) { item.classList.remove('is-active'); });
        step.classList.add('is-active');
        var card = document.querySelector('.mission-loop');
        if (card) {
          card.setAttribute('data-active-step', String(index + 1));
          card.classList.remove('is-pulsing');
          void card.offsetWidth;
          card.classList.add('is-pulsing');
        }
      });
    });

    if (!reducedMotion) {
      var activeIndex = 0;
      setInterval(function () {
        if (document.hidden) return;
        loopSteps.forEach(function (item) { item.classList.remove('is-active'); });
        loopSteps[activeIndex].classList.add('is-active');
        activeIndex = (activeIndex + 1) % loopSteps.length;
      }, 2800);
    }
  }

  // Give experiment options a tactile pointer response without changing voting logic.
  var options = Array.prototype.slice.call(document.querySelectorAll('.experiment-option'));
  options.forEach(function (option) {
    option.addEventListener('pointermove', function (event) {
      var rect = option.getBoundingClientRect();
      option.style.setProperty('--mx', (((event.clientX - rect.left) / rect.width) * 100).toFixed(1) + '%');
      option.style.setProperty('--my', (((event.clientY - rect.top) / rect.height) * 100).toFixed(1) + '%');
    });

    option.addEventListener('click', function () {
      options.forEach(function (item) { item.classList.remove('is-selected'); });
      option.classList.add('is-selected');
    });
  });

  // Animate the mission wealth number when the existing data layer updates it.
  var wealth = document.getElementById('missionWealthValue');
  if (wealth && !reducedMotion && typeof MutationObserver !== 'undefined') {
    var lastValue = wealth.textContent;
    var observer = new MutationObserver(function () {
      var nextValue = wealth.textContent;
      if (nextValue !== lastValue && /€/.test(nextValue)) {
        var card = document.querySelector('.mission-focus-card');
        if (card) {
          card.classList.remove('is-pulsing');
          void card.offsetWidth;
          card.classList.add('is-pulsing');
        }
        lastValue = nextValue;
      }
    });
    observer.observe(wealth, { childList: true, characterData: true, subtree: true });
  }

  // Add a small interaction hint only where the interactive layer is available.
  var missionLoop = document.querySelector('.mission-loop');
  if (missionLoop && !missionLoop.querySelector('.home-interactive-hint')) {
    var hint = document.createElement('span');
    hint.className = 'home-interactive-hint';
    hint.textContent = 'Click a step';
    missionLoop.appendChild(hint);
  }
})();
