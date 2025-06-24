import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { LessonPlan, LessonSegment, SegmentType, VideoSegment, NarrationSegment } from '../types';
import { BookOpenIcon, FilmIcon, RefreshCwIcon, CheckCircleIcon, SpeakerPlayIcon, SpeakerStopIcon, ExternalLinkIcon } from '../constants';
import { YouTubePlayerWrapper } from './YouTubePlayerWrapper';
import { parseLangText, LangParsedSegment } from './ParsedText';
import { synthesizeSpeech, playTTSAudio } from '../services/googleTTSService';
import { fetchYouTubeVideoId } from '../services/customSearchService';
import { fetchVideoMetadata, YouTubeVideoDetails } from '../services/youtubeDataService'; // Import new service

interface VideoFetchState {
  id: string | null; // YouTube video ID
  status: 'idle' | 'loadingId' | 'loadingDetails' | 'success' | 'error';
  message?: string;
  // New fields from YouTube Data API
  actualTitle?: string;
  // actualDescription?: string; // Not using for now to keep UI simpler
  durationSeconds?: number;
}

interface SegmentItemProps {
  segment: LessonSegment;
  isCurrent: boolean;
  isComplete?: boolean;
  videoHeight?: string;
  isSpeechSynthesisSupported: boolean;
  speakingSegmentId: string | null;
  onToggleSpeech: (segmentId: string, rawText: string) => void;
  videoFetchInfo?: VideoFetchState;
}

interface LessonViewProps {
  lessonPlan: LessonPlan;
  onReset: () => void;
}

import { PlayerMode } from './PlayerMode';

