<template>
  <section id="experience" class="experience-section section">
    <div class="container">
      <!-- Section Header -->
      <div class="section-header scroll-animate">
        <span class="section-badge">Perjalanan Karier</span>
        <h2 class="section-title">
          Pengalaman & <span class="section-accent">Pendidikan</span>
        </h2>
        <p class="section-subtitle">
          Rekam jejak profesional dalam merancang sistem web, mengelola infrastruktur IT, dan produksi multimedia komersial
        </p>
      </div>

      <!-- Experience & Education Tabs -->
      <div class="exp-tabs scroll-animate">
        <button
          class="tab-btn"
          :class="{ 'tab-btn-active': activeTab === 'work' }"
          @click="activeTab = 'work'"
          type="button"
        >
          <span class="tab-icon">💼</span>
          <span>Pengalaman Kerja</span>
        </button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn-active': activeTab === 'education' }"
          @click="activeTab = 'education'"
          type="button"
        >
          <span class="tab-icon">🎓</span>
          <span>Pendidikan</span>
        </button>
      </div>

      <!-- Timeline Container -->
      <div class="timeline-wrapper">
        <!-- Work Timeline -->
        <div v-show="activeTab === 'work'" class="timeline">
          <div
            v-for="(item, index) in workExperiences"
            :key="item.id"
            class="timeline-item scroll-animate"
            :class="`delay-${(index + 1) * 100}`"
          >
            <!-- Timeline Marker -->
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-line"></div>
            </div>

            <!-- Timeline Content Card -->
            <div class="timeline-content">
              <div class="timeline-header">
                <div class="role-badge-group">
                  <span class="company-badge">{{ item.company }}</span>
                  <span class="period-badge">{{ item.period }}</span>
                </div>
                <h3 class="role-title">{{ item.role }}</h3>
                <p v-if="item.subtitle" class="role-subtitle">{{ item.subtitle }}</p>
              </div>

              <ul class="timeline-points">
                <li v-for="(point, pIdx) in item.points" :key="pIdx" class="point-item">
                  <span class="point-bullet">▹</span>
                  <span>{{ point }}</span>
                </li>
              </ul>

              <!-- Tech Tags -->
              <div v-if="item.tags" class="timeline-tags">
                <span v-for="tag in item.tags" :key="tag" class="tech-pill">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Education Timeline -->
        <div v-show="activeTab === 'education'" class="timeline">
          <div
            v-for="(edu, index) in educations"
            :key="edu.id"
            class="timeline-item scroll-animate"
            :class="`delay-${(index + 1) * 100}`"
          >
            <div class="timeline-marker">
              <div class="marker-dot marker-dot-edu"></div>
              <div class="marker-line"></div>
            </div>

            <div class="timeline-content">
              <div class="timeline-header">
                <div class="role-badge-group">
                  <span class="company-badge edu-badge">{{ edu.institution }}</span>
                  <span class="period-badge">{{ edu.period }}</span>
                  <span v-if="edu.gpa" class="gpa-badge">⭐ IPK {{ edu.gpa }}</span>
                </div>
                <h3 class="role-title">{{ edu.degree }}</h3>
                <p class="role-subtitle">{{ edu.major }}</p>
              </div>

              <p class="edu-desc">{{ edu.description }}</p>

              <div v-if="edu.skills" class="timeline-tags">
                <span v-for="skill in edu.skills" :key="skill" class="tech-pill">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * ExperienceSection Component
 * =============================
 * Interactive timeline presenting work history and education
 * tailored for Abdullah Syauqillah's hybrid technical and creative background.
 */

import { computed, onMounted, ref } from "vue";
import { useScrollAnimation } from "@/composables/useScrollAnimation";
import { usePortfolioStore } from "@/composables/usePortfolioStore";

const activeTab = ref("work");
const { experiences } = usePortfolioStore();

