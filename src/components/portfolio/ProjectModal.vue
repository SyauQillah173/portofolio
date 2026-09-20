<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-container" ref="modalRef">
          <!-- Close Button -->
          <button
            class="modal-close"
            @click="closeModal"
            aria-label="Close modal"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <!-- Modal Content -->
          <div class="modal-content">
            <!-- Left Side - Gallery -->
            <div class="modal-gallery">
              <!-- Main Image Area -->
              <div class="gallery-main" :class="{ 'is-zoom-mode': isZoomMode }">
                <!-- Ambient Backdrop with blurred glow -->
                <div
                  class="ambient-backdrop"
                  :style="{ backgroundImage: `url(${currentImage})` }"
                  aria-hidden="true"
                ></div>

                <!-- Floating Toolbar: Fit Mode Toggle, HD Lightbox Button, Counter -->
                <div class="gallery-top-bar">
                  <span class="gallery-counter">
                    📷 {{ currentImageIndex + 1 }} / {{ (project.gallery && project.gallery.length > 0 ? project.gallery : [project.image]).length }}
                  </span>
                  <div class="gallery-tools">
                    <button
                      type="button"
                      class="tool-btn"
                      @click="toggleZoomMode"
                      :title="isZoomMode ? 'Kembali ke Tampilan Penuh (Fit)' : 'Zoom Detail (100%)'"
                    >
                      <span>{{ isZoomMode ? '🔍 Tampilan Penuh' : '🔍 Zoom Detail' }}</span>
                    </button>
                    <a
                      :href="currentImage"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="tool-btn"
                      title="Buka Gambar Resolusi Asli HD di Tab Baru"
                    >
                      <span>⛶ Buka HD</span>
                    </a>
                  </div>
                </div>

                <img
                  :src="currentImage"
                  :alt="project.title"
                  class="main-image"
                  @error="handleImgError"
                />

                <!-- Navigation Arrows -->
                <button
                  v-if="project.gallery && project.gallery.length > 1"
                  class="gallery-nav gallery-prev"
                  @click="prevImage"
                  aria-label="Previous image"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  v-if="project.gallery && project.gallery.length > 1"
                  class="gallery-nav gallery-next"
                  @click="nextImage"
                  aria-label="Next image"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              <!-- Thumbnails -->
              <div
                v-if="project.gallery && project.gallery.length > 1"
                class="gallery-thumbnails"
              >
                <button
                  v-for="(img, index) in project.gallery"
                  :key="index"
                  :class="[
                    'thumb',
                    { 'thumb-active': currentImageIndex === index },
                  ]"
                  @click="currentImageIndex = index"
                >
                  <img
                    :src="img"
                    :alt="`${project.title} - Image ${index + 1}`"
                    @error="handleImgError"
                  />
                </button>
              </div>
            </div>

            <!-- Right Side - Details -->
            <div class="modal-details">
              <!-- Category Badge -->
              <span class="project-category">{{ categoryLabel }}</span>

              <!-- Title -->
              <h2 class="project-title">{{ project.title }}</h2>

              <!-- Meta Info -->
              <div class="project-meta">
                <div v-if="project.year" class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span>{{ project.year }}</span>
                </div>
                <div v-if="project.role" class="meta-item">
                  <span class="meta-icon">👤</span>
                  <span>Peran: {{ project.role }}</span>
                </div>
                <div v-if="project.productionHouse" class="meta-item">
                  <span class="meta-icon">🎬</span>
                  <span>Production: {{ project.productionHouse }}</span>
                </div>
                <div v-if="project.client" class="meta-item">
                  <span class="meta-icon">🏢</span>
                  <span>Klien: {{ project.client }}</span>
                </div>
              </div>

              <!-- Description -->
              <div class="project-description">
                <h3>Deskripsi</h3>
                <p>{{ project.fullDescription || project.description }}</p>
              </div>

              <!-- Technologies -->
              <div class="project-technologies">
                <h3>Teknologi</h3>
                <div class="tech-list">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- External Links -->
              <div
                v-if="project.externalLinks && project.externalLinks.length > 0"
                class="project-links"
              >
                <h3>Links</h3>
                <div class="links-list">
                  <a
                    v-for="link in project.externalLinks"
                    :key="link.url"
                    :href="link.url"
                    class="external-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span class="link-icon">{{ getLinkIcon(link.icon) }}</span>
                    {{ link.label }}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="arrow-icon"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * ProjectModal Component
 * =======================
 * Full-screen modal displaying detailed project information
 * with image gallery, description, technologies, and external links.
 */

