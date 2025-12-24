<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { gameStore, currentPair, progress, submitScore } from '$lib/stores/game';
  
  let game = $derived($gameStore);
  let pair = $derived($currentPair);
  let prog = $derived($progress);
  
  // iOS detection
  let isIOS = $state(false);
  
  // Refs for iframes (for replay)
  let leftVideoRef: HTMLIFrameElement | HTMLVideoElement | null = $state(null);
  let rightVideoRef: HTMLIFrameElement | HTMLVideoElement | null = $state(null);
  
  // Redirect if no age group selected
  onMount(() => {
    if (!game.ageGroup) {
      goto('/age');
    }
    
    // Detect iOS
    if (browser) {
      isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    }
  });
  
  // Handle quiz completion
  $effect(() => {
    if (game.isComplete) {
      submitScore();
      goto('/results');
    }
  });
  
  function handleSelect(side: 'left' | 'right') {
    gameStore.selectOption(side);
  }
  
  function handleSubmit() {
    if (game.selectedSide) {
      gameStore.submitAnswer();
    }
  }
  
  // Replay left video (reload iframe src to restart)
  function replayLeftVideo(youtubeId: string | undefined) {
    if (leftVideoRef && leftVideoRef instanceof HTMLIFrameElement && youtubeId) {
      const currentSrc = leftVideoRef.src;
      leftVideoRef.src = '';
      setTimeout(() => {
        if (leftVideoRef instanceof HTMLIFrameElement) {
          leftVideoRef.src = currentSrc;
        }
      }, 100);
    }
  }
  
  // Replay right video (reload iframe src to restart)
  function replayRightVideo(youtubeId: string | undefined) {
    if (rightVideoRef && rightVideoRef instanceof HTMLIFrameElement && youtubeId) {
      const currentSrc = rightVideoRef.src;
      rightVideoRef.src = '';
      setTimeout(() => {
        if (rightVideoRef instanceof HTMLIFrameElement) {
          rightVideoRef.src = currentSrc;
        }
      }, 100);
    }
  }
</script>

<svelte:head>
  <title>Pick the Real One | Spot the Difference</title>
  <meta name="description" content="Can you tell which image is real and which is AI-generated?" />
</svelte:head>

