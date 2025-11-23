import React from "react";
import ChatInterface from "~/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chat Assistant</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ask me anything about your calendar and emails
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}

