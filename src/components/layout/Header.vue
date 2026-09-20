<template>
  <header
    :class="[
      'header',
      { 'header-scrolled': isScrolled, 'header-hidden': isHidden },
    ]"
    role="banner"
  >
    <div class="header-container container">
      <!-- Logo -->
      <a
        href="#home"
        class="header-logo"
        @click.prevent="scrollToSection('home')"
      >
        <span class="logo-text">Portfolio</span>
        <span class="logo-accent">.</span>
      </a>

      <!-- Desktop Navigation -->
      <nav
        class="header-nav hide-mobile"
        role="navigation"
        aria-label="Main navigation"
      >
        <ul class="nav-list">
          <li v-for="link in navLinks" :key="link.id" class="nav-item">
            <a
              :href="link.href"
              :class="[
                'nav-link',
                { 'nav-link-active': activeSection === link.id },
              ]"
              @click.prevent="scrollToSection(link.id)"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- CTA Button (Desktop) -->
      <div class="header-cta hide-mobile">
        <a
          href="#contact"
          class="btn btn-primary btn-sm"
          @click.prevent="scrollToSection('contact')"
        >
          Hubungi Saya
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="mobile-menu-btn show-mobile-only"
        :class="{ 'is-active': isMobileMenuOpen }"
        @click.stop="toggleMobileMenu"
        :aria-expanded="isMobileMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        type="button"
      >
        <span class="menu-icon">
          <span class="menu-line"></span>
          <span class="menu-line"></span>
          <span class="menu-line"></span>
        </span>
      </button>
    </div>
  </header>

  <!-- Mobile Navigation - Teleported to body for proper z-index -->
  <Teleport to="body">
    <Transition name="slide-down">
      <div
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        class="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        @click.self="closeMobileMenu"
      >
        <nav class="mobile-nav">
          <ul class="mobile-nav-list">
            <li v-for="link in navLinks" :key="link.id" class="mobile-nav-item">
              <a
                :href="link.href"
                :class="[
                  'mobile-nav-link',
                  { 'mobile-nav-link-active': activeSection === link.id },
                ]"
                @click.prevent="handleMobileNavClick(link.id)"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>

          <div class="mobile-nav-cta">
            <a
              href="#contact"
              class="btn btn-primary btn-full"
              @click.prevent="handleMobileNavClick('contact')"
            >
              Hubungi Saya
            </a>
          </div>
        </nav>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * Header Component
 * =================
 * Sticky navigation bar with smooth scroll, active section detection,
 * and responsive hamburger menu for mobile.
 */

import { NAV_LINKS } from "@/utils/constants";
import { scrollToElement, throttle } from "@/utils/helpers";
import { onMounted, onUnmounted, ref } from "vue";

// Nav links from constants
const navLinks = NAV_LINKS;

// Reactive state
const isScrolled = ref(false);
const isHidden = ref(false);
const isMobileMenuOpen = ref(false);
const activeSection = ref("home");

// Internal state for scroll direction detection
let lastScrollY = 0;
const scrollThreshold = 50;

/**
 * Handle scroll events
 * - Adds background when scrolled
 * - Hides header when scrolling down
 * - Detects active section
 */
const handleScroll = throttle(() => {
  const currentScrollY = window.scrollY;

  // Check if scrolled past threshold (for background change)
  isScrolled.value = currentScrollY > scrollThreshold;

  // Keep header always visible - don't hide on scroll
  // This ensures hamburger menu is always accessible
  isHidden.value = false;

  lastScrollY = currentScrollY;

  // Detect active section
  detectActiveSection();
}, 100);

/**
 * Detect which section is currently in view
 */
const detectActiveSection = () => {
  const sections = navLinks.map((link) => document.getElementById(link.id));
  const headerHeight = 80;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= headerHeight + 100) {
        activeSection.value = navLinks[i].id;
        break;
      }
    }
  }
};

