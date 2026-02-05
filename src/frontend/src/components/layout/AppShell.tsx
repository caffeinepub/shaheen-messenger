import { type ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <img 
            src="/assets/generated/shaheen-logo.dim_512x512.png" 
            alt="Shaheen Messenger" 
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-semibold text-foreground">Shaheen Messenger</h1>
        </div>
      </header>
      <main className="h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
