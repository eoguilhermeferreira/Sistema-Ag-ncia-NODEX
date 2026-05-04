export const fmt = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export const fmtShort = (n) => {
  if (n >= 1e6) return `R$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `R$${(n / 1e3).toFixed(0)}k`;
  return fmt(n);
};

export const load = (key, def) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
};

export const save = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};

export function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 200,
    w: 6 + Math.random() * 8,
    h: 10 + Math.random() * 6,
    r: Math.random() * Math.PI * 2,
    rv: (Math.random() - 0.5) * 0.15,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    color: ['#7B1226', '#C8294A', '#F0EDE8', '#FFD700', '#FF6B6B', '#9E1A33'][
      Math.floor(Math.random() * 6)
    ],
    alpha: 1,
  }));

  let frame = 0;
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.rv;
      p.vy += 0.04;
      if (frame > 120) p.alpha -= 0.01;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 220 && pieces.some((p) => p.alpha > 0)) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };
  requestAnimationFrame(tick);
}
