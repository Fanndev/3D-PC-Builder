# Panduan & Dokumentasi Aset Multimedia ("PC Builder 101 — 3D Studio")

Seluruh aset **Audio (`.mp3`)** dan **Video (`.mp4`)** telah tersedia secara lengkap dan terintegrasi langsung di dalam aplikasi **[`index.html`](file:///d:/download/UTS%20Multimedia/index.html)**.

---

## 1. Daftar Aset Audio (`assets/audio/` — 31 File `.mp3`)

### A. Narasi Voice-Over Bahasa Indonesia (20 File `.mp3`, 44.1 kHz, 128 kbps)
- **Beranda & 8 Komponen Hardware 3D:**
  - `assets/audio/vo_welcome.mp3` — Sambutan Beranda PC Builder 101
  - `assets/audio/vo_mobo.mp3` — Penjelasan Motherboard MSI MPG Z790 CARBON WIFI
  - `assets/audio/vo_cpu.mp3` — Penjelasan Processor (CPU)
  - `assets/audio/vo_cooler.mp3` — Penjelasan CPU Cooler & Thermal Paste
  - `assets/audio/vo_ram.mp3` — Penjelasan RAM DDR5 Dual-Channel
  - `assets/audio/vo_ssd.mp3` — Penjelasan SSD NVMe M.2
  - `assets/audio/vo_gpu.mp3` — Penjelasan Kartu Grafis (GPU GeForce RTX)
  - `assets/audio/vo_psu.mp3` — Penjelasan Power Supply Unit (PSU 750W 80+ Gold)
  - `assets/audio/vo_case.mp3` — Penjelasan Casing ATX & Airflow Fan
- **Narasi 4 Bab Video Tutorial:**
  - `assets/audio/vo_chap1.mp3` s/d `assets/audio/vo_chap4.mp3`
- **Narasi 7 Langkah Simulasi Rakit PC 3D:**
  - `assets/audio/vo_step1.mp3` s/d `assets/audio/vo_step7.mp3`

### B. Audio Diagnosa Kode Beep BIOS (5 File `.mp3`)
- `assets/audio/beep_normal.mp3` — 1x Beep Pendek (POST Normal - 1000 Hz)
- `assets/audio/beep_ram_error.mp3` — 3x Beep Panjang (RAM Error - 800 Hz)
- `assets/audio/beep_vga_error.mp3` — 1x Beep Panjang + 3x Beep Pendek (GPU/VGA Error - 850 Hz)
- `assets/audio/beep_cpu_overheat.mp3` — Beep Sirene Dua Nada (CPU Overheat - 1200/720 Hz)
- `assets/audio/beep_power_error.mp3` — Beep Cepat Beruntun (PSU Error - 920 Hz)

### C. Efek Suara Antarmuka / UI SFX & Musik Latar (6 File `.mp3`)
- `assets/audio/sfx_click.mp3` — Klik tombol antarmuka
- `assets/audio/sfx_install_ok.mp3` — Suara pengunci komponen 3D terpasang
- `assets/audio/sfx_error.mp3` — Peringatan urutan pasang salah
- `assets/audio/sfx_quiz_correct.mp3` & `assets/audio/sfx_quiz_wrong.mp3` — Evaluasi kuis benar/salah
- `assets/audio/bgm_ambient.mp3` — Musik latar elektronik ambient (*Wikimedia Commons: Hypnotic ambient electronic music by MusicLM, CC0*)

---

## 2. Daftar Aset Video (`assets/video/` — 5 File `.mp4` HD 720p H.264 + AAC)

Seluruh video dikompilasi dalam resolusi **1280x720 (30 fps, H.264 `yuv420p`)** dengan sulih suara (**Voice-Over Bahasa Indonesia**) dan musik latar:
1. `assets/video/bab1_cpu_mobo.mp4` (34 detik) — **Bab 1: Persiapan & Pemasangan CPU ke Socket Motherboard** (Membuka box motherboard, membuka pengait socket LGA1700, meletakkan CPU Intel Core i7 ke socket, dan mengunci bracket).
2. `assets/video/bab2_cooler_thermal.mp4` (53 detik) — **Bab 2: Teknik Mengoles Thermal Paste & Pemasangan CPU Cooler** (Memasang bracket dudukan cooler, mengoleskan *thermal paste* di tengah IHS CPU, memasang *dual-tower heatsink*, memasang kipas PWM 120mm, dan mencolokkan kabel 4-pin ke `CPU_FAN`).
3. `assets/video/bab3_ram_ssd.mp4` (38 detik) — **Bab 3: Pemasangan RAM Dual-Channel & Storage SSD NVMe M.2** (Membuka klip slot A2 & B2, menekan 2 keping RAM DDR5 RGB Dual-Channel hingga klik, membuka pelindung heatsink M.2, memasang SSD NVMe M.2 miring 30 derajat, dan mengencangkan baut heatsink).
4. `assets/video/bab4_gpu_psu_boot.mp4` (76 detik) — **Bab 4: Instalasi GPU RTX, Manajemen Kabel PSU & First Boot** (Memasang GPU GeForce RTX 4070 Ti Super ke slot PCIe x16 & baut casing, memasang kabel modular pada PSU 80+ Gold, memasang PSU ke casing, menyambungkan kabel 24-pin ATX & PCIe Power, serta pengujian *First Boot* kipas & RGB menyala).
5. `assets/video/tutorial_rakit_pc.mp4` (3 menit 21 detik) — **Video Tutorial Lengkap Gabungan Bab 1 s/d Bab 4**

### Sumber & Lisensi Rekaman Video Hardware (Wikimedia Commons):
- *Legendary Fractal Torrent Airflow Case PC Build (Intel i7-14700KF - RTX 4070 Ti Super)* oleh **Archetype Origins** (Lisensi: **CC BY 3.0** via Wikimedia Commons).

---

## 3. Skrip Generator Aset (File Mentah Otomatisasi)
Jika ingin memodifikasi teks narasi atau merender ulang seluruh aset audio dan video, jalankan skrip Node.js + FFmpeg berikut:
```bash
node scripts/fetch_and_build_multimedia_assets.js
node scripts/build_video_assets.js
```
