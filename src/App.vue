<template>
  <div id="app" class="app">
    <!-- Admin Portal View -->
    <template v-if="currentView === 'admin'">
      <AdminDashboard
        v-if="isAuthenticated"
        @view-public="goToPublic"
        @logout="goToPublic"
      />
      <AdminLogin
        v-else
        @login-success="currentView = 'admin'"
        @back="goToPublic"
      />
    </template>

    <!-- Public Portfolio View -->
    <template v-else>
      <!-- Skip Link for Accessibility -->
      <a href="#main-content" class="skip-link"> Skip to main content </a>

      <!-- Header -->
      <Header />

      <!-- Main Content -->
      <main id="main-content" class="main">
      <!-- Hero Section -->
      <HeroSection />

      <!-- About Section -->
      <section id="about" class="about-section section">
        <div class="container">
          <div class="about-content">
            <div class="about-text scroll-animate">
              <span class="section-badge">Tentang</span>
              <h2 class="section-title">
                Tentang <span class="section-accent">Saya</span>
              </h2>
              <p v-for="(para, pIdx) in aboutParagraphs" :key="pIdx" class="about-paragraph">
                {{ para }}
              </p>
            </div>

            <!-- Animated Stats -->
            <div class="about-stats scroll-animate" ref="statsRef">
              <div class="stat-item" v-for="stat in stats" :key="stat.label">
                <div class="stat-icon">{{ stat.icon }}</div>
                <span class="stat-number">
                  {{ stat.currentValue }}<span class="stat-plus">+</span>
                </span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Experience & Education Section -->
      <ExperienceSection />

      <!-- Skills Section -->
      <SkillsSection />

      <!-- Portfolio Section -->
      <PortfolioSection />

      <!-- Contact Section -->
      <section id="contact" class="contact-section section">
        <div class="container">
          <div class="contact-content">
            <!-- Section Header -->
            <div class="section-header">
              <h2 class="section-title">
                Hubungi <span class="section-accent">Saya</span>
              </h2>
              <p class="section-subtitle">
                Punya project menarik atau ingin berkolaborasi? Jangan ragu
                untuk menghubungi saya!
              </p>
            </div>

            <!-- Contact Direct Hub (Direct Recruiter & Client Communication) -->
            <div class="contact-hub-wrapper scroll-animate">
              <div class="contact-info">
                <h3 class="contact-heading">Mari Berbincang</h3>
                <p class="contact-text">
                  Saya selalu terbuka untuk mendiskusikan peluang kerja full-time, kontrak, project baru, maupun kolaborasi profesional. Anda dapat menghubungi saya langsung melalui saluran resmi berikut:
                </p>

                <div class="contact-items">
                  <!-- Email Card -->
                  <a
                    :href="`mailto:${profile.email || 'abdullahsyauqillah01@gmail.com'}?subject=Peluang%20Kerja%20/%20Kolaborasi%20Proyek`"
                    class="contact-card"
                    :title="`Kirim Email ke ${profile.name || 'Abdullah Syauqillah'}`"
                  >
                    <div class="contact-card-icon icon-email">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div class="contact-card-body">
                      <span class="contact-card-label">Email Resmi</span>
                      <span class="contact-card-val">{{ profile.email || 'abdullahsyauqillah01@gmail.com' }}</span>
                    </div>
                    <div class="contact-card-action">
                      <span>Kirim</span>
                      <span class="action-arrow">↗</span>
                    </div>
                  </a>

                  <!-- WhatsApp Card -->
                  <a
                    :href="whatsappUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-card contact-card-wa"
                    title="Chat via WhatsApp"
                  >
                    <div class="contact-card-icon icon-wa">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    </div>
                    <div class="contact-card-body">
                      <div class="label-row">
                        <span class="contact-card-label">WhatsApp</span>
                        <span class="online-pill">🟢 Fast Response</span>
                      </div>
                      <span class="contact-card-val">{{ profile.phone || '+62 815 5936 131' }}</span>
                    </div>
                    <div class="contact-card-action">
                      <span>Chat</span>
                      <span class="action-arrow">↗</span>
                    </div>
                  </a>

                  <!-- Lokasi Card -->
                  <a
                    :href="`https://maps.google.com/?q=${encodeURIComponent(profile.location || 'Bungah Gresik Jawa Timur')}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="contact-card"
                    title="Lihat Lokasi di Google Maps"
                  >
                    <div class="contact-card-icon icon-loc">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div class="contact-card-body">
                      <span class="contact-card-label">Lokasi / Domisili</span>
                      <span class="contact-card-val">{{ profile.location || 'Bungah, Gresik, Jawa Timur' }}</span>
                    </div>
                    <div class="contact-card-action">
                      <span>Peta</span>
                      <span class="action-arrow">↗</span>
                    </div>
                  </a>
                </div>

                <!-- Quick Direct Action Buttons -->
                <div class="contact-quick-actions">
                  <a
                    :href="whatsappUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary btn-lg quick-action-btn quick-action-wa"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="quick-btn-icon">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span>Hubungi via WhatsApp</span>
                  </a>

                  <a
                    :href="`mailto:${profile.email || 'abdullahsyauqillah01@gmail.com'}?subject=Peluang%20Kerja%20/%20Kolaborasi%20Proyek`"
                    class="btn btn-secondary btn-lg quick-action-btn quick-action-mail"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="quick-btn-icon">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>Kirim Email Langsung</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

      <!-- Footer -->
      <Footer />
    </template>
  </div>