<div class="quiz-page page-enter">
  <div class="container">
    <div class="card">
      <!-- Header -->
      <header class="quiz-header">
        <a href="/" class="back-link">← Back</a>
        
        <!-- Progress Bar -->
        <div class="progress-bar">
          {#each Array(prog.total) as _, i}
            <div 
              class="progress-segment" 
              class:completed={i < prog.current - 1}
              class:current={i === prog.current - 1}
            ></div>
          {/each}
        </div>
        
        <div class="round-info">
          <span class="round-label">Round</span>
          <span class="round-number">{prog.current}/{prog.total}</span>
        </div>
      </header>
      
      <!-- Main Content -->
      {#if pair}
        <div class="content-area">
          <!-- Question -->
          <h2 class="question">Pick the real one</h2>
          
          <!-- Content Type -->
          <div class="type-badge">
            {#if pair.pair.type === 'image'}
              IMAGE
            {:else if pair.pair.type === 'video'}
              VIDEO
            {:else}
              QUOTE
            {/if}
          </div>
          
          <!-- Side by Side Comparison -->
          <div class="comparison-grid" class:portrait={pair.pair.aspectRatio === '3/4' || pair.pair.aspectRatio === '9/16'}>
            <!-- Left Option -->
            <div class="media-container">
              <button 
                class="media-option"
                class:selected={game.selectedSide === 'left'}
                class:portrait={pair.pair.aspectRatio === '3/4' || pair.pair.aspectRatio === '9/16'}
                class:landscape={pair.pair.aspectRatio === '16/9' || pair.pair.aspectRatio === '4/3'}
                onclick={() => handleSelect('left')}
                type="button"
                style={pair.pair.aspectRatio ? `aspect-ratio: ${pair.pair.aspectRatio}` : ''}
              >
                {#if pair.pair.type === 'image'}
                  <img src={pair.left.source} alt="Option 1" />
                {:else if pair.pair.type === 'video'}
                  {#if isIOS && pair.left.youtubeId}
                    <!-- YouTube embed for iOS -->
                    <iframe
                      bind:this={leftVideoRef}
                      src="https://www.youtube.com/embed/{pair.left.youtubeId}?autoplay=1&mute=1&loop=1&playlist={pair.left.youtubeId}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1"
                      title="Video 1"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      class="youtube-embed"
                    ></iframe>
                  {:else}
                    <video 
                      bind:this={leftVideoRef}
                      src={pair.left.source} 
                      muted 
                      loop
                      autoplay
                      playsinline
                    >
                      <track kind="captions" />
                    </video>
                  {/if}
                {:else}
                  <div class="quote-content">
                    <p class="quote-text">"{pair.left.source}"</p>
                    {#if pair.left.author}
                      <p class="quote-author">— {pair.left.author}</p>
                    {/if}
                  </div>
                {/if}
              </button>
              
              <!-- iOS Replay Button - Outside the video frame -->
              {#if isIOS && pair.pair.type === 'video' && pair.left.youtubeId}
                <button 
                  class="ios-play-btn"
                  onclick={() => replayLeftVideo(pair.left.youtubeId)}
                  type="button"
                  aria-label="Replay Video 1"
                >
                  <span class="ios-play-icon">🔄</span>
                  <span class="ios-play-label">Replay Video 1</span>
                </button>
              {/if}
            </div>
            
            <!-- Right Option -->
            <div class="media-container">
              <button 
                class="media-option"
                class:selected={game.selectedSide === 'right'}
                class:portrait={pair.pair.aspectRatio === '3/4' || pair.pair.aspectRatio === '9/16'}
                class:landscape={pair.pair.aspectRatio === '16/9' || pair.pair.aspectRatio === '4/3'}
                onclick={() => handleSelect('right')}
                type="button"
                style={pair.pair.aspectRatio ? `aspect-ratio: ${pair.pair.aspectRatio}` : ''}
              >
                {#if pair.pair.type === 'image'}
                  <img src={pair.right.source} alt="Option 2" />
                {:else if pair.pair.type === 'video'}
                  {#if isIOS && pair.right.youtubeId}
                    <!-- YouTube embed for iOS -->
                    <iframe
                      bind:this={rightVideoRef}
                      src="https://www.youtube.com/embed/{pair.right.youtubeId}?autoplay=1&mute=1&loop=1&playlist={pair.right.youtubeId}&controls=0&modestbranding=1&rel=0&showinfo=0&playsinline=1"
                      title="Video 2"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      class="youtube-embed"
                    ></iframe>
                  {:else}
                    <video 
                      bind:this={rightVideoRef}
                      src={pair.right.source} 
                      muted 
                      loop
                      autoplay
                      playsinline
                    >
                      <track kind="captions" />
                    </video>
                  {/if}
                {:else}
                  <div class="quote-content">
                    <p class="quote-text">"{pair.right.source}"</p>
                    {#if pair.right.author}
                      <p class="quote-author">— {pair.right.author}</p>
                    {/if}
                  </div>
                {/if}
              </button>
              
              <!-- iOS Replay Button - Outside the video frame -->
              {#if isIOS && pair.pair.type === 'video' && pair.right.youtubeId}
                <button 
                  class="ios-play-btn"
                  onclick={() => replayRightVideo(pair.right.youtubeId)}
                  type="button"
                  aria-label="Replay Video 2"
                >
                  <span class="ios-play-icon">🔄</span>
                  <span class="ios-play-label">Replay Video 2</span>
                </button>
              {/if}
            </div>
          </div>
          
          <!-- Submit Button - Primary action is accent -->
          <div class="submit-section">
            <button 
              class="btn btn-pill btn-accent"
              onclick={handleSubmit}
              disabled={!game.selectedSide}
            >
              Submit answer
            </button>
          </div>
        </div>
      {:else}
        <div class="loading-state">
          <p>Loading...</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .quiz-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .container {
    width: 100%;
    max-width: 900px;
  }
  
  .card {
    background: var(--bg-card);
    border-radius: 24px;
    padding: 2rem;
  }
  
  /* Header */
  .quiz-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .back-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;
    flex-shrink: 0;
  }
  
  .back-link:hover {
    color: var(--text-primary);
  }
  
  .progress-bar {
    flex: 1;
    display: flex;
    gap: 3px;
  }
  
  .progress-segment {
    flex: 1;
    height: 4px;
    background: #2a2a2a;
    border-radius: 2px;
  }
  
  .progress-segment.completed {
    background: var(--text-primary);
  }
  
  .progress-segment.current {
    background: var(--text-secondary);
  }
  
  .round-info {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-shrink: 0;
  }
  
  .round-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
  }
  
  .round-number {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  /* Content Area */
  .content-area {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .question {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
    text-align: center;
  }
  
  .type-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 2rem;
  }
  
  /* Comparison Grid */
  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
    margin-bottom: 2rem;
  }
  
  .comparison-grid.portrait {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .media-option {
    position: relative;
    background: #111;
    border: 4px solid transparent;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s ease;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .media-option:hover {
    border-color: var(--accent);
  }
  
  .media-option.selected {
    border-color: var(--accent);
  }
  
  .media-option img,
  .media-option video,
  .media-option .youtube-embed {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    border: none;
    pointer-events: none; /* Prevent iframe from blocking clicks on parent button */
  }
  
  .quote-content {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    background: var(--bg-card-secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  .quote-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.125rem;
    font-style: italic;
    line-height: 1.7;
    color: var(--text-primary);
    margin: 0;
    text-align: center;
  }
  
  .quote-author {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--accent);
    margin: 0;
  }
  
  /* Media Container - wraps video + iOS play button */
  .media-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  /* iOS Play Button - Outside video frame */
  .ios-play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, var(--accent), #6366f1);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  }
  
  .ios-play-btn:hover,
  .ios-play-btn:active {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }
  
  .ios-play-icon {
    font-size: 1rem;
    color: white;
  }
  
  .ios-play-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  /* Submit Section */
  .submit-section {
    text-align: center;
  }
  
  /* Loading State */
  .loading-state {
    text-align: center;
    padding: 4rem;
    color: var(--text-secondary);
    font-size: 1.125rem;
  }
  
  /* Responsive */
  @media (max-width: 640px) {
    .quiz-page {
      padding: 1.25rem;
      align-items: flex-start;
    }
    
    .card {
      padding: 1.5rem;
    }
    
    .quiz-header {
      flex-wrap: wrap;
    }
    
    .progress-bar {
      order: 3;
      width: 100%;
      margin-top: 1rem;
    }
    
    .comparison-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    
    .question {
      font-size: 1.625rem;
    }
    
    .quote-text {
      font-size: 1rem;
    }
    
    .submit-section .btn {
      width: 100%;
    }
  }
</style>
