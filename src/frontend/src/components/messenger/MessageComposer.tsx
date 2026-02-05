import { useState } from 'react';
import { useSendMessage } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import type { ConversationId } from '../../backend';

interface MessageComposerProps {
  conversationId: ConversationId;
}

export default function MessageComposer({ conversationId }: MessageComposerProps) {
  const [text, setText] = useState('');
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error('Please enter a message');
      return;
    }

    sendMessage(
      { conversationId, text: text.trim() },
      {
        onSuccess: () => {
          setText('');
        },
        onError: (error) => {
          toast.error(`Failed to send message: ${error.message}`);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4">
      <div className="flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isPending}
          className="resize-none min-h-[60px] max-h-[120px]"
          rows={2}
        />
        <Button 
          type="submit" 
          disabled={isPending || !text.trim()}
          size="icon"
          className="h-[60px] w-[60px] flex-shrink-0"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
