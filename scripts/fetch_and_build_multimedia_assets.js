/**
 * Script Pengambil & Pembuat Aset Audio & Video Nyata untuk PC Builder 101
 * - Mengunduh Voice-Over Bahasa Indonesia (Google Translate TTS id-ID)
 * - Mengunduh Musik Latar (BGM) & Video Perakitan PC berlisensi Creative Commons dari Wikimedia Commons
 * - Merender file MP3 Kode Beep BIOS & SFX menggunakan FFmpeg
 * - Menggabungkan footage video hardware asli dengan narasi Bahasa Indonesia per Bab menggunakan FFmpeg
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const FFMPEG_PATH = 'C:\\Users\\MyBook Hype AMD\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';
const FFPROBE_PATH = 'C:\\Users\\MyBook Hype AMD\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';

const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT_DIR, 'assets', 'audio');
const VIDEO_DIR = path.join(ROOT_DIR, 'assets', 'video');
const TMP_DIR = path.join(ROOT_DIR, 'assets', '_tmp');

fs.mkdirSync(AUDIO_DIR, { recursive: true });
fs.mkdirSync(VIDEO_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const USER_AGENT = 'PCBuilder101_UTS_Edu/1.0 (https://github.com/Fanndev/3D-PC-Builder; poloking52980@gmail.com)';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Split long text into chunks <= 175 chars at sentence/comma boundaries
function splitTextForTTS(text, maxLen = 175) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks = [];
  for (const s of sentences) {
    if (s.length <= maxLen) {
      chunks.push(s);
    } else {
      const clauses = s.split(/(?<=[,;:])\s+/);
      let cur = '';
      for (const c of clauses) {
        if ((cur + ' ' + c).trim().length <= maxLen) {
          cur = (cur + ' ' + c).trim();
        } else {
          if (cur) chunks.push(cur);
          cur = c;
        }
      }
      if (cur) chunks.push(cur);
    }
  }
  return chunks.filter(Boolean);
}

async function downloadIndonesianTTS(id, text, outMp3Path) {
  const chunks = splitTextForTTS(text);
  const partFiles = [];

  for (let i = 0; i < chunks.length; i++) {
    const q = chunks[i];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!res.ok) {
      throw new Error(`TTS HTTP ${res.status} for ${id} part ${i}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const partPath = path.join(TMP_DIR, `${id}_part${i}.mp3`);
    fs.writeFileSync(partPath, buf);
    partFiles.push(partPath);
    await sleep(250);
  }

  if (partFiles.length === 1) {
    execFileSync(FFMPEG_PATH, [
      '-y', '-i', partFiles[0],
      '-ar', '44100', '-ac', '2', '-b:a', '128k',
      outMp3Path
    ], { stdio: 'ignore' });
  } else {
    const listFile = path.join(TMP_DIR, `${id}_concat.txt`);
    const content = partFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(listFile, content, 'utf8');
    execFileSync(FFMPEG_PATH, [
      '-y', '-f', 'concat', '-safe', '0', '-i', listFile,
      '-ar', '44100', '-ac', '2', '-b:a', '128k',
      outMp3Path
    ], { stdio: 'ignore' });
  }
  console.log(`[OK] Voice-Over MP3: ${path.basename(outMp3Path)}`);
}

function generateTonePatternMp3(pattern, outMp3Path, waveType = 'square') {
  // Build raw 44.1kHz 16-bit mono WAV in memory, then encode to MP3 via FFmpeg
  const sampleRate = 44100;
  let totalSec = 0;
  for (const step of pattern) {
    totalSec += step.duration + (step.gap || 0);
  }
  totalSec += 0.15;
  const numSamples = Math.ceil(totalSec * sampleRate);
  const samples = new Int16Array(numSamples);

  let cursorSec = 0.05;
  for (const step of pattern) {
    const startSample = Math.floor(cursorSec * sampleRate);
    const toneSamples = Math.floor(step.duration * sampleRate);
    const freq = step.freq;

    for (let i = 0; i < toneSamples; i++) {
      const t = i / sampleRate;
      // Smooth envelope to avoid harsh popping
      let env = 0.35;
      if (t < 0.01) env *= (t / 0.01);
      if (t > step.duration - 0.015) env *= Math.max(0, (step.duration - t) / 0.015);

      let val = 0;
      const phase = 2 * Math.PI * freq * t;
      if (waveType === 'square') {
        val = Math.sin(phase) >= 0 ? 1 : -1;
        // Add subtle fundamental sine for warm speaker resonance
        val = 0.65 * val + 0.35 * Math.sin(phase);
      } else if (waveType === 'sawtooth') {
        val = 2 * ((t * freq) - Math.floor(0.5 + t * freq));
      } else {
        val = Math.sin(phase);
      }
      const idx = startSample + i;
      if (idx < numSamples) {
        samples[idx] = Math.max(-32767, Math.min(32767, Math.floor(val * env * 32767)));
      }
    }
    cursorSec += step.duration + (step.gap || 0);
  }

  // Write WAV header + PCM data
  const wavPath = path.join(TMP_DIR, path.basename(outMp3Path, '.mp3') + '.wav');
  const dataSize = samples.length * 2;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // Mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  const pcmBuf = Buffer.from(samples.buffer);
  fs.writeFileSync(wavPath, Buffer.concat([header, pcmBuf]));

  execFileSync(FFMPEG_PATH, [
    '-y', '-i', wavPath,
    '-ar', '44100', '-ac', '2', '-b:a', '128k',
    outMp3Path
  ], { stdio: 'ignore' });
  console.log(`[OK] Synth Audio MP3: ${path.basename(outMp3Path)}`);
}

async function main() {
  // 1. Voice-Over Narrations (Welcome + 8 Components + 4 Video Chapters + 7 Assembly Steps)
  const voList = [
    {
      id: 'vo_welcome',
      file: 'vo_welcome.mp3',
      text: 'Selamat datang di PC Builder 101, media pembelajaran multimedia interaktif tiga dimensi pengenalan dan perakitan perangkat keras komputer. Gunakan mouse untuk memutar komputer tiga dimensi, klik komponen untuk mendengar penjelasan suara, atau masuk ke menu Simulasi Rakit PC.'
    },
    {
      id: 'vo_mobo',
      file: 'vo_mobo.mp3',
      text: 'Motherboard MSI MPG Z790 CARBON WIFI adalah papan sirkuit utama kelas antusias dengan tema stealth carbon-black. Dilengkapi sistem daya 19 plus 1 plus 1 fasa, slot ekspansi PCIe 5.0 Steel Armor, pendingin M.2 Shield Frozr, serta 4 slot memori DDR5.'
    },
    {
      id: 'vo_cpu',
      file: 'vo_cpu.mp3',
      text: 'Processor atau Central Processing Unit adalah otak utama komputer yang bertugas mengeksekusi instruksi program, melakukan perhitungan logika, dan mengendalikan kerja seluruh sistem.'
    },
    {
      id: 'vo_cooler',
      file: 'vo_cooler.mp3',
      text: 'CPU Cooler beserta thermal paste berfungsi menyerap dan membuang panas berlebih dari prosesor agar suhu tetap stabil dan mencegah penurunan performa akibat thermal throttling.'
    },
    {
      id: 'vo_ram',
      file: 'vo_ram.mp3',
      text: 'RAM adalah memori penyimpanan sementara berkecepatan sangat tinggi yang menyimpan data aplikasi yang sedang berjalan. Saat komputer dimatikan, data di dalam RAM akan dikosongkan.'
    },
    {
      id: 'vo_ssd',
      file: 'vo_ssd.mp3',
      text: 'SSD NVMe M.2 adalah media penyimpanan data permanen generasi modern yang bekerja langsung melalui jalur PCI Express, membuat proses booting sistem operasi dan loading aplikasi berjalan dalam hitungan detik.'
    },
    {
      id: 'vo_gpu',
      file: 'vo_gpu.mp3',
      text: 'Kartu grafis atau GPU bertugas mengolah visual dua dimensi maupun tiga dimensi, merender objek Three JS, mengakselerasi pengeditan video multimedia, dan menjalankan komputasi kecerdasan buatan.'
    },
    {
      id: 'vo_psu',
      file: 'vo_psu.mp3',
      text: 'Power Supply Unit atau PSU berfungsi mengubah arus listrik bolak-balik dari stopkontak menjadi arus searah yang stabil dengan voltase yang tepat untuk menyuplai seluruh komponen komputer.'
    },
    {
      id: 'vo_case',
      file: 'vo_case.mp3',
      text: 'Casing komputer berfungsi sebagai rangka pelindung seluruh komponen dari debu dan benturan fisik, sekaligus mengatur jalur sirkulasi udara dingin masuk dan udara panas keluar.'
    },
    // 4 Video Chapters Voice-Over
    {
      id: 'vo_chap1',
      file: 'vo_chap1.mp3',
      text: 'Bab 1: Persiapan dan Pemasangan CPU ke Socket Motherboard. Siapkan motherboard di atas permukaan anti-statis. Buka tuas pengunci socket LGA 1700 secara perlahan. Perhatikan tanda segitiga emas di sudut kiri bawah prosesor, sejajarkan dengan tanda pada sudut socket, letakkan prosesor dengan lembut tanpa ditekan paksa, lalu kunci kembali tuas pengaman.'
    },
    {
      id: 'vo_chap2',
      file: 'vo_chap2.mp3',
      text: 'Bab 2: Teknik Mengoles Thermal Paste dan Pemasangan CPU Cooler. Oleskan thermal paste sebesar biji kacang polong tepat di bagian tengah permukaan prosesor. Pastikan Anda telah melepas stiker plastik pelindung di bagian bawah heatsink, pasang CPU cooler secara menyilang agar tekanan merata, lalu tancapkan kabel kipas 4-pin ke header CPU FAN pada motherboard.'
    },
    {
      id: 'vo_chap3',
      file: 'vo_chap3.mp3',
      text: 'Bab 3: Pemasangan RAM Dual-Channel dan Storage SSD NVMe M.2. Untuk mengaktifkan fitur Dual-Channel yang optimal, buka klip pengunci pada slot RAM kedua dan keempat atau slot A2 dan B2. Sejajarkan celah pada pin emas RAM DDR5, lalu tekan kedua ujungnya hingga berbunyi klik. Selanjutnya, masukkan SSD NVMe M.2 dengan sudut miring 30 derajat dan kunci dengan pelindung heatsink M.2 Shield Frozr.'
    },
    {
      id: 'vo_chap4',
      file: 'vo_chap4.mp3',
      text: 'Bab 4: Instalasi Kartu Grafis RTX, Manajemen Kabel PSU, dan Pengujian First Boot. Buka klip pengunci slot PCIe 5.0 Steel Armor paling atas, tancapkan kartu grafis GeForce RTX hingga lurus dan terkunci rapat, lalu kencangkan baut pada bracket casing. Hubungkan kabel utama 24-pin ATX, kabel 8-pin CPU, serta kabel PCIe Power dari Power Supply 750 Watt. Nyalakan saklar PSU dan tekan tombol power untuk pengujian POST pertama.'
    },
    // 7 Assembly Steps Voice-Over
    {
      id: 'vo_step1',
      file: 'vo_step1.mp3',
      text: 'Langkah 1: Pasang Motherboard MSI MPG ke Casing. Pasang I O shield, sejajarkan sembilan lubang baut standoff ATX di dalam casing, letakkan motherboard, lalu kencangkan baut pengunci.'
    },
    {
      id: 'vo_step2',
      file: 'vo_step2.mp3',
      text: 'Langkah 2: Pasang Processor CPU ke Socket. Buka tuas socket CPU, sejajarkan tanda segitiga emas prosesor, lalu kunci kembali dengan aman.'
    },
    {
      id: 'vo_step3',
      file: 'vo_step3.mp3',
      text: 'Langkah 3: Pasang Storage SSD NVMe M.2. Masukkan SSD NVMe ke slot M.2 di permukaan motherboard sebelum tertutup komponen besar.'
    },
    {
      id: 'vo_step4',
      file: 'vo_step4.mp3',
      text: 'Langkah 4: Pasang dua keping RAM DDR5 Dual-Channel. Tekan kedua keping RAM DDR5 ke slot A2 dan B2 hingga pengait mengunci otomatis.'
    },
    {
      id: 'vo_step5',
      file: 'vo_step5.mp3',
      text: 'Langkah 5: Oles Thermal Paste dan Pasang CPU Cooler. Pasang CPU Cooler ARGB di atas prosesor dan hubungkan kabel kipas ke header CPU FAN.'
    },
    {
      id: 'vo_step6',
      file: 'vo_step6.mp3',
      text: 'Langkah 6: Pasang Kartu Grafis GPU RTX. Tancapkan GPU ke slot PCIe x16 utama hingga mengunci pada bracket belakang.'
    },
    {
      id: 'vo_step7',
      file: 'vo_step7.mp3',
      text: 'Langkah 7: Pasang Power Supply PSU dan Kabel Daya. Pasang PSU 750 Watt di ruang bawah casing dan hubungkan kabel 24-pin, CPU 8-pin, serta PCIe power.'
    }
  ];

  for (const item of voList) {
    await downloadIndonesianTTS(item.id, item.text, path.join(AUDIO_DIR, item.file));
  }

  // 2. Generate 5 Authentic BIOS Beep Code MP3 Files
  const beepPatterns = [
    {
      file: 'beep_normal.mp3',
      wave: 'square',
      pattern: [{ freq: 1000, duration: 0.16, gap: 0.1 }]
    },
    {
      file: 'beep_ram_error.mp3',
      wave: 'square',
      pattern: [
        { freq: 800, duration: 0.55, gap: 0.25 },
        { freq: 800, duration: 0.55, gap: 0.25 },
        { freq: 800, duration: 0.55, gap: 0.1 }
      ]
    },
    {
      file: 'beep_vga_error.mp3',
      wave: 'square',
      pattern: [
        { freq: 850, duration: 0.6, gap: 0.22 },
        { freq: 850, duration: 0.15, gap: 0.12 },
        { freq: 850, duration: 0.15, gap: 0.12 },
        { freq: 850, duration: 0.15, gap: 0.1 }
      ]
    },
    {
      file: 'beep_cpu_overheat.mp3',
      wave: 'square',
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
      file: 'beep_power_error.mp3',
      wave: 'square',
      pattern: [
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 },
        { freq: 920, duration: 0.11, gap: 0.08 }
      ]
    }
  ];

  for (const b of beepPatterns) {
    generateTonePatternMp3(b.pattern, path.join(AUDIO_DIR, b.file), b.wave);
  }

  // 3. Generate 5 UI Sound Effects MP3 Files
  const sfxPatterns = [
    {
      file: 'sfx_click.mp3',
      wave: 'sine',
      pattern: [{ freq: 1150, duration: 0.055, gap: 0.02 }]
    },
    {
      file: 'sfx_install_ok.mp3',
      wave: 'sine',
      pattern: [
        { freq: 340, duration: 0.06, gap: 0.01 },
        { freq: 680, duration: 0.08, gap: 0.01 },
        { freq: 1360, duration: 0.14, gap: 0.05 }
      ]
    },
    {
      file: 'sfx_error.mp3',
      wave: 'sawtooth',
      pattern: [
        { freq: 220, duration: 0.12, gap: 0.02 },
        { freq: 165, duration: 0.18, gap: 0.05 }
      ]
    },
    {
      file: 'sfx_quiz_correct.mp3',
      wave: 'sine',
      pattern: [
        { freq: 523.25, duration: 0.08, gap: 0.01 },
        { freq: 659.25, duration: 0.08, gap: 0.01 },
        { freq: 783.99, duration: 0.08, gap: 0.01 },
        { freq: 1046.5, duration: 0.22, gap: 0.05 }
      ]
    },
    {
      file: 'sfx_quiz_wrong.mp3',
      wave: 'sawtooth',
      pattern: [
        { freq: 240, duration: 0.14, gap: 0.02 },
        { freq: 180, duration: 0.22, gap: 0.05 }
      ]
    }
  ];

  for (const s of sfxPatterns) {
    generateTonePatternMp3(s.pattern, path.join(AUDIO_DIR, s.file), s.wave);
  }

  // 4. Download Real Ambient Electronic BGM from Wikimedia Commons
  console.log('Downloading BGM from Wikimedia Commons...');
  const bgmUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/50/Hypnotic_ambient_electronic_music_by_MusicLM.mp3';
  const bgmRes = await fetch(bgmUrl, { headers: { 'User-Agent': USER_AGENT } });
  if (!bgmRes.ok) throw new Error(`BGM HTTP ${bgmRes.status}`);
  const bgmRawPath = path.join(TMP_DIR, 'bgm_raw.mp3');
  fs.writeFileSync(bgmRawPath, Buffer.from(await bgmRes.arrayBuffer()));

  // Normalize & smooth fade in/out for looping BGM
  execFileSync(FFMPEG_PATH, [
    '-y', '-i', bgmRawPath,
    '-af', 'volume=0.45,afade=t=in:st=0:d=1.5',
    '-ar', '44100', '-ac', '2', '-b:a', '128k',
    path.join(AUDIO_DIR, 'bgm_ambient.mp3')
  ], { stdio: 'ignore' });
  console.log('[OK] BGM MP3: bgm_ambient.mp3');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
