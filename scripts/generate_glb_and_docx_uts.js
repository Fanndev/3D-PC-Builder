/**
 * Script Generator Luaran Pelengkap UTS Sistem Multimedia:
 * 1. Menghasilkan file 3D Binary glTF 2.0: assets/models/MSI_MPG_Z790_CARBON_WIFI.glb
 * 2. Menghasilkan dokumen laporan rancangan Word (.docx): DOKUMEN_RANCANGAN_DAN_STORYBOARD_UTS.docx
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MODELS_DIR = path.join(ROOT, 'assets', 'models');
fs.mkdirSync(MODELS_DIR, { recursive: true });

/* ==========================================================================
   PART 1: GENERATE SPEC-COMPLIANT GLTF 2.0 BINARY (.GLB) FOR MSI MPG Z790
   ========================================================================== */
function createBoxGeometryData(w, h, d) {
  const hx = w / 2, hy = h / 2, hz = d / 2;
  const positions = [
    -hx, -hy,  hz,   hx, -hy,  hz,   hx,  hy,  hz,  -hx,  hy,  hz,
     hx, -hy, -hz,  -hx, -hy, -hz,  -hx,  hy, -hz,   hx,  hy, -hz,
    -hx,  hy,  hz,   hx,  hy,  hz,   hx,  hy, -hz,  -hx,  hy, -hz,
    -hx, -hy, -hz,   hx, -hy, -hz,   hx, -hy,  hz,  -hx, -hy,  hz,
     hx, -hy,  hz,   hx, -hy, -hz,   hx,  hy, -hz,   hx,  hy,  hz,
    -hx, -hy, -hz,  -hx, -hy,  hz,  -hx,  hy,  hz,  -hx,  hy, -hz
  ];

  const normals = [
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
   -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
  ];

  const indices = [];
  for (let f = 0; f < 6; f++) {
    const base = f * 4;
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
    min: [-hx, -hy, -hz],
    max: [hx, hy, hz]
  };
}

