// 빌드 시 public/images/banding/ 폴더(브랜드북 아트보드)를 읽어 순서대로 나열합니다.
// 폴더에 이미지를 넣으면 자동으로 세로 목록에 추가됩니다. (서버 전용 — node:fs)
import fs from "node:fs";
import path from "node:path";

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const natSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

export type BrandImage = { thumb: string; full: string; name: string };

export function getBrandingImages(): BrandImage[] {
  const dir = path.join(process.cwd(), "public/images/banding");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
      .sort(natSort);
  } catch {
    return [];
  }
  return files.map((f) => ({
    name: path.basename(f, path.extname(f)),
    thumb: `/thumbs/banding/${encodeURIComponent(f)}`,
    full: `/images/banding/${encodeURIComponent(f)}`,
  }));
}
