/**
 * useWaveAnimation Composable
 * ============================
 * Canvas-based animated water waves effect for footer.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */

import { onMounted, onUnmounted, ref } from "vue";

/**
 * Wave animation hook
 * @param {Object} options - Configuration options
 * @returns {Object} Canvas ref and control methods
 */
export function useWaveAnimation(options = {}) {
  const config = {
    waveCount: options.waveCount ?? 3,
    waveColors: options.waveColors ?? [
      "rgba(31, 159, 216, 0.3)",
      "rgba(31, 159, 216, 0.2)",
      "rgba(31, 159, 216, 0.1)",
    ],
    waveHeights: options.waveHeights ?? [20, 15, 10],
    waveSpeeds: options.waveSpeeds ?? [0.02, 0.015, 0.01],
    waveOffsets: options.waveOffsets ?? [0, 2, 4],
  };

  const canvasRef = ref(null);
  let animationId = null;
  let time = 0;

  /**
   * Draw a single wave
   */
  const drawWave = (
    ctx,
    width,
    height,
    amplitude,
    frequency,
    speed,
    offset,
    color,
    yOffset
  ) => {
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x <= width; x += 5) {
      const y =
        Math.sin(x * frequency + time * speed + offset) * amplitude +
        (height - amplitude - yOffset);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  /**
   * Animation loop
   */
  const animate = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw waves from back to front
    for (let i = config.waveCount - 1; i >= 0; i--) {
      drawWave(
        ctx,
        width,
        height,
        config.waveHeights[i],
        0.01,
        config.waveSpeeds[i],
        config.waveOffsets[i],
        config.waveColors[i],
        i * 10
      );
    }

    time += 1;
    animationId = requestAnimationFrame(animate);
  };

  /**
   * Setup canvas dimensions
   */
  const setupCanvas = () => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = container.offsetWidth * dpr;
    canvas.height = container.offsetHeight * dpr;
    canvas.style.width = `${container.offsetWidth}px`;
    canvas.style.height = `${container.offsetHeight}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  };

  /**
   * Start animation
   */
  const start = () => {
    setupCanvas();
    animate();
  };

  /**
   * Stop animation
   */
  const stop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  /**
   * Handle resize
   */
  const handleResize = () => {
    setupCanvas();
  };

  // Lifecycle
  onMounted(() => {
    start();
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    stop();
    window.removeEventListener("resize", handleResize);
  });

  return {
    canvasRef,
    start,
    stop,
  };
}

export default useWaveAnimation;
