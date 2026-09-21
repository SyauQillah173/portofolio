<template>
  <section id="portfolio" class="portfolio-section section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header scroll-animate">
        <span class="section-badge">Portofolio</span>
        <h2 class="section-title">
          Hasil Kerja <span class="section-accent">Saya</span>
        </h2>
        <p class="section-subtitle">
          Koleksi project dan karya terbaik yang telah saya kerjakan
        </p>
      </div>

      <!-- Filter Buttons -->
      <div class="portfolio-filters scroll-animate">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="[
            'filter-btn',
            { 'filter-btn-active': activeFilter === category.id },
          ]"
          @click="setFilter(category.id)"
          :aria-pressed="activeFilter === category.id"
        >
          <span class="filter-icon">{{ category.icon }}</span>
          <span class="filter-text">{{ category.name }}</span>
        </button>
      </div>

      <!-- Google Drive Archive Showcase Banner -->
      <div class="gdrive-archive-card scroll-animate">
        <div class="gdrive-card-content">
          <div class="gdrive-badge-wrap">
            <span class="gdrive-badge">
              <span class="gdrive-dot"></span>
              Google Drive Cloud Archive
            </span>
          </div>
          <h3 class="gdrive-title">
            Akses Master File & Resolusi Penuh di Google Drive
          </h3>
          <p class="gdrive-desc">
            Tersedia rekaman asli drone 4K (Pertamina & Bulog), karya video produksi, dokumentasi foto beresolusi tinggi, serta hasil kreasi video AI BetaTech:
          </p>
          <div class="gdrive-pill-list">
            <a href="https://drive.google.com/drive/folders/1c70iPsGZhf0u3xTs_qfv_41IINvlPYSW?usp=sharing" target="_blank" rel="noopener noreferrer" class="gdrive-pill">
              <span>🚁</span> Hasil Karya Drone
            </a>
            <a href="https://drive.google.com/drive/folders/1c70iPsGZhf0u3xTs_qfv_41IINvlPYSW?usp=sharing" target="_blank" rel="noopener noreferrer" class="gdrive-pill">
              <span>🎬</span> Hasil Video Produksi
            </a>
            <a href="https://drive.google.com/drive/folders/1c70iPsGZhf0u3xTs_qfv_41IINvlPYSW?usp=sharing" target="_blank" rel="noopener noreferrer" class="gdrive-pill">
              <span>📸</span> Dokumentasi Foto
            </a>
            <a href="https://drive.google.com/drive/folders/1c70iPsGZhf0u3xTs_qfv_41IINvlPYSW?usp=sharing" target="_blank" rel="noopener noreferrer" class="gdrive-pill">
              <span>🤖</span> Hasil Video AI (BetaTech)
            </a>
          </div>
        </div>
        <div class="gdrive-card-action">
          <a
            href="https://drive.google.com/drive/folders/1c70iPsGZhf0u3xTs_qfv_41IINvlPYSW?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary btn-lg gdrive-open-btn"
          >
            <span>Buka Google Drive ↗</span>
          </a>
        </div>
      </div>

      <!-- Portfolio Grid with smooth transitions -->
      <div class="portfolio-grid" ref="gridRef">
        <TransitionGroup name="work-item">
          <WorkCard
            v-for="work in filteredWorks"
            :key="work.id"
            :id="work.id"
            :title="work.title"
            :category="work.category"
            :image="work.image"
            :description="work.description"
            :technologies="work.technologies"
            :featured="work.featured"
            class="work-card-wrapper"
            @open="openProjectModal"
          />
        </TransitionGroup>
      </div>

      <!-- Empty State -->
      <Transition name="fade">
        <div v-if="filteredWorks.length === 0" class="portfolio-empty">
          <span class="empty-icon">📭</span>
          <p>Tidak ada project dalam kategori ini.</p>
        </div>
      </Transition>

      <!-- View More / External Archive CTAs -->
      <div class="portfolio-cta scroll-animate">
        <a
          href="https://drive.google.com/drive/folders/1c70iPsGZhf0u3xTs_qfv_41IINvlPYSW?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary btn-lg"
        >
          <span>📁 Buka Seluruh Arsip di Google Drive</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="btn-icon-right"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
        <a
          href="https://github.com/SyauQillah173"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary btn-lg"
        >
          <span>💻 GitHub Repository</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="btn-icon-right"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </div>

    <!-- Project Detail Modal -->
    <ProjectModal
      :is-open="isModalOpen"
      :project="selectedProject"
      @close="closeProjectModal"
    />
  </section>
