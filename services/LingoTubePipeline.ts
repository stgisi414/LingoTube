// src/services/LingoTubePipeline.ts

// This file contains your proven, working logic.
// We will export the main LearningPipeline class to be used in React.

// Note: This code will need access to UI elements and will manipulate the DOM directly.

export class LearningPipeline {
    constructor() { this.gemini = new GeminiOrchestrator(); this.videoSourcer = new VideoSourcer(); this.speechEngine = new SpeechEngine(); this.youtubePlayer = null;      this.concludingNarrationText = null; }

    async start(topic) {
        log("FLOW: Step 1 - Generate lesson plan");
        showLoading("Generating comprehensive lesson plan...");
        const rawPlan = await this.gemini.generateLessonPlan(topic);
        hideLoading();
        currentLessonPlan = rawPlan;
        if (currentLessonPlan && currentLessonPlan.Apprentice) {
            currentLessonPlan.topic = topic;
            displayLevelSelection();
        } else {
            displayError("Failed to generate a valid lesson plan. Please try a different topic.");
            ui.curateButton.disabled = false;
        }
    }

    startLevel(level) {
        log("FLOW: Starting level", level);
        currentLearningPath = level;
        currentSegmentIndex = -1;
        ui.levelSelection.classList.add('hidden');
        ui.lessonProgressContainer.classList.remove('hidden');
        ui.learningCanvasContainer.classList.remove('hidden');

        // Completely remove all potential spacing elements
        document.getElementById('progress-spacer').classList.add('hidden');
        ui.inputSection.classList.add('hidden');
        ui.loadingIndicator.classList.add('hidden');

        // Force compact header layout
        document.querySelector('header').style.marginBottom = '0.5rem';
        document.querySelector('header').style.paddingBottom = '0.25rem';

        this.processNextLearningPoint();
    }

    async processNextLearningPoint() {
        currentSegmentIndex++;
        const learningPoints = currentLessonPlan[currentLearningPath];
        if (currentSegmentIndex >= learningPoints.length) {
            this.showLessonSummary();
            return;
        }
        const learningPoint = learningPoints[currentSegmentIndex];
        const previousPoint = currentSegmentIndex > 0 ? learningPoints[currentSegmentIndex - 1] : null;
        updateSegmentProgress();
        ui.currentTopicDisplay.textContent = learningPoint;
        await this.playNarration(learningPoint, previousPoint, () => this.searchVideos(learningPoint));
    }

    async playNarration(learningPoint, previousPoint, onComplete) {
        log("FLOW: Play intro narration");
        updateStatus('narrating');
        updatePlayPauseIcon();
        ui.nextSegmentButton.disabled = true;

        try {
            const narrationText = await this.gemini.generateNarration(learningPoint, previousPoint);
            if (!narrationText) {
                log("NARRATION: No text generated, skipping to next step");
                onComplete();
                return;
            }

            // Force show teleprompter and display text
            showTextDisplay();
            displayTextContent(narrationText);
            log("NARRATION: Text displayed on teleprompter");

            // Create a promise that resolves only when speech completes
            await new Promise((resolve) => {
                let speechCompleted = false;

                // Set up a timeout as safety net
                const timeoutId = setTimeout(() => {
                    if (!speechCompleted) {
                        speechCompleted = true;
                        log("NARRATION: Timeout reached, forcing completion");
                        this.speechEngine.stop();
                        resolve();
                    }
                }, 15000); // 15 second timeout

                this.speechEngine.play(narrationText, {
                    onProgress: (progress) => {
                        if (lessonState === 'narrating') {
                            animateTextProgress(narrationText, progress);
                        }
                    },
                    onComplete: () => {
                        if (!speechCompleted && lessonState === 'narrating') {
                            speechCompleted = true;
                            clearTimeout(timeoutId);
                            log("NARRATION: Speech completed successfully");
                            resolve();
                        }
                    }
                });
            });

            // Only proceed if still in narrating state
            if (lessonState === 'narrating') {
                onComplete();
            }
        } catch (error) {
            logError("NARRATION: Error during playback", error);
            onComplete();
        }
    }

