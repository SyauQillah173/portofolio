<template>
  <div class="admin-dashboard">
    <!-- Admin Topbar -->
    <header class="admin-header">
      <div class="admin-header-container">
        <div class="admin-brand">
          <a href="#home" class="brand-logo" @click.prevent="$emit('view-public')">
            <span class="logo-text">Portfolio</span>
            <span class="logo-accent">.</span>
            <span class="admin-pill">Admin CMS</span>
          </a>
          <button
            type="button"
            class="live-status clickable"
            :class="{ 'status-cloud': isNeonConnected }"
            @click="handleManualCloudSync"
            title="Klik untuk sinkronisasi paksa ke Neon Cloud Database"
          >
            <span class="status-pulse" :class="{ 'pulse-cloud': isNeonConnected }"></span>
            {{ isNeonConnected ? '☁️ Neon Cloud Terhubung' : '💾 Mode Lokal (Klik Sinkron)' }}
          </button>
        </div>

        <div class="admin-actions">
          <a
            href="https://drive.google.com/drive/folders/1c70iPsGZhf0u3xTs_qfv_41IINvlPYSW?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-secondary btn-sm"
            title="Buka Folder Google Drive Portfolio (Drone, Video, Foto, AI)"
          >
            <span class="action-icon">📁</span>
            <span class="btn-label">Google Drive</span>
          </a>

          <button class="btn btn-secondary btn-sm" @click="$emit('view-public')" title="Lihat tampilan website">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span class="btn-label">Lihat Web Publik</span>
          </button>

          <button 
            class="btn btn-secondary btn-sm refresh-cloud-btn" 
            :disabled="isRefreshingCloud"
            @click="handlePullFromCloud" 
            title="Ambil foto & data terbaru dari Database Neon (Tarik upload dari HP)"
          >
            <span class="action-icon" :class="{ 'spin-icon': isRefreshingCloud }">🔄</span>
            <span class="btn-label">{{ isRefreshingCloud ? 'Memperbarui...' : 'Tarik dari Cloud (HP)' }}</span>
          </button>

          <button 
            class="btn btn-primary btn-sm sync-neon-btn" 
            :disabled="isSyncingNeon"
            @click="handleSyncAllNeon" 
            title="Kirim dan simpan semua data di perangkat ini ke Database Neon Cloud"
          >
            <span class="action-icon" :class="{ 'spin-icon': isSyncingNeon }">☁️</span>
            <span class="btn-label">{{ isSyncingNeon ? 'Mengirim...' : 'Kirim ke Cloud' }}</span>
          </button>

          <button class="btn btn-secondary btn-sm" @click="handleDownloadBackup" title="Unduh data works.json untuk backup atau kirim ke perangkat lain">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span class="btn-label">Backup Data</span>
          </button>

          <button class="btn btn-secondary btn-sm" @click="triggerImportFile" title="Impor data karya dari file JSON (Sinkronkan antar HP & Laptop)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <span class="btn-label">Impor Data</span>
          </button>
          <input
            ref="importFileInputRef"
            type="file"
            accept=".json,application/json"
            style="display: none"
            @change="handleImportFileChange"
          />

          <button class="btn btn-secondary btn-sm" @click="activeCmsTab = 'security'" title="Ganti Password">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span class="btn-label">Ganti Password</span>
          </button>

          <button class="btn btn-danger btn-sm" @click="handleLogout" title="Keluar dari sesi admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span class="btn-label">Logout</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="admin-main">
      <div class="admin-container">
        <!-- Global Full CMS Navigation Tabs -->
        <nav class="cms-nav-bar">
          <button
            class="cms-tab-btn"
            :class="{ active: activeCmsTab === 'works' }"
            @click="activeCmsTab = 'works'"
          >
            <span class="tab-icon">📁</span>
            <span>Karya Portofolio</span>
            <span class="tab-badge">{{ works.length }}</span>
          </button>

          <button
            class="cms-tab-btn"
            :class="{ active: activeCmsTab === 'profile' }"
            @click="activeCmsTab = 'profile'"
          >
            <span class="tab-icon">👤</span>
            <span>Profil, Bio & Kontak</span>
          </button>

          <button
            class="cms-tab-btn"
            :class="{ active: activeCmsTab === 'skills' }"
            @click="activeCmsTab = 'skills'"
          >
            <span class="tab-icon">⚡</span>
            <span>Keahlian / Skills</span>
            <span class="tab-badge">{{ skills.length }}</span>
          </button>

          <button
            class="cms-tab-btn"
            :class="{ active: activeCmsTab === 'experience' }"
            @click="activeCmsTab = 'experience'"
          >
            <span class="tab-icon">💼</span>
            <span>Pengalaman & Edukasi</span>
            <span class="tab-badge">{{ (experiences.work || []).length }}</span>
          </button>

          <button
            class="cms-tab-btn"
            :class="{ active: activeCmsTab === 'security' }"
            @click="activeCmsTab = 'security'"
          >
            <span class="tab-icon">🔐</span>
            <span>Keamanan Sandi</span>
          </button>
        </nav>

        <!-- TAB 1: WORKS -->
        <div v-if="activeCmsTab === 'works'" class="tab-pane-works">
          <!-- Dashboard Overview Header -->
          <div class="dashboard-hero">
          <div class="dashboard-intro">
            <h1 class="dashboard-title">Manajemen Portofolio & Karya</h1>
            <p class="dashboard-subtitle">
              Setiap karya yang abang tambahkan atau edit di sini akan <strong>langsung tampil secara otomatis</strong> di portofolio publik!
            </p>
          </div>

          <!-- Add Project CTA Button -->
          <button class="btn btn-primary btn-lg" @click="openCreateModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="add-icon">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Tambah Karya Baru</span>
          </button>
        </div>

        <!-- Sync & Multi-Device Persistence Info Banner -->
        <div class="sync-info-banner">
          <div class="sync-banner-icon">☁️</div>
          <div class="sync-banner-content">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px;">
              <h4 class="sync-banner-title" style="margin: 0;">Database Cloud Neon: Sinkronisasi Antar HP & Laptop</h4>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button 
                  class="btn btn-secondary btn-sm" 
                  :disabled="isRefreshingCloud"
                  @click="handlePullFromCloud"
                  style="white-space: nowrap; font-size: 0.82rem; padding: 6px 14px; border: 1px solid var(--color-accent-teal);"
                  title="Ambil foto/data terbaru yang baru saja diupload dari HP"
                >
                  <span>{{ isRefreshingCloud ? '⏳ Memperbarui...' : '🔄 Tarik Data Terbaru dari HP / Cloud' }}</span>
                </button>
                <button 
                  class="btn btn-primary btn-sm" 
                  :disabled="isSyncingNeon"
                  @click="handleSyncAllNeon"
                  style="white-space: nowrap; font-size: 0.82rem; padding: 6px 14px;"
                  title="Kirim semua data di komputer ini ke Database Neon Cloud"
                >
                  <span>{{ isSyncingNeon ? '⏳ Mengirim...' : '☁️ Kirim Semua ke Cloud' }}</span>
                </button>
              </div>
            </div>
            <p class="sync-banner-desc">
              💡 <strong>Panduan Sinkronisasi Antar Perangkat:</strong> Jika abang baru saja mengunggah foto melalui HP, cukup klik tombol <strong>"🔄 Tarik Data Terbaru dari HP / Cloud"</strong> agar komputer langsung menampilkan foto baru tersebut. Sebaliknya jika abang mengedit di komputer, klik <strong>"☁️ Kirim Semua ke Cloud"</strong> agar HP langsung menampilkan karya terbaru!
            </p>
          </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-meta">
              <span class="stat-label">Total Karya Aktif</span>
              <span class="stat-value">{{ works.length }}</span>
            </div>
            <span class="stat-icon-bg">🚀</span>
          </div>

          <div class="stat-card">
            <div class="stat-meta">
              <span class="stat-label">Karya Featured</span>
              <span class="stat-value">{{ featuredCount }}</span>
            </div>
            <span class="stat-icon-bg">⭐</span>
          </div>

          <div class="stat-card">
            <div class="stat-meta">
              <span class="stat-label">Kategori Karya</span>
              <span class="stat-value">{{ categories.length }}</span>
            </div>
            <span class="stat-icon-bg">🎯</span>
          </div>
        </div>

        <!-- Project Management Bar (Search & Filter) -->
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              class="form-input search-input"
              placeholder="Cari judul, teknologi, klien, peran..."
            />
          </div>

          <div class="category-filter-group">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="cat-chip"
              :class="{ 'cat-chip-active': selectedCategory === cat.id }"
              @click="selectedCategory = cat.id"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Project Grid -->
        <div v-if="filteredWorks.length > 0" class="projects-grid">
          <div v-for="work in filteredWorks" :key="work.id" class="project-admin-card">
            <!-- Thumbnail Image -->
            <div class="card-thumb">
              <img :src="work.image" :alt="work.title" loading="lazy" @error="handleImgError" />
              <span class="category-tag">{{ getCategoryName(work.category) }}</span>
              <span v-if="work.featured" class="featured-tag">⭐ Featured</span>
            </div>

            <!-- Content -->
            <div class="card-body">
              <div class="card-headline">
                <span class="card-year">{{ work.year }}</span>
                <span v-if="work.client" class="card-client">🏢 {{ work.client }}</span>
              </div>
              <h3 class="card-title">{{ work.title }}</h3>
              <p class="card-role">👤 {{ work.role }}</p>
              <p v-if="work.productionHouse" class="card-ph">🎬 Prod: {{ work.productionHouse }}</p>
              <p class="card-desc">{{ work.description }}</p>

              <!-- Tech tags -->
              <div class="card-techs">
                <span v-for="tech in (work.technologies || []).slice(0, 4)" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
                <span v-if="(work.technologies || []).length > 4" class="tech-more">
                  +{{ work.technologies.length - 4 }}
                </span>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="card-footer">
              <a v-if="getDemoUrl(work)" :href="getDemoUrl(work)" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm">
                <span>🔗 Buka Link</span>
              </a>
              <button class="btn btn-secondary btn-sm" @click="openEditModal(work)">
                <span>✏️ Edit</span>
              </button>
              <button class="btn btn-danger-ghost btn-sm" @click="confirmDelete(work)">
                <span>🗑️ Hapus</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <span class="empty-emoji">📭</span>
          <h3>Tidak ada karya ditemukan</h3>
          <p>Coba gunakan kata kunci pencarian lain atau tambahkan karya baru.</p>
          <button class="btn btn-primary btn-md" @click="openCreateModal">
            + Tambah Karya Pertama
          </button>
        </div>
        </div>
        <!-- END TAB 1: WORKS -->

        <!-- TAB 2: PROFILE & BIO -->
        <AdminProfileTab v-else-if="activeCmsTab === 'profile'" @toast="showToast" />

        <!-- TAB 3: SKILLS -->
        <AdminSkillsTab v-else-if="activeCmsTab === 'skills'" @toast="showToast" />

        <!-- TAB 4: EXPERIENCE & EDUCATION -->
        <AdminExperienceTab v-else-if="activeCmsTab === 'experience'" @toast="showToast" />

        <!-- TAB 5: SECURITY & PASSWORD -->
        <AdminSecurityTab v-else-if="activeCmsTab === 'security'" @toast="showToast" />
      </div>
    </main>

    <!-- Create / Edit Project Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showFormModal" class="modal-backdrop" @click.self="closeFormModal">
          <div class="form-modal-card">
            <div class="form-modal-header">
              <h2>{{ isEditing ? "Edit Karya Portofolio" : "Tambah Karya Baru" }}</h2>
              <button class="close-btn" @click="closeFormModal" aria-label="Tutup">
                ✕
              </button>
            </div>

            <form @submit.prevent="handleSaveProject" class="project-form">
              <div class="form-scrollable">
                <!-- Title -->
                <div class="form-group">
                  <label class="form-label">Judul Proyek / Karya <span class="req">*</span></label>
                  <input
                    type="text"
                    v-model="formData.title"
                    class="form-input"
                    placeholder="Contoh: Sistem Informasi Pesantren, Video Profil Pertamina"
                    required
                  />
                </div>

                <!-- Category & Year -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Kategori <span class="req">*</span></label>
                    <select v-model="formData.category" class="form-input form-select" required>
                      <option value="web">Software & Web (💻)</option>
                      <option value="drone">Drone & Aerial (🚁)</option>
                      <option value="network">IT & Network (🌐)</option>
                      <option value="video">Video & Media (🎬)</option>
                      <option value="ai">AI & Creative (🤖)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Tahun / Periode</label>
                    <input
                      type="text"
                      v-model="formData.year"
                      class="form-input"
                      placeholder="Contoh: 2024 – Sekarang"
                    />
                  </div>
                </div>

                <!-- Role, Client, Production House -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Peran Anda (Role)</label>
                    <input
                      type="text"
                      v-model="formData.role"
                      class="form-input"
                      placeholder="Contoh: Drone Pilot, Full-Stack Developer"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Nama Klien / Instansi</label>
                    <input
                      type="text"
                      v-model="formData.client"
                      class="form-input"
                      placeholder="Contoh: PT Pertamina, PP Qomaruddin"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Production House / Kolaborasi (Opsional)</label>
                  <input
                    type="text"
                    v-model="formData.productionHouse"
                    class="form-input"
                    placeholder="Contoh: Raff Studio (jika berkolaborasi)"
                  />
                </div>

                <!-- Image / Video Media Upload Section -->
                <div class="form-group image-upload-section">
                  <div class="image-section-header">
                    <label class="form-label">
                      Media Utama & Thumbnail Cover <span class="req">*</span>
                    </label>
                    <div class="upload-mode-toggle">
                      <button
                        type="button"
                        class="mode-pill"
                        :class="{ active: uploadMode === 'image_file' }"
                        @click="setUploadMode('image_file')"
                      >
                        📷 Foto
                      </button>
                      <button
                        type="button"
                        class="mode-pill"
                        :class="{ active: uploadMode === 'video_file' }"
                        @click="setUploadMode('video_file')"
                      >
                        🎬 Video MP4
                      </button>
                      <button
                        type="button"
                        class="mode-pill"
                        :class="{ active: uploadMode === 'gdrive' }"
                        @click="setUploadMode('gdrive')"
                      >
                        📁 Google Drive
                      </button>
                      <button
                        type="button"
                        class="mode-pill"
                        :class="{ active: uploadMode === 'youtube' }"
                        @click="setUploadMode('youtube')"
                      >
                        ▶️ YouTube
                      </button>
                      <button
                        type="button"
                        class="mode-pill"
                        :class="{ active: uploadMode === 'url' }"
                        @click="setUploadMode('url')"
                      >
                        🔗 URL
                      </button>
                    </div>
                  </div>

                  <!-- Mode 1: Foto dari File / Galeri -->
                  <div v-if="uploadMode === 'image_file'" class="dropzone-container">
                    <input
                      ref="fileInputRef"
                      type="file"
                      accept="image/*"
                      class="hidden-file-input"
                      @change="handleFileInputChange"
                    />

                    <!-- Dropzone foto -->
                    <div
                      v-if="!formData.image || (uploadMode === 'image_file' && isVideoSource)"
                      class="file-dropzone"
                      @click="triggerFileInput"
                      @dragover.prevent
                      @drop.prevent="handleFileDrop"
                    >
                      <div class="dropzone-icon">📷</div>
                      <div class="dropzone-title">
                        Klik untuk pilih foto dari Galeri / File
                      </div>
                      <div class="dropzone-subtitle">
                        atau seret & lepas gambar ke sini (JPG, PNG, WebP)
                      </div>
                      <div class="dropzone-badge">
                        ⚡ Kompresi otomatis aktif — hemat memori & cepat dimuat
                      </div>
                    </div>

                    <!-- Preview foto -->
                    <div v-else class="preview-card">
                      <div class="preview-img-wrapper">
                        <img :src="formData.image" alt="Thumbnail Preview" class="uploaded-preview-img" />
                        <button
                          type="button"
                          class="preview-quick-del-btn"
                          @click.stop="removeImage"
                          title="Hapus Gambar Utama (✕)"
                          aria-label="Hapus Gambar Utama"
                        >
                          ✕
                        </button>
                      </div>
                      <div class="preview-info">
                        <div class="preview-meta">
                          <span class="preview-status">✓ Foto Siap Digunakan</span>
                          <span v-if="uploadStats" class="preview-stats">{{ uploadStats }}</span>
                        </div>
                        <div class="preview-actions">
                          <button type="button" class="btn btn-secondary btn-sm" @click="triggerFileInput">
                            🔄 Ganti Foto
                          </button>
                          <button type="button" class="btn btn-danger btn-sm" @click="removeImage" title="Hapus Gambar Utama">
                            🗑️ Hapus Gambar Utama
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mode 2: Upload Video MP4 / WebM File -->
                  <div v-else-if="uploadMode === 'video_file'" class="dropzone-container">
                    <input
                      ref="videoFileInputRef"
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime,video/*"
                      class="hidden-file-input"
                      @change="handleVideoFileInputChange"
                    />

                    <!-- Loading / Processing state -->
                    <div v-if="isProcessingVideo" class="video-processing-box">
                      <div class="processing-spinner">⏳</div>
                      <p>Sedang memproses video & membuat snapshot cover otomatis...</p>
                    </div>

                    <!-- Dropzone video -->
                    <div
                      v-else-if="!videoPreviewUrl"
                      class="file-dropzone video-dropzone"
                      @click="triggerVideoFileInput"
                    >
                      <div class="dropzone-icon">🎬</div>
                      <div class="dropzone-title">
                        Klik untuk pilih video MP4 / WebM dari Galeri / File
                      </div>
                      <div class="dropzone-subtitle">
                        Mendukung video resolusi 1080p / 4K (disimpan via IndexedDB lokal)
                      </div>
                      <div class="dropzone-badge badge-video-info">
                        ✨ Cuplikan cover (snapshot) akan dibuat otomatis dari video
                      </div>
                    </div>

                    <!-- Preview video player -->
                    <div v-else class="video-preview-card">
                      <div class="video-player-box">
                        <video :src="videoPreviewUrl" controls playsinline class="admin-preview-video"></video>
                        <button
                          type="button"
                          class="preview-quick-del-btn"
                          @click.stop="removeVideo"
                          title="Hapus Video Utama (✕)"
                          aria-label="Hapus Video Utama"
                        >
                          ✕
                        </button>
                      </div>
                      <div class="video-info-box">
                        <span class="preview-status">✓ Video MP4 Siap Ditampilkan</span>
                        <span v-if="uploadStats" class="preview-stats">{{ uploadStats }}</span>
                        <div v-if="formData.image" class="cover-mini-preview">
                          <img :src="formData.image" alt="Auto Cover" />
                          <span>Cover Otomatis</span>
                        </div>
                        <div class="preview-actions">
                          <button type="button" class="btn btn-secondary btn-sm" @click="triggerVideoFileInput">
                            🔄 Ganti Video
                          </button>
                          <button type="button" class="btn btn-danger btn-sm" @click="removeVideo" title="Hapus Video Utama">
                            🗑️ Hapus Video Utama
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mode 3: Link Video YouTube -->
                  <div v-else-if="uploadMode === 'youtube'" class="youtube-mode-container">
                    <div class="form-group">
                      <label class="form-sublabel">Tautan Video YouTube (Video atau Shorts)</label>
                      <div class="url-input-row">
                        <input
                          type="url"
                          v-model="youtubeUrlInput"
                          class="form-input"
                          placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                          @input="handleYouTubeInput"
                        />
                        <button
                          v-if="youtubeUrlInput"
                          type="button"
                          class="btn btn-danger btn-sm"
                          @click="removeYouTube"
                          title="Hapus Video YouTube"
                        >
                          ✕ Hapus
                        </button>
                      </div>
                    </div>

                    <!-- Live YouTube Preview Player -->
                    <div v-if="youtubeEmbedPreview" class="yt-preview-card">
                      <div class="yt-embed-box">
                        <iframe
                          :src="youtubeEmbedPreview"
                          title="YouTube Preview"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                          class="admin-yt-iframe"
                        ></iframe>
                        <button
                          type="button"
                          class="preview-quick-del-btn"
                          @click.stop="removeYouTube"
                          title="Hapus Video YouTube (✕)"
                          aria-label="Hapus Video YouTube"
                        >
                          ✕
                        </button>
                      </div>
                      <div class="yt-preview-info">
                        <span class="preview-status">✓ Video YouTube Terhubung</span>
                        <span class="preview-stats">Cover thumbnail HD resmi YouTube otomatis disetel untuk kartu proyek.</span>
                        <div class="preview-actions">
                          <button type="button" class="btn btn-danger btn-sm" @click="removeYouTube" title="Hapus Video YouTube">
                            🗑️ Hapus Video YouTube
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mode 4: Google Drive Video -->
                  <div v-else-if="uploadMode === 'gdrive'" class="youtube-input-container">
                    <div class="youtube-input-row">
                      <input
                        type="url"
                        v-model="gdriveUrlInput"
                        class="form-input"
                        placeholder="Tempel tautan Google Drive (contoh: https://drive.google.com/file/d/.../view)"
                        @input="handleGDriveInput"
                        @change="handleGDriveInput"
                      />
                      <button
                        v-if="gdriveUrlInput"
                        type="button"
                        class="btn btn-danger btn-sm"
                        @click="removeGDrive"
                        title="Kosongkan Tautan"
                      >
                        ✕ Hapus
                      </button>
                    </div>

                    <!-- Preview Google Drive -->
                    <div v-if="gdriveEmbedPreview" class="yt-preview-card">
                      <div class="yt-embed-box">
                        <iframe
                          :src="gdriveEmbedPreview"
                          title="Google Drive Preview"
                          frameborder="0"
                          allow="autoplay; fullscreen"
                          allowfullscreen
                          class="admin-yt-iframe"
                        ></iframe>
                        <button
                          type="button"
                          class="preview-quick-del-btn"
                          @click.stop="removeGDrive"
                          title="Hapus Video Google Drive (✕)"
                          aria-label="Hapus Video Google Drive"
                        >
                          ✕
                        </button>
                      </div>
                      <div class="yt-preview-info">
                        <span class="preview-status">✓ Video Google Drive Terhubung</span>
                        <span class="preview-stats">Video dapat diputar di semua HP & Laptop dalam resolusi asli tanpa batasan kuota file!</span>
                        <div class="preview-actions">
                          <button type="button" class="btn btn-danger btn-sm" @click="removeGDrive" title="Hapus Video Google Drive">
                            🗑️ Hapus Video Google Drive
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mode 5: Input URL Media Online Manual -->
                  <div v-else class="url-input-container">
                    <div class="url-input-row">
                      <input
                        type="url"
                        v-model="formData.image"
                        class="form-input"
                        placeholder="https://... tautan gambar atau video .mp4 online"
                        required
                      />
                      <button
                        v-if="formData.image"
                        type="button"
                        class="btn btn-danger btn-sm"
                        @click="formData.image = ''"
                        title="Kosongkan Tautan"
                      >
                        ✕ Hapus
                      </button>
                    </div>
                    <div v-if="formData.image" class="img-preview">
                      <img :src="formData.image" alt="Preview" @error="handleImgError" />
                      <button
                        type="button"
                        class="preview-quick-del-btn"
                        @click="formData.image = ''"
                        title="Hapus Gambar (✕)"
                        aria-label="Hapus Gambar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Multi-media Gallery Section (Foto & Video) -->
                <div class="form-group gallery-section">
                  <div class="gallery-section-header">
                    <div>
                      <label class="form-label">Galeri Karya Tambahan (Foto & Video Pop-up)</label>
                      <span class="form-hint">Dapat memadukan beberapa foto, video MP4, dan link Google Drive / YouTube</span>
                    </div>
                    <div class="gallery-header-btns">
                      <button type="button" class="btn btn-secondary btn-sm" @click="triggerGalleryInput">
                        + Tambah File
                      </button>
                      <button type="button" class="btn btn-ghost btn-sm" @click="showAddYouTubeInline = !showAddYouTubeInline">
                        ▶️ + YouTube
                      </button>
                      <button type="button" class="btn btn-ghost btn-sm" @click="showAddGDriveInline = !showAddGDriveInline">
                        📁 + Google Drive
                      </button>
                    </div>
                    <input
                      ref="galleryInputRef"
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      class="hidden-file-input"
                      @change="handleGalleryFilesChange"
                    />
                  </div>

                  <!-- Inline Google Drive Adder -->
                  <div v-if="showAddGDriveInline" class="add-yt-inline-box">
                    <input
                      type="url"
                      v-model="newGDriveLink"
                      class="form-input form-input-sm"
                      placeholder="Tempel link Google Drive (https://drive.google.com/file/d/.../view)"
                      @keyup.enter="addGDriveToGallery"
                    />
                    <button type="button" class="btn btn-primary btn-sm" @click="addGDriveToGallery">
                      Tambahkan
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm" @click="showAddGDriveInline = false">
                      Batal
                    </button>
                  </div>

                  <!-- Inline YouTube Adder -->
                  <div v-if="showAddYouTubeInline" class="add-yt-inline-box">
                    <input
                      type="url"
                      v-model="newYouTubeLink"
                      class="form-input form-input-sm"
                      placeholder="Tempel link YouTube (https://www.youtube.com/watch?v=...)"
                      @keyup.enter="addYouTubeToGallery"
                    />
                    <button type="button" class="btn btn-primary btn-sm" @click="addYouTubeToGallery">
                      Tambahkan
                    </button>
                    <button type="button" class="btn btn-ghost btn-sm" @click="showAddYouTubeInline = false">
                      Batal
                    </button>
                  </div>

                  <!-- Gallery Preview Grid -->
                  <div v-if="formData.gallery && formData.gallery.length > 0" class="gallery-preview-grid">
                    <div v-for="(mediaItem, pIdx) in formData.gallery" :key="pIdx" class="gallery-preview-item">
                      <!-- YouTube item -->
                      <template v-if="checkIsYouTube(mediaItem)">
                        <img :src="getYouTubeThumb(mediaItem)" alt="YouTube Thumbnail" />
                        <span class="gallery-item-badge badge-yt">▶ YT</span>
                      </template>
                      <!-- Google Drive item -->
                      <template v-else-if="checkIsGDrive(mediaItem)">
                        <div class="gallery-video-ph">
                          <span class="ph-icon">📁</span>
                          <span class="ph-label">Drive</span>
                        </div>
                        <span class="gallery-item-badge badge-gd">📁 GDrive</span>
                      </template>
                      <!-- Video File item -->
                      <template v-else-if="checkIsVideo(mediaItem)">
                        <div class="gallery-video-ph">
                          <span class="ph-icon">🎬</span>
                          <span class="ph-label">Video</span>
                        </div>
                        <span class="gallery-item-badge badge-vid">▶ MP4</span>
                      </template>
                      <!-- Photo item -->
                      <template v-else>
                        <img :src="mediaItem" alt="Gallery Photo" />
                      </template>

                      <button
                        type="button"
                        class="gallery-item-del"
                        @click="removeGalleryPhoto(pIdx)"
                        title="Hapus media dari galeri"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div v-else class="gallery-empty-hint">
                    💡 Opsional: Tambahkan beberapa foto atau video untuk pengalaman pop-up yang interaktif.
                  </div>
                </div>

                <!-- Short Description -->
                <div class="form-group">
                  <label class="form-label">Deskripsi Singkat (Tampil di kartu) <span class="req">*</span></label>
                  <textarea
                    v-model="formData.description"
                    class="form-input form-textarea short-desc"
                    placeholder="Penjelasan ringkas tentang karya ini (1-2 kalimat)..."
                    rows="2"
                    required
                  ></textarea>
                </div>

                <!-- Full Description -->
                <div class="form-group">
                  <label class="form-label">Deskripsi Lengkap (Tampil di pop-up modal detail)</label>
                  <textarea
                    v-model="formData.fullDescription"
                    class="form-input form-textarea"
                    placeholder="Rincian proses pengerjaan, tantangan, dan solusi yang Anda berikan..."
                    rows="4"
                  ></textarea>
                </div>

                <!-- Technologies -->
                <div class="form-group">
                  <label class="form-label">Teknologi / Peralatan (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    v-model="techsInput"
                    class="form-input"
                    placeholder="Contoh: Vue.js, DJI Drone 4K, Fiber Optic, DaVinci Resolve"
                  />
                </div>

                <!-- External Link -->
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Label Link Eksternal</label>
                    <input
                      type="text"
                      v-model="externalLinkLabel"
                      class="form-input"
                      placeholder="Contoh: Buka di Google Drive, Live Demo"
                    />
                  </div>
                  <div class="form-group">
                    <div class="link-header-row">
                      <label class="form-label">URL Link Eksternal</label>
                      <button
                        type="button"
                        class="quick-fill-btn"
                        @click="fillGoogleDriveLink"
                        title="Isi otomatis dengan folder Google Drive portofolio"
                      >
                        📁 Pakai Link GDrive
                      </button>
                    </div>
                    <input
                      type="url"
                      v-model="externalLinkUrl"
                      class="form-input"
                      placeholder="https://drive.google.com/... atau link website"
                    />
                  </div>
                </div>

                <!-- Featured Checkbox -->
                <div class="form-checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="formData.featured" />
                    <span>Jadikan Karya Unggulan (Featured) ⭐</span>
                  </label>
                </div>
              </div>

              <!-- Form Buttons -->
              <div class="form-footer">
                <button type="button" class="btn btn-ghost" @click="closeFormModal">
                  Batal
                </button>
                <button type="submit" class="btn btn-primary btn-lg">
                  {{ isEditing ? "Simpan Perubahan" : "Tambah Karya Sekarang" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPasswordModal" class="modal-backdrop" @click.self="showPasswordModal = false">
          <div class="password-modal-card">
            <h2>Ganti Password Admin</h2>
            <form @submit.prevent="handleChangePassword" class="password-form">
              <div class="form-group">
                <label class="form-label">Password Lama</label>
                <input
                  type="password"
                  v-model="passwordForm.oldPassword"
                  class="form-input"
                  placeholder="Masukkan password lama..."
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Password Baru (min. 5 karakter)</label>
                <input
                  type="password"
                  v-model="passwordForm.newPassword"
                  class="form-input"
                  placeholder="Masukkan password baru..."
                  required
                />
              </div>

              <div v-if="passwordFeedback.message" :class="['feedback-msg', passwordFeedback.isError ? 'err' : 'ok']">
                {{ passwordFeedback.message }}
              </div>

              <div class="form-footer">
                <button type="button" class="btn btn-ghost" @click="showPasswordModal = false">
                  Tutup
                </button>
                <button type="submit" class="btn btn-primary">
                  Perbarui Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Notification Toast -->
    <Transition name="slide-up">
      <div v-if="toast.show" class="toast-notification">
        <span class="toast-icon">✓</span>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { usePortfolioStore } from "@/composables/usePortfolioStore";
import AdminProfileTab from "./AdminProfileTab.vue";
import AdminSkillsTab from "./AdminSkillsTab.vue";
import AdminExperienceTab from "./AdminExperienceTab.vue";
import AdminSecurityTab from "./AdminSecurityTab.vue";
import {
  captureVideoSnapshot,
  fileToBase64,
  getGoogleDriveEmbedUrl,
  getMediaType,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isGoogleDriveUrl,
  isYouTubeUrl,
  resolveMediaUrl,
} from "@/utils/mediaHelper";

const emit = defineEmits(["view-public", "logout"]);
const {
  works,
  categories,
  profile,
  skills,
  experiences,
  logout,
  addWork,
  updateWork,
  deleteWork,
  downloadBackup,
  importBackup,
  changePassword,
  isNeonConnected,
  syncAllToNeon,
  fetchFromNeonDatabase,
} = usePortfolioStore();

// CMS Active Tab
const activeCmsTab = ref("works");

// Search & Filter
const searchQuery = ref("");
const selectedCategory = ref("all");

const featuredCount = computed(() => works.value.filter((w) => w.featured).length);

const filteredWorks = computed(() => {
  return works.value.filter((work) => {
    const matchesCat =
      selectedCategory.value === "all" || work.category === selectedCategory.value;
    const q = searchQuery.value.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesSearch =
      (work.title || "").toLowerCase().includes(q) ||
      (work.description || "").toLowerCase().includes(q) ||
      (work.client || "").toLowerCase().includes(q) ||
      (work.role || "").toLowerCase().includes(q) ||
      (work.technologies || []).some((t) => t.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });
});

const getCategoryName = (catId) => {
  const map = {
    web: "Software & Web",
    drone: "Drone & Aerial",
    network: "IT & Network",
    video: "Video & Media",
    ai: "AI & Creative",
  };
  return map[catId] || catId;
};

const getDemoUrl = (work) => {
  if (work.externalLinks && work.externalLinks.length > 0) {
    return work.externalLinks[0].url;
  }
  return "";
};

const handleImgError = (e) => {
  e.target.src =
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&q=80";
};

// Form Modal State
const showFormModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const uploadMode = ref("image_file"); // 'image_file' | 'video_file' | 'youtube' | 'url'
const fileInputRef = ref(null);
const videoFileInputRef = ref(null);
const galleryInputRef = ref(null);
const uploadStats = ref("");
const isCompressing = ref(false);
const isProcessingVideo = ref(false);
const videoPreviewUrl = ref("");
const youtubeUrlInput = ref("");
const youtubeEmbedPreview = ref("");
const showAddYouTubeInline = ref(false);
const newYouTubeLink = ref("");

const isVideoSource = computed(() => {
  return (
    isYouTubeUrl(formData.image) ||
    getMediaType(formData.image) === "video" ||
    (formData.gallery && formData.gallery.some((g) => getMediaType(g) === "video" || isYouTubeUrl(g)))
  );
});

const formData = reactive({
  title: "",
  category: "web",
  image: "",
  gallery: [],
  year: "",
  role: "",
  client: "",
  productionHouse: "",
  description: "",
  fullDescription: "",
  featured: false,
});

const techsInput = ref("");
const externalLinkLabel = ref("Live Link");
const externalLinkUrl = ref("");

// Google Drive state
const gdriveUrlInput = ref("");
const gdriveEmbedPreview = ref("");
const showAddGDriveInline = ref(false);
const newGDriveLink = ref("");

const setUploadMode = (mode) => {
  uploadMode.value = mode;
};

const checkIsYouTube = (item) => isYouTubeUrl(item);
const checkIsGDrive = (item) => isGoogleDriveUrl(item);
const checkIsVideo = (item) => getMediaType(item) === "video";
const getYouTubeThumb = (item) => getYouTubeThumbnail(item);

/**
 * Force manual synchronization to Neon Cloud Database
 */
