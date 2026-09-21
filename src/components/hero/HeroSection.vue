<template>
  <section id="home" class="hero-section">
    <!-- Falling Stars Background -->
    <FallingStars class="hero-background" />

    <!-- Gradient Overlay -->
    <div class="hero-overlay"></div>

    <!-- Hero Content -->
    <div class="hero-content container">
      <div class="hero-inner">
        <!-- Profile Photo with Enhanced Animation -->
        <div class="hero-avatar animate-fade-in">
          <div class="avatar-wrapper">
            <!-- Orbiting particles -->
            <div class="orbit orbit-1">
              <span class="orbit-dot"></span>
            </div>
            <div class="orbit orbit-2">
              <span class="orbit-dot"></span>
            </div>
            <div class="orbit orbit-3">
              <span class="orbit-dot"></span>
            </div>

            <!-- Main ring -->
            <div class="avatar-ring"></div>

            <!-- Secondary pulse ring -->
            <div class="avatar-pulse-ring"></div>

            <!-- Profile image -->
            <img
              :src="profileImage"
              :alt="`Foto profil ${profile.name}`"
              class="avatar-image"
              loading="eager"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- Hero Text -->
        <div class="hero-text">
          <!-- Greeting -->
          <p class="hero-greeting animate-fade-in delay-200">
            {{ profile.greeting }}
          </p>

          <!-- Name -->
          <h1 class="hero-title animate-fade-in delay-300">
            {{ profile.name }}
          </h1>

          <!-- Typing Text / Roles -->
          <p class="hero-subtitle animate-fade-in delay-400">
            <TypingText :texts="fullRoles" />
          </p>

          <!-- Bio -->
          <p class="hero-bio animate-fade-in delay-500">
            {{ profile.bio }}
          </p>

          <!-- Social Icons -->
          <div class="hero-social animate-fade-in delay-600">
            <a
              v-for="social in socialLinks"
              :key="social.id"
              :href="social.url"
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Follow on ${social.name}`"
              :title="social.name"
            >
              <svg
                class="social-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path :d="getSocialIcon(social.icon)" />
              </svg>
            </a>
          </div>

          <!-- CTA Buttons -->
          <div class="hero-actions animate-fade-in delay-700">
            <a
              href="#portfolio"
              class="btn btn-primary btn-lg"
              @click.prevent="scrollToSection('portfolio')"
            >
              <span>Lihat Portofolio</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="btn-arrow"
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-secondary btn-lg btn-whatsapp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                class="btn-icon-left whatsapp-icon"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28z"/>
              </svg>
              <span>Chat WhatsApp</span>
            </a>

            <a
              :href="profile.resume"
              class="btn btn-ghost btn-lg"
              download
              target="_blank"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="btn-icon-left"
              >
                <path
                  d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                />
              </svg>
              <span>Download CV</span>
            </a>
          </div>

          <!-- Client & Partner Trust Badges -->
          <div class="hero-trust animate-fade-in delay-800">
            <span class="trust-label">Pernah Berkolaborasi & Menangani Klien:</span>
            <div class="trust-chips">
              <span
                v-for="client in displayClients"
                :key="client.id || client.name"
                class="trust-chip"
              >
                <span class="chip-dot"></span> {{ client.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator animate-fade-in delay-800">
        <a
          href="#skills"
          class="scroll-link"
          @click.prevent="scrollToSection('skills')"
          aria-label="Scroll to skills section"
        >
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * HeroSection Component
 * ======================
 * Main hero section with profile photo, typing text animation,
 * social links, and CTA buttons.
 */

import socialData from "@/assets/data/social.json";
import userPhoto from "@/assets/IMG/Fotoku.jpg";
import { PROFILE, SOCIAL_ICONS, TYPING_ROLES } from "@/utils/constants";
import { scrollToElement } from "@/utils/helpers";
import { usePortfolioStore } from "@/composables/usePortfolioStore";
import { computed, ref } from "vue";
import FallingStars from "./FallingStars.vue";
import TypingText from "./TypingText.vue";

// Reactive Store
const { profile, clients } = usePortfolioStore();

// Fallback clients
const fallbackClients = [
  { name: "Pertamina" },
  { name: "Perum BULOG" },
  { name: "BPPKAD Gresik" },
  { name: "PP Qomaruddin" },
  { name: "Raff Studio" },
];

const displayClients = computed(() => {
  if (clients.value && Array.isArray(clients.value) && clients.value.length > 0) {
    return clients.value;
  }
  return fallbackClients;
});

// Dynamic roles for typing animation
const roles = computed(() => {
  return (profile.value && profile.value.typingRoles && profile.value.typingRoles.length > 0)
    ? profile.value.typingRoles
    : TYPING_ROLES;
});

const fullRoles = computed(() => roles.value.map((role) => `Saya adalah seorang ${role}`));

// Social links from reactive profile or fallback
const socialLinks = computed(() => {
  return (profile.value && profile.value.social && profile.value.social.length > 0)
    ? profile.value.social
    : socialData.social;
});

// Profile image with user's photo fallback
const profileImage = computed(() => {
  return (profile.value && profile.value.avatar) ? profile.value.avatar : userPhoto;
});

// WhatsApp link
const whatsappUrl = computed(() => {
  if (profile.value && profile.value.whatsapp) {
    const cleanNum = profile.value.whatsapp.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}?text=Halo%20Mas%20Syauqillah,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berkolaborasi`;
  }
  return PROFILE.whatsappUrl;
});

