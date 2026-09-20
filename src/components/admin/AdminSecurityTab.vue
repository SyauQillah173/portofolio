<template>
  <div class="admin-tab-pane security-pane">
    <div class="pane-header">
      <div>
        <h2 class="pane-title">🔐 Keamanan & Ganti Password Admin</h2>
        <p class="pane-desc">
          Ubah kata sandi Portal Admin Anda. Password disimpan secara aman di database Neon Postgres cloud dan otomatis berlaku di semua perangkat (Laptop & HP).
        </p>
      </div>
    </div>

    <div class="security-card-box">
      <div class="security-info-alert">
        <span class="alert-icon">🛡️</span>
        <div>
          <h4>Privasi Terjamin</h4>
          <p>
            Petunjuk password default pada halaman login publik telah dihapus. Hanya Anda yang mengetahui password ini yang dapat mengakses portal administrasi.
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="security-form mt-4">
        <!-- Current Password -->
        <div class="form-group">
          <label class="form-label">Password Saat Ini <span class="req">*</span></label>
          <div class="password-input-box">
            <input
              :type="showOld ? 'text' : 'password'"
              v-model="form.oldPassword"
              class="form-input"
              placeholder="Masukkan password saat ini..."
              required
            />
            <button type="button" class="eye-btn" @click="showOld = !showOld">
              {{ showOld ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div class="form-group mt-3">
          <label class="form-label">Password Baru (Minimal 5 karakter) <span class="req">*</span></label>
          <div class="password-input-box">
            <input
              :type="showNew ? 'text' : 'password'"
              v-model="form.newPassword"
              class="form-input"
              placeholder="Masukkan password baru..."
              minlength="5"
              required
            />
            <button type="button" class="eye-btn" @click="showNew = !showNew">
              {{ showNew ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Confirm New Password -->
        <div class="form-group mt-3">
          <label class="form-label">Konfirmasi Password Baru <span class="req">*</span></label>
          <div class="password-input-box">
            <input
              :type="showConfirm ? 'text' : 'password'"
              v-model="form.confirmPassword"
              class="form-input"
              placeholder="Ketik ulang password baru..."
              minlength="5"
              required
            />
            <button type="button" class="eye-btn" @click="showConfirm = !showConfirm">
              {{ showConfirm ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Feedback Alert -->
        <div v-if="feedback.message" :class="['feedback-msg mt-3', feedback.isError ? 'err' : 'ok']">
          <span>{{ feedback.isError ? '⚠️' : '✓' }}</span>
          <span>{{ feedback.message }}</span>
        </div>

        <button type="submit" class="btn btn-primary btn-lg mt-4" :disabled="isSaving">
          <span v-if="!isSaving">Simpan Password Baru ke Cloud</span>
          <span v-else class="btn-loading">
            <span class="spinner spinner-sm"></span>
            Menyimpan ke Neon...
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { usePortfolioStore } from "@/composables/usePortfolioStore";

const emit = defineEmits(["toast"]);
const { changePassword } = usePortfolioStore();

const isSaving = ref(false);
const showOld = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const form = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const feedback = reactive({
  message: "",
  isError: false,
});

const handleSubmit = async () => {
  feedback.message = "";

  if (form.newPassword !== form.confirmPassword) {
    feedback.message = "Konfirmasi password baru tidak cocok!";
    feedback.isError = true;
    return;
  }

  if (form.newPassword.length < 5) {
    feedback.message = "Password baru minimal 5 karakter!";
    feedback.isError = true;
    return;
  }

  isSaving.value = true;
  try {
    const res = await changePassword(form.oldPassword, form.newPassword);
    feedback.message = res.message;
    feedback.isError = !res.success;

    if (res.success) {
      emit("toast", "✓ " + res.message);
      form.oldPassword = "";
      form.newPassword = "";
      form.confirmPassword = "";
    }
  } catch (err) {
    feedback.message = "Gagal memperbarui password: " + err.message;
    feedback.isError = true;
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

.security-card-box {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  max-width: 580px;
}

.security-info-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(31, 159, 216, 0.1);
  border: 1px solid rgba(31, 159, 216, 0.25);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
}

.alert-icon {
  font-size: 22px;
}

.security-info-alert h4 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-primary-light);
  margin-bottom: 2px;
}

.security-info-alert p {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.password-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-box .form-input {
  padding-right: 44px;
  width: 100%;
}

.eye-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.feedback-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.feedback-msg.err {
  background: rgba(239, 68, 68, 0.15);
  color: #F87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.feedback-msg.ok {
  background: rgba(16, 185, 129, 0.15);
  color: #34D399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
</style>
