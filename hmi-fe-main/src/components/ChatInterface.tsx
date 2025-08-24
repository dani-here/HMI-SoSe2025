"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { ChatMessage, Task } from "@/types/study";

interface ChatInterfaceProps {
  task: Task;
  tasks: Task[]; // Add tasks list
  currentTaskIndex: number; // Add current task index
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onRateMessage: (messageId: string, rating: "up" | "down") => Promise<void>;
  onNext: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

export default function ChatInterface({
  task,
  tasks,
  currentTaskIndex,
  messages,
  onSendMessage,
  onRateMessage,
  onNext,
  onSkip,
  isLoading = false,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0); // Count-up timer in seconds
  const [isTyping, setIsTyping] = useState(false); // Show typing indicator
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Timer effect - count up timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show typing indicator when loading
  useEffect(() => {
    setIsTyping(isLoading);
  }, [isLoading]);

  // Check if user can proceed to next task
  const canProceedToNext = () => {
    const hasUserMessage = messages.some((msg) => msg.role === "user");
    const hasAssistantResponse = messages.some(
      (msg) => msg.role === "assistant"
    );
    
    // Check if all assistant messages have feedback
    const assistantMessages = messages.filter(msg => msg.role === "assistant");
    const allAssistantMessagesHaveFeedback = assistantMessages.every(msg => 
      msg.thumbsUp !== undefined || msg.thumbsDown !== undefined
    );
    
    return hasUserMessage && hasAssistantResponse && allAssistantMessagesHaveFeedback;
  };

  // Check if user can send next message (requires feedback on last AI response)
  const canSendNextMessage = () => {
    // If no messages, user can send first message
    if (messages.length === 0) return true;
    
    // Get the last assistant message
    const lastAssistantMessage = messages
      .filter(msg => msg.role === "assistant")
      .pop();
    
    // If no assistant message yet, user can send message
    if (!lastAssistantMessage) return true;
    
    // Check if the last assistant message has feedback (either thumbs up or down)
    return lastAssistantMessage.thumbsUp !== undefined || lastAssistantMessage.thumbsDown !== undefined;
  };

  // Check if there are unrated assistant messages
  const hasUnratedAssistantMessages = () => {
    const assistantMessages = messages.filter(msg => msg.role === "assistant");
    return assistantMessages.some(msg => 
      msg.thumbsUp === undefined && msg.thumbsDown === undefined
    );
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading && canSendNextMessage()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex justify-start">
      <div className="claude-secondary max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <span className="text-sm text-muted">AI is thinking...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Sidebar */}
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col claude-card shadow-lg">
        {/* Header with Timer */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-start space-x-2 justify-between w-full">
            <div className="flex-1">
              <h2 className="text-lg font-semibold claude-text">{task.name}</h2>
              <p className="text-sm text-muted">{task.description}</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg font-semibold">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 border-b border-border p-4 pt-0">
          {task.data && (
            <div className="w-full p-4 bg-gray-50 rounded-md shadow-md overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {task.data.replace(/\\n/g, "\n")}
              </p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted py-8">
              <p>Start the conversation by typing a message below.</p>
              <p className="text-sm mt-2">
                The AI may take a few seconds to respond. Please be patient.
              </p>
              <p className="text-xs mt-3 text-gray-500">
                💡 You&apos;ll need to complete at least one conversation with
                the AI to proceed to the next task.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "claude-primary"
                        : "claude-secondary"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.role === "assistant" && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={async () => await onRateMessage(message.id, "up")}
                            className={`p-1 rounded ${
                              message.thumbsUp
                                ? "text-green-600 bg-green-100"
                                : "text-muted hover:text-green-600 hover:bg-green-50"
                            }`}
                            disabled={message.thumbsUp !== undefined || message.thumbsDown !== undefined}
                            title={
                              message.thumbsUp !== undefined || message.thumbsDown !== undefined
                                ? "Feedback already provided"
                                : "Rate this response as helpful"
                            }
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => await onRateMessage(message.id, "down")}
                            className={`p-1 rounded ${
                              message.thumbsDown
                                ? "text-red-600 bg-red-100"
                                : "text-muted hover:text-red-600 hover:bg-red-50"
                            }`}
                            disabled={message.thumbsUp !== undefined || message.thumbsDown !== undefined}
                            title={
                              message.thumbsUp !== undefined || message.thumbsDown !== undefined
                                ? "Feedback already provided"
                                : "Rate this response as unhelpful"
                            }
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              {!isTyping &&
                messages.some((msg) => msg.role === "user") &&
                !messages.some((msg) => msg.role === "assistant") && (
                  <div className="flex justify-center">
                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Waiting for AI response...
                    </div>
                  </div>
                )}
              {!isTyping && hasUnratedAssistantMessages() && (
                <div className="flex justify-center">
                  <div className="text-xs text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                    ⚠️ Please provide feedback on the AI response before sending your next message
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <form
            onSubmit={handleSubmit}
            className="flex items-stretch space-x-2"
          >
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isLoading
                    ? "Please wait for AI response..."
                    : !canSendNextMessage()
                    ? "Please provide feedback on the AI response first..."
                    : "Type your message here..."
                }
                className="claude-input w-full px-3 py-2 resize-none block"
                rows={2}
                disabled={isLoading || !canSendNextMessage()}
              />
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading || !canSendNextMessage()}
              className="claude-primary px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px]"
              title={
                !canSendNextMessage()
                  ? "Please provide feedback on the AI response before sending your next message"
                  : !inputMessage.trim()
                  ? "Please enter a message"
                  : "Send message"
              }
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>

          <div className="mt-4 flex justify-end">
            {/* Skip to Survey button - commented out for future use */}
            {/* <button
              onClick={onSkip}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip to Survey</span>
            </button> */}

            <button
              onClick={onNext}
              disabled={isLoading || !canProceedToNext()}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              title={
                !canProceedToNext()
                  ? hasUnratedAssistantMessages()
                    ? "Please provide feedback on all AI responses before proceeding"
                    : "Complete at least one conversation with the AI to proceed"
                  : "Proceed to next task"
              }
            >
              <span>Submit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