/**
 * Handle profile image error - use placeholder
 */
const handleImageError = (e) => {
  e.target.src = userPhoto;
};

/**
 * Get SVG path for social icon
 */
const getSocialIcon = (iconName) => {
  return SOCIAL_ICONS[iconName] || SOCIAL_ICONS.github;
};

/**
 * Scroll to section
 */
const scrollToSection = (sectionId) => {
  scrollToElement(sectionId, 70);
};
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    var(--color-bg-dark) 0%,
    var(--color-bg-darker) 100%
  );
  padding: calc(var(--header-height) + 55px) 0 var(--space-3xl);
}

/* Background & Overlay */
.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    rgba(10, 14, 39, 0.3) 50%,
    rgba(10, 14, 39, 0.7) 100%
  );
  z-index: 1;
  pointer-events: none;
}

/* Content */
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-xl);
}

/* Avatar */
.hero-avatar {
  flex-shrink: 0;
  animation: floatAvatar 4s ease-in-out infinite;
  overflow: visible;
  position: relative;
  margin-top: 20px;
  margin-bottom: 25px;
}

@keyframes floatAvatar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.avatar-wrapper {
  position: relative;
  width: 230px;
  height: 230px;
  overflow: visible;
}

/* Outer glowing ring */
.avatar-ring {
  position: absolute;
  inset: -8px;
  border-radius: var(--radius-full);
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-accent),
    var(--color-primary-light),
    var(--color-primary)
  );
  background-size: 300% 300%;
  animation: gradientSpin 4s linear infinite, pulseRing 2s ease-in-out infinite;
  opacity: 0.9;
}

/* Inner animated ring */
.avatar-ring::before {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: var(--radius-full);
  background: var(--color-bg-dark);
}

/* Glow effect */
.avatar-ring::after {
  content: "";
  position: absolute;
  inset: -15px;
  border-radius: var(--radius-full);
  background: radial-gradient(
    circle,
    rgba(31, 159, 216, 0.4) 0%,
    transparent 70%
  );
  animation: glowPulse 3s ease-in-out infinite;
  z-index: -1;
}

