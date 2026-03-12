'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const [workspaceSlug, setWorkspaceSlug] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE ?? 'default'
  );
  const [chatKey, setChatKey] = useState(0);

  function handleWorkspaceChange(slug: string) {
    setWorkspaceSlug(slug);
    setChatKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col h-screen page-glow">
      <Header
        workspaceSlug={workspaceSlug}
        onWorkspaceChange={handleWorkspaceChange}
        onNewChat={() => setChatKey((k) => k + 1)}
      />
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-3xl mx-auto">
          <ChatInterface key={`${workspaceSlug}-${chatKey}`} workspaceSlug={workspaceSlug} />
        </div>
      </main>
    </div>
  );
}
