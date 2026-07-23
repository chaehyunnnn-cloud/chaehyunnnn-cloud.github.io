// 변경사항을 커밋하고 GitHub에 push 합니다.
// 토큰은 git-secret.local.json(=.gitignore) 에서만 읽고, 어떤 추적 파일/설정에도 저장하지 않습니다.
//   사용: node scripts/gitpush.mjs "커밋 메시지"
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SECRET = "git-secret.local.json";
const USER = "chaehyunnnn-cloud";
const REPO = "chaehyunnnn-cloud/fuckannecy.git";
const BRANCH = "main";

function run(args, opts = {}) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", ...opts });
}
function die(msg) {
  console.error("✗ " + msg);
  process.exit(1);
}

// 1) 시크릿 파일 존재 확인
if (!existsSync(path.join(ROOT, SECRET)))
  die(`${SECRET} 이 없습니다. git-secret.example.json 을 복사해 토큰을 넣어주세요.`);

// 2) [안전장치] 시크릿 파일이 반드시 gitignore 되어 있어야 진행 (아니면 중단)
try {
  run(["check-ignore", "-q", SECRET], { stdio: "ignore" });
} catch {
  die(`${SECRET} 이 .gitignore에 없습니다. 토큰 유출 위험 → 중단합니다.`);
}

// 3) 토큰 로드
let token;
try {
  token = JSON.parse(readFileSync(path.join(ROOT, SECRET), "utf8")).token;
} catch {
  die(`${SECRET} 을 읽을 수 없습니다(JSON 형식 확인).`);
}
if (!token || typeof token !== "string" || token.includes("여기에"))
  die("token 값이 비어있거나 예시 그대로입니다.");

// 4) 스테이징 (시크릿 파일은 gitignore라 자동 제외)
run(["add", "-A"], { stdio: "inherit" });

// 4-1) [이중 안전장치] 실제 시크릿 파일 패턴이 스테이징되면 중단 (example 템플릿은 허용)
const stagedFiles = run(["diff", "--cached", "--name-only"]).split("\n").filter(Boolean);
if (stagedFiles.some((f) => /\.local\.json$/.test(f) || /\.secret\.json$/.test(f)))
  die("스테이징에 시크릿 파일(.local.json/.secret.json)이 포함됐습니다 → 중단(토큰 보호).");

// 4-2) [최종 안전장치] 스테이징 diff 내용에 토큰 문자열이 보이면 중단
const tokenPat = /(ghp_|gho_|ghs_|ghr_|github_pat_)[A-Za-z0-9_]{10,}/;
if (tokenPat.test(run(["diff", "--cached"])))
  die("스테이징 변경 내용에서 GitHub 토큰 패턴이 감지됐습니다 → 중단(토큰 보호).");

// 5) 변경 있으면 커밋
const msg = process.argv.slice(2).join(" ").trim() || "chore: update site";
if (run(["status", "--porcelain"]).trim()) {
  run(
    ["commit", "-m", `${msg}\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`],
    { stdio: "inherit" }
  );
} else {
  console.log("· 커밋할 변경 없음 — 기존 커밋만 push");
}

// 6) push (토큰은 1회성 URL로만 전달, 저장 안 함 / 출력에서 토큰 마스킹)
const url = `https://${USER}:${token}@github.com/${REPO}`;
try {
  const out = execFileSync("git", ["push", url, `HEAD:${BRANCH}`], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  console.log((out || "").split(token).join("***"));
  console.log(`✓ push 완료 → https://github.com/${REPO.replace(/\.git$/, "")}`);
} catch (e) {
  const clean = String(e.stderr || e.stdout || e.message || "").split(token).join("***");
  die("push 실패:\n" + clean);
}
