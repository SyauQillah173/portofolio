/**
 * useScrollAnimation Composable
 * =============================
 * Intersection Observer-based scroll animations.
 * Triggers animations when elements enter the viewport.
 */

import { onMounted, onUnmounted, ref } from "vue";

/**
 * Create scroll-triggered animations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin for observer
 * @param {boolean} options.once - Animate only once
 * @param {number} options.staggerDelay - Delay between staggered items (ms)
 * @returns {Object} Observer ref and control methods
 */
export function useScrollAnimation(options = {}) {
  // Configuration with instant, proactive defaults to prevent blank text on fast scroll
  const config = {
    threshold: options.threshold ?? 0,
    rootMargin: options.rootMargin ?? "600px 0px 600px 0px", // Pre-trigger 600px ahead
    once: options.once ?? true,
    staggerDelay: options.staggerDelay ?? 0,
  };

  // Refs
  const observerRef = ref(null);
  const isSupported = ref(true);
  const observedElements = ref(new Set());

  // Internal state
  let observer = null;

  /**
   * Callback for intersection observer
   */
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.classList.add("is-visible");
        element.classList.remove("is-hidden");

        // Unobserve if animating only once
        if (config.once && observer) {
          observer.unobserve(element);
          observedElements.value.delete(element);
        }
      }
    });
  };

  /**
   * Initialize the intersection observer
   */
  const init = () => {
    // Check for browser support
    if (typeof IntersectionObserver === "undefined") {
      isSupported.value = false;
      console.warn(
        "IntersectionObserver not supported. Animations will not trigger on scroll."
      );
      return;
    }

    // Create observer
    observer = new IntersectionObserver(handleIntersection, {
      threshold: config.threshold,
      rootMargin: config.rootMargin,
    });

    observerRef.value = observer;
  };

  /**
   * Observe a single element
   * @param {HTMLElement} element - Element to observe
   * @param {number} staggerIndex - Optional stagger index
   */
  const observe = (element, staggerIndex = null) => {
    if (!observer || !element) return;
    if (element.classList.contains("is-visible")) return;

    // Set stagger data attribute if provided
    if (staggerIndex !== null) {
      element.dataset.stagger = staggerIndex.toString();
    }

    // Add initial hidden class
    element.classList.add("scroll-animate", "is-hidden");

    // Start observing
    observer.observe(element);
    observedElements.value.add(element);
  };

  /**
   * Observe multiple elements with stagger
   * @param {NodeList|Array} elements - Elements to observe
   */
  const observeAll = (elements) => {
    if (!elements) return;

    const elementArray = Array.from(elements);
    elementArray.forEach((element, index) => {
      observe(element, index);
    });
  };

  /**
   * Stop observing an element
   * @param {HTMLElement} element - Element to unobserve
   */
  const unobserve = (element) => {
    if (!observer || !element) return;

    observer.unobserve(element);
    observedElements.value.delete(element);
  };

  /**
   * Stop observing all elements
   */
  const unobserveAll = () => {
    if (!observer) return;

    observedElements.value.forEach((element) => {
      observer.unobserve(element);
    });
    observedElements.value.clear();
  };

  /**
   * Disconnect the observer completely
   */
  const disconnect = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    observedElements.value.clear();
  };

  /**
   * Refresh observer (useful after DOM changes)
   */
  const refresh = () => {
    const currentElements = new Set(observedElements.value);
    disconnect();
    init();
    currentElements.forEach((element) => {
      if (document.contains(element)) {
        const stagger = element.dataset.stagger;
        observe(element, stagger ? parseInt(stagger, 10) : null);
      }
    });
  };

  /**
   * Vue directive factory for v-scroll-animate
   * Usage: v-scroll-animate or v-scroll-animate="{ stagger: 2 }"
   */
  const createDirective = () => ({
    mounted(el, binding) {
      const staggerIndex = binding.value?.stagger ?? null;
      observe(el, staggerIndex);
    },
    unmounted(el) {
      unobserve(el);
    },
  });

  // Lifecycle hooks
  onMounted(() => {
    init();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    // Refs
    observerRef,
    isSupported,
    observedElements,

    // Methods
    observe,
    observeAll,
    unobserve,
    unobserveAll,
    disconnect,
    refresh,
    createDirective,
  };
}

/**
 * Simple scroll reveal hook for single elements
 * @param {Object} options - Configuration options
 * @returns {Object} Element ref and visibility state
 */
export function useScrollReveal(options = {}) {
  const elementRef = ref(null);
  const isVisible = ref(false);

  const config = {
    threshold: options.threshold ?? 0.2,
    rootMargin: options.rootMargin ?? "0px",
    once: options.once ?? true,
  };

  let observer = null;

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        if (config.once && observer) {
          observer.disconnect();
        }
      } else if (!config.once) {
        isVisible.value = false;
      }
    });
  };

  onMounted(() => {
    if (typeof IntersectionObserver === "undefined") {
      isVisible.value = true;
      return;
    }

    observer = new IntersectionObserver(handleIntersection, {
      threshold: config.threshold,
      rootMargin: config.rootMargin,
    });

    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    elementRef,
    isVisible,
  };
}

export default useScrollAnimation;