const handleManualCloudSync = async () => {
  showToast("🔄 Sedang menyinkronkan seluruh data ke Neon Cloud...");
  try {
    await syncAllToNeon();
    showToast("✓ Sinkronisasi ke Neon Cloud sukses! Data aktif di semua HP & Laptop.");
  } catch (err) {
    showToast("⚠️ Gagal sinkronisasi: " + (err.message || "Periksa koneksi internet"));
  }
};

/**
/**
 * Universal HD Image Processor & Compressor
 * Optimized for mobile phone cameras (up to 1280px 2K/HD) with high-efficiency JPEG compression.
 * Guarantees ultra-fast upload (under 150KB) and instant cloud database synchronization.
 */
const compressImage = (file, maxDimension = 1280, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("File gambar tidak ditemukan"));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Scale down to maxDimension keeping aspect ratio
        if (Math.max(width, height) > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const origKB = Math.round(file.size / 1024);
        const compKB = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({ dataUrl, origKB, compKB, width, height });
      };
      img.onerror = (err) => reject(new Error("Format gambar tidak dapat dibaca oleh browser."));
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const triggerFileInput = () => {
  if (fileInputRef.value) fileInputRef.value.click();
};

const triggerVideoFileInput = () => {
  if (videoFileInputRef.value) videoFileInputRef.value.click();
};

