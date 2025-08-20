import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/QueryProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppHeader } from '@/components/AppHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rick & Morty Explorer',
  description: 'Explore characters from the Rick and Morty universe',
  keywords: ['Rick and Morty', 'characters', 'API', 'React', 'Next.js'],
  authors: [{ name: 'Rick & Morty Explorer' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider>
          <ErrorBoundary>
            <QueryProvider>
              <div className="min-h-screen flex flex-col">
                {/* Header - now inside ThemeProvider */}
                <AppHeader />

                {/* Main Content */}
                <main className="flex-1">
                  {children}
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        Built with{' '}
                        <a
                          href="https://rickandmortyapi.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Rick and Morty API
                        </a>{' '}
                        • Made with Next.js & React Query
                      </p>
                    </div>
                  </div>
                </footer>
              </div>
            </QueryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}