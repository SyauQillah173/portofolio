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

            <!-- Contact Grid -->
            <div class="contact-grid">
              <!-- Contact Info -->
              <div class="contact-info scroll-animate">
                <h3 class="contact-heading">Mari Berbincang</h3>
                <p class="contact-text">
                  Saya selalu terbuka untuk diskusi tentang project baru, ide
                  kreatif, atau kesempatan untuk menjadi bagian dari visi Anda.
                </p>

                <div class="contact-items">
                  <!-- Email Card -->
                  <!-- Email Card -->
                  <a
                    :href="`mailto:${profile.email || 'abdullahsyauqillah01@gmail.com'}`"
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
              </div>

              <!-- Contact Form -->
              <div class="contact-form-wrapper scroll-animate delay-200">
                <form class="contact-form" @submit.prevent="handleSubmit">
                  <div class="form-group">
                    <label for="name" class="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      id="name"
                      v-model="formData.name"
                      class="form-input"
                      placeholder="Masukkan nama Anda"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      v-model="formData.email"
                      class="form-input"
                      placeholder="Masukkan email Anda"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="message" class="form-label">Pesan</label>
                    <textarea
                      id="message"
                      v-model="formData.message"
                      class="form-textarea"
                      placeholder="Ceritakan tentang project Anda..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary btn-lg btn-full"
                    :disabled="isSubmitting"
                  >
                    <span v-if="!isSubmitting">Kirim Pesan</span>
                    <span v-else class="btn-loading-text">
                      <span class="spinner spinner-sm"></span>
                      Mengirim...
                    </span>
                  </button>

                  <a
                    href="https://wa.me/628155936131?text=Halo%20Mas%20Syauqillah,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berkolaborasi"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-secondary btn-lg btn-full btn-wa-quick"
                  >
                    <span>💬 Hubungi via WhatsApp</span>
                  </a>

                  <!-- Success Message -->
                  <Transition name="fade">
                    <div v-if="showSuccess" class="form-success">
                      ✓ Pesan berhasil dikirim! Saya akan segera menghubungi
                      Anda.
                    </div>
                  </Transition>
                </form>
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
const { isAuthenticated, profile, works, skills, experiences } = usePortfolioStore();
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

// Dynamic Stats Target Values computed in real-time from works, skills, and experiences
const dynamicStatsData = computed(() => {
  // Real-time project count from works in store
  const projectsCount = Math.max(works.value?.length || 0, 10);

  // Real-time skills count from skills in store
  const skillsCount = Math.max(skills.value?.length || 0, 12);

  // Real-time unique clients & partners from works + experience
  const clientsSet = new Set();
  (works.value || []).forEach((w) => {
    if (w.client && w.client.trim()) clientsSet.add(w.client.trim());
  });
  ((experiences.value && experiences.value.work) || []).forEach((e) => {
    if (e.company && e.company.trim()) clientsSet.add(e.company.trim());
  });
  const clientsCount = Math.max(clientsSet.size, 6);

  // Years of experience
  const yearsExp = 3;

  return [
    { icon: "💻", targetValue: projectsCount, label: "Proyek IT & Visual" },
    { icon: "⚡", targetValue: skillsCount, label: "Keahlian & Tools" },
    { icon: "🏢", targetValue: clientsCount, label: "Mitra & Klien" },
    { icon: "⏳", targetValue: yearsExp, label: "Tahun Pengalaman" },
  ];
});

// Stats data with animated values
const stats = reactive([
  { icon: "💻", value: 10, currentValue: 0, label: "Proyek IT & Visual" },
  { icon: "⚡", value: 12, currentValue: 0, label: "Keahlian & Tools" },
  { icon: "🏢", value: 6, currentValue: 0, label: "Mitra & Klien" },
  { icon: "⏳", value: 3, currentValue: 0, label: "Tahun Pengalaman" },
]);

// Ref for stats element
const statsRef = ref(null);
let hasAnimatedStats = false;
let isAnimatingStats = false;

/**
 * Animate counting for stats smoothly from 0 to target values
 */
const animateStats = () => {
  if (isAnimatingStats) return;
  isAnimatingStats = true;
  hasAnimatedStats = true;

  // Sync targets with latest real-time data
  dynamicStatsData.value.forEach((d, idx) => {
    if (stats[idx]) {
      stats[idx].value = d.targetValue;
      stats[idx].icon = d.icon;
      stats[idx].label = d.label;
    }
  });

  const duration = 1800; // 1.8s smooth count up
  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth easeOutCubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    stats.forEach((stat) => {
      stat.currentValue = Math.round(easeProgress * stat.value);
    });

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      stats.forEach((stat) => {
        stat.currentValue = stat.value;
      });
      isAnimatingStats = false;
    }
  };

  requestAnimationFrame(step);
};

