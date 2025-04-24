# BlogSEO Helper CLI

블로그 글 SEO 최적화를 위한 콘솔 애플리케이션입니다. 블로그 제목이나 주제를 입력하면 SEO 관련 키워드, 제목 개선 제안, 메타 설명, 태그 등 다양한 최적화 전략을 제공합니다.

## 기능

- **키워드 추천**: 입력한 주제에 맞는 SEO 키워드 제안
- **제목 최적화**: SEO에 효과적인 제목 구조 제안
- **메타 설명**: 검색 결과에 표시될 메타 설명 작성 예시
- **태그 추천**: 주제와 관련된 해시태그 제안
- **콘텐츠 구조**: 효과적인 블로그 글 구조 제안
- **OpenAI API 연동**: AI를 활용한 더 정교한 SEO 제안 생성 (선택사항)

## 설치 방법

### 필요 조건

- Node.js 16.0 이상

### 로컬 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/blogseo-helper-cli.git
cd blogseo-helper-cli

# 의존성 설치
npm install

# 전역 설치 (선택사항)
npm install -g .
```

### OpenAI API 키 설정 (선택사항)

AI 향상 기능을 사용하려면 OpenAI API 키가 필요합니다:

1. [OpenAI 웹사이트](https://platform.openai.com/)에서 API 키 발급
2. 프로젝트 루트 디렉토리에 `.env` 파일 생성
3. `.env` 파일에 API 키 추가:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## 사용 방법

### 기본 사용법

```bash
# 패키지 디렉토리에서 직접 실행
npm start

# 전역 설치한 경우
blogseo
```

### 고급 옵션

언어 설정:

```bash
# 한국어 (기본값)
npm start -- --lang=ko

# 영어
npm start -- --lang=en

# 일본어
npm start -- --lang=ja
```

플랫폼 설정:

```bash
# 구글 (기본값)
npm start -- --platform=google

# 네이버
npm start -- --platform=naver
```

OpenAI API 사용:

```bash
# AI 기반 분석 활성화
npm start -- --ai

# 특정 모델 지정
npm start -- --ai --model=gpt-4
```

옵션 조합:

```bash
npm start -- --lang=en --platform=google --ai
```

## 사용자 지정 프롬프트 (고급)

AI 모드의 결과를 더 세밀하게 조정하려면 `prompts` 디렉토리에 언어별 시스템 프롬프트 파일을 추가할 수 있습니다:

- `prompts/system-ko.txt`: 한국어 시스템 프롬프트
- `prompts/system-en.txt`: 영어 시스템 프롬프트
- `prompts/system-ja.txt`: 일본어 시스템 프롬프트

## 예시

입력: "자바스크립트 클로저 쉽게 설명하기"

출력:

```
📌 추천 키워드:
  - 자바스크립트 클로저 쉽게 설명하기
  - 자바스크립트 방법
  - 자바스크립트 예제
  - 자바스크립트 쉽게 이해하기
  - 자바스크립트 튜토리얼

📝 제목 개선 제안:
  [초보자 필독] 자바스크립트 클로저 쉽게 설명하기를 이해하는 가장 쉬운 방법 (예제 포함)

📄 메타 설명 예시:
  자바스크립트 클로저 쉽게 설명하기에 대한 모든 것을 알려드립니다. 이 글에서는 초보자도 쉽게 이해할 수 있는 설명과 실제 활용 방법, 그리고 전문가들의 팁을 함께 제공합니다.

🏷️ 관련 태그:
  #자바스크립트클로저쉽게설명하기 #자바스크립트 #클로저 #쉽게 #설명하기 #개발팁

📑 콘텐츠 구조 제안:
  H1: 자바스크립트 클로저 쉽게 설명하기
  H2: 자바스크립트 클로저 쉽게 설명하기이란 무엇인가?
  H2: 자바스크립트 클로저 쉽게 설명하기의 중요성
  H2: 자바스크립트 클로저 쉽게 설명하기의 주요 특징
  H3: 특징 1 - 효율성 향상
  H3: 특징 2 - 접근성 향상
  H2: 자바스크립트 클로저 쉽게 설명하기 활용 방법
  H2: 자주 묻는 질문
  H2: 마치며
```

## 라이선스

MIT
