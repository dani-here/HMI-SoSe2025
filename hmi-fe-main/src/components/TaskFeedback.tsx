"use client";

import { useForm } from "react-hook-form";
import { Check, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { TaskSurveyRequest, Participant, Task } from "@/types/study";

// Form data interface without zod
interface TaskSurveyFormData {
  finalOutputSatisfaction: number;
  llmOutputAccuracy: number;
  requiredPromptRevisionsForAccuracy: number;
  finalOutputSatisfactory: boolean;
  wouldUseCurrentLLMOutputInRealWorld: boolean;
  poorLLMOutputRemarks?: string;
}

interface TaskFeedbackProps {
  taskTitle: string;
  taskType: string;
  participant: Participant;
  participantId: string;
  surveyDuration: string;
  tasks: Task[];
  currentTaskIndex: number;
  onSubmit: (survey: Omit<TaskSurveyRequest, "id">) => void;
  isLoading?: boolean;
}

export default function TaskFeedback({
  taskTitle,
  taskType,
  participant,
  participantId,
  surveyDuration,
  tasks,
  currentTaskIndex,
  onSubmit,
  isLoading = false,
}: TaskFeedbackProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<TaskSurveyFormData>({
    mode: "onChange",
  });

  const watchedValues = watch();

  const convertStringToBoolean = (value: string) => {
    return value === "true";
  };

  const handleFormSubmit = (data: TaskSurveyFormData) => {
    const surveyData: Omit<TaskSurveyRequest, "id"> = {
      participantId,
      taskType,
      finalOutputSatisfaction: Number(data.finalOutputSatisfaction),
      llmOutputAccuracy: Number(data.llmOutputAccuracy),
      requiredPromptRevisionsForAccuracy: Number(
        data.requiredPromptRevisionsForAccuracy
      ),
      finalOutputSatisfactory: convertStringToBoolean(
        data.finalOutputSatisfactory as unknown as string
      ),
      wouldUseCurrentLLMOutputInRealWorld: convertStringToBoolean(
        data.wouldUseCurrentLLMOutputInRealWorld as unknown as string
      ),
      poorLLMOutputRemarks: data.poorLLMOutputRemarks || "",
      participantTaskSurveyJSON: JSON.stringify(data),
      surveyDuration,
    };

    onSubmit(surveyData);
  };

  const renderRatingQuestion = (
    name: keyof TaskSurveyFormData,
    question: string,
    labels: string[]
  ) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium claude-text">{question}</label>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <label
            key={rating}
            className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              Number(watchedValues[name]) === rating
                ? "border-primary claude-secondary"
                : "border-border hover:border-border"
            }`}
          >
            <input
              type="radio"
              value={rating}
              {...register(name as any, {
                required: "Please select a rating",
                setValueAs: (value) => parseInt(value),
                min: { value: 1, message: "Please select a rating" },
                max: { value: 5, message: "Please select a rating" },
              })}
              className="sr-only"
            />
            <span className="text-lg font-semibold text-primary">
              {rating}
            </span>
            <span className="text-xs text-muted text-center mt-1">
              {labels[rating - 1]}
            </span>
          </label>
        ))}
      </div>
      {errors[name as keyof typeof errors] && (
        <p className="text-red-500 text-sm">
          {errors[name as keyof typeof errors]?.message}
        </p>
      )}
    </div>
  );

  const renderBinaryQuestion = (
    name: keyof TaskSurveyFormData,
    question: string
  ) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium claude-text">{question}</label>
      <div className="grid grid-cols-2 gap-3">
        <label
          className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
            watchedValues[name] === "true"
              ? "border-green-500 bg-green-50"
              : "border-border hover:border-border"
          }`}
        >
          <input
            type="radio"
            value="true"
            {...register(name as any, {
              required: "Please select an option",
            })}
            className="sr-only"
          />
          <span className="font-medium">Yes</span>
        </label>
        <label
          className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
            watchedValues[name] === "false"
              ? "border-red-500 bg-red-50"
              : "border-border hover:border-border"
          }`}
        >
          <input
            type="radio"
            value="false"
            {...register(name as any, {
              required: "Please select an option",
            })}
            className="sr-only"
          />
          <span className="font-medium">No</span>
        </label>
      </div>
      {errors[name as keyof typeof errors] && (
        <p className="text-red-500 text-sm">
          {errors[name as keyof typeof errors]?.message}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Sidebar - Same as ChatInterface */}
      <div className="w-64 bg-claude-secondary border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold claude-text text-lg">Tasks</h3>
          <p className="text-sm text-muted">
            Progress: {currentTaskIndex + 1} of {tasks.length}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {tasks.map((taskItem, index) => (
            <div
              key={taskItem.id}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                index === currentTaskIndex
                  ? "bg-primary text-white"
                  : index < currentTaskIndex
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-white text-muted border border-border hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    index === currentTaskIndex
                      ? "bg-white text-primary"
                      : index < currentTaskIndex
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {index < currentTaskIndex ? "✓" : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm truncate ${
                      index === currentTaskIndex ? "text-white" : "claude-text"
                    }`}
                  >
                    {taskItem.name}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      index === currentTaskIndex
                        ? "text-white opacity-80"
                        : "text-muted"
                    }`}
                  >
                    {taskItem.type}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Feedback Area - Matches ChatInterface layout */}
      <div className="flex-1 flex flex-col claude-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold claude-text">Task Feedback</h2>
            <p className="text-sm text-muted">
              Please provide your feedback on the &quot;{taskTitle}&quot; task
            </p>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg font-semibold">
              Chat: {surveyDuration}s
            </span>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Final Output Satisfaction */}
            {renderRatingQuestion(
              "finalOutputSatisfaction",
              "How satisfied were you with the LLM's final output?",
              ["Not at all", "Slightly", "Moderately", "Very", "Extremely"]
            )}

            {/* LLM Output Accuracy */}
            {renderRatingQuestion(
              "llmOutputAccuracy",
              "How accurate or relevant was the LLM's output?",
              ["Not at all", "Slightly", "Moderately", "Very", "Extremely"]
            )}

            {/* Required Prompt Revisions */}
            {renderRatingQuestion(
              "requiredPromptRevisionsForAccuracy",
              "How many prompt revisions do you feel were necessary to get a good result?",
              ["None", "One", "Two", "Three", "More than three"]
            )}

            {/* Final Output Satisfactory */}
            {renderBinaryQuestion(
              "finalOutputSatisfactory",
              "Was the final output satisfactory for the task?"
            )}

            {/* Would Use In Real World */}
            {renderBinaryQuestion(
              "wouldUseCurrentLLMOutputInRealWorld",
              "Would you use this output in a real-world scenario?"
            )}

            {/* Poor LLM Output Remarks */}
            <div className="space-y-3">
              <label className="block text-sm font-medium claude-text">
                If the output was poor, what did you expect the LLM to do
                better? (Optional)
              </label>
              <textarea
                {...register("poorLLMOutputRemarks")}
                rows={4}
                className="claude-input w-full px-3 py-2 claude-text"
                placeholder="Share your thoughts on how the LLM could have performed better..."
              />
              {errors.poorLLMOutputRemarks && (
                <p className="text-red-500 text-sm">
                  {errors.poorLLMOutputRemarks.message}
                </p>
              )}
            </div>
          </form>

          {Object.keys(errors).length > 0 && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Please fix the following errors:</p>
                <ul className="mt-1 space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>• {error?.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Submit Button */}
        <div className="border-t border-border p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted">
              Task {currentTaskIndex + 1} of {tasks.length}
            </div>
            <button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isLoading || !isValid}
              className="claude-primary px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Feedback</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
