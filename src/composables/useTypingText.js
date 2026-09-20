/**
 * useTypingText Composable
 * ========================
 * Provides typing animation effect that cycles through an array of texts.
 * Features character-by-character typing and deleting with configurable speeds.
 */

import { onMounted, onUnmounted, ref } from "vue";

/**
 * Create a typing text animation effect
 * @param {string[]} texts - Array of texts to cycle through
 * @param {Object} options - Configuration options
 * @param {number} options.typeSpeed - Speed of typing (ms per character)
 * @param {number} options.deleteSpeed - Speed of deleting (ms per character)
 * @param {number} options.pauseDuration - Pause duration between texts (ms)
 * @param {boolean} options.loop - Whether to loop through texts infinitely
 * @returns {Object} Reactive text and control methods
 */
export function useTypingText(texts = [], options = {}) {
  // Configuration with defaults
  const config = {
    typeSpeed: options.typeSpeed ?? 50,
    deleteSpeed: options.deleteSpeed ?? 30,
    pauseDuration: options.pauseDuration ?? 2000,
    loop: options.loop ?? true,
  };

  // Reactive state
  const displayText = ref("");
  const isTyping = ref(false);
  const isDeleting = ref(false);
  const currentIndex = ref(0);
  const isComplete = ref(false);

  // Internal state
  let timeoutId = null;
  let isActive = true;

  /**
   * Type a single character
   */
  const typeCharacter = () => {
    if (!isActive) return;

    const currentText = texts[currentIndex.value];
    const currentLength = displayText.value.length;

    if (currentLength < currentText.length) {
      // Still typing
      displayText.value = currentText.substring(0, currentLength + 1);
      isTyping.value = true;
      isDeleting.value = false;
      timeoutId = setTimeout(typeCharacter, config.typeSpeed);
    } else {
      // Finished typing, pause then delete
      isTyping.value = false;
      timeoutId = setTimeout(deleteCharacter, config.pauseDuration);
    }
  };

  /**
   * Delete a single character
   */
  const deleteCharacter = () => {
    if (!isActive) return;

    const currentLength = displayText.value.length;

    if (currentLength > 0) {
      // Still deleting
      displayText.value = displayText.value.substring(0, currentLength - 1);
      isDeleting.value = true;
      isTyping.value = false;
      timeoutId = setTimeout(deleteCharacter, config.deleteSpeed);
    } else {
      // Finished deleting, move to next text
      isDeleting.value = false;
      currentIndex.value = (currentIndex.value + 1) % texts.length;

      // Check if we should continue
      if (!config.loop && currentIndex.value === 0) {
        isComplete.value = true;
        return;
      }

      // Start typing next text after short delay
      timeoutId = setTimeout(typeCharacter, config.typeSpeed);
    }
  };

  /**
   * Start the typing animation
   */
  const start = () => {
    if (texts.length === 0) return;

    isActive = true;
    isComplete.value = false;
    displayText.value = "";
    currentIndex.value = 0;

    // Start typing after a small delay
    timeoutId = setTimeout(typeCharacter, 500);
  };

  /**
   * Stop the typing animation
   */
  const stop = () => {
    isActive = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    isTyping.value = false;
    isDeleting.value = false;
  };

  /**
   * Reset to initial state
   */
  const reset = () => {
    stop();
    displayText.value = "";
    currentIndex.value = 0;
    isComplete.value = false;
  };

  // Lifecycle hooks
  onMounted(() => {
    start();
  });

  onUnmounted(() => {
    stop();
  });

  return {
    // Reactive state
    displayText,
    isTyping,
    isDeleting,
    currentIndex,
    isComplete,

    // Methods
    start,
    stop,
    reset,
  };
}

export default useTypingText;
