import { SentenceTemplate } from '../types';
import { SupportedLanguage } from './translations';

// English Templates (expanded)

export const ENGLISH_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about",
    "template": "I want to learn {subject} about {topic}",
    "blanks": [
      {
        "id": "subject",
        "placeholder": "what",
        "options": [
          "the basics", "advanced concepts", "practical applications", "the history", "the theory", "the fundamentals", "everything",
          "a complete overview of", "a critical analysis of", "a deep dive into", "a beginner's guide to", "a brief history of",
          "the ethical implications of", "the future trends of", "common misconceptions about", "the key figures in",
          "the mathematical foundations of", "the cultural impact of", "a step-by-step guide to"
        ]
      },
      {
        "id": "topic",
        "placeholder": "topic",
        "options": [
          "quantum physics", "machine learning", "cooking", "photography", "guitar playing", "stock trading", "web development",
          "3D printing", "accounting", "aerospace engineering", "artificial intelligence", "astronomy", "biochemistry",
          "neuroscience", "climate change", "ancient civilizations", "digital marketing", "cryptocurrency", "mindfulness",
          "gardening", "film making", "philosophy", "data science", "robotics", "virtual reality", "blockchain technology",
          "genetic engineering", "the Renaissance", "behavioral economics", "sustainable agriculture"
        ]
      }
    ],
    "example": "I want to learn a deep dive into about machine learning"
  },
  {
    "id": "understand-how",
    "template": "I want to understand how {process} works {context}",
    "blanks": [
      {
        "id": "process",
        "placeholder": "process",
        "options": [
          "blockchain", "photosynthesis", "the stock market", "neural networks", "car engines", "computers", "vaccines",
          "the internet", "GPS", "the human brain", "a black hole", "the legislative process", "carbon capture",
          "a nuclear reactor", "the global economy", "CRISPR gene editing"
        ]
      },
      {
        "id": "context",
        "placeholder": "context",
        "options": [
          "in detail", "from scratch", "for beginners", "practically", "theoretically", "step by step",
          "with a simple analogy", "using a real-world example", "focusing on the key components", "in a historical context",
          "from a chemical perspective", "from a financial perspective"
        ]
      }
    ],
    "example": "I want to understand how the human brain works with a simple analogy"
  },
  {
    "id": "explain-like-im",
    "template": "Explain {concept} to me as if I were {audience}",
    "blanks": [
      {
        "id": "concept",
        "placeholder": "concept",
        "options": [
          "a black hole", "general relativity", "DNA", "economic inflation", "the internet", "a quantum computer",
          "the human brain", "natural selection", "a smart contract", "dark matter", "the theory of everything"
        ]
      },
      {
        "id": "audience",
        "placeholder": "audience",
        "options": [
          "a 5-year-old", "a high school student", "a complete beginner", "a grandparent", "an investor",
          "a marketing manager", "a colleague from another department", "an intelligent layperson"
        ]
      }
    ],
    "example": "Explain a black hole to me as if I were a 5-year-old"
  },
  {
    "id": "write-a",
    "template": "Help me write a {document_type} about {topic} for {audience}",
    "blanks": [
      {
        "id": "document_type",
        "placeholder": "document type",
        "options": [
          "blog post", "short story", "poem", "email", "speech", "presentation outline", "marketing copy",
          "technical report", "research paper proposal", "script for a video", "press release", "job description"
        ]
      },
      {
        "id": "topic",
        "placeholder": "topic",
        "options": [
          "the benefits of remote work", "the future of space travel", "a fictional world", "the importance of cybersecurity",
          "a new product launch", "the history of the Roman Empire", "sustainable living tips", "mental health awareness"
        ]
      },
      {
        "id": "audience",
        "placeholder": "audience",
        "options": [
          "the general public", "potential customers", "my team", "my boss", "investors", "a technical audience",
          "children", "industry experts"
        ]
      }
    ],
    "example": "Help me write a blog post about the benefits of remote work for the general public"
  },
  {
    "id": "compare-and-contrast",
    "template": "Compare and contrast {item_a} and {item_b} on {criteria}",
    "blanks": [
      {
        "id": "item_a",
        "placeholder": "item A",
        "options": [
          "iOS", "Python", "capitalism", "a novel", "electric cars", "working from home", "cats", "coffee"
        ]
      },
      {
        "id": "item_b",
        "placeholder": "item B",
        "options": [
          "Android", "JavaScript", "socialism", "a film adaptation", "gasoline cars", "working in an office", "dogs", "tea"
        ]
      },
      {
        "id": "criteria",
        "placeholder": "criteria",
        "options": [
          "price and features", "performance and ease of use", "historical impact", "ethical implications",
          "environmental impact", "long-term viability", "pros and cons"
        ]
      }
    ],
    "example": "Compare and contrast iOS and Android on performance and ease of use"
  },
  {
    "id": "brainstorm-ideas",
    "template": "Brainstorm ideas for {project_type} about {topic}",
    "blanks": [
      {
        "id": "project_type",
        "placeholder": "project type",
        "options": [
          "a new business", "a YouTube channel", "a podcast series", "a mobile app", "a marketing campaign",
          "a research project", "a book", "a community event"
        ]
      },
      {
        "id": "topic",
        "placeholder": "topic",
        "options": [
          "sustainable fashion", "local tourism", "financial literacy for teens", "pet care", "mental wellness",
          "home automation", "learning new languages", "urban gardening"
        ]
      }
    ],
    "example": "Brainstorm ideas for a new business about sustainable fashion"
  },
  {
    "id": "create-a-plan",
    "template": "Create a {plan_type} plan for {goal}",
    "blanks": [
      {
        "id": "plan_type",
        "placeholder": "type of plan",
        "options": [
          "step-by-step", "weekly", "30-day", "content marketing", "business", "study", "fitness", "project"
        ]
      },
      {
        "id": "goal",
        "placeholder": "my goal",
        "options": [
          "learning to code", "launching a startup", "writing a novel", "running a marathon",
          "improving my public speaking", "growing an online audience", "a trip to Japan"
        ]
      }
    ],
    "example": "Create a 30-day plan for learning to code"
  },
  {
    "id": "find-resources",
    "template": "Find me the best {resource_type} for learning about {topic}",
    "blanks": [
      {
        "id": "resource_type",
        "placeholder": "type of resource",
        "options": [
          "books", "online courses", "documentaries", "podcasts", "YouTube channels", "academic papers", "interactive websites"
        ]
      },
      {
        "id": "topic",
        "placeholder": "topic",
        "options": [
          "Ancient Rome", "astrophysics", "behavioral psychology", "graphic design", "investing", "the French Revolution"
        ]
      }
    ],
    "example": "Find me the best online courses for learning about investing"
  },
  {
    "id": "summarize-this",
    "template": "Summarize the key points of {content_type} about {topic}",
    "blanks": [
      {
        "id": "content_type",
        "placeholder": "content type",
        "options": [
          "this article", "this book", "this research paper", "the movie 'Inception'", "the theory of relativity", "the latest news"
        ]
      },
      {
        "id": "topic",
        "placeholder": "topic",
        "options": [
          "artificial intelligence ethics", "the plot", "its main arguments", "its impact on society", "the current economic outlook"
        ]
      }
    ],
    "example": "Summarize the key points of the movie 'Inception' about the plot"
  },
  {
    "id": "get-feedback",
    "template": "Give me feedback on my {work_type} about {topic}, focusing on {feedback_area}",
    "blanks": [
      {
        "id": "work_type",
        "placeholder": "type of work",
        "options": [
          "essay", "resume", "cover letter", "business proposal", "short story", "code snippet", "marketing email"
        ]
      },
      {
        "id": "topic",
        "placeholder": "topic",
        "options": [
          "my qualifications for a software engineer role", "a new marketing initiative", "the theme of loneliness", "a user authentication system"
        ]
      },
      {
        "id": "feedback_area",
        "placeholder": "area for feedback",
        "options": [
          "clarity and conciseness", "tone and style", "grammatical correctness", "persuasiveness", "originality", "technical accuracy"
        ]
      }
    ],
    "example": "Give me feedback on my resume about my qualifications for a software engineer role, focusing on clarity and conciseness"
  }
];

