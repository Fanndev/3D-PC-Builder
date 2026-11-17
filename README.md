# 🖥️ 3D PC Builder 101 — Media Pembelajaran Multimedia Interaktif

> **Proyek Ujian Tengah Semester (UTS) Sistem Multimedia**  
> Program Studi S1 Ilmu Komputer — Fakultas Teknik  
> 🌐 **Live Demo:** [https://pcbuilder-opal.vercel.app](https://pcbuilder-opal.vercel.app)

Aplikasi web interaktif 3D modern untuk edukasi pengenalan dan simulasi perakitan perangkat keras komputer (*hardware* PC) yang mengintegrasikan **5 komponen multimedia**: **Teks, Gambar/Grafis 3D, Audio (Voice-Over & BIOS Beep), Video Praktik, dan Animasi Interaktif**.

---

## ✨ Fitur Utama

1. **Ruang 3D Interaktif (Three.js & WebGL):**
   - Model 3D detail untuk 8 komponen: Casing Tempered Glass, Motherboard ATX Z790, Processor (CPU), CPU Cooler ARGB dengan indikator digital suhu, RAM DDR5 RGB, SSD NVMe M.2, GPU RTX Dual-Fan, dan PSU 750W.
   - **Mode Bedah 3D (*Exploded View*):** Memisahkan seluruh lapisan hardware di udara secara halus.
   - **Hotspot 3D Real-Time & Camera Fly-To:** Klik pin atau bagian 3D untuk mengarahkan kamera langsung ke komponen tersebut.
   - **Kustomisasi Tema RGB:** Ganti efek pencahayaan sirkuit & kipas (*Cyber Cyan, ROG Crimson, Matrix Emerald, Hyper Purple, Rainbow Wave*).
   - **Kontrol Daya & Kipas:** Simulasi menyalakan/mematikan PC (*Power ON/OFF*) dengan animasi putaran kipas pendingin.
   - **Pemuat Model 3D Kustom:** Mendukung impor file `.glb` / `.gltf` hasil karya Blender.

2. **Audio Engine Terpadu (Web Audio API):**
   - **Voice-Over Narasi Bahasa Indonesia** di setiap komponen (mendukung file rekaman `.mp3` dan *speech synthesis* otomatis).
   - **Simulator Kode Suara Beep BIOS & Live Oscilloscope:** Mendengarkan gelombang suara diagnosa kerusakan hardware (RAM Error, VGA Error, Overheat, Power Error, Normal POST).
   - **Sound Effects (SFX)** mekanisme kunci komponen, klik, dan kuis.
   - **Ambient Tech Backsound (BGM)** dengan tombol *mute/unmute*.

3. **Simulasi Rakit PC 3D & Kalkulator PSU:**
   - 7 tahapan perakitan bertahap (*step-by-step assembly*) dengan animasi komponen terbang masuk ke socket/slot yang benar.
   - Kalkulator kebutuhan daya listrik (Watt) dengan rekomendasi kapasitas Power Supply secara *real-time*.

4. **Lab Video Tutorial & Animasi:**
   - Pemutar video materi perakitan berbasis canvas gerak (*motion-graphics*) serta tombol pemutar video rekaman `.mp4`.

5. **Kuis Evaluasi Multimedia (10 Soal):**
   - Soal interaktif berbasis teks, visual diagram, dan tebak bunyi *beep* BIOS dengan sistem skor dan pembahasan langsung.

---

## 🚀 Cara Menjalankan

Aplikasi ini bersifat *client-side* murni tanpa memerlukan build tools atau server khusus:

1. Clone repositori ini:
   ```bash
   git clone https://github.com/Fanndev/3D-PC-Builder.git
   ```
2. Buka file `index.html` langsung di browser modern (Google Chrome, Microsoft Edge, Mozilla Firefox).
3. Atau jalankan menggunakan Live Server di VS Code.

---

## 📁 Struktur Direktori

```text
3D-PC-Builder/
├── index.html                  # Halaman utama aplikasi web 3D
├── css/
│   └── style.css               # Desain UI modern cyber-studio glassmorphism
├── js/
│   ├── data.js                 # Database teks, spesifikasi, audio BIOS & bank soal
│   ├── audio-engine.js         # Web Audio API synthesizer, oscilloscope & voice-over
│   ├── scene3d.js              # Engine Three.js, lighting, 3D parts & raycasting
│   └── app.js                  # Controller utama aplikasi & navigasi modul
├── assets/
│   ├── PANDUAN_ASET_KELOMPOK.md # Panduan memasukkan aset audio, video & .glb
│   ├── audio/                  # Tempat file rekaman audio MP3 kelompok
│   └── video/                  # Tempat file rekaman video MP4 kelompok
└── README.md
```

---

## 🛠️ Teknologi yang Digunakan

- **HTML5 & CSS3** (Custom Properties, Glassmorphism, Responsive Grid)
- **JavaScript (ES6+)**
- **Three.js (r128)** & **OrbitControls** (WebGL 3D Rendering)
- **Web Audio API** (Audio Synthesizer & Analyser Waveform)
- Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*)

---

## 👥 Anggota Kelompok (S1 Ilmu Komputer)

| No | Nama Mahasiswa | NIM |
| :---: | :--- | :--- |
| 1 | Muh. Farid Hakim | `2301010211` |
| 2 | Mauulana Habib Al Ansyori | `2301010197` |
| 3 | Mohamad Irfan fadhlurrahman | `2301010162` |
| 4 | Mohammad Syahiddin Danuwarsi Abdussamad | `2301010187` |
| 5 | Arya Ramadhani | `2301010208` |
| 6 | Nabila Umardi | `2301010165` |
| 7 | Muhammad Ferris Naufal | `2301010174` |
| 8 | Muhammad Qodri | `2301010172` |
| 9 | Mu'taman Abid | `2301010189` |
| 10 | Reno Kurniawan | `2301010175` |
