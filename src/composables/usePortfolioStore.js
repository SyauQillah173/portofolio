/**
 * usePortfolioStore Composable
 * =============================
 * Full CMS reactive store for portfolio works, profile, skills, experiences,
 * and secure multi-device admin authentication with Neon Serverless Postgres sync.
 */

import defaultSkillsData from "@/assets/data/skills.json";
import defaultWorksData from "@/assets/data/works.json";
import { computed, ref, watch } from "vue";

const STORAGE_KEYS = {
  WORKS: "syauqillah_portfolio_works_v3",
  PROFILE: "syauqillah_portfolio_profile_v3",
  SKILLS: "syauqillah_portfolio_skills_v3",
  EXPERIENCE: "syauqillah_portfolio_experience_v3",
  CLIENTS: "syauqillah_portfolio_clients_v3",
  AUTH: "syauqillah_admin_auth",
  PASSWORD: "syauqillah_admin_password",
};

// Default admin password
const DEFAULT_PASSWORD = "admin123";

// Default Clients & Partners Data
const DEFAULT_CLIENTS = [
  { id: 1, name: "Pertamina", category: "BUMN", icon: "🏢", description: "Proyek Video Company Profile Nasional" },
  { id: 2, name: "Perum BULOG", category: "BUMN", icon: "🌾", description: "Dokumentasi & Aerial Cinematography" },
  { id: 3, name: "BPPKAD Gresik", category: "Instansi Pemerintah", icon: "🏛️", description: "Publikasi Digital & IT Support" },
  { id: 4, name: "PP Qomaruddin", category: "Pendidikan & Pesantren", icon: "🕌", description: "Sistem Informasi & Infrastruktur IT" },
  { id: 5, name: "Raff Studio", category: "Creative Agency", icon: "🎬", description: "Kolaborasi Produksi Visual & Drone Pilot" },
];

// Default Profile Data
const DEFAULT_PROFILE = {
  name: "Abdullah Syauqillah",
  title: "Product-Minded Web Builder | UI/UX Designer & System Analyst",
  greeting: "Halo, saya",
  bio: "Praktisi teknologi dengan pendekatan hybrid: memadukan perancangan proses bisnis (System Analysis), desain antarmuka modern (Figma UI/UX), serta akselerasi modern AI-Augmented Development untuk mewujudkan sistem web terintegrasi yang solutif, tepat guna, dan siap pakai bagi institusi maupun bisnis.",
  avatar: "/images/profile.jpg",
  resume: "/resume.pdf",
  whatsapp: "628155936131",
  email: "abdullahsyauqillah01@gmail.com",
  location: "Jl. Masjid Jami' Kyai Gede, Bungah, Gresik, Jawa Timur",
  phone: "+62 815 5936 131",
  aboutParagraphs: [
    "Saya berfokus pada pembangunan produk digital yang berorientasi pada solusi nyata. Kekuatan utama saya terletak pada kemampuan menerjemahkan kebutuhan operasional yang kompleks menjadi arsitektur proses bisnis yang rapi, merancangnya menjadi desain antarmuka intuitif di Figma, dan mengeksekusinya menjadi aplikasi web fungsional menggunakan metode modern AI-Assisted Engineering.",
    "Salah satu implementasi nyata adalah Sistem Informasi Pesantren terintegrasi yang mencakup modul Absensi QR Code, tata kelola keuangan kas multi-lembaga, dan pendataan santri secara mandiri. Di samping pengembangan web, saya juga berpengalaman dalam pemeliharaan infrastruktur jaringan (Fiber Optic/LAN) serta produksi multimedia sinematik komersial."
  ],
  stats: [
    { label: "Tahun Pengalaman", targetValue: 3, icon: "⚡" },
    { label: "Proyek Selesai", targetValue: 25, icon: "🎯" },
    { label: "Klien & Mitra", targetValue: 12, icon: "🤝" },
    { label: "Kepuasan Klien", targetValue: 99, icon: "⭐" }
  ],
  typingRoles: [
    "Product-Minded Web Builder",
    "UI/UX & Figma Designer",
    "AI-Augmented Developer",
    "Commercial Drone Pilot (DJI)",
    "Network & IT Infrastructure Support"
  ],
  social: [
    { id: "linkedin", name: "LinkedIn", url: "https://www.linkedin.com/in/abdullah-syauqillah-8a7199248/", icon: "linkedin" },
    { id: "github", name: "GitHub", url: "https://github.com/SyauQillah173", icon: "github" },
    { id: "instagram", name: "Instagram", url: "https://www.instagram.com/syauqillah173", icon: "instagram" },
    { id: "youtube", name: "YouTube", url: "https://youtube.com/@syauqillah", icon: "youtube" }
  ]
};

