#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { program } from "commander";
import figlet from "figlet";
import { generateSeoSuggestions } from "./lib/seoAnalyzer.js";

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

// 메인 실행 함수
async function main() {
  try {
    console.log(chalk.blue("BlogSEO Helper CLI에 오신 것을 환영합니다!"));
    console.log(
      chalk.gray(`언어: ${options.lang}, 플랫폼: ${options.platform}\n`)
    );

    const topic = await promptUser();
    console.log(chalk.green("\n분석 중..."));

    // SEO 제안 생성
    const seoSuggestions = generateSeoSuggestions(
      topic,
      options.lang,
      options.platform
    );

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
