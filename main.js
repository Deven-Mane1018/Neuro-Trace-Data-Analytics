/**
 * NeuroTrace — Interactive Logic
 * Seamedu Awards 2026 · Data Analytics Excellence
 */

/* ═══════════════════════════════════════════════════════════
   1. STAT COUNTER ANIMATION
   Uses requestAnimationFrame, easeOut, 1.8s duration
═══════════════════════════════════════════════════════════ */
(function initStatCounters() {
  const DURATION = 1800; // ms

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals, 10);
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased = easeOut(progress);
      const value = eased * target;

      el.textContent = decimals === 0
        ? Math.floor(value).toLocaleString('en-IN')
        : value.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimals === 0
          ? target.toLocaleString('en-IN')
          : target.toFixed(decimals);
      }
    }

    requestAnimationFrame(step);
  }

  // Observe hero section — triggers once
  const statPills = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        // Stagger each counter by 200ms
        statPills.forEach((el, i) => {
          setTimeout(() => animateCounter(el), i * 220);
        });
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);
})();


/* ═══════════════════════════════════════════════════════════
   2. SCROLL REVEAL — IntersectionObserver
   Fades + slides up each .reveal section
═══════════════════════════════════════════════════════════ */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════════
   3. PIPELINE STEPPER — expand/collapse (one open at a time)
═══════════════════════════════════════════════════════════ */
window.toggleStep = function(stepId) {
  const step = document.getElementById(stepId);
  if (!step) return;

  const isOpen = step.classList.contains('open');

  // Close all steps
  document.querySelectorAll('.pipeline-step').forEach(s => s.classList.remove('open'));

  // Open the clicked one if it was closed
  if (!isOpen) {
    step.classList.add('open');
    // Smooth scroll into view if needed
    setTimeout(() => {
      step.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
};

// Open step 1 by default after a small delay
window.addEventListener('load', () => {
  setTimeout(() => {
    const first = document.getElementById('step-1');
    if (first) first.classList.add('open');
  }, 800);
});


/* ═══════════════════════════════════════════════════════════
   4. EDI GAUGE ANIMATION
   SVG needle animates from -90° (0) to 0° (1.0) mapped to AUC
   IntersectionObserver triggers when section scrolls into view
═══════════════════════════════════════════════════════════ */
(function initEDIGauge() {
  const TARGET_AUC = 0.78;
  const GAUGE_MIN_ANGLE = -90; // degrees (leftmost: 0.0)
  const GAUGE_MAX_ANGLE = 90;  // degrees (rightmost: 1.0)
  const DURATION = 1800; // ms

  const needleGroup = document.getElementById('gauge-needle-group');
  const valueText   = document.getElementById('gauge-value-text');
  const container   = document.getElementById('gauge-container');
  let animated = false;

  function aucToAngle(auc) {
    return GAUGE_MIN_ANGLE + (auc / 1.0) * (GAUGE_MAX_ANGLE - GAUGE_MIN_ANGLE);
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateGauge() {
    const startAngle = GAUGE_MIN_ANGLE;
    const endAngle   = aucToAngle(TARGET_AUC);
    const startTime  = performance.now();

    // Bounce: overshoot then settle
    function spring(t) {
      // Simple spring approximation: overshoot by ~8° then settle
      if (t < 0.88) {
        return easeOut(t / 0.88);
      } else {
        const overshoot = Math.sin((t - 0.88) / 0.12 * Math.PI) * 0.04;
        return 1 + overshoot;
      }
    }

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = spring(progress);

      const currentAngle = startAngle + eased * (endAngle - startAngle);
      const currentAUC   = Math.min((currentAngle - GAUGE_MIN_ANGLE) / (GAUGE_MAX_ANGLE - GAUGE_MIN_ANGLE), 1.0);

      // Apply rotation around gauge centre (130, 130)
      needleGroup.setAttribute('transform', `rotate(${currentAngle}, 130, 130)`);
      valueText.textContent = currentAUC.toFixed(2);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure final values are exact
        needleGroup.setAttribute('transform', `rotate(${endAngle}, 130, 130)`);
        valueText.textContent = TARGET_AUC.toFixed(2);
      }
    }

    requestAnimationFrame(step);
  }

  const gaugeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        // Small delay for polish
        setTimeout(animateGauge, 400);
        gaugeObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  if (container) gaugeObserver.observe(container);
})();


/* ═══════════════════════════════════════════════════════════
   5. TECH PILLS STAGGER ANIMATION
   Pills appear one-by-one with 60ms delay when scrolled in
═══════════════════════════════════════════════════════════ */
(function initPillStagger() {
  const rows = document.querySelectorAll('.stagger-row');

  const rowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll('.tpill');
        pills.forEach((pill, i) => {
          setTimeout(() => {
            pill.classList.add('visible');
          }, i * 75);
        });
        rowObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  rows.forEach(row => rowObserver.observe(row));
})();


/* ═══════════════════════════════════════════════════════════
   6. KEYBOARD NAVIGATION FOR PIPELINE STEPS
   Allow Enter/Space to expand pipeline steps
═══════════════════════════════════════════════════════════ */
(function initKeyboardNav() {
  document.querySelectorAll('.step-header').forEach(header => {
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const stepId = header.closest('.pipeline-step').id;
        window.toggleStep(stepId);
      }
    });
  });
})();
