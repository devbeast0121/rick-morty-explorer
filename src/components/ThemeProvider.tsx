'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        try {
            const savedTheme = localStorage.getItem('theme') as Theme;
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

            setTheme(savedTheme || systemTheme);
        } catch (error) {
            // Fallback to light theme if localStorage is not available
            setTheme('light');
        }
        setMounted(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (mounted) {
            try {
                const root = document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(theme);
                localStorage.setItem('theme', theme);
            } catch (error) {
                // Silently fail if localStorage is not available
                console.warn('Could not save theme preference');
            }
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Return children with light theme as default during SSR
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={!mounted ? 'light' : ''}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        // Return a default theme object during SSR or when provider is missing
        return { theme: 'light' as Theme, toggleTheme: () => { } };
    }
    return context;
}