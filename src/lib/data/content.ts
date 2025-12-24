// Content metadata for quiz items
// Now structured as pairs: one real item and one AI item per round
// Images have 2 fakes per real, randomly selecting one per session

export type ContentType = 'image' | 'video' | 'quote';
export type AspectRatio = '3/4' | '4/3' | '16/9' | '9/16' | 'auto';

export interface QuizItem {
  id: string;
  type: ContentType;
  source: string; // Path to media or text content
  isAI: boolean;
  title?: string;
  author?: string;
  description?: string;
  aspectRatio?: AspectRatio;
  youtubeId?: string; // YouTube video ID for iOS fallback
}

// Paired content for side-by-side comparison
export interface QuizPair {
  id: string;
  type: ContentType;
  realItem: QuizItem;
  aiItem: QuizItem;
  aspectRatio?: AspectRatio; // Shared aspect ratio for the pair
}

// Image pairs configuration - each real has 2 possible fakes
interface ImagePairConfig {
  id: string;
  realSource: string;
  fakeSource1: string;
  fakeSource2: string;
  title: string;
  description: string;
  aspectRatio: AspectRatio;
}

const imagePairConfigs: ImagePairConfig[] = [
  {
    id: 'street',
    realSource: '/images/Street_Real.jpg',
    fakeSource1: '/images/Street_Fake1.jpg',
    fakeSource2: '/images/Street_Fake2.jpg',
    title: 'Street Scene',
    description: 'Urban street photography',
    aspectRatio: '3/4' // 896x1200 - portrait
  },
  {
    id: 'cat',
    realSource: '/images/Cat_Real.jpg',
    fakeSource1: '/images/Cat_fake1.jpg',
    fakeSource2: '/images/Cat_fake2.jpg',
    title: 'Cat Portrait',
    description: 'Feline photography',
    aspectRatio: '3/4' // 896x1200 - portrait
  },
  {
    id: 'venice',
    realSource: '/images/Venice_Real.jpg',
    fakeSource1: '/images/Venice_Fake1.jpg',
    fakeSource2: '/images/Venice_Fake2.jpg',
    title: 'Venice Canal',
    description: 'Italian cityscape',
    aspectRatio: '16/9' // 1376x768 - landscape
  }
];

// Video pairs configuration
interface VideoPairConfig {
  id: string;
  realSource: string;
  fakeSource: string;
  // YouTube URLs for iOS fallback (where static videos don't play)
  realYouTube?: string;
  fakeYouTube?: string;
  title: string;
  description: string;
  aspectRatio: AspectRatio;
}

const videoPairConfigs: VideoPairConfig[] = [
  {
    id: 'cat',
    realSource: '/videos/Cat_Real.mp4',
    fakeSource: '/videos/Cat_Fake.mp4',
    realYouTube: 'C1z5g0-nfQA',
    fakeYouTube: 'SA4D7Ug14rc',
    title: 'Cat Video',
    description: 'Cat footage',
    aspectRatio: '16/9' // 1280x720 - landscape
  },
  {
    id: 'cooking',
    realSource: '/videos/Cooking_Real.mp4',
    fakeSource: '/videos/Cooking_Fake.mp4',
    realYouTube: '3gus5hxAbU4',
    fakeYouTube: 'oZBUJpwWCrE',
    title: 'Cooking',
    description: 'Cooking footage',
    aspectRatio: '9/16' // 720x1280 - portrait (shorts)
  },
  {
    id: 'sunset',
    realSource: '/videos/Sunset_Real.mp4',
    fakeSource: '/videos/Sunset_Fake.mp4',
    realYouTube: 'LJx-uEVezwQ',
    fakeYouTube: 'XNrDDpxdE2Y',
    title: 'Sunset',
    description: 'Sunset footage',
    aspectRatio: '16/9' // 1280x720 - landscape
  }
];

// Generate image pairs with random fake selection
export function generateImagePairs(): QuizPair[] {
  return imagePairConfigs.map(config => {
    // Randomly select one of the two fakes
    const useFake1 = Math.random() > 0.5;
    const fakeSource = useFake1 ? config.fakeSource1 : config.fakeSource2;
    
    return {
      id: `pair-img-${config.id}`,
      type: 'image' as ContentType,
      aspectRatio: config.aspectRatio,
      realItem: {
        id: `img-real-${config.id}`,
        type: 'image' as ContentType,
        source: config.realSource,
        isAI: false,
        title: config.title,
        description: config.description,
        aspectRatio: config.aspectRatio
      },
      aiItem: {
        id: `img-ai-${config.id}`,
        type: 'image' as ContentType,
        source: fakeSource,
        isAI: true,
        title: `${config.title} (Generated)`,
        description: 'AI-generated version',
        aspectRatio: config.aspectRatio
      }
    };
  });
}