</template>

<script setup>
/**
 * PortfolioSection Component
 * ===========================
 * Displays a filterable grid of portfolio works with smooth animations.
 * Clicking on a work card opens a detail modal.
 */

import { usePortfolioStore } from "@/composables/usePortfolioStore";
import { useScrollAnimation } from "@/composables/useScrollAnimation";
import { computed, nextTick, onMounted, ref } from "vue";
import ProjectModal from "./ProjectModal.vue";
import WorkCard from "./WorkCard.vue";

// Use reactive central store
const { works, categories } = usePortfolioStore();

// Refs
const gridRef = ref(null);

// Active filter with smooth transition
const activeFilter = ref("all");
const isTransitioning = ref(false);

// Modal state
const isModalOpen = ref(false);
const selectedProject = ref(works.value[0] || {});

// Filtered works
const filteredWorks = computed(() => {
  if (activeFilter.value === "all") {
    return works.value;
  }
  return works.value.filter((work) => work.category === activeFilter.value);
});

/**
 * Set active filter with smooth transition
 */
const setFilter = async (categoryId) => {
  if (categoryId === activeFilter.value || isTransitioning.value) return;

  isTransitioning.value = true;
  activeFilter.value = categoryId;

  await nextTick();
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500);
};

/**
 * Open project modal
 */
const openProjectModal = (projectId) => {
  const project = works.value.find((w) => w.id === projectId);
  if (project) {
    selectedProject.value = project;
    isModalOpen.value = true;
  }
};

/**
 * Close project modal
 */
const closeProjectModal = () => {
  isModalOpen.value = false;
};

// Setup scroll animation
const { observeAll } = useScrollAnimation({
  threshold: 0.1,
  staggerDelay: 100,
});

// Observe elements on mount
onMounted(() => {
  setTimeout(() => {
    const elements = document.querySelectorAll(
      ".portfolio-section .scroll-animate"
    );
    observeAll(elements);
  }, 100);
});
</script>

<style scoped>
.portfolio-section {
  background: linear-gradient(
    180deg,
    var(--color-bg-dark) 0%,
    var(--color-bg-darker) 100%
  );
  position: relative;
  overflow: hidden;
}

/* Decorative background */
.portfolio-section::before {
  content: "";
  position: absolute;
  top: 20%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(31, 159, 216, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: var(--space-xl);
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
  position: relative;
}

.section-accent::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), transparent);
  border-radius: 2px;
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
}

/* Filter Buttons - Improved */
.portfolio-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-2xl);
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 400ms var(--ease-smooth);
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
  opacity: 0;
  transition: opacity 400ms var(--ease-smooth);
}

.filter-btn:hover {
  color: var(--color-text-light);
  border-color: rgba(31, 159, 216, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(31, 159, 216, 0.15);
}

.filter-btn-active {
  color: var(--color-text-light);
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(31, 159, 216, 0.3);
}

.filter-btn-active::before {
  opacity: 1;
}

.filter-icon,
.filter-text {
  position: relative;
  z-index: 1;
}

.filter-icon {
  font-size: 1rem;
}

/* Google Drive Cloud Archive Showcase Card */
.gdrive-archive-card {
  background: radial-gradient(
      ellipse at top left,
      rgba(31, 159, 216, 0.15) 0%,
      transparent 60%
    ),
    linear-gradient(145deg, rgba(20, 29, 58, 0.85), rgba(13, 20, 39, 0.95));
  border: 1px solid rgba(31, 159, 216, 0.28);
  border-radius: var(--radius-xl);
  padding: var(--space-xl) var(--space-2xl);
  margin-bottom: var(--space-2xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2xl);
  box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
}

.gdrive-archive-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(
    180deg,
    var(--color-primary),
    #6366f1
  );
}

