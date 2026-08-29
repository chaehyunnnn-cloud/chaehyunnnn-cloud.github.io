// ───────────────────────────────────────────────────────────────────────────
//  포트폴리오 콘텐츠 — 이 파일 한 곳만 수정하면 사이트 전체에 반영됩니다.
//  This single file drives the whole site. Add items below.
// ───────────────────────────────────────────────────────────────────────────

/** 한국어/영어 양쪽 텍스트 */
export type L10n = { ko: string; en: string };

/** 5개 카테고리 (탭). 순서가 화면 순서입니다. */
export const categories = [
  { id: 'photography', label: { ko: '사진', en: 'Photography' } },
  { id: 'video', label: { ko: '영상', en: 'Video' } },
  { id: 'web', label: { ko: '웹디자인', en: 'Web Design' } },
  { id: 'product', label: { ko: '제품디자인', en: 'Product Design' } },
  { id: 'branding', label: { ko: '브랜딩', en: 'Branding' } },
] as const satisfies ReadonlyArray<{ id: string; label: L10n }>;

export type CategoryId = (typeof categories)[number]['id'];

/** '사진' 카테고리의 하위 분류 (제품사진 / 스냅사진 / film / ai). 순서가 화면 순서. */
// 참고: 'etc' id는 내부 라우팅·폴더(images/photography/etc)·콜라주 레이아웃에 쓰이므로 유지하고 라벨만 Film으로 표기.
export const photoSubs = [
  { id: 'product', label: { ko: '제품사진', en: 'Product' } },
  { id: 'snap', label: { ko: '스냅사진', en: 'Snap' } },
  { id: 'etc', label: { ko: '필름', en: 'Film' } },
  { id: 'ai', label: { ko: 'AI', en: 'AI' } },
] as const satisfies ReadonlyArray<{ id: string; label: L10n }>;

export type PhotoSubId = (typeof photoSubs)[number]['id'];
/** 사진 항목에 sub가 없으면 이 값으로 간주 */
export const DEFAULT_PHOTO_SUB: PhotoSubId = 'product';

/** '웹디자인' 카테고리의 하위 분류. 순서가 화면 순서. */
export const webSubs = [
  { id: 'product-detail', label: { ko: '제품 상세페이지', en: 'Product Detail Page' } },
  { id: 'promotion', label: { ko: '프로모션 페이지', en: 'Promotion Page' } },
  { id: 'ui', label: { ko: 'UI 디자인', en: 'UI Design' } },
  { id: 'social', label: { ko: '소셜미디어 콘텐츠', en: 'Social Media Content' } },
] as const satisfies ReadonlyArray<{ id: string; label: L10n }>;

export type WebSubId = (typeof webSubs)[number]['id'];

/** 상세 페이지의 본문 블록. 텍스트/이미지/영상 자유롭게 조합 */
export type Block =
  | { type: 'text'; value: L10n }
  | { type: 'image'; src: string; caption?: L10n }
  | { type: 'video'; src: string; caption?: L10n };
//  video의 src 두 가지 방식:
//   1) 파일: '/videos/clip.mp4' (public/videos/ 에 넣기) — mp4/webm/mov 가능, GIF 불필요
//   2) 임베드: 'https://www.youtube.com/embed/<ID>' (유튜브/비메오)

export type Project = {
  /** URL에 쓰이는 고유 값 (영문/숫자/하이픈). 예: /work/seoul-rooftop */
  slug: string;
  category: CategoryId;
  /**
   * 하위 분류. category가 'photography'면 PhotoSubId(없으면 제품사진),
   * 'web'이면 WebSubId(없으면 어느 하위 분류에도 안 들어감).
   */
  sub?: PhotoSubId | WebSubId;
  title: L10n;
  /** 상세 페이지 상단의 대표(큰) 이미지 — 원본 큰 사진 (public/ 기준 경로 또는 외부 URL) */
  cover: string;
  /**
   * 캐러셀/목록 썸네일용 작은 이미지 (직접 준비한 파일).
   * 지정하면 이 파일을 그대로 사용하고, 없으면 cover를 자동 축소한 썸네일을 씁니다.
   * 예: '/images/lemon/thumb.jpg'
   */
  thumb?: string;
  year?: string;
  client?: L10n;
  role?: L10n;
  /** 목록과 상세 상단에 보이는 한 줄 요약 */
  summary?: L10n;
  /** 상세 페이지 본문 */
  body?: Block[];
};

