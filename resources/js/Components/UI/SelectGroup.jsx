export default function SelectGroup({
    label,
    value,
    onChange,
    options,
    className = '',
    id,
    ...props
}) {
    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`w-full bg-white dark:bg-gray-900 border rounded-xl px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${props.error
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {/* Render error message if provided */}
            {props.error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {props.error}
                </p>
            )}
        </div>
    );
}
