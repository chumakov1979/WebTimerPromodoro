/**
 * Theatrical Gold & Crimson Stage Confetti
 */
export function fireConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    isSparkle?: boolean;
  }> = [];

  // Royal Queen stage colors: Brilliant Gold, Velvet Crimson, Royal Purple, Champagne, Rose Gold
  const colors = [
    '#facc15', // gold
    '#fbbf24', // amber gold
    '#e11d48', // crimson
    '#be123c', // deep ruby
    '#9333ea', // royal purple
    '#fef08a', // champagne shimmer
    '#ffffff', // spotlight white
  ];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: width * (0.3 + Math.random() * 0.4),
      y: height * 0.42,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 14 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 7,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      opacity: 1,
      isSparkle: Math.random() > 0.6,
    });
  }

  const startTime = Date.now();

  function animate() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    if (elapsed > 2800) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // gravity
      p.vx *= 0.985;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - elapsed / 2800);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.isSparkle) {
        // Draw diamond spark
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.4, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.4, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }

      ctx.restore();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
