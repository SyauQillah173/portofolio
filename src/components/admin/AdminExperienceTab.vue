<template>
  <div class="admin-tab-pane exp-pane">
    <div class="pane-header">
      <div>
        <h2 class="pane-title">💼 Manajemen Pengalaman & Pendidikan</h2>
        <p class="pane-desc">
          Kelola riwayat karier profesional, proyek institusi, dan latar belakang pendidikan yang tampil di timeline interaktif website.
        </p>
      </div>

      <div class="header-action-group">
        <!-- Sub-tabs -->
        <div class="exp-subtabs">
          <button
            class="subtab-btn"
            :class="{ active: currentSubTab === 'work' }"
            @click="currentSubTab = 'work'"
          >
            💼 Pengalaman Kerja ({{ (experiences.work || []).length }})
          </button>
          <button
            class="subtab-btn"
            :class="{ active: currentSubTab === 'education' }"
            @click="currentSubTab = 'education'"
          >
            🎓 Pendidikan ({{ (experiences.education || []).length }})
          </button>
        </div>

        <button class="btn btn-primary" @click="openCreateModal">
          <span>+ Tambah {{ currentSubTab === 'work' ? 'Pengalaman' : 'Pendidikan' }} Baru</span>
        </button>
      </div>
    </div>

    <!-- Work Timeline List -->
    <div v-if="currentSubTab === 'work'" class="timeline-admin-list">
      <div v-for="item in (experiences.work || [])" :key="item.id" class="exp-admin-card">
        <div class="exp-card-header">
          <div>
            <span class="exp-period-badge">{{ item.period }}</span>
            <h3 class="exp-role">{{ item.role }}</h3>
            <h4 class="exp-company">🏢 {{ item.company }}</h4>
            <p v-if="item.subtitle" class="exp-subtitle">{{ item.subtitle }}</p>
          </div>
          <div class="exp-card-actions">
            <button class="btn btn-secondary btn-sm" @click="openEditModal(item)">
              ✏️ Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(item.id)">
              🗑️ Hapus
            </button>
          </div>
        </div>

        <ul v-if="item.points && item.points.length" class="exp-points">
          <li v-for="(pt, pIdx) in item.points" :key="pIdx">
            <span class="bullet">▹</span>
            <span>{{ pt }}</span>
          </li>
        </ul>

        <div v-if="item.tags && item.tags.length" class="exp-tags">
          <span v-for="tag in item.tags" :key="tag" class="tag-pill">{{ tag }}</span>
        </div>
      </div>
    </div>

    <!-- Education Timeline List -->
    <div v-if="currentSubTab === 'education'" class="timeline-admin-list">
      <div v-for="edu in (experiences.education || [])" :key="edu.id" class="exp-admin-card">
        <div class="exp-card-header">
          <div>
            <span class="exp-period-badge edu-badge">{{ edu.period }}</span>
            <h3 class="exp-role">{{ edu.degree }}</h3>
            <h4 class="exp-company">🎓 {{ edu.institution }}</h4>
            <p v-if="edu.major" class="exp-subtitle">{{ edu.major }}</p>
          </div>
          <div class="exp-card-actions">
            <button class="btn btn-secondary btn-sm" @click="openEditModal(edu)">
              ✏️ Edit
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(edu.id)">
              🗑️ Hapus
            </button>
          </div>
        </div>

        <p v-if="edu.description" class="edu-desc">{{ edu.description }}</p>

        <div v-if="edu.skills && edu.skills.length" class="exp-tags">
          <span v-for="skill in edu.skills" :key="skill" class="tag-pill">{{ skill }}</span>
        </div>
      </div>
    </div>

    <!-- Modal Form (Work or Education) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
          <div class="modal-card modal-lg">
            <div class="modal-header">
              <h3>
                {{ isEditing ? 'Edit' : 'Tambah' }}
                {{ currentSubTab === 'work' ? 'Pengalaman Kerja' : 'Pendidikan' }}
              </h3>
              <button type="button" class="modal-close" @click="showModal = false">✕</button>
            </div>

            <form @submit.prevent="handleSubmit" class="modal-form">
              <!-- WORK FORM -->
              <template v-if="currentSubTab === 'work'">
                <div class="form-row">
                  <div class="form-group flex-2">
                    <label class="form-label">Perusahaan / Organisasi <span class="req">*</span></label>
                    <input type="text" v-model="workForm.company" class="form-input" placeholder="Pondok Pesantren Qomaruddin" required />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Periode / Waktu <span class="req">*</span></label>
                    <input type="text" v-model="workForm.period" class="form-input" placeholder="2024 – Sekarang" required />
                  </div>
                </div>

                <div class="form-row mt-3">
                  <div class="form-group flex-1">
                    <label class="form-label">Posisi / Jabatan (Role) <span class="req">*</span></label>
                    <input type="text" v-model="workForm.role" class="form-input" placeholder="Web Developer & IT Maintenance" required />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Sub-judul / Fokus</label>
                    <input type="text" v-model="workForm.subtitle" class="form-input" placeholder="Full-Stack & Infrastruktur Jaringan" />
                  </div>
                </div>

                <div class="form-group mt-3">
                  <label class="form-label">Poin-poin Tanggung Jawab / Pencapaian (1 baris per poin)</label>
                  <textarea
                    v-model="workForm.pointsText"
                    class="form-input form-textarea"
                    rows="4"
                    placeholder="Merancang Sistem Informasi Pesantren...&#10;Melakukan maintenance Fiber Optic...&#10;Mengoperasikan drone DJI..."
                  ></textarea>
                </div>

                <div class="form-group mt-3">
                  <label class="form-label">Tag Teknologi / Skill (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    v-model="workForm.tagsText"
                    class="form-input"
                    placeholder="Vue.js, Fiber Optic, DJI Drone 4K, LAN Switching"
                  />
                </div>
              </template>

              <!-- EDUCATION FORM -->
              <template v-else>
                <div class="form-row">
                  <div class="form-group flex-2">
                    <label class="form-label">Institusi Pendidikan <span class="req">*</span></label>
                    <input type="text" v-model="eduForm.institution" class="form-input" placeholder="Universitas Qomaruddin Gresik" required />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Periode Waktu <span class="req">*</span></label>
                    <input type="text" v-model="eduForm.period" class="form-input" placeholder="2020 – 2024" required />
                  </div>
                </div>

                <div class="form-row mt-3">
                  <div class="form-group flex-1">
                    <label class="form-label">Gelar / Jenjang <span class="req">*</span></label>
                    <input type="text" v-model="eduForm.degree" class="form-input" placeholder="Sarjana Komputer (S.Kom)" required />
                  </div>
                  <div class="form-group flex-1">
                    <label class="form-label">Jurusan / Fokus</label>
                    <input type="text" v-model="eduForm.major" class="form-input" placeholder="S1 Teknik Informatika" />
                  </div>
                </div>

                <div class="form-group mt-3">
                  <label class="form-label">Deskripsi Pendidikan</label>
                  <textarea
                    v-model="eduForm.description"
                    class="form-input form-textarea"
                    rows="3"
                    placeholder="Fokus keilmuan pada Rekayasa Perangkat Lunak, Jaringan, dan Basis Data..."
                  ></textarea>
                </div>

                <div class="form-group mt-3">
                  <label class="form-label">Materi / Skill Dipelajari (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    v-model="eduForm.skillsText"
                    class="form-input"
                    placeholder="Software Engineering, Web Systems, Database Design"
                  />
                </div>
              </template>

              <div class="modal-footer mt-4">
                <button type="button" class="btn btn-ghost" @click="showModal = false">Batal</button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? 'Simpan Perubahan' : 'Tambahkan' }}
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
const { experiences, addExperience, updateExperience, deleteExperience } = usePortfolioStore();