// Korean Templates
export const KOREAN_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about-ko",
    "template": "{topic}에 대해 {subject} 배우고 싶습니다",
    "blanks": [
      {
        "id": "topic",
        "placeholder": "주제",
        "options": [
          "양자물리학", "머신러닝", "요리", "사진", "기타 연주", "주식 거래", "웹 개발",
          "3D 프린팅", "회계", "항공우주공학", "인공지능", "천문학", "생화학", "한국사", "경제학", "심리학",
          "신경과학", "기후 변화", "고대 문명", "디지털 마케팅", "암호화폐", "마음챙김", "정원 가꾸기",
          "영화 제작", "철학", "데이터 과학", "로봇공학", "가상현실", "블록체인 기술", "유전 공학",
          "르네상스", "행동 경제학", "지속 가능한 농업"
        ]
      },
      {
        "id": "subject",
        "placeholder": "학습 수준",
        "options": [
          "기초를", "고급 개념을", "실용적 응용을", "역사를", "이론을", "기본 원리를", "모든 것을",
          "완전한 개요를", "비판적 분석을", "심층 분석을", "초보자 가이드를", "간략한 역사를",
          "윤리적 함의를", "미래 동향을", "일반적인 오해를", "핵심 인물들을", "수학적 기초를",
          "문화적 영향을", "단계별 가이드를"
        ]
      }
    ],
    "example": "머신러닝에 대해 심층 분석을 배우고 싶습니다"
  },
  {
    "id": "understand-how-ko",
    "template": "{process}가 어떻게 작동하는지 {context} 이해하고 싶습니다",
    "blanks": [
      {
        "id": "process",
        "placeholder": "과정",
        "options": [
          "블록체인", "광합성", "주식 시장", "신경망", "자동차 엔진", "컴퓨터", "백신", "민주주의", "경제",
          "인터넷", "GPS", "인간의 뇌", "블랙홀", "입법 과정", "탄소 포집", "원자력 발전소", "세계 경제", "크리스퍼 유전자 편집"
        ]
      },
      {
        "id": "context",
        "placeholder": "방식",
        "options": [
          "자세히", "처음부터", "초보자를 위해", "실용적으로", "이론적으로", "단계별로",
          "간단한 비유로", "실제 사례를 들어", "핵심 요소에 초점을 맞춰", "역사적 맥락에서",
          "화학적 관점에서", "재정적 관점에서"
        ]
      }
    ],
    "example": "인간의 뇌가 어떻게 작동하는지 간단한 비유로 이해하고 싶습니다"
  },
  {
    "id": "explain-like-im-ko",
    "template": "{concept}에 대해 제가 {audience}인 것처럼 설명해주세요",
    "blanks": [
      {
        "id": "concept",
        "placeholder": "개념",
        "options": [
          "블랙홀", "일반 상대성 이론", "DNA", "경제 인플레이션", "인터넷", "양자 컴퓨터",
          "인간의 뇌", "자연 선택", "스마트 계약", "암흑 물질", "만물의 이론"
        ]
      },
      {
        "id": "audience",
        "placeholder": "청중",
        "options": [
          "5살 아이", "고등학생", "완전 초보자", "조부모님", "투자자",
          "마케팅 관리자", "다른 부서 동료", "지적인 일반인"
        ]
      }
    ],
    "example": "블랙홀에 대해 제가 5살 아이인 것처럼 설명해주세요"
  },
  {
    "id": "write-a-ko",
    "template": "{audience}를 위해 {topic}에 대한 {document_type} 작성을 도와주세요",
    "blanks": [
      {
        "id": "document_type",
        "placeholder": "문서 종류",
        "options": [
          "블로그 게시물", "단편 소설", "시", "이메일", "연설문", "발표 개요", "마케팅 문구",
          "기술 보고서", "연구 논문 제안서", "영상 스크립트", "보도 자료", "직무 기술서"
        ]
      },
      {
        "id": "topic",
        "placeholder": "주제",
        "options": [
          "원격 근무의 장점", "우주 여행의 미래", "가상의 세계", "사이버 보안의 중요성",
          "신제품 출시", "로마 제국의 역사", "지속 가능한 생활 팁", "정신 건강 인식"
        ]
      },
      {
        "id": "audience",
        "placeholder": "대상",
        "options": [
          "일반 대중", "잠재 고객", "우리 팀", "상사", "투자자", "기술 전문가",
          "어린이", "업계 전문가"
        ]
      }
    ],
    "example": "일반 대중을 위해 원격 근무의 장점에 대한 블로그 게시물 작성을 도와주세요"
  },
  {
    "id": "compare-and-contrast-ko",
    "template": "{item_a}와(과) {item_b}를 {criteria} 기준으로 비교 및 대조해 주세요",
    "blanks": [
      {
        "id": "item_a",
        "placeholder": "항목 A",
        "options": [
          "iOS", "파이썬", "자본주의", "소설 원작", "전기차", "재택근무", "고양이", "커피"
        ]
      },
      {
        "id": "item_b",
        "placeholder": "항목 B",
        "options": [
          "안드로이드", "자바스크립트", "사회주의", "영화 각색판", "가솔린차", "사무실 근무", "개", "차"
        ]
      },
      {
        "id": "criteria",
        "placeholder": "기준",
        "options": [
          "가격 및 기능", "성능 및 사용 편의성", "역사적 영향", "윤리적 함의",
          "환경적 영향", "장기적 생존 가능성", "장단점"
        ]
      }
    ],
    "example": "iOS와(과) 안드로이드를 성능 및 사용 편의성 기준으로 비교 및 대조해 주세요"
  },
  {
    "id": "brainstorm-ideas-ko",
    "template": "{topic}에 대한 {project_type} 아이디어를 브레인스토밍해주세요",
    "blanks": [
      {
        "id": "project_type",
        "placeholder": "프로젝트 종류",
        "options": [
          "새로운 사업", "유튜브 채널", "팟캐스트 시리즈", "모바일 앱", "마케팅 캠페인",
          "연구 프로젝트", "책", "커뮤니티 이벤트"
        ]
      },
      {
        "id": "topic",
        "placeholder": "주제",
        "options": [
          "지속 가능한 패션", "지역 관광", "십대를 위한 금융 교육", "반려동물 관리", "정신 건강",
          "홈 오토메이션", "새로운 언어 배우기", "도시 농업"
        ]
      }
    ],
    "example": "지속 가능한 패션에 대한 새로운 사업 아이디어를 브레인스토밍해주세요"
  },
  {
    "id": "create-a-plan-ko",
    "template": "{goal}을(를) 위한 {plan_type} 계획을 세워주세요",
    "blanks": [
      {
        "id": "plan_type",
        "placeholder": "계획 종류",
        "options": [
          "단계별", "주간", "30일", "콘텐츠 마케팅", "사업", "학업", "운동", "프로젝트"
        ]
      },
      {
        "id": "goal",
        "placeholder": "나의 목표",
        "options": [
          "코딩 배우기", "스타트업 시작하기", "소설 쓰기", "마라톤 뛰기",
          "대중 연설 실력 향상하기", "온라인 팔로워 늘리기", "일본 여행"
        ]
      }
    ],
    "example": "코딩 배우기을(를) 위한 30일 계획을 세워주세요"
  },
  {
    "id": "find-resources-ko",
    "template": "{topic} 학습을 위한 최고의 {resource_type}을(를) 찾아주세요",
    "blanks": [
      {
        "id": "resource_type",
        "placeholder": "자료 종류",
        "options": [
          "책", "온라인 강좌", "다큐멘터리", "팟캐스트", "유튜브 채널", "학술 논문", "인터랙티브 웹사이트"
        ]
      },
      {
        "id": "topic",
        "placeholder": "주제",
        "options": [
          "고대 로마", "천체물리학", "행동 심리학", "그래픽 디자인", "투자", "프랑스 혁명"
        ]
      }
    ],
    "example": "투자 학습을 위한 최고의 온라인 강좌을(를) 찾아주세요"
  },
  {
    "id": "summarize-this-ko",
    "template": "{topic}에 대한 {content_type}의 핵심 내용을 요약해주세요",
    "blanks": [
      {
        "id": "content_type",
        "placeholder": "콘텐츠 종류",
        "options": [
          "이 기사", "이 책", "이 연구 논문", "영화 '인셉션'", "상대성 이론", "최신 뉴스"
        ]
      },
      {
        "id": "topic",
        "placeholder": "주제",
        "options": [
          "인공지능 윤리", "줄거리", "주요 주장", "사회에 미친 영향", "현재 경제 전망"
        ]
      }
    ],
    "example": "줄거리에 대한 영화 '인셉션'의 핵심 내용을 요약해주세요"
  },
  {
    "id": "get-feedback-ko",
    "template": "{topic}에 대한 제 {work_type}에 대해 {feedback_area}에 초점을 맞춰 피드백을 주세요",
    "blanks": [
      {
        "id": "work_type",
        "placeholder": "작업물 종류",
        "options": [
          "에세이", "이력서", "자기소개서", "사업 제안서", "단편 소설", "코드 스니펫", "마케팅 이메일"
        ]
      },
      {
        "id": "topic",
        "placeholder": "주제",
        "options": [
          "소프트웨어 엔지니어 직무 자격", "새로운 마케팅 계획", "외로움이라는 주제", "사용자 인증 시스템"
        ]
      },
      {
        "id": "feedback_area",
        "placeholder": "피드백 영역",
        "options": [
          "명확성 및 간결성", "어조 및 스타일", "문법적 정확성", "설득력", "독창성", "기술적 정확성"
        ]
      }
    ],
    "example": "소프트웨어 엔지니어 직무 자격에 대한 제 이력서에 대해 명확성 및 간결성에 초점을 맞춰 피드백을 주세요"
  }
];

