'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  Participant,
  Task, TaskFeedback,
  FinalSurvey,
  ChatMessage,
  ParticipantRegistrationResponse,
  ChatSession
} from '@/types/study';

interface StudyState {
  participant: Participant | null;
  participantId: string | null;
  participantNumber: number | null;
  taskSequence: string[];
  tasks: Task[];
  currentTaskIndex: number;
  messages: ChatMessage[];
  taskFeedbacks: TaskFeedback[];
  finalSurvey: FinalSurvey | null;
  consentGiven: boolean;
  isLoading: boolean;
  error: string | null;
  chatSessions: ChatSession[];
  currentChatSession: ChatSession | null;
  studyStartTime: Date | null;
}

type StudyAction =
  | { type: 'SET_PARTICIPANT'; payload: Participant }
  | { type: 'SET_REGISTRATION_RESPONSE'; payload: ParticipantRegistrationResponse }
  | { type: 'SET_CURRENT_TASK'; payload: number }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_TASK_FEEDBACK'; payload: TaskFeedback }
  | { type: 'SET_FINAL_SURVEY'; payload: FinalSurvey }
  | { type: 'SET_CONSENT'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'START_CHAT_SESSION'; payload: { taskId: string; participantId: string } }
  | { type: 'END_CHAT_SESSION'; payload: { taskId: string; endTime: Date } }
  | { type: 'SET_STUDY_START_TIME'; payload: Date }
  | { type: 'RESET_STUDY' };

const initialState: StudyState = {
  participant: null,
  participantId: null,
  participantNumber: null,
  taskSequence: [],
  tasks: [],
  currentTaskIndex: 0,
  messages: [],
  taskFeedbacks: [],
  finalSurvey: null,
  consentGiven: false,
  isLoading: false,
  error: null,
  chatSessions: [],
  currentChatSession: null,
  studyStartTime: null,
};

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case 'SET_PARTICIPANT':
      return { ...state, participant: action.payload };
    
    case 'SET_REGISTRATION_RESPONSE':
      return { 
        ...state, 
        participantId: action.payload.participantId,
        participantNumber: action.payload.participantNumber,
        taskSequence: action.payload.taskSequence,
        tasks: action.payload.taskList,
        currentTaskIndex: 0
      };
    
    case 'SET_CURRENT_TASK':
      return { ...state, currentTaskIndex: action.payload };
    
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload] 
      };
    
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    
    case 'ADD_TASK_FEEDBACK':
      return { 
        ...state, 
        taskFeedbacks: [...state.taskFeedbacks, action.payload] 
      };
    
    case 'SET_FINAL_SURVEY':
      return { ...state, finalSurvey: action.payload };
    
    case 'SET_CONSENT':
      return { ...state, consentGiven: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'START_CHAT_SESSION':
      const newChatSession: ChatSession = {
        taskId: action.payload.taskId,
        participantId: action.payload.participantId,
        messages: [],
        startTime: new Date(),
        duration: 0,
        isActive: true,
      };
      return {
        ...state,
        currentChatSession: newChatSession,
        messages: [],
      };
    
    case 'END_CHAT_SESSION':
      const updatedChatSession = state.currentChatSession ? {
        ...state.currentChatSession,
        endTime: action.payload.endTime,
        duration: Math.floor((action.payload.endTime.getTime() - state.currentChatSession.startTime.getTime()) / 1000),
        isActive: false,
        messages: state.messages,
      } : null;
      
      return {
        ...state,
        currentChatSession: updatedChatSession,
        chatSessions: updatedChatSession 
          ? [...state.chatSessions, updatedChatSession]
          : state.chatSessions,
      };
    
    case 'SET_STUDY_START_TIME':
      return { ...state, studyStartTime: action.payload };
    
    case 'RESET_STUDY':
      return initialState;
    
    default:
      return state;
  }
}

interface StudyContextType {
  state: StudyState;
  dispatch: React.Dispatch<StudyAction>;
  currentTask: Task | null;
  isStudyComplete: boolean;
  progress: number;
  nextTask: () => void;
  previousTask: () => void;
  getCurrentTaskType: () => string | null;
  startChatSession: (taskId: string) => void;
  endChatSession: () => void;
  getCurrentSessionDuration: () => number;
  getTotalStudyTime: () => number;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  const currentTask = state.tasks[state.currentTaskIndex] || null;
  
  const isStudyComplete = state.currentTaskIndex >= state.tasks.length;
  
  const progress = state.tasks.length > 0 
    ? (state.currentTaskIndex / state.tasks.length) * 100 
    : 0;

  const nextTask = () => {
    if (state.currentTaskIndex < state.tasks.length - 1) {
      dispatch({ type: 'SET_CURRENT_TASK', payload: state.currentTaskIndex + 1 });
    }
  };

  const previousTask = () => {
    if (state.currentTaskIndex > 0) {
      dispatch({ type: 'SET_CURRENT_TASK', payload: state.currentTaskIndex - 1 });
    }
  };

  const getCurrentTaskType = () => {
    return currentTask?.type || null;
  };

  const startChatSession = (taskId: string) => {
    if (state.participantId) {
      dispatch({ 
        type: 'START_CHAT_SESSION', 
        payload: { taskId, participantId: state.participantId } 
      });
    }
  };

  const endChatSession = () => {
    dispatch({ 
      type: 'END_CHAT_SESSION', 
      payload: { taskId: currentTask?.id || '', endTime: new Date() } 
    });
  };

  const getCurrentSessionDuration = () => {
    if (!state.currentChatSession?.startTime) return 0;
    const now = new Date();
    return Math.floor((now.getTime() - state.currentChatSession.startTime.getTime()) / 1000);
  };

  const getTotalStudyTime = () => {
    if (!state.studyStartTime) return 0;
    const now = new Date();
    return Math.floor((now.getTime() - state.studyStartTime.getTime()) / 1000);
  };

  const value: StudyContextType = {
    state,
    dispatch,
    currentTask,
    isStudyComplete,
    progress,
    nextTask,
    previousTask,
    getCurrentTaskType,
    startChatSession,
    endChatSession,
    getCurrentSessionDuration,
    getTotalStudyTime,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
} 