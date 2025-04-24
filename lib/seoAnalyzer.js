/**
 * SEO 분석 및 제안 생성 모듈
 */

// 입력된 주제를 바탕으로 SEO 제안 생성
export function generateSeoSuggestions(
  topic,
  language = "ko",
  platform = "google"
) {
  // 실제 구현에서는 여기에 NLP나 외부 API 연동이 들어갈 수 있음
  // 현재는 간단한 룰 기반 로직 사용

  const suggestions = {
    keywords: generateKeywords(topic, language, platform),
    titleSuggestion: generateTitleSuggestion(topic, language, platform),
    metaDescription: generateMetaDescription(topic, language),
    tags: generateTags(topic, language),
    contentStructure: generateContentStructure(topic, language),
  };

  return suggestions;
}

// 키워드 생성 함수
function generateKeywords(topic, language, platform) {
  // 언어와 플랫폼에 따른 키워드 전략 차별화
  const keywordsByLanguage = {
    ko: {
      google: getKoreanGoogleKeywords,
      naver: getKoreanNaverKeywords,
    },
    ja: {
      google: getJapaneseGoogleKeywords,
      yahoo: getJapaneseYahooKeywords,
    },
    en: {
      google: getEnglishGoogleKeywords,
      naver: getEnglishGoogleKeywords, // 영어는 플랫폼 차이 적용 안함
    },
  };

  // 해당 언어와 플랫폼에 맞는 함수 실행
  const keywordGenerator =
    keywordsByLanguage[language]?.[platform] ||
    keywordsByLanguage["ko"]["google"];
  return keywordGenerator(topic);
}

// 한국어 구글용 키워드 생성
function getKoreanGoogleKeywords(topic) {
  const keywords = [];

  // 주제에서 핵심어 추출 (간단한 구현)
  const mainTerms = topic.split(" ").filter((term) => term.length >= 2);

  // 기본 키워드 추가
  keywords.push(topic);

  // 변형 키워드 추가
  if (mainTerms.length > 0) {
    keywords.push(`${mainTerms[0]} 방법`);
    keywords.push(`${mainTerms[0]} 예제`);
    keywords.push(`${mainTerms[0]} 쉽게 이해하기`);

    // 주제가 기술 관련인 경우
    if (isTechTopic(topic)) {
      keywords.push(`${mainTerms[0]} 튜토리얼`);
      keywords.push(`${mainTerms[0]} 초보자`);
      keywords.push(`${mainTerms[0]} 활용`);
    }
  }

  return keywords.slice(0, 5); // 최대 5개 키워드 반환
}

// 한국어 네이버용 키워드 생성
function getKoreanNaverKeywords(topic) {
  const keywords = getKoreanGoogleKeywords(topic); // 기본 키워드 가져오기

  // 네이버 특화 키워드 추가 (예: 지식인 스타일)
  const mainTerms = topic.split(" ").filter((term) => term.length >= 2);

  if (mainTerms.length > 0) {
    keywords.push(`${mainTerms[0]} 알려주세요`);
    keywords.push(`${mainTerms[0]} 질문`);
  }

  return keywords.slice(0, 5); // 최대 5개 키워드 반환
}

// 일본어 구글용 키워드 생성
function getJapaneseGoogleKeywords(topic) {
  const keywords = [];

  // 주제에서 핵심어 추출 (간단한 구현)
  const mainTerms = topic.split(" ").filter((term) => term.length >= 2);

  // 기본 키워드 추가
  keywords.push(topic);

  // 변형 키워드 추가
  if (mainTerms.length > 0) {
    keywords.push(`${mainTerms[0]} 方法`);
    keywords.push(`${mainTerms[0]} 例`);
    keywords.push(`${mainTerms[0]} わかりやすく`);

    // 주제가 기술 관련인 경우
    if (isTechTopic(topic)) {
      keywords.push(`${mainTerms[0]} チュートリアル`);
      keywords.push(`${mainTerms[0]} 初心者`);
      keywords.push(`${mainTerms[0]} 活用`);
    }
  }

  return keywords.slice(0, 5); // 최대 5개 키워드 반환
}