.gdrive-card-content {
  flex: 1;
}

.gdrive-badge-wrap {
  margin-bottom: var(--space-xs);
}

.gdrive-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  background: rgba(31, 159, 216, 0.16);
  border: 1px solid rgba(31, 159, 216, 0.3);
  color: #38bdf8;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.gdrive-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.gdrive-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: #f8fafc;
  margin-bottom: var(--space-xs);
}

.gdrive-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  max-width: 680px;
}

.gdrive-pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.gdrive-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: #e2e8f0;
  text-decoration: none;
  transition: all 300ms var(--ease-smooth);
}

.gdrive-pill:hover {
  background: rgba(31, 159, 216, 0.18);
  border-color: rgba(31, 159, 216, 0.4);
  color: #38bdf8;
  transform: translateY(-2px);
}

.gdrive-card-action {
  flex-shrink: 0;
}

.gdrive-open-btn {
  white-space: nowrap;
  box-shadow: 0 8px 24px -4px rgba(31, 159, 216, 0.45);
}

/* Portfolio Grid */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  min-height: 200px;
}

/* Work Card Wrapper for animations */
.work-card-wrapper {
  will-change: transform, opacity;
}

/* Ultra smooth grid transitions */
.work-item-enter-active {
  transition: opacity 600ms var(--ease-smooth-in-out),
    transform 600ms var(--ease-smooth-in-out);
}

.work-item-leave-active {
  transition: opacity 400ms var(--ease-smooth),
    transform 400ms var(--ease-smooth);
  position: absolute;
}

.work-item-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.work-item-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.work-item-move {
  transition: transform 600ms var(--ease-smooth-in-out);
}

/* Empty State */
.portfolio-empty {
  text-align: center;
  padding: var(--space-3xl);
  color: var(--color-text-muted);
}

.empty-icon {
  display: block;
  font-size: 3rem;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms var(--ease-smooth);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* CTA Section */
.portfolio-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-3xl);
}

.btn-icon-right {
  width: 18px;
  height: 18px;
  margin-left: var(--space-xs);
  transition: transform 300ms var(--ease-smooth);
}

.btn:hover .btn-icon-right {
  transform: translate(3px, -3px);
}

/* Scroll animation - Always visible fallback to prevent blank text on fast scroll */
.scroll-animate {
  opacity: 1;
  transform: none;
}

.scroll-animate.is-visible {
  opacity: 1;
  transform: none;
}

/* Responsive - Mobile Small (320px-374px) */
@media (max-width: 374px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .section-title {
    font-size: 1.25rem;
  }

  .section-subtitle {
    font-size: var(--font-size-sm);
  }

  .portfolio-filters {
    gap: 4px;
    margin-bottom: var(--space-lg);
  }

  .filter-btn {
    padding: 6px 10px;
    font-size: 0.7rem;
  }

  .filter-icon {
    display: none;
  }

  .portfolio-cta .btn {
    width: 100%;
    font-size: var(--font-size-sm);
  }

  .gdrive-archive-card {
    flex-direction: column;
    align-items: stretch;
    padding: var(--space-lg);
    gap: var(--space-lg);
    text-align: left;
  }

  .gdrive-open-btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}

/* Responsive - Mobile (375px-639px) */
@media (min-width: 375px) and (max-width: 639px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .section-title {
    font-size: var(--font-size-xl);
  }

  .section-subtitle {
    font-size: var(--font-size-base);
  }

  .portfolio-filters {
    gap: var(--space-xs);
  }

  .filter-btn {
    padding: var(--space-xs) var(--space-md);
    font-size: var(--font-size-xs);
  }

  .filter-icon {
    display: none;
  }

  .portfolio-cta .btn {
    width: 100%;
  }

  .gdrive-archive-card {
    flex-direction: column;
    align-items: stretch;
    padding: var(--space-lg);
    gap: var(--space-lg);
  }

  .gdrive-open-btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}

/* Responsive - Tablet (640px-1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }
}

/* Responsive - Desktop (1024px+) */
@media (min-width: 1024px) {
  .portfolio-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-lg);
  }
}
</style>
