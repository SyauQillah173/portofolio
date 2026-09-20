<template>
  <div
    :class="['skill-card', `skill-card-${level.toLowerCase()}`]"
    :style="{ '--skill-color': color }"
  >
    <!-- Icon -->
    <div class="skill-icon">
      {{ icon }}
    </div>

    <!-- Content -->
    <div class="skill-content">
      <h3 class="skill-name">{{ name }}</h3>
      <p class="skill-description">{{ description }}</p>

      <!-- Level Badge -->
      <div class="skill-level">
        <span :class="['level-badge', `level-${level.toLowerCase()}`]">
          {{ level }}
        </span>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="skill-glow"></div>
  </div>
</template>

<script setup>
/**
 * SkillCard Component
 * ====================
 * Displays a single skill with icon, name, description, and level badge.
 * Features hover effects and accent color customization.
 */

defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "🚀",
  },
  description: {
    type: String,
    default: "",
  },
  level: {
    type: String,
    default: "Intermediate",
    validator: (value) =>
      ["Beginner", "Intermediate", "Advanced"].includes(value),
  },
  color: {
    type: String,
    default: "#1F9FD8",
  },
});
</script>

<style scoped>
.skill-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.skill-card:hover {
  transform: translateY(-8px);
  border-color: var(--skill-color, var(--color-primary));
  box-shadow: 0 12px 32px rgba(var(--color-primary-rgb), 0.2);
}

/* Icon */
.skill-icon {
  font-size: 3rem;
  line-height: 1;
  margin-bottom: var(--space-md);
  transition: transform var(--transition-normal);
}

.skill-card:hover .skill-icon {
  transform: scale(1.1);
}

/* Content */
.skill-content {
  position: relative;
  z-index: 1;
}

.skill-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  margin-bottom: var(--space-sm);
}

.skill-description {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-md);
}

/* Level Badge */
.skill-level {
  display: flex;
  align-items: center;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.level-beginner {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
}

.level-intermediate {
  background: rgba(31, 159, 216, 0.15);
  color: var(--color-primary);
}

.level-advanced {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

/* Glow Effect */
.skill-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    var(--skill-color, var(--color-primary)) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}

.skill-card:hover .skill-glow {
  opacity: 0.1;
}

/* Level-specific accent colors on hover */
.skill-card-advanced:hover {
  border-color: var(--color-success);
}

.skill-card-intermediate:hover {
  border-color: var(--color-primary);
}

.skill-card-beginner:hover {
  border-color: var(--color-warning);
}
</style>