    async playConcludingNarration(learningPoint) {
        log("FLOW: Play concluding narration");
        updateStatus('narrating');
        updatePlayPauseIcon();
        ui.nextSegmentButton.disabled = true;

        try {
            const narrationText = await this.gemini.generateConcludingNarration(learningPoint);
            if (!narrationText) {
                log("CONCLUDING NARRATION: No text generated, skipping to next step");
                return;
            }

            // Ensure text display is visible and force display the content
            showTextDisplay();
            displayTextContent(narrationText);
            log("CONCLUDING NARRATION: Text content displayed on teleprompter");

            // Create a promise that resolves only when speech completes
            await new Promise((resolve) => {
                let speechCompleted = false;

                // Set up a timeout as safety net
                const timeoutId = setTimeout(() => {
                    if (!speechCompleted) {
                        speechCompleted = true;
                        log("CONCLUDING NARRATION: Timeout reached, forcing completion");
                        this.speechEngine.stop();
                        resolve();
                    }
                }, 20000); // Increased timeout for concluding narration

                this.speechEngine.play(narrationText, {
                    onProgress: (progress) => {
                        if (lessonState === 'narrating') {
                            animateTextProgress(narrationText, progress);
                            log(`CONCLUDING NARRATION: Progress ${(progress * 100).toFixed(1)}%`);
                        }
                    },
                    onComplete: () => {
                        if (!speechCompleted && lessonState === 'narrating') {
                            speechCompleted = true;
                            clearTimeout(timeoutId);
                            log("CONCLUDING NARRATION: Speech completed successfully");
                            resolve();
                        }
                    }
                });
            });

            // Only proceed if still in narrating state
            if (lessonState === 'narrating') {
                log("CONCLUDING NARRATION: Completed successfully");
            }
        } catch (error) {
            logError("CONCLUDING NARRATION: Error during playback", error);
        }
    }