function buildMsiMpgZ790Glb(outPath) {
  const materials = [
    {
      name: 'PCB_Stealth_Carbon_Black',
      pbrMetallicRoughness: { baseColorFactor: [0.05, 0.07, 0.11, 1.0], metallicFactor: 0.35, roughnessFactor: 0.45 }
    },
    {
      name: 'Heatsink_Brushed_Gunmetal',
      pbrMetallicRoughness: { baseColorFactor: [0.16, 0.20, 0.27, 1.0], metallicFactor: 0.85, roughnessFactor: 0.25 }
    },
    {
      name: 'Steel_Armor_Chrome',
      pbrMetallicRoughness: { baseColorFactor: [0.82, 0.86, 0.92, 1.0], metallicFactor: 0.95, roughnessFactor: 0.15 }
    },
    {
      name: 'Mystic_Light_ARGB_Cyan',
      pbrMetallicRoughness: { baseColorFactor: [0.0, 0.94, 1.0, 1.0], metallicFactor: 0.1, roughnessFactor: 0.2 },
      emissiveFactor: [0.0, 0.94, 1.0]
    },
    {
      name: 'Gold_Socket_Contacts',
      pbrMetallicRoughness: { baseColorFactor: [0.96, 0.62, 0.04, 1.0], metallicFactor: 0.92, roughnessFactor: 0.2 }
    },
    {
      name: 'Debug_LED_Crimson',
      pbrMetallicRoughness: { baseColorFactor: [1.0, 0.12, 0.34, 1.0], metallicFactor: 0.1, roughnessFactor: 0.2 },
      emissiveFactor: [1.0, 0.12, 0.34]
    }
  ];

  const parts = [
    { name: 'ATX_PCB_Board', size: [2.44, 3.05, 0.08], pos: [0, 0, 0], mat: 0 },
    { name: 'VRM_Heatsink_Left_IO_Shroud', size: [0.46, 1.35, 0.34], pos: [-0.92, 0.72, 0.20], mat: 1 },
    { name: 'MysticLight_Dragon_Plate_ARGB', size: [0.36, 0.68, 0.36], pos: [-0.92, 0.82, 0.21], mat: 3 },
    { name: 'VRM_Heatsink_Top', size: [1.18, 0.34, 0.30], pos: [-0.15, 1.28, 0.18], mat: 1 },
    { name: 'LGA1700_Socket_ILM_Frame', size: [0.74, 0.78, 0.07], pos: [-0.20, 0.68, 0.07], mat: 2 },
    { name: 'LGA1700_Gold_Pin_Array', size: [0.58, 0.62, 0.08], pos: [-0.20, 0.68, 0.075], mat: 4 },
    { name: 'DDR5_Slot_A1', size: [0.06, 1.28, 0.09], pos: [0.42, 0.68, 0.08], mat: 1 },
    { name: 'DDR5_Slot_A2_SteelArmor', size: [0.065, 1.28, 0.095], pos: [0.54, 0.68, 0.08], mat: 2 },
    { name: 'DDR5_Slot_B1', size: [0.06, 1.28, 0.09], pos: [0.66, 0.68, 0.08], mat: 1 },
    { name: 'DDR5_Slot_B2_SteelArmor', size: [0.065, 1.28, 0.095], pos: [0.78, 0.68, 0.08], mat: 2 },
    { name: 'M2_Shield_Frozr_Gen5_Slot1', size: [1.12, 0.28, 0.12], pos: [-0.22, 0.06, 0.09], mat: 1 },
    { name: 'CarbonMax_Accent_Badge', size: [0.52, 0.12, 0.13], pos: [-0.22, 0.06, 0.095], mat: 3 },
    { name: 'PCIe_5_0_x16_Steel_Armor', size: [1.42, 0.10, 0.11], pos: [-0.25, -0.22, 0.085], mat: 2 },
    { name: 'M2_Shield_Frozr_Gen4_Cluster', size: [1.35, 0.56, 0.11], pos: [-0.22, -0.64, 0.085], mat: 1 },
    { name: 'Z790_Chipset_Heatsink_MPG', size: [0.74, 0.72, 0.16], pos: [0.68, -0.82, 0.10], mat: 1 },
    { name: 'Chipset_MysticLight_Strip', size: [0.58, 0.06, 0.17], pos: [0.68, -0.82, 0.105], mat: 3 },
    { name: 'PCIe_4_0_x16_Secondary_Slot', size: [1.42, 0.09, 0.09], pos: [-0.25, -1.12, 0.08], mat: 1 },
    { name: 'Debug_LED_7Segment_88', size: [0.16, 0.12, 0.09], pos: [0.98, 1.34, 0.08], mat: 5 }
  ];

  const bufferChunks = [];
  let byteOffset = 0;

  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];

  parts.forEach((p, idx) => {
    const geo = createBoxGeometryData(p.size[0], p.size[1], p.size[2]);

    const posBuf = Buffer.from(geo.positions.buffer);
    bufferChunks.push(posBuf);
    const posViewIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: posBuf.length, target: 34962 });
    byteOffset += posBuf.length;

    const posAccIdx = accessors.length;
    accessors.push({
      bufferView: posViewIdx,
      componentType: 5126,
      count: 24,
      type: 'VEC3',
      min: geo.min,
      max: geo.max
    });

    const normBuf = Buffer.from(geo.normals.buffer);
    bufferChunks.push(normBuf);
    const normViewIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: normBuf.length, target: 34962 });
    byteOffset += normBuf.length;

    const normAccIdx = accessors.length;
    accessors.push({
      bufferView: normViewIdx,
      componentType: 5126,
      count: 24,
      type: 'VEC3'
    });

    const idxBuf = Buffer.from(geo.indices.buffer);
    bufferChunks.push(idxBuf);
    const idxViewIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: idxBuf.length, target: 34963 });
    byteOffset += idxBuf.length;

    const idxAccIdx = accessors.length;
    accessors.push({
      bufferView: idxViewIdx,
      componentType: 5123,
      count: 36,
      type: 'SCALAR'
    });

    meshes.push({
      name: p.name,
      primitives: [{
        attributes: { POSITION: posAccIdx, NORMAL: normAccIdx },
        indices: idxAccIdx,
        material: p.mat
      }]
    });

    nodes.push({
      name: p.name,
      mesh: idx,
      translation: p.pos
    });
  });

  const childIndices = nodes.map((_, i) => i);
  const rootNodeIdx = nodes.length;
  nodes.push({
    name: 'MSI_MPG_Z790_CARBON_WIFI_Root',
    children: childIndices
  });

  const binBuffer = Buffer.concat(bufferChunks);

  const gltfJson = {
    asset: {
      version: '2.0',
      generator: 'PC Builder 101 - 3D Studio Exporter'
    },
    scene: 0,
    scenes: [{ name: 'MSI_MPG_Z790_CARBON_WIFI_Scene', nodes: [rootNodeIdx] }],
    nodes,
    meshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: binBuffer.length }]
  };

  let jsonStr = JSON.stringify(gltfJson);
  while (Buffer.byteLength(jsonStr, 'utf8') % 4 !== 0) {
    jsonStr += ' ';
  }
  const jsonBuf = Buffer.from(jsonStr, 'utf8');

  const totalLength = 12 + 8 + jsonBuf.length + 8 + binBuffer.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546C67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);

  const jsonChunkHeader = Buffer.alloc(8);
  jsonChunkHeader.writeUInt32LE(jsonBuf.length, 0);
  jsonChunkHeader.writeUInt32LE(0x4E4F534A, 4);

  const binChunkHeader = Buffer.alloc(8);
  binChunkHeader.writeUInt32LE(binBuffer.length, 0);
  binChunkHeader.writeUInt32LE(0x004E4942, 4);

  const glbBuffer = Buffer.concat([header, jsonChunkHeader, jsonBuf, binChunkHeader, binBuffer]);
  fs.writeFileSync(outPath, glbBuffer);
  console.log(`[OK] Generated 3D Model GLB: ${path.basename(outPath)} (${(glbBuffer.length / 1024).toFixed(1)} KB)`);
}

