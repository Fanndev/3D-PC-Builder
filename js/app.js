/* ==========================================================================
   PC BUILDER 101 — MAIN APPLICATION CONTROLLER
   Coordinates 3D Scene, Audio Engine, Assembly Sim, PSU Calc, Video Lab & Quiz
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const DATA = window.PC_DATA;
  const audio = window.audioEngine;

  // App State
  let currentView = 'home';
  let activePartId = 'mobo';
  let simInstalledSet = new Set(['case']);
  let currentStepIndex = 0;

  // Video Animated Explainer State
  let activeVideoChapter = 0;
  let isSimVideoPlaying = true;
  let videoAnimFrame = 0;

  // Quiz State
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;

  // 1. Initialize Three.js 3D Scene
  const scene3d = new window.PCBuilder3DScene(
    '#canvas-container',
    '#hotspot-layer',
    (selectedPartId) => {
      activePartId = selectedPartId;
      renderPartsList();
      renderPartInspector(selectedPartId);
      if (currentView === 'home') {
        switchView('explore', false);
      }
    }
  );

  /* --------------------------------------------------------------------------
     TOAST HELPER
     -------------------------------------------------------------------------- */
  let toastTimeout = null;
  function showToast(msg) {
    const el = document.getElementById('toast-notification');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('show'), 2800);
  }

  /* --------------------------------------------------------------------------
     NAVIGATION & VIEW SWITCHING
     -------------------------------------------------------------------------- */
  function switchView(viewId, updateCamera = true) {
    audio.stopVoiceOver();
    currentView = viewId;

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${viewId}`);
    });

    // Show/hide 3D hotspot pins depending on active view
    const hotspotLayer = document.getElementById('hotspot-layer');
    const bottomHud = document.querySelector('.viewport-hud-bottom');
    const camHint = document.querySelector('.camera-hint');

    if (viewId === 'home' || viewId === 'explore') {
      scene3d.exitAssemblySimulation();
      hotspotLayer.style.display = 'block';
      bottomHud.style.display = 'flex';
      camHint.style.display = 'block';
      if (updateCamera) {
        if (viewId === 'home') {
          scene3d.resetCameraOverview();
        } else {
          scene3d.focusOnPart(activePartId, false);
        }
      }
    } else if (viewId === 'simulate') {
      hotspotLayer.style.display = 'none';
      bottomHud.style.display = 'flex';
      camHint.style.display = 'block';
      scene3d.enterAssemblySimulation(simInstalledSet);
      renderAssemblySteps();
    } else {
      // Lab & Quiz views: keep 3D spinning in background but hide pins
      scene3d.exitAssemblySimulation();
      hotspotLayer.style.display = 'none';
      bottomHud.style.display = 'none';
      camHint.style.display = 'none';
      scene3d.resetCameraOverview();
    }

    if (viewId === 'lab') {
      audio.initContext();
      audio.startWaveformVisualizer('#beep-waveform', '#00f0ff');
    }
  }

  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playClick();
      switchView(btn.dataset.view, true);
    });
  });

  // Hero CTAs
  document.getElementById('btn-start-explore')?.addEventListener('click', () => {
    audio.playClick();
    switchView('explore', true);
  });

  document.getElementById('btn-start-sim')?.addEventListener('click', () => {
    audio.playClick();
    switchView('simulate', true);
  });

  document.getElementById('btn-welcome-vo')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const welcomeText = 'Selamat datang di PC Builder 101, media pembelajaran multimedia interaktif tiga dimensi pengenalan dan perakitan perangkat keras komputer. Gunakan mouse untuk memutar komputer tiga dimensi, klik komponen untuk mendengar penjelasan suara, atau masuk ke menu Simulasi Rakit PC.';
    audio.playVoiceOver(welcomeText, 'assets/audio/vo_welcome.mp3', (speaking) => {
      btn.innerHTML = speaking
        ? '⏹️ Hentikan Narasi Sambutan'
        : '🔊 Putar Sambutan Audio (Voice-Over)';
    });
  });

  /* --------------------------------------------------------------------------
     TOP NAVBAR AUDIO & 3D BOTTOM HUD CONTROLS
     -------------------------------------------------------------------------- */
  const btnBgm = document.getElementById('btn-toggle-bgm');
  btnBgm?.addEventListener('click', () => {
    const playing = audio.toggleBgm();
    btnBgm.classList.toggle('active', playing);
    btnBgm.innerHTML = playing ? '🎵 BGM: ON' : '🎵 BGM: OFF';
    showToast(playing ? 'Musik Latar (Ambient BGM) Diaktifkan' : 'Musik Latar Dimatikan');
  });

  const btnSfx = document.getElementById('btn-toggle-sfx');
  btnSfx?.addEventListener('click', () => {
    audio.sfxEnabled = !audio.sfxEnabled;
    btnSfx.classList.toggle('active', audio.sfxEnabled);
    btnSfx.innerHTML = audio.sfxEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
  });

  // Bottom 3D Viewport Controls
  const btnExplode = document.getElementById('hud-btn-explode');
  btnExplode?.addEventListener('click', () => {
    audio.playClick();
    const exploded = scene3d.toggleExplodedView();
    btnExplode.classList.toggle('active', exploded);
    btnExplode.innerHTML = exploded
      ? '🧩 Gabungkan Kembali (Normal)'
      : '💥 Mode Bedah 3D (Exploded View)';
    showToast(exploded
      ? 'Mode Bedah 3D Aktif: Seluruh lapisan hardware dipisahkan!'
      : 'Komponen 3D dikembalikan ke posisi semula.');
  });

  const btnGlass = document.getElementById('hud-btn-glass');
  btnGlass?.addEventListener('click', () => {
    audio.playClick();
    const isOpen = scene3d.toggleSideGlass();
    btnGlass.classList.toggle('active', isOpen);
    btnGlass.innerHTML = isOpen ? '🚪 Tutup Kaca Casing' : '🪟 Buka Kaca Casing';
  });

  const btnRgb = document.getElementById('hud-btn-rgb');
  btnRgb?.addEventListener('click', () => {
    audio.playClick();
    const theme = scene3d.cycleRgbTheme();
    const swatch = btnRgb.querySelector('.rgb-swatch');
    if (swatch) swatch.style.background = theme.css;
    showToast(`Tema Pencahayaan 3D: ${theme.name}`);
  });

  const btnPower = document.getElementById('hud-btn-power');
  btnPower?.addEventListener('click', () => {
    const powered = scene3d.togglePower();
    btnPower.classList.toggle('active', powered);
    btnPower.innerHTML = powered ? '⚡ Power: ON (Kipas Aktif)' : '⭕ Power: OFF';
    showToast(powered ? 'Sistem PC Dinyalakan (POST Sukses!)' : 'Sistem PC Dimatikan.');
  });

  document.getElementById('hud-btn-reset-cam')?.addEventListener('click', () => {
    audio.playClick();
    scene3d.resetCameraOverview();
  });

  // Custom GLB 3D File Loader Input
  const glbInput = document.getElementById('input-custom-glb');
  document.getElementById('btn-upload-glb')?.addEventListener('click', () => {
    glbInput?.click();
  });

  glbInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    scene3d.loadCustomGlbFile(
      file,
      (name) => {
        showToast(`Model 3D Kustom "${name}" berhasil dimuat!`);
        document.getElementById('btn-restore-rig').style.display = 'inline-flex';
      },
      () => showToast('Gagal memuat file .glb/.gltf')
    );
  });

  document.getElementById('btn-restore-rig')?.addEventListener('click', (e) => {
    e.currentTarget.style.display = 'none';
    scene3d.restoreDefaultRig();
    showToast('Kembali ke Rig 3D PC Builder 101 Default');
  });

  /* --------------------------------------------------------------------------
     VIEW 2: EKSPLORASI 3D HARDWARE (PART LIST & INSPECTOR)
     -------------------------------------------------------------------------- */
  function renderPartsList() {
    const listContainer = document.getElementById('parts-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = DATA.components.map(comp => `
      <div class="part-item ${comp.id === activePartId ? 'active' : ''}" data-part="${comp.id}">
        <div class="part-icon-badge">${comp.icon}</div>
        <div class="part-item-info">
          <div class="part-item-name">${comp.num}. ${comp.shortName}</div>
          <div class="part-item-sub">${comp.category}</div>
        </div>
      </div>
    `).join('');

    listContainer.querySelectorAll('.part-item').forEach(el => {
      el.addEventListener('click', () => {
        const partId = el.dataset.part;
        audio.playClick();
        activePartId = partId;
        renderPartsList();
        renderPartInspector(partId);
        scene3d.focusOnPart(partId, false);
      });
    });
  }

  function renderPartInspector(partId) {
    const comp = DATA.components.find(c => c.id === partId) || DATA.components[0];
    const container = document.getElementById('part-inspector-content');
    if (!container) return;

    audio.stopVoiceOver();

    container.innerHTML = `
      <div class="detail-visual-card">
        <div class="detail-svg-wrap">${comp.svg}</div>
        <div>
          <div class="detail-category-tag">KOMPONEN #${comp.num} • ${comp.category}</div>
          <div class="detail-title">${comp.name}</div>
          <div class="detail-model">${comp.model}</div>
        </div>
      </div>

      <div class="vo-audio-bar">
        <button class="vo-btn" id="btn-part-vo">
          🔊 Dengarkan Voice-Over
        </button>
        <span class="vo-status" id="part-vo-status">Narasi Audio Siap</span>
      </div>

      <div class="detail-section-label">Deskripsi & Fungsi Utama</div>
      <p class="detail-text">${comp.description}</p>

      <div class="detail-section-label">Cara Kerja di Dalam Sistem</div>
      <p class="detail-text">${comp.howItWorks}</p>

      <div class="detail-section-label">Spesifikasi Teknis (3D Model)</div>
      <div class="specs-grid">
        ${comp.specs.map(s => `
          <div class="spec-chip">
            <div class="spec-chip-label">${s.label}</div>
            <div class="spec-chip-val">${s.val}</div>
          </div>
        `).join('')}
      </div>

      <div class="install-tip-box">
        <strong>💡 Tips Perakitan & K3:</strong><br/>
        ${comp.installTip}
      </div>
    `;

    const voBtn = document.getElementById('btn-part-vo');
    const voStatus = document.getElementById('part-vo-status');
    voBtn?.addEventListener('click', () => {
      audio.playVoiceOver(comp.voiceOverText, comp.audioFile, (speaking) => {
        if (speaking) {
          voBtn.innerHTML = '⏹️ Hentikan Suara';
          voStatus.textContent = 'Sedang Memutar Narasi...';
        } else {
          voBtn.innerHTML = '🔊 Dengarkan Voice-Over';
          voStatus.textContent = 'Narasi Audio Siap';
        }
      });
    });
  }

  renderPartsList();
  renderPartInspector(activePartId);

  /* --------------------------------------------------------------------------
     VIEW 3: SIMULASI RAKIT PC 3D & KALKULATOR DAYA PSU
     -------------------------------------------------------------------------- */
  function renderAssemblySteps() {
    const stepsContainer = document.getElementById('assembly-steps-list');
    const progressFill = document.getElementById('sim-progress-fill');
    const progressLabel = document.getElementById('sim-progress-label');
    if (!stepsContainer) return;

    const totalSteps = DATA.assemblySteps.length;
    const completedCount = currentStepIndex;
    const pct = Math.round((completedCount / totalSteps) * 100);

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressLabel) progressLabel.textContent = `${completedCount} / ${totalSteps} Komponen (${pct}%)`;

    stepsContainer.innerHTML = DATA.assemblySteps.map((s, idx) => {
      const isInstalled = idx < currentStepIndex;
      const isNext = idx === currentStepIndex;
      return `
        <div class="assembly-step-card ${isInstalled ? 'installed' : ''} ${isNext ? 'next-up' : ''}">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="step-num-circle">${isInstalled ? '✓' : s.step}</div>
            <div>
              <div style="font-size:12.5px; font-weight:700;">${s.title}</div>
              <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${s.instruction}</div>
            </div>
          </div>
          <button class="install-action-btn" data-step-idx="${idx}" ${isInstalled ? 'disabled' : ''}>
            ${isInstalled ? 'Terpasang' : 'Pasang 3D'}
          </button>
        </div>
      `;
    }).join('');

    stepsContainer.querySelectorAll('.install-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.stepIdx, 10);
        handleInstallStep(idx);
      });
    });
  }

  function handleInstallStep(idx) {
    if (idx !== currentStepIndex) {
      audio.playError();
      const expected = DATA.assemblySteps[currentStepIndex];
      showToast(`⚠️ Pasang sesuai urutan! Langkah saat ini: ${expected.title}`);
      return;
    }

    const stepObj = DATA.assemblySteps[idx];
    audio.playInstallSnap();
    simInstalledSet.add(stepObj.partId);
    scene3d.animateInstallPart(stepObj.partId);
    currentStepIndex++;
    renderAssemblySteps();
    showToast(`✅ ${stepObj.successMsg}`);

    if (currentStepIndex === DATA.assemblySteps.length) {
      setTimeout(() => {
        scene3d.togglePower(true);
        showToast('🎉 Selamat! Seluruh Komponen PC 3D Berhasil Dirakit & Menyala!');
      }, 650);
    }
  }

  document.getElementById('btn-sim-reset')?.addEventListener('click', () => {
    audio.playClick();
    simInstalledSet = new Set(['case']);
    currentStepIndex = 0;
    scene3d.togglePower(false);
    scene3d.enterAssemblySimulation(simInstalledSet);
    renderAssemblySteps();
    showToast('Simulasi Rakit PC 3D direset ke Casing kosong.');
  });

  document.getElementById('btn-sim-auto')?.addEventListener('click', () => {
    audio.playClick();
    DATA.assemblySteps.forEach((s) => simInstalledSet.add(s.partId));
    currentStepIndex = DATA.assemblySteps.length;
    scene3d.enterAssemblySimulation(simInstalledSet);
    scene3d.togglePower(true);
    renderAssemblySteps();
    showToast('⚡ Seluruh Komponen 3D Terpasang & Sistem Menyala!');
  });

  // PSU Wattage Calculator
  function initPsuCalculator() {
    const calc = DATA.psuCalculator;
    const populateSelect = (id, items, defaultIdx = 1) => {
      const sel = document.getElementById(id);
      if (!sel) return;
      sel.innerHTML = items.map((item, i) => `
        <option value="${item.watt}" ${i === defaultIdx ? 'selected' : ''}>${item.label}</option>
      `).join('');
      sel.addEventListener('change', () => {
        audio.playClick();
        updatePsuCalculation();
      });
    };

    populateSelect('calc-cpu', calc.cpus, 2);
    populateSelect('calc-gpu', calc.gpus, 2);
    populateSelect('calc-ram', calc.rams, 1);
    populateSelect('calc-storage', calc.storages, 1);
    populateSelect('calc-cooling', calc.coolings, 1);

    document.querySelectorAll('.preset-calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick();
        const key = btn.dataset.preset;
        const p = calc.presets[key];
        if (!p) return;
        document.getElementById('calc-cpu').value = p.cpu;
        document.getElementById('calc-gpu').value = p.gpu;
        document.getElementById('calc-ram').value = p.ram;
        document.getElementById('calc-storage').value = p.storage;
        document.getElementById('calc-cooling').value = p.cooling;
        updatePsuCalculation();
        showToast(`Preset Dimuat: ${p.name}`);
      });
    });

    updatePsuCalculation();
  }

  function updatePsuCalculation() {
    const moboWatt = 45;
    const cpuW = parseInt(document.getElementById('calc-cpu')?.value || 125, 10);
    const gpuW = parseInt(document.getElementById('calc-gpu')?.value || 220, 10);
    const ramW = parseInt(document.getElementById('calc-ram')?.value || 15, 10);
    const storageW = parseInt(document.getElementById('calc-storage')?.value || 16, 10);
    const coolingW = parseInt(document.getElementById('calc-cooling')?.value || 25, 10);

    const totalLoad = moboWatt + cpuW + gpuW + ramW + storageW + coolingW;
    const recommendedRaw = Math.ceil((totalLoad * 1.38) / 50) * 50;
    const recommendedPsu = Math.max(450, recommendedRaw);

    const wattEl = document.getElementById('calc-total-watt');
    const recEl = document.getElementById('calc-psu-rec');
    if (wattEl) wattEl.textContent = `${totalLoad} Watt`;
    if (recEl) recEl.textContent = `Rekomendasi PSU: ${recommendedPsu}W 80+ Gold`;
  }

  initPsuCalculator();

  /* --------------------------------------------------------------------------
     VIEW 4: LAB AUDIO DIAGNOSA BIOS & INTERACTIVE VIDEO TUTORIAL
     -------------------------------------------------------------------------- */
  function renderBiosBeepLab() {
    const container = document.getElementById('bios-beep-list');
    if (!container) return;

    container.innerHTML = DATA.biosBeepCodes.map(b => `
      <div class="beep-card" id="beep-card-${b.id}">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:3px;">
            <span style="font-size:13px; font-weight:800; color:#f8fafc;">${b.name}</span>
            <span style="font-size:10px; font-family:var(--font-mono); padding:2px 7px; border-radius:99px; background:${b.color}22; color:${b.color}; border:1px solid ${b.color}66;">
              ${b.status}
            </span>
          </div>
          <div style="font-family:var(--font-mono); font-size:11px; color:var(--accent-cyan); margin-bottom:4px;">
            Pola Suara: ${b.codePattern}
          </div>
          <div style="font-size:12px; color:var(--text-secondary); line-height:1.45;">
            ${b.description}
          </div>
          <div style="font-size:11.5px; color:#a7f3d0; margin-top:4px;">
            <strong>Solusi:</strong> ${b.solution}
          </div>
        </div>
        <button class="beep-play-btn" data-beep="${b.id}">
          🔊 Putar Beep
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.beep-play-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const beepId = btn.dataset.beep;
        const item = DATA.biosBeepCodes.find(x => x.id === beepId);
        if (!item) return;

        document.querySelectorAll('.beep-card').forEach(c => c.classList.remove('playing'));
        const card = document.getElementById(`beep-card-${item.id}`);
        card?.classList.add('playing');

        audio.playBiosBeepPattern(item, () => {
          card?.classList.remove('playing');
        });
      });
    });
  }

  renderBiosBeepLab();

  // Interactive Motion-Graphic Video Tutorial Canvas + MP4 Loader
  function initVideoTutorialLab() {
    const chapContainer = document.getElementById('video-chapters-list');
    const canvas = document.getElementById('tutorial-video-canvas');
    const mp4Video = document.getElementById('custom-video-player');
    const btnPlayPause = document.getElementById('btn-video-play');
    const btnNarrateChap = document.getElementById('btn-video-narrate');
    const fileInput = document.getElementById('input-custom-video');

    if (chapContainer) {
      chapContainer.innerHTML = DATA.videoChapters.map((c, idx) => `
        <button class="chapter-btn ${idx === 0 ? 'active' : ''}" data-chap="${idx}">
          <div style="font-family:var(--font-mono); font-size:10.5px; color:var(--accent-cyan);">${c.duration}</div>
          <div style="font-weight:700; margin-top:2px;">${c.title}</div>
        </button>
      `).join('');

      chapContainer.querySelectorAll('.chapter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          audio.playClick();
          activeVideoChapter = parseInt(btn.dataset.chap, 10);
          chapContainer.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          updateChapterSummary();
        });
      });
    }

    function updateChapterSummary() {
      const chap = DATA.videoChapters[activeVideoChapter] || DATA.videoChapters[0];
      const sumEl = document.getElementById('video-chapter-summary');
      if (sumEl) {
        sumEl.innerHTML = `<strong>${chap.title}</strong> — ${chap.summary}`;
      }
    }
    updateChapterSummary();

    btnPlayPause?.addEventListener('click', () => {
      audio.playClick();
      if (mp4Video && mp4Video.style.display !== 'none') {
        if (mp4Video.paused) {
          mp4Video.play();
          btnPlayPause.textContent = '⏸️ Pause Video';
        } else {
          mp4Video.pause();
          btnPlayPause.textContent = '▶️ Putar Video';
        }
      } else {
        isSimVideoPlaying = !isSimVideoPlaying;
        btnPlayPause.textContent = isSimVideoPlaying ? '⏸️ Pause Animasi Video' : '▶️ Putar Animasi Video';
      }
    });

    btnNarrateChap?.addEventListener('click', () => {
      const chap = DATA.videoChapters[activeVideoChapter] || DATA.videoChapters[0];
      audio.playVoiceOver(`${chap.title}. ${chap.summary}`, null, (speaking) => {
        btnNarrateChap.textContent = speaking ? '⏹️ Stop Suara' : '🔊 Narasi Bab Ini';
      });
    });

    document.getElementById('btn-load-mp4')?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file || !mp4Video || !canvas) return;
      const url = URL.createObjectURL(file);
      canvas.style.display = 'none';
      mp4Video.style.display = 'block';
      mp4Video.src = url;
      mp4Video.play();
      showToast(`Video "${file.name}" berhasil dimuat ke pemutar!`);
    });

    // Animated Canvas Motion-Graphic Explainer Loop
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const renderTutorialCanvas = () => {
        requestAnimationFrame(renderTutorialCanvas);
        if (isSimVideoPlaying) videoAnimFrame += 0.03;

        const w = canvas.width;
        const h = canvas.height;
        const chap = DATA.videoChapters[activeVideoChapter] || DATA.videoChapters[0];

        // Cyber Studio Backdrop
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#060c1d');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Animated Background Grid
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 36) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 36) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Chapter-specific animated technical illustration
        const pulse = Math.sin(videoAnimFrame) * 12;
        ctx.save();
        ctx.translate(w / 2, h / 2 - 14);

        if (activeVideoChapter === 0) {
          // Chapter 1: CPU aligning with Socket + Golden Triangle
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-75, -55, 150, 110);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
          ctx.fillRect(-48, -45 + pulse * 0.6, 96, 84);
          ctx.strokeStyle = '#10b981';
          ctx.strokeRect(-48, -45 + pulse * 0.6, 96, 84);
          // Golden triangle marker
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(-44, 34 + pulse * 0.6);
          ctx.lineTo(-28, 34 + pulse * 0.6);
          ctx.lineTo(-44, 18 + pulse * 0.6);
          ctx.fill();
        } else if (activeVideoChapter === 1) {
          // Chapter 2: Pea-sized Thermal Paste & Cooler Airflow
          ctx.fillStyle = '#334155';
          ctx.fillRect(-55, -45, 110, 90);
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(0, 0, 10 + Math.abs(pulse) * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 48, videoAnimFrame, videoAnimFrame + Math.PI * 1.4);
          ctx.stroke();
        } else if (activeVideoChapter === 2) {
          // Chapter 3: Dual-Channel RAM Slots A2 & B2
          [-60, -20, 20, 60].forEach((xPos, slotIdx) => {
            const isTarget = slotIdx === 1 || slotIdx === 3;
            ctx.fillStyle = isTarget ? '#00f0ff' : '#1e293b';
            const yOff = isTarget ? pulse * 0.4 : 0;
            ctx.fillRect(xPos - 8, -50 + yOff, 16, 100);
          });
        } else {
          // Chapter 4: GPU PCIe x16 + Power Flow
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2.5;
          ctx.fillRect(-105, -35, 210, 70);
          ctx.strokeRect(-105, -35, 210, 70);
          [-50, 50].forEach(cx => {
            ctx.beginPath();
            ctx.arc(cx, 0, 24, videoAnimFrame * 2, videoAnimFrame * 2 + Math.PI * 1.5);
            ctx.strokeStyle = '#00f0ff';
            ctx.stroke();
          });
        }
        ctx.restore();

        // Bottom Subtitle Overlay inside Video Frame
        ctx.fillStyle = 'rgba(2, 6, 23, 0.84)';
        ctx.fillRect(0, h - 64, w, 64);
        ctx.fillStyle = '#00f0ff';
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillText(`MODUL VIDEO INTERAKTIF • ${chap.duration}`, 18, h - 38);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(chap.title, 18, h - 16);
      };
      renderTutorialCanvas();
    }
  }

  initVideoTutorialLab();

  /* --------------------------------------------------------------------------
     VIEW 5: EVALUASI KUIS MULTIMEDIA INTERAKTIF (10 SOAL + AUDIO BEEP)
     -------------------------------------------------------------------------- */
  function renderQuizQuestion() {
    const container = document.getElementById('quiz-stage-content');
    if (!container) return;

    const total = DATA.quizQuestions.length;

    if (quizIndex >= total) {
      const nilai = Math.round((quizScore / total) * 100);
      const predikat = nilai >= 80
        ? 'SANGAT KOMPETEN (Master PC Builder)'
        : nilai >= 60
          ? 'KOMPETEN (Teknisi Muda)'
          : 'PERLU BELAJAR LAGI';

      container.innerHTML = `
        <div style="text-align:center; padding: 26px 16px;">
          <div style="font-size:48px; margin-bottom:10px;">🏆</div>
          <div class="hero-badge" style="margin:0 auto 12px;">EVALUASI SELESAI</div>
          <h2 style="font-size:26px; font-weight:800; margin-bottom:6px;">Skor Akhir Kamu: ${nilai} / 100</h2>
          <p style="color:var(--text-secondary); font-size:14px; margin-bottom:16px;">
            Menjawab benar <strong>${quizScore}</strong> dari <strong>${total}</strong> soal multimedia (${predikat})
          </p>
          <div style="display:flex; justify-content:center; gap:12px;">
            <button class="btn-primary" id="btn-restart-quiz">🔄 Ulangi Kuis Evaluasi</button>
            <button class="btn-secondary" id="btn-back-3d">🖥️ Kembali ke Eksplorasi 3D</button>
          </div>
        </div>
      `;

      document.getElementById('btn-restart-quiz')?.addEventListener('click', () => {
        audio.playClick();
        quizIndex = 0;
        quizScore = 0;
        quizAnswered = false;
        renderQuizQuestion();
      });

      document.getElementById('btn-back-3d')?.addEventListener('click', () => {
        audio.playClick();
        switchView('explore', true);
      });
      return;
    }

    const q = DATA.quizQuestions[quizIndex];
    quizAnswered = false;

    const audioPromptHtml = q.type === 'AUDIO_BEEP' ? `
      <div style="margin-bottom:14px; padding:10px 14px; border-radius:10px; background:rgba(0,240,255,0.12); border:1px solid rgba(0,240,255,0.4); display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:12.5px; color:#7dd3fc; font-family:var(--font-mono);">
          🎧 Soal Berbasis Audio Diagnosa BIOS
        </span>
        <button class="beep-play-btn" id="btn-quiz-play-beep">🔊 Putar Bunyi BIOS</button>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="quiz-header-meta">
        <span class="hero-badge" style="margin:0;">SOAL ${quizIndex + 1} DARI ${total}</span>
        <span style="font-family:var(--font-mono); font-size:13px; color:var(--accent-emerald);">
          Skor Saat Ini: ${quizScore * 10} Poin
        </span>
      </div>

      <div class="quiz-question-box">
        ${audioPromptHtml}
        <div class="quiz-q-text">${q.question}</div>
        <div class="quiz-options-grid">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt-btn" data-opt="${i}">
              <span class="step-num-circle">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback-area"></div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="btn-primary" id="btn-next-question" style="display:none;">
          Soal Berikutnya ➡️
        </button>
      </div>
    `;

    document.getElementById('btn-quiz-play-beep')?.addEventListener('click', () => {
      const beepObj = DATA.biosBeepCodes.find(b => b.id === q.beepId);
      if (beepObj) audio.playBiosBeepPattern(beepObj);
    });

    container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (quizAnswered) return;
        quizAnswered = true;
        const chosen = parseInt(btn.dataset.opt, 10);
        const isCorrect = chosen === q.answer;

        if (isCorrect) quizScore++;
        audio.playQuizFeedback(isCorrect);

        container.querySelectorAll('.quiz-opt-btn').forEach((b, idx) => {
          b.disabled = true;
          if (idx === q.answer) b.classList.add('correct');
          else if (idx === chosen && !isCorrect) b.classList.add('wrong');
        });

        const fb = document.getElementById('quiz-feedback-area');
        if (fb) {
          fb.innerHTML = `
            <div class="quiz-feedback-box">
              <strong>${isCorrect ? '✅ Jawaban Tepat!' : '❌ Kurang Tepat.'}</strong><br/>
              ${q.explanation}
            </div>
          `;
        }

        const nextBtn = document.getElementById('btn-next-question');
        if (nextBtn) {
          nextBtn.style.display = 'inline-flex';
          nextBtn.addEventListener('click', () => {
            audio.playClick();
            quizIndex++;
            renderQuizQuestion();
          });
        }
      });
    });
  }

  renderQuizQuestion();
});
