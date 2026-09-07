# COSMIC VOYAGE — 3D Deep Space Portfolio 🚀

An immersive, cinematic 3D web developer portfolio built with **Three.js**, **GSAP ScrollTrigger**, **Lenis Smooth Scroll**, and **Web Audio API**.

---

## ✨ Features & Visual Waypoints

- **Sector 01: Singularity Origin (Hero)**:
  - Deep multi-tiered 3D starfield with 3,500+ stars, color temperatures, and twinkling shaders.
  - Black hole event horizon with swirling Keplerian particle accretion disk (1,800+ particles).
  - Dynamic warp streaks that activate when scrolling at high velocities.
  - Telemetry HUD with real-time celestial coordinates (`RA / DEC`), Warp speed gauge, and star-tracker reticle cursor.

- **Sector 02: The Nebula Core (Identity & Skills)**:
  - Procedural volumetric nebula gas clouds rendered with simplex noise GLSL shaders.
  - Luminous 3D skill constellation nodes connected by pulsating laser threads.
  - Glassmorphic skill cards categorized into Core Engines, 3D Graphics/Spatial Web, Application Frameworks, and Cloud/DevOps.

- **Sector 03: The Planetary System (Featured Projects)**:
  - Central radiant sun with corona glow.
  - 4 uniquely textured procedural 3D planets orbiting in real-time (Gas Giant with rings, Molten Volcanic Core, Bioluminescent Ocean world, Crystalline Ice world).
  - Raycasted 3D planet interaction: hovering scales up the planet in the 3D sky; clicking opens the **Holographic Project Dossier** modal.

- **Sector 04: Spacetime Trajectory (Milestones)**:
  - Dynamically displaced spacetime coordinate grid undulating with gravitational ripples.
  - Gravitational milestone beacons floating with orbital pulse rings.

- **Sector 05: Subspace Transmission (Contact)**:
  - Deep-space transmission spire emitting expanding holographic radiation rings.
  - Interactive subspace communication form, fast copy beacon button, and social channels.

- **Procedural Web Audio Engine**:
  - Zero external MP3 files required! Pure Web Audio API synthesis generating binaural deep-space drones, filtered solar wind, celestial shimmering overtones, and holographic UI telemetry blips.

---

## 🛠️ Tech Stack

- **Three.js** — 3D WebGL scenes, procedural particle physics, custom GLSL shaders, and raycasting.
- **GSAP & ScrollTrigger** — Camera trajectory flight path and telemetry synchronization.
- **Lenis** — Silky smooth momentum scrolling.
- **Tailwind CSS v4** — High-tech glassmorphism and modern responsive layout.
- **Lucide Icons** — Crisp sci-fi icons.
- **Vite** — Ultra-fast development and optimized production bundling.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
The production bundle will be generated in `dist/`.

---

## ✏️ How to Personalize Your Information

All your personal details, bio, skills, project names, descriptions, metrics, and links are cleanly isolated in **`src/portfolio-data.js`**.

Open `src/portfolio-data.js` to change:
- `profile.name` & `profile.title`
- `skills` constellations
- `projects` titles, highlights, tech stack tags, and live URLs
- `milestones` career timeline
- `transmission` contact email and social handles

---

## 📜 License
MIT