// Default Experience Data
const DEFAULT_EXPERIENCE = {
  work: [
    {
      id: 1,
      company: "Pondok Pesantren Qomaruddin",
      period: "2024 – Sekarang",
      role: "Product Architect & UI/UX Web Builder",
      subtitle: "System Analysis, Figma UI/UX & AI-Assisted Web Engineering",
      points: [
        "Merancang alur proses bisnis operasional dan mendesain antarmuka UI/UX di Figma secara mandiri dari tahap konsep awal hingga implementasi Sistem Informasi Pesantren terintegrasi (ppqomaruddin.itqom.net).",
        "Membangun modul inti: Absensi Digital berbasis QR Code & Kartu Tanda Santri (KTS), Buku Induk/Master Data, Modul Keuangan (arus kas Pondok & Madin), serta Sistem Penerimaan Santri Baru (PSB) dengan pendekatan rapid AI-assisted development.",
        "Melakukan pemeliharaan sistem, monitoring database, dan penyelesaian issue teknis secara berkala untuk menjaga stabilitas operasional pesantren.",
        "Mengelola infrastruktur IT: instalasi hardware, pengecekan redaman Fiber Optic untuk sistem fingerprint, serta pemeliharaan jaringan LAN seluruh fasilitas pondok."
      ],
      tags: ["System Analysis", "Figma UI/UX", "AI-Assisted Dev", "Vue.js", "QR Code Scanner", "Fiber Optic", "LAN Infrastructure"]
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
      period: "2024",
      role: "Creative Media & IT Support Intern",
      subtitle: "Publikasi Digital & Optimalisasi Pajak Daerah",
      points: [
        "Membantu pengelolaan dan publikasi materi informasi publik terkait program pajak daerah, transparansi fiskal, dan layanan masyarakat melalui konten visual interaktif.",
        "Mendukung kebutuhan pemeliharaan teknis perangkat lunak dan jaringan kantor sehari-hari."
      ],
      tags: ["Public Service IT", "Content Production", "Visual Communication", "Technical Support"]
    }
  ],
  education: [
    {
      id: 1,
      institution: "Universitas Qomaruddin Gresik",
      period: "2020 – 2024",
      degree: "Sarjana Komputer (S.Kom) — S1 Teknik Informatika",
      major: "Fokus: Software Engineering, Database Systems, & Network Architecture",
      description: "Menyelesaikan studi dengan predikat memuaskan, fokus pada rekayasa perangkat lunak web terintegrasi dan optimasi infrastruktur jaringan kampus/pesantren.",
      skills: ["Software Engineering", "Web Systems", "Database Design", "Network Security", "Algorithms"]
    }
  ]
};

// Shared reactive state across components
const works = ref([]);
const categories = ref(defaultWorksData.categories || []);
const profile = ref(DEFAULT_PROFILE);
const skills = ref(defaultSkillsData.skills || []);
const experiences = ref(DEFAULT_EXPERIENCE);
const clients = ref(DEFAULT_CLIENTS);

const isAuthenticated = ref(false);
const isInitialized = ref(false);
const isNeonConnected = ref(false);
const isSyncing = ref(false);

