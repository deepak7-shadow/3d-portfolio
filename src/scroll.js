import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ScrollController {
  constructor(scene) {
    this.scene = scene;
    this.initLenis();
    this.initScrollTrigger();
    this.initSectionAnimations();
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Connect Lenis to GSAP ticker for frame-perfect sync
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Update ScrollTrigger on Lenis scroll
    this.lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      if (this.scene) {
        this.scene.setScrollProgress(e.progress, e.velocity);
      }
      this.updateHUDTelemetry(e.progress, e.velocity);
    });
  }

  initScrollTrigger() {
    // Master scroll track timeline spanning the full document scroll
    ScrollTrigger.create({
      trigger: '#scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        if (this.scene) {
          this.scene.setScrollProgress(self.progress, self.getVelocity());
        }
      }
    });
  }

  initSectionAnimations() {
    // Subtle GSAP fades for content sections as they enter and exit viewport
    const sections = [
      { id: '#sector-hero', sector: 'SECTOR 01 // SINGULARITY' },
      { id: '#sector-about', sector: 'SECTOR 02 // NEBULA CORE' },
      { id: '#sector-projects', sector: 'SECTOR 03 // PLANETARY SYSTEM' },
      { id: '#sector-milestones', sector: 'SECTOR 04 // SPACETIME GRID' },
      { id: '#sector-contact', sector: 'SECTOR 05 // BEACON TRANSMISSION' }
    ];

    sections.forEach(({ id, sector }) => {
      const el = document.querySelector(id);
      if (!el) return;

      gsap.fromTo(
        el.querySelectorAll('.reveal-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    });
  }

  updateHUDTelemetry(progress, velocity) {
    // Telemetry DOM elements
    const sectorDisplay = document.getElementById('hud-sector-name');
    const warpDisplay = document.getElementById('hud-warp-factor');
    const progressFill = document.getElementById('hud-progress-fill');
    const coordsDisplay = document.getElementById('hud-coordinates');

    // 1. Progress bar fill
    if (progressFill) {
      progressFill.style.height = `${progress * 100}%`;
    }

    // 2. Warp factor calculation from velocity
    const speed = Math.abs(velocity || 0);
    let warpFactor = (1.0 + Math.min(speed * 0.05, 8.9)).toFixed(1);
    if (warpDisplay) {
      warpDisplay.innerText = `WARP ${warpFactor}`;
      if (warpFactor > 3.0) {
        warpDisplay.classList.add('text-cyan-400', 'text-glow-cyan');
      } else {
        warpDisplay.classList.remove('text-cyan-400', 'text-glow-cyan');
      }
    }

    // 3. Sector determination
    let sectorText = 'SECTOR 01 // SINGULARITY LAUNCH';
    let raHours = 19;
    let raMinutes = Math.floor(50 + progress * 25);
    let decDegrees = Math.floor(8 + progress * 42);

    if (progress < 0.22) {
      sectorText = 'SECTOR 01 // SINGULARITY LAUNCH';
    } else if (progress < 0.48) {
      sectorText = 'SECTOR 02 // NEBULA & SKILL MESH';
    } else if (progress < 0.72) {
      sectorText = 'SECTOR 03 // PLANETARY ARCHITECTURE';
    } else if (progress < 0.88) {
      sectorText = 'SECTOR 04 // GRAVITATIONAL WELL';
    } else {
      sectorText = 'SECTOR 05 // DEEP SPACE BEACON';
    }

    if (sectorDisplay && sectorDisplay.innerText !== sectorText) {
      sectorDisplay.innerText = sectorText;
    }

    if (coordsDisplay) {
      coordsDisplay.innerText = `RA ${raHours}h ${raMinutes}m / DEC +${decDegrees}°14′`;
    }
  }

  scrollTo(target) {
    if (this.lenis) {
      this.lenis.scrollTo(target, { duration: 1.8 });
    }
  }
}
