/**
 * useFallingStars Composable
 * ==========================
 * Canvas-based falling stars & shooting stars animation.
 * Enhanced with more particles and shooting star effects.
 */

import { onMounted, onUnmounted, ref } from "vue";

export function useFallingStars(options = {}) {
  // Configuration with enhanced defaults
  const config = {
    starCount: options.starCount ?? 60, // Increased from 30
    minSize: options.minSize ?? 1,
    maxSize: options.maxSize ?? 3,
    minSpeed: options.minSpeed ?? 0.3,
    maxSpeed: options.maxSpeed ?? 0.8,
    minOpacity: options.minOpacity ?? 0.3,
    maxOpacity: options.maxOpacity ?? 1.0,
    shootingStarInterval: options.shootingStarInterval ?? 3000, // New shooting star every 3 seconds
  };

  // Refs
  const canvasRef = ref(null);
  const isAnimating = ref(false);

  // Internal state
  let ctx = null;
  let stars = [];
  let shootingStars = [];
  let animationId = null;
  let shootingStarTimer = null;
  let width = 0;
  let height = 0;

  const random = (min, max) => Math.random() * (max - min) + min;

  /**
   * Get responsive star count based on viewport
   */
  const getResponsiveStarCount = () => {
    if (typeof window === "undefined") return config.starCount;

    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 640) {
      return Math.floor(config.starCount * 0.5); // 30 stars on mobile
    } else if (viewportWidth <= 1024) {
      return Math.floor(config.starCount * 0.75); // 45 stars on tablet
    }

    return config.starCount; // 60 stars on desktop
  };

  /**
   * Create a falling star
   */
  const createStar = (startFromTop = false) => {
    return {
      x: random(0, width),
      y: startFromTop ? random(-50, -10) : random(-height * 0.1, height),
      size: random(config.minSize, config.maxSize),
      speed: random(config.minSpeed, config.maxSpeed),
      opacity: random(config.minOpacity, config.maxOpacity),
      drift: random(-0.05, 0.05),
      twinkleSpeed: random(0.02, 0.05),
      twinklePhase: random(0, Math.PI * 2),
    };
  };

  /**
   * Create a shooting star
   */
  const createShootingStar = () => {
    const startX = random(width * 0.1, width * 0.9);
    const startY = random(0, height * 0.3);

    return {
      x: startX,
      y: startY,
      length: random(80, 150),
      speed: random(8, 15),
      angle: random(Math.PI * 0.15, Math.PI * 0.35), // Diagonal angle
      opacity: 1,
      trail: [],
      maxTrailLength: 20,
      active: true,
    };
  };

  /**
   * Initialize stars
   */
  const initStars = () => {
    const count = getResponsiveStarCount();
    stars = Array.from({ length: count }, () => createStar(false));
  };

  /**
   * Draw a star
   */
  const drawStar = (star) => {
    if (!ctx) return;

    const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;
    const currentOpacity = star.opacity * twinkle;

    // Main star
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
    ctx.fill();

    // Glow for larger stars
    if (star.size > 1.5) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        star.x,
        star.y,
        0,
        star.x,
        star.y,
        star.size * 2.5
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.3})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  };

  /**
   * Draw a shooting star with trail
   */
  const drawShootingStar = (star) => {
    if (!ctx || !star.active) return;

    // Draw trail
    for (let i = 0; i < star.trail.length; i++) {
      const point = star.trail[i];
      const trailOpacity = (i / star.trail.length) * star.opacity * 0.5;
      const trailSize = 2 * (i / star.trail.length);

      ctx.beginPath();
      ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
      ctx.fill();
    }

    // Draw main shooting star head
    ctx.beginPath();
    ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.fill();

    // Bright glow
    const glowGradient = ctx.createRadialGradient(
      star.x,
      star.y,
      0,
      star.x,
      star.y,
      15
    );
    glowGradient.addColorStop(0, `rgba(135, 206, 250, ${star.opacity * 0.8})`);
    glowGradient.addColorStop(
      0.5,
      `rgba(135, 206, 250, ${star.opacity * 0.3})`
    );
    glowGradient.addColorStop(1, "rgba(135, 206, 250, 0)");
    ctx.beginPath();
    ctx.arc(star.x, star.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();
  };

  /**
   * Update star position
   */
  const updateStar = (star) => {
    star.y += star.speed;
    star.x += star.drift;
    star.twinklePhase += star.twinkleSpeed;

    if (star.y > height + 10) {
      star.y = random(-50, -10);
      star.x = random(0, width);
      star.speed = random(config.minSpeed, config.maxSpeed);
      star.opacity = random(config.minOpacity, config.maxOpacity);
    }

    if (star.x < -10) star.x = width + 10;
    else if (star.x > width + 10) star.x = -10;
  };

  /**
   * Update shooting star
   */
  const updateShootingStar = (star) => {
    if (!star.active) return;

    // Add current position to trail
    star.trail.push({ x: star.x, y: star.y });
    if (star.trail.length > star.maxTrailLength) {
      star.trail.shift();
    }

    // Move shooting star
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;

    // Fade out
    star.opacity -= 0.015;

    // Deactivate if off screen or faded
    if (star.x > width + 50 || star.y > height + 50 || star.opacity <= 0) {
      star.active = false;
    }
  };

  /**
   * Spawn a new shooting star
   */
  const spawnShootingStar = () => {
    if (width > 0 && height > 0) {
      shootingStars.push(createShootingStar());
    }
  };

  /**
   * Main animation loop
   */
  const animate = () => {
    if (!ctx || !isAnimating.value) return;

    ctx.clearRect(0, 0, width, height);

    // Update and draw falling stars
    stars.forEach((star) => {
      updateStar(star);
      drawStar(star);
    });

    // Update and draw shooting stars
    shootingStars = shootingStars.filter((star) => star.active);
    shootingStars.forEach((star) => {
      updateShootingStar(star);
      drawShootingStar(star);
    });

    animationId = requestAnimationFrame(animate);
  };

  /**
   * Resize handler
   */
  const handleResize = () => {
    if (!canvasRef.value) return;

    const canvas = canvasRef.value;
    const rect = canvas.parentElement?.getBoundingClientRect() || {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    width = rect.width;
    height = rect.height;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initStars();
  };

  /**
   * Start animation
   */
  const start = () => {
    if (!canvasRef.value) return;

    isAnimating.value = true;
    handleResize();
    animate();

    // Start shooting star spawner
    shootingStarTimer = setInterval(() => {
      if (Math.random() > 0.3) {
        // 70% chance every interval
        spawnShootingStar();
      }
    }, config.shootingStarInterval);
  };

  /**
   * Stop animation
   */
  const stop = () => {
    isAnimating.value = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (shootingStarTimer) {
      clearInterval(shootingStarTimer);
      shootingStarTimer = null;
    }
  };

  // Lifecycle
  onMounted(() => {
    window.addEventListener("resize", handleResize);
    setTimeout(start, 100);
  });

  onUnmounted(() => {
    stop();
    window.removeEventListener("resize", handleResize);
  });

  return {
    canvasRef,
    isAnimating,
    start,
    stop,
  };
}

export default useFallingStars;
