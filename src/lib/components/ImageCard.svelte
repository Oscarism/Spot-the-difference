<script lang="ts">
  import type { QuizItem } from '../data/content';
  
  let { item }: { item: QuizItem } = $props();
  let loaded = $state(false);
  let error = $state(false);
</script>

<div class="image-card panel-cyber corner-decor">
  <div class="scan-line"></div>
  
  <div class="image-wrapper">
    {#if !loaded && !error}
      <div class="loading-state">
        <div class="analyzing-text font-display glow-cyan">ANALYZING...</div>
        <div class="loading-bar analyzing"></div>
      </div>
    {/if}
    
    {#if error}
      <div class="error-state">
        <span class="error-icon">⚠</span>
        <span class="hud-element">IMAGE DATA CORRUPTED</span>
      </div>
    {:else}
      <img 
        src={item.source} 
        alt={item.title || 'Quiz image'} 
        class="quiz-image"
        class:visible={loaded}
        onload={() => loaded = true}
        onerror={() => error = true}
      />
    {/if}
  </div>
  
  <div class="image-meta">
    <span class="hud-element">
      <span class="type-indicator">◈</span>
      IMAGE ANALYSIS
    </span>
  </div>
</div>

<style>
  .image-card {
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
    background: linear-gradient(90deg, transparent, var(--cyan-glow), transparent);
    animation: scan 2s linear infinite;
    opacity: 0.5;
  }
  
  @keyframes scan {
    0% { top: 0; }
    100% { top: 100%; }
  }
  
  .image-wrapper {
    position: relative;
    aspect-ratio: 16/10;
    background: var(--bg-secondary);
    border: 1px solid rgba(0, 255, 247, 0.2);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .quiz-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  .quiz-image.visible {
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
    border: 1px solid var(--cyan-dim);
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
    animation: pulse 1s ease-in-out infinite;
  }
  
  .image-meta {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 255, 247, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .type-indicator {
    color: var(--cyan-glow);
    margin-right: 0.5rem;
  }
  
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>
