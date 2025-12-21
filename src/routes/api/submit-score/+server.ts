import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In-memory store for development (Netlify Blobs will be used in production)
const statsStore: Record<string, { totalCorrect: number; totalAttempts: number }> = {};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { ageGroup, correct, total } = await request.json();

        if (!ageGroup || typeof correct !== 'number' || typeof total !== 'number') {
            return json({ error: 'Invalid request data' }, { status: 400 });
        }

        // Initialize or update stats for this age group
        if (!statsStore[ageGroup]) {
            statsStore[ageGroup] = { totalCorrect: 0, totalAttempts: 0 };
        }

        statsStore[ageGroup].totalCorrect += correct;
        statsStore[ageGroup].totalAttempts += 1;

        return json({ success: true });
    } catch (error) {
        console.error('Error submitting score:', error);
        return json({ error: 'Failed to submit score' }, { status: 500 });
    }
};

// Export statsStore for use by leaderboard endpoint
export { statsStore };
