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
            <!-- Left Side - Gallery & Video Player -->
            <div class="modal-gallery">
              <!-- Non-overlapping Top Bar (Dedicated header) -->
              <div class="gallery-top-bar">
                <span class="gallery-counter">
                  <span v-if="currentMediaType === 'youtube'">🎬 YouTube</span>
                  <span v-else-if="currentMediaType === 'video'">🎥 Video</span>
                  <span v-else>📷 Foto</span>
                  {{ currentImageIndex + 1 }} / {{ mediaItems.length }}
                </span>
                <div class="gallery-tools">
                  <button
                    v-if="currentMediaType === 'image'"
                    type="button"
                    class="tool-btn"
                    @click="toggleZoomMode"
                    :title="isZoomMode ? 'Kembali ke Tampilan Penuh (Fit)' : 'Zoom Detail (Scroll Bebas)'"
                  >
                    <span>{{ isZoomMode ? '🔍 Tampilan Penuh' : '🔍 Zoom Detail' }}</span>
                  </button>
                  <a
                    v-if="currentMediaType === 'youtube'"
                    :href="currentRawMedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tool-btn"
                    title="Buka di YouTube"
                  >
                    <span>▶ Buka di YouTube</span>
                  </a>
                  <a
                    v-else
                    :href="resolvedMediaUrl || currentRawMedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="tool-btn"
                    :title="currentMediaType === 'video' ? 'Buka Video Resolusi Penuh' : 'Buka Gambar Resolusi Asli HD di Tab Baru'"
                  >
                    <span>{{ currentMediaType === 'video' ? '⛶ Buka Video' : '⛶ Buka HD' }}</span>
                  </a>
                </div>
              </div>

              <!-- Main Media Stage -->
              <div
                class="gallery-main"
                :class="{
                  'is-zoom-mode': isZoomMode,
                  'is-video-media': currentMediaType !== 'image',
                }"
              >
                <!-- Ambient Backdrop with blurred glow (active for images) -->
                <div
                  v-if="currentMediaType === 'image'"
                  class="ambient-backdrop"
                  :style="{ backgroundImage: `url(${resolvedMediaUrl || currentRawMedia})` }"
                  aria-hidden="true"
                ></div>

                <!-- 1. YouTube Video Embed Player -->
                <div v-if="currentMediaType === 'youtube'" class="media-youtube-wrap">
                  <iframe
                    :src="youtubeEmbedUrl"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    class="video-iframe"
                  ></iframe>
                </div>

                <!-- 2. Direct Video Player (MP4 / WebM / Blob) -->
                <div v-else-if="currentMediaType === 'video'" class="media-video-wrap">
                  <video
                    :src="resolvedMediaUrl || currentRawMedia"
                    controls
                    autoplay
                    playsinline
                    class="main-video"
                  ></video>
                </div>

                <!-- 3. Standard Uncropped Image with Click-to-Zoom -->
                <img
                  v-else
                  :src="resolvedMediaUrl || currentRawMedia"
                  :alt="project.title"
                  class="main-image"
                  @click="toggleZoomMode"
                  :title="isZoomMode ? 'Klik gambar untuk Tampilan Penuh (Fit)' : 'Klik gambar untuk Zoom Detail (Scroll Bebas)'"
                  @error="handleImgError"
                />

                <!-- Navigation Arrows -->
                <button
                  v-if="mediaItems.length > 1"
                  class="gallery-nav gallery-prev"
                  @click="prevImage"
                  aria-label="Previous media"
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
                  v-if="mediaItems.length > 1"
                  class="gallery-nav gallery-next"
                  @click="nextImage"
                  aria-label="Next media"
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

              <!-- Thumbnails with Video Badges -->
              <div
                v-if="mediaItems.length > 1"
                class="gallery-thumbnails"
              >
                <button
                  v-for="(item, index) in mediaItems"
                  :key="index"
                  :class="[
                    'thumb',
                    { 'thumb-active': currentImageIndex === index },
                    { 'thumb-video': getThumbType(item) !== 'image' }
                  ]"
                  @click="selectMedia(index)"
                >
                  <img
                    :src="getThumbSrc(item)"
                    :alt="`${project.title} - Media ${index + 1}`"
                    @error="handleImgError"
                  />
                  <span v-if="getThumbType(item) === 'youtube'" class="thumb-badge badge-yt">▶ YT</span>
                  <span v-else-if="getThumbType(item) === 'video'" class="thumb-badge badge-vid">▶ Video</span>
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
import {
  getMediaType,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  resolveMediaUrl,
} from "@/utils/mediaHelper";

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
const resolvedMediaUrl = ref("");

const toggleZoomMode = () => {
  isZoomMode.value = !isZoomMode.value;
};

// Media items array (combining gallery or image)
const mediaItems = computed(() => {
  if (props.project.gallery && props.project.gallery.length > 0) {
    return props.project.gallery;
  }
  if (props.project.image) {
    return [props.project.image];
  }
  return [];
});

// Current active raw media
const currentRawMedia = computed(() => {
  if (mediaItems.value.length > 0) {
    return mediaItems.value[currentImageIndex.value] || "";
  }
  return props.project.image || "";
});

