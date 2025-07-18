// components/LessonView.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LessonPlan, LessonSegment, SegmentType, VideoSegment, NarrationSegment, VideoTimeSegment } from '../types';
import { BookOpenIcon, FilmIcon, RefreshCwIcon, CheckCircleIcon, SpeakerPlayIcon, SpeakerStopIcon, ChevronLeftIcon, ChevronRightIcon } from '../constants';
import { YouTubePlayerWrapper } from './YouTubePlayerWrapper';
import ParsedText from './ParsedText';
import { speakMultilingualText, stopSpeech, isSpeaking } from '../services/googleTTSService';
import { useTranslation, interpolateString } from '../services/translationService';
import { generateSearchQueries, checkVideoRelevance, findVideoSegments } from '../services/geminiService';
import { searchYouTube, getVideoTranscript, SearchedVideo } from '../services/videoSourcingService';
import { generateQuiz } from '../services/quizService';

// This interface defines the state for the entire video fetching pipeline for one segment.
interface VideoFetchState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  videoId: string | null;
  videoTitle: string | null;
  timeSegments: VideoTimeSegment[] | null;
}

// Transition states for smooth segment changes
interface TransitionState {
  isTransitioning: boolean;
  fromSegment: number;
  toSegment: number;
  phase: 'fadeOut' | 'loading' | 'fadeIn' | 'complete';
}

