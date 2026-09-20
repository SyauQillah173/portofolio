<template>
  <div :class="cardClasses">
    <!-- Card Image -->
    <div v-if="$slots.image || image" class="card-image">
      <slot name="image">
        <img v-if="image" :src="image" :alt="imageAlt" loading="lazy" />
      </slot>
      <div v-if="$slots.overlay" class="card-overlay">
        <slot name="overlay"></slot>
      </div>
    </div>

    <!-- Card Header -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
    </div>

    <!-- Card Body -->
    <div v-if="$slots.default" class="card-body">
      <slot></slot>
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
/**
 * Card Component
 * ================
 * Reusable card with image, header, body, and footer slots.
 * Supports hover effects and different variants.
 */

import { computed } from "vue";

const props = defineProps({
  // Content
  title: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },

  // Image
  image: {
    type: String,
    default: "",
  },
  imageAlt: {
    type: String,
    default: "Card image",
  },

  // Variant
  variant: {
    type: String,
    default: "default",
    validator: (value) =>
      ["default", "elevated", "outlined", "ghost"].includes(value),
  },

  // States
  hoverable: {
    type: Boolean,
    default: true,
  },
  clickable: {
    type: Boolean,
    default: false,
  },

  // Padding
  padding: {
    type: String,
    default: "md",
    validator: (value) => ["none", "sm", "md", "lg"].includes(value),
  },
});

// Compute card classes
const cardClasses = computed(() => {
  return [
    "card",
    `card-${props.variant}`,
    `card-padding-${props.padding}`,
    {
      "card-hoverable": props.hoverable,
      "card-clickable": props.clickable,
    },
  ];
});
</script>

<style scoped>
.card {
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  backdrop-filter: blur(10px);
}

/* Variants */
.card-default {
  background: var(--color-bg-card);
}

.card-elevated {
  background: var(--color-bg-card);
  box-shadow: var(--shadow-md);
}

.card-outlined {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.card-ghost {
  background: transparent;
  border: none;
}

/* Hover effect */
.card-hoverable:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(31, 159, 216, 0.3);
  background: var(--color-bg-card-hover);
}

.card-clickable {
  cursor: pointer;
}

/* Padding variants */
.card-padding-none .card-header,
.card-padding-none .card-body,
.card-padding-none .card-footer {
  padding: 0;
}

.card-padding-sm .card-header,
.card-padding-sm .card-body,
.card-padding-sm .card-footer {
  padding: var(--space-sm);
}

.card-padding-md .card-header,
.card-padding-md .card-body,
.card-padding-md .card-footer {
  padding: var(--space-md);
}

.card-padding-lg .card-header,
.card-padding-lg .card-body,
.card-padding-lg .card-footer {
  padding: var(--space-lg);
}

/* Card Image */
.card-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.card-hoverable:hover .card-image img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 14, 39, 0.9) 0%,
    rgba(10, 14, 39, 0.4) 50%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
  padding: var(--space-md);
}

.card-hoverable:hover .card-overlay {
  opacity: 1;
}

/* Card Header */
.card-header {
  padding: var(--space-md) var(--space-md) var(--space-xs);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  margin: 0 0 var(--space-xs);
  line-height: var(--line-height-tight);
}

.card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* Card Body */
.card-body {
  padding: var(--space-xs) var(--space-md) var(--space-md);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
  font-size: var(--font-size-sm);
}

/* Card Footer */
.card-footer {
  padding: var(--space-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
</style>
