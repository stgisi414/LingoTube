
import React, { useState, useEffect, useCallback } from 'react';
import { LessonPlan, LessonSegment, SegmentType } from '../types';
import { PlayIcon, StopCircleIcon, CheckCircleIcon } from '../constants';
import { synthesizeSpeech, playTTSAudio } from '../services/googleTTSService';
import { generateQuiz, QuizQuestion } from '../services/quizService';
import { searchImages, ImageSearchResult } from '../services/imageSearchService';
import { YouTubePlayerWrapper } from './YouTubePlayerWrapper';

interface PlayerModeProps {
  lessonPlan: LessonPlan;
  onExit: () => void;
}

export const PlayerMode: React.FC<PlayerModeProps> = ({ lessonPlan, onExit }) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [images, setImages] = useState<ImageSearchResult[]>([]);
  const [completedSegments, setCompletedSegments] = useState<Set<number>>(new Set());
  const [autoTransitionEnabled, setAutoTransitionEnabled] = useState(false);
  const [showingFinalSummary, setShowingFinalSummary] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allSegments: LessonSegment[] = [
    { type: SegmentType.NARRATION, id: 'intro', text: lessonPlan.introNarration },
    ...lessonPlan.segments,
    { type: SegmentType.NARRATION, id: 'outro', text: lessonPlan.outroNarration }
  ];

  const currentSegment = allSegments[currentSegmentIndex];

  // Cycle through images every 5 seconds during narration
  useEffect(() => {
    if (currentSegment?.type === SegmentType.NARRATION && images.length > 1 && isPlaying) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentSegment?.type, images.length, isPlaying]);

  const playNarration = useCallback(async (text: string) => {
    setIsPlaying(true);
    try {
      const audioContent = await synthesizeSpeech(text);
      if (audioContent) {
        await playTTSAudio(audioContent, undefined, () => {
          setIsPlaying(false);
          handleSegmentComplete();
        });
      } else {
        setIsPlaying(false);
        handleSegmentComplete();
      }
    } catch (error) {
      console.error("TTS error:", error);
      setIsPlaying(false);
      handleSegmentComplete();
    }
  }, []);

  const handleSegmentComplete = useCallback(() => {
    setCompletedSegments(prev => new Set(prev).add(currentSegmentIndex));
    
    // Check if this is the last segment
    if (currentSegmentIndex === allSegments.length - 1) {
      generateFinalSummary();
      return;
    }
    
    // Generate quiz for video segments
    if (currentSegment?.type === SegmentType.VIDEO && autoTransitionEnabled) {
      generateQuiz(lessonPlan.topic, currentSegment.segmentDescription || currentSegment.title || '')
        .then(quiz => {
          if (quiz) {
            setCurrentQuiz(quiz);
            setQuizAnswered(false);
            // Auto-advance after 15 seconds if no answer
            setTimeout(() => {
              if (!quizAnswered) {
                setCurrentQuiz(null);
                proceedToNext();
              }
            }, 15000);
          } else {
            proceedToNext();
          }
        });
    } else if (autoTransitionEnabled) {
      // Auto-advance after a short delay for narration segments
      setTimeout(() => {
        proceedToNext();
      }, 2000);
    }
  }, [currentSegmentIndex, currentSegment, lessonPlan.topic, autoTransitionEnabled, quizAnswered]);

  const generateFinalSummary = useCallback(async () => {
    setShowingFinalSummary(true);
    const summaryText = `Congratulations! You've completed the lesson on ${lessonPlan.topic}. Let's recap what we've learned: ${lessonPlan.introNarration.substring(0, 200)}... This concludes our comprehensive exploration of ${lessonPlan.topic}. Great job on completing this learning journey!`;
    
    // Play final summary with TTS
    try {
      const audioContent = await synthesizeSpeech(summaryText);
      if (audioContent) {
        setIsPlaying(true);
        await playTTSAudio(audioContent, undefined, () => {
          setIsPlaying(false);
        });
      }
    } catch (error) {
      console.error("Final summary TTS error:", error);
    }
  }, [lessonPlan.topic, lessonPlan.introNarration]);

  const proceedToNext = useCallback(() => {
    if (currentSegmentIndex < allSegments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
      setCurrentQuiz(null);
      setQuizAnswered(false);
    }
  }, [currentSegmentIndex, allSegments.length]);

  const handleQuizAnswer = useCallback((answerIndex: number) => {
    setQuizAnswered(true);
    const isCorrect = currentQuiz && answerIndex === currentQuiz.correct;
    
    // Show feedback briefly
    setTimeout(() => {
      setCurrentQuiz(null);
      if (autoTransitionEnabled) {
        proceedToNext();
      }
    }, isCorrect ? 2000 : 3000);
  }, [currentQuiz, autoTransitionEnabled, proceedToNext]);

  const startAutonomousPlayback = useCallback(() => {
    setAutoTransitionEnabled(true);
    if (currentSegmentIndex === -1) {
      setCurrentSegmentIndex(0);
    } else if (currentSegment?.type === SegmentType.NARRATION) {
      playNarration(currentSegment.text);
    }
  }, [currentSegmentIndex, currentSegment, playNarration]);

  const startManualPlayback = useCallback(() => {
    setAutoTransitionEnabled(false);
    if (currentSegmentIndex === -1) {
      setCurrentSegmentIndex(0);
    } else if (currentSegment?.type === SegmentType.NARRATION) {
      playNarration(currentSegment.text);
    }
  }, [currentSegmentIndex, currentSegment, playNarration]);

  // Load images when lesson starts
  useEffect(() => {
    searchImages(lessonPlan.topic).then(setImages);
  }, [lessonPlan.topic]);

  // Auto-play narration when segment changes
  useEffect(() => {
    if (currentSegmentIndex >= 0 && currentSegment?.type === SegmentType.NARRATION && autoTransitionEnabled) {
      playNarration(currentSegment.text);
    }
  }, [currentSegmentIndex, currentSegment, playNarration, autoTransitionEnabled]);

  const progress = ((currentSegmentIndex + 1) / allSegments.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-300">{lessonPlan.topic}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Auto Mode:</span>
              <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${autoTransitionEnabled ? 'bg-purple-600' : 'bg-slate-600'}`} 
                   onClick={() => setAutoTransitionEnabled(!autoTransitionEnabled)}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoTransitionEnabled ? 'translate-x-6' : ''}`}></div>
              </div>
            </div>
            <button 
              onClick={onExit}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              Exit Player
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 mt-2">
            {showingFinalSummary ? 'Final Summary' : `Segment ${currentSegmentIndex + 1} of ${allSegments.length}`}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Video/Narration Area */}
          <div className="lg:col-span-3">
            {showingFinalSummary ? (
              <div className="bg-gradient-to-br from-green-800 to-purple-800 rounded-lg p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl mb-4 text-green-300">Lesson Complete!</h3>
                <p className="text-lg mb-6">
                  Congratulations on completing your learning journey about <strong>{lessonPlan.topic}</strong>!
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="font-semibold">Knowledge Gained</div>
                    <div className="text-sm text-slate-400">Comprehensive understanding</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">🎥</div>
                    <div className="font-semibold">Videos Watched</div>
                    <div className="text-sm text-slate-400">{lessonPlan.segments.filter(s => s.type === SegmentType.VIDEO).length} segments</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-semibold">Progress</div>
                    <div className="text-sm text-slate-400">100% Complete</div>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={onExit}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
                  >
                    Start New Lesson
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSegmentIndex(0);
                      setShowingFinalSummary(false);
                      setCompletedSegments(new Set());
                    }}
                    className="bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg"
                  >
                    Replay Lesson
                  </button>
                </div>
              </div>
            ) : currentSegmentIndex === -1 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <h3 className="text-2xl mb-6">Choose Your Learning Experience</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-700/50 p-6 rounded-lg border-2 border-purple-500/30">
                    <div className="text-4xl mb-3">🤖</div>
                    <h4 className="text-xl font-semibold mb-3">Autonomous Mode</h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Sit back and let AI guide you through the entire lesson with automatic transitions, 
                      teleprompted narrations, contextual images, and interactive quizzes.
                    </p>
                    <button
                      onClick={startAutonomousPlayback}
                      className="w-full bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center justify-center"
                    >
                      {PlayIcon} <span className="ml-2">Start Autonomous Learning</span>
                    </button>
                  </div>
                  <div className="bg-slate-700/50 p-6 rounded-lg border-2 border-slate-500/30">
                    <div className="text-4xl mb-3">👤</div>
                    <h4 className="text-xl font-semibold mb-3">Manual Mode</h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Control your own pace with manual navigation through segments, 
                      pause when needed, and explore at your own rhythm.
                    </p>
                    <button
                      onClick={startManualPlayback}
                      className="w-full bg-slate-600 hover:bg-slate-700 px-6 py-3 rounded-lg flex items-center justify-center"
                    >
                      {PlayIcon} <span className="ml-2">Start Manual Learning</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : currentSegment?.type === SegmentType.VIDEO ? (
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <YouTubePlayerWrapper
                  videoId={currentSegment.youtubeVideoId || ''}
                  startSeconds={currentSegment.estimatedStartSeconds}
                  endSeconds={currentSegment.estimatedEndSeconds}
                  height="480"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{currentSegment.title}</h3>
                  <p className="text-sm text-slate-400">{currentSegment.segmentDescription}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {isPlaying ? (
                    <div className="animate-pulse text-purple-400">
                      {StopCircleIcon}
                    </div>
                  ) : completedSegments.has(currentSegmentIndex) ? (
                    <div className="text-green-400">{CheckCircleIcon}</div>
                  ) : (
                    <button onClick={() => playNarration(currentSegment?.text || '')} className="text-purple-400 hover:text-purple-300">
                      {PlayIcon}
                    </button>
                  )}
                  <h3 className="text-lg font-semibold ml-3">Narration</h3>
                  {autoTransitionEnabled && (
                    <span className="ml-auto text-xs bg-purple-600 px-2 py-1 rounded">AUTO</span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed text-lg">{currentSegment?.text}</p>
                
                {/* Show contextual images during narration */}
                {currentSegment?.type === SegmentType.NARRATION && images.length > 0 && (
                  <div className="mt-6 relative">
                    <img
                      src={images[currentImageIndex]?.thumbnail || images[0]?.thumbnail}
                      alt={images[currentImageIndex]?.title || images[0]?.title}
                      className="w-full h-64 object-cover rounded-lg transition-opacity duration-1000"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quiz */}
            {currentQuiz && (
              <div className="bg-slate-800 rounded-lg p-4 border-2 border-yellow-500/50">
                <h3 className="font-semibold mb-3 text-yellow-300">Quick Quiz 🧠</h3>
                <p className="mb-4 text-sm">{currentQuiz.question}</p>
                <div className="space-y-2">
                  {currentQuiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={quizAnswered}
                      className={`w-full text-left p-3 rounded text-sm transition-colors ${
                        quizAnswered
                          ? index === currentQuiz.correct
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-600 text-slate-400'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}) {option}
                    </button>
                  ))}
                </div>
                {quizAnswered && (
                  <div className="mt-3 p-3 bg-slate-700 rounded text-sm">
                    <strong>Explanation:</strong> {currentQuiz.explanation}
                  </div>
                )}
                {autoTransitionEnabled && !quizAnswered && (
                  <div className="mt-3 text-xs text-slate-400 text-center">
                    Auto-advancing in 15 seconds...
                  </div>
                )}
              </div>
            )}

            {/* Current Segment Info */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Current Segment</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="capitalize">{currentSegment?.type || 'Starting'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Progress:</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Completed:</span>
                  <span>{completedSegments.size} / {allSegments.length}</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Visual References</h3>
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image.thumbnail}
                      alt={image.title}
                      className={`w-full h-20 object-cover rounded cursor-pointer transition-opacity ${
                        index === currentImageIndex ? 'ring-2 ring-purple-500' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Manual Controls */}
            {!autoTransitionEnabled && currentSegmentIndex >= 0 && (
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Manual Controls</h3>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setCurrentSegmentIndex(Math.max(0, currentSegmentIndex - 1))}
                    disabled={currentSegmentIndex <= 0}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={proceedToNext}
                    disabled={currentSegmentIndex >= allSegments.length - 1}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
