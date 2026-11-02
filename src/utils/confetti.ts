// High performance canvas confetti generator
// Independent, zero external dependencies

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  color: string;
  shape: 'rect' | 'circle' | 'star';
  opacity: number;
  decay: number;
}

class ConfettiManager {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animId: number | null = null;

  private initCanvas() {
    if (this.canvas) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'birthday-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.resize();
  };

  private resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  public burst(options?: {
    x?: number; // 0 to 1
    y?: number; // 0 to 1
    count?: number;
    colors?: string[];
    spread?: number;
  }) {
    this.initCanvas();
    const count = options?.count ?? 80;
    const originX = (options?.x ?? 0.5) * window.innerWidth;
    const originY = (options?.y ?? 0.6) * window.innerHeight;
    const colors = options?.colors ?? [
      '#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#fbbf24'
    ];
    const spread = options?.spread ?? 70;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * spread - spread / 2 - 90) * (Math.PI / 180);
      const velocity = Math.random() * 14 + 7;
      const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'rect', 'circle', 'star'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      this.particles.push({
        x: originX,
        y: originY,
        w: Math.random() * 8 + 6,
        h: Math.random() * 12 + 6,
        vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * velocity,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape,
        opacity: 1,
        decay: Math.random() * 0.008 + 0.005,
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  public showerCelebration(colors?: string[]) {
    // Multi-stage burst from left and right
    this.burst({ x: 0.2, y: 0.7, count: 70, colors, spread: 80 });
    this.burst({ x: 0.8, y: 0.7, count: 70, colors, spread: 80 });
    setTimeout(() => {
      this.burst({ x: 0.5, y: 0.5, count: 100, colors, spread: 120 });
    }, 200);
    setTimeout(() => {
      this.burst({ x: 0.35, y: 0.6, count: 60, colors, spread: 90 });
      this.burst({ x: 0.65, y: 0.6, count: 60, colors, spread: 90 });
    }, 450);
  }

  private loop = () => {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.985; // drag
      p.rotation += p.vRot;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'star') {
        this.drawStar(this.ctx, 0, 0, 5, p.w * 0.9, p.w * 0.4);
      } else {
        this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(this.loop);
    } else {
      this.animId = null;
    }
  };

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

export const confetti = new ConfettiManager();