// Current media type: 'youtube' | 'video' | 'image'
const currentMediaType = computed(() => {
  return getMediaType(currentRawMedia.value);
});

// YouTube embed link
const youtubeEmbedUrl = computed(() => {
  if (currentMediaType.value === "youtube") {
    return getYouTubeEmbedUrl(currentRawMedia.value, 1);
  }
  return "";
});

// Watch & resolve media URL (especially for IndexedDB blob URLs)
watch(
  currentRawMedia,
  async (newVal) => {
    if (newVal && newVal.startsWith("idb://")) {
      resolvedMediaUrl.value = await resolveMediaUrl(newVal);
    } else {
      resolvedMediaUrl.value = newVal || "";
    }
  },
  { immediate: true }
);

// Thumbnail helper
const getThumbType = (item) => getMediaType(item);

const getThumbSrc = (item) => {
  const type = getMediaType(item);
  if (type === "youtube") {
    return getYouTubeThumbnail(item);
  }
  if (type === "video") {
    // If project has an image cover, use it for thumbnail, or fallback
    return props.project.image || "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=400&fit=crop&q=80";
  }
  return item;
};

const selectMedia = (index) => {
  currentImageIndex.value = index;
  isZoomMode.value = false;
};

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
  width: 95%;
  max-width: 1240px;
  height: 88vh;
  max-height: 88vh;
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
  grid-template-columns: 1.2fr 1fr;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

/* Gallery Section - Definite Height Grid prevents any image cropping */
.modal-gallery {
  background: #040714;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  position: relative;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #060919;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  z-index: 5;
  flex-shrink: 0;
  width: 100%;
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
}

.gallery-tools {
  display: flex;
  gap: 6px;
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

/* Row 2 Main Stage with strictly constrained bounds */
.gallery-main {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #020510;
  padding: 14px;
  box-sizing: border-box;
}

/* Image containment: aspect-ratio preserved with zero cutoff */
.main-image {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain; /* Full uncropped fit across 1:1, 4:5 Instagram, 9:16 story, and landscape */
  border-radius: var(--radius-md);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08);
  z-index: 1;
  display: block;
  cursor: zoom-in;
  transition: transform 200ms ease;
}

/* Zoom Mode: Free vertical scroll to read small text and details in Full HD */
.gallery-main.is-zoom-mode {
  overflow-y: auto !important;
  overflow-x: hidden;
  display: block;
  text-align: center;
  padding: 16px;
}

.gallery-main.is-zoom-mode .main-image {
  max-width: 100%;
  max-height: none !important;
  width: auto;
  height: auto;
  margin: 0 auto;
  cursor: zoom-out;
  display: inline-block;
}

/* Video & Media Wrappers */
.media-youtube-wrap,
.media-video-wrap {
  width: 100%;
  height: 100%;
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  background: #02050f;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.video-iframe {
  width: 100%;
  height: 100%;
  min-height: 340px;
  aspect-ratio: 16/9;
  border: none;
  border-radius: var(--radius-md);
}

.main-video {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  border-radius: var(--radius-md);
  outline: none;
  background: #000;
}

.gallery-main.is-video-media {
  background: #040816;
}

/* Thumbnail Video Badges */
.thumb-video {
  position: relative;
}

.thumb-badge {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;
  color: #fff;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.badge-yt {
  background: #e62117;
}

.badge-vid {
  background: #2563eb;
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
  position: relative;
  flex-shrink: 0;
  width: 64px;
  height: 48px;
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
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
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
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
  }

  .modal-gallery {
    display: flex;
    flex-direction: column;
    height: auto;
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .gallery-main {
    min-height: 240px;
    height: 48vh;
    max-height: 52vh;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .modal-details {
    flex: 1;
    max-height: none;
    padding: var(--space-md);
    overflow-y: visible;
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
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
  }

  .modal-gallery {
    display: flex;
    flex-direction: column;
    height: auto;
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .modal-close {
    top: 6px;
    right: 6px;
    width: 32px;
    height: 32px;
    z-index: 30;
  }

  .modal-close svg {
    width: 16px;
    height: 16px;
  }

  .gallery-top-bar {
    padding: 8px 46px 8px 10px;
  }

  .gallery-main {
    min-height: 280px;
    height: 50vh;
    max-height: 55vh;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .modal-details {
    flex: 1;
    max-height: none;
    padding: var(--space-lg);
    overflow-y: visible;
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
    height: 92vh;
    max-height: 92vh;
    border-radius: var(--radius-lg);
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
  }

  .modal-gallery {
    display: flex;
    flex-direction: column;
    height: auto;
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .gallery-main {
    min-height: 380px;
    height: 52vh;
    max-height: 56vh;
    padding: var(--space-md);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .modal-details {
    flex: 1;
    padding: var(--space-xl);
    overflow-y: visible;
  }
}

/* Responsive - Desktop (1024px+) */
@media (min-width: 1024px) {
  .modal-container {
    height: 88vh;
    max-height: 88vh;
  }

  .modal-content {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .modal-gallery {
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100%;
    max-height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .gallery-main {
    height: 100%;
    min-height: 0;
    width: 100%;
    min-width: 0;
  }

  .modal-details {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
  }
}
</style>
