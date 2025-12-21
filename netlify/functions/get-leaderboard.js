// Netlify Serverless Function for Leaderboard (Production)
// Uses Netlify Blobs for persistent storage

import { getStore } from "@netlify/blobs";

const ageGroups = ['10-19', '20-29', '30-39', '40-49', '50+'];

export default async (req, context) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    try {
        console.log('Fetching leaderboard data...');
        
        const store = getStore("quiz-stats");
        const leaderboard = [];

        for (const groupId of ageGroups) {
            const key = `stats-${groupId}`;

            try {
                const stats = await store.get(key, { type: 'json' });
                console.log(`Stats for ${groupId}:`, stats);

                if (stats && stats.totalAttempts > 0) {
                    const totalQuestions = stats.totalAttempts * 9; // 9 questions per quiz
                    const averageScore = (stats.totalCorrect / totalQuestions) * 100;

                    leaderboard.push({
                        ageGroup: groupId,
                        totalCorrect: stats.totalCorrect,
                        totalAttempts: stats.totalAttempts,
                        averageScore: Math.round(averageScore * 10) / 10
                    });
                }
            } catch (e) {
                console.log(`No stats found for ${groupId}`);
            }
        }

        console.log('Leaderboard result:', leaderboard);

        return new Response(JSON.stringify(leaderboard), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch leaderboard', details: error.message }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};

export const config = {
    path: "/api/leaderboard"
};
