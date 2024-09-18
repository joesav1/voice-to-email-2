// src/components/Navbar.tsx
'use client';

import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';

export default function Navbar() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Optionally, redirect or update the UI after sign-out
  };

  return (
    <nav className="p-4 bg-gray-200 flex justify-between">
      <div>
        <Link href="/" className="mr-4 font-semibold">
          Home
        </Link>
        {session && (
          <Link href="/topics" className="mr-4 font-semibold">
            Topics
          </Link>
        )}
      </div>
      <div>
        {session ? (
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link href="/signin" className="mr-4 font-semibold">
              Sign In
            </Link>
            <Link href="/signup" className="font-semibold">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