</template>

<script setup>
/**
 * App.vue - Root Component
 * =========================
 * Main application component that composes all sections.
 */

import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import AdminDashboard from "./components/admin/AdminDashboard.vue";
import AdminLogin from "./components/admin/AdminLogin.vue";
import ExperienceSection from "./components/experience/ExperienceSection.vue";
import HeroSection from "./components/hero/HeroSection.vue";
import Footer from "./components/layout/Footer.vue";
import Header from "./components/layout/Header.vue";
import PortfolioSection from "./components/portfolio/PortfolioSection.vue";
import SkillsSection from "./components/skills/SkillsSection.vue";
import { usePortfolioStore } from "./composables/usePortfolioStore";
import { useScrollAnimation } from "./composables/useScrollAnimation";

// Portfolio store & view state (Realtime Dynamic CMS Data)
const { isAuthenticated, profile, works, skills, experiences, clients } = usePortfolioStore();
const currentView = ref("public"); // 'public' | 'admin'

// Dynamic About Paragraphs from Full CMS Profile
const aboutParagraphs = computed(() => {
  return (profile.value && Array.isArray(profile.value.aboutParagraphs) && profile.value.aboutParagraphs.length > 0)
    ? profile.value.aboutParagraphs
    : [
        "Saya adalah lulusan S1 Teknik Informatika dengan kombinasi keahlian unik di bidang software development, infrastruktur jaringan, dan produksi multimedia sinematik.",
        "Memiliki rekam jejak merancang dan mengembangkan Sistem Informasi Pesantren skala besar secara mandiri (Full-Stack), mengelola jaringan Fiber Optic & LAN, serta lebih dari 3 tahun berpengalaman sebagai Pilot Drone komersial dan Videografer untuk perusahaan nasional (termasuk proyek Pertamina dan Bulog via Raff Studio) hingga instansi pemerintah."
      ];
});

