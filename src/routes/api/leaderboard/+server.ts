import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// For production, use Netlify Functions instead of SvelteKit API routes
// This endpoint forwards to the Netlify function

export const GET: RequestHandler = async ({ fetch }) => {
    try {
        // Forward to Netlify function
        const response = await fetch('/.netlify/functions/get-leaderboard');
        const data = await response.json();
        return json(data, { status: response.status });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return json([], { status: 500 });
    }
};
