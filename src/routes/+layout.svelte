<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/logo.png" />
	<meta name="theme-color" content="#1a1a1a" />
	<meta name="author" content="Spot the Difference" />
	<meta property="og:title" content="Spot the Difference - Can You Spot the Fake?" />
	<meta property="og:description" content="Test your ability to distinguish AI-generated content from authentic media. See pairs of images, videos, and text — pick the real one." />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="app">
	{@render children()}
</div>

<style>
	.app {
		min-height: 100vh;
		position: relative;
	}
</style>
