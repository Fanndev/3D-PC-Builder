/* ==========================================================================
   PC BUILDER 101 — THREE.JS 3D INTERACTIVE HARDWARE ENGINE
   PBR Materials, Procedural Circuit Textures, Exploded View, Assembly Animation,
   Raycasting Selection, 3D Hotspot Projection & Custom GLB Model Loader
   ========================================================================== */

class PCBuilder3DScene {
  constructor(containerSelector, hotspotContainerSelector, onPartSelected) {
    this.container = document.querySelector(containerSelector);
    this.hotspotContainer = document.querySelector(hotspotContainerSelector);
    this.onPartSelected = onPartSelected;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();

    this.pcRoot = new THREE.Group();
    this.partGroups = {};
    this.hotspotElements = {};
    this.fanMeshes = [];
    this.rgbMaterials = [];
    this.rgbLights = [];

    // Interactive States
    this.selectedPartId = 'mobo';
    this.isExploded = false;
    this.isGlassOpen = false;
    this.isPoweredOn = true;
    this.assemblyMode = false;
    this.installedParts = new Set(['case', 'mobo', 'cpu', 'cooler', 'ram', 'ssd', 'gpu', 'psu']);

    // RGB Themes
    this.rgbThemes = [
      { name: 'Cyber Cyan', hex: 0x00f0ff, css: '#00f0ff' },
      { name: 'ROG Crimson', hex: 0xff1e56, css: '#ff1e56' },
      { name: 'Matrix Emerald', hex: 0x10b981, css: '#10b981' },
      { name: 'Hyper Purple', hex: 0xa855f7, css: '#a855f7' },
      { name: 'Rainbow Wave', hex: 'rainbow', css: 'linear-gradient(90deg,#00f0ff,#a855f7,#f43f5e)' }
    ];
    this.currentRgbIndex = 0;

    // Smooth Camera Target Interpolation
    this.camTargetPos = new THREE.Vector3(7.2, 3.6, 8.6);
    this.camTargetLook = new THREE.Vector3(0, 0.3, 0);
    this.isCameraAnimating = false;

    this.init();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060913, 0.032);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.copy(this.camTargetPos);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.22;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxDistance = 18;
    this.controls.minDistance = 2.4;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.target.copy(this.camTargetLook);

    this.controls.addEventListener('start', () => {
      this.isCameraAnimating = false;
    });

    // 5. Studio Lighting & Cyber Studio Floor
    this.setupLighting();
    this.setupEnvironmentFloor();

    // 6. Build Detailed 3D PC Rig & Components
    this.scene.add(this.pcRoot);
    this.buildAllHardwareComponents();
    this.createHotspotDOMPins();

    // 7. Events
    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    this.renderer.domElement.addEventListener('pointerup', (e) => this.onPointerUp(e));