@keyframes gradientSpin {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulseRing {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.avatar-image {
  position: absolute;
  inset: 4px;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border-radius: var(--radius-full);
  object-fit: cover;
  object-position: center 20%;
  border: 4px solid var(--color-bg-dark);
  box-shadow: 0 0 30px rgba(31, 159, 216, 0.3), 0 10px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.5s var(--ease-smooth),
    box-shadow 0.5s var(--ease-smooth);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  z-index: 2;
}

.avatar-wrapper:hover .avatar-image {
  transform: scale(1.05);
  box-shadow: 0 0 50px rgba(31, 159, 216, 0.5), 0 15px 50px rgba(0, 0, 0, 0.5);
}

/* Orbiting particles */
.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px dashed rgba(31, 159, 216, 0.3);
  pointer-events: none;
  z-index: 0;
}

.orbit-1 {
  width: 265px;
  height: 265px;
  margin-left: -132.5px;
  margin-top: -132.5px;
  animation: spin1 12s linear infinite !important;
  animation-play-state: running !important;
}

.orbit-2 {
  width: 295px;
  height: 295px;
  margin-left: -147.5px;
  margin-top: -147.5px;
  animation: spin2 18s linear infinite reverse !important;
  animation-play-state: running !important;
}

.orbit-3 {
  width: 325px;
  height: 325px;
  margin-left: -162.5px;
  margin-top: -162.5px;
  animation: spin3 24s linear infinite !important;
  animation-play-state: running !important;
}

.orbit-dot {
  position: absolute;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 20px var(--color-primary), 0 0 40px var(--color-primary);
}

.orbit-1 .orbit-dot {
  top: 0;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  background: #ffd700;
  box-shadow: 0 0 15px #ffd700, 0 0 30px #ffd700;
}

.orbit-2 .orbit-dot {
  top: 0;
  left: 50%;
  width: 10px;
  height: 10px;
  margin-left: -5px;
  margin-top: -5px;
  background: var(--color-primary);
  box-shadow: 0 0 15px var(--color-primary), 0 0 30px var(--color-primary);
}

.orbit-3 .orbit-dot {
  top: 0;
  left: 50%;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  margin-top: -3px;
  background: #ffffff;
  box-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff;
}

@keyframes spin1 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin2 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin3 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Secondary pulse ring */
.avatar-pulse-ring {
  position: absolute;
  inset: -20px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(31, 159, 216, 0.3);
  animation: pulseExpand 3s ease-out infinite;
  z-index: 0;
}

.avatar-pulse-ring::before {
  content: "";
  position: absolute;
  inset: -15px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(31, 159, 216, 0.2);
  animation: pulseExpand 3s ease-out infinite 1s;
}

.avatar-pulse-ring::after {
  content: "";
  position: absolute;
  inset: -30px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(31, 159, 216, 0.1);
  animation: pulseExpand 3s ease-out infinite 2s;
}

@keyframes pulseExpand {
  0% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* Text Content */
.hero-text {
  max-width: 600px;
}

.hero-greeting {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-sm);
  letter-spacing: 0.05em;
}

.hero-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
  line-height: var(--line-height-tight);
  background: linear-gradient(
    135deg,
    var(--color-text-light),
    var(--color-primary)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  line-height: 1.3;
}

.hero-bio {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-lg);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Social Links */
.hero-social {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  text-decoration: none;
}

.social-link:hover {
  color: var(--color-text-light);
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
}

.social-icon {
  width: 20px;
  height: 20px;
}

/* CTA Buttons */
.hero-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.btn-arrow {
  width: 20px;
  height: 20px;
  transition: transform var(--transition-fast);
}

.btn:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-icon-left {
  width: 20px;
  height: 20px;
  margin-right: var(--space-xs);
  transition: transform var(--transition-fast);
}

.btn:hover .btn-icon-left {
  transform: translateY(2px);
}

.btn-whatsapp {
  background: rgba(37, 211, 102, 0.15);
  color: #25D366;
  border-color: rgba(37, 211, 102, 0.35);
}

.btn-whatsapp:hover {
  background: #25D366;
  color: #ffffff;
  border-color: #25D366;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
}

.whatsapp-icon {
  width: 20px;
  height: 20px;
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-light);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Trust Badges */
.hero-trust {
  margin-top: var(--space-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.trust-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
  opacity: 0.8;
}

.trust-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
}

.trust-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: #E2E8F0;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.trust-chip:hover {
  background: rgba(31, 159, 216, 0.1);
  border-color: rgba(31, 159, 216, 0.3);
  color: var(--color-text-light);
  transform: translateY(-2px);
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 6px var(--color-primary);
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: var(--space-xl);
  left: 50%;
  transform: translateX(-50%);
}

.scroll-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.scroll-link:hover {
  color: var(--color-primary);
}

.scroll-wheel {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 8px;
  background: currentColor;
  border-radius: 2px;
  animation: scrollWheel 2s infinite;
}