import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

// Gallery state
const currentImageIndex = ref(0);
const isZoomMode = ref(false);
const modalRef = ref(null);

const toggleZoomMode = () => {
  isZoomMode.value = !isZoomMode.value;
};

// Current image
const currentImage = computed(() => {
  if (props.project.gallery && props.project.gallery.length > 0) {
    return props.project.gallery[currentImageIndex.value];
  }
  return props.project.image;
});

// Category label
const categoryLabels = {
  web: "Software & Web",
  drone: "Drone & Aerial",
  network: "IT & Network",
  video: "Video & Media",
  frontend: "Frontend",
  design: "Desain",
};

const categoryLabel = computed(
  () => categoryLabels[props.project.category] || props.project.category
);

// Link icons
const getLinkIcon = (iconType) => {
  const icons = {
    drive: "📁",
    gdrive: "📁",
    github: "💻",
    youtube: "🎬",
    vimeo: "🎥",
    behance: "🎨",
    dribbble: "🏀",
    external: "🔗",
  };
  return icons[iconType] || "🔗";
};

// Gallery navigation
const prevImage = () => {
  if (props.project.gallery) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? props.project.gallery.length - 1
        : currentImageIndex.value - 1;
  }
};

const nextImage = () => {
  if (props.project.gallery) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % props.project.gallery.length;
  }
};

const handleImgError = (e) => {
  e.target.src =
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000&h=650&fit=crop&q=80";
};

// Close modal
const closeModal = () => {
  emit("close");
};

// Handle escape key
const handleKeydown = (e) => {
  if (e.key === "Escape" && props.isOpen) {
    closeModal();
  }
  if (e.key === "ArrowLeft" && props.isOpen) {
    prevImage();
  }
  if (e.key === "ArrowRight" && props.isOpen) {
    nextImage();
  }
};

// Reset gallery index when project changes
watch(
  () => props.project,
  () => {
    currentImageIndex.value = 0;
    isZoomMode.value = false;
  }
);
watch(currentImageIndex, () => {
  isZoomMode.value = false;
});

// Lock body scroll when modal is open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  z-index: 9999;
  overflow-y: auto;
}

/* Modal Container */
.modal-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  background: var(--color-bg-dark);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(31, 159, 216, 0.1);
}

/* Close Button */
.modal-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  color: var(--color-text-light);
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 20;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.85);
  color: #fff;
  transform: rotate(90deg);
}

.modal-close svg {
  width: 24px;
  height: 24px;
}

/* Modal Content */
.modal-content {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  max-height: 90vh;
  overflow: hidden;
}

/* Gallery Section */
.modal-gallery {
  background: #050814;
  display: flex;
  flex-direction: column;
  position: relative;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.gallery-main {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #040711;
  min-height: 420px;
  padding: var(--space-md);
}

.ambient-backdrop {
  position: absolute;
  inset: -25px;
  background-size: cover;
  background-position: center;
  filter: blur(35px) brightness(0.25) saturate(1.3);
  transform: scale(1.15);
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
}

.gallery-top-bar {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  right: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 5;
  pointer-events: none;
}

.gallery-counter {
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  color: #E2E8F0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  pointer-events: auto;
}

.gallery-tools {
  display: flex;
  gap: 6px;
  pointer-events: auto;
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #E2E8F0;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.tool-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.main-image {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain; /* CRITICAL: Never crop, displays full HD image at all resolutions! */
  border-radius: var(--radius-md);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08);
  z-index: 1;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-main.is-zoom-mode .main-image {
  max-width: none;
  max-height: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Gallery Navigation */
.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-text-light);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.gallery-nav:hover {
  background: var(--color-primary);
}

.gallery-nav svg {
  width: 24px;
  height: 24px;
}

.gallery-prev {
  left: var(--space-md);
}

.gallery-next {
  right: var(--space-md);
}

/* Thumbnails */
.gallery-thumbnails {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.4);
  overflow-x: auto;
}

