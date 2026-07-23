// 제품 상세페이지용: cover 경로가 속한 폴더의 모든 이미지를 읽어옵니다.
// 예: cover '/images/photography/essence/1.jpg' → essence 폴더의 나머지 사진 전부.
// (서버 전용 — node:fs). 폴더에 사진을 넣으면 상세페이지에 자동 추가됩니다.
import fs from "node:fs";
import path from "node:path";

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const natSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

/** cover가 속한 폴더의 이미지 전부 (커버 파일은 상단에 이미 크게 나오므로 제외) */
export function getProductImages(coverPath: string): string[] {
  if (!coverPath.startsWith("/images/")) return [];
  const rel = coverPath.replace(/^\//, ""); // images/photography/essence/1.jpg
  const dirRel = path.posix.dirname(rel); // images/photography/essence
  const coverFile = path.posix.basename(rel); // 1.jpg
  const dirAbs = path.join(process.cwd(), "public", dirRel);

  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dirAbs)
      .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
      .sort(natSort);
  } catch {
    return [];
  }

  return files
    .filter((f) => f !== coverFile) // 커버 중복 제외
    .map((f) => `/${dirRel}/${encodeURIComponent(f)}`);
}