/**
 * Fetch latest works and CMS settings from Neon Postgres
 * @param {boolean} force - If true, always overwrites local state with fresh data from Neon
 */
async function fetchFromNeonDatabase(force = false) {
  try {
    const timestamp = Date.now();

    // 1. Fetch works with cache-busting
    const worksRes = await fetch(`/api/works?t=${timestamp}`, { cache: 'no-store' });
    if (worksRes.ok) {
      const data = await worksRes.json();
      if (data && data.connected) {
        isNeonConnected.value = true;
        if (Array.isArray(data.works) && data.works.length > 0) {
          const remoteWorks = data.works
            .map(w => ({ ...w, id: Number(w.id) }))
            .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
          
          if (force) {
            works.value = remoteWorks;
            saveToStorage(STORAGE_KEYS.WORKS, works.value);
          } else {
            const localCustomImagesCount = works.value.filter(w => typeof w.image === 'string' && w.image.startsWith('data:image/')).length;
            const remoteCustomImagesCount = remoteWorks.filter(w => typeof w.image === 'string' && w.image.startsWith('data:image/')).length;

            // Only auto-push if local has custom images and cloud is completely uninitialized (0 custom images)
            if (localCustomImagesCount > 0 && remoteCustomImagesCount === 0) {
              console.log(`Detected ${localCustomImagesCount} local custom images vs ${remoteCustomImagesCount} in Neon. Initial cloud seeding...`);
              await syncAllToNeon();
            } else {
              works.value = remoteWorks;
              saveToStorage(STORAGE_KEYS.WORKS, works.value);
            }
          }
        } else if (Array.isArray(data.works) && data.works.length === 0) {
          await syncAllToNeon();
        }
      }
    }

    // 2. Fetch CMS settings (Profile, Skills, Experiences) with cache-busting
    const cmsRes = await fetch(`/api/cms?t=${timestamp}`, { cache: 'no-store' });
    if (cmsRes.ok) {
      const cmsData = await cmsRes.json();
      if (cmsData && cmsData.connected && cmsData.settings) {
        isNeonConnected.value = true;
        if (cmsData.settings.profile) {
          profile.value = { ...DEFAULT_PROFILE, ...cmsData.settings.profile };
          saveToStorage(STORAGE_KEYS.PROFILE, profile.value);
        }
        if (cmsData.settings.skills && Array.isArray(cmsData.settings.skills) && cmsData.settings.skills.length > 0) {
          skills.value = cmsData.settings.skills.map(s => ({ ...s, id: Number(s.id) || s.id }));
          saveToStorage(STORAGE_KEYS.SKILLS, skills.value);
        }
        if (cmsData.settings.experiences) {
          experiences.value = { ...DEFAULT_EXPERIENCE, ...cmsData.settings.experiences };
          saveToStorage(STORAGE_KEYS.EXPERIENCE, experiences.value);
        }
        if (cmsData.settings.clients && Array.isArray(cmsData.settings.clients) && cmsData.settings.clients.length > 0) {
          clients.value = cmsData.settings.clients.map(c => ({ ...c, id: Number(c.id) || c.id }));
          saveToStorage(STORAGE_KEYS.CLIENTS, clients.value);
        }
      }
    }
  } catch (err) {
    console.warn('Neon cloud sync fallback to local cache:', err.message);
  }
}

async function syncAllToNeon() {
  if (isSyncing.value) return;
  isSyncing.value = true;
  try {
    if (works.value.length > 0) {
      // Use single-request batch sync endpoint
      await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_all',
          works: works.value,
        }),
      });
    }
    await syncCmsSectionToNeon('profile', profile.value);
    await syncCmsSectionToNeon('skills', skills.value);
    await syncCmsSectionToNeon('experiences', experiences.value);
    await syncCmsSectionToNeon('clients', clients.value);
    isNeonConnected.value = true;
    console.log('✓ All portfolio works & CMS synchronized with Neon Postgres!');
    return { success: true, count: works.value.length };
  } catch (e) {
    console.warn('Error syncing works to Neon:', e);
    throw e;
  } finally {
    isSyncing.value = false;
  }
}