.thumb {
  flex-shrink: 0;
  width: 60px;
  height: 45px;
  border: 2px solid transparent;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
  background: none;
}

.thumb:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.thumb-active {
  border-color: var(--color-primary);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Details Section */
.modal-details {
  padding: var(--space-xl);
  overflow-y: auto;
  max-height: 90vh;
}

/* Category */
.project-category {
  display: inline-block;
  padding: var(--space-xs) var(--space-md);
  background: rgba(31, 159, 216, 0.15);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-md);
}

/* Title */
.project-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  margin-bottom: var(--space-lg);
  line-height: var(--line-height-tight);
}

/* Meta Info */
.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.meta-icon {
  font-size: 1rem;
}

/* Description */
.project-description h3,
.project-technologies h3,
.project-links h3 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  margin-bottom: var(--space-sm);
}

.project-description {
  margin-bottom: var(--space-lg);
}

.project-description p {
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
}

/* Technologies */
.project-technologies {
  margin-bottom: var(--space-lg);
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tech-tag {
  padding: var(--space-xs) var(--space-sm);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.tech-tag:hover {
  background: rgba(31, 159, 216, 0.15);
  border-color: var(--color-primary);
}

/* External Links */
.links-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.external-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: rgba(31, 159, 216, 0.1);
  border: 1px solid rgba(31, 159, 216, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-text-light);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.external-link:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateX(5px);
}

.link-icon {
  font-size: 1.1rem;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  margin-left: auto;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
  opacity: 0;
}

/* Responsive - Mobile Small (320px-374px) */
@media (max-width: 374px) {
  .modal-backdrop {
    padding: 0;
  }

  .modal-container {
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
  }

  .modal-content {
    grid-template-columns: 1fr;
    max-height: 100vh;
    overflow-y: auto;
  }

  .modal-gallery {
    max-height: none;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .gallery-main {
    min-height: 220px;
    max-height: 40vh;
    padding: 8px;
  }

  .modal-details {
    max-height: none;
    padding: var(--space-md);
  }

  .project-title {
    font-size: var(--font-size-lg);
  }

  .project-meta {
    gap: var(--space-sm);
  }

  .meta-item {
    font-size: var(--font-size-xs);
  }

  .project-description p {
    font-size: var(--font-size-sm);
  }

  .tech-tag {
    font-size: var(--font-size-xs);
    padding: 4px 8px;
  }

  .gallery-nav {
    width: 34px;
    height: 34px;
  }

  .gallery-nav svg {
    width: 16px;
    height: 16px;
  }

  .gallery-thumbnails {
    padding: var(--space-xs);
    gap: var(--space-xs);
  }

  .thumb {
    width: 45px;
    height: 35px;
  }
}

/* Responsive - Mobile (375px-639px) */
@media (min-width: 375px) and (max-width: 639px) {
  .modal-backdrop {
    padding: 0;
  }

  .modal-container {
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
  }

  .modal-content {
    grid-template-columns: 1fr;
    max-height: 100vh;
    overflow-y: auto;
  }

  .modal-gallery {
    max-height: none;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .gallery-main {
    min-height: 250px;
    max-height: 44vh;
    padding: 10px;
  }

  .modal-details {
    max-height: none;
    padding: var(--space-lg);
  }

  .project-title {
    font-size: var(--font-size-xl);
  }
}

/* Responsive - Tablet (640px-1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  .modal-backdrop {
    padding: var(--space-md);
  }

  .modal-container {
    max-height: 95vh;
    border-radius: var(--radius-lg);
  }

  .modal-content {
    grid-template-columns: 1fr;
    max-height: 95vh;
    overflow-y: auto;
  }

  .modal-gallery {
    max-height: none;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .gallery-main {
    min-height: 340px;
    max-height: 48vh;
    padding: var(--space-md);
  }
}

/* Responsive - Desktop (1024px+) */
@media (min-width: 1024px) {
  .modal-content {
    grid-template-columns: 1.15fr 1fr;
    max-height: 90vh;
    overflow: hidden;
  }

  .modal-gallery {
    max-height: none;
    height: 100%;
  }

  .gallery-main {
    min-height: 440px;
  }
}
</style>
