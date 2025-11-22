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

    const lightStyles = 'bg-gray-50 text-gray-900 ' +
        'border-gray-300 focus:border-indigo-600 focus:ring-indigo-500 ' +
        'placeholder-gray-400 ';

    const darkStyles = 'dark:bg-gray-700 dark:text-gray-100 ' +
        'dark:border-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500 ' +
        'dark:placeholder-gray-300 ';

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
