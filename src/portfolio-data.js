/**
 * Cosmic Voyage - Deepak R Portfolio Configuration Data
 * Grounded in AI, IoT, Computer Science, and Connected Systems
 */

export const PORTFOLIO_DATA = {
  profile: {
    name: "Deepak R",
    callsign: "DEEPAK-R // CSE-AI-IOT",
    title: "Computer Science & Engineering · AI & IoT Innovator",
    tagline: "Building systems that notice what matters — bridging applied AI, connected hardware, and thoughtful software.",
    location: "13°02′N / 77°35′E // India",
    status: "SYSTEM OPTIMAL // 2ND YEAR CSE · CGPA 9.4",
    bio: "Computer Science & Engineering student at Shri Venkateshwara College of Engineering with an insatiable drive for practical innovation. Passionate about applying machine learning, computer vision, IoT microcontrollers (ESP32), and full-stack web architectures to solve real-world challenges with zero waste.",
    stats: [
      { label: "First-Year CGPA", value: "9.4 / 10" },
      { label: "Current Stage", value: "2nd Year" },
      { label: "Key Flagship Builds", value: "3+" },
      { label: "Core Protocol", value: "Sense · Decide · Act" }
    ],
    coordinates: "13°02′N 77°35′E // RA 19h 50m"
  },

  skills: [
    {
      constellation: "Core Languages & Logic",
      icon: "code-2",
      description: "Foundational programming paradigms, algorithm design, and structured computing.",
      skills: ["C++", "Python", "TypeScript", "JavaScript", "HTML5", "CSS3", "C"]
    },
    {
      constellation: "Connected Systems & IoT",
      icon: "cpu",
      description: "Microcontroller firmware, wireless telemetry protocols, and sensor integration.",
      skills: ["ESP32", "Blynk IoT Platform", "IoT Sensors & Actuators", "Hardware Integration", "Embedded C++", "Micro-controllers"]
    },
    {
      constellation: "Applied AI & Computer Vision",
      icon: "brain-circuit",
      description: "Perception pipelines, computer vision landmarks, and accessible human-machine interaction.",
      skills: ["MediaPipe Vision", "Web Speech APIs", "Hand Tracking", "Machine Learning Fundamentals", "Automation Logic", "Problem Solving"]
    },
    {
      constellation: "Modern Web & Developer Tools",
      icon: "layers",
      description: "Full-stack architectures, API design, version control, and visual application prototyping.",
      skills: ["React", "Tailwind CSS", "Node.js / Express", "tRPC", "MongoDB", "Razorpay APIs", "Git / GitHub", "VS Code", "FlutterFlow"]
    }
  ],

  projects: [
    {
      id: "smart-nozzle",
      title: "Smart Pesticide Spraying Nozzle",
      subtitle: "AI & IoT Precision-Agriculture Targeted Treatment System",
      category: "Connected Hardware & AI",
      planetName: "Agri-Core (Terra)",
      planetType: "Precision Agricultural World",
      planetColor: 0x10b981,
      accentColor: "#34d399",
      description: "A precision-agriculture hardware and IoT system engineered to identify crop areas that require treatment and spray only the necessary amount—replacing blanket spraying with targeted action to eliminate chemical waste and protect soil health.",
      techStack: ["ESP32", "Blynk IoT", "FlutterFlow", "C++", "IoT Sensors", "Solenoid Valves"],
      metrics: "Micro-Dosing Precision // 0% Blanket Waste // Live Telemetry",
      highlights: [
        "Custom ESP32 microcontroller firmware driving precision spray actuator solenoid valves",
        "Live field telemetry and remote control via Blynk IoT cloud platform",
        "FlutterFlow mobile dashboard providing real-time farmer oversight and manual override",
        "Targeted sensor-driven spray activation algorithm to preserve crops and groundwater"
      ],
      liveUrl: "mailto:deepak843161.438@gmail.com?subject=Inquiry:%20Smart%20Pesticide%20Nozzle%20Project",
      githubUrl: "https://github.com/deepak7-shadow"
    },
    {
      id: "signbridge",
      title: "SignBridge: Indian Sign Language",
      subtitle: "Computer Vision Gesture Tracking & Multilingual Voice Bridge",
      category: "AI & Computer Vision",
      planetName: "SignBridge Nexus",
      planetType: "Luminescent Cybernetic Sphere",
      planetColor: 0x06b6d4,
      accentColor: "#22d3ee",
      description: "An accessibility-focused application supporting communication around Indian Sign Language (ISL). Integrates camera-based hand tracking, curated sign vocabulary, text and voice interaction, translation support, and guided practice flows.",
      techStack: ["React", "TypeScript", "MediaPipe", "Tailwind CSS", "Web Speech APIs"],
      metrics: "21-Point Hand Landmarks // Web Speech Voice // Multi-Language Support",
      highlights: [
        "Real-time 21-point hand landmark tracking via Google MediaPipe running directly in-browser",
        "Bidirectional conversion: translates sign gestures to voice, and typed/spoken prompts to sign guides",
        "Multilingual phrase dictionary with translations across regional Indian languages",
        "Interactive guided practice flows, emergency quick-phrases, and conversation logs"
      ],
      liveUrl: "https://github.com/deepak7-shadow",
      githubUrl: "https://github.com/deepak7-shadow"
    },
    {
      id: "arenahub",
      title: "ArenaHub: Sports Venue Platform",
      subtitle: "Multi-Role Sports Discovery, Court Booking & Payment Engine",
      category: "Full-Stack Web Platform",
      planetName: "Arena Grid",
      planetType: "Molten Energy World",
      planetColor: 0xf59e0b,
      accentColor: "#fbbf24",
      description: "A complete multi-role sports venue discovery and court-booking platform connecting players, arena owners, and platform administrators. Manages live booking calendars, conflict prevention, verified payments, and automated receipts.",
      techStack: ["React", "TypeScript", "tRPC", "Express", "MongoDB", "Razorpay", "Tailwind CSS"],
      metrics: "Zero Overlap Double-Bookings // Multi-Role RBAC // Verified Razorpay Webhooks",
      highlights: [
        "High-concurrency time-slot reservation with automated collision and double-booking prevention",
        "Dedicated role-based dashboards for players, arena venue owners, and platform administrators",
        "Server-verified Razorpay payment state management with automated digital receipts",
        "Location-aware arena discovery with sport filters, amenity badges, and court status"
      ],
      liveUrl: "https://github.com/deepak7-shadow",
      githubUrl: "https://github.com/deepak7-shadow"
    },
    {
      id: "cosmic-portfolio",
      title: "Cosmic Voyage 3D Ledger",
      subtitle: "Procedural WebGL Deep Space Portfolio & Telemetry Interface",
      category: "3D Graphics & Spatial Computing",
      planetName: "Vesper Glaciem",
      planetType: "Crystalline Ice Exoplanet",
      planetColor: 0xa855f7,
      accentColor: "#c084fc",
      description: "An interactive 3D celestial portfolio environment engineered with Three.js, GSAP ScrollTrigger camera choreography, and pure Web Audio procedural synthesis.",
      techStack: ["Three.js", "WebGL", "GSAP", "Lenis", "Web Audio API", "Tailwind CSS v4"],
      metrics: "60+ FPS WebGL // Pure Procedural Audio // 0 External Assets",
      highlights: [
        "Cinematic multi-sector camera flight path synced to smooth user momentum scrolling",
        "Procedural GLSL simplex noise volumetric nebulae and 3,500+ twinkling stars",
        "Interactive 3D raycasting for planet inspection and holographic dossiers",
        "Sub-bass binaural synthesizer and UI telemetry audio built with Web Audio API"
      ],
      liveUrl: "http://127.0.0.1:5174/",
      githubUrl: "https://github.com/deepak7-shadow"
    }
  ],

  milestones: [
    {
      year: "2024 — PRESENT",
      role: "B.E. Computer Science & Engineering",
      organization: "Shri Venkateshwara College of Engineering",
      badge: "ACADEMIC EXCELLENCE",
      description: "Currently in 2nd Year (Semester III) maintaining a top-tier First-Year CGPA of 9.4 / 10. Focusing on algorithms, systems design, applied AI, and IoT hardware integration."
    },
    {
      year: "2024 — 2025",
      role: "Lead Hardware & IoT Engineer — Smart Spray Nozzle",
      organization: "Field Systems & Precision Ag",
      badge: "HARDWARE / IOT",
      description: "Architected precision pesticide nozzle prototype utilizing ESP32 microcontroller, Blynk IoT cloud infrastructure, and FlutterFlow mobile app for targeted, zero-waste agricultural spraying."
    },
    {
      year: "2024",
      role: "AI & Computer Vision Developer — SignBridge",
      organization: "Human Signal & Accessibility Prototype",
      badge: "AI / COMPUTER VISION",
      description: "Engineered real-time Indian Sign Language (ISL) communication bridge using MediaPipe 21-point hand tracking, Web Speech voice recognition, and multilingual phrase translations."
    },
    {
      year: "2023 — 2024",
      role: "Full-Stack Web Architect — ArenaHub",
      organization: "Sports Infrastructure & Booking Suite",
      badge: "FULL-STACK PLATFORM",
      description: "Engineered scalable court reservation and sports venue management engine with React, TypeScript, tRPC, MongoDB, and Razorpay payment verification."
    }
  ],

  education: {
    degree: "Bachelor of Engineering (B.E.)",
    major: "Computer Science & Engineering",
    institution: "Shri Venkateshwara College of Engineering",
    cgpa: "9.4 / 10",
    stage: "2nd Year, Semester III",
    values: [
      { title: "Systems Thinker", desc: "Interested in how small technical choices connect to larger field outcomes." },
      { title: "Impact Minded", desc: "Drawn to efficient, practical technology with measurable real-world value." },
      { title: "Continuous Learner", desc: "Comfortable exploring new tools, embedded hardware, and technical frontiers." }
    ]
  },

  transmission: {
    heading: "Have a problem worth noticing?",
    subheading: "Whether it's an opportunity to learn, collaborate, build, or discuss precision AI & IoT, I'd be glad to connect.",
    email: "deepak843161.438@gmail.com",
    phone: "+91 8431618438",
    github: "https://github.com/deepak7-shadow",
    linkedin: "https://github.com/deepak7-shadow",
    callsign: "DEEPAK-R // FIELD-01"
  }
};
