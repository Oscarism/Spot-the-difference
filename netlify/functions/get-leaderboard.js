// Netlify Serverless Function for Leaderboard (Production)
// This will use Netlify Blobs for persistent storage

import { getStore } from "@netlify/blobs";

const ageGroups = ['10-20', '20-30', '30-40', '40-50', '50+'];

export default async (req, context) => {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const store = getStore("quiz-stats");
        const leaderboard = [];

        for (const groupId of ageGroups) {
            const key = `stats-${groupId}`;

            try {
                const stats = await store.get(key, { type: 'json' });

                if (stats && stats.totalAttempts > 0) {
                    const totalQuestions = stats.totalAttempts * 18;
                    const averageScore = (stats.totalCorrect / totalQuestions) * 100;

                    leaderboard.push({
                        ageGroup: groupId,
                        totalCorrect: stats.totalCorrect,
                        totalAttempts: stats.totalAttempts,
                        averageScore: Math.round(averageScore * 10) / 10
                    });
                }
            } catch (e) {
                // Key doesn't exist, skip this age group
            }
        }

        return new Response(JSON.stringify(leaderboard), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return new Response(JSON.stringify([]), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const config = {
    path: "/api/leaderboard"
};