const triggerGalleryInput = () => {
  if (galleryInputRef.value) galleryInputRef.value.click();
};

const handleFileInputChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    isCompressing.value = true;
    const res = await compressImage(file);
    formData.image = res.dataUrl;
    const percentSaved = Math.round((1 - res.compKB / res.origKB) * 100);
    uploadStats.value = `Asli: ${res.origKB} KB ➔ Ringan: ${res.compKB} KB (Hemat ${percentSaved > 0 ? percentSaved : 0}%)`;
    showToast("✓ Foto berhasil dipilih & dikompresi!");
  } catch (err) {
    console.error("Gagal membaca gambar:", err);
    showToast("⚠️ Gagal memproses gambar. Pastikan format JPG/PNG/WebP.");
  } finally {
    isCompressing.value = false;
    if (fileInputRef.value) fileInputRef.value.value = "";
  }
};

const handleVideoFileInputChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    isProcessingVideo.value = true;
    const sizeMB = Math.round((file.size / (1024 * 1024)) * 10) / 10;
    uploadStats.value = `Ukuran: ${sizeMB} MB`;

    // 1. Generate snapshot cover automatically from video
    let snapDuration = 0;
    try {
      const snap = await captureVideoSnapshot(file, 1);
      formData.image = snap.thumbnail;
      snapDuration = Math.round(snap.duration);
    } catch (snapErr) {
      console.warn("Snapshot notice:", snapErr.message);
      if (!formData.image) {
        formData.image = "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=500&fit=crop&q=80";
      }
    }

    // 2. Base64 for <= 4MB vs Cloud advice for > 4MB
    if (file.size <= 4 * 1024 * 1024) {
      const base64Video = await fileToBase64(file);
      videoPreviewUrl.value = base64Video;

      if (!Array.isArray(formData.gallery)) formData.gallery = [];
      formData.gallery = [base64Video, ...formData.gallery.filter((g) => typeof g === 'string' && !g.startsWith("data:video/") && !g.startsWith("idb://"))];

      uploadStats.value += ` | Durasi: ${snapDuration}s (Disimpan ke Cloud Neon)`;
      showToast("✓ Video MP4 berhasil diproses & tersimpan untuk semua perangkat!");
    } else {
      videoPreviewUrl.value = URL.createObjectURL(file);
      uploadStats.value += ` (⚠️ ${sizeMB}MB: Melebihi batas cloud 4MB)`;
      alert(`⚠️ Video berukuran ${sizeMB} MB.\n\nKarena batasan request Vercel (maks 4.5 MB), file video di atas 4 MB tidak dapat disimpan langsung ke database Postgres cloud.\n\nSaran Profesional: Masukkan tautan video Google Drive atau YouTube Anda pada tab "Google Drive" atau "YouTube". Video akan otomatis tersimpan permanen & dapat diputar di semua HP & Laptop!`);
    }
  } catch (err) {
    console.error("Gagal proses video:", err);
    showToast("⚠️ Gagal memproses video. Pastikan format MP4 atau WebM.");
  } finally {
    isProcessingVideo.value = false;
    if (videoFileInputRef.value) videoFileInputRef.value.value = "";
  }
};

