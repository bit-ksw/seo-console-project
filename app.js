#!/usr/bin/env node

// 특정 경고를 숨기기 위한 설정
// process.noDeprecation = true; - 읽기 전용 속성이므로 사용 불가

import inquirer from "inquirer";
import chalk from "chalk";
import { program } from "commander";
import figlet from "figlet";
import { generateSeoSuggestions } from "./lib/seoAnalyzer.js";
import { generateSeoSuggestionsWithAI } from "./lib/services/openaiService.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// 환경 변수 로드
dotenv.config();

// 현재 파일 경로 확인
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 파일이 없는 경우 예제 파일에서 복사
const envPath = path.join(__dirname, ".env");
const envExamplePath = path.join(__dirname, ".env-example");

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  try {
    fs.copyFileSync(envExamplePath, envPath);
    console.log(
      chalk.yellow(".env 파일이 생성되었습니다. OpenAI API 키를 설정해주세요.")
    );
  } catch (err) {
    console.log(chalk.yellow(".env 파일을 수동으로 생성해야 합니다."));
  }
}

// 애플리케이션 헤더 표시
console.log(
  chalk.cyan(figlet.textSync("BlogSEO Helper", { horizontalLayout: "full" }))
);

// 커맨드 라인 옵션 설정
program
  .version("1.0.0")
  .description("블로그 SEO 최적화 도우미 CLI")
  .option("-l, --lang <language>", "언어 설정 (ko, en, ja 등)", "ko")
  .option(
    "-p, --platform <platform>",
    "플랫폼 설정 (google, naver 등)",
    "google"
  )
  .option("-a, --ai", "OpenAI API를 사용하여 더 정확한 SEO 제안 생성")
  .option(
    "-m, --model <model>",
    "사용할 OpenAI 모델 (gpt-3.5-turbo, gpt-4)",
    "gpt-3.5-turbo"
  )
  .parse(process.argv);

const options = program.opts();

// 사용자 입력 받기
async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "topic",
      message: chalk.yellow("블로그 주제를 입력하세요:"),
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "주제를 입력해주세요!";
        }
      },
    },
  ]);

  return answers.topic;
}

// OpenAI API 키 확인
function checkApiKey() {
  if (!process.env.OPENAI_API_KEY) {
    console.log(chalk.red("\nOpenAI API 키가 설정되지 않았습니다!"));
    console.log(chalk.yellow(".env 파일에 OPENAI_API_KEY를 설정해주세요."));
    return false;
  }
  return true;
}

// 메인 실행 함수
async function main() {
  try {
    console.log(chalk.blue("BlogSEO Helper CLI에 오신 것을 환영합니다!"));
    console.log(
      chalk.gray(
        `언어: ${options.lang}, 플랫폼: ${options.platform}${
          options.ai ? ", AI 모드: 활성화" : ""
        }${options.ai ? `, 모델: ${options.model}` : ""}\n`
      )
    );

    const topic = await promptUser();
    console.log(chalk.green("\n분석 중..."));

    // SEO 제안 생성 (AI 또는 기본 방식)
    let seoSuggestions;

    if (options.ai) {
      if (checkApiKey()) {
        console.log(chalk.gray("OpenAI API를 사용하여 분석하고 있습니다..."));
        seoSuggestions = await generateSeoSuggestionsWithAI(
          topic,
          options.lang,
          options.platform
        );
      } else {
        console.log(chalk.gray("API 키가 없어 기본 방식으로 분석합니다..."));
        seoSuggestions = generateSeoSuggestions(
          topic,
          options.lang,
          options.platform
        );
      }
    } else {
      seoSuggestions = generateSeoSuggestions(
        topic,
        options.lang,
        options.platform
      );
    }

    // 결과 출력
    console.log("\n" + chalk.bgCyan.black(" SEO 분석 결과 ") + "\n");

    console.log(chalk.yellow("📌 추천 키워드:"));
    seoSuggestions.keywords.forEach((keyword) => {
      console.log(`  - ${keyword}`);
    });

    console.log("\n" + chalk.yellow("📝 제목 개선 제안:"));
    console.log(`  ${seoSuggestions.titleSuggestion}`);

    console.log("\n" + chalk.yellow("📄 메타 설명 예시:"));
    console.log(`  ${seoSuggestions.metaDescription}`);

    console.log("\n" + chalk.yellow("🏷️ 관련 태그:"));
    console.log(`  ${seoSuggestions.tags.join(" ")}`);

    console.log("\n" + chalk.yellow("📑 콘텐츠 구조 제안:"));
    seoSuggestions.contentStructure.forEach((heading) => {
      console.log(`  ${heading}`);
    });

    console.log("\n" + chalk.green("분석이 완료되었습니다! 행운을 빕니다! 🚀"));
  } catch (error) {
    console.error(chalk.red("\n오류가 발생했습니다:"), error);
  }
}

main();
