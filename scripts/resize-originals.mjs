// public/images/** 의 원본 이미지를 웹용(최대 2000px)으로 줄여 제자리에 덮어씁니다.
// EXIF 방향을 baked-in(.rotate()) 하고, 결과가 원본보다 작을 때만 덮어씁니다.
// ⚠️ 파괴적 작업 — 실행 전 원본을 백업하세요. (npm run resize)
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const DIR = path.resolve("public/images");
const MAX = 2000; // 가장 긴 변 최대 픽셀
const JPG_Q = 82;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walk(dir) {
  let out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(await walk(full));
    else if (EXTS.has(path.extname(e.name).toLowerCase())) out.push(full);
  }
  return out;
}

const files = await walk(DIR);
let changed = 0,
  before = 0,
  after = 0;

for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  const orig = await fs.readFile(f);
  before += orig.length;
  try {
    let pipe = sharp(orig, { failOn: "none" })
      .rotate() // EXIF 방향 적용
      .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true });
    if (ext === ".png") pipe = pipe.png({ compressionLevel: 9, effort: 8 });
    else if (ext === ".webp") pipe = pipe.webp({ quality: JPG_Q });
    else pipe = pipe.jpeg({ quality: JPG_Q, mozjpeg: true });
    const buf = await pipe.toBuffer();
    if (buf.length < orig.length) {
      await fs.writeFile(f, buf);
      after += buf.length;
      changed++;
    } else {
      after += orig.length; // 이미 충분히 작음 → 유지
    }
  } catch (e) {
    after += orig.length;
    console.warn("skip", f, e.message);
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + "MB";
console.log(
  `[resize] ${changed}/${files.length} 축소 · ${mb(before)} → ${mb(after)}`
);
