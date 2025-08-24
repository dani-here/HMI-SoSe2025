import apiClient from "@/lib/api";
import {
  Participant, TaskFeedback,
  StudySession, ChatResponse,
  ApiResponse,
  ParticipantRegistrationRequest,
  ParticipantRegistrationResponse,
  TaskSurveyRequest,
  FinalSurveyRequest,
  ChatRequest,
  ChatApiResponse,
  LLMFeedbackDto,
  FeedbackResponse
} from "@/types/study";

export const studyService = {
  // Participant management
  async createParticipant(
    participant: Omit<Participant, "id" | "createdAt">
  ): Promise<ParticipantRegistrationResponse> {
    try {
      const registrationData: ParticipantRegistrationRequest = {
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        matriculationNumber: participant.matriculationNumber,
        age: participant.age,
        gender: participant.gender,
        hasPreviousLLMExperience: participant.hasPreviousLLMExperience,
        llmUsageFrequency: participant.llmUsageFrequency,
        promptConfidence: participant.promptConfidence,
        hasProgrammingExperience: participant.hasProgrammingExperience,
      };

      console.log("Sending registration request:", registrationData);
      const response = await apiClient.post<ParticipantRegistrationResponse>(
        "/api/Participants/register",
        registrationData
      );
      console.log("Registration API response:", response.data);

      if (!response.data) {
        throw new Error(response.data || "Registration failed");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating participant:", error);
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error("Registration failed: Unknown error");
    }
  },

  // Chat functionality
  async sendMessage(
    message: string,
    taskId: string,
    participantId: string,
    model: string = "gpt-4o"
  ): Promise<ChatResponse> {
    try {
      const chatRequest: ChatRequest = {
        participantId,
        prompt: message,
        taskId,
      };

      console.log("Sending chat request:", chatRequest);

      // Override timeout for this specific request to 5 minutes
      const response = await apiClient.post<ChatApiResponse>(
        "/api/LLM/gpt",
        chatRequest,
        {
          timeout: 300000, // 5 minutes (300 seconds)
        }
      );

      console.log("Chat API response:", response.data);

      if (!response.data) {
        throw new Error("Chat response is empty");
      }

      // Log response time for monitoring
      console.log(`Chat response received in ${response.data.durationMs}ms`);

      // Map the API response to the expected ChatResponse format
      return {
        message: response.data.response,
        taskId: taskId,
        participantId: participantId,
        logId: response.data.id, // Include logId in the response
      };
    } catch (error) {
      console.error("Error sending chat message:", error);

      // Handle specific error types
      if (error instanceof Error) {
        if (
          error.message.includes("timeout") ||
          error.message.includes("ECONNABORTED")
        ) {
          throw new Error(
            "The AI is taking longer than expected to respond. Please try again."
          );
        } else if (error.message.includes("Network Error")) {
          throw new Error(
            "Network connection issue. Please check your internet connection and try again."
          );
        } else if (error.message.includes("500")) {
          throw new Error("Server error. Please try again in a moment.");
        } else {
          throw new Error(`Chat failed: ${error.message}`);
        }
      }
      throw new Error("Chat failed: Unknown error");
    }
  },

  // Feedback functionality
  async submitFeedback(feedback: LLMFeedbackDto): Promise<FeedbackResponse> {
    try {
      console.log("Submitting feedback:", feedback);
      const response = await apiClient.post<FeedbackResponse>(
        "/api/LLM/feedback",
        feedback
      );
      console.log("Feedback response:", response.data);

      if (!response.data) {
        throw new Error("Feedback response is empty");
      }

      return response.data;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error instanceof Error) {
        throw new Error(`Feedback submission failed: ${error.message}`);
      }
      throw new Error("Feedback submission failed: Unknown error");
    }
  },

  // Task Survey
  async submitTaskSurvey(survey: TaskSurveyRequest): Promise<void> {
    try {
      console.log("Submitting task survey:", survey);
      const response = await apiClient.post<ApiResponse<void>>(
        "/api/Survey/task",
        survey
      );
      console.log("Task survey response:", response.data);

      if (response.status !== 200) {
        throw new Error(
          response.status.toString() || "Task survey submission failed"
        );
      }
    } catch (error) {
      console.error("Error submitting task survey:", error);
      if (error instanceof Error) {
        throw new Error(`Task survey submission failed: ${error.message}`);
      }
      throw new Error("Task survey submission failed: Unknown error");
    }
  },

  // Final survey
  async submitFinalSurvey(survey: FinalSurveyRequest): Promise<void> {
    try {
      console.log("Submitting final survey:", survey);
      const response = await apiClient.post<ApiResponse<void>>(
        "/api/Survey/final",
        survey
      );
      console.log("Final survey response:", response.data);

      if (response.status !== 200) {
        throw new Error(response.status.toString());
      }
    } catch (error) {
      console.error("Error submitting final survey:", error);
      if (error instanceof Error) {
        throw new Error(`Final survey submission failed: ${error.message}`);
      }
      throw new Error("Final survey submission failed: Unknown error");
    }
  },


  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get("/health");
      return true;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  },
};