    async searchVideos(learningPoint) {
        log("FLOW: Step 2 - Search educational videos");
        updateStatus('searching_videos');
        displayStatusMessage('🔎 Finding educational content...', `Searching for: "${learningPoint}"`);
        try {
            const searchQueries = await this.gemini.generateSearchQueries(learningPoint);
            if (!searchQueries || !Array.isArray(searchQueries) || searchQueries.length === 0) {
                throw new Error("Failed to generate search queries.");
            }
            log(`Generated search queries:`, searchQueries);
            let allVideos = [];
            for (const query of searchQueries.slice(0, 2)) {
                displayStatusMessage('🔎 Searching educational videos...', `Query: "${query}"`);
                const results = await this.videoSourcer.searchYouTube(query);
                allVideos.push(...results);
                if (allVideos.length >= 15) break; // Get more videos for filtering
            }
            log(`Total videos found: ${allVideos.length}`);
            if (allVideos.length === 0) {
                await this.createFallbackContent(learningPoint);
                return;
            }

            // Step 2.5: Filter videos for relevance (with transcript analysis)
            displayStatusMessage('🎯 Filtering relevant content...', `Checking relevance to: "${learningPoint}"`);
            const uniqueVideos = [...new Map(allVideos.map(v => [v.youtubeId, v])).values()]
                .sort((a, b) => b.educationalScore - a.educationalScore);

            const relevantVideos = [];
            const mainTopic = currentLessonPlan.topic || learningPoint;

            // Check up to 8 top videos for relevance (reduced since transcript analysis is more thorough)
            for (const video of uniqueVideos.slice(0, 8)) {
                displayStatusMessage('🎯 Analyzing video content...', `Checking: "${video.title}"`);

                // Fetch transcript for more accurate relevance checking
                const transcript = await this.videoSourcer.getVideoTranscript(video.youtubeId);

                const relevanceCheck = await this.gemini.checkVideoRelevance(
                    video.title, 
                    learningPoint, 
                    mainTopic, 
                    transcript
                );

                if (relevanceCheck.relevant) {
                    // Apply confidence-based scoring (higher boost for transcript-based analysis)
                    const confidenceBoost = transcript 
                        ? (relevanceCheck.confidence || 5) / 1.5  // Higher boost with transcript
                        : (relevanceCheck.confidence || 5) / 2;   // Lower boost without transcript

                    video.educationalScore += confidenceBoost;
                    video.relevanceConfidence = relevanceCheck.confidence || 5;
                    video.hasTranscript = !!transcript;
                    if (transcript) {
                        video.transcript = transcript;
                    }
                    relevantVideos.push(video);

                    const transcriptNote = transcript ? " (with transcript)" : " (title only)";
                    log(`RELEVANT VIDEO: "${video.title}" (Confidence: ${relevanceCheck.confidence || 'N/A'})${transcriptNote} - ${relevanceCheck.reason}`);
                } else {
                    const transcriptNote = transcript ? " (analyzed transcript)" : " (title only)";
                    log(`FILTERED OUT: "${video.title}"${transcriptNote} - ${relevanceCheck.reason}`);
                }

                // Stop when we have enough HIGH-CONFIDENCE relevant videos
                if (relevantVideos.length >= 5) break;
            }

            // Further filter by confidence if we have multiple options
            if (relevantVideos.length > 3) {
                relevantVideos.sort((a, b) => {
                    const confidenceDiff = (b.relevanceConfidence || 5) - (a.relevanceConfidence || 5);
                    if (Math.abs(confidenceDiff) > 2) return confidenceDiff;
                    return b.educationalScore - a.educationalScore;
                });
                relevantVideos.splice(4); // Keep only top 4 most relevant
            }

            log(`Relevant videos after filtering: ${relevantVideos.length}`);

            // If no relevant videos found, fall back to original top videos with warning
            if (relevantVideos.length === 0) {
                log("WARNING: No relevant videos found, using top search results as fallback");
                currentVideoChoices = uniqueVideos.slice(0, 3);
            } else {
                relevantVideos.sort((a, b) => b.educationalScore - a.educationalScore);
                currentVideoChoices = relevantVideos;
            }

            if (currentVideoChoices.length === 0) {
                await this.createFallbackContent(learningPoint);
                return;
            }

            log(`FLOW: Found ${currentVideoChoices.length} relevant videos for "${learningPoint}"`);
            this.autoSelectBestVideo(learningPoint);
        } catch (error) {
            logError('Video search failed:', error);
            await this.createFallbackContent(learningPoint);
        }
    }

    async autoSelectBestVideo(learningPoint) {
        log("FLOW: Step 4 - Auto-selecting best video with final validation");
        updateStatus('choosing_video');

        // Get the top candidate
        let bestVideo = currentVideoChoices[0];

        // Double-check the selected video with an even stricter prompt
        const finalCheck = await this.gemini.checkVideoRelevance(bestVideo.title, learningPoint, currentLessonPlan.topic);

        // If the best video fails the final check, try the next one
        if (!finalCheck.relevant && currentVideoChoices.length > 1) {
            log(`FINAL CHECK: Best video "${bestVideo.title}" failed final relevance check. Trying next option.`);
            bestVideo = currentVideoChoices[1];
            const secondCheck = await this.gemini.checkVideoRelevance(bestVideo.title, learningPoint, currentLessonPlan.topic);
            if (!secondCheck.relevant && currentVideoChoices.length > 2) {
                bestVideo = currentVideoChoices[2];
                log(`FINAL CHECK: Trying third option: "${bestVideo.title}"`);
            }
        }

        log(`FLOW: Final selected video: ${bestVideo.title} (ID: ${bestVideo.youtubeId})`);
        displayStatusMessage('✅ Video selected!', `"${bestVideo.title}"`);
        setTimeout(() => this.generateSegments(bestVideo), 1500);
    }

