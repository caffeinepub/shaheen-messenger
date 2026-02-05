import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ProfileSetupDialog() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    saveProfile({ name: name.trim() }, {
      onSuccess: () => {
        toast.success('Profile created successfully!');
      },
      onError: (error) => {
        toast.error(`Failed to create profile: ${error.message}`);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-md w-full mx-4 bg-card border border-border rounded-lg p-8 shadow-lg">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome!</h2>
            <p className="text-muted-foreground">Let's set up your profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Creating profile...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
