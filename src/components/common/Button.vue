<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :type="isButton ? type : undefined"
    :href="href"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="btn-spinner" aria-hidden="true">
      <span class="spinner spinner-sm"></span>
    </span>

    <!-- Icon left -->
    <span v-if="iconLeft && !loading" class="btn-icon-left" aria-hidden="true">
      <slot name="icon-left">{{ iconLeft }}</slot>
    </span>

    <!-- Button text -->
    <span class="btn-text">
      <slot>{{ text }}</slot>
    </span>

    <!-- Icon right -->
    <span
      v-if="iconRight && !loading"
      class="btn-icon-right"
      aria-hidden="true"
    >
      <slot name="icon-right">{{ iconRight }}</slot>
    </span>
  </component>
</template>

<script setup>
/**
 * Button Component
 * ==================
 * Reusable button with multiple variants, sizes, and states.
 * Supports both <button> and <a> elements.
 */

import { computed } from "vue";

const props = defineProps({
  // Content
  text: {
    type: String,
    default: "",
  },

  // Variant
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "ghost", "danger"].includes(value),
  },

  // Size
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },

  // Type (for native button)
  type: {
    type: String,
    default: "button",
  },

  // Link (makes it an <a> tag)
  href: {
    type: String,
    default: "",
  },

  // States
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },

  // Full width
  fullWidth: {
    type: Boolean,
    default: false,
  },

  // Icons
  iconLeft: {
    type: String,
    default: "",
  },
  iconRight: {
    type: String,
    default: "",
  },

  // Icon only button
  iconOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

// Determine which HTML tag to use
const tag = computed(() => {
  if (props.href) return "a";
  return "button";
});

// Check if it's a button element
const isButton = computed(() => tag.value === "button");

// Compute button classes
const buttonClasses = computed(() => {
  return [
    "btn",
    `btn-${props.variant}`,
    {
      "btn-sm": props.size === "sm",
      "btn-lg": props.size === "lg",
      "btn-full": props.fullWidth,
      "btn-icon": props.iconOnly,
      "btn-loading": props.loading,
      "btn-disabled": props.disabled,
    },
  ];
});

// Handle click event
const handleClick = (event) => {
  if (props.disabled || props.loading) {
    event.preventDefault();
    return;
  }
  emit("click", event);
};
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  outline: none;
  position: relative;
  overflow: hidden;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled,
.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Variants */
.btn-primary {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
  color: var(--color-text-light);
  border-color: transparent;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0) scale(1);
}

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-secondary:hover {
  background: rgba(31, 159, 216, 0.1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-light);
  border-color: transparent;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-primary);
}

.btn-danger {
  background: linear-gradient(135deg, var(--color-error), #dc2626);
  color: var(--color-text-light);
  border-color: transparent;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Sizes */
.btn-sm {
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
}

.btn-lg {
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-lg);
}

/* Full width */
.btn-full {
  width: 100%;
}

/* Icon only */
.btn-icon {
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: var(--radius-full);
}

.btn-icon.btn-sm {
  width: 36px;
  height: 36px;
}

.btn-icon.btn-lg {
  width: 52px;
  height: 52px;
}

/* Loading state */
.btn-loading {
  color: transparent;
}

.btn-loading .btn-text,
.btn-loading .btn-icon-left,
.btn-loading .btn-icon-right {
  visibility: hidden;
}

.btn-spinner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icon slots */
.btn-icon-left,
.btn-icon-right {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
}

.btn-text {
  display: inline-flex;
  align-items: center;
}
</style>