/**
 * Sync CMS section to Neon Database
 */
async function syncCmsSectionToNeon(key, value) {
  try {
    await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    isNeonConnected.value = true;
  } catch (e) {
    console.warn(`Error syncing ${key} to Neon:`, e.message);
  }
}

/**
 * Initialize store from localStorage or default JSON
 */
function initStore() {
  if (isInitialized.value) return;

  // 1. Load authentication
  try {
    const savedAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
    isAuthenticated.value = savedAuth === "true";
  } catch (e) {
    isAuthenticated.value = false;
  }

  // 2. Load works
  try {
    const storedWorks = localStorage.getItem(STORAGE_KEYS.WORKS);
    if (storedWorks) {
      works.value = JSON.parse(storedWorks);
    } else {
      works.value = JSON.parse(JSON.stringify(defaultWorksData.works));
      saveToStorage(STORAGE_KEYS.WORKS, works.value);
    }
  } catch (e) {
    works.value = JSON.parse(JSON.stringify(defaultWorksData.works));
  }

  // 3. Load profile
  try {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (storedProfile) {
      profile.value = { ...DEFAULT_PROFILE, ...JSON.parse(storedProfile) };
    } else {
      profile.value = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
      saveToStorage(STORAGE_KEYS.PROFILE, profile.value);
    }
  } catch (e) {
    profile.value = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }

  // 4. Load skills
  try {
    const storedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
    if (storedSkills) {
      skills.value = JSON.parse(storedSkills);
    } else {
      skills.value = JSON.parse(JSON.stringify(defaultSkillsData.skills));
      saveToStorage(STORAGE_KEYS.SKILLS, skills.value);
    }
  } catch (e) {
    skills.value = JSON.parse(JSON.stringify(defaultSkillsData.skills));
  }

  // 5. Load experiences
  try {
    const storedExp = localStorage.getItem(STORAGE_KEYS.EXPERIENCE);
    if (storedExp) {
      experiences.value = JSON.parse(storedExp);
    } else {
      experiences.value = JSON.parse(JSON.stringify(DEFAULT_EXPERIENCE));
      saveToStorage(STORAGE_KEYS.EXPERIENCE, experiences.value);
    }
  } catch (e) {
    experiences.value = JSON.parse(JSON.stringify(DEFAULT_EXPERIENCE));
  }

  // 6. Load clients
  try {
    const storedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (storedClients) {
      clients.value = JSON.parse(storedClients);
    } else {
      clients.value = JSON.parse(JSON.stringify(DEFAULT_CLIENTS));
      saveToStorage(STORAGE_KEYS.CLIENTS, clients.value);
    }
  } catch (e) {
    clients.value = JSON.parse(JSON.stringify(DEFAULT_CLIENTS));
  }

  isInitialized.value = true;

  // Background fetch from Neon
  fetchFromNeonDatabase();

  // Auto-sync when switching back to this browser tab (debounced to avoid race conditions with file pickers)
  if (typeof window !== "undefined") {
    let focusTimer = null;
    const triggerDebouncedSync = () => {
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => {
        fetchFromNeonDatabase(true);
      }, 600);
    };

    window.addEventListener("focus", triggerDebouncedSync);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        triggerDebouncedSync();
      }
    });
  }
}

