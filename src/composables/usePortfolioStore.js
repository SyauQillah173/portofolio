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
  WORKS: "syauqillah_portfolio_works",
  PROFILE: "syauqillah_portfolio_profile",
  SKILLS: "syauqillah_portfolio_skills",
  EXPERIENCE: "syauqillah_portfolio_experience",
  AUTH: "syauqillah_admin_auth",
  PASSWORD: "syauqillah_admin_password",
};

// Default admin password
const DEFAULT_PASSWORD = "admin123";

// Default Profile Data
const DEFAULT_PROFILE = {
  name: "Abdullah Syauqillah",
  title: "Web Developer | Network Support | Commercial Videographer",
  greeting: "Halo, saya",
  bio: "Lulusan S1 Teknik Informatika dengan keahlian hybrid di bidang Software Development, IT Infrastructure, dan Multimedia. Berpengalaman merancang Sistem Informasi Pesantren terintegrasi skala besar, mengelola jaringan Fiber Optic/LAN, serta memproduksi video komersial dan aerial drone untuk perusahaan nasional (Pertamina, Bulog) dan instansi pemerintah.",
  avatar: "/images/profile.jpg",
  resume: "/resume.pdf",
  whatsapp: "628155936131",
  email: "abdullahsyauqillah01@gmail.com",
  location: "Jl. Masjid Jami' Kyai Gede, Bungah, Gresik, Jawa Timur",
  phone: "+62 815 5936 131",
  aboutParagraphs: [
    "Saya adalah lulusan S1 Teknik Informatika dengan kombinasi keahlian unik di bidang software development, infrastruktur jaringan, dan produksi multimedia sinematik.",
    "Memiliki rekam jejak merancang dan mengembangkan Sistem Informasi Pesantren skala besar secara mandiri (Full-Stack), mengelola jaringan Fiber Optic & LAN, serta lebih dari 3 tahun berpengalaman sebagai Pilot Drone komersial dan Videografer untuk perusahaan nasional (termasuk proyek Pertamina dan Bulog via Raff Studio) hingga instansi pemerintah."
  ],
  stats: [
    { label: "Tahun Pengalaman", targetValue: 3, icon: "⚡" },
    { label: "Proyek Selesai", targetValue: 25, icon: "🎯" },
    { label: "Klien & Mitra", targetValue: 12, icon: "🤝" },
    { label: "Kepuasan Klien", targetValue: 99, icon: "⭐" }
  ],
  typingRoles: [
    "Full-Stack Web Developer",
    "Commercial Drone Pilot (DJI)",
    "Network & IT Infrastructure Support",
    "Commercial Videographer"
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

const isAuthenticated = ref(false);
const isInitialized = ref(false);
const isNeonConnected = ref(false);
const isSyncing = ref(false);

/**
 * Fetch latest works and CMS settings from Neon Postgres
 */
async function fetchFromNeonDatabase() {
  try {
    // 1. Fetch works
    const worksRes = await fetch('/api/works');
    if (worksRes.ok) {
      const data = await worksRes.json();
      if (data && data.connected) {
        isNeonConnected.value = true;
        if (Array.isArray(data.works) && data.works.length > 0) {
          works.value = data.works;
          saveToStorage(STORAGE_KEYS.WORKS, works.value);
        } else if (Array.isArray(data.works) && data.works.length === 0) {
          syncAllToNeon();
        }
      }
    }

    // 2. Fetch CMS settings (Profile, Skills, Experiences)
    const cmsRes = await fetch('/api/cms');
    if (cmsRes.ok) {
      const cmsData = await cmsRes.json();
      if (cmsData && cmsData.connected && cmsData.settings) {
        isNeonConnected.value = true;
        if (cmsData.settings.profile) {
          profile.value = { ...DEFAULT_PROFILE, ...cmsData.settings.profile };
          saveToStorage(STORAGE_KEYS.PROFILE, profile.value);
        }
        if (cmsData.settings.skills && Array.isArray(cmsData.settings.skills) && cmsData.settings.skills.length > 0) {
          skills.value = cmsData.settings.skills;
          saveToStorage(STORAGE_KEYS.SKILLS, skills.value);
        }
        if (cmsData.settings.experiences) {
          experiences.value = { ...DEFAULT_EXPERIENCE, ...cmsData.settings.experiences };
          saveToStorage(STORAGE_KEYS.EXPERIENCE, experiences.value);
        }
      }
    }
  } catch (err) {
    console.warn('Neon cloud sync fallback to local cache:', err.message);
  }
}

/**
 * Seed all current works to Neon Database
 */
async function syncAllToNeon() {
  if (isSyncing.value || !works.value.length) return;
  isSyncing.value = true;
  try {
    for (const work of works.value) {
      await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(work),
      });
    }
    console.log('✓ Works synchronized with Neon Postgres!');
  } catch (e) {
    console.warn('Error syncing works to Neon:', e);
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

  isInitialized.value = true;

  // Background fetch from Neon
  fetchFromNeonDatabase();
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
    const index = skills.value.findIndex(s => s.id === id);
    if (index === -1) return false;

    skills.value[index] = {
      ...skills.value[index],
      ...skillData,
      id,
    };
    saveToStorage(STORAGE_KEYS.SKILLS, skills.value);
    syncCmsSectionToNeon('skills', skills.value);
    return skills.value[index];
  };

  const deleteSkill = (id) => {
    const index = skills.value.findIndex(s => s.id === id);
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
    const index = experiences.value[type].findIndex(i => i.id === id);
    if (index === -1) return false;

    experiences.value[type][index] = {
      ...experiences.value[type][index],
      ...itemData,
      id,
    };
    saveToStorage(STORAGE_KEYS.EXPERIENCE, experiences.value);
    syncCmsSectionToNeon('experiences', experiences.value);
    return experiences.value[type][index];
  };

  const deleteExperience = (type, id) => {
    if (!experiences.value[type]) return false;
    const index = experiences.value[type].findIndex(i => i.id === id);
    if (index === -1) return false;

    experiences.value[type].splice(index, 1);
    saveToStorage(STORAGE_KEYS.EXPERIENCE, experiences.value);
    syncCmsSectionToNeon('experiences', experiences.value);
    return true;
  };

  /**
   * WORKS CMS Methods
   */
  const addWork = (workData) => {
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

    fetch('/api/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWork),
    }).catch(e => console.warn('Neon sync pending:', e.message));

    return newWork;
  };

  const updateWork = (id, updatedData) => {
    const index = works.value.findIndex(w => w.id === id);
    if (index === -1) return false;

    const current = works.value[index];
    const technologies = Array.isArray(updatedData.technologies)
      ? updatedData.technologies
      : typeof updatedData.technologies === "string"
        ? updatedData.technologies.split(",").map(t => t.trim()).filter(Boolean)
        : current.technologies;

    works.value[index] = {
      ...current,
      ...updatedData,
      id,
      technologies,
    };

    saveToStorage(STORAGE_KEYS.WORKS, works.value);

    fetch('/api/works', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(works.value[index]),
    }).catch(e => console.warn('Neon update pending:', e.message));

    return works.value[index];
  };

  const deleteWork = (id) => {
    const index = works.value.findIndex(w => w.id === id);
    if (index === -1) return false;
    works.value.splice(index, 1);
    saveToStorage(STORAGE_KEYS.WORKS, works.value);

    fetch(`/api/works?id=${id}`, {
      method: 'DELETE',
    }).catch(e => console.warn('Neon delete pending:', e.message));

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
    addExperience,
    updateExperience,
    deleteExperience,
    addWork,
    updateWork,
    deleteWork,
    downloadBackup,
    importBackup,
    syncAllToNeon,
  };
}
