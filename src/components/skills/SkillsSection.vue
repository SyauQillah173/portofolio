<template>
  <section id="skills" class="skills-section section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header scroll-animate">
        <span class="section-badge">Skills</span>
        <h2 class="section-title">
          Keahlian <span class="section-accent">Saya</span>
        </h2>
        <p class="section-subtitle">
          Kombinasi skill teknis dan kreatif yang saya kuasai untuk memberikan
          hasil terbaik
        </p>
      </div>

      <!-- Skills Grid -->
      <div class="skills-grid">
        <div
          v-for="(skill, index) in skills"
          :key="skill.id"
          class="skill-card scroll-animate"
          :class="`stagger-${index + 1}`"
          :style="{ '--skill-color': skill.color }"
        >
          <!-- Glowing Background -->
          <div class="skill-glow"></div>

          <!-- Icon -->
          <div class="skill-icon-wrapper">
            <span class="skill-icon">{{ skill.icon }}</span>
          </div>

          <!-- Content -->
          <div class="skill-content">
            <h3 class="skill-name">{{ skill.name }}</h3>
            <p class="skill-description">{{ skill.description }}</p>

            <!-- Level Bar -->
            <div class="skill-level">
              <div class="level-track">
                <div
                  class="level-fill"
                  :style="{ width: getLevelPercent(skill.level) + '%' }"
                ></div>
              </div>
              <span
                :class="['level-badge', `level-${skill.level.toLowerCase()}`]"
              >
                {{ skill.level }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="skills-decoration skills-decoration-1"></div>
    <div class="skills-decoration skills-decoration-2"></div>
  </section>
</template>

<script setup>
/**
 * SkillsSection Component
 * ========================
 * Displays a grid of skills with scroll animations and level indicators.
 * Data is loaded from the skills.json file.
 */

import skillsData from "@/assets/data/skills.json";
import { useScrollAnimation } from "@/composables/useScrollAnimation";
import { onMounted } from "vue";

// Skills data
const skills = skillsData.skills;

/**
 * Get level percentage for progress bar
 */
const getLevelPercent = (level) => {
  const levels = {
    Beginner: 40,
    Intermediate: 70,
    Advanced: 95,
  };
  return levels[level] || 50;
};

// Setup scroll animation
const { observeAll } = useScrollAnimation({
  threshold: 0.1,
  staggerDelay: 100,
});

onMounted(() => {
  setTimeout(() => {
    const elements = document.querySelectorAll(
      ".skills-section .scroll-animate"
    );
    observeAll(elements);
  }, 100);
});
</script>

<style scoped>
.skills-section {
  background: linear-gradient(
    180deg,
    var(--color-bg-dark) 0%,
    var(--color-bg-darker) 100%
  );
  position: relative;
  overflow: hidden;
}

/* Decorative Elements */
.skills-decoration {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.skills-decoration-1 {
  top: 10%;
  right: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(31, 159, 216, 0.08) 0%,
    transparent 70%
  );
}

.skills-decoration-2 {
  bottom: -10%;
  left: -5%;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.05) 0%,
    transparent 70%
  );
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.section-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-md);
  background: rgba(31, 159, 216, 0.15);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-md);
  letter-spacing: 0.05em;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  margin-bottom: var(--space-sm);
}

.section-accent {
  color: var(--color-primary);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  position: relative;
  z-index: 1;
}

/* Skill Card */
.skill-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  transition: all 400ms var(--ease-smooth);
  overflow: hidden;
}

.skill-card:hover {
  transform: translateY(-5px);
  border-color: var(--skill-color, var(--color-primary));
  box-shadow: 0 15px 30px rgba(31, 159, 216, 0.15);
}

/* Subtle Glow Effect */
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
  transition: opacity 400ms var(--ease-smooth);
  pointer-events: none;
}

.skill-card:hover .skill-glow {
  opacity: 0.1;
}

/* Icon */
.skill-icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(31, 159, 216, 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
  transition: all 400ms var(--ease-smooth);
}

.skill-card:hover .skill-icon-wrapper {
  background: rgba(31, 159, 216, 0.2);
  transform: scale(1.1) rotate(-5deg);
}

.skill-icon {
  font-size: 2rem;
  line-height: 1;
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
  margin-bottom: var(--space-lg);
}

/* Level Bar */
.skill-level {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.level-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--skill-color, var(--color-primary)),
    var(--color-primary-light)
  );
  border-radius: var(--radius-full);
  transition: width 1s var(--ease-smooth);
  animation: levelFillIn 1.5s var(--ease-smooth) forwards;
}

@keyframes levelFillIn {
  from {
    width: 0%;
  }
}

.level-badge {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
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

/* Scroll animation - Fast & lightweight */
.scroll-animate {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 320ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.scroll-animate.is-visible {
  opacity: 1;
  transform: translateY(0);
  will-change: auto;
}

/* Stagger delays */
.stagger-1 {
  transition-delay: 0ms;
}
.stagger-2 {
  transition-delay: 100ms;
}
.stagger-3 {
  transition-delay: 200ms;
}
.stagger-4 {
  transition-delay: 300ms;
}
.stagger-5 {
  transition-delay: 400ms;
}
.stagger-6 {
  transition-delay: 500ms;
}

/* Responsive - Mobile Small (320px-374px) */
@media (max-width: 374px) {
  .skills-grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .section-title {
    font-size: 1.25rem;
  }

  .section-subtitle {
    font-size: var(--font-size-sm);
  }

  .skill-card {
    padding: var(--space-md);
  }

  .skill-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .skill-name {
    font-size: var(--font-size-base);
  }

  .skill-level-bar {
    height: 6px;
  }

  .skills-decoration {
    display: none;
  }
}

/* Responsive - Mobile (375px-639px) */
@media (min-width: 375px) and (max-width: 639px) {
  .skills-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .section-title {
    font-size: var(--font-size-xl);
  }

  .section-subtitle {
    font-size: var(--font-size-base);
  }

  .skill-card {
    padding: var(--space-lg);
  }

  .skills-decoration {
    display: none;
  }
}

/* Responsive - Tablet (640px-1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }
}

/* Responsive - Desktop (1024px+) */
@media (min-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
  }
}
</style>
