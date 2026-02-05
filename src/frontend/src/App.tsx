import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUser';
import SignedOutScreen from './components/auth/SignedOutScreen';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import MessengerShell from './components/messenger/MessengerShell';
import AppShell from './components/layout/AppShell';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity && loginStatus !== 'logging-in';
  const isInitializing = loginStatus === 'initializing' || (isAuthenticated && profileLoading);

  // Show profile setup only after authentication and profile query is fetched
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <AppShell>
      {isInitializing ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <SignedOutScreen />
      ) : showProfileSetup ? (
        <ProfileSetupDialog />
      ) : (
        <MessengerShell />
      )}
      <Toaster />
    </AppShell>
  );
}
