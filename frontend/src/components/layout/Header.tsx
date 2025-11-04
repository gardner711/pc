// Header Component with Theme Toggle
// Task: T043-T044, T047-T048 - Implement Header and ThemeToggle

import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

export default function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        D&D 5e Character Creator
                    </h1>
                </Link>

                <nav className="flex items-center space-x-6">
                    <Link
                        to="/characters"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        Characters
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <svg
                                className="h-5 w-5 text-gray-700"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5 text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}