// Chinese Templates
export const CHINESE_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about-zh",
    "template": "我想学习关于{topic}的{subject}",
    "blanks": [
      {
        "id": "topic",
        "placeholder": "主题",
        "options": [
          "量子物理学", "机器学习", "烹饪", "摄影", "吉他演奏", "股票交易", "网页开发",
          "3D打印", "会计", "航空航天工程", "人工智能", "天文学", "生物化学", "中国历史", "经济学", "心理学",
          "神经科学", "气候变化", "古代文明", "数字营销", "加密货币", "正念", "园艺", "电影制作",
          "哲学", "数据科学", "机器人学", "虚拟现实", "区块链技术", "基因工程", "文艺复兴", "行为经济学", "可持续农业"
        ]
      },
      {
        "id": "subject",
        "placeholder": "学习内容",
        "options": [
          "基础知识", "高级概念", "实际应用", "历史", "理论", "基本原理", "所有内容",
          "完整概述", "批判性分析", "深入研究", "初学者指南", "简要历史",
          "伦理影响", "未来趋势", "常见误解", "关键人物", "数学基础", "文化影响", "分步指南"
        ]
      }
    ],
    "example": "我想学习关于机器学习的深入研究"
  },
  {
    "id": "understand-how-zh",
    "template": "我想{context}理解{process}是如何工作的",
    "blanks": [
      {
        "id": "process",
        "placeholder": "过程",
        "options": [
          "区块链", "光合作用", "股票市场", "神经网络", "汽车引擎", "计算机", "疫苗", "民主制度", "经济",
          "互联网", "GPS", "人脑", "黑洞", "立法过程", "碳捕获", "核反应堆", "全球经济", "CRISPR基因编辑"
        ]
      },
      {
        "id": "context",
        "placeholder": "方式",
        "options": [
          "详细地", "从头开始", "为初学者", "实用地", "理论上", "逐步地",
          "用一个简单的类比", "使用一个真实的例子", "专注于关键组成部分", "在历史背景下",
          "从化学角度", "从金融角度"
        ]
      }
    ],
    "example": "我想用一个简单的类比理解人脑是如何工作的"
  },
  {
    "id": "explain-like-im-zh",
    "template": "假设我是{audience}，请向我解释{concept}",
    "blanks": [
      {
        "id": "concept",
        "placeholder": "概念",
        "options": [
          "黑洞", "广义相对论", "DNA", "经济通货膨胀", "互联网", "量子计算机",
          "人脑", "自然选择", "智能合约", "暗物质", "万物理论"
        ]
      },
      {
        "id": "audience",
        "placeholder": "听众",
        "options": [
          "一个5岁的孩子", "一个高中生", "一个完全的初学者", "祖父母", "一个投资者",
          "一个营销经理", "来自其他部门的同事", "一个有才智的门外汉"
        ]
      }
    ],
    "example": "假设我是一个5岁的孩子，请向我解释黑洞"
  },
  {
    "id": "write-a-zh",
    "template": "帮我为{audience}写一篇关于{topic}的{document_type}",
    "blanks": [
      {
        "id": "document_type",
        "placeholder": "文档类型",
        "options": [
          "博客文章", "短篇故事", "诗", "电子邮件", "演讲稿", "演示大纲", "营销文案",
          "技术报告", "研究论文提案", "视频脚本", "新闻稿", "职位描述"
        ]
      },
      {
        "id": "topic",
        "placeholder": "主题",
        "options": [
          "远程工作的好处", "太空旅行的未来", "一个虚构的世界", "网络安全的重要性",
          "新产品发布", "罗马帝国的历史", "可持续生活小贴士", "心理健康意识"
        ]
      },
      {
        "id": "audience",
        "placeholder": "读者",
        "options": [
          "普通大众", "潜在客户", "我的团队", "我的老板", "投资者", "技术观众",
          "儿童", "行业专家"
        ]
      }
    ],
    "example": "帮我为普通大众写一篇关于远程工作的好处的博客文章"
  },
  {
    "id": "compare-and-contrast-zh",
    "template": "请根据{criteria}来比较和对比{item_a}和{item_b}",
    "blanks": [
      {
        "id": "item_a",
        "placeholder": "项目A",
        "options": [
          "iOS", "Python", "资本主义", "一部小说", "电动汽车", "在家工作", "猫", "咖啡"
        ]
      },
      {
        "id": "item_b",
        "placeholder": "项目B",
        "options": [
          "安卓", "JavaScript", "社会主义", "一部电影改编", "汽油车", "在办公室工作", "狗", "茶"
        ]
      },
      {
        "id": "criteria",
        "placeholder": "标准",
        "options": [
          "价格和功能", "性能和易用性", "历史影响", "伦理影响",
          "环境影响", "长期可行性", "优缺点"
        ]
      }
    ],
    "example": "请根据性能和易用性来比较和对比iOS和安卓"
  },
  {
    "id": "brainstorm-ideas-zh",
    "template": "为关于{topic}的{project_type}进行头脑风暴",
    "blanks": [
      {
        "id": "project_type",
        "placeholder": "项目类型",
        "options": [
          "一个新业务", "一个YouTube频道", "一个播客系列", "一个移动应用", "一个营销活动",
          "一个研究项目", "一本书", "一个社区活动"
        ]
      },
      {
        "id": "topic",
        "placeholder": "主题",
        "options": [
          "可持续时尚", "本地旅游", "青少年金融知识", "宠物护理", "心理健康",
          "家庭自动化", "学习新语言", "城市园艺"
        ]
      }
    ],
    "example": "为关于可持续时尚的一个新业务进行头脑风暴"
  },
  {
    "id": "create-a-plan-zh",
    "template": "为{goal}创建一个{plan_type}计划",
    "blanks": [
      {
        "id": "plan_type",
        "placeholder": "计划类型",
        "options": [
          "分步", "每周", "30天", "内容营销", "商业", "学习", "健身", "项目"
        ]
      },
      {
        "id": "goal",
        "placeholder": "我的目标",
        "options": [
          "学习编程", "启动一家初创公司", "写一本小说", "跑马拉松",
          "提高我的公开演讲能力", "增加在线观众", "去日本旅行"
        ]
      }
    ],
    "example": "为学习编程创建一个30天计划"
  },
  {
    "id": "find-resources-zh",
    "template": "为我找到学习{topic}的最佳{resource_type}",
    "blanks": [
      {
        "id": "resource_type",
        "placeholder": "资源类型",
        "options": [
          "书籍", "在线课程", "纪录片", "播客", "YouTube频道", "学术论文", "互动网站"
        ]
      },
      {
        "id": "topic",
        "placeholder": "主题",
        "options": [
          "古罗马", "天体物理学", "行为心理学", "平面设计", "投资", "法国大革命"
        ]
      }
    ],
    "example": "为我找到学习投资的最佳在线课程"
  },
  {
    "id": "summarize-this-zh",
    "template": "总结关于{topic}的{content_type}的要点",
    "blanks": [
      {
        "id": "content_type",
        "placeholder": "内容类型",
        "options": [
          "这篇文章", "这本书", "这篇研究论文", "电影《盗梦空间》", "相对论", "最新新闻"
        ]
      },
      {
        "id": "topic",
        "placeholder": "主题",
        "options": [
          "人工智能伦理", "情节", "其主要论点", "其对社会的影响", "当前经济前景"
        ]
      }
    ],
    "example": "总结关于情节的电影《盗梦空间》的要点"
  },
  {
    "id": "get-feedback-zh",
    "template": "请就我关于{topic}的{work_type}给出反馈，重点关注{feedback_area}",
    "blanks": [
      {
        "id": "work_type",
        "placeholder": "作品类型",
        "options": [
          "文章", "简历", "求职信", "商业计划书", "短篇故事", "代码片段", "营销邮件"
        ]
      },
      {
        "id": "topic",
        "placeholder": "主题",
        "options": [
          "我作为软件工程师的资格", "一项新的营销计划", "孤独的主题", "一个用户认证系统"
        ]
      },
      {
        "id": "feedback_area",
        "placeholder": "反馈领域",
        "options": [
          "清晰度和简洁性", "语气和风格", "语法正确性", "说服力", "原创性", "技术准确性"
        ]
      }
    ],
    "example": "请就我关于我作为软件工程师的资格的简历给出反馈，重点关注清晰度和简洁性"
  }
];

