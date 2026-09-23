<template>
  <div class="admin-tab-pane analytics-pane" :class="{ 'modal-mode': isModal }">
    <!-- Header (Stand-alone mode) -->
    <div v-if="!isModal" class="pane-header">
      <div>
        <h2 class="pane-title">📊 Statistik & Analitik Pengunjung</h2>
        <p class="pane-desc">
          Pantau jumlah pengunjung portofolio secara real-time, asal kota/provinsi, alamat IP, perangkat, dan frekuensi kunjungan tanpa spam.
        </p>
      </div>
      <div class="header-actions">
        <button
          class="btn btn-secondary btn-sm refresh-btn"
          :disabled="isLoadingAnalytics"
          @click="refreshData"
          title="Segarkan data analitik dari database Neon Cloud"
        >
          <span class="refresh-icon" :class="{ 'spin-icon': isLoadingAnalytics }">🔄</span>
          <span>{{ isLoadingAnalytics ? 'Memuat Data...' : 'Segarkan Data' }}</span>
        </button>
      </div>
    </div>

    <!-- Modal Top Actions Bar -->
    <div v-else class="modal-top-bar">
      <div class="modal-top-left">
        <span class="modal-badge-info">🛡️ Sistem Anti-Spam Aktif: 1 Pengunjung Unik = 1 Alamat IP</span>
      </div>
      <button
        class="btn btn-secondary btn-sm refresh-btn"
        :disabled="isLoadingAnalytics"
        @click="refreshData"
        title="Segarkan data analitik dari database Neon Cloud"
      >
        <span class="refresh-icon" :class="{ 'spin-icon': isLoadingAnalytics }">🔄</span>
        <span>{{ isLoadingAnalytics ? 'Memuat Data...' : 'Segarkan Data' }}</span>
      </button>
    </div>

    <!-- Anti-Spam Information Alert -->
    <div class="info-alert-card">
      <span class="alert-icon">🛡️</span>
      <div class="alert-content">
        <h4>Sistem Anti-Spam & Akurasi Pengunjung Aktif</h4>
        <p>
          Counter pengunjung publik di luar hanya menghitung <strong>1 pengunjung unik per alamat IP</strong>. 
          Jika pengunjung yang sama membuka website berulang kali, total pengunjung publik <strong>tidak akan bertambah (tidak bisa dispam)</strong>, 
          melainkan riwayat frekuensi kunjungannya dicatat di sini untuk analisis Anda.
        </p>
      </div>
    </div>

    <!-- Stat Cards Overview -->
    <div class="stats-overview-grid">
      <!-- Card 1: Unique Visitors -->
      <div class="stat-card primary-stat">
        <div class="stat-icon-box">👥</div>
        <div class="stat-details">
          <span class="stat-label">Pengunjung Unik (Asli)</span>
          <div class="stat-number-row">
            <span class="stat-value">{{ visitorStats.totalUnique || visitorCount || 0 }}</span>
            <span class="stat-tag tag-green">Anti-Spam</span>
          </div>
          <span class="stat-hint">Dihitung strictly 1x per alamat IP</span>
        </div>
      </div>

      <!-- Card 2: Total Page Views -->
      <div class="stat-card">
        <div class="stat-icon-box">👁️</div>
        <div class="stat-details">
          <span class="stat-label">Total Tampilan Halaman</span>
          <div class="stat-number-row">
            <span class="stat-value">{{ visitorStats.totalViews || visitorCount || 0 }}</span>
            <span class="stat-tag tag-blue">Akumulatif</span>
          </div>
          <span class="stat-hint">Termasuk kunjungan berulang / refresh</span>
        </div>
      </div>

      <!-- Card 3: Today's Visitors -->
      <div class="stat-card">
        <div class="stat-icon-box">⚡</div>
        <div class="stat-details">
          <span class="stat-label">Pengunjung Hari Ini</span>
          <div class="stat-number-row">
            <span class="stat-value">{{ visitorStats.todayUnique || 0 }}</span>
            <span class="stat-tag tag-gold">Hari Ini</span>
          </div>
          <span class="stat-hint">Aktif dalam 24 jam terakhir</span>
        </div>
      </div>

      <!-- Card 4: Top Location -->
      <div class="stat-card">
        <div class="stat-icon-box">📍</div>
        <div class="stat-details">
          <span class="stat-label">Kota Terbanyak</span>
          <div class="stat-number-row">
            <span class="stat-value location-text">{{ topLocationName }}</span>
          </div>
          <span class="stat-hint">{{ topLocationCount ? `${topLocationCount} kunjungan unik` : 'Belum ada data' }}</span>
        </div>
      </div>
    </div>

    <!-- Top Locations Ranking Bar (if available) -->
    <div v-if="topLocationsList.length > 0" class="top-locations-card">
      <div class="top-locations-header">
        <span class="top-loc-icon">🗺️</span>
        <h3 class="top-loc-title">Distribusi Asal Wilayah Pengunjung</h3>
      </div>
      <div class="location-chips-list">
        <div
          v-for="(loc, index) in topLocationsList"
          :key="loc.location"
          class="location-chip"
        >
          <span class="loc-rank">#{{ index + 1 }}</span>
          <span class="loc-name">{{ loc.location }}</span>
          <span class="loc-count">{{ loc.count }} orang</span>
        </div>
      </div>
    </div>

    <!-- Visitor Detail Table Section -->
    <div class="visitor-table-card">
      <div class="table-toolbar">
        <div class="toolbar-left">
          <h3 class="table-title">Riwayat Pengunjung Detail</h3>
          <span class="table-subtitle">
            Menampilkan {{ filteredVisitors.length }} dari {{ (visitorStats.visitors || []).length }} riwayat terbaru
          </span>
        </div>

        <div class="toolbar-search">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            v-model="searchQuery"
            class="form-input search-input"
            placeholder="Cari IP, kota, wilayah, browser, atau OS..."
          />
          <button
            v-if="searchQuery"
            type="button"
            class="clear-search-btn"
            @click="searchQuery = ''"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingAnalytics && (!visitorStats.visitors || visitorStats.visitors.length === 0)" class="table-loading-state">
        <div class="spinner"></div>
        <p>Memuat data pengunjung dari Neon Postgres...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredVisitors.length === 0" class="table-empty-state">
        <span class="empty-emoji">📭</span>
        <h4>Tidak Ada Data Pengunjung</h4>
        <p v-if="searchQuery">Tidak ada pengunjung yang cocok dengan kata kunci "{{ searchQuery }}".</p>
        <p v-else>Belum ada riwayat kunjungan yang tercatat di database.</p>
      </div>

      <!-- Responsive Table -->
      <div v-else class="table-wrapper">
        <table class="visitor-table">
          <thead>
            <tr>
              <th style="width: 50px;">No</th>
              <th>Alamat IP</th>
              <th>Lokasi Asal</th>
              <th>Perangkat & OS</th>
              <th>Browser</th>
              <th>Frekuensi</th>
              <th>Kunjungan Terakhir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, index) in filteredVisitors" :key="v.id || index">
              <!-- No -->
              <td class="text-center font-mono text-muted">
                {{ index + 1 }}
              </td>

              <!-- IP Address -->
              <td>
                <div class="ip-cell">
                  <span class="status-indicator"></span>
                  <span class="ip-text font-mono">{{ v.ipAddress || '-' }}</span>
                  <button
                    type="button"
                    class="copy-mini-btn"
                    @click="copyIp(v.ipAddress)"
                    title="Salin Alamat IP"
                  >
                    📋
                  </button>
                </div>
              </td>

              <!-- Location -->
              <td>
                <div class="location-cell">
                  <span class="loc-flag">📍</span>
                  <div class="loc-info">
                    <span class="loc-city">{{ v.city || 'Indonesia' }}</span>
                    <span v-if="v.region || v.country" class="loc-country">
                      {{ [v.region, v.country].filter(Boolean).join(', ') }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Device & OS -->
              <td>
                <div class="device-cell">
                  <span class="device-icon">{{ getDeviceIcon(v.device) }}</span>
                  <span class="device-name">{{ v.device || 'Desktop' }}</span>
                </div>
              </td>

              <!-- Browser -->
              <td>
                <span class="browser-badge">{{ v.browser || 'Browser' }}</span>
              </td>

              <!-- Frequency -->
              <td>
                <span class="badge-frequency" :class="{ 'freq-active': (v.visitCount || 1) > 1 }">
                  {{ v.visitCount || 1 }}x
                </span>
              </td>

              <!-- Last Visited Time -->
              <td class="time-cell">
                <span class="time-text">{{ formatDate(v.lastVisitedAt) }}</span>
                <span class="relative-time">{{ getRelativeTime(v.lastVisitedAt) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Footer Actions (only if isModal) -->
    <div v-if="isModal" class="modal-footer-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('close')">
        Tutup Jendela Analitik
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { usePortfolioStore } from "@/composables/usePortfolioStore";

const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toast", "close"]);

const {
  visitorCount,
  visitorStats,
  isLoadingAnalytics,
  fetchAnalyticsDetails,
} = usePortfolioStore();

const searchQuery = ref("");

onMounted(async () => {
  await fetchAnalyticsDetails();
});

const refreshData = async () => {
  await fetchAnalyticsDetails();
  emit("toast", "✓ Data analitik pengunjung berhasil diperbarui!");
};

// Top location computed
const topLocationsList = computed(() => {
  return visitorStats.value?.topLocations || [];
});

const topLocationName = computed(() => {
  if (topLocationsList.value.length > 0) {
    return topLocationsList.value[0].location;
  }
  return "Indonesia";
});

const topLocationCount = computed(() => {
  if (topLocationsList.value.length > 0) {
    return topLocationsList.value[0].count;
  }
  return 0;
});

// Filtered visitors
const filteredVisitors = computed(() => {
  const list = visitorStats.value?.visitors || [];
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return list;

  return list.filter((v) => {
    const ip = (v.ipAddress || "").toLowerCase();
    const city = (v.city || "").toLowerCase();
    const region = (v.region || "").toLowerCase();
    const country = (v.country || "").toLowerCase();
    const device = (v.device || "").toLowerCase();
    const browser = (v.browser || "").toLowerCase();

    return (
      ip.includes(q) ||
      city.includes(q) ||
      region.includes(q) ||
      country.includes(q) ||
      device.includes(q) ||
      browser.includes(q)
    );
  });
});

// Device icon helper
const getDeviceIcon = (deviceStr = "") => {
  const d = String(deviceStr).toLowerCase();
  if (d.includes("mobile") || d.includes("iphone") || d.includes("android")) {
    return "📱";
  }
  if (d.includes("tablet") || d.includes("ipad")) {
    return "📟";
  }
  if (d.includes("mac") || d.includes("apple")) {
    return "💻";
  }
  return "🖥️";
};

// Copy IP
const copyIp = (ip) => {
  if (!ip) return;
  navigator.clipboard.writeText(ip);
  emit("toast", `✓ Alamat IP ${ip} disalin!`);
};

// Format Date to Indonesian
const formatDate = (isoString) => {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (err) {
    return String(isoString);
  }
};

// Relative Time Helper
const getRelativeTime = (isoString) => {
  if (!isoString) return "";
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Baru saja";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} mnt lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay} hari lalu`;
  } catch (e) {
    return "";
  }
};
</script>

<style scoped>
.admin-tab-pane {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.admin-tab-pane.modal-mode {
  gap: var(--space-lg);
}

.modal-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.modal-badge-info {
  display: inline-flex;
  align-items: center;
  font-size: var(--font-size-xs);
  color: #34d399;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-md);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
  max-width: 720px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--radius-full);
  padding: 8px 16px;
  font-weight: 600;
}

.spin-icon {
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Info Alert Card */
.info-alert-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  background: rgba(0, 240, 255, 0.05);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
}

.alert-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.alert-content h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-cyan);
  margin-bottom: 4px;
}

