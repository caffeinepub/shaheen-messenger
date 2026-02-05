import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Message } from '../../backend';

interface MessageThreadProps {
  messages: Message[];
}

export default function MessageThread({ messages }: MessageThreadProps) {
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString() || '';

  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => {
        const isOwn = message.author.toString() === currentPrincipal;
        const time = new Date(Number(message.timestamp) / 1000000);
        
        return (
          <div
            key={message.id.toString()}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isOwn
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
              </div>
              <span className="text-xs text-muted-foreground px-2">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
