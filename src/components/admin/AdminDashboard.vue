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
          <span class="live-status">
            <span class="status-pulse"></span>
            Live Sync Aktif
          </span>
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

          <button class="btn btn-secondary btn-sm" @click="handleDownloadBackup" title="Unduh data works.json untuk backup">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span class="btn-label">Backup works.json</span>
          </button>

          <button class="btn btn-secondary btn-sm" @click="showPasswordModal = true" title="Ganti Password">
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
                          <button type="button" class="btn btn-danger-ghost btn-sm" @click="removeImage">
                            🗑️ Hapus
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
                          <button type="button" class="btn btn-danger-ghost btn-sm" @click="removeVideo">
                            🗑️ Hapus Video
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mode 3: Link Video YouTube -->
                  <div v-else-if="uploadMode === 'youtube'" class="youtube-mode-container">
                    <div class="form-group">
                      <label class="form-sublabel">Tautan Video YouTube (Video atau Shorts)</label>
                      <input
                        type="url"
                        v-model="youtubeUrlInput"
                        class="form-input"
                        placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                        @input="handleYouTubeInput"
                      />
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
                      </div>
                      <div class="yt-preview-info">
                        <span class="preview-status">✓ Video YouTube Terhubung</span>
                        <span class="preview-stats">Cover thumbnail HD resmi YouTube otomatis disetel untuk kartu proyek.</span>
                      </div>
                    </div>
                  </div>

                  <!-- Mode 4: Input URL Media Online Manual -->
                  <div v-else class="url-input-container">
                    <input
                      type="url"
                      v-model="formData.image"
                      class="form-input"
                      placeholder="https://... tautan gambar atau video .mp4 online"
                      required
                    />
                    <div v-if="formData.image" class="img-preview">
                      <img :src="formData.image" alt="Preview" @error="handleImgError" />
                    </div>
                  </div>
                </div>

                <!-- Multi-media Gallery Section (Foto & Video) -->
                <div class="form-group gallery-section">
                  <div class="gallery-section-header">
                    <div>
                      <label class="form-label">Galeri Karya Tambahan (Foto & Video Pop-up)</label>
                      <span class="form-hint">Dapat memadukan beberapa foto, video MP4, dan link YouTube</span>
                    </div>
                    <div class="gallery-header-btns">
                      <button type="button" class="btn btn-secondary btn-sm" @click="triggerGalleryInput">
                        + Tambah Foto / Video File
                      </button>
                      <button type="button" class="btn btn-ghost btn-sm" @click="showAddYouTubeInline = !showAddYouTubeInline">
                        ▶️ + YouTube
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
import {
  captureVideoSnapshot,
  getMediaType,
  getYouTubeEmbedUrl,
  getYouTubeThumbnail,
  isYouTubeUrl,
  resolveMediaUrl,
  saveMediaToDB,
} from "@/utils/mediaHelper";

const emit = defineEmits(["view-public", "logout"]);
const {
  works,
  categories,
  logout,
  addWork,
  updateWork,
  deleteWork,
  downloadBackup,
  changePassword,
} = usePortfolioStore();

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

const setUploadMode = (mode) => {
  uploadMode.value = mode;
};

const checkIsYouTube = (item) => isYouTubeUrl(item);
const checkIsVideo = (item) => getMediaType(item) === "video";
const getYouTubeThumb = (item) => getYouTubeThumbnail(item);

/**
/**
 * Universal HD Image Processor & Compressor
 * Supports Portrait, Landscape, Square, and Document Photos (A4, Flyers, Scans)
 * Preserves high resolution (up to 1920px Full HD) with smooth bicubic scaling,
 * ensuring text, stamps, and logos from phone camera uploads remain crystal clear.
 */
