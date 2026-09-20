<template>
  <article
    class="work-card"
    :class="{ 'work-card-featured': featured }"
    @click="openProject"
    role="button"
    tabindex="0"
    @keypress.enter="openProject"
  >
    <!-- Image Container -->
    <div class="work-image">
      <img
        :src="imageSrc"
        :alt="title"
        loading="lazy"
        @error="handleImageError"
      />

      <!-- Overlay with Info -->
      <div class="work-overlay">
        <div class="work-overlay-content">
          <div class="work-technologies">
            <span
              v-for="tech in technologies.slice(0, 3)"
              :key="tech"
              class="tech-badge"
            >
              {{ tech }}
            </span>
            <span v-if="technologies.length > 3" class="tech-badge tech-more">
              +{{ technologies.length - 3 }}
            </span>
          </div>

          <button class="work-link btn btn-primary btn-sm">
            <span>Lihat Detail</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="link-icon"
            >
              <path d="M15 12H3M15 12L11 8M15 12L11 16M21 5V19" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="work-content">
      <!-- Category Badge -->
      <span class="work-category">{{ categoryLabel }}</span>

      <!-- Title -->
      <h3 class="work-title">{{ title }}</h3>

      <!-- Description -->
      <p class="work-description">{{ description }}</p>
    </div>
  </article>
</template>

<script setup>
/**
 * WorkCard Component
 * ===================
 * Displays a single portfolio work item with image, hover overlay,
 * technologies, and click to open detail modal.
 */

import { computed, ref } from "vue";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "frontend",
  },
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  technologies: {
    type: Array,
    default: () => [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["open"]);

// Category label mapping
const categoryLabels = {
  web: "Software & Web",
  drone: "Drone & Aerial",
  network: "IT & Network",
  video: "Video & Media",
  ai: "AI & Creative",
  frontend: "Frontend",
  design: "Desain",
};

const categoryLabel = computed(
  () => categoryLabels[props.category] || props.category
);

// Image source with fallback
const imageSrc = ref(props.image);

/**
 * Handle image error - use placeholder
 */
const handleImageError = () => {
  imageSrc.value = `https://placehold.co/600x400/0A0E27/1F9FD8?text=${encodeURIComponent(
    props.title
  )}`;
};

/**
 * Open project detail
 */
const openProject = () => {
  emit("open", props.id);
};
</script>

<style scoped>
.work-card {
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  cursor: pointer;
}

.work-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg), 0 0 30px rgba(31, 159, 216, 0.15);
  border-color: rgba(31, 159, 216, 0.3);
}

.work-card:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Featured card styling */
.work-card-featured {
  grid-column: span 1;
  border-color: rgba(31, 159, 216, 0.2);
}

/* Image Container */
.work-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.work-card:hover .work-image img {
  transform: scale(1.1);
}

/* Overlay */
.work-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 14, 39, 0.95) 0%,
    rgba(10, 14, 39, 0.7) 50%,
    rgba(10, 14, 39, 0.3) 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: var(--space-lg);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.work-card:hover .work-overlay {
  opacity: 1;
}

.work-overlay-content {
  text-align: center;
  transform: translateY(20px);
  transition: transform var(--transition-normal);
}

.work-card:hover .work-overlay-content {
  transform: translateY(0);
}

/* Technologies */
.work-technologies {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.tech-badge {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  background: rgba(31, 159, 216, 0.15);
  border-radius: var(--radius-full);
}

.tech-more {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-muted);
}

/* Link Button */
.work-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.link-icon {
  width: 16px;
  height: 16px;
  transition: transform var(--transition-fast);
}

.work-card:hover .link-icon {
  transform: translateX(3px);
}

/* Content */
.work-content {
  padding: var(--space-md);
}

/* Category */
.work-category {
  display: inline-block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-xs);
}

/* Title */
.work-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  margin-bottom: var(--space-sm);
  line-height: var(--line-height-tight);
}

/* Description */
.work-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .work-overlay {
    opacity: 1;
    background: linear-gradient(
      to top,
      rgba(10, 14, 39, 0.9) 0%,
      transparent 100%
    );
  }

  .work-overlay-content {
    transform: translateY(0);
  }
}
</style>
