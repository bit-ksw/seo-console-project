import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 환경 변수 로드
dotenv.config();

// 현재 파일 경로 확인
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenAI 클라이언트 초기화 (함수로 변경)
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API 키가 설정되지 않았습니다");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * OpenAI API를 사용하여 SEO 개선 제안을 생성
 * @param {string} topic - 블로그 주제
 * @param {string} language - 언어 (ko, en, ja)
 * @param {string} platform - 플랫폼 (google, naver, yahoo)
 * @returns {Promise<Object>} - SEO 제안 객체
 */
export async function generateSeoSuggestionsWithAI(topic, language, platform) {
  try {
    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      console.log(
        "OpenAI API 키가 설정되지 않았습니다. 기본 분석 모드로 전환합니다."
      );
      const { generateSeoSuggestions } = await import("../seoAnalyzer.js");
      return generateSeoSuggestions(topic, language, platform);
    }

    // OpenAI 클라이언트 생성
    const openai = getOpenAIClient();

    // 시스템 프롬프트 내용 로드
    const promptsPath = path.join(__dirname, "..", "..", "prompts");
    const systemPromptFile = path.join(promptsPath, `system-${language}.txt`);

    // 시스템 프롬프트 파일이 없는 경우 기본 프롬프트 사용
    let systemPrompt = "";
    try {
      if (fs.existsSync(systemPromptFile)) {
        systemPrompt = fs.readFileSync(systemPromptFile, "utf8");
      } else {
        systemPrompt = getDefaultSystemPrompt(language);
      }
    } catch (err) {
      systemPrompt = getDefaultSystemPrompt(language);
    }

    // 사용자 프롬프트 생성
    const userPrompt = getUserPrompt(topic, language, platform);

    // API 호출
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-4로 업그레이드 가능
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    // JSON 파싱 후 반환
    const content = response.choices[0].message.content;
    const suggestions = JSON.parse(content);

    return suggestions;
  } catch (error) {
    console.error("OpenAI API 오류:", error.message);

    // API 호출 실패 시 기본 함수로 대체
    const { generateSeoSuggestions } = await import("../seoAnalyzer.js");
    return generateSeoSuggestions(topic, language, platform);
  }
}

/**
 * 언어별 기본 시스템 프롬프트 반환
 * @param {string} language - 언어 코드
 * @returns {string} - 기본 시스템 프롬프트
 */
function getDefaultSystemPrompt(language) {
  const prompts = {
    ko: `당신은 SEO 최적화 전문가입니다. 블로그 글의 주제가 주어지면 검색 엔진 최적화를 위한 다음 정보를 JSON 형식으로 제공해야 합니다:
- 추천 키워드 (5개)
- 제목 개선 제안 (1개)
- 메타 설명 예시 (1개, 150-160자)
- 관련 태그 (최대 6개)
- 콘텐츠 구조 제안 (H1, H2, H3 등)

응답은 다음 JSON 형식을 따라야 합니다:
{
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "titleSuggestion": "SEO에 최적화된 제목 예시",
  "metaDescription": "검색 결과에 표시될 메타 설명 예시 (150-160자)",
  "tags": ["#태그1", "#태그2", "#태그3", "#태그4", "#태그5", "#태그6"],
  "contentStructure": ["H1: 메인 제목", "H2: 섹션 제목1", "H3: 하위 섹션", "H2: 섹션 제목2"]
}`,

    en: `You are an SEO optimization expert. When given a blog topic, you need to provide the following information in JSON format for search engine optimization:
- Recommended keywords (5)
- Title improvement suggestion (1)
- Meta description example (1, 150-160 characters)
- Related tags (up to 6)
- Content structure suggestion (H1, H2, H3, etc.)

Your response must follow this JSON format:
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "titleSuggestion": "SEO optimized title example",
  "metaDescription": "Meta description example to be displayed in search results (150-160 chars)",
  "tags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "contentStructure": ["H1: Main title", "H2: Section title1", "H3: Subsection", "H2: Section title2"]
}`,

    ja: `あなたはSEO最適化の専門家です。ブログのトピックが与えられたら、検索エンジン最適化のために以下の情報をJSON形式で提供する必要があります：
- おすすめキーワード (5つ)
- タイトル改善提案 (1つ)
- メタ説明例 (1つ、150-160文字)
- 関連タグ (最大6つ)
- コンテンツ構造提案 (H1, H2, H3など)

応答は次のJSON形式に従う必要があります：
{
  "keywords": ["キーワード1", "キーワード2", "キーワード3", "キーワード4", "キーワード5"],
  "titleSuggestion": "SEOに最適化されたタイトル例",
  "metaDescription": "検索結果に表示されるメタ説明例（150〜160文字）",
  "tags": ["#タグ1", "#タグ2", "#タグ3", "#タグ4", "#タグ5", "#タグ6"],
  "contentStructure": ["H1: メインタイトル", "H2: セクションタイトル1", "H3: サブセクション", "H2: セクションタイトル2"]
}`,
  };

  return prompts[language] || prompts.en;
}

/**
 * 사용자 프롬프트 생성
 * @param {string} topic - 블로그 주제
 * @param {string} language - 언어
 * @param {string} platform - 플랫폼
 * @returns {string} - 사용자 프롬프트
 */
function getUserPrompt(topic, language, platform) {
  const prompts = {
    ko: `다음 블로그 주제에 대한 SEO 최적화 전략을 제공해주세요: "${topic}"
대상 플랫폼은 ${platform === "naver" ? "네이버" : "구글"}입니다.
중요: 키워드는 주제와 관련성이 높고 검색량이 많을 것으로 예상되는 키워드를 포함해야 합니다.
태그에는 #을 포함해주세요.`,

    en: `Please provide SEO optimization strategies for the following blog topic: "${topic}"
Target platform is ${platform}.
Important: Keywords should include terms that are highly relevant to the topic and are expected to have high search volume.
Please include # in the tags.`,

    ja: `次のブログトピックに対するSEO最適化戦略を提供してください：「${topic}」
対象プラットフォームは${platform === "yahoo" ? "Yahoo" : "Google"}です。
重要：キーワードには、トピックと関連性が高く、検索ボリュームが多いと予想される用語を含める必要があります。
タグには#を含めてください。`,
  };

  return prompts[language] || prompts.en;
}

export default { generateSeoSuggestionsWithAI };
