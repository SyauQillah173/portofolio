<template>
  <footer class="footer" role="contentinfo">
    <div class="footer-container container">
      <!-- Main Footer Content -->
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-brand">
          <a href="#home" class="footer-logo" @click.prevent="scrollToTop">
            <span class="logo-text">Portofolio</span>
            <span class="logo-accent">.</span>
          </a>
          <p class="footer-tagline">
            Creative Developer yang passionate dalam membuat pengalaman digital
            yang luar biasa.
          </p>

          <!-- Social Links -->
          <div class="footer-social">
            <a
              v-for="social in socialLinks"
              :key="social.id"
              :href="social.url"
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Follow on ${social.name}`"
            >
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path :d="getSocialIcon(social.icon)" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-links">
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-nav">
            <li v-for="link in navLinks" :key="link.id">
              <a
                :href="link.href"
                class="footer-nav-link"
                @click.prevent="scrollToSection(link.id)"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="footer-contact">
          <h4 class="footer-heading">Kontak</h4>
          <ul class="contact-list">
            <li class="contact-item">
              <span class="contact-icon">📧</span>
              <a :href="`mailto:${contactInfo.email}`" class="contact-link">
                {{ contactInfo.email }}
              </a>
            </li>
            <li class="contact-item">
              <span class="contact-icon">📍</span>
              <span class="contact-text">{{ contactInfo.location }}</span>
            </li>
            <li v-if="contactInfo.phone" class="contact-item">
              <span class="contact-icon">📱</span>
              <a :href="contactInfo.whatsapp || `tel:${contactInfo.phone}`" target="_blank" rel="noopener noreferrer" class="contact-link">
                {{ contactInfo.phone }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="footer-copyright">
          &copy; {{ currentYear }} Portfolio By Abdullah Syauqillah
          <span class="heart">❤️</span>
        </p>
        <div class="footer-bottom-links">
          <span class="footer-tech">Built with Vue.js + Vite</span>
          <span class="footer-dot">•</span>
          <a href="#admin" class="footer-admin-link">
            <span>🔐 Portal Admin</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Back to Top Button -->
    <Transition name="fade">
      <button
        v-if="showBackToTop"
        class="back-to-top"
        @click="scrollToTop"
        aria-label="Back to top"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </Transition>
  </footer>
</template>

<script setup>
import socialData from "@/assets/data/social.json";
import { CONTACT_INFO, NAV_LINKS, SOCIAL_ICONS } from "@/utils/constants";
import { scrollToElement, throttle } from "@/utils/helpers";
import { onMounted, onUnmounted, ref } from "vue";

// Data
const socialLinks = socialData.social;
const navLinks = NAV_LINKS;
const contactInfo = CONTACT_INFO;
const currentYear = new Date().getFullYear();

// Refs
const showBackToTop = ref(false);

// Get SVG path for social icon
const getSocialIcon = (iconName) => {
  return SOCIAL_ICONS[iconName] || SOCIAL_ICONS.github;
};

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Scroll to section
const scrollToSection = (sectionId) => {
  scrollToElement(sectionId, 70);
};

// Handle scroll for back to top
const handleScroll = throttle(() => {
  showBackToTop.value = window.scrollY > 500;
}, 100);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.footer {
  background: linear-gradient(to bottom, var(--color-bg-dark), #050816);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: var(--space-3xl);
  padding-bottom: var(--space-xl);
  position: relative;
}

/* Container */
.footer-container {
  position: relative;
}

/* Content Grid */
.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-xl);
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--space-lg);
}

/* Brand */
.footer-brand {
  max-width: 320px;
}

.footer-logo {
  display: inline-flex;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  text-decoration: none;
  margin-bottom: var(--space-md);
  transition: color var(--transition-fast);
}

.footer-logo:hover {
  color: var(--color-primary);
}

.logo-accent {
  color: var(--color-primary);
  font-size: 1.5em;
}

.footer-tagline {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-lg);
}

/* Social Links */
.footer-social {
  display: flex;
  gap: var(--space-sm);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-3px);
}

.social-icon {
  width: 18px;
  height: 18px;
}

/* Heading */
.footer-heading {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
  margin-bottom: var(--space-md);
  position: relative;
  padding-bottom: var(--space-sm);
}

.footer-heading::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--color-primary);
}

/* Nav Links */
.footer-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-nav li {
  margin-bottom: var(--space-sm);
}

.footer-nav-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.footer-nav-link:hover {
  color: var(--color-primary);
}

/* Contact */
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.contact-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.contact-link:hover {
  color: var(--color-primary);
}

/* Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-copyright {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin: 0;
}

.heart {
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.footer-bottom-links {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.footer-dot {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.footer-admin-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-xs);
  transition: all var(--transition-fast);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.footer-admin-link:hover {
  color: var(--color-primary-light);
  background: rgba(31, 159, 216, 0.1);
}

/* Back to Top */
.back-to-top {
  position: fixed;
  right: var(--space-lg);
  bottom: var(--space-lg);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-full);
  color: var(--color-text-light);
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(31, 159, 216, 0.4);
  transition: all var(--transition-normal);
  z-index: 100;
}

.back-to-top:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(31, 159, 216, 0.5);
}

.back-to-top svg {
  width: 24px;
  height: 24px;
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

/* Responsive - Mobile */
@media (max-width: 639px) {
  .footer-wave-container {
    height: 50px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    text-align: center;
  }

  .footer-brand {
    max-width: none;
  }

  .footer-social {
    justify-content: center;
  }

  .footer-heading::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-bottom {
    flex-direction: column;
    gap: var(--space-sm);
    text-align: center;
  }

  .back-to-top {
    right: var(--space-md);
    bottom: var(--space-md);
    width: 44px;
    height: 44px;
  }
}

/* Responsive - Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  .footer-wave-container {
    height: 60px;
  }

  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-brand {
    grid-column: span 2;
    text-align: center;
    max-width: 500px;
    margin: 0 auto;
  }

  .footer-social {
    justify-content: center;
  }
}

/* Responsive - Desktop */
@media (min-width: 1024px) {
  .footer-wave-container {
    height: 80px;
  }

  .footer-content {
    grid-template-columns: 2fr 1fr 1fr;
  }
}
</style>