// Japanese Templates
export const JAPANESE_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about-ja",
    "template": "{topic}について{subject}学びたいです",
    "blanks": [
      {
        "id": "topic",
        "placeholder": "トピック",
        "options": [
          "量子物理学", "機械学習", "料理", "写真", "ギター演奏", "株式取引", "ウェブ開発",
          "3Dプリンティング", "会計", "航空宇宙工学", "人工知能", "天文学", "生化学", "日本史", "経済学", "心理学",
          "神経科学", "気候変動", "古代文明", "デジタルマーケティング", "暗号資産", "マインドフルネス", "ガーデニング",
          "映画制作", "哲学", "データサイエンス", "ロボット工学", "仮想現実", "ブロックチェーン技術", "遺伝子工学",
          "ルネサンス", "行動経済学", "持続可能な農業"
        ]
      },
      {
        "id": "subject",
        "placeholder": "学習内容",
        "options": [
          "基礎を", "高度な概念を", "実用的な応用を", "歴史を", "理論を", "基本原理を", "すべてを",
          "完全な概要を", "批判的分析を", "深い理解を", "初心者向けガイドを", "簡潔な歴史を",
          "倫理的含意を", "将来の動向を", "よくある誤解を", "主要人物を", "数学的基礎を",
          "文化的影響を", "ステップバイステップのガイドを"
        ]
      }
    ],
    "example": "機械学習について深い理解を学びたいです"
  },
  {
    "id": "understand-how-ja",
    "template": "{process}がどのように機能するかを{context}理解したいです",
    "blanks": [
      {
        "id": "process",
        "placeholder": "プロセス",
        "options": [
          "ブロックチェーン", "光合成", "株式市場", "ニューラルネットワーク", "自動車エンジン", "コンピューター", "ワクチン", "民主主義", "経済",
          "インターネット", "GPS", "人間の脳", "ブラックホール", "立法プロセス", "炭素回収", "原子炉", "世界経済", "CRISPR遺伝子編集"
        ]
      },
      {
        "id": "context",
        "placeholder": "方法",
        "options": [
          "詳細に", "最初から", "初心者向けに", "実践的に", "理論的に", "段階的に",
          "簡単な例えで", "実世界の例を使って", "主要な構成要素に焦点を当てて", "歴史的文脈で",
          "化学的観点から", "金融的観点から"
        ]
      }
    ],
    "example": "人間の脳がどのように機能するかを簡単な例えで理解したいです"
  },
  {
    "id": "explain-like-im-ja",
    "template": "{concept}について、私が{audience}であるかのように説明してください",
    "blanks": [
      {
        "id": "concept",
        "placeholder": "概念",
        "options": [
          "ブラックホール", "一般相対性理論", "DNA", "経済インフレ", "インターネット", "量子コンピュータ",
          "人間の脳", "自然選択", "スマートコントラクト", "暗黒物質", "万物の理論"
        ]
      },
      {
        "id": "audience",
        "placeholder": "聞き手",
        "options": [
          "5歳児", "高校生", "完全な初心者", "祖父母", "投資家",
          "マーケティングマネージャー", "他部署の同僚", "知的な素人"
        ]
      }
    ],
    "example": "ブラックホールについて、私が5歳児であるかのように説明してください"
  },
  {
    "id": "write-a-ja",
    "template": "{audience}のために、{topic}に関する{document_type}の作成を手伝ってください",
    "blanks": [
      {
        "id": "document_type",
        "placeholder": "文書の種類",
        "options": [
          "ブログ記事", "短編小説", "詩", "メール", "スピーチ原稿", "プレゼンの概要", "マーケティングコピー",
          "技術レポート", "研究論文の提案書", "ビデオの脚本", "プレスリリース", "職務記述書"
        ]
      },
      {
        "id": "topic",
        "placeholder": "トピック",
        "options": [
          "リモートワークの利点", "宇宙旅行の未来", "架空の世界", "サイバーセキュリティの重要性",
          "新製品の発売", "ローマ帝国の歴史", "持続可能な生活のヒント", "メンタルヘルスへの意識"
        ]
      },
      {
        "id": "audience",
        "placeholder": "対象者",
        "options": [
          "一般の人々", "潜在的な顧客", "私のチーム", "私の上司", "投資家", "技術的な聴衆",
          "子供たち", "業界の専門家"
        ]
      }
    ],
    "example": "一般の人々のために、リモートワークの利点に関するブログ記事の作成を手伝ってください"
  },
  {
    "id": "compare-and-contrast-ja",
    "template": "{criteria}に基づいて{item_a}と{item_b}を比較対照してください",
    "blanks": [
      {
        "id": "item_a",
        "placeholder": "項目A",
        "options": [
          "iOS", "Python", "資本主義", "小説", "電気自動車", "在宅勤務", "猫", "コーヒー"
        ]
      },
      {
        "id": "item_b",
        "placeholder": "項目B",
        "options": [
          "Android", "JavaScript", "社会主義", "映画化作品", "ガソリン車", "オフィス勤務", "犬", "お茶"
        ]
      },
      {
        "id": "criteria",
        "placeholder": "基準",
        "options": [
          "価格と機能", "性能と使いやすさ", "歴史的影響", "倫理的含意",
          "環境への影響", "長期的な存続可能性", "長所と短所"
        ]
      }
    ],
    "example": "性能と使いやすさに基づいてiOSとAndroidを比較対照してください"
  },
  {
    "id": "brainstorm-ideas-ja",
    "template": "{topic}に関する{project_type}のアイデアをブレインストーミングしてください",
    "blanks": [
      {
        "id": "project_type",
        "placeholder": "プロジェクトの種類",
        "options": [
          "新しいビジネス", "YouTubeチャンネル", "ポッドキャストシリーズ", "モバイルアプリ", "マーケティングキャンペーン",
          "研究プロジェクト", "本", "コミュニティイベント"
        ]
      },
      {
        "id": "topic",
        "placeholder": "トピック",
        "options": [
          "サステナブルファッション", "地域観光", "ティーン向けの金融リテラシー", "ペットケア", "メンタルウェルネス",
          "ホームオートメーション", "新しい言語の学習", "都市型ガーデニング"
        ]
      }
    ],
    "example": "サステナブルファッションに関する新しいビジネスのアイデアをブレインストーミングしてください"
  },
  {
    "id": "create-a-plan-ja",
    "template": "{goal}のための{plan_type}計画を作成してください",
    "blanks": [
      {
        "id": "plan_type",
        "placeholder": "計画の種類",
        "options": [
          "ステップバイステップの", "週間", "30日間", "コンテンツマーケティング", "ビジネス", "学習", "フィットネス", "プロジェクト"
        ]
      },
      {
        "id": "goal",
        "placeholder": "私の目標",
        "options": [
          "コーディングを学ぶこと", "スタートアップを立ち上げること", "小説を書くこと", "マラソンを走ること",
          "パブリックスピーキングを上達させること", "オンラインのフォロワーを増やすこと", "日本への旅行"
        ]
      }
    ],
    "example": "コーディングを学ぶことのための30日間計画を作成してください"
  },
  {
    "id": "find-resources-ja",
    "template": "{topic}を学ぶための最高の{resource_type}を見つけてください",
    "blanks": [
      {
        "id": "resource_type",
        "placeholder": "リソースの種類",
        "options": [
          "本", "オンラインコース", "ドキュメンタリー", "ポッドキャスト", "YouTubeチャンネル", "学術論文", "インタラクティブなウェブサイト"
        ]
      },
      {
        "id": "topic",
        "placeholder": "トピック",
        "options": [
          "古代ローマ", "宇宙物理学", "行動心理学", "グラフィックデザイン", "投資", "フランス革命"
        ]
      }
    ],
    "example": "投資を学ぶための最高のオンラインコースを見つけてください"
  },
  {
    "id": "summarize-this-ja",
    "template": "{topic}に関する{content_type}の要点を要約してください",
    "blanks": [
      {
        "id": "content_type",
        "placeholder": "コンテンツの種類",
        "options": [
          "この記事", "この本", "この研究論文", "映画「インセプション」", "相対性理論", "最新ニュース"
        ]
      },
      {
        "id": "topic",
        "placeholder": "トピック",
        "options": [
          "人工知能の倫理", "プロット", "その主な議論", "社会への影響", "現在の経済見通し"
        ]
      }
    ],
    "example": "プロットに関する映画「インセプション」の要点を要約してください"
  },
  {
    "id": "get-feedback-ja",
    "template": "{topic}に関する私の{work_type}について、{feedback_area}に焦点を当ててフィードバックをください",
    "blanks": [
      {
        "id": "work_type",
        "placeholder": "作品の種類",
        "options": [
          "エッセイ", "履歴書", "カバーレター", "事業提案書", "短編小説", "コードスニペット", "マーケティングメール"
        ]
      },
      {
        "id": "topic",
        "placeholder": "トピック",
        "options": [
          "ソフトウェアエンジニア職の資格", "新しいマーケティングイニシアチブ", "孤独というテーマ", "ユーザー認証システム"
        ]
      },
      {
        "id": "feedback_area",
        "placeholder": "フィードバックの領域",
        "options": [
          "明確さと簡潔さ", "トーンとスタイル", "文法的な正しさ", "説得力", "独創性", "技術的な正確さ"
        ]
      }
    ],
    "example": "ソフトウェアエンジニア職の資格に関する私の履歴書について、明確さと簡潔さに焦点を当ててフィードバックをください"
  }
];

