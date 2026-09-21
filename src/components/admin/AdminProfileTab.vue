<template>
  <div class="admin-tab-pane profile-pane">
    <div class="pane-header">
      <div>
        <h2 class="pane-title">👤 Manajemen Profil, Bio & Kontak</h2>
        <p class="pane-desc">
          Perbarui identitas, ringkasan keahlian, paragraf Tentang Saya, dan info kontak. Setiap perubahan langsung tersimpan ke database Neon dan tampil live di website.
        </p>
      </div>
      <button class="btn btn-primary btn-lg" @click="saveProfile" :disabled="isSaving">
        <span v-if="!isSaving">💾 Simpan Perubahan Profil</span>
        <span v-else class="btn-loading">
          <span class="spinner spinner-sm"></span>
          Menyimpan ke Cloud...
        </span>
      </button>
    </div>

    <div class="profile-grid">
      <!-- Left Column: Identitas Utama & Foto -->
      <div class="card-panel">
        <h3 class="panel-section-title">Foto Profil & Identitas Utama</h3>

        <!-- Avatar Uploader -->
        <div class="avatar-uploader-box">
          <div class="avatar-preview-wrap">
            <img :src="form.avatar || defaultAvatar" alt="Foto Profil" class="avatar-preview-img" @error="handleAvatarError" />
            <button
              v-if="form.avatar"
              type="button"
              class="avatar-del-quick-btn"
              @click="form.avatar = ''"
              title="Hapus foto profil (✕)"
            >
              ✕
            </button>
          </div>
          <div class="avatar-controls">
            <label class="form-label">Foto Profil (Avatar Hero)</label>
            <div class="avatar-btn-group">
              <button type="button" class="btn btn-secondary btn-sm" @click="triggerAvatarFile">
                📁 Upload dari Perangkat / Galeri HP
              </button>
              <button type="button" class="btn btn-ghost btn-sm" @click="resetToDefaultPhoto">
                Kembalikan Foto Awal
              </button>
              <button v-if="form.avatar" type="button" class="btn btn-danger-ghost btn-sm" @click="form.avatar = ''">
                ✕ Hapus Foto
              </button>
            </div>
            <input
              ref="avatarFileRef"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleAvatarFileChange"
            />
            <input
              type="text"
              v-model="form.avatar"
              class="form-input form-input-sm mt-2"
              placeholder="Atau tempel URL gambar langsung (https://...)"
            />
          </div>
        </div>

        <div class="form-row mt-4">
          <div class="form-group flex-1">
            <label class="form-label">Nama Lengkap <span class="req">*</span></label>
            <input type="text" v-model="form.name" class="form-input" placeholder="Abdullah Syauqillah" required />
          </div>
          <div class="form-group flex-1">
            <label class="form-label">Greeting / Sapaan</label>
            <input type="text" v-model="form.greeting" class="form-input" placeholder="Halo, saya" />
          </div>
        </div>

        <div class="form-group mt-3">
          <label class="form-label">Title / Spesialisasi Utama <span class="req">*</span></label>
          <input
            type="text"
            v-model="form.title"
            class="form-input"
            placeholder="Web Developer | Network Support | Commercial Videographer"
            required
          />
        </div>

        <div class="form-group mt-3">
          <label class="form-label">Bio Singkat (Hero Header)</label>
          <textarea
            v-model="form.bio"
            class="form-input form-textarea"
            rows="3"
            placeholder="Ringkasan singkat tentang latar belakang dan keahlian Anda..."
          ></textarea>
        </div>

        <!-- Typing Animation Roles -->
        <div class="form-group mt-3">
          <label class="form-label">Role Animasi Mengetik (Hero Subtitle)</label>
          <div class="chips-editor">
            <span v-for="(role, rIdx) in form.typingRoles" :key="rIdx" class="edit-chip">
              {{ role }}
              <button type="button" class="chip-del" @click="removeRole(rIdx)">✕</button>
            </span>
          </div>
          <div class="chip-input-row mt-2">
            <input
              type="text"
              v-model="newRoleInput"
              class="form-input form-input-sm"
              placeholder="Tambah role baru (misal: AI Visual Creator)..."
              @keyup.enter="addRole"
            />
            <button type="button" class="btn btn-secondary btn-sm" @click="addRole">
              + Tambah Role
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Kontak, Paragraf Tentang Saya & Sosmed -->
      <div class="card-panel">
        <h3 class="panel-section-title">Paragraf "Tentang Saya" (About Section)</h3>

        <div class="form-group">
          <label class="form-label">Paragraf 1 (Latar Belakang Pendidikan & Keahlian)</label>
          <textarea
            v-model="form.about1"
            class="form-input form-textarea"
            rows="3"
            placeholder="Tulis paragraf pertama tentang diri Anda..."
          ></textarea>
        </div>

        <div class="form-group mt-3">
          <label class="form-label">Paragraf 2 (Rekam Jejak Portofolio & Pencapaian)</label>
          <textarea
            v-model="form.about2"
            class="form-input form-textarea"
            rows="3"
            placeholder="Tulis paragraf kedua tentang rekam jejak Anda..."
          ></textarea>
        </div>

        <h3 class="panel-section-title mt-4">Informasi Kontak & Domisili</h3>

        <div class="form-row">
          <div class="form-group flex-1">
            <label class="form-label">Email Resmi</label>
            <input type="email" v-model="form.email" class="form-input" placeholder="email@gmail.com" />
          </div>
          <div class="form-group flex-1">
            <label class="form-label">No. WhatsApp (Awali 62...)</label>
            <input type="text" v-model="form.whatsapp" class="form-input" placeholder="628155936131" />
          </div>
        </div>

        <div class="form-row mt-3">
          <div class="form-group flex-1">
            <label class="form-label">No. Telepon</label>
            <input type="text" v-model="form.phone" class="form-input" placeholder="+62 815 5936 131" />
          </div>
          <div class="form-group flex-1">
            <label class="form-label">Lokasi / Domisili</label>
            <input type="text" v-model="form.location" class="form-input" placeholder="Bungah, Gresik, Jawa Timur" />
          </div>
        </div>

        <div class="form-group mt-3">
          <label class="form-label">Link Resume / CV (PDF)</label>
          <input type="text" v-model="form.resume" class="form-input" placeholder="/resume.pdf atau link Google Drive" />
        </div>

        <!-- Social Media Links -->
        <h3 class="panel-section-title mt-4">Tautan Sosial Media</h3>
        <div class="social-inputs-grid">
          <div v-for="social in form.social" :key="social.id" class="form-group">
            <label class="form-label">{{ social.name }}</label>
            <input type="url" v-model="social.url" class="form-input form-input-sm" :placeholder="`URL ${social.name}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import { usePortfolioStore } from "@/composables/usePortfolioStore";