/**
 * Scroll to a section
 */
const scrollToSection = (sectionId) => {
  scrollToElement(sectionId, 70);
  activeSection.value = sectionId;
};

/**
 * Toggle mobile menu
 */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  console.log("Menu toggled:", isMobileMenuOpen.value);
};

/**
 * Close mobile menu
 */
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  console.log("Menu closed");
};

/**
 * Handle mobile nav click
 */
const handleMobileNavClick = (sectionId) => {
  console.log("Nav clicked:", sectionId);
  isMobileMenuOpen.value = false;
  setTimeout(() => {
    scrollToSection(sectionId);
  }, 150);
};

/**
 * Close mobile menu on escape key
 */
const handleKeydown = (event) => {
  if (event.key === "Escape" && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

/**
 * Close mobile menu on window resize (when switching to desktop)
 */
const handleResize = () => {
  if (window.innerWidth > 768 && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// Lifecycle
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);
  handleScroll(); // Initial check
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", handleResize);
  // Cleanup body styles
  document.body.style.overflow = "";
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  height: var(--header-height);
  background: transparent;
  transition: all var(--transition-normal);
}

.header-scrolled {
  background: rgba(10, 14, 39, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.header-hidden {
  transform: translateY(-100%);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* Logo */
.header-logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: color var(--transition-fast);
}

.header-logo:hover {
  color: var(--color-primary);
}

.logo-text {
  letter-spacing: -0.02em;
}

.logo-accent {
  color: var(--color-primary);
  font-size: 1.5em;
  line-height: 1;
}

/* Desktop Navigation */
.header-nav {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: block;
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--color-text-light);
  background: rgba(255, 255, 255, 0.05);
}

.nav-link-active {
  color: var(--color-primary);
}

.nav-link-active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}

/* CTA Button */
.header-cta {
  margin-left: var(--space-md);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  padding: 0;
  z-index: 9999;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  pointer-events: auto !important;
}

.menu-icon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  gap: 5px;
}

.menu-line {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text-light);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  transform-origin: center;
}

.mobile-menu-btn.is-active .menu-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.mobile-menu-btn.is-active .menu-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.mobile-menu-btn.is-active .menu-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.mobile-menu-btn:active {
  background: rgba(31, 159, 216, 0.2);
  transform: scale(0.95);
}

.mobile-menu-btn.is-active {
  background: rgba(31, 159, 216, 0.15);
  border-color: var(--color-primary);
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: var(--header-height);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: var(--z-fixed);
  overflow-y: auto;
}

.mobile-nav {
  padding: var(--space-xl) var(--space-md);
}

.mobile-nav-list {
  list-style: none;
  margin: 0 0 var(--space-xl);
  padding: 0;
}

.mobile-nav-item {
  margin-bottom: var(--space-xs);
}

.mobile-nav-link {
  display: block;
  padding: var(--space-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-align: center;
}

.mobile-nav-link:hover,
.mobile-nav-link-active {
  color: var(--color-text-light);
  background: rgba(31, 159, 216, 0.1);
}

.mobile-nav-link-active {
  color: var(--color-primary);
}

.mobile-nav-cta {
  padding-top: var(--space-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-normal);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive utilities */
.hide-mobile {
  display: flex;
}

.show-mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .hide-mobile {
    display: none !important;
  }

  .show-mobile-only {
    display: flex !important;
  }
}
</style>

<!-- Global styles for teleported mobile menu -->
<style>
.mobile-menu {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 9998;
  overflow-y: auto;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100%;
}

.mobile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.mobile-nav-item {
  margin-bottom: 0.5rem;
}

.mobile-nav-link {
  display: block;
  padding: 1rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link-active {
  background: rgba(31, 159, 216, 0.1);
  color: #1f9fd8;
}

.mobile-nav-cta {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.mobile-nav-cta .btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  justify-content: center;
}

/* Slide down transition for mobile menu */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
