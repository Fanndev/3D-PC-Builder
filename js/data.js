/* ==========================================================================
   PC BUILDER 101 — MULTIMEDIA CONTENT & HARDWARE DATABASE
   Complete Text, SVG Graphics, Voice-Over Scripts, BIOS Audio & Quiz Data
   ========================================================================== */

window.PC_DATA = {
  components: [
    {
      id: 'mobo',
      num: '01',
      name: 'Motherboard (Papan Induk)',
      shortName: 'Motherboard',
      category: 'Sirkuit Utama & Konektivitas',
      model: 'ATX Z790 CyberCore WiFi DDR5',
      wattage: 45,
      icon: '🎛️',
      audioFile: 'assets/audio/vo_mobo.mp3',
      voiceOverText: 'Motherboard atau papan induk adalah sirkuit utama komputer yang menghubungkan seluruh komponen perangkat keras seperti prosesor, RAM, kartu grafis, dan penyimpanan agar dapat saling berkomunikasi.',
      description: 'Motherboard adalah papan sirkuit cetak (PCB) utama yang menjadi tulang punggung sistem komputer. Seluruh komponen seperti CPU, RAM, GPU, dan SSD terpasang dan berkomunikasi melalui jalur sirkuit (bus) pada motherboard.',
      howItWorks: 'Chipset pada motherboard mengatur lalu lintas data berkecepatan tinggi antara prosesor, memori RAM, slot ekspansi PCIe, serta konektor penyimpanan NVMe dan port I/O belakang.',
      installTip: 'Pasang I/O shield terlebih dahulu pada casing, lalu letakkan motherboard di atas baut penyangga (standoff) kuningan agar bagian bawah sirkuit tidak mengalami korsleting.',
      specs: [
        { label: 'Form Factor', val: 'ATX (30.5 x 24.4 cm)' },
        { label: 'Socket CPU', val: 'LGA 1700 / AM5' },
        { label: 'Slot Memori', val: '4x DDR5 Dual-Channel' },
        { label: 'Slot Ekspansi', val: 'PCIe 5.0 x16 & 3x M.2' }
      ],
      svg: `<svg viewBox="0 0 64 64" width="54" height="54" fill="none">
        <rect x="8" y="6" width="48" height="52" rx="4" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/>
        <rect x="20" y="14" width="16" height="16" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <line x1="42" y1="12" x2="42" y2="32" stroke="#a855f7" stroke-width="2.5"/>
        <line x1="47" y1="12" x2="47" y2="32" stroke="#a855f7" stroke-width="2.5"/>
        <rect x="14" y="38" width="32" height="5" rx="1" fill="#00f0ff"/>
        <circle cx="46" cy="49" r="4" fill="#64748b" stroke="#cbd5e1" stroke-width="1.2"/>
      </svg>`
    },
    {
      id: 'cpu',
      num: '02',
      name: 'Processor (CPU)',
      shortName: 'Processor (CPU)',
      category: 'Pusat Pemrosesan Data',
      model: 'Core Ultra i9 / Ryzen 9 (16-Core, 5.6 GHz)',
      wattage: 125,
      icon: '🧠',
      audioFile: 'assets/audio/vo_cpu.mp3',
      voiceOverText: 'Processor atau Central Processing Unit adalah otak utama komputer yang bertugas mengeksekusi instruksi program, melakukan perhitungan logika, dan mengendalikan kerja seluruh sistem.',
      description: 'Central Processing Unit (CPU) adalah otak komputer yang mengeksekusi jutaan hingga miliaran instruksi per detik melalui siklus Fetch, Decode, dan Execute.',
      howItWorks: 'Memiliki banyak inti pemrosesan (Multi-Core) dan memori super cepat internal (L1/L2/L3 Cache) untuk memproses sistem operasi, aplikasi multimedia, dan kompilasi kode.',
      installTip: 'Perhatikan tanda segitiga emas di sudut prosesor! Sejajarkan dengan tanda segitiga pada socket motherboard, letakkan perlahan tanpa ditekan paksa, lalu kunci tuas pengamannya.',
      specs: [
        { label: 'Jumlah Inti', val: '16 Cores / 24 Threads' },
        { label: 'Kecepatan Clock', val: 'Base 3.6 GHz / Boost 5.6 GHz' },
        { label: 'Cache Memori', val: '36 MB Smart Cache' },
        { label: 'TDP Default', val: '125 Watt' }
      ],
      svg: `<svg viewBox="0 0 64 64" width="54" height="54" fill="none">
        <rect x="14" y="14" width="36" height="36" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <rect x="21" y="21" width="22" height="22" rx="2" fill="#334155" stroke="#00f0ff" stroke-width="1.5"/>
        <polygon points="17,47 22,47 17,42" fill="#f59e0b"/>
      </svg>`
    },
    {
      id: 'cooler',
      num: '03',
      name: 'CPU Cooler & Thermal Paste',
      shortName: 'CPU Cooler',
      category: 'Sistem Pendingin Prosesor',
      model: 'FrostCore ARGB Tower Cooler (220W TDP)',
      wattage: 15,
      icon: '❄️',
      audioFile: 'assets/audio/vo_cooler.mp3',
      voiceOverText: 'CPU Cooler beserta thermal paste berfungsi menyerap dan membuang panas berlebih dari prosesor agar suhu tetap stabil dan mencegah penurunan performa akibat thermal throttling.',
      description: 'Prosesor menghasilkan panas tinggi saat bekerja. CPU Cooler menggunakan pipa tembaga penghantar panas (heatpipe), sirip aluminium (heatsink), dan kipas berkecepatan tinggi untuk membuang panas.',
      howItWorks: 'Thermal paste mengisi celah mikroskopis antara permukaan atas CPU dan dasar cooler, kemudian panas dialirkan ke sirip heatsink dan dihembuskan keluar oleh kipas PWM.',
      installTip: 'Oleskan thermal paste sebesar biji kacang polong di tengah CPU, dan wajib melepas stiker plastik pelindung di bagian bawah heatsink sebelum memasangnya!',
      specs: [
        { label: 'Tipe Pendingin', val: '4x Copper Heatpipe + ARGB Fan' },
        { label: 'Kecepatan Kipas', val: '800 - 2000 RPM (PWM)' },
        { label: 'Konektor', val: '4-Pin CPU_FAN Header' },
        { label: 'Tingkat Kebisingan', val: '24.5 dBA (Silent)' }
      ],
      svg: `<svg viewBox="0 0 64 64" width="54" height="54" fill="none">
        <circle cx="32" cy="32" r="22" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/>
        <circle cx="32" cy="32" r="6" fill="#38bdf8"/>
        <path d="M32 12 C38 18, 38 24, 32 26 M52 32 C46 38, 40 38, 38 32 M32 52 C26 46, 26 40, 32 38 M12 32 C18 26, 24 26, 26 32" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
      </svg>`
    },
    {
      id: 'ram',
      num: '04',
      name: 'RAM (Random Access Memory)',
      shortName: 'RAM DDR5',
      category: 'Memori Kerja Sementara',
      model: '32GB (2x16GB) DDR5-6000MHz RGB Dual-Channel',
      wattage: 12,
      icon: '⚡',
      audioFile: 'assets/audio/vo_ram.mp3',
      voiceOverText: 'RAM adalah memori penyimpanan sementara berkecepatan sangat tinggi yang menyimpan data aplikasi yang sedang berjalan. Saat komputer dimatikan, data di dalam RAM akan dikosongkan.',
      description: 'Random Access Memory (RAM) menyimpan data dan instruksi program yang sedang aktif digunakan oleh CPU. Kapasitas dan kecepatan RAM sangat menentukan kelancaran multitasking dan rendering.',
      howItWorks: 'Bersifat volatile (data hilang saat listrik mati), namun memiliki kecepatan baca-tulis puluhan gigabyte per detik agar CPU tidak perlu menunggu data dari penyimpanan SSD.',
      installTip: 'Jika memasang 2 keping RAM (Dual-Channel), pasang pada slot ke-2 dan ke-4 dari arah CPU (biasanya dinamai slot A2 dan B2). Tekan hingga terdengar bunyi klik pengunci!',
      specs: [
        { label: 'Kapasitas', val: '32 GB (2 x 16 GB Kit)' },
        { label: 'Tipe & Kecepatan', val: 'DDR5 6000 MT/s' },
        { label: 'Konfigurasi', val: 'Dual-Channel (Slot A2 & B2)' },
        { label: 'Voltase', val: '1.35V XMP / EXPO' }
      ],
      svg: `<svg viewBox="0 0 64 64" width="54" height="54" fill="none">
        <rect x="8" y="20" width="48" height="22" rx="2" fill="#0f172a" stroke="#a855f7" stroke-width="2"/>
        <rect x="8" y="16" width="48" height="5" rx="1" fill="#00f0ff"/>
        <line x1="14" y1="42" x2="50" y2="42" stroke="#f59e0b" stroke-width="3" stroke-dasharray="3 2"/>
      </svg>`
    },
    {
      id: 'ssd',
      num: '05',
      name: 'Storage SSD NVMe M.2',
      shortName: 'SSD NVMe M.2',
      category: 'Penyimpanan Data Permanen',
      model: '1TB PCIe 4.0 NVMe M.2 (7000 MB/s)',
      wattage: 8,
      icon: '💾',
      audioFile: 'assets/audio/vo_ssd.mp3',
      voiceOverText: 'SSD NVMe M dot 2 adalah media penyimpanan data permanen generasi modern yang bekerja langsung melalui jalur PCI Express, membuat proses booting sistem operasi dan loading aplikasi berjalan dalam hitungan detik.',
      description: 'Solid State Drive (SSD) NVMe M.2 menyimpan Sistem Operasi (Windows/Linux), software, dan file proyek secara permanen (non-volatile) menggunakan chip NAND Flash tanpa piringan berputar.',
      howItWorks: 'Terpasang langsung di permukaan motherboard pada slot M.2 dan menggunakan jalur PCIe x4 sehingga kecepatannya hingga 12 kali lebih cepat dibanding SSD SATA biasa.',
      installTip: 'Masukkan ujung kuningan SSD M.2 ke slot dengan sudut miring sekitar 30 derajat, lalu tekan perlahan ke bawah dan kencangkan dengan baut kecil standoff M.2.',
      specs: [
        { label: 'Kapasitas', val: '1 TB 3D NAND Flash' },
        { label: 'Antarmuka', val: 'PCIe Gen 4.0 x4 NVMe' },
        { label: 'Kecepatan Baca', val: 'Hingga 7.000 MB/detik' },
        { label: 'Ukuran Fisik', val: 'M.2 2280 (22 x 80 mm)' }
      ],
      svg: `<svg viewBox="0 0 64 64" width="54" height="54" fill="none">
        <rect x="10" y="24" width="44" height="16" rx="2" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <rect x="18" y="27" width="12" height="10" fill="#1e293b"/>
        <rect x="34" y="27" width="12" height="10" fill="#1e293b"/>
        <line x1="10" y1="27" x2="10" y2="37" stroke="#f59e0b" stroke-width="3"/>
      </svg>`
    },
    {
      id: 'gpu',
      num: '06',
      name: 'Kartu Grafis (GPU / VGA Card)',
      shortName: 'GPU (VGA Card)',
      category: 'Pemrosesan Grafis 3D & Video',
      model: 'GeForce RTX 4070 Super 12GB GDDR6X',
      wattage: 220,
      icon: '🎮',
      audioFile: 'assets/audio/vo_gpu.mp3',
      voiceOverText: 'Kartu grafis atau GPU bertugas mengolah visual dua dimensi maupun tiga dimensi, merender objek Three JS, mengakselerasi pengeditan video multimedia, dan menjalankan komputasi kecerdasan buatan.',
      description: 'Graphics Processing Unit (GPU) memiliki ribuan inti paralel yang dirancang khusus untuk menghitung piksel, pencahayaan 3D (Ray Tracing), rendering video, dan grafis ke layar monitor.',
      howItWorks: 'Memiliki memori independen berkecepatan tinggi (VRAM GDDR6X) dan terpasang pada slot PCIe x16 teratas agar mendapat jalur bandwidth langsung ke CPU.',
      installTip: 'Buka pengait di ujung slot PCIe x16, pasang kartu grafis hingga lurus dan terkunci, kencangkan baut ke bracket casing, dan WAJIB memasang kabel daya PCIe dari PSU!',
      specs: [
        { label: 'Memori VRAM', val: '12 GB GDDR6X (192-bit)' },
        { label: 'Slot Koneksi', val: 'PCIe 4.0 x16' },
        { label: 'Output Layar', val: '3x DisplayPort 1.4a, 1x HDMI 2.1' },
        { label: 'Konsumsi Daya', val: '220 Watt (16-Pin / 2x 8-Pin)' }
      ],
      svg: `<svg viewBox="0 0 64 64" width="54" height="54" fill="none">
        <rect x="6" y="18" width="52" height="26" rx="4" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
        <circle cx="22" cy="31" r="9" stroke="#00f0ff" stroke-width="1.8"/>
        <circle cx="42" cy="31" r="9" stroke="#00f0ff" stroke-width="1.8"/>
        <rect x="14" y="44" width="24" height="4" fill="#f59e0b"/>
      </svg>`
    },
    {
      id: 'psu',
      num: '07',
      name: 'Power Supply Unit (PSU)',
      shortName: 'Power Supply (PSU)',
      category: 'Suplai & Konversi Daya Listrik',
      model: '750W 80+ Gold Fully Modular ATX 3.0',
      wattage: 0,
      icon: '🔋',
      audioFile: 'assets/audio/vo_psu.mp3',
      voiceOverText: 'Power Supply Unit atau PSU berfungsi mengubah arus listrik bolak-balik dari stopkontak menjadi arus searah yang stabil dengan voltase yang tepat untuk menyuplai seluruh komponen komputer.',
      description: 'PSU bukanlah penghasil listrik, melainkan konverter daya dari arus AC (220V rumah) menjadi arus DC (12V, 5V, dan 3.3V) yang bersih dan stabil disertai proteksi lonjakan arus.',
      howItWorks: 'Menyalurkan daya melalui kabel utama 24-pin ATX ke motherboard, kabel 8-pin EPS ke CPU, dan kabel PCIe ke kartu grafis. Sertifikasi 80+ Gold menjamin efisiensi daya di atas 90%.',
      installTip: 'Jangan pernah menghemat anggaran pada PSU tanpa sertifikasi jelas! Pastikan saklar belakang PSU berada di posisi OFF (O) selama merakit, dan baru ubah ke ON (I) saat siap diuji.',
      specs: [
        { label: 'Kapasitas Daya', val: '750 Watt Continuous' },
        { label: 'Sertifikasi Efisiensi', val: '80 PLUS Gold (90% Efisiensi)' },
        { label: 'Tipe Kabel', val: 'Fully Modular Flat Cables' },
        { label: 'Proteksi', val: 'OVP, UVP, OCP, OPP, SCP' }
      ],
      svg: `<svg viewBox="0 0 64 64" width="54" height="54" fill="none">
        <rect x="10" y="16" width="44" height="32" rx="4" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
        <path d="M34 22 L25 34 H33 L30 42 L39 30 H31 Z" fill="#f59e0b"/>
      </svg>`
    },
    {
      id: 'case',
      num: '08',
      name: 'Casing ATX & Airflow Fan',
      shortName: 'Casing & Airflow',
      category: 'Pelindung & Sirkulasi Udara',
      model: 'Panoramic Tempered Glass Mid-Tower ATX',
      wattage: 15,
      icon: '🖥️',
      audioFile: 'assets/audio/vo_case.mp3',
      voiceOverText: 'Casing komputer berfungsi sebagai rangka pelindung seluruh komponen dari debu dan benturan fisik, sekaligus mengatur jalur sirkulasi udara dingin masuk dan udara panas keluar.',
      description: 'Casing menjaga komponen tetap rapi, melindungi dari gangguan mekanis, menyediakan tombol Power/Port USB depan (Front Panel), serta mengatur manajemen kabel dan aliran udara (Airflow).',
      howItWorks: 'Kipas depan/samping menghisap udara sejuk dari luar (Intake), melewati komponen panas di dalam, lalu dibuang keluar oleh kipas belakang dan atas (Exhaust).',
      installTip: 'Hubungkan kabel kecil Front Panel (Power SW, Reset SW, Power LED, HDD LED) ke pin JFP1 di pojok kanan bawah motherboard sesuai buku panduan.',
      specs: [
        { label: 'Tipe Casing', val: 'Mid-Tower Dual-Chamber ATX' },
        { label: 'Panel Samping', val: '4mm Hinged Tempered Glass' },
        { label: 'Sistem Airflow', val: 'Intake Depan & Exhaust Belakang' },
        { label: 'Front I/O', val: 'USB 3.2 Type-C, 2x USB-A, Audio' }
      ],
      svg: `<svg viewBox="0 0 64 64" width="54" height="54" fill="none">
        <rect x="14" y="8" width="36" height="48" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="18" y="13" width="28" height="38" rx="2" fill="#1e293b" stroke="#00f0ff" stroke-width="1.2"/>
      </svg>`
    }
  ],

  assemblySteps: [
    {
      step: 1,
      partId: 'mobo',
      title: 'Pasang Motherboard ke Casing',
      instruction: 'Letakkan Motherboard ATX di atas baut standoff di dalam Casing dan kencangkan.',
      successMsg: 'Motherboard terpasang kokoh di dalam Casing!'
    },
    {
      step: 2,
      partId: 'cpu',
      title: 'Pasang Processor (CPU) ke Socket',
      instruction: 'Buka tuas Socket CPU, sejajarkan tanda segitiga emas Processor, lalu kunci kembali.',
      successMsg: 'Processor berhasil duduk sempurna di Socket CPU!'
    },
    {
      step: 3,
      partId: 'ssd',
      title: 'Pasang Storage SSD NVMe M.2',
      instruction: 'Masukkan SSD NVMe ke slot M.2 di permukaan Motherboard sebelum tertutup komponen besar.',
      successMsg: 'SSD NVMe M.2 terpasang di jalur PCIe 4.0!'
    },
    {
      step: 4,
      partId: 'ram',
      title: 'Pasang 2 Keping RAM DDR5 (Dual-Channel)',
      instruction: 'Tekan kedua keping RAM DDR5 ke slot A2 & B2 hingga pengait mengunci otomatis.',
      successMsg: 'Memori RAM 32GB Dual-Channel terkunci dengan bunyi klik!'
    },
    {
      step: 5,
      partId: 'cooler',
      title: 'Oles Thermal Paste & Pasang CPU Cooler',
      instruction: 'Pasang CPU Cooler ARGB di atas Processor dan hubungkan kabel kipas ke CPU_FAN.',
      successMsg: 'CPU Cooler terpasang! Suhu prosesor kini terjaga aman.'
    },
    {
      step: 6,
      partId: 'gpu',
      title: 'Pasang Kartu Grafis (GPU RTX)',
      instruction: 'Tancapkan GPU ke slot PCIe x16 utama hingga mengunci pada bracket belakang.',
      successMsg: 'Kartu Grafis RTX terpasang gagah di slot PCIe x16!'
    },
    {
      step: 7,
      partId: 'psu',
      title: 'Pasang Power Supply (PSU) & Kabel Daya',
      instruction: 'Pasang PSU 750W di ruang bawah casing dan hubungkan kabel 24-pin, CPU 8-pin & PCIe.',
      successMsg: 'Seluruh komponen telah terpasang! Klik "NYALAKAN PC (POWER ON)" untuk uji coba.'
    }
  ],

  psuCalculator: {
    presets: {
      office: { name: 'PC Kuliah & Office Hemat Daya', cpu: 65, gpu: 0, ram: 8, storage: 8, cooling: 10 },
      multimedia: { name: 'PC Multimedia & Video Editing', cpu: 125, gpu: 220, ram: 15, storage: 16, cooling: 25 },
      gaming3d: { name: 'PC Workstation 3D & Gaming Berat', cpu: 170, gpu: 320, ram: 20, storage: 24, cooling: 40 }
    },
    cpus: [
      { label: 'Core i3 / Ryzen 3 (Entry - 65W)', watt: 65 },
      { label: 'Core i5 / Ryzen 5 (Mid-Range - 105W)', watt: 105 },
      { label: 'Core i7 / Ryzen 7 (Multimedia - 125W)', watt: 125 },
      { label: 'Core i9 / Ryzen 9 (Workstation - 170W)', watt: 170 }
    ],
    gpus: [
      { label: 'Integrated Graphics / Tanpa VGA Tambahan (0W)', watt: 0 },
      { label: 'RTX 4060 / RX 7600 (115W)', watt: 115 },
      { label: 'RTX 4070 Super / RX 7800 XT (220W)', watt: 220 },
      { label: 'RTX 4080 Super / RTX 4090 (320W)', watt: 320 }
    ],
    rams: [
      { label: '16GB (2x8GB) DDR4/DDR5 (8W)', watt: 8 },
      { label: '32GB (2x16GB) DDR5 RGB (15W)', watt: 15 },
      { label: '64GB (4x16GB) DDR5 Workstation (20W)', watt: 20 }
    ],
    storages: [
      { label: '1x SSD NVMe M.2 (8W)', watt: 8 },
      { label: '2x SSD NVMe + 1x HDD SATA (16W)', watt: 16 },
      { label: '3x SSD NVMe + 2x HDD RAID (24W)', watt: 24 }
    ],
    coolings: [
      { label: 'Air Cooler Standar + 2 Kipas Casing (10W)', watt: 10 },
      { label: 'Tower ARGB Cooler + 4 Kipas Casing (25W)', watt: 25 },
      { label: 'Liquid Cooler AIO 360mm + 6 Kipas RGB (40W)', watt: 40 }
    ]
  },

  biosBeepCodes: [
    {
      id: 'post_ok',
      name: '1x Beep Pendek (POST Normal)',
      codePattern: '• (1 Beep Pendek)',
      status: 'NORMAL',
      color: '#10b981',
      audioFile: 'assets/audio/beep_normal.mp3',
      description: 'Power-On Self-Test (POST) berhasil tanpa kendala. Seluruh komponen perangkat keras terdeteksi dengan baik dan sistem siap masuk ke Sistem Operasi.',
      solution: 'Tidak ada masalah. PC berjalan normal.',
      pattern: [
        { freq: 1000, duration: 0.16, gap: 0.1 }
      ]
    },
    {
      id: 'ram_error',
      name: 'Beep Panjang Berulang-ulang (RAM Error)',
      codePattern: '━━  ━━  ━━ (3x Beep Panjang)',
      status: 'ERROR MEMORI',
      color: '#f59e0b',
      audioFile: 'assets/audio/beep_ram_error.mp3',
      description: 'Motherboard gagal mendeteksi modul RAM. Biasanya terjadi karena keping RAM belum ditekan sampai berbunyi klik atau pin kuningan RAM kotor.',
      solution: 'Matikan PC, cabut keping RAM, bersihkan pin emas dengan penghapus lembut, lalu pasang kembali di slot A2/B2 hingga pengait mengunci rapat.',
      pattern: [
        { freq: 800, duration: 0.55, gap: 0.25 },
        { freq: 800, duration: 0.55, gap: 0.25 },
        { freq: 800, duration: 0.55, gap: 0.1 }
      ]
    },
    {
      id: 'vga_error',
      name: '1x Beep Panjang + 3x Beep Pendek (GPU / VGA Error)',
      codePattern: '━━  • • • (1 Panjang, 3 Pendek)',
      status: 'ERROR GRAFIS',
      color: '#f43f5e',
      audioFile: 'assets/audio/beep_vga_error.mp3',
      description: 'Sistem tidak dapat menginisialisasi Kartu Grafis (GPU). Sering terjadi akibat GPU kurang rapat di slot PCIe x16 atau kabel power PCIe dari PSU lupa dipasang.',
      solution: 'Pastikan kartu grafis terpasang lurus di slot PCIe x16 dan periksa apakah kabel power tambahan 8-pin/16-pin dari PSU sudah tertancap kencang.',
      pattern: [
        { freq: 850, duration: 0.6, gap: 0.22 },
        { freq: 850, duration: 0.15, gap: 0.12 },
        { freq: 850, duration: 0.15, gap: 0.12 },
        { freq: 850, duration: 0.15, gap: 0.1 }
      ]
    },
    {
      id: 'cpu_overheat',
      name: 'Beep Sirene Dua Nada Beruntun (CPU Overheat / Fan Error)',
      codePattern: '⇅ ⇅ ⇅ ⇅ (Sirene Tinggi-Rendah)',
      status: 'BAHAYA SUHU',
      color: '#ef4444',
      audioFile: 'assets/audio/beep_cpu_overheat.mp3',
      description: 'Suhu Processor melewati batas aman (>95°C) atau kipas CPU Cooler tidak berputar. BIOS membunyikan alarm darurat untuk mencegah kerusakan prosesor.',
      solution: 'Cek apakah kabel CPU Cooler sudah menancap di pin CPU_FAN, pastikan thermal paste sudah dioles, dan cek apakah plastik pelindung bawah heatsink sudah dilepas.',
      pattern: [
        { freq: 1200, duration: 0.22, gap: 0.02 },
        { freq: 720, duration: 0.22, gap: 0.02 },
        { freq: 1200, duration: 0.22, gap: 0.02 },
        { freq: 720, duration: 0.22, gap: 0.02 },
        { freq: 1200, duration: 0.22, gap: 0.02 },
        { freq: 720, duration: 0.22, gap: 0.1 }
      ]
    },
    {
      id: 'psu_short',
      name: 'Beep Cepat Terus-Menerus (Masalah Daya / PSU)',
      codePattern: '• • • • • • • • (Beep Cepat Beruntun)',
      status: 'ERROR DAYA',
      color: '#a855f7',
      audioFile: 'assets/audio/beep_power_error.mp3',
      description: 'Tegangan listrik dari Power Supply tidak stabil atau konektor 24-pin ATX / 8-pin CPU belum terpasang sempurna.',
      solution: 'Periksa kekencangan konektor kabel 24-pin ATX dan 8-pin CPU pada motherboard, serta pastikan kapasitas Watt PSU mencukupi kebutuhan komponen.',
      pattern: [
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 }
      ]
    }
  ],

  videoChapters: [
    {
      id: 0,
      title: 'Bab 1: Persiapan & Pemasangan CPU ke Socket',
      duration: '00:00 - 00:45',
      summary: 'Cara membuka pengait socket motherboard, menyamakan tanda segitiga emas pada sudut CPU, dan mengunci prosesor tanpa merusak pin.'
    },
    {
      id: 1,
      title: 'Bab 2: Teknik Mengoles Thermal Paste & CPU Cooler',
      duration: '00:45 - 01:30',
      summary: 'Takaran ideal thermal paste (metode titik kacang polong), melepas stiker pelindung heatsink, dan menghubungkan kabel 4-pin ke CPU_FAN.'
    },
    {
      id: 3,
      title: 'Bab 3: Pemasangan RAM Dual-Channel & SSD NVMe',
      duration: '01:30 - 02:15',
      summary: 'Memilih slot RAM A2 & B2 untuk mengaktifkan bandwidth Dual-Channel serta memasang SSD M.2 dengan sudut 30 derajat.'
    },
    {
      id: 4,
      title: 'Bab 4: Instalasi GPU RTX, Manajemen Kabel PSU & First Boot',
      duration: '02:15 - 03:00',
      summary: 'Memasang kartu grafis di slot PCIe x16, menyambungkan kabel 24-pin ATX, 8-pin EPS, dan PCIe Power, hingga pengujian nyala pertama (POST).'
    }
  ],

  quizQuestions: [
    {
      id: 1,
      type: 'TEXT',
      question: 'Komponen manakah yang berfungsi sebagai papan sirkuit utama tempat seluruh perangkat keras komputer saling terhubung dan berkomunikasi?',
      options: [
        'Power Supply Unit (PSU)',
        'Motherboard (Papan Induk)',
        'Random Access Memory (RAM)',
        'Solid State Drive (SSD)'
      ],
      answer: 1,
      explanation: 'Motherboard adalah papan sirkuit cetak (PCB) utama yang menyediakan socket CPU, slot RAM, slot PCIe, dan jalur komunikasi antar komponen.'
    },
    {
      id: 2,
      type: 'AUDIO_BEEP',
      beepId: 'vga_error',
      question: '[SOAL AUDIO] Klik tombol "Putar Bunyi BIOS" di bawah! Jika saat dinyalakan PC mengeluarkan 1 Beep Panjang diikuti 3 Beep Pendek, komponen apa yang mengalami kendala?',
      options: [
        'Kartu Grafis (GPU / VGA Card) belum terbaca atau kurang daya',
        'Sistem berhasil booting dengan normal (POST Sukses)',
        'Kapasitas penyimpanan SSD sudah penuh',
        'Baterai CMOS pada motherboard habis'
      ],
      answer: 0,
      explanation: 'Kode 1 Beep Panjang + 3 Beep Pendek pada BIOS menandakan kegagalan inisialisasi Kartu Grafis (VGA/GPU). Periksa pemasangan di slot PCIe x16 dan kabel powernya.'
    },
    {
      id: 3,
      type: 'TEXT',
      question: 'Apa yang harus diperhatikan saat meletakkan Processor (CPU) ke dalam socket pada Motherboard agar pin tidak bengkok?',
      options: [
        'Menekan bagian tengah CPU sekuat tenaga sebelum menutup tuas',
        'Mengoleskan thermal paste di bagian bawah pin emas prosesor',
        'Menyejajarkan tanda segitiga emas di sudut CPU dengan tanda pada sudut socket',
        'Memutar prosesor 90 derajat searah jarum jam saat dimasukkan'
      ],
      answer: 2,
      explanation: 'Setiap CPU dan socket motherboard memiliki penanda segitiga di salah satu sudutnya (Zero Insertion Force). Jika sudah sejajar, CPU akan masuk tanpa perlu ditekan paksa.'
    },
    {
      id: 4,
      type: 'AUDIO_BEEP',
      beepId: 'ram_error',
      question: '[SOAL AUDIO] Dengarkan kode suara BIOS berikut! Bunyi beep panjang yang berulang-ulang menandakan adanya masalah pada...',
      options: [
        'Kipas casing berputar terlalu lambat',
        'Memori RAM belum terpasang rapat atau tidak terdeteksi',
        'Monitor belum dicolokkan ke stopkontak',
        'Kabel LAN internet terputus'
      ],
      answer: 1,
      explanation: 'Bunyi beep panjang berulang-ulang adalah indikasi klasik bahwa modul RAM tidak terbaca oleh motherboard. Pastikan RAM ditekan hingga pengaitnya berbunyi klik.'
    },
    {
      id: 5,
      type: 'TEXT',
      question: 'Jika kita ingin memasang 2 keping RAM pada motherboard yang memiliki 4 slot agar fitur Dual-Channel aktif optimal, kombinasi slot manakah yang umumnya digunakan?',
      options: [
        'Slot 1 dan Slot 2 bersebelahan',
        'Slot 2 dan Slot 4 (A2 dan B2) dari arah CPU',
        'Slot 3 dan Slot 4 saja',
        'Cukup pasang 1 keping saja di slot mana pun'
      ],
      answer: 1,
      explanation: 'Pada mayoritas motherboard modern 4-slot, pemasangan 2 keping RAM direkomendasikan pada slot ke-2 (A2) dan ke-4 (B2) untuk mengaktifkan jalur Dual-Channel secara optimal.'
    },
    {
      id: 6,
      type: 'TEXT',
      question: 'Mengapa kita wajib mengoleskan Thermal Paste dan melepas stiker plastik di bawah heatsink CPU Cooler saat merakit PC?',
      options: [
        'Agar CPU Cooler menempel permanen seperti lem super',
        'Untuk menghantarkan panas dari permukaan CPU ke heatsink dan mencegah CPU Overheating',
        'Untuk menambah kapasitas memori cache pada prosesor',
        'Agar lampu RGB pada kipas menyala lebih terang'
      ],
      answer: 1,
      explanation: 'Thermal paste mengisi celah udara mikroskopis antara CPU dan cooler agar panas terserap maksimal. Jika plastik pelindung lupa dilepas, panas akan terperangkap dan memicu overheat.'
    },
    {
      id: 7,
      type: 'TEXT',
      question: 'Manakah pernyataan yang BENAR mengenai perbedaan antara RAM dan SSD NVMe?',
      options: [
        'RAM menyimpan data secara permanen, sedangkan SSD kehilangan data saat PC mati',
        'RAM bersifat volatile (sementara untuk aplikasi aktif), sedangkan SSD bersifat non-volatile (menyimpan OS & file secara permanen)',
        'SSD dipasang di slot DIMM, sedangkan RAM dipasang di slot M.2',
        'Keduanya memiliki fungsi dan kecepatan yang sama persis'
      ],
      answer: 1,
      explanation: 'RAM adalah memori kerja sementara (volatile) berkecepatan ekstra tinggi, sedangkan SSD adalah media penyimpanan permanen (non-volatile) untuk Sistem Operasi dan file.'
    },
    {
      id: 8,
      type: 'AUDIO_BEEP',
      beepId: 'post_ok',
      question: '[SOAL AUDIO] Putar suara BIOS berikut! Apa arti dari 1 bunyi beep pendek saat komputer pertama kali dinyalakan?',
      options: [
        'Terjadi korsleting pada Power Supply',
        'Prosesor mengalami kepanasan berlebih (Overheat)',
        'Power-On Self-Test (POST) sukses dan semua hardware normal',
        'Harddisk mengalami kerusakan fisik'
      ],
      answer: 2,
      explanation: 'Satu bunyi beep pendek menandakan bahwa pemeriksaan komponen awal (POST) berjalan lancar dan komputer siap memuat sistem operasi.'
    },
    {
      id: 9,
      type: 'TEXT',
      question: 'Sebuah PC Multimedia menggunakan CPU (125W), GPU RTX (220W), serta Motherboard, RAM, SSD, dan Kipas dengan total beban sekitar 425 Watt. Berapa kapasitas Power Supply (PSU) yang paling ideal dan aman digunakan?',
      options: [
        'PSU 300W Tanpa Sertifikasi',
        'PSU 400W (Pas-pasan di bawah beban puncak)',
        'PSU 650W - 750W 80+ Gold (Memberi ruang aman / headroom efisiensi)',
        'Tidak memerlukan PSU karena listrik langsung masuk ke motherboard'
      ],
      answer: 2,
      explanation: 'Idealnya kapasitas PSU memiliki ruang aman (headroom) sekitar 30%-40% di atas total beban puncak sistem agar PSU bekerja di titik efisiensi terbaik dan tahan terhadap lonjakan daya GPU.'
    },
    {
      id: 10,
      type: 'TEXT',
      question: 'Pada slot manakah Kartu Grafis (GPU / VGA Card) dipasang pada Motherboard agar memperoleh jalur data (bandwidth) paling maksimal?',
      options: [
        'Slot PCIe x16 paling atas (terdekat dengan CPU)',
        'Slot SATA 6Gbps di pojok motherboard',
        'Slot DIMM DDR5',
        'Header USB 3.2 Front Panel'
      ],
      answer: 0,
      explanation: 'Slot PCIe x16 paling atas terhubung langsung dengan jalur PCIe dari CPU tanpa perantara chipset tambahan, sehingga memberikan performa grafis paling maksimal.'
    }
  ]
};