// Spanish Templates
export const SPANISH_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about-es",
    "template": "Quiero aprender {subject} sobre {topic}",
    "blanks": [
      {
        "id": "subject",
        "placeholder": "qué",
        "options": [
          "lo básico", "conceptos avanzados", "aplicaciones prácticas", "la historia", "la teoría", "los fundamentos", "todo",
          "una visión completa de", "un análisis crítico de", "un estudio profundo de", "una guía para principiantes de", "una breve historia de",
          "las implicaciones éticas de", "las tendencias futuras de", "los mitos comunes sobre", "las figuras clave en",
          "los fundamentos matemáticos de", "el impacto cultural de", "una guía paso a paso de"
        ]
      },
      {
        "id": "topic",
        "placeholder": "tema",
        "options": [
          "física cuántica", "aprendizaje automático", "cocina", "fotografía", "tocar la guitarra", "trading de acciones", "desarrollo web",
          "impresión 3D", "contabilidad", "ingeniería aeroespacial", "inteligencia artificial", "astronomía", "bioquímica", "historia de España", "economía", "psicología",
          "neurociencia", "cambio climático", "civilizaciones antiguas", "marketing digital", "criptomonedas", "mindfulness",
          "jardinería", "producción de cine", "filosofía", "ciencia de datos", "robótica", "realidad virtual", "tecnología blockchain",
          "ingeniería genética", "el Renacimiento", "economía conductual", "agricultura sostenible"
        ]
      }
    ],
    "example": "Quiero aprender un estudio profundo de sobre aprendizaje automático"
  },
  {
    "id": "understand-how-es",
    "template": "Quiero entender cómo funciona {process} {context}",
    "blanks": [
      {
        "id": "process",
        "placeholder": "proceso",
        "options": [
          "el blockchain", "la fotosíntesis", "el mercado de valores", "las redes neuronales", "los motores de coche", "los ordenadores", "las vacunas", "la democracia", "la economía",
          "internet", "el GPS", "el cerebro humano", "un agujero negro", "el proceso legislativo", "la captura de carbono", "un reactor nuclear", "la economía global", "la edición genética CRISPR"
        ]
      },
      {
        "id": "context",
        "placeholder": "contexto",
        "options": [
          "en detalle", "desde cero", "para principiantes", "prácticamente", "teóricamente", "paso a paso",
          "con una analogía simple", "usando un ejemplo real", "centrándome en los componentes clave", "en un contexto histórico",
          "desde una perspectiva química", "desde una perspectiva financiera"
        ]
      }
    ],
    "example": "Quiero entender cómo funciona el cerebro humano con una analogía simple"
  },
  {
    "id": "explain-like-im-es",
    "template": "Explícame {concept} como si yo fuera {audience}",
    "blanks": [
      {
        "id": "concept",
        "placeholder": "concepto",
        "options": [
          "un agujero negro", "la relatividad general", "el ADN", "la inflación económica", "internet", "un ordenador cuántico",
          "el cerebro humano", "la selección natural", "un contrato inteligente", "la materia oscura", "la teoría del todo"
        ]
      },
      {
        "id": "audience",
        "placeholder": "audiencia",
        "options": [
          "un niño de 5 años", "un estudiante de secundaria", "un principiante total", "un abuelo", "un inversor",
          "un gerente de marketing", "un colega de otro departamento", "un lego inteligente"
        ]
      }
    ],
    "example": "Explícame un agujero negro como si yo fuera un niño de 5 años"
  },
  {
    "id": "write-a-es",
    "template": "Ayúdame a escribir {document_type} sobre {topic} para {audience}",
    "blanks": [
      {
        "id": "document_type",
        "placeholder": "tipo de documento",
        "options": [
          "un post de blog", "una historia corta", "un poema", "un correo electrónico", "un discurso", "un esquema de presentación", "un texto de marketing",
          "un informe técnico", "una propuesta de investigación", "un guion para un vídeo", "un comunicado de prensa", "una descripción de puesto"
        ]
      },
      {
        "id": "topic",
        "placeholder": "tema",
        "options": [
          "los beneficios del trabajo remoto", "el futuro de los viajes espaciales", "un mundo de ficción", "la importancia de la ciberseguridad",
          "el lanzamiento de un nuevo producto", "la historia del Imperio Romano", "consejos de vida sostenible", "la conciencia sobre la salud mental"
        ]
      },
      {
        "id": "audience",
        "placeholder": "audiencia",
        "options": [
          "el público general", "clientes potenciales", "mi equipo", "mi jefe", "inversores", "una audiencia técnica",
          "niños", "expertos de la industria"
        ]
      }
    ],
    "example": "Ayúdame a escribir un post de blog sobre los beneficios del trabajo remoto para el público general"
  },
  {
    "id": "compare-and-contrast-es",
    "template": "Compara y contrasta {item_a} y {item_b} en base a {criteria}",
    "blanks": [
      {
        "id": "item_a",
        "placeholder": "elemento A",
        "options": [
          "iOS", "Python", "el capitalismo", "una novela", "los coches eléctricos", "trabajar desde casa", "los gatos", "el café"
        ]
      },
      {
        "id": "item_b",
        "placeholder": "elemento B",
        "options": [
          "Android", "JavaScript", "el socialismo", "una adaptación cinematográfica", "los coches de gasolina", "trabajar en una oficina", "los perros", "el té"
        ]
      },
      {
        "id": "criteria",
        "placeholder": "criterios",
        "options": [
          "precio y características", "rendimiento y facilidad de uso", "impacto histórico", "implicaciones éticas",
          "impacto ambiental", "viabilidad a largo plazo", "pros y contras"
        ]
      }
    ],
    "example": "Compara y contrasta iOS y Android en base a rendimiento y facilidad de uso"
  },
  {
    "id": "brainstorm-ideas-es",
    "template": "Haz una lluvia de ideas para {project_type} sobre {topic}",
    "blanks": [
      {
        "id": "project_type",
        "placeholder": "tipo de proyecto",
        "options": [
          "un nuevo negocio", "un canal de YouTube", "una serie de podcasts", "una aplicación móvil", "una campaña de marketing",
          "un proyecto de investigación", "un libro", "un evento comunitario"
        ]
      },
      {
        "id": "topic",
        "placeholder": "tema",
        "options": [
          "moda sostenible", "turismo local", "educación financiera para adolescentes", "cuidado de mascotas", "bienestar mental",
          "domótica", "aprender nuevos idiomas", "jardinería urbana"
        ]
      }
    ],
    "example": "Haz una lluvia de ideas para un nuevo negocio sobre moda sostenible"
  },
  {
    "id": "create-a-plan-es",
    "template": "Crea un plan {plan_type} para {goal}",
    "blanks": [
      {
        "id": "plan_type",
        "placeholder": "tipo de plan",
        "options": [
          "paso a paso", "semanal", "de 30 días", "de marketing de contenidos", "de negocio", "de estudio", "de fitness", "de proyecto"
        ]
      },
      {
        "id": "goal",
        "placeholder": "mi objetivo",
        "options": [
          "aprender a programar", "lanzar una startup", "escribir una novela", "correr un maratón",
          "mejorar mi oratoria", "hacer crecer una audiencia online", "un viaje a Japón"
        ]
      }
    ],
    "example": "Crea un plan de 30 días para aprender a programar"
  },
  {
    "id": "find-resources-es",
    "template": "Encuéntrame los mejores {resource_type} para aprender sobre {topic}",
    "blanks": [
      {
        "id": "resource_type",
        "placeholder": "tipo de recurso",
        "options": [
          "libros", "cursos online", "documentales", "podcasts", "canales de YouTube", "artículos académicos", "sitios web interactivos"
        ]
      },
      {
        "id": "topic",
        "placeholder": "tema",
        "options": [
          "la Antigua Roma", "astrofísica", "psicología conductual", "diseño gráfico", "inversión", "la Revolución Francesa"
        ]
      }
    ],
    "example": "Encuéntrame los mejores cursos online para aprender sobre inversión"
  },
  {
    "id": "summarize-this-es",
    "template": "Resume los puntos clave de {content_type} sobre {topic}",
    "blanks": [
      {
        "id": "content_type",
        "placeholder": "tipo de contenido",
        "options": [
          "este artículo", "este libro", "este trabajo de investigación", "la película 'Origen'", "la teoría de la relatividad", "las últimas noticias"
        ]
      },
      {
        "id": "topic",
        "placeholder": "tema",
        "options": [
          "la ética de la inteligencia artificial", "la trama", "sus argumentos principales", "su impacto en la sociedad", "la perspectiva económica actual"
        ]
      }
    ],
    "example": "Resume los puntos clave de la película 'Origen' sobre la trama"
  },
  {
    "id": "get-feedback-es",
    "template": "Dame feedback sobre mi {work_type} acerca de {topic}, centrándote en {feedback_area}",
    "blanks": [
      {
        "id": "work_type",
        "placeholder": "tipo de trabajo",
        "options": [
          "ensayo", "currículum", "carta de presentación", "propuesta de negocio", "historia corta", "fragmento de código", "email de marketing"
        ]
      },
      {
        "id": "topic",
        "placeholder": "tema",
        "options": [
          "mis cualificaciones para un puesto de ingeniero de software", "una nueva iniciativa de marketing", "el tema de la soledad", "un sistema de autenticación de usuarios"
        ]
      },
      {
        "id": "feedback_area",
        "placeholder": "área de feedback",
        "options": [
          "claridad y concisión", "tono y estilo", "corrección gramatical", "persuasión", "originalidad", "precisión técnica"
        ]
      }
    ],
    "example": "Dame feedback sobre mi currículum acerca de mis cualificaciones para un puesto de ingeniero de software, centrándote en claridad y concisión"
  }
];