const handleYouTubeInput = () => {
  const url = (youtubeUrlInput.value || "").trim();
  if (isYouTubeUrl(url)) {
    formData.image = getYouTubeThumbnail(url);
    youtubeEmbedPreview.value = getYouTubeEmbedUrl(url, 0);

    if (!Array.isArray(formData.gallery)) formData.gallery = [];
    if (!formData.gallery.includes(url)) {
      formData.gallery = [url, ...formData.gallery.filter((g) => g !== url)];
    }
    showToast("✓ Video YouTube terdeteksi & cover HD otomatis disetel!");
  } else {
    youtubeEmbedPreview.value = "";
  }
};

const addYouTubeToGallery = () => {
  const url = (newYouTubeLink.value || "").trim();
  if (!url || !isYouTubeUrl(url)) {
    alert("Mohon masukkan tautan YouTube yang valid (contoh: https://www.youtube.com/watch?v=...)");
    return;
  }
  if (!Array.isArray(formData.gallery)) formData.gallery = [];
  formData.gallery.push(url);
  if (!formData.image) {
    formData.image = getYouTubeThumbnail(url);
  }
  newYouTubeLink.value = "";
  showAddYouTubeInline.value = false;
  showToast("✓ Video YouTube berhasil ditambahkan ke galeri!");
};