const compressImage = (file, maxDimension = 1920, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("File bukan gambar"));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Symmetric scaling based on the longest edge (works equally well for portrait and landscape!)
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
      img.onerror = (err) => reject(err);
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
    uploadStats.value = `Ukuran: ${Math.round(file.size / (1024 * 1024) * 10) / 10} MB`;

    // 1. Generate snapshot cover automatically from video
    const snap = await captureVideoSnapshot(file, 1);
    formData.image = snap.thumbnail;

    // 2. Save video blob in browser IndexedDB
    const idbKey = await saveMediaToDB(file, "video");
    videoPreviewUrl.value = URL.createObjectURL(file);

    // 3. Add to gallery so modal can play it
    if (!Array.isArray(formData.gallery)) formData.gallery = [];
    formData.gallery = [idbKey, ...formData.gallery.filter((g) => g !== idbKey)];

    uploadStats.value += ` | Durasi: ${Math.round(snap.duration)}s (Snapshot cover dibuat!)`;
    showToast("✓ Video MP4 berhasil diproses & cover snapshot otomatis dibuat!");
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

const removeVideo = () => {
  videoPreviewUrl.value = "";
  formData.image = "";
  uploadStats.value = "";
  if (videoFileInputRef.value) videoFileInputRef.value.value = "";
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
        const idbKey = await saveMediaToDB(file, "video");
        formData.gallery.push(idbKey);
        count++;
      } else if (file.type.startsWith("image/")) {
        const res = await compressImage(file);
        formData.gallery.push(res.dataUrl);
        count++;
      }
    }
    showToast(`✓ ${count} media berhasil ditambahkan ke galeri!`);
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

  // Detect mode
  if (isYouTubeUrl(work.image) || (work.gallery && work.gallery.some(isYouTubeUrl))) {
    uploadMode.value = "youtube";
    const ytLink = isYouTubeUrl(work.image)
      ? work.image
      : work.gallery.find(isYouTubeUrl);
    youtubeUrlInput.value = ytLink || "";
    youtubeEmbedPreview.value = getYouTubeEmbedUrl(ytLink, 0);
  } else if (
    (work.image && work.image.startsWith("idb://")) ||
    (work.gallery && work.gallery.some((g) => g.startsWith("idb://")))
  ) {
    uploadMode.value = "video_file";
    const idbKey = (work.gallery && work.gallery.find((g) => g.startsWith("idb://"))) || work.image;
    videoPreviewUrl.value = await resolveMediaUrl(idbKey);
  } else if (work.image && work.image.startsWith("data:")) {
    uploadMode.value = "image_file";
  } else if (work.image) {
    uploadMode.value = "url";
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

const handleSaveProject = () => {
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

  const gallery =
    formData.gallery && formData.gallery.length > 0
      ? formData.gallery
      : [formData.image];

  const payload = {
    ...formData,
    gallery,
    technologies: techsInput.value.split(",").map((t) => t.trim()).filter(Boolean),
    externalLinks,
  };

  if (isEditing.value && editingId.value) {
    updateWork(editingId.value, payload);
    showToast("✓ Karya berhasil diperbarui! Langsung live di publik.");
  } else {
    addWork(payload);
    showToast("✓ Karya baru berhasil ditambahkan! Langsung live di publik.");
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

.dashboard-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
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
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
}

.preview-img-wrapper {
  width: 140px;
  height: 90px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  background: #000;
}

.uploaded-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
}

.admin-yt-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.gallery-item-badge {
  position: absolute;
  bottom: 2px;
  left: 2px;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;
  color: #fff;
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
  font-size: 1.2rem;
}

.ph-label {
  font-size: 9px;
  font-weight: 600;
}

.gallery-empty-hint {
  font-size: 11px;
  color: var(--color-text-muted);
  font-style: italic;
  padding: 4px 0;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
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
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    padding: 4px;
  }

  .mode-pill {
    padding: 8px 6px;
    text-align: center;
    font-size: 11px;
  }

  .admin-header-container {
    padding: var(--space-sm) var(--space-md);
  }

  .admin-main {
    padding: var(--space-lg) var(--space-md);
  }

  .btn-label {
    display: none;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .dashboard-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
