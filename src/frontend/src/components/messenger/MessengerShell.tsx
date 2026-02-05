import { useState } from 'react';
import ConversationList from './ConversationList';
import MessagePane from './MessagePane';
import UserIdentityBadge from '../auth/UserIdentityBadge';
import type { ConversationId } from '../../backend';

export default function MessengerShell() {
  const [selectedConversationId, setSelectedConversationId] = useState<ConversationId | null>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card px-4 py-2 flex items-center justify-end">
        <UserIdentityBadge />
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <ConversationList 
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
        <MessagePane 
          conversationId={selectedConversationId}
        />
      </div>
    </div>
  );
}