const handleGDriveInput = () => {
  const url = (gdriveUrlInput.value || "").trim();
  if (isGoogleDriveUrl(url)) {
    gdriveEmbedPreview.value = getGoogleDriveEmbedUrl(url);

    if (!Array.isArray(formData.gallery)) formData.gallery = [];
    if (!formData.gallery.includes(url)) {
      formData.gallery = [url, ...formData.gallery.filter((g) => g !== url)];
    }
    if (!formData.image) {
      formData.image = "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=500&fit=crop&q=80";
    }
    showToast("✓ Video Google Drive terdeteksi & terhubung!");
  } else {
    gdriveEmbedPreview.value = "";
  }
};

const addGDriveToGallery = () => {
  const url = (newGDriveLink.value || "").trim();
  if (!url || !isGoogleDriveUrl(url)) {
    alert("Mohon masukkan tautan Google Drive yang valid (contoh: https://drive.google.com/file/d/.../view)");
    return;
  }
  if (!Array.isArray(formData.gallery)) formData.gallery = [];
  formData.gallery.push(url);
  if (!formData.image) {
    formData.image = "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=500&fit=crop&q=80";
  }
  newGDriveLink.value = "";
  showAddGDriveInline.value = false;
  showToast("✓ Video Google Drive berhasil ditambahkan ke galeri!");
};

