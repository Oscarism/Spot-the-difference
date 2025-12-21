<script lang="ts">
  import type { QuizItem } from '../data/content';
  
  let { item }: { item: QuizItem } = $props();
  
  // Split poem into lines for animated display
  const lines = item.source.split('\n');
</script>

<div class="poem-card panel-cyber corner-decor">
  <div class="scan-line"></div>
  
  <div class="poem-container">
    <div class="terminal-header">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
      <span class="terminal-title hud-element">TEXT_ANALYSIS.exe</span>
    </div>
    
    <div class="poem-content">
      <div class="line-numbers">
        {#each lines as _, i}
          <span class="line-num">{String(i + 1).padStart(2, '0')}</span>
        {/each}
      </div>
      
      <div class="poem-text">
        {#each lines as line, i}
          <span class="poem-line" style="animation-delay: {i * 0.1}s">
            {line || '\u00A0'}
          </span>
        {/each}
      </div>
    </div>
    
    {#if item.title || item.author}
      <div class="poem-attribution">
        {#if item.title}
          <span class="poem-title glow-magenta">"{item.title}"</span>
        {/if}
        {#if item.author}
          <span class="poem-author">— {item.author}</span>
        {/if}
      </div>
    {/if}
  </div>
  
  <div class="poem-meta">
    <span class="hud-element">
      <span class="type-indicator">◈</span>
      TEXT ANALYSIS
    </span>
    <span class="hud-element word-count">
      {item.source.split(/\s+/).filter(w => w.length > 0).length} WORDS
    </span>
  </div>
</div>

<style>
  .poem-card {
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
    background: linear-gradient(90deg, transparent, var(--green-glow), transparent);
    animation: scan 3s linear infinite;
    opacity: 0.5;
  }
  
  @keyframes scan {
    0% { top: 0; }
    100% { top: 100%; }
  }
  
  .poem-container {
    background: var(--bg-secondary);
    border: 1px solid rgba(0, 255, 102, 0.2);
    overflow: hidden;
  }
  
  .terminal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(0, 255, 102, 0.2);
  }
  
  .terminal-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .terminal-dot.red {
    background: #ff5f56;
    box-shadow: 0 0 8px rgba(255, 95, 86, 0.5);
  }
  
  .terminal-dot.yellow {
    background: #ffbd2e;
    box-shadow: 0 0 8px rgba(255, 189, 46, 0.5);
  }
  
  .terminal-dot.green {
    background: #27c93f;
    box-shadow: 0 0 8px rgba(39, 201, 63, 0.5);
  }
  
  .terminal-title {
    margin-left: auto;
  }
  
  .poem-content {
    display: flex;
    padding: 1.5rem;
    min-height: 200px;
  }
  
  .line-numbers {
    display: flex;
    flex-direction: column;
    padding-right: 1rem;
    margin-right: 1rem;
    border-right: 1px solid rgba(0, 255, 102, 0.2);
    user-select: none;
  }
  
  .line-num {
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.8;
  }
  
  .poem-text {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  .poem-line {
    line-height: 1.8;
    color: var(--text-primary);
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
    white-space: pre-wrap;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .poem-attribution {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid rgba(0, 255, 102, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }
  
  .poem-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
  }
  
  .poem-author {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-style: italic;
  }
  
  .poem-meta {
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(0, 255, 102, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .type-indicator {
    color: var(--green-glow);
    margin-right: 0.5rem;
  }
  
  .word-count {
    color: var(--green-glow);
  }
  
  @media (max-width: 640px) {
    .poem-content {
      padding: 1rem;
    }
    
    .line-numbers {
      display: none;
    }
    
    .poem-line {
      font-size: 0.9rem;
    }
  }
</style>
