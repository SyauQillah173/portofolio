/**
 * Helper Functions
 * =================
 * Utility functions used throughout the application.
 */

/**
 * Debounce function - delays execution until after wait period of inactivity
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on leading edge
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 100, immediate = false) {
  let timeout = null;

  return function executedFunction(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle function - limits function execution to once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, wait = 100) {
  let lastTime = 0;

  return function executedFunction(...args) {
    const now = Date.now();

    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

/**
 * Smooth scroll to element with custom easing
 * @param {string} elementId - ID of element to scroll to
 * @param {number} offset - Offset from top in pixels
 * @param {number} duration - Animation duration in ms
 */
export function scrollToElement(elementId, offset = 70, duration = 1000) {
  const element = document.getElementById(elementId);

  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const targetPosition = elementPosition + startPosition - offset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Easing function - easeInOutCubic for smooth acceleration/deceleration
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }
}

/**
 * Get viewport dimensions
 * @returns {Object} width and height
 */
export function getViewportSize() {
  return {
    width: Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    ),
    height: Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ),
  };
}

/**
 * Check if device is mobile based on viewport width
 * @param {number} breakpoint - Mobile breakpoint in pixels
 * @returns {boolean}
 */
export function isMobile(breakpoint = 640) {
  return getViewportSize().width <= breakpoint;
}

/**
 * Check if device is tablet based on viewport width
 * @param {number} minBreakpoint - Minimum tablet width
 * @param {number} maxBreakpoint - Maximum tablet width
 * @returns {boolean}
 */
export function isTablet(minBreakpoint = 641, maxBreakpoint = 1024) {
  const width = getViewportSize().width;
  return width >= minBreakpoint && width <= maxBreakpoint;
}

/**
 * Combine class names conditionally
 * @param  {...any} classes - Class names or conditional objects
 * @returns {string} Combined class string
 */
export function classNames(...classes) {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === "string") return cls;
      if (typeof cls === "object") {
        return Object.entries(cls)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
          .join(" ");
      }
      return "";
    })
    .join(" ")
    .trim();
}

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale string (default: 'id-ID')
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = "id-ID") {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  );
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add when truncated
 * @returns {string} Truncated string
 */
export function truncate(str, length = 100, suffix = "...") {
  if (!str || str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean}
 */
export function isInViewport(element, threshold = 0) {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const visibleHeight =
    Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const elementHeight = rect.height;

  return visibleHeight / elementHeight > threshold;
}

/**
 * Preload an image
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>}
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
}

export default {
  debounce,
  throttle,
  scrollToElement,
  getViewportSize,
  isMobile,
  isTablet,
  classNames,
  formatDate,
  generateId,
  deepClone,
  capitalize,
  truncate,
  sleep,
  isInViewport,
  preloadImage,
  copyToClipboard,
};
