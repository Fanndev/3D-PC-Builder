/**
 * Script Pembuat Aset Video Tutorial Perakitan PC (Terverifikasi Frame-by-Frame per Bab)
 * Sumber Video Open-License (Creative Commons CC-BY 3.0 - Wikimedia Commons):
 * File:Legendary Fractal Torrent Airflow Case PC Build. (Intel i7-14700kf - RTX 4070 Ti Super).webm
 *
 * Pemetaan Timestamp Visual (Diverifikasi melalui Contact Sheet Frame-by-Frame):
 * - Bab 1 (Persiapan Motherboard & Pemasangan CPU ke Socket LGA1700):
 *   Segmen 00:42 - 01:16 (34 detik: Buka box mobo, buka pengunci socket LGA1700, pasang CPU Intel Core i7, kunci socket)
 * - Bab 2 (Teknik Mengoles Thermal Paste & Pemasangan CPU Cooler):
 *   Segmen A: 01:58 - 02:31 (33 detik: Pasang bracket cooler, oles thermal paste pada IHS CPU, pasang heatsink tower & kencangkan baut)
 *   Segmen B: 02:56 - 03:18 (22 detik: Pasang kipas PWM pada heatsink tower & colok kabel 4-pin ke CPU_FAN)
 * - Bab 3 (Pemasangan RAM Dual-Channel DDR5 & Storage SSD NVMe M.2):
 *   Segmen A (RAM DDR5 Dual-Channel): 02:32 - 02:54 (22 detik: Buka klip slot A2 & B2, tekan 2 keping RAM DDR5 RGB hingga klik)
 *   Segmen B (SSD NVMe M.2): 01:18 - 01:39 (21 detik: Buka heatsink M.2, pasang SSD NVMe M.2 miring 30 derajat, baut & pasang heatsink)
 * - Bab 4 (Instalasi GPU RTX, Manajemen Kabel PSU & Pengujian First Boot):
 *   Segmen A (Instalasi GPU RTX ke Slot PCIe x16): 06:16 - 06:40 (24 detik: Pasang GPU ASUS TUF RTX 4070 Ti Super ke slot PCIe x16 & baut bracket)
 *   Segmen B (Instalasi PSU Modular & Kabel 24-Pin/PCIe): 06:53 - 07:26 (33 detik: Pasang kabel modular PSU 80+ Gold, pasang PSU & colok kabel 24-pin + GPU)
 *   Segmen C (First Boot & Uji Nyala Sistem): 08:05 - 08:23 (18 detik: PC menyala normal, kipas berputar, lampu RGB aktif & uji airflow)
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const FFMPEG_PATH = 'C:\\Users\\MyBook Hype AMD\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';
const FFPROBE_PATH = 'C:\\Users\\MyBook Hype AMD\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffprobe.exe';

const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT_DIR, 'assets', 'audio');
const VIDEO_DIR = path.join(ROOT_DIR, 'assets', 'video');
const INSPECT_DIR = path.join(ROOT_DIR, 'assets', '_inspect');
const TMP_DIR = path.join(ROOT_DIR, 'assets', '_tmp_vid');

fs.mkdirSync(VIDEO_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const USER_AGENT = 'PCBuilder101_UTS_Edu/1.0 (https://github.com/Fanndev/3D-PC-Builder; poloking52980@gmail.com)';
const SOURCE_URL = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c7/Legendary_Fractal_Torrent_Airflow_Case_PC_Build._%28Intel_i7-14700kf_-_RTX_4070_Ti_Super%29.webm/Legendary_Fractal_Torrent_Airflow_Case_PC_Build._%28Intel_i7-14700kf_-_RTX_4070_Ti_Super%29.webm.480p.vp9.webm';

function getDurationSec(filePath) {
  const out = execFileSync(FFPROBE_PATH, [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    filePath
  ], { encoding: 'utf8' }).trim();
  return parseFloat(out) || 20;
}

async function ensureSourceVideo() {
  const cachedInspect = path.join(INSPECT_DIR, 'archetype_build_542s.webm');
  if (fs.existsSync(cachedInspect) && fs.statSync(cachedInspect).size > 1000000) {
    console.log('[CACHED] Using verified source video:', cachedInspect);
    return cachedInspect;
  }
  const dest = path.join(TMP_DIR, 'archetype_build_542s.webm');
  console.log('Downloading verified source video from Wikimedia Commons...');
  const res = await fetch(SOURCE_URL, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return dest;
}

/**
 * Extracts one or more time ranges from the source video, concatenates their video streams,
 * and mixes with Indonesian Voice-Over narration + ambient BGM.
 */
