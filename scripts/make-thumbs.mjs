// public/images/** 의 이미지를 public/thumbs/** 로 작게(최대 900px) 자동 생성합니다.
// 캐러셀/썸네일은 이 작은 이미지를 사용해 또렷하고 가볍게 보입니다. (원본은 상세용)
// npm run dev / npm run build 시 자동 실행됩니다 (predev / prebuild).
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve("public/images");
const OUT_DIR = path.resolve("public/thumbs");
const MAX_W = 900;          // 썸네일 최대 가로폭
const QUALITY = 80;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walk(dir) {
  let files = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(await walk(full));
    else if (EXTS.has(path.extname(e.name).toLowerCase())) files.push(full);
  }
  return files;
}

async function newer(a, b) {
  // a(원본)가 b(썸네일)보다 새로우면 true → 다시 생성 필요
  try {
    const [sa, sb] = await Promise.all([fs.stat(a), fs.stat(b)]);
    return sa.mtimeMs > sb.mtimeMs;
  } catch {
    return true; // 썸네일 없음 → 생성
  }
}

const files = await walk(SRC_DIR);
let made = 0;
for (const src of files) {
  const rel = path.relative(SRC_DIR, src);
  const out = path.join(OUT_DIR, rel);
  if (!(await newer(src, out))) continue;
  await fs.mkdir(path.dirname(out), { recursive: true });
  const ext = path.extname(src).toLowerCase();
  // .rotate() = EXIF 방향 자동 적용(회전 baked-in) 후 EXIF 태그 제거 → 눕힘 방지
  let pipe = sharp(src).rotate().resize({ width: MAX_W, withoutEnlargement: true });
  if (ext === ".png") pipe = pipe.png({ quality: QUALITY });
  else if (ext === ".webp") pipe = pipe.webp({ quality: QUALITY });
  else pipe = pipe.jpeg({ quality: QUALITY });
  await pipe.toFile(out);
  made++;
}

// 원본이 사라진(이름 변경/삭제) 썸네일은 정리 → 엑박/혼선 방지
let pruned = 0;
for (const t of await walk(OUT_DIR)) {
  const rel = path.relative(OUT_DIR, t);
  try {
    await fs.access(path.join(SRC_DIR, rel));
  } catch {
    await fs.rm(t).catch(() => {});
    pruned++;
  }
}

console.log(
  `[thumbs] ${made} generated, ${files.length - made} up-to-date, ${pruned} pruned → public/thumbs/`
);
