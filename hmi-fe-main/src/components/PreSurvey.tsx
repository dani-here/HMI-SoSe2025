"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, AlertCircle } from "lucide-react";
import {
  Participant
} from "@/types/study";

// Form data interface without zod
interface PreSurveyFormData {
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

interface PreSurveyProps {
  onSubmit: (participant: Omit<Participant, "id" | "createdAt">) => void;
  isLoading?: boolean;
}

export default function PreSurvey({
  onSubmit,
  isLoading = false,
}: PreSurveyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<PreSurveyFormData>>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
    getValues,
  } = useForm<PreSurveyFormData>({
    mode: "onChange",
  });

  const watchedValues = watch();

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          watchedValues.firstName &&
          watchedValues.lastName &&
          watchedValues.email &&
          watchedValues.matriculationNumber
        );
      case 2:
        return watchedValues.age && watchedValues.gender;
      case 3:
        return (
          Boolean(watchedValues.hasPreviousLLMExperience) &&
          Boolean(watchedValues.llmUsageFrequency) &&
          Boolean(watchedValues.promptConfidence) &&
          Boolean(watchedValues.hasProgrammingExperience)
        );
      default:
        return false;
    }
  };

  const handleStepSubmit = async (data: Partial<PreSurveyFormData>) => {
    setFormData({ ...formData, ...data });

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalData = { ...formData, ...data } as PreSurveyFormData;
      onSubmit(finalData);
    }
  };

  const handleNext = async () => {
    // Validate only the current step's fields
    let fieldsToValidate: (keyof PreSurveyFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "firstName",
          "lastName",
          "email",
          "matriculationNumber",
        ];
        break;
      case 2:
        fieldsToValidate = ["age", "gender"];
        break;
      case 3:
        fieldsToValidate = [
          "hasPreviousLLMExperience",
          "llmUsageFrequency",
          "promptConfidence",
          "hasProgrammingExperience",
        ];
        break;
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      const currentStepData: Partial<PreSurveyFormData> = {};
      const processedValues = getValues();

      fieldsToValidate.forEach((field) => {
        const value = processedValues[field];
        if (value !== undefined && value !== "") {
          // Handle type conversion for specific fields
          if (
            field === "hasPreviousLLMExperience" ||
            field === "hasProgrammingExperience"
          ) {
            (currentStepData as any)[field] = value === "true";
          } else if (
            field === "promptConfidence" ||
            field === "age" ||
            field === "gender" ||
            field === "llmUsageFrequency" ||
            field === "matriculationNumber"
          ) {
            (currentStepData as any)[field] = parseInt(value as string);
          } else {
            currentStepData[field] = value as any;
          }
        }
      });

      handleStepSubmit(currentStepData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold claude-text">Basic Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name *
        </label>
        <input
          type="text"
          {...register("firstName", { required: "First name is required" })}
          className="claude-input w-full px-3 py-2 claude-text"
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name *
        </label>
        <input
          type="text"
          {...register("lastName", { required: "Last name is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="Enter your last name"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2 ">
          University Email Address *
        </label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
          className="claude-input w-full px-3 py-2 claude-text"
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Matriculation Number *
        </label>
        <input
          type="number"
          {...register("matriculationNumber", {
            required: "Matriculation number is required",
            valueAsNumber: true,
          })}
          className="claude-input w-full px-3 py-2 claude-text"
          placeholder="Enter your matriculation number"
        />
        {errors.matriculationNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.matriculationNumber.message}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold claude-text">Demographics</h2>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Age *
        </label>
        <input
          type="number"
          {...register("age", {
            required: "Age is required",
            valueAsNumber: true,
            min: { value: 18, message: "Must be at least 18 years old" },
            max: { value: 100, message: "Please enter a valid age" },
          })}
          className="claude-input w-full px-3 py-2 claude-text"
          placeholder="Enter your age"
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Gender *
        </label>
        <select
          {...register("gender", {
            required: "Please select your gender",
            valueAsNumber: true,
          })}
          className="claude-input w-full px-3 py-2 claude-text"
        >
          <option value="">Select gender</option>
          <option value={1}>Male</option>
          <option value={2}>Female</option>
          <option value={3}>Non-binary</option>
          <option value={4}>Prefer not to say</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold claude-text">AI Experience</h2>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Do you have previous experience with Large Language Models (LLMs) like
          ChatGPT, Claude, etc.? *
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="true"
              {...register("hasPreviousLLMExperience", {
                required: "Please select an option",
                setValueAs: (value) => value === "true",
              })}
              className="mr-2 text-primary"
            />
            <span className="claude-text">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="false"
              {...register("hasPreviousLLMExperience", {
                required: "Please select an option",
                setValueAs: (value) => value === "true",
              })}
              className="mr-2 text-primary"
            />
            <span className="claude-text">No</span>
          </label>
        </div>
        {errors.hasPreviousLLMExperience && (
          <p className="text-red-500 text-sm mt-1">
            {errors.hasPreviousLLMExperience.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          How often do you use LLMs? *
        </label>
        <select
          {...register("llmUsageFrequency", {
            required: "Please select your LLM usage frequency",
            valueAsNumber: true,
          })}
          className="claude-input w-full px-3 py-2 claude-text"
        >
          <option value="">Select frequency</option>
          <option value={1}>Never</option>
          <option value={2}>Rarely (once a month)</option>
          <option value={3}>Occasionally (few times a month)</option>
          <option value={4}>Regularly (few times a week)</option>
          <option value={5}>Daily</option>
        </select>
        {errors.llmUsageFrequency && (
          <p className="text-red-500 text-sm mt-1">
            {errors.llmUsageFrequency.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          How would you rate your confidence in writing effective prompts? *
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label
              key={rating}
              className={`flex flex-col items-center p-2 border rounded cursor-pointer hover:claude-secondary claude-text transition-colors ${
                Number(watchedValues.promptConfidence) === rating
                  ? "border-primary claude-secondary"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                value={rating}
                {...register("promptConfidence", {
                  required: "Please select your confidence level",
                  setValueAs: (value) => parseInt(value),
                })}
                className="sr-only"
              />
              <span className="text-lg font-semibold">{rating}</span>
              <span className="text-xs text-muted">
                {rating === 1
                  ? "Not confident"
                  : rating === 5
                  ? "Very confident"
                  : ""}
              </span>
            </label>
          ))}
        </div>
        {errors.promptConfidence && (
          <p className="text-red-500 text-sm mt-1">
            {errors.promptConfidence.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Do you have programming experience? *
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="true"
              {...register("hasProgrammingExperience", {
                required: "Please select an option",
                setValueAs: (value) => value === "true",
              })}
              className="mr-2 text-primary"
            />
            <span className="claude-text">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="false"
              {...register("hasProgrammingExperience", {
                required: "Please select an option",
                setValueAs: (value) => value === "true",
              })}
              className="mr-2 text-primary"
            />
            <span className="claude-text">No</span>
          </label>
        </div>
        {errors.hasProgrammingExperience && (
          <p className="text-red-500 text-sm mt-1">
            {errors.hasProgrammingExperience.message}
          </p>
        )}
      </div>
    </div>
  );

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted">
          Step {currentStep} of 3
        </span>
        <span className="text-sm text-muted">
          {Math.round((currentStep / 3) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen claude-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="claude-card shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold claude-text mb-2">
              Pre-Study Survey
            </h1>
            <p className="text-muted">
              Please provide some information about yourself to help us
              understand your background.
            </p>
          </div>

          {renderProgressBar()}

          <div className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-2 text-muted border border-border rounded-md hover:claude-secondary"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading || !isCurrentStepValid()}
                className="ml-auto px-6 py-2 claude-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : currentStep < 3 ? (
                  <>
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
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
      </div>
    </div>
  );
}
