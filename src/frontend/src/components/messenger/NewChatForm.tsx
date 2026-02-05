import { useState } from 'react';
import { useGetOrCreateConversation } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { ConversationId } from '../../backend';

interface NewChatFormProps {
  onConversationCreated: (id: ConversationId) => void;
}

export default function NewChatForm({ onConversationCreated }: NewChatFormProps) {
  const [principal, setPrincipal] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: createConversation, isPending } = useGetOrCreateConversation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!principal.trim()) {
      toast.error('Please enter a principal ID');
      return;
    }

    createConversation(principal.trim(), {
      onSuccess: (conversationId) => {
        toast.success('Conversation opened');
        setPrincipal('');
        setIsExpanded(false);
        onConversationCreated(conversationId);
      },
      onError: (error) => {
        toast.error(`Failed to create conversation: ${error.message}`);
      },
    });
  };

  if (!isExpanded) {
    return (
      <Button 
        onClick={() => setIsExpanded(true)} 
        className="w-full"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Chat
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="text"
        placeholder="Enter principal ID"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
        disabled={isPending}
        autoFocus
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} size="sm" className="flex-1">
          {isPending ? 'Creating...' : 'Start Chat'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => {
            setIsExpanded(false);
            setPrincipal('');
          }}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
