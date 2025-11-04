// Loading Spinner Component
// Task: T064-T065 - Implement LoadingSpinner component

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`animate-spin rounded-full border-blue-600 border-t-transparent dark:border-blue-400 ${sizeClasses[size]}`}
                role="status"
                aria-label="Loading"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}