// Italian Templates
export const ITALIAN_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about-it",
    "template": "Voglio imparare {subject} su {topic}",
    "blanks": [
      {
        "id": "subject",
        "placeholder": "cosa",
        "options": [
          "le basi", "concetti avanzati", "applicazioni pratiche", "la storia", "la teoria", "i fondamenti", "tutto",
          "una panoramica completa", "un'analisi critica", "uno studio approfondito", "una guida per principianti", "una breve storia",
          "le implicazioni etiche", "le tendenze future", "i luoghi comuni", "le figure chiave",
          "le basi matematiche", "l'impatto culturale", "una guida passo passo"
        ]
      },
      {
        "id": "topic",
        "placeholder": "argomento",
        "options": [
          "fisica quantistica", "machine learning", "cucina", "fotografia", "suonare la chitarra", "trading azionario", "sviluppo web",
          "stampa 3D", "contabilità", "ingegneria aerospaziale", "intelligenza artificiale", "astronomia", "biochimica", "storia italiana", "economia", "psicologia",
          "neuroscienze", "cambiamento climatico", "civiltà antiche", "marketing digitale", "criptovalute", "mindfulness",
          "giardinaggio", "produzione cinematografica", "filosofia", "scienza dei dati", "robotica", "realtà virtuale", "tecnologia blockchain",
          "ingegneria genetica", "il Rinascimento", "economia comportamentale", "agricoltura sostenibile"
        ]
      }
    ],
    "example": "Voglio imparare uno studio approfondito su machine learning"
  },
  {
    "id": "understand-how-it",
    "template": "Voglio capire come funziona {process} {context}",
    "blanks": [
      {
        "id": "process",
        "placeholder": "processo",
        "options": [
          "la blockchain", "la fotosintesi", "il mercato azionario", "le reti neurali", "i motori delle auto", "i computer", "i vaccini", "la democrazia", "l'economia",
          "internet", "il GPS", "il cervello umano", "un buco nero", "il processo legislativo", "la cattura del carbonio", "un reattore nucleare", "l'economia globale", "l'editing genetico CRISPR"
        ]
      },
      {
        "id": "context",
        "placeholder": "contesto",
        "options": [
          "in dettaglio", "da zero", "per principianti", "praticamente", "teoricamente", "passo dopo passo",
          "con una semplice analogia", "usando un esempio reale", "concentrandomi sui componenti chiave", "in un contesto storico",
          "da una prospettiva chimica", "da una prospettiva finanziaria"
        ]
      }
    ],
    "example": "Voglio capire come funziona il cervello umano con una semplice analogia"
  },
  {
    "id": "explain-like-im-it",
    "template": "Spiegami {concept} come se fossi {audience}",
    "blanks": [
      {
        "id": "concept",
        "placeholder": "concetto",
        "options": [
          "un buco nero", "la relatività generale", "il DNA", "l'inflazione economica", "internet", "un computer quantistico",
          "il cervello umano", "la selezione naturale", "uno smart contract", "la materia oscura", "la teoria del tutto"
        ]
      },
      {
        "id": "audience",
        "placeholder": "pubblico",
        "options": [
          "un bambino di 5 anni", "uno studente di liceo", "un principiante assoluto", "un nonno", "un investitore",
          "un marketing manager", "un collega di un altro dipartimento", "un laico intelligente"
        ]
      }
    ],
    "example": "Spiegami un buco nero come se fossi un bambino di 5 anni"
  },
  {
    "id": "write-a-it",
    "template": "Aiutami a scrivere {document_type} su {topic} per {audience}",
    "blanks": [
      {
        "id": "document_type",
        "placeholder": "tipo di documento",
        "options": [
          "un post per un blog", "un racconto", "una poesia", "un'email", "un discorso", "la scaletta di una presentazione", "un testo di marketing",
          "un rapporto tecnico", "una proposta di ricerca", "la sceneggiatura per un video", "un comunicato stampa", "una descrizione di lavoro"
        ]
      },
      {
        "id": "topic",
        "placeholder": "argomento",
        "options": [
          "i benefici del lavoro da remoto", "il futuro dei viaggi spaziali", "un mondo immaginario", "l'importanza della cybersecurity",
          "il lancio di un nuovo prodotto", "la storia dell'Impero Romano", "consigli per una vita sostenibile", "la consapevolezza sulla salute mentale"
        ]
      },
      {
        "id": "audience",
        "placeholder": "pubblico",
        "options": [
          "il grande pubblico", "potenziali clienti", "il mio team", "il mio capo", "investitori", "un pubblico tecnico",
          "bambini", "esperti del settore"
        ]
      }
    ],
    "example": "Aiutami a scrivere un post per un blog su i benefici del lavoro da remoto per il grande pubblico"
  },
  {
    "id": "compare-and-contrast-it",
    "template": "Confronta e contrapponi {item_a} e {item_b} in base a {criteria}",
    "blanks": [
      {
        "id": "item_a",
        "placeholder": "elemento A",
        "options": [
          "iOS", "Python", "il capitalismo", "un romanzo", "le auto elettriche", "lavorare da casa", "i gatti", "il caffè"
        ]
      },
      {
        "id": "item_b",
        "placeholder": "elemento B",
        "options": [
          "Android", "JavaScript", "il socialismo", "un adattamento cinematografico", "le auto a benzina", "lavorare in ufficio", "i cani", "il tè"
        ]
      },
      {
        "id": "criteria",
        "placeholder": "criteri",
        "options": [
          "prezzo e caratteristiche", "prestazioni e facilità d'uso", "impatto storico", "implicazioni etiche",
          "impatto ambientale", "sostenibilità a lungo termine", "pro e contro"
        ]
      }
    ],
    "example": "Confronta e contrapponi iOS e Android in base a prestazioni e facilità d'uso"
  },
  {
    "id": "brainstorm-ideas-it",
    "template": "Fai brainstorming di idee per {project_type} su {topic}",
    "blanks": [
      {
        "id": "project_type",
        "placeholder": "tipo di progetto",
        "options": [
          "una nuova attività", "un canale YouTube", "una serie di podcast", "un'app mobile", "una campagna di marketing",
          "un progetto di ricerca", "un libro", "un evento comunitario"
        ]
      },
      {
        "id": "topic",
        "placeholder": "argomento",
        "options": [
          "moda sostenibile", "turismo locale", "educazione finanziaria per adolescenti", "cura degli animali domestici", "benessere mentale",
          "domotica", "imparare nuove lingue", "giardinaggio urbano"
        ]
      }
    ],
    "example": "Fai brainstorming di idee per una nuova attività su moda sostenibile"
  },
  {
    "id": "create-a-plan-it",
    "template": "Crea un piano {plan_type} per {goal}",
    "blanks": [
      {
        "id": "plan_type",
        "placeholder": "tipo di piano",
        "options": [
          "passo passo", "settimanale", "di 30 giorni", "di content marketing", "aziendale", "di studio", "di fitness", "di progetto"
        ]
      },
      {
        "id": "goal",
        "placeholder": "il mio obiettivo",
        "options": [
          "imparare a programmare", "avviare una startup", "scrivere un romanzo", "correre una maratona",
          "migliorare il mio public speaking", "far crescere un pubblico online", "un viaggio in Giappone"
        ]
      }
    ],
    "example": "Crea un piano di 30 giorni per imparare a programmare"
  },
  {
    "id": "find-resources-it",
    "template": "Trovami le migliori {resource_type} per imparare {topic}",
    "blanks": [
      {
        "id": "resource_type",
        "placeholder": "tipo di risorsa",
        "options": [
          "libri", "corsi online", "documentari", "podcast", "canali YouTube", "articoli accademici", "siti web interattivi"
        ]
      },
      {
        "id": "topic",
        "placeholder": "argomento",
        "options": [
          "l'Antica Roma", "astrofisica", "psicologia comportamentale", "graphic design", "investimenti", "la Rivoluzione Francese"
        ]
      }
    ],
    "example": "Trovami i migliori corsi online per imparare investimenti"
  },
  {
    "id": "summarize-this-it",
    "template": "Riassumi i punti chiave di {content_type} su {topic}",
    "blanks": [
      {
        "id": "content_type",
        "placeholder": "tipo di contenuto",
        "options": [
          "questo articolo", "questo libro", "questa ricerca", "il film 'Inception'", "la teoria della relatività", "le ultime notizie"
        ]
      },
      {
        "id": "topic",
        "placeholder": "argomento",
        "options": [
          "l'etica dell'intelligenza artificiale", "la trama", "le sue argomentazioni principali", "il suo impatto sulla società", "le attuali prospettive economiche"
        ]
      }
    ],
    "example": "Riassumi i punti chiave di il film 'Inception' su la trama"
  },
  {
    "id": "get-feedback-it",
    "template": "Dammi un feedback sul mio {work_type} riguardo a {topic}, concentrandoti su {feedback_area}",
    "blanks": [
      {
        "id": "work_type",
        "placeholder": "tipo di lavoro",
        "options": [
          "saggio", "curriculum", "lettera di presentazione", "proposta commerciale", "racconto", "frammento di codice", "email di marketing"
        ]
      },
      {
        "id": "topic",
        "placeholder": "argomento",
        "options": [
          "le mie qualifiche per un ruolo di ingegnere del software", "una nuova iniziativa di marketing", "il tema della solitudine", "un sistema di autenticazione utente"
        ]
      },
      {
        "id": "feedback_area",
        "placeholder": "area di feedback",
        "options": [
          "chiarezza e concisione", "tono e stile", "correttezza grammaticale", "persuasività", "originalità", "accuratezza tecnica"
        ]
      }
    ],
    "example": "Dammi un feedback sul mio curriculum riguardo a le mie qualifiche per un ruolo di ingegnere del software, concentrandoti su chiarezza e concisione"
  }
];

