<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLeaderboard, leaderboardStats, type AgeGroupStats } from '$lib/stores/game';
  import { ageGroups } from '$lib/data/content';
  
  let isLoading = $state(true);
  let stats = $derived($leaderboardStats);
  
  onMount(async () => {
    await fetchLeaderboard();
    isLoading = false;
  });
  
  function getStatsForGroup(groupId: string): AgeGroupStats | undefined {
    return stats.find(s => s.ageGroup === groupId);
  }
</script>

<svelte:head>
  <title>Leaderboard | Spot the Difference</title>
  <meta name="description" content="See how different age groups perform at detecting AI-generated content." />
</svelte:head>

<div class="leaderboard-page page-enter">
  <div class="container">
    <div class="card">
      <!-- Header -->
      <header class="leaderboard-header">
        <a href="/" class="back-link">← Back</a>
        <h1 class="title">Leaderboard</h1>
        <p class="subtitle">Average detection accuracy by age group</p>
      </header>
      
      {#if isLoading}
        <div class="loading-state">
          <p>Loading data...</p>
        </div>
      {:else if stats.length === 0}
        <!-- No Data State -->
        <div class="no-data">
          <div class="no-data-icon">📊</div>
          <h2>No data yet</h2>
          <p>Be the first to complete the quiz and contribute to the leaderboard!</p>
          <a href="/age" class="btn btn-pill btn-accent">Start Quiz</a>
        </div>
      {:else}
        <!-- Leaderboard Chart -->
        <div class="chart">
          {#each ageGroups as group}
            {@const groupStats = getStatsForGroup(group.id)}
            {@const avgScore = groupStats?.averageScore ?? 0}
            <div class="chart-row">
              <div class="row-label">
                <span class="age-label">{group.label}</span>
                <span class="player-count">{groupStats?.totalAttempts ?? 0} players</span>
              </div>
              
              <div class="bar-container">
                <div 
                  class="bar"
                  style="width: {avgScore}%"
                >
                  {#if avgScore > 10}
                    <span class="bar-value">{avgScore.toFixed(1)}%</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Stats Summary -->
        <div class="stats-summary">
          <div class="stat-card">
            <span class="stat-value">
              {stats.reduce((sum, s) => sum + s.totalAttempts, 0)}
            </span>
            <span class="stat-label">Total Players</span>
          </div>
          
          <div class="stat-card">
            <span class="stat-value">
              {(stats.reduce((sum, s) => sum + s.averageScore, 0) / stats.length).toFixed(1)}%
            </span>
            <span class="stat-label">Global Average</span>
          </div>
          
          <div class="stat-card">
            <span class="stat-value">
              {stats.sort((a, b) => b.averageScore - a.averageScore)[0]?.ageGroup ?? 'N/A'}
            </span>
            <span class="stat-label">Top Age Group</span>
          </div>
        </div>
      {/if}
      
      <!-- CTA - Primary action is accent -->
      <div class="cta">
        <p class="cta-text">Think you can beat these scores?</p>
        <a href="/age" class="btn btn-pill btn-accent">
          Take the Quiz
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .leaderboard-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .container {
    width: 100%;
    max-width: 700px;
  }
  
  .card {
    background: var(--bg-card);
    border-radius: 24px;
    padding: 2.5rem;
  }
  
  .leaderboard-header {
    margin-bottom: 2rem;
  }
  
  .back-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
    text-decoration: none;
    display: inline-block;
    margin-bottom: 1.5rem;
    transition: color 0.2s ease;
  }
  
  .back-link:hover {
    color: var(--text-primary);
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
  
  .loading-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
    font-size: 1.125rem;
  }
  
  .no-data {
    text-align: center;
    padding: 2rem;
  }
  
  .no-data-icon {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }
  
  .no-data h2 {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
  }
  
  .no-data p {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 0 1.5rem;
  }
  
  .chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .chart-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .row-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .age-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .player-count {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--text-muted);
  }
  
  .bar-container {
    height: 32px;
    background: #2a2a2a;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .bar {
    height: 100%;
    background: var(--text-primary);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.75rem;
    min-width: 0;
    transition: width 0.8s ease;
  }
  
  .bar-value {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #000000;
  }
  
  .stats-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 2rem;
  }
  
  .stat-card {
    background: var(--bg-card-secondary);
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
  }
  
  .stat-value {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.625rem;
    font-weight: 700;
    color: var(--text-primary);
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .cta {
    text-align: center;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }
  
  .cta-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
    margin: 0 0 1rem;
  }
  
  @media (max-width: 640px) {
    .leaderboard-page {
      padding: 1.25rem;
      align-items: flex-start;
    }
    
    .card {
      padding: 1.5rem;
    }
    
    .title {
      font-size: 1.625rem;
    }
    
    .subtitle {
      font-size: 1.0625rem;
    }
    
    .stats-summary {
      grid-template-columns: 1fr;
    }
    
    .stat-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
    }
    
    .stat-value {
      margin-bottom: 0;
      font-size: 1.375rem;
    }
    
    .stat-label {
      font-size: 0.8125rem;
    }
    
    .cta .btn {
      width: 100%;
    }
  }
</style>
