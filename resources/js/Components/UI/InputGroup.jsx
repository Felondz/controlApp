import { InfoIcon } from '@/Components/Icons';

export default function InputGroup({
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    suffix = null,
    tooltip = null,
    className = ''
}) {
    return (
        <div className={className}>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
                {tooltip && (
                    <div className="group relative">
                        <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-xs text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            {tooltip}
                        </div>
                    </div>
                )}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all pr-8"
                />
                {suffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );
}