// German Templates
export const GERMAN_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about-de",
    "template": "Ich möchte {subject} über {topic} lernen",
    "blanks": [
      {
        "id": "subject",
        "placeholder": "was",
        "options": [
          "die Grundlagen", "fortgeschrittene Konzepte", "praktische Anwendungen", "die Geschichte", "die Theorie", "die Grundprinzipien", "alles",
          "einen vollständigen Überblick", "eine kritische Analyse", "eine tiefgehende Studie", "einen Anfängerleitfaden", "eine kurze Geschichte",
          "die ethischen Implikationen", "die zukünftigen Trends", "häufige Missverständnisse", "die Schlüsselfiguren",
          "die mathematischen Grundlagen", "den kulturellen Einfluss", "eine Schritt-für-Schritt-Anleitung"
        ]
      },
      {
        "id": "topic",
        "placeholder": "Thema",
        "options": [
          "Quantenphysik", "maschinelles Lernen", "Kochen", "Fotografie", "Gitarre spielen", "Aktienhandel", "Webentwicklung",
          "3D-Druck", "Buchhaltung", "Luft- und Raumfahrttechnik", "künstliche Intelligenz", "Astronomie", "Biochemie", "deutsche Geschichte", "Wirtschaft", "Psychologie",
          "Neurowissenschaften", "Klimawandel", "antike Zivilisationen", "digitales Marketing", "Kryptowährung", "Achtsamkeit",
          "Gartenarbeit", "Filmproduktion", "Philosophie", "Datenwissenschaft", "Robotik", "virtuelle Realität", "Blockchain-Technologie",
          "Gentechnik", "die Renaissance", "Verhaltensökonomie", "nachhaltige Landwirtschaft"
        ]
      }
    ],
    "example": "Ich möchte eine tiefgehende Studie über maschinelles Lernen lernen"
  },
  {
    "id": "understand-how-de",
    "template": "Ich möchte verstehen, wie {process} {context} funktioniert",
    "blanks": [
      {
        "id": "process",
        "placeholder": "Prozess",
        "options": [
          "die Blockchain", "die Photosynthese", "der Aktienmarkt", "neuronale Netzwerke", "Automotoren", "Computer", "Impfstoffe", "die Demokratie", "die Wirtschaft",
          "das Internet", "GPS", "das menschliche Gehirn", "ein Schwarzes Loch", "der Gesetzgebungsprozess", "die Kohlenstoffabscheidung", "ein Kernreaktor", "die Weltwirtschaft", "CRISPR-Gen-Editing"
        ]
      },
      {
        "id": "context",
        "placeholder": "Kontext",
        "options": [
          "im Detail", "von Grund auf", "für Anfänger", "praktisch", "theoretisch", "Schritt für Schritt",
          "mit einer einfachen Analogie", "anhand eines realen Beispiels", "mit Fokus auf die Schlüsselkomponenten", "in einem historischen Kontext",
          "aus chemischer Sicht", "aus finanzieller Sicht"
        ]
      }
    ],
    "example": "Ich möchte verstehen, wie das menschliche Gehirn mit einer einfachen Analogie funktioniert"
  },
  {
    "id": "explain-like-im-de",
    "template": "Erkläre mir {concept}, als wäre ich {audience}",
    "blanks": [
      {
        "id": "concept",
        "placeholder": "Konzept",
        "options": [
          "ein Schwarzes Loch", "die allgemeine Relativitätstheorie", "die DNA", "die wirtschaftliche Inflation", "das Internet", "ein Quantencomputer",
          "das menschliche Gehirn", "die natürliche Selektion", "ein Smart Contract", "die dunkle Materie", "die Weltformel"
        ]
      },
      {
        "id": "audience",
        "placeholder": "Zielgruppe",
        "options": [
          "ein 5-jähriges Kind", "ein Gymnasiast", "ein absoluter Anfänger", "ein Großelternteil", "ein Investor",
          "ein Marketingmanager", "ein Kollege aus einer anderen Abteilung", "ein intelligenter Laie"
        ]
      }
    ],
    "example": "Erkläre mir ein Schwarzes Loch, als wäre ich ein 5-jähriges Kind"
  },
  {
    "id": "write-a-de",
    "template": "Hilf mir, {document_type} über {topic} für {audience} zu schreiben",
    "blanks": [
      {
        "id": "document_type",
        "placeholder": "Dokumententyp",
        "options": [
          "einen Blogbeitrag", "eine Kurzgeschichte", "ein Gedicht", "eine E-Mail", "eine Rede", "eine Präsentationsgliederung", "einen Marketingtext",
          "einen technischen Bericht", "einen Forschungsantrag", "ein Skript für ein Video", "eine Pressemitteilung", "eine Stellenbeschreibung"
        ]
      },
      {
        "id": "topic",
        "placeholder": "Thema",
        "options": [
          "die Vorteile von Remote-Arbeit", "die Zukunft der Raumfahrt", "eine fiktive Welt", "die Bedeutung von Cybersicherheit",
          "eine neue Produkteinführung", "die Geschichte des Römischen Reiches", "Tipps für ein nachhaltiges Leben", "das Bewusstsein für psychische Gesundheit"
        ]
      },
      {
        "id": "audience",
        "placeholder": "Zielgruppe",
        "options": [
          "die allgemeine Öffentlichkeit", "potenzielle Kunden", "mein Team", "mein Chef", "Investoren", "ein technisches Publikum",
          "Kinder", "Branchenexperten"
        ]
      }
    ],
    "example": "Hilf mir, einen Blogbeitrag über die Vorteile von Remote-Arbeit für die allgemeine Öffentlichkeit zu schreiben"
  },
  {
    "id": "compare-and-contrast-de",
    "template": "Vergleiche und kontrastiere {item_a} und {item_b} basierend auf {criteria}",
    "blanks": [
      {
        "id": "item_a",
        "placeholder": "Element A",
        "options": [
          "iOS", "Python", "Kapitalismus", "ein Roman", "Elektroautos", "Homeoffice", "Katzen", "Kaffee"
        ]
      },
      {
        "id": "item_b",
        "placeholder": "Element B",
        "options": [
          "Android", "JavaScript", "Sozialismus", "eine Verfilmung", "Benzinautos", "Arbeiten im Büro", "Hunde", "Tee"
        ]
      },
      {
        "id": "criteria",
        "placeholder": "Kriterien",
        "options": [
          "Preis und Funktionen", "Leistung und Benutzerfreundlichkeit", "historische Auswirkungen", "ethische Implikationen",
          "Umweltauswirkungen", "langfristige Rentabilität", "Vor- und Nachteile"
        ]
      }
    ],
    "example": "Vergleiche und kontrastiere iOS und Android basierend auf Leistung und Benutzerfreundlichkeit"
  },
  {
    "id": "brainstorm-ideas-de",
    "template": "Sammle Ideen für {project_type} zum Thema {topic}",
    "blanks": [
      {
        "id": "project_type",
        "placeholder": "Projekttyp",
        "options": [
          "ein neues Unternehmen", "einen YouTube-Kanal", "eine Podcast-Serie", "eine mobile App", "eine Marketingkampagne",
          "ein Forschungsprojekt", "ein Buch", "eine Gemeinschaftsveranstaltung"
        ]
      },
      {
        "id": "topic",
        "placeholder": "Thema",
        "options": [
          "nachhaltige Mode", "lokaler Tourismus", "Finanzbildung für Jugendliche", "Haustierpflege", "psychisches Wohlbefinden",
          "Heimautomatisierung", "neue Sprachen lernen", "städtisches Gärtnern"
        ]
      }
    ],
    "example": "Sammle Ideen für ein neues Unternehmen zum Thema nachhaltige Mode"
  },
  {
    "id": "create-a-plan-de",
    "template": "Erstelle einen {plan_type}-Plan für {goal}",
    "blanks": [
      {
        "id": "plan_type",
        "placeholder": "Plantyp",
        "options": [
          "Schritt-für-Schritt", "wöchentlichen", "30-Tage", "Content-Marketing", "Geschäfts", "Lern", "Fitness", "Projekt"
        ]
      },
      {
        "id": "goal",
        "placeholder": "mein Ziel",
        "options": [
          "Programmieren lernen", "ein Startup gründen", "einen Roman schreiben", "einen Marathon laufen",
          "meine Redekunst verbessern", "ein Online-Publikum aufbauen", "eine Reise nach Japan"
        ]
      }
    ],
    "example": "Erstelle einen 30-Tage-Plan für Programmieren lernen"
  },
  {
    "id": "find-resources-de",
    "template": "Finde die besten {resource_type} zum Lernen von {topic}",
    "blanks": [
      {
        "id": "resource_type",
        "placeholder": "Ressourcentyp",
        "options": [
          "Bücher", "Online-Kurse", "Dokumentationen", "Podcasts", "YouTube-Kanäle", "wissenschaftliche Arbeiten", "interaktive Websites"
        ]
      },
      {
        "id": "topic",
        "placeholder": "Thema",
        "options": [
          "das antike Rom", "Astrophysik", "Verhaltenspsychologie", "Grafikdesign", "Investieren", "die Französische Revolution"
        ]
      }
    ],
    "example": "Finde die besten Online-Kurse zum Lernen von Investieren"
  },
  {
    "id": "summarize-this-de",
    "template": "Fasse die Kernpunkte von {content_type} zum Thema {topic} zusammen",
    "blanks": [
      {
        "id": "content_type",
        "placeholder": "Inhaltstyp",
        "options": [
          "diesem Artikel", "diesem Buch", "dieser Forschungsarbeit", "dem Film 'Inception'", "der Relativitätstheorie", "den neuesten Nachrichten"
        ]
      },
      {
        "id": "topic",
        "placeholder": "Thema",
        "options": [
          "Ethik der künstlichen Intelligenz", "die Handlung", "seine Hauptargumente", "seine Auswirkungen auf die Gesellschaft", "die aktuellen Wirtschaftsaussichten"
        ]
      }
    ],
    "example": "Fasse die Kernpunkte von dem Film 'Inception' zum Thema die Handlung zusammen"
  },
  {
    "id": "get-feedback-de",
    "template": "Gib mir Feedback zu meinem {work_type} über {topic}, mit Fokus auf {feedback_area}",
    "blanks": [
      {
        "id": "work_type",
        "placeholder": "Arbeitstyp",
        "options": [
          "Aufsatz", "Lebenslauf", "Anschreiben", "Geschäftsvorschlag", "Kurzgeschichte", "Code-Snippet", "Marketing-E-Mail"
        ]
      },
      {
        "id": "topic",
        "placeholder": "Thema",
        "options": [
          "meine Qualifikationen für eine Softwareentwickler-Stelle", "eine neue Marketinginitiative", "das Thema Einsamkeit", "ein Benutzerauthentifizierungssystem"
        ]
      },
      {
        "id": "feedback_area",
        "placeholder": "Feedback-Bereich",
        "options": [
          "Klarheit und Prägnanz", "Ton und Stil", "grammatikalische Korrektheit", "Überzeugungskraft", "Originalität", "technische Genauigkeit"
        ]
      }
    ],
    "example": "Gib mir Feedback zu meinem Lebenslauf über meine Qualifikationen für eine Softwareentwickler-Stelle, mit Fokus auf Klarheit und Prägnanz"
  }
];

