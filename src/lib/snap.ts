// 빌드 시 public/images/photography/snap/<도시>/ 폴더를 읽어 도시별 책을 만듭니다.
// 가로로 긴 사진은 양면(풀 스프레드)으로, 세로 사진은 두 장씩 좌/우 페이지로 배치.
// (서버 전용 — node:fs + sharp 사용)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export type Cell = { src: string; mode: "c-single" | "c-fl" | "c-fr" } | null;
export type Spread = { l: Cell; r: Cell };
export type SnapBook = { city: string; title: string; spreads: Spread[] };

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const natSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

let cached: SnapBook[] | null = null;

async function isWide(file: string): Promise<boolean> {
  try {
    const m = await sharp(file).metadata();
    let w = m.width || 0;
    let h = m.height || 0;
    if (m.orientation && m.orientation >= 5) {
      const t = w;
      w = h;
      h = t; // EXIF 90°/270° 보정
    }
    return h > 0 && w > h * 1.1; // 가로가 세로보다 10%+ 크면 가로 사진
  } catch {
    return false;
  }
}

export async function getSnapBooks(): Promise<SnapBook[]> {
  if (cached) return cached;
  const root = path.join(process.cwd(), "public/images/photography/snap");
  let cities: string[] = [];
  try {
    cities = fs
      .readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort(natSort);
  } catch {
    cached = [];
    return cached;
  }

  // 맨 아래 줄로 내릴 도시 (좌 → 우 순서). 나머지는 이름순 유지.
  const BOTTOM = ["gyeongju", "gunsan"];
  const isBottom = (c: string) => BOTTOM.includes(c.toLowerCase());
  const bottom = BOTTOM.map((name) =>
    cities.find((c) => c.toLowerCase() === name)
  ).filter((c): c is string => Boolean(c));
  cities = [...cities.filter((c) => !isBottom(c)), ...bottom];

  const books: SnapBook[] = [];
  for (const city of cities) {
    const dir = path.join(root, city);
    const files = fs
      .readdirSync(dir)
      .filter((f) => EXTS.has(path.extname(f).toLowerCase()))
      .sort(natSort);

    const cells: { src: string; wide: boolean }[] = [];
    for (const f of files) {
      const wide = await isWide(path.join(dir, f));
      cells.push({
        src: `/thumbs/photography/snap/${city}/${encodeURIComponent(f)}`,
        wide,
      });
    }

    // 가로 = 양면 통째(안 잘림), 세로 = 두 장씩 좌/우.
    // 대기 중인 세로 한 장은 (가로가 사이에 껴도) 다음 세로와 짝지어 빈 페이지를 없앰.
    const spreads: Spread[] = [];
    let pending: string | null = null; // 짝을 기다리는 세로 사진

    for (const c of cells) {
      if (c.wide) {
        spreads.push({
          l: { src: c.src, mode: "c-fl" },
          r: { src: c.src, mode: "c-fr" },
        });
      } else if (pending) {
        spreads.push({
          l: { src: pending, mode: "c-single" },
          r: { src: c.src, mode: "c-single" },
        });
        pending = null;
      } else {
        pending = c.src;
      }
    }
    // 마지막에 짝 못 찾은 세로 한 장 (책당 최대 1장)
    if (pending) {
      spreads.push({ l: { src: pending, mode: "c-single" }, r: null });
    }

    if (spreads.length) {
      books.push({
        city,
        title: city.charAt(0).toUpperCase() + city.slice(1),
        spreads,
      });
    }
  }
  cached = books;
  return cached;
}
