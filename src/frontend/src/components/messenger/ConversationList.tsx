import { useGetConversations } from '../../hooks/useQueries';
import { useGetUserProfile } from '../../hooks/useCurrentUser';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import NewChatForm from './NewChatForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';
import type { ConversationId, Preview } from '../../backend';

interface ConversationListProps {
  selectedConversationId: ConversationId | null;
  onSelectConversation: (id: ConversationId) => void;
}

export default function ConversationList({ selectedConversationId, onSelectConversation }: ConversationListProps) {
  const { data: conversations, isLoading, error } = useGetConversations();

  return (
    <div className="w-full sm:w-80 lg:w-96 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Chats</h2>
        <NewChatForm onConversationCreated={onSelectConversation} />
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive text-sm">
            Failed to load conversations
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground text-sm">No conversations yet</p>
            <p className="text-muted-foreground text-xs">Start a new chat to get started</p>
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.conversationId.toString()}
                conversation={conv}
                isSelected={selectedConversationId?.toString() === conv.conversationId.toString()}
                onSelect={() => onSelectConversation(conv.conversationId)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Preview;
  isSelected: boolean;
  onSelect: () => void;
}

function ConversationItem({ conversation, isSelected, onSelect }: ConversationItemProps) {
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString() || '';
  
  // We need to get the other participant's info from the conversation
  // For now, we'll show the conversation ID as a placeholder
  const displayName = `Chat ${conversation.conversationId}`;
  
  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 rounded-lg text-left transition-colors ${
        isSelected 
          ? 'bg-accent text-accent-foreground' 
          : 'hover:bg-muted'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <p className="font-medium text-sm truncate">{displayName}</p>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatTime(conversation.lastActivity)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage || 'No messages yet'}
          </p>
        </div>
      </div>
    </button>
  );
}