// Re-sync stats whenever dynamic store data updates
watch(dynamicStatsData, (newStats) => {
  newStats.forEach((d, idx) => {
    if (stats[idx]) {
      stats[idx].value = d.targetValue;
      stats[idx].icon = d.icon;
      stats[idx].label = d.label;
      if (hasAnimatedStats && !isAnimatingStats) {
        stats[idx].currentValue = d.targetValue;
      }
    }
  });
}, { deep: true });

// Form data
const formData = ref({
  name: "",
  email: "",
  message: "",
});

// Form state
const isSubmitting = ref(false);
const showSuccess = ref(false);

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  isSubmitting.value = true;

  // Simulate form submission (replace with actual API call)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Show success message
  showSuccess.value = true;
  isSubmitting.value = false;

  // Reset form
  formData.value = {
    name: "",
    email: "",
    message: "",
  };

  // Hide success message after 5 seconds
  setTimeout(() => {
    showSuccess.value = false;
  }, 5000);
};

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

  // Setup intersection observer for stats animation
  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedStats) {
            animateStats();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 200px 0px" }
    );

    setTimeout(() => {
      const statsElement = document.querySelector(".about-stats");
      if (statsElement) {
        observer.observe(statsElement);
      }
    }, 80);
  }

  // Safety fallback: if not triggered yet after 800ms, start count-up automatically
  setTimeout(() => {
    if (!hasAnimatedStats) {
      animateStats();
    }
  }, 800);
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

.contact-grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: var(--space-xl);
  max-width: 1040px;
  margin: 0 auto;
  align-items: start;
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.contact-heading {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  margin-bottom: var(--space-sm);
}

.contact-text {
  color: var(--color-text-muted);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-lg);
  font-size: var(--font-size-base);
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Contact Cards (Mobile-friendly touch cards) */
.contact-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  text-decoration: none;
  transition: all var(--transition-fast);
  color: var(--color-text-light);
  box-sizing: border-box;
  width: 100%;
}

.contact-card:hover {
  transform: translateY(-2px);
  border-color: rgba(31, 159, 216, 0.4);
  background: rgba(15, 23, 42, 0.95);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(31, 159, 216, 0.12);
}

.contact-card-wa:hover {
  border-color: rgba(37, 211, 102, 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(37, 211, 102, 0.15);
}

.contact-card-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-primary);
}

.contact-card-icon svg {
  width: 20px;
  height: 20px;
}

.icon-wa {
  background: rgba(37, 211, 102, 0.15);
  border-color: rgba(37, 211, 102, 0.3);
  color: #25D366;
}

.icon-email {
  background: rgba(31, 159, 216, 0.15);
  border-color: rgba(31, 159, 216, 0.3);
  color: #1F9FD8;
}

.icon-loc {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.3);
  color: #F59E0B;
}

.contact-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-card-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.online-pill {
  font-size: 10px;
  font-weight: 600;
  color: #25D366;
  background: rgba(37, 211, 102, 0.12);
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.contact-card-val {
  font-size: 13.5px;
  font-weight: 600;
  color: #F1F5F9;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.4;
}

.contact-card-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  flex-shrink: 0;
  opacity: 0.8;
  transition: transform var(--transition-fast);
}

.contact-card:hover .contact-card-action {
  opacity: 1;
  transform: translateX(3px);
}

/* Contact Form */
.contact-form-wrapper {
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--space-md);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  color: var(--color-text-light);
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  outline: none;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(31, 159, 216, 0.2);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-text-muted);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.btn-loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.btn-wa-quick {
  margin-top: var(--space-md);
  background: rgba(37, 211, 102, 0.15);
  color: #25D366;
  border: 1px solid rgba(37, 211, 102, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-wa-quick:hover {
  background: #25D366;
  color: #ffffff;
  border-color: #25D366;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
}

.form-success {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-md);
  color: var(--color-success);
  text-align: center;
  font-size: var(--font-size-sm);
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

  .contact-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
    width: 100%;
    max-width: 100%;
  }

  .contact-info {
    padding-right: 0;
    text-align: left;
  }

  .contact-card {
    padding: 12px 14px;
  }

  .contact-card-action {
    display: none;
  }

  .contact-form-wrapper {
    padding: 20px 16px;
    border-radius: var(--radius-lg);
  }

  .form-input,
  .form-textarea {
    font-size: 16px !important;
    padding: 12px 14px;
  }

  .btn-wa-quick {
    font-size: 14px;
    padding: 12px 14px;
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
