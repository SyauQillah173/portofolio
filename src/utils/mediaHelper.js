/**
 * Media Helper Utility
 * ====================
 * Handles video detection, YouTube parsing, HTML5 video snapshot generation,
 * and IndexedDB storage for large media files (MP4, WebM, etc.).
 */

const DB_NAME = "syauqillah_media_db";
const DB_VERSION = 1;
const STORE_NAME = "media_store";

let dbInstance = null;
const objectUrlCache = new Map();

/**
 * Open or initialize the IndexedDB database
 */
export function openMediaDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB is not supported"));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Save a media file/blob to IndexedDB
 * @param {Blob|File} file
 * @param {string} mediaType - 'video' or 'image'
 * @returns {Promise<string>} idb://media_xxx key
 */
export async function saveMediaToDB(file, mediaType = "video") {
  const db = await openMediaDB();
  const id = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const record = {
      id,
      mediaType,
      fileName: file.name || "media",
      mimeType: file.type || (mediaType === "video" ? "video/mp4" : "image/jpeg"),
      size: file.size,
      blob: file,
      createdAt: Date.now(),
    };

    const req = store.put(record);
    req.onsuccess = () => {
      const key = `idb://${id}`;
      // Also cache an object url immediately
      const objUrl = URL.createObjectURL(file);
      objectUrlCache.set(key, objUrl);
      resolve(key);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieve a media blob from IndexedDB by key (e.g. idb://media_xxx)
 */
export async function getMediaFromDB(key) {
  if (!key || !key.startsWith("idb://")) return null;
  const id = key.replace("idb://", "");

  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);

    req.onsuccess = () => {
      resolve(req.result ? req.result.blob : null);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Resolve an image or video URL:
 * If it's an idb:// key, converts to a blob: URL.
 * Otherwise returns the URL as-is.
 */
export async function resolveMediaUrl(url) {
  if (!url) return "";
  if (!url.startsWith("idb://")) return url;

  if (objectUrlCache.has(url)) {
    return objectUrlCache.get(url);
  }

  try {
    const blob = await getMediaFromDB(url);
    if (blob) {
      const objUrl = URL.createObjectURL(blob);
      objectUrlCache.set(url, objUrl);
      return objUrl;
    }
  } catch (err) {
    console.error("Failed to resolve IndexedDB media URL:", err);
  }
  return "";
}

/**
 * Delete a media item from IndexedDB
 */
export async function deleteMediaFromDB(key) {
  if (!key || !key.startsWith("idb://")) return;
  const id = key.replace("idb://", "");

  if (objectUrlCache.has(key)) {
    URL.revokeObjectURL(objectUrlCache.get(key));
    objectUrlCache.delete(key);
  }

  try {
    const db = await openMediaDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
  } catch (err) {
    console.error("Failed to delete media from IndexedDB:", err);
  }
}

/**
 * Parse YouTube URL to extract video ID
 * Supports:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Check if a URL is a YouTube video
 */
export function isYouTubeUrl(url) {
  return Boolean(extractYouTubeId(url));
}

/**
 * Get YouTube Embed URL
 */
export function getYouTubeEmbedUrl(url, autoplay = 1) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return url;
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
}

/**
 * Get YouTube Thumbnail URL (HD maxresdefault or hqdefault)
 */
export function getYouTubeThumbnail(url) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Capture a frame snapshot from a Video File (HTML5 Canvas)
 * Generates an instant high-resolution cover image for the video
 */
export function captureVideoSnapshot(file, time = 1) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    let hasLoadedData = false;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    video.onloadeddata = () => {
      hasLoadedData = true;
      video.currentTime = Math.min(time, Math.max(0, (video.duration || 1) - 0.5));
    };

    video.onseeked = () => {
      try {
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, width, height);

        const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        cleanup();
        resolve({
          thumbnail: thumbnailDataUrl,
          duration: video.duration || 0,
          width,
          height,
        });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error("Failed to load video for snapshot"));
    };

    // Timeout fallback if seeked doesn't fire
    setTimeout(() => {
      if (!hasLoadedData) {
        cleanup();
        reject(new Error("Video snapshot timed out"));
      }
    }, 8000);
  });
}

/**
 * Parse Google Drive Video URL to extract file ID
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/preview
 * - https://drive.google.com/open?id=FILE_ID
 */
export function extractGoogleDriveId(url) {
  if (!url || typeof url !== "string") return null;
  const match =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    url.match(/drive\.google\.com\/.*\/d\/([a-zA-Z0-9_-]+)/);
  return match && match[1] ? match[1] : null;
}

/**
 * Check if a URL is a Google Drive file link
 */
export function isGoogleDriveUrl(url) {
  return Boolean(extractGoogleDriveId(url));
}

/**
 * Get Google Drive Preview Embed URL for video playback
 */
export function getGoogleDriveEmbedUrl(url) {
  const fileId = extractGoogleDriveId(url);
  if (!fileId) return url;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Convert a File object to Base64 data URL
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Detect media type from URL or data
 * @returns {'youtube'|'gdrive'|'video'|'image'}
 */
export function getMediaType(url) {
  if (!url || typeof url !== "string") return "image";

  if (isYouTubeUrl(url)) {
    return "youtube";
  }

  if (isGoogleDriveUrl(url)) {
    return "gdrive";
  }

  const lower = url.toLowerCase();

  // Direct video file extensions or formats
  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".ogg") ||
    lower.endsWith(".mov") ||
    lower.includes(".mp4?") ||
    lower.startsWith("data:video/") ||
    url.startsWith("idb://")
  ) {
    return "video";
  }

  return "image";
}