const currentSubTab = ref("work");
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const workForm = reactive({
  company: "",
  period: "",
  role: "",
  subtitle: "",
  pointsText: "",
  tagsText: "",
});

const eduForm = reactive({
  institution: "",
  period: "",
  degree: "",
  major: "",
  description: "",
  skillsText: "",
});

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  if (currentSubTab.value === "work") {
    workForm.company = "";
    workForm.period = "";
    workForm.role = "";
    workForm.subtitle = "";
    workForm.pointsText = "";
    workForm.tagsText = "";
  } else {
    eduForm.institution = "";
    eduForm.period = "";
    eduForm.degree = "";
    eduForm.major = "";
    eduForm.description = "";
    eduForm.skillsText = "";
  }
  showModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  editingId.value = item.id;
  if (currentSubTab.value === "work") {
    workForm.company = item.company || "";
    workForm.period = item.period || "";
    workForm.role = item.role || "";
    workForm.subtitle = item.subtitle || "";
    workForm.pointsText = (item.points || []).join("\n");
    workForm.tagsText = (item.tags || []).join(", ");
  } else {
    eduForm.institution = item.institution || "";
    eduForm.period = item.period || "";
    eduForm.degree = item.degree || "";
    eduForm.major = item.major || "";
    eduForm.description = item.description || "";
    eduForm.skillsText = (item.skills || []).join(", ");
  }
  showModal.value = true;
};

