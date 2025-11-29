import { MinusIcon, PlusIcon } from '@/Components/Icons';

export default function QuantityInput({
    value,
    onChange,
    min = 0,
    max = Infinity,
    step = 1,
    label = null,
    className = ''
}) {
    const decrease = () => {
        if (value - step >= min) {
            onChange(value - step);
        }
    };

    const increase = () => {
        if (value + step <= max) {
            onChange(value + step);
        }
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <div className="relative flex items-center group">
                <button
                    type="button"
                    onClick={decrease}
                    disabled={value <= min}
                    className="absolute left-2 p-1.5 rounded-lg text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
                >
                    <MinusIcon className="w-4 h-4" />
                </button>

                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    min={min}
                    max={max}
                    step={step}
                    className="w-full text-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 px-10 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none"
                />

                <button
                    type="button"
                    onClick={increase}
                    disabled={value >= max}
                    className="absolute right-2 p-1.5 rounded-lg text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
