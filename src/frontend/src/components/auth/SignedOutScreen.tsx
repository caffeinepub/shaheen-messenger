import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function SignedOutScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex items-center justify-center min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-md w-full mx-4 text-center space-y-8">
        <div className="space-y-4">
          <img 
            src="/assets/generated/shaheen-logo.dim_512x512.png" 
            alt="Shaheen Messenger" 
            className="h-32 w-32 mx-auto object-contain"
          />
          <h2 className="text-3xl font-bold text-foreground">Welcome to Shaheen Messenger</h2>
          <p className="text-muted-foreground text-lg">
            Secure, private messaging powered by the Internet Computer
          </p>
        </div>
        
        <Button 
          onClick={login} 
          disabled={isLoggingIn}
          size="lg"
          className="w-full max-w-xs mx-auto"
        >
          {isLoggingIn ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-5 w-5" />
              Sign in with Internet Identity
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          By signing in, you agree to use this service responsibly
        </p>
      </div>
    </div>
  );
}