    // 8. Start Render Loop
    this.animate();
  }

  setupLighting() {
    const ambient = new THREE.AmbientLight(0xdbeafe, 0.75);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    this.scene.add(keyLight);

    const rimLightCyan = new THREE.DirectionalLight(0x00f0ff, 0.85);
    rimLightCyan.position.set(-9, 6, -7);
    this.scene.add(rimLightCyan);

    const fillLightPurple = new THREE.DirectionalLight(0x8b5cf6, 0.55);
    fillLightPurple.position.set(0, -6, 6);
    this.scene.add(fillLightPurple);

    // Internal Case RGB Point Lights
    const internalLight1 = new THREE.PointLight(0x00f0ff, 1.6, 7);
    internalLight1.position.set(0, 1.1, 0.5);
    this.pcRoot.add(internalLight1);
    this.rgbLights.push(internalLight1);

    const internalLight2 = new THREE.PointLight(0x00f0ff, 1.1, 6);
    internalLight2.position.set(0.4, -0.7, 0.8);
    this.pcRoot.add(internalLight2);
    this.rgbLights.push(internalLight2);
  }

  setupEnvironmentFloor() {
    // Cyber Pedestal & Grid
    const grid = new THREE.GridHelper(28, 28, 0x00f0ff, 0x1e293b);
    grid.position.y = -3.05;
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    this.scene.add(grid);

    // Glowing ring under the PC
    const ringGeo = new THREE.RingGeometry(2.7, 2.82, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = this.createRgbMaterial(0x00f0ff, 1.2);
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.y = -3.02;
    this.scene.add(ringMesh);
  }

  createRgbMaterial(colorHex = 0x00f0ff, intensity = 1.0) {
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: intensity,
      roughness: 0.2,
      metalness: 0.1
    });
    this.rgbMaterials.push(mat);
    return mat;
  }

  createCircuitTexture() {
    return this.createMsiMpgPcbTexture();
  }

  createMsiMpgPcbTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Base Dark Carbon Matte PCB
    ctx.fillStyle = '#070a12';
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Carbon Fiber Weave Texture (Subtle Diagonal Hatch)
    const tileSize = 8;
    for (let x = 0; x < 1024; x += tileSize) {
      for (let y = 0; y < 1024; y += tileSize) {
        const isAlternate = ((x / tileSize) + (y / tileSize)) % 2 === 0;
        ctx.fillStyle = isAlternate ? 'rgba(255, 255, 255, 0.024)' : 'rgba(0, 0, 0, 0.28)';
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }

    // 3. Dense High-Speed Bus Traces (Gold & Cyan)
    // CPU to DDR5 Memory Bus (Serpentine & Straight Traces)
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 30; i++) {
      const yStart = 230 + i * 8;
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(245, 158, 11, 0.38)' : 'rgba(0, 240, 255, 0.32)';
      ctx.beginPath();
      ctx.moveTo(410, yStart);
      ctx.lineTo(530, yStart);
      ctx.lineTo(560, yStart - 25);
      ctx.lineTo(670, yStart - 25);
      ctx.stroke();

      // Solder pad dots
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(670, yStart - 25, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // CPU to PCIe 5.0 High-Speed Differential Pairs
    for (let i = 0; i < 26; i++) {
      const xStart = 270 + i * 11;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.32)';
      ctx.beginPath();
      ctx.moveTo(xStart, 410);
      ctx.lineTo(xStart, 490);
      ctx.lineTo(xStart + 35, 535);
      ctx.lineTo(xStart + 35, 620);
      ctx.stroke();

      ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
      ctx.beginPath();
      ctx.arc(xStart + 35, 620, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // PCH Chipset & M.2 Bus Traces (Bottom Half)
    for (let i = 0; i < 36; i++) {
      const yStart = 670 + (i * 9) % 290;
      const xStart = 460 + (i * 15) % 380;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xStart + 45, yStart);
      ctx.lineTo(xStart + 70, yStart + 25);
      ctx.lineTo(xStart + 115, yStart + 25);
      ctx.stroke();
    }

    // 4. Audio Boost 5 Isolated PCB Strip (Bottom-Left)
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(20, 650);
    ctx.bezierCurveTo(160, 660, 185, 790, 185, 1000);
    ctx.stroke();
    ctx.restore();

    // Isolated Audio Ground Plane
    ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.beginPath();
    ctx.moveTo(0, 650);
    ctx.bezierCurveTo(160, 660, 185, 790, 185, 1024);
    ctx.lineTo(0, 1024);
    ctx.closePath();
    ctx.fill();

    // Audio Boost 5 Silkscreen
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('AUDIO BOOST 5', 40, 715);
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
    ctx.fillText('ISOLATED PCB LAYER', 40, 735);

    // 5. ATX 9 Standoff Mounting Holes with Brass Grounding Rings
    const standoffHoles = [
      { x: 55, y: 55 }, { x: 512, y: 55 }, { x: 965, y: 55 },
      { x: 55, y: 512 }, { x: 512, y: 512 }, { x: 965, y: 512 },
      { x: 55, y: 965 }, { x: 512, y: 965 }, { x: 965, y: 965 }
    ];
    standoffHoles.forEach(h => {
      // Brass outer ring
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(h.x, h.y, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Center hole
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(h.x, h.y, 14, 0, Math.PI * 2);
      ctx.fill();

      // Surrounding grounding solder dots
      ctx.fillStyle = '#cbd5e1';
      for (let a = 0; a < 6; a++) {
        const rad = (a / 6) * Math.PI * 2;
        const dx = h.x + Math.cos(rad) * 30;
        const dy = h.y + Math.sin(rad) * 30;
        ctx.beginPath();
        ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 6. Silkscreen Labels & MSI Typography
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('MSI MPG Z790 CARBON WIFI', 320, 105);

    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
    ctx.fillText('LIGHTNING GEN 5 (PCIe 5.0 x16 • 128 GB/s)', 240, 645);
    ctx.fillText('DDR5 MEMORY BOOST (7600+ MHz OC)', 670, 235);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.font = '10px monospace';
    ctx.fillText('SOCKET LGA1700 (12th / 13th / 14th GEN INTEL CORE)', 220, 155);
    ctx.fillText('M.2_1 (CPU) PCIe 5.0 x4 SHIELD FROZR', 240, 480);
    ctx.fillText('M.2_2/3/4 (PCH Z790) LIGHTNING GEN 4', 240, 755);
    ctx.fillText('EZ DEBUG: [CPU] [DRAM] [VGA] [BOOT]', 770, 400);
    ctx.fillText('JFP1 (FRONT PANEL HEADER)', 770, 995);
    ctx.fillText('JAUD1 (FRONT AUDIO)', 40, 995);
    ctx.fillText('SATA 6Gb/s [1-6]', 890, 715);

    // Decorative SMT Resistors & Capacitors clusters
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1;
    for (let c = 0; c < 28; c++) {
      const px = 200 + (c * 31) % 700;
      const py = 180 + (c * 47) % 780;
      ctx.fillRect(px, py, 14, 8);
      ctx.strokeRect(px - 1, py - 1, 16, 10);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    return tex;
  }

  createCoolerScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(128, 128, 108, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 68px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('34°C', 128, 140);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('CPU OPTIMAL', 128, 182);

    return new THREE.CanvasTexture(canvas);
  }

  createSpinningFan(radius = 0.42, thickness = 0.08) {
    const fanGroup = new THREE.Group();

    // Outer frame ring
    const frameGeo = new THREE.TorusGeometry(radius, thickness * 0.45, 12, 32);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.7 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    fanGroup.add(frame);

    // Glowing RGB ring
    const rgbGeo = new THREE.TorusGeometry(radius * 0.94, thickness * 0.16, 10, 32);
    const rgbRing = new THREE.Mesh(rgbGeo, this.createRgbMaterial(0x00f0ff, 1.3));
    rgbRing.position.z = thickness * 0.25;
    fanGroup.add(rgbRing);

    // Rotor Hub & Blades
    const rotor = new THREE.Group();
    const hubGeo = new THREE.CylinderGeometry(radius * 0.28, radius * 0.28, thickness * 0.8, 20);
    hubGeo.rotateX(Math.PI / 2);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    rotor.add(new THREE.Mesh(hubGeo, hubMat));

    const bladeGeo = new THREE.BoxGeometry(radius * 0.65, radius * 0.18, 0.018);
    const bladeMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.75,
      roughness: 0.15,
      metalness: 0.1
    });

    const bladeCount = 7;
    for (let i = 0; i < bladeCount; i++) {
      const pivot = new THREE.Group();
      const angle = (i / bladeCount) * Math.PI * 2;
      pivot.rotation.z = angle;

      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.x = radius * 0.55;
      blade.rotation.x = 0.48;
      pivot.add(blade);
      rotor.add(pivot);
    }

    fanGroup.add(rotor);
    this.fanMeshes.push(rotor);
    return fanGroup;
  }

  /* --------------------------------------------------------------------------
     BUILD ALL 8 HARDWARE PARTS IN 3D
     -------------------------------------------------------------------------- */
  buildAllHardwareComponents() {
    const pcbTex = this.createCircuitTexture();
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.82, roughness: 0.28 });
    const silverMetal = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 });
    const gunmetal = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.75, roughness: 0.32 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 });

    // =========================================================================
    // 8. CASING ATX & AIRFLOW FANS ('case')
    // =========================================================================
    const caseGroup = new THREE.Group();
    // Back tray, Top, Bottom, PSU Shroud
    const backTray = new THREE.Mesh(new THREE.BoxGeometry(3.8, 5.6, 0.12), darkMetal);
    backTray.position.set(0, 0, -1.05);
    caseGroup.add(backTray);

    const bottomPlate = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.16, 2.2), darkMetal);
    bottomPlate.position.set(0, -2.8, 0);
    caseGroup.add(bottomPlate);

    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.14, 2.2), darkMetal);
    topPlate.position.set(0, 2.8, 0);
    caseGroup.add(topPlate);

    const rearPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 5.6, 2.2), gunmetal);
    rearPanel.position.set(-1.88, 0, 0);
    caseGroup.add(rearPanel);

    // PSU Shroud (Bottom Chamber Cover)
    const psuShroud = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 2.05), gunmetal);
    psuShroud.position.set(-0.55, -1.55, -0.02);
    caseGroup.add(psuShroud);

    // RGB strip along PSU Shroud
    const shroudRgb = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.04, 0.04), this.createRgbMaterial(0x00f0ff, 1.5));
    shroudRgb.position.set(-0.55, -1.55, 1.02);
    caseGroup.add(shroudRgb);

    // 3x Front Intake RGB Fans & 1x Rear Exhaust Fan
    [-1.4, -0.3, 0.8].forEach((yPos) => {
      const intakeFan = this.createSpinningFan(0.46, 0.1);
      intakeFan.rotation.y = Math.PI / 2;
      intakeFan.position.set(1.78, yPos + 0.6, 0);
      caseGroup.add(intakeFan);
    });
    const rearFan = this.createSpinningFan(0.44, 0.1);
    rearFan.rotation.y = Math.PI / 2;
    rearFan.position.set(-1.76, 1.55, -0.1);
    caseGroup.add(rearFan);

    // Hinged Tempered Glass Side Panel
    this.glassPivot = new THREE.Group();
    this.glassPivot.position.set(-1.88, 0, 1.08);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      roughness: 0.05,
      metalness: 0.1,
      reflectivity: 0.9
    });
    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(3.72, 5.45, 0.04), glassMat);
    glassPane.position.set(1.86, 0, 0);
    const glassBorder = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.72, 5.45, 0.04)),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 })
    );
    glassBorder.position.copy(glassPane.position);
    this.glassPivot.add(glassPane, glassBorder);
    caseGroup.add(this.glassPivot);

    this.registerPart('case', caseGroup, {
      assembledPos: new THREE.Vector3(0, 0, 0),
      explodedPos: new THREE.Vector3(0, 0, -1.2),
      stagingPos: new THREE.Vector3(0, 0, 0),
      hotspotOffset: new THREE.Vector3(1.8, 2.35, 0.9),
      camPos: new THREE.Vector3(6.8, 3.2, 8.2),
      camLook: new THREE.Vector3(0, 0.2, 0)
    });

    // =========================================================================
    // 1. MOTHERBOARD ATX — MSI MPG Z790 CARBON WIFI ('mobo')
    // =========================================================================
    const moboGroup = new THREE.Group();
    const pcbMat = new THREE.MeshStandardMaterial({
      map: pcbTex,
      roughness: 0.32,
      metalness: 0.40
    });
    const titaniumDark = new THREE.MeshStandardMaterial({ color: 0x18202f, metalness: 0.85, roughness: 0.24 });
    const chromeSteel = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.96, roughness: 0.12 });
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.30 });
    const copperHeatpipe = new THREE.MeshStandardMaterial({ color: 0xc2782b, metalness: 0.92, roughness: 0.18 });
    const audioGoldCap = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.92, roughness: 0.20 });
    const usbBlue = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.6 });
    const usbRed = new THREE.MeshStandardMaterial({ color: 0xd92d20, roughness: 0.35, metalness: 0.6 });

    // 1.1 PCB Main Board (ATX Form Factor: 30.5 x 24.4 cm)
    const pcbBoard = new THREE.Mesh(new THREE.BoxGeometry(2.55, 3.2, 0.09), pcbMat);
    moboGroup.add(pcbBoard);

    // 1.2 MSI Extended Rear I/O Shroud & Shield Armor
    const ioArmor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.48, 0.36), titaniumDark);
    ioArmor.position.set(-1.04, 0.84, 0.22);
    const ioBevel = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.20, 0.35), gunmetal);
    ioBevel.rotation.z = -0.32;
    ioBevel.position.set(-1.08, 1.50, 0.22);
    const ioCarbonInlay = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.25, 0.015), carbonMat);
    ioCarbonInlay.position.set(-1.04, 0.84, 0.405);

    // Illuminated ARGB MSI Dragon Crest / "MPG" Emblem (Reactive to Active RGB Theme)
    const ioRgbEmblem = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.02), this.createRgbMaterial(0x00f0ff, 1.6));
    ioRgbEmblem.position.set(-1.04, 0.95, 0.415);
    const ioRgbSlash = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.65, 0.02), this.createRgbMaterial(0x00f0ff, 1.4));
    ioRgbSlash.rotation.z = 0.35;
    ioRgbSlash.position.set(-0.92, 0.52, 0.41);
    moboGroup.add(ioArmor, ioBevel, ioCarbonInlay, ioRgbEmblem, ioRgbSlash);

    // 1.3 Rear I/O Shield Ports Array (Facing Back -X)
    // Wi-Fi 6E/7 Dual Gold Antenna SMA Connectors
    [-1.28].forEach(xP => {
      [1.40, 1.26].forEach(yP => {
        const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.12, 16), goldMat);
        sma.rotation.z = Math.PI / 2;
        sma.position.set(xP, yP, 0.24);
        const smaPin = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8), goldMat);
        smaPin.rotation.z = Math.PI / 2;
        smaPin.position.set(xP, yP, 0.24);
        moboGroup.add(sma, smaPin);
      });
    });

    // Intel 2.5G LAN RJ45 Port (Metal Casing)
    const lanPort = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.20, 0.18), silverMetal);
    lanPort.position.set(-1.26, 0.56, 0.22);
    moboGroup.add(lanPort);

    // USB Ports (Red USB 3.2 Gen 2 & Blue USB 3.2 Gen 1)
    const usbRedPort = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.12), usbRed);
    usbRedPort.position.set(-1.26, 0.78, 0.22);
    const usbBluePort1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.12), usbBlue);
    usbBluePort1.position.set(-1.26, 0.98, 0.22);
    const usbBluePort2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.12), usbBlue);
    usbBluePort2.position.set(-1.26, 1.15, 0.22);
    // USB Type-C 20Gbps Port
    const typeCPort = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.08, 16), chromeSteel);
    typeCPort.rotation.z = Math.PI / 2;
    typeCPort.position.set(-1.26, 0.42, 0.16);
    moboGroup.add(usbRedPort, usbBluePort1, usbBluePort2, typeCPort);

    // 5x Gold-plated 3.5mm Audio Jacks & Optical S/PDIF Port
    for (let k = 0; k < 5; k++) {
      const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.08, 14), goldMat);
      jack.rotation.z = Math.PI / 2;
      jack.position.set(-1.26, 0.14 + k * 0.055, 0.22);
      moboGroup.add(jack);
    }
    const spdif = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), darkMetal);
    spdif.position.set(-1.26, 0.08, 0.22);
    moboGroup.add(spdif);

    // Clear CMOS & Flash BIOS Buttons
    const biosBtn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 10), darkMetal);
    biosBtn1.rotation.z = Math.PI / 2;
    biosBtn1.position.set(-1.26, 1.49, 0.24);
    moboGroup.add(biosBtn1);

    // 1.4 VRM Extended Heatsinks & Interconnecting Heatpipe
    const vrmLeft = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.18, 0.30), titaniumDark);
    vrmLeft.position.set(-0.70, 0.85, 0.19);
    // Cooling Fin Slices on Left Heatsink
    for (let f = 0; f < 5; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.022, 0.31), gunmetal);
      fin.position.set(-0.70, 0.42 + f * 0.21, 0.19);
      moboGroup.add(fin);
    }

    const vrmTop = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.32, 0.28), titaniumDark);
    vrmTop.position.set(-0.20, 1.38, 0.18);
    const vrmTopCarbon = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.08, 0.015), carbonMat);
    vrmTopCarbon.position.set(-0.20, 1.38, 0.325);

    // Interconnecting Nickel-Plated Copper Heatpipe
    const pipeVert = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.60, 16), copperHeatpipe);
    pipeVert.position.set(-0.62, 1.12, 0.33);
    const pipeHoriz = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.76, 16), copperHeatpipe);
    pipeHoriz.rotation.z = Math.PI / 2;
    pipeHoriz.position.set(-0.24, 1.38, 0.33);
    moboGroup.add(vrmLeft, vrmTop, vrmTopCarbon, pipeVert, pipeHoriz);

    // 1.5 VRM Power Delivery Phases (19+1+1 Duet Rail Phases: Chokes & Solid Caps)
    // Left chokes & caps
    for (let c = 0; c < 8; c++) {
      const chokeY = 0.44 + c * 0.10;
      const choke = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.065), darkMetal);
      choke.position.set(-0.48, chokeY, 0.08);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.07, 12), silverMetal);
      cap.rotation.x = Math.PI / 2;
      cap.position.set(-0.48, chokeY, 0.14);
      moboGroup.add(choke, cap);
    }
    // Top chokes & caps
    for (let c = 0; c < 8; c++) {
      const chokeX = -0.52 + c * 0.10;
      const choke = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.065, 0.065), darkMetal);
      choke.position.set(chokeX, 1.18, 0.08);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.07, 12), silverMetal);
      cap.rotation.x = Math.PI / 2;
      cap.position.set(chokeX, 1.18, 0.14);
      moboGroup.add(choke, cap);
    }

    // 1.6 CPU Socket LGA1700 (Intel 12/13/14th Gen)
    const socketBase = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.76, 0.04), silverMetal);
    socketBase.position.set(-0.22, 0.78, 0.065);
    const socketFrame = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.70, 0.045), chromeSteel);
    socketFrame.position.set(-0.22, 0.78, 0.075);
    const socketCover = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.50, 0.05), darkMetal);
    socketCover.position.set(-0.22, 0.78, 0.08);
    const socketTri = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.015, 3), goldMat);
    socketTri.rotation.x = Math.PI / 2;
    socketTri.position.set(-0.42, 0.58, 0.108);
    // Metal Socket Load Lever
    const leverArm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.76, 12), chromeSteel);
    leverArm.position.set(0.16, 0.78, 0.09);
    const leverHandle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.04), chromeSteel);
    leverHandle.position.set(0.18, 0.40, 0.09);
    moboGroup.add(socketBase, socketFrame, socketCover, socketTri, leverArm, leverHandle);

    // 1.7 4x DDR5 Memory Boost DIMM Slots
    for (let i = 0; i < 4; i++) {
      const slotX = 0.45 + i * 0.13;
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.065, 1.34, 0.08), darkMetal);
      slot.position.set(slotX, 0.78, 0.08);
      const armorStrip = new THREE.Mesh(new THREE.BoxGeometry(0.068, 1.28, 0.03), silverMetal);
      armorStrip.position.set(slotX, 0.78, 0.095);
      // Dual-latch ejector clips at top and bottom
      const clipTop = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.10), silverMetal);
      clipTop.position.set(slotX, 1.45, 0.09);
      const clipBtm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.10), silverMetal);
      clipBtm.position.set(slotX, 0.11, 0.09);
      moboGroup.add(slot, armorStrip, clipTop, clipBtm);
    }

    // 1.8 PCIe Expansion Slots (PCIe 5.0 Steel Armor)
    // PCIe 1 (PCIe 5.0 x16 - Primary GPU Slot)
    const pcie1Armor = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.11, 0.11), chromeSteel);
    pcie1Armor.position.set(-0.3, -0.35, 0.08);
    const pcie1Slot = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 0.12), darkMetal);
    pcie1Slot.position.set(-0.32, -0.35, 0.085);
    const pcie1Clip = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.12), gunmetal);
    pcie1Clip.position.set(0.48, -0.35, 0.08);
    // PCIe 2 (PCIe 4.0 x16 - Secondary)
    const pcie2Armor = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.10, 0.09), silverMetal);
    pcie2Armor.position.set(-0.3, -1.05, 0.08);
    // PCIe 3 (PCIe 3.0 x1)
    const pcie3 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.08), darkMetal);
    pcie3.position.set(-0.45, -0.70, 0.07);
    moboGroup.add(pcie1Armor, pcie1Slot, pcie1Clip, pcie2Armor, pcie3);

    // 1.9 M.2 Shield Frozr Heatsinks (Gen 5 Top Plate & Multi-Slot Lower Armor)
    const m2TopPlate = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.26, 0.075), titaniumDark);
    m2TopPlate.position.set(-0.15, 0.16, 0.085);
    const m2TopCarbon = new THREE.Mesh(new THREE.BoxGeometry(0.80, 0.05, 0.08), carbonMat);
    m2TopCarbon.position.set(-0.15, 0.16, 0.09);
    [-0.55, 0.25].forEach(sX => {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12), silverMetal);
      screw.rotation.x = Math.PI / 2;
      screw.position.set(sX, 0.16, 0.125);
      moboGroup.add(screw);
    });

    const m2LowerPlate = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.38, 0.07), gunmetal);
    m2LowerPlate.position.set(-0.15, -0.70, 0.08);
    const m2LowerGroove = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.03, 0.075), titaniumDark);
    m2LowerGroove.position.set(-0.15, -0.70, 0.085);
    moboGroup.add(m2TopPlate, m2TopCarbon, m2LowerPlate, m2LowerGroove);

    // 1.10 Dedicated Audio Boost 5 Section (Bottom-Left Isolated Island)
    const audioShield = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.06), silverMetal);
    audioShield.position.set(-0.95, -1.15, 0.07);
    // 4x High-Grade Gold Audio Capacitors
    for (let a = 0; a < 4; a++) {
      const goldCap = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.09, 14), audioGoldCap);
      goldCap.rotation.x = Math.PI / 2;
      goldCap.position.set(-0.80, -1.02 - a * 0.09, 0.09);
      moboGroup.add(goldCap);
    }
    moboGroup.add(audioShield);

    // 1.11 Z790 Chipset Heatsink with ARGB "MPG" Badge
    const chipset = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.68, 0.18), titaniumDark);
    chipset.position.set(0.66, -0.92, 0.12);
    const chipsetCarbon = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.015), carbonMat);
    chipsetCarbon.position.set(0.66, -0.92, 0.215);
    const chipsetGlow = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.10, 0.20), this.createRgbMaterial(0x00f0ff, 1.5));
    chipsetGlow.position.set(0.66, -0.92, 0.125);
    moboGroup.add(chipset, chipsetCarbon, chipsetGlow);

    // 1.12 CMOS Battery CR2032 in Socket Holder
    const cmosSocket = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24), darkMetal);
    cmosSocket.rotation.x = Math.PI / 2;
    cmosSocket.position.set(-0.85, -0.65, 0.065);
    const cmosCell = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24), silverMetal);
    cmosCell.rotation.x = Math.PI / 2;
    cmosCell.position.set(-0.85, -0.65, 0.075);
    moboGroup.add(cmosSocket, cmosCell);

    // 1.13 Motherboard Edge Connectors & Headers
    // 6x SATA 6Gbps Ports (3 Dual-Stacked Right-Angle Ports at Right Edge)
    for (let s = 0; s < 3; s++) {
      const sata = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.11), darkMetal);
      sata.position.set(1.20, -0.62 - s * 0.16, 0.09);
      moboGroup.add(sata);
    }
    // 24-Pin ATX Main Power Header with Gold Pin Dots
    const atxHeader = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.62, 0.18), darkMetal);
    atxHeader.position.set(1.15, 0.58, 0.11);
    moboGroup.add(atxHeader);
    // Dual 8-Pin CPU Power Headers at Top Edge
    [-0.82, -0.64].forEach(xP => {
      const cpu8Pin = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.16), darkMetal);
      cpu8Pin.position.set(xP, 1.52, 0.11);
      moboGroup.add(cpu8Pin);
    });
    // Front Panel USB 3.2 Header
    const usbFront = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.14), darkMetal);
    usbFront.position.set(1.15, 0.05, 0.10);
    // EZ Debug LEDs (4 Micro-LED squares: CPU, DRAM, VGA, BOOT)
    const ezLeds = [0xff1e56, 0xf59e0b, 0x00f0ff, 0x10b981];
    ezLeds.forEach((col, idx) => {
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.02), this.createRgbMaterial(col, 1.2));
      led.position.set(1.15, 0.95 + idx * 0.035, 0.06);
      moboGroup.add(led);
    });
    moboGroup.add(usbFront);

    this.registerPart('mobo', moboGroup, {
      assembledPos: new THREE.Vector3(-0.38, 0.42, -0.82),
      explodedPos: new THREE.Vector3(-0.38, 0.42, -0.35),
      stagingPos: new THREE.Vector3(-0.38, 4.2, 2.5),
      hotspotOffset: new THREE.Vector3(0.65, -0.9, 0.25),
      camPos: new THREE.Vector3(0.2, 0.6, 4.2),
      camLook: new THREE.Vector3(-0.38, 0.42, -0.6)
    });

    // =========================================================================
    // 2. PROCESSOR / CPU ('cpu')
    // =========================================================================
    const cpuGroup = new THREE.Group();
    const cpuPcb = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.62, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.35, metalness: 0.5 })
    );
    const cpuIhs = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.06), silverMetal);
    cpuIhs.position.z = 0.04;
    const goldTriangle = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.02, 3), goldMat);
    goldTriangle.rotation.x = Math.PI / 2;
    goldTriangle.position.set(-0.23, -0.23, 0.04);
    cpuGroup.add(cpuPcb, cpuIhs, goldTriangle);

    this.registerPart('cpu', cpuGroup, {
      assembledPos: new THREE.Vector3(-0.6, 1.2, -0.71),
      explodedPos: new THREE.Vector3(-0.6, 1.2, 0.55),
      stagingPos: new THREE.Vector3(-3.2, 2.4, 2.8),
      hotspotOffset: new THREE.Vector3(0, 0.35, 0.2),
      camPos: new THREE.Vector3(-0.5, 1.4, 2.2),
      camLook: new THREE.Vector3(-0.6, 1.2, -0.4)
    });

    // =========================================================================
    // 3. CPU COOLER ARGB ('cooler')
    // =========================================================================
    const coolerGroup = new THREE.Group();
    const heatsinkStack = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.86, 0.52), gunmetal);
    coolerGroup.add(heatsinkStack);

    // Copper heatpipes
    [-0.24, -0.08, 0.08, 0.24].forEach(xOff => {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, 0.96, 12),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 })
      );
      pipe.position.set(xOff, 0, 0);
      coolerGroup.add(pipe);
    });

    // Spinning ARGB Fan + Digital Temp Cap on front of Cooler
    const coolerFan = this.createSpinningFan(0.39, 0.12);
    coolerFan.position.z = 0.3;
    coolerGroup.add(coolerFan);

    const screenCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.04, 32),
      new THREE.MeshBasicMaterial({ map: this.createCoolerScreenTexture() })
    );
    screenCap.rotation.x = Math.PI / 2;
    screenCap.position.z = 0.38;
    coolerGroup.add(screenCap);

    this.registerPart('cooler', coolerGroup, {
      assembledPos: new THREE.Vector3(-0.6, 1.2, -0.35),
      explodedPos: new THREE.Vector3(-0.6, 1.2, 1.85),
      stagingPos: new THREE.Vector3(-2.8, 3.2, 3.0),
      hotspotOffset: new THREE.Vector3(-0.4, 0.55, 0.4),
      camPos: new THREE.Vector3(0.4, 1.5, 2.8),
      camLook: new THREE.Vector3(-0.6, 1.2, -0.2)
    });

    // =========================================================================
    // 4. RAM DDR5 DUAL-CHANNEL ('ram')
    // =========================================================================
    const ramGroup = new THREE.Group();
    // Place 2 sticks in Slot A2 and B2
    [0.13, 0.39].forEach(xSlot => {
      const stick = new THREE.Group();
      stick.position.x = xSlot;

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.28, 0.34), gunmetal);
      const lightbar = new THREE.Mesh(new THREE.BoxGeometry(0.065, 1.28, 0.07), this.createRgbMaterial(0x00f0ff, 1.5));
      lightbar.position.z = 0.19;
      const goldContacts = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.2, 0.05), goldMat);
      goldContacts.position.z = -0.18;

      stick.add(body, lightbar, goldContacts);
      ramGroup.add(stick);
    });

    this.registerPart('ram', ramGroup, {
      assembledPos: new THREE.Vector3(0.07, 1.2, -0.58),
      explodedPos: new THREE.Vector3(0.95, 1.35, 1.15),
      stagingPos: new THREE.Vector3(2.8, 2.5, 2.6),
      hotspotOffset: new THREE.Vector3(0.42, 0.45, 0.3),
      camPos: new THREE.Vector3(1.5, 1.5, 2.6),
      camLook: new THREE.Vector3(0.25, 1.2, -0.4)
    });

    // =========================================================================
    // 5. SSD NVMe M.2 ('ssd')
    // =========================================================================
    const ssdGroup = new THREE.Group();
    const ssdPcb = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.24, 0.04), darkMetal);
    const ssdHeatsink = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.22, 0.06), gunmetal);
    ssdHeatsink.position.z = 0.04;
    const ssdAccent = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.04, 0.07), this.createRgbMaterial(0x00f0ff, 1.3));
    ssdAccent.position.z = 0.045;
    const ssdGold = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.03), goldMat);
    ssdGold.position.x = -0.38;
    ssdGroup.add(ssdPcb, ssdHeatsink, ssdAccent, ssdGold);

    this.registerPart('ssd', ssdGroup, {
      assembledPos: new THREE.Vector3(-0.52, 0.36, -0.72),
      explodedPos: new THREE.Vector3(-0.52, 0.36, 0.9),
      stagingPos: new THREE.Vector3(2.6, 0.6, 2.8),
      hotspotOffset: new THREE.Vector3(0.35, 0.16, 0.2),
      camPos: new THREE.Vector3(0.4, 0.5, 2.4),
      camLook: new THREE.Vector3(-0.52, 0.36, -0.5)
    });

    // =========================================================================
    // 6. GPU GEFORCE RTX ('gpu')
    // =========================================================================
    const gpuGroup = new THREE.Group();
    // Main Shroud (Horizontal installation into PCIe x16)
    const gpuBody = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.38, 1.05), gunmetal);
    gpuGroup.add(gpuBody);

    // Metallic Backplate on top
    const backplate = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.03, 1.04), silverMetal);
    backplate.position.y = 0.205;
    gpuGroup.add(backplate);

    // Side GEFORCE RTX Glowing Accent Bar
    const gpuRgbBar = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.07, 0.05), this.createRgbMaterial(0x00f0ff, 1.6));
    gpuRgbBar.position.set(0.05, 0.06, 0.53);
    gpuGroup.add(gpuRgbBar);

    // Dual Spinning Bottom/Front Fans on GPU
    [-0.52, 0.52].forEach(xPos => {
      const gFan = this.createSpinningFan(0.38, 0.06);
      gFan.rotation.x = Math.PI / 2;
      gFan.position.set(xPos, -0.2, 0);
      gpuGroup.add(gFan);
    });

    this.registerPart('gpu', gpuGroup, {
      assembledPos: new THREE.Vector3(-0.55, -0.1, -0.22),
      explodedPos: new THREE.Vector3(-0.55, -0.35, 1.95),
      stagingPos: new THREE.Vector3(0, -0.5, 3.8),
      hotspotOffset: new THREE.Vector3(0.75, 0.2, 0.58),
      camPos: new THREE.Vector3(1.8, -0.1, 3.5),
      camLook: new THREE.Vector3(-0.55, -0.1, 0)
    });

    // =========================================================================
    // 7. POWER SUPPLY UNIT 750W ('psu')
    // =========================================================================
    const psuGroup = new THREE.Group();
    const psuBox = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.95, 1.55), darkMetal);
    psuGroup.add(psuBox);

    const psuBadge = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.42, 0.04), gunmetal);
    psuBadge.position.set(0, 0, 0.78);
    const psuAccent = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.06, 0.05), this.createRgbMaterial(0x00f0ff, 1.3));
    psuAccent.position.set(0, -0.18, 0.785);
    psuGroup.add(psuBadge, psuAccent);

    this.registerPart('psu', psuGroup, {
      assembledPos: new THREE.Vector3(-0.92, -2.18, -0.1),
      explodedPos: new THREE.Vector3(-1.6, -2.55, 1.35),
      stagingPos: new THREE.Vector3(-2.8, -2.2, 3.2),
      hotspotOffset: new THREE.Vector3(0.4, 0.1, 0.85),
      camPos: new THREE.Vector3(1.8, -1.6, 3.8),
      camLook: new THREE.Vector3(-0.92, -2.18, 0)
    });
  }

  registerPart(partId, group, meta) {
    group.userData = {
      partId,
      assembledPos: meta.assembledPos.clone(),
      explodedPos: meta.explodedPos.clone(),
      stagingPos: meta.stagingPos.clone(),
      targetPos: meta.assembledPos.clone(),
      hotspotOffset: meta.hotspotOffset.clone(),
      camPos: meta.camPos.clone(),
      camLook: meta.camLook.clone()
    };

    group.position.copy(meta.assembledPos);
    group.traverse(obj => {
      if (obj.isMesh) {
        obj.userData.partId = partId;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    this.partGroups[partId] = group;
    this.pcRoot.add(group);
  }

  /* --------------------------------------------------------------------------
     FLOATING HTML HOTSPOT PINS SYNCHRONIZED WITH 3D COORDINATES
     -------------------------------------------------------------------------- */
  createHotspotDOMPins() {
    if (!this.hotspotContainer) return;
    this.hotspotContainer.innerHTML = '';

    window.PC_DATA.components.forEach(comp => {
      const pin = document.createElement('div');
      pin.className = `hotspot-pin ${comp.id === this.selectedPartId ? 'active' : ''}`;
      pin.dataset.partId = comp.id;
      pin.innerHTML = `
        <span class="pin-dot">${comp.num}</span>
        <span>${comp.shortName}</span>
      `;
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        window.audioEngine.playClick();
        this.focusOnPart(comp.id, true);
      });

      this.hotspotContainer.appendChild(pin);
      this.hotspotElements[comp.id] = pin;
    });
  }

  updateHotspotPositions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const projVec = new THREE.Vector3();

    Object.keys(this.partGroups).forEach(partId => {
      const group = this.partGroups[partId];
      const pin = this.hotspotElements[partId];
      if (!group || !pin) return;

      if (!group.visible) {
        pin.classList.add('hidden-pin');
        return;
      }

      projVec.copy(group.position).add(group.userData.hotspotOffset);
      group.parent.localToWorld(projVec);
      projVec.project(this.camera);

      // Hide if behind camera
      if (projVec.z > 1) {
        pin.classList.add('hidden-pin');
        return;
      }

      pin.classList.remove('hidden-pin');
      const x = (projVec.x * 0.5 + 0.5) * width;
      const y = (-(projVec.y * 0.5) + 0.5) * height;
      pin.style.left = `${x}px`;
      pin.style.top = `${y}px`;
    });
  }

  /* --------------------------------------------------------------------------
     CAMERA FLY-TO, EXPLODED VIEW, GLASS PANEL, RGB & ASSEMBLY CONTROLS
     -------------------------------------------------------------------------- */
  focusOnPart(partId, triggerCallback = true) {
    const group = this.partGroups[partId];
    if (!group) return;

    this.selectedPartId = partId;

    // Update active pin state
    Object.keys(this.hotspotElements).forEach(id => {
      this.hotspotElements[id].classList.toggle('active', id === partId);
    });

    // Calculate camera target considering whether exploded view is active
    const offsetDiff = new THREE.Vector3().subVectors(group.userData.targetPos, group.userData.assembledPos);
    this.camTargetPos.copy(group.userData.camPos).add(offsetDiff);
    this.camTargetLook.copy(group.userData.camLook).add(offsetDiff);
    this.isCameraAnimating = true;

    // Brief scale pulse on the selected 3D part
    group.scale.set(1.08, 1.08, 1.08);

    if (triggerCallback && this.onPartSelected) {
      this.onPartSelected(partId);
    }
  }

  resetCameraOverview() {
    this.camTargetPos.set(7.2, 3.6, 8.6);
    this.camTargetLook.set(0, 0.3, 0);
    this.isCameraAnimating = true;
  }

  toggleExplodedView(forceState) {
    this.isExploded = typeof forceState === 'boolean' ? forceState : !this.isExploded;
    if (this.isExploded) {
      this.isGlassOpen = true;
    }

    Object.keys(this.partGroups).forEach(partId => {
      const grp = this.partGroups[partId];
      if (this.assemblyMode && !this.installedParts.has(partId)) return;
      grp.userData.targetPos.copy(this.isExploded ? grp.userData.explodedPos : grp.userData.assembledPos);
    });

    if (this.isExploded) {
      this.camTargetPos.set(8.4, 3.9, 9.6);
      this.camTargetLook.set(0, 0.2, 0.4);
      this.isCameraAnimating = true;
    } else {
      this.resetCameraOverview();
    }
    return this.isExploded;
  }

  toggleSideGlass(forceOpen) {
    this.isGlassOpen = typeof forceOpen === 'boolean' ? forceOpen : !this.isGlassOpen;
    return this.isGlassOpen;
  }

  togglePower(forcePower) {
    this.isPoweredOn = typeof forcePower === 'boolean' ? forcePower : !this.isPoweredOn;
    if (this.isPoweredOn) {
      window.audioEngine.playPowerOnBoot();
    }
    return this.isPoweredOn;
  }

  cycleRgbTheme() {
    this.currentRgbIndex = (this.currentRgbIndex + 1) % this.rgbThemes.length;
    const theme = this.rgbThemes[this.currentRgbIndex];
    if (theme.hex !== 'rainbow') {
      this.applyRgbColor(new THREE.Color(theme.hex));
    }
    return theme;
  }

  applyRgbColor(threeColor) {
    const intensity = this.isPoweredOn ? 1.45 : 0.05;
    this.rgbMaterials.forEach(mat => {
      mat.color.copy(threeColor);
      mat.emissive.copy(threeColor);
      mat.emissiveIntensity = intensity;
    });
    this.rgbLights.forEach(light => {
      light.color.copy(threeColor);
      light.intensity = this.isPoweredOn ? 1.5 : 0.0;
    });
  }

  /* --------------------------------------------------------------------------
     3D STEP-BY-STEP ASSEMBLY SIMULATION MODE
     -------------------------------------------------------------------------- */
  enterAssemblySimulation(installedSet) {
    this.assemblyMode = true;
    this.isExploded = false;
    this.isGlassOpen = true;
    this.installedParts = installedSet;

    Object.keys(this.partGroups).forEach(partId => {
      const grp = this.partGroups[partId];
      if (partId === 'case') {
        grp.visible = true;
        grp.userData.targetPos.copy(grp.userData.assembledPos);
      } else if (this.installedParts.has(partId)) {
        grp.visible = true;
        grp.userData.targetPos.copy(grp.userData.assembledPos);
      } else {
        grp.visible = false;
        grp.position.copy(grp.userData.stagingPos);
        grp.userData.targetPos.copy(grp.userData.stagingPos);
      }
    });

    this.camTargetPos.set(5.4, 2.2, 6.8);
    this.camTargetLook.set(-0.3, 0.2, -0.2);
    this.isCameraAnimating = true;
  }

  exitAssemblySimulation() {
    this.assemblyMode = false;
    Object.keys(this.partGroups).forEach(partId => {
      const grp = this.partGroups[partId];
      grp.visible = true;
      grp.userData.targetPos.copy(this.isExploded ? grp.userData.explodedPos : grp.userData.assembledPos);
    });
  }

  animateInstallPart(partId) {
    const grp = this.partGroups[partId];
    if (!grp) return;
    this.installedParts.add(partId);
    grp.visible = true;
    grp.position.copy(grp.userData.stagingPos);
    grp.userData.targetPos.copy(grp.userData.assembledPos);
    this.focusOnPart(partId, false);
  }

  /* --------------------------------------------------------------------------
     LOAD CUSTOM .GLB / .GLTF 3D FILE FROM USER / BLENDER
     -------------------------------------------------------------------------- */
  loadCustomGlbFile(file, onSuccess, onError) {
    if (!THREE.GLTFLoader) {
      if (onError) onError('GLTFLoader belum siap.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const loader = new THREE.GLTFLoader();
      loader.parse(e.target.result, '', (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 3.8 / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        if (this.customLoadedModel) {
          this.scene.remove(this.customLoadedModel);
        }
        this.pcRoot.visible = false;
        this.customLoadedModel = model;
        this.scene.add(model);
        this.resetCameraOverview();
        if (onSuccess) onSuccess(file.name);
      }, (err) => {
        if (onError) onError(err);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  restoreDefaultRig() {
    if (this.customLoadedModel) {
      this.scene.remove(this.customLoadedModel);
      this.customLoadedModel = null;
    }
    this.pcRoot.visible = true;
    this.resetCameraOverview();
  }

  exportPartGlb(partId = 'mobo', filename = 'MSI_MPG_Z790_CARBON_WIFI.glb', onSuccess, onError) {
    if (!THREE.GLTFExporter) {
      if (onError) onError('GLTFExporter library belum dimuat.');
      return;
    }
    const part = this.partGroups[partId];
    if (!part) {
      if (onError) onError(`Komponen ${partId} tidak ditemukan.`);
      return;
    }

    // Clone part cleanly at origin for an isolated export
    const exportRoot = new THREE.Group();
    const clone = part.clone(true);
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    exportRoot.add(clone);

    const exporter = new THREE.GLTFExporter();
    exporter.parse(
      exportRoot,
      (result) => {
        const blob = new Blob([result], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        if (onSuccess) onSuccess(filename);
      },
      { binary: true, embedImages: true }
    );
  }

  /* --------------------------------------------------------------------------
     POINTER RAYCASTING & MAIN ANIMATION LOOP
     -------------------------------------------------------------------------- */
  onPointerDown(e) {
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
  }

  onPointerUp(e) {
    if (!this.pointerDownPos) return;
    const dx = Math.abs(e.clientX - this.pointerDownPos.x);
    const dy = Math.abs(e.clientY - this.pointerDownPos.y);
    if (dx > 5 || dy > 5) return; // Dragged camera, not a click

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const meshes = [];
    Object.keys(this.partGroups).forEach(id => {
      if (id === 'case') return; // Prioritize internal hardware clicks
      if (this.partGroups[id].visible) {
        this.partGroups[id].traverse(obj => {
          if (obj.isMesh) meshes.push(obj);
        });
      }
    });

    const intersects = this.raycaster.intersectObjects(meshes, false);
    if (intersects.length > 0) {
      const hitPartId = intersects[0].object.userData.partId;
      if (hitPartId) {
        window.audioEngine.playClick();
        this.focusOnPart(hitPartId, true);
      }
    }
  }

  onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Spin all Cooling Fans if PC is Powered ON
    const fanSpeed = this.isPoweredOn ? 11.5 : 0;
    this.fanMeshes.forEach(rotor => {
      rotor.rotation.z -= fanSpeed * dt;
    });

    // 2. Rainbow RGB Wave Mode
    const currentTheme = this.rgbThemes[this.currentRgbIndex];
    if (currentTheme.hex === 'rainbow' && this.isPoweredOn) {
      const hue = (elapsed * 0.18) % 1;
      const col = new THREE.Color().setHSL(hue, 0.95, 0.55);
      this.applyRgbColor(col);
    } else if (!this.isPoweredOn) {
      this.rgbMaterials.forEach(m => { m.emissiveIntensity = 0.04; });
      this.rgbLights.forEach(l => { l.intensity = 0; });
    }

    // 3. Smoothly Animate Tempered Glass Door Hinge
    if (this.glassPivot) {
      const targetRotY = this.isGlassOpen ? -Math.PI * 0.62 : 0;
      this.glassPivot.rotation.y += (targetRotY - this.glassPivot.rotation.y) * 0.1;
    }

    // 4. Smoothly Interpolate All 3D Hardware Positions & Scales
    Object.keys(this.partGroups).forEach(id => {
      const grp = this.partGroups[id];
      grp.position.lerp(grp.userData.targetPos, 0.11);
      grp.scale.lerp(new THREE.Vector3(1, 1, 1), 0.12);
    });

    // 5. Smooth Camera Fly-To Interpolation
    if (this.isCameraAnimating) {
      this.camera.position.lerp(this.camTargetPos, 0.08);
      this.controls.target.lerp(this.camTargetLook, 0.09);
      if (this.camera.position.distanceTo(this.camTargetPos) < 0.04) {
        this.isCameraAnimating = false;
      }
    }

    this.controls.update();
    this.updateHotspotPositions();
    this.renderer.render(this.scene, this.camera);
  }
}

window.PCBuilder3DScene = PCBuilder3DScene;