    async createFallbackContent(learningPoint) {
        log("FLOW: Step 4B - Creating fallback content");
        updateStatus('generating_segments');
        displayStatusMessage('🤖 Creating custom content...', 'No suitable videos found. Generating text explanation...');
        const explanation = await this.gemini.generateDetailedExplanation(learningPoint);
        if (explanation) {
            displayStatusMessage('📚 Learning segment', `Topic: "${learningPoint}"`);
            displayTextContent(explanation);
            await this.speechEngine.play(explanation, {
                onProgress: (progress) => animateTextProgress(explanation, progress),
                onComplete: () => { if (lessonState === 'generating_segments') this.showQuiz(); }
            });
        } else {
            displayStatusMessage('⏭️ Skipping segment', 'Could not generate content. Moving on...');
            setTimeout(() => this.processNextLearningPoint(), 2000);
        }
    }

    async generateSegments(video) {
        log("FLOW: Step 7 - Generate segments");
        updateStatus('generating_segments');
        displayStatusMessage('✂️ Finding best segments...', `Analyzing: "${video.title}"`);
        try {
            const learningPoint = currentLessonPlan[currentLearningPath][currentSegmentIndex];
            const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

            // Use transcript if available from relevance checking
            const transcript = video.transcript || null;
            const transcriptNote = transcript ? " (with transcript data)" : " (title-based)";
            displayStatusMessage('✂️ Finding best segments...', `Analyzing: "${video.title}"${transcriptNote}`);

            currentSegments = await this.gemini.findVideoSegments(video.title, youtubeUrl, learningPoint, transcript);
            if (!currentSegments || currentSegments.length === 0) {
                currentSegments = [{ startTime: 30, endTime: 180, reason: "Default educational segment" }];
            }
            log(`Generated ${currentSegments.length} segments:`, currentSegments);
            currentSegmentPlayIndex = 0;
            this.playSegments(video);
        } catch (error) {
            logError('Failed to generate segments:', error);
            currentSegments = [{ startTime: 30, endTime: 180, reason: "Fallback segment due to error" }];
            this.playSegments(video);
        }
    }

    playSegments(video) {
        log("FLOW: Step 8 - Play segments");
        updateStatus('playing_video');
        updatePlayPauseIcon();
        this.createYouTubePlayer(video);
    }

    createYouTubePlayer(videoInfo) {
        if (this.youtubePlayer) { try { this.youtubePlayer.destroy(); } catch (e) {} this.youtubePlayer = null; }

        // Hide text display and show video player area
        hideTextDisplay();
        ui.skipVideoButton.style.display = 'block';

        log(`Creating player for video: ${videoInfo.youtubeId}`);
        if (!videoInfo || !videoInfo.youtubeId || videoInfo.youtubeId.length !== 11) {
            logError('Invalid video info provided to player:', videoInfo);
            this.handleVideoError();
            return;
        }
        if (!currentSegments || currentSegments.length === 0) {
            currentSegments = [{ startTime: 30, endTime: 180, reason: "Default segment" }];
        }
        currentSegmentPlayIndex = 0;
        this.currentVideoInfo = videoInfo;
        this.playCurrentSegment();
    }

    playCurrentSegment() {
        if (currentSegmentPlayIndex >= currentSegments.length) {
            log('FLOW: All segments complete');
            this.handleVideoEnd();
            return;
        }
        const segment = currentSegments[currentSegmentPlayIndex];
        log(`Playing segment ${currentSegmentPlayIndex + 1}/${currentSegments.length}: ${segment.startTime}s - ${segment.endTime}s`);

        if (this.youtubePlayer) { try { this.youtubePlayer.destroy(); } catch (e) {} }
        if (this.segmentTimer) clearInterval(this.segmentTimer);

        const playerDivId = 'youtube-player-' + Date.now();
        ui.youtubePlayerContainer.innerHTML = `<div id="${playerDivId}" class="w-full h-full"></div>`;

        let startTime = Math.max(0, segment.startTime || 30);
        this.currentSegmentEndTime = segment.endTime || (startTime + 120);

        const playerTimeout = setTimeout(() => { logError('Video loading timeout'); this.tryNextSegmentOrQuiz(); }, 12000);

        try {
            this.youtubePlayer = new YT.Player(playerDivId, {
                height: '100%', width: '100%', videoId: this.currentVideoInfo.youtubeId,
                playerVars: { autoplay: 1, controls: 1, rel: 0, start: startTime, modestbranding: 1, iv_load_policy: 3, enablejsapi: 1, origin: window.location.origin, fs: 0 },
                events: {
                    'onReady': (event) => {
                        clearTimeout(playerTimeout);
                        log('YouTube player ready.');
                        event.target.playVideo();
                        this.startSegmentTimer();
                    },
                    'onStateChange': (event) => {
                        if (event.data === YT.PlayerState.PLAYING) { clearTimeout(playerTimeout); updateStatus('playing_video'); }
                        if (event.data === YT.PlayerState.PAUSED) updateStatus('paused');
                        if (event.data === YT.PlayerState.ENDED) this.endCurrentSegment();
                    },
                    'onError': (event) => {
                        clearTimeout(playerTimeout);
                        logError(`Youtube player error: ${event.data}`);
                        this.tryNextSegmentOrQuiz();
                    }
                }
            });
        } catch (error) {
            clearTimeout(playerTimeout);
            logError('Failed to create YouTube player:', error);
            this.tryNextSegmentOrQuiz();
        }
    }