// 일본어 야후용 키워드 생성
function getJapaneseYahooKeywords(topic) {
  const keywords = getJapaneseGoogleKeywords(topic); // 기본 키워드 가져오기

  // 야후 특화 키워드 추가
  const mainTerms = topic.split(" ").filter((term) => term.length >= 2);

  if (mainTerms.length > 0) {
    keywords.push(`${mainTerms[0]} 教えて`);
    keywords.push(`${mainTerms[0]} 質問`);
  }

  return keywords.slice(0, 5); // 최대 5개 키워드 반환
}

// 영어 구글용 키워드 생성
function getEnglishGoogleKeywords(topic) {
  const keywords = [];

  // 주제에서 핵심어 추출
  const mainTerms = topic.split(" ").filter((term) => term.length >= 3);

  // 기본 키워드
  keywords.push(topic);

  // 변형 키워드
  if (mainTerms.length > 0) {
    keywords.push(`${mainTerms[0]} tutorial`);
    keywords.push(`${mainTerms[0]} guide`);
    keywords.push(`how to ${mainTerms[0]}`);
    keywords.push(`${mainTerms[0]} examples`);
  }

  return keywords.slice(0, 5); // 최대 5개 키워드 반환
}

// 제목 개선 제안 생성
function generateTitleSuggestion(topic, language, platform) {
  // 언어별 제목 제안 전략
  if (language === "ko") {
    // 주제가 기술 관련인지 확인
    if (isTechTopic(topic)) {
      return `[초보자 필독] ${topic}를 이해하는 가장 쉬운 방법 (예제 포함)`;
    } else if (topic.length < 15) {
      // 주제가 짧은 경우 확장
      return `알아두면 유용한 ${topic} 완벽 가이드 - 전문가의 팁 10가지`;
    } else {
      // 일반적인 경우
      return `${topic} - 당신이 몰랐던 5가지 핵심 포인트`;
    }
  } else if (language === "ja") {
    // 일본어 제목 제안
    if (isTechTopic(topic)) {
      return `【初心者必読】${topic}を理解する最も簡単な方法（例付き）`;
    } else if (topic.length < 15) {
      return `知っておくと便利な${topic}完全ガイド - 専門家のヒント10選`;
    } else {
      return `${topic} - あなたが知らなかった5つの重要ポイント`;
    }
  } else {
    // 영어 제목 제안
    if (isTechTopic(topic)) {
      return `The Ultimate Guide to ${topic}: What Every Beginner Should Know`;
    } else {
      return `${topic}: 5 Essential Tips You Need to Know Today`;
    }
  }
}

// 메타 설명 생성
function generateMetaDescription(topic, language) {
  if (language === "ko") {
    return `${topic}에 대한 모든 것을 알려드립니다. 이 글에서는 초보자도 쉽게 이해할 수 있는 설명과 실제 활용 방법, 그리고 전문가들의 팁을 함께 제공합니다.`;
  } else if (language === "ja") {
    return `${topic}についてのすべてをご紹介します。この記事では、初心者でも簡単に理解できる説明と実際の活用方法、そして専門家のヒントを一緒に提供します。`;
  } else {
    return `Everything you need to know about ${topic}. This comprehensive guide provides easy-to-understand explanations, practical applications, and expert tips for both beginners and advanced users.`;
  }
}

// 태그 생성
function generateTags(topic, language) {
  const tags = [];
  const words = topic.split(" ").filter((word) => word.length >= 2);

  // 주제 자체를 태그로 추가
  tags.push(`#${topic.replace(/\s+/g, "")}`);

  // 주요 단어들을 태그로 추가
  words.forEach((word) => {
    tags.push(`#${word}`);
  });

  // 기술 주제인 경우 관련 태그 추가
  if (isTechTopic(topic)) {
    if (language === "ko") {
      tags.push("#개발팁");
      tags.push("#프로그래밍");
    } else if (language === "ja") {
      tags.push("#開発ヒント");
      tags.push("#プログラミング");
    } else {
      tags.push("#DevTips");
      tags.push("#Programming");
    }
  } else {
    if (language === "ko") {
      tags.push("#꿀팁");
      tags.push("#정보");
    } else if (language === "ja") {
      tags.push("#ヒント");
      tags.push("#情報");
    } else {
      tags.push("#Tips");
      tags.push("#Info");
    }
  }

  return [...new Set(tags)].slice(0, 6); // 중복 제거 후 최대 6개 태그 반환
}

