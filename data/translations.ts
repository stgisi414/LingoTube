
export type SupportedLanguage = 'en' | 'ko' | 'zh' | 'ja' | 'es' | 'it' | 'de' | 'fr';

export interface TranslationKeys {
  // App UI
  appTitle: string;
  tagline: string;
  loading: string;
  error: string;
  retry: string;
  
  // Input Controls
  startListening: string;
  stopListening: string;
  listening: string;
  typeYourQuestion: string;
  send: string;
  selectTemplate: string;
  customPrompt: string;
  fillInTheBlanks: string;
  useTemplate: string;
  
  // Lesson View
  lessonPlan: string;
  playAudio: string;
  stopAudio: string;
  watchVideo: string;
  nextSegment: string;
  previousSegment: string;
  
  // Speech Recognition
  speechNotSupported: string;
  microphonePermissionDenied: string;
  speechRecognitionFailed: string;
  
  // Templates
  learnLanguage: string;
  improveLanguageSkill: string;
  languageCulture: string;
  languageExamPrep: string;
  understandHow: string;
  reviewSubject: string;
  
  // Common actions
  play: string;
  pause: string;
  stop: string;
  continue: string;
  back: string;
  next: string;
  close: string;
  save: string;
  cancel: string;
  
  // Error messages
  networkError: string;
  apiError: string;
  videoNotFound: string;
  audioNotSupported: string;
  
  // Learning content
  introduction: string;
  conclusion: string;
  practiceExercise: string;
  vocabulary: string;
  grammar: string;
  pronunciation: string;
  culturalContext: string;
  
  // Lesson UI
  newLesson: string;
  narration: string;
  listenToNarration: string;
  generatingIllustration: string;
  previous: string;
  next: string;
  generateQuiz: string;
  
  // Footer
  footerText: string;
  poweredBy: string;
  
  // Loading states
  generatingLessonFor: string;
  
  // Video progress and status
  segmentOf: string;
  percentComplete: string;
  videoPartOf: string;
  watchVideoSegment: string;
  
  // Video sourcing pipeline messages
  step1Of5GeneratingQueries: string;
  step2Of5SearchingYoutube: string;
  step3Of5CheckingRelevance: string;
  step4Of5BestVideoFound: string;
  step5Of5IdentifyingSegments: string;
  checkingTopVideos: string;
  ourAiAnalyzing: string;
  videoReady: string;
}