// French Templates
export const FRENCH_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about-fr",
    "template": "Je veux apprendre {subject} sur {topic}",
    "blanks": [
      {
        "id": "subject",
        "placeholder": "quoi",
        "options": [
          "les bases", "des concepts avancés", "des applications pratiques", "l'histoire", "la théorie", "les fondamentaux", "tout",
          "un aperçu complet de", "une analyse critique de", "une étude approfondie de", "un guide pour débutants sur", "une brève histoire de",
          "les implications éthiques de", "les tendances futures de", "les idées fausses courantes sur", "les figures clés de",
          "les fondements mathématiques de", "l'impact culturel de", "un guide étape par étape sur"
        ]
      },
      {
        "id": "topic",
        "placeholder": "sujet",
        "options": [
          "la physique quantique", "l'apprentissage automatique", "la cuisine", "la photographie", "jouer de la guitare", "le trading d'actions", "le développement web",
          "l'impression 3D", "la comptabilité", "l'ingénierie aérospatiale", "l'intelligence artificielle", "l'astronomie", "la biochimie", "l'histoire de France", "l'économie", "la psychologie",
          "les neurosciences", "le changement climatique", "les civilisations anciennes", "le marketing numérique", "la cryptomonnaie", "la pleine conscience",
          "le jardinage", "la réalisation de films", "la philosophie", "la science des données", "la robotique", "la réalité virtuelle", "la technologie blockchain",
          "le génie génétique", "la Renaissance", "l'économie comportementale", "l'agriculture durable"
        ]
      }
    ],
    "example": "Je veux apprendre une étude approfondie de sur l'apprentissage automatique"
  },
  {
    "id": "understand-how-fr",
    "template": "Je veux comprendre comment {process} fonctionne {context}",
    "blanks": [
      {
        "id": "process",
        "placeholder": "processus",
        "options": [
          "la blockchain", "la photosynthèse", "le marché boursier", "les réseaux de neurones", "les moteurs de voiture", "les ordinateurs", "les vaccins", "la démocratie", "l'économie",
          "internet", "le GPS", "le cerveau humain", "un trou noir", "le processus législatif", "la capture du carbone", "un réacteur nucléaire", "l'économie mondiale", "l'édition génomique CRISPR"
        ]
      },
      {
        "id": "context",
        "placeholder": "contexte",
        "options": [
          "en détail", "depuis le début", "pour les débutants", "pratiquement", "théoriquement", "étape par étape",
          "avec une analogie simple", "en utilisant un exemple concret", "en me concentrant sur les composants clés", "dans un contexte historique",
          "d'un point de vue chimique", "d'un point de vue financier"
        ]
      }
    ],
    "example": "Je veux comprendre comment le cerveau humain fonctionne avec une analogie simple"
  },
  {
    "id": "explain-like-im-fr",
    "template": "Explique-moi {concept} comme si j'étais {audience}",
    "blanks": [
      {
        "id": "concept",
        "placeholder": "concept",
        "options": [
          "un trou noir", "la relativité générale", "l'ADN", "l'inflation économique", "internet", "un ordinateur quantique",
          "le cerveau humain", "la sélection naturelle", "un contrat intelligent", "la matière noire", "la théorie du tout"
        ]
      },
      {
        "id": "audience",
        "placeholder": "public",
        "options": [
          "un enfant de 5 ans", "un lycéen", "un débutant complet", "un grand-parent", "un investisseur",
          "un responsable marketing", "un collègue d'un autre département", "un profane intelligent"
        ]
      }
    ],
    "example": "Explique-moi un trou noir comme si j'étais un enfant de 5 ans"
  },
  {
    "id": "write-a-fr",
    "template": "Aide-moi à écrire {document_type} sur {topic} pour {audience}",
    "blanks": [
      {
        "id": "document_type",
        "placeholder": "type de document",
        "options": [
          "un article de blog", "une nouvelle", "un poème", "un e-mail", "un discours", "le plan d'une présentation", "un texte marketing",
          "un rapport technique", "une proposition de recherche", "un script pour une vidéo", "un communiqué de presse", "une description de poste"
        ]
      },
      {
        "id": "topic",
        "placeholder": "sujet",
        "options": [
          "les avantages du télétravail", "l'avenir du voyage spatial", "un monde fictif", "l'importance de la cybersécurité",
          "le lancement d'un nouveau produit", "l'histoire de l'Empire romain", "des conseils pour un mode de vie durable", "la sensibilisation à la santé mentale"
        ]
      },
      {
        "id": "audience",
        "placeholder": "public",
        "options": [
          "le grand public", "des clients potentiels", "mon équipe", "mon patron", "des investisseurs", "un public technique",
          "des enfants", "des experts du secteur"
        ]
      }
    ],
    "example": "Aide-moi à écrire un article de blog sur les avantages du télétravail pour le grand public"
  },
  {
    "id": "compare-and-contrast-fr",
    "template": "Compare et oppose {item_a} et {item_b} en fonction de {criteria}",
    "blanks": [
      {
        "id": "item_a",
        "placeholder": "élément A",
        "options": [
          "iOS", "Python", "le capitalisme", "un roman", "les voitures électriques", "le télétravail", "les chats", "le café"
        ]
      },
      {
        "id": "item_b",
        "placeholder": "élément B",
        "options": [
          "Android", "JavaScript", "le socialisme", "une adaptation cinématographique", "les voitures à essence", "le travail au bureau", "les chiens", "le thé"
        ]
      },
      {
        "id": "criteria",
        "placeholder": "critères",
        "options": [
          "prix et fonctionnalités", "performance et facilité d'utilisation", "impact historique", "implications éthiques",
          "impact environnemental", "viabilité à long terme", "avantages et inconvénients"
        ]
      }
    ],
    "example": "Compare et oppose iOS et Android en fonction de performance et facilité d'utilisation"
  },
  {
    "id": "brainstorm-ideas-fr",
    "template": "Fais un brainstorming d'idées pour {project_type} sur {topic}",
    "blanks": [
      {
        "id": "project_type",
        "placeholder": "type de projet",
        "options": [
          "une nouvelle entreprise", "une chaîne YouTube", "une série de podcasts", "une application mobile", "une campagne marketing",
          "un projet de recherche", "un livre", "un événement communautaire"
        ]
      },
      {
        "id": "topic",
        "placeholder": "sujet",
        "options": [
          "la mode durable", "le tourisme local", "l'éducation financière pour les adolescents", "le soin des animaux de compagnie", "le bien-être mental",
          "la domotique", "l'apprentissage de nouvelles langues", "le jardinage urbain"
        ]
      }
    ],
    "example": "Fais un brainstorming d'idées pour une nouvelle entreprise sur la mode durable"
  },
  {
    "id": "create-a-plan-fr",
    "template": "Crée un plan {plan_type} pour {goal}",
    "blanks": [
      {
        "id": "plan_type",
        "placeholder": "type de plan",
        "options": [
          "étape par étape", "hebdomadaire", "de 30 jours", "de marketing de contenu", "d'affaires", "d'étude", "de fitness", "de projet"
        ]
      },
      {
        "id": "goal",
        "placeholder": "mon objectif",
        "options": [
          "apprendre à coder", "lancer une startup", "écrire un roman", "courir un marathon",
          "améliorer ma prise de parole en public", "développer une audience en ligne", "un voyage au Japon"
        ]
      }
    ],
    "example": "Crée un plan de 30 jours pour apprendre à coder"
  },
  {
    "id": "find-resources-fr",
    "template": "Trouve-moi les meilleures {resource_type} pour apprendre {topic}",
    "blanks": [
      {
        "id": "resource_type",
        "placeholder": "type de ressource",
        "options": [
          "livres", "cours en ligne", "documentaires", "podcasts", "chaînes YouTube", "articles académiques", "sites web interactifs"
        ]
      },
      {
        "id": "topic",
        "placeholder": "sujet",
        "options": [
          "la Rome antique", "l'astrophysique", "la psychologie comportementale", "le design graphique", "l'investissement", "la Révolution française"
        ]
      }
    ],
    "example": "Trouve-moi les meilleurs cours en ligne pour apprendre l'investissement"
  },
  {
    "id": "summarize-this-fr",
    "template": "Résume les points clés de {content_type} sur {topic}",
    "blanks": [
      {
        "id": "content_type",
        "placeholder": "type de contenu",
        "options": [
          "cet article", "ce livre", "ce document de recherche", "le film 'Inception'", "la théorie de la relativité", "les dernières nouvelles"
        ]
      },
      {
        "id": "topic",
        "placeholder": "sujet",
        "options": [
          "l'éthique de l'intelligence artificielle", "l'intrigue", "ses principaux arguments", "son impact sur la société", "les perspectives économiques actuelles"
        ]
      }
    ],
    "example": "Résume les points clés de le film 'Inception' sur l'intrigue"
  },
  {
    "id": "get-feedback-fr",
    "template": "Donne-moi ton avis sur mon {work_type} concernant {topic}, en te concentrant sur {feedback_area}",
    "blanks": [
      {
        "id": "work_type",
        "placeholder": "type de travail",
        "options": [
          "essai", "CV", "lettre de motivation", "proposition commerciale", "nouvelle", "extrait de code", "e-mail marketing"
        ]
      },
      {
        "id": "topic",
        "placeholder": "sujet",
        "options": [
          "mes qualifications pour un poste d'ingénieur logiciel", "une nouvelle initiative marketing", "le thème de la solitude", "un système d'authentification utilisateur"
        ]
      },
      {
        "id": "feedback_area",
        "placeholder": "domaine de feedback",
        "options": [
          "la clarté et la concision", "le ton et le style", "la correction grammaticale", "la persuasion", "l'originalité", "l'exactitude technique"
        ]
      }
    ],
    "example": "Donne-moi ton avis sur mon CV concernant mes qualifications pour un poste d'ingénieur logiciel, en te concentrant sur la clarté et la concision"
  }
];

// Template mapping by language
export const LANGUAGE_TEMPLATES: Record<SupportedLanguage, SentenceTemplate[]> = {
  en: ENGLISH_TEMPLATES,
  ko: KOREAN_TEMPLATES,
  zh: CHINESE_TEMPLATES,
  ja: JAPANESE_TEMPLATES,
  es: SPANISH_TEMPLATES,
  it: ITALIAN_TEMPLATES,
  de: GERMAN_TEMPLATES,
  fr: FRENCH_TEMPLATES
};

// Function to get templates for current language
export function getTemplatesForLanguage(language: SupportedLanguage): SentenceTemplate[] {
  return LANGUAGE_TEMPLATES[language] || ENGLISH_TEMPLATES;
}