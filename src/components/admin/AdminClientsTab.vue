<template>
  <div class="admin-tab-pane clients-pane">
    <div class="pane-header">
      <div>
        <h2 class="pane-title">🤝 Manajemen Mitra & Klien</h2>
        <p class="pane-desc">
          Kelola instansi, perusahaan, atau brand yang pernah bekerja sama dan berkolaborasi dengan abang. Daftar ini langsung tampil pada <strong>Pernah Berkolaborasi & Menangani Klien</strong> di beranda serta disinkronkan ke angka statistik <strong>Mitra & Klien</strong> secara real-time!
        </p>
      </div>
      <button class="btn btn-primary btn-lg" @click="openCreateModal">
        <span>+ Tambah Mitra / Klien Baru</span>
      </button>
    </div>

    <!-- Clients Grid -->
    <div v-if="clients && clients.length > 0" class="clients-admin-grid">
      <div
        v-for="client in clients"
        :key="client.id"
        class="client-admin-card"
      >
        <div class="client-card-top">
          <div class="client-icon-bubble">
            {{ client.icon || '🏢' }}
          </div>
          <div class="client-meta-tags">
            <span class="client-category-badge">{{ client.category || 'Mitra' }}</span>
          </div>
        </div>

        <div class="client-card-info">
          <h4 class="client-title">{{ client.name }}</h4>
          <p class="client-desc">{{ client.description || 'Pernah berkolaborasi dalam proyek' }}</p>
        </div>

        <div class="client-card-actions">
          <button class="btn btn-secondary btn-sm" @click="openEditModal(client)">
            ✏️ Edit
          </button>
          <button class="btn btn-danger btn-sm" @click="confirmDelete(client)">
            🗑️ Hapus
          </button>
        </div>
      </div>
    </div>
    <div v-else class="empty-state-box">
      <span>Belum ada mitra atau klien yang ditambahkan. Klik "+ Tambah Mitra / Klien Baru" di atas!</span>
    </div>

    <!-- Add / Edit Client Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
          <div class="modal-card">
            <div class="modal-header">
              <h3>{{ isEditing ? 'Edit Mitra & Klien' : 'Tambah Mitra / Klien Baru' }}</h3>
              <button type="button" class="modal-close" @click="showModal = false">✕</button>
            </div>

            <form @submit.prevent="handleSubmit" class="modal-form">
              <div class="form-row">
                <div class="form-group flex-2">
                  <label class="form-label">Nama Mitra / Klien / Perusahaan <span class="req">*</span></label>
                  <input
                    type="text"
                    v-model="form.name"
                    class="form-input"
                    placeholder="Misal: PT Telkom Indonesia"
                    required
                  />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Ikon / Emoji</label>
                  <input
                    type="text"
                    v-model="form.icon"
                    class="form-input"
                    placeholder="🏢"
                  />
                </div>
              </div>

              <div class="form-row mt-3">
                <div class="form-group flex-1">
                  <label class="form-label">Kategori Mitra</label>
                  <select v-model="form.category" class="form-input">
                    <option value="BUMN">BUMN / Perusahaan Negara</option>
                    <option value="Instansi Pemerintah">Instansi Pemerintah</option>
                    <option value="Swasta">Perusahaan Swasta</option>
                    <option value="Pendidikan & Pesantren">Pendidikan & Pesantren</option>
                    <option value="Creative Agency">Creative Agency / Studio</option>
                    <option value="Komunitas">Komunitas / Organisasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div class="form-group mt-3">
                <label class="form-label">Keterangan Singkat / Bentuk Kerjasama</label>
                <textarea
                  v-model="form.description"
                  class="form-input form-textarea"
                  rows="2"
                  placeholder="Misal: Proyek Video Company Profile Nasional & Aerial Footage"
                ></textarea>
              </div>

              <div class="modal-footer mt-4">
                <button type="button" class="btn btn-ghost" @click="showModal = false">Batal</button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? 'Simpan Perubahan' : 'Tambahkan Mitra' }}
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
const { clients, addClient, updateClient, deleteClient } = usePortfolioStore();

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  name: "",
  category: "BUMN",
  icon: "🏢",
  description: "",
});

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.name = "";
  form.category = "BUMN";
  form.icon = "🏢";
  form.description = "";
  showModal.value = true;
};

const openEditModal = (client) => {
  isEditing.value = true;
  editingId.value = client.id;
  form.name = client.name || "";
  form.category = client.category || "BUMN";
  form.icon = client.icon || "🏢";
  form.description = client.description || "";
  showModal.value = true;
};

const handleSubmit = () => {
  if (!form.name || !form.name.trim()) return;

  if (isEditing.value) {
    updateClient(editingId.value, { ...form, name: form.name.trim() });
    emit("toast", `✓ Mitra "${form.name}" berhasil diperbarui!`);
  } else {
    addClient({ ...form, name: form.name.trim() });
    emit("toast", `✓ Mitra "${form.name}" berhasil ditambahkan & disinkronkan!`);
  }
  showModal.value = false;
};

const confirmDelete = (client) => {
  if (confirm(`Yakin ingin menghapus mitra "${client.name}" dari daftar?`)) {
    deleteClient(client.id);
    emit("toast", `🗑️ Mitra "${client.name}" berhasil dihapus.`);
  }
};
</script>

<style scoped>
.clients-pane {
  padding-bottom: 2rem;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.75rem;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.pane-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
  margin-bottom: 0.5rem;
}

.pane-desc {
  font-size: 0.95rem;
  color: var(--color-text-secondary, #94a3b8);
  max-width: 780px;
  line-height: 1.55;
}

/* Grid Layout */
.clients-admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.client-admin-card {
  background: var(--color-bg-card, rgba(30, 41, 59, 0.7));
  border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.client-admin-card:hover {
  transform: translateY(-3px);
  border-color: rgba(31, 159, 216, 0.4);
}

.client-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.client-icon-bubble {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  background: rgba(31, 159, 216, 0.15);
  border: 1px solid rgba(31, 159, 216, 0.25);
}

.client-meta-tags {
  display: flex;
  gap: 0.5rem;
}

.client-category-badge {
  font-size: 0.72rem;
  padding: 3px 9px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text-secondary, #94a3b8);
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.client-card-info {
  flex: 1;
}

.client-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text-primary, #ffffff);
  margin-bottom: 0.4rem;
}

.client-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted, #94a3b8);
  line-height: 1.45;
}

.client-card-actions {
  display: flex;
  gap: 0.6rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
}

.client-card-actions .btn {
  flex: 1;
  padding: 6px 12px;
  font-size: 0.82rem;
}

.empty-state-box {
  background: var(--color-bg-card, rgba(30, 41, 59, 0.5));
  border: 1px dashed var(--color-border, rgba(255, 255, 255, 0.15));
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  color: var(--color-text-secondary, #94a3b8);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  padding: 1.75rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  color: #fff;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.2rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #cbd5e1;
}

.req {
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 9px 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #1F9FD8;
  box-shadow: 0 0 0 2px rgba(31, 159, 216, 0.2);
}

.form-textarea {
  resize: vertical;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1.25rem; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
