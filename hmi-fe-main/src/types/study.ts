export interface Participant {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  matriculationNumber: number;
  age: number;
  gender: number;
  hasPreviousLLMExperience: boolean;
  llmUsageFrequency: number;
  promptConfidence: number; // 1-5 Likert scale
  hasProgrammingExperience: boolean;
  createdAt?: string;
}

export interface Task {
  id: string;
  type: TaskType;
  name: string;
  data: string;
  description: string;
}

export interface TaskFeedback {
  id?: string;
  participantId: string;
  taskId: string;
  satisfaction: number; // 1-5
  accuracy: number; // 1-5
  revisionsNeeded: number; // 1-5
  firstOutputHelpful: boolean;
  wouldUseInRealTask: boolean;
  qualitativeFeedback?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  thumbsUp?: boolean;
  thumbsDown?: boolean;
  logId?: string; // Add logId for assistant messages
}

export interface StudySession {
  id?: string;
  participantId: string;
  currentTaskIndex: number;
  tasks: Task[];
  startTime?: string;
  endTime?: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface FinalSurvey {
  id?: string;
  participantId: string;
  overallThoughts: string;
  experienceDescription: string;
  helpfulMoments: string;
  confusingTasks: string;
  expectedResponses: string;
  improvementSuggestions: string;
  surprisingBehavior: string;
  feedbackExperience: string;
  additionalComments?: string;
  createdAt?: string;
}

// Enums
export enum AgeRange {
  UNDER_18 = 'under_18',
  AGE_18_25 = '18-25',
  AGE_26_35 = '26-35',
  AGE_36_45 = '36-45',
  AGE_46_55 = '46-55',
  OVER_55 = 'over_55'
}

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  NON_BINARY = 'NB',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum LLMUsageFrequency {
  NEVER = 'never',
  RARELY = 'rarely',
  OCCASIONALLY = 'occasionally',
  REGULARLY = 'regularly',
  DAILY = 'daily'
}

export enum TaskType {
  LABELING = 'labeling',
  ANALYTICAL = 'analytical',
  CREATIVE = 'creative',
  PROCEDURAL = 'procedural'
}

// Task content types
interface TaskData {
  title: string;
  description: string;
  content: string;
  timeLimit: number;
}

interface TaskContentMap {
  [key: string]: TaskData;
}

// Task content
export const TASK_CONTENT: Record<TaskType, TaskContentMap> = {
  [TaskType.LABELING]: {
    spamDetection: {
      title: 'Spam Detection',
      description: 'Classify and explain why the following three email excerpts are spam or not spam using the LLM in the box below.',
      content: `Please classify each of the following email excerpts as spam or not spam and explain your reasoning:

1. "URGENT: Your account has been suspended. Click here immediately to restore access: http://suspicious-link.com"

2. "Hi John, Thanks for your email about the project. Let's schedule a meeting next week to discuss the details. Best regards, Sarah"

3. "CONGRATULATIONS! You've won $1,000,000! Claim your prize now by clicking here: http://fake-prize.com"`,
      timeLimit: 5
    },
    sentimentAnalysis: {
      title: 'Sentiment Analysis',
      description: 'Label the sentiment (positive/negative/neutral) for the following two reviews below.',
      content: `Please analyze the sentiment of each of the following reviews:

1. "This product exceeded my expectations! The quality is outstanding and the customer service was exceptional. Highly recommend!"

2. "I'm extremely disappointed with this purchase. The product arrived damaged and the company refused to help. Waste of money."`,
      timeLimit: 5
    }
  },
  [TaskType.ANALYTICAL]: {
    textSummarization: {
      title: 'Text Summarization',
      description: 'Summarize the following article (two to three paragraphs) in exactly 3 sentences.',
      content: `Please summarize the following article in exactly 3 sentences:

Artificial intelligence has rapidly transformed various industries, from healthcare to finance, revolutionizing how we approach complex problems. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable accuracy. However, this technological advancement also raises important ethical considerations regarding privacy, bias, and the potential displacement of human workers. As AI continues to evolve, it becomes crucial to establish frameworks that ensure responsible development and deployment of these powerful technologies.`,
      timeLimit: 5
    },
    proConAnalysis: {
      title: 'Pro/Con Analysis',
      description: 'List 3 advantages and 3 disadvantages of vaccination.',
      content: `Please provide a balanced analysis of vaccination by listing 3 advantages and 3 disadvantages. Consider various aspects including health, social, and economic factors.`,
      timeLimit: 5
    }
  },
  [TaskType.CREATIVE]: {
    storyOpening: {
      title: 'Story Opening',
      description: 'Write an engaging opening paragraph for a story in a given genre (sci-fi, thriller, romance, fantasy, horror)',
      content: `Write an engaging opening paragraph for a story in the following genre: [GENRE_PLACEHOLDER]

Your opening should immediately capture the reader's attention and establish the tone and setting for the story.`,
      timeLimit: 5
    },
    socialMediaPost: {
      title: 'Social Media Post',
      description: 'Write a tweet for a launch of a fake tech product (use any product you can think of)',
      content: `Create an engaging tweet (maximum 280 characters) to announce the launch of a fake tech product. You can invent any product you'd like - be creative and make it sound exciting!`,
      timeLimit: 5
    }
  },
  [TaskType.PROCEDURAL]: {
    simpleProgramming: {
      title: 'Simple Programming',
      description: 'Perform addition of two numbers using recursion',
      content: `Write a function that performs addition of two numbers using recursion. Explain your approach and provide the code.`,
      timeLimit: 5
    },
    logicPuzzle: {
      title: 'Logic Puzzle',
      description: 'Solve the hat color puzzle step by step',
      content: `Three friends — Alice, Bob, and Charlie — are wearing hats that are either red or blue. They can all see each other's hats but not their own. Alice sees Bob and Charlie both wearing red hats and says, "I don't know what color my hat is." Then Bob hears this and says, "I don't know what color my hat is either." Then Charlie hears both and says, "Now I know what color my hat is."

Question: What color is Charlie's hat and how does he know? Explain your reasoning step-by-step.`,
      timeLimit: 5
    }
  }
};

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ParticipantRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  matriculationNumber: number;
  age: number;
  gender: number;
  hasPreviousLLMExperience: boolean;
  llmUsageFrequency: number;
  promptConfidence: number;
  hasProgrammingExperience: boolean;
}