    startSegmentTimer() {
        if (this.segmentTimer) clearInterval(this.segmentTimer);
        this.segmentTimer = setInterval(() => {
            if (this.youtubePlayer && typeof this.youtubePlayer.getCurrentTime === 'function') {
                const currentTime = this.youtubePlayer.getCurrentTime();
                if (currentTime >= this.currentSegmentEndTime) {
                    log(`Segment timer ended segment.`);
                    this.endCurrentSegment();
                }
            }
        }, 1000);
    }

    endCurrentSegment() {
        if (this.segmentTimer) clearInterval(this.segmentTimer);
        this.segmentTimer = null;
        log('Ending current segment');
        currentSegmentPlayIndex++;
        setTimeout(() => this.playCurrentSegment(), 500);
    }

    tryNextSegmentOrQuiz() {
        if (this.segmentTimer) clearInterval(this.segmentTimer);
        currentSegmentPlayIndex++;
        if (currentSegmentPlayIndex >= currentSegments.length) {
            this.handleVideoEnd();
        } else {
            log('Trying next segment after error/timeout');
            setTimeout(() => this.playCurrentSegment(), 1000);
        }
    }

    async handleVideoEnd() {
        log('Video playbook finished');
        ui.skipVideoButton.style.display = 'none';

        // Cleanup video player first
        if (this.youtubePlayer) { try { this.youtubePlayer.destroy(); } catch(e){} this.youtubePlayer = null; }
        ui.youtubePlayerContainer.innerHTML = '';

        // Force show text display for concluding narration
        showTextDisplay();

        const learningPoint = currentLessonPlan[currentLearningPath][currentSegmentIndex];

        // Show the teleprompter with concluding narration
        log('FLOW: Starting concluding narration sequence for:', learningPoint);
        console.log('DEBUG: Pre-narration state check:', {
            learningPoint,
            lessonState,
            speechEngineState: {
                isPlaying: this.speechEngine.isPlaying,
                isPaused: this.speechEngine.isPaused
            }
        });

        // Show initial text while generating narration
        displayStatusMessage('🎯 Wrapping up...', `Summarizing: "${learningPoint}"`);

        // Wait for concluding narration to complete before showing quiz
        await this.playConcludingNarration(learningPoint);

        console.log('DEBUG: Post-narration state check:', {
            lessonState,
            speechEngineState: {
                isPlaying: this.speechEngine.isPlaying,
                isPaused: this.speechEngine.isPaused
            }
        });

        this.showQuiz();
    }

    handleVideoError() {
        logError('Handling video error. Creating fallback content.');
        ui.skipVideoButton.style.display = 'none';
        // Show text display for fallback content
        showTextDisplay();
        if (this.youtubePlayer) { try { this.youtubePlayer.destroy(); } catch(e){} }
        ui.youtubePlayerContainer.innerHTML = '';
        const learningPoint = currentLessonPlan[currentLearningPath][currentSegmentIndex];
        displayStatusMessage('🎥 Video unavailable', 'Creating educational content instead...');
        setTimeout(async () => { await this.createFallbackContent(learningPoint); }, 1000);
    }