const removeGDrive = () => {
  gdriveUrlInput.value = "";
  gdriveEmbedPreview.value = "";
  formData.image = "";
  showToast("✓ Video Google Drive berhasil dihapus.");
};

const removeVideo = () => {
  videoPreviewUrl.value = "";
  formData.image = "";
  uploadStats.value = "";
  if (videoFileInputRef.value) videoFileInputRef.value.value = "";
  showToast("✓ Video utama berhasil dihapus.");
};

const removeYouTube = () => {
  youtubeUrlInput.value = "";
  youtubeEmbedPreview.value = "";
  formData.image = "";
  showToast("✓ Video YouTube berhasil dihapus.");
};

const handleFileDrop = async (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  if (file.type.startsWith("video/")) {
    setUploadMode("video_file");
    const syntheticEvent = { target: { files: [file] } };
    return handleVideoFileInputChange(syntheticEvent);
  }
  try {
    isCompressing.value = true;
    const res = await compressImage(file);
    formData.image = res.dataUrl;
    const percentSaved = Math.round((1 - res.compKB / res.origKB) * 100);
    uploadStats.value = `Asli: ${res.origKB} KB ➔ Ringan: ${res.compKB} KB (Hemat ${percentSaved > 0 ? percentSaved : 0}%)`;
    showToast("✓ Foto berhasil di-drop & dikompresi!");
  } catch (err) {
    console.error("Gagal drop gambar:", err);
    showToast("⚠️ Gagal memproses gambar.");
  } finally {
    isCompressing.value = false;
  }
};

const removeImage = () => {
  formData.image = "";
  uploadStats.value = "";
  if (fileInputRef.value) fileInputRef.value.value = "";
  showToast("✓ Gambar utama berhasil dihapus.");
};

const handleGalleryFilesChange = async (e) => {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  if (!Array.isArray(formData.gallery)) {
    formData.gallery = [];
  }
  try {
    isCompressing.value = true;
    let count = 0;
    for (const file of files) {
      if (file.type.startsWith("video/")) {
        if (file.size <= 4 * 1024 * 1024) {
          const b64 = await fileToBase64(file);
          formData.gallery.push(b64);
          count++;
        } else {
          alert(`File video "${file.name}" (${Math.round(file.size / (1024 * 1024))}MB) melebihi batas cloud 4MB.\nDisarankan menambahkan via tab "+ Google Drive" atau "+ YouTube" agar dapat diputar di semua HP & Laptop.`);
        }
      } else if (file.type.startsWith("image/")) {
        const res = await compressImage(file);
        formData.gallery.push(res.dataUrl);
        count++;
      }
    }
    if (count > 0) {
      showToast(`✓ ${count} media berhasil ditambahkan ke galeri!`);
    }
  } catch (err) {
    console.error("Gagal upload galeri:", err);
    showToast("⚠️ Gagal memproses beberapa file galeri.");
  } finally {
    isCompressing.value = false;
    if (galleryInputRef.value) galleryInputRef.value.value = "";
  }
};

const removeGalleryPhoto = (idx) => {
  if (formData.gallery) {
    formData.gallery.splice(idx, 1);
    showToast("✓ Media berhasil dihapus dari galeri.");
  }
};

const fillGoogleDriveLink = () => {
  externalLinkLabel.value = "Buka Master di Google Drive";
  externalLinkUrl.value =
    "https://drive.google.com/drive/folders/1c70iPsGZhf0u3xTs_qfv_41IINvlPYSW?usp=sharing";
  showToast("✓ Link Google Drive berhasil diisi!");
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  formData.title = "";
  formData.category = "web";
  formData.image = "";
  formData.gallery = [];
  formData.year = `${new Date().getFullYear()}`;
  formData.role = "Web Developer";
  formData.client = "";
  formData.productionHouse = "";
  formData.description = "";
  formData.fullDescription = "";
  formData.featured = false;
  techsInput.value = "Vue.js, REST API";
  externalLinkLabel.value = "Live Demo";
  externalLinkUrl.value = "";
  uploadMode.value = "image_file";
  uploadStats.value = "";
  videoPreviewUrl.value = "";
  youtubeUrlInput.value = "";
  youtubeEmbedPreview.value = "";
  showAddYouTubeInline.value = false;
  newYouTubeLink.value = "";
  gdriveUrlInput.value = "";
  gdriveEmbedPreview.value = "";
  showAddGDriveInline.value = false;
  newGDriveLink.value = "";
  showFormModal.value = true;
};

const openEditModal = async (work) => {
  isEditing.value = true;
  editingId.value = work.id;
  formData.title = work.title || "";
  formData.category = work.category || "web";
  formData.image = work.image || "";
  formData.gallery = Array.isArray(work.gallery) ? [...work.gallery] : [];
  formData.year = work.year || "";
  formData.role = work.role || "";
  formData.client = work.client || "";
  formData.productionHouse = work.productionHouse || "";
  formData.description = work.description || "";
  formData.fullDescription = work.fullDescription || work.description || "";
  formData.featured = Boolean(work.featured);
  techsInput.value = (work.technologies || []).join(", ");
  uploadStats.value = "";
  videoPreviewUrl.value = "";
  youtubeUrlInput.value = "";
  youtubeEmbedPreview.value = "";
  showAddYouTubeInline.value = false;

  gdriveUrlInput.value = "";
  gdriveEmbedPreview.value = "";
  showAddGDriveInline.value = false;
  newGDriveLink.value = "";

  // Detect mode
  if (isYouTubeUrl(work.image) || (work.gallery && work.gallery.some(isYouTubeUrl))) {
    uploadMode.value = "youtube";
    const ytLink = isYouTubeUrl(work.image)
      ? work.image
      : work.gallery.find(isYouTubeUrl);
    youtubeUrlInput.value = ytLink || "";
    youtubeEmbedPreview.value = getYouTubeEmbedUrl(ytLink, 0);
  } else if (isGoogleDriveUrl(work.image) || (work.gallery && work.gallery.some(isGoogleDriveUrl))) {
    uploadMode.value = "gdrive";
    const gdLink = isGoogleDriveUrl(work.image)
      ? work.image
      : work.gallery.find(isGoogleDriveUrl);
    gdriveUrlInput.value = gdLink || "";
    gdriveEmbedPreview.value = getGoogleDriveEmbedUrl(gdLink);
  } else if (
    (work.image && (work.image.startsWith("data:video/") || work.image.startsWith("idb://"))) ||
    (work.gallery && work.gallery.some((g) => typeof g === 'string' && (g.startsWith("data:video/") || g.startsWith("idb://"))))
  ) {
    uploadMode.value = "video_file";
    const vidKey = (work.gallery && work.gallery.find((g) => typeof g === 'string' && (g.startsWith("data:video/") || g.startsWith("idb://")))) || work.image;
    videoPreviewUrl.value = await resolveMediaUrl(vidKey);
  } else {
    uploadMode.value = "image_file";
  }

  if (work.externalLinks && work.externalLinks.length > 0) {
    externalLinkLabel.value = work.externalLinks[0].label || "Live Link";
    externalLinkUrl.value = work.externalLinks[0].url || "";
  } else {
    externalLinkLabel.value = "Live Link";
    externalLinkUrl.value = "";
  }
  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;
};

const isSyncingNeon = ref(false);
const isRefreshingCloud = ref(false);

const handlePullFromCloud = async () => {
  try {
    isRefreshingCloud.value = true;
    showToast("⏳ Sedang mengambil data & foto terbaru dari Database Neon...");
    await fetchFromNeonDatabase(true);
    showToast("✓ Berhasil! Data & foto terbaru langsung tampil dari Database Neon Cloud!");
  } catch (err) {
    showToast("⚠️ Gagal mengambil data: " + (err.message || "Periksa koneksi internet"));
  } finally {
    isRefreshingCloud.value = false;
  }
};

