"use client";

import { useState } from "react";
import { useStudy } from "@/context/StudyContext";
import { studyService } from "@/services/studyService";
import {
  Participant,
  ChatMessage,
  TaskSurveyRequest,
  FinalSurveyRequest,
} from "@/types/study";
import LandingPage from "@/components/LandingPage";
import PreSurvey from "@/components/PreSurvey";
import ConsentForm from "@/components/ConsentForm";
import StudyBriefing from "@/components/StudyBriefing";
import ChatInterface from "@/components/ChatInterface";
import TaskFeedback from "@/components/TaskFeedback";
import FinalSurvey from "@/components/FinalSurvey";
import { Toaster, toast } from "react-hot-toast";

type StudyStep =
  | "landing"
  | "pre-survey"
  | "consent"
  | "briefing"
  | "task"
  | "task-feedback"
  | "final-survey"
  | "completed";

export default function StudyPage() {
  const {
    state,
    dispatch,
    currentTask,
    startChatSession,
    endChatSession,
    getTotalStudyTime,
  } = useStudy();

  const [currentStep, setCurrentStep] = useState<StudyStep>("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [surveyStartTime, setSurveyStartTime] = useState<Date | null>(null);

  // Handle landing page start
  const handleStartStudy = () => {
    setCurrentStep("consent");
  };

  // Handle pre-survey submission
  const handlePreSurveySubmit = async (
    participantData: Omit<Participant, "id" | "createdAt">
  ) => {
    setIsLoading(true);
    try {
      const registrationResponse = await studyService.createParticipant(
        participantData
      );

      // Store participant data and registration response
      dispatch({ type: "SET_PARTICIPANT", payload: participantData });
      dispatch({
        type: "SET_REGISTRATION_RESPONSE",
        payload: registrationResponse,
      });

      setCurrentStep("briefing");
    } catch (error) {
      toast.error("Failed to submit survey. Please try again.");
      console.error("Error submitting pre-survey:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle consent submission
  const handleConsentSubmit = async (consentGiven: boolean) => {
    if (!consentGiven) {
      toast.error("You must provide consent to participate in this study.");
      return;
    }

    setIsLoading(true);
    try {
      dispatch({ type: "SET_CONSENT", payload: true });
      setCurrentStep("pre-survey");
    } catch (error) {
      toast.error("Failed to submit consent. Please try again.");
      console.error("Error submitting consent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle briefing start
  const handleBriefingStart = () => {
    // Set study start time when briefing starts
    dispatch({ type: "SET_STUDY_START_TIME", payload: new Date() });
    setCurrentStep("task");
    setMessages([]);

    // Start the first chat session
    if (currentTask) {
      startChatSession(currentTask.id);
    }
  };

  // Handle chat message send
  const handleSendMessage = async (message: string) => {
    if (!state.participantId || !currentTask) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });

    setIsLoading(true);
    try {
      const response = await studyService.sendMessage(
        message,
        currentTask.id,
        state.participantId
      );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: response.message,
        timestamp: new Date(),
        logId: response.logId, // Store the logId from the response
      };

      setMessages((prev) => [...prev, assistantMessage]);
      dispatch({ type: "ADD_MESSAGE", payload: assistantMessage });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle message rating
  const handleRateMessage = async (
    messageId: string,
    rating: "up" | "down"
  ) => {
    // Find the message to get its logId
    const message = messages.find((msg) => msg.id === messageId);
    if (!message || !message.logId) {
      console.error("Message not found or missing logId:", messageId);
      return;
    }

    // Update UI immediately for better UX
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, [rating === "up" ? "thumbsUp" : "thumbsDown"]: true }
          : msg
      )
    );

    // Submit feedback to API
    try {
      await studyService.submitFeedback({
        logId: message.logId,
        thumbsUp: rating === "up",
      });
      console.log("Feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Revert UI change if feedback submission failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                [rating === "up" ? "thumbsUp" : "thumbsDown"]: undefined,
              }
            : msg
        )
      );
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  // Handle time up - now manual
  const handleTimeUp = () => {
    // End the current chat session
    endChatSession();

    // Start survey timer
    setSurveyStartTime(new Date());
    setCurrentStep("task-feedback");
  };

  // Handle manual next button
  const handleNextTask = () => {
    handleTimeUp();
  };

  // Handle skip chat button
  const handleSkipChat = () => {
    handleTimeUp();
  };

  // Calculate total chat time from all completed sessions
  const getTotalChatTime = () => {
    return state.chatSessions.reduce(
      (total, session) => total + session.duration,
      0
    );
  };

  // Handle task feedback submission
  const handleTaskFeedbackSubmit = async (
    feedback: Omit<TaskSurveyRequest, "id">
  ) => {
    if (!state.participantId || !currentTask || !state.participant) return;

    setIsLoading(true);
    try {
      // Get the duration of the current task's chat session
      const currentChatSession = state.chatSessions.find(
        (session) => session.taskId === currentTask.id
      );
      const chatSessionDuration = currentChatSession
        ? currentChatSession.duration
        : 0;

      // Calculate survey duration (time spent on the survey form)
      const surveyDuration = surveyStartTime
        ? `${Math.floor(
            (new Date().getTime() - surveyStartTime.getTime()) / 1000
          )}`
        : "0";

      // Submit task survey with chat session duration
      await studyService.submitTaskSurvey({
        id: crypto.randomUUID(), // Generate a unique ID
        participantId: state.participantId,
        taskType: currentTask.type,
        finalOutputSatisfaction: feedback.finalOutputSatisfaction,
        llmOutputAccuracy: feedback.llmOutputAccuracy,
        requiredPromptRevisionsForAccuracy:
          feedback.requiredPromptRevisionsForAccuracy,
        finalOutputSatisfactory: feedback.finalOutputSatisfactory,
        wouldUseCurrentLLMOutputInRealWorld:
          feedback.wouldUseCurrentLLMOutputInRealWorld,
        poorLLMOutputRemarks: feedback.poorLLMOutputRemarks,
        participantTaskSurveyJSON: feedback.participantTaskSurveyJSON,
        surveyDuration: `${chatSessionDuration}`, // Use chat session duration instead of survey duration
      });

      // Move to next task or final survey
      const nextTaskIndex = state.currentTaskIndex + 1;
      if (nextTaskIndex < state.tasks.length) {
        dispatch({ type: "SET_CURRENT_TASK", payload: nextTaskIndex });
        setMessages([]);
        setSurveyStartTime(null);

        // Start new chat session for next task
        const nextTask = state.tasks[nextTaskIndex];
        if (nextTask) {
          startChatSession(nextTask.id);
        }

        setCurrentStep("task");
      } else {
        // All tasks completed, move to final survey
        setSurveyStartTime(new Date());
        setCurrentStep("final-survey");
      }
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
      console.error("Error submitting task feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle final survey submission
  const handleFinalSurveySubmit = async (
    survey: Omit<
      FinalSurveyRequest,
      "id" | "completionDate" | "finalSurveyJSON"
    >
  ) => {
    if (!state.participantId || !state.participant) return;

    setIsLoading(true);
    try {
      // Calculate survey duration (time spent on final survey form)
      const surveyDuration = surveyStartTime
        ? `${Math.floor(
            (new Date().getTime() - surveyStartTime.getTime()) / 1000
          )}s`
        : "0s";

      // Calculate total study time from all chat sessions
      const totalChatTime = getTotalChatTime();
      const totalStudyTime = `${totalChatTime}`;

      // Submit final survey
      await studyService.submitFinalSurvey({
        id: crypto.randomUUID(), // Generate a unique ID
        participantId: state.participantId,
        overallTaskThoughts: survey.overallTaskThoughts,
        llmExperienceDescription: survey.llmExperienceDescription,
        helpfulUnhelpfulMoments: survey.helpfulUnhelpfulMoments,
        confusingOrUnrealisticTasks: survey.confusingOrUnrealisticTasks,
        llmExpectationVariance: survey.llmExpectationVariance,
        suggestedImprovements: survey.suggestedImprovements,
        surprisingLLMBehavior: survey.surprisingLLMBehavior,
        feedbackProcessRating: survey.feedbackProcessRating,
        foundFeedbackRepetitive: survey.foundFeedbackRepetitive,
        foundFeedbackHelpful: survey.foundFeedbackHelpful,
        completionDate: new Date().toISOString(),
        surveyDuration: survey.surveyDuration,
        totalStudyTime: totalStudyTime, // Use total chat time from all sessions
        finalSurveyJSON: JSON.stringify(survey),
        additionalComments: survey.additionalComments,
      });

      setCurrentStep("completed");
    } catch (error) {
      toast.error("Failed to submit final survey. Please try again.");
      console.error("Error submitting final survey:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case "landing":
        return <LandingPage onStart={handleStartStudy} />;

      case "pre-survey":
        return (
          <PreSurvey onSubmit={handlePreSurveySubmit} isLoading={isLoading} />
        );

      case "consent":
        return <ConsentForm onConsent={handleConsentSubmit} />;

      case "briefing":
        return <StudyBriefing onStart={handleBriefingStart} />;

      case "task":
        if (!currentTask) return <div>Loading task...</div>;
        return (
          <div className="h-screen flex flex-col">
            <ChatInterface
              tasks={state.tasks}
              currentTaskIndex={state.currentTaskIndex}
              task={currentTask}
              messages={messages}
              onSendMessage={handleSendMessage}
              onRateMessage={handleRateMessage}
              onNext={handleNextTask}
              onSkip={handleSkipChat}
              isLoading={isLoading}
            />
          </div>
        );

      case "task-feedback":
        if (!currentTask || !state.participant)
          return <div>Loading feedback...</div>;

        // Get the duration of the current task's chat session
        const currentChatSession = state.chatSessions.find(
          (session) => session.taskId === currentTask.id
        );
        const chatSessionDuration = currentChatSession
          ? currentChatSession.duration
          : 0;

        return (
          <div className="h-screen flex flex-col">
            <TaskFeedback
              taskTitle={currentTask.name}
              taskType={currentTask.type}
              participant={state.participant}
              participantId={state.participantId!}
              surveyDuration={`${chatSessionDuration}`} // Display chat session duration
              tasks={state.tasks}
              currentTaskIndex={state.currentTaskIndex}
              onSubmit={handleTaskFeedbackSubmit}
              isLoading={isLoading}
            />
          </div>
        );

      case "final-survey":
        if (!state.participant) return <div>Loading final survey...</div>;

        // Calculate total chat time from all sessions
        const totalChatTime = getTotalChatTime();

        return (
          <FinalSurvey
            participant={state.participant}
            participantId={state.participantId!}
            surveyDuration={
              surveyStartTime
                ? `${Math.floor(
                    (new Date().getTime() - surveyStartTime.getTime()) / 1000
                  )}`
                : "0"
            }
            totalStudyTime={`${totalChatTime}`} // Use total chat time from all sessions
            onSubmit={handleFinalSurveySubmit}
            isLoading={isLoading}
          />
        );

      case "completed":
        return (
          <div className="min-h-screen claude-bg flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
              <div className="claude-card shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold claude-text mb-4">
                  Study Completed!
                </h1>
                <p className="text-muted mb-6">
                  Thank you for participating in our study. Your responses will
                  help us improve AI language models and make them more useful
                  for everyone.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">
                    Your participation certificate will be sent to your email
                    within a few days.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Contact Information
                  </h3>
                  <p className="text-blue-700 text-sm mb-3">
                    If you have any questions about this study or need
                    assistance, please contact our research team:
                  </p>
                  <div className="space-y-1">
                    <p className="text-blue-800 font-medium">
                      Hamza Asaad: hamza.asaad@stud.fra-uas.de
                    </p>
                    <p className="text-blue-800 font-medium">
                      Muhammad Hamza Laghari: muhammad.laghari@stud.fra-uas.de
                    </p>
                    <p className="text-blue-800 font-medium">
                      Danish Ali: danish.ali@stud.fra-uas.de
                    </p>
                    <p className="text-blue-800 font-medium">
                      Muhammad Furqan Shafique:
                      muhammad.shafique@stud.fra-uas.de
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    You may now close this window. Your data has been saved
                    securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {renderCurrentStep()}
    </>
  );
}
