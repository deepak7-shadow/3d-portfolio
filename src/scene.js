import * as THREE from 'three';
import { PORTFOLIO_DATA } from './portfolio-data.js';

export class CosmicScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scrollProgress = 0;
    this.warpSpeed = 0;
    this.targetWarpSpeed = 0;

    // Mouse coordinates for parallax & raycasting
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.raycaster = new THREE.Raycaster();
    this.mouseNDC = new THREE.Vector2(-999, -999);
    this.hoveredPlanet = null;

    // Interactive planets array for raycasting
    this.interactivePlanets = [];
    this.onPlanetClickCallback = null;

    this.clock = new THREE.Clock();

    this.initRenderer();
    this.initCamera();
    this.initScene();
    this.initLighting();
    this.initStarfields();
    this.initSingularity();
    this.initNebula();
    this.initConstellation();
    this.initPlanetarySystem();
    this.initSpacetimeGrid();
    this.initTransmissionBeacon();
    this.initEvents();

    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(55, this.width / this.height, 0.1, 2000);
    this.camera.position.set(0, 0, 45);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.0035);
  }

  initLighting() {
    // Ambient cosmic fill
    this.ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    this.scene.add(this.ambientLight);

    // Singularity central glow point
    this.singularityLight = new THREE.PointLight(0x38bdf8, 4.0, 100);
    this.singularityLight.position.set(0, 0, 0);
    this.scene.add(this.singularityLight);

    // Star System Key Light (for planets)
    this.systemLight = new THREE.PointLight(0xffffff, 5.0, 250);
    this.systemLight.position.set(0, 15, -150);
    this.scene.add(this.systemLight);

    // Nebula violet/cyan rim directional light
    this.rimLight = new THREE.DirectionalLight(0x818cf8, 1.2);
    this.rimLight.position.set(20, 40, 20);
    this.scene.add(this.rimLight);
  }

  // --- 1. MULTI-LAYER STARFIELDS & WARP STREAKS ---
  initStarfields() {
    this.starGroup = new THREE.Group();
    this.scene.add(this.starGroup);

    // Deep background twinkling stars
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0x818cf8),
      new THREE.Color(0xc084fc),
      new THREE.Color(0xfde047)
    ];

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      starPos[i3] = (Math.random() - 0.5) * 1200;
      starPos[i3 + 1] = (Math.random() - 0.5) * 800;
      starPos[i3 + 2] = (Math.random() - 0.5) * 1200 - 150;

      const c = palette[Math.floor(Math.random() * palette.length)];
      starColors[i3] = c.r;
      starColors[i3 + 1] = c.g;
      starColors[i3 + 2] = c.b;

      starSizes[i] = Math.random() * 2.2 + 0.8;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    // Custom star shader for distance attenuation and twinkling
    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.starGroup.add(this.stars);

    // Warp streaks (appear when scrolling quickly)
    const streakCount = 350;
    const streakGeo = new THREE.BufferGeometry();
    const streakPos = new Float32Array(streakCount * 6);
    this.streakVelocities = [];

    for (let i = 0; i < streakCount; i++) {
      const i6 = i * 6;
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 80;
      const z = Math.random() * 200 - 100;

      streakPos[i6] = x;
      streakPos[i6 + 1] = y;
      streakPos[i6 + 2] = z;

      streakPos[i6 + 3] = x;
      streakPos[i6 + 4] = y;
      streakPos[i6 + 5] = z - 6;

      this.streakVelocities.push({
        x, y, z,
        speed: Math.random() * 2 + 1
      });
    }

    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
    const streakMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending
    });

    this.warpStreaks = new THREE.LineSegments(streakGeo, streakMat);
    this.scene.add(this.warpStreaks);
  }

  // --- 2. SECTOR 01: GRAVITATIONAL SINGULARITY ---
  initSingularity() {
    this.singularityGroup = new THREE.Group();
    this.singularityGroup.position.set(0, 0, 0);
    this.scene.add(this.singularityGroup);

    // Black Hole Event Horizon sphere
    const coreGeo = new THREE.SphereGeometry(2.4, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.blackHoleCore = new THREE.Mesh(coreGeo, coreMat);
    this.singularityGroup.add(this.blackHoleCore);

    // Glowing photon sphere halo
    const haloGeo = new THREE.SphereGeometry(2.65, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x38bdf8) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
          gl_FragColor = vec4(glowColor, intensity * 1.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.photonHalo = new THREE.Mesh(haloGeo, haloMat);
    this.singularityGroup.add(this.photonHalo);

    // Swirling Accretion Disk Particles
    const diskParticleCount = 1800;
    const diskGeo = new THREE.BufferGeometry();
    const diskPos = new Float32Array(diskParticleCount * 3);
    const diskColors = new Float32Array(diskParticleCount * 3);
    this.diskData = [];

    const innerRadius = 3.8;
    const outerRadius = 14.5;

    for (let i = 0; i < diskParticleCount; i++) {
      const radius = THREE.MathUtils.lerp(innerRadius, outerRadius, Math.pow(Math.random(), 0.7));
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.45 * (1 - (radius - innerRadius) / outerRadius);

      const i3 = i * 3;
      diskPos[i3] = Math.cos(angle) * radius;
      diskPos[i3 + 1] = height;
      diskPos[i3 + 2] = Math.sin(angle) * radius;

      // Color gradient from inner ultra-hot cyan/white to outer violet/amber
      const t = (radius - innerRadius) / (outerRadius - innerRadius);
      const c = new THREE.Color();
      if (t < 0.3) {
        c.setHex(0xe0f2fe).lerp(new THREE.Color(0x38bdf8), t / 0.3);
      } else if (t < 0.7) {
        c.setHex(0x38bdf8).lerp(new THREE.Color(0xa855f7), (t - 0.3) / 0.4);
      } else {
        c.setHex(0xa855f7).lerp(new THREE.Color(0xf59e0b), (t - 0.7) / 0.3);
      }

      diskColors[i3] = c.r;
      diskColors[i3 + 1] = c.g;
      diskColors[i3 + 2] = c.b;

      this.diskData.push({
        radius,
        angle,
        height,
        // Keplerian orbital velocity: inner orbits faster
        speed: (Math.sqrt(20.0 / radius) * 0.015)
      });
    }

    diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3));
    diskGeo.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));

    const diskMat = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.accretionDisk = new THREE.Points(diskGeo, diskMat);
    // Tilt accretion disk for dramatic viewing angle
    this.accretionDisk.rotation.x = 0.55;
    this.accretionDisk.rotation.z = -0.3;
    this.singularityGroup.add(this.accretionDisk);
  }

  // --- 3. SECTOR 02: VOLUMETRIC PROCEDURAL NEBULA ---
  initNebula() {
    this.nebulaGroup = new THREE.Group();
    this.nebulaGroup.position.set(0, 10, -75);
    this.scene.add(this.nebulaGroup);

    // Procedural noise clouds using layered transparent billboard quads with noise shader
    const cloudCount = 18;
    const cloudGeo = new THREE.PlaneGeometry(60, 60);

    const cloudShader = {
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;

        // Simplex 2D noise approximation
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 p = vUv - 0.5;
          float dist = length(p);
          float alphaCircle = smoothstep(0.5, 0.05, dist);

          float n = snoise(vUv * 3.0 + vec2(time * 0.04, time * 0.02));
          float n2 = snoise(vUv * 6.0 - vec2(time * 0.03, time * 0.05));
          float combined = (n * 0.6 + n2 * 0.4) * 0.5 + 0.5;

          vec3 finalColor = mix(color1, color2, combined);
          float finalAlpha = alphaCircle * combined * opacity;

          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `
    };

    this.cloudMaterials = [];

    for (let i = 0; i < cloudCount; i++) {
      const mat = new THREE.ShaderMaterial({
        vertexShader: cloudShader.vertexShader,
        fragmentShader: cloudShader.fragmentShader,
        uniforms: {
          color1: { value: i % 2 === 0 ? new THREE.Color(0x4338ca) : new THREE.Color(0x0284c7) },
          color2: { value: i % 3 === 0 ? new THREE.Color(0x9333ea) : new THREE.Color(0x06b6d4) },
          time: { value: 0 },
          opacity: { value: 0.22 }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      this.cloudMaterials.push(mat);

      const mesh = new THREE.Mesh(cloudGeo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 60
      );
      mesh.rotation.z = Math.random() * Math.PI * 2;
      mesh.scale.setScalar(Math.random() * 0.8 + 0.8);
      this.nebulaGroup.add(mesh);
    }
  }

  // --- 4. SECTOR 02: SKILL CONSTELLATION NODES ---
  initConstellation() {
    this.constellationGroup = new THREE.Group();
    this.constellationGroup.position.set(0, 10, -75);
    this.scene.add(this.constellationGroup);

    // 16 Luminous nodes connected by laser threads
    const nodeCount = 18;
    this.constellationNodes = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.55, 1);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8
    });

    const positions = [];
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2;
      const radius = 14 + Math.sin(i * 3.5) * 5;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * (radius * 0.6) + (Math.sin(i * 2) * 3);
      const z = (Math.random() - 0.5) * 12;

      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
      mesh.position.set(x, y, z);
      this.constellationGroup.add(mesh);
      this.constellationNodes.push({
        mesh,
        basePos: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2
      });

      positions.push(new THREE.Vector3(x, y, z));
    }

    // Connect nodes with laser threads
    const lineIndices = [];
    for (let i = 0; i < nodeCount; i++) {
      // Connect to adjacent
      lineIndices.push(i, (i + 1) % nodeCount);
      // Connect across constellation
      if (i % 3 === 0) {
        lineIndices.push(i, (i + 5) % nodeCount);
      }
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(positions);
    lineGeo.setIndex(lineIndices);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    this.constellationLines = new THREE.LineSegments(lineGeo, lineMat);
    this.constellationGroup.add(this.constellationLines);
  }

  // --- 5. SECTOR 03: ORBITING PLANETARY SYSTEM (PROJECTS) ---
  initPlanetarySystem() {
    this.planetSystemGroup = new THREE.Group();
    this.planetSystemGroup.position.set(0, 0, -170);
    this.scene.add(this.planetSystemGroup);

    // Central Radiant Star / Sun
    const sunGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.systemSun = new THREE.Mesh(sunGeo, sunMat);
    this.planetSystemGroup.add(this.systemSun);

    // Sun Corona Glow
    const sunHaloGeo = new THREE.SphereGeometry(4.8, 32, 32);
    const sunHaloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(1.0, 0.9, 0.6, intensity * 1.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    this.systemSun.add(new THREE.Mesh(sunHaloGeo, sunHaloMat));

    // 4 Distinct Procedural Planets from PORTFOLIO_DATA
    const projects = PORTFOLIO_DATA.projects;
    this.planets = [];

    const planetConfigs = [
      { radius: 2.2, orbitRadius: 16, speed: 0.008, color: projects[0]?.planetColor || 0x10b981, hasRings: true },
      { radius: 1.8, orbitRadius: 26, speed: 0.006, color: projects[1]?.planetColor || 0x06b6d4, hasRings: false },
      { radius: 2.0, orbitRadius: 36, speed: 0.004, color: projects[2]?.planetColor || 0xf59e0b, hasMoon: true },
      { radius: 1.9, orbitRadius: 46, speed: 0.003, color: projects[3]?.planetColor || 0xa855f7, hasRings: false }
    ];

    projects.forEach((proj, idx) => {
      const cfg = planetConfigs[idx];
      const planetPivot = new THREE.Group();
      this.planetSystemGroup.add(planetPivot);

      // Orbit Path Guide Ring
      const orbitCurve = new THREE.EllipseCurve(0, 0, cfg.orbitRadius, cfg.orbitRadius, 0, 2 * Math.PI, false, 0);
      const orbitPoints = orbitCurve.getPoints(96);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      const orbitRing = new THREE.Line(orbitGeo, orbitMat);
      orbitRing.rotation.x = 0.2; // Slight system tilt
      planetPivot.add(orbitRing);

      // Planet Mesh
      const pGeo = new THREE.SphereGeometry(cfg.radius, 48, 48);
      let pMat;

      if (idx === 0) {
        // Agri-Core (Precision Ag Emerald World)
        pMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.5,
          metalness: 0.2,
          emissive: 0x064e3b,
          emissiveIntensity: 0.4
        });
      } else if (idx === 1) {
        // SignBridge Nexus (Cyan Vision Sphere)
        pMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.2,
          metalness: 0.8,
          emissive: 0x0e7490,
          emissiveIntensity: 0.5
        });
      } else if (idx === 2) {
        // Arena Grid (Amber Sports Match Core)
        pMat = new THREE.MeshStandardMaterial({
          color: cfg.color,
          roughness: 0.4,
          metalness: 0.4,
          emissive: 0x78350f,
          emissiveIntensity: 0.5
        });
      } else {
        // Vesper Glaciem (Crystalline 3D World)
        pMat = new THREE.MeshPhysicalMaterial({
          color: cfg.color,
          roughness: 0.1,
          transmission: 0.4,
          ior: 1.5,
          emissive: 0x581c87,
          emissiveIntensity: 0.5
        });
      }

      const planetMesh = new THREE.Mesh(pGeo, pMat);
      // Give initial starting angle
      const startAngle = (idx * Math.PI * 0.5) + 0.4;
      planetMesh.position.set(
        Math.cos(startAngle) * cfg.orbitRadius,
        0,
        Math.sin(startAngle) * cfg.orbitRadius
      );
      planetPivot.add(planetMesh);

      // Link UserData for Raycaster
      planetMesh.userData = {
        isPlanet: true,
        projectIndex: idx,
        projectData: proj,
        baseScale: 1.0,
        originalColor: cfg.color
      };
      this.interactivePlanets.push(planetMesh);

      // Atmosphere Glow Layer
      const atmoGeo = new THREE.SphereGeometry(cfg.radius * 1.16, 32, 32);
      const atmoMat = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(cfg.color) }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
            gl_FragColor = vec4(glowColor, intensity * 1.4);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
      planetMesh.add(atmoMesh);

      // Add Rings to Aurelia
      if (cfg.hasRings) {
        const ringGeo = new THREE.RingGeometry(cfg.radius * 1.5, cfg.radius * 2.8, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x818cf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55
        });
        const rings = new THREE.Mesh(ringGeo, ringMat);
        rings.rotation.x = Math.PI / 2.3;
        planetMesh.add(rings);
      }

      // Add Moon to Oceanus
      if (cfg.hasMoon) {
        const moonGeo = new THREE.SphereGeometry(0.4, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.8 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        const moonPivot = new THREE.Group();
        planetMesh.add(moonPivot);
        moonMesh.position.set(cfg.radius * 2.2, 0, 0);
        moonPivot.add(moonMesh);
        cfg.moonPivot = moonPivot;
      }

      this.planets.push({
        pivot: planetPivot,
        mesh: planetMesh,
        config: cfg,
        angle: startAngle
      });
    });
  }

  // --- 6. SECTOR 04: SPACETIME WARP GRID & MILESTONES ---
  initSpacetimeGrid() {
    this.gridGroup = new THREE.Group();
    this.gridGroup.position.set(0, -12, -260);
    this.scene.add(this.gridGroup);

    // Spacetime Coordinate Grid with dynamic wave vertex deformation
    const gridWidth = 90;
    const gridDepth = 90;
    const segments = 45;

    this.gridGeo = new THREE.PlaneGeometry(gridWidth, gridDepth, segments, segments);
    this.gridGeo.rotateX(-Math.PI / 2);

    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });

    this.spacetimeGrid = new THREE.Mesh(this.gridGeo, gridMat);
    this.gridGroup.add(this.spacetimeGrid);

    // Gravitational Well Beacons representing Milestones
    const milestones = PORTFOLIO_DATA.milestones;
    this.milestoneBeacons = [];

    milestones.forEach((m, idx) => {
      const beaconGroup = new THREE.Group();
      const zOffset = (idx - (milestones.length - 1) / 2) * 20;
      const xOffset = ((idx % 2 === 0 ? 1 : -1) * 12);

      beaconGroup.position.set(xOffset, 2, zOffset);
      this.gridGroup.add(beaconGroup);

      // Core Orb
      const orbGeo = new THREE.IcosahedronGeometry(1.0, 2);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        wireframe: true
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      beaconGroup.add(orb);

      // Orbiting pulse ring
      const ringGeo = new THREE.RingGeometry(1.6, 1.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const pulseRing = new THREE.Mesh(ringGeo, ringMat);
      pulseRing.rotation.x = Math.PI / 2;
      beaconGroup.add(pulseRing);

      this.milestoneBeacons.push({
        group: beaconGroup,
        orb,
        ring: pulseRing,
        baseY: 2,
        phase: idx * 1.2
      });
    });
  }

  // --- 7. SECTOR 05: DEEP SPACE TRANSMISSION BEACON ---
  initTransmissionBeacon() {
    this.beaconGroup = new THREE.Group();
    this.beaconGroup.position.set(0, 0, -350);
    this.scene.add(this.beaconGroup);

    // Futuristic Monolith / Antenna Spire
    const spireGeo = new THREE.ConeGeometry(2.5, 24, 4);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.95
    });
    this.spire = new THREE.Mesh(spireGeo, spireMat);
    this.spire.position.y = -4;
    this.beaconGroup.add(this.spire);

    // Pulsing Subspace Emitter Beacon at Top
    const emitterGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const emitterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.emitter = new THREE.Mesh(emitterGeo, emitterMat);
    this.emitter.position.y = 8;
    this.beaconGroup.add(this.emitter);

    // Holographic Expanding Transmission Waves
    this.transmissionRings = [];
    for (let i = 0; i < 5; i++) {
      const ringGeo = new THREE.RingGeometry(0.8, 1.2, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 8;
      ring.rotation.x = Math.PI / 2;
      this.beaconGroup.add(ring);
      this.transmissionRings.push({
        mesh: ring,
        progress: i * 0.2
      });
    }
  }

  // --- 8. EVENTS & INTERACTIVITY ---
  initEvents() {
    window.addEventListener('resize', () => this.onResize());

    // Mouse movement tracking for parallax and raycasting
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / this.width) * 2 - 1;
      this.mouse.targetY = -(e.clientY / this.height) * 2 + 1;

      this.mouseNDC.x = (e.clientX / this.width) * 2 - 1;
      this.mouseNDC.y = -(e.clientY / this.height) * 2 + 1;
    });

    // Planet click handler
    this.canvas.addEventListener('click', () => {
      if (this.hoveredPlanet && this.onPlanetClickCallback) {
        this.onPlanetClickCallback(this.hoveredPlanet.userData.projectData);
      }
    });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setScrollProgress(progress, velocity = 0) {
    this.scrollProgress = progress;
    this.targetWarpSpeed = Math.min(Math.abs(velocity) * 0.04, 3.5);
  }

  setOnPlanetClick(callback) {
    this.onPlanetClickCallback = callback;
  }

  // --- 9. ANIMATION & RENDER LOOP ---
  animate() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // 1. Mouse smooth parallax interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 2. Warp Speed smoothing
    this.warpSpeed += (this.targetWarpSpeed - this.warpSpeed) * 0.1;
    this.targetWarpSpeed *= 0.92; // Decay warp speed

    // 3. Camera Choreography along Flight Trajectory
    this.updateCameraPath();

    // 4. Update Starfields & Warp Streaks
    this.stars.rotation.y = time * 0.015;
    this.stars.rotation.x = time * 0.008;

    if (this.warpStreaks) {
      const streakMat = this.warpStreaks.material;
      streakMat.opacity = THREE.MathUtils.clamp(this.warpSpeed * 0.4, 0, 0.85);

      const pos = this.warpStreaks.geometry.attributes.position.array;
      const count = this.streakVelocities.length;

      for (let i = 0; i < count; i++) {
        const vel = this.streakVelocities[i];
        const i6 = i * 6;
        vel.z += (vel.speed + this.warpSpeed * 8);

        if (vel.z > this.camera.position.z + 20) {
          vel.z = this.camera.position.z - 120;
        }

        pos[i6 + 2] = vel.z;
        pos[i6 + 5] = vel.z - (4 + this.warpSpeed * 10);
      }
      this.warpStreaks.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Singularity Animation
    if (this.accretionDisk) {
      const pos = this.accretionDisk.geometry.attributes.position.array;
      for (let i = 0; i < this.diskData.length; i++) {
        const p = this.diskData[i];
        p.angle += p.speed;
        const i3 = i * 3;
        pos[i3] = Math.cos(p.angle) * p.radius;
        pos[i3 + 2] = Math.sin(p.angle) * p.radius;
      }
      this.accretionDisk.geometry.attributes.position.needsUpdate = true;
      this.singularityGroup.rotation.y = time * 0.08;
    }

    // 6. Nebula Shader Time Update
    if (this.cloudMaterials) {
      this.cloudMaterials.forEach((mat) => {
        mat.uniforms.time.value = time;
      });
      this.nebulaGroup.rotation.z = time * 0.02;
    }

    // 7. Constellation Nodes Pulse
    if (this.constellationNodes) {
      this.constellationNodes.forEach((node) => {
        node.mesh.position.y = node.basePos.y + Math.sin(time * 2 + node.phase) * 0.6;
        node.mesh.rotation.x = time * 0.5;
        node.mesh.rotation.y = time * 0.8;
      });
      this.constellationGroup.rotation.y = time * 0.03;
    }

    // 8. Planets Orbit & Self-Rotation
    if (this.planets) {
      this.planets.forEach((p) => {
        p.angle += p.config.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.config.orbitRadius;
        p.mesh.position.z = Math.sin(p.angle) * p.config.orbitRadius;
        p.mesh.rotation.y += 0.012;

        if (p.config.moonPivot) {
          p.config.moonPivot.rotation.y += 0.03;
        }
      });
    }

    // 9. Spacetime Grid Gravitational Waves
    if (this.gridGeo) {
      const pos = this.gridGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const w = pos.getZ(i);
        // Harmonic ripples
        const wave = Math.sin(u * 0.15 + time * 2) * Math.cos(w * 0.15 + time * 1.5) * 1.2;
        pos.setY(i, wave);
      }
      pos.needsUpdate = true;
    }

    // Milestones Beacons floating
    if (this.milestoneBeacons) {
      this.milestoneBeacons.forEach((b) => {
        b.group.position.y = b.baseY + Math.sin(time * 2.5 + b.phase) * 0.8;
        b.orb.rotation.y = time * 1.2;
        b.ring.rotation.z = time * 0.9;
        const scale = 1.0 + Math.sin(time * 3 + b.phase) * 0.15;
        b.ring.scale.set(scale, scale, scale);
      });
    }

    // 10. Transmission Waves Expanding
    if (this.transmissionRings) {
      this.transmissionRings.forEach((r) => {
        r.progress = (r.progress + delta * 0.4) % 1.0;
        const scale = 1.0 + r.progress * 18.0;
        r.mesh.scale.set(scale, scale, 1);
        r.mesh.material.opacity = (1.0 - r.progress) * 0.7;
      });
      if (this.emitter) {
        const pulse = 1.0 + Math.sin(time * 8) * 0.2;
        this.emitter.scale.set(pulse, pulse, pulse);
      }
    }

    // 11. Raycasting & Planet Hover Detection
    this.checkPlanetHover();

    // 12. Render WebGL
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.animate);
  }

  // --- 10. CINEMATIC CAMERA FLIGHT PATH (SECTORS 1 TO 5) ---
  updateCameraPath() {
    const p = this.scrollProgress; // 0.0 to 1.0

    // Waypoints along cosmic corridor
    // Sector 1: Origin (0.0 to 0.2)
    // Sector 2: Nebula (0.2 to 0.4)
    // Sector 3: Planets (0.4 to 0.65)
    // Sector 4: Spacetime Grid (0.65 to 0.85)
    // Sector 5: Transmission (0.85 to 1.0)

    let camX = 0, camY = 0, camZ = 45;
    let targetX = 0, targetY = 0, targetZ = 0;

    if (p < 0.2) {
      // Sector 1: Singularity Origin
      const t = p / 0.2;
      camX = Math.sin(t * Math.PI) * 5;
      camY = Math.sin(t * 2) * 3;
      camZ = THREE.MathUtils.lerp(45, 10, t);

      targetX = 0;
      targetY = 0;
      targetZ = THREE.MathUtils.lerp(0, -35, t);
    } else if (p < 0.45) {
      // Sector 2: Nebula Core & Skill Constellations
      const t = (p - 0.2) / 0.25;
      camX = Math.sin(t * Math.PI * 1.5) * 12;
      camY = THREE.MathUtils.lerp(2, 14, t);
      camZ = THREE.MathUtils.lerp(10, -50, t);

      targetX = 0;
      targetY = 10;
      targetZ = -75;
    } else if (p < 0.7) {
      // Sector 3: Orbiting Planetary System
      const t = (p - 0.45) / 0.25;
      camX = Math.cos(t * Math.PI * 2) * 22;
      camY = THREE.MathUtils.lerp(14, 8, t);
      camZ = THREE.MathUtils.lerp(-50, -135, t);

      targetX = 0;
      targetY = 0;
      targetZ = -170;
    } else if (p < 0.88) {
      // Sector 4: Spacetime Warp Grid
      const t = (p - 0.7) / 0.18;
      camX = Math.sin(t * Math.PI) * -8;
      camY = THREE.MathUtils.lerp(8, 6, t);
      camZ = THREE.MathUtils.lerp(-135, -225, t);

      targetX = 0;
      targetY = -8;
      targetZ = -260;
    } else {
      // Sector 5: Transmission Beacon Array
      const t = (p - 0.88) / 0.12;
      camX = 0;
      camY = THREE.MathUtils.lerp(6, 4, t);
      camZ = THREE.MathUtils.lerp(-225, -315, t);

      targetX = 0;
      targetY = 6;
      targetZ = -350;
    }

    // Apply mouse parallax displacement
    const parallaxStrength = 4.5;
    this.camera.position.x = camX + this.mouse.x * parallaxStrength;
    this.camera.position.y = camY + this.mouse.y * parallaxStrength;
    this.camera.position.z = camZ;

    this.cameraTarget.x = targetX + this.mouse.x * 2.0;
    this.cameraTarget.y = targetY + this.mouse.y * 2.0;
    this.cameraTarget.z = targetZ;

    this.camera.lookAt(this.cameraTarget);
  }

  // --- 11. PLANET HOVER RAYCASTING ---
  checkPlanetHover() {
    if (this.interactivePlanets.length === 0) return;

    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactivePlanets, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (this.hoveredPlanet !== hit) {
        if (this.hoveredPlanet) {
          this.resetPlanetScale(this.hoveredPlanet);
        }
        this.hoveredPlanet = hit;
        this.scaleUpPlanet(hit);
        document.body.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredPlanet) {
        this.resetPlanetScale(this.hoveredPlanet);
        this.hoveredPlanet = null;
        document.body.style.cursor = 'default';
      }
    }
  }

  scaleUpPlanet(mesh) {
    mesh.scale.set(1.2, 1.2, 1.2);
  }

  resetPlanetScale(mesh) {
    mesh.scale.set(1.0, 1.0, 1.0);
  }

  destroy() {
    cancelAnimationFrame(this.rafId);
    this.renderer.dispose();
  }
}
