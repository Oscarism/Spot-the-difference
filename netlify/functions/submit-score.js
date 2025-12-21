// Netlify Serverless Function for Score Submission (Production)
// This will use Netlify Blobs for persistent storage

import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { ageGroup, correct, total } = await req.json();

        if (!ageGroup || typeof correct !== 'number' || typeof total !== 'number') {
            return new Response(JSON.stringify({ error: 'Invalid request data' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get the Netlify Blobs store
        const store = getStore("quiz-stats");
        const key = `stats-${ageGroup}`;

        // Get existing stats or initialize
        let stats = { totalCorrect: 0, totalAttempts: 0 };

        try {
            const existing = await store.get(key, { type: 'json' });
            if (existing) {
                stats = existing;
            }
        } catch (e) {
            // Key doesn't exist yet, use defaults
        }

        // Update stats
        stats.totalCorrect += correct;
        stats.totalAttempts += 1;

        // Save back to store
        await store.setJSON(key, stats);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error submitting score:', error);
        return new Response(JSON.stringify({ error: 'Failed to submit score' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const config = {
    path: "/api/submit-score"
};