const workExperiences = computed(() => {
  return (experiences.value && Array.isArray(experiences.value.work) && experiences.value.work.length > 0)
    ? experiences.value.work
    : [
        {
          id: 1,
          company: "Pondok Pesantren Qomaruddin",
          period: "2024 – Sekarang",
          role: "Web Developer & IT Maintenance",
          subtitle: "Full-Stack Development & Infrastruktur Jaringan",
          points: [
            "Merancang alur proses bisnis dan membangun Sistem Informasi Pesantren terintegrasi (ppqomaruddin.itqom.net) secara mandiri dari tahap konsep hingga live production.",
            "Mengembangkan modul inti: Absensi Digital berbasis QR Code & Kartu Tanda Santri (KTS), Buku Induk/Master Data, Modul Keuangan (arus kas Pondok & Madin), serta Sistem Penerimaan Santri Baru (PSB).",
            "Melakukan maintenance sistem, debugging, dan penyelesaian error web secara berkala dan real-time.",
            "Bertanggung jawab atas instalasi hardware, pengecekan redaman Fiber Optic untuk sistem fingerprint, serta pemeliharaan jaringan LAN seluruh fasilitas."
          ],
          tags: ["Full-Stack Web", "Vue.js", "QR Code Scanner", "Fiber Optic", "LAN Switching", "Hardware Support"]
        },
        {
          id: 2,
          company: "Raff Studio & Independen",
          period: "2021 – Sekarang",
          role: "Freelance Commercial Drone Pilot & Videographer",
          subtitle: "Produksi Visual Komersial & BUMN",
          points: [
            "Dipercaya oleh Raff Studio sebagai Pilot Drone Komersial untuk mengeksekusi pengambilan footage udara (aerial cinematography) pada proyek video Company Profile perusahaan BUMN nasional, termasuk PT Pertamina dan Perum BULOG.",
            "Mengoperasikan drone DJI berstandar sinematik untuk pemetaan visual tata ruang, dokumentasi fasilitas industri, dan visual dinamis dengan resolusi 4K.",
            "Bertindak sebagai fotografer dan videografer utama untuk berbagai acara komersial dan privat, memastikan kestabilan komposisi dan pencahayaan optimal."
          ],
          tags: ["DJI Drone 4K", "Aerial Cinematography", "Company Profile BUMN", "DaVinci Resolve", "Adobe Premiere"]
        },
        {
          id: 3,
          company: "BPPKAD Kabupaten Gresik",
          period: "Durasi 3 Bulan",
          role: "Social Media Specialist (Magang)",
          subtitle: "Badan Pendapatan, Pengelolaan Keuangan dan Aset Daerah",
          points: [
            "Mengelola dan mengoptimalkan akun media sosial resmi instansi pemerintah untuk penyampaian informasi dan edukasi publik.",
            "Merancang kalender konten terstruktur, membuat materi desain visual informatif, serta mempublikasikan program kerja badan daerah secara profesional."
          ],
          tags: ["Social Media Strategy", "Infografis Publik", "Content Creation", "Graphic Design"]
        },
        {
          id: 4,
          company: "Pondok Pesantren Qomaruddin",
          period: "Durasi 3 Tahun",
          role: "Tim Media & Dokumentasi",
          subtitle: "Dokumentasi Visual & Manajemen Arsip",
          points: [
            "Bertanggung jawab penuh sebagai fotografer dan videografer utama dalam mendokumentasikan berbagai macam acara dan agenda akbar pesantren.",
            "Mengelola pengarsipan aset visual digital dan mendistribusikan materi konten untuk publikasi resmi serta media sosial."
          ],
          tags: ["Event Videography", "Live Documentation", "Asset Archiving", "Lighting & Composition"]
        }
      ];
});

