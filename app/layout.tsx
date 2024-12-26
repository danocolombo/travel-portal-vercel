import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import NavBar from '@/components/navbar/NavBar';
// import { Toaster } from '@/components/ui/toaster';
import Providers from '@/app/providers';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
// import {
//     ClerkProvider,
//     SignInButton,
//     SignedIn,
//     SignedOut,
//     UserButton,
// } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'HomeAway',
    description: 'Feel at home, away from home.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang='en' suppressHydrationWarning>
                <body className={inter.className}>
                    <Providers>
                        <NavBar />
                        <main className='container py-10'>{children}</main>
                        <Toaster />
                    </Providers>
                </body>
            </html>
        </ClerkProvider>
    );
}
