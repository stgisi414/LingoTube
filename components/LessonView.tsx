// components/LessonView.tsx

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LessonPlan, LessonSegment, SegmentType, VideoSegment, NarrationSegment, VideoTimeSegment } from '../types';
import { BookOpenIcon, FilmIcon, RefreshCwIcon, CheckCircleIcon, SpeakerPlayIcon, SpeakerStopIcon, ExternalLinkIcon } from '../constants';
import { YouTubePlayerWrapper } from './YouTubePlayerWrapper';
import ParsedText from './ParsedText';
import { speakMultilingualText, stopSpeech, isSpeaking } from '../services/googleTTSService';
import { generateSearchQueries, checkVideoRelevance, findVideoSegments } from '../services/geminiService';
import { searchYouTube, getVideoTranscript, SearchedVideo } from '../services/videoSourcingService';

// This interface defines the state for the entire video fetching pipeline for one segment.
interface VideoFetchState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  videoId: string | null;
  videoTitle: string | null;
  timeSegments: VideoTimeSegment[] | null;
}

// This is the UI component for a single item in the lesson plan.
const SegmentItem: React.FC<{
  segment: LessonSegment;
  isCurrent: boolean;
  isComplete?: boolean;
  videoHeight?: string;
  speakingSegmentId: string | null;
  onToggleSpeech: (segmentId: string, rawText: string) => void;
  videoFetchInfo?: VideoFetchState;
  onVideoTimeSegmentComplete: () => void;
  currentVideoTimeSegmentIndex: number;
}> = ({
  segment, isCurrent, isComplete, videoHeight, speakingSegmentId,
  onToggleSpeech, videoFetchInfo, onVideoTimeSegmentComplete, currentVideoTimeSegmentIndex
}) => {
  const commonClasses = "p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out border-2";
  const currentClasses = isCurrent ? "border-purple-500 bg-slate-700/70 scale-105" : "border-slate-700 bg-slate-800 hover:border-purple-700/50";
  const completeClasses = isComplete ? "opacity-70 border-green-500/50" : "";
  const isCurrentlySpeaking = speakingSegmentId === segment.id;

  const videoSeg = segment as VideoSegment;
  const displayTitle = videoFetchInfo?.videoTitle || (segment.type === SegmentType.VIDEO ? videoSeg.title : 'Narration');
  const timeSegments = videoFetchInfo?.timeSegments;
  const currentVideoId = videoFetchInfo?.videoId;
  const currentVideoTimeSegment = timeSegments ? timeSegments[currentVideoTimeSegmentIndex] : null;

  return (
    <div className={`${commonClasses} ${currentClasses} ${completeClasses} relative`} id={`segment-${segment.id}`}>
      {isComplete && <div className="absolute top-3 right-3 text-green-400" aria-label="Completed">{CheckCircleIcon}</div>}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-purple-400 pt-1" aria-hidden="true">
          {segment.type === SegmentType.NARRATION ? BookOpenIcon : FilmIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r ${segment.type === SegmentType.NARRATION ? 'from-purple-400 to-fuchsia-500' : 'from-pink-400 to-red-500'}`}>
              <ParsedText text={displayTitle} />
            </h3>
            {segment.type === SegmentType.NARRATION && (
              <button
                onClick={() => onToggleSpeech(segment.id, (segment as NarrationSegment).text)}
                className={`p-1.5 rounded-full transition-colors ${isCurrentlySpeaking ? 'text-red-400 hover:bg-red-500/20' : 'text-purple-400 hover:bg-purple-500/20'}`}
                aria-label={isCurrentlySpeaking ? "Stop narration" : "Play narration"}
                title={isCurrentlySpeaking ? "Stop narration" : "Play narration"}
              >
                {isCurrentlySpeaking ? SpeakerStopIcon : SpeakerPlayIcon}
              </button>
            )}
          </div>
          {segment.type === SegmentType.NARRATION && (
            <ParsedText text={(segment as NarrationSegment).text} />
          )}
          {segment.type === SegmentType.VIDEO && (
            <>
              <div className="text-sm text-slate-400 mb-3 italic">
                <ParsedText text={videoSeg.segmentDescription} />
              </div>
              {videoFetchInfo?.status === 'success' && currentVideoId && currentVideoTimeSegment ? (
                <>
                  <YouTubePlayerWrapper
                    key={`${currentVideoId}-${currentVideoTimeSegmentIndex}`}
                    videoId={currentVideoId}
                    startSeconds={currentVideoTimeSegment.startTime}
                    endSeconds={currentVideoTimeSegment.endTime}
                    onEnd={onVideoTimeSegmentComplete}
                    height={videoHeight || '360'}
                  />
                  <div className="mt-2 p-2 bg-slate-800/50 rounded-md text-sm">
                    <p className="font-semibold text-purple-300">Playing Segment {currentVideoTimeSegmentIndex + 1} of {timeSegments?.length}:</p>
                    <p className="text-slate-400 italic">"{currentVideoTimeSegment.reason}"</p>
                  </div>
                </>
              ) : videoFetchInfo?.status === 'loading' ? (
                <div className="p-4 bg-slate-700/50 rounded-md border border-slate-600 text-slate-300 text-center">
                  <div className="animate-pulse">{videoFetchInfo.message}</div>
                </div>
              ) : (
                <div className="p-4 bg-slate-700/50 rounded-md border border-slate-600">
                  <p className={`mb-2 ${videoFetchInfo?.status === 'error' ? 'text-red-400' : 'text-slate-300'}`}>
                    {videoFetchInfo?.message || "Could not find a valid video."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// This is the main component that renders the lesson.
export const LessonView: React.FC<{ lessonPlan: LessonPlan; onReset: () => void; }> = ({ lessonPlan, onReset }) => {
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<Set<string>>(new Set());
  const [videoPlayerHeight, setVideoPlayerHeight] = useState('360');
  const [speakingSegmentId, setSpeakingSegmentId] = useState<string | null>(null);
  const [videoFetchState, setVideoFetchState] = useState<Record<string, VideoFetchState>>({});
  const [currentVideoTimeSegmentIndex, setCurrentVideoTimeSegmentIndex] = useState(0);

  const mainContentRef = useRef<HTMLDivElement>(null);

  const allLessonParts = useMemo(() => [
    { type: SegmentType.NARRATION, id: 'intro-narration', text: lessonPlan.introNarration },
    ...lessonPlan.segments,
    { type: SegmentType.NARRATION, id: 'outro-narration', text: lessonPlan.outroNarration },
  ], [lessonPlan]);

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
        console.log(`🔍 PIPELINE STEP 1: Input parameters:`, {
            segmentTitle: segment.title,
            mainTopic: lessonPlan.topic,
            timestamp: new Date().toISOString()
        });
        updateState('loading', 'Step 1/5: Generating search queries...', { videoId: null, videoTitle: null, timeSegments: null });
        const queries = await generateSearchQueries(segment.title, lessonPlan.topic);
        console.log(`✅ PIPELINE STEP 1: Generated ${queries.length} search queries:`, queries);
        console.log(`✅ PIPELINE STEP 1: Query generation completed in ${Date.now() - Date.now()}ms\n`);

        console.log(`\n🔎 PIPELINE STEP 2: Searching YouTube with ${queries.length} queries`);
        updateState('loading', 'Step 2/5: Searching YouTube for candidates...');
        const searchStartTime = Date.now();
        const searchPromises = queries.map(async (q, index) => {
            console.log(`🔎 PIPELINE: Searching with query ${index + 1}/${queries.length}: "${q}"`);
            const queryStartTime = Date.now();
            const results = await searchYouTube(q);
            const queryEndTime = Date.now();
            console.log(`🔎 PIPELINE: Query ${index + 1} returned ${results.length} results in ${queryEndTime - queryStartTime}ms`);
            if (results.length > 0) {
                console.log(`🔎 PIPELINE: Top results for "${q}":`, results.slice(0, 3).map(r => ({
                    youtubeId: r.youtubeId,
                    title: r.title.substring(0, 50) + '...',
                    score: r.educationalScore
                })));
            }
            return results;
        });

        const videoCandidates = (await Promise.all(searchPromises)).flat();
        console.log(`🔎 PIPELINE STEP 2: Total raw candidates found: ${videoCandidates.length}`);

        const uniqueVideos = [...new Map(videoCandidates.map(v => [v.youtubeId, v])).values()]
            .sort((a, b) => b.educationalScore - a.educationalScore);

        console.log(`🔎 PIPELINE STEP 2: Unique videos after deduplication: ${uniqueVideos.length}`);

        if (uniqueVideos.length === 0) {
            console.error(`❌ PIPELINE STEP 2: No videos found from any search query`);
            throw new Error("No videos found from any search query.");
        }

        const candidateCount = Math.min(5, uniqueVideos.length);
        console.log(`\n🤖 PIPELINE STEP 3: Checking top ${candidateCount} videos for relevance`);
        console.log(`🤖 PIPELINE STEP 3: Starting AI relevance analysis for segment: "${segment.title}"`);
        console.log(`🤖 PIPELINE STEP 3: Candidates to analyze:`, uniqueVideos.slice(0, candidateCount).map((v, i) => ({
            rank: i + 1,
            youtubeId: v.youtubeId,
            title: v.title,
            educationalScore: v.educationalScore
        })));
        updateState('loading', `Step 3/5: Checking top ${candidateCount} videos for relevance...`);

        const relevancePromises = uniqueVideos.slice(0, 5).map(async (video, index) => {
            console.log(`🤖 PIPELINE: Analyzing candidate ${index + 1}/${candidateCount}: "${video.title}"`);
            const transcript = await getVideoTranscript(video.youtubeId);
            video.transcript = transcript; // Attach transcript for later use
            console.log(`🤖 PIPELINE: Transcript obtained for "${video.title}": ${transcript ? `${transcript.length} chars` : 'none'}`);

            const relevanceResult = await checkVideoRelevance(video.title, segment.title, lessonPlan.topic, transcript);
            console.log(`🤖 PIPELINE: Relevance result for "${video.title}":`, relevanceResult);

            return { ...video, ...relevanceResult };
        });

        const relevanceResults = await Promise.all(relevancePromises);
        const relevantVideos = relevanceResults.filter(v => v.relevant);

        console.log(`🤖 PIPELINE STEP 3: Relevance analysis complete:`, {
            totalAnalyzed: relevanceResults.length,
            relevantCount: relevantVideos.length,
        });

        if (relevantVideos.length === 0) {
            console.error(`❌ PIPELINE STEP 3: No relevant videos found after AI analysis`);
            throw new Error("No relevant videos found after AI analysis.");
        }

        // Sort by confidence, then by original educational score
        relevantVideos.sort((a, b) => (b.confidence - a.confidence) || (b.educationalScore - a.educationalScore));
        const bestVideo = relevantVideos[0];

        console.log(`\n🏆 PIPELINE STEP 4: Selected best video:`, {
            youtubeId: bestVideo.youtubeId,
            title: bestVideo.title,
            confidence: bestVideo.confidence,
            educationalScore: bestVideo.educationalScore,
            selectionReason: 'Highest confidence score after AI analysis'
        });

        updateState('loading', `Step 4/5: Best video found: "${bestVideo.title}"`);

        console.log(`\n🎬 PIPELINE STEP 5: Finding time segments in "${bestVideo.title}"`);
        console.log(`🎬 PIPELINE STEP 5: Input parameters:`, {
            videoTitle: bestVideo.title,
            segmentTitle: segment.title,
            hasTranscript: !!bestVideo.transcript,
            transcriptLength: bestVideo.transcript?.length || 0
        });
        updateState('loading', `Step 5/5: Identifying key segments in the video...`);
        const segmentStartTime = Date.now();
        const timeSegments = await findVideoSegments(bestVideo.title, segment.title, bestVideo.transcript || null);
        const segmentEndTime = Date.now();

        console.log(`🎬 PIPELINE STEP 5: Time segments analysis completed in ${segmentEndTime - segmentStartTime}ms`);
        console.log(`🎬 PIPELINE STEP 5: Time segments found:`, {
            segmentCount: timeSegments?.length || 0,
            segments: timeSegments?.map((ts, i) => ({
                index: i + 1,
                startTime: ts.startTime,
                endTime: ts.endTime,
                duration: ts.endTime - ts.startTime,
                reason: ts.reason.substring(0, 50) + '...'
            }))
        });

        if (!timeSegments || timeSegments.length === 0) {
            console.error(`❌ PIPELINE STEP 5: Could not identify any relevant time segments`);
            throw new Error("Could not identify any relevant time segments in the selected video.");
        }

        console.log(`\n${'='.repeat(80)}`);
        console.log(`✅ VIDEO SOURCING PIPELINE COMPLETE`);
        console.log(`✅ PIPELINE: Successfully sourced video for "${segment.title}"`);
        console.log(`✅ PIPELINE: Final result:`, {
            segmentTitle: segment.title,
            selectedVideoId: bestVideo.youtubeId,
            selectedVideoTitle: bestVideo.title,
            timeSegmentCount: timeSegments.length,
            totalPipelineTime: `${Date.now() - Date.now()}ms`,
            timestamp: new Date().toISOString()
        });
        console.log(`${'='.repeat(80)}\n`);

        updateState('success', 'Video ready!', { videoId: bestVideo.youtubeId, videoTitle: bestVideo.title, timeSegments });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during video sourcing.";
        console.log(`\n${'='.repeat(80)}`);
        console.error(`❌ VIDEO SOURCING PIPELINE FAILED`);
        console.error(`❌ PIPELINE ERROR: Video sourcing failed for "${segment.title}":`, {
            error: errorMessage,
            segmentId,
            segmentTitle: segment.title,
            timestamp: new Date().toISOString(),
            stack: error instanceof Error ? error.stack : undefined
        });
        console.log(`${'='.repeat(80)}\n`);
        updateState('error', `Video sourcing failed: ${errorMessage}`);
    }
  }, [lessonPlan.topic]);


  // This effect triggers the video pipeline when a video segment becomes active.
  useEffect(() => {
    const currentSegment = allLessonParts[currentSegmentIdx];
    if (currentSegment.type === SegmentType.VIDEO) {
        if (!videoFetchState[currentSegment.id] || videoFetchState[currentSegment.id].status === 'idle') {
            setCurrentVideoTimeSegmentIndex(0); // Reset time segment index for new video
            orchestrateVideoSourcing(currentSegment as VideoSegment);
        }
    }
  }, [currentSegmentIdx, allLessonParts, videoFetchState, orchestrateVideoSourcing]);

  const handleNextSegment = useCallback(() => {
    stopSpeech();
    setSpeakingSegmentId(null);

    if (currentSegmentIdx < allLessonParts.length - 1) {
        setCompletedSegments(prev => new Set(prev).add(allLessonParts[currentSegmentIdx].id));
        setCurrentSegmentIdx(prev => prev + 1);
    }
  }, [currentSegmentIdx, allLessonParts]);

  const handlePrevSegment = () => {
    stopSpeech();
    setSpeakingSegmentId(null);

    if (currentSegmentIdx > 0) {
      setCurrentSegmentIdx(prev => prev - 1);
    }
  };

  const handleVideoTimeSegmentComplete = useCallback(() => {
    const segmentId = allLessonParts[currentSegmentIdx].id;
    const fetchInfo = videoFetchState[segmentId];
    if (fetchInfo?.timeSegments && currentVideoTimeSegmentIndex < fetchInfo.timeSegments.length - 1) {
      setCurrentVideoTimeSegmentIndex(prev => prev + 1);
    } else {
      handleNextSegment(); // Move to the next lesson segment after all video parts are played
    }
  }, [currentSegmentIdx, allLessonParts, videoFetchState, currentVideoTimeSegmentIndex, handleNextSegment]);

  const handleToggleSpeech = useCallback(async (segmentId: string, rawText: string) => {
    if (speakingSegmentId === segmentId || isSpeaking()) {
      stopSpeech();
      setSpeakingSegmentId(null);
      return;
    }

    setSpeakingSegmentId(segmentId);

    try {
      await speakMultilingualText(rawText);
    } catch (error) {
      console.warn("TTS failed:", error);
    } finally {
        setSpeakingSegmentId(null);
    }
  }, [speakingSegmentId]);

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

  return (
    <div ref={mainContentRef} className="space-y-8 pb-16">
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-10 rounded-b-lg shadow-lg">
        <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-purple-300 truncate" title={lessonPlan.topic}>
                  <ParsedText text={lessonPlan.topic} />
                </h2>
                <div className="flex items-center space-x-2">
                    <button onClick={onReset} className="flex items-center text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md">
                        {RefreshCwIcon} <span className="ml-2 hidden sm:inline">New Lesson</span>
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="space-y-6 max-w-3xl mx-auto px-4">
        {allLessonParts.map((segment, index) => (
          <SegmentItem
            key={segment.id}
            segment={segment}
            isCurrent={index === currentSegmentIdx}
            isComplete={completedSegments.has(segment.id)}
            videoHeight={videoPlayerHeight}
            speakingSegmentId={speakingSegmentId}
            onToggleSpeech={handleToggleSpeech}
            videoFetchInfo={videoFetchState[segment.id]}
            onVideoTimeSegmentComplete={handleVideoTimeSegmentComplete}
            currentVideoTimeSegmentIndex={currentVideoTimeSegmentIndex}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-10 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button onClick={handlePrevSegment} disabled={currentSegmentIdx === 0} className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold rounded-lg shadow-md disabled:opacity-50 w-full sm:w-auto">
              Previous Segment
            </button>
            <button onClick={handleNextSegment} disabled={currentSegmentIdx >= allLessonParts.length - 1} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 w-full sm:w-auto">
              Next Segment
            </button>
          </div>
      </div>
    </div>
  );
};