<template>
  <span class="typing-text">
    <span class="typing-content">{{ displayText }}</span>
    <span class="typing-cursor" aria-hidden="true"></span>
  </span>
</template>

<script setup>
/**
 * TypingText Component
 * =====================
 * Displays text with a typing animation effect.
 * Cycles through an array of texts with typing and deleting animations.
 */

import { useTypingText } from "@/composables/useTypingText";
import { TYPING_ROLES } from "@/utils/constants";

// Props
const props = defineProps({
  texts: {
    type: Array,
    default: () => TYPING_ROLES,
  },
  typeSpeed: {
    type: Number,
    default: 50,
  },
  deleteSpeed: {
    type: Number,
    default: 30,
  },
  pauseDuration: {
    type: Number,
    default: 2000,
  },
});

// Use the typing text composable
const { displayText } = useTypingText(props.texts, {
  typeSpeed: props.typeSpeed,
  deleteSpeed: props.deleteSpeed,
  pauseDuration: props.pauseDuration,
  loop: true,
});
</script>

<style scoped>
.typing-text {
  display: inline-flex;
  align-items: center;
}

.typing-content {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.typing-cursor {
  display: inline-block;
  width: 3px;
  height: 1.2em;
  background-color: var(--color-primary);
  margin-left: 2px;
  animation: cursorBlink 1s step-end infinite;
  vertical-align: text-bottom;
}

@keyframes cursorBlink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
