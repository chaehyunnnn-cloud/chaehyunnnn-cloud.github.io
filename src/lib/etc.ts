// 빌드 시 public/images/photography/etc/ 폴더를 읽어 이미지 목록을 만듭니다.
// 파일명 숫자(예: 7.jpg)가 콜라주의 칸 번호와 매칭됩니다.
// (서버 전용 — node:fs + sharp). ar = 가로/세로 비율(EXIF 방향 반영).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const natSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

export type EtcImage = { thumb: string; full: string; name: string; ar: number };

export async function getEtcImages(): Promise<EtcImage[]> {
  const dir = path.join(process.cwd(), "public/images/photography/etc");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
      .sort(natSort);
  } catch {
    return [];
  }

  const out: EtcImage[] = [];
  for (const f of files) {
    let ar = 1;
    try {
      const m = await sharp(path.join(dir, f)).metadata();
      let w = m.width || 1;
      let h = m.height || 1;
      if (m.orientation && m.orientation >= 5) {
        const t = w;
        w = h;
        h = t; // EXIF 90°/270° 보정
      }
      if (h > 0) ar = w / h;
    } catch {}
    out.push({
      name: path.basename(f, path.extname(f)),
      thumb: `/thumbs/photography/etc/${encodeURIComponent(f)}`,
      full: `/images/photography/etc/${encodeURIComponent(f)}`,
      ar,
    });
  }
  return out;
}
