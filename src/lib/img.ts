// 캐러셀/그리드 썸네일용 작은 이미지 경로로 변환합니다.
// '/images/...' → '/thumbs/...' (public/thumbs는 scripts/make-thumbs.mjs가 자동 생성)
// 외부 URL(http...)이나 그 외 경로는 그대로 둡니다.
export function thumb(src: string): string {
  if (src.startsWith("/images/")) return "/thumbs/" + src.slice("/images/".length);
  return src;
}

// 카드/캐러셀에 쓸 썸네일 경로.
// 직접 지정한 thumb가 있으면 그대로, 없으면 cover를 자동 축소한 /thumbs/ 버전 사용.
export function cardSrc(p: { thumb?: string; cover: string }): string {
  return p.thumb ? p.thumb : thumb(p.cover);
}
