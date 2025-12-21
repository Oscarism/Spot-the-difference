<script lang="ts">
  import type { QuizItem } from '../data/content';
  
  let { item }: { item: QuizItem } = $props();
  let loaded = $state(false);
  let error = $state(false);
  let videoRef: HTMLVideoElement | null = $state(null);
  let isPlaying = $state(false);
  
  function togglePlay() {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      isPlaying = !isPlaying;
    }
  }
  
  function handleEnded() {
    isPlaying = false;
    if (videoRef) {
      videoRef.currentTime = 0;
    }
  }
</script>

<div class="video-card panel-cyber corner-decor">
  <div class="scan-line"></div>
  
  <div class="video-wrapper">
    {#if !loaded && !error}
      <div class="loading-state">
        <div class="analyzing-text font-display glow-cyan">LOADING STREAM...</div>
        <div class="loading-bar analyzing"></div>
      </div>
    {/if}
    
    {#if error}
      <div class="error-state">
        <span class="error-icon">⚠</span>
        <span class="hud-element">VIDEO STREAM UNAVAILABLE</span>
      </div>
    {:else}
      <!-- svelte-ignore a11y_media_has_caption -->
      <video 
        bind:this={videoRef}
        src={item.source} 
        class="quiz-video"
        class:visible={loaded}
        onloadeddata={() => loaded = true}
        onerror={() => error = true}
        onended={handleEnded}
        playsinline
        loop
      ></video>
      
      {#if loaded}
        <button class="play-overlay" onclick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          <div class="play-button" class:playing={isPlaying}>
            {#if isPlaying}
              <span class="pause-icon">❚❚</span>
            {:else}
              <span class="play-icon">▶</span>
            {/if}
          </div>
        </button>
      {/if}
    {/if}
    
    <!-- Video HUD overlay -->
    {#if loaded && !error}
      <div class="video-hud">
        <span class="rec-indicator" class:active={isPlaying}>
          <span class="rec-dot"></span>
          {isPlaying ? 'LIVE' : 'PAUSED'}
        </span>
      </div>
    {/if}
  </div>
  
  <div class="video-meta">
    <span class="hud-element">
      <span class="type-indicator">◈</span>
      VIDEO ANALYSIS
    </span>
    <span class="hud-element status" class:playing={isPlaying}>
      {isPlaying ? 'STREAMING' : 'STANDBY'}
    </span>
  </div>
</div>

<style>
  .video-card {
    position: relative;
    padding: 1.5rem;
    overflow: hidden;
  }
  
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--magenta-glow), transparent);
    animation: scan 2s linear infinite;
    opacity: 0.5;
  }
  
  @keyframes scan {
    0% { top: 0; }
    100% { top: 100%; }
  }
  
  .video-wrapper {
    position: relative;
    aspect-ratio: 16/9;
    background: var(--bg-secondary);
    border: 1px solid rgba(255, 0, 255, 0.2);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .quiz-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .quiz-video.visible {
    opacity: 1;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
  }
  
  .analyzing-text {
    font-size: 1rem;
    letter-spacing: 4px;
    animation: flicker 2s infinite;
  }
  
  .loading-bar {
    width: 200px;
    height: 4px;
    border: 1px solid var(--magenta-dim);
  }
  
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--red-glow);
  }
  
  .error-icon {
    font-size: 2rem;
  }
  
  .play-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .play-overlay:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  
  .play-button {
    width: 80px;
    height: 80px;
    border: 3px solid var(--magenta-glow);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
  }
  
  .play-button:hover {
    transform: scale(1.1);
    box-shadow: 0 0 40px rgba(255, 0, 255, 0.5);
  }
  
  .play-button.playing {
    opacity: 0;
  }
  
  .play-overlay:hover .play-button.playing {
    opacity: 1;
  }
  
  .play-icon, .pause-icon {
    color: var(--magenta-glow);
    font-size: 1.5rem;
    margin-left: 4px;
  }
  
  .pause-icon {
    margin-left: 0;
    letter-spacing: 4px;
  }
  
  .video-hud {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  
  .rec-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 0.25rem 0.75rem;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .rec-indicator.active {
    color: var(--red-glow);
    border-color: var(--red-glow);
  }
  
  .rec-dot {
    width: 8px;
    height: 8px;
    background: var(--text-secondary);
    border-radius: 50%;
  }
  
  .rec-indicator.active .rec-dot {
    background: var(--red-glow);
    animation: blink 1s ease-in-out infinite;
    box-shadow: 0 0 8px var(--red-glow);
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  
  .video-meta {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 0, 255, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .type-indicator {
    color: var(--magenta-glow);
    margin-right: 0.5rem;
  }
  
  .status {
    transition: color 0.3s ease;
  }
  
  .status.playing {
    color: var(--green-glow);
  }
  
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
</style>
