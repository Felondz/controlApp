import { useState, useEffect, useCallback } from 'react';
import { getCurrencySymbol, shouldShowDecimals, getCurrencyLocale } from '@/Utils/currencyHelpers';

/**
 * Currency-aware input that formats values with thousand separators on blur
 * and shows the currency symbol as prefix.
 *
 * @param {string|number} value - Numeric value (in currency units, NOT cents)
 * @param {Function} onChange - Called with event-like { target: { value } }
 * @param {string} currency - ISO 4217 code
 */
export default function CurrencyInput({
    value = '',
    onChange,
    currency = 'COP',
    id,
    className = '',
    placeholder,
    disabled = false,
}) {
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const showDecimals = shouldShowDecimals(currency);
    const decimals = showDecimals ? 2 : 0;
    const symbol = getCurrencySymbol(currency);
    const locale = getCurrencyLocale(currency);

    const formatNumber = useCallback((val) => {
        if (val === '' || val === null || val === undefined) return '';
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(num)) return '';
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num);
    }, [locale, decimals]);

    // Sync display when value/currency changes and field is not focused
    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(formatNumber(value));
        }
    }, [value, currency, isFocused, formatNumber]);

    const handleFocus = (e) => {
        setIsFocused(true);
        // Show raw value for editing
        const raw = value?.toString() || '';
        setDisplayValue(raw);
        setTimeout(() => e.target.select(), 0);
    };

    const handleBlur = () => {
        setIsFocused(false);
        const num = parseFloat(displayValue);
        if (!isNaN(num) && displayValue.trim() !== '') {
            const clean = showDecimals ? num.toFixed(2) : String(Math.round(num));
            if (onChange) onChange({ target: { value: clean } });
            setDisplayValue(formatNumber(num));
        } else {
            if (onChange) onChange({ target: { value: '' } });
            setDisplayValue('');
        }
    };

    const handleChange = (e) => {
        const input = e.target.value;
        // Allow digits, one dot, and optional leading minus
        if (input === '' || /^-?\d*\.?\d*$/.test(input)) {
            setDisplayValue(input);
            if (onChange) onChange({ target: { value: input } });
        }
    };

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-medium pointer-events-none select-none z-10">
                {symbol}
            </span>
            <input
                id={id}
                type="text"
                inputMode="decimal"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder || (showDecimals ? '0.00' : '0')}
                disabled={disabled}
                className={`pl-8 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ${className}`}
            />
        </div>
    );
}