function buildMultiSegmentChapterMp4({ srcVideo, segments, voAudioPath, bgmAudioPath, outputMp4Path, label }) {
  const voDur = getDurationSec(voAudioPath);

  // Build filter_complex to trim and concat all visual segments cleanly
  const filterParts = [];
  const concatInputs = [];
  let totalRawDur = 0;

  segments.forEach((seg, idx) => {
    const dur = seg.end - seg.start;
    totalRawDur += dur;
    filterParts.push(
      `[0:v]trim=start=${seg.start}:end=${seg.end},setpts=PTS-STARTPTS,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x060913,setsar=1,fps=30[v${idx}]`
    );
    concatInputs.push(`[v${idx}]`);
  });

  const finalDur = totalRawDur;
  filterParts.push(
    `${concatInputs.join('')}concat=n=${segments.length}:v=1:a=0,fade=t=in:st=0:d=0.5,fade=t=out:st=${(finalDur - 0.7).toFixed(2)}:d=0.7[vout]`
  );

  // Audio mix: Voice-Over padded to finalDur + low ambient BGM
  filterParts.push(
    `[1:a]aresample=44100,volume=1.4,apad=whole_dur=${finalDur}[vo]`
  );
  filterParts.push(
    `[2:a]aresample=44100,volume=0.14,afade=t=in:st=0:d=0.8,afade=t=out:st=${(finalDur - 0.9).toFixed(2)}:d=0.9[bgm]`
  );
  filterParts.push(
    `[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]`
  );

  execFileSync(FFMPEG_PATH, [
    '-y',
    '-i', srcVideo,
    '-i', voAudioPath,
    '-stream_loop', '-1',
    '-t', String(finalDur),
    '-i', bgmAudioPath,
    '-filter_complex', filterParts.join(';'),
    '-map', '[vout]',
    '-map', '[aout]',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-t', String(finalDur),
    outputMp4Path
  ], { stdio: 'ignore' });

  const outDur = getDurationSec(outputMp4Path);
  const sizeMb = (fs.statSync(outputMp4Path).size / 1024 / 1024).toFixed(2);
  console.log(`[OK] ${label}: ${path.basename(outputMp4Path)} (${outDur.toFixed(1)}s, VO: ${voDur.toFixed(1)}s, ${sizeMb} MB)`);
}

