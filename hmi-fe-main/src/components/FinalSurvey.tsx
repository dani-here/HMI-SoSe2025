"use client";

import { useForm } from "react-hook-form";
import { Check, AlertCircle } from "lucide-react";
import { FinalSurveyRequest, Participant } from "@/types/study";

// Form data interface without zod
interface FinalSurveyFormData {
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
  additionalComments?: string;
}

interface FinalSurveyProps {
  participant: Participant;
  participantId: string;
  surveyDuration: string;
  totalStudyTime: string;
  onSubmit: (
    survey: Omit<
      FinalSurveyRequest,
      "id" | "completionDate" | "finalSurveyJSON"
    >
  ) => void;
  isLoading?: boolean;
}

export default function FinalSurvey({
  participant,
  participantId,
  surveyDuration,
  totalStudyTime,
  onSubmit,
  isLoading = false,
}: FinalSurveyProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FinalSurveyFormData>({
    mode: "onChange",
  });

  const watchedValues = watch();

  const convertStringToBoolean = (value: string) => {
    return value === "true";
  };

  const handleFormSubmit = (data: FinalSurveyFormData) => {
    const surveyData: Omit<
      FinalSurveyRequest,
      "id" | "completionDate" | "finalSurveyJSON"
    > = {
      participantId,
      overallTaskThoughts: data.overallTaskThoughts,
      llmExperienceDescription: data.llmExperienceDescription,
      helpfulUnhelpfulMoments: data.helpfulUnhelpfulMoments,
      confusingOrUnrealisticTasks: data.confusingOrUnrealisticTasks,
      llmExpectationVariance: data.llmExpectationVariance,
      suggestedImprovements: data.suggestedImprovements,
      surprisingLLMBehavior: data.surprisingLLMBehavior,
      feedbackProcessRating: Number(data.feedbackProcessRating),
      foundFeedbackRepetitive: convertStringToBoolean(
        data.foundFeedbackRepetitive as unknown as string
      ),
      foundFeedbackHelpful: convertStringToBoolean(
        data.foundFeedbackHelpful as unknown as string
      ),
      surveyDuration,
      totalStudyTime,
      // finalSurveyJSON: JSON.stringify(data),
      additionalComments: data.additionalComments || "",
    };

    onSubmit(surveyData);
  };

  const renderTextArea = (
    name: keyof FinalSurveyFormData,
    question: string,
    placeholder: string,
    rows: number = 4,
    required: boolean = true
  ) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-muted">
        {question} {!required && "(Optional)"}
      </label>
      <textarea
        {...register(
          name,
          required
            ? {
                required: "This field is required",
                minLength: {
                  value: 10,
                  message: "Please provide at least 10 characters",
                },
              }
            : {}
        )}
        rows={rows}
        className="claude-input w-full px-3 py-2 claude-text"
        placeholder={placeholder}
      />
      {errors[name as keyof typeof errors] && (
        <p className="text-red-500 text-sm">
          {errors[name as keyof typeof errors]?.message}
        </p>
      )}
    </div>
  );

  const renderRatingQuestion = (
    name: keyof FinalSurveyFormData,
    question: string,
    labels: string[]
  ) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {question}
      </label>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <label
            key={rating}
            className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              Number(watchedValues[name]) === rating
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
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
            <span className="text-lg font-semibold text-gray-900">
              {rating}
            </span>
            <span className="text-xs text-gray-500 text-center mt-1">
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
    name: keyof FinalSurveyFormData,
    question: string
  ) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {question}
      </label>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            value="true"
            {...register(name as any, {
              required: "Please select an option",
              setValueAs: (value) => value === "true",
            })}
            className="mr-2"
          />
          Yes
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="false"
            {...register(name as any, {
              required: "Please select an option",
              setValueAs: (value) => value === "true",
            })}
            className="mr-2"
          />
          No
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
    <div className="min-h-screen claude-bg flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="claude-card shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold claude-text mb-2">
              Final Survey
            </h1>
            <p className="text-muted mb-4">
              Thank you for participating in our study! Please share your
              thoughts about your experience.
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm text-muted">
              <div className="flex items-center space-x-2">
                <span>Total Chat Time:</span>
                <span className="font-mono font-semibold text-primary">{totalStudyTime}s</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Survey Time:</span>
                <span className="font-mono font-semibold text-primary">{surveyDuration}s</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Overall Task Thoughts */}
            {renderTextArea(
              "overallTaskThoughts",
              "What did you think about the tasks overall?",
              "Share your general impressions of the tasks you completed...",
              4
            )}

            {/* LLM Experience Description */}
            {renderTextArea(
              "llmExperienceDescription",
              "How would you describe your experience using the LLM assistant during the study?",
              "Describe what it was like to work with the AI assistant...",
              4
            )}

            {/* Helpful/Unhelpful Moments */}
            {renderTextArea(
              "helpfulUnhelpfulMoments",
              "Was there any moment you felt the LLM was particularly helpful or unhelpful? Please elaborate.",
              "Think about specific interactions where the AI was especially useful or frustrating...",
              4
            )}

            {/* Confusing or Unrealistic Tasks */}
            {renderTextArea(
              "confusingOrUnrealisticTasks",
              "Did any task feel confusing or unrealistic? If yes, which and why?",
              'If no tasks were confusing, simply write "None" or "No"',
              3
            )}

            {/* LLM Expectation Variance */}
            {renderTextArea(
              "llmExpectationVariance",
              "Were the LLM's responses what you expected? Why or why not?",
              "Compare what you expected from the AI versus what you actually received...",
              4
            )}

            {/* Suggested Improvements */}
            {renderTextArea(
              "suggestedImprovements",
              "What changes would you suggest to improve the LLM's performance or usefulness?",
              "Share your ideas for how the AI could be better...",
              4
            )}

            {/* Surprising LLM Behavior */}
            {renderTextArea(
              "surprisingLLMBehavior",
              "Was there anything surprising (positively or negatively) about how the LLM behaved?",
              "Think about unexpected behaviors or responses from the AI...",
              4
            )}

            {/* Feedback Process Rating */}
            {renderRatingQuestion(
              "feedbackProcessRating",
              "How would you rate the feedback process after each task?",
              ["Very Poor", "Poor", "Neutral", "Good", "Excellent"]
            )}

            {/* Found Feedback Repetitive */}
            {renderBinaryQuestion(
              "foundFeedbackRepetitive",
              "Did you find the feedback process repetitive?"
            )}

            {/* Found Feedback Helpful */}
            {renderBinaryQuestion(
              "foundFeedbackHelpful",
              "Did you find the feedback process helpful?"
            )}

            {/* Additional Comments */}
            {renderTextArea(
              "additionalComments",
              "Any other comments or thoughts you'd like to share?",
              "Feel free to share any additional thoughts, suggestions, or observations...",
              3,
              false
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading || !isValid}
                className="claude-primary px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Complete Study</span>
                  </>
                )}
              </button>
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

          {/* Progress Indicator */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-muted">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Study Completion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
