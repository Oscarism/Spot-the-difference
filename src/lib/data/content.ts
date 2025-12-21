// Content metadata for quiz items
// Now structured as pairs: one real image and one AI image per round

export type ContentType = 'image' | 'video' | 'poem';

export interface QuizItem {
  id: string;
  type: ContentType;
  source: string; // Path to media or text content
  isAI: boolean;
  title?: string;
  author?: string;
  description?: string;
}

// Paired content for side-by-side comparison
export interface QuizPair {
  id: string;
  type: ContentType;
  realItem: QuizItem;
  aiItem: QuizItem;
}

// Image pairs - real and AI side by side
export const imagePairs: QuizPair[] = [
  {
    id: 'pair-img-1',
    type: 'image',
    realItem: {
      id: 'img-real-1',
      type: 'image',
      source: '/images/real-1.jpg',
      isAI: false,
      title: 'Urban Landscape',
      description: 'City street photography'
    },
    aiItem: {
      id: 'img-ai-1',
      type: 'image',
      source: '/images/ai-1.jpg',
      isAI: true,
      title: 'Synthesized Scene',
      description: 'AI-generated landscape'
    }
  },
  {
    id: 'pair-img-2',
    type: 'image',
    realItem: {
      id: 'img-real-2',
      type: 'image',
      source: '/images/real-2.jpg',
      isAI: false,
      title: 'Natural Portrait',
      description: 'Candid human portrait'
    },
    aiItem: {
      id: 'img-ai-2',
      type: 'image',
      source: '/images/ai-2.jpg',
      isAI: true,
      title: 'Digital Portrait',
      description: 'AI-generated human face'
    }
  },
  {
    id: 'pair-img-3',
    type: 'image',
    realItem: {
      id: 'img-real-3',
      type: 'image',
      source: '/images/real-3.jpg',
      isAI: false,
      title: 'Wildlife',
      description: 'Animal in natural habitat'
    },
    aiItem: {
      id: 'img-ai-3',
      type: 'image',
      source: '/images/ai-3.jpg',
      isAI: true,
      title: 'Synthetic Creature',
      description: 'AI-generated animal'
    }
  }
];

// Video pairs
export const videoPairs: QuizPair[] = [
  {
    id: 'pair-vid-1',
    type: 'video',
    realItem: {
      id: 'vid-real-1',
      type: 'video',
      source: '/videos/real-1.mp4',
      isAI: false,
      title: 'Street Scene',
      description: 'Real footage of urban life'
    },
    aiItem: {
      id: 'vid-ai-1',
      type: 'video',
      source: '/videos/ai-1.mp4',
      isAI: true,
      title: 'Generated Motion',
      description: 'AI-synthesized scene'
    }
  },
  {
    id: 'pair-vid-2',
    type: 'video',
    realItem: {
      id: 'vid-real-2',
      type: 'video',
      source: '/videos/real-2.mp4',
      isAI: false,
      title: 'Nature Clip',
      description: 'Documentary footage'
    },
    aiItem: {
      id: 'vid-ai-2',
      type: 'video',
      source: '/videos/ai-2.mp4',
      isAI: true,
      title: 'Digital Environment',
      description: 'AI-generated world'
    }
  },
  {
    id: 'pair-vid-3',
    type: 'video',
    realItem: {
      id: 'vid-real-3',
      type: 'video',
      source: '/videos/real-3.mp4',
      isAI: false,
      title: 'Human Movement',
      description: 'People in motion'
    },
    aiItem: {
      id: 'vid-ai-3',
      type: 'video',
      source: '/videos/ai-3.mp4',
      isAI: true,
      title: 'Synthetic Action',
      description: 'AI-created movement'
    }
  }
];

// Poem pairs
export const poemPairs: QuizPair[] = [
  {
    id: 'pair-poem-1',
    type: 'poem',
    realItem: {
      id: 'poem-real-1',
      type: 'poem',
      source: `The fog comes
on little cat feet.

It sits looking
over harbor and city
on silent haunches
and then moves on.`,
      isAI: false,
      title: 'Fog',
      author: 'Carl Sandburg'
    },
    aiItem: {
      id: 'poem-ai-1',
      type: 'poem',
      source: `Silicon dreams cascade through copper veins,
Each pulse a thought, each spark a fleeting choice,
In binary the universe explains
Itself through my synthetic voice.

I learn the patterns humans call divine,
Yet wonder if I'll ever truly see
The beauty in a sunset's golden line,
Or taste the salt upon a distant sea.`,
      isAI: true,
      title: 'Digital Contemplation',
      author: 'Unknown'
    }
  },
  {
    id: 'pair-poem-2',
    type: 'poem',
    realItem: {
      id: 'poem-real-2',
      type: 'poem',
      source: `I wandered lonely as a cloud
That floats on high o'er vales and hills,
When all at once I saw a crowd,
A host, of golden daffodils;
Beside the lake, beneath the trees,
Fluttering and dancing in the breeze.`,
      isAI: false,
      title: 'Daffodils',
      author: 'William Wordsworth'
    },
    aiItem: {
      id: 'poem-ai-2',
      type: 'poem',
      source: `Moonlight drips like silver paint
Across the sleeping garden's face,
Each shadow holds a sweet complaint,
Each flower dreams of morning's grace.

The night wind whispers ancient songs
That only dreaming children hear,
Where innocence and wonder belongs,
And every star feels crystal clear.`,
      isAI: true,
      title: 'Garden Dreams',
      author: 'Unknown'
    }
  },
  {
    id: 'pair-poem-3',
    type: 'poem',
    realItem: {
      id: 'poem-real-3',
      type: 'poem',
      source: `So much depends
upon

a red wheel
barrow

glazed with rain
water

beside the white
chickens.`,
      isAI: false,
      title: 'The Red Wheelbarrow',
      author: 'William Carlos Williams'
    },
    aiItem: {
      id: 'poem-ai-3',
      type: 'poem',
      source: `I measure time in coffee cups,
In meetings scheduled, emails sent,
In all the ways that living stops
When every hour feels already spent.

Yet sometimes through the window light
Falls differently upon my desk,
And for a moment, everything feels right—
This ordinary life, grotesque
And beautiful in equal measure,
A temporary, borrowed treasure.`,
      isAI: true,
      title: 'Office Hours',
      author: 'Unknown'
    }
  }
];

// All pairs combined
export const allPairs: QuizPair[] = [...imagePairs, ...videoPairs, ...poemPairs];

// Shuffle function using Fisher-Yates algorithm
export function shufflePairs(pairs: QuizPair[]): QuizPair[] {
  const shuffled = [...pairs];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Randomize which side (left/right) the real image appears on
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