const educations = computed(() => {
  return (experiences.value && Array.isArray(experiences.value.education) && experiences.value.education.length > 0)
    ? experiences.value.education
    : [
        {
          id: 1,
          institution: "Universitas Qomaruddin Gresik",
          period: "2020 – 2024",
          degree: "Sarjana Komputer (S.Kom) — S1 Teknik Informatika",
          major: "Fokus: Software Engineering, Database Systems, & Network Architecture",
          gpa: "3.50 / 4.00 (Sangat Memuaskan)",
          description: "Menyelesaikan studi dengan IPK 3.50 (Predikat Sangat Memuaskan). Berfokus pada rekayasa perangkat lunak web terintegrasi, arsitektur basis data, serta pemeliharaan infrastruktur jaringan LAN dan Fiber Optic.",
          skills: ["Software Engineering", "Web Systems", "Database Design", "Network Security", "Fiber Optic & LAN"]
        },
        {
          id: 2,
          institution: "SMK Assa'adah Bungah Gresik",
          period: "2017 – 2020",
          degree: "Sekolah Menengah Kejuruan (SMK)",
          major: "Kompetensi Keahlian Multimedia",
          description: "Membangun fondasi kuat dalam bidang desain komunikasi visual, perancangan grafis komputer, dan tata letak digital. Terbiasa mengoperasikan software CorelDRAW, Adobe Photoshop, dan Adobe Illustrator untuk berbagai kebutuhan materi visual.",
          skills: ["Adobe Photoshop", "Adobe Illustrator", "CorelDRAW", "Graphic Design", "Visual Branding"]
        }
      ];
});

// Scroll animations
const { observeAll } = useScrollAnimation({
  threshold: 0.1,
  staggerDelay: 100
});

onMounted(() => {
  setTimeout(() => {
    const elements = document.querySelectorAll(".experience-section .scroll-animate");
    observeAll(elements);
  }, 100);
});
</script>

<style scoped>
.experience-section {
  background: var(--color-bg-darker);
  position: relative;
  overflow: hidden;
}

.experience-section::before {
  content: "";
  position: absolute;
  top: 20%;
  right: -5%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(31, 159, 216, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
}

/* Section Header - Consistent Center Alignment */
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
  max-width: 650px;
  margin: 0 auto;
}

/* Tabs */
.exp-tabs {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: rgba(15, 23, 42, 0.6);
  color: var(--color-text-muted);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.tab-btn:hover {
  color: var(--color-text-light);
  border-color: rgba(31, 159, 216, 0.4);
  background: rgba(31, 159, 216, 0.08);
}

.tab-btn-active {
  color: var(--color-text-light);
  background: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(31, 159, 216, 0.35);
}

.tab-icon {
  font-size: 1.1em;
}

/* Timeline Layout */
.timeline-wrapper {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  position: relative;
}

.timeline-item {
  display: flex;
  gap: var(--space-lg);
  position: relative;
}

/* Marker */
.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
}

.marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 3px solid var(--color-bg-dark);
  box-shadow: 0 0 12px rgba(31, 159, 216, 0.7);
  z-index: 2;
  margin-top: 6px;
}

.marker-dot-edu {
  background: #10B981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.7);
}

.marker-line {
  flex: 1;
  width: 2px;
  background: linear-gradient(
    180deg,
    rgba(31, 159, 216, 0.4) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  margin-top: 4px;
}

.timeline-item:last-child .marker-line {
  display: none;
}

/* Content Card */
.timeline-content {
  flex: 1;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.timeline-content:hover {
  border-color: rgba(31, 159, 216, 0.35);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.timeline-header {
  margin-bottom: var(--space-md);
}

.role-badge-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.company-badge {
  display: inline-block;
  padding: 3px 12px;
  background: rgba(31, 159, 216, 0.15);
  color: var(--color-primary-light);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  letter-spacing: 0.03em;
}

.edu-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34D399;
}

.gpa-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 12px;
  background: rgba(245, 158, 11, 0.16);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #FBBF24;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  letter-spacing: 0.02em;
}

.period-badge {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.role-title {
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
  font-weight: var(--font-weight-bold);
  margin-top: var(--space-xs);
}

.role-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin-top: 2px;
}

.edu-desc {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-md);
}

/* Points */
.timeline-points {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-md) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.point-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

.point-bullet {
  color: var(--color-primary);
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Tech Pill Tags */
.timeline-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.tech-pill {
  font-size: var(--font-size-xs);
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #CBD5E1;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-normal);
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .timeline-item {
    gap: var(--space-sm);
  }

  .timeline-marker {
    width: 18px;
  }

  .marker-dot {
    width: 14px;
    height: 14px;
  }

  .timeline-content {
    padding: var(--space-md);
  }

  .role-title {
    font-size: var(--font-size-lg);
  }

  .point-item {
    font-size: var(--font-size-sm);
  }
}
</style>