.alert-content p {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

/* Stat Overview Grid */
.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-md);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}

.stat-card.primary-stat {
  border-color: rgba(0, 240, 255, 0.3);
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.06), rgba(15, 23, 42, 0.8));
}

.stat-icon-box {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}

.primary-stat .stat-icon-box {
  background: rgba(0, 240, 255, 0.12);
}

.stat-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-text-light);
  line-height: 1.2;
}

.location-text {
  font-size: var(--font-size-lg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.stat-tag {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  font-weight: 700;
  text-transform: uppercase;
}

.tag-green {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.tag-blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.tag-gold {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.stat-hint {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

/* Top Locations Card */
.top-locations-card {
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.top-locations-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-loc-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-light);
  margin: 0;
}

.location-chips-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.location-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  padding: 4px 12px;
  font-size: var(--font-size-xs);
}

.loc-rank {
  color: var(--color-cyan);
  font-weight: 700;
}

.loc-name {
  color: var(--color-text-light);
  font-weight: 500;
}

.loc-count {
  background: rgba(0, 240, 255, 0.12);
  color: var(--color-cyan);
  padding: 1px 6px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.7rem;
}

/* Visitor Table Card */
.visitor-table-card {
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.table-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-light);
  margin: 0 0 2px 0;
}

.table-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.toolbar-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 340px;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 0.9rem;
  pointer-events: none;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding-left: 36px;
  padding-right: 32px;
  height: 38px;
  font-size: var(--font-size-xs);
  border-radius: var(--radius-full);
  background: rgba(15, 23, 42, 0.6);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 4px;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.visitor-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.visitor-table th {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px 16px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
}

.visitor-table td {
  padding: 14px 16px;
  font-size: var(--font-size-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  vertical-align: middle;
}

.visitor-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

/* Cells */
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.text-muted {
  color: var(--color-text-muted);
}

.text-center {
  text-align: center;
}

.ip-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  flex-shrink: 0;
}

.ip-text {
  font-weight: 600;
  color: var(--color-cyan);
}

.copy-mini-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  font-size: 0.85rem;
  padding: 2px 4px;
}

.copy-mini-btn:hover {
  opacity: 1;
}

.location-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loc-flag {
  font-size: 1.1rem;
}

.loc-info {
  display: flex;
  flex-direction: column;
}

.loc-city {
  font-weight: 600;
  color: var(--color-text-light);
}

.loc-country {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.device-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.device-name {
  color: var(--color-text-light);
  font-size: var(--font-size-xs);
}

.browser-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--color-text-light);
  white-space: nowrap;
}

.badge-frequency {
  display: inline-block;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.badge-frequency.freq-active {
  background: rgba(0, 240, 255, 0.12);
  border-color: rgba(0, 240, 255, 0.3);
  color: var(--color-cyan);
}

.time-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;
}

.time-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.relative-time {
  font-size: 0.72rem;
  color: var(--color-cyan);
}

/* Loading & Empty States */
.table-loading-state,
.table-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl) var(--space-md);
  text-align: center;
  gap: var(--space-sm);
}

.table-loading-state p,
.table-empty-state p {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.empty-emoji {
  font-size: 2.5rem;
}

.table-empty-state h4 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-light);
  margin: 0;
}

@media (max-width: 768px) {
  .stats-overview-grid {
    grid-template-columns: 1fr 1fr;
  }

  .table-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar-search {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .stats-overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