import defaultUserPhoto from "@/assets/IMG/Fotoku.jpg";

const emit = defineEmits(["toast"]);
const { profile, updateProfile } = usePortfolioStore();

const defaultAvatar = defaultUserPhoto;
const avatarFileRef = ref(null);
const isSaving = ref(false);
const newRoleInput = ref("");

// Local reactive form
const form = reactive({
  name: "",
  title: "",
  greeting: "",
  bio: "",
  avatar: "",
  whatsapp: "",
  phone: "",
  email: "",
  location: "",
  resume: "",
  about1: "",
  about2: "",
  typingRoles: [],
  social: [],
});

// Populate form from store
const loadProfileIntoForm = () => {
  if (!profile.value) return;
  form.name = profile.value.name || "";
  form.title = profile.value.title || "";
  form.greeting = profile.value.greeting || "Halo, saya";
  form.bio = profile.value.bio || "";
  form.avatar = profile.value.avatar || defaultAvatar;
  form.whatsapp = profile.value.whatsapp || "";
  form.phone = profile.value.phone || "";
  form.email = profile.value.email || "";
  form.location = profile.value.location || "";
  form.resume = profile.value.resume || "/resume.pdf";

  const paragraphs = profile.value.aboutParagraphs || [];
  form.about1 = paragraphs[0] || "";
  form.about2 = paragraphs[1] || "";

  form.typingRoles = Array.isArray(profile.value.typingRoles) ? [...profile.value.typingRoles] : [];
  form.social = Array.isArray(profile.value.social) ? JSON.parse(JSON.stringify(profile.value.social)) : [];
};

