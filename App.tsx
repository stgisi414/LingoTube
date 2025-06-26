import React, { useState, useCallback, useEffect } from 'react';
import { InputControls } from './components/InputControls';
import { LessonView } from './components/LessonView';
import LoadingIndicator from './components/LoadingIndicator';
import { LanguageSelector } from './components/LanguageSelector';
import { generateLessonPlan } from './services/geminiService';
import { LessonPlan, AppStatus } from './types';
import { AlertTriangle } from './constants';
import { useTranslation } from './services/translationService';

const App: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>("");

  const handleGenerateLesson = useCallback(async (topic: string) => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      setAppStatus(AppStatus.ERROR);
      return;
    }
    setAppStatus(AppStatus.PROCESSING_INPUT);
    setError(null);
    setLessonPlan(null);
    setCurrentTopic(topic);

    try {
      const plan = await generateLessonPlan(topic, currentLanguage);
      if (plan) {
        setLessonPlan(plan);
        setAppStatus(AppStatus.DISPLAYING_LESSON);
      } else {
        throw new Error("Received an empty plan from the service.");
      }
    } catch (err) {
      console.error("Error generating lesson plan:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate lesson plan: ${errorMessage}. Please check your API key and network connection.`);
      setAppStatus(AppStatus.ERROR);
    }
  }, [currentLanguage, setAppStatus, setError, setLessonPlan]);

  const resetApp = () => {
    setAppStatus(AppStatus.IDLE);
    setLessonPlan(null);
    setError(null);
    setCurrentTopic("");
  };

  useEffect(() => {
    if (error && (appStatus === AppStatus.IDLE || appStatus === AppStatus.RECOGNIZING_SPEECH)) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, appStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 text-gray-100 flex flex-col items-center p-4 selection:bg-yellow-500 selection:text-black">
      <header className="w-full max-w-4xl text-center my-8">
        <div className="flex justify-center mb-6">
          <LanguageSelector />
        </div>
        <div className="flex items-center justify-center mb-4">
          <img src="/logo.png" alt="AILingo.Tube" className="w-16 h-16 mr-4 rounded-full border-4 border-yellow-400 animate-pulse shadow-lg shadow-yellow-400/30" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-300">
            AILingo.Tube
          </h1>
        </div>
        <p className="mt-4 text-lg text-gray-300">
          {t('tagline')}
        </p>
      </header>

      <main className="w-full max-w-4xl flex-grow">
        {appStatus !== AppStatus.DISPLAYING_LESSON && (
          <InputControls
            onSubmit={handleGenerateLesson}
            isProcessing={appStatus === AppStatus.PROCESSING_INPUT || appStatus === AppStatus.RECOGNIZING_SPEECH}
            setAppStatus={setAppStatus}
          />
        )}

        {appStatus === AppStatus.PROCESSING_INPUT && <LoadingIndicator message={`${t('generatingLessonFor')} "${currentTopic}"...`} />}

        {error && appStatus === AppStatus.ERROR && (
          <div 
            className="mt-6 p-4 bg-amber-900/40 border border-amber-600 rounded-lg text-amber-200 flex items-center space-x-3 shadow-lg"
            role="alert"
          >
            {AlertTriangle}
            <span>{error}</span>
            <button
              onClick={resetApp}
              className="ml-auto bg-amber-700 hover:bg-amber-600 text-yellow-100 px-3 py-1 rounded-md text-sm shadow-md border border-amber-500"
              aria-label="Try generating lesson again"
            >
              Try Again
            </button>
          </div>
        )}

        {appStatus === AppStatus.DISPLAYING_LESSON && lessonPlan && (
          <LessonView lessonPlan={lessonPlan} onReset={resetApp} />
        )}
      </main>

      <footer className="w-full max-w-4xl text-center py-8 text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} AILingo.Tube. {t('poweredByGemini')}</p>
      </footer>
    </div>
  );
};

export default App;