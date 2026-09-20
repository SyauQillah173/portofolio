<template>
  <div class="admin-login-page">
    <div class="login-container">
      <!-- Back to public site button -->
      <a href="#home" class="back-link" @click.prevent="$emit('back')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Kembali ke Website</span>
      </a>

      <!-- Login Card -->
      <div class="login-card">
        <div class="login-header">
          <div class="lock-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h1 class="login-title">Portal Admin</h1>
          <p class="login-subtitle">
            Masuk untuk mengelola dan memperbarui data portofolio secara instan.
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Password Input -->
          <div class="form-group">
            <label for="admin-password" class="form-label">Password Admin</label>
            <div class="password-input-wrapper">
              <input
                id="admin-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Masukkan password admin..."
                autocomplete="current-password"
                required
                autofocus
              />
              <button
                type="button"
                class="toggle-password-btn"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Sembunyikan password' : 'Lihat password'"
              >
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <Transition name="fade">
            <div v-if="errorMessage" class="error-alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary btn-lg btn-full" :disabled="isLoading">
            <span v-if="!isLoading">Masuk ke Dashboard</span>
            <span v-else class="btn-loading">
              <span class="spinner spinner-sm"></span>
              Memverifikasi...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePortfolioStore } from "@/composables/usePortfolioStore";

const emit = defineEmits(["login-success", "back"]);
const { login } = usePortfolioStore();

const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const handleLogin = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  // Short delay for smooth UI feedback
  await new Promise((r) => setTimeout(r, 400));

  const result = await login(password.value);
  isLoading.value = false;

  if (result.success) {
    emit("login-success");
  } else {
    errorMessage.value = result.message || "Password salah! Silakan coba lagi.";
  }
};
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  background: radial-gradient(
    circle at center,
    rgba(31, 159, 216, 0.12) 0%,
    var(--color-bg-darker) 70%
  );
}

.login-container {
  width: 100%;
  max-width: 440px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-lg);
  transition: all var(--transition-fast);
}

.back-link svg {
  width: 18px;
  height: 18px;
}

.back-link:hover {
  color: var(--color-primary-light);
  transform: translateX(-3px);
}

.login-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(31, 159, 216, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.lock-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  background: rgba(31, 159, 216, 0.15);
  border: 1px solid rgba(31, 159, 216, 0.3);
  color: var(--color-primary);
  margin-bottom: var(--space-md);
  box-shadow: 0 0 20px rgba(31, 159, 216, 0.3);
}

.lock-icon-badge svg {
  width: 28px;
  height: 28px;
}

.login-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  margin-bottom: var(--space-xs);
}

.login-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: var(--line-height-normal);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-light);
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .form-input {
  width: 100%;
  padding-right: 44px;
}

.toggle-password-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: color var(--transition-fast);
}

.toggle-password-btn:hover {
  color: var(--color-text-light);
}

.toggle-password-btn svg {
  width: 20px;
  height: 20px;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  color: #F87171;
  font-size: var(--font-size-sm);
}

.error-alert svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.login-hint {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.login-hint code {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-primary-light);
  font-family: var(--font-family-mono);
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}
</style>
