"use client";

import React, { useState, useRef, useEffect } from "react";
import parse from "html-react-parser";
import { marked } from "marked";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    messages: number;
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(
    null,
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load sessions on mount
  useEffect(() => {
    void loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      void loadSessionMessages(currentSessionId);
    } else {
      setMessages([
        {
          role: "assistant",
          content:
            "Hello! I'm your AI assistant. I can help you manage your Google Calendar and Gmail. What would you like to do?",
        },
      ]);
    }
  }, [currentSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const loadSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const response = await fetch("/api/chat/sessions");
      if (response.ok) {
        const data = (await response.json()) as { sessions: ChatSession[] };
        setSessions(data.sessions);
        // Auto-select first session if available
        if (data.sessions.length > 0 && !currentSessionId) {
          setCurrentSessionId(data.sessions[0]!.id);
        }
      }
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadSessionMessages = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`);
      if (response.ok) {
        const data = (await response.json()) as {
          session: {
            messages: Array<{
              role: string;
              content: string;
            }>;
          };
        };
        const loadedMessages = data.session.messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));
        setMessages(loadedMessages);
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });
      if (response.ok) {
        const data = (await response.json()) as { session: ChatSession };
        await loadSessions();
        setCurrentSessionId(data.session.id);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to create session", error);
    }
  };

  const deleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await loadSessions();
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Failed to delete session", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: currentSessionId ?? undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = (await response.json()) as {
        message: string;
        sessionId: number;
      };
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update session ID if this was a new session
      if (!currentSessionId && data.sessionId) {
        setCurrentSessionId(data.sessionId);
        void loadSessions();
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-12 gap-0 bg-white">
      {/* Chat Area - 9 columns */}
      <div className="col-span-9 flex h-full flex-col border-r border-gray-200">
        {/* Messages Container - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300/50">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How can I help you today?
                  </h3>
                  <p className="text-sm text-gray-500 leading-6">
                    I can help you manage your Google Calendar and Gmail. Try asking about your schedule, emails, or creating new events.
                  </p>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300/50">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4.5 w-4.5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              )}
                <div
                  className={`max-w-[85%] rounded-2xl ${
                    message.role === "user"
                      ? "bg-black text-white px-3.5 py-2.5"
                      : "bg-white border border-gray-200 px-4 py-3 shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {message.role === "assistant" ? (
                      <div className="text-[15px] leading-6 text-gray-900 [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_p]:leading-6 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_em]:italic [&_em]:text-gray-700 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-gray-900 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-1.5 [&_h2]:mt-3 [&_h2]:text-gray-900 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-gray-900 [&_ul]:my-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ol]:my-2 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_li]:leading-6 [&_li]:pl-0.5 [&_li]:text-gray-800 [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-700 [&_a]:decoration-blue-600/40 [&_a:hover]:decoration-blue-700/60 [&_a]:underline-offset-2 [&_a]:transition-colors [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:text-gray-800 [&_pre]:bg-gray-50 [&_pre]:border [&_pre]:border-gray-200 [&_pre]:rounded-lg [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-3">
                        {(() => {
                          // Sanitize content to prevent email addresses from being interpreted as HTML tags
                          const sanitizeHtml = (html: string): string => {
                            // Escape email addresses that might be interpreted as tags
                            // Pattern: <email@domain.com> - this is the problematic pattern
                            // We need to escape angle brackets around email addresses
                            return html
                              // Escape opening tags with email addresses: <email@domain.com> or <email@domain.com attr="value">
                              .replace(
                                /<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})([^>]*?)>/g,
                                (match, email, attrs) => {
                                  // Escape the entire opening tag
                                  return `&lt;${email}${attrs}&gt;`;
                                }
                              )
                              // Escape closing tags with email addresses: </email@domain.com>
                              .replace(
                                /<\/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/g,
                                (match, email) => {
                                  // Escape the closing tag
                                  return `&lt;/${email}&gt;`;
                                }
                              )
                              // Escape self-closing tags: <email@domain.com />
                              .replace(
                                /<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})([^>]*?)\s*\/>/g,
                                (match, email, attrs) => {
                                  // Escape the self-closing tag
                                  return `&lt;${email}${attrs} /&gt;`;
                                }
                              );
                          };

                          // Check if content is already HTML (contains HTML tags)
                          const hasHtmlTags = /<[a-z][\s\S]*>/i.test(message.content);
                          
                          try {
                            if (hasHtmlTags) {
                              // Content is already HTML, sanitize and parse it
                              const sanitized = sanitizeHtml(message.content);
                              return parse(sanitized);
                            } else {
                              // Content might be markdown, convert it to HTML first
                              const htmlContent = marked.parse(message.content, {
                                breaks: true,
                                gfm: true,
                              });
                              // Convert markdown links to HTML with target="_blank"
                              const processedHtml = (htmlContent as string).replace(
                                /<a href="([^"]+)">([^<]+)<\/a>/g,
                                '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
                              );
                              // Sanitize the processed HTML
                              const sanitized = sanitizeHtml(processedHtml);
                              return parse(sanitized);
                            }
                          } catch (error) {
                            // If parsing fails, return plain text as fallback
                            console.error('HTML parsing error:', error);
                            return <span>{message.content}</span>;
                          }
                        })()}
                      </div>
                    ) : (
                      <div className="text-[15px] leading-6 text-white">
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black border border-gray-800">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4.5 w-4.5 text-white"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300/50">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4.5 w-4.5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div className="rounded-2xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Container - Fixed at bottom */}
        <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                rows={1}
                className="w-full resize-none rounded-2xl border border-gray-300 bg-white px-5 py-3.5 pr-14 text-[15px] leading-6 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0 transition-colors shadow-sm"
                style={{ minHeight: "56px", maxHeight: "200px" }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white transition-all hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                )}
              </button>
            </form>
            <p className="mt-3 text-center text-xs text-gray-400">
              AI can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>

      {/* History Sidebar - 3 columns */}
      <div className="col-span-3 flex h-full flex-col bg-white">
        {/* Sidebar Header - Fixed */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Chat History</h2>
          <button
            onClick={createNewSession}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white transition hover:bg-gray-800"
            title="New Chat"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {/* Sessions List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingSessions ? (
            <div className="flex items-center justify-center p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No chat history yet. Start a conversation!
            </div>
          ) : (
            <div className="p-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`group relative mb-1 cursor-pointer rounded-lg px-3 py-2 transition ${
                    currentSessionId === session.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {session.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(session.updatedAt)} ·{" "}
                        {session._count.messages} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-red-600 group-hover:opacity-100"
                      title="Delete"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