// ── 항목 추가는 여기서부터 ─────────────────────────────────────────────────
//  이미지는 public/images/ 폴더에 넣고 cover: '/images/파일명.jpg' 처럼 적으면 됩니다.
//  지금은 미리보기용 placeholder 이미지를 사용했습니다.
export const projects: Project[] = [
  {
    slug: 'essence',
    category: 'photography',
    title: { ko: 'essence', en: 'essence' },
    cover: '/images/photography/essence/1.jpg',
    thumb: '/images/photography/essence/essence.jpg',
    year: '2025',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: {
      ko: '도시의 이른 아침, 빛과 그림자에 대한 기록.',
      en: 'A record of light and shadow in the early city morning.',
    },
  },
  {
    slug: 'cleanser',
    category: 'photography',
    title: { ko: 'cleanser', en: 'cleanser' },
    cover: '/images/photography/cleanser/DSC00824.jpg',
    year: '2026',
    client: { ko: '라멜릭스', en: 'Lamelix' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: {
      ko: '일상의 사물을 정물로 다시 바라본 시리즈.',
      en: 'Everyday objects reframed as still life.',
    },
  },
  {
    slug: 'hydro toner',
    category: 'photography',
    title: { ko: 'hydro toner', en: 'hydro toner' },
    cover: '/images/photography/hydrotoner/2.jpg',
    thumb: '/images/photography/hydrotoner/soultoner.jpg',
    year: '2025',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: {
      ko: '높은 곳에서 내려다본 도시의 결.',
      en: 'The texture of the city seen from above.',
    },
  },
  {
    slug: 'cica line',
    category: 'photography',
    title: { ko: 'cica line', en: 'cica line' },
    cover: '/images/photography/cicaline/3.jpg',
    thumb: '/images/photography/cicaline/cicacream.jpg',
    year: '2024',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: {
      ko: '해가 진 직후, 푸른 빛이 도시를 덮는 짧은 시간.',
      en: 'The brief moment after sunset when blue light covers the city.',
    },
  },
  {
    slug: 'eyecream',
    category: 'photography',
    title: { ko: 'eyecream', en: 'eyecream' },
    cover: '/images/photography/eyecream/eyecream2.jpeg',
    thumb: '/images/photography/eyecream/eyecream2.jpeg',
    year: '2025',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: {
      ko: '자연광 아래에서 담은 인물들.',
      en: 'Portraits captured under natural light.',
    },
  },
  {
    slug: 'gel cream',
    category: 'photography',
    title: { ko: 'gel cream', en: 'gel cream' },
    cover: '/images/photography/gelcream/DSC07670.jpg',
    year: '2025',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: {
      ko: '필름 카메라로 담은 거친 질감의 일상.',
      en: 'Everyday life with the rough texture of film.',
    },
  },
  {
    slug: 'pack',
    category: 'photography',
    title: { ko: 'pack', en: 'pack' },
    cover: '/images/photography/pack/6.jpg',
    year: '2026',
    client: { ko: '라멜릭스', en: 'Lamelix' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: { ko: '늦은 오후의 길어진 그림자들.', en: 'Lengthening shadows of late afternoon.' },
  },
  {
    slug: 'ampoule',
    category: 'photography',
    title: { ko: 'ampoule', en: 'ampoule' },
    cover: '/images/photography/ampoule/DSC08847.jpg',
    year: '2025',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: { ko: '바람 없는 날의 수면.', en: 'A water surface on a windless day.' },
  },
  {
    slug: 'serum',
    category: 'photography',
    title: { ko: 'serum', en: 'serum' },
    cover: '/images/photography/serum/DSC03090-2.jpg',
    thumb: '/images/photography/serum/soulserum.jpg',
    year: '2024',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: { ko: '도시의 표면과 질감.', en: 'Surfaces and textures of the city.' },
  },
  {
    slug: 'Lemon',
    category: 'photography',
    title: { ko: 'Lemon', en: 'Lemon' },
    cover: '/images/photography/lemon/DSC03880.jpg',
    thumb: '/images/photography/lemon/lemonserum.jpg',
    year: '2024',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: { ko: '컨셉성분인 레몬을 포인트로 제형 컬러를 강조한 포토그래피 작업.', en: 'Lemon.' },
  },
  {
    slug: 'tone up sun',
    category: 'photography',
    title: { ko: 'tone up sun', en: 'tone up sun' },
    cover: '/images/photography/toneupsun/DSC07996-2.jpg',
    thumb: '/images/photography/toneupsun/cicasun.jpg',
    year: '2025',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: { ko: '불 켜진 거리를 걷다.', en: 'Walking the lit streets at night.' },
  },
  {
    slug: 'butter cream',
    category: 'photography',
    title: { ko: 'butter cream', en: 'butter cream' },
    cover: '/images/photography/buttercream/DSC09391.jpg',
    year: '2025',
    client: { ko: '아네시', en: 'Annecy' },
    role: { ko: '촬영 · 보정 · ai생성 · 합성', en: 'Photography · Retouch · AI · manipulated' },
    summary: { ko: '빛으로 채운 빈 공간.', en: 'An empty space filled with light.' },
  },
  {
    slug: 'vella',
    category: 'photography',
    title: { ko: 'vella', en: 'vella' },
    cover: '/images/photography/vella/DSC01207.JPG',
    year: '2025',
    client: { ko: '벨라', en: 'Vella' },
    role: { ko: '촬영 · 보정', en: 'Photography · Retouch' },
    summary: { ko: '벨라 제품 포토그래피.', en: 'Vella product photography.' },
  },

  // ── [임시] 스냅사진 더미 — 작업 전이라 폴더의 사진을 중복으로 채워둠. 나중에 교체/삭제하세요 ──
  {
    slug: 'snap-1',
    category: 'photography',
    sub: 'snap',
    title: { ko: '스냅 샘플 1', en: 'Snap Sample 1' },
    cover: '/images/photography/lemon/DSC04074.jpg',
    body: [{ type: 'image', src: '/images/photography/lemon/DSC04074.jpg' }],
  },
  {
    slug: 'snap-2',
    category: 'photography',
    sub: 'snap',
    title: { ko: '스냅 샘플 2', en: 'Snap Sample 2' },
    cover: '/images/photography/cicaline/3.jpg',
    body: [{ type: 'image', src: '/images/photography/cicaline/3.jpg' }],
  },
  {
    slug: 'snap-3',
    category: 'photography',
    sub: 'snap',
    title: { ko: '스냅 샘플 3', en: 'Snap Sample 3' },
    cover: '/images/photography/hydrotoner/2.jpg',
    body: [{ type: 'image', src: '/images/photography/hydrotoner/2.jpg' }],
  },
  {
    slug: 'snap-4',
    category: 'photography',
    sub: 'snap',
    title: { ko: '스냅 샘플 4', en: 'Snap Sample 4' },
    cover: '/images/photography/lemon/DSC04156.jpg',
    body: [{ type: 'image', src: '/images/photography/lemon/DSC04156.jpg' }],
  },
  {
    slug: 'snap-5',
    category: 'photography',
    sub: 'snap',
    title: { ko: '스냅 샘플 5', en: 'Snap Sample 5' },
    cover: '/images/photography/gelcream/DSC07670.jpg',
    body: [{ type: 'image', src: '/images/photography/gelcream/DSC07670.jpg' }],
  },

  // ── [임시] etc 더미 — 작업 전이라 폴더의 사진을 중복으로 채워둠. 나중에 교체/삭제하세요 ──
  {
    slug: 'etc-1',
    category: 'photography',
    sub: 'etc',
    title: { ko: '기타 샘플 1', en: 'Etc Sample 1' },
    cover: '/images/photography/lemon/DSC03922.jpg',
    body: [{ type: 'image', src: '/images/photography/lemon/DSC03922.jpg' }],
  },
  {
    slug: 'etc-2',
    category: 'photography',
    sub: 'etc',
    title: { ko: '기타 샘플 2', en: 'Etc Sample 2' },
    cover: '/images/photography/lemon/DSC04168.jpg',
    body: [{ type: 'image', src: '/images/photography/lemon/DSC04168.jpg' }],
  },
  {
    slug: 'etc-3',
    category: 'photography',
    sub: 'etc',
    title: { ko: '기타 샘플 3', en: 'Etc Sample 3' },
    cover: '/images/photography/eyecream/eyecream.jpg',
    body: [{ type: 'image', src: '/images/photography/eyecream/eyecream.jpg' }],
  },
  {
    slug: 'etc-4',
    category: 'photography',
    sub: 'etc',
    title: { ko: '기타 샘플 4', en: 'Etc Sample 4' },
    cover: '/images/photography/gelcream/DSC09159.jpg',
    body: [{ type: 'image', src: '/images/photography/gelcream/DSC09159.jpg' }],
  },
  {
    slug: 'etc-5',
    category: 'photography',
    sub: 'etc',
    title: { ko: '기타 샘플 5', en: 'Etc Sample 5' },
    cover: '/images/photography/lemon/DSC04191-2.jpg',
    body: [{ type: 'image', src: '/images/photography/lemon/DSC04191-2.jpg' }],
  },
  {
    slug: 'city-in-motion',
    category: 'video',
    title: { ko: '움직이는 도시', en: 'City in Motion' },
    cover: 'https://picsum.photos/seed/citymotion/1200/675',
    year: '2025',
    role: { ko: '연출 · 편집', en: 'Direction · Editing' },
    summary: {
      ko: '하루 동안의 도시 리듬을 90초로 압축한 영상.',
      en: 'A 90-second piece compressing one day of city rhythm.',
    },
    body: [
      {
        type: 'video',
        src: 'https://www.youtube.com/embed/aqz-KE-bpKQ',
        caption: { ko: '본편 (90초)', en: 'Main film (90s)' },
      },
    ],
  },
  {
    slug: 'studio-rebrand-site',
    category: 'web',
    title: { ko: '스튜디오 리브랜딩 사이트', en: 'Studio Rebrand Site' },
    cover: 'https://picsum.photos/seed/webseed/1200/900',
    year: '2025',
    client: { ko: '○○ 스튜디오', en: '○○ Studio' },
    role: { ko: 'UI 디자인 · 퍼블리싱', en: 'UI Design · Front-end' },
    summary: {
      ko: '미니멀한 그리드와 큰 타이포로 작업을 돋보이게 한 웹사이트.',
      en: 'A website using a minimal grid and large type to spotlight the work.',
    },
    body: [
      { type: 'image', src: 'https://picsum.photos/seed/web1/1600/1000' },
      { type: 'image', src: 'https://picsum.photos/seed/web2/1600/1000' },
    ],
  },
  {
    slug: 'ceramic-line',
    category: 'product',
    title: { ko: '세라믹 라인', en: 'Ceramic Line' },
    cover: 'https://picsum.photos/seed/ceramic/1200/1200',
    year: '2024',
    role: { ko: '제품 디자인', en: 'Product Design' },
    summary: {
      ko: '손에 감기는 곡면을 중심으로 설계한 식기 시리즈.',
      en: 'A tableware series designed around curves that fit the hand.',
    },
    body: [
      { type: 'image', src: 'https://picsum.photos/seed/ceramic1/1600/1200' },
    ],
  },
  {
    slug: 'cafe-identity',
    category: 'branding',
    title: { ko: '카페 아이덴티티', en: 'Cafe Identity' },
    cover: 'https://picsum.photos/seed/cafe/1200/1500',
    year: '2025',
    client: { ko: '○○ 카페', en: '○○ Cafe' },
    role: { ko: '브랜딩 · 로고 · 패키지', en: 'Branding · Logo · Package' },
    summary: {
      ko: '따뜻하고 단정한 톤으로 정리한 카페 브랜드 시스템.',
      en: 'A warm, tidy brand system for a neighborhood cafe.',
    },
    body: [
      { type: 'image', src: 'https://picsum.photos/seed/cafe1/1600/1067' },
      { type: 'image', src: 'https://picsum.photos/seed/cafe2/1600/1067' },
    ],
  },
];

// ── 헬퍼 ───────────────────────────────────────────────────────────────────
export function projectsByCategory(id: CategoryId): Project[] {
  return projects.filter((p) => p.category === id);
}

export function categoryById(id: string) {
  return categories.find((c) => c.id === id);
}

export function photoSubById(id: string) {
  return photoSubs.find((s) => s.id === id);
}

/** 사진 카테고리에서 특정 하위분류의 작업들 (sub 없으면 제품사진으로 간주) */
export function projectsByPhotoSub(subId: string): Project[] {
  return projects.filter(
    (p) => p.category === 'photography' && (p.sub ?? DEFAULT_PHOTO_SUB) === subId
  );
}

export function webSubById(id: string) {
  return webSubs.find((s) => s.id === id);
}

/** 웹디자인 카테고리에서 특정 하위분류의 작업들 (sub 지정된 항목만) */
export function projectsByWebSub(subId: string): Project[] {
  return projects.filter((p) => p.category === 'web' && p.sub === subId);
}

/** 카테고리의 하위 분류 목록 (없으면 빈 배열) — 햄버거 메뉴 등 공용 */
export function subsOf(catId: string): ReadonlyArray<{ id: string; label: L10n }> {
  if (catId === 'photography') return photoSubs;
  if (catId === 'web') return webSubs;
  return [];
}

/**
 * 하위 분류 페이지 경로 (BASE_URL 제외).
 * 사진의 'product'만 /photography(index)가 담당하므로 예외 처리.
 */
export function subPath(catId: string, subId: string): string {
  if (catId === 'photography' && subId === DEFAULT_PHOTO_SUB) return 'photography';
  return `${catId}/${subId}`;
}