const handleSubmit = () => {
  if (currentSubTab.value === "work") {
    if (!workForm.company || !workForm.role) return;

    const data = {
      company: workForm.company,
      period: workForm.period,
      role: workForm.role,
      subtitle: workForm.subtitle,
      points: workForm.pointsText.split("\n").map(p => p.trim()).filter(Boolean),
      tags: workForm.tagsText.split(",").map(t => t.trim()).filter(Boolean),
    };

    if (isEditing.value) {
      updateExperience("work", editingId.value, data);
      emit("toast", "✓ Pengalaman kerja berhasil diperbarui di Neon Cloud!");
    } else {
      addExperience("work", data);
      emit("toast", "✓ Pengalaman kerja baru berhasil ditambahkan!");
    }
  } else {
    if (!eduForm.institution || !eduForm.degree) return;

    const data = {
      institution: eduForm.institution,
      period: eduForm.period,
      degree: eduForm.degree,
      major: eduForm.major,
      description: eduForm.description,
      skills: eduForm.skillsText.split(",").map(s => s.trim()).filter(Boolean),
    };

    if (isEditing.value) {
      updateExperience("education", editingId.value, data);
      emit("toast", "✓ Data pendidikan berhasil diperbarui di Neon Cloud!");
    } else {
      addExperience("education", data);
      emit("toast", "✓ Data pendidikan baru berhasil ditambahkan!");
    }
  }

  showModal.value = false;
};

const confirmDelete = (id) => {
  const label = currentSubTab.value === "work" ? "pengalaman kerja" : "data pendidikan";
  if (confirm(`Apakah Anda yakin ingin menghapus ${label} ini?`)) {
    deleteExperience(currentSubTab.value, id);
    emit("toast", `✓ Berhasil menghapus ${label}!`);
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

.header-action-group {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.exp-subtabs {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.subtab-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.subtab-btn.active {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(31, 159, 216, 0.4);
}

.timeline-admin-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.exp-admin-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  transition: all var(--transition-fast);
}

.exp-admin-card:hover {
  border-color: rgba(31, 159, 216, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.exp-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
}

.exp-period-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(31, 159, 216, 0.15);
  color: var(--color-primary-light);
  margin-bottom: 6px;
}

.edu-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
}

.exp-role {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-light);
  margin-bottom: 2px;
}

.exp-company {
  font-size: var(--font-size-sm);
  color: var(--color-primary-light);
  font-weight: 600;
  margin-bottom: 4px;
}

.exp-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.exp-card-actions {
  display: flex;
  gap: 8px;
}

.exp-points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.exp-points li {
  display: flex;
  gap: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.5;
}

.bullet {
  color: var(--color-primary);
}

.exp-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding-top: var(--space-xs);
}

.tag-pill {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-muted);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.edu-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Modal */
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
  max-width: 600px;
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
</style>