// 콘텐츠 구조 제안
function generateContentStructure(topic, language) {
  // 기본 구조
  const structure = [];

  if (language === "ko") {
    structure.push("H1: " + topic);
    structure.push("H2: " + topic + "이란 무엇인가?");
    structure.push("H2: " + topic + "의 중요성");
    structure.push("H2: " + topic + "의 주요 특징");
    structure.push("H3: 특징 1 - " + getRandomFeature(language));
    structure.push("H3: 특징 2 - " + getRandomFeature(language));
    structure.push("H2: " + topic + " 활용 방법");
    structure.push("H2: 자주 묻는 질문");
    structure.push("H2: 마치며");
  } else if (language === "ja") {
    structure.push("H1: " + topic);
    structure.push("H2: " + topic + "とは何か？");
    structure.push("H2: " + topic + "の重要性");
    structure.push("H2: " + topic + "の主な特徴");
    structure.push("H3: 特徴1 - " + getRandomFeature(language));
    structure.push("H3: 特徴2 - " + getRandomFeature(language));
    structure.push("H2: " + topic + "の活用方法");
    structure.push("H2: よくある質問");
    structure.push("H2: まとめ");
  } else {
    structure.push("H1: " + topic);
    structure.push("H2: What is " + topic + "?");
    structure.push("H2: Why " + topic + " is Important");
    structure.push("H2: Key Features of " + topic);
    structure.push("H3: Feature 1 - " + getRandomFeature(language));
    structure.push("H3: Feature 2 - " + getRandomFeature(language));
    structure.push("H2: How to Utilize " + topic);
    structure.push("H2: Frequently Asked Questions");
    structure.push("H2: Conclusion");
  }

  return structure;
}

// 유틸리티 함수들 //

// 기술 관련 주제인지 확인
function isTechTopic(topic) {
  const techKeywords = [
    "javascript",
    "자바스크립트",
    "ジャバスクリプト",
    "java",
    "자바",
    "ジャバ",
    "python",
    "파이썬",
    "パイソン",
    "프로그래밍",
    "プログラミング",
    "코드",
    "コード",
    "api",
    "framework",
    "프레임워크",
    "フレームワーク",
    "react",
    "리액트",
    "リアクト",
    "リアクティブ",
    "リアクションス",
    "vue",
    "angular",
    "앵귤러",
    "node",
    "노드",
    "express",
    "database",
    "데이터베이스",
    "データベース",
    "sql",
    "nosql",
    "aws",
    "cloud",
    "클라우드",
    "クラウド",
    "web",
    "웹",
    "ウェブ",
    "app",
    "앱",
    "アプリ",
    "mobile",
    "모바일",
    "モバイル",
    "algorithm",
    "알고리즘",
    "アルゴリズム",
    "data structure",
    "자료구조",
    "データ構造",
    "git",
    "깃",
    "docker",
    "도커",
    "kubernetes",
    "쿠버네티스",
  ];

  // 주제에 기술 키워드가 포함되어 있는지 확인
  return techKeywords.some((keyword) =>
    topic.toLowerCase().includes(keyword.toLowerCase())
  );
}

// 랜덤 특징 생성 (예시)
function getRandomFeature(language) {
  const features = {
    ko: [
      "효율성 향상",
      "시간 절약",
      "비용 절감",
      "사용자 경험 개선",
      "생산성 증대",
      "접근성 향상",
      "성능 최적화",
      "확장성",
      "안정성",
      "보안 강화",
    ],
    ja: [
      "効率性向上",
      "時間節約",
      "コスト削減",
      "ユーザー体験向上",
      "生産性アップ",
      "アクセシビリティ向上",
      "パフォーマンス最適化",
      "拡張性",
      "安定性",
      "セキュリティ強化",
    ],
    en: [
      "Improved Efficiency",
      "Time-Saving",
      "Cost Reduction",
      "Enhanced User Experience",
      "Increased Productivity",
      "Better Accessibility",
      "Performance Optimization",
      "Scalability",
      "Reliability",
      "Enhanced Security",
    ],
  };

  const featureList = features[language] || features["en"];
  const randomIndex = Math.floor(Math.random() * featureList.length);

  return featureList[randomIndex];
}
