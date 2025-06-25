
// Translation service for multilingual support
// Supports: English, Korean, Chinese, Japanese, Spanish, Italian, German, French

export type SupportedLanguage = 'en' | 'ko' | 'zh' | 'ja' | 'es' | 'it' | 'de' | 'fr';

export interface TranslationKeys {
  // App UI
  appTitle: string;
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
}

const translations: Record<SupportedLanguage, TranslationKeys> = {
  en: {
    // App UI
    appTitle: "Multimedia Lesson Planner",
    loading: "Loading...",
    error: "Error",
    retry: "Retry",
    
    // Input Controls
    startListening: "Start Listening",
    stopListening: "Stop Listening",
    listening: "Listening...",
    typeYourQuestion: "Type your question or learning goal...",
    send: "Send",
    selectTemplate: "Select a template to get started",
    customPrompt: "Custom Prompt",
    fillInTheBlanks: "Fill in the blanks and click 'Use Template'",
    useTemplate: "Use Template",
    
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
    culturalContext: "Cultural Context"
  },
  
  ko: {
    // App UI
    appTitle: "멀티미디어 수업 계획자",
    loading: "로딩 중...",
    error: "오류",
    retry: "다시 시도",
    
    // Input Controls
    startListening: "듣기 시작",
    stopListening: "듣기 중지",
    listening: "듣는 중...",
    typeYourQuestion: "질문이나 학습 목표를 입력하세요...",
    send: "보내기",
    selectTemplate: "시작하려면 템플릿을 선택하세요",
    customPrompt: "사용자 정의 프롬프트",
    fillInTheBlanks: "빈칸을 채우고 '템플릿 사용'을 클릭하세요",
    useTemplate: "템플릿 사용",
    
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
    culturalContext: "문화적 맥락"
  },
  
  zh: {
    // App UI
    appTitle: "多媒体课程规划器",
    loading: "加载中...",
    error: "错误",
    retry: "重试",
    
    // Input Controls
    startListening: "开始听取",
    stopListening: "停止听取",
    listening: "正在听取...",
    typeYourQuestion: "输入您的问题或学习目标...",
    send: "发送",
    selectTemplate: "选择模板开始",
    customPrompt: "自定义提示",
    fillInTheBlanks: "填写空白并点击"使用模板"",
    useTemplate: "使用模板",
    
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
    culturalContext: "文化背景"
  },
  
  ja: {
    // App UI
    appTitle: "マルチメディア授業プランナー",
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
    culturalContext: "文化的背景"
  },
  
  es: {
    // App UI
    appTitle: "Planificador de Lecciones Multimedia",
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
    culturalContext: "Contexto Cultural"
  },
  
  it: {
    // App UI
    appTitle: "Pianificatore di Lezioni Multimediali",
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
    culturalContext: "Contesto Culturale"
  },
  
  de: {
    // App UI
    appTitle: "Multimedia-Unterrichtsplaner",
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
    culturalContext: "Kultureller Kontext"
  },
  
  fr: {
    // App UI
    appTitle: "Planificateur de Cours Multimédia",
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
    culturalContext: "Contexte Culturel"
  }
};

/**
 * Detects the user's browser language and returns the appropriate supported language
 */
export function detectBrowserLanguage(): SupportedLanguage {
  // Get the browser's language
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  
  // Extract the primary language code (e.g., 'en-US' -> 'en')
  const primaryLang = browserLang.split('-')[0].toLowerCase();
  
  // Check if we support this language
  if (primaryLang in translations) {
    return primaryLang as SupportedLanguage;
  }
  
  // Fallback to English
  return 'en';
}

/**
 * Translation service class
 */
class TranslationService {
  private currentLanguage: SupportedLanguage;
  
  constructor() {
    this.currentLanguage = detectBrowserLanguage();
    console.log(`🌍 Translation service initialized with language: ${this.currentLanguage}`);
  }
  
  /**
   * Get translation for a specific key
   */
  t(key: keyof TranslationKeys): string {
    return translations[this.currentLanguage][key] || translations.en[key] || key;
  }
  
  /**
   * Get current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }
  
  /**
   * Set language manually
   */
  setLanguage(language: SupportedLanguage): void {
    this.currentLanguage = language;
    console.log(`🌍 Language changed to: ${language}`);
  }
  
  /**
   * Get all available languages
   */
  getAvailableLanguages(): SupportedLanguage[] {
    return Object.keys(translations) as SupportedLanguage[];
  }
  
  /**
   * Get language name in its native script
   */
  getLanguageName(language: SupportedLanguage): string {
    const languageNames: Record<SupportedLanguage, string> = {
      en: 'English',
      ko: '한국어',
      zh: '中文',
      ja: '日本語',
      es: 'Español',
      it: 'Italiano',
      de: 'Deutsch',
      fr: 'Français'
    };
    return languageNames[language];
  }
}

// Create and export a singleton instance
export const translationService = new TranslationService();

// Export the translation function for convenience
export const t = (key: keyof TranslationKeys): string => translationService.t(key);

// Hook for React components
export function useTranslation() {
  return {
    t: translationService.t.bind(translationService),
    currentLanguage: translationService.getCurrentLanguage(),
    setLanguage: translationService.setLanguage.bind(translationService),
    availableLanguages: translationService.getAvailableLanguages(),
    getLanguageName: translationService.getLanguageName.bind(translationService)
  };
}
