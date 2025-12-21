import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { statsStore } from '../submit-score/+server';
import { ageGroups } from '$lib/data/content';

export const GET: RequestHandler = async () => {
    try {
        // Build leaderboard data from stats
        const leaderboard = ageGroups.map(group => {
            const stats = statsStore[group.id] || { totalCorrect: 0, totalAttempts: 0 };
            const totalQuestions = stats.totalAttempts * 18; // 18 questions per quiz
            const averageScore = totalQuestions > 0
                ? (stats.totalCorrect / totalQuestions) * 100
                : 0;

            return {
                ageGroup: group.id,
                totalCorrect: stats.totalCorrect,
                totalAttempts: stats.totalAttempts,
                averageScore: Math.round(averageScore * 10) / 10
            };
        }).filter(stat => stat.totalAttempts > 0);

        return json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return json([], { status: 500 });
    }
};
