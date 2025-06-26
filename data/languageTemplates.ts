
import { SentenceTemplate } from '../types';
import { SupportedLanguage } from './translations';

// English Templates (existing)
export const ENGLISH_TEMPLATES: SentenceTemplate[] = [
  {
    "id": "learn-about",
    "template": "I want to learn {subject} about {topic}",
    "blanks": [
      {
        "id": "subject",
        "placeholder": "what",
        "options": [
          "the basics", "advanced concepts", "practical applications", "history", "theory", "fundamentals", "everything",
          "a complete overview of", "a critical analysis of", "a deep dive into", "a beginner's guide to", "a brief history of"
        ]
      },
      {
        "id": "topic",
        "placeholder": "topic",
        "options": [
          "quantum physics", "machine learning", "cooking", "photography", "guitar playing", "stock trading", "web development",
          "3D printing", "accounting", "aerospace engineering", "artificial intelligence", "astronomy", "biochemistry"
        ]
      }
    ],
    "example": "I want to learn the basics about quantum physics"
  },
  {
    "id": "understand-how",
    "template": "I want to understand how {process} works {context}",
    "blanks": [
      {
        "id": "process",
        "placeholder": "process",
        "options": [
          "blockchain", "photosynthesis", "the stock market", "neural networks", "car engines", "computers", "vaccines"
        ]
      },
      {
        "id": "context",
        "placeholder": "context",
        "options": [
          "in detail", "from scratch", "for beginners", "practically", "theoretically", "step by step"
        ]
      }
    ],
    "example": "I want to understand how blockchain works in detail"
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
          "3D 프린팅", "회계", "항공우주공학", "인공지능", "천문학", "생화학", "한국사", "경제학", "심리학"
        ]
      },
      {
        "id": "subject",
        "placeholder": "학습 수준",
        "options": [
          "기초를", "고급 개념을", "실용적 응용을", "역사를", "이론을", "기본 원리를", "모든 것을",
          "완전한 개요를", "비판적 분석을", "심층 분석을", "초보자 가이드를", "간략한 역사를"
        ]
      }
    ],
    "example": "양자물리학에 대해 기초를 배우고 싶습니다"
  },
  {
    "id": "understand-how-ko",
    "template": "{process}가 어떻게 작동하는지 {context} 이해하고 싶습니다",
    "blanks": [
      {
        "id": "process",
        "placeholder": "과정",
        "options": [
          "블록체인", "광합성", "주식 시장", "신경망", "자동차 엔진", "컴퓨터", "백신", "민주주의", "경제"
        ]
      },
      {
        "id": "context",
        "placeholder": "방식",
        "options": [
          "자세히", "처음부터", "초보자를 위해", "실용적으로", "이론적으로", "단계별로"
        ]
      }
    ],
    "example": "블록체인이 어떻게 작동하는지 자세히 이해하고 싶습니다"
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
          "3D打印", "会计", "航空航天工程", "人工智能", "天文学", "生物化学", "中国历史", "经济学", "心理学"
        ]
      },
      {
        "id": "subject",
        "placeholder": "学习内容",
        "options": [
          "基础知识", "高级概念", "实际应用", "历史", "理论", "基本原理", "所有内容",
          "完整概述", "批判性分析", "深入研究", "初学者指南", "简要历史"
        ]
      }
    ],
    "example": "我想学习关于量子物理学的基础知识"
  },
  {
    "id": "understand-how-zh",
    "template": "我想{context}理解{process}是如何工作的",
    "blanks": [
      {
        "id": "process",
        "placeholder": "过程",
        "options": [
          "区块链", "光合作用", "股票市场", "神经网络", "汽车引擎", "计算机", "疫苗", "民主制度", "经济"
        ]
      },
      {
        "id": "context",
        "placeholder": "方式",
        "options": [
          "详细地", "从头开始", "为初学者", "实用地", "理论上", "逐步地"
        ]
      }
    ],
    "example": "我想详细地理解区块链是如何工作的"
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
          "3Dプリンティング", "会計", "航空宇宙工学", "人工知能", "天文学", "生化学", "日本史", "経済学", "心理学"
        ]
      },
      {
        "id": "subject",
        "placeholder": "学習内容",
        "options": [
          "基礎を", "高度な概念を", "実用的な応用を", "歴史を", "理論を", "基本原理を", "すべてを",
          "完全な概要を", "批判的分析を", "深い理解を", "初心者向けガイドを", "簡潔な歴史を"
        ]
      }
    ],
    "example": "量子物理学について基礎を学びたいです"
  },
  {
    "id": "understand-how-ja",
    "template": "{process}がどのように機能するかを{context}理解したいです",
    "blanks": [
      {
        "id": "process",
        "placeholder": "プロセス",
        "options": [
          "ブロックチェーン", "光合成", "株式市場", "ニューラルネットワーク", "自動車エンジン", "コンピューター", "ワクチン", "民主主義", "経済"
        ]
      },
      {
        "id": "context",
        "placeholder": "方法",
        "options": [
          "詳細に", "最初から", "初心者向けに", "実践的に", "理論的に", "段階的に"
        ]
      }
    ],
    "example": "ブロックチェーンがどのように機能するかを詳細に理解したいです"
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
          "una visión completa", "un análisis crítico", "un estudio profundo", "una guía para principiantes", "una breve historia"
        ]
      },
      {
        "id": "topic",
        "placeholder": "tema",
        "options": [
          "física cuántica", "aprendizaje automático", "cocina", "fotografía", "tocar guitarra", "trading de acciones", "desarrollo web",
          "impresión 3D", "contabilidad", "ingeniería aeroespacial", "inteligencia artificial", "astronomía", "bioquímica", "historia de España", "economía", "psicología"
        ]
      }
    ],
    "example": "Quiero aprender lo básico sobre física cuántica"
  },
  {
    "id": "understand-how-es",
    "template": "Quiero entender cómo funciona {process} {context}",
    "blanks": [
      {
        "id": "process",
        "placeholder": "proceso",
        "options": [
          "blockchain", "la fotosíntesis", "el mercado de valores", "las redes neuronales", "los motores de automóviles", "las computadoras", "las vacunas", "la democracia", "la economía"
        ]
      },
      {
        "id": "context",
        "placeholder": "contexto",
        "options": [
          "en detalle", "desde cero", "para principiantes", "prácticamente", "teóricamente", "paso a paso"
        ]
      }
    ],
    "example": "Quiero entender cómo funciona blockchain en detalle"
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
          "una panoramica completa", "un'analisi critica", "uno studio approfondito", "una guida per principianti", "una breve storia"
        ]
      },
      {
        "id": "topic",
        "placeholder": "argomento",
        "options": [
          "fisica quantistica", "machine learning", "cucina", "fotografia", "suonare la chitarra", "trading azionario", "sviluppo web",
          "stampa 3D", "contabilità", "ingegneria aerospaziale", "intelligenza artificiale", "astronomia", "biochimica", "storia italiana", "economia", "psicologia"
        ]
      }
    ],
    "example": "Voglio imparare le basi su fisica quantistica"
  },
  {
    "id": "understand-how-it",
    "template": "Voglio capire come funziona {process} {context}",
    "blanks": [
      {
        "id": "process",
        "placeholder": "processo",
        "options": [
          "blockchain", "la fotosintesi", "il mercato azionario", "le reti neurali", "i motori delle auto", "i computer", "i vaccini", "la democrazia", "l'economia"
        ]
      },
      {
        "id": "context",
        "placeholder": "contesto",
        "options": [
          "in dettaglio", "da zero", "per principianti", "praticamente", "teoricamente", "passo dopo passo"
        ]
      }
    ],
    "example": "Voglio capire come funziona blockchain in dettaglio"
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
          "einen vollständigen Überblick", "eine kritische Analyse", "eine tiefgehende Studie", "einen Anfängerleitfaden", "eine kurze Geschichte"
        ]
      },
      {
        "id": "topic",
        "placeholder": "Thema",
        "options": [
          "Quantenphysik", "maschinelles Lernen", "Kochen", "Fotografie", "Gitarre spielen", "Aktienhandel", "Webentwicklung",
          "3D-Druck", "Buchhaltung", "Luft- und Raumfahrttechnik", "künstliche Intelligenz", "Astronomie", "Biochemie", "deutsche Geschichte", "Wirtschaft", "Psychologie"
        ]
      }
    ],
    "example": "Ich möchte die Grundlagen über Quantenphysik lernen"
  },
  {
    "id": "understand-how-de",
    "template": "Ich möchte verstehen, wie {process} {context} funktioniert",
    "blanks": [
      {
        "id": "process",
        "placeholder": "Prozess",
        "options": [
          "Blockchain", "Photosynthese", "der Aktienmarkt", "neuronale Netzwerke", "Automotoren", "Computer", "Impfstoffe", "Demokratie", "die Wirtschaft"
        ]
      },
      {
        "id": "context",
        "placeholder": "Kontext",
        "options": [
          "im Detail", "von Grund auf", "für Anfänger", "praktisch", "theoretisch", "Schritt für Schritt"
        ]
      }
    ],
    "example": "Ich möchte verstehen, wie Blockchain im Detail funktioniert"
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
          "un aperçu complet", "une analyse critique", "une étude approfondie", "un guide pour débutants", "une brève histoire"
        ]
      },
      {
        "id": "topic",
        "placeholder": "sujet",
        "options": [
          "la physique quantique", "l'apprentissage automatique", "la cuisine", "la photographie", "jouer de la guitare", "le trading d'actions", "le développement web",
          "l'impression 3D", "la comptabilité", "l'ingénierie aérospatiale", "l'intelligence artificielle", "l'astronomie", "la biochimie", "l'histoire de France", "l'économie", "la psychologie"
        ]
      }
    ],
    "example": "Je veux apprendre les bases sur la physique quantique"
  },
  {
    "id": "understand-how-fr",
    "template": "Je veux comprendre comment {process} fonctionne {context}",
    "blanks": [
      {
        "id": "process",
        "placeholder": "processus",
        "options": [
          "la blockchain", "la photosynthèse", "le marché boursier", "les réseaux de neurones", "les moteurs de voiture", "les ordinateurs", "les vaccins", "la démocratie", "l'économie"
        ]
      },
      {
        "id": "context",
        "placeholder": "contexte",
        "options": [
          "en détail", "depuis le début", "pour les débutants", "pratiquement", "théoriquement", "étape par étape"
        ]
      }
    ],
    "example": "Je veux comprendre comment la blockchain fonctionne en détail"
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