@keyframes scrollWheel {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(12px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive - Mobile Small (320px) */
@media (max-width: 374px) {
  .hero-section {
    min-height: auto;
    padding: calc(var(--header-height) + 20px) 0 var(--space-xl);
  }

  .hero-avatar {
    margin-top: 5px;
    margin-bottom: 12px;
  }

  .avatar-wrapper {
    width: 140px;
    height: 140px;
  }

  .avatar-ring {
    inset: -5px;
  }

  .orbit-1 {
    width: 160px;
    height: 160px;
    margin-left: -80px;
    margin-top: -80px;
  }

  .orbit-2 {
    width: 180px;
    height: 180px;
    margin-left: -90px;
    margin-top: -90px;
  }

  .orbit-3 {
    width: 200px;
    height: 200px;
    margin-left: -100px;
    margin-top: -100px;
  }

  .hero-inner {
    gap: var(--space-md);
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
    min-height: 2rem;
  }

  .hero-bio {
    font-size: var(--font-size-sm);
    padding: 0 var(--space-xs);
  }

  .hero-social {
    gap: var(--space-xs);
  }

  .social-link {
    width: 36px;
    height: 36px;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
    gap: var(--space-sm);
  }

  .hero-actions .btn {
    width: 100%;
    justify-content: center;
    padding: 0.75rem 1rem;
    font-size: var(--font-size-sm);
  }

  .scroll-indicator {
    display: none;
  }
}

/* Responsive - Mobile Medium (375px - 639px) */
@media (min-width: 375px) and (max-width: 639px) {
  .hero-section {
    min-height: auto;
    padding: calc(var(--header-height) + 25px) 0 var(--space-2xl);
  }

  .hero-avatar {
    margin-top: 10px;
    margin-bottom: 15px;
  }

  .avatar-wrapper {
    width: 165px;
    height: 165px;
  }

  .orbit-1 {
    width: 190px;
    height: 190px;
    margin-left: -95px;
    margin-top: -95px;
  }

  .orbit-2 {
    width: 215px;
    height: 215px;
    margin-left: -107.5px;
    margin-top: -107.5px;
  }

  .orbit-3 {
    width: 240px;
    height: 240px;
    margin-left: -120px;
    margin-top: -120px;
  }

  .hero-inner {
    gap: var(--space-lg);
  }

  .hero-title {
    font-size: 1.85rem;
  }

  .hero-subtitle {
    font-size: var(--font-size-lg);
    min-height: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
    max-width: 290px;
    margin: 0 auto;
    gap: var(--space-sm);
  }

  .hero-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .scroll-indicator {
    display: none;
  }
}

/* Responsive - Tablet (640px - 1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
  .hero-section {
    min-height: 95vh;
    padding: calc(var(--header-height) + 40px) 0 var(--space-3xl);
  }

  .hero-avatar {
    margin-top: 15px;
    margin-bottom: 20px;
  }

  .avatar-wrapper {
    width: 200px;
    height: 200px;
  }

  .orbit-1 {
    width: 230px;
    height: 230px;
    margin-left: -115px;
    margin-top: -115px;
  }

  .orbit-2 {
    width: 260px;
    height: 260px;
    margin-left: -130px;
    margin-top: -130px;
  }

  .orbit-3 {
    width: 290px;
    height: 290px;
    margin-left: -145px;
    margin-top: -145px;
  }

  .hero-inner {
    gap: var(--space-xl);
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-xl);
  }

  .hero-actions {
    flex-direction: row;
    gap: var(--space-md);
  }

  .scroll-indicator {
    bottom: var(--space-lg);
  }
}

/* Responsive - Desktop (1024px+) */
@media (min-width: 1024px) {
  .hero-section {
    min-height: 100vh;
  }

  .avatar-wrapper {
    width: 230px;
    height: 230px;
  }

  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .hero-inner {
    gap: var(--space-xl);
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .avatar-wrapper {
    width: 250px;
    height: 250px;
  }

  .orbit-1 {
    width: 290px;
    height: 290px;
    margin-left: -145px;
    margin-top: -145px;
  }

  .orbit-2 {
    width: 325px;
    height: 325px;
    margin-left: -162.5px;
    margin-top: -162.5px;
  }

  .orbit-3 {
    width: 360px;
    height: 360px;
    margin-left: -180px;
    margin-top: -180px;
  }

  .hero-title {
    font-size: 3.5rem;
  }
}
</style>
