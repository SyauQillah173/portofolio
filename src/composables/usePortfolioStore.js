/**
 * usePortfolioStore Composable
 * =============================
 * Central reactive store for portfolio data and admin authentication.
 * Persists changes in localStorage and syncs live with public dashboard.
 */

import defaultSkillsData from "@/assets/data/skills.json";
import defaultWorksData from "@/assets/data/works.json";
import { computed, ref, watch } from "vue";

const STORAGE_KEYS = {
  WORKS: "syauqillah_portfolio_works",
  AUTH: "syauqillah_admin_auth",
  PASSWORD: "syauqillah_admin_password",
};

// Default admin password
const DEFAULT_PASSWORD = "admin123";

// Shared reactive state across components
const works = ref([]);
const categories = ref(defaultWorksData.categories || []);
const isAuthenticated = ref(false);
const isInitialized = ref(false);

/**
 * Initialize store from localStorage or default JSON files
 */
function initStore() {
  if (isInitialized.value) return;

  // 1. Load authentication state
  try {
    const savedAuth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
    isAuthenticated.value = savedAuth === "true";
  } catch (e) {
    isAuthenticated.value = false;
  }

  // 2. Load works data
  try {
    const storedWorks = localStorage.getItem(STORAGE_KEYS.WORKS);
    if (storedWorks) {
      const parsed = JSON.parse(storedWorks);
      // Smart sync: ensure new default projects like #6 and updated GDrive links are merged
      const defaultWorks = defaultWorksData.works || [];
      const mergedWorks = [...parsed];

      defaultWorks.forEach((defWork) => {
        const existingIdx = mergedWorks.findIndex((w) => w.id === defWork.id);
        if (existingIdx === -1) {
          mergedWorks.push(defWork);
        } else {
          // If existing doesn't have drive link, update externalLinks
          const existing = mergedWorks[existingIdx];
          const hasDriveLink = (existing.externalLinks || []).some(
            (l) => l.url && l.url.includes("drive.google.com")
          );
          if (!hasDriveLink && defWork.externalLinks && defWork.externalLinks.some((l) => l.url.includes("drive.google.com"))) {
            mergedWorks[existingIdx] = {
              ...existing,
              externalLinks: defWork.externalLinks,
            };
          }
        }
      });

      works.value = mergedWorks;
      saveWorksToStorage();
    } else {
      works.value = JSON.parse(JSON.stringify(defaultWorksData.works));
      saveWorksToStorage();
    }
  } catch (e) {
    console.error("Error reading localStorage, using defaults:", e);
    works.value = JSON.parse(JSON.stringify(defaultWorksData.works));
  }

  isInitialized.value = true;
}

/**
 * Save current works array to localStorage
 */
function saveWorksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(works.value));
  } catch (e) {
    console.error("Failed to save works to localStorage:", e);
  }
}

/**
 * Get current admin password
 */
function getStoredPassword() {
  try {
    return localStorage.getItem(STORAGE_KEYS.PASSWORD) || DEFAULT_PASSWORD;
  } catch (e) {
    return DEFAULT_PASSWORD;
  }
}

export function usePortfolioStore() {
  initStore();

  // Watch works and persist on any mutation
  watch(
    works,
    () => {
      saveWorksToStorage();
    },
    { deep: true }
  );

  /**
   * Login method
   */
  const login = (password) => {
    const validPassword = getStoredPassword();
    if (password === validPassword) {
      isAuthenticated.value = true;
      try {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
      } catch (e) {}
      return { success: true };
    } else {
      return { success: false, message: "Password salah! Silakan coba lagi." };
    }
  };

  /**
   * Logout method
   */
  const logout = () => {
    isAuthenticated.value = false;
    try {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (e) {}
  };

  /**
   * Change password method
   */
  const changePassword = (currentPassword, newPassword) => {
    const validPassword = getStoredPassword();
    if (currentPassword !== validPassword) {
      return { success: false, message: "Password saat ini tidak cocok." };
    }
    if (!newPassword || newPassword.length < 5) {
      return { success: false, message: "Password baru minimal 5 karakter." };
    }
    try {
      localStorage.setItem(STORAGE_KEYS.PASSWORD, newPassword);
      return { success: true, message: "Password berhasil diperbarui!" };
    } catch (e) {
      return { success: false, message: "Gagal menyimpan password baru." };
    }
  };

  /**
   * Add new project to works
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

    // Prepend so new items appear first
    works.value.unshift(newWork);
    saveWorksToStorage();
    return newWork;
  };

  /**
   * Update existing project
   */
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
      id, // Preserve ID
      technologies,
    };

    saveWorksToStorage();
    return works.value[index];
  };

  /**
   * Delete project
   */
  const deleteWork = (id) => {
    const index = works.value.findIndex(w => w.id === id);
    if (index === -1) return false;
    works.value.splice(index, 1);
    saveWorksToStorage();
    return true;
  };

  /**
   * Reset works to default JSON
   */
  const resetToDefault = () => {
    works.value = JSON.parse(JSON.stringify(defaultWorksData.works));
    saveWorksToStorage();
  };

  /**
   * Download works backup as JSON file
   */
  const downloadBackup = () => {
    const dataToExport = {
      works: works.value,
      categories: categories.value,
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `works_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    works,
    categories,
    isAuthenticated,
    login,
    logout,
    changePassword,
    addWork,
    updateWork,
    deleteWork,
    resetToDefault,
    downloadBackup,
  };
}
