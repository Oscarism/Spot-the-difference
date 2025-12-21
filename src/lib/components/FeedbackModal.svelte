<script lang="ts">
  let { 
    isCorrect, 
    wasAI, 
    onContinue 
  }: { 
    isCorrect: boolean; 
    wasAI: boolean; 
    onContinue: () => void;
  } = $props();
</script>

<div class="feedback-overlay">
  <div class="feedback-card panel-cyber" class:correct={isCorrect} class:wrong={!isCorrect}>
    <div class="feedback-icon">
      {#if isCorrect}
        <span class="icon correct-icon">✓</span>
      {:else}
        <span class="icon wrong-icon">✗</span>
      {/if}
    </div>
    
    <h2 class="feedback-title font-display" class:glow-cyan={isCorrect} class:glow-magenta={!isCorrect}>
      {isCorrect ? 'CORRECT' : 'INCORRECT'}
    </h2>
    
    <p class="feedback-message">
      {#if isCorrect}
        Nice work! You correctly identified this as 
        <span class="highlight" class:ai={wasAI} class:real={!wasAI}>
          {wasAI ? 'AI-GENERATED' : 'REAL'}
        </span>
      {:else}
        This content was actually 
        <span class="highlight" class:ai={wasAI} class:real={!wasAI}>
          {wasAI ? 'AI-GENERATED' : 'REAL'}
        </span>
      {/if}
    </p>
    
    <button class="btn-cyber" class:green={isCorrect} class:magenta={!isCorrect} onclick={onContinue}>
      Continue
    </button>
  </div>
</div>

<style>
  .feedback-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeIn 0.3s ease;
    padding: 1rem;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .feedback-card {
    padding: 3rem;
    text-align: center;
    max-width: 500px;
    width: 100%;
    animation: scaleIn 0.3s ease;
  }
  
  .feedback-card.correct {
    border-color: var(--green-glow);
    box-shadow: 0 0 30px rgba(0, 255, 102, 0.3);
  }
  
  .feedback-card.wrong {
    border-color: var(--magenta-glow);
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.3);
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.9);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .feedback-icon {
    margin-bottom: 1.5rem;
  }
  
  .icon {
    font-size: 4rem;
    display: inline-block;
  }
  
  .correct-icon {
    color: var(--green-glow);
    text-shadow: 0 0 20px var(--green-glow), 0 0 40px rgba(0, 255, 102, 0.5);
    animation: pulse 1s ease-in-out infinite;
  }
  
  .wrong-icon {
    color: var(--magenta-glow);
    text-shadow: 0 0 20px var(--magenta-glow), 0 0 40px rgba(255, 0, 255, 0.5);
    animation: shake 0.5s ease;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-10px); }
    40% { transform: translateX(10px); }
    60% { transform: translateX(-10px); }
    80% { transform: translateX(10px); }
  }
  
  .feedback-title {
    font-size: 2rem;
    margin-bottom: 1rem;
    letter-spacing: 4px;
  }
  
  .feedback-message {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .highlight {
    font-family: 'Orbitron', sans-serif;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    display: inline-block;
    margin-top: 0.5rem;
  }
  
  .highlight.ai {
    color: var(--magenta-glow);
    border: 1px solid var(--magenta-glow);
    background: rgba(255, 0, 255, 0.1);
  }
  
  .highlight.real {
    color: var(--cyan-glow);
    border: 1px solid var(--cyan-glow);
    background: rgba(0, 255, 247, 0.1);
  }
  
  @media (max-width: 640px) {
    .feedback-card {
      padding: 2rem;
    }
    
    .icon {
      font-size: 3rem;
    }
    
    .feedback-title {
      font-size: 1.5rem;
    }
  }
</style>
