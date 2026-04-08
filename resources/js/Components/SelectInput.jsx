import { forwardRef, useRef, useEffect } from 'react';

export default forwardRef(function SelectInput({ className = '', isFocused = false, options = [], children, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={
                'w-full min-w-0 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm ' +
                className
            }
            ref={input}
        >
            {options.length > 0
                ? options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))
                : children}
        </select>
    );
});
