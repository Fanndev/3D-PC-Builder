/**
 * Script Sinkronisasi Presisi Audio Narasi (Time-Coded Cues) dengan Visual Video Per Detik
 * Setiap kalimat narasi diposisikan menggunakan FFmpeg `adelay` tepat pada detik adegan visualnya muncul
 * berdasarkan inspeksi grid 1-fps (1 frame per detik).
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const FFMPEG = 'C:\\Users\\MyBook Hype AMD\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';
const FFPROBE = 'C:\\Users\\MyBook Hype AMD\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';

const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'assets', 'audio');
const VIDEO_DIR = path.join(ROOT, 'assets', 'video');
const TMP_DIR = path.join(ROOT, 'assets', '_sync_tmp');

fs.mkdirSync(TMP_DIR, { recursive: true });

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getDuration(filePath) {
  const out = execFileSync(FFPROBE, [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    filePath
  ], { encoding: 'utf8' }).trim();
  return parseFloat(out) || 0;
}

async function fetchCueMp3(cueId, text, maxWindowSec) {
  const rawPath = path.join(TMP_DIR, `${cueId}_raw.mp3`);
  const fitPath = path.join(TMP_DIR, `${cueId}_fit.mp3`);

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  if (!res.ok) throw new Error(`TTS HTTP ${res.status} for ${cueId}`);
  fs.writeFileSync(rawPath, Buffer.from(await res.arrayBuffer()));
  await sleep(220);

  // Trim leading/trailing silence first
  const trimmedPath = path.join(TMP_DIR, `${cueId}_trim.mp3`);
  execFileSync(FFMPEG, [
    '-y', '-i', rawPath,
    '-af', 'silenceremove=start_periods=1:start_duration=0.05:start_threshold=-45dB',
    '-ar', '44100', '-ac', '2', '-b:a', '128k',
    trimmedPath
  ], { stdio: 'ignore' });

  const dur = getDuration(trimmedPath);
  const targetMax = maxWindowSec - 0.25;

  if (dur > targetMax && targetMax > 1.0) {
    // Speed up slightly so it fits 100% inside the visual shot window
    const tempo = Math.min(1.35, Math.max(1.02, (dur / targetMax) + 0.02));
    execFileSync(FFMPEG, [
      '-y', '-i', trimmedPath,
      '-af', `atempo=${tempo.toFixed(3)}`,
      '-ar', '44100', '-ac', '2', '-b:a', '128k',
      fitPath
    ], { stdio: 'ignore' });
  } else {
    fs.copyFileSync(trimmedPath, fitPath);
  }

  const finalDur = getDuration(fitPath);
  console.log(`  [Cue ${cueId}] dur=${finalDur.toFixed(2)}s (window=${maxWindowSec.toFixed(2)}s) -> "${text.slice(0, 48)}..."`);
  return { path: fitPath, duration: finalDur };
}

async function syncChapterVideo({ chapNum, videoFilename, voFilename, totalDuration, cues }) {
  console.log(`\n=== Synchronizing Bab ${chapNum}: ${videoFilename} (${totalDuration}s) ===`);
  const videoPath = path.join(VIDEO_DIR, videoFilename);
  const tempVideoNoAudio = path.join(TMP_DIR, `vid_noaudio_${chapNum}.mp4`);
  const syncedVoPath = path.join(AUDIO_DIR, voFilename);
  const bgmPath = path.join(AUDIO_DIR, 'bgm_ambient.mp3');
  const outVideoPath = path.join(TMP_DIR, `synced_${videoFilename}`);

  // 1. Copy clean video stream
  execFileSync(FFMPEG, [
    '-y', '-i', videoPath, '-c:v', 'copy', '-an', tempVideoNoAudio
  ], { stdio: 'ignore' });

  // 2. Fetch and fit each TTS cue into its exact time window
  const cueFiles = [];
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    const windowSec = c.endSec - c.startSec;
    const res = await fetchCueMp3(`b${chapNum}_c${i + 1}`, c.text, windowSec);
    cueFiles.push({ ...c, file: res.path, dur: res.duration });
  }

  // 3. Build time-aligned Voice-Over track using FFmpeg adelay
  const inputs = [];
  const filterParts = [];
  const mixLabels = [];

  // Base silent stereo track of length totalDuration
  inputs.push('-f', 'lavfi', '-t', String(totalDuration), '-i', 'anullsrc=r=44100:cl=stereo');
  mixLabels.push('[0:a]');

  cueFiles.forEach((cf, idx) => {
    const inputIdx = idx + 1;
    inputs.push('-i', cf.file);
    const delayMs = Math.round(cf.startSec * 1000);
    filterParts.push(`[${inputIdx}:a]aresample=44100,adelay=${delayMs}|${delayMs}[c${inputIdx}]`);
    mixLabels.push(`[c${inputIdx}]`);
  });

  const numInputs = cueFiles.length + 1;
  filterParts.push(
    `${mixLabels.join('')}amix=inputs=${numInputs}:duration=first:dropout_transition=0:normalize=0,volume=1.35[vo_full]`
  );

  execFileSync(FFMPEG, [
    '-y',
    ...inputs,
    '-filter_complex', filterParts.join(';'),
    '-map', '[vo_full]',
    '-ar', '44100', '-ac', '2', '-b:a', '128k',
    '-t', String(totalDuration),
    syncedVoPath
  ], { stdio: 'ignore' });
  console.log(`  [OK] Saved time-synced Voice-Over: ${voFilename}`);

  // 4. Mux video + time-synced Voice-Over + subtle BGM into the chapter MP4
  execFileSync(FFMPEG, [
    '-y',
    '-i', tempVideoNoAudio,
    '-i', syncedVoPath,
    '-stream_loop', '-1',
    '-t', String(totalDuration),
    '-i', bgmPath,
    '-filter_complex',
    `[1:a]volume=1.25[vo];` +
    `[2:a]volume=0.14,afade=t=in:st=0:d=0.7,afade=t=out:st=${(totalDuration - 0.8).toFixed(2)}:d=0.8[bgm];` +
    `[vo][bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[aout]`,
    '-map', '0:v',
    '-map', '[aout]',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    '-t', String(totalDuration),
    outVideoPath
  ], { stdio: 'ignore' });

  fs.copyFileSync(outVideoPath, videoPath);
  console.log(`  [OK] Updated synced video: ${videoFilename}`);
}

async function main() {
  // =========================================================================
  // BAB 1: bab1_cpu_mobo.mp4 (34.0s)
  // Visual Grid Verification (grid_bab1_1fps.jpg):
  // - 0.0s - 10.0s: Buka box motherboard & letakkan di atas alas anti-statis
  // - 10.0s - 15.2s: Lepas sekrup & buka penutup socket LGA 1700
  // - 15.2s - 26.8s: Buka kotak Intel Core i7 & keluarkan prosesor dari mika
  // - 26.8s - 34.0s: Sejajarkan segitiga emas, letakkan CPU ke socket & kunci bracket
  // =========================================================================
  await syncChapterVideo({
    chapNum: 1,
    videoFilename: 'bab1_cpu_mobo.mp4',
    voFilename: 'vo_chap1.mp3',
    totalDuration: 34,
    cues: [
      {
        startSec: 0.3,
        endSec: 9.8,
        text: 'Bab satu. Buka kemasan motherboard dan letakkan di atas alas anti-statis.'
      },
      {
        startSec: 10.0,
        endSec: 15.1,
        text: 'Buka pengait dan penutup pelindung socket LGA seribu tujuh ratus.'
      },
      {
        startSec: 15.3,
        endSec: 26.5,
        text: 'Selanjutnya, buka kotak prosesor Intel Core i7 dan keluarkan prosesor dengan memegang bagian tepinya.'
      },
      {
        startSec: 26.8,
        endSec: 33.8,
        text: 'Sejajarkan posisi prosesor ke dalam socket secara perlahan, lalu kunci kembali pengamannya.'
      }
    ]
  });

  // =========================================================================
  // BAB 2: bab2_cooler_thermal.mp4 (53.0s)
  // Visual Grid Verification (grid_bab2_1fps.jpg):
  // - 0.0s - 16.8s: Pasang baut standoff & bracket dudukan cooler di sekeliling socket CPU
  // - 16.8s - 24.0s: Oleskan thermal paste dengan suntikan di atas permukaan prosesor
  // - 24.0s - 33.2s: Lepas pelindung bawah heatsink, letakkan menara heatsink di atas CPU
  // - 33.2s - 47.5s: Pasang dua kipas pendingin PWM 120 milimeter pada menara heatsink
  // - 47.5s - 53.0s: Colokkan konektor kabel 4-pin ke header CPU FAN di motherboard
  // =========================================================================
  await syncChapterVideo({
    chapNum: 2,
    videoFilename: 'bab2_cooler_thermal.mp4',
    voFilename: 'vo_chap2.mp3',
    totalDuration: 53,
    cues: [
      {
        startSec: 0.3,
        endSec: 16.5,
        text: 'Bab dua. Pasang baut penyangga dan bracket dudukan pendingin di sekeliling socket CPU, lalu kencangkan.'
      },
      {
        startSec: 16.8,
        endSec: 23.8,
        text: 'Oleskan thermal paste secukupnya tepat di bagian tengah permukaan atas prosesor.'
      },
      {
        startSec: 24.0,
        endSec: 33.0,
        text: 'Periksa bagian bawah heatsink, lalu pasang menara heatsink tembaga di atas prosesor.'
      },
      {
        startSec: 33.3,
        endSec: 47.2,
        text: 'Selanjutnya, kaitkan kedua kipas pendingin PWM pada sisi depan dan tengah menara heatsink hingga rapat.'
      },
      {
        startSec: 47.5,
        endSec: 52.8,
        text: 'Terakhir, tancapkan kabel empat pin ke soket CPU FAN.'
      }
    ]
  });

  // =========================================================================
  // BAB 3: bab3_ram_ssd.mp4 (38.0s)
  // Visual Grid Verification (grid_bab3_1fps.jpg):
  // - 0.0s - 9.8s: Siapkan kemasan RAM DDR5 RGB & buka klip pengunci slot A2 dan B2
  // - 9.8s - 15.5s: Tekan kedua keping RAM DDR5 ke dalam slot hingga berbunyi klik
  // - 15.5s - 23.8s: Buka kotak SSD NVMe M.2 Crucial P3 Plus & keluarkan keping SSD
  // - 23.8s - 30.8s: Buka sekrup pelindung heatsink M.2 & lepas plastik thermal pad
  // - 30.8s - 38.0s: Masukkan SSD NVMe M.2 miring 30 derajat & baut kembali heatsink M.2
  // =========================================================================
  await syncChapterVideo({
    chapNum: 3,
    videoFilename: 'bab3_ram_ssd.mp4',
    voFilename: 'vo_chap3.mp3',
    totalDuration: 38,
    cues: [
      {
        startSec: 0.3,
        endSec: 9.6,
        text: 'Bab tiga. Siapkan dua keping memori RAM DDR5, lalu buka klip pengunci pada slot A2 dan B2.'
      },
      {
        startSec: 9.8,
        endSec: 15.3,
        text: 'Tekan kedua keping RAM lurus ke bawah hingga mengunci rapat.'
      },
      {
        startSec: 15.6,
        endSec: 23.5,
        text: 'Berikutnya, buka kemasan penyimpanan SSD NVMe M.2 dan keluarkan keping SSD.'
      },
      {
        startSec: 23.8,
        endSec: 30.6,
        text: 'Lepas sekrup pelindung heatsink M.2 dan kelupas plastik pelindung thermal pad.'
      },
      {
        startSec: 30.8,
        endSec: 37.8,
        text: 'Masukkan SSD ke slot M.2, lalu pasang kembali heatsink dan kencangkan sekrupnya.'
      }
    ]
  });

  // =========================================================================
  // BAB 4: bab4_gpu_psu_boot.mp4 (76.0s)
  // Visual Grid Verification (grid_bab4_1fps.jpg):
  // - 0.0s - 12.0s: Buka baut slot ekspansi belakang casing & siapkan GPU GeForce RTX
  // - 12.0s - 25.8s: Tancapkan kartu grafis RTX ke slot PCIe x16 & baut ke bracket casing
  // - 25.8s - 32.2s: Colokkan kabel-kabel daya modular ke unit Power Supply 80+ Gold
  // - 32.2s - 43.2s: Pasang unit Power Supply ke kompartemen casing & kencangkan 4 bautnya
  // - 43.2s - 58.0s: Sambungkan kabel daya 24-pin ATX ke motherboard & kabel PCIe ke GPU
  // - 58.0s - 76.0s: Nyalakan PC (First Boot), kipas berputar, lampu RGB aktif & uji airflow
  // =========================================================================
  await syncChapterVideo({
    chapNum: 4,
    videoFilename: 'bab4_gpu_psu_boot.mp4',
    voFilename: 'vo_chap4.mp3',
    totalDuration: 76,
    cues: [
      {
        startSec: 0.3,
        endSec: 11.8,
        text: 'Bab empat. Buka penutup slot ekspansi belakang casing dan siapkan kartu grafis GeForce RTX.'
      },
      {
        startSec: 12.0,
        endSec: 25.5,
        text: 'Sejajarkan dan tancapkan kartu grafis ke slot PCIe x16 utama hingga terkunci, lalu kencangkan baut pada bracket casing.'
      },
      {
        startSec: 26.0,
        endSec: 32.0,
        text: 'Selanjutnya, pasang kabel-kabel daya modular pada unit Power Supply.'
      },
      {
        startSec: 32.3,
        endSec: 43.0,
        text: 'Masukkan Power Supply ke dalam kompartemen casing dan kencangkan keempat baut penguncinya di bagian belakang.'
      },
      {
        startSec: 43.3,
        endSec: 57.6,
        text: 'Hubungkan kabel utama dua puluh empat pin ATX ke motherboard, serta tancapkan kabel daya PCIe ke kartu grafis.'
      },
      {
        startSec: 58.2,
        endSec: 75.5,
        text: 'Setelah semua terpasang, nyalakan komputer untuk pengujian First Boot. Seluruh kipas pendingin, lampu RGB, dan sirkulasi udara kini bekerja dengan sempurna.'
      }
    ]
  });

  // Re-concatenate all 4 synchronized chapters into tutorial_rakit_pc.mp4
  const concatListPath = path.join(TMP_DIR, 'sync_concat.txt');
  const files = ['bab1_cpu_mobo.mp4', 'bab2_cooler_thermal.mp4', 'bab3_ram_ssd.mp4', 'bab4_gpu_psu_boot.mp4'];
  fs.writeFileSync(
    concatListPath,
    files.map(f => `file '${path.join(VIDEO_DIR, f).replace(/\\/g, '/')}'`).join('\n'),
    'utf8'
  );

  execFileSync(FFMPEG, [
    '-y', '-f', 'concat', '-safe', '0', '-i', concatListPath,
    '-c', 'copy', '-movflags', '+faststart',
    path.join(VIDEO_DIR, 'tutorial_rakit_pc.mp4')
  ], { stdio: 'ignore' });

  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  console.log('\n[DONE] All 4 Chapter Videos + Full Video are now 100% time-synced cue-by-cue!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