loadProfileIntoForm();
watch(profile, () => loadProfileIntoForm(), { deep: true });

// Avatar handling
const triggerAvatarFile = () => {
  if (avatarFileRef.value) avatarFileRef.value.click();
};

const handleAvatarFileChange = (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    form.avatar = event.target.result;
    emit("toast", "✓ Foto profil berhasil dimuat! Klik 'Simpan' untuk menerapkan ke Neon cloud.");
  };
  reader.readAsDataURL(file);
};

const resetToDefaultPhoto = () => {
  form.avatar = defaultAvatar;
  emit("toast", "✓ Foto profil dikembalikan ke foto awal!");
};

const handleAvatarError = (e) => {
  e.target.src = defaultAvatar;
};

// Roles handling
const addRole = () => {
  const val = newRoleInput.value.trim();
  if (val && !form.typingRoles.includes(val)) {
    form.typingRoles.push(val);
    newRoleInput.value = "";
  }
};

const removeRole = (idx) => {
  form.typingRoles.splice(idx, 1);
};

// Save to Store and Neon
const saveProfile = async () => {
  isSaving.value = true;
  try {
    const updated = {
      name: form.name,
      title: form.title,
      greeting: form.greeting,
      bio: form.bio,
      avatar: form.avatar,
      whatsapp: form.whatsapp,
      phone: form.phone,
      email: form.email,
      location: form.location,
      resume: form.resume,
      aboutParagraphs: [form.about1, form.about2].filter(Boolean),
      typingRoles: form.typingRoles,
      social: form.social,
    };

    updateProfile(updated);
    emit("toast", "✓ Profil & kontak berhasil diperbarui dan tersimpan ke Neon Cloud!");
  } catch (err) {
    emit("toast", "⚠️ Gagal menyimpan profil: " + err.message);
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.admin-tab-pane {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  flex-wrap: wrap;
  padding-bottom: var(--space-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.pane-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.pane-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  max-width: 700px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
}

.card-panel {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
}

.panel-section-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary-light);
  margin-bottom: var(--space-md);
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

/* Avatar Uploader */
.avatar-uploader-box {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-lg);
}

.avatar-preview-wrap {
  width: 90px;
  height: 90px;
  border-radius: var(--radius-full);
  overflow: hidden;
  border: 3px solid var(--color-primary);
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(31, 159, 216, 0.3);
  position: relative;
}

.avatar-del-quick-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ef4444;
  color: #ffffff;
  border: 1.5px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  z-index: 10;
  transition: transform 0.15s ease;
}

.avatar-del-quick-btn:hover {
  background: #dc2626;
  transform: scale(1.15);
}

.avatar-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}

.avatar-controls {
  flex: 1;
  min-width: 0;
}

.avatar-btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;
}

/* Form Styles */
.form-row {
  display: flex;
  gap: var(--space-md);
}

.flex-1 {
  flex: 1;
}

.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }

.chips-editor {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.edit-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(31, 159, 216, 0.15);
  color: var(--color-primary-light);
  border: 1px solid rgba(31, 159, 216, 0.3);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
}

.chip-del {
  background: none;
  border: none;
  color: #F87171;
  cursor: pointer;
  font-size: 11px;
  display: flex;
  align-items: center;
}

.chip-input-row {
  display: flex;
  gap: 8px;
}

.social-inputs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

@media (max-width: 900px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
  .form-row, .social-inputs-grid {
    flex-direction: column;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .pane-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }

  .pane-header .btn {
    width: 100%;
    justify-content: center;
  }

  .pane-title {
    font-size: var(--font-size-xl);
  }

  .card-panel {
    padding: var(--space-md);
  }

  .avatar-uploader-box {
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: var(--space-md);
  }

  .avatar-btn-group {
    justify-content: center;
  }

  .avatar-btn-group .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
