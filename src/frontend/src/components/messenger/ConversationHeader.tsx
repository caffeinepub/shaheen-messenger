import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import type { ConversationId } from '../../backend';

interface ConversationHeaderProps {
  conversationId: ConversationId;
  onRefresh: () => void;
}

export default function ConversationHeader({ conversationId, onRefresh }: ConversationHeaderProps) {
  return (
    <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
      <div>
        <h3 className="font-semibold">Chat {conversationId.toString()}</h3>
        <p className="text-xs text-muted-foreground">Active conversation</p>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onRefresh}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