// Generate video pairs
export function generateVideoPairs(): QuizPair[] {
  return videoPairConfigs.map(config => {
    return {
      id: `pair-vid-${config.id}`,
      type: 'video' as ContentType,
      aspectRatio: config.aspectRatio,
      realItem: {
        id: `vid-real-${config.id}`,
        type: 'video' as ContentType,
        source: config.realSource,
        isAI: false,
        title: config.title,
        description: `Real ${config.description}`,
        aspectRatio: config.aspectRatio,
        youtubeId: config.realYouTube
      },
      aiItem: {
        id: `vid-ai-${config.id}`,
        type: 'video' as ContentType,
        source: config.fakeSource,
        isAI: true,
        title: config.title,
        description: `AI-generated ${config.description}`,
        aspectRatio: config.aspectRatio,
        youtubeId: config.fakeYouTube
      }
    };
  });
}

// Static video pairs for backward compatibility
export const videoPairs: QuizPair[] = generateVideoPairs();

// Quote pairs - Real quotes and fake AI-generated quotes
export const quotePairs: QuizPair[] = [
  {
    id: 'pair-quote-1',
    type: 'quote',
    realItem: {
      id: 'quote-real-1',
      type: 'quote',
      source: `I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.`,
      isAI: false,
      title: 'On Leadership',
      author: 'Alexander the Great'
    },
    aiItem: {
      id: 'quote-ai-1',
      type: 'quote',
      source: `The sharpest sword is no match for a sharp mind, for one rusts while the other only grows keener.`,
      isAI: true,
      title: 'On Wisdom',
      author: 'Alexander the Great'
    }
  },
  {
    id: 'pair-quote-2',
    type: 'quote',
    realItem: {
      id: 'quote-real-2',
      type: 'quote',
      source: `You know you're in love when you can't fall asleep because reality is finally better than your dreams.`,
      isAI: false,
      title: 'On Love',
      author: 'Dr. Seuss'
    },
    aiItem: {
      id: 'quote-ai-2',
      type: 'quote',
      source: `A person's a person, no matter how strange their dreams may seem to others.`,
      isAI: true,
      title: 'On Acceptance',
      author: 'Dr. Seuss'
    }
  },
  {
    id: 'pair-quote-3',
    type: 'quote',
    realItem: {
      id: 'quote-real-3',
      type: 'quote',
      source: `Peace cannot be kept by force; it can only be achieved by understanding.`,
      isAI: false,
      title: 'On Peace',
      author: 'Albert Einstein'
    },
    aiItem: {
      id: 'quote-ai-3',
      type: 'quote',
      source: `The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.`,
      isAI: true,
      title: 'On Change',
      author: 'Albert Einstein'
    }
  }
];

// Generate all pairs - calls generate functions each time for random fake selection
export function generateAllPairs(): QuizPair[] {
  const imagePairs = generateImagePairs();
  const videoPairs = generateVideoPairs();
  return [...imagePairs, ...videoPairs, ...quotePairs];
}

// Static export for backward compatibility (but imagePairs will have random fakes)
export const imagePairs: QuizPair[] = generateImagePairs();
export const allPairs: QuizPair[] = [...imagePairs, ...videoPairs, ...quotePairs];

// Shuffle function using Fisher-Yates algorithm
export function shufflePairs(pairs: QuizPair[]): QuizPair[] {
  const shuffled = [...pairs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Randomize which side (left/right) the real item appears on
export function randomizePairOrder(pair: QuizPair): { left: QuizItem; right: QuizItem; realIsLeft: boolean } {
  const realIsLeft = Math.random() > 0.5;
  return {
    left: realIsLeft ? pair.realItem : pair.aiItem,
    right: realIsLeft ? pair.aiItem : pair.realItem,
    realIsLeft
  };
}

// Legacy support - flatten pairs to individual items
export const quizContent: QuizItem[] = allPairs.flatMap(pair => [pair.realItem, pair.aiItem]);

export function shuffleContent(items: QuizItem[]): QuizItem[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get content by type
export function getContentByType(type: ContentType): QuizItem[] {
  return quizContent.filter(item => item.type === type);
}

// Get pairs by type
export function getPairsByType(type: ContentType): QuizPair[] {
  return allPairs.filter(pair => pair.type === type);
}

// Age groups for the quiz - updated ranges
export const ageGroups = [
  { id: '10-19', label: '10-19' },
  { id: '20-29', label: '20-29' },
  { id: '30-39', label: '30-39' },
  { id: '40-49', label: '40-49' },
  { id: '50+', label: '50+' }
] as const;

export type AgeGroup = typeof ageGroups[number]['id'];
