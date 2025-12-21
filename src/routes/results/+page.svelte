<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { gameStore, score, scoreByType } from '$lib/stores/game';
  
  let game = $derived($gameStore);
  let finalScore = $derived($score);
  let categoryScores = $derived($scoreByType);
  
  let showDetails = $state(false);
  
  // Redirect if quiz not complete
  onMount(() => {
    if (!game.isComplete || !game.ageGroup) {
      goto('/');
    }
  });
  
  function getPerformanceMessage(percentage: number): string {
    if (percentage >= 90) return "Exceptional detection skills!";
    if (percentage >= 75) return "Highly perceptive!";
    if (percentage >= 60) return "Good awareness";
    if (percentage >= 40) return "Room for improvement";
    return "Keep practicing!";
  }
</script>

<svelte:head>
  <title>Your Results | Spot the Difference</title>
  <meta name="description" content="See how well you did at detecting AI-generated content." />
</svelte:head>

<div class="results-page page-enter">
  <div class="container">
    <div class="card">
      <!-- Header -->
      <header class="results-header">
        <h1 class="title">Quiz Complete</h1>
        <p class="subtitle">Here's how you did</p>
      </header>
      
      <!-- Main Score Display -->
      <div class="score-display">
        <div class="score-main">
          <span class="score-number">{finalScore.correct}</span>
          <span class="score-divider">/</span>
          <span class="score-total">{finalScore.total}</span>
        </div>
        
        <div class="score-percentage">{finalScore.percentage}%</div>
        
        <p class="performance-message">
          {getPerformanceMessage(finalScore.percentage)}
        </p>
        
        <!-- Progress visualization -->
        <div class="progress-bar">
          {#each Array(finalScore.total) as _, i}
            <div 
              class="progress-segment" 
              class:correct={i < finalScore.correct}
            ></div>
          {/each}
        </div>
      </div>
      
      <!-- Category Breakdown Toggle -->
      <button 
        class="toggle-details" 
        onclick={() => showDetails = !showDetails}
      >
        <span>Category Breakdown</span>
        <span class="toggle-icon">{showDetails ? '−' : '+'}</span>
      </button>
      
      {#if showDetails}
        <div class="category-breakdown">
          <div class="category-card">
            <div class="category-header">
              <span class="category-name">Images</span>
              <span class="category-score">{categoryScores.image.correct}/{categoryScores.image.total}</span>
            </div>
            <div class="category-bar">
              <div 
                class="category-fill" 
                style="width: {categoryScores.image.total > 0 ? (categoryScores.image.correct / categoryScores.image.total * 100) : 0}%"
              ></div>
            </div>
          </div>
          
          <div class="category-card">
            <div class="category-header">
              <span class="category-name">Videos</span>
              <span class="category-score">{categoryScores.video.correct}/{categoryScores.video.total}</span>
            </div>
            <div class="category-bar">
              <div 
                class="category-fill" 
                style="width: {categoryScores.video.total > 0 ? (categoryScores.video.correct / categoryScores.video.total * 100) : 0}%"
              ></div>
            </div>
          </div>
          
          <div class="category-card">
            <div class="category-header">
              <span class="category-name">Quotes</span>
              <span class="category-score">{categoryScores.quote.correct}/{categoryScores.quote.total}</span>
            </div>
            <div class="category-bar">
              <div 
                class="category-fill" 
                style="width: {categoryScores.quote.total > 0 ? (categoryScores.quote.correct / categoryScores.quote.total * 100) : 0}%"
              ></div>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Age Group Badge -->
      <div class="age-badge">
        <span class="age-label">Age Group</span>
        <span class="age-value">{game.ageGroup}</span>
      </div>
      
      <!-- Single Action Button - Primary action is accent -->
      <div class="actions">
        <a href="/leaderboard" class="btn btn-pill btn-accent">
          View Leaderboard
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .results-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .container {
    width: 100%;
    max-width: 500px;
  }
  
  .card {
    background: var(--bg-card);
    border-radius: 24px;
    padding: 2.5rem;
  }
  
  .results-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
  }
  
  .subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0;
  }
  
  .score-display {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .score-main {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.25rem;
  }
  
  .score-number {
    font-family: 'DM Sans', sans-serif;
    font-size: 4.5rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }
  
  .score-divider {
    font-size: 2.25rem;
    color: #444444;
  }
  
  .score-total {
    font-size: 2.25rem;
    color: var(--text-secondary);
  }
  
  .score-percentage {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
  
  .performance-message {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 0 1.5rem;
  }
  
  .progress-bar {
    display: flex;
    gap: 4px;
  }
  
  .progress-segment {
    flex: 1;
    height: 8px;
    background: #2a2a2a;
    border-radius: 4px;
  }
  
  .progress-segment.correct {
    background: var(--text-primary);
  }
  
  .toggle-details {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.75rem 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: color 0.2s ease;
  }
  
  .toggle-details:hover {
    color: var(--text-primary);
  }
  
  .toggle-icon {
    font-size: 1.375rem;
  }
  
  .category-breakdown {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .category-card {
    background: var(--bg-card-secondary);
    border-radius: 12px;
    padding: 1rem;
  }
  
  .category-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .category-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
  }
  
  .category-score {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .category-bar {
    height: 6px;
    background: #2a2a2a;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .category-fill {
    height: 100%;
    background: var(--text-primary);
    transition: width 0.5s ease;
  }
  
  .age-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    background: var(--bg-card-secondary);
    border-radius: 9999px;
    margin-bottom: 2rem;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
  
  .age-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8125rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .age-value {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .actions {
    display: flex;
    justify-content: center;
  }
  
  @media (max-width: 640px) {
    .results-page {
      padding: 1.25rem;
      align-items: flex-start;
    }
    
    .card {
      padding: 1.5rem;
    }
    
    .title {
      font-size: 1.75rem;
    }
    
    .subtitle {
      font-size: 1.0625rem;
    }
    
    .score-number {
      font-size: 3.5rem;
    }
    
    .score-percentage {
      font-size: 1.25rem;
    }
    
    .performance-message {
      font-size: 1.0625rem;
    }
    
    .actions .btn {
      width: 100%;
    }
  }
</style>