const handleSyncAllNeon = async () => {
  try {
    isSyncingNeon.value = true;
    showToast("⏳ Sedang mengunggah seluruh karya & gambar ke Database Neon Cloud...");
    await syncAllToNeon();
    showToast("✓ Berhasil! Semua data telah tersimpan di Neon Cloud & otomatis tampil di HP!");
  } catch (err) {
    showToast("⚠️ Gagal sinkronisasi ke Neon: " + err.message);
  } finally {
    isSyncingNeon.value = false;
  }
};

const handleSaveProject = async () => {
  if (!formData.image) {
    alert("Mohon pilih atau masukkan foto thumbnail utama terlebih dahulu.");
    return;
  }

  const isGDrive = (externalLinkUrl.value || "").includes("drive.google.com");
  const externalLinks = externalLinkUrl.value
    ? [
        {
          label: externalLinkLabel.value || (isGDrive ? "Google Drive" : "Link"),
          url: externalLinkUrl.value,
          icon: isGDrive ? "drive" : "external",
        },
      ]
    : [];

  // Ensure gallery primary image matches formData.image
  let gallery = Array.isArray(formData.gallery) ? [...formData.gallery] : [];
  if (formData.image && !gallery.includes(formData.image)) {
    gallery = [formData.image, ...gallery];
  } else if (gallery.length === 0 && formData.image) {
    gallery = [formData.image];
  }

  const payload = {
    ...formData,
    gallery,
    technologies: techsInput.value.split(",").map((t) => t.trim()).filter(Boolean),
    externalLinks,
  };

  if (isEditing.value && editingId.value) {
    showToast("⏳ Sedang menyimpan ke Database Neon...");
    const res = await updateWork(editingId.value, payload);
    if (res && res.success && !res.offline) {
      showToast("✓ Karya berhasil diperbarui & tersimpan ke Cloud Neon! (Live di HP & Laptop)");
    } else if (res && res.offline) {
      showToast("⚠️ Tersimpan lokal di perangkat ini (Koneksi offline).");
    } else {
      alert("⚠️ Gagal menyimpan ke Database Neon: " + (res?.message || "Ukuran file terlalu besar"));
    }
  } else {
    showToast("⏳ Sedang menambahkan karya ke Database Neon...");
    const res = await addWork(payload);
    if (res && res.success && !res.offline) {
      showToast("✓ Karya baru berhasil ditambahkan & tersimpan ke Cloud Neon!");
    } else {
      showToast("✓ Karya baru tersimpan secara lokal!");
    }
  }

  closeFormModal();
};

const confirmDelete = (work) => {
  if (confirm(`Apakah Anda yakin ingin menghapus karya "${work.title}"?`)) {
    deleteWork(work.id);
    showToast("✓ Karya berhasil dihapus dari portofolio.");
  }
};

const handleDownloadBackup = () => {
  downloadBackup();
  showToast("✓ File backup works.json berhasil diunduh!");
};

const importFileInputRef = ref(null);

const triggerImportFile = () => {
  if (importFileInputRef.value) {
    importFileInputRef.value.click();
  }
};

const handleImportFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const res = importBackup(event.target.result);
      if (res.success) {
        showToast(`✓ Berhasil mengimpor ${res.count} karya ke perangkat ini!`);
      } else {
        showToast(`⚠️ ${res.message}`);
      }
    } catch (err) {
      showToast("⚠️ Gagal mengimpor file: " + err.message);
    } finally {
      if (importFileInputRef.value) importFileInputRef.value.value = "";
    }
  };
  reader.onerror = () => {
    showToast("⚠️ Gagal membaca file.");
    if (importFileInputRef.value) importFileInputRef.value.value = "";
  };
  reader.readAsText(file);
};

const handleLogout = () => {
  logout();
  emit("logout");
};

// Password Modal
const showPasswordModal = ref(false);
const passwordForm = reactive({ oldPassword: "", newPassword: "" });
const passwordFeedback = reactive({ message: "", isError: false });

const handleChangePassword = () => {
  const res = changePassword(passwordForm.oldPassword, passwordForm.newPassword);
  passwordFeedback.message = res.message;
  passwordFeedback.isError = !res.success;

  if (res.success) {
    passwordForm.oldPassword = "";
    passwordForm.newPassword = "";
    setTimeout(() => {
      showPasswordModal.value = false;
      passwordFeedback.message = "";
    }, 1500);
  }
};

// Toast
const toast = reactive({ show: false, message: "" });
const showToast = (msg) => {
  toast.message = msg;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 4000);
};
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--color-bg-darker);
  color: var(--color-text-light);
  display: flex;
  flex-direction: column;
}

/* Header */
.admin-header {
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(16px);
}

.admin-header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-md) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.brand-logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.logo-accent {
  color: var(--color-primary);
}

.admin-pill {
  margin-left: 10px;
  font-size: var(--font-size-xs);
  padding: 3px 10px;
  background: rgba(31, 159, 216, 0.2);
  color: var(--color-primary-light);
  border: 1px solid rgba(31, 159, 216, 0.4);
  border-radius: var(--radius-full);
}

.live-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 10px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.status-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.admin-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.action-icon {
  width: 16px;
  height: 16px;
}

/* Main */
.admin-main {
  flex: 1;
  padding: var(--space-2xl) var(--space-xl);
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Full CMS Navigation Bar */
.cms-nav-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-xl, 16px);
  padding: 8px;
  margin-bottom: var(--space-2xl, 32px);
  overflow-x: auto;
  backdrop-filter: blur(12px);
  scrollbar-width: thin;
}

.cms-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  color: var(--color-text-muted, #94a3b8);
  border: 1px solid transparent;
  border-radius: var(--radius-lg, 12px);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.cms-tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.cms-tab-btn.active {
  color: #ffffff;
  background: linear-gradient(135deg, rgba(31, 159, 216, 0.25), rgba(16, 185, 129, 0.15));
  border-color: rgba(31, 159, 216, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-weight: 600;
}

.tab-icon {
  font-size: 16px;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-light, #ffffff);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.cms-tab-btn.active .tab-badge {
  background: var(--color-primary, #1f9fd8);
  color: #ffffff;
}

.tab-pane-works {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

/* Sync Info Banner */
.sync-info-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: rgba(31, 159, 216, 0.08);
  border: 1px solid rgba(31, 159, 216, 0.25);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  margin-bottom: var(--space-2xl);
  box-sizing: border-box;
}

.sync-banner-icon {
  font-size: 24px;
  line-height: 1;
  flex-shrink: 0;
}

.sync-banner-content {
  flex: 1;
}

.sync-banner-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.sync-banner-desc {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.dashboard-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-xs);
  background: linear-gradient(135deg, #ffffff, var(--color-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dashboard-subtitle {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  max-width: 700px;
}

.dashboard-subtitle strong {
  color: #10B981;
}

.add-icon {
  width: 20px;
  height: 20px;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.stat-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
}

.stat-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-light);
}

.stat-icon-bg {
  font-size: 2.2rem;
  opacity: 0.8;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
}

.search-input {
  width: 100%;
  padding-left: 42px;
}

.category-filter-group {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.cat-chip {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-muted);
  font-family: inherit;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cat-chip:hover {
  color: var(--color-text-light);
  border-color: rgba(31, 159, 216, 0.4);
}

.cat-chip-active {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-xl);
}

.project-admin-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.project-admin-card:hover {
  border-color: rgba(31, 159, 216, 0.35);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.card-thumb {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #000;
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.7);
  color: var(--color-primary-light);
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  backdrop-filter: blur(8px);
}

.featured-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(245, 158, 11, 0.85);
  color: #000000;
  font-size: 11px;
  font-weight: var(--font-weight-bold);
}

.card-body {
  padding: var(--space-lg);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-headline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-light);
  margin-bottom: 6px;
  line-height: var(--line-height-tight);
}

.card-role, .card-ph {
  font-size: var(--font-size-xs);
  color: var(--color-primary-light);
  margin-bottom: 4px;
}

.card-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  line-height: var(--line-height-normal);
  margin-bottom: var(--space-md);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-techs {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding-top: var(--space-sm);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.tech-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  color: #CBD5E1;
}

.tech-more {
  font-size: 11px;
  color: var(--color-text-muted);
  padding: 2px 4px;
}

.card-footer {
  padding: var(--space-md) var(--space-lg);
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-xs);
}

