"use client";

import { Play, Clock, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

interface StudyBriefingProps {
  onStart: () => void;
}

export default function StudyBriefing({ onStart }: StudyBriefingProps) {
  return (
    <div className="min-h-screen claude-bg flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="claude-card shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold claude-text mb-2">
              Study Briefing
            </h1>
            <p className="text-muted">
              Welcome! Let&apos;s go through what you&apos;ll be doing in this study.
            </p>
          </div>

          <div className="space-y-8">
            {/* Overview */}
            <div className="claude-secondary rounded-lg p-6">
              <h2 className="text-xl font-semibold claude-text mb-4">
                What You&apos;ll Be Doing
              </h2>
              <p className="text-muted mb-4">
                You will complete 4 different tasks using an AI language model.
                Each task is designed to test different types of interactions
                with AI. You&apos;ll interact with the AI through a chat interface,
                and we&apos;ll ask for your feedback after each task.
              </p>
            </div>

            {/* Task Types */}
            <div>
              <h2 className="text-xl font-semibold claude-text mb-4">
                Task Types
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold claude-text mb-2">
                    Labeling Tasks
                  </h3>
                  <ul className="text-sm text-muted space-y-1">
                    <li>
                      • Spam detection: Classify emails as spam or not spam
                    </li>
                    <li>
                      • Sentiment analysis: Analyze the sentiment of reviews
                    </li>
                  </ul>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold claude-text mb-2">
                    Analytical Tasks
                  </h3>
                  <ul className="text-sm text-muted space-y-1">
                    <li>
                      • Text summarization: Summarize articles in 3 sentences
                    </li>
                    <li>
                      • Pro/con analysis: List advantages and disadvantages
                    </li>
                  </ul>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold claude-text mb-2">
                    Creative Tasks
                  </h3>
                  <ul className="text-sm text-muted space-y-1">
                    <li>• Story writing: Create engaging story openings</li>
                    <li>• Social media: Write tweets for product launches</li>
                  </ul>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold claude-text mb-2">
                    Procedural Tasks
                  </h3>
                  <ul className="text-sm text-muted space-y-1">
                    <li>• Programming: Write code using recursion</li>
                    <li>
                      • Logic puzzles: Solve step-by-step reasoning problems
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interface Instructions */}
            <div>
              <h2 className="text-xl font-semibold claude-text mb-4">
                How to Use the Interface
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium claude-text">Timer</h3>
                    <p className="text-sm text-muted">
                      A timer shows how long you&apos;ve been working on the current task.
                      You can take as much time as you need to complete each task.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium claude-text">Chat Interface</h3>
                    <p className="text-sm text-muted">
                      Type your messages in the chat box at the bottom. The AI
                      will respond to help you complete the task. You&apos;ll need to
                      have at least one conversation with the AI to proceed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex space-x-1 mt-1">
                    <ThumbsUp className="w-6 h-6 text-green-600" />
                    <ThumbsDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium claude-text">
                      Feedback Buttons
                    </h3>
                    <p className="text-sm text-muted">
                      Use the thumbs up/down buttons to rate each AI response.
                      You must rate each response before sending your next message.
                      This helps us understand what works well.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold claude-text mb-4">
                Important Notes
              </h2>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>
                    You must rate each AI response (thumbs up/down) before
                    sending your next message
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>
                    You need to complete at least one conversation with the AI
                    before you can proceed to the next task
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>
                    Take your time to understand each task before starting
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>
                    Be honest in your feedback - there are no right or wrong
                    answers
                  </span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold claude-text mb-4">
                Tips for Success
              </h2>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Be specific in your requests to the AI</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    If the AI&apos;s response isn&apos;t helpful, try rephrasing your
                    question
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>
                    Don&apos;t worry about getting perfect results - focus on the
                    interaction process
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Remember to rate each AI response and provide feedback after each task</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onStart}
              className="claude-primary px-8 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start the Study</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
