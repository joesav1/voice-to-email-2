// src/app/layout.tsx

import SupabaseProvider from './supabase-provider';
import Navbar from '../app/components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <Navbar />
          <main>{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
