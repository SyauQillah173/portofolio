<template>
  <canvas ref="canvasRef" class="falling-stars" aria-hidden="true"></canvas>
</template>

<script setup>
/**
 * FallingStars Component
 * =======================
 * Canvas-based falling stars animation for hero background.
 * Uses requestAnimationFrame for smooth 60fps performance.
 */

import { useFallingStars } from "@/composables/useFallingStars";

// Props
const props = defineProps({
  starCount: {
    type: Number,
    default: 60, // Increased for more particles
  },
  minSpeed: {
    type: Number,
    default: 0.3,
  },
  maxSpeed: {
    type: Number,
    default: 0.8,
  },
});

// Use the falling stars composable
const { canvasRef } = useFallingStars({
  starCount: props.starCount,
  minSpeed: props.minSpeed,
  maxSpeed: props.maxSpeed,
});
</script>

<style scoped>
.falling-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
