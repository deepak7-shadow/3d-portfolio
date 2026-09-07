export class ModalController {
  constructor(audioEngine = null) {
    this.audioEngine = audioEngine;
    this.modal = document.getElementById('project-modal');
    this.backdrop = document.getElementById('modal-backdrop');
    this.closeBtn = document.getElementById('modal-close-btn');

    this.titleEl = document.getElementById('modal-title');
    this.subtitleEl = document.getElementById('modal-subtitle');
    this.badgeEl = document.getElementById('modal-planet-badge');
    this.descEl = document.getElementById('modal-desc');
    this.metricsEl = document.getElementById('modal-metrics');
    this.highlightsEl = document.getElementById('modal-highlights');
    this.techEl = document.getElementById('modal-tech-stack');
    this.liveLinkEl = document.getElementById('modal-live-link');
    this.githubLinkEl = document.getElementById('modal-github-link');

    this.initEvents();
  }

  initEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modal && !this.modal.classList.contains('hidden');
  }

  open(project) {
    if (!this.modal || !project) return;

    if (this.audioEngine) {
      this.audioEngine.playUIBlip(900);
    }

    // Populate data
    if (this.titleEl) this.titleEl.innerText = project.title;
    if (this.subtitleEl) this.subtitleEl.innerText = project.subtitle;
    if (this.badgeEl) {
      this.badgeEl.innerText = `${project.planetName} // ${project.planetType}`;
      this.badgeEl.style.borderColor = project.accentColor || '#38bdf8';
      this.badgeEl.style.color = project.accentColor || '#38bdf8';
    }
    if (this.descEl) this.descEl.innerText = project.description;
    if (this.metricsEl) this.metricsEl.innerText = project.metrics;

    // Highlights list
    if (this.highlightsEl) {
      this.highlightsEl.innerHTML = (project.highlights || [])
        .map(h => `<li class="flex items-start gap-2"><span class="text-cyan-400">▹</span><span>${h}</span></li>`)
        .join('');
    }

    // Tech stack badges
    if (this.techEl) {
      this.techEl.innerHTML = (project.techStack || [])
        .map(t => `<span class="px-2.5 py-1 text-xs font-mono rounded bg-slate-900/80 border border-slate-700 text-slate-300">${t}</span>`)
        .join('');
    }

    // Links
    if (this.liveLinkEl) {
      this.liveLinkEl.href = project.liveUrl || '#';
    }
    if (this.githubLinkEl) {
      this.githubLinkEl.href = project.githubUrl || '#';
    }

    // Show modal with animation
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}
