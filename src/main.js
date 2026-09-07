import './style.css';
import { PORTFOLIO_DATA } from './portfolio-data.js';
import { CosmicScene } from './scene.js';
import { ScrollController } from './scroll.js';
import { CosmicAudioEngine } from './audio.js';
import { ModalController } from './modal.js';
import { createIcons, icons } from 'lucide';

class App {
  constructor() {
    this.renderDynamicContent();
    this.initCanvas();
    this.initAudio();
    this.initModal();
    this.initCursor();
    this.initNavigation();
    this.initContactForm();
    this.initIcons();
  }

  initCanvas() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    this.scene = new CosmicScene(canvas);
    this.scroll = new ScrollController(this.scene);

    // Clicking on 3D planets triggers the hologram dossier modal
    this.scene.setOnPlanetClick((project) => {
      if (this.modal) {
        this.modal.open(project);
      }
    });
  }

  initAudio() {
    this.audio = new CosmicAudioEngine();
  }

  initModal() {
    this.modal = new ModalController(this.audio);
  }

  renderDynamicContent() {
    const data = PORTFOLIO_DATA;

    // 1. Hero Stats
    const statsContainer = document.getElementById('hero-stats-container');
    if (statsContainer) {
      statsContainer.innerHTML = data.profile.stats.map(s => `
        <div class="cosmic-panel p-4 rounded-lg relative overflow-hidden group">
          <div class="hud-corner-tl"></div>
          <div class="hud-corner-br"></div>
          <div class="text-2xl lg:text-3xl font-orbitron font-bold text-cyan-400 group-hover:text-glow-cyan transition-all">${s.value}</div>
          <div class="text-xs uppercase tracking-wider text-slate-400 mt-1 font-mono">${s.label}</div>
        </div>
      `).join('');
    }

    // 2. Skill Constellations
    const skillsContainer = document.getElementById('skills-grid-container');
    if (skillsContainer) {
      skillsContainer.innerHTML = data.skills.map(c => `
        <div class="cosmic-panel p-6 rounded-xl relative overflow-hidden reveal-item">
          <div class="hud-corner-tl"></div>
          <div class="hud-corner-br"></div>
          <div class="flex items-center gap-3 mb-3">
            <span class="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <i data-lucide="${c.icon}" class="w-5 h-5"></i>
            </span>
            <h3 class="font-orbitron text-lg font-semibold text-white">${c.constellation}</h3>
          </div>
          <p class="text-sm text-slate-300 mb-4 leading-relaxed">${c.description}</p>
          <div class="flex flex-wrap gap-2">
            ${c.skills.map(s => `
              <span class="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors">
                ${s}
              </span>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    // 3. Featured Project Cards (linked to planets)
    const projectsContainer = document.getElementById('projects-grid-container');
    if (projectsContainer) {
      projectsContainer.innerHTML = data.projects.map((p, idx) => `
        <div class="cosmic-panel p-6 rounded-xl relative overflow-hidden group reveal-item flex flex-col justify-between">
          <div class="hud-corner-tl"></div>
          <div class="hud-corner-br"></div>
          
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-2.5 py-0.5 rounded text-xs font-mono border" style="border-color: ${p.accentColor}; color: ${p.accentColor};">
                ${p.planetName}
              </span>
              <span class="text-xs font-mono text-slate-400">${p.category}</span>
            </div>

            <h3 class="font-orbitron text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
              ${p.title}
            </h3>
            
            <p class="text-sm text-slate-300 mb-4 line-clamp-3 leading-relaxed">
              ${p.description}
            </p>

            <div class="text-xs font-mono text-cyan-400/90 mb-4 flex items-center gap-1.5">
              <i data-lucide="gauge" class="w-3.5 h-3.5"></i>
              <span>${p.metrics}</span>
            </div>

            <div class="flex flex-wrap gap-1.5 mb-6">
              ${p.techStack.slice(0, 4).map(t => `
                <span class="px-2 py-0.5 text-xs font-mono rounded bg-slate-900/90 text-slate-400 border border-slate-800">${t}</span>
              `).join('')}
            </div>
          </div>

          <div class="flex items-center gap-3 pt-3 border-t border-slate-800/80">
            <button 
              data-project-index="${idx}" 
              class="inspect-dossier-btn flex-1 py-2 px-3 text-xs font-mono uppercase tracking-wider rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="scan" class="w-3.5 h-3.5"></i>
              Inspect Planet Dossier
            </button>
            <a 
              href="${p.liveUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="p-2 rounded bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-colors">
              <i data-lucide="external-link" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      `).join('');

      // Wire up dossier inspect buttons
      document.querySelectorAll('.inspect-dossier-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-project-index'), 10);
          if (this.modal && data.projects[idx]) {
            this.modal.open(data.projects[idx]);
          }
        });
      });
    }

    // 4. Milestones / Career Spacetime Track
    const milestonesContainer = document.getElementById('milestones-track-container');
    if (milestonesContainer) {
      milestonesContainer.innerHTML = data.milestones.map((m, idx) => `
        <div class="relative pl-8 pb-8 border-l border-cyan-500/30 last:border-0 last:pb-0 reveal-item">
          <!-- Luminous Node -->
          <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
          
          <div class="cosmic-panel p-5 rounded-lg">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="text-xs font-mono font-bold text-cyan-400 tracking-wider">${m.year}</span>
              <span class="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">${m.badge}</span>
            </div>
            <h4 class="font-orbitron font-bold text-white text-base">${m.role}</h4>
            <div class="text-xs font-mono text-slate-400 mb-2">${m.organization}</div>
            <p class="text-sm text-slate-300 leading-relaxed">${m.description}</p>
          </div>
        </div>
      `).join('');
    }
  }

  initCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Scale ring on interactive elements
    const interactives = document.querySelectorAll('a, button, input, textarea, .cosmic-panel');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '52px';
        ring.style.height = '52px';
        ring.style.borderColor = '#22d3ee';
        ring.style.backgroundColor = 'rgba(34, 211, 238, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '38px';
        ring.style.height = '38px';
        ring.style.borderColor = 'rgba(56, 189, 248, 0.45)';
        ring.style.backgroundColor = 'transparent';
      });
    });
  }

  initNavigation() {
    const links = document.querySelectorAll('.nav-jump-link');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl && this.scroll) {
          if (this.audio) {
            this.audio.playWarpTransition();
          }
          this.scroll.scrollTo(targetEl);
        }
      });
    });
  }

  initContactForm() {
    const form = document.getElementById('transmission-form');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const copyFeedback = document.getElementById('copy-feedback');

    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(PORTFOLIO_DATA.transmission.email).then(() => {
          if (copyFeedback) {
            copyFeedback.classList.remove('hidden');
            setTimeout(() => copyFeedback.classList.add('hidden'), 2500);
          }
          if (this.audio) {
            this.audio.playUIBlip(1400);
          }
        });
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = `
          <i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>
          <span>TRANSMITTING FREQUENCY...</span>
        `;
        createIcons({ icons });

        if (this.audio) {
          this.audio.playWarpTransition();
        }

        setTimeout(() => {
          submitBtn.innerHTML = `
            <i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>
            <span class="text-emerald-300">TRANSMISSION RECEIVED // ACK</span>
          `;
          createIcons({ icons });
          form.reset();

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            createIcons({ icons });
          }, 3500);
        }, 1200);
      });
    }
  }

  initIcons() {
    createIcons({ icons });
  }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