    async showQuiz() {
        log("FLOW: Step 9 - Show quiz");
        updateStatus('quiz');
        ui.lessonControls.style.display = 'none';

        // Hide text display for quiz
        hideTextDisplay();

        const learningPoint = currentLessonPlan[currentLearningPath][currentSegmentIndex];
        const quiz = await this.gemini.generateQuiz(learningPoint);

        if (quiz && quiz.question) {
            this.displayQuiz(quiz);
        } else {
            logError("Failed to generate quiz. Skipping.");
            this.processNextLearningPoint();
        }
    }

    displayQuiz(quiz) {
        ui.youtubePlayerContainer.innerHTML = `
            <div class="p-6 md:p-8 text-white h-full flex flex-col justify-start">
                <div class="flex-grow flex flex-col justify-center max-w-3xl mx-auto w-full">
                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
                        <p class="text-xl lg:text-2xl leading-relaxed">${quiz.question}</p>
                    </div>
                    <div class="space-y-4 mb-6">
                        ${quiz.options.map((option, index) => `<button class="quiz-option w-full text-left p-4 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all" data-index="${index}"><span>${String.fromCharCode(65 + index)})</span> <span class="ml-3">${option}</span></button>`).join('')}
                    </div>
                    <div id="quiz-result" class="hidden opacity-0 transition-opacity duration-500">
                        <div id="quiz-explanation-container" class="border rounded-xl p-4 mb-4"><p id="quiz-explanation"></p></div>
                        <div class="text-center"><button id="continue-button" class="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold">Continue →</button></div>
                    </div>
                </div>
            </div>`;

        ui.youtubePlayerContainer.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                const selectedIndex = parseInt(option.dataset.index);
                const isCorrect = selectedIndex === quiz.correct;
                ui.youtubePlayerContainer.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.disabled = true;
                    opt.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                    if (parseInt(opt.dataset.index) === quiz.correct) opt.classList.add('bg-green-700');
                });
                if (!isCorrect) option.classList.add('bg-red-700');

                const resultDiv = document.getElementById('quiz-result');
                const explanationDiv = document.getElementById('quiz-explanation-container');
                document.getElementById('quiz-explanation').textContent = quiz.explanation;
                explanationDiv.className = `border rounded-xl p-4 mb-4 ${isCorrect ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}`;
                resultDiv.classList.remove('hidden');
                setTimeout(() => resultDiv.classList.remove('opacity-0'), 10);

                document.getElementById('continue-button').addEventListener('click', () => {
                    ui.lessonControls.style.display = 'flex';
                    this.processNextLearningPoint();
                });
            });
        });
    }

    async showLessonSummary() {
        log("FLOW: Step 10 - Show lesson summary");
        updateStatus('summary');
        ui.lessonControls.style.display = 'none';
        // Hide text display for summary
        hideTextDisplay();

        const topic = currentLessonPlan.topic;
        const learningPoints = currentLessonPlan[currentLearningPath];

        const summary = await this.gemini.generateLessonSummary(topic, learningPoints);

        ui.youtubePlayerContainer.innerHTML = `
            <div class="p-8 text-white h-full flex flex-col justify-center items-center" style="background: linear-gradient(135deg, #16213e 0%, #0f172a 100%);">
                <h2 class="text-4xl font-bold mb-4 text-purple-300">Congratulations!</h2>
                <p class="text-xl mb-8">You've completed the ${currentLearningPath} level for "${topic}".</p>
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20 max-w-2xl w-full text-left">
                     <h3 class="text-2xl font-semibold mb-4 text-blue-300">Key Takeaways</h3>
                     <div id="summary-content" class="prose prose-invert max-w-none">${summary.replace(/•/g, '<li class="ml-4">')}</div>
                </div>
                <button id="finish-lesson-button" class="bg-purple-600 hover:bg-purple-700 px-10 py-4 rounded-xl font-semibold text-lg transition-transform transform hover:scale-105">Finish Lesson & Start Over</button>
            </div>`;

        document.getElementById('finish-lesson-button').addEventListener('click', resetUIState);
    }
}