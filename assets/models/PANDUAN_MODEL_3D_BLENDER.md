# 📦 Panduan Aset 3D Motherboard MSI MPG Z790 CARBON MAX WIFI (Blender & GLB)

Dokumen ini berisi panduan penggunaan dan ekspor aset 3D untuk memenuhi ketentuan luaran **Ujian Tengah Semester (UTS) Sistem Multimedia**:
> *"File sudah jadi dan masih mentah (sesuai software yang digunakan)"*

---

## 🖥️ 1. File Mentah Blender (`.blend`) & Skrip Otomatis
Di dalam folder `scripts/`, telah disediakan skrip generator otomatis untuk Blender yang diperbarui sesuai referensi **MSI MPG Z790 CARBON MAX WIFI**:
* **Lokasi Skrip:** `scripts/generate_msi_mpg_blender.py`

### Cara Menjalankan di Blender (Versi 3.0 / 3.6 / 4.x):
1. Buka aplikasi **Blender**.
2. Masuk ke tab **Scripting** pada bagian atas layar.
3. Klik tombol **Open** (atau buat file baru), lalu arahkan ke:  
   `scripts/generate_msi_mpg_blender.py`
4. Tekan tombol **▶ Run Script** (atau shortcut `Alt + P`).
5. **Fitur Visual yang Dihasilkan:**
   * **Bevel Edge Modifiers & Auto-Smooth:** Setiap heatsink dan pelindung armor memiliki chamfer bevel halus sehingga memantulkan specular highlight realistis saat dirender di EEVEE maupun Cycles.
   * **Plat Heatsink `[ CARBON MAX ]`:** Plat pendingin khusus di bawah soket LGA1700 dengan aksen serat karbon dan baut perak.
   * **Mirror Dragon Plate & Mystic Light ARGB:** Pelindung I/O memiliki plat kaca facet reflektif dengan lambang naga MSI, badge perak "msi", dan pendaran ARGB cyan.
   * **Digital 2-Digit 7-Segment Debug LED ("8.8"):** Tampilan digital status POST / temperatur di sudut kanan atas board.
   * **PCIe 5.0 Steel Armor:** Slot kartu grafis diperkuat pelindung baja kromium dengan klip rilis XL.
   * **VRM Heatsink & Heatpipe:** Pendingin daya ganda dengan lencana "MPG" dan pipa tembaga berpelapis nikel.
   * **Studio Lighting 3-Titik & Lantai Pantul:** Key light, rim cyan, fill violet, dan kamera studio siap render (F12).
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

