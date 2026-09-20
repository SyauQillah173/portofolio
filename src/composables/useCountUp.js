/**
 * useCountUp Composable
 * ======================
 * Animated counter that counts up from 0 to a target number.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */

import { onMounted, ref } from "vue";

/**
 * Create an animated counter
 * @param {number} targetValue - Target number to count to
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Animation duration in ms
 * @param {number} options.delay - Delay before starting
 * @param {boolean} options.startOnMount - Start counting on mount
 * @returns {Object} Reactive count value and control methods
 */
export function useCountUp(targetValue, options = {}) {
  const config = {
    duration: options.duration ?? 2000,
    delay: options.delay ?? 0,
    startOnMount: options.startOnMount ?? false,
    easing: options.easing ?? "easeOutCubic",
  };

  // Reactive state
  const count = ref(0);
  const isAnimating = ref(false);
  const isComplete = ref(false);

  // Easing functions
  const easings = {
    linear: (t) => t,
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  let animationId = null;
  let startTime = null;

  /**
   * Animation loop
   */
  const animate = (currentTime) => {
    if (!startTime) startTime = currentTime;

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / config.duration, 1);
    const easedProgress = easings[config.easing](progress);

    count.value = Math.round(easedProgress * targetValue);

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      count.value = targetValue;
      isAnimating.value = false;
      isComplete.value = true;
    }
  };

  /**
   * Start the counter animation
   */
  const start = () => {
    if (isAnimating.value) return;

    isAnimating.value = true;
    isComplete.value = false;
    startTime = null;
    count.value = 0;

    if (config.delay > 0) {
      setTimeout(() => {
        animationId = requestAnimationFrame(animate);
      }, config.delay);
    } else {
      animationId = requestAnimationFrame(animate);
    }
  };

  /**
   * Stop the counter animation
   */
  const stop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    isAnimating.value = false;
  };

  /**
   * Reset the counter
   */
  const reset = () => {
    stop();
    count.value = 0;
    isComplete.value = false;
  };

  // Start on mount if configured
  onMounted(() => {
    if (config.startOnMount) {
      start();
    }
  });

  return {
    count,
    isAnimating,
    isComplete,
    start,
    stop,
    reset,
  };
}

/**
 * Hook for triggering count on scroll visibility
 * @param {number} targetValue - Target number
 * @param {Object} options - Configuration options
 * @returns {Object} Element ref, count, and visibility state
 */
export function useCountUpOnScroll(targetValue, options = {}) {
  const elementRef = ref(null);
  const hasStarted = ref(false);

  const { count, isAnimating, isComplete, start, reset } = useCountUp(
    targetValue,
    {
      ...options,
      startOnMount: false,
    }
  );

  onMounted(() => {
    if (typeof IntersectionObserver === "undefined") {
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted.value) {
            hasStarted.value = true;
            start();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  });

  return {
    elementRef,
    count,
    isAnimating,
    isComplete,
    hasStarted,
  };
}

export default useCountUp;
