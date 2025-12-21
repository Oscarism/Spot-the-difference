<script lang="ts">
  let { current, total, percentage }: { current: number; total: number; percentage: number } = $props();
</script>

<div class="progress-container">
  <div class="progress-header">
    <span class="hud-element">PROGRESS</span>
    <span class="progress-count font-display">
      <span class="glow-cyan">{current}</span>
      <span class="divider">/</span>
      <span class="glow-magenta">{total}</span>
    </span>
  </div>
  
  <div class="progress-cyber">
    <div 
      class="progress-cyber-fill" 
      style="width: {percentage}%"
    ></div>
  </div>
  
  <div class="progress-markers">
    {#each Array(total) as _, i}
      <div 
        class="marker" 
        class:completed={i < current - 1}
        class:current={i === current - 1}
      ></div>
    {/each}
  </div>
</div>

<style>
  .progress-container {
    width: 100%;
    margin-bottom: 2rem;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .progress-count {
    font-size: 1.25rem;
  }
  
  .divider {
    color: var(--text-muted);
    margin: 0 0.25rem;
  }
  
  .progress-markers {
    display: flex;
    gap: 4px;
    margin-top: 0.75rem;
    justify-content: center;
  }
  
  .marker {
    width: 8px;
    height: 8px;
    background: rgba(0, 255, 247, 0.1);
    border: 1px solid var(--cyan-dim);
    transition: all 0.3s ease;
  }
  
  .marker.completed {
    background: var(--cyan-glow);
    box-shadow: 0 0 8px var(--cyan-glow);
  }
  
  .marker.current {
    background: var(--magenta-glow);
    border-color: var(--magenta-glow);
    box-shadow: 0 0 8px var(--magenta-glow);
    animation: pulse 1s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }
  
  @media (max-width: 640px) {
    .marker {
      width: 6px;
      height: 6px;
    }
    
    .progress-markers {
      gap: 3px;
    }
  }
</style>