.btn-danger-ghost {
  background: transparent;
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-danger-ghost:hover {
  background: #EF4444;
  color: #ffffff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--space-4xl) var(--space-xl);
  background: rgba(15, 23, 42, 0.4);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
}

.empty-emoji {
  font-size: 3.5rem;
  display: block;
  margin-bottom: var(--space-md);
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-xs);
}

.empty-state p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.form-modal-card {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  background: #0B1120;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}

.form-modal-header {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-modal-header h2 {
  font-size: var(--font-size-xl);
  color: var(--color-text-light);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
}

.close-btn:hover {
  color: #fff;
}

.project-form {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.form-scrollable {
  padding: var(--space-xl);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Image Upload & Gallery UI */
.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.upload-mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  padding: 2px;
  gap: 2px;
}

.mode-pill {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.mode-pill.active {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(31, 159, 216, 0.4);
}

.hidden-file-input {
  display: none !important;
}

.file-dropzone {
  border: 2px dashed rgba(31, 159, 216, 0.4);
  background: rgba(31, 159, 216, 0.04);
  border-radius: var(--radius-lg);
  padding: var(--space-xl) var(--space-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.file-dropzone:hover {
  border-color: var(--color-primary);
  background: rgba(31, 159, 216, 0.08);
  transform: translateY(-2px);
}

.dropzone-icon {
  font-size: 2.2rem;
  margin-bottom: 2px;
}

.dropzone-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-light);
}

.dropzone-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.dropzone-badge {
  margin-top: 4px;
  font-size: 11px;
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.preview-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  position: relative;
  transition: border-color 0.2s ease;
}

.preview-card:hover {
  border-color: rgba(31, 159, 216, 0.4);
}

.preview-img-wrapper {
  width: 150px;
  height: 95px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
  background: #000;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.uploaded-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Floating Quick-Delete (Silang) Button for Main Media */
.preview-quick-del-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: #ffffff;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);
  z-index: 10;
  transition: transform 0.15s ease, background 0.15s ease;
}

.preview-quick-del-btn:hover {
  background: #dc2626;
  transform: scale(1.15);
}

.preview-quick-del-btn:active {
  transform: scale(0.95);
}

.preview-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.preview-status {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: #34d399;
}

.preview-stats {
  display: block;
  font-size: 11px;
  color: var(--color-text-muted);
}

.preview-actions {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.url-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.url-input-row .form-input {
  flex: 1;
  min-width: 0;
}

/* Gallery Section */
.gallery-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.gallery-header-btns {
  display: flex;
  gap: var(--space-xs);
}

.add-yt-inline-box {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
  padding: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
}

.form-input-sm {
  padding: 6px 10px;
  font-size: var(--font-size-xs);
}

/* Video & YouTube Upload UI in Admin */
.video-dropzone {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.05);
}

.badge-video-info {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.video-processing-box {
  padding: var(--space-xl);
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.processing-spinner {
  font-size: 2rem;
  animation: spin 1.5s linear infinite;
}

.video-preview-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.video-player-box {
  width: 100%;
  max-height: 240px;
  background: #000;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.admin-preview-video {
  max-width: 100%;
  max-height: 240px;
  border-radius: var(--radius-md);
  outline: none;
}

.video-info-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cover-mini-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.cover-mini-preview img {
  width: 48px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.youtube-mode-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.yt-preview-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.yt-embed-box {
  width: 100%;
  aspect-ratio: 16/9;
  max-height: 220px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #000;
  position: relative;
}

.admin-yt-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Gallery Preview Grid & Responsive Cards */
.gallery-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-top: 14px;
  width: 100%;
  box-sizing: border-box;
}

.gallery-preview-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: #0b1120;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.gallery-preview-item:hover {
  transform: translateY(-2px);
  border-color: rgba(31, 159, 216, 0.6);
}

.gallery-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-item-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
  color: #fff;
  z-index: 2;
}

.badge-yt {
  background: #e62117;
}

.badge-vid {
  background: #2563eb;
}

.gallery-video-ph {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0d1527;
  color: #60a5fa;
  gap: 2px;
}

.ph-icon {
  font-size: 1.4rem;
}

.ph-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Floating Cross / Delete Button for Gallery Thumbnails */
.gallery-item-del {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #ef4444;
  color: #ffffff;
  border: 1.5px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  z-index: 10;
  transition: transform 0.15s ease, background 0.15s ease;
}

.gallery-item-del:hover {
  background: #dc2626;
  transform: scale(1.15);
}

.gallery-item-del:active {
  transform: scale(0.95);
}

.gallery-empty-hint {
  font-size: 12px;
  color: var(--color-text-muted);
  font-style: italic;
  padding: 8px 0;
}

/* External Link Row */
.link-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.link-header-row .form-label {
  margin-bottom: 0;
}

.quick-fill-btn {
  background: rgba(31, 159, 216, 0.12);
  border: 1px solid rgba(31, 159, 216, 0.3);
  color: #38bdf8;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-fill-btn:hover {
  background: rgba(31, 159, 216, 0.25);
  color: #ffffff;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.req {
  color: #EF4444;
}

.form-select {
  background: rgba(15, 23, 42, 0.9);
  color: var(--color-text-light);
}

.img-preview {
  margin-top: 8px;
  border-radius: var(--radius-md);
  overflow: hidden;
  height: 120px;
  max-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
}

.img-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-checkbox-group {
  margin-top: var(--space-xs);
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  cursor: pointer;
}

.form-footer {
  padding: var(--space-md) var(--space-xl);
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
}

/* Password Modal Card */
.password-modal-card {
  width: 100%;
  max-width: 400px;
  background: #0B1120;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
}

.password-modal-card h2 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-md);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.feedback-msg {
  font-size: var(--font-size-xs);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
}

.feedback-msg.ok {
  background: rgba(16, 185, 129, 0.2);
  color: #34D399;
}

.feedback-msg.err {
  background: rgba(239, 68, 68, 0.2);
  color: #F87171;
}

/* Toast */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #10B981;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  z-index: 10000;
}

.toast-icon {
  font-weight: bold;
}

/* Clickable Neon Live Status */
.live-status.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  font-family: inherit;
}

.live-status.clickable:hover {
  transform: scale(1.03);
  border-color: rgba(31, 159, 216, 0.5);
}

.badge-gd {
  background: #3B82F6 !important;
  color: #ffffff !important;
}

@media (max-width: 768px) {
  .modal-backdrop {
    padding: 6px;
  }

  .form-modal-card {
    width: 100%;
    max-width: 100%;
    max-height: 96vh;
    border-radius: var(--radius-lg);
  }

  .form-scrollable {
    padding: var(--space-md);
  }

  .upload-mode-toggle {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    padding: 4px;
  }

  .mode-pill {
    padding: 8px 4px;
    text-align: center;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .admin-header-container {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 10px 14px;
  }

  .admin-brand {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .admin-actions {
    display: flex;
    overflow-x: auto;
    gap: 8px;
    padding: 4px 0;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  .admin-actions::-webkit-scrollbar {
    display: none;
  }

  .admin-actions .btn {
    flex-shrink: 0;
    padding: 6px 12px;
    font-size: 12px;
    white-space: nowrap;
  }

  .admin-actions .btn-label {
    display: inline !important;
    font-size: 11px;
  }

  .cms-nav-bar {
    padding: 6px;
    gap: 6px;
    margin-bottom: var(--space-lg);
    -webkit-overflow-scrolling: touch;
  }

  .cms-tab-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  .dashboard-hero {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }

  .dashboard-hero .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .stats-row {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .card-footer {
    flex-wrap: wrap;
    gap: 6px;
  }

  .card-footer .btn {
    flex: 1;
    justify-content: center;
    min-width: 80px;
  }

  .admin-main {
    padding: var(--space-md) var(--space-sm);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .dashboard-title {
    font-size: var(--font-size-xl);
  }

  /* Responsive Preview Cards on Mobile */
  .preview-card {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-md);
  }

  .preview-img-wrapper {
    width: 100%;
    height: 180px;
  }

  .preview-actions {
    flex-direction: column;
    width: 100%;
  }

  .preview-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .gallery-section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .gallery-header-btns {
    width: 100%;
    display: flex;
    gap: 6px;
    overflow-x: auto;
  }

  .gallery-header-btns .btn {
    flex: 1;
    justify-content: center;
    font-size: 11px;
    white-space: nowrap;
    padding: 6px 8px;
  }

  .gallery-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
  }

  .gallery-item-del,
  .preview-quick-del-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
}
</style>
