# AI Interaction Study Frontend

A comprehensive Next.js application for conducting research on human-AI interaction patterns. This application facilitates a structured study where participants interact with AI language models across different task types.

## Features

### Study Flow
- **Landing Page**: Introduces the study and participant expectations
- **Pre-Survey**: Collects participant demographics and AI experience
- **Consent Form**: Informed consent with checkbox verification
- **Study Briefing**: Explains tasks and interface usage
- **Task Interface**: Time-boxed AI interactions with feedback collection
- **Task Feedback**: Post-task evaluation forms
- **Final Survey**: Comprehensive qualitative feedback

### Task Types
1. **Labeling Tasks**
   - Spam detection: Classify emails as spam or not spam
   - Sentiment analysis: Analyze review sentiment

2. **Analytical Tasks**
   - Text summarization: Summarize articles in 3 sentences
   - Pro/con analysis: List advantages and disadvantages

3. **Creative Tasks**
   - Story writing: Create engaging story openings
   - Social media: Write tweets for product launches

4. **Procedural Tasks**
   - Programming: Write code using recursion
   - Logic puzzles: Solve step-by-step reasoning problems

### Key Features
- **Timer System**: 5-minute time limit per task with visual warnings
- **Message Rating**: Thumbs up/down feedback for each AI response
- **Progress Tracking**: Visual progress indicators throughout the study
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error handling with user feedback
- **Data Validation**: Form validation using React Hook Form

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with built-in validation
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with StudyProvider
│   ├── page.tsx            # Redirects to study
│   └── study/
│       └── page.tsx        # Main study orchestration
├── components/
│   ├── LandingPage.tsx     # Study introduction
│   ├── PreSurvey.tsx       # Participant information collection
│   ├── ConsentForm.tsx     # Informed consent
│   ├── StudyBriefing.tsx   # Task instructions
│   ├── ChatInterface.tsx   # AI interaction interface
│   ├── TaskFeedback.tsx    # Post-task feedback
│   └── FinalSurvey.tsx     # End-of-study survey
├── context/
│   └── StudyContext.tsx    # Global study state management
├── services/
│   ├── api.ts              # Base API service
│   └── studyService.ts     # Study-specific API calls
├── types/
│   └── study.ts            # TypeScript interfaces and types
└── lib/
    └── api.ts              # Axios client configuration
```

## API Integration

The application is designed to work with a backend API that provides:

### Endpoints
- `POST /participants` - Create participant
- `POST /consent` - Submit consent
- `POST /chat` - Send messages to AI
- `POST /task-feedback` - Submit task feedback
- `POST /final-survey` - Submit final survey
- `POST /study-completion` - Mark study as complete

### Data Flow
1. Participant data is collected and stored
2. Consent is tracked and verified
3. Chat messages are sent to AI backend
4. Task feedback is collected and stored
5. Final survey responses are saved
6. Study completion is recorded

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd hmi-fe

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Study Configuration

### Task Content
Tasks are defined in `src/types/study.ts` under `TASK_CONTENT`. Each task includes:
- Title and description
- Content/prompt for the AI
- Time limit (default: 5 minutes)

### Customization
To modify the study:
1. Update task content in `TASK_CONTENT`
2. Modify forms in respective components
3. Adjust timing in `ChatInterface.tsx`
4. Update consent form content in `ConsentForm.tsx`

## Data Collection

The application collects:
- **Participant Demographics**: Age, gender, education, etc.
- **AI Experience**: Previous LLM usage, confidence levels
- **Interaction Data**: Chat messages, response ratings
- **Task Feedback**: Satisfaction, accuracy, revision counts
- **Qualitative Feedback**: Open-ended responses

## Security & Privacy

- All data is anonymized
- No personally identifiable information is stored
- HTTPS encryption for data transmission
- Secure API endpoints with proper authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions about this study application, please contact:
- **Technical Issues**: [Your Contact]
- **Study Design**: [Researcher Contact]
- **IRB Concerns**: [IRB Contact]
