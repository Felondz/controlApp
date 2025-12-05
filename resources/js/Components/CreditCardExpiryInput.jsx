import { useState, useEffect, useRef } from 'react';

export default function CreditCardExpiryInput({
    value = '',
    onChange,
    className = '',
    required = false,
    id
}) {
    // value format expected: "YYYY-MM" (e.g., "2028-12")

    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const yearInputRef = useRef(null);
    const monthInputRef = useRef(null);

    useEffect(() => {
        if (value && value.includes('-')) {
            const [y, m] = value.split('-');
            setYear(y.substring(2)); // "2028" -> "28"
            setMonth(m);
        } else if (!value) {
            setMonth('');
            setYear('');
        }
    }, [value]);

    const handleMonthChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) val = val.substring(0, 2);

        setMonth(val);

        // Auto-advance logic
        if (val.length === 2) {
            if (parseInt(val) > 12) val = '12'; // Basic clamping
            if (parseInt(val) === 0) val = '01';

            // Update state with clamped value if needed, but for UX let's just focus next
            // If we clamp here, we need to setMonth(val) again.

            yearInputRef.current?.focus();
        }

        updateParent(val, year);
    };

    const handleYearChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) val = val.substring(0, 2);
        setYear(val);
        updateParent(month, val);
    };

    const handleKeyDown = (e, field) => {
        if (e.key === 'Backspace' && field === 'year' && year === '') {
            monthInputRef.current?.focus();
        }
    };

    const updateParent = (m, y) => {
        let monthToSend = m;
        if (m.length === 1 && parseInt(m) > 0) {
            monthToSend = `0${m}`;
        }

        if (monthToSend.length === 2 && y.length === 2) {
            // Assume 20xx for simplicity as credit cards are usually near future
            // If user enters "99", it's 2099.
            onChange({ target: { value: `20${y}-${monthToSend}`, id } });
        } else {
            // Incomplete date, send empty
            onChange({ target: { value: '', id } });
        }
    };

    // Styles matching TextInput.jsx but applied to the container
    const containerBaseStyles = 'flex items-center border rounded-md shadow-sm transition duration-200 ease-in-out w-full overflow-hidden';
    const containerLightStyles = 'bg-secondary-50 border-secondary-300 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-opacity-50';
    const containerDarkStyles = 'dark:bg-secondary-700 dark:border-secondary-500 dark:focus-within:border-primary-500 dark:focus-within:ring-primary-500';

    // Transparent inputs inside
    const inputStyles = 'w-1/2 border-none bg-transparent focus:ring-0 p-2 text-center text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-300';

    return (
        <div className={`${containerBaseStyles} ${containerLightStyles} ${containerDarkStyles} ${className}`}>
            <input
                id={id}
                ref={monthInputRef}
                type="text"
                placeholder="MM"
                value={month}
                onChange={handleMonthChange}
                className={inputStyles}
                maxLength={2}
                aria-label="Mes de vencimiento"
            />
            <span className="text-secondary-400 dark:text-secondary-300 font-bold">/</span>
            <input
                ref={yearInputRef}
                type="text"
                placeholder="YY"
                value={year}
                onChange={handleYearChange}
                onKeyDown={(e) => handleKeyDown(e, 'year')}
                className={inputStyles}
                maxLength={2}
                aria-label="Año de vencimiento"
            />
        </div>
    );
}
