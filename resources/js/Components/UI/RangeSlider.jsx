import { useGlobalTheme } from '@/Contexts/GlobalThemeContext';

export default function RangeSlider({
    min,
    max,
    step,
    value,
    onChange,
    className = ''
}) {
    const { theme } = useGlobalTheme();

    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600 dark:accent-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${className}`}
        />
    );
}