const SegmentItem: React.FC<SegmentItemProps> = ({ 
  segment, 
  isCurrent, 
  isComplete, 
  videoHeight,
  isSpeechSynthesisSupported,
  speakingSegmentId,
  onToggleSpeech,
  videoFetchInfo 
}) => {
  const commonClasses = "p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out border-2";
  const currentClasses = isCurrent ? "border-purple-500 bg-slate-700/70 scale-105" : "border-slate-700 bg-slate-800 hover:border-purple-700/50";
  const completeClasses = isComplete ? "opacity-70 border-green-500/50" : "";
  const isSpeaking = speakingSegmentId === segment.id;

  const videoSeg = segment as VideoSegment;
  const displayTitle = videoFetchInfo?.actualTitle || (segment.type === SegmentType.VIDEO ? videoSeg.title : 'Narration');

  let effectiveStartSeconds = videoSeg.estimatedStartSeconds;
  let effectiveEndSeconds = videoSeg.estimatedEndSeconds;

  if (videoFetchInfo?.durationSeconds && videoSeg.estimatedEndSeconds) {
    effectiveEndSeconds = Math.min(videoSeg.estimatedEndSeconds, videoFetchInfo.durationSeconds);
    if (effectiveStartSeconds && effectiveEndSeconds < effectiveStartSeconds) {
        effectiveEndSeconds = videoFetchInfo.durationSeconds; // or null, if start is beyond actual end, play whole
    }
  } else if (videoFetchInfo?.durationSeconds && videoSeg.estimatedEndSeconds === null && videoSeg.estimatedStartSeconds !== null) {
    // If start is defined but end is not, and we have duration, we could set end to duration.
    // For now, player handles null end as "play to end of video".
  }


  return (
    <div 
      className={`${commonClasses} ${currentClasses} ${completeClasses} relative`}
      aria-current={isCurrent ? "step" : undefined}
      id={`segment-${segment.id}`}
    >
      {isComplete && <div className="absolute top-3 right-3 text-green-400" aria-label="Completed">{CheckCircleIcon}</div>}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-purple-400 pt-1" aria-hidden="true">
          {segment.type === SegmentType.NARRATION ? BookOpenIcon : FilmIcon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r ${segment.type === SegmentType.NARRATION ? 'from-purple-400 to-fuchsia-500' : 'from-pink-400 to-red-500'}`}>
              {displayTitle}
            </h3>
            {segment.type === SegmentType.NARRATION && isSpeechSynthesisSupported && (
              <button
                onClick={() => onToggleSpeech(segment.id, (segment as NarrationSegment).text)}
                className={`p-1.5 rounded-full transition-colors ${
                  isSpeaking 
                    ? 'text-red-400 hover:bg-red-500/20' 
                    : 'text-purple-400 hover:bg-purple-500/20'
                }`}
                aria-label={isSpeaking ? "Stop narration" : "Play narration"}
                title={isSpeaking ? "Stop narration" : "Play narration"}
              >
                {isSpeaking ? SpeakerStopIcon : SpeakerPlayIcon}
              </button>
            )}
          </div>

          {segment.type === SegmentType.NARRATION && (
            <ParsedText text={(segment as NarrationSegment).text} />
          )}
          {segment.type === SegmentType.VIDEO && (() => {
            let videoIdToPlay: string | null = videoSeg.youtubeVideoId || null;
            if (!videoIdToPlay && videoFetchInfo?.status === 'success' && videoFetchInfo.id) {
                videoIdToPlay = videoFetchInfo.id;
            }

            return (
              <>
                <p className="text-sm text-slate-400 mb-3 italic">{videoSeg.segmentDescription}</p>
                {videoIdToPlay ? (
                  <YouTubePlayerWrapper 
                    videoId={videoIdToPlay}
                    startSeconds={effectiveStartSeconds}
                    endSeconds={effectiveEndSeconds}
                    height={videoHeight || '360'}
                  />
                ) : videoFetchInfo?.status === 'loadingId' || videoFetchInfo?.status === 'loadingDetails' ? (
                  <div className="p-4 bg-slate-700/50 rounded-md border border-slate-600 text-slate-300 text-center">
                    <div className="animate-pulse">
                        {videoFetchInfo?.status === 'loadingId' ? `Searching for video: "${videoSeg.youtubeSearchQuery}"...` : 'Fetching video details...'}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-700/50 rounded-md border border-slate-600">
                    <p className={`mb-2 ${videoFetchInfo?.status === 'error' ? 'text-red-400' : 'text-slate-300'}`}>
                      {videoFetchInfo?.status === 'error' 
                        ? (videoFetchInfo.message || "Could not find or load video.")
                        : "No specific video provided by AI or found via search."}
                    </p>
                    {videoSeg.youtubeSearchQuery && (!videoIdToPlay || videoFetchInfo?.status === 'error') && (
                      <>
                        <p className="text-slate-300 mb-2">
                          You can try searching on YouTube:
                        </p>
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(videoSeg.youtubeSearchQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium"
                        >
                          Search: "{videoSeg.youtubeSearchQuery}" <span className="ml-1.5">{ExternalLinkIcon}</span>
                        </a>
                      </>
                    )}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};


export const LessonView: React.FC<LessonViewProps> = ({ lessonPlan, onReset }) => {
  const [viewMode, setViewMode] = useState<'list' | 'player'>('list');
  const [currentSegmentIdx, setCurrentSegmentIdx] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<Set<string>>(new Set());
  const [videoPlayerHeight, setVideoPlayerHeight] = useState('360'); 
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState(false);
  const [speakingSegmentId, setSpeakingSegmentId] = useState<string | null>(null);
  
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [fetchedVideoInfo, setFetchedVideoInfo] = useState<Record<string, VideoFetchState>>({});

  const mainContentRef = useRef<HTMLDivElement>(null);
  

  const allLessonParts: LessonSegment[] = useMemo(() => [
    { type: SegmentType.NARRATION, id: 'intro-narration', text: lessonPlan.introNarration },
    ...lessonPlan.segments,
    { type: SegmentType.NARRATION, id: 'outro-narration', text: lessonPlan.outroNarration },
  ], [lessonPlan]);


  useEffect(() => {
    setIsSpeechSynthesisSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      speechUtteranceRef.current = null;
    };
  }, []);

  useEffect(() => {
    setFetchedVideoInfo({});
    setCurrentSegmentIdx(0);
    setCompletedSegments(new Set());
  }, [lessonPlan.topic]);


  useEffect(() => {
    const currentFullSegment = allLessonParts[currentSegmentIdx];
    if (currentFullSegment?.type === SegmentType.VIDEO) {
      const segmentId = currentFullSegment.id;
      const existingFetchState = fetchedVideoInfo[segmentId];

      if (currentFullSegment.youtubeVideoId && (!existingFetchState || existingFetchState.status === 'idle' || existingFetchState.id !== currentFullSegment.youtubeVideoId)) {
        // Gemini provided an ID, fetch its details if not already fetched or if ID changed
        setFetchedVideoInfo(prev => ({ ...prev, [segmentId]: { id: currentFullSegment.youtubeVideoId, status: 'loadingDetails' } }));
        fetchVideoMetadata(currentFullSegment.youtubeVideoId)
          .then(details => {
            if (details) {
              setFetchedVideoInfo(prev => ({ 
                ...prev, 
                [segmentId]: { 
                  id: currentFullSegment.youtubeVideoId, 
                  status: 'success', 
                  actualTitle: details.title, 
                  durationSeconds: details.durationSeconds 
                } 
              }));
            } else { // Metadata fetch failed, but we still have the ID from Gemini
              setFetchedVideoInfo(prev => ({ 
                ...prev, 
                [segmentId]: { 
                  id: currentFullSegment.youtubeVideoId, 
                  status: 'success', // Success for ID, but no extra details
                  message: "Could not fetch video details, but ID is available."
                } 
              }));
            }
          })
          .catch(err => { // Should ideally not happen if fetchVideoMetadata handles its errors
            console.error("Error fetching video metadata for Gemini ID", segmentId, err);
            setFetchedVideoInfo(prev => ({ ...prev, [segmentId]: { ...prev[segmentId], status: 'error', message: "Failed to load video details." } }));
          });
      } else if (!currentFullSegment.youtubeVideoId && currentFullSegment.youtubeSearchQuery && (!existingFetchState || existingFetchState.status === 'idle')) {
        // No ID from Gemini, need to search then fetch details
        setFetchedVideoInfo(prev => ({ ...prev, [segmentId]: { id: null, status: 'loadingId' } }));
        fetchYouTubeVideoId(currentFullSegment.youtubeSearchQuery)
          .then(videoId => {
            if (videoId) {
              setFetchedVideoInfo(prev => ({ ...prev, [segmentId]: { id: videoId, status: 'loadingDetails' } }));
              return fetchVideoMetadata(videoId);
            } else {
              setFetchedVideoInfo(prev => ({ ...prev, [segmentId]: { id: null, status: 'error', message: "Video not found using search." } }));
              return null; // Explicitly return null for the Promise chain
            }
          })
          .then(details => { // This 'then' is for the result of fetchVideoMetadata
            if (details) { // details is YouTubeVideoDetails | null
              const currentVideoId = fetchedVideoInfo[segmentId]?.id || (details && fetchedVideoInfo[segmentId]?.status === 'loadingDetails' ? fetchedVideoInfo[segmentId].id : null);
              if (currentVideoId){ // ensure we have an ID to associate with
                setFetchedVideoInfo(prev => ({
                  ...prev,
                  [segmentId]: {
                    ...prev[segmentId], // Keep the ID from previous step
                    id: currentVideoId,
                    status: 'success',
                    actualTitle: details.title,
                    durationSeconds: details.durationSeconds,
                  }
                }));
              }
            } else if (fetchedVideoInfo[segmentId]?.status === 'loadingDetails' && fetchedVideoInfo[segmentId]?.id) {
              // Metadata fetch failed, but search found an ID
               setFetchedVideoInfo(prev => ({ 
                ...prev, 
                [segmentId]: { 
                  ...prev[segmentId], // Keep the ID
                  status: 'success', // Success for ID, but no extra details
                  message: "Video ID found, but could not fetch further details."
                } 
              }));
            }
            // If details is null and previous state wasn't 'loadingDetails' with an ID, it means fetchYouTubeVideoId already set an error.
          })
          .catch(err => { // Catch errors from either fetchYouTubeVideoId or fetchVideoMetadata chain
            console.error("Error in video fetching pipeline for segment", segmentId, err);
            // Ensure error state is robustly set if not already
            if (fetchedVideoInfo[segmentId]?.status !== 'error') {
                 setFetchedVideoInfo(prev => ({ ...prev, [segmentId]: { id: null, status: 'error', message: "Failed to find or load video." } }));
            }
          });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegmentIdx, allLessonParts]); // lessonPlan.topic change handles full reset, this handles segment changes. fetchedVideoInfo removed to avoid loops, state updates manage flow.


  const handleToggleSpeech = useCallback(async (segmentId: string, rawText: string) => {
    if (!rawText) return;

    if (speakingSegmentId === segmentId) {
        setSpeakingSegmentId(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        speechUtteranceRef.current = null;
        return;
    }

    setSpeakingSegmentId(segmentId);
    
    // Always try Google TTS first
    try {
        const audioContent = await synthesizeSpeech(rawText);
        if (audioContent) {
            await playTTSAudio(audioContent, audioRef, () => {
                setSpeakingSegmentId(null);
            });
            return; // Successfully used Google TTS
        }
    } catch (error) {
        console.warn("Google TTS failed, falling back to browser TTS:", error);
    }

    // Fallback to browser TTS if Google TTS fails
    if (isSpeechSynthesisSupported) {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const parsedSegments = parseLangText(rawText);
        let textToSpeak = "";
        let langForSpeech: string | undefined = undefined;

        if (parsedSegments.length > 0) {
          textToSpeak = parsedSegments.map(seg => seg.text).join(' ');
          const firstLangSegment = parsedSegments.find(seg => seg.type === 'lang') as LangParsedSegment | undefined;
          if (firstLangSegment && firstLangSegment.langCode) {
            langForSpeech = firstLangSegment.langCode;
          }
        } else {
          textToSpeak = rawText; 
        }

        if (!textToSpeak.trim()) return;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        if (langForSpeech) {
          utterance.lang = langForSpeech;
        }

        speechUtteranceRef.current = utterance;

        utterance.onend = () => {
            if (speechUtteranceRef.current === utterance) {
                setSpeakingSegmentId(null);
                speechUtteranceRef.current = null;
            }
        };
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          if (speechUtteranceRef.current === utterance) {
            setSpeakingSegmentId(null);
            speechUtteranceRef.current = null;
          }
        };

        window.speechSynthesis.speak(utterance);
    }
  }, [isSpeechSynthesisSupported, speakingSegmentId, isUsingGoogleTTS]);


  const totalSteps = allLessonParts.length;
  const currentStep = currentSegmentIdx + 1;
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  useEffect(() => {
    const currentElement = document.getElementById(`segment-${allLessonParts[currentSegmentIdx]?.id}`);
    if (currentElement) {
      currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (window.speechSynthesis && window.speechSynthesis.speaking && speakingSegmentId !== allLessonParts[currentSegmentIdx]?.id) {
        window.speechSynthesis.cancel();
        setSpeakingSegmentId(null); 
        speechUtteranceRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegmentIdx]); 

  useEffect(() => {
    const calculateHeight = () => {
      if (mainContentRef.current) {
        const containerWidth = mainContentRef.current.offsetWidth;
        const playerWidth = Math.min(Math.max(containerWidth * 0.9, 320), 720); 
        setVideoPlayerHeight(String(Math.round((playerWidth * 9) / 16)));
      }
    };
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, []);


  const handleNextSegment = () => {
    setCompletedSegments(prev => new Set(prev).add(allLessonParts[currentSegmentIdx].id));
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    setSpeakingSegmentId(null);
    speechUtteranceRef.current = null;
    if (currentSegmentIdx < allLessonParts.length - 1) {
      setCurrentSegmentIdx(currentSegmentIdx + 1);
    }
  };

  const handlePrevSegment = () => {
    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
    setSpeakingSegmentId(null);
    speechUtteranceRef.current = null;
    if (currentSegmentIdx > 0) {
      setCurrentSegmentIdx(currentSegmentIdx - 1);
    }
  };

  const isLessonComplete = currentSegmentIdx === allLessonParts.length - 1 && completedSegments.has(allLessonParts[currentSegmentIdx].id);

  if (viewMode === 'player') {
    return <PlayerMode lessonPlan={lessonPlan} onExit={() => setViewMode('list')} />;
  }

  return (
    <div className="space-y-8 pb-16" ref={mainContentRef}>
      <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md py-4 z-10 rounded-b-lg shadow-lg">
        <div className="max-w-3xl mx-auto px-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-purple-300 truncate" title={lessonPlan.topic}>{lessonPlan.topic}</h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'list' ? 'player' : 'list')}
                        className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors"
                    >
                        {viewMode === 'list' ? '▶️ Player' : '📋 List'}
                    </button>
                    <button 
                        onClick={onReset}
                        className="flex items-center text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md transition-colors"
                        title="Go back to topic selection"
                        aria-label="Reset lesson and go back to topic selection"
                    >
                        {RefreshCwIcon} <span className="ml-2 hidden sm:inline">New Lesson</span>
                    </button>
                </div>
            </div>
            <div>
                <p className="text-sm text-slate-400 mb-1">Learning Progress ({currentStep}/{totalSteps})</p>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                        aria-valuenow={progressPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                        aria-label={`Lesson progress: ${Math.round(progressPercentage)}%`}
                    ></div>
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
            isSpeechSynthesisSupported={isSpeechSynthesisSupported}
            speakingSegmentId={speakingSegmentId}
            onToggleSpeech={handleToggleSpeech}
            videoFetchInfo={fetchedVideoInfo[segment.id]}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-10 text-center">
        {isLessonComplete ? (
          <div className="p-6 bg-green-700/30 border border-green-500 rounded-lg text-green-300">
            <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center">
              {CheckCircleIcon} <span className="ml-2">Lesson Complete!</span>
            </h3>
            <p>You've finished the lesson on "{lessonPlan.topic}". Great job!</p>
            <button
              onClick={onReset}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Start Another Lesson
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handlePrevSegment}
              disabled={currentSegmentIdx === 0}
              className="px-6 py-2.5 bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Previous Segment
            </button>
            <button
              onClick={handleNextSegment}
              disabled={currentSegmentIdx === allLessonParts.length - 1}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Next Segment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};