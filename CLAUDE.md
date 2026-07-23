# 최우선 규칙 (TOP PRIORITY — 항상 무조건 준수)

이 프로젝트(사이트작업 / chaehyunnnn-cloud.github.io)에서 작업할 때, 아래 규칙을
**다른 무엇보다 최우선**으로 지킨다. 매 작업(명령)마다 자동으로 적용한다.

## ① 작업 시작 전 — 로컬 최신화
- 코드를 수정하기 **전에** 항상 `git pull origin main` 으로 로컬을 원격 최신 상태로 맞춘 뒤 작업한다.
- public 레포라 pull은 토큰 없이 된다. 로컬에 커밋 안 된 변경이 있으면 먼저 정리(커밋·push)한다.

## ② 코드 수정 시 — 자동 커밋·push (요청 없이도)
- 코드가 수정되면 **항상** `npm run save "설명 메시지"` 를 실행해 커밋 + push 한다. (= `node scripts/gitpush.mjs`)
- 매 작업마다 자동으로. 사용자가 따로 시키지 않아도 반드시 반영한다.

## ③ 시크릿(토큰) 절대 커밋 금지
- 깃 토큰 등 민감정보는 **절대** 커밋/푸시하지 않는다.
- 토큰은 오직 `git-secret.local.json`(.gitignore)에만 존재. `git-secret.example.json`은 placeholder만.
- `scripts/gitpush.mjs`의 안전장치(시크릿 파일 스테이징·토큰 패턴 감지 시 중단)를 항상 유지한다.

## ④ push 후 — 빌드 + .io 배포 확인
- push하면 GitHub Actions가 **자동으로 빌드 → https://chaehyunnnn-cloud.github.io/ 에 배포**한다.
- push 후에는 배포(Actions)가 성공했는지 확인한다. 필요 시 로컬에서 `npm run build`로도 검증한다.
- 즉 흐름: **로컬 최신화 → 코드 수정 → `npm run save`(자동 push) → Actions 자동 빌드·배포 → .io 반영 확인**.

---

## 프로젝트 정보
- **레포**: https://github.com/chaehyunnnn-cloud/chaehyunnnn-cloud.github.io (public, 기본 브랜치 `main`)
- **배포 사이트**: https://chaehyunnnn-cloud.github.io/
- **스택**: Astro 정적 사이트 (KR/EN 이중언어). 썸네일은 `predev`/`prebuild`에서 `scripts/make-thumbs.mjs`로 자동 생성(→ `public/thumbs`, gitignore).
- **이미지 정책**: 원본은 웹용(가장 긴 변 ≤ 2000px)으로 관리. 큰 원본을 새로 추가하면 `scripts/resize-originals.mjs`로 축소.
- **배포 무관 산출물**: `dist/`, `public/thumbs/`는 gitignore (CI에서 매번 재생성).
