import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const baseStyles = 'border rounded-md shadow-sm ' +
        'focus:ring-2 focus:ring-opacity-50 ' +
        'transition duration-200 ease-in-out ';

    const lightStyles = 'bg-secondary-50 text-secondary-900 ' +
        'border-secondary-300 focus:border-primary-600 focus:ring-primary-500 ' +
        'placeholder-secondary-400 ';

    const darkStyles = 'dark:bg-secondary-700 dark:text-secondary-100 ' +
        'dark:border-secondary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 ' +
        'dark:placeholder-secondary-300 ';

    return (
        <input
            {...props}
            type={type}
            className={`
                ${baseStyles}
                ${lightStyles}
                ${darkStyles}
                ${className}
            `.trim()}
            ref={localRef}
        />
    );
});