// This is the main component that renders the lesson with proper progression.
export const LessonView: React.FC<{ lessonPlan: LessonPlan; onReset: () => void; }> = ({ lessonPlan, onReset }) => {
  const { t, currentLanguage } = useTranslation();
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<Set<string>>(new Set());
  const [videoPlayerHeight, setVideoPlayerHeight] = useState('360');
  const [speakingSegmentId, setSpeakingSegmentId] = useState<string | null>(null);
  const [videoFetchState, setVideoFetchState] = useState<Record<string, VideoFetchState>>({});
  const [currentVideoTimeSegmentIndex, setCurrentVideoTimeSegmentIndex] = useState(0);
  const [transitionState, setTransitionState] = useState<TransitionState>({
    isTransitioning: false,
    fromSegment: -1,
    toSegment: -1,
    phase: 'complete'
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const mainContentRef = useRef<HTMLDivElement>(null);

  const allLessonParts = useMemo(() => [
    { type: SegmentType.NARRATION, id: 'intro-narration', text: lessonPlan.introNarration },
    ...lessonPlan.segments,
    { type: SegmentType.NARRATION, id: 'outro-narration', text: lessonPlan.outroNarration },
  ], [lessonPlan]);

  const currentSegment = allLessonParts[currentSegmentIdx];
  const isLastSegment = currentSegmentIdx === allLessonParts.length - 1;
  const isFirstSegment = currentSegmentIdx === 0;

  const orchestrateVideoSourcing = useCallback(async (segment: VideoSegment) => {
    const segmentId = segment.id;
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🚀 VIDEO SOURCING PIPELINE STARTED`);
    console.log(`🚀 PIPELINE: Starting video sourcing orchestration for segment: "${segment.title}"`);
    console.log(`🚀 PIPELINE: Segment details:`, {
        segmentId,
        title: segment.title,
        description: segment.segmentDescription,
        searchQuery: segment.youtubeSearchQuery,
        timestamp: new Date().toISOString()
    });
    console.log(`${'='.repeat(80)}\n`);

    const updateState = (status: VideoFetchState['status'], message: string, data: Partial<VideoFetchState> = {}) => {
        console.log(`📊 PIPELINE STATE: ${segmentId} -> ${status}: ${message}`, data);
        setVideoFetchState(prev => ({
            ...prev,
            [segmentId]: {
                ...prev[segmentId],
                status,
                message,
                ...data,
            }
        }));
    };

    try {
        console.log(`\n🔍 PIPELINE STEP 1: Generating search queries for "${segment.title}"`);
        updateState('loading', t('step1Of5GeneratingQueries'), { videoId: null, videoTitle: null, timeSegments: null });
        const queries = await generateSearchQueries(segment.title, lessonPlan.topic);
        console.log(`✅ PIPELINE STEP 1: Generated ${queries.length} search queries:`, queries);

        console.log(`\n🔎 PIPELINE STEP 2: Searching YouTube with ${queries.length} queries`);
        updateState('loading', t('step2Of5SearchingYoutube'));
        const searchPromises = queries.map(async (q, index) => {
            console.log(`🔎 PIPELINE: Searching with query ${index + 1}/${queries.length}: "${q}"`);
            const results = await searchYouTube(q);
            console.log(`🔎 PIPELINE: Query ${index + 1} returned ${results.length} results`);
            return results;
        });

        const videoCandidates = (await Promise.all(searchPromises)).flat();
        console.log(`🔎 PIPELINE STEP 2: Total raw candidates found: ${videoCandidates.length}`);

        const uniqueVideos = [...new Map(videoCandidates.map(v => [v.youtubeId, v])).values()]
            .sort((a, b) => b.educationalScore - a.educationalScore);

        if (uniqueVideos.length === 0) {
            throw new Error("No videos found from any search query.");
        }

        const candidateCount = Math.min(5, uniqueVideos.length);
        console.log(`\n🤖 PIPELINE STEP 3: Checking top ${candidateCount} videos for relevance`);
        updateState('loading', interpolateString(t('step3Of5CheckingRelevance'), { count: candidateCount }));

        const relevancePromises = uniqueVideos.slice(0, 5).map(async (video, index) => {
            console.log(`🤖 PIPELINE: Analyzing candidate ${index + 1}/${candidateCount}: "${video.title}"`);
            const transcript = await getVideoTranscript(video.youtubeId);
            video.transcript = transcript;

            const relevanceResult = await checkVideoRelevance(video.title, segment.title, lessonPlan.topic, transcript);
            console.log(`🤖 PIPELINE: Relevance result for "${video.title}":`, relevanceResult);

            return { ...video, ...relevanceResult };
        });

        const relevanceResults = await Promise.all(relevancePromises);
        const relevantVideos = relevanceResults.filter(v => v.relevant);

        if (relevantVideos.length === 0) {
            throw new Error("No relevant videos found after AI analysis.");
        }

        relevantVideos.sort((a, b) => (b.confidence - a.confidence) || (b.educationalScore - a.educationalScore));
        const bestVideo = relevantVideos[0];

        console.log(`\n🏆 PIPELINE STEP 4: Selected best video: "${bestVideo.title}"`);
        updateState('loading', interpolateString(t('step4Of5BestVideoFound'), { title: bestVideo.title }));

        console.log(`\n🎬 PIPELINE STEP 5: Finding time segments in "${bestVideo.title}"`);
        updateState('loading', t('step5Of5IdentifyingSegments'));
        const timeSegments = await findVideoSegments(bestVideo.title, segment.title, bestVideo.transcript || null);

        if (!timeSegments || timeSegments.length === 0) {
            throw new Error("Could not identify any relevant time segments in the selected video.");
        }

        console.log(`\n✅ VIDEO SOURCING PIPELINE COMPLETE for "${segment.title}"`);
        updateState('success', t('videoReady'), { videoId: bestVideo.youtubeId, videoTitle: bestVideo.title, timeSegments });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during video sourcing.";
        console.error(`❌ VIDEO SOURCING PIPELINE FAILED for "${segment.title}":`, errorMessage);
        updateState('error', `Video sourcing failed: ${errorMessage}`);
    }
  }, [lessonPlan.topic]);

  // This effect triggers the video pipeline when a video segment becomes active.
  useEffect(() => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📍 LESSON PROGRESSION: Now at segment ${currentSegmentIdx + 1} of ${allLessonParts.length}`);
    console.log(`📍 Current Segment: "${currentSegment?.id}" (${currentSegment?.type})`);
    console.log(`📍 Progress: ${Math.round(((currentSegmentIdx + 1) / allLessonParts.length) * 100)}%`);
    console.log(`${'='.repeat(60)}\n`);

    if (currentSegment.type === SegmentType.VIDEO) {
        console.log(`🎬 VIDEO SEGMENT ACTIVE: "${currentSegment.id}"`);

        const currentFetchState = videoFetchState[currentSegment.id];
        const shouldStartPipeline = !currentFetchState || currentFetchState.status === 'idle';

        if (shouldStartPipeline) {
            console.log(`🚀 STARTING VIDEO PIPELINE for "${currentSegment.id}"`);
            setCurrentVideoTimeSegmentIndex(0);
            orchestrateVideoSourcing(currentSegment as VideoSegment);
        } else {
            console.log(`⏭️ SKIPPING VIDEO PIPELINE: "${currentSegment.id}" already processed`);
        }
    } else {
        console.log(`📖 NARRATION SEGMENT ACTIVE: "${currentSegment.id}"`);
    }
  }, [currentSegmentIdx, currentSegment, videoFetchState, orchestrateVideoSourcing]);

  const handleNextSegment = useCallback(async () => {
    if (currentSegmentIdx >= allLessonParts.length - 1) return;

    // Start smooth transition only if we're not on the first segment
    const nextIdx = currentSegmentIdx + 1;
    const isFirstSegment = currentSegmentIdx === 0;

    // IMMEDIATELY clear any generated illustrations by forcing re-render key
    const illustrationClearKey = Date.now();

    if (!isFirstSegment) {
      setTransitionState({
        isTransitioning: true,
        fromSegment: currentSegmentIdx,
        toSegment: nextIdx,
        phase: 'fadeOut'
      });

      // Stop any current speech
      stopSpeech();
      setSpeakingSegmentId(null);

      // Phase 1: Fade out current content
      await new Promise(resolve => setTimeout(resolve, 200));

      // Phase 2: Show loading state
      setTransitionState(prev => ({ ...prev, phase: 'loading' }));
      await new Promise(resolve => setTimeout(resolve, 300));
    } else {
      // For first segment, just stop speech without transition
      stopSpeech();
      setSpeakingSegmentId(null);
    }

    // Phase 3: Update content
    setCompletedSegments(prev => new Set(prev).add(currentSegment.id));
    setCurrentSegmentIdx(prev => {
      const newIndex = prev + 1;
      // Force re-render by clearing any cached image state
      setTimeout(() => {
        const imageElements = document.querySelectorAll('img[src*="fal.run"], img[src*="images"]');
        imageElements.forEach(img => {
          (img as HTMLImageElement).style.display = 'none';
          (img as HTMLImageElement).src = '';
        });
      }, 0);
      return newIndex;
    });
    setCurrentVideoTimeSegmentIndex(0);

    if (!isFirstSegment) {
      setTransitionState(prev => ({ ...prev, phase: 'fadeIn' }));
      await new Promise(resolve => setTimeout(resolve, 200));

      // Phase 4: Complete transition
      setTransitionState({
        isTransitioning: false,
        fromSegment: -1,
        toSegment: -1,
        phase: 'complete'
      });
    }
  }, [currentSegmentIdx, allLessonParts.length, currentSegment.id]);

  const handlePrevSegment = useCallback(async () => {
    if (currentSegmentIdx <= 0) return;

    // Start smooth transition
    const prevIdx = currentSegmentIdx - 1;

    // IMMEDIATELY clear any generated illustrations by forcing re-render key
    const illustrationClearKey = Date.now();

    setTransitionState({
      isTransitioning: true,
      fromSegment: currentSegmentIdx,
      toSegment: prevIdx,
      phase: 'fadeOut'
    });

    // Stop any current speech
    stopSpeech();
    setSpeakingSegmentId(null);

    // Phase 1: Fade out current content
    await new Promise(resolve => setTimeout(resolve, 200));

    // Phase 2: Show loading state
    setTransitionState(prev => ({ ...prev, phase: 'loading' }));
    await new Promise(resolve => setTimeout(resolve, 300));

    // Phase 3: Update content and fade in
    setCurrentSegmentIdx(prev => {
      const newIndex = prev - 1;
      // Force re-render by clearing any cached image state
      setTimeout(() => {
        const imageElements = document.querySelectorAll('img[src*="fal.run"], img[src*="images"]');
        imageElements.forEach(img => {
          (img as HTMLImageElement).style.display = 'none';
          (img as HTMLImageElement).src = '';
        });
      }, 0);
      return newIndex;
    });
    setCurrentVideoTimeSegmentIndex(0);

    setTransitionState(prev => ({ ...prev, phase: 'fadeIn' }));
    await new Promise(resolve => setTimeout(resolve, 200));

    // Phase 4: Complete transition
    setTransitionState({
      isTransitioning: false,
      fromSegment: -1,
      toSegment: -1,
      phase: 'complete'
    });
  }, [currentSegmentIdx]);

  const handleVideoTimeSegmentComplete = useCallback(() => {
    const segmentId = currentSegment.id;
    const fetchInfo = videoFetchState[segmentId];
    if (fetchInfo?.timeSegments && currentVideoTimeSegmentIndex < fetchInfo.timeSegments.length - 1) {
      setCurrentVideoTimeSegmentIndex(prev => prev + 1);
    } else {
      handleNextSegment(); // Move to the next lesson segment after all video parts are played
    }
  }, [currentSegment.id, videoFetchState, currentVideoTimeSegmentIndex, handleNextSegment]);

  const handleToggleSpeech = useCallback(async (segmentId: string, rawText: string) => {
    if (speakingSegmentId === segmentId || isSpeaking()) {
      stopSpeech();
      setSpeakingSegmentId(null);
      return;
    }

    setSpeakingSegmentId(segmentId);

    try {
      await speakMultilingualText(rawText, currentLanguage);
    } catch (error) {
      console.warn("TTS failed:", error);
    } finally {
        setSpeakingSegmentId(null);
    }
  }, [speakingSegmentId, currentLanguage]);

  const handleGenerateQuiz = useCallback(async () => {
    setIsGeneratingQuiz(true);

    // Collect all narration text from the lesson
    const allNarrationText = [
      lessonPlan.introNarration,
      ...lessonPlan.segments
        .filter(segment => segment.type === SegmentType.NARRATION)
        .map(segment => (segment as NarrationSegment).text),
      lessonPlan.outroNarration
    ].join(' ');

    try {
      console.log('🧠 Generating comprehensive quiz from all narration content...');
      const quiz = await generateQuiz(lessonPlan.topic, allNarrationText);

      if (quiz) {
        setQuizData(quiz);
        setShowQuiz(true);
        console.log('✅ Quiz generated successfully');
      } else {
        console.error('❌ Failed to generate quiz');
      }
    } catch (error) {
      console.error('❌ Quiz generation error:', error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  }, [lessonPlan]);

  useEffect(() => {
    const calculateHeight = () => {
      if (mainContentRef.current) {
        const playerWidth = Math.min(mainContentRef.current.offsetWidth * 0.95, 800);
        setVideoPlayerHeight(String(Math.round((playerWidth * 9) / 16)));
      }
    };
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);

  const progress = ((currentSegmentIdx + 1) / allLessonParts.length) * 100;
  const isCurrentlySpeaking = speakingSegmentId === currentSegment.id;
  const videoFetchInfo = videoFetchState[currentSegment.id];

  return (
    <div ref={mainContentRef} className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header with lesson info and progress */}
      <div className="bg-slate-900 py-4 border-b border-slate-700 min-h-fit">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative mb-4">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-zinc-300 truncate w-full" title={lessonPlan.topic}>
                <ParsedText text={lessonPlan.topic} generateIllustration={false} />
              </h1>
            </div>
            <button 
              onClick={onReset} 
              className="absolute top-0 right-0 flex items-center text-sm bg-zinc-600 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-md transition-colors z-[9999999]"
            >
              {RefreshCwIcon} <span className="ml-2">{t('newLesson')}</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-slate-400 mb-1">
              <span>{interpolateString(t('segmentOf'), { current: currentSegmentIdx + 1, total: allLessonParts.length })}</span>
              <span>{interpolateString(t('percentComplete'), { percent: Math.round(progress) })}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-zinc-500 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Current Segment Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden min-h-fit">

          {/* Segment Header */}
          <div className="bg-gradient-to-r from-zinc-900/50 to-amber-900/50 p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-zinc-400 text-2xl">
                  {currentSegment.type === SegmentType.NARRATION ? BookOpenIcon : FilmIcon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {currentSegment.type === SegmentType.VIDEO ? 
                      <ParsedText text={(videoFetchInfo?.videoTitle || (currentSegment as VideoSegment).title)} generateIllustration={false} /> :
                      t('narration')
                    }
                  </h2>
                  {currentSegment.type === SegmentType.NARRATION ? (
                    <p className="text-slate-400 text-sm">{t('listenToNarration')}</p>
                  ) : (
                    <p className="text-slate-400 text-sm">{t('watchVideoSegment')}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {currentSegment.type === SegmentType.NARRATION && (
                  <button
                    onClick={() => handleToggleSpeech(currentSegment.id, (currentSegment as NarrationSegment).text)}
                    className={`p-3 rounded-full transition-colors shadow-lg ${
                      isCurrentlySpeaking 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                    aria-label={isCurrentlySpeaking ? "Stop narration" : "Play narration"}
                  >
                    <div className="w-5 h-5">
                      {isCurrentlySpeaking ? SpeakerStopIcon : SpeakerPlayIcon}
                    </div>
                  </button>
                )}

                {completedSegments.has(currentSegment.id) && (
                  <div className="text-green-400 text-xl">{CheckCircleIcon}</div>
                )}
              </div>
            </div>
          </div>

          {/* Transition Overlay - Only show during actual transitions, not initial render */}
          {transitionState.isTransitioning && currentSegmentIdx > 0 && (
            <div className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
              transitionState.phase === 'fadeOut' ? 'bg-slate-900/80 opacity-100' :
              transitionState.phase === 'loading' ? 'bg-slate-900/90 opacity-100' :
              transitionState.phase === 'fadeIn' ? 'bg-slate-900/40 opacity-60' :
              'opacity-0 pointer-events-none'
            }`}>
              <div className="flex flex-col items-center space-y-4 text-white">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-slate-600 border-t-amber-500 rounded-full animate-spin"></div>
                  <div className="w-8 h-8 border-3 border-slate-500 border-t-zinc-400 rounded-full animate-spin absolute top-2 left-2" 
                       style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-slate-200">
                    {transitionState.phase === 'fadeOut' ? 'Finishing segment...' :
                     transitionState.phase === 'loading' ? 'Loading next segment...' :
                     transitionState.phase === 'fadeIn' ? 'Preparing content...' : ''}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Segment {transitionState.toSegment + 1} of {allLessonParts.length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Segment Content */}
          <div className={`p-6 transition-opacity duration-300 ${
            transitionState.isTransitioning && transitionState.phase !== 'fadeIn' && currentSegmentIdx > 0 ? 'opacity-30' : 'opacity-100'
          }`}>
            {currentSegment.type === SegmentType.NARRATION ? (
              <div className="space-y-4 min-h-fit">
                <div className="text-lg leading-relaxed text-slate-200 min-h-fit">
                  <ParsedText 
                    key={`${currentSegment.id}-${currentSegmentIdx}-${transitionState.isTransitioning ? 'transitioning' : 'stable'}`}
                    text={(currentSegment as NarrationSegment).text} 
                    lessonTopic={lessonPlan.topic} 
                    generateIllustration={!transitionState.isTransitioning} 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Video segment description */}
                <div className="text-slate-400 italic mb-4">
                  <ParsedText text={(currentSegment as VideoSegment).segmentDescription} generateIllustration={false} />
                </div>

                {/* Video content */}
                {videoFetchInfo?.status === 'success' && videoFetchInfo.videoId && videoFetchInfo.timeSegments ? (
                  <div className="space-y-4">
                    <YouTubePlayerWrapper
                      key={`${videoFetchInfo.videoId}-${currentVideoTimeSegmentIndex}`}
                      videoId={videoFetchInfo.videoId}
                      startSeconds={videoFetchInfo.timeSegments[currentVideoTimeSegmentIndex].startTime}
                      endSeconds={videoFetchInfo.timeSegments[currentVideoTimeSegmentIndex].endTime}
                      onEnd={handleVideoTimeSegmentComplete}
                      height={videoPlayerHeight}
                    />
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="text-sm text-zinc-300 font-semibold mb-1">
                        {interpolateString(t('videoPartOf'), { current: currentVideoTimeSegmentIndex + 1, total: videoFetchInfo.timeSegments.length })}
                      </div>
                      <div className="text-slate-400 italic">
                        "{videoFetchInfo.timeSegments[currentVideoTimeSegmentIndex].reason}"
                      </div>
                    </div>
                  </div>
                ) : videoFetchInfo?.status === 'loading' ? (
                  <div className="bg-slate-700/50 rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="w-10 h-10 border-3 border-slate-500 border-t-cyan-400 rounded-full animate-spin absolute top-3 left-3" 
                             style={{animationDirection: 'reverse', animationDuration: '1.2s'}}></div>
                      </div>
                      <div className="text-slate-300 font-medium">
                        {videoFetchInfo.message}
                      </div>
                      <div className="text-sm text-slate-500 max-w-md">
                        {t('ourAiAnalyzing')}
                      </div>
                      <div className="flex space-x-1 mt-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                ) : videoFetchInfo?.status === 'error' ? (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
                    <div className="text-red-400 mb-2">❌ {videoFetchInfo.message}</div>
                    <div className="text-sm text-slate-400">You can skip this segment or try again later.</div>
                  </div>
                ) : (
                  <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                    <div className="text-slate-400">Preparing video content...</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevSegment}
            disabled={isFirstSegment || transitionState.isTransitioning}
            className="flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {transitionState.isTransitioning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              ChevronLeftIcon
            )} 
            <span className="ml-2">{t('previous')}</span>
          </button>

          <span className="text-slate-400 text-sm">
            {transitionState.isTransitioning ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span>Transitioning...</span>
              </div>
            ) : currentSegment.type === SegmentType.VIDEO && videoFetchInfo?.timeSegments ? (
              interpolateString(t('videoPartOf'), { current: currentVideoTimeSegmentIndex + 1, total: videoFetchInfo.timeSegments.length })
            ) : null}
          </span>

          {isLastSegment ? (
            <button
              onClick={handleGenerateQuiz}
              disabled={transitionState.isTransitioning || isGeneratingQuiz}
              className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="mr-2">{t('generateQuiz')}</span> 
              {isGeneratingQuiz ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                CheckCircleIcon
              )}
            </button>
          ) : (
            <button
              onClick={handleNextSegment}
              disabled={transitionState.isTransitioning}
              className="flex items-center px-6 py-3 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="mr-2">{t('next')}</span> 
              {transitionState.isTransitioning ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                ChevronRightIcon
              )}
            </button>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && quizData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-2">
                📝 Lesson Quiz: {lessonPlan.topic}
              </h2>
              <p className="text-slate-300">Test your understanding of the lesson content</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {quizData.question}
                </h3>

                <div className="space-y-3">
                  {quizData.options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => {
                        const isCorrect = index === quizData.correct;
                        if (isCorrect) {
                          alert('✅ Correct! ' + quizData.explanation);
                        } else {
                          alert('❌ Incorrect. The correct answer is: ' + quizData.options[quizData.correct] + '\n\n' + quizData.explanation);
                        }
                      }}
                      className="w-full text-left p-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors border border-slate-500 hover:border-slate-400"
                    >
                      <span className="font-medium text-slate-300 mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    setQuizData(null);
                  }}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                >
                  Close Quiz
                </button>

                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isGeneratingQuiz ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate New Quiz'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};