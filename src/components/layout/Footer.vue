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
              <span class="contact-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <a :href="`mailto:${contactInfo.email}`" class="contact-link">
                {{ contactInfo.email }}
              </a>
            </li>
            <li class="contact-item">
              <span class="contact-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span class="contact-text">{{ contactInfo.location }}</span>
            </li>
            <li v-if="contactInfo.phone" class="contact-item">
              <span class="contact-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
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
          &copy; {{ currentYear }} Portofolio By Abdullah Syauqillah
        </p>
        <div class="footer-bottom-links">
          <a href="#admin" class="footer-admin-link">
            <span class="admin-lock-icon">🔒</span>
            <span>Portal Admin</span>
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
import { usePortfolioStore } from "@/composables/usePortfolioStore";
import { computed, onMounted, onUnmounted, ref } from "vue";

// Reactive CMS Store
const { profile } = usePortfolioStore();

const contactInfo = computed(() => ({
  email: (profile.value && profile.value.email) || CONTACT_INFO.email,
  location: (profile.value && profile.value.location) || CONTACT_INFO.location,
  phone: (profile.value && profile.value.phone) || CONTACT_INFO.phone,
  whatsapp: (profile.value && profile.value.whatsapp)
    ? `https://wa.me/${profile.value.whatsapp.replace(/\D/g, '')}`
    : CONTACT_INFO.whatsapp,
}));

const socialLinks = computed(() => {
  return (profile.value && profile.value.social && profile.value.social.length > 0)
    ? profile.value.social
    : socialData.social;
});

const navLinks = NAV_LINKS;
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
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.contact-icon-box {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-primary);
  transition: all var(--transition-fast);
}

.contact-icon-box svg {
  width: 17px;
  height: 17px;
}

.contact-item:hover .contact-icon-box {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.contact-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
  word-break: break-all;
}

.contact-link:hover {
  color: var(--color-primary);
}

.contact-text {
  color: var(--color-text-muted);
  line-height: 1.4;
}

/* Bottom */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-md);
}

.footer-copyright {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin: 0;
  letter-spacing: 0.2px;
}

.footer-bottom-links {
  display: flex;
  align-items: center;
}

.footer-admin-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-xs);
  font-weight: 500;
  transition: all var(--transition-fast);
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-admin-link:hover {
  color: var(--color-primary-light);
  background: rgba(31, 159, 216, 0.12);
  border-color: rgba(31, 159, 216, 0.3);
  transform: translateY(-1px);
}

.admin-lock-icon {
  font-size: 13px;
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
  .footer {
    padding-bottom: calc(var(--space-2xl) + 28px);
  }

  .footer-wave-container {
    height: 50px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
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

  .footer-contact {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .contact-list {
    width: 100%;
    max-width: 320px;
    align-items: flex-start;
  }

  .contact-item {
    text-align: left;
    width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }

  .footer-bottom-links {
    justify-content: center;
  }

  .back-to-top {
    right: 14px;
    bottom: 20px;
    width: 40px;
    height: 40px;
    background: rgba(31, 159, 216, 0.88);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  }

  .back-to-top svg {
    width: 20px;
    height: 20px;
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