async function main() {
  const srcVideo = await ensureSourceVideo();
  const bgmPath = path.join(AUDIO_DIR, 'bgm_ambient.mp3');

  const chap1Path = path.join(VIDEO_DIR, 'bab1_cpu_mobo.mp4');
  const chap2Path = path.join(VIDEO_DIR, 'bab2_cooler_thermal.mp4');
  const chap3Path = path.join(VIDEO_DIR, 'bab3_ram_ssd.mp4');
  const chap4Path = path.join(VIDEO_DIR, 'bab4_gpu_psu_boot.mp4');

  // BAB 1: Persiapan Motherboard & Pemasangan CPU ke Socket (42s -> 76s)
  buildMultiSegmentChapterMp4({
    srcVideo,
    segments: [
      { start: 42, end: 76 }
    ],
    voAudioPath: path.join(AUDIO_DIR, 'vo_chap1.mp3'),
    bgmAudioPath: bgmPath,
    outputMp4Path: chap1Path,
    label: 'Bab 1 (Persiapan Motherboard & Pemasangan CPU ke Socket)'
  });

  // BAB 2: Teknik Mengoles Thermal Paste & Pemasangan CPU Cooler (118s -> 151s + 176s -> 196s)
  buildMultiSegmentChapterMp4({
    srcVideo,
    segments: [
      { start: 118, end: 151 }, // Bracket cooler, oles thermal paste di atas CPU, pasang heatsink tower & baut
      { start: 176, end: 196 }  // Pasang kipas PWM ke heatsink & colok kabel 4-pin CPU_FAN
    ],
    voAudioPath: path.join(AUDIO_DIR, 'vo_chap2.mp3'),
    bgmAudioPath: bgmPath,
    outputMp4Path: chap2Path,
    label: 'Bab 2 (Teknik Mengoles Thermal Paste & Pemasangan CPU Cooler)'
  });

  // BAB 3: Pemasangan RAM Dual-Channel & SSD NVMe M.2 (158s -> 173.5s + 77s -> 99.5s)
  buildMultiSegmentChapterMp4({
    srcVideo,
    segments: [
      { start: 158, end: 173.5 }, // Pasang 2 keping RAM DDR5 RGB Dual-Channel di slot A2 & B2
      { start: 77, end: 99.5 }    // Buka M.2 heatsink, pasang SSD NVMe M.2 miring 30 derajat & baut kembali
    ],
    voAudioPath: path.join(AUDIO_DIR, 'vo_chap3.mp3'),
    bgmAudioPath: bgmPath,
    outputMp4Path: chap3Path,
    label: 'Bab 3 (Pemasangan RAM Dual-Channel & SSD NVMe M.2)'
  });

  // BAB 4: Instalasi GPU RTX, Manajemen Kabel PSU & First Boot (374s -> 400s + 414s -> 446s + 486s -> 504s)
  buildMultiSegmentChapterMp4({
    srcVideo,
    segments: [
      { start: 374, end: 400 }, // Pasang Kartu Grafis GeForce RTX ke slot PCIe x16 & kencangkan baut bracket
      { start: 414, end: 446 }, // Pasang kabel modular PSU 80+ Gold, pasang PSU ke casing, sambung 24-pin ATX & PCIe
      { start: 486, end: 504 }  // First Boot: PC menyala, kipas & RGB aktif, pengujian airflow
    ],
    voAudioPath: path.join(AUDIO_DIR, 'vo_chap4.mp3'),
    bgmAudioPath: bgmPath,
    outputMp4Path: chap4Path,
    label: 'Bab 4 (Instalasi GPU RTX, Manajemen Kabel PSU & First Boot)'
  });

  // Concatenate all 4 chapters into complete tutorial_rakit_pc.mp4
  const concatListPath = path.join(TMP_DIR, 'video_concat_list.txt');
  const concatContent = [chap1Path, chap2Path, chap3Path, chap4Path]
    .map(p => `file '${p.replace(/\\/g, '/')}'`)
    .join('\n');
  fs.writeFileSync(concatListPath, concatContent, 'utf8');

  const fullVideoPath = path.join(VIDEO_DIR, 'tutorial_rakit_pc.mp4');
  execFileSync(FFMPEG_PATH, [
    '-y', '-f', 'concat', '-safe', '0', '-i', concatListPath,
    '-c', 'copy',
    '-movflags', '+faststart',
    fullVideoPath
  ], { stdio: 'ignore' });

  const fullDur = getDurationSec(fullVideoPath);
  const fullSizeMb = (fs.statSync(fullVideoPath).size / 1024 / 1024).toFixed(2);
  console.log(`[OK] Full Tutorial Video: tutorial_rakit_pc.mp4 (${fullDur.toFixed(1)}s, ${fullSizeMb} MB)`);

  // Generate verification contact sheet of the 4 built chapter videos
  for (const [idx, p] of [chap1Path, chap2Path, chap3Path, chap4Path].entries()) {
    execFileSync(FFMPEG_PATH, [
      '-y', '-i', p,
      '-vf', 'fps=1/5,scale=320:180,tile=4x3',
      '-frames:v', '1',
      path.join(TMP_DIR, `verify_bab${idx + 1}.jpg`)
    ], { stdio: 'ignore' });
  }
  console.log('[OK] Generated verification thumbnails for Bab 1 - Bab 4.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
