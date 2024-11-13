'use client';

import { useUserSession } from '@/hooks/useUserSession'; 
import { signInWithGoogle, signOutWithGoogle } from '@/services/firebase/auth';
import { createSession, removeSession } from '@/actions/authActions';

export function Header({ session }: { session: string | null }) {
  const userSessionId = useUserSession(session);

  const handleSignIn = async () => {
    const userUid = await signInWithGoogle();
    if (userUid) {
      await createSession(userUid);
    }
  };

  const handleSignOut = async () => {
    await signOutWithGoogle();
    await removeSession();
  };

  if (!userSessionId) {
    return (
      <header>
        <button onClick={handleSignIn}>Sign In</button>
      </header>
    );
  }

  return (
    <header>
      <button onClick={handleSignOut}>Sign Out</button>
    </header>
  );
}

export default Header;