/**
 * Storage helpers
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

function getStoredPassword() {
  try {
    return localStorage.getItem(STORAGE_KEYS.PASSWORD) || DEFAULT_PASSWORD;
  } catch (e) {
    return DEFAULT_PASSWORD;
  }
}

export function usePortfolioStore() {
  initStore();

  // Watchers for local persistence
  watch(works, (val) => saveToStorage(STORAGE_KEYS.WORKS, val), { deep: true });
  watch(profile, (val) => saveToStorage(STORAGE_KEYS.PROFILE, val), { deep: true });
  watch(skills, (val) => saveToStorage(STORAGE_KEYS.SKILLS, val), { deep: true });
  watch(experiences, (val) => saveToStorage(STORAGE_KEYS.EXPERIENCE, val), { deep: true });
  watch(clients, (val) => saveToStorage(STORAGE_KEYS.CLIENTS, val), { deep: true });

  /**
   * Login method: checks Neon cloud first, falls back to local
   */
  const login = async (passwordInput) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', password: passwordInput }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          isAuthenticated.value = true;
          sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
          return { success: true };
        } else {
          return { success: false, message: data.message || "Password salah!" };
        }
      }
    } catch (e) {
      console.warn('Auth offline check:', e.message);
    }

    // Local fallback check
    const validPassword = getStoredPassword();
    if (passwordInput === validPassword) {
      isAuthenticated.value = true;
      sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
      return { success: true };
    }
    return { success: false, message: "Password salah! Silakan coba lagi." };
  };

  /**
   * Logout
   */
  const logout = () => {
    isAuthenticated.value = false;
    try {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {}
  };

  /**
   * Change Password: syncs to Neon database
   */
  const changePassword = async (currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 5) {
      return { success: false, message: "Password baru minimal 5 karakter!" };
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change', currentPassword, newPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem(STORAGE_KEYS.PASSWORD, newPassword);
          return { success: true, message: data.message };
        } else {
          return { success: false, message: data.message };
        }
      }
    } catch (e) {
      console.warn('Neon changePassword error, fallback local:', e);
    }

    // Local fallback
    const validPassword = getStoredPassword();
    if (currentPassword !== validPassword) {
      return { success: false, message: "Password saat ini tidak cocok." };
    }
    localStorage.setItem(STORAGE_KEYS.PASSWORD, newPassword);
    return { success: true, message: "Password berhasil diperbarui secara lokal!" };
  };

  /**
   * PROFILE CMS Methods
   */
  const updateProfile = (updatedProfile) => {
    profile.value = {
      ...profile.value,
      ...updatedProfile,
    };
    saveToStorage(STORAGE_KEYS.PROFILE, profile.value);
    syncCmsSectionToNeon('profile', profile.value);
    return profile.value;
  };

  /**
   * SKILLS CMS Methods
   */
  const addSkill = (skillData) => {
    const nextId = skills.value.length > 0
      ? Math.max(...skills.value.map(s => Number(s.id) || 0)) + 1
      : 1;

    const newSkill = {
      id: nextId,
      name: skillData.name || "Keahlian Baru",
      category: skillData.category || "frontend",
      level: skillData.level || "Intermediate",
      icon: skillData.icon || "💻",
      color: skillData.color || "#1F9FD8",
      description: skillData.description || "",
    };

    skills.value.push(newSkill);
    saveToStorage(STORAGE_KEYS.SKILLS, skills.value);
    syncCmsSectionToNeon('skills', skills.value);
    return newSkill;
  };

  const updateSkill = (id, skillData) => {
    const index = skills.value.findIndex(s => String(s.id) === String(id));
    if (index === -1) return false;

    skills.value[index] = {
      ...skills.value[index],
      ...skillData,
      id: Number(id) || id,
    };
    saveToStorage(STORAGE_KEYS.SKILLS, skills.value);
    syncCmsSectionToNeon('skills', skills.value);
    return skills.value[index];
  };

  const deleteSkill = (id) => {
    const index = skills.value.findIndex(s => String(s.id) === String(id));
    if (index === -1) return false;
    skills.value.splice(index, 1);
    saveToStorage(STORAGE_KEYS.SKILLS, skills.value);
    syncCmsSectionToNeon('skills', skills.value);
    return true;
  };

  /**
   * EXPERIENCE CMS Methods
   */
  const addExperience = (type, itemData) => {
    if (!experiences.value[type]) experiences.value[type] = [];
    const list = experiences.value[type];
    const nextId = list.length > 0
      ? Math.max(...list.map(i => Number(i.id) || 0)) + 1
      : 1;

    const newItem = {
      ...itemData,
      id: nextId,
    };
    list.unshift(newItem);
    saveToStorage(STORAGE_KEYS.EXPERIENCE, experiences.value);
    syncCmsSectionToNeon('experiences', experiences.value);
    return newItem;
  };

  const updateExperience = (type, id, itemData) => {
    if (!experiences.value[type]) return false;
    const index = experiences.value[type].findIndex(i => String(i.id) === String(id));
    if (index === -1) return false;

    experiences.value[type][index] = {
      ...experiences.value[type][index],
      ...itemData,
      id: Number(id) || id,
    };
    saveToStorage(STORAGE_KEYS.EXPERIENCE, experiences.value);
    syncCmsSectionToNeon('experiences', experiences.value);
    return experiences.value[type][index];
  };

  const deleteExperience = (type, id) => {
    if (!experiences.value[type]) return false;
    const index = experiences.value[type].findIndex(i => String(i.id) === String(id));
    if (index === -1) return false;

    experiences.value[type].splice(index, 1);
    saveToStorage(STORAGE_KEYS.EXPERIENCE, experiences.value);
    syncCmsSectionToNeon('experiences', experiences.value);
    return true;
  };

  /**
   * CLIENTS & PARTNERS CMS Methods
   */
  const addClient = (clientData) => {
    const nextId = clients.value.length > 0
      ? Math.max(...clients.value.map(c => Number(c.id) || 0)) + 1
      : 1;

    const newClient = {
      id: nextId,
      name: clientData.name || "Mitra Baru",
      category: clientData.category || "Swasta",
      icon: clientData.icon || "🏢",
      description: clientData.description || "",
    };

    clients.value.push(newClient);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients.value);
    syncCmsSectionToNeon('clients', clients.value);
    return newClient;
  };

  const updateClient = (id, clientData) => {
    const index = clients.value.findIndex(c => String(c.id) === String(id));
    if (index === -1) return false;

    clients.value[index] = {
      ...clients.value[index],
      ...clientData,
      id: Number(id) || id,
    };
    saveToStorage(STORAGE_KEYS.CLIENTS, clients.value);
    syncCmsSectionToNeon('clients', clients.value);
    return clients.value[index];
  };

  const deleteClient = (id) => {
    const index = clients.value.findIndex(c => String(c.id) === String(id));
    if (index === -1) return false;
    clients.value.splice(index, 1);
    saveToStorage(STORAGE_KEYS.CLIENTS, clients.value);
    syncCmsSectionToNeon('clients', clients.value);
    return true;
  };

  /**
   * WORKS CMS Methods
   */
  const addWork = async (workData) => {
    const nextId = works.value.length > 0 
      ? Math.max(...works.value.map(w => Number(w.id) || 0)) + 1 
      : 1;

    const newWork = {
      id: nextId,
      title: workData.title || "Proyek Baru",
      category: workData.category || "web",
      image: workData.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&q=80",
      description: workData.description || "",
      fullDescription: workData.fullDescription || workData.description || "",
      technologies: Array.isArray(workData.technologies) 
        ? workData.technologies 
        : typeof workData.technologies === "string" 
          ? workData.technologies.split(",").map(t => t.trim()).filter(Boolean)
          : [],
      gallery: Array.isArray(workData.gallery) ? workData.gallery : [workData.image].filter(Boolean),
      year: workData.year || `${new Date().getFullYear()}`,
      role: workData.role || "Developer",
      client: workData.client || "",
      productionHouse: workData.productionHouse || "",
      externalLinks: Array.isArray(workData.externalLinks) ? workData.externalLinks : [],
      featured: Boolean(workData.featured),
    };

    works.value.unshift(newWork);
    saveToStorage(STORAGE_KEYS.WORKS, works.value);

    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWork),
      });
      if (res.ok) {
        isNeonConnected.value = true;
        return { success: true, work: newWork };
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.warn('Neon POST error:', errorData);
        return { 
          success: false, 
          message: errorData.error || errorData.message || `Server menolak request (Status: ${res.status})` 
        };
      }
    } catch (e) {
      console.warn('Neon sync pending:', e.message);
    }

    return { success: true, offline: true, work: newWork };
  };

  const updateWork = async (id, updatedData) => {
    const numericId = Number(id);
    const index = works.value.findIndex(w => Number(w.id) === numericId || String(w.id) === String(id));
    if (index === -1) {
      console.warn(`Work #${id} not found`);
      return { success: false, message: 'Karya tidak ditemukan' };
    }

    const current = works.value[index];
    const technologies = Array.isArray(updatedData.technologies)
      ? updatedData.technologies
      : typeof updatedData.technologies === "string"
        ? updatedData.technologies.split(",").map(t => t.trim()).filter(Boolean)
        : current.technologies;

    const updatedItem = {
      ...current,
      ...updatedData,
      id: numericId,
      technologies,
    };

    works.value[index] = updatedItem;
    saveToStorage(STORAGE_KEYS.WORKS, works.value);

    try {
      const res = await fetch('/api/works', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
      if (res.ok) {
        isNeonConnected.value = true;
        return { success: true, message: 'Tersimpan ke Neon Postgres!' };
      } else {
        const err = await res.json().catch(() => ({}));
        console.warn('Neon PUT error:', err);
        return { success: false, message: err.error || 'Gagal menyimpan ke server' };
      }
    } catch (e) {
      console.warn('Neon update pending:', e.message);
      return { success: true, offline: true, message: 'Tersimpan lokal di browser' };
    }
  };

  const deleteWork = async (id) => {
    const numericId = Number(id);
    const index = works.value.findIndex(w => Number(w.id) === numericId || String(w.id) === String(id));
    if (index === -1) return false;
    works.value.splice(index, 1);
    saveToStorage(STORAGE_KEYS.WORKS, works.value);

    try {
      await fetch(`/api/works?id=${numericId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Neon delete pending:', e.message);
    }

    return true;
  };

  /**
   * Download Full Backup as JSON
   */
  const downloadBackup = () => {
    const dataToExport = {
      works: works.value,
      categories: categories.value,
      profile: profile.value,
      skills: skills.value,
      experiences: experiences.value,
      clients: clients.value,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Import Full Backup
   */
  const importBackup = (jsonData) => {
    try {
      const parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      let count = 0;
      if (parsed.works && Array.isArray(parsed.works)) {
        works.value = parsed.works;
        count += parsed.works.length;
        syncAllToNeon();
      }
      if (parsed.profile && typeof parsed.profile === "object") {
        profile.value = { ...DEFAULT_PROFILE, ...parsed.profile };
        syncCmsSectionToNeon('profile', profile.value);
      }
      if (parsed.skills && Array.isArray(parsed.skills)) {
        skills.value = parsed.skills;
        syncCmsSectionToNeon('skills', skills.value);
      }
      if (parsed.experiences && typeof parsed.experiences === "object") {
        experiences.value = parsed.experiences;
        syncCmsSectionToNeon('experiences', experiences.value);
      }
      if (parsed.clients && Array.isArray(parsed.clients)) {
        clients.value = parsed.clients;
        syncCmsSectionToNeon('clients', clients.value);
      }
      return { success: true, count };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  return {
    works,
    categories,
    profile,
    skills,
    experiences,
    clients,
    isAuthenticated,
    isNeonConnected,
    isSyncing,
    login,
    logout,
    changePassword,
    updateProfile,
    addSkill,
    updateSkill,
    deleteSkill,
    addClient,
    updateClient,
    deleteClient,
    addExperience,
    updateExperience,
    deleteExperience,
    addWork,
    updateWork,
    deleteWork,
    downloadBackup,
    importBackup,
    syncAllToNeon,
    fetchFromNeonDatabase,
  };
}
