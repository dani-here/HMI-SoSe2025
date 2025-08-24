"use client";


import { Play, Users, Clock, Brain } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen claude-bg flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="claude-card shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold claude-text mb-3">
              AI Interaction Study
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Help us understand how people interact with AI language models.
              Your participation will contribute to improving AI-human
              collaboration.
            </p>
          </div>

          {/* Study Overview */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center p-3">
              <Clock className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-base mb-1 claude-text">
                Time Commitment
              </h3>
              <p className="text-sm text-muted">Approximately 30-45 minutes</p>
            </div>

            <div className="flex flex-col items-center p-3">
              <Brain className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-base mb-1 claude-text">
                What You&apos;ll Do
              </h3>
              <p className="text-sm text-muted">
                Complete tasks using an AI assistant
              </p>
            </div>

            <div className="flex flex-col items-center p-3">
              <Users className="w-8 h-8 text-primary mb-2" />
              <h3 className="font-semibold text-base mb-1 claude-text">
                Your Privacy
              </h3>
              <p className="text-sm text-muted">
                All data is anonymized and secure
              </p>
            </div>
          </div>

          {/* What to Expect */}
          <div className="claude-secondary rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-3 claude-text">
              What to Expect
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-semibold claude-text mb-2 text-sm">
                  Study Flow:
                </h3>
                <ul className="text-sm text-muted space-y-1">
                  <li>• Brief survey about your background</li>
                  <li>• Informed consent</li>
                  <li>• 4 different AI interaction tasks</li>
                  <li>• Feedback after each task</li>
                  <li>• Final survey about your experience</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold claude-text mb-2 text-sm">
                  Task Types:
                </h3>
                <ul className="text-sm text-muted space-y-1">
                  <li>• Labeling (spam detection, sentiment analysis)</li>
                  <li>• Analytical (summarization, analysis)</li>
                  <li>• Creative (story writing, social media)</li>
                  <li>• Procedural (programming, logic puzzles)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="space-y-3">
            <button
              onClick={onStart}
              className="claude-primary font-semibold py-3 px-6 rounded-lg text-base transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Study</span>
            </button>

            <p className="text-xs text-muted">
              By clicking &quot;Start Study&quot;, you agree to participate in this
              research study.
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted">
              This study is conducted by researchers at Frankfurt University of Applied Sciences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