export const translations: Record<SupportedLanguage, TranslationKeys> = {
  en: {
    // App UI
    appTitle: "Multimedia Lesson Planner",
    tagline: "Craft dynamic educational journeys with AI-powered narration, illustrations, and curated video segments.",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    
    // Input Controls
    startListening: "Use Voice Input",
    stopListening: "Stop Recording...",
    listening: "Listening...",
    typeYourQuestion: "What do you want to learn about today?",
    send: "Generate Lesson",
    selectTemplate: "Choose a lesson template",
    customPrompt: "Free Input",
    fillInTheBlanks: "Fill in the blanks and click 'Use Template'",
    useTemplate: "Guided Templates",
    
    // Lesson View
    lessonPlan: "Lesson Plan",
    playAudio: "Play Audio",
    stopAudio: "Stop Audio",
    watchVideo: "Watch Video",
    nextSegment: "Next Segment",
    previousSegment: "Previous Segment",
    
    // Speech Recognition
    speechNotSupported: "Speech recognition is not supported in this browser",
    microphonePermissionDenied: "Microphone permission denied",
    speechRecognitionFailed: "Speech recognition failed",
    
    // Templates
    learnLanguage: "Learn a Language",
    improveLanguageSkill: "Improve Language Skill",
    languageCulture: "Language & Culture",
    languageExamPrep: "Language Exam Preparation",
    understandHow: "Understand How",
    reviewSubject: "Review Subject",
    
    // Common actions
    play: "Play",
    pause: "Pause",
    stop: "Stop",
    continue: "Continue",
    back: "Back",
    next: "Next",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    
    // Error messages
    networkError: "Network connection error",
    apiError: "API service unavailable",
    videoNotFound: "Video not found",
    audioNotSupported: "Audio not supported",
    
    // Learning content
    introduction: "Introduction",
    conclusion: "Conclusion",
    practiceExercise: "Practice Exercise",
    vocabulary: "Vocabulary",
    grammar: "Grammar",
    pronunciation: "Pronunciation",
    culturalContext: "Cultural Context",
    
    // Lesson UI
    newLesson: "New Lesson",
    narration: "Narration",
    listenToNarration: "Listen to the narration",
    generatingIllustration: "Generating illustration...",
    previous: "Previous",
    next: "Next",
    generateQuiz: "Generate Quiz",
    
    // Footer
    footerText: "AiLingo.Tube",
    poweredBy: "Powered by Gemini",
    
    // Loading states
    generatingLessonFor: "Generating lesson for",
    
    // Video progress and status
    segmentOf: "Segment {current} of {total}",
    percentComplete: "{percent}% Complete",
    videoPartOf: "Video part {current} of {total}",
    watchVideoSegment: "Watch the video segment",
    
    // Video sourcing pipeline messages
    step1Of5GeneratingQueries: "Step 1/5: Generating search queries...",
    step2Of5SearchingYoutube: "Step 2/5: Searching YouTube for candidates...",
    step3Of5CheckingRelevance: "Step 3/5: Checking top {count} videos for relevance...",
    step4Of5BestVideoFound: "Step 4/5: Best video found: \"{title}\"",
    step5Of5IdentifyingSegments: "Step 5/5: Identifying key segments in the video...",
    checkingTopVideos: "Checking top {count} videos for relevance...",
    ourAiAnalyzing: "Our AI is analyzing thousands of educational videos to find the most relevant content for your lesson",
    videoReady: "Video ready!"
  },
  
  ko: {
    // App UI
    appTitle: "멀티미디어 수업 계획자",
    tagline: "AI 기반 내레이션, 일러스트레이션, 큐레이션된 비디오 세그먼트로 역동적인 교육 여정을 만들어보세요.",
    loading: "로딩 중...",
    error: "오류",
    retry: "다시 시도",
    
    // Input Controls
    startListening: "음성 입력 사용",
    stopListening: "녹음 중지...",
    listening: "듣는 중...",
    typeYourQuestion: "오늘 무엇을 배우고 싶으신가요?",
    send: "수업 생성",
    selectTemplate: "수업 템플릿 선택",
    customPrompt: "자유 입력",
    fillInTheBlanks: "빈칸을 채우고 '템플릿 사용'을 클릭하세요",
    useTemplate: "가이드 템플릿",
    
    // Lesson View
    lessonPlan: "수업 계획",
    playAudio: "오디오 재생",
    stopAudio: "오디오 중지",
    watchVideo: "비디오 시청",
    nextSegment: "다음 섹션",
    previousSegment: "이전 섹션",
    
    // Speech Recognition
    speechNotSupported: "이 브라우저에서는 음성 인식이 지원되지 않습니다",
    microphonePermissionDenied: "마이크 권한이 거부되었습니다",
    speechRecognitionFailed: "음성 인식에 실패했습니다",
    
    // Templates
    learnLanguage: "언어 학습",
    improveLanguageSkill: "언어 능력 향상",
    languageCulture: "언어와 문화",
    languageExamPrep: "언어 시험 준비",
    understandHow: "이해하기",
    reviewSubject: "과목 복습",
    
    // Common actions
    play: "재생",
    pause: "일시정지",
    stop: "중지",
    continue: "계속",
    back: "뒤로",
    next: "다음",
    close: "닫기",
    save: "저장",
    cancel: "취소",
    
    // Error messages
    networkError: "네트워크 연결 오류",
    apiError: "API 서비스를 사용할 수 없습니다",
    videoNotFound: "비디오를 찾을 수 없습니다",
    audioNotSupported: "오디오가 지원되지 않습니다",
    
    // Learning content
    introduction: "소개",
    conclusion: "결론",
    practiceExercise: "연습 문제",
    vocabulary: "어휘",
    grammar: "문법",
    pronunciation: "발음",
    culturalContext: "문화적 맥락",
    
    // Lesson UI
    newLesson: "새 수업",
    narration: "나레이션",
    listenToNarration: "나레이션을 들어보세요",
    generatingIllustration: "일러스트 생성 중...",
    previous: "이전",
    next: "다음",
    generateQuiz: "퀴즈 생성",
    
    // Footer
    footerText: "AiLingo.Tube",
    poweredBy: "Gemini 제공",
    
    // Loading states
    generatingLessonFor: "수업 생성 중",
    
    // Video progress and status
    segmentOf: "세그먼트 {current} / {total}",
    percentComplete: "{percent}% 완료",
    videoPartOf: "비디오 파트 {current} / {total}",
    watchVideoSegment: "비디오 세그먼트 시청",
    
    // Video sourcing pipeline messages
    step1Of5GeneratingQueries: "1/5단계: 검색 쿼리 생성 중...",
    step2Of5SearchingYoutube: "2/5단계: YouTube 후보 검색 중...",
    step3Of5CheckingRelevance: "3/5단계: 상위 {count}개 비디오 관련성 확인 중...",
    step4Of5BestVideoFound: "4/5단계: 최적 비디오 발견: \"{title}\"",
    step5Of5IdentifyingSegments: "5/5단계: 비디오의 핵심 세그먼트 식별 중...",
    checkingTopVideos: "상위 {count}개 비디오 관련성 확인 중...",
    ourAiAnalyzing: "AI가 수천 개의 교육 비디오를 분석하여 수업에 가장 관련성 높은 콘텐츠를 찾고 있습니다",
    videoReady: "비디오 준비 완료!"
  },
  
  zh: {
    // App UI
    appTitle: "多媒体课程规划器",
    tagline: "通过AI驱动的叙述、插图和精选视频片段打造动态教育旅程。",
    loading: "加载中...",
    error: "错误",
    retry: "重试",
    
    // Input Controls
    startListening: "使用语音输入",
    stopListening: "停止录音...",
    listening: "正在听取...",
    typeYourQuestion: "您今天想学什么？",
    send: "生成课程",
    selectTemplate: "选择课程模板",
    customPrompt: "自由输入",
    fillInTheBlanks: "填写空白并点击\"使用模板\"",
    useTemplate: "引导模板",
    
    // Lesson View
    lessonPlan: "课程计划",
    playAudio: "播放音频",
    stopAudio: "停止音频",
    watchVideo: "观看视频",
    nextSegment: "下一部分",
    previousSegment: "上一部分",
    
    // Speech Recognition
    speechNotSupported: "此浏览器不支持语音识别",
    microphonePermissionDenied: "麦克风权限被拒绝",
    speechRecognitionFailed: "语音识别失败",
    
    // Templates
    learnLanguage: "学习语言",
    improveLanguageSkill: "提高语言技能",
    languageCulture: "语言与文化",
    languageExamPrep: "语言考试准备",
    understandHow: "理解如何",
    reviewSubject: "复习科目",
    
    // Common actions
    play: "播放",
    pause: "暂停",
    stop: "停止",
    continue: "继续",
    back: "返回",
    next: "下一个",
    close: "关闭",
    save: "保存",
    cancel: "取消",
    
    // Error messages
    networkError: "网络连接错误",
    apiError: "API服务不可用",
    videoNotFound: "未找到视频",
    audioNotSupported: "不支持音频",
    
    // Learning content
    introduction: "介绍",
    conclusion: "结论",
    practiceExercise: "练习题",
    vocabulary: "词汇",
    grammar: "语法",
    pronunciation: "发音",
    culturalContext: "文化背景",
    
    // Lesson UI
    newLesson: "新课程",
    narration: "旁白",
    listenToNarration: "收听旁白",
    generatingIllustration: "生成插图中...",
    previous: "上一个",
    next: "下一个",
    generateQuiz: "生成测验",
    
    // Footer
    footerText: "AiLingo.Tube",
    poweredBy: "由 Gemini 提供支持",
    
    // Loading states
    generatingLessonFor: "正在生成课程",
    
    // Video progress and status
    segmentOf: "第 {current} 段，共 {total} 段",
    percentComplete: "{percent}% 完成",
    videoPartOf: "视频第 {current} 部分，共 {total} 部分",
    watchVideoSegment: "观看视频片段",
    
    // Video sourcing pipeline messages
    step1Of5GeneratingQueries: "第1/5步: 生成搜索查询中...",
    step2Of5SearchingYoutube: "第2/5步: 搜索YouTube候选视频中...",
    step3Of5CheckingRelevance: "第3/5步: 检查前{count}个视频的相关性中...",
    step4Of5BestVideoFound: "第4/5步: 找到最佳视频: \"{title}\"",
    step5Of5IdentifyingSegments: "第5/5步: 识别视频中的关键片段中...",
    checkingTopVideos: "检查前{count}个视频的相关性中...",
    ourAiAnalyzing: "我们的AI正在分析数千个教育视频，为您的课程找到最相关的内容",
    videoReady: "视频准备就绪！"
  },
  
  ja: {
    // App UI
    appTitle: "マルチメディア授業プランナー",
    tagline: "AI駆動のナレーション、イラスト、厳選されたビデオセグメントで動的な教育ジャーニーを作成。",
    loading: "読み込み中...",
    error: "エラー",
    retry: "再試行",
    
    // Input Controls
    startListening: "聞き取り開始",
    stopListening: "聞き取り停止",
    listening: "聞き取り中...",
    typeYourQuestion: "質問や学習目標を入力してください...",
    send: "送信",
    selectTemplate: "開始するにはテンプレートを選択してください",
    customPrompt: "カスタムプロンプト",
    fillInTheBlanks: "空欄を埋めて「テンプレートを使用」をクリックしてください",
    useTemplate: "テンプレートを使用",
    
    // Lesson View
    lessonPlan: "授業計画",
    playAudio: "音声再生",
    stopAudio: "音声停止",
    watchVideo: "動画視聴",
    nextSegment: "次のセグメント",
    previousSegment: "前のセグメント",
    
    // Speech Recognition
    speechNotSupported: "このブラウザでは音声認識がサポートされていません",
    microphonePermissionDenied: "マイクの許可が拒否されました",
    speechRecognitionFailed: "音声認識に失敗しました",
    
    // Templates
    learnLanguage: "言語を学ぶ",
    improveLanguageSkill: "言語スキルを向上させる",
    languageCulture: "言語と文化",
    languageExamPrep: "言語試験準備",
    understandHow: "理解する方法",
    reviewSubject: "科目の復習",
    
    // Common actions
    play: "再生",
    pause: "一時停止",
    stop: "停止",
    continue: "続行",
    back: "戻る",
    next: "次へ",
    close: "閉じる",
    save: "保存",
    cancel: "キャンセル",
    
    // Error messages
    networkError: "ネットワーク接続エラー",
    apiError: "APIサービスが利用できません",
    videoNotFound: "動画が見つかりません",
    audioNotSupported: "音声がサポートされていません",
    
    // Learning content
    introduction: "導入",
    conclusion: "結論",
    practiceExercise: "練習問題",
    vocabulary: "語彙",
    grammar: "文法",
    pronunciation: "発音",
    culturalContext: "文化的背景",
    
    // Lesson UI
    newLesson: "新しいレッスン",
    narration: "ナレーション",
    listenToNarration: "ナレーションを聞く",
    generatingIllustration: "イラスト生成中...",
    previous: "前へ",
    next: "次へ",
    generateQuiz: "クイズ生成",
    
    // Footer
    footerText: "AiLingo.Tube",
    poweredBy: "Gemini提供",
    
    // Loading states
    generatingLessonFor: "レッスンを生成中",
    
    // Video progress and status
    segmentOf: "セグメント {current} / {total}",
    percentComplete: "{percent}% 完了",
    videoPartOf: "ビデオパート {current} / {total}",
    watchVideoSegment: "ビデオセグメントを視聴",
    
    // Video sourcing pipeline messages
    step1Of5GeneratingQueries: "ステップ1/5: 検索クエリを生成中...",
    step2Of5SearchingYoutube: "ステップ2/5: YouTube候補を検索中...",
    step3Of5CheckingRelevance: "ステップ3/5: 上位{count}本のビデオの関連性を確認中...",
    step4Of5BestVideoFound: "ステップ4/5: 最適なビデオを発見: \"{title}\"",
    step5Of5IdentifyingSegments: "ステップ5/5: ビデオの重要なセグメントを特定中...",
    checkingTopVideos: "上位{count}本のビデオの関連性を確認中...",
    ourAiAnalyzing: "AIが数千の教育ビデオを分析して、あなたのレッスンに最も関連性の高いコンテンツを見つけています",
    videoReady: "ビデオ準備完了！"
  },
  
  es: {
    // App UI
    appTitle: "Planificador de Lecciones Multimedia",
    tagline: "Crea viajes educativos dinámicos con narración, ilustraciones y segmentos de video curados por IA.",
    loading: "Cargando...",
    error: "Error",
    retry: "Reintentar",
    
    // Input Controls
    startListening: "Comenzar a Escuchar",
    stopListening: "Dejar de Escuchar",
    listening: "Escuchando...",
    typeYourQuestion: "Escribe tu pregunta u objetivo de aprendizaje...",
    send: "Enviar",
    selectTemplate: "Selecciona una plantilla para comenzar",
    customPrompt: "Solicitud Personalizada",
    fillInTheBlanks: "Completa los espacios en blanco y haz clic en 'Usar Plantilla'",
    useTemplate: "Usar Plantilla",
    
    // Lesson View
    lessonPlan: "Plan de Lección",
    playAudio: "Reproducir Audio",
    stopAudio: "Detener Audio",
    watchVideo: "Ver Video",
    nextSegment: "Siguiente Segmento",
    previousSegment: "Segmento Anterior",
    
    // Speech Recognition
    speechNotSupported: "El reconocimiento de voz no es compatible con este navegador",
    microphonePermissionDenied: "Permiso de micrófono denegado",
    speechRecognitionFailed: "El reconocimiento de voz falló",
    
    // Templates
    learnLanguage: "Aprender un Idioma",
    improveLanguageSkill: "Mejorar Habilidad Lingüística",
    languageCulture: "Idioma y Cultura",
    languageExamPrep: "Preparación de Examen de Idioma",
    understandHow: "Entender Cómo",
    reviewSubject: "Revisar Materia",
    
    // Common actions
    play: "Reproducir",
    pause: "Pausar",
    stop: "Detener",
    continue: "Continuar",
    back: "Atrás",
    next: "Siguiente",
    close: "Cerrar",
    save: "Guardar",
    cancel: "Cancelar",
    
    // Error messages
    networkError: "Error de conexión de red",
    apiError: "Servicio API no disponible",
    videoNotFound: "Video no encontrado",
    audioNotSupported: "Audio no compatible",
    
    // Learning content
    introduction: "Introducción",
    conclusion: "Conclusión",
    practiceExercise: "Ejercicio de Práctica",
    vocabulary: "Vocabulario",
    grammar: "Gramática",
    pronunciation: "Pronunciación",
    culturalContext: "Contexto Cultural",
    
    // Lesson UI
    newLesson: "Nueva Lección",
    narration: "Narración",
    listenToNarration: "Escuchar la narración",
    generatingIllustration: "Generando ilustración...",
    previous: "Anterior",
    next: "Siguiente",
    generateQuiz: "Generar Cuestionario",
    
    // Footer
    footerText: "AiLingo.Tube",
    poweredBy: "Desarrollado por Gemini",
    
    // Loading states
    generatingLessonFor: "Generando lección para",
    
    // Video progress and status
    segmentOf: "Segmento {current} de {total}",
    percentComplete: "{percent}% Completado",
    videoPartOf: "Parte del video {current} de {total}",
    watchVideoSegment: "Ver el segmento de video",
    
    // Video sourcing pipeline messages
    step1Of5GeneratingQueries: "Paso 1/5: Generando consultas de búsqueda...",
    step2Of5SearchingYoutube: "Paso 2/5: Buscando candidatos en YouTube...",
    step3Of5CheckingRelevance: "Paso 3/5: Verificando relevancia de los {count} mejores videos...",
    step4Of5BestVideoFound: "Paso 4/5: Mejor video encontrado: \"{title}\"",
    step5Of5IdentifyingSegments: "Paso 5/5: Identificando segmentos clave en el video...",
    checkingTopVideos: "Verificando relevancia de los {count} mejores videos...",
    ourAiAnalyzing: "Nuestra IA está analizando miles de videos educativos para encontrar el contenido más relevante para tu lección",
    videoReady: "¡Video listo!"
  },
  
  it: {
    // App UI
    appTitle: "Pianificatore di Lezioni Multimediali",
    tagline: "Crea percorsi educativi dinamici con narrazione, illustrazioni e segmenti video curati dall'IA.",
    loading: "Caricamento...",
    error: "Errore",
    retry: "Riprova",
    
    // Input Controls
    startListening: "Inizia ad Ascoltare",
    stopListening: "Smetti di Ascoltare",
    listening: "In ascolto...",
    typeYourQuestion: "Scrivi la tua domanda o obiettivo di apprendimento...",
    send: "Invia",
    selectTemplate: "Seleziona un modello per iniziare",
    customPrompt: "Prompt Personalizzato",
    fillInTheBlanks: "Riempi gli spazi vuoti e clicca 'Usa Modello'",
    useTemplate: "Usa Modello",
    
    // Lesson View
    lessonPlan: "Piano della Lezione",
    playAudio: "Riproduci Audio",
    stopAudio: "Ferma Audio",
    watchVideo: "Guarda Video",
    nextSegment: "Segmento Successivo",
    previousSegment: "Segmento Precedente",
    
    // Speech Recognition
    speechNotSupported: "Il riconoscimento vocale non è supportato in questo browser",
    microphonePermissionDenied: "Permesso microfono negato",
    speechRecognitionFailed: "Riconoscimento vocale fallito",
    
    // Templates
    learnLanguage: "Impara una Lingua",
    improveLanguageSkill: "Migliora Abilità Linguistica",
    languageCulture: "Lingua e Cultura",
    languageExamPrep: "Preparazione Esame Linguistico",
    understandHow: "Capire Come",
    reviewSubject: "Rivedere Materia",
    
    // Common actions
    play: "Riproduci",
    pause: "Pausa",
    stop: "Ferma",
    continue: "Continua",
    back: "Indietro",
    next: "Avanti",
    close: "Chiudi",
    save: "Salva",
    cancel: "Annulla",
    
    // Error messages
    networkError: "Errore di connessione di rete",
    apiError: "Servizio API non disponibile",
    videoNotFound: "Video non trovato",
    audioNotSupported: "Audio non supportato",
    
    // Learning content
    introduction: "Introduzione",
    conclusion: "Conclusione",
    practiceExercise: "Esercizio di Pratica",
    vocabulary: "Vocabolario",
    grammar: "Grammatica",
    pronunciation: "Pronuncia",
    culturalContext: "Contesto Culturale",
    
    // Lesson UI
    newLesson: "Nuova Lezione",
    narration: "Narrazione",
    listenToNarration: "Ascolta la narrazione",
    generatingIllustration: "Generazione illustrazione...",
    previous: "Precedente",
    next: "Successivo",
    generateQuiz: "Genera Quiz",
    
    // Footer
    footerText: "AiLingo.Tube",
    poweredBy: "Alimentato da Gemini",
    
    // Loading states
    generatingLessonFor: "Generazione lezione per",
    
    // Video progress and status
    segmentOf: "Segmento {current} di {total}",
    percentComplete: "{percent}% Completato",
    videoPartOf: "Parte video {current} di {total}",
    watchVideoSegment: "Guarda il segmento video",
    
    // Video sourcing pipeline messages
    step1Of5GeneratingQueries: "Passo 1/5: Generazione query di ricerca...",
    step2Of5SearchingYoutube: "Passo 2/5: Ricerca candidati su YouTube...",
    step3Of5CheckingRelevance: "Passo 3/5: Verifica rilevanza dei {count} migliori video...",
    step4Of5BestVideoFound: "Passo 4/5: Miglior video trovato: \"{title}\"",
    step5Of5IdentifyingSegments: "Passo 5/5: Identificazione segmenti chiave nel video...",
    checkingTopVideos: "Verifica rilevanza dei {count} migliori video...",
    ourAiAnalyzing: "La nostra IA sta analizzando migliaia di video educativi per trovare il contenuto più rilevante per la tua lezione",
    videoReady: "Video pronto!"
  },
  
  de: {
    // App UI
    appTitle: "Multimedia-Unterrichtsplaner",
    tagline: "Gestalten Sie dynamische Bildungsreisen mit KI-gestützter Erzählung, Illustrationen und kuratierten Videosegmenten.",
    loading: "Wird geladen...",
    error: "Fehler",
    retry: "Wiederholen",
    
    // Input Controls
    startListening: "Zuhören beginnen",
    stopListening: "Zuhören beenden",
    listening: "Hört zu...",
    typeYourQuestion: "Geben Sie Ihre Frage oder Ihr Lernziel ein...",
    send: "Senden",
    selectTemplate: "Wählen Sie eine Vorlage zum Starten",
    customPrompt: "Benutzerdefinierte Eingabeaufforderung",
    fillInTheBlanks: "Füllen Sie die Lücken aus und klicken Sie auf 'Vorlage verwenden'",
    useTemplate: "Vorlage verwenden",
    
    // Lesson View
    lessonPlan: "Unterrichtsplan",
    playAudio: "Audio abspielen",
    stopAudio: "Audio stoppen",
    watchVideo: "Video ansehen",
    nextSegment: "Nächstes Segment",
    previousSegment: "Vorheriges Segment",
    
    // Speech Recognition
    speechNotSupported: "Spracherkennung wird in diesem Browser nicht unterstützt",
    microphonePermissionDenied: "Mikrofon-Berechtigung verweigert",
    speechRecognitionFailed: "Spracherkennung fehlgeschlagen",
    
    // Templates
    learnLanguage: "Eine Sprache lernen",
    improveLanguageSkill: "Sprachfertigkeit verbessern",
    languageCulture: "Sprache und Kultur",
    languageExamPrep: "Sprachprüfungsvorbereitung",
    understandHow: "Verstehen wie",
    reviewSubject: "Fach wiederholen",
    
    // Common actions
    play: "Abspielen",
    pause: "Pausieren",
    stop: "Stoppen",
    continue: "Fortfahren",
    back: "Zurück",
    next: "Weiter",
    close: "Schließen",
    save: "Speichern",
    cancel: "Abbrechen",
    
    // Error messages
    networkError: "Netzwerkverbindungsfehler",
    apiError: "API-Dienst nicht verfügbar",
    videoNotFound: "Video nicht gefunden",
    audioNotSupported: "Audio nicht unterstützt",
    
    // Learning content
    introduction: "Einführung",
    conclusion: "Fazit",
    practiceExercise: "Übungsaufgabe",
    vocabulary: "Wortschatz",
    grammar: "Grammatik",
    pronunciation: "Aussprache",
    culturalContext: "Kultureller Kontext",
    
    // Lesson UI
    newLesson: "Neue Lektion",
    narration: "Erzählung",
    listenToNarration: "Erzählung anhören",
    generatingIllustration: "Illustration wird generiert...",
    previous: "Zurück",
    next: "Weiter",
    generateQuiz: "Quiz Generieren",
    
    // Footer
    footerText: "AiLingo.Tube",
    poweredBy: "Unterstützt von Gemini",
    
    // Loading states
    generatingLessonFor: "Lektion wird generiert für",
    
    // Video progress and status
    segmentOf: "Segment {current} von {total}",
    percentComplete: "{percent}% Vollständig",
    videoPartOf: "Videoteil {current} von {total}",
    watchVideoSegment: "Videosegment ansehen",
    
    // Video sourcing pipeline messages
    step1Of5GeneratingQueries: "Schritt 1/5: Suchanfragen werden generiert...",
    step2Of5SearchingYoutube: "Schritt 2/5: YouTube-Kandidaten werden gesucht...",
    step3Of5CheckingRelevance: "Schritt 3/5: Relevanz der besten {count} Videos wird überprüft...",
    step4Of5BestVideoFound: "Schritt 4/5: Bestes Video gefunden: \"{title}\"",
    step5Of5IdentifyingSegments: "Schritt 5/5: Schlüsselsegmente im Video werden identifiziert...",
    checkingTopVideos: "Relevanz der besten {count} Videos wird überprüft...",
    ourAiAnalyzing: "Unsere KI analysiert Tausende von Bildungsvideos, um den relevantesten Inhalt für Ihre Lektion zu finden",
    videoReady: "Video bereit!"
  },
  
  fr: {
    // App UI
    appTitle: "Planificateur de Cours Multimédia",
    tagline: "Créez des parcours éducatifs dynamiques avec narration IA, illustrations et segments vidéo sélectionnés.",
    loading: "Chargement...",
    error: "Erreur",
    retry: "Réessayer",
    
    // Input Controls
    startListening: "Commencer à Écouter",
    stopListening: "Arrêter d'Écouter",
    listening: "Écoute...",
    typeYourQuestion: "Tapez votre question ou objectif d'apprentissage...",
    send: "Envoyer",
    selectTemplate: "Sélectionnez un modèle pour commencer",
    customPrompt: "Invite Personnalisée",
    fillInTheBlanks: "Remplissez les blancs et cliquez sur 'Utiliser le Modèle'",
    useTemplate: "Utiliser le Modèle",
    
    // Lesson View
    lessonPlan: "Plan de Cours",
    playAudio: "Lire l'Audio",
    stopAudio: "Arrêter l'Audio",
    watchVideo: "Regarder la Vidéo",
    nextSegment: "Segment Suivant",
    previousSegment: "Segment Précédent",
    
    // Speech Recognition
    speechNotSupported: "La reconnaissance vocale n'est pas prise en charge dans ce navigateur",
    microphonePermissionDenied: "Permission du microphone refusée",
    speechRecognitionFailed: "La reconnaissance vocale a échoué",
    
    // Templates
    learnLanguage: "Apprendre une Langue",
    improveLanguageSkill: "Améliorer les Compétences Linguistiques",
    languageCulture: "Langue et Culture",
    languageExamPrep: "Préparation aux Examens de Langue",
    understandHow: "Comprendre Comment",
    reviewSubject: "Réviser la Matière",
    
    // Common actions
    play: "Lire",
    pause: "Pause",
    stop: "Arrêter",
    continue: "Continuer",
    back: "Retour",
    next: "Suivant",
    close: "Fermer",
    save: "Sauvegarder",
    cancel: "Annuler",
    
    // Error messages
    networkError: "Erreur de connexion réseau",
    apiError: "Service API indisponible",
    videoNotFound: "Vidéo introuvable",
    audioNotSupported: "Audio non pris en charge",
    
    // Learning content
    introduction: "Introduction",
    conclusion: "Conclusion",
    practiceExercise: "Exercice de Pratique",
    vocabulary: "Vocabulaire",
    grammar: "Grammaire",
    pronunciation: "Prononciation",
    culturalContext: "Contexte Culturel",
    
    // Lesson UI
    newLesson: "Nouvelle Leçon",
    narration: "Narration",
    listenToNarration: "Écouter la narration",
    generatingIllustration: "Génération d'illustration...",
    previous: "Précédent",
    next: "Suivant",
    generateQuiz: "Générer Quiz",
    
    // Footer
    footerText: "AiLingo.Tube",
    poweredBy: "Propulsé par Gemini",
    
    // Loading states
    generatingLessonFor: "Génération de leçon pour",
    
    // Video progress and status
    segmentOf: "Segment {current} sur {total}",
    percentComplete: "{percent}% Terminé",
    videoPartOf: "Partie vidéo {current} sur {total}",
    watchVideoSegment: "Regarder le segment vidéo",
    
    // Video sourcing pipeline messages
    step1Of5GeneratingQueries: "Étape 1/5: Génération des requêtes de recherche...",
    step2Of5SearchingYoutube: "Étape 2/5: Recherche de candidats sur YouTube...",
    step3Of5CheckingRelevance: "Étape 3/5: Vérification de la pertinence des {count} meilleures vidéos...",
    step4Of5BestVideoFound: "Étape 4/5: Meilleure vidéo trouvée: \"{title}\"",
    step5Of5IdentifyingSegments: "Étape 5/5: Identification des segments clés dans la vidéo...",
    checkingTopVideos: "Vérification de la pertinence des {count} meilleures vidéos...",
    ourAiAnalyzing: "Notre IA analyse des milliers de vidéos éducatives pour trouver le contenu le plus pertinent pour votre leçon",
    videoReady: "Vidéo prête !"
  }
};
