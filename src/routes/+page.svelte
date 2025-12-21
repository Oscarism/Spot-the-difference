<script lang="ts">
  import { goto } from '$app/navigation';
  import { gameStore } from '$lib/stores/game';
  
  // Reset game state when landing page loads
  $effect(() => {
    gameStore.reset();
  });
  
  function startQuiz() {
    goto('/age');
  }
</script>

<svelte:head>
  <title>Spot the Difference - Can You Spot the Fake?</title>
  <meta name="description" content="Test your ability to distinguish AI-generated content from authentic media. See pairs of images, videos, and text — pick the real one." />
</svelte:head>

<div class="landing-page page-enter">
  <!-- Logo -->
  <div class="logo">
    <img src="/logo.png" alt="Spot the Difference" class="logo-img" />
  </div>
  
  <!-- Hero Content -->
  <div class="hero">
    <div class="hero-text">
      <h2 class="tagline">Can you spot the fake?</h2>
      
      <p class="description">
        Test your ability to distinguish AI-generated content from authentic media. 
        You'll see pairs of images, videos, and text — pick the real one.
      </p>
      
      <!-- Stats -->
      <div class="stats">
        <div class="stat">
          <span class="stat-value">9</span>
          <span class="stat-label">rounds</span>
        </div>
        <span class="stat-divider">|</span>
        <div class="stat">
          <span class="stat-value">3</span>
          <span class="stat-label">content types</span>
        </div>
        <span class="stat-divider">|</span>
        <div class="stat">
          <span class="stat-value">~2</span>
          <span class="stat-label">minutes</span>
        </div>
      </div>
      
      <!-- Buttons - Primary action is accent, secondary is white -->
      <div class="buttons">
        <button class="btn btn-pill btn-accent" onclick={startQuiz}>
          Start Quiz
        </button><a href="/leaderboard" class="btn btn-rect">
          View Leaderboard
        </a>
      </div>
    </div>
    
    <!-- Progress Card -->
    <div class="hero-card">
      <div class="card">
        <h3 class="card-title">Your Progress</h3>
        <p class="card-subtitle">You are on track to complete the quiz.</p>
        
        <div class="progress-display">
          <span class="progress-value">0%</span>
          <span class="progress-badge">start now</span>
        </div>
        
        <div class="progress-bar">
          {#each Array(9) as _, i}
            <div class="progress-segment"></div>
          {/each}
        </div>
      </div>
    </div>
  </div>
  
  <!-- Footer -->
  <footer class="footer">
    <span>Built using Svelte and Claude code</span>
  </footer>
</div>

<style>
  .landing-page {
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }
  
  /* Logo */
  .logo {
    margin-bottom: 3rem;
  }
  
  .logo-img {
    height: 48px;
    width: auto;
  }
  
  /* Hero */
  .hero {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  .hero-text {
    max-width: 420px;
  }
  
  .tagline {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.625rem;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0 0 1rem;
  }
  
  .description {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0 0 2rem;
  }
  
  /* Stats */
  .stats {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  
  .stat {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }
  
  .stat-value {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .stat-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9375rem;
    color: var(--text-secondary);
  }
  
  .stat-divider {
    color: var(--text-muted);
  }
  
  /* Buttons - no gap */
  .buttons {
    display: flex;
    flex-wrap: wrap;
  }
  
  /* Card */
  .hero-card {
    display: flex;
    justify-content: flex-end;
  }
  
  .card {
    background: var(--bg-card);
    border-radius: 24px;
    padding: 2rem;
    width: 100%;
    max-width: 380px;
  }
  
  .card-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
  }
  
  .card-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9375rem;
    color: var(--text-secondary);
    margin: 0 0 1.5rem;
  }
  
  .progress-display {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .progress-value {
    font-family: 'DM Sans', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }
  
  .progress-badge {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8125rem;
    color: var(--text-secondary);
    padding: 0.375rem 0.75rem;
    background: var(--bg-card-secondary);
    border-radius: 9999px;
  }
  
  .progress-bar {
    display: flex;
    gap: 4px;
  }
  
  .progress-segment {
    flex: 1;
    height: 24px;
    background: #2a2a2a;
    border-radius: 4px;
  }
  
  /* Footer */
  .footer {
    margin-top: 2rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  /* Responsive */
  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    
    .hero-text {
      max-width: none;
    }
    
    .hero-card {
      justify-content: flex-start;
    }
    
    .card {
      max-width: none;
    }
  }
  
  @media (max-width: 640px) {
    .landing-page {
      padding: 1.25rem;
    }
    
    .logo-img {
      height: 40px;
    }
    
    .tagline {
      font-size: 1.5rem;
    }
    
    .description {
      font-size: 1.0625rem;
    }
    
    .stats {
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    
    .stat-divider {
      display: none;
    }
    
    .stat-value {
      font-size: 1.25rem;
    }
    
    .stat-label {
      font-size: 1rem;
    }
    
    .buttons {
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .buttons .btn {
      width: 100%;
    }
  }
</style>