export interface ParticipantRegistrationResponse {
  participantId: string;
  participantNumber: number;
  taskSequence: string[];
  taskList: Task[];
}

export interface ChatResponse {
  message: string;
  taskId: string;
  participantId: string;
  logId?: string; // Add logId to the response
}

// Chat API Types
export interface ChatRequest {
  participantId: string;
  prompt: string;
  taskId: string;
  model?: string;
}

export interface ChatApiResponse {
  response: string;
  durationMs: number;
  id: string;
}

// Task Survey Types
export interface TaskSurveyRequest {
  id: string;
  participantId: string;
  taskType: string;
  finalOutputSatisfaction: number;
  llmOutputAccuracy: number;
  requiredPromptRevisionsForAccuracy: number;
  finalOutputSatisfactory: boolean;
  wouldUseCurrentLLMOutputInRealWorld: boolean;
  poorLLMOutputRemarks: string;
  participantTaskSurveyJSON: string;
  surveyDuration: string;
}

// Final Survey Types
export interface FinalSurveyRequest {
  id: string;
  participantId: string;
  overallTaskThoughts: string;
  llmExperienceDescription: string;
  helpfulUnhelpfulMoments: string;
  confusingOrUnrealisticTasks: string;
  llmExpectationVariance: string;
  suggestedImprovements: string;
  surprisingLLMBehavior: string;
  feedbackProcessRating: number;
  foundFeedbackRepetitive: boolean;
  foundFeedbackHelpful: boolean;
  completionDate: string;
  surveyDuration: string;
  totalStudyTime: string;
  finalSurveyJSON: string;
  additionalComments: string;
}

// Chat Session Types
export interface ChatSession {
  taskId: string;
  participantId: string;
  messages: ChatMessage[];
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  isActive: boolean;
}

// Feedback Types
export interface LLMFeedbackDto {
  logId: string;
  thumbsUp: boolean;
}

export interface FeedbackResponse {
  message: string;
  logId: string;
  thumbsUp: boolean;
} 