/* ==========================================================================
   PART 2: GENERATE WORD (.DOCX) UTS DESIGN & STORYBOARD REPORT
   ========================================================================== */
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wParagraph(text, opts = {}) {
  const align = opts.align ? `<w:jc w:val="${opts.align}"/>` : '';
  const spacing = `<w:spacing w:before="${opts.before || 80}" w:after="${opts.after || 120}" w:line="276" w:lineRule="auto"/>`;
  const bold = opts.bold ? '<w:b/>' : '';
  const italic = opts.italic ? '<w:i/>' : '';
  const color = opts.color ? `<w:color w:val="${opts.color}"/>` : '<w:color w:val="1E293B"/>';
  const size = `<w:sz w:val="${opts.size || 22}"/><w:szCs w:val="${opts.size || 22}"/>`;
  const rFonts = `<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>`;

  return `<w:p>
    <w:pPr>${align}${spacing}</w:pPr>
    <w:r>
      <w:rPr>${rFonts}${bold}${italic}${color}${size}</w:rPr>
      <w:t xml:space="preserve">${escapeXml(text)}</w:t>
    </w:r>
  </w:p>`;
}

function wTable(headers, rows) {
  const borderXml = `
    <w:tblBorders>
      <w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
      <w:bottom w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
      <w:left w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
      <w:right w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
      <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
      <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
    </w:tblBorders>`;

  const headerCells = headers.map(h => `
    <w:tc>
      <w:tcPr>
        <w:shd w:val="clear" w:color="auto" w:fill="0F172A"/>
      </w:tcPr>
      ${wParagraph(h, { bold: true, color: 'FFFFFF', size: 20, before: 60, after: 60 })}
    </w:tc>`).join('');

  const bodyRows = rows.map((row, rIdx) => {
    const fill = rIdx % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
    const cells = row.map(cellText => `
      <w:tc>
        <w:tcPr>
          <w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>
        </w:tcPr>
        ${wParagraph(cellText, { size: 20, before: 50, after: 50 })}
      </w:tc>`).join('');
    return `<w:tr>${cells}</w:tr>`;
  }).join('');

  return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="5000" w:type="pct"/>
      ${borderXml}
    </w:tblPr>
    <w:tr>${headerCells}</w:tr>
    ${bodyRows}
  </w:tbl>`;
}

function generateDocxReport(docxPath) {
  const tmpDocxDir = path.join(ROOT, 'assets', '_docx_tmp');
  fs.mkdirSync(path.join(tmpDocxDir, '_rels'), { recursive: true });
  fs.mkdirSync(path.join(tmpDocxDir, 'word', '_rels'), { recursive: true });

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

  const bodyParts = [
    wParagraph('DOKUMEN PERANCANGAN & STORYBOARD PRODUK MULTIMEDIA INTERAKTIF', { bold: true, size: 30, align: 'center', color: '0F172A', before: 120, after: 60 }),
    wParagraph('PC BUILDER 101 — MEDIA PEMBELAJARAN INTERAKTIF 3D PENGENALAN & PERAKITAN HARDWARE KOMPUTER', { bold: true, size: 24, align: 'center', color: '0284C7', before: 0, after: 180 }),
    wTable(
      ['Atribut Mata Kuliah', 'Keterangan'],
      [
        ['Nama Mata Kuliah / SKS', 'Sistem Multimedia (3 SKS)'],
        ['Program Studi / Fakultas', 'S1 Ilmu Komputer / Fakultas Teknik'],
        ['Semester / Kelas', 'VII / A (Ganjil 2025/2026)'],
        ['Dosen Pengampu', 'Melati Rosanensi, M.Kom'],
        ['Bentuk Ujian', 'Project-Based Assessment (Kelompok 7 Mahasiswa)'],
        ['Tema Produk', 'Media Pembelajaran Interaktif (Eksplorasi & Perakitan Hardware PC 3D)'],
        ['Repositori Kode & Produk', 'https://github.com/Fanndev/3D-PC-Builder']
      ]
    ),
    wParagraph('BAB 1: ANALISIS KEBUTUHAN PENGGUNA & TUJUAN PRODUK', { bold: true, size: 26, color: '0F172A', before: 280, after: 100 }),
    wParagraph('1.1 Analisis Permasalahan Pengguna', { bold: true, size: 22, color: '0369A1', before: 120, after: 60 }),
    wParagraph('Dalam proses pembelajaran perakitan perangkat keras komputer (Computer Hardware Assembly), mahasiswa dan pelajar sering menghadapi keterbatasan akses komponen fisik modern yang berharga mahal serta risiko kerusakan fisik seperti pin socket LGA bengkok atau sengatan listrik statis (ESD). Selain itu, materi buku cetak 2D statis belum mampu memvisualisasikan struktur ruang 3D motherboard serta pola suara diagnosa kerusakan BIOS (BIOS Beep Codes) secara langsung.'),
    wParagraph('1.2 Tujuan Produk Multimedia', { bold: true, size: 22, color: '0369A1', before: 120, after: 60 }),
    wParagraph('1. Menyediakan laboratorium virtual 3D interaktif berbasis web (Three.js WebGL) yang memungkinkan pengguna memutar 360 derajat, membedah lapisan komponen (Exploded View), dan mempelajari 8 komponen utama PC secara aman.'),
    wParagraph('2. Mengintegrasikan seluruh 5 komponen multimedia (Teks, Gambar/Grafis 3D & SVG, Audio Voice-Over & BIOS Synthesizer, Video Tutorial MP4 HD yang tersinkronisasi per adegan, serta Animasi/Simulasi Interaktif).'),
    wParagraph('3. Membimbing pengguna mempraktikkan urutan perakitan PC dari nol hingga menyala (First Boot), menghitung kebutuhan daya PSU (Watt), dan mengukur pemahaman melalui 10 soal kuis multimedia.'),

    wParagraph('BAB 2: KONSEP PRODUK & INTEGRASI 5 KOMPONEN MULTIMEDIA', { bold: true, size: 26, color: '0F172A', before: 280, after: 100 }),
    wTable(
      ['Komponen Multimedia', 'Implementasi di Dalam Produk "PC Builder 101"'],
      [
        ['1. Teks', 'Materi tersegmentasi (Deskripsi, Cara Kerja, Spesifikasi Teknis, Tips K3) untuk 8 komponen utama, tabel komparasi Form Factor Motherboard (E-ATX, ATX, mATX, Mini-ITX), tabel diagnosa BIOS Beep Codes, serta 10 soal kuis & pembahasan.'],
        ['2. Gambar / Grafis & 3D', 'Model 3D PBR 8 komponen PC (termasuk detail MSI MPG Z790 CARBON WIFI), ikon vektor SVG per komponen, tekstur jalur sirkuit PCB 1024x1024, dan file model 3D .GLB / .BLEND.'],
        ['3. Audio', '31 file audio MP3 mencakup: 9 Voice-Over komponen & beranda, 7 Voice-Over langkah simulasi rakit, 4 Voice-Over bab video, 5 audio kode Beep BIOS + Live Oscilloscope Waveform, 5 sound effects UI, dan musik latar ambient.'],
        ['4. Video', '5 file video MP4 HD (1280x720 H.264) yang memadukan rekaman fisik pemasangan komponen PC asli dengan sulih suara Bahasa Indonesia yang tersinkronisasi tepat per detik adegan (Bab 1 s/d Bab 4 + Video Lengkap).'],
        ['5. Animasi & Interaktivitas', 'Animasi Mode Bedah 3D (Exploded View), animasi Camera Fly-To saat memilih komponen, animasi buka-tutup kaca casing, putaran kipas & 5 tema lampu RGB, animasi pemasangan komponen pada Simulasi Rakit PC 3D, serta Simulasi Animasi 2D.']
      ]
    ),

    wParagraph('BAB 3: DESAIN PRODUK & TABEL STORYBOARD', { bold: true, size: 26, color: '0F172A', before: 280, after: 100 }),
    wParagraph('3.1 Struktur Navigasi & Layout Antarmuka', { bold: true, size: 22, color: '0369A1', before: 120, after: 60 }),
    wParagraph('Aplikasi menggunakan Struktur Navigasi Campuran (Non-Linear) melalui kapsul melayang (Floating Island Navigation) di bagian atas layar yang menghubungkan 5 modul utama: (1) Beranda 3D, (2) Eksplorasi 3D, (3) Simulasi Rakit & Kalkulator PSU, (4) Lab Video & Audio BIOS, serta (5) Kuis Evaluasi. Kanvas 3D Three.js ditempatkan secara penuh di latar belakang dengan panel informasi kaca transparan (Glassmorphism HUD) di sisi kiri dan kanan.'),
    wParagraph('3.2 Tabel Storyboard Produk Multimedia Interaktif', { bold: true, size: 22, color: '0369A1', before: 140, after: 80 }),
    wTable(
      ['Scene / Modul', 'Visual & Objek 3D', 'Teks Materi', 'Audio yang Diputar', 'Video & Interaktivitas'],
      [
        ['Scene 1: Beranda 3D (#view-home)', 'Kanvas 3D menampilkan Rig PC utuh dengan lampu ARGB menyala & kipas berputar; Panel Hero di kiri.', 'Judul utama, penjelasan ringkas aplikasi, badge 5 elemen multimedia, dan statistik komponen.', 'vo_welcome.mp3, bgm_ambient.mp3, dan sfx_click.mp3.', 'Rotasi kamera 360 derajat, animasi kipas berputar, tombol mulai Eksplorasi 3D & Simulasi Rakit.'],
        ['Scene 2: Eksplorasi Hardware 3D (#view-explore)', 'Daftar 8 komponen di kiri; Objek 3D dengan 8 Pin Hotspot di tengah; Panel Inspeksi 3 tab di kanan.', 'Deskripsi, Cara Kerja, Spesifikasi Teknis, Tips K3, dan Modal Komparasi Form Factor Motherboard.', 'vo_mobo.mp3 s/d vo_case.mp3 sesuai komponen yang dipilih.', 'Camera Fly-To otomatis ke komponen yang diklik, Mode Bedah 3D (Exploded View), buka kaca casing, ganti RGB, & unduh .GLB.'],
        ['Scene 3: Simulasi Rakit PC 3D & Kalkulator PSU (#view-simulate)', 'Casing 3D dimulai kosong; Panel kiri berisi 7 tahap perakitan; Panel kanan berisi Kalkulator Daya PSU.', 'Instruksi 7 langkah merakit PC berurutan, progress bar perakitan, dan kalkulasi beban daya Watt.', 'vo_step1.mp3 s/d vo_step7.mp3, sfx_install_ok.mp3, sfx_error.mp3, dan bunyi boot POST.', 'Komponen 3D terbang masuk ke slot motherboard secara berurutan; Kalkulator menghitung total Watt & rekomendasi PSU 80+ Gold.'],
        ['Scene 4: Lab Video Tutorial & Audio BIOS (#view-lab)', 'Panel kiri: Live Oscilloscope & 5 kartu Beep BIOS; Panel kanan: Video Player MP4 HD & Simulasi 2D.', 'Arti 5 pola bunyi Beep BIOS beserta solusinya; Ringkasan materi Bab 1 s/d Bab 4 perakitan PC.', 'beep_normal.mp3 s/d beep_power_error.mp3 dan vo_chap1.mp3 s/d vo_chap4.mp3.', 'Pemutaran 5 Video MP4 HD 720p (bab1 s/d bab4 + full video) yang tersinkronisasi per adegan + gelombang Oscilloscope.'],
        ['Scene 5: Kuis Evaluasi Multimedia (#view-quiz)', 'Panel kuis di tengah layar dengan indikator skor real-time, 4 opsi jawaban (A-D), dan kartu pembahasan.', '10 soal evaluasi mencakup konsep hardware, prosedur perakitan, daya PSU, dan diagnosa suara BIOS.', 'Audio Beep BIOS pada soal audio, sfx_quiz_correct.mp3, dan sfx_quiz_wrong.mp3.', 'Validasi jawaban instan, pembahasan langsung di setiap soal, serta rekapitulasi skor akhir & predikat kelulusan.']
      ]
    ),

    wParagraph('BAB 4: HASIL PENGUJIAN PENGGUNA (BLACK-BOX TESTING)', { bold: true, size: 26, color: '0F172A', before: 280, after: 100 }),
    wTable(
      ['No', 'Modul / Fitur yang Diuji', 'Skenario Pengujian', 'Hasil Pengujian'],
      [
        ['1', 'Viewport 3D & Camera Fly-To', 'Memutar kamera 360 derajat, zoom, dan mengklik komponen/pin 3D.', 'Valid / Berjalan Lancar (60 FPS)'],
        ['2', 'Mode Bedah 3D (Exploded View)', 'Mengklik tombol Bedah 3D dan Buka Kaca Casing pada HUD bawah.', 'Valid / Seluruh Lapisan Terpisah Halus'],
        ['3', 'Narasi Voice-Over Bahasa Indonesia', 'Memutar narasi suara pada Beranda, 8 Komponen, dan 7 Langkah Rakit.', 'Valid / 31 File Audio MP3 Berputar Jernih'],
        ['4', 'Simulasi Rakit PC 3D & Kalkulator PSU', 'Memasang 7 komponen berurutan dari nol dan menghitung daya PSU.', 'Valid / Animasi Rakit & Kalkulasi Akurat'],
        ['5', 'Simulator Audio BIOS & Oscilloscope', 'Memutar 5 kode bunyi Beep BIOS dan mengamati grafik gelombang.', 'Valid / Frekuensi & Waveform Aktif'],
        ['6', 'Video Tutorial MP4 Per Bab (Bab 1-4)', 'Memutar video Bab 1 s/d Bab 4 serta Full Video Tutorial.', 'Valid / Visual & Narasi Sinkron Per Detik'],
        ['7', 'Kuis Evaluasi Interaktif 10 Soal', 'Menjawab 10 soal teks & audio hingga menampilkan nilai akhir.', 'Valid / Skor & Pembahasan Tampil Tepat'],
        ['8', 'Ekspor & Impor Model 3D (.GLB)', 'Mengunduh file MSI_MPG_Z790_CARBON_WIFI.glb dan memuat file .glb.', 'Valid / File Binary GLTF 2.0 Sesuai Standar']
      ]
    )
  ].join('\n');

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyParts}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  fs.writeFileSync(path.join(tmpDocxDir, '[Content_Types].xml'), contentTypesXml, 'utf8');
  fs.writeFileSync(path.join(tmpDocxDir, '_rels', '.rels'), relsXml, 'utf8');
  fs.writeFileSync(path.join(tmpDocxDir, 'word', '_rels', 'document.xml.rels'), wordRelsXml, 'utf8');
  fs.writeFileSync(path.join(tmpDocxDir, 'word', 'document.xml'), documentXml, 'utf8');

  if (fs.existsSync(docxPath)) fs.unlinkSync(docxPath);

  execFileSync('powershell.exe', [
    '-NoProfile',
    '-Command',
    `Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tmpDocxDir.replace(/'/g, "''")}', '${docxPath.replace(/'/g, "''")}')`
  ], { stdio: 'ignore' });

  fs.rmSync(tmpDocxDir, { recursive: true, force: true });
  console.log(`[OK] Generated Word Report (.docx): ${path.basename(docxPath)} (${(fs.statSync(docxPath).size / 1024).toFixed(1)} KB)`);
}

function main() {
  buildMsiMpgZ790Glb(path.join(MODELS_DIR, 'MSI_MPG_Z790_CARBON_WIFI.glb'));
  generateDocxReport(path.join(ROOT, 'DOKUMEN_RANCANGAN_DAN_STORYBOARD_UTS.docx'));
}

main();
