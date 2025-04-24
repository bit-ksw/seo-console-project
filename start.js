#!/usr/bin/env node

// 이 스크립트는 app.js를 실행하기 위한 래퍼 스크립트입니다.
// 경고 메시지 없이 실행하기 위해 spawn을 사용합니다.

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appPath = path.join(__dirname, "app.js");

// node --no-warnings app.js 실행
const child = spawn("node", ["--no-warnings", appPath], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

// 프로세스 종료 시 동일한 종료 코드로 종료
child.on("close", (code) => {
  process.exit(code);
});
