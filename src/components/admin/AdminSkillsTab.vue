<template>
  <div class="admin-tab-pane skills-pane">
    <div class="pane-header">
      <div>
        <h2 class="pane-title">⚡ Manajemen Keahlian (Skills)</h2>
        <p class="pane-desc">
          Kelola keahlian teknis dan kreatif yang ditampilkan pada section "Keahlian Saya". Abang bisa menambah, mengubah tingkat kemahiran, warna, atau menghapus skill.
        </p>
      </div>
      <button class="btn btn-primary btn-lg" @click="openCreateModal">
        <span>+ Tambah Skill Baru</span>
      </button>
    </div>

    <!-- Skills Grid -->
    <div v-if="skills.length > 0" class="skills-admin-grid">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="skill-admin-card"
        :style="{ '--card-accent': skill.color || '#1F9FD8' }"
      >
        <div class="skill-card-top">
          <div class="skill-icon-bubble" :style="{ background: (skill.color || '#1F9FD8') + '22', color: skill.color || '#1F9FD8' }">
            {{ skill.icon || '💻' }}
          </div>
          <div class="skill-meta-tags">
            <span class="skill-category-badge">{{ skill.category || 'tech' }}</span>
            <span class="skill-level-badge">{{ skill.level || 'Intermediate' }}</span>
          </div>
        </div>

        <div class="skill-card-info">
          <h4 class="skill-title">{{ skill.name }}</h4>
          <p class="skill-desc">{{ skill.description || 'Tidak ada deskripsi' }}</p>
        </div>

        <div class="skill-card-actions">
          <button class="btn btn-secondary btn-sm" @click="openEditModal(skill)">
            ✏️ Edit
          </button>
          <button class="btn btn-danger btn-sm" @click="confirmDelete(skill)">
            🗑️ Hapus
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state-box">
      <span>Belum ada skill yang ditambahkan. Klik "+ Tambah Skill Baru" di atas!</span>
    </div>

    <!-- Add / Edit Skill Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
          <div class="modal-card">
            <div class="modal-header">
              <h3>{{ isEditing ? 'Edit Keahlian' : 'Tambah Keahlian Baru' }}</h3>
              <button type="button" class="modal-close" @click="showModal = false">✕</button>
            </div>

            <form @submit.prevent="handleSubmit" class="modal-form">
              <div class="form-row">
                <div class="form-group flex-2">
                  <label class="form-label">Nama Keahlian <span class="req">*</span></label>
                  <input type="text" v-model="form.name" class="form-input" placeholder="Misal: Vue.js & Nuxt" required />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Ikon / Emoji</label>
                  <input type="text" v-model="form.icon" class="form-input" placeholder="💻" />
                </div>
              </div>

              <div class="form-row mt-3">
                <div class="form-group flex-1">
                  <label class="form-label">Tingkat Kemahiran</label>
                  <select v-model="form.level" class="form-input">
                    <option value="Beginner">Beginner (Dasar - 40%)</option>
                    <option value="Intermediate">Intermediate (Menengah - 70%)</option>
                    <option value="Advanced">Advanced (Mahir / Ahli - 95%)</option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Kategori</label>
                  <select v-model="form.category" class="form-input">
                    <option value="frontend">Frontend & Web</option>
                    <option value="backend">Backend & Database</option>
                    <option value="network">Jaringan & IT Support</option>
                    <option value="multimedia">Videography & Drone</option>
                    <option value="ai">AI & Creative Tech</option>
                    <option value="general">Lainnya</option>
                  </select>
                </div>
              </div>

              <div class="form-row mt-3">
                <div class="form-group flex-1">
                  <label class="form-label">Warna Aksen Kartu</label>
                  <div class="color-picker-row">
                    <input type="color" v-model="form.color" class="color-input" />
                    <span class="color-hex-label">{{ form.color }}</span>
                  </div>
                </div>
              </div>

              <div class="form-group mt-3">
                <label class="form-label">Deskripsi Singkat</label>
                <textarea
                  v-model="form.description"
                  class="form-input form-textarea"
                  rows="2"
                  placeholder="Penjelasan keahlian dan implementasinya pada proyek..."
                ></textarea>
              </div>

              <div class="modal-footer mt-4">
                <button type="button" class="btn btn-ghost" @click="showModal = false">Batal</button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? 'Simpan Perubahan' : 'Tambahkan Skill' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { usePortfolioStore } from "@/composables/usePortfolioStore";

const emit = defineEmits(["toast"]);
const { skills, addSkill, updateSkill, deleteSkill } = usePortfolioStore();

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  name: "",
  category: "frontend",
  level: "Intermediate",
  icon: "💻",
  color: "#1F9FD8",
  description: "",
});

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.name = "";
  form.category = "frontend";
  form.level = "Intermediate";
  form.icon = "💻";
  form.color = "#1F9FD8";
  form.description = "";
  showModal.value = true;
};

const openEditModal = (skill) => {
  isEditing.value = true;
  editingId.value = skill.id;
  form.name = skill.name || "";
  form.category = skill.category || "frontend";
  form.level = skill.level || "Intermediate";
  form.icon = skill.icon || "💻";
  form.color = skill.color || "#1F9FD8";
  form.description = skill.description || "";
  showModal.value = true;
};

const handleSubmit = () => {
  if (!form.name) return;

  if (isEditing.value) {
    updateSkill(editingId.value, { ...form });
    emit("toast", `✓ Keahlian "${form.name}" berhasil diperbarui di Neon Cloud!`);
  } else {
    addSkill({ ...form });
    emit("toast", `✓ Keahlian "${form.name}" berhasil ditambahkan ke Neon Cloud!`);
  }

  showModal.value = false;
};

const confirmDelete = (skill) => {
  if (confirm(`Apakah Anda yakin ingin menghapus keahlian "${skill.name}"?`)) {
    deleteSkill(skill.id);
    emit("toast", `✓ Keahlian "${skill.name}" berhasil dihapus!`);
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

.skills-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.skill-admin-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-md);
  transition: all var(--transition-fast);
}

.skill-admin-card:hover {
  transform: translateY(-2px);
  border-color: var(--card-accent);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px var(--card-accent) 22;
}

.skill-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-icon-bubble {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.skill-meta-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.skill-category-badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text-muted);
}

.skill-level-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: rgba(31, 159, 216, 0.15);
  color: var(--color-primary-light);
}

.skill-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.skill-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: 1.4;
}

.skill-card-actions {
  display: flex;
  gap: 8px;
  padding-top: var(--space-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.empty-state-box {
  padding: var(--space-3xl);
  text-align: center;
  color: var(--color-text-muted);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-xl);
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--space-md);
}

.modal-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
  max-width: 500px;
  width: 100%;
  padding: var(--space-xl);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-light);
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 18px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}

.form-row {
  display: flex;
  gap: var(--space-md);
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-input {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  background: none;
}

.color-hex-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-family: var(--font-family-mono);
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

  .skills-admin-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .form-row {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .modal-backdrop {
    padding: 8px;
  }

  .modal-card {
    padding: var(--space-md);
    max-height: 94vh;
    overflow-y: auto;
    border-radius: var(--radius-lg);
  }

  .modal-footer {
    flex-direction: column-reverse;
    gap: 8px;
  }

  .modal-footer .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
