// Netlify Serverless Function for Score Submission (Production)
// Uses Netlify Blobs for persistent storage

import { getStore } from "@netlify/blobs";

export default async (req, context) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    try {
        const body = await req.json();
        const { ageGroup, correct, total } = body;

        console.log('Received score submission:', { ageGroup, correct, total });

        if (!ageGroup || typeof correct !== 'number' || typeof total !== 'number') {
            console.log('Invalid request data');
            return new Response(JSON.stringify({ error: 'Invalid request data' }), {
                status: 400,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
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
                console.log('Existing stats found:', stats);
            }
        } catch (e) {
            console.log('No existing stats, starting fresh');
        }

        // Update stats
        stats.totalCorrect += correct;
        stats.totalAttempts += 1;

        console.log('Updated stats:', stats);

        // Save back to store
        await store.setJSON(key, stats);

        console.log('Stats saved successfully');

        return new Response(JSON.stringify({ success: true, stats }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('Error submitting score:', error);
        return new Response(JSON.stringify({ error: 'Failed to submit score', details: error.message }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};

export const config = {
    path: "/api/submit-score"
};
