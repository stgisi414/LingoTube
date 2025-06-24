
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
  const [images, setImages] = useState<ImageSearchResult[]>([]);
  const [completedSegments, setCompletedSegments] = useState<Set<number>>(new Set());

  const allSegments: LessonSegment[] = [
    { type: SegmentType.NARRATION, id: 'intro', text: lessonPlan.introNarration },
    ...lessonPlan.segments,
    { type: SegmentType.NARRATION, id: 'outro', text: lessonPlan.outroNarration }
  ];

  const currentSegment = allSegments[currentSegmentIndex];

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
    
    // Generate quiz for video segments
    if (currentSegment?.type === SegmentType.VIDEO) {
      generateQuiz(lessonPlan.topic, currentSegment.segmentDescription || currentSegment.title || '')
        .then(quiz => {
          if (quiz) {
            setCurrentQuiz(quiz);
          } else {
            proceedToNext();
          }
        });
    } else {
      proceedToNext();
    }
  }, [currentSegmentIndex, currentSegment, lessonPlan.topic]);

  const proceedToNext = useCallback(() => {
    if (currentSegmentIndex < allSegments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    }
  }, [currentSegmentIndex, allSegments.length]);

  const startPlayback = useCallback(() => {
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
    if (currentSegmentIndex >= 0 && currentSegment?.type === SegmentType.NARRATION) {
      playNarration(currentSegment.text);
    }
  }, [currentSegmentIndex, currentSegment, playNarration]);

  const progress = ((currentSegmentIndex + 1) / allSegments.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-300">{lessonPlan.topic}</h2>
          <button 
            onClick={onExit}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
          >
            Exit Player
          </button>
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
            Segment {currentSegmentIndex + 1} of {allSegments.length}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video/Narration Area */}
          <div className="lg:col-span-2">
            {currentSegmentIndex === -1 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <h3 className="text-xl mb-4">Ready to start learning?</h3>
                <button
                  onClick={startPlayback}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg flex items-center mx-auto"
                >
                  {PlayIcon} <span className="ml-2">Start Lesson</span>
                </button>
              </div>
            ) : currentSegment?.type === SegmentType.VIDEO ? (
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <YouTubePlayerWrapper
                  videoId={currentSegment.youtubeVideoId || ''}
                  startSeconds={currentSegment.estimatedStartSeconds}
                  endSeconds={currentSegment.estimatedEndSeconds}
                  height="360"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{currentSegment.title}</h3>
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
                    <button onClick={startPlayback} className="text-purple-400 hover:text-purple-300">
                      {PlayIcon}
                    </button>
                  )}
                  <h3 className="text-lg font-semibold ml-3">Narration</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">{currentSegment?.text}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quiz */}
            {currentQuiz && (
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Quick Quiz</h3>
                <p className="mb-3 text-sm">{currentQuiz.question}</p>
                <div className="space-y-2">
                  {currentQuiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuiz(null);
                        proceedToNext();
                      }}
                      className="w-full text-left p-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
                    >
                      {String.fromCharCode(65 + index)}) {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {images.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Visual References</h3>
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-20 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between">
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
          </div>
        </div>
      </div>
    </div>
  );
};
