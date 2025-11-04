// Select Component
// Accessible select component with label association

import { SelectHTMLAttributes, useId } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    helperText?: string
    options: Array<{ value: string; label: string }>
    placeholder?: string
}

export default function Select({
    label,
    error,
    helperText,
    options,
    placeholder,
    className = '',
    id: providedId,
    required,
    ...props
}: SelectProps) {
    const generatedId = useId()
    const selectId = providedId || generatedId

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={selectId}
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <select
                id={selectId}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 dark:text-white ${className}`}
                required={required}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
            {helperText && !error && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    )
}
