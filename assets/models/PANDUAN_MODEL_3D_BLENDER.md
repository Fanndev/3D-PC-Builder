# 📦 Panduan Aset 3D Motherboard MSI MPG Z790 (Blender & GLB)

Dokumen ini berisi panduan penggunaan dan ekspor aset 3D untuk memenuhi ketentuan luaran **Ujian Tengah Semester (UTS) Sistem Multimedia**:
> *"File sudah jadi dan masih mentah (sesuai software yang digunakan)"*

---

## 🖥️ 1. File Mentah Blender (`.blend`) & Skrip Otomatis
Di dalam folder `scripts/`, telah disediakan skrip generator otomatis untuk Blender:
* **Lokasi Skrip:** `scripts/generate_msi_mpg_blender.py`

### Cara Menjalankan di Blender (Versi 3.0 / 3.6 / 4.x):
1. Buka aplikasi **Blender**.
2. Masuk ke tab **Scripting** pada bagian atas layar.
3. Klik tombol **Open** (atau buat file baru), lalu arahkan ke:  
   `scripts/generate_msi_mpg_blender.py`
4. Tekan tombol **▶ Run Script** (atau shortcut `Alt + P`).
5. **Hasil:**
   * Seluruh hierarki objek 3D Motherboard **MSI MPG Z790 CARBON WIFI** langsung terbentuk secara presisi (PCB, VRM heatsinks, I/O shield, CPU socket LGA1700, DDR5 slots, PCIe Steel Armor, M.2 Shield Frozr, Audio Boost 5, Chipset heatsink, CMOS battery, SATA ports).
   * Seluruh material PBR (Carbon Black, Brushed Titanium, Chrome Steel Armor, Gold Pins, Emissive Mystic Light ARGB) langsung disematkan.
   * Studio lighting 3-titik (Key, Rim, Fill) serta kamera studio langsung diatur.
   * File mentah `assets/models/msi_mpg_z790_carbon.blend` dan file jadi `assets/models/msi_mpg_z790_carbon.glb` otomatis tersimpan!

---

## 🌐 2. Model 3D di Dalam Website Interaktif (Three.js)
Pada website **PC Builder 101**:
1. **Model Prosedural HD Bawaan:**  
   Ketika website dibuka di browser, Motherboard MSI MPG Z790 sudah langsung dirender dalam kualitas ultra-detail dengan tekstur kanvas 1024x1024 (serat karbon, jalur sirkuit emas/cyan, silkscreen sablon sirkuit resmi, dan isolasi audio LED).
2. **Fitur Unduh Model 3D (.GLB):**  
   Pengguna dapat mengklik tombol **"💾 Unduh .GLB"** pada navigasi atas atau tombol **"💾 Unduh Model 3D .GLB"** pada panel inspeksi Motherboard untuk mengunduh file binary 3D asli (`MSI_MPG_Z790_CARBON_WIFI.glb`) secara langsung dari browser!
3. **Fitur Muat Model 3D (.GLB / .GLTF):**  
   Tombol **"📦 Muat .GLB"** di kanan atas navigasi dapat digunakan untuk memuat file hasil ekspor Blender kelompok ke ruang 3D website untuk diinspeksi secara 360°.

---

## 📐 3. Edukasi Tipe Form Factor Motherboard
Pada panel inspeksi Motherboard di website, terdapat tombol **"📐 Komparasi Form Factor"** yang menampilkan panduan interaktif:
* **Standard ATX (30.5 x 24.4 cm):** Standar industri yang digunakan pada model 3D ini.
* **Micro-ATX (24.4 x 24.4 cm):** Varian hemat ruang dan ekonomis.
* **Mini-ITX (17.0 x 17.0 cm):** Varian ultra-kompak untuk PC portabel / konsol SFF.
* **Extended ATX (30.5 x 33.0 cm):** Varian workstation dan extreme gaming.
