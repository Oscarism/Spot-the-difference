import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// For production, use Netlify Functions instead of SvelteKit API routes
// This endpoint is just a placeholder that redirects to the Netlify function

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const body = await request.json();
        
        // Forward to Netlify function
        const response = await fetch('/.netlify/functions/submit-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        return json(data, { status: response.status });
    } catch (error) {
        console.error('Error submitting score:', error);
        return json({ error: 'Failed to submit score' }, { status: 500 });
    }
};
