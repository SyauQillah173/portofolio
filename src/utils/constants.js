/**
 * Constants
 * =========
 * Application-wide constants for configuration and settings.
 */

/**
 * Navigation links
 */
/**
 * Navigation links
 */
export const NAV_LINKS = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "Tentang", href: "#about" },
  { id: "experience", label: "Pengalaman", href: "#experience" },
  { id: "skills", label: "Keahlian", href: "#skills" },
  { id: "portfolio", label: "Portofolio", href: "#portfolio" },
  { id: "contact", label: "Kontak", href: "#contact" },
];

/**
 * Typing text roles for hero section
 */
export const TYPING_ROLES = [
  "Full-Stack Web Developer",
  "Commercial Drone Pilot (DJI)",
  "Network & IT Infrastructure Support",
  "Commercial Videographer",
];

/**
 * Animation settings
 */
export const ANIMATION = {
  // Typing animation
  typeSpeed: 45, // ms per character
  deleteSpeed: 25, // ms per character
  pauseDuration: 2000, // ms between texts

  // Falling stars
  starCount: 35,
  starMinSize: 1,
  starMaxSize: 3,
  starMinSpeed: 0.2,
  starMaxSpeed: 0.5,

  // Scroll animations
  scrollThreshold: 0.15,
  staggerDelay: 100, // ms between staggered items
};

/**
 * Breakpoints (in pixels)
 */
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
};

/**
 * Profile information
 */
export const PROFILE = {
  name: "Abdullah Syauqillah",
  title: "Web Developer | Network Support | Commercial Videographer",
  greeting: "Halo, saya",
  bio: "Lulusan S1 Teknik Informatika dengan keahlian hybrid di bidang Software Development, IT Infrastructure, dan Multimedia. Berpengalaman merancang Sistem Informasi Pesantren terintegrasi skala besar, mengelola jaringan Fiber Optic/LAN, serta memproduksi video komersial dan aerial drone untuk perusahaan nasional (Pertamina, Bulog) dan instansi pemerintah.",
  avatar: "/images/profile.jpg",
  resume: "/resume.pdf",
  whatsapp: "628155936131",
  whatsappUrl: "https://wa.me/628155936131?text=Halo%20Mas%20Syauqillah,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berkolaborasi",
};

/**
 * Section IDs for navigation
 */
export const SECTIONS = {
  home: "home",
  about: "about",
  experience: "experience",
  skills: "skills",
  portfolio: "portfolio",
  contact: "contact",
};

/**
 * Contact information
 */
export const CONTACT_INFO = {
  email: "abdullahsyauqillah01@gmail.com",
  location: "Jl. Masjid Jami' Kyai Gede, Bungah, Gresik, Jawa Timur",
  phone: "+62 815 5936 131",
  whatsapp: "https://wa.me/628155936131?text=Halo%20Mas%20Syauqillah,%20saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berkolaborasi",
};

/**
 * Social icons SVG paths
 * These are simplified path data for common social icons
 */
export const SOCIAL_ICONS = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  github:
    "M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  youtube:
    "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  behance:
    "M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z",
  twitter:
    "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  email:
    "M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z",
};

export default {
  NAV_LINKS,
  TYPING_ROLES,
  ANIMATION,
  BREAKPOINTS,
  PROFILE,
  SECTIONS,
  CONTACT_INFO,
  SOCIAL_ICONS,
};
