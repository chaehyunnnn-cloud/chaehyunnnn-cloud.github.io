# 포트폴리오 사이트

흰 배경 · 미니멀 · 콘텐츠 중심의 포트폴리오. Astro 정적 사이트.
5개 카테고리(사진 · 영상 · 웹디자인 · 제품디자인 · 브랜딩), 한/영 전환 지원.

## 실행

```bash
npm install        # 처음 한 번
npm run dev        # 개발 서버 (http://localhost:4321)
npm run build      # 정적 빌드 → dist/ 폴더
npm run preview    # 빌드 결과 미리보기
```

## 콘텐츠 추가/수정 — 딱 한 파일만

모든 작업은 [`src/data/portfolio.ts`](src/data/portfolio.ts) 에서 관리합니다.
`projects` 배열에 항목을 추가하면 카테고리 페이지와 상세 페이지가 자동으로 생깁니다.

```ts
{
  slug: 'my-new-work',                 // URL 주소 (영문/숫자/하이픈)
  category: 'photography',             // 5개 중 하나: photography | video | web | product | branding
  title: { ko: '제목', en: 'Title' },
  cover: '/images/cover.jpg',          // 대표 이미지 (아래 '이미지' 참고)
  year: '2025',
  client: { ko: '클라이언트', en: 'Client' },   // 선택
  role:   { ko: '역할', en: 'Role' },           // 선택
  summary:{ ko: '한 줄 소개', en: 'One-liner' }, // 선택
  body: [                              // 상세 페이지 본문 (선택)
    { type: 'text',  value: { ko: '설명 문단', en: 'Paragraph' } },
    { type: 'image', src: '/images/01.jpg', caption: { ko: '캡션', en: 'Caption' } },
    { type: 'video', src: 'https://www.youtube.com/embed/영상ID' },
  ],
},
```

### 이미지 넣기

1. 이미지 파일을 `public/images/` 폴더에 넣습니다.
2. 데이터에서 `'/images/파일명.jpg'` 처럼 경로를 적습니다.
   (지금 샘플은 placeholder 외부 이미지라, 실제 이미지로 바꾸면 됩니다.)

### 영상 넣기

YouTube/Vimeo의 **embed** 주소를 사용합니다.
예: `https://www.youtube.com/embed/aqz-KE-bpKQ`

## 디자인 손보기

- 색·간격·폰트: [`src/styles/global.css`](src/styles/global.css) 상단 `:root` 변수
- 사이트/작가 이름: [`src/layouts/Base.astro`](src/layouts/Base.astro) 의 `siteName`
- 카테고리 이름·순서: `src/data/portfolio.ts` 의 `categories`

## 배포

`npm run build` 후 생기는 `dist/` 폴더를 그대로 올리면 됩니다.
(Netlify, Vercel, GitHub Pages, Cloudflare Pages 등 정적 호스팅 어디든 가능)
