# API Integration Documentation

## Overview
This document describes the API integration for the HMI Frontend application, including participant registration, chat functionality, and survey submissions.

## Base Configuration
The API base URL is configured in `src/config/env.ts`:
- Development: `http://localhost:3001` (default)
- Production: Set via `NEXT_PUBLIC_API_URL` environment variable

## API Endpoints

### 1. Participant Registration
**Endpoint:** `POST /api/Participants/register`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "matriculationNumber": 0,
  "age": 0,
  "gender": 0,
  "hasPreviousLLMExperience": true,
  "llmUsageFrequency": 1,
  "promptConfidence": 1,
  "hasProgrammingExperience": true
}
```

**Response:**
```json
{
  "participantId": "string",
  "participantNumber": 0,
  "taskSequence": ["string"],
  "taskList": [...]
}
```

### 2. Chat API
**Endpoint:** `POST /api/LLM/gpt`

**Request Body:**
```json
{
  "participantId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "prompt": "string",
  "taskId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "model": "string"
}
```

**Response:**
```json
{
  "response": "string",
  "durationMs": 0
}
```

### 3. Task Survey
**Endpoint:** `POST /api/Survey/task`

**Request Body:**
```json
{
  "id": "string",
  "participantId": "string",
  "participant": {...},
  "taskType": "string",
  "finalOutputSatisfaction": 0,
  "llmOutputAccuracy": 0,
  "requiredPromptRevisionsForAccuracy": 0,
  "finalOutputSatisfactory": true,
  "wouldUseCurrentLLMOutputInRealWorld": true,
  "poorLLMOutputRemarks": "string",
  "participantTaskSurveyJSON": "string",
  "surveyDuration": "string"
}
```

### 4. Final Survey
**Endpoint:** `POST /api/Survey/final`

**Request Body:**
```json
{
  "id": "string",
  "participantId": "string",
  "participant": {...},
  "overallTaskThoughts": "string",
  "llmExperienceDescription": "string",
  "helpfulUnhelpfulMoments": "string",
  "confusingOrUnrealisticTasks": "string",
  "llmExpectationVariance": "string",
  "suggestedImprovements": "string",
  "surprisingLLMBehavior": "string",
  "feedbackProcessRating": 0,
  "foundFeedbackRepetitive": true,
  "foundFeedbackHelpful": true,
  "completionDate": "string",
  "surveyDuration": "string",
  "totalStudyTime": "string",
  "finalSurveyJSON": "string",
  "additionalComments": "string"
}
```

## Implementation Details

### Chat Integration
The chat functionality is implemented in `src/services/studyService.ts`:

```typescript
async sendMessage(message: string, taskId: string, participantId: string, model: string = 'gpt-4', timeoutMs: number = 60000): Promise<ChatResponse>
```

**Usage:**
```typescript
const response = await studyService.sendMessage(
  "Hello, can you help me with this task?",
  "task-123",
  "participant-456",
  "gpt-4"
);
```

### Response Time Handling
The chat API includes comprehensive response time management:

- **Default Timeout**: 2 minutes (120 seconds) for all API requests
- **Chat Timeout**: 5 minutes (300 seconds) for LLM chat requests
- **Survey Timeout**: 2 minutes (120 seconds) for survey submissions
- **Loading Indicators**: Visual feedback during API calls
- **Typing Indicator**: Shows "AI is thinking..." with animated dots
- **Toast Notifications**: Loading and error messages
- **Response Time Logging**: Monitors `durationMs` from API response

**Timeout Configuration:**
All API requests use a 2-minute timeout by default. However, individual requests can override this:

```typescript
// Chat requests use 5-minute timeout
const response = await apiClient.post('/api/LLM/gpt', data, {
  timeout: 300000 // 5 minutes
});

// Survey submissions use 2-minute timeout
const response = await apiClient.post('/api/Survey/task', data, {
  timeout: 120000 // 2 minutes
});
```

### Error Handling
All API calls include comprehensive error handling with:
- Detailed error logging
- User-friendly error messages
- Graceful fallbacks
- Specific handling for:
  - Timeout errors
  - Network errors
  - Server errors (500)
  - Empty responses

### Testing
A test method is available to verify chat API functionality:
```typescript
const isWorking = await studyService.testChatAPI(participantId, taskId);
```

## Data Flow

1. **Registration:** User completes pre-survey → Participant registered via `/api/Participants/register`
2. **Chat:** User interacts with LLM → Messages sent via `/api/LLM/gpt`
3. **Task Feedback:** After each task → Survey submitted via `/api/Survey/task`
4. **Final Survey:** Study completion → Final survey via `/api/Survey/final`

## Environment Setup

### Development
```bash
# Set API URL (optional, defaults to localhost:3001)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Production
```bash
# Set production API URL
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors:** Ensure backend allows requests from frontend domain
2. **Network Errors:** Check API base URL configuration
3. **Authentication:** Verify if API requires authentication headers
4. **Rate Limiting:** Implement retry logic for rate-limited requests
5. **Timeout Errors:** Check if backend is responding within expected timeframes

### Timeout Issues

If you're experiencing "exceeding response time" errors:

1. **Check Backend Performance:**
   - Verify your API endpoints are responding within 2 minutes
   - Check server logs for slow queries or processing
   - Monitor API response times

2. **Adjust Timeout Settings:**
   - The current timeout is set to 2 minutes (120 seconds) for all requests
   - If your API consistently takes longer, consider optimizing the backend
   - For development, you can temporarily increase the timeout in `src/lib/api.ts`

3. **Debug Steps:**
   - Check browser console for detailed error messages
   - Monitor network tab for request/response times
   - Verify API endpoints are accessible and responding

### Debug Mode
Enable detailed logging by checking browser console for:
- API request/response logs
- Error details
- Chat message flow
- Response time monitoring

## Security Considerations

- All API calls use HTTPS in production
- Sensitive data is not logged in production
- Input validation on both frontend and backend
- Error messages don't expose sensitive information 