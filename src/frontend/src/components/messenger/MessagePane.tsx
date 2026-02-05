import { useEffect, useRef } from 'react';
import { useGetConversationMessages } from '../../hooks/useQueries';
import ConversationHeader from './ConversationHeader';
import MessageThread from './MessageThread';
import MessageComposer from './MessageComposer';
import EmptyStates from './EmptyStates';
import type { ConversationId } from '../../backend';

interface MessagePaneProps {
  conversationId: ConversationId | null;
}

export default function MessagePane({ conversationId }: MessagePaneProps) {
  const { data: messages, isLoading, refetch } = useGetConversationMessages(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversationId) {
    return <EmptyStates.NoConversationSelected />;
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <ConversationHeader 
        conversationId={conversationId}
        onRefresh={refetch}
      />
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !messages || messages.length === 0 ? (
          <EmptyStates.NoMessages />
        ) : (
          <MessageThread messages={messages} />
        )}
      </div>

      <MessageComposer conversationId={conversationId} />
    </div>
  );
}