// Dynamic WhatsApp link from Full CMS Profile
const whatsappUrl = computed(() => {
  if (profile.value && profile.value.whatsapp) {
    const cleanNum = profile.value.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}?text=Halo%20Mas%20Syauqillah,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berkolaborasi`;
  }
  return "https://wa.me/628155936131?text=Halo%20Mas%20Syauqillah,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berkolaborasi";
});

const checkHash = () => {
  if (window.location.hash === "#admin") {
    currentView.value = "admin";
  } else if (currentView.value === "admin" && window.location.hash !== "#admin") {
    currentView.value = "public";
  }
};

const goToPublic = () => {
  currentView.value = "public";
  if (window.location.hash === "#admin") {
    window.location.hash = "#home";
  }
};

const goToAdmin = () => {
  currentView.value = "admin";
  window.location.hash = "#admin";
};

// Helper to calculate career experience years dynamically from work items
const calculateExperienceYears = (workList) => {
  if (!Array.isArray(workList) || workList.length === 0) return 3;

  const currentYear = new Date().getFullYear();
  const startYears = [];

  workList.forEach((item) => {
    if (!item || !item.period) return;
    const matches = String(item.period).match(/\b(19\d\d|20\d\d)\b/g);
    if (matches && matches.length > 0) {
      const validYears = matches.map(Number).filter((y) => y <= currentYear && y >= 1990);
      if (validYears.length > 0) {
        startYears.push(Math.min(...validYears));
      }
    }
  });

  if (startYears.length === 0) return 3;
  const earliestYear = Math.min(...startYears);
  const diff = currentYear - earliestYear;
  return diff > 0 ? diff : 1;
};

// Dynamic Stats Target Values computed 100% in real-time from works, skills, and experiences
const dynamicStatsData = computed(() => {
  // 1. Exact real-time project count (e.g. 8, if user adds 1 -> 9)
  const projectsCount = (works.value && Array.isArray(works.value)) ? works.value.length : 0;

  // 2. Exact real-time skills count (e.g. 8, if user adds 1 -> 9)
  const skillsCount = (skills.value && Array.isArray(skills.value)) ? skills.value.length : 0;

  // 3. Exact real-time clients & partners count from managed clients list (5 default, e.g. Pertamina, Perum BULOG, BPPKAD Gresik, PP Qomaruddin, Raff Studio)
  const clientsCount = (clients.value && Array.isArray(clients.value)) ? clients.value.length : 5;

  // 4. Exact real-time years of experience from earliest start year in work experience
  const yearsExp = calculateExperienceYears(experiences.value?.work);

  return [
    { icon: "💻", targetValue: projectsCount, label: "Proyek IT & Visual" },
    { icon: "⚡", targetValue: skillsCount, label: "Keahlian & Tools" },
    { icon: "🏢", targetValue: clientsCount, label: "Mitra & Klien" },
    { icon: "⏳", targetValue: yearsExp, label: "Tahun Pengalaman" },
  ];
});

// Stats data with animated values
const stats = reactive([
  { icon: "💻", value: 0, currentValue: 0, label: "Proyek IT & Visual" },
  { icon: "⚡", value: 0, currentValue: 0, label: "Keahlian & Tools" },
  { icon: "🏢", value: 0, currentValue: 0, label: "Mitra & Klien" },
  { icon: "⏳", value: 0, currentValue: 0, label: "Tahun Pengalaman" },
]);

// Ref for stats element
const statsRef = ref(null);
let isAnimatingStats = false;
let statsAnimFrame = null;

/**
 * Animate counting for stats smoothly from startVal to target values
 */
const animateStats = (initial = true) => {
  if (statsAnimFrame) {
    cancelAnimationFrame(statsAnimFrame);
    statsAnimFrame = null;
  }
  isAnimatingStats = true;

  const targets = dynamicStatsData.value;
  const startValues = stats.map((s) => (initial ? 0 : s.currentValue));

  targets.forEach((d, idx) => {
    if (stats[idx]) {
      stats[idx].value = d.targetValue;
      stats[idx].icon = d.icon;
      stats[idx].label = d.label;
      if (initial) {
        stats[idx].currentValue = 0;
      }
    }
  });

  const duration = initial ? 1400 : 700; // 1.4s smooth energetic count up
  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    stats.forEach((stat, idx) => {
      const from = startValues[idx] || 0;
      const to = stat.value;
      stat.currentValue = Math.round(from + (to - from) * easeProgress);
    });

    if (progress < 1) {
      statsAnimFrame = requestAnimationFrame(step);
    } else {
      stats.forEach((stat) => {
        stat.currentValue = stat.value;
      });
      isAnimatingStats = false;
      statsAnimFrame = null;
    }
  };

  statsAnimFrame = requestAnimationFrame(step);
};

// Re-sync stats dynamically whenever user adds/edits skills, works, or experiences in Admin CMS
watch(
  dynamicStatsData,
  (newStats) => {
    if (!isAnimatingStats) {
      animateStats(false);
    }
  },
  { deep: true }
);

// Setup scroll animations
const { observeAll } = useScrollAnimation({
  threshold: 0.1,
  staggerDelay: 100,
});

onMounted(() => {
  // Check URL hash for admin view
  checkHash();
  window.addEventListener("hashchange", checkHash);

  // Observe all scroll-animate elements
  setTimeout(() => {
    const elements = document.querySelectorAll(".scroll-animate");
    observeAll(elements);
  }, 100);

  // Setup intersection observer for stats animation to trigger on EVERY scroll into view
  if (typeof IntersectionObserver !== "undefined") {
    let isCurrentlyVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isCurrentlyVisible) {
              isCurrentlyVisible = true;
              animateStats(true);
            }
          } else {
            // When user scrolls away from stats, reset so next time it scrolls into view it animates again!
            isCurrentlyVisible = false;
            if (statsAnimFrame) {
              cancelAnimationFrame(statsAnimFrame);
              statsAnimFrame = null;
            }
            isAnimatingStats = false;
            stats.forEach((s) => {
              s.currentValue = 0;
            });
          }
        });
      },
      { threshold: 0.15 }
    );

    setTimeout(() => {
      const statsElement = document.querySelector(".about-stats");
      if (statsElement) {
        observer.observe(statsElement);
      }
    }, 100);
  }
});

onUnmounted(() => {
  window.removeEventListener("hashchange", checkHash);
});
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
}

/* Skip Link for Accessibility */
.skip-link {
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary);
  color: var(--color-text-light);
  text-decoration: none;
  border-radius: var(--radius-md);
  z-index: 9999;
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: var(--space-md);
}

/* Section Styles */
.section {
  padding: var(--section-padding) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
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

/* About Section */
.about-section {
  background: var(--color-bg-darker);
  position: relative;
  overflow: hidden;
}

.about-section::before {
  content: "";
  position: absolute;
  top: 50%;
  left: -10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(31, 159, 216, 0.05) 0%,
    transparent 70%
  );
  pointer-events: none;
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

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.about-paragraph {
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-md);
}

/* Animated Stats */
.about-stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
}

.stat-item {
  text-align: center;
  padding: var(--space-md) var(--space-lg);
  background: rgba(31, 159, 216, 0.05);
  border: 1px solid rgba(31, 159, 216, 0.12);
  border-radius: var(--radius-lg);
  min-width: 140px;
  flex: 1 1 140px;
  max-width: 200px;
  transition: all 400ms var(--ease-smooth);
}

.stat-item:hover {
  transform: translateY(-5px);
  border-color: rgba(31, 159, 216, 0.3);
  box-shadow: 0 10px 30px rgba(31, 159, 216, 0.15);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
  animation: float 3s ease-in-out infinite;
}

.stat-item:nth-child(2) .stat-icon {
  animation-delay: 0.5s;
}

.stat-item:nth-child(3) .stat-icon {
  animation-delay: 1s;
}

.stat-number {
  display: block;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-xs);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat-plus {
  color: var(--color-primary-light);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Contact Section */
.contact-section {
  background: var(--color-bg-dark);
}

/* Contact Direct Hub */
.contact-hub-wrapper {
  max-width: 680px;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.contact-heading {
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
  text-align: center;
}

.contact-text {
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 1.75rem;
  font-size: 0.95rem;
  text-align: center;
  max-width: 580px;
  margin-left: auto;
  margin-right: auto;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contact-quick-actions {
  display: flex;
  gap: 12px;
  margin-top: 1.75rem;
  flex-wrap: wrap;
}

.quick-action-btn {
  flex: 1;
  min-width: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 13px 20px;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.25s ease;
}

.quick-btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.quick-action-wa {
  background: #25D366;
  border-color: #25D366;
  color: #ffffff;
}

.quick-action-wa:hover {
  background: #20BA5A;
  border-color: #20BA5A;
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
  transform: translateY(-2px);
}

.quick-action-mail:hover {
  transform: translateY(-2px);
}

/* Scroll animation states - Always visible to guarantee NO blank text on fast scroll */
.scroll-animate {
  opacity: 1;
  transform: none;
}

.scroll-animate.is-visible {
  opacity: 1;
  transform: none;
}

.delay-200 {
  transition-delay: 60ms;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive - Mobile Small (320px-374px) */
@media (max-width: 374px) {
  .about-stats {
    flex-direction: column;
    gap: var(--space-md);
  }

  .stat-card {
    padding: var(--space-md);
  }

  .stat-value {
    font-size: var(--font-size-xl);
  }

  .stat-label {
    font-size: var(--font-size-xs);
  }

  .section-title {
    font-size: 1.25rem;
  }

  .section-subtitle {
    font-size: var(--font-size-sm);
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    width: 100%;
    max-width: 100%;
  }

  .contact-info {
    padding-right: 0;
    text-align: left;
  }

  .contact-card {
    padding: 10px 12px;
    gap: 10px;
  }

  .contact-card-icon {
    width: 36px;
    height: 36px;
  }

  .contact-card-val {
    font-size: 12px;
  }

  .contact-card-action {
    display: none;
  }

  .contact-form-wrapper {
    padding: 16px 12px;
    border-radius: var(--radius-lg);
  }

  .form-input,
  .form-textarea {
    padding: 10px 12px;
    font-size: 16px !important;
  }

  .btn-wa-quick {
    font-size: 13px;
    padding: 10px 12px;
  }
}

/* Responsive - Mobile (375px-639px) */
@media (min-width: 375px) and (max-width: 639px) {
  .about-stats {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
  }

  .stat-item {
    min-width: 0 !important;
    max-width: none !important;
    padding: 14px 10px !important;
  }

  .stat-icon {
    font-size: 1.6rem !important;
    margin-bottom: 4px !important;
  }

  .stat-number {
    font-size: 1.7rem !important;
  }

  .stat-label {
    font-size: 11px !important;
    line-height: 1.3 !important;
  }

  .contact-hub-wrapper {
    padding: 20px 14px;
    border-radius: var(--radius-lg);
  }

  .contact-quick-actions {
    flex-direction: column;
  }

  .quick-action-btn {
    width: 100%;
    min-width: 0;
  }
}

/* Responsive - Tablet (640px-1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  .about-stats {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .stat-card {
    flex: 1 1 150px;
    max-width: 200px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }

  .contact-info {
    text-align: center;
    padding-right: 0;
  }

  .contact-items {
    align-items: center;
  }
}

/* Responsive - Desktop (1024px+) */
@media (min-width: 1024px) {
  .about-stats {
    flex-direction: row;
    gap: var(--space-xl);
  }

  .contact-grid {
    grid-template-columns: 1fr 1fr;
  }

  .contact-info {
    text-align: left;
    padding-right: var(--space-xl);
  }
}
</style>
