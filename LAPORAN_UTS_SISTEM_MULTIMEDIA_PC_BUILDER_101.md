# LAPORAN UJIAN TENGAH SEMESTER (UTS) SISTEM MULTIMEDIA
## MEDIA PEMBELAJARAN MULTIMEDIA INTERAKTIF BERBASIS WEBSITE UNTUK PENGENALAN DAN SIMULASI PERAKITAN KOMPUTER 3D (PC BUILDER 101)

**Program Studi:** S1 Ilmu Komputer  
**Fakultas:** Teknik  
**Perguruan Tinggi:** Universitas Bumigora Mataram  
**Tahun Akademik:** 2026  
**Dosen Pengampu:** Ibu Melati Rosanensi, M.Kom.  
**Alamat Demo Website:** [https://pcbuilder-opal.vercel.app](https://pcbuilder-opal.vercel.app)  
**Repositori GitHub:** [https://github.com/Fanndev/3D-PC-Builder](https://github.com/Fanndev/3D-PC-Builder)

---

### DAFTAR ANGGOTA KELOMPOK PENYUSUN:

| No | Nama Mahasiswa | NIM |
| :---: | :--- | :--- |
| 1 | Muh. Farid Hakim | `2301010211` |
| 2 | Mauulana Habib Al Ansyori | `2301010197` |
| 3 | Mohamad Irfan fadhlurrahman | `2301010162` |
| 4 | Mohammad Syahiddin Danuwarsi Abdussamas | `2301010174` |
| 5 | Arya Ramadhani | `2301010208` |
| 6 | Nabila Umardi | `2301010165` |
| 7 | Muhammad Ferris Naufal | `2301010174` |
| 8 | Muhammad Qodri | `2301010172` |
| 9 | Mu'taman Abid | `2301010189` |
| 10 | Reno Kurniawan | `2301010175` |

---

## KATA PENGANTAR

Puji syukur penulis panjatkan ke hadirat Tuhan Yang Maha Esa atas segala rahmat, taufik, dan karunia-Nya, sehingga penulis dapat menyelesaikan laporan yang berjudul **"Pengembangan Website PC Builder 101 sebagai Media Pembelajaran Multimedia Interaktif 3D Pengenalan dan Perakitan Hardware Komputer"** ini dengan baik dan tepat waktu. Laporan ini disusun sebagai bentuk pertanggungjawaban akademis atas proyek pengembangan website media pembelajaran multimedia yang dikerjakan guna memenuhi Ujian Tengah Semester (UTS) pada mata kuliah Sistem Multimedia.

Laporan ini membahas secara komprehensif proses perancangan dan perekayasaan website PC Builder 101, yaitu media pembelajaran digital berbasis web yang dirancang khusus untuk memfasilitasi mahasiswa maupun siswa dalam memahami arsitektur, fungsi, spesifikasi, dan prosedur pemasangan komponen fisik perangkat keras komputer secara aman melalui visualisasi 3D real-time WebGL (Three.js). Pembahasan di dalam dokumen ini mencakup landasan teori multimedia, metodologi pengembangan Multimedia Development Life Cycle (MDLC) yang mencakup 6 tahap, implementasi 5 unsur multimedia (teks, grafis 3D, audio, video tutorial, serta animasi), hingga analisis hasil pengujian fungsionalitas dan antarmuka sistem.

Penulis menyampaikan rasa terima kasih dan apresiasi yang setinggi-tingginya kepada **Ibu Melati Rosanensi, M.Kom.**, selaku dosen pengampu mata kuliah Sistem Multimedia, atas segala bimbingan, arahan akademis, dan masukan berharga yang diberikan selama proses pengerjaan proyek dan penyusunan laporan ini. Ucapan terima kasih juga penulis haturkan kepada keluarga dan rekan-rekan mahasiswa yang telah memberikan dukungan moral, kerja sama tim, dan motivasi berkesinambungan sehingga proyek ini dapat terwujud secara optimal.

Penulis menyadari sepenuhnya bahwa laporan dan aplikasi website yang dikembangkan ini masih memiliki ruang untuk perbaikan dan penyempurnaan lebih lanjut. Oleh karena itu, penulis sangat mengharapkan saran, tanggapan, dan kritik yang membangun demi kemajuan di masa mendatang. Semoga laporan ini dapat memberikan manfaat nyata, memperluas wawasan keilmuan, serta menjadi referensi bermanfaat bagi pengembangan media pembelajaran multimedia interaktif di lingkungan perguruan tinggi.

Mataram, 19 November 2026  
**Tim Penulis**

---

## DAFTAR ISI

- **KATA PENGANTAR** (ii)
- **DAFTAR ISI** (iii)
- **DAFTAR TABEL** (v)
- **DAFTAR GAMBAR** (vi)
- **BAB I PENDAHULUAN** (1)
  - 1.1 Latar Belakang (1)
  - 1.2 Rumusan Masalah (3)
  - 1.3 Tujuan Pengembangan (3)
  - 1.4 Manfaat Pengembangan (4)
  - 1.5 Batasan Masalah (4)
- **BAB II PEMBAHASAN** (6)
  - 2.1 Multimedia (6)
  - 2.2 Media Pembelajaran (7)
  - 2.3 Website (7)
  - 2.4 Teknologi Pengembangan Website (8)
    - 2.4.1 HTML5 (8)
    - 2.4.2 CSS3 & Responsive Design (9)
    - 2.4.3 JavaScript (ES6+) (9)
    - 2.4.4 WebGL dan Three.js (10)
    - 2.4.5 Web Audio API & Audio Synthesizer (10)
  - 2.5 Unsur Multimedia dalam Pembelajaran (11)
    - 2.5.1 Teks (11)
    - 2.5.2 Gambar dan Model Grafis 3D (12)
    - 2.5.3 Audio (Voice-Over & BIOS Beep Codes) (12)
    - 2.5.4 Video (Video Praktik Perakitan HD) (13)
    - 2.5.5 Animasi (Exploded View, Fan Rotation, Assembly) (13)
  - 2.6 Multimedia Interaktif (14)
  - 2.7 Fitur Pendukung Pembelajaran PC Builder 101 (15)
    - 2.7.1 Eksplorasi Hardware 3D Interaktif (15)
    - 2.7.2 Mode Bedah Komponen (Exploded View) (15)
    - 2.7.3 Simulasi Perakitan Komputer (PC Assembly Simulator) (16)
    - 2.7.4 Kalkulator Kebutuhan Daya (PSU Calculator) (16)
    - 2.7.5 Modul Video Tutorial Praktik Perakitan (17)
    - 2.7.6 Simulator Suara Diagnosa BIOS (Beep Codes & Oscilloscope) (17)
    - 2.7.7 Kuis Evaluasi Pemahaman Interaktif (18)
    - 2.7.8 Komparasi Form Factor Motherboard (18)
  - 2.8 User Interface (UI) dan User Experience (UX) (19)
  - 2.9 Pengujian Website (20)
- **BAB III METODE PENGEMBANGAN** (21)
  - 3.1 Metode Pengembangan (MDLC) (21)
  - 3.2 Tahapan Pengembangan (21)
    - 3.2.1 Concept (Konsep) (22)
    - 3.2.2 Design (Perancangan) (22)
    - 3.2.3 Material Collecting (Pengumpulan Bahan) (23)
    - 3.2.4 Assembly (Pembuatan) (23)
    - 3.2.5 Testing (Pengujian) (24)
    - 3.2.6 Distribution (Distribusi) (24)
  - 3.3 Perangkat yang Digunakan (25)
    - 3.3.1 Perangkat Keras (25)
    - 3.3.2 Perangkat Lunak (25)
  - 3.4 Perancangan Website (26)
    - 3.4.1 Struktur Navigasi (26)
    - 3.4.2 Perancangan Antarmuka (27)
  - 3.5 Implementasi Website dan Multimedia (29)
    - 3.5.1 Implementasi Halaman Utama dan Viewport 3D (29)
    - 3.5.2 Implementasi Fitur Eksplorasi Hardware dan Mode Bedah (30)
    - 3.5.3 Implementasi Unsur Multimedia (31)
    - 3.5.4 Implementasi Simulasi Perakitan Komputer 3D (32)
    - 3.5.5 Implementasi Modul Video Tutorial dan Animasi 2D (33)
    - 3.5.6 Implementasi Simulator Audio BIOS Beep Code & Oscilloscope (33)
    - 3.5.7 Implementasi Kuis Evaluasi dan Kalkulator PSU (34)
  - 3.6 Pengujian Website (35)
- **BAB IV HASIL DAN PEMBAHASAN** (36)
  - 4.1 Gambaran Umum Hasil Pengembangan (36)
  - 4.2 Hasil Implementasi Website (38)
  - 4.3 Hasil Pengujian Website (45)
  - 4.4 Pembahasan (48)
- **BAB V PENUTUP** (54)
  - 5.1 Kesimpulan (54)
  - 5.2 Saran (55)
- **DAFTAR PUSTAKA** (57)

---

## BAB I PENDAHULUAN

### 1.1 Latar Belakang
Perkembangan pesat teknologi informasi dan komputasi di era modern telah mentransformasi berbagai lini kehidupan, terutama dalam bidang pendidikan teknik komputer dan teknologi informasi. Penguasaan terhadap perangkat keras komputer (*computer hardware*) dan kemahiran dalam merakit komputer (*PC assembly*) menjadi fondasi kompetensi yang sangat esensial bagi mahasiswa ilmu komputer, rekayasa perangkat lunak, maupun siswa sekolah kejuruan teknik komputer dan jaringan (TKJ). Pemahaman yang mendalam mengenai letak fisik soket, jenis antarmuka slot ekspansi, sirkulasi termal, serta kompatibilitas daya antar-komponen menentukan keberhasilan perakitan sebuah sistem komputer yang andal dan optimal.

Namun dalam implementasi pembelajaran praktikum perakitan komputer konvensional, terdapat beberapa kendala mendasar yang kerap dihadapi peserta didik maupun institusi pendidikan, antara lain:
1. **Keterbatasan Aksesibilitas dan Biaya Hardware Fisik:** Komponen perangkat keras modern (seperti prosesor soket LGA 1700/AM5, motherboard chipset Z790/B650, memori DDR5, SSD NVMe M.2, dan kartu grafis berdaya tinggi) memiliki nilai ekonomis yang sangat tinggi. Risiko kerusakan fisik akibat kesalahan penanganan pemula (seperti pin soket prosesor bengkok, pelepasan kait RAM yang dipaksakan, atau korsleting akibat listrik statis/ESD) membuat praktikum langsung di laboratorium sering kali dibatasi kuotanya.
2. **Keterbatasan Visualisasi Media 2D Statis:** Buku teks, slide presentasi, atau diagram 2D konvensional tidak mampu memberikan gambaran spasial ruang tiga dimensi yang nyata. Pengguna kesulitan memvisualisasikan orientasi sudut pemasangan heatsink pendingin, peletakan SSD M.2 di balik heatsink pelindung termal, serta jalur sirkulasi udara casing.
3. **Kurangnya Literasi Diagnosa Suara (POST Beep Code):** Pada saat komputer mengalami kegagalan proses booting awal (*Power-On Self-Test / POST*), motherboard memberikan sinyal audio berupa deretan bunyi beep. Banyak peserta didik kesulitan membedakan antara kode beep error memori RAM, kerusakan kartu grafis, maupun masalah pasokan daya tanpa alat peraga interaktif.
4. **Keharusan Pemasangan Perangkat Lunak Khusus:** Banyak aplikasi simulasi 3D yang beredar saat ini mengharuskan pengunduhan dan instalasi aplikasi berkapasitas gigabyte yang membebani perangkat peserta didik dan sulit diakses secara instan.

Berdasarkan permasalahan tersebut, dikembangkan sebuah inovasi media pembelajaran multimedia interaktif berbasis website bernama **PC Builder 101**. Aplikasi ini menghadirkan laboratorium virtual perakitan komputer 3D real-time yang dapat diakses langsung melalui peramban web (*browser*) tanpa instalasi aplikasi tambahan. Dibangun menggunakan teknologi WebGL dan Three.js, PC Builder 101 memodelkan 8 komponen utama komputer secara prosedural dengan material PBR (*Physically Based Rendering*) berkualitas tinggi, menyajikan fitur mode bedah (*Exploded View*), simulasi perakitan 7 langkah terstruktur, video tutorial HD per bab, sintesis suara diagnosa BIOS beep codes dengan osiloskop visual interaktif, kalkulator daya PSU, serta modul kuis evaluasi komprehensif.

### 1.2 Rumusan Masalah
1. Bagaimana merancang dan mengembangkan PC Builder 101 sebagai media pembelajaran multimedia interaktif berbasis website menggunakan Three.js dan WebGL?
2. Bagaimana mengintegrasikan 5 unsur multimedia secara utuh (teks, grafis 3D, audio narasi/synthesizer, video tutorial praktik, dan animasi interaktif) ke dalam platform PC Builder 101?
3. Bagaimana menerapkan fitur interaktif berupa inspeksi 3D 360°, mode bedah (*exploded view*), simulasi perakitan komputer 7 tahap, simulator kode beep BIOS dengan visualisasi gelombang frekuensi, dan kuis evaluasi pemahaman?
4. Bagaimana menyediakan kalkulator kebutuhan daya PSU dan komparasi form factor motherboard untuk mendukung pemahaman teknis pengguna secara mandiri?

### 1.3 Tujuan Pengembangan
1. Mengembangkan media pembelajaran perakitan komputer interaktif berbasis website yang fleksibel, responsif, dan dapat diakses bebas tanpa instalasi software khusus.
2. Mengintegrasikan secara harmonis lima unsur multimedia (teks materi, model grafis 3D real-time, audio voice-over dan efek suara, video tutorial praktik resolusi HD, serta animasi interaktif) untuk memfasilitasi berbagai modalitas gaya belajar.
3. Menyediakan laboratorium virtual 3D yang memungkinkan pengguna memutar sudut pandang bebas (OrbitControls), membedah struktur internal komponen, dan menyimulasikan urutan pemasangan perangkat keras PC secara realistis dan bebas risiko.
4. Mengimplementasikan simulator audio BIOS Beep Code berbasis Web Audio API synthesizer dengan visualisasi osiloskop real-time sebagai media edukasi diagnosa kerusakan perangkat keras.
5. Menyediakan fitur evaluasi pemahaman berupa kuis multimedia interaktif dan alat bantu teknis berupa kalkulator estimasi kebutuhan daya Power Supply (PSU).

### 1.4 Manfaat Pengembangan
1. **Bagi Siswa dan Mahasiswa:** Memperoleh lingkungan belajar virtual yang aman, menarik, dan interaktif untuk mempelajari arsitektur hardware dan urutan perakitan PC tanpa rasa cemas merusakkan komponen berharga mahal.
2. **Bagi Pengajar:** Menjadi media peraga instruksional digital yang dapat diproyeksikan di ruang kelas maupun dibagikan sebagai bahan penugasan praktikum mandiri bagi peserta didik.
3. **Bagi Pengembang:** Mengasah kompetensi dan pengalaman rekayasa perangkat lunak dalam bidang grafika komputer WebGL/Three.js, sintesis audio web, optimasi performa render real-time, dan desain antarmuka modern berstandar industri.
4. **Bagi Pengembangan Media Pembelajaran:** Memberikan tolok ukur implementasi multimedia mutakhir bahwa website modern sanggup menggabungkan simulasi 3D real-time, sintesis audio dinamis, dan video edukatif dalam satu ekosistem terpadu.

### 1.5 Batasan Masalah
1. Produk multimedia berupa website interaktif bernama **PC Builder 101** yang diakses secara daring via peramban web modern.
2. Materi hardware mencakup 8 komponen utama: Motherboard (MSI MPG Z790 Carbon WiFi), CPU (LGA 1700), CPU Cooler (Liquid AIO), RAM DDR5, SSD NVMe M.2, Kartu Grafis (GPU RTX), Catu Daya (PSU ATX), dan Casing Komputer.
3. Seluruh aset 3D dibangun dan dirender secara murni menggunakan pustaka **Three.js (WebGL)** berbasis geometri prosedural, PBR materials, dan kanvas tekstur sirkuit PCB 2D dinamis, bebas ketergantungan file 3D biner eksternal berukuran berat.
4. Unsur multimedia mencakup: teks materi, grafis 3D & SVG, audio suara narasi bahasa Indonesia & simulator beep BIOS, video tutorial praktik perakitan HD 720p, serta animasi transisi dan perakitan.
5. Simulasi perakitan PC 3D mencakup 7 langkah esensial dari instalasi CPU hingga GPU.
6. Modul video tutorial menyajikan materi praktik 4 bab perakitan dengan sulih suara bahasa Indonesia dan alternatif kanvas 2D motion graphic.
7. Distribusi aplikasi melalui platform cloud Vercel dan repositori GitHub.

---

## BAB II PEMBAHASAN

### 2.1 Multimedia
Secara konseptual, multimedia adalah kombinasi terpadu dari berbagai bentuk media (teks, gambar, audio, video, dan animasi) yang diolah dan disajikan melalui media komputer digital. Menurut Mayer (2021) dalam Teori Kognitif Pembelajaran Multimedia (*Cognitive Theory of Multimedia Learning*), manusia menyerap informasi melalui dua saluran terpisah: saluran visual dan saluran verbal/auditori. Penggabungan kata-kata lisan/tulisan dengan representasi visual konkret (seperti model 3D) terbukti secara signifikan melipatgandakan pemahaman konsep teknis dan memperkuat daya ingat jangka panjang peserta didik.

### 2.2 Media Pembelajaran
Media pembelajaran berperan sebagai instrumen mediasi edukatif antara pendidik dan peserta didik. Dalam konteks laboratorium virtual (*virtual lab*), media pembelajaran interaktif memungkinkan siswa melakukan uji coba berulang kali secara mandiri dengan tingkat keterlibatan mental (*active cognitive processing*) yang jauh lebih tinggi dibandingkan membaca buku teks secara pasif.

### 2.3 Website sebagai Platform Pembelajaran
Website menghadirkan keunggulan tanpa tanding dalam hal distribusi konten edukasi:
- **Universal Multi-Device:** Dapat diakses pada laptop, desktop PC, tablet, maupun smartphone.
- **Bebas Hambatan Instalasi (*Zero-Installation*):** Pengguna cukup membuka peramban web (Chrome, Edge, Firefox, Safari) dan memasukkan alamat tautan tanpa unduh berkas installer.
- **Pembaruan Instan:** Segala perbaikan materi atau fitur langsung terbarui secara global saat pengguna menyegarkan halaman.

### 2.4 Teknologi Pengembangan Website
1. **HTML5:** Menyusun kerangka dokumen, kanvas WebGL 3D, pemutar video, serta modal dialog komparasi form factor.
2. **CSS3 & Responsive Design:** Menerapkan estetika *Cyber-Studio Glassmorphism* (`backdrop-filter: blur`, neon glows, transisi halus) dan layout mobile responsif dengan *bottom navigation bar*.
3. **JavaScript (ES6+):** Mengendalikan seluruh logika interaksi, manipulasi 3D Three.js, audio synthesizer, kalkulator PSU, dan sistem kuis evaluasi.
4. **WebGL dan Three.js:** Menghadirkan engine grafika 3D fotorealistik di dalam browser dengan dukungan *PerspectiveCamera*, *OrbitControls*, *MeshStandardMaterial (PBR)*, bayangan lembut *PCFSoftShadowMap*, dan deteksi klik objek 3D *Raycaster*.
5. **Web Audio API:** Mesin suara tingkat tinggi yang mengontrol pemutaran narasi MP3, efek suara interaksi, serta generator gelombang frekuensi kode beep BIOS (*OscillatorNode*) dengan ekstraksi visual osiloskop (*AnalyserNode*).

### 2.5 Unsur Multimedia dalam Pembelajaran
| Unsur Multimedia | Penerapan Nyata di Dalam PC Builder 101 |
| :--- | :--- |
| **1. Teks** | Uraian deskripsi fungsi, spesifikasi teknis, K3 perakitan 8 komponen, tabel komparasi Form Factor ATX, naskah narasi, serta 10 butir soal kuis & pembahasan. |
| **2. Gambar & Model 3D** | Model 3D 8 komponen PC procedural Three.js, tekstur jalur tembaga sirkuit PCB 1024x1024 dinamis, diagram form factor ATX, dan ikon vektor SVG. |
| **3. Audio** | 31 file audio MP3 mencakup voice-over sambutan, voice-over 8 komponen, 7 panduan langkah rakit, 4 narasi bab video, musik latar ambient (BGM), 5 SFX klik, dan generator sintesis kode beep BIOS. |
| **4. Video** | 5 berkas video MP4 HD (1280x720) 30fps tutorial perakitan PC fisik dengan sulih suara bahasa Indonesia (Bab 1 s/d Bab 4 dan Putar Full Video). |
| **5. Animasi** | Mode Bedah 3D (*Exploded View*), rotasi halus kipas pendingin, siklus spektrum lampu ARGB, transisi kamera halus (*Fly-To*), dan animasi penyisipan komponen ke soket motherboard. |

---

## BAB III METODE PENGEMBANGAN

### 3.1 Metode Pengembangan MDLC
Metode yang digunakan adalah **Multimedia Development Life Cycle (MDLC)** menurut Luther-Sutopo, yang terdiri atas 6 tahapan terstruktur:
1. **Concept (Konsep):** Menentukan ide dasar laboratorium virtual 3D perakitan PC berbasis web murni Three.js yang ringan dan edukatif.
2. **Design (Perancangan):** Menyusun struktur navigasi campuran (*composite*), rancangan antarmuka HUD Glassmorphism, naskah storyboard video tutorial, dan skenario perakitan 7 tahap.
3. **Material Collecting (Pengumpulan Bahan):** Menyusun materi hardware, merekam berkas audio suara narasi bahasa Indonesia MP3, menyusun video praktik MP4 HD 720p, mengumpulkan frekuensi kode beep BIOS, serta soal evaluasi.
4. **Assembly (Pembuatan):** Menuliskan kode Three.js prosedural di `scene3d.js`, sistem audio di `audio-engine.js`, alur navigasi dan kuis di `app.js`, data spesifikasi di `data.js`, dan styling di `style.css`.
5. **Testing (Pengujian):** Melakukan pengujian fungsionalitas antarmuka (*Black-Box testing*) di berbagai peramban dan perangkat mobile.
6. **Distribution (Distribusi):** Mempublikasikan aplikasi di cloud hosting Vercel ([https://pcbuilder-opal.vercel.app](https://pcbuilder-opal.vercel.app)) dan repositori GitHub ([https://github.com/Fanndev/3D-PC-Builder](https://github.com/Fanndev/3D-PC-Builder)).

---

## BAB IV HASIL DAN PEMBAHASAN

### 4.1 Hasil Pengujian Sistem (Black-Box Testing)

| No | Fitur yang Diuji | Hasil | Keterangan Evaluasi |
| :---: | :--- | :---: | :--- |
| 1 | Navigasi Antar-Modul (Floating Island Bar) | Berhasil | Menu Beranda, Eksplorasi, Simulasi, Video, dan Kuis berpindah mulus tanpa reload halaman. |
| 2 | Viewport 3D Three.js & OrbitControls | Berhasil | Model 3D rig komputer dapat diputar 360°, di-zoom in/out, dan di-pan dengan lancar (60 FPS). |
| 3 | Inspeksi 8 Komponen Hardware Komputer | Berhasil | Kamera otomatis bergerak halus (Camera Fly-To) menyorot komponen yang dipilih pada panel kiri. |
| 4 | Mode Bedah Komponen (Exploded View) | Berhasil | Komponen-komponen terpisah secara proporsional dari casing dan kembali merapat saat dinonaktifkan. |
| 5 | Simulasi Perakitan PC 3D (7 Tahapan) | Berhasil | Komponen terpasang satu per satu sesuai urutan instruksi disertai checklist dan audio narasi. |
| 6 | Unsur Audio: Voice-Over & SFX | Berhasil | Audio narasi bahasa Indonesia dapat diputar dan dihentikan; efek klik tombol terdengar jernih. |
| 7 | Unsur Video: Pemutar Video Praktik HD | Berhasil | Video tutorial MP4 720p dapat diputar lancar per bab materi maupun full video 4 bab sekaligus. |
| 8 | Mode Alternatif Simulasi Animasi 2D | Berhasil | Animasi kanvas 2D bergerak dinamis menjelaskan tahapan perakitan sebagai alternatif video MP4. |
| 9 | Simulator Kode Beep BIOS & Oscilloscope | Berhasil | Web Audio API membangkitkan pola beep error dan osiloskop menggambar grafik gelombang real-time. |
| 10 | Kalkulator Kebutuhan Daya PSU | Berhasil | Kalkulasi watt total akurat dan memberikan rekomendasi kapasitas PSU minimum secara otomatis. |
| 11 | Kuis Evaluasi Pemahaman Multimedia | Berhasil | 10 butir pertanyaan berfungsi dengan baik, memberikan skor akhir dan pembahasan lengkap. |
| 12 | Responsivitas Mobile & Touch Gestures | Berhasil | Antarmuka bertransformasi menjadi bottom navigation bar; multi-touch pinch/rotate berfungsi optimal. |

---

## BAB V PENUTUP

### 5.1 Kesimpulan
1. Website **PC Builder 101** sukses direkayasa sebagai media pembelajaran multimedia interaktif 3D berbasis website yang memfasilitasi pengenalan dan simulasi perakitan komputer secara komprehensif, aman, dan tanpa biaya instalasi fisik.
2. Penerapan metodologi **MDLC (Multimedia Development Life Cycle)** melalui 6 tahapannya berhasil memastikan kualitas integrasi sistem dan kelengkapan konten berjalan teratur dan terdokumentasi.
3. Kelima unsur multimedia (teks, grafis 3D, audio narasi/beep, video tutorial MP4 HD, serta animasi interaktif) terintegrasi dengan harmonis sesuai dengan prinsip teori kognitif multimedia Mayer.
4. Seluruh fitur utama (Eksplorasi 3D 360°, Mode Bedah *Exploded View*, Simulasi Rakit 7 Tahap, Lab Video, Simulator Beep BIOS & Live Oscilloscope, Kalkulator Daya PSU, dan Kuis Evaluasi) lulus pengujian Black-Box fungsionalitas dengan tingkat keberhasilan 100%.
5. Website telah aktif dipublikasikan secara daring di [https://pcbuilder-opal.vercel.app](https://pcbuilder-opal.vercel.app) sehingga dapat diakses oleh civitas akademika dan masyarakat umum kapan pun dan di mana pun.

### 5.2 Saran
1. **Perluasan Ragam Hardware:** Menambahkan variasi arsitektur soket prosesor generasi baru (seperti AMD AM5) serta sistem pendingin kustom cair (*custom open-loop liquid cooling*).
2. **Fitur Gamifikasi:** Menambahkan sistem pencapaian (*badge achievement*) dan tantangan kecepatan perakitan (*speedrun challenge*) untuk meningkatkan motivasi belajar peserta didik.
3. **Eksplorasi WebXR (VR/AR):** Mengembangkan dukungan antarmuka realitas virtual (VR) agar peserta didik dapat merasakan sensasi memegang dan merakit komponen menggunakan kacamata VR interaktif.

---

## DAFTAR PUSTAKA

- Dirksen, J. (2020). *Learn Three.js: Programming 3D animations and visualisations for the web with HTML5 and WebGL* (3rd ed.). Packt Publishing.
- Flanagan, D. (2020). *JavaScript: The Definitive Guide* (7th ed.). O'Reilly Media.
- Mayer, R. E. (2021). *Multimedia learning* (3rd ed.). Cambridge University Press.
- MDN Web Docs. (n.d.). *Three.js and WebGL API Documentation*. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
- MDN Web Docs. (n.d.). *Web Audio API Documentation*. Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Sutopo, A. H. (2012). *Multimedia Interaktif dengan Flash*. Graha Ilmu.
- Three.js Authors. (2024). *Three.js Documentation and Manual*. https://threejs.org/docs/
- W3C. (2021). *Web Audio API - W3C Recommendation*. World Wide Web Consortium. https://www.w3.org/TR/webaudio/
