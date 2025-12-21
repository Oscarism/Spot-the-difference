import { writable, derived, get } from 'svelte/store';
import { generateAllPairs, shufflePairs, randomizePairOrder, type QuizPair, type QuizItem, type AgeGroup, type ContentType } from '../data/content';

// Game State Types
export interface Answer {
    pairId: string;
    selectedLeft: boolean;
    correct: boolean;
    type: ContentType;
}

// Randomized pair with position info
export interface RandomizedPair {
    pair: QuizPair;
    left: QuizItem;
    right: QuizItem;
    realIsLeft: boolean;
}

export interface GameState {
    ageGroup: AgeGroup | null;
    currentIndex: number;
    answers: Answer[];
    quizPairs: RandomizedPair[];
    isComplete: boolean;
    selectedSide: 'left' | 'right' | null;
}

// Initial State
const initialState: GameState = {
    ageGroup: null,
    currentIndex: 0,
    answers: [],
    quizPairs: [],
    isComplete: false,
    selectedSide: null
};

// Create the main game store
function createGameStore() {
    const { subscribe, set, update } = writable<GameState>(initialState);

    return {
        subscribe,

        // Reset to initial state
        reset: () => set(initialState),

        // Set age group and start quiz
        setAgeGroup: (ageGroup: AgeGroup) => {
            const shuffledPairs = shufflePairs(generateAllPairs());
            const randomizedPairs: RandomizedPair[] = shuffledPairs.map(pair => {
                const { left, right, realIsLeft } = randomizePairOrder(pair);
                return { pair, left, right, realIsLeft };
            });

            update(state => ({
                ...state,
                ageGroup,
                quizPairs: randomizedPairs,
                currentIndex: 0,
                answers: [],
                isComplete: false,
                selectedSide: null
            }));
        },

        // Select an option (left or right)
        selectOption: (side: 'left' | 'right') => {
            update(state => ({
                ...state,
                selectedSide: side
            }));
        },

        // Submit the current answer and move to next
        submitAnswer: () => {
            update(state => {
                if (!state.selectedSide) return state;

                const currentPair = state.quizPairs[state.currentIndex];
                if (!currentPair) return state;

                const selectedLeft = state.selectedSide === 'left';
                const correct = (selectedLeft && currentPair.realIsLeft) || (!selectedLeft && !currentPair.realIsLeft);

                const answer: Answer = {
                    pairId: currentPair.pair.id,
                    selectedLeft,
                    correct,
                    type: currentPair.pair.type
                };

                const nextIndex = state.currentIndex + 1;
                const isComplete = nextIndex >= state.quizPairs.length;

                return {
                    ...state,
                    answers: [...state.answers, answer],
                    currentIndex: nextIndex,
                    isComplete,
                    selectedSide: null
                };
            });
        },

        // Get current pair
        getCurrentPair: (): RandomizedPair | null => {
            const state = get(gameStore);
            return state.quizPairs[state.currentIndex] || null;
        }
    };
}

export const gameStore = createGameStore();

// Derived stores for computed values
export const currentPair = derived(gameStore, $game =>
    $game.quizPairs[$game.currentIndex] || null
);

// Legacy support - current item (returns left item for compatibility)
export const currentItem = derived(gameStore, $game => {
    const pair = $game.quizPairs[$game.currentIndex];
    return pair ? pair.left : null;
});

export const progress = derived(gameStore, $game => ({
    current: $game.currentIndex + 1,
    total: $game.quizPairs.length,
    percentage: $game.quizPairs.length > 0
        ? Math.round(($game.currentIndex / $game.quizPairs.length) * 100)
        : 0
}));

export const score = derived(gameStore, $game => {
    const correct = $game.answers.filter(a => a.correct).length;
    const total = $game.answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, total, percentage };
});

export const scoreByType = derived(gameStore, $game => {
    const byType: Record<ContentType, { correct: number; total: number }> = {
        image: { correct: 0, total: 0 },
        video: { correct: 0, total: 0 },
        quote: { correct: 0, total: 0 }
    };

    $game.answers.forEach(answer => {
        byType[answer.type].total++;
        if (answer.correct) byType[answer.type].correct++;
    });

    return byType;
});

// Leaderboard stats store (fetched from server)
export interface AgeGroupStats {
    ageGroup: AgeGroup;
    totalCorrect: number;
    totalAttempts: number;
    averageScore: number;
}

export const leaderboardStats = writable<AgeGroupStats[]>([]);

// Fetch leaderboard data
export async function fetchLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        if (response.ok) {
            const data = await response.json();
            leaderboardStats.set(data);
        }
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
    }
}

// Submit score to server
export async function submitScore() {
    const state = get(gameStore);
    if (!state.ageGroup || !state.isComplete) return;

    const correctAnswers = state.answers.filter(a => a.correct).length;

    try {
        await fetch('/api/submit-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ageGroup: state.ageGroup,
                correct: correctAnswers,
                total: state.answers.length
            })
        });
    } catch (error) {
        console.error('Failed to submit score:', error);
    }
}
