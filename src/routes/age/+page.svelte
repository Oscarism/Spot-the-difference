<script lang="ts">
  import { goto } from '$app/navigation';
  import { gameStore } from '$lib/stores/game';
  import { ageGroups, type AgeGroup } from '$lib/data/content';
  
  let selectedAge: AgeGroup | null = $state(null);
  let isLoading = $state(false);
  
  async function selectAge(ageGroup: AgeGroup) {
    selectedAge = ageGroup;
    isLoading = true;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    gameStore.setAgeGroup(ageGroup);
    goto('/quiz');
  }
</script>

<svelte:head>
  <title>Select Your Age Group | Spot the Difference</title>
  <meta name="description" content="Select your age group to begin the Spot the Difference quiz and compare your results with others." />
</svelte:head>

<div class="age-page page-enter">
  <div class="container">
    <div class="card">
      <!-- Back Link -->
      <a href="/" class="back-link">← Back</a>
      
      <!-- Header -->
      <div class="header">
        <h1 class="title">Select your age group</h1>
        <p class="subtitle">We'll compare your results with others in your generation</p>
      </div>
      
      <!-- Age Selection - One button will be accent when selected -->
      <div class="age-grid">
        {#each ageGroups as group, i}
          <button 
            class="btn {i % 2 === 0 ? 'btn-pill' : 'btn-rect'}"
            class:selected={selectedAge === group.id}
            onclick={() => selectAge(group.id)}
            disabled={isLoading}
          >
            {group.label}
          </button>
        {/each}
      </div>
      
      <!-- Info Panel -->
      <div class="info-panel">
        <svg class="info-icon" width="18" height="18" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 7V11M8 5V5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p>Your age data is anonymous and only used for comparing detection accuracy across generations.</p>
      </div>
    </div>
  </div>
</div>

<style>
  .age-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .container {
    width: 100%;
    max-width: 600px;
  }
  
  .card {
    background: var(--bg-card);
    border-radius: 24px;
    padding: 2.5rem;
  }
  
  .back-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    color: var(--text-secondary);
    text-decoration: none;
    display: inline-block;
    margin-bottom: 2rem;
    transition: color 0.2s ease;
  }
  
  .back-link:hover {
    color: var(--text-primary);
  }
  
  .header {
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
  
  /* No gap between buttons */
  .age-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
  }
  
  .age-grid .btn {
    min-width: 85px;
  }
  
  .info-panel {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--bg-card-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
  }
  
  .info-icon {
    flex-shrink: 0;
    color: var(--text-muted);
    margin-top: 2px;
  }
  
  .info-panel p {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9375rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
  }
  
  @media (max-width: 640px) {
    .age-page {
      padding: 1.25rem;
      align-items: flex-start;
      padding-top: 3rem;
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
    
    .age-grid {
      gap: 0.5rem;
    }
    
    .age-grid .btn {
      min-width: 75px;
    }
    
    .info-panel p {
      font-size: 1rem;
    }
  }
</style